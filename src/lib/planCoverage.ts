import { atpFor, termEndDate, type AtpWeek } from '@/data/atp'
import type { LessonPlanRecord, RecordStatus } from '@/lib/lessonPlanRecords'

/**
 * Which ATP weeks each teacher in a department has recorded, and which are
 * overdue -- the question an HOD asks at the end of every term: "has the ATP
 * been covered, and can I show it?"
 *
 * A week is DUE once its last day has passed, and OVERDUE a week after that:
 * a teacher records a week after teaching it, and a few days' grace stops the
 * page crying wolf on a Friday afternoon. The dates are the ATP's own (the
 * provincial plan's, or the suggested plan's), read as dates in the current
 * year; a week with only a start date is due at the end of its term.
 *
 * The HOD only ever sees records that have been submitted -- drafts stay the
 * teacher's own (STEP 20) -- so a week a teacher has drafted but not
 * submitted counts here as not submitted, which is what it is.
 */

export type CellState = Exclude<RecordStatus, 'draft'> | 'overdue' | 'due' | 'upcoming'

export interface TeachingWeek {
  index: number
  term: number
  weeks: string
  label: string
  dates?: string
  due: Date
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const GRACE_DAYS = 7

/** The last day of an ATP entry: "19 Jan – 6 Feb" ends on 6 Feb; "From 19 Oct" at the end of its term. */
export function weekEnd(week: AtpWeek, year: number): Date {
  const tail = week.dates?.includes('–') ? week.dates.split('–').pop()! : undefined
  const m = tail?.match(/(\d{1,2})\s+([A-Za-z]{3})/)
  const month = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1
  if (m && month >= 0) return new Date(Date.UTC(year, month, Number(m[1])))
  const end = termEndDate(week.term)
  return new Date(Date.UTC(year, end.getUTCMonth(), end.getUTCDate()))
}

/** The weeks of a subject and grade's ATP that have something to teach, in order. */
export function teachingWeeks(subjectId: string, grade: number, year: number): TeachingWeek[] {
  const atp = atpFor(subjectId, grade)
  if (!atp) return []
  return atp.weeks
    .map((w, index) => ({ w, index }))
    .filter(({ w }) => w.topicId)
    .map(({ w, index }) => ({ index, term: w.term, weeks: w.weeks, label: w.label, dates: w.dates, due: weekEnd(w, year) }))
}

export function cellState(record: LessonPlanRecord | undefined, due: Date, today: Date): CellState {
  if (record && record.status !== 'draft') return record.status
  if (today <= due) return 'upcoming'
  return today.getTime() - due.getTime() > GRACE_DAYS * 86_400_000 ? 'overdue' : 'due'
}

export const CELL_LABEL: Record<CellState, string> = {
  signed: 'Signed off',
  submitted: 'Waiting',
  returned: 'Returned',
  overdue: 'Not submitted',
  due: 'Due now',
  upcoming: 'Not yet due',
}

export const CELL_CLASS: Record<CellState, string> = {
  signed: 'bg-emerald-100 text-emerald-800',
  submitted: 'bg-gold-100 text-gold-800',
  returned: 'bg-rose-100 text-rose-700',
  overdue: 'bg-rose-600 text-white',
  due: 'bg-navy-100 text-navy-700',
  upcoming: 'bg-transparent text-navy-300',
}

export interface TeacherTally {
  due: number
  signed: number
  submitted: number
  returned: number
  overdue: number
}

/** One teacher's grade: every week's state, and the counts for the weeks already due. */
export function coverageFor(
  weeks: TeachingWeek[],
  records: LessonPlanRecord[],
  teacherId: string,
  subjectId: string,
  grade: number,
  year: number,
  today: Date,
): { states: CellState[]; tally: TeacherTally } {
  const mine = new Map(
    records
      .filter((r) => r.teacher_id === teacherId && r.subject_id === subjectId && r.grade === grade && r.year === year)
      .map((r) => [r.week_index, r]),
  )
  const states = weeks.map((w) => cellState(mine.get(w.index), w.due, today))
  const tally: TeacherTally = { due: 0, signed: 0, submitted: 0, returned: 0, overdue: 0 }
  states.forEach((s, i) => {
    const isDue = today > weeks[i].due
    if (isDue) tally.due++
    if (s === 'signed') tally.signed++
    else if (s === 'submitted') tally.submitted++
    else if (s === 'returned') tally.returned++
    else if (s === 'overdue') tally.overdue++
  })
  return { states, tally }
}
