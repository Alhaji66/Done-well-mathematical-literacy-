import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { impactBy, impactTotals, signed, type ImpactGroup, type ImpactTotals } from '@/lib/catchUpImpact'
import { TargetIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const pct = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0)
const counted = (groups: ImpactGroup[]) => groups.filter((g) => g.status !== 'cancelled')

function Tile({ value, label, note, tone }: { value: ReactNode; label: string; note?: string; tone?: string }) {
  return (
    <div>
      <p className={cn('text-2xl font-bold tabular-nums', tone ?? 'text-navy-900')}>{value}</p>
      <p className="text-xs text-navy-600">{label}</p>
      {note ? <p className="text-[11px] text-navy-400">{note}</p> : null}
    </div>
  )
}

function Tiles({ t }: { t: ImpactTotals }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Tile value={`${t.measured}/${t.learners}`} label="learners reassessed" note={`in ${t.groups} group${t.groups === 1 ? '' : 's'}`} />
      <Tile
        value={`${pct(t.improved, t.measured)}%`}
        label="improved"
        note={`${t.improved} of ${t.measured}${t.averageChange === null ? '' : `, ${signed(t.averageChange)} points on average`}`}
        tone={t.measured && t.improved * 2 >= t.measured ? 'text-emerald-700' : 'text-navy-900'}
      />
      <Tile value={t.movedUp} label="moved up a CAPS level" tone={t.movedUp ? 'text-emerald-700' : undefined} />
      <Tile
        value={`${t.reached4}/${t.startedBelow4}`}
        label="reached Level 4 from below"
        note="Level 4 is 50%, Adequate"
        tone={t.reached4 ? 'text-emerald-700' : undefined}
      />
    </div>
  )
}

type View = 'topic' | 'teacher' | 'subject'

/**
 * "Are the catch-up groups working?" for the Catch-up groups page: the
 * before-and-after of every group added up, then by topic, by teacher and by
 * subject -- so a head of department or principal sees which help is
 * working, and where to change it.
 */
