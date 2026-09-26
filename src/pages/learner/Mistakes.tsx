import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopic } from '@/data/topics'
import { subjects } from '@/data/subjects'
import { questionsById } from '@/data/questionBank'
import { loadDemoMistakes, onDemoMistakesChange, recordDemoAnswer, saveDemoMistakes, type DemoMistake } from '@/lib/demoMistakes'
import type { MistakeSource } from '@/lib/mistakes'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { CheckCircleIcon } from '@/components/ui/Icons'
import type { Question } from '@/types'

const SOURCE: Record<MistakeSource, string> = {
  practice: 'practice',
  paper: 'a practice paper',
  weekly_test: 'a weekly test',
}

/**
 * The demo's My Mistakes: the same page a signed-in learner has, kept in this
 * browser instead of an account (see demoMistakes.ts). Wrong answers in the
 * demo's Practise, Papers and weekly Tests land here; a right answer here
 * takes the question off the list. Grouped by topic, most mistakes first.
 */
export function LearnerMistakes() {
  const [mistakes, setMistakes] = useState<DemoMistake[]>(() => loadDemoMistakes())
  const [questions, setQuestions] = useState<Map<string, Question>>(new Map())
  const [loading, setLoading] = useState(true)
  /** Fixed during this visit: kept on screen so the card does not vanish mid-read. */
  const [justFixed, setJustFixed] = useState<Set<string>>(new Set())

  useEffect(() => onDemoMistakesChange(() => setMistakes(loadDemoMistakes())), [])

  // Look the questions up subject by subject, since papers load per subject.
  const ids = mistakes.map((m) => m.questionId).join(',')
  useEffect(() => {
    let active = true
    const bySubject = new Map<string, string[]>()
    for (const m of mistakes) bySubject.set(m.subjectId, [...(bySubject.get(m.subjectId) ?? []), m.questionId])
    void (async () => {
      const found = new Map<string, Question>()
      for (const [subject, list] of bySubject) for (const [id, q] of await questionsById(subject, list)) found.set(id, q)
      if (active) {
        setQuestions(found)
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids])

  const open = mistakes.filter((m) => !m.resolvedAt || justFixed.has(m.questionId))
  const stillOpen = mistakes.filter((m) => !m.resolvedAt)
  const fixed = mistakes.filter((m) => m.resolvedAt)

  const groups = new Map<string, DemoMistake[]>()
  for (const m of open) groups.set(m.topicId, [...(groups.get(m.topicId) ?? []), m])
  const byTopic = [...groups.entries()].sort((a, b) => b[1].length - a[1].length)

  const answer = (m: DemoMistake, correct: boolean) => {
    recordDemoAnswer({ id: m.questionId, topicId: m.topicId }, m.source, correct)
    setJustFixed((prev) => {
      const next = new Set(prev)
      if (correct) next.add(m.questionId)
      else next.delete(m.questionId)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="My Mistakes"
        title="Questions to try again"
        description="Every question you get wrong in Practise, Papers and weekly Tests comes here. Try one again: get it right and it comes off the list."
      />

      <div className="card border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
        In this demo the list is kept on this phone only. The first few are examples from Karabo's weakest topics; anything you
        get wrong while trying the demo is added to them. In a real account, your teacher sees the list too.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-500">Still to fix</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{stillOpen.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-navy-500">Fixed so far</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-emerald-700">{fixed.length}</p>
        </div>
      </div>

      {open.length === 0 ? (
        <EmptyState
          icon={<CheckCircleIcon className="h-6 w-6" />}
          title={fixed.length ? 'Nothing left to fix' : 'No mistakes saved yet'}
          description={
            fixed.length
              ? 'Every question you got wrong, you have since got right. Keep practising to find the next ones.'
              : 'When you get a question wrong in Practise, a paper or a weekly test, it is saved here so you can come back to it.'
          }
          action={
            <Link to="/app/learner/practise" className="btn-primary">
              Practise a topic
            </Link>
          }
        />
      ) : loading ? (
        <p className="text-sm text-navy-500">Loading the questions…</p>
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
                <p className="text-xs tabular-nums text-navy-500">{rows.filter((r) => !r.resolvedAt).length} to fix</p>
              </div>
              {rows.map((m, i) => {
                const q = questions.get(m.questionId)
                return (
                  <div key={m.questionId} className="space-y-1.5">
                    <p className="text-xs text-navy-500">
                      {m.resolvedAt ? <span className="mr-1 font-semibold text-emerald-700">Fixed — well done.</span> : null}
                      {m.example ? <span className="badge-slate mr-1.5">Example</span> : null}
                      Wrong {m.timesWrong === 1 ? 'once' : `${m.timesWrong} times`} · last in {SOURCE[m.source]} on{' '}
                      {new Date(m.lastWrongAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </p>
                    {q ? (
                      <QuestionCard question={q} index={i} onResult={(correct) => answer(m, correct)} />
                    ) : (
                      <div className="card flex flex-wrap items-center justify-between gap-2 p-4 text-sm text-navy-600">
                        This question has since been changed or removed from DONE WELL.
                        <button
                          type="button"
                          className="btn-outline btn-sm"
                          onClick={() => saveDemoMistakes(mistakes.filter((x) => x.questionId !== m.questionId))}
                        >
                          Remove
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
    </div>
  )
}
