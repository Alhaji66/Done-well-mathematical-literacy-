import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterLearner, type RosterProgressRow } from '@/lib/teacherRoster'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const subjectNames: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
}

export function SchoolLearners() {
  const { profile } = useAccountAuth()
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [grade, setGrade] = useState<10 | 11 | 12 | 'all'>('all')

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let active = true

    fetchSchoolLearners(profile.school_id).then(async (rosterLearners) => {
      if (!active) return
      setLearners(rosterLearners)
      const rows = await fetchProgressForLearners(rosterLearners.map((l) => l.id))
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

  const filtered = learners.filter((l) => grade === 'all' || l.grade === grade)
  const filteredAverages = filtered
    .map((l) => ({ learner: l, mastery: averageMastery(l.id, progress) }))
    .sort((a, b) => (a.mastery ?? -1) - (b.mastery ?? -1))

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Learners" title="Learner overview" description="Every learner signed up at your school." />

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : learners.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="No learners have joined yet"
          description="Once learners sign up and enter this same school name, they'll show up here automatically."
        />
      ) : (
        <>
          <div className="inline-flex flex-wrap gap-1 rounded-lg border border-navy-200 bg-white p-1">
            {(['all', 10, 11, 12] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={cn('rounded-md px-3.5 py-1.5 text-sm font-semibold', grade === g ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50')}
              >
                {g === 'all' ? 'All grades' : `Grade ${g}`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredAverages.map(({ learner, mastery }) => (
              <div key={learner.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-navy-900">{learner.full_name}</h4>
                    <p className="text-xs text-navy-500">
                      {learner.grade ? `Grade ${learner.grade}` : ''}
                      {learner.subject_id ? ` · ${subjectNames[learner.subject_id] ?? learner.subject_id}` : ''}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-navy-900">{mastery !== null ? `${mastery}%` : '—'}</span>
                </div>
                {mastery !== null ? <ProgressBar percent={mastery} className="mt-3" /> : <p className="mt-2 text-xs text-navy-400">No practice recorded yet</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