export function CatchUpImpactPanel({
  groups: all,
  teacherName,
  views,
}: {
  groups: ImpactGroup[]
  teacherName: (id: string | null) => string
  views: View[]
}) {
  const groups = counted(all)
  const [view, setView] = useState<View>(views[0] ?? 'topic')
  if (!groups.length) return null
  const t = impactTotals(groups)
  const label = (k: string) =>
    view === 'topic' ? (getTopic(k)?.name ?? k) : view === 'subject' ? (getSubject(k)?.name ?? k) : teacherName(k === '' ? null : k)
  const rows = impactBy(groups, (g) => (view === 'topic' ? g.topicId : view === 'subject' ? g.subjectId : (g.createdBy ?? '')))
  const VIEW_LABEL: Record<View, string> = { topic: 'By topic', teacher: 'By teacher', subject: 'By subject' }

  return (
    <section className="card space-y-4 p-5">
      <div>
        <h2 className="flex items-center gap-2 text-base font-bold text-navy-900">
          <TargetIcon className="h-5 w-5 text-navy-500" /> Are the catch-up groups working?
        </h2>
        <p className="mt-1 text-xs text-navy-500">
          Each learner’s starting point against their latest reassessment, over every group still counted (cancelled groups are left out).
        </p>
      </div>

      {t.measured === 0 ? (
        <p className="rounded-lg bg-navy-50 p-3 text-sm text-navy-700">
          No reassessment has been handed in yet. The numbers appear here once a group sits the test set for it.
        </p>
      ) : (
        <Tiles t={t} />
      )}

      {t.measured > 0 && views.length ? (
        <div className="space-y-2">
          {views.length > 1 ? (
            <div className="flex flex-wrap gap-1.5" role="tablist">
              {views.map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    view === v ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-700 hover:bg-navy-100',
                  )}
                >
                  {VIEW_LABEL[v]}
                </button>
              ))}
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="text-left text-xs text-navy-500">
                  <th className="pb-2 font-medium">{VIEW_LABEL[view].replace('By ', '').replace(/^./, (c) => c.toUpperCase())}</th>
                  <th className="pb-2 text-right font-medium">Groups</th>
                  <th className="pb-2 text-right font-medium">Reassessed</th>
                  <th className="pb-2 pl-3 font-medium">Improved</th>
                  <th className="pb-2 text-right font-medium">Up a level</th>
                  <th className="pb-2 text-right font-medium">To Level 4</th>
                  <th className="pb-2 text-right font-medium">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 tabular-nums">
                {rows.map(({ key, totals: r }) => (
                  <tr key={key}>
                    <td className="py-2 pr-2 text-navy-900">{label(key)}</td>
                    <td className="py-2 text-right text-navy-700">{r.groups}</td>
                    <td className="py-2 text-right text-navy-700">
                      {r.measured}/{r.learners}
                    </td>
                    <td className="py-2 pl-3">
                      {r.measured ? (
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-navy-100">
                            <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${pct(r.improved, r.measured)}%` }} />
                          </span>
                          <span className="text-navy-800">{pct(r.improved, r.measured)}%</span>
                        </span>
                      ) : (
                        <span className="text-navy-400">—</span>
                      )}
                    </td>
                    <td className="py-2 text-right text-navy-700">{r.measured ? r.movedUp : '—'}</td>
                    <td className="py-2 text-right text-navy-700">{r.startedBelow4 ? `${r.reached4}/${r.startedBelow4}` : '—'}</td>
                    <td
                      className={cn(
                        'py-2 text-right font-semibold',
                        r.averageChange === null ? 'text-navy-400' : r.averageChange > 0 ? 'text-emerald-700' : r.averageChange < 0 ? 'text-rose-700' : 'text-navy-600',
                      )}
                    >
                      {r.averageChange === null ? '—' : signed(r.averageChange)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  )
}

/** The same, in brief, for a dashboard. Hidden until a school has a catch-up group. */
export function CatchUpImpactCard({ groups: all, to, linkLabel = 'Open catch-up groups →' }: { groups: ImpactGroup[]; to?: string; linkLabel?: string }) {
  const groups = counted(all)
  if (!groups.length) return null
  const t = impactTotals(groups)
  const running = groups.filter((g) => g.status === 'active').length
  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-bold text-navy-900">
          <TargetIcon className="h-5 w-5 text-navy-500" /> Catch-up groups
        </h3>
        {to ? (
          <Link to={to} className="text-sm font-semibold text-navy-700 underline-offset-2 hover:underline">
            {linkLabel}
          </Link>
        ) : null}
      </div>
      {t.measured === 0 ? (
        <p className="mt-3 text-sm text-navy-600">
          {running} running, none reassessed yet. Set each group a reassessment to see whether it worked.
        </p>
      ) : (
        <>
          <p className="mt-3 flex items-baseline gap-2">
            <span className={cn('text-2xl font-bold tabular-nums', t.improved * 2 >= t.measured ? 'text-emerald-700' : 'text-navy-900')}>
              {pct(t.improved, t.measured)}%
            </span>
            <span className="text-sm text-navy-600">
              of {t.measured} reassessed learner{t.measured === 1 ? '' : 's'} improved
              {t.averageChange === null ? '' : `, ${signed(t.averageChange)} points on average`}
            </span>
          </p>
          <p className="mt-1 text-xs text-navy-500">
            <span className="font-semibold text-navy-800">{t.movedUp}</span> moved up a CAPS level ·{' '}
            <span className="font-semibold text-navy-800">
              {t.reached4} of {t.startedBelow4}
            </span>{' '}
            below Level 4 reached it · {t.groups} group{t.groups === 1 ? '' : 's'}, {running} running
          </p>
        </>
      )}
    </section>
  )
}
