import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import {
  fetchSchoolLearners,
  fetchProgressForLearners,
  averageMastery,
  type RosterLearner,
  type RosterProgressRow,
} from '@/lib/teacherRoster'
import { fetchSchoolTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/Icons'

const grades = [10, 11, 12] as const

export function SchoolDashboard() {
  const { profile } = useAccountAuth()
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [teachers, setTeachers] = useState<SchoolTeacher[]>([])
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

    fetchSchoolTeachers(profile.school_id).then((rows) => {
      if (active) setTeachers(rows)
    })

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

  const withMastery = learners
    .map((l) => ({ learner: l, mastery: averageMastery(l.id, progress) }))
    .filter((l): l is { learner: RosterLearner; mastery: number } => l.mastery !== null)

  const schoolAverage = withMastery.length ? Math.round(withMastery.reduce((s, l) => s + l.mastery, 0) / withMastery.length) : 0

  const gradeBreakdown = grades
    .map((grade) => {
      const inGrade = learners.filter((l) => l.grade === grade)
      const withData = withMastery.filter((l) => l.learner.grade === grade)
      const average = withData.length ? Math.round(withData.reduce((s, l) => s + l.mastery, 0) / withData.length) : 0
      return { grade, learnerCount: inGrade.length, average, hasData: withData.length > 0 }
    })
    .filter((g) => g.learnerCount > 0)

  const strugglingLearners = withMastery
    .slice()
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Dashboard" title={schoolName ?? 'Your school'} description="A whole-school snapshot of participation and performance." />

      {loading ? (
        <p className="text-sm text-navy-500">Loading school overview…</p>
      ) : learners.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="No one has joined yet"
          description={`Share the sign-in link with learners and teachers at ${schoolName ?? 'your school'} -- once they sign up and enter this same school name, they'll show up here automatically.`}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Learners</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{learners.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Teachers</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{teachers.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">School average mastery</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{schoolAverage}%</p>
              <ProgressBar percent={schoolAverage} className="mt-2" size="sm" />
            </div>
          </div>

          {gradeBreakdown.length > 0 ? (
            <div className="card p-5">
              <h3 className="font-bold text-navy-900">Performance by grade</h3>
              <div className="mt-4 space-y-4">
                {gradeBreakdown.map((g) => (
                  <div key={g.grade}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-navy-900">
                        Grade {g.grade} · {g.learnerCount} {g.learnerCount === 1 ? 'learner' : 'learners'}
                      </span>
                      <span className="text-navy-600">{g.hasData ? `${g.average}% average` : 'No practice yet'}</span>
                    </div>
                    <ProgressBar percent={g.average} size="sm" className="mt-1.5" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {strugglingLearners.length > 0 ? (
            <div className="card p-5">
              <h3 className="font-bold text-navy-900">Learners needing attention</h3>
              <p className="mt-1 text-sm text-navy-500">Lowest mastery school-wide, among learners who have practised.</p>
              <div className="mt-4 space-y-3">
                {strugglingLearners.map(({ learner, mastery }) => (
                  <div key={learner.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy-900">{learner.full_name}</p>
                      <p className="text-xs text-navy-500">{learner.grade ? `Grade ${learner.grade}` : ''}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-navy-900">{mastery}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
