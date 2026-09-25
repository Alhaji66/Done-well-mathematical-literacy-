import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assessments } from '@/data/assessments'
import { getTopic } from '@/data/topics'
import { buildTestPaper, totalMarks } from '@/lib/testPaper'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ArrowLeftIcon } from '@/components/ui/Icons'
import type { Assessment, Question } from '@/types'

const QUESTIONS = 8

const STATUS: Record<Assessment['status'], { label: string; badge: string }> = {
  upcoming: { label: 'Due', badge: 'badge-gold' },
  in_progress: { label: 'Started', badge: 'badge-gold' },
  completed: { label: 'Handed in', badge: 'badge-green' },
  missed: { label: 'Missed', badge: 'badge-red' },
}

const longDate = (d: string) => new Date(d).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })

/**
 * The demo learner's weekly tests.
 *
 * The menu has always offered "Weekly tests", but the demo had no page behind
 * it, so tapping it fell through to the catch-all route and dropped the visitor
 * back on the homepage. This page lists the demo persona's tests and lets them
 * sit one for real: the questions come from the same bank a teacher's test
 * draws from, built the same way, and the learner marks themselves against the
 * memo. Nothing is saved -- it is the demo -- and the page says so.
 */
export function LearnerWeeklyTests() {
  const tests = assessments.filter((a) => a.type === 'Weekly Test').sort((a, b) => b.date.localeCompare(a.date))
  const [active, setActive] = useState<Assessment | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [marks, setMarks] = useState<Record<string, boolean>>({})
  const [handedIn, setHandedIn] = useState(false)

  const start = async (test: Assessment) => {
    setActive(test)
    setLoading(true)
    setMarks({})
    setHandedIn(false)
    const paper = await buildTestPaper({
      id: test.id,
      subject_id: test.subjectId,
      grade: test.grade,
      topic_ids: test.topicIds,
      subtopics: null,
      question_count: QUESTIONS,
    })
    setQuestions(paper)
    setLoading(false)
  }

  if (active) {
    const answered = questions.filter((q) => q.id in marks).length
    const earned = questions.reduce((s, q) => s + (marks[q.id] ? q.marks : 0), 0)
    const outOf = totalMarks(questions)
    const pct = outOf ? Math.round((earned / outOf) * 100) : 0

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setActive(null)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900"
        >
          <ArrowLeftIcon className="h-4 w-4" /> All weekly tests
        </button>
        <SectionHeading
          eyebrow="Weekly test"
          title={active.title}
          description={`${questions.length} questions · ${outOf} marks. Work each one out on paper, check the memo, then say how you did.`}
        />

        <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
          <strong>This is the demo.</strong> Nothing you do here is saved. With a real account your teacher sets these tests and
          sees your results, and any question you get wrong goes to My Mistakes.{' '}
          <Link to="/account/sign-in" className="font-semibold underline">
            Create an account
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-navy-500">Building your test…</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-navy-600">There are no questions for this topic yet.</p>
        ) : (
          <>
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                onResult={(correct) => setMarks((m) => ({ ...m, [q.id]: correct }))}
              />
            ))}

            <div className="card sticky bottom-20 space-y-3 p-5 md:bottom-4">
              {handedIn ? (
                <>
                  <p className="text-sm font-semibold text-navy-900">
                    You marked {earned} out of {outOf} ({pct}%).
                  </p>
                  <ProgressBar percent={pct} label="Your mark on this test" />
                  <p className="text-xs text-navy-500">
                    In a real account this goes to your teacher, and the questions you missed go to My Mistakes so you can try
                    them again.
                  </p>
                </>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-navy-600">
                    Marked {answered} of {questions.length}
                  </p>
                  <button type="button" onClick={() => setHandedIn(true)} className="btn-primary">
                    Hand in
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Weekly tests"
        title="Weekly tests"
        description="Short tests your teacher sets on what you learnt this week. Answer on paper, mark yourself against the memo, and hand in."
      />

      <ul className="space-y-3">
        {tests.map((t) => {
          const topics = t.topicIds.map((id) => getTopic(id)?.name ?? id).join(', ')
          const status = STATUS[t.status]
          return (
            <li key={t.id} className="card flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={status.badge}>{status.label}</span>
                  <span className="text-xs text-navy-500">{longDate(t.date)}</span>
                </div>
                <p className="mt-1.5 font-semibold text-navy-900">{t.title}</p>
                <p className="text-xs text-navy-500">
                  {topics} · {QUESTIONS} questions
                </p>
              </div>
              {t.status === 'completed' ? (
                <div className="sm:text-right">
                  <p className="text-lg font-bold tabular-nums text-navy-900">{t.scorePercent}%</p>
                  <button type="button" onClick={() => start(t)} className="text-xs font-semibold text-gold-700 underline">
                    Try it again
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => start(t)} className="btn-primary btn-sm">
                  {t.status === 'missed' ? 'Catch up on it' : 'Start the test'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
