import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterLearner, type RosterProgressRow } from '@/lib/teacherRoster'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { subjects } from '@/data/subjects'
import { PendingLearners, placesLine } from '@/components/account/PendingLearners'
import { fetchSeatStatus, removeLearner, type SeatStatus } from '@/lib/learnerApproval'

// Every subject's name, from the one list of subjects.
const subjectNames: Record<string, string> = Object.fromEntries(subjects.map((s) => [s.id, s.name]))

export function SchoolLearners() {
  const { profile } = useAccountAuth()
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [grade, setGrade] = useState<10 | 11 | 12 | 'all'>('all')
  const [seats, setSeats] = useState<SeatStatus | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [removeError, setRemoveError] = useState('')

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let active = true

    fetchSeatStatus().then((status) => {
      if (active) setSeats(status)
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

  // A learner who has left the school: they keep their own account and
  // practice, the school stops seeing them, and their paid place is free again.
  const remove = async (id: string) => {
    setBusy(true)
    setRemoveError('')
    const failure = await removeLearner(id)
    setBusy(false)
    if (failure) {
      setRemoveError(failure)
      return
    }
    setRemoving(null)
    setLearners((rows) => rows.filter((l) => l.id !== id))
    fetchSeatStatus().then(setSeats)
  }

  const filtered = learners.filter((l) => grade === 'all' || l.grade === grade)
  const filteredAverages = filtered
    .map((l) => ({ learner: l, mastery: averageMastery(l.id, progress) }))
    .sort((a, b) => (a.mastery ?? -1) - (b.mastery ?? -1))

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Learners" title="Learner overview" description="Every learner the school has approved." />

      <PendingLearners schoolId={profile.school_id} />
      {seats ? <p className="text-sm text-navy-600">{placesLine(seats)}</p> : null}

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : learners.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="No learners have joined yet"
          description="Give them the join code from your dashboard. Once learners sign up with it and are approved, they'll show up here."
        />
      ) : (
        <>
          <div className="inline-flex flex-wrap gap-1 rounded-lg border border-navy-200 bg-white p-1">
            {(['all', 10, 11, 12] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={grade === g}
                onClick={() => setGrade(g)}
                className={cn('rounded-md px-3.5 py-1.5 text-sm font-semibold', grade === g ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50')}
              >
                {g === 'all' ? 'All grades' : `Grade ${g}`}
              </button>
            ))}
          </div>

          {removeError ? <p className="text-sm text-rose-700">{removeError}</p> : null}
          <div className="space-y-3">
            {filteredAverages.map(({ learner, mastery }) => (
              <div key={learner.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-navy-900">{learner.full_name}</h4>
                    <p className="text-xs text-navy-500">
                      {learner.grade ? `Grade ${learner.grade}` : ''}
                      {learner.subjects.length ? ` · ${learner.subjects.map((id) => subjectNames[id] ?? id).join(', ')}` : ''}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-navy-900">{mastery !== null ? `${mastery}%` : '—'}</span>
                </div>
                {mastery !== null ? <ProgressBar percent={mastery} className="mt-3" label={`${learner.full_name} overall mastery`} /> : <p className="mt-2 text-xs text-navy-400">No practice recorded yet</p>}
                {removing === learner.id ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-900">
                    <span className="flex-1">
                      Remove {learner.full_name} from the school? They keep their own account; the school stops seeing them and
                      their place is freed.
                    </span>
                    <button type="button" disabled={busy} onClick={() => void remove(learner.id)} className="btn-primary btn-sm">
                      Remove
                    </button>
                    <button type="button" disabled={busy} onClick={() => setRemoving(null)} className="btn-ghost btn-sm">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setRemoveError('')
                      setRemoving(learner.id)
                    }}
                    className="mt-2 text-xs text-navy-500 underline underline-offset-2"
                  >
                    Has left the school
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
