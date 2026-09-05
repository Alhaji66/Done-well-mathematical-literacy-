import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterProgressRow } from '@/lib/teacherRoster'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { BarChartIcon } from '@/components/ui/Icons'

const bandDefs = [
  { key: 'support', label: 'Needs support', min: 0, max: 39, tone: 'border-rose-200 bg-rose-50 text-rose-700' },
  { key: 'developing', label: 'Developing', min: 40, max: 69, tone: 'border-gold-200 bg-gold-50 text-gold-700' },
  { key: 'proficient', label: 'Proficient', min: 70, max: 100, tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
] as const

/**
 * Shared per-topic mastery breakdown, reused by both Teacher and School
 * Analytics -- under the current schema both roles see "every learner at
 * this school" (there's no teacher-to-class assignment yet), same as the
 * Dashboard roster, so the underlying data and this whole component are
 * identical between the two roles.
 */
export function MasteryAnalytics() {
  const { profile } = useAccountAuth()
  const [learnerIds, setLearnerIds] = useState<string[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let active = true

    fetchSchoolLearners(profile.school_id).then(async (learners) => {
      if (!active) return
      const ids = learners.map((l) => l.id)
      setLearnerIds(ids)
      const rows = await fetchProgressForLearners(ids)
      if (active) {
        setProgress(rows)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [profile?.school_id])

  if (!profile) return null

  const topicIds = Array.from(new Set(progress.map((p) => p.topic_id)))
  const topicAverages = topicIds
    .map((topicId) => {
      const rows = progress.filter((p) => p.topic_id === topicId)
      const avg = Math.round(rows.reduce((s, r) => s + r.mastery_percent, 0) / rows.length)
      return { topicId, avg, topic: getTopic(topicId) }
    })
    .sort((a, b) => a.avg - b.avg)

  const learnerAverages = learnerIds
    .map((id) => averageMastery(id, progress))
    .filter((m): m is number => m !== null)
  const bandCounts = bandDefs.map((b) => ({
    ...b,
    count: learnerAverages.filter((m) => m >= b.min && m <= b.max).length,
  }))

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Analytics" title="Mastery breakdown" description="How practice mastery is distributed across every topic and learner." />

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : progress.length === 0 ? (
        <EmptyState
          icon={<BarChartIcon className="h-6 w-6" />}
          title="No practice recorded yet"
          description="Once learners start practising topics, mastery trends will appear here."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {bandCounts.map((b) => (
              <div key={b.key} className={`card border p-4 ${b.tone}`}>
                <p className="text-xs font-semibold uppercase tracking-wide">{b.label}</p>
                <p className="mt-1 text-2xl font-extrabold">{b.count}</p>
                <p className="text-xs">
                  {b.min}–{b.max}% mastery
                </p>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-navy-900">Average mastery by topic</h3>
            <p className="mt-1 text-sm text-navy-500">Lowest first — these are the topics most learners could use extra support with.</p>
            <div className="mt-4 space-y-4">
              {topicAverages.map(({ topicId, avg, topic }) => (
                <div key={topicId}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-navy-900">{topic?.name ?? topicId}</span>
                    <span className="text-navy-600">{avg}%</span>
                  </div>
                  <ProgressBar percent={avg} size="sm" className="mt-1.5" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
