import { Link } from 'react-router-dom'
import { demoLearner } from '@/data/learner'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TrendBadge } from '@/components/ui/Badges'
import { TargetIcon } from '@/components/ui/Icons'

export function LearnerProgress() {
  const sorted = [...demoLearner.topicProgress].sort((a, b) => a.masteryPercent - b.masteryPercent)
  const nextUp = sorted.slice(0, 2)

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Progress"
        title="Your progress by topic"
        description="See how you're doing across Mathematical Literacy and what to focus on next."
      />

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-navy-900">Overall mastery</h3>
          <span className="text-xl font-extrabold text-navy-900">{demoLearner.overallMasteryPercent}%</span>
        </div>
        <ProgressBar percent={demoLearner.overallMasteryPercent} className="mt-3" />
        <p className="mt-2 text-xs text-navy-500">Based on {demoLearner.topicProgress.reduce((s, t) => s + t.questionsAttempted, 0)} practice attempts across all topics.</p>
      </div>

      <div className="card border-gold-200 bg-gold-50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-900">
            <TargetIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-navy-900">What to practise next</h3>
            <p className="mt-1 text-sm text-navy-700">
              Your biggest opportunities right now are <strong>{getTopic(nextUp[0].topicId)?.name}</strong> and{' '}
              <strong>{getTopic(nextUp[1].topicId)?.name}</strong>. Focused practice here will lift your overall mark the most.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {nextUp.map((t) => (
                <Link key={t.topicId} to={`/app/learner/practise?topic=${t.topicId}`} className="btn-primary btn-sm">
                  Practise {getTopic(t.topicId)?.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {demoLearner.topicProgress.map((tp) => {
          const topic = getTopic(tp.topicId)
          if (!topic) return null
          return (
            <div key={tp.topicId} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-navy-900">{topic.name}</h3>
                  <p className="text-xs text-navy-500">{tp.questionsAttempted} questions attempted</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendBadge trend={tp.trend} />
                  <span className="text-lg font-bold text-navy-900">{tp.masteryPercent}%</span>
                </div>
              </div>
              <ProgressBar percent={tp.masteryPercent} className="mt-3" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
