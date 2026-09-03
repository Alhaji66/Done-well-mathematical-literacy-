import { demoLearner } from '@/data/learner'
import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TrendBadge, StatusBadge } from '@/components/ui/Badges'
import { formatDate } from '@/lib/utils'
import { assessments } from '@/data/assessments'

export function ParentMyChild() {
  const subject = getSubject(demoLearner.subjectId)!
  const gradeAssessments = assessments.filter((a) => a.grade === demoLearner.grade)

  return (
    <div className="space-y-8">
      <div className="card flex items-center gap-4 p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-gold-400">
          {demoLearner.avatarInitials}
        </span>
        <div>
          <h1 className="text-xl font-bold text-navy-900">{demoLearner.name}</h1>
          <p className="text-sm text-navy-600">
            Grade {demoLearner.grade} · {subject.name}
          </p>
        </div>
      </div>

      <div>
        <SectionHeading title="Subject progress" description="Topic-by-topic mastery, updated as your child practises." />
        <div className="mt-4 space-y-3">
          {demoLearner.topicProgress.map((tp) => {
            const topic = getTopic(tp.topicId)
            if (!topic) return null
            return (
              <div key={tp.topicId} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-navy-900">{topic.name}</p>
                  <div className="flex items-center gap-2">
                    <TrendBadge trend={tp.trend} />
                    <span className="text-sm font-bold text-navy-800">{tp.masteryPercent}%</span>
                  </div>
                </div>
                <ProgressBar percent={tp.masteryPercent} className="mt-2.5" />
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <SectionHeading title="Assessment history" description="All weekly, revision and formal tests for this grade." />
        <div className="mt-4 space-y-2.5">
          {gradeAssessments.map((a) => (
            <div key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold text-navy-900">{a.title}</p>
                <p className="text-xs text-navy-500">{formatDate(a.date)} · {a.totalMarks} marks</p>
              </div>
              <div className="flex items-center gap-3">
                {a.scorePercent !== undefined ? (
                  <span className="text-base font-bold text-navy-900">{a.scorePercent}%</span>
                ) : null}
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
