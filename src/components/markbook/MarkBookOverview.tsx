import { useMemo } from 'react'
import { getSubject } from '@/data/subjects'
import { programmeFor, type SbaTask } from '@/data/sba'
import { markBookTasks, type SbaMarkRow } from '@/lib/sbaMarks'
import { classSbaAverage, taskDue, taskProgress, type TaskProgress } from '@/lib/sbaProgress'
import type { ModerationDecision } from '@/lib/sbaModeration'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>

export interface OverviewClass {
  id: string
  name: string
  subject_id: string
  grade: Grade
}

const pct = (n: number) => String(Math.round(n)).replace('.', ',')
const shortTitle = (t: SbaTask) => t.title.split(':')[0]
const dateText = (d: Date) => d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', timeZone: 'UTC' })

const CELL: Record<TaskProgress['state'], string> = {
  done: 'bg-emerald-50 text-emerald-900',
  partial: 'bg-gold-50 text-gold-900',
  none: 'text-navy-400',
  overdue: 'bg-rose-50 text-rose-900',
}

function Cell({ p, due, moderated }: { p: TaskProgress; due: Date | null; moderated?: ModerationDecision }) {
  const label =
    p.state === 'none'
      ? 'Not started'
      : `${p.marked} of ${p.total} marked${p.average !== null ? `, average ${pct(p.average)}%` : ''}${p.released ? ', released' : p.released === false ? ', not released' : ''}`
  return (
    <td className={cn('border-l border-navy-100 px-1.5 py-1.5 text-center align-top', CELL[p.state])} title={label}>
      {p.state === 'none' ? (
        <span className="text-xs">—</span>
      ) : (
        <>
          <span className="block text-xs font-semibold tabular-nums">
            {p.marked}/{p.total}
          </span>
          {p.average !== null ? <span className="block text-[11px] tabular-nums opacity-80">{pct(p.average)}%</span> : null}
        </>
      )}
      {p.state === 'overdue' ? (
        <span className="block text-[10px] font-semibold uppercase tracking-wide">Overdue</span>
      ) : p.released ? (
        <span className="block text-[10px] font-semibold text-emerald-700">✓ Released</span>
      ) : p.state === 'done' && p.released === false ? (
        <span className="block text-[10px] font-semibold text-gold-800">Ready to release</span>
      ) : p.state === 'none' && due ? (
        <span className="block text-[10px]">by {dateText(due)}</span>
      ) : null}
      {moderated ? (
        <span className={cn('block text-[10px] font-semibold', moderated.status === 'accepted' ? 'text-navy-700' : 'text-rose-700')}>
          {moderated.status === 'accepted' ? 'Moderated' : 'Returned'}
        </span>
      ) : null}
    </td>
  )
}

/**
 * Every class in view, grouped by subject and grade, with how far each has
 * got with each formal task: how many learners are marked, the class average,
 * whether the task is released, and whether it is overdue (its term ended
 * more than two weeks ago and marks are still missing).
 */
