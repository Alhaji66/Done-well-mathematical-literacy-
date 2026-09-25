import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterLearner, type RosterProgressRow } from '@/lib/teacherRoster'
import { fetchDepartmentTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { learnersInScope, scopeSubjectFor } from '@/lib/teacherScope'
import { subjects } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ParticipationPanel } from '@/components/account/ParticipationPanel'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon, SchoolIcon } from '@/components/ui/Icons'
import { TeachingSubject } from '@/components/account/TeachingSubject'
import { PendingStaff } from '@/components/account/PendingStaff'

/**
 * What a Head of Department is looking at, as opposed to a teacher or a
 * principal.
 *
 * A teacher's dashboard answers "how are MY classes doing" -- their subject,
 * their grades. A principal's answers "how is the school doing" -- everything,
 * every subject. Neither answers the question an HOD actually has, which is
 * "how is MY SUBJECT doing across every teacher and every grade". So this page
 * is scoped by subject and deliberately NOT by grade: all three grades in the
 * department are the department's.
 */
export function HodDashboard() {
  const { profile } = useAccountAuth()
  const subjectId = scopeSubjectFor(profile)

  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [teachers, setTeachers] = useState<SchoolTeacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.school_id || !subjectId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    const load = async () => {
      const [roster, staff] = await Promise.all([
        fetchSchoolLearners(profile.school_id!),
        fetchDepartmentTeachers(profile.school_id!, subjectId),
      ])
      const mine = learnersInScope(roster, subjectId)
      const rows = mine.length ? await fetchProgressForLearners(mine.map((l) => l.id)) : []
      if (!active) return
      setLearners(mine)
      setTeachers(staff)
      setProgress(rows)
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [profile?.school_id, subjectId])

  if (!profile) return null

  const subjectName = subjects.find((s) => s.id === subjectId)?.name ?? 'your subject'

  /*
   * The department average is the mean of each learner's own average, not the
   * mean of every progress row. Those differ whenever learners have attempted
   * different numbers of topics, and the row-mean quietly weights the busiest
   * learner heaviest -- which would make the department look like whoever
   * practises most.
   */
  const scored = learners.map((l) => averageMastery(l.id, progress)).filter((v): v is number => v !== null)
  const departmentAverage = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : null

  const byGrade = [10, 11, 12].map((g) => ({
    grade: g,
    count: learners.filter((l) => l.grade === g).length,
  }))

  if (!subjectId) {
    return (
      <div className="space-y-6">
        <SectionHeading eyebrow="Dashboard" title="Head of Department" description="Your department is your subject." />
        {/* The control, not just the complaint -- they can fix it right here. */}
        <TeachingSubject profile={profile} variant="hod" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Dashboard"
        title={`${subjectName} department`}
        description="Every teacher and every learner taking this subject at your school, across all three grades."
      />

      <TeachingSubject profile={profile} variant="hod" />

      <PendingStaff schoolId={profile?.school_id ?? null} />

      {loading ? (
        <p className="text-sm text-navy-500">Loading your department…</p>
      ) : learners.length === 0 && teachers.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="Nobody in this department yet"
          description={`Once teachers and learners sign up with your school's join code and choose ${subjectName}, they'll appear here automatically.`}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Teachers</p>
              <p className="mt-1 text-2xl font-bold text-navy-900">{teachers.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Learners</p>
              <p className="mt-1 text-2xl font-bold text-navy-900">{learners.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Department average</p>
              <p className="mt-1 text-2xl font-bold text-navy-900">
                {departmentAverage === null ? '—' : `${departmentAverage}%`}
              </p>
              {/*
                An average over nobody is not 0%, it is unknown, and printing 0%
                would read as a department failing rather than a department that
                has not practised yet.
              */}
              <p className="mt-1 text-xs text-navy-500">
                {scored.length === 0
                  ? 'No learner has practised yet'
                  : `Across ${scored.length} learner${scored.length === 1 ? '' : 's'} who have practised`}
              </p>
            </div>
          </div>

          <ParticipationPanel learners={learners} title="Participation in your department" byGrade />

          <div className="card p-5">
            <p className="text-sm font-semibold text-navy-900">Learners by grade</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {byGrade.map((g) => (
                <div key={g.grade} className="rounded-lg border border-navy-100 p-3">
                  <p className="text-xs font-medium text-navy-500">Grade {g.grade}</p>
                  <p className="mt-0.5 text-lg font-bold text-navy-900">{g.count}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
