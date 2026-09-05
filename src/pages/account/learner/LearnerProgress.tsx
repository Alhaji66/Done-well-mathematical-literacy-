import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchLearnerProgress, type ProgressRow } from '@/lib/learnerProgress'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { TargetIcon, TrendingUpIcon } from '@/components/ui/Icons'

export function LearnerProgress() {
  const { profile } = useAccountAuth()
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    let active = true
    fetchLearnerProgress(profile.id).then((rows) => {
      if (active) {
        setProgress(rows)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [profile])

  if (!profile) return null

  const sorted = [...progress].sort((a, b) => a.mastery_percent - b.mastery_percent)
  const overallMastery = progress.length
    ? Math.round(progress.reduce((s, p) => s + p.mastery_percent, 0) / progress.length)
    : 0
  const totalAttempts = progress.reduce((s, p) => s + p.questions_attempted, 0)
  const nextUp = sorted.slice(0, 2)

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Progress"
        title="Your progress by topic"
        description="Real, saved progress from your own practice sessions."
      />

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : progress.length === 0 ? (
        <EmptyState
          icon={<TrendingUpIcon className="h-6 w-6" />}
          title="No progress recorded yet"
          description="Once you practise some questions, your mastery per topic will show up here."
          action={
            <Link to="/account/learner/practise" className="btn-primary btn-sm">
              Start practising
            </Link>
          }
        />
      ) : (
        <>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-navy-900">Overall mastery</h3>
              <span className="text-xl font-extrabold text-navy-900">{overallMastery}%</span>
            </div>
            <ProgressBar percent={overallMastery} className="mt-3" />
            <p className="mt-2 text-xs text-navy-500">Based on {totalAttempts} practice attempts across all topics.</p>
          </div>

          {nextUp.length === 2 ? (
            <div className="card border-gold-200 bg-gold-50 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-900">
                  <TargetIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-navy-900">What to practise next</h3>
                  <p className="mt-1 text-sm text-navy-700">
                    Your biggest opportunities right now are <strong>{getTopic(nextUp[0].topic_id)?.name}</strong> and{' '}
                    <strong>{getTopic(nextUp[1].topic_id)?.name}</strong>.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nextUp.map((t) => (
                      <Link key={t.topic_id} to={`/account/learner/practise?topic=${t.topic_id}`} className="btn-primary btn-sm">
                        Practise {getTopic(t.topic_id)?.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {sorted.map((p) => {
              const topic = getTopic(p.topic_id)
              return (
                <div key={p.topic_id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-navy-900">{topic?.name ?? p.topic_id}</h3>
                      <p className="text-xs text-navy-500">{p.questions_attempted} questions attempted</p>
                    </div>
                    <span className="text-lg font-bold text-navy-900">{p.mastery_percent}%</span>
                  </div>
                  <ProgressBar percent={p.mastery_percent} className="mt-3" />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
