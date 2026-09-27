import { programmeFor, type SbaTask } from '@/data/sba'
import { demoDates } from '@/data/demoSchedule'
import { markBookTasks, type SbaMarkRow } from '@/lib/sbaMarks'
import type { AttentionData } from '@/components/markbook/SbaAttention'
import type { Grade } from '@/types'

/**
 * The demo mark book's sample classes and marks, shared by the demo mark book
 * and the demo dashboards so both tell the same story: three Mathematical
 * Literacy classes with marks in for Terms 1 to 3, and 11A behind.
 */
export const CLASSES: { id: string; name: string; subject_id: string; grade: Grade }[] = [
  { id: 'demo-11a', name: '11A Mathematical Literacy', subject_id: 'mat-lit', grade: 11 },
  { id: 'demo-11b', name: '11B Mathematical Literacy', subject_id: 'mat-lit', grade: 11 },
  { id: 'demo-12a', name: '12A Mathematical Literacy', subject_id: 'mat-lit', grade: 12 },
]

const NAMES = [
  'Ayanda Mokoena', 'Bongani Dlamini', 'Chantel Adams', 'Dineo Khumalo', 'Ethan Pillay', 'Fikile Nkosi',
  'Gugu Mthembu', 'Hlumelo Sithole', 'Imran Patel', 'Jabu Ndlovu', 'Kea Molefe', 'Lerato Mahlangu',
]

/** A steady pseudo-random mark per learner and task, so the demo looks the same on every visit. */
const seeded = (a: number, b: number) => {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export type Marks = Map<string, Map<string, Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>>>

/**
 * 11A is behind, to show the overview at work: three learners still have no
 * mark for the Term 2 assignment, and only half the class is marked for Term 3.
 */
export function sampleMarks(tasks: SbaTask[], classId: string): Marks {
  const out: Marks = new Map()
  const behind = classId === 'demo-11a'
  const seed = { 'demo-11a': 7, 'demo-12a': 3 }[classId] ?? 0
  NAMES.forEach((_, li) => {
    // One learner in 11A is struggling badly.
    const ability = behind && li === 5 ? 0.22 : 0.35 + 0.55 * seeded(li + seed, 99)
    const row = new Map<string, Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>>()
    tasks.forEach((t, ti) => {
      if (t.term > 3 || t.exam === 'end-of-year') return
      if (behind && ((t.slot === tasks[2].slot && li >= 9) || (t.term === 3 && li >= 6))) return
      if (li === 3 && ti === 2) return void row.set(t.slot, { mark: null, status: 'absent', out_of: t.marks })
      if (li === 7 && ti === 0) return void row.set(t.slot, { mark: null, status: 'exempt', out_of: t.marks })
      const f = Math.min(0.98, Math.max(0.15, ability + (seeded(li + seed, ti) - 0.5) * 0.3))
      row.set(t.slot, { mark: Math.round(f * t.marks), status: 'marked', out_of: t.marks })
    })
    out.set(`demo-learner-${li}`, row)
  })
  return out
}

export const tasksOf = (grade: Grade) => markBookTasks(programmeFor('mat-lit', grade))
export const learners = NAMES.map((name, i) => ({ id: `demo-learner-${i}`, name }))


/** What starts out released: Terms 1 and 2 -- in 11A, only the tasks everyone has a mark for. */
export function demoReleased(classId: string, marks: Marks): Set<string> {
  const grade = CLASSES.find((c) => c.id === classId)!.grade
  return new Set(
    tasksOf(grade)
      .filter((t) => t.term <= 2 && (classId !== 'demo-11a' || learners.every((l) => marks.get(l.id)?.has(t.slot))))
      .map((t) => t.slot),
  )
}

/** The demo classes as the dashboard's "SBA at a glance" card counts them. */
export function demoAttentionData(): AttentionData {
  const marks = new Map(CLASSES.map((c) => [c.id, sampleMarks(tasksOf(c.grade), c.id)]))
  return {
    classes: CLASSES,
    members: new Map(CLASSES.map((c) => [c.id, learners.map((l) => l.id)])),
    marks,
    released: new Map(CLASSES.map((c) => [c.id, demoReleased(c.id, marks.get(c.id)!)])),
    dates: new Map(CLASSES.map((c) => [c.id, demoDates('mat-lit', c.grade, c.id, tasksOf(c.grade))])),
    year: new Date().getFullYear(),
  }
}
