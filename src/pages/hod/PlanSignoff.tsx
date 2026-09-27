import { useState } from 'react'
import { schoolTeachers } from '@/data/teacherSchool'
import { weekSpan } from '@/data/lessonPlans'
import type { LessonPlanRecord, RecordStatus } from '@/lib/lessonPlanRecords'
import { teachingWeeks } from '@/lib/planCoverage'
import { PlanSignoffView, type PlanStaff } from '@/pages/account/hod/PlanSignoff'
import type { Grade } from '@/types'

/**
 * The demo Head of Department's plan sign-off, on sample records.
 *
 * The real page reads the records teachers submit (STEP 20 of the schema),
 * which a demo visitor has none of. So this builds a believable department:
 * the two Mathematical Literacy teachers in teacherSchool.ts, recording the
 * ATP weeks up to the end of Term 3 -- most signed off, the latest waiting,
 * one returned with a comment, and one or two not yet submitted, so every
 * state the page can show is on it. Signing or returning here changes only
 * this page's copy of the records.
 */
const SUBJECT = 'mat-lit'
const HOD_ID = 'demo-hod'
/** A fixed "today", so the demo always shows a department at the end of Term 3. */
const TODAY = new Date(Date.UTC(2026, 8, 25))
const YEAR = 2026
const PER_WEEK = 4

const REFLECTIONS = [
  'Went to plan. Learners were confident with the calculations; the context questions took longer than expected, so two homework questions moved to the next lesson.',
  'Most learners managed the classwork. About eight struggled with reading the table and will get extra support on Thursday afternoons.',
  'Lost one period to a school assembly, so the consolidation lesson was shortened. Covered all sub-topics.',
  'Good engagement with the real-life examples. Learners asked for more practice on the Level 3 questions, so I added two from the question bank.',
  'The class test showed a gap in unit conversions. I will revisit it in the warm-ups next week.',
]

function buildRecords(): LessonPlanRecord[] {
  const out: LessonPlanRecord[] = []
  let n = 0
  for (const teacher of schoolTeachers.filter((t) => t.subjectId === SUBJECT)) {
    for (const grade of teacher.grades as Grade[]) {
      const due = teachingWeeks(SUBJECT, grade, YEAR).filter((w) => w.due < TODAY)
      due.forEach((w, i) => {
        const fromEnd = due.length - 1 - i
        // The newest week is waiting; the one before for Grade 10 was never sent in;
        // one mid-year week was returned; everything else is signed.
        let status: RecordStatus | 'missing' = 'signed'
        if (fromEnd === 0) status = 'submitted'
        else if (fromEnd === 1 && grade === 10) status = 'missing'
        else if (fromEnd === 4) status = 'returned'
        if (status === 'missing') return
        const planned = (weekSpan(w.weeks) ?? 1) * PER_WEEK
        const taught = i % 5 === 2 ? planned - 1 : planned
        const submitted = new Date(w.due.getTime() + 3 * 86_400_000).toISOString()
        const reviewed = status === 'signed' || status === 'returned' ? new Date(w.due.getTime() + 6 * 86_400_000).toISOString() : null
        out.push({
          id: `demo-rec-${++n}`,
          school_id: 'demo-school',
          teacher_id: teacher.id,
          subject_id: SUBJECT,
          grade,
          year: YEAR,
          week_index: w.index,
          title: `Term ${w.term} · Week ${w.weeks}${w.dates ? ` (${w.dates})` : ''} · ${w.label}`,
          term: w.term,
          topic_id: null,
          weeks: null,
          lesson_minutes: 60,
          lessons_planned: planned,
          lessons_taught: taught,
          dates: w.dates ?? '',
          reflection: REFLECTIONS[(i + grade) % REFLECTIONS.length],
          status,
          submitted_at: submitted,
          review_comment:
            status === 'returned'
              ? 'Please add which learners need the extra support, and the date of the catch-up lesson.'
              : status === 'signed' && i % 4 === 0
                ? 'Thank you — well planned.'
                : '',
          reviewed_by: reviewed ? HOD_ID : null,
          reviewed_at: reviewed,
          created_at: submitted,
          updated_at: reviewed ?? submitted,
        })
      })
    }
  }
  return out
}

const NAMES = new Map<string, string>([
  ...schoolTeachers.map((t) => [t.id, t.name] as [string, string]),
  [HOD_ID, 'you (demo HOD)'],
])

const STAFF: PlanStaff[] = schoolTeachers
  .filter((t) => t.subjectId === SUBJECT)
  .map((t) => ({ id: t.id, name: t.name, teaches: { [SUBJECT]: t.grades } }))

export function DemoPlanSignoff() {
  const [records, setRecords] = useState<LessonPlanRecord[] | null>(buildRecords)
  return (
    <PlanSignoffView
      scope={SUBJECT}
      records={records}
      setRecords={setRecords}
      names={NAMES}
      staff={STAFF}
      selfId={HOD_ID}
      notSetUp={false}
      today={TODAY}
      banner="Demo: sample records from a Mathematical Literacy department, as at the end of Term 3. Signing off or returning a record here changes only this page."
      review={async (r, sign, comment) => {
        if (!sign && !comment.trim()) return 'Say what to change before returning it.'
        return undefined
      }}
    />
  )
}
