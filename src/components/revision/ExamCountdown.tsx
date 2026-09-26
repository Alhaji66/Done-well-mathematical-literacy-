import { useEffect, useMemo, useState } from 'react'
import { getSubject } from '@/data/subjects'
import {
  buildPlan,
  isoDay,
  loadDone,
  loadExamDate,
  parseDay,
  questionsForDay,
  saveDone,
  saveExamDate,
  topicName,
  type PlanDay,
  type RevisionPlan,
  type TopicMark,
} from '@/lib/revisionPlan'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CalendarIcon, CheckIcon } from '@/components/ui/Icons'
import type { Grade, Question } from '@/types'

const dayLabel = (iso: string) => parseDay(iso).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
const longDate = (iso: string) => parseDay(iso).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/**
 * The exam countdown page: pick the exam date, get a day-by-day plan built
 * from the weakest topics, with three practice questions for each day.
 *
 * `scope` keeps one person's date and ticks apart from another's on a shared
 * phone ('demo', or the account id). `exampleDate` is what the demo opens on
 * before anyone picks a date, so the page shows a plan straight away.
 */
export function ExamCountdown({
  scope,
  subjectId,
  grade,
  marks,
  loading = false,
  exampleDate,
  onAttempt,
  onResult,
}: {
  scope: string
  subjectId: string
  grade: Grade
  marks: TopicMark[]
  loading?: boolean
  exampleDate?: string
  onAttempt?: (q: Question, correct: boolean | null) => void
  onResult?: (q: Question, correct: boolean) => void
}) {
  const today = isoDay(new Date())
  const [saved, setSaved] = useState<string | null>(() => loadExamDate(scope, subjectId, grade))
  const [done, setDone] = useState<Set<string>>(() => loadDone(scope, subjectId, grade))
  const [draft, setDraft] = useState('')
  const examDate = saved ?? exampleDate ?? null
  const isExample = !saved && !!exampleDate

  const plan = useMemo(
    () => (examDate && !loading ? buildPlan({ subjectId, grade, examDate, marks, today }) : null),
    [examDate, loading, subjectId, grade, marks, today],
  )

  const setDate = (date: string | null) => {
    saveExamDate(scope, subjectId, grade, date)
    setSaved(date)
    setDraft('')
  }
  const toggle = (date: string) => {
    const next = new Set(done)
    if (next.has(date)) next.delete(date)
    else next.add(date)
    saveDone(scope, subjectId, grade, next)
    setDone(next)
  }

  const subject = getSubject(subjectId)?.name ?? subjectId
  const dateInput = (
    <label className="block">
      <span className="text-sm font-medium text-navy-800">Date of your first {subject} paper</span>
      <div className="mt-1.5 flex flex-wrap gap-2">
        <input
          type="date"
          className="input min-w-0 flex-1"
          min={today}
          value={draft || examDate || ''}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="button" className="btn-primary" disabled={!draft || draft < today} onClick={() => setDate(draft)}>
          {examDate ? 'Change date' : 'Build my plan'}
        </button>
      </div>
    </label>
  )

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Exam countdown"
        title="My revision plan"
        description={`Grade ${grade} ${subject}. One topic a day, with the weakest topics coming round most often, and three practice questions for each day.`}
      />

      {!examDate ? (
        <div className="card space-y-4 p-4 sm:p-5">
          <p className="text-sm text-navy-700">
            When is your exam? Your school gives you the timetable — enter the date of the first paper and DONE WELL plans every day
            until then from your marks.
          </p>
          {dateInput}
        </div>
      ) : loading ? (
        <p className="text-sm text-navy-500">Loading your marks…</p>
      ) : !plan ? (
        <div className="card space-y-4 p-4 sm:p-5">
          <p className="text-sm text-navy-700">That exam date has passed. Enter the date of your next paper.</p>
          {dateInput}
        </div>
      ) : (
        <PlanView
          plan={plan}
          today={today}
          done={done}
          toggle={toggle}
          subjectId={subjectId}
          grade={grade}
          isExample={isExample}
          dateInput={dateInput}
          clearDate={saved ? () => setDate(null) : undefined}
          onAttempt={onAttempt}
          onResult={onResult}
        />
      )}
    </div>
  )
}

