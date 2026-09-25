import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { getTopic } from '@/data/topics'
import { subjects } from '@/data/subjects'
import { questionsById } from '@/data/questionBank'
import { clearMistake, fetchMistakes, recordAnswer, type Mistake } from '@/lib/mistakes'
import { logActivity } from '@/lib/activity'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { CatchUpGroups } from '@/components/account/CatchUpGroups'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { CheckCircleIcon } from '@/components/ui/Icons'
import type { Question } from '@/types'

const SOURCE: Record<Mistake['source'], string> = {
  practice: 'practice',
  paper: 'a practice paper',
  weekly_test: 'a weekly test',
}

/**
 * Every question the learner has got wrong and not yet got right.
 *
 * Retrying one here is the point of the page: a right answer clears it, a
 * wrong one counts again. Grouped by topic, the topics with the most open
 * mistakes first, because that is where an hour of revision goes furthest.
 */
export function MyMistakes() {
  const { profile } = useAccountAuth()
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [questions, setQuestions] = useState<Map<string, Question>>(new Map())
  const [loading, setLoading] = useState(true)
  const [notSetUp, setNotSetUp] = useState(false)
  const [showResolved, setShowResolved] = useState(false)
  /** Fixed during this visit: kept on screen so the card does not vanish mid-read. */
  const [justFixed, setJustFixed] = useState<Set<string>>(new Set())

  const load = async (learnerId: string) => {
    const result = await fetchMistakes([learnerId])
    setMistakes(result.mistakes)
    setNotSetUp(result.notSetUp)
    // Look the questions up subject by subject, since papers load per subject.
    const bySubject = new Map<string, string[]>()
    for (const m of result.mistakes) {
      const subject = getTopic(m.topic_id)?.subjectId
      if (!subject) continue
      bySubject.set(subject, [...(bySubject.get(subject) ?? []), m.question_id])
    }
    const found = new Map<string, Question>()
    for (const [subject, ids] of bySubject) {
      for (const [id, q] of await questionsById(subject, ids)) found.set(id, q)
    }
    setQuestions(found)
  }

  useEffect(() => {
    if (!profile) return
    let active = true
    load(profile.id).then(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  const open = mistakes.filter((m) => !m.resolved_at || justFixed.has(m.question_id))
  const stillOpen = mistakes.filter((m) => !m.resolved_at)
  const resolved = mistakes.filter((m) => m.resolved_at)

  const groups = new Map<string, Mistake[]>()
  for (const m of open) groups.set(m.topic_id, [...(groups.get(m.topic_id) ?? []), m])
  const byTopic = [...groups.entries()].sort((a, b) => b[1].length - a[1].length)

  if (!profile) return null

  const answer = async (m: Mistake, correct: boolean) => {
    await recordAnswer(m.question_id, m.topic_id, m.source, correct)
    void logActivity(profile.id, correct ? 'mistake_fixed' : 'practice_answer', m.topic_id)
    setJustFixed((prev) => {
      const next = new Set(prev)
      if (correct) next.add(m.question_id)
      else next.delete(m.question_id)
      return next
    })
    // Update in place rather than reloading: the card the learner is looking
    // at must not vanish from under them the moment they mark it.
    setMistakes((rows) =>
      rows.map((r) =>
        r.question_id !== m.question_id
          ? r
          : correct
            ? { ...r, resolved_at: new Date().toISOString() }
            : { ...r, times_wrong: r.times_wrong + 1, last_wrong_at: new Date().toISOString() },
      ),
    )
  }

  const heading = (
    <SectionHeading
      eyebrow="My Mistakes"
      title="Questions to try again"
      description="Every question you got wrong in practice, papers and weekly tests, until you get it right. Try one again: get it right and it comes off the list."
    />
  )

  if (loading) {
    return (
      <div className="space-y-6">
        {heading}
        <p className="text-sm text-navy-500">Loading your mistakes…</p>
      </div>
    )
  }

  if (notSetUp) {
    return (
      <div className="space-y-6">
        {heading}
        <div className="card border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          My Mistakes is not switched on yet. Your school's administrator needs to run the latest database update (STEP
          15).
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {heading}

      <CatchUpGroups learnerIds={[profile.id]} audience="learner" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Still to fix</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{stillOpen.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Fixed so far</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-emerald-700">{resolved.length}</p>
        </div>
      </div>

      {open.length === 0 ? (
        <EmptyState
          icon={<CheckCircleIcon className="h-6 w-6" />}
          title={resolved.length ? 'Nothing left to fix' : 'No mistakes saved yet'}
          description={
            resolved.length
              ? 'Every question you got wrong, you have since got right. Keep practising to find the next ones.'
              : 'When you get a question wrong in practice, a paper or a weekly test, it is saved here so you can come back to it.'
          }
          action={
            <Link to="../practise" relative="path" className="btn-primary">
              Practise a topic
            </Link>
          }
        />
      ) : (
        byTopic.map(([topicId, rows]) => {
          const topic = getTopic(topicId)
          const subject = subjects.find((s) => s.id === topic?.subjectId)?.name
          return (
            <section key={topicId} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-navy-100 pb-2">
                <h3 className="text-base font-bold text-navy-900">
                  {topic?.name ?? topicId}
                  {subject ? <span className="ml-2 text-xs font-medium text-navy-500">{subject}</span> : null}
                </h3>
                <p className="text-xs tabular-nums text-navy-500">
                  {rows.filter((r) => !r.resolved_at).length} to fix
                </p>
              </div>
              {rows.map((m, i) => {
                const q = questions.get(m.question_id)
                return (
                  <div key={m.question_id} className="space-y-1.5">
                    <p className="text-xs text-navy-500">
                      {m.resolved_at ? (
                        <span className="mr-1 font-semibold text-emerald-700">Fixed — well done.</span>
                      ) : null}
                      Wrong {m.times_wrong === 1 ? 'once' : `${m.times_wrong} times`} · last in {SOURCE[m.source]} on{' '}
                      {new Date(m.last_wrong_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </p>
                    {q ? (
                      <QuestionCard
                        question={q}
                        index={i}
                        onResult={(correct) => answer(m, correct)}
                      />
                    ) : (
                      <div className="card flex flex-wrap items-center justify-between gap-2 p-4 text-sm text-navy-600">
                        This question has since been changed or removed from DONE WELL.
                        <button
                          type="button"
                          onClick={async () => {
                            if (!(await clearMistake(profile.id, m.question_id))) {
                              setMistakes((r) => r.filter((x) => x.question_id !== m.question_id))
                            }
                          }}
                          className="btn-outline btn-sm"
                        >
                          Remove it
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )
        })
      )}

      {resolved.length ? (
        <section className="space-y-2">
          <button type="button" onClick={() => setShowResolved(!showResolved)} className="text-sm font-semibold text-navy-700 underline">
            {showResolved ? 'Hide' : 'Show'} the {resolved.length} you have fixed
          </button>
          {showResolved ? (
            <ul className="card divide-y divide-navy-100">
              {resolved.map((m) => (
                <li key={m.question_id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-navy-800">
                    {questions.get(m.question_id)?.prompt ?? m.question_id}
                  </span>
                  <span className="text-xs text-emerald-700">
                    Fixed {new Date(m.resolved_at!).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
