import { useEffect, useState } from 'react'
import { decideStaff, fetchPendingStaff, type PendingStaff as Pending } from '@/lib/staffApproval'
import { subjects } from '@/data/subjects'
import { UsersIcon } from '@/components/ui/Icons'

const ROLE_NAME: Record<string, string> = { teacher: 'Teacher', hod: 'Head of Department', school: 'School administrator' }

/**
 * Staff accounts at this school waiting for a colleague to vouch for them.
 *
 * Shown on every staff dashboard, and shown only when somebody is waiting -- an
 * empty "nobody pending" card on every visit would be noise. Approving grants
 * access to every learner's results at the school, so the card says so beside
 * the button rather than letting it read as a formality.
 */
export function PendingStaff({ schoolId }: { schoolId: string | null }) {
  const [people, setPeople] = useState<Pending[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!schoolId) return
    let active = true
    fetchPendingStaff(schoolId).then((rows) => {
      if (active) setPeople(rows)
    })
    return () => {
      active = false
    }
  }, [schoolId])

  if (!schoolId || people.length === 0) return null

  const decide = async (id: string, approve: boolean) => {
    setBusy(id)
    setError('')
    const failure = await decideStaff(id, approve)
    setBusy(null)
    if (failure) {
      setError(failure)
      return
    }
    setPeople((rows) => rows.filter((r) => r.id !== id))
  }

  return (
    <section className="card border-amber-300 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <UsersIcon className="h-4 w-4 text-amber-700" />
        <h2 className="text-sm font-bold text-navy-900">Staff waiting for approval</h2>
        <span className="badge-slate">{people.length}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-navy-600">
        Approve only people you know teach here. An approved staff account can see every learner's results at this
        school.
      </p>
      <ul className="mt-3 divide-y divide-navy-100">
        {people.map((p) => (
          <li key={p.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-navy-900">{p.full_name}</p>
              <p className="text-xs text-navy-500">
                {ROLE_NAME[p.role] ?? p.role}
                {p.subject_id ? ` · ${subjects.find((s) => s.id === p.subject_id)?.name ?? p.subject_id}` : ''} · signed up{' '}
                {new Date(p.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy === p.id}
                onClick={() => void decide(p.id, true)}
                className="btn-primary btn-sm"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busy === p.id}
                onClick={() => void decide(p.id, false)}
                className="btn-ghost btn-sm"
              >
                Not staff here
              </button>
            </div>
          </li>
        ))}
      </ul>
      {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
    </section>
  )
}
