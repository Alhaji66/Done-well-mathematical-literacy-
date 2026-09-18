import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import {
  buildTestPaper,
  fetchTestsForLearner,
  fetchMyAttempts,
  submitAttempt,
  totalMarks,
  type PerQuestionMark,
  type TestAttempt,
  type WeeklyTest,
} from '@/lib/weeklyTests'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { MarkingMemo } from '@/components/practise/MarkingMemo'
import { MathText } from '@/components/practise/MathText'
import { Figure } from '@/components/practise/Figure'
import { ClipboardIcon, CheckCircleIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Question } from '@/types'

/**
 * Sitting a weekly test.
 *
 * The flow is deliberately the one a learner uses with a past paper and its
 * memo: answer on paper, then reveal the memo and mark yourself honestly,
 * question by question. Nothing here pretends to mark prose automatically --
 * it cannot -- so the learner awards the marks and the app records what they
 * awarded and sends it to their teacher.
 *
 * The marks are entered per question rather than as one total at the end,
 * because that is what tells a teacher WHICH question the class fell down on,
 * and because awarding 3 out of 5 against a memo you are looking at is a far
 * more useful exercise than guessing a percentage.
 */
export function LearnerWeeklyTests() {
  const { profile } = useAccountAuth()
  const [tests, setTests] = useState<WeeklyTest[]>([])
  const [attempts, setAttempts] = useState<TestAttempt[]>([])
  const [loading, setLoading] = useState(true)

  const [active, setActive] = useState<WeeklyTest | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [marks, setMarks] = useState<Record<string, number>>({})
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let live = true
    Promise.all([
      fetchTestsForLearner(profile.school_id, profile.subject_id, profile.grade),
      fetchMyAttempts(profile.id),
    ]).then(([t, a]) => {
      if (!live) return
      setTests(t)
      setAttempts(a)
      setLoading(false)
    })
    return () => {
      live = false
    }
  }, [profile])

  const start = async (test: WeeklyTest) => {
    setError('')
    const paper = await buildTestPaper(test)
    if (paper.length === 0) {
      setError('This test has no questions in it yet — tell your teacher, the topics it uses have no questions for your grade.')
      return
    }
    setActive(test)
    setQuestions(paper)
    setIndex(0)
    setRevealed(false)
    setMarks({})
    setAnswers({})
    setFinished(false)
  }

  const finish = async () => {
    if (!active || !profile) return
    setSaving(true)
    setError('')
    const perQuestion: PerQuestionMark[] = questions.map((q) => ({
      questionId: q.id,
      awarded: marks[q.id] ?? 0,
      outOf: q.marks,
      answer: answers[q.id]?.trim() || undefined,
    }))
    const message = await submitAttempt({
      testId: active.id,
      learnerId: profile.id,
      perQuestion,
      marksTotal: totalMarks(questions),
    })
    setSaving(false)
    if (message) {
      setError(message)
      return
    }
    setFinished(true)
    setAttempts(await fetchMyAttempts(profile.id))
  }

  if (!profile) return null

  // ------------------------------------------------------------ sitting one
  if (active && !finished) {
    const q = questions[index]
    const awarded = marks[q.id]
    const last = index === questions.length - 1
    const answeredAll = questions.every((item) => marks[item.id] !== undefined)

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-navy-500">{active.title}</p>
            <h1 className="text-lg font-bold text-navy-900">
              Question {index + 1} of {questions.length}
            </h1>
          </div>
          <button type="button" onClick={() => setActive(null)} className="btn-outline shrink-0 text-xs">
            Leave
          </button>
        </div>

        <article className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
            {q.marks} mark{q.marks === 1 ? '' : 's'}
          </p>
          {q.context ? (
            <p className="mt-3 rounded-lg bg-navy-50 p-3 text-sm leading-relaxed text-navy-700">
              <MathText>{q.context}</MathText>
            </p>
          ) : null}
          {q.figure ? (
            <div className="mt-3">
              <Figure id={q.figure} />
            </div>
          ) : null}
          <p className="mt-3 text-base leading-relaxed text-navy-900">
            <MathText>{q.prompt}</MathText>
          </p>

          {!revealed ? (
            <>
              {/*
                The memo used to be one tap away, which meant a learner could
                read the answer and then award themselves the marks for it.
                Writing the answer down first is what makes the mark mean
                something -- and it is the only record of HOW they went wrong,
                which is what their teacher needs in order to reteach it.
              */}
              <label htmlFor={`answer-${q.id}`} className="mt-4 block text-sm font-semibold text-navy-900">
                Your answer
              </label>
              <p className="mt-1 text-xs text-navy-500">
                Work it out on paper, then write your answer here. You can use short form — enough that you will
                recognise your own working later.
              </p>
              <textarea
                id={`answer-${q.id}`}
                rows={4}
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                placeholder="Type your answer…"
                className="mt-2 w-full rounded-lg border border-navy-200 p-3 text-sm leading-relaxed text-navy-900 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
              />
              <button
                type="button"
                disabled={!(answers[q.id] ?? '').trim()}
                onClick={() => setRevealed(true)}
                className="btn-primary mt-3 w-full"
              >
                I've answered — show the memo
              </button>
              {!(answers[q.id] ?? '').trim() ? (
                <p className="mt-2 text-xs text-navy-500">
                  Write something before you look at the memo. Once you have seen it you cannot unsee it, and the mark
                  stops telling you anything.
                </p>
              ) : null}
            </>
          ) : (
            <>
              {/* Their own answer stays on screen beside the memo -- marking
                  from memory is how learners talk themselves into marks. */}
              <div className="mt-4 rounded-lg border border-navy-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">What you wrote</p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-navy-800">
                  {answers[q.id]?.trim() || '—'}
                </p>
              </div>

              <div className="mt-3 rounded-lg border border-navy-200 bg-navy-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Memo answer</p>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-800">
                  <MathText>{q.answer}</MathText>
                </p>
                {/*
                  The working, and it is not optional. `answer` holds only the
                  final result -- for a calculation that is a single line like
                  "F ≈ 360 N", and a learner cannot award themselves 5 marks
                  against it because there is nothing to mark. The formula and
                  the substitution live in `explanation`, which practice mode
                  has always shown and this screen did not.
                */}
                {q.explanation ? (
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">
                    <MathText>{q.explanation}</MathText>
                  </p>
                ) : null}
                {q.answerFigure ? (
                  <div className="mt-3">
                    <Figure id={q.answerFigure} />
                  </div>
                ) : null}
              </div>

              {q.memo ? (
                <div className="mt-3">
                  <MarkingMemo steps={q.memo} totalMarks={q.marks} />
                </div>
              ) : null}

              <div className="mt-4 border-t border-navy-100 pt-4">
                <p className="text-sm font-semibold text-navy-900">
                  How many of the {q.marks} mark{q.marks === 1 ? '' : 's'} did you earn?
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from({ length: q.marks + 1 }, (_, n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={awarded === n}
                      onClick={() => setMarks({ ...marks, [q.id]: n })}
                      className={cn(
                        'h-11 w-11 rounded-lg border text-sm font-bold tabular-nums transition-colors',
                        awarded === n
                          ? 'border-gold-500 bg-gold-500 text-navy-900'
                          : 'border-navy-200 text-navy-700 hover:bg-navy-50',
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-navy-500">
                  Be honest with yourself — a mark you did not earn only hides what you still need to work on.
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIndex(index - 1)
                      setRevealed(true)
                    }}
                    className="btn-outline"
                  >
                    Back
                  </button>
                ) : null}
                {!last ? (
                  <button
                    type="button"
                    disabled={awarded === undefined}
                    onClick={() => {
                      setIndex(index + 1)
                      setRevealed(false)
                    }}
                    className="btn-primary flex-1"
                  >
                    Next question
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!answeredAll || saving}
                    onClick={finish}
                    className="btn-primary flex-1"
                  >
                    {saving ? 'Sending…' : 'Hand in'}
                  </button>
                )}
              </div>
              {last && !answeredAll ? (
                <p className="mt-2 text-xs text-navy-500">Mark every question before handing in.</p>
              ) : null}
            </>
          )}
        </article>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>
    )
  }

  // ---------------------------------------------------------------- handed in
  if (finished && active) {
    const total = totalMarks(questions)
    const got = questions.reduce((s, q) => s + (marks[q.id] ?? 0), 0)
    return (
      <div className="space-y-5">
        <div className="card p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircleIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-navy-900">Handed in</h1>
          <p className="mt-1 text-sm text-navy-600">{active.title}</p>
          <p className="mt-5 text-4xl font-extrabold tabular-nums text-navy-900">
            {got}
            <span className="text-2xl font-normal text-navy-400">/{total}</span>
          </p>
          <p className="mt-1 text-sm text-navy-500">
            {total > 0 ? Math.round((got / total) * 100) : 0}% · your teacher can see this now
          </p>
          <button
            type="button"
            onClick={() => {
              setActive(null)
              setFinished(false)
            }}
            className="btn-primary mt-6 w-full"
          >
            Back to my tests
          </button>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------- list
  const attemptFor = (testId: string) => attempts.find((a) => a.test_id === testId && a.submitted_at)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Weekly tests"
        title="Your weekly tests"
        description="Short tests your teacher has set. Answer on paper, mark yourself against the memo, and hand in."
      />

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-navy-500">Loading your tests…</p>
      ) : tests.length === 0 ? (
        <EmptyState
          icon={<ClipboardIcon className="h-6 w-6" />}
          title="No tests set for you yet"
          description="When your teacher sets one for your subject and grade, it appears here."
        />
      ) : (
        <div className="space-y-3">
          {tests.map((test) => {
            const done = attemptFor(test.id)
            const due = new Date(test.due_at)
            const overdue = due.getTime() < Date.now()
            return (
              <article key={test.id} className="card flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-navy-900">{test.title}</h3>
                  <p className="mt-0.5 text-xs text-navy-500">
                    {test.question_count} questions ·{' '}
                    {overdue ? 'closed ' : 'due '}
                    {due.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                {done ? (
                  <span className="shrink-0 text-right">
                    <span className="block text-lg font-bold tabular-nums text-navy-900">
                      {done.marks_awarded}/{done.marks_total}
                    </span>
                    <span className="text-xs text-emerald-700">Handed in</span>
                  </span>
                ) : (
                  <button type="button" onClick={() => start(test)} className="btn-primary shrink-0">
                    {overdue ? 'Sit it late' : 'Start'}
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