export function MarkBookOverview(props: {
  classes: OverviewClass[]
  year: number
  members: Map<string, string[]>
  marks: Map<string, Map<string, Map<string, Row>>>
  released: Map<string, Set<string>> | null
  /** Moderation decisions by class and task; leave out before STEP 23. */
  moderated?: Map<string, Map<string, ModerationDecision>> | null
  onOpen: (classId: string) => void
  today?: Date
}) {
  const { classes, year, members, marks, released, moderated, onOpen } = props
  const today = props.today ?? new Date()

  const groups = useMemo(() => {
    const out = new Map<string, { subjectId: string; grade: Grade; classes: OverviewClass[] }>()
    for (const c of classes) {
      const key = `${c.subject_id}|${c.grade}`
      if (!out.has(key)) out.set(key, { subjectId: c.subject_id, grade: c.grade, classes: [] })
      out.get(key)!.classes.push(c)
    }
    return [...out.values()]
      .map((g) => ({ ...g, classes: g.classes.sort((a, b) => a.name.localeCompare(b.name)), tasks: markBookTasks(programmeFor(g.subjectId, g.grade)) }))
      .filter((g) => g.tasks.length)
      .sort((a, b) => a.subjectId.localeCompare(b.subjectId) || a.grade - b.grade)
  }, [classes])

  const all = groups.flatMap((g) =>
    g.classes.flatMap((c) =>
      g.tasks.map((t) => taskProgress(t, members.get(c.id) ?? [], marks.get(c.id) ?? new Map(), released ? (released.get(c.id) ?? new Set()) : null, taskDue(t, year), today)),
    ),
  )
  const overdue = all.filter((p) => p.state === 'overdue').length
  const ready = all.filter((p) => p.state === 'done' && p.released === false).length
  const complete = all.filter((p) => p.state === 'done').length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 text-sm">
        <span className={cn('rounded-full px-3 py-1 font-semibold', overdue ? 'bg-rose-100 text-rose-800' : 'bg-navy-50 text-navy-600')}>
          {overdue} overdue
        </span>
        {released ? (
          <span className={cn('rounded-full px-3 py-1 font-semibold', ready ? 'bg-gold-100 text-gold-900' : 'bg-navy-50 text-navy-600')}>
            {ready} marked, not released
          </span>
        ) : null}
        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
          {complete} of {all.length} complete
        </span>
      </div>

      {groups.map((g) => (
        <section key={`${g.subjectId}|${g.grade}`} className="space-y-2">
          <h3 className="text-sm font-bold text-navy-900">
            {getSubject(g.subjectId)?.name ?? g.subjectId} · Grade {g.grade}
          </h3>
          <div className="overflow-x-auto rounded-lg border border-navy-100">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-navy-50 text-navy-600">
                  <th className="sticky left-0 z-10 min-w-[7rem] bg-navy-50 px-2 py-1.5 text-left font-semibold">Class</th>
                  {g.tasks.map((t) => (
                    <th key={t.slot} className="min-w-[4.75rem] border-l border-navy-100 px-1 py-1.5 text-center align-bottom font-semibold">
                      <span className="block text-[10px] font-normal text-navy-400">T{t.term}</span>
                      {shortTitle(t)}
                    </th>
                  ))}
                  <th className="min-w-[4rem] border-l border-navy-200 px-1 py-1.5 text-center font-semibold">SBA avg</th>
                </tr>
              </thead>
              <tbody>
                {g.classes.map((c) => {
                  const ids = members.get(c.id) ?? []
                  const classMarks = marks.get(c.id) ?? new Map()
                  const avg = classSbaAverage(g.tasks, g.grade, ids, classMarks)
                  return (
                    <tr key={c.id} className="border-t border-navy-100">
                      <th scope="row" className="sticky left-0 z-10 bg-white px-2 py-1.5 text-left font-medium">
                        <button type="button" onClick={() => onOpen(c.id)} className="text-left font-semibold text-navy-900 underline-offset-2 hover:underline">
                          {c.name}
                        </button>
                        <span className="block text-[10px] font-normal text-navy-400">{ids.length} learners</span>
                      </th>
                      {g.tasks.map((t) => (
                        <Cell
                          key={t.slot}
                          due={taskDue(t, year)}
                          moderated={moderated?.get(c.id)?.get(t.slot)}
                          p={taskProgress(t, ids, classMarks, released ? (released.get(c.id) ?? new Set()) : null, taskDue(t, year), today)}
                        />
                      ))}
                      <td className="border-l border-navy-200 px-1 text-center font-semibold tabular-nums text-navy-900">
                        {avg === null ? '—' : `${pct(avg)}%`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <p className="text-[11px] text-navy-500">
        Each cell: learners with a mark (absent and excused included) out of the class, and the class average. A task is overdue once its
        term has been over for two weeks and marks are still missing. Open a class to see its mark book.
      </p>
    </div>
  )
}
