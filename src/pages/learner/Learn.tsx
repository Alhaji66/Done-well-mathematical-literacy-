import { useState } from 'react'
import { Link } from 'react-router-dom'
import { topicsForSubject } from '@/data/topics'
import { questionsForTopic } from '@/data/questions'
import { demoLearner } from '@/data/learner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ChevronRightIcon, BookIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

const grades: Grade[] = [10, 11, 12]

export function LearnerLearn() {
  const [grade, setGrade] = useState<Grade>(demoLearner.grade)
  const topics = topicsForSubject('mat-lit', grade)

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Learn" title="Mathematical Literacy topics" description="Choose a grade, then a topic to see what it covers before you practise." />

      <div className="inline-flex rounded-lg border border-navy-200 bg-white p-1">
        {grades.map((g) => (
          <button
            key={g}
            type="button"
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const progress = demoLearner.topicProgress.find((tp) => tp.topicId === topic.id)
          const questionCount = questionsForTopic(topic.id).length
          return (
            <div key={topic.id} className="card flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <BookIcon className="h-4 w-4" />
                </span>
                <span className="badge-slate">{questionCount} sample questions</span>
              </div>
              <div>
                <h3 className="font-bold text-navy-900">{topic.name}</h3>
                <p className="mt-1 text-sm text-navy-600">{topic.description}</p>
              </div>
              {progress ? (
                <div>
                  <div className="mb-1 flex justify-between text-xs text-navy-500">
                    <span>Your mastery</span>
                    <span>{progress.masteryPercent}%</span>
                  </div>
                  <ProgressBar percent={progress.masteryPercent} size="sm" />
                </div>
              ) : null}
              <Link
                to={`/app/learner/practise?topic=${topic.id}`}
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:text-navy-900"
              >
                Start practising <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
