import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterLearner, type RosterProgressRow } from '@/lib/teacherRoster'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/Icons'

const subjectNames: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
}

export function TeacherDashboard() {
  const { profile } = useAccountAuth()
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let active = true

    if (supabase) {
      supabase
        .from('schools')
        .select('name')
        .eq('id', profile.school_id)
        .maybeSingle()
        .then(({ data }) => {
          if (active) setSchoolName(data?.name ?? null)
        })
    }

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

  const learnerAverages = learners
    .map((l) => ({ learner: l, mastery: averageMastery(l.id, progress) }))
    .sort((a, b) => (a.mastery ?? -1) - (b.mastery ?? -1))
  const withData = learnerAverages.filter((l) => l.mastery !== null)
  const classAverage = withData.length
    ? Math.round(withData.reduce((s, l) => s + (l.mastery ?? 0), 0) / withData.length)
    : 0

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Dashboard"
        title={`Welcome, ${profile.full_name}`}
        description={schoolName ?? 'Your school'}
      />

      {loading ? (
        <p className="text-sm text-navy-500">Loading your roster…</p>
      ) : learners.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="No learners have joined yet"
          description={`Share the sign-in link with your students at ${schoolName ?? 'your school'} -- once they sign up and enter this same school name, they'll show up here automatically.`}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Learners</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{learners.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Class average mastery</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{classAverage}%</p>
              <ProgressBar percent={classAverage} className="mt-2" size="sm" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-navy-900">Learners</h3>
            {learnerAverages.map(({ learner, mastery }) => (
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
                {mastery !== null ? <ProgressBar percent={mastery} className="mt-3" /> : (
                  <p className="mt-2 text-xs text-navy-400">No practice recorded yet</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
