import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { topicsForSubject, getTopic } from '@/data/topics'
import { filterQuestions } from '@/data/questions'
import { demoLearner } from '@/data/learner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { TopicNotes } from '@/components/practise/TopicNotes'
import { EmptyState } from '@/components/ui/EmptyState'
import { PencilIcon } from '@/components/ui/Icons'
import type { Difficulty } from '@/types'
import { cn } from '@/lib/utils'

const difficulties: Difficulty[] = ['Easy', 'Moderate', 'Challenge']

const subjectOptions = [
  { id: 'mat-lit', name: 'Mathematical Literacy' },
  { id: 'mathematics', name: 'Mathematics' },
]

export function LearnerPractise() {
  const [params, setParams] = useSearchParams()
  const initialTopicId = params.get('topic') ?? ''
  const initialSubjectId = getTopic(initialTopicId)?.subjectId ?? demoLearner.subjectId
  const [subjectId, setSubjectId] = useState(initialSubjectId)
  const topics = topicsForSubject(subjectId, demoLearner.grade)
  const [topicId, setTopicId] = useState(initialTopicId || topics[0]?.id || '')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')

  const questions = useMemo(
    () => filterQuestions({ topicId, difficulty: difficulty === 'All' ? undefined : difficulty }),
    [topicId, difficulty],
  )

  const changeTopic = (id: string) => {
    setTopicId(id)
    setParams({ topic: id })
  }

  const changeSubject = (id: string) => {
    setSubjectId(id)
    const nextTopics = topicsForSubject(id, demoLearner.grade)
    const nextTopicId = nextTopics[0]?.id ?? ''
    setTopicId(nextTopicId)
    setParams(nextTopicId ? { topic: nextTopicId } : {})
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Practise"
        title="Practise a topic"
        description={`Grade ${demoLearner.grade} — choose a subject, topic and difficulty to begin.`}
      />

      <div className="card flex flex-col gap-4 p-4">
        <div>
          <p className="text-xs font-medium text-navy-500">Subject</p>
          <div className="mt-1 inline-flex flex-wrap rounded-lg border border-navy-200 bg-white p-1">
            {subjectOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => changeSubject(s.id)}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
                  subjectId === s.id ? 'bg-gold-500 text-navy-900' : 'text-navy-600 hover:bg-navy-50',
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label className="text-xs font-medium text-navy-500" htmlFor="topic-select">
            Topic
          </label>
          <select
            id="topic-select"
            className="select mt-1"
            value={topicId}
            onChange={(e) => changeTopic(e.target.value)}
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs font-medium text-navy-500">Difficulty</p>
          <div className="mt-1 inline-flex rounded-lg border border-navy-200 bg-white p-1">
            {(['All', ...difficulties] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
                  difficulty === d ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      {topicId ? <TopicNotes topicId={topicId} /> : null}

      {questions.length === 0 ? (
        <EmptyState
          icon={<PencilIcon className="h-6 w-6" />}
          title="No sample questions at this difficulty yet"
          description="Try a different difficulty level, or choose another topic — more questions are added regularly."
        />
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
