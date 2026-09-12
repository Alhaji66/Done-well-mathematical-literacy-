import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { topicsForSubject, getTopic } from '@/data/topics'
import { filterSubjectQuestions } from '@/data/questionBank'
import { subjects } from '@/data/subjects'
import { fetchLearnerProgress, recordAttempt, type ProgressRow } from '@/lib/learnerProgress'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { TopicNotes } from '@/components/practise/TopicNotes'
import { SubtopicSection } from '@/components/practise/SubtopicSection'
import { groupBySubtopic } from '@/data/subtopics'
import { EmptyState } from '@/components/ui/EmptyState'
import { PencilIcon } from '@/components/ui/Icons'
import type { Difficulty, Question } from '@/types'
import { cn } from '@/lib/utils'

const difficulties: Difficulty[] = ['Easy', 'Moderate', 'Challenge']

// Derived from the real subjects list rather than hardcoded, so adding a subject
// only means adding its topics. English FAL is in subjects but has no topics yet,
// so it would otherwise show up as an empty picker entry.
const subjectOptions = subjects.filter((s) => topicsForSubject(s.id).length > 0)

export function LearnerPractise() {
  const { profile } = useAccountAuth()
  const [params, setParams] = useSearchParams()
  const [progress, setProgress] = useState<ProgressRow[]>([])

  // The link that brought the learner here carries the whole identity of what
  // they are practising -- subject, grade and topic -- so a shared or bookmarked
  // link opens the same thing it did before. Topic-only links from older builds
  // still work: the subject is recovered from the topic, and the grade from the
  // profile.
  const initialTopicId = params.get('topic') ?? ''
  const initialSubjectId =
    params.get('subject') ?? getTopic(initialTopicId)?.subjectId ?? profile?.subject_id ?? 'mat-lit'
  const [subjectId, setSubjectId] = useState(initialSubjectId)
  const topics = topicsForSubject(subjectId, profile?.grade ?? undefined)
  const [topicId, setTopicId] = useState(initialTopicId || topics[0]?.id || '')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [subtopic, setSubtopic] = useState(params.get('subtopic') ?? 'All')
  const [savedMessage, setSavedMessage] = useState('')

  const routeFor = (next: { topic?: string; subtopic?: string; subject?: string }) => {
    const query: Record<string, string> = {
      subject: next.subject ?? subjectId,
      topic: next.topic ?? topicId,
    }
    if (profile?.grade) query.grade = String(profile.grade)
    const sub = next.subtopic ?? subtopic
    if (sub && sub !== 'All') query.subtopic = sub
    if (!query.topic) delete query.topic
    return query
  }

  useEffect(() => {
    if (profile) fetchLearnerProgress(profile.id).then(setProgress)
  }, [profile])

  // Paper-backed questions are lazy-loaded per subject, so this resolves after render.
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  useEffect(() => {
    if (!topicId) {
      setQuestions([])
      return
    }
    let cancelled = false
    setLoadingQuestions(true)
    filterSubjectQuestions(subjectId, {
      topicId,
      difficulty: difficulty === 'All' ? undefined : difficulty,
      grade: profile?.grade ?? undefined,
    }).then((rows) => {
      if (cancelled) return
      setQuestions(rows)
      setLoadingQuestions(false)
    })
    return () => {
      cancelled = true
    }
  }, [subjectId, topicId, difficulty])

  const changeTopic = (id: string) => {
    setTopicId(id)
    setSubtopic('All')
    setParams(routeFor({ topic: id, subtopic: 'All' }))
  }

  const changeSubtopic = (name: string) => {
    setSubtopic(name)
    setParams(routeFor({ subtopic: name }))
  }

  const changeSubject = (id: string) => {
    setSubjectId(id)
    const nextTopics = topicsForSubject(id, profile?.grade ?? undefined)
    const nextTopicId = nextTopics[0]?.id ?? ''
    setTopicId(nextTopicId)
    setSubtopic('All')
    setParams(routeFor({ subject: id, topic: nextTopicId, subtopic: 'All' }))
  }

  // Group once per question set, not per render: Finance alone runs to several
  // hundred items and the classifier walks each one.
  const groups = useMemo(() => groupBySubtopic(topicId, questions), [topicId, questions])
  const shown = subtopic === 'All' ? groups : groups.filter((g) => g.name === subtopic)

  const handleAttempt = async (correct: boolean | null) => {
    if (!profile || !topicId) return
    const existing = progress.find((p) => p.topic_id === topicId)
    const updated = await recordAttempt(profile.id, topicId, correct, existing)
    if (updated) {
      setProgress((prev) => [...prev.filter((p) => p.topic_id !== topicId), updated])
      setSavedMessage('Progress saved')
      setTimeout(() => setSavedMessage(''), 2000)
    }
  }

  if (!profile) return null

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Practise"
        title="Practise a topic"
        description={`Grade ${profile.grade} — every answer here is saved to your real account.`}
      />

      {/* Grade, subject and topic stated explicitly: the same topic name appears in
          more than one subject and every grade, so the heading alone is ambiguous. */}
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
        Grade {profile.grade}
        <span className="mx-2 text-navy-300">•</span>
        {subjectOptions.find((s) => s.id === subjectId)?.name}
        {topicId ? (
          <>
            <span className="mx-2 text-navy-300">•</span>
            {topics.find((t) => t.id === topicId)?.name}
          </>
        ) : null}
      </p>

      <div className="card flex flex-col gap-4 p-4">
        <div>
          <p className="text-xs font-medium text-navy-500">Subject</p>
          <div className="mt-1 inline-flex flex-wrap rounded-lg border border-navy-200 bg-white p-1">
            {subjectOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={subjectId === s.id}
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
            <select id="topic-select" className="select mt-1" value={topicId} onChange={(e) => changeTopic(e.target.value)}>
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
                  aria-pressed={difficulty === d}
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

        {groups.length > 1 ? (
          <div>
            <p className="text-xs font-medium text-navy-500">Sub-topic</p>
            <div className="mt-1 flex flex-wrap gap-1 rounded-lg border border-navy-200 bg-white p-1">
              {['All', ...groups.map((g) => g.name)].map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={subtopic === name}
                  onClick={() => changeSubtopic(name)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                    subtopic === name ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
                  )}
                >
                  {name === 'All' ? 'All sub-topics' : name}
                  {name !== 'All' ? (
                    <span className={cn('ml-1.5', subtopic === name ? 'text-navy-300' : 'text-navy-400')}>
                      {groups.find((g) => g.name === name)?.questions.length}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* The topic overview only. Each sub-topic's own explanation is rendered
          directly above its questions, where it is actually needed. */}
      {topicId ? <TopicNotes topicId={topicId} showSubtopics={false} /> : null}

      {savedMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          {savedMessage}
        </div>
      ) : null}

      {loadingQuestions ? (
        <p className="text-sm text-navy-500">Loading questions…</p>
      ) : questions.length === 0 ? (
        <EmptyState
          icon={<PencilIcon className="h-6 w-6" />}
          title="No sample questions at this difficulty yet"
          description="Try a different difficulty level, or choose another topic — more questions are added regularly."
        />
      ) : (
        <div className="space-y-8">
          {shown.map((group, groupIndex) => (
            <SubtopicSection
              key={group.name}
              name={group.name}
              points={group.points}
              count={group.questions.length}
              index={subtopic === 'All' ? groupIndex : groups.findIndex((g) => g.name === group.name)}
            >
              {group.questions.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} onAttempt={handleAttempt} />
              ))}
            </SubtopicSection>
          ))}
        </div>
      )}
    </div>
  )
}
