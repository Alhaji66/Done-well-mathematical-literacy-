import { useState } from 'react'
import { assessmentsForGrade } from '@/data/assessments'
import { getTopic } from '@/data/topics'
import { demoLearner } from '@/data/learner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatusBadge } from '@/components/ui/Badges'
import { ClockIcon, ClipboardIcon, CalendarIcon } from '@/components/ui/Icons'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate, cn } from '@/lib/utils'
import type { AssessmentStatus } from '@/types'

const filters: { key: AssessmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'missed', label: 'Missed' },
]

export function LearnerTests() {
  const [filter, setFilter] = useState<AssessmentStatus | 'all'>('all')
  const tests = assessmentsForGrade(demoLearner.grade).filter((a) => filter === 'all' || a.status === filter)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Tests"
        title="Weekly & revision tests"
        description={`Grade ${demoLearner.grade} Mathematical Literacy assessments.`}
      />

      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-navy-200 bg-white p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors',
              filter === f.key ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tests.length === 0 ? (
        <EmptyState icon={<ClipboardIcon className="h-6 w-6" />} title="No tests in this category" description="Check back after your next practice session." />
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-navy">{test.type}</span>
                  <StatusBadge status={test.status} />
                </div>
                <h3 className="mt-2 font-semibold text-navy-900">{test.title}</h3>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" /> {formatDate(test.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="h-3.5 w-3.5" /> {test.durationMinutes} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClipboardIcon className="h-3.5 w-3.5" /> {test.totalMarks} marks
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {test.topicIds.map((tid) => {
                    const t = getTopic(tid)
                    return t ? (
                      <span key={tid} className="badge-slate">
                        {t.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                {test.status === 'completed' && test.scorePercent !== undefined ? (
                  <span className={`text-2xl font-extrabold ${test.scorePercent >= 70 ? 'text-emerald-600' : test.scorePercent >= 50 ? 'text-gold-600' : 'text-rose-600'}`}>
                    {test.scorePercent}%
                  </span>
                ) : test.status === 'upcoming' ? (
                  <button type="button" className="btn-primary btn-sm">
                    Start test
                  </button>
                ) : (
                  <button type="button" className="btn-outline btn-sm">
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
