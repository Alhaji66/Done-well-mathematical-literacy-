import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { LEVEL_NAMES, levelOf, type EarlyWarning, type LevelClass } from '@/lib/levels'
import { TEST_KIND_LABEL } from '@/lib/testKinds'

const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`)
const levelText = (pct: number) => `Level ${levelOf(pct)}: ${LEVEL_NAMES[levelOf(pct)].toLowerCase()}`

/**
 * A letter home for each learner an early warning flagged, one to a page:
 * the test, the result and its CAPS level, why it is a concern, the topic,
 * what the teacher will do and what helps at home -- with a reply slip to
 * cut off and return. Sent early in the term, while there is time to help,
 * rather than with the term report. Hidden on screen; printed with
 * printPart('letters').
 */
export function EarlyWarningLetters({
  warnings,
  cls,
  school,
  name,
}: {
  warnings: EarlyWarning[]
  cls: LevelClass
  school: string | null | undefined
  name: (id: string) => string
}) {
  const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
  const subject = getSubject(cls.subject_id)?.name ?? cls.subject_id

  return (
    <div className="parent-letters print-area hidden text-[12px] leading-relaxed text-navy-900 print:block">
      {warnings.map((w, i) => {
        const full = name(w.learnerId)
        const first = full.split(' ')[0]
        const t = w.latest
        const pct = Math.round(t.percent)
        const kind = TEST_KIND_LABEL[t.kind ?? 'weekly'].toLowerCase()
        const topics = (t.topicIds ?? []).map((id) => getTopic(id)?.name).filter((x): x is string => !!x)
        const topic = topics.length ? list(topics) : 'this work'
        const teacher = cls.teacher
        const concerns = [
          w.reasons.includes('below_40') ? `it is below 40%, which shows that ${first} has not yet understood ${topic}` : null,
          w.reasons.includes('dropped') && w.previous
            ? `it is lower than ${first}’s previous test, “${w.previous.title}” on ${longDate(w.previous.date!)}, where ${first} scored ${Math.round(w.previous.percent)}% (${levelText(w.previous.percent)})`
            : null,
          w.reasons.includes('month_drop') && w.month ? `${first}’s average over the last four weeks is ${w.month.now}%, down from ${w.month.before}% in the four weeks before` : null,
          w.reasons.includes('falling') ? `${first}’s mark has gone down in each of the last three tests` : null,
        ].filter((x): x is string => !!x)
        const heading = cls.name.includes(subject) ? cls.name : `${subject} · ${cls.name}`
        return (
          <section key={w.learnerId} className={i ? 'print-break-before' : undefined}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-bold">{school ?? 'School'}</p>
              <p>{today}</p>
            </div>
            <p className="mt-6">Dear parent or guardian of {full},</p>
            <p className="mt-2 font-semibold">
              {heading} · Grade {cls.grade} · an early warning
            </p>
            <p className="mt-3">
              On {longDate(t.date!)}, {first} wrote a {kind} in {subject}, “{t.title}”, and scored <strong>{pct}%</strong> ({levelText(t.percent)}).
              We are writing now, early, while there is still time to help {first} before the formal tasks and examinations that count towards
              the year’s marks.
            </p>

            <p className="mt-3">This result is a concern because:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {concerns.map((c, j) => (
                <li key={j}>
                  {c}
                  {j === concerns.length - 1 ? '.' : ';'}
                </li>
              ))}
            </ul>

            <p className="mt-3">
              <strong>What we will do.</strong> {teacher ?? `${first}’s ${subject} teacher`} will give {first} extra help on {topic}, and then a
              short test to check that it has helped.
            </p>
            <p className="mt-3">
              <strong>How you can help at home.</strong>
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Ask {first} to show you the test and to explain the questions that were hard.</li>
              <li>
                Help {first} set aside about 30 minutes a day to practise {topic}. In the DONE WELL app every question has a worked solution, and
                {' '}{first} can check their own working.
              </li>
              <li>Check that homework is done, and that {first} comes to every lesson and to any extra lessons.</li>
            </ul>
            <p className="mt-3">
              Please contact {teacher ?? `${first}’s ${subject} teacher`} at the school if you would like to talk about how we can support {first}{' '}
              together.
            </p>
            <p className="mt-6">Yours sincerely,</p>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <div className="border-b border-navy-400" />
                <p className="mt-1 text-navy-600">
                  {teacher ? `${teacher}, ` : ''}
                  {subject} teacher
                </p>
              </div>
              <div>
                <div className="border-b border-navy-400" />
                <p className="mt-1 text-navy-600">Principal</p>
              </div>
            </div>

            <div className="mt-10 border-t-2 border-dashed border-navy-400 pt-3">
              <p className="text-[10px] uppercase tracking-wider text-navy-500">✂ Cut here and return to the school</p>
              <p className="mt-2">
                I have read the early-warning letter about {full}’s {kind} in {subject} on {longDate(t.date!)} ({cls.name}).
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
                {['Parent or guardian’s name', 'Signature', 'Contact number', 'Date'].map((f) => (
                  <div key={f}>
                    <div className="border-b border-navy-400 pt-4" />
                    <p className="mt-1 text-navy-600">{f}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="border-b border-navy-400 pt-4" />
                <p className="mt-1 text-navy-600">Comments or questions for the teacher</p>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
