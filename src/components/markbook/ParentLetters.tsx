import { getSubject } from '@/data/subjects'
import { markSplitFor, type SbaTask } from '@/data/sba'
import { capsLevel } from '@/lib/sbaMarks'
import type { AtRisk } from '@/lib/sbaProgress'
import type { OverviewClass } from '@/components/markbook/MarkBookOverview'

export type LetterRow = AtRisk & { cls: OverviewClass }

const num = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const taskName = (t: SbaTask) => `${t.title.split(':')[0]} (Term ${t.term})`
const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`)

/**
 * A letter to the parent or guardian of each chosen learner, one to a page:
 * what the SBA mark is so far and what it counts for, any task missed or
 * still to be written, what helps at home, and a reply slip to cut off and
 * return. Hidden on screen; printed with printPart('letters').
 */
export function ParentLetters({
  rows,
  names,
  school,
  teacherOf,
  year,
}: {
  rows: LetterRow[]
  names: Map<string, string>
  school: string | null
  teacherOf: (classId: string) => string | null
  year: number
}) {
  const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="parent-letters print-area hidden text-[12px] leading-relaxed text-navy-900 print:block">
      {rows.map((r, i) => {
        const name = names.get(r.learnerId) ?? 'your child'
        const first = name.split(' ')[0]
        const subject = getSubject(r.cls.subject_id)?.name ?? r.cls.subject_id
        const split = markSplitFor(r.cls.grade)
        const teacher = teacherOf(r.cls.id)
        const level = r.sba === null ? null : capsLevel(r.sba)
        return (
          <section key={`${r.cls.id}|${r.learnerId}`} className={i ? 'print-break-before' : undefined}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-bold">{school ?? 'School'}</p>
              <p>{today}</p>
            </div>
            <p className="mt-6">Dear parent or guardian of {name},</p>
            <p className="mt-2 font-semibold">
              {subject} · Grade {r.cls.grade} · {r.cls.name} · school-based assessment (SBA), {year}
            </p>
            <p className="mt-3">
              We are writing about {first}’s marks for the formal tasks of the school-based assessment in {subject} so far this year. The SBA
              counts for {split.sba}% of the {r.cls.grade === 12 ? 'final mark' : 'promotion mark'} for the subject; the {split.examName} is the
              other {split.exam}%. To pass, a learner needs at least 30% in a subject.
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-5">
              {r.sba !== null ? (
                <li>
                  {first}’s SBA mark so far is <strong>{num(r.sba)}%</strong> (Level {level!.level}: {level!.name.toLowerCase()}).
                </li>
              ) : null}
              {r.absentTasks.length ? (
                <li>
                  {first} was absent for {list(r.absentTasks.map(taskName))}, which {r.absentTasks.length === 1 ? 'counts' : 'count'} as 0 at present.
                </li>
              ) : null}
              {r.missingTasks.length ? (
                <li>
                  {first} has no mark yet for {list(r.missingTasks.map(taskName))}, which should have been written by now.
                </li>
              ) : null}
              {r.lowest ? (
                <li>
                  The lowest mark so far was {num(r.lowest.percent)}% for {taskName(r.lowest.task)}.
                </li>
              ) : null}
            </ul>

            <p className="mt-3">
              <strong>How you can help.</strong> Please talk with {first} about these marks, and help {first} set aside time every day to study
              and to practise. {first} can practise every topic, and check their working, in the DONE WELL app.
              {r.absentTasks.length || r.missingTasks.length
                ? ` If ${first} missed a task for a valid reason, such as illness with a doctor’s note, please send the proof to the school so that the teacher can arrange what happens next.`
                : ''}
            </p>
            <p className="mt-3">
              Please contact {teacher ? teacher : `${first}’s ${subject} teacher`} at the school to talk about how we can support {first}{' '}
              together.
            </p>
            <p className="mt-6">Yours sincerely,</p>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <div className="border-b border-navy-400" />
                <p className="mt-1 text-navy-600">{teacher ? `${teacher}, ` : ''}{subject} teacher</p>
              </div>
              <div>
                <div className="border-b border-navy-400" />
                <p className="mt-1 text-navy-600">Principal</p>
              </div>
            </div>

            <div className="mt-10 border-t-2 border-dashed border-navy-400 pt-3">
              <p className="text-[10px] uppercase tracking-wider text-navy-500">✂ Cut here and return to the school</p>
              <p className="mt-2">
                I have read the letter about {name}’s {subject} SBA marks ({r.cls.name}, {year}).
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
                {['Parent or guardian’s name', 'Signature', 'Contact number', 'Date'].map((f) => (
                  <div key={f}>
                    <div className="border-b border-navy-400 pt-4" />
                    <p className="mt-1 text-navy-600">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