function PlanView({
  plan,
  today,
  done,
  toggle,
  subjectId,
  grade,
  isExample,
  dateInput,
  clearDate,
  onAttempt,
  onResult,
}: {
  plan: RevisionPlan
  today: string
  done: Set<string>
  toggle: (date: string) => void
  subjectId: string
  grade: Grade
  isExample: boolean
  dateInput: React.ReactNode
  clearDate?: () => void
  onAttempt?: (q: Question, correct: boolean | null) => void
  onResult?: (q: Question, correct: boolean) => void
}) {
  const [changing, setChanging] = useState(false)
  const first = plan.days[0]
  const rest = plan.days.slice(1)
  const doneCount = plan.days.filter((d) => done.has(d.date)).length
  const maxDays = Math.max(1, ...plan.focus.map((f) => f.days))

  return (
    <>
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 bg-navy-900 p-4 text-white sm:p-5">
          <div className="text-center">
            <p className="text-4xl font-extrabold tabular-nums leading-none">{plan.daysLeft}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold-300">{plan.daysLeft === 1 ? 'day' : 'days'} to go</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-navy-100">{plan.daysLeft === 0 ? 'Your exam is today. Good luck!' : 'Your exam'}</p>
            <p className="font-semibold">{longDate(plan.examDate)}</p>
            {isExample ? <p className="mt-1 text-xs text-gold-200">Example date — set your own below.</p> : null}
          </div>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          {plan.days.length ? (
            <div>
              <div className="mb-1 flex justify-between text-xs text-navy-500">
                <span>Days done</span>
                <span className="tabular-nums">
                  {doneCount} of {plan.days.length}
                </span>
              </div>
              <ProgressBar percent={(doneCount / plan.days.length) * 100} size="sm" label="Revision days done" />
            </div>
          ) : null}
          {changing || isExample ? (
            dateInput
          ) : (
            <div className="flex flex-wrap gap-3 text-sm">
              <button type="button" className="font-semibold text-navy-700 underline" onClick={() => setChanging(true)}>
                Change exam date
              </button>
              {clearDate ? (
                <button type="button" className="text-navy-500 underline" onClick={clearDate}>
                  Clear
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {first ? (
        <section className="space-y-3">
          <h3 className="text-base font-bold text-navy-900">{first.date === today ? 'Today' : dayLabel(first.date)}</h3>
          <DayCard day={first} plan={plan} done={done.has(first.date)} toggle={toggle} subjectId={subjectId} grade={grade} open onAttempt={onAttempt} onResult={onResult} />
        </section>
      ) : null}

      <section className="card p-4 sm:p-5">
        <h3 className="font-bold text-navy-900">Where your days go</h3>
        <p className="mt-1 text-sm text-navy-600">Weakest topics first. The plan is rebuilt from your latest marks each time you open it.</p>
        <ul className="mt-4 space-y-3">
          {plan.focus.map((f) => (
            <li key={f.topicId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
              <span className="truncate text-sm font-medium text-navy-900">{topicName(f.topicId)}</span>
              <span className="text-xs tabular-nums text-navy-500">
                {f.mastery === null ? 'not tried yet' : `${f.mastery}%`} · {f.days} {f.days === 1 ? 'day' : 'days'}
              </span>
              <div className="col-span-2 h-2 rounded-full bg-navy-100">
                <div className="h-2 rounded-full bg-gold-500" style={{ width: `${(f.days / maxDays) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {rest.length ? (
        <section className="space-y-3">
          <h3 className="text-base font-bold text-navy-900">Coming up</h3>
          <ul className="space-y-2">
            {rest.map((d) => (
              <li key={d.date}>
                <DayCard day={d} plan={plan} done={done.has(d.date)} toggle={toggle} subjectId={subjectId} grade={grade} onAttempt={onAttempt} onResult={onResult} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}

function DayCard({
  day,
  plan,
  done,
  toggle,
  subjectId,
  grade,
  open: startOpen = false,
  onAttempt,
  onResult,
}: {
  day: PlanDay
  plan: RevisionPlan
  done: boolean
  toggle: (date: string) => void
  subjectId: string
  grade: Grade
  open?: boolean
  onAttempt?: (q: Question, correct: boolean | null) => void
  onResult?: (q: Question, correct: boolean) => void
}) {
  const [open, setOpen] = useState(startOpen)
  const [questions, setQuestions] = useState<Question[] | null>(null)

  useEffect(() => {
    if (!open) return
    let active = true
    void questionsForDay(plan, day, subjectId, grade).then((qs) => active && setQuestions(qs))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, day.date, day.topicId, day.subtopic, subjectId, grade])

  return (
    <div className={`card p-4 ${done ? 'border-emerald-200 bg-emerald-50/50' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`Mark ${dayLabel(day.date)} done`}
          onClick={() => toggle(day.date)}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
            done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-navy-300 bg-white'
          }`}
        >
          {done ? <CheckIcon className="h-4 w-4" /> : null}
        </button>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-medium text-navy-500">
            <CalendarIcon className="h-3.5 w-3.5" /> {dayLabel(day.date)}
          </p>
          <p className="mt-0.5 font-semibold text-navy-900">{topicName(day.topicId)}</p>
          <p className="text-sm text-navy-600">
            {day.kind === 'mixed'
              ? 'A question from each of your weakest topics, exam-style. Then go over My Mistakes.'
              : `${day.subtopic ? `${day.subtopic} · ` : ''}session ${day.session} of ${day.sessions}`}
          </p>
          {!startOpen ? (
            <button type="button" className="mt-2 text-sm font-semibold text-navy-700 underline" onClick={() => setOpen((o) => !o)}>
              {open ? 'Hide questions' : 'Show 3 practice questions'}
            </button>
          ) : null}
        </div>
      </div>
      {open ? (
        <div className="mt-4 space-y-3">
          {questions === null ? (
            <p className="text-sm text-navy-500">Loading questions…</p>
          ) : questions.length === 0 ? (
            <p className="text-sm text-navy-500">No practice questions for this yet.</p>
          ) : (
            questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                onAttempt={onAttempt ? (c) => onAttempt(q, c) : undefined}
                onResult={onResult ? (c) => onResult(q, c) : undefined}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
