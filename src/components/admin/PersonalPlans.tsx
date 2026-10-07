import { useEffect, useState, type FormEvent } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  PERSONAL_PLAN_LABEL,
  endPersonalPlan,
  fetchPersonalPlans,
  grantPersonalPlan,
  suggestedPlanEnd,
  type PersonalPlan,
  type PersonalPlanRow,
} from '@/lib/access'

const shortDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })

/**
 * Personal plans, for the platform console (STEP 39). Someone pays by EFT with
 * their sign-in email as the reference; the administrator records the plan
 * here against that email, and the account has the full question bank until
 * the end date. A plan bought while another is running starts the day after
 * it ends. Only emails are shown -- the payer gave theirs with the payment.
 */
export function PersonalPlans() {
  const [rows, setRows] = useState<PersonalPlanRow[]>([])
  const [loadError, setLoadError] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState<PersonalPlan>('year')
  const [endsOn, setEndsOn] = useState(() => suggestedPlanEnd('year'))
  const [reference, setReference] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showEnded, setShowEnded] = useState(false)

  const load = async () => {
    const r = await fetchPersonalPlans()
    setRows(r.rows)
    setLoadError(r.error ?? '')
  }
  useEffect(() => {
    void load()
  }, [])

  const choosePlan = (p: PersonalPlan) => {
    setPlan(p)
    setEndsOn(suggestedPlanEnd(p))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    const r = await grantPersonalPlan({ email, plan, endsOn, reference })
    setBusy(false)
    if (r.error) return setError(r.error)
    if (!r.found) return setError('No DONE WELL account uses that email. Check the spelling, or ask them to sign up first.')
    setNotice(`${PERSONAL_PLAN_LABEL[plan]} recorded for ${email.trim()}. They have the full question bank now.`)
    setEmail('')
    setReference('')
    await load()
  }

  const end = async (row: PersonalPlanRow) => {
    if (!window.confirm(`End the plan for ${row.email}? They keep their account and progress, but lose the full question bank today.`)) return
    setBusy(true)
    setError('')
    setNotice('')
    const message = await endPersonalPlan(row.id)
    setBusy(false)
    if (message) return setError(message)
    setNotice(`Plan for ${row.email} ended.`)
    await load()
  }

  const today = new Date().toISOString().slice(0, 10)
  const running = rows.filter((r) => r.ends_on >= today)
  const shown = showEnded ? rows : running

  return (
    <section className="space-y-4">
      <SectionHeading
        eyebrow="Individuals"
        title="Personal plans"
        description="A learner or parent who paid by EFT. Record the plan against their sign-in email and they have every question and paper until the end date."
      />

      {loadError ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          Personal plans could not be loaded: {loadError}. If this says a function is missing, STEP 39 has not been run in Supabase yet.
        </p>
      ) : null}
      {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      {notice ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}

      <form onSubmit={submit} className="card grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium text-navy-500 sm:col-span-2">
          Their sign-in email
          <input type="email" required className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="text-xs font-medium text-navy-500">
          Plan
          <select className="select mt-1" value={plan} onChange={(e) => choosePlan(e.target.value as PersonalPlan)}>
            {(Object.keys(PERSONAL_PLAN_LABEL) as PersonalPlan[]).map((p) => (
              <option key={p} value={p}>
                {PERSONAL_PLAN_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-navy-500">
          Ends on
          <input type="date" required min={today} className="input mt-1" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} />
        </label>
        <label className="text-xs font-medium text-navy-500 sm:col-span-2 lg:col-span-3">
          Payment reference (optional)
          <input
            maxLength={120}
            className="input mt-1"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. EFT 12 Oct, R399"
          />
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={busy} className="btn-primary w-full">
            Record plan
          </button>
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-left text-xs text-navy-500">
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Plan</th>
              <th className="p-3 font-medium">From</th>
              <th className="p-3 font-medium">To</th>
              <th className="p-3 font-medium">Reference</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 tabular-nums">
            {shown.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-navy-500">
                  {showEnded ? 'No personal plans yet.' : 'No running personal plans.'}
                </td>
              </tr>
            ) : (
              shown.map((r) => {
                const over = r.ends_on < today
                return (
                  <tr key={r.id} className={over ? 'text-navy-400' : undefined}>
                    <td className="p-3 font-medium text-navy-900">{r.email}</td>
                    <td className="p-3">{PERSONAL_PLAN_LABEL[r.plan] ?? r.plan}</td>
                    <td className="p-3">{shortDate(r.starts_on)}</td>
                    <td className="p-3">{over ? `Ended ${shortDate(r.ends_on)}` : shortDate(r.ends_on)}</td>
                    <td className="p-3 text-navy-600">{r.reference ?? '—'}</td>
                    <td className="p-3 text-right">
                      {over ? null : (
                        <button type="button" disabled={busy} onClick={() => void end(r)} className="btn-ghost btn-sm text-rose-700">
                          End plan
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {rows.length > running.length ? (
        <button type="button" onClick={() => setShowEnded((v) => !v)} className="btn-ghost btn-sm">
          {showEnded ? 'Hide ended plans' : `Show ended plans (${rows.length - running.length})`}
        </button>
      ) : null}
    </section>
  )
}
