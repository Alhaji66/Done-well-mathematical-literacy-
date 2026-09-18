import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterProgressRow } from '@/lib/teacherRoster'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { BarChartIcon } from '@/components/ui/Icons'
import {
  ALL_GRADES,
  scopeSubjectFor,
  learnersInScope,
  learnersInGrades,
  progressInScope,
  readTeachingGrades,
} from '@/lib/teacherScope'
import { TeachingGrades } from '@/components/account/TeachingGrades'
import { getSubject } from '@/data/subjects'

const bandDefs = [
  { key: 'support', label: 'Needs support', min: 0, max: 39, tone: 'border-rose-200 bg-rose-50 text-rose-700' },
  { key: 'developing', label: 'Developing', min: 40, max: 69, tone: 'border-gold-200 bg-gold-50 text-gold-700' },
  { key: 'proficient', label: 'Proficient', min: 70, max: 100, tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
] as const

/**
 * Shared per-topic mastery breakdown, used by both Teacher and School
 * Analytics -- but no longer showing them the same thing.
 *
 * It used to. Both roles saw every learner at the school and every topic
 * anyone had touched, which is right for a school head and wrong for a
 * teacher: a Mathematical Literacy teacher opened their analytics and found
 * Reproduction in Vertebrates in the list, averaged over learners they do not
 * teach. A teacher is now scoped to the subject on their own profile; a school
 * account still sees the whole school, which is the point of that role.
 */
export function MasteryAnalytics() {
  const { profile } = useAccountAuth()
  const [learnerIds, setLearnerIds] = useState<string[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [grades, setGrades] = useState<number[]>([...ALL_GRADES])

  // Same saved filter the dashboard uses, so the two screens agree about which
  // class a teacher is looking at.
  useEffect(() => {
    if (profile?.id) setGrades(readTeachingGrades(profile.id))
  }, [profile?.id])

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let active = true

    const scope = scopeSubjectFor(profile)

    fetchSchoolLearners(profile.school_id).then(async (learners) => {
      if (!active) return
      const mine = learnersInGrades(learnersInScope(learners, scope), grades)
      const ids = mine.map((l) => l.id)
      setLearnerIds(ids)
      const rows = await fetchProgressForLearners(ids)
      if (active) {
        // Filter by the TOPIC's subject as well as by the learner: a learner
        // registered for one subject who has practised another would otherwise
        // bring a foreign topic into these averages.
        setProgress(progressInScope(rows, scope))
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // grades is a dependency: toggling a grade has to re-scope the averages,
    // not just the roster on the dashboard.
  }, [profile?.school_id, profile?.role, profile?.subject_id, grades])

  if (!profile) return null

  const scope = scopeSubjectFor(profile)
  const scopeName = scope ? (getSubject(scope)?.name ?? null) : null
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
      <SectionHeading
        eyebrow="Analytics"
        title={scopeName ? `${scopeName} — mastery breakdown` : 'Mastery breakdown'}
        description={
          scopeName
            ? `How practice mastery is distributed across your ${scopeName} learners. Other subjects at the school are not included.`
            : 'How practice mastery is distributed across every topic and learner at the school.'
        }
      />

      {scope ? <TeachingGrades profileId={profile.id} grades={grades} onChange={setGrades} /> : null}

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
                  <ProgressBar percent={avg} size="sm" className="mt-1.5" label={`${topic?.name ?? topicId} class average`} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
