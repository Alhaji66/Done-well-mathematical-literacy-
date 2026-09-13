import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subjects } from '@/data/subjects'
import { topicsForSubject } from '@/data/topics'
import { topicQuestionCounts, subtopicQuestionCounts } from '@/data/questionBank'
import { demoLearner } from '@/data/learner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ChevronRightIcon, BookIcon } from '@/components/ui/Icons'
import { TopicNotes } from '@/components/practise/TopicNotes'
import { SubtopicLinks } from '@/components/practise/SubtopicLinks'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

const grades: Grade[] = [10, 11, 12]

// Derived from the real subjects list rather than hardcoded, so adding a subject
// only means adding its topics. Every registered subject currently has topics,
// so this filter removes nothing today -- it is kept so that a subject added
// before its content cannot appear as an empty picker entry.
const subjectOptions = subjects.filter((s) => topicsForSubject(s.id).length > 0)

export function LearnerLearn() {
  const [subjectId, setSubjectId] = useState(demoLearner.subjectId)
  const [grade, setGrade] = useState<Grade>(demoLearner.grade)
  const topics = topicsForSubject(subjectId, grade)
  const subjectName = subjectOptions.find((s) => s.id === subjectId)?.name ?? ''

  // Question counts come from the papers, which load per subject on demand.
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({})
  const [subtopicCounts, setSubtopicCounts] = useState<Record<string, Record<string, number>>>({})
  useEffect(() => {
    let cancelled = false
    // Both read the same pool, which is cached per subject, so the second call
    // costs a filter rather than a second load of the papers.
    Promise.all([topicQuestionCounts(subjectId, grade), subtopicQuestionCounts(subjectId, grade)]).then(
      ([topicCounts, subCounts]) => {
        if (cancelled) return
        setQuestionCounts(topicCounts)
        setSubtopicCounts(subCounts)
      },
    )
    return () => {
      cancelled = true
    }
  }, [subjectId, grade])

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Learn" title={`${subjectName} topics`} description="Choose a subject and grade, then a topic to see what it covers before you practise." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap rounded-lg border border-navy-200 bg-white p-1">
          {subjectOptions.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={subjectId === s.id}
              onClick={() => setSubjectId(s.id)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                subjectId === s.id ? 'bg-gold-500 text-navy-900' : 'text-navy-600 hover:bg-navy-50',
              )}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-navy-200 bg-white p-1">
          {grades.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={grade === g}
              onClick={() => setGrade(g)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                grade === g ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
              )}
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const progress = demoLearner.topicProgress.find((tp) => tp.topicId === topic.id)
          const questionCount = questionCounts[topic.id] ?? 0
          return (
            <div key={topic.id} className="card flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <BookIcon className="h-4 w-4" />
                </span>
                <span className="badge-slate">{questionCount} sample questions</span>
              </div>
              <div>
                {/* Physical Sciences is examined as two separate papers --
                    Paper 1 Physics, Paper 2 Chemistry -- and a learner revising
                    for one sits an exam containing none of the other. Without
                    this label the 13 topics read as one undifferentiated list,
                    so there is no way to tell which paper a topic belongs to. */}
                {topic.strand ? (
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-navy-500">{topic.strand}</p>
                ) : null}
                <h3 className="font-bold text-navy-900">{topic.name}</h3>
                <p className="mt-1 text-sm text-navy-600">{topic.description}</p>
              </div>
              {progress ? (
                <div>
                  <div className="mb-1 flex justify-between text-xs text-navy-500">
                    <span>Your mastery</span>
                    <span>{progress.masteryPercent}%</span>
                  </div>
                  <ProgressBar percent={progress.masteryPercent} size="sm" label={`${topic.name} mastery`} />
                </div>
              ) : null}
              {/* Sub-topics sit on the face of the card, not inside the notes
                  accordion, so a learner revising one part of a topic can see
                  it named and go straight to it. */}
              <SubtopicLinks
                topicId={topic.id}
                subjectId={subjectId}
                grade={grade}
                counts={subtopicCounts[topic.id] ?? {}}
              />
              <TopicNotes topicId={topic.id} defaultOpen={false} />
              <Link
                to={`/app/learner/practise?subject=${subjectId}&grade=${grade}&topic=${topic.id}`}
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:text-navy-900"
              >
                Practise the whole topic <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
