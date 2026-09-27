import { termWeeks } from '@/data/atp'
import type { SbaTask } from '@/data/sba'
import type { TaskDate } from '@/lib/sbaSchedule'
import type { Grade } from '@/types'

const iso = (d: Date) => d.toISOString().slice(0, 10)

/**
 * Sample dates for the demo: each term's tasks spread evenly through the
 * term's weeks, each on a Wednesday -- the kind of schedule a teacher sets.
 */
export function demoDates(subjectId: string, grade: Grade, classId: string, tasks: SbaTask[]): Map<string, TaskDate> {
  const out = new Map<string, TaskDate>()
  for (const term of [1, 2, 3, 4] as const) {
    const inTerm = tasks.filter((t) => t.term === term)
    const weeks = termWeeks(term)
    inTerm.forEach((t, k) => {
      const week = weeks[Math.min(weeks.length - 1, Math.floor(((k + 1) * weeks.length) / (inTerm.length + 1)))]
      const wednesday = new Date(Math.min(week.start.getTime() + ((3 - week.start.getUTCDay() + 7) % 7) * 86_400_000, week.end.getTime()))
      out.set(t.slot, {
        class_id: classId,
        year: wednesday.getUTCFullYear(),
        task_key: t.slot,
        subject_id: subjectId,
        grade,
        due_on: iso(wednesday),
        note: t.exam ? 'Timetable from the school' : t.kind === 'Test' ? 'Bring a calculator' : '',
      })
    })
  }
  return out
}
