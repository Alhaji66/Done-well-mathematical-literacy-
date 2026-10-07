import { useEffect, useState } from 'react'
import { decideLearner, fetchPendingLearners, fetchSeatStatus, type PendingLearner, type SeatStatus } from '@/lib/learnerApproval'
import { subjects } from '@/data/subjects'
import { UsersIcon } from '@/components/ui/Icons'

/** "12 of 300 places used", or "no limit" for a school without one. */
export function placesLine(seats: SeatStatus): string {
  if (seats.licence === 'ended') {
    const on = seats.licenceEndsOn
      ? ` on ${new Date(`${seats.licenceEndsOn}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}`
      : ''
    return `${seats.used} learner${seats.used === 1 ? '' : 's'} · the school's licence ended${on}, so new learners wait until it is renewed`
  }
  if (seats.seats === null) return `${seats.used} learner${seats.used === 1 ? '' : 's'} · no limit on this licence`
  const free = Math.max(0, seats.seats - seats.used)
  return `${seats.used} of ${seats.seats} paid places used · ${free} free`
}

/**
 * Learners who joined with the school code and are waiting for staff to let
 * them in. Shown on every staff dashboard, and only when somebody is waiting.
 *
 * Approving gives the school a learner and uses one of its paid places; the
 * database refuses once the places are used, and that refusal is shown here
 * as it is, because it says what to do next.
 */
export function PendingLearners({ schoolId }: { schoolId: string | null }) {
  const [people, setPeople] = useState<PendingLearner[]>([])
  const [seats, setSeats] = useState<SeatStatus | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!schoolId) return
    let active = true
    Promise.all([fetchPendingLearners(schoolId), fetchSeatStatus()]).then(([rows, status]) => {
      if (!active) return
      setPeople(rows)
      setSeats(status)
    })
    return () => {
      active = false
    }
  }, [schoolId])

  if (!schoolId || people.length === 0) return null

  const refreshSeats = () => fetchSeatStatus().then(setSeats)

  const decide = async (id: string, approve: boolean) => {
    setBusy(id)
    setError('')
    const failure = await decideLearner(id, approve)
    setBusy(null)
    if (failure) {
      setError(failure)
      return
    }
    setPeople((rows) => rows.filter((r) => r.id !== id))
    void refreshSeats()
  }

  // One at a time, so that when the places run out the rest stay waiting and
  // the reason is shown once.
  const approveAll = async () => {
    setBusy('all')
    setError('')
    for (const p of people) {
      const failure = await decideLearner(p.id, true)
      if (failure) {
        setError(failure)
        break
      }
      setPeople((rows) => rows.filter((r) => r.id !== p.id))
    }
    setBusy(null)
    void refreshSeats()
  }

  const full = seats !== null && seats.seats !== null && seats.used >= seats.seats

  return (
    <section className="card border-amber-300 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <UsersIcon className="h-4 w-4 text-amber-700" />
        <h2 className="text-sm font-bold text-navy-900">Learners waiting to join</h2>
        <span className="badge-slate">{people.length}</span>
        {people.length > 1 && !full ? (
          <button type="button" disabled={busy !== null} onClick={() => void approveAll()} className="btn-outline btn-sm ml-auto">
            Approve all
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-navy-600">
        They signed up with your school code. Approve only learners you know are at this school: an approved learner sees
        your tests and uses one of your paid places.
      </p>
      {seats ? (
        <p className={full ? 'mt-2 text-xs font-semibold text-rose-700' : 'mt-2 text-xs text-navy-500'}>
          {placesLine(seats)}
          {full ? ' — remove learners who have left, or ask DONE WELL for more places, before approving more.' : ''}
        </p>
      ) : null}
      <ul className="mt-3 divide-y divide-navy-100">
        {people.map((p) => (
          <li key={p.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-navy-900">{p.full_name}</p>
              <p className="text-xs text-navy-500">
                {p.grade ? `Grade ${p.grade}` : 'Learner'}
                {p.subject_id ? ` · ${subjects.find((s) => s.id === p.subject_id)?.name ?? p.subject_id}` : ''} · joined{' '}
                {new Date(p.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" disabled={busy !== null || full} onClick={() => void decide(p.id, true)} className="btn-primary btn-sm">
                Approve
              </button>
              <button type="button" disabled={busy !== null} onClick={() => void decide(p.id, false)} className="btn-ghost btn-sm">
                Not at this school
              </button>
            </div>
          </li>
        ))}
      </ul>
      {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
    </section>
  )
}
