import { useEffect, useState } from 'react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { fetchParticipation, type Participation } from '@/lib/activity'

interface Person {
  id: string
  full_name: string
  grade?: number | null
}

/**
 * Who is actually using DONE WELL: active learners this week, how much they
 * practised, and who has not been seen for a fortnight.
 *
 * "Active" means signed in or did something on at least one day. It says
 * nothing about how well -- that is what mastery is for -- and the two are
 * shown apart on purpose: a learner at 30% who practises every day needs a
 * different conversation from one at 30% who has not opened the app.
 */
export function ParticipationPanel({
  learners,
  title = 'Participation',
  byGrade = false,
}: {
  learners: Person[]
  title?: string
  byGrade?: boolean
}) {
  const [week, setWeek] = useState<Map<string, Participation> | null | undefined>(undefined)
  const [fortnight, setFortnight] = useState<Map<string, Participation> | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([fetchParticipation(7), fetchParticipation(14)]).then(([w, f]) => {
      if (!active) return
      setWeek(w)
      setFortnight(f)
    })
    return () => {
      active = false
    }
  }, [])

  if (week === undefined || learners.length === 0) return null
  if (week === null) {
    return (
      <div className="card p-5 text-sm text-navy-600">
        <h3 className="font-bold text-navy-900">{title}</h3>
        <p className="mt-1">
          Participation is not switched on yet. Your administrator needs to run the latest database update (STEP 16).
        </p>
      </div>
    )
  }

  const activeIds = learners.filter((l) => week.has(l.id))
  const pct = Math.round((activeIds.length / learners.length) * 100)
  const answers = learners.reduce((s, l) => s + (week.get(l.id)?.answers ?? 0), 0)
  const quiet = learners.filter((l) => !fortnight?.has(l.id)).sort((a, b) => a.full_name.localeCompare(b.full_name))

  const grades = byGrade
    ? [10, 11, 12]
        .map((g) => {
          const inGrade = learners.filter((l) => l.grade === g)
          const act = inGrade.filter((l) => week.has(l.id)).length
          return { grade: g, total: inGrade.length, active: act }
        })
        .filter((g) => g.total > 0)
    : []

  return (
    <div className="card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-navy-900">{title}</h3>
        <p className="text-xs text-navy-500">Last 7 days</p>
      </div>

      <dl className="grid grid-cols-3 gap-4">
        <div>
          <dt className="text-xs text-navy-500">Active learners</dt>
          <dd className="text-xl font-extrabold tabular-nums text-navy-900">
            {activeIds.length}
            <span className="text-sm font-normal text-navy-400"> / {learners.length}</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-navy-500">Participation</dt>
          <dd className="text-xl font-extrabold tabular-nums text-navy-900">{pct}%</dd>
        </div>
        <div>
          <dt className="text-xs text-navy-500">Questions answered</dt>
          <dd className="text-xl font-extrabold tabular-nums text-navy-900">{answers}</dd>
        </div>
      </dl>
      <ProgressBar percent={pct} size="sm" label="Share of learners active this week" />

      {grades.length > 1 ? (
        <div className="space-y-2 border-t border-navy-100 pt-4">
          {grades.map((g) => (
            <div key={g.grade} className="flex items-center gap-3 text-sm">
              <span className="w-20 shrink-0 font-medium text-navy-800">Grade {g.grade}</span>
              <span className="flex-1">
                <ProgressBar percent={Math.round((g.active / g.total) * 100)} size="sm" label={`Grade ${g.grade} participation`} />
              </span>
              <span className="w-20 shrink-0 text-right tabular-nums text-navy-600">
                {g.active}/{g.total}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {quiet.length ? (
        <div className="border-t border-navy-100 pt-4">
          <p className="text-sm font-semibold text-navy-900">
            Not seen for two weeks: {quiet.length} learner{quiet.length === 1 ? '' : 's'}
          </p>
          <p className="mt-1 text-sm text-navy-600">
            {quiet.slice(0, 8).map((l) => l.full_name).join(', ')}
            {quiet.length > 8 ? ` and ${quiet.length - 8} more` : ''}
          </p>
        </div>
      ) : null}
    </div>
  )
}

/** A parent's view of one child's week. */
export function ChildActivity({ childId, name }: { childId: string; name: string }) {
  const [row, setRow] = useState<Participation | null | undefined>(undefined)
  useEffect(() => {
    let active = true
    fetchParticipation(7).then((m) => active && setRow(m ? (m.get(childId) ?? null) : undefined))
    return () => {
      active = false
    }
  }, [childId])
  if (row === undefined) return null
  return (
    <p className="text-sm text-navy-600">
      {row
        ? `This week ${name} used DONE WELL on ${row.active_days} day${row.active_days === 1 ? '' : 's'} and answered ${row.answers} question${row.answers === 1 ? '' : 's'}. Last active ${new Date(row.last_active).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short' })}.`
        : `${name} has not used DONE WELL this week.`}
    </p>
  )
}
