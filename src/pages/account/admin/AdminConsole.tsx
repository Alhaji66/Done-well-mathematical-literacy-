import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { ConsoleShell } from '@/components/layout/ConsoleShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import {
  PLAN_LABEL,
  STATUS_LABEL,
  addSponsorMember,
  createProgramme,
  createSponsor,
  fetchSchoolOverview,
  fetchSponsorsAndProgrammes,
  fetchSubscriptions,
  saveSubscription,
  setProgrammeSchool,
  setSchoolSuspended,
  usePlatformAccess,
  type Plan,
  type Programme,
  type ProgrammeSchool,
  type SchoolOverview,
  type Sponsor,
  type Subscription,
  type SubscriptionStatus,
} from '@/lib/platform'

const shortDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/**
 * The platform console, for DONE WELL's own administrators.
 *
 * Schools in counts -- learners, staff, active this week, licence and seats --
 * with the two things an administrator does to a school: pause it, and set its
 * licence. Below that, sponsors and their programmes. There are no learner
 * names anywhere on this page, by design: nothing an administrator needs to
 * run the platform requires them.
 */
export function AdminConsole() {
  const { session } = useAccountAuth()
  const access = usePlatformAccess(session?.user.id)

  const [schools, setSchools] = useState<SchoolOverview[]>([])
  const [subs, setSubs] = useState<Subscription[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [links, setLinks] = useState<ProgrammeSchool[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState('')

  const load = async () => {
    const [overview, allSubs, sp] = await Promise.all([fetchSchoolOverview(), fetchSubscriptions(), fetchSponsorsAndProgrammes()])
    setSchools(overview.rows)
    setError(overview.error ?? '')
    setSubs(allSubs)
    setSponsors(sp.sponsors)
    setProgrammes(sp.programmes)
    setLinks(sp.links)
  }

  useEffect(() => {
    if (access.admin) void load()
  }, [access.admin])

  const act = async (fn: () => Promise<string | undefined>, done?: string) => {
    setBusy(true)
    setError('')
    setNotice('')
    const message = await fn()
    setBusy(false)
    if (message) setError(message)
    else {
      if (done) setNotice(done)
      await load()
    }
  }

  // ------------------------------------------------------------- licence form
  const [editing, setEditing] = useState<string | null>(null)
  const [plan, setPlan] = useState<Plan>('school')
  const [status, setStatus] = useState<SubscriptionStatus>('active')
  const [seats, setSeats] = useState('')
  const [startsOn, setStartsOn] = useState('')
  const [endsOn, setEndsOn] = useState('')
  const [programmeId, setProgrammeId] = useState('')

  const openLicence = (schoolId: string) => {
    const current = subs.find((s) => s.school_id === schoolId)
    setEditing(schoolId)
    setPlan(current?.plan ?? 'school')
    setStatus(current?.status ?? 'active')
    setSeats(current?.learner_seats?.toString() ?? '')
    setStartsOn(current?.starts_on ?? new Date().toISOString().slice(0, 10))
    setEndsOn(current?.ends_on ?? '')
    setProgrammeId(current?.programme_id ?? '')
  }

  const saveLicence = (e: FormEvent, schoolId: string, existing?: Subscription) => {
    e.preventDefault()
    void act(
      () =>
        saveSubscription({
          id: existing?.id,
          school_id: schoolId,
          plan,
          status,
          learner_seats: seats === '' ? null : Number(seats),
          starts_on: startsOn,
          ends_on: endsOn || null,
          programme_id: programmeId || null,
        }),
      'Licence saved.',
    ).then(() => setEditing(null))
  }

  // ------------------------------------------------------- sponsors, programmes
  const [newSponsor, setNewSponsor] = useState('')
  const [progSponsor, setProgSponsor] = useState('')
  const [progName, setProgName] = useState('')
  const [progStart, setProgStart] = useState('')
  const [progEnd, setProgEnd] = useState('')
  const [memberSponsor, setMemberSponsor] = useState('')
  const [memberEmail, setMemberEmail] = useState('')

  if (!access.checked) {
    return (
      <ConsoleShell title="Platform console">
        <p className="text-sm text-navy-500">Checking your access…</p>
      </ConsoleShell>
    )
  }
  if (!access.admin) {
    return (
      <ConsoleShell title="Platform console">
        <div className="card max-w-xl p-6 text-sm text-navy-700">
          <h2 className="text-lg font-bold text-navy-900">This page is for DONE WELL administrators</h2>
          <p className="mt-2">
            Your account is not a platform administrator. Administrators are added by DONE WELL directly in the database,
            never from inside the app.
          </p>
          <Link to="/account" className="btn-outline btn-sm mt-4 inline-flex">
            Back to my account
          </Link>
        </div>
      </ConsoleShell>
    )
  }

  const shown = schools.filter((s) => s.name.toLowerCase().includes(filter.trim().toLowerCase()))
  const totals = {
    schools: schools.length,
    learners: schools.reduce((a, s) => a + s.learners, 0),
    active: schools.reduce((a, s) => a + s.active_7d, 0),
    paused: schools.filter((s) => s.suspended_at).length,
  }

  return (
    <ConsoleShell title="Platform console">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Platform"
          title="Schools and licences"
          description="Every school in counts — no learner is named on this page. Pause a school to stop its staff seeing learner data; set its licence and seats."
        />

        {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        {notice ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}

        <dl className="grid gap-4 sm:grid-cols-4">
          {[
            ['Schools', totals.schools],
            ['Learners', totals.learners],
            ['Active learners this week', totals.active],
            ['Paused schools', totals.paused],
          ].map(([label, value]) => (
            <div key={label} className="card p-5">
              <dt className="text-xs font-medium text-navy-500">{label}</dt>
              <dd className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="space-y-3">
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find a school…"
            className="input max-w-sm"
            aria-label="Find a school"
          />
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-left text-xs text-navy-500">
                  <th className="p-3 font-medium">School</th>
                  <th className="p-3 text-right font-medium">Learners</th>
                  <th className="p-3 text-right font-medium">Staff</th>
                  <th className="p-3 text-right font-medium">Active (7d)</th>
                  <th className="p-3 font-medium">Licence</th>
                  <th className="p-3 font-medium">Seats</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50 tabular-nums">
                {shown.map((s) => {
                  const over = s.learner_seats !== null && s.learners > s.learner_seats
                  const existing = subs.find((x) => x.school_id === s.school_id)
                  return (
                    <tr key={s.school_id} className={cn(s.suspended_at && 'bg-navy-50/60')}>
                      <td className="p-3">
                        <p className="font-semibold text-navy-900">{s.name}</p>
                        <p className="text-xs text-navy-500">
                          Joined {shortDate(s.created_at)}
                          {s.suspended_at ? <span className="ml-2 font-semibold text-rose-700">Paused {shortDate(s.suspended_at)}</span> : null}
                          {s.pending_staff ? <span className="ml-2 text-amber-700">{s.pending_staff} awaiting approval</span> : null}
                        </p>
                      </td>
                      <td className="p-3 text-right">{s.learners}</td>
                      <td className="p-3 text-right">{s.staff}</td>
                      <td className="p-3 text-right">{s.active_7d}</td>
                      <td className="p-3">
                        {s.plan ? (
                          <>
                            <span className="text-navy-900">{PLAN_LABEL[s.plan]}</span>
                            <span className="block text-xs text-navy-500">
                              {s.status ? STATUS_LABEL[s.status] : ''}
                              {s.ends_on ? ` · to ${shortDate(s.ends_on)}` : ''}
                            </span>
                          </>
                        ) : (
                          <span className="text-navy-400">None</span>
                        )}
                      </td>
                      <td className={cn('p-3', over && 'font-semibold text-rose-700')}>
                        {s.learner_seats === null ? '—' : `${s.learners} / ${s.learner_seats}`}
                        {over ? <span className="block text-xs">Over by {s.learners - s.learner_seats!}</span> : null}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openLicence(s.school_id)} className="btn-outline btn-sm">
                            Licence
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              act(
                                () => setSchoolSuspended(s.school_id, !s.suspended_at),
                                s.suspended_at ? `${s.name} reactivated.` : `${s.name} paused.`,
                              )
                            }
                            className={cn('btn-sm', s.suspended_at ? 'btn-primary' : 'btn-ghost text-rose-700')}
                          >
                            {s.suspended_at ? 'Reactivate' : 'Pause'}
                          </button>
                        </div>
                        {editing === s.school_id ? (
                          <form
                            onSubmit={(e) => saveLicence(e, s.school_id, existing)}
                            className="mt-3 grid gap-2 rounded-lg border border-navy-200 bg-white p-3 text-left sm:grid-cols-3"
                          >
                            <label className="text-xs text-navy-500">
                              Plan
                              <select className="select mt-1" value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>
                                {(Object.keys(PLAN_LABEL) as Plan[]).map((p) => (
                                  <option key={p} value={p}>
                                    {PLAN_LABEL[p]}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="text-xs text-navy-500">
                              Status
                              <select
                                className="select mt-1"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
                              >
                                {(Object.keys(STATUS_LABEL) as SubscriptionStatus[]).map((x) => (
                                  <option key={x} value={x}>
                                    {STATUS_LABEL[x]}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="text-xs text-navy-500">
                              Learner seats
                              <input type="number" min={0} className="input mt-1" value={seats} onChange={(e) => setSeats(e.target.value)} />
                            </label>
                            <label className="text-xs text-navy-500">
                              Starts
                              <input type="date" required className="input mt-1" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} />
                            </label>
                            <label className="text-xs text-navy-500">
                              Ends
                              <input type="date" className="input mt-1" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} />
                            </label>
                            <label className="text-xs text-navy-500">
                              Programme
                              <select className="select mt-1" value={programmeId} onChange={(e) => setProgrammeId(e.target.value)}>
                                <option value="">None</option>
                                {programmes.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <div className="flex gap-2 sm:col-span-3">
                              <button type="submit" disabled={busy} className="btn-primary btn-sm">
                                Save licence
                              </button>
                              <button type="button" onClick={() => setEditing(null)} className="btn-ghost btn-sm">
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow="Sponsors"
            title="Sponsors and programmes"
            description="A sponsor funds a programme of schools and sees its totals — never a learner. Schools with fewer than five learners are withheld from what a sponsor sees."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void act(() => createSponsor(newSponsor), 'Sponsor added.').then(() => setNewSponsor(''))
              }}
              className="card space-y-2 p-5"
            >
              <h3 className="font-bold text-navy-900">New sponsor</h3>
              <input className="input" required value={newSponsor} onChange={(e) => setNewSponsor(e.target.value)} placeholder="Organisation name" />
              <button type="submit" disabled={busy} className="btn-primary btn-sm">
                Add sponsor
              </button>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                void act(
                  () => createProgramme({ sponsorId: progSponsor, name: progName, startsOn: progStart, endsOn: progEnd }),
                  'Programme added.',
                ).then(() => setProgName(''))
              }}
              className="card space-y-2 p-5"
            >
              <h3 className="font-bold text-navy-900">New programme</h3>
              <select className="select" required value={progSponsor} onChange={(e) => setProgSponsor(e.target.value)}>
                <option value="">Sponsor…</option>
                {sponsors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input className="input" required value={progName} onChange={(e) => setProgName(e.target.value)} placeholder="Programme name" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="input" value={progStart} onChange={(e) => setProgStart(e.target.value)} aria-label="Starts" />
                <input type="date" className="input" value={progEnd} onChange={(e) => setProgEnd(e.target.value)} aria-label="Ends" />
              </div>
              <button type="submit" disabled={busy} className="btn-primary btn-sm">
                Add programme
              </button>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setBusy(true)
                setError('')
                setNotice('')
                addSponsorMember(memberSponsor, memberEmail).then((r) => {
                  setBusy(false)
                  if (r.error) setError(r.error)
                  else if (!r.found) setError('Nobody has signed in to DONE WELL with that email yet. Ask them to sign in once, then add them.')
                  else {
                    setNotice(`${memberEmail} can now see their sponsor's dashboard.`)
                    setMemberEmail('')
                  }
                })
              }}
              className="card space-y-2 p-5"
            >
              <h3 className="font-bold text-navy-900">Give a sponsor's person access</h3>
              <select className="select" required value={memberSponsor} onChange={(e) => setMemberSponsor(e.target.value)}>
                <option value="">Sponsor…</option>
                {sponsors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                type="email"
                className="input"
                required
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Their sign-in email"
              />
              <button type="submit" disabled={busy} className="btn-primary btn-sm">
                Give access
              </button>
              <p className="text-xs text-navy-400">They must have signed in once. The email is looked up, not stored.</p>
            </form>
          </div>

          {programmes.map((p) => {
            const inProg = new Set(links.filter((l) => l.programme_id === p.id).map((l) => l.school_id))
            return (
              <div key={p.id} className="card space-y-3 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy-900">{p.name}</h3>
                    <p className="text-xs text-navy-500">
                      {sponsors.find((s) => s.id === p.sponsor_id)?.name} · {shortDate(p.starts_on)} to {shortDate(p.ends_on)} ·{' '}
                      {inProg.size} school{inProg.size === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Link to={`/account/sponsor?programme=${p.id}`} className="text-sm font-semibold text-gold-700 underline">
                    See it as the sponsor does
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {schools.map((s) => {
                    const on = inProg.has(s.school_id)
                    return (
                      <button
                        key={s.school_id}
                        type="button"
                        disabled={busy}
                        aria-pressed={on}
                        onClick={() => act(() => setProgrammeSchool(p.id, s.school_id, !on))}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-xs font-medium',
                          on ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 bg-white text-navy-700 hover:border-navy-400',
                        )}
                      >
                        {s.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </ConsoleShell>
  )
}
