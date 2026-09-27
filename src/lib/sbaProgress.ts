import { termEndDate } from '@/data/atp'
import type { SbaTask } from '@/data/sba'
import { learnerResult, type SbaMarkRow } from '@/lib/sbaMarks'
import type { Grade } from '@/types'

/**
 * How far a class has got with each formal task: how many of its learners
 * have a mark, the class average, and whether the task is released. The
 * head of department's overview of the mark book is built from this.
 */

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>
export type TaskState = 'done' | 'partial' | 'none' | 'overdue'

export interface TaskProgress {
  /** Learners with an entry: a mark, absent or excused. */
  marked: number
  total: number
  /** The class average of the marks entered, in per cent. */
  average: number | null
  /** Null where there is no release step (before STEP 22). */
  released: boolean | null
  state: TaskState
}

/** Two weeks after the end of the task's term: time enough to mark and moderate. */
const GRACE_DAYS = 14

/** When a task's marks should be in, for the year the term dates are known for; otherwise null. */
export function taskDue(task: SbaTask, year: number): Date | null {
  const end = termEndDate(task.term)
  if (end.getUTCFullYear() !== year) return null
  return new Date(end.getTime() + GRACE_DAYS * 86_400_000)
}

export function taskProgress(
  task: SbaTask,
  memberIds: string[],
  marks: Map<string, Map<string, Row>>,
  released: Set<string> | null,
  due: Date | null,
  today: Date,
): TaskProgress {
  let marked = 0
  const percents: number[] = []
  for (const id of memberIds) {
    const row = marks.get(id)?.get(task.slot)
    if (!row) continue
    marked += 1
    if (row.status === 'marked') percents.push(((row.mark ?? 0) / row.out_of) * 100)
  }
  const total = memberIds.length
  const state: TaskState =
    total > 0 && marked === total ? 'done' : due && today > due ? 'overdue' : marked > 0 ? 'partial' : 'none'
  return {
    marked,
    total,
    average: percents.length ? percents.reduce((a, b) => a + b, 0) / percents.length : null,
    released: released ? released.has(task.slot) : null,
    state,
  }
}

/** The class's average SBA mark so far, over the learners with at least one mark. */
export function classSbaAverage(tasks: SbaTask[], grade: Grade, memberIds: string[], marks: Map<string, Map<string, Row>>): number | null {
  const sbas = memberIds
    .map((id) => learnerResult(tasks, grade, marks.get(id) ?? new Map()).sba)
    .filter((x): x is number => x !== null)
  return sbas.length ? sbas.reduce((a, b) => a + b, 0) / sbas.length : null
}

/** Rows of marks as learner → task → mark. */
export function byLearner(rows: SbaMarkRow[]): Map<string, Map<string, SbaMarkRow>> {
  const m = new Map<string, Map<string, SbaMarkRow>>()
  for (const r of rows) {
    if (!m.has(r.learner_id)) m.set(r.learner_id, new Map())
    m.get(r.learner_id)!.set(r.task_key, r)
  }
  return m
}

export interface AtRisk {
  learnerId: string
  /** SBA so far, or null before any mark. */
  sba: number | null
  /** Tasks the learner was absent for (each scores 0). */
  absent: number
  absentTasks: SbaTask[]
  /** Overdue tasks with no entry for the learner. */
  missing: number
  missingTasks: SbaTask[]
  /** The task with the lowest mark, in per cent. */
  lowest: { task: SbaTask; percent: number } | null
  band: 'below-30' | '30-39' | 'gaps'
}

/**
 * The learners of a class to worry about: an SBA so far below 30% (the least
 * a subject can count at, CAPS Level 1 "Not achieved") or from 30% to 39%
 * (Level 2), or with an absence or a missing mark for an overdue task. Worst
 * first.
 */
export function atRiskLearners(
  tasks: SbaTask[],
  grade: Grade,
  memberIds: string[],
  marks: Map<string, Map<string, Row>>,
  year: number,
  today: Date,
): AtRisk[] {
  const overdue = tasks.filter((t) => {
    const due = taskDue(t, year)
    return due !== null && today > due
  })
  const out: AtRisk[] = []
  for (const id of memberIds) {
    const row = marks.get(id) ?? new Map<string, Row>()
    const { sba } = learnerResult(tasks, grade, row)
    const absentTasks = tasks.filter((t) => row.get(t.slot)?.status === 'absent')
    const missingTasks = overdue.filter((t) => !row.has(t.slot))
    const absent = absentTasks.length
    const missing = missingTasks.length
    let lowest: AtRisk['lowest'] = null
    for (const t of tasks) {
      const r = row.get(t.slot)
      if (r?.status !== 'marked') continue
      const percent = ((r.mark ?? 0) / r.out_of) * 100
      if (!lowest || percent < lowest.percent) lowest = { task: t, percent }
    }
    const band = sba !== null && sba < 30 ? 'below-30' : sba !== null && sba < 40 ? '30-39' : absent || missing ? 'gaps' : null
    if (band) out.push({ learnerId: id, sba, absent, absentTasks, missing, missingTasks, lowest, band })
  }
  const order = { 'below-30': 0, '30-39': 1, gaps: 2 }
  return out.sort((a, b) => order[a.band] - order[b.band] || (a.sba ?? 0) - (b.sba ?? 0) || b.missing + b.absent - (a.missing + a.absent))
}
