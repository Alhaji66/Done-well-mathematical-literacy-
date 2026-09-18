import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterLearner, type RosterProgressRow } from '@/lib/teacherRoster'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/Icons'
import { SchoolJoinCode } from '@/components/account/SchoolJoinCode'
import { TeachingSubject } from '@/components/account/TeachingSubject'
import { TeachingGrades } from '@/components/account/TeachingGrades'
import {
  ALL_GRADES,
  scopeSubjectFor,
  learnersInScope,
  learnersInGrades,
  progressInScope,
  readTeachingGrades,
  setAccountRole,
} from '@/lib/teacherScope'

// All four subjects. This listed only two, so a Life Sciences or Physical
// Sciences learner appeared on the roster with an empty subject column.
const subjectNames: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
  'life-sciences': 'Life Sciences',
  'physical-sciences': 'Physical Sciences',
}

export function TeacherDashboard() {
  const { profile } = useAccountAuth()
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [correcting, setCorrecting] = useState<string | null>(null)
  const [correctionError, setCorrectionError] = useState('')
  const [grades, setGrades] = useState<number[]>([...ALL_GRADES])

  // The profile arrives after the first render, so the saved grade filter has
  // to be picked up once it does rather than only in the initial state.
  useEffect(() => {
    if (profile?.id) setGrades(readTeachingGrades(profile.id))
  }, [profile?.id])

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

    const scope = scopeSubjectFor(profile)

    fetchSchoolLearners(profile.school_id).then(async (rosterLearners) => {
      if (!active) return
      // A teacher's roster is their own subject, not the whole school. Without
      // this a Mathematical Literacy teacher was listing Life Sciences learners
      // they have never taught.
      const mine = learnersInScope(rosterLearners, scope)
      setLearners(mine)
      const rows = await fetchProgressForLearners(mine.map((l) => l.id))
      if (active) {
        // Filter by the TOPIC's subject too. The roster filter only asks what a
        // learner registered for; a Mathematical Literacy learner who has also
        // practised a Life Sciences topic was still dragging that topic into
        // this teacher's class average.
        setProgress(progressInScope(rows, scope))
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
    // subject_id belongs here: without it, changing the subject you teach left
    // the roster showing the previous subject's learners until a full reload.
  }, [profile?.school_id, profile?.role, profile?.subject_id])

  const correctRole = async (id: string, role: 'teacher' | 'parent') => {
    const message = await setAccountRole(id, role)
    setCorrecting(null)
    if (message) {
      setCorrectionError(message)
      return
    }
    setCorrectionError('')
    // Drop them from the roster in place rather than refetching the world.
    setLearners((rows) => rows.filter((l) => l.id !== id))
  }

  if (!profile) return null

  // The grade filter is applied here rather than in the fetch, so toggling a
  // grade is instant instead of a round trip.
  const visible = learnersInGrades(learners, grades)

  const learnerAverages = visible
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

      <SchoolJoinCode schoolId={profile.school_id} />

      <TeachingSubject profile={profile} />

      <TeachingGrades profileId={profile.id} grades={grades} onChange={setGrades} />

      {correctionError ? <p className="text-sm text-rose-600">{correctionError}</p> : null}

      {loading ? (
        <p className="text-sm text-navy-500">Loading your roster…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title={learners.length > 0 ? 'No learners in the grades you selected' : 'No learners have joined yet'}
          description={
            learners.length > 0
              ? `You have ${learners.length} learner${learners.length === 1 ? '' : 's'}, but none in the grades above. Turn a grade back on to see them.`
              : `Give the join code above to your students at ${schoolName ?? 'your school'} -- once they sign up and enter it, they'll show up here automatically.`
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Learners</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{visible.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-navy-500">Class average mastery</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{classAverage}%</p>
              <ProgressBar percent={classAverage} className="mt-2" size="sm" label="Class average mastery" />
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
                {mastery !== null ? <ProgressBar percent={mastery} className="mt-3" label={`${learner.full_name} overall mastery`} /> : (
                  <p className="mt-2 text-xs text-navy-400">No practice recorded yet</p>
                )}

                {/* Anybody can mistap the role picker on the first screen they
                    ever see, and a colleague who did lands here with a mastery
                    bar. Correcting it needed a database administrator until now. */}
                {correcting === learner.id ? (
                  <div className="mt-3 border-t border-navy-100 pt-3">
                    <p className="text-xs text-navy-600">Move {learner.full_name} off the class list as a…</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['teacher', 'parent'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => correctRole(learner.id, r)}
                          className="btn-outline text-xs capitalize"
                        >
                          {r}
                        </button>
                      ))}
                      <button type="button" onClick={() => setCorrecting(null)} className="text-xs text-navy-500 underline">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCorrecting(learner.id)}
                    className="mt-3 text-xs text-navy-400 underline hover:text-navy-700"
                  >
                    Not a learner?
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
