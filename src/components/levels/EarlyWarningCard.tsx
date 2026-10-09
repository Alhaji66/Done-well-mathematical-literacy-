import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AccountProfile } from '@/context/AccountAuthContext'
import { getSubject } from '@/data/subjects'
import { demoLevelData, demoToday } from '@/data/demoLevels'
import { fetchLevelData } from '@/lib/levelData'
import { earlyWarnings, levelOf, warningWeek, type LevelData } from '@/lib/levels'
import { reasonText } from '@/components/levels/warningText'
import { LevelChip } from '@/components/levels/LevelChip'
import { AlertIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const SHOWN = 4
const DAY = 86_400_000
const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10)

/**
 * "Early warning" for a staff dashboard: how many learners their recent weekly
 * tests, topic tests and monthly checks flag right now. A teacher or HOD sees
 * the first few by name; a principal sees the count in each subject. Either
 * way, Levels is one tap away to act on it.
 */
export function EarlyWarningCard({ data, today, to, named }: { data: LevelData; today: Date; to: string; named: boolean }) {
  const warnings = useMemo(() => earlyWarnings(data.results, {}, today), [data.results, today])
  // The last seven days, counted as the Monday summary to principals and HODs counts its week.
  const week = useMemo(() => warningWeek(data.results, {}, isoDay(today.getTime() - 6 * DAY), isoDay(today.getTime() + DAY)), [data.results, today])
  if (!data.results.some((r) => r.source !== 'sba')) return null
  const className = new Map(data.classes.map((c) => [c.id, c.name]))
  const perSubject = new Map<string, number>()
  for (const w of warnings) perSubject.set(w.subjectId, (perSubject.get(w.subjectId) ?? 0) + 1)

  return (
    <section className={cn('card p-5', warnings.length ? 'border-rose-200' : '')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-bold text-navy-900">
          <AlertIcon className={cn('h-5 w-5', warnings.length ? 'text-rose-600' : 'text-navy-400')} /> Early warning
        </h3>
        <Link to={to} className="text-sm font-semibold text-navy-700 underline-offset-2 hover:underline">
          Open Levels →
        </Link>
      </div>
      <p className="mt-3 flex items-baseline gap-2">
        <span className={cn('text-2xl font-bold tabular-nums', warnings.length ? 'text-rose-700' : 'text-navy-400')}>{warnings.length}</span>
        <span className="text-sm text-navy-600">
          learner{warnings.length === 1 ? '' : 's'} to catch now, from recent weekly tests, topic tests and monthly checks
        </span>
      </p>

      {warnings.length === 0 ? null : named ? (
        <ul className="mt-2 divide-y divide-navy-100">
          {warnings.slice(0, SHOWN).map((w) => (
            <li key={`${w.learnerId}|${w.subjectId}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
              <span className="min-w-[9rem] flex-1">
                <span className="block text-sm font-medium text-navy-900">{data.names.get(w.learnerId) ?? 'Learner'}</span>
                <span className="block text-xs text-navy-500">{(w.classId && className.get(w.classId)) || `Grade ${w.grade}`}</span>
              </span>
              <span className="flex w-full items-center gap-2 sm:w-auto">
                <LevelChip level={levelOf(w.latest.percent)} />
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">{reasonText(w, w.reasons[0])}</span>
              </span>
            </li>
          ))}
          {warnings.length > SHOWN ? (
            <li className="pt-2 text-xs text-navy-500">
              and {warnings.length - SHOWN} more, with catch-up groups to start, in Levels
            </li>
          ) : null}
        </ul>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-2">
          {[...perSubject.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([id, n]) => (
              <li key={id} className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs text-rose-900">
                <span className="font-bold tabular-nums">{n}</span> in {getSubject(id)?.name ?? id}
              </li>
            ))}
        </ul>
      )}

      <p className="mt-3 border-t border-navy-100 pt-3 text-xs text-navy-500">
        Last 7 days: <span className="font-semibold tabular-nums text-navy-800">{week.handedIn}</span> test{week.handedIn === 1 ? '' : 's'} handed in ·{' '}
        <span className={cn('font-semibold tabular-nums', week.flagged ? 'text-rose-700' : 'text-navy-800')}>{week.flagged}</span> flagged ·{' '}
        <span className={cn('font-semibold tabular-nums', week.recovered ? 'text-emerald-700' : 'text-navy-800')}>{week.recovered}</span> back at Level 4 or above
      </p>
    </section>
  )
}

/** The card with live data, for the account dashboards of teachers, HODs and principals. */
export default function EarlyWarning({ profile, to }: { profile: AccountProfile; to: string }) {
  const [data, setData] = useState<LevelData | null>(null)
  const [today] = useState(() => new Date())

  useEffect(() => {
    let live = true
    fetchLevelData(profile).then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [profile])

  return data ? <EarlyWarningCard data={data} today={today} to={to} named={profile.role !== 'school'} /> : null
}

/** The card for the demo dashboards, from the demo's sample classes and tests. */
export function DemoEarlyWarning({ scope, to }: { scope: 'teacher' | 'hod' | 'school'; to: string }) {
  const [data] = useState(() => demoLevelData(scope))
  const [today] = useState(() => demoToday(data))
  return <EarlyWarningCard data={data} today={today} to={to} named={scope !== 'school'} />
}
