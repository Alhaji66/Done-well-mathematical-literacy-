import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchMySchoolRequest, isAwaitingSchool, requestSchool } from '@/lib/learnerApproval'
import { SchoolIcon } from '@/components/ui/Icons'

/**
 * A learner's place at their school (STEP 34), on their own dashboard.
 *
 * Waiting for approval: says which school, and that practice works meanwhile
 * -- only the school's tests and classes wait. Not at a school (never joined,
 * turned away, or removed after leaving): a box for the code. Approved: nothing.
 */
export function SchoolMembership() {
  const { profile, refreshProfile } = useAccountAuth()
  const waiting = isAwaitingSchool(profile)
  const [school, setSchool] = useState<string | null>(null)
  const [changing, setChanging] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!waiting) return
    let active = true
    fetchMySchoolRequest().then((r) => {
      if (active) setSchool(r?.school ?? null)
    })
    return () => {
      active = false
    }
  }, [waiting])

  if (!profile || profile.role !== 'learner') return null
  // Before STEP 34 the column is missing: nobody is waiting, and the box for a
  // code would only confuse a learner who is already at their school.
  if (profile.learner_approved_at === undefined) return null
  const noSchool = !profile.school_id
  if (!waiting && !noSchool) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const result = await requestSchool(code)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setCode('')
    setChanging(false)
    await refreshProfile()
  }

  const form = (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-center gap-2">
      <label htmlFor="school-code" className="sr-only">
        School code
      </label>
      <input
        id="school-code"
        className="input w-40 font-mono uppercase tracking-[0.2em]"
        maxLength={9}
        placeholder="ABC123"
        autoComplete="off"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit" disabled={busy || !code.trim()} className="btn-primary btn-sm">
        {busy ? 'Checking…' : 'Join'}
      </button>
      {waiting ? (
        <button type="button" onClick={() => setChanging(false)} className="btn-ghost btn-sm">
          Cancel
        </button>
      ) : null}
      {error ? <p className="w-full text-xs text-rose-700">{error}</p> : null}
    </form>
  )

  if (waiting) {
    return (
      <section className="card border-amber-300 bg-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <SchoolIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-amber-900">Waiting for {school ?? 'your school'} to approve you</h2>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">
              A teacher at the school will let you in. Until then your school’s tests and classes will not show here — but you
              can practise, revise and track your own progress as normal.
            </p>
            {changing ? (
              form
            ) : (
              <button type="button" onClick={() => setChanging(true)} className="mt-2 text-xs text-amber-900 underline underline-offset-2">
                Wrong school? Enter a different code
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <SchoolIcon className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-navy-900">Join your school</h2>
          <p className="mt-1 text-xs leading-relaxed text-navy-600">
            If your school uses DONE WELL, enter the 6-character code your teacher gave you. Your school then approves you,
            and its tests and classes appear here.
          </p>
          {form}
        </div>
      </div>
    </section>
  )
}
