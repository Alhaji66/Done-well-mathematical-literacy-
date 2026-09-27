import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { programmeFor } from '@/data/sba'
import type { AccountProfile } from '@/context/AccountAuthContext'
import { classesInView, fetchClassMembers, fetchClasses } from '@/lib/classes'
import { fetchMarksFor, fetchReleasesFor, markBookTasks, type SbaMarkRow } from '@/lib/sbaMarks'
import { atRiskLearners, byLearner, taskDue, taskProgress } from '@/lib/sbaProgress'
import { fetchDatesFor, todayIso } from '@/lib/sbaSchedule'
import { TableIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { demoAttentionData } from '@/data/demoMarkBook'
import type { Grade } from '@/types'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>

export interface AttentionData {
  classes: { id: string; subject_id: string; grade: Grade }[]
  members: Map<string, string[]>
  marks: Map<string, Map<string, Map<string, Row>>>
  released: Map<string, Set<string>> | null
  dates: Map<string, Map<string, { due_on: string }>> | null
  year: number
}

/** The four things in the mark book that want attention, counted across the classes in view. */
export function attentionCounts(d: AttentionData, today = new Date()) {
  let overdue = 0
  let ready = 0
  let below30 = 0
  let thisWeek = 0
  const soon = todayIso(new Date(today.getTime() + 7 * 86_400_000))
  const now = todayIso(today)
  for (const c of d.classes) {
    const tasks = markBookTasks(programmeFor(c.subject_id, c.grade))
    const ids = d.members.get(c.id) ?? []
    const marks = d.marks.get(c.id) ?? new Map()
    const dates = d.dates?.get(c.id)
    for (const t of tasks) {
      const p = taskProgress(t, ids, marks, d.released ? (d.released.get(c.id) ?? new Set()) : null, taskDue(t, d.year, dates?.get(t.slot)?.due_on), today)
      if (p.state === 'overdue') overdue += 1
      if (p.state === 'done' && p.released === false) ready += 1
      const due = dates?.get(t.slot)?.due_on
      if (due && due >= now && due <= soon) thisWeek += 1
    }
    below30 += atRiskLearners(tasks, c.grade, ids, marks, d.year, today, dates).filter((r) => r.band === 'below-30').length
  }
  return { overdue, ready, below30, thisWeek, showReady: d.released !== null, showWeek: d.dates !== null }
}

/**
 * "SBA at a glance" for a staff dashboard: overdue tasks, tasks marked but
 * not released, learners below 30%, and tasks this week -- each a reason to
 * open the mark book.
 */
export function SbaAttentionCard({ data, to }: { data: AttentionData; to: string }) {
  if (data.classes.length === 0) return null
  const c = attentionCounts(data)
  const items = [
    { n: c.overdue, label: c.overdue === 1 ? 'task overdue' : 'tasks overdue', tone: c.overdue ? 'text-rose-700' : 'text-navy-400' },
    ...(c.showReady ? [{ n: c.ready, label: 'marked, not released', tone: c.ready ? 'text-gold-800' : 'text-navy-400' }] : []),
    { n: c.below30, label: c.below30 === 1 ? 'learner below 30%' : 'learners below 30%', tone: c.below30 ? 'text-rose-700' : 'text-navy-400' },
    ...(c.showWeek ? [{ n: c.thisWeek, label: c.thisWeek === 1 ? 'task this week' : 'tasks this week', tone: c.thisWeek ? 'text-navy-900' : 'text-navy-400' }] : []),
  ]
  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-bold text-navy-900">
          <TableIcon className="h-5 w-5 text-navy-500" /> SBA at a glance
        </h3>
        <Link to={to} className="text-sm font-semibold text-navy-700 underline-offset-2 hover:underline">
          Open the mark book →
        </Link>
      </div>
      <div className={cn('mt-3 grid gap-3', items.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3')}>
        {items.map((i) => (
          <div key={i.label}>
            <p className={cn('text-2xl font-bold tabular-nums', i.tone)}>{i.n}</p>
            <p className="text-xs text-navy-500">{i.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/** The card with live data, for the account dashboards of teachers, HODs and principals. */
export function SbaAttention({ profile, to }: { profile: AccountProfile; to: string }) {
  const [data, setData] = useState<AttentionData | null>(null)

  useEffect(() => {
    if (!profile.school_id) return
    let live = true
    const year = new Date().getFullYear()
    fetchClasses(profile.school_id).then(async ({ classes: all }) => {
      const classes = classesInView(profile, all)
      if (!classes.length) return
      const ids = classes.map((c) => c.id)
      const [members, rows, released, dates] = await Promise.all([fetchClassMembers(ids), fetchMarksFor(ids, year), fetchReleasesFor(ids, year), fetchDatesFor(ids, year)])
      // Before the mark book is set up (STEP 21) there is nothing to count.
      if (!live || rows === null) return
      const byClass = new Map<string, string[]>()
      for (const m of members) byClass.set(m.class_id, [...(byClass.get(m.class_id) ?? []), m.learner_id])
      setData({
        classes,
        members: byClass,
        marks: new Map(ids.map((id) => [id, byLearner(rows.filter((r) => r.class_id === id))])),
        released,
        dates,
        year,
      })
    })
    return () => {
      live = false
    }
  }, [profile])

  return data ? <SbaAttentionCard data={data} to={to} /> : null
}

/** The card for the demo dashboards, counted from the demo mark book's sample classes. */
export function DemoSbaAttention({ to }: { to: string }) {
  const [data] = useState(demoAttentionData)
  return <SbaAttentionCard data={data} to={to} />
}
