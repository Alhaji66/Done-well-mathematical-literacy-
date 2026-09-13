import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  deleteMyAccount,
  downloadExport,
  exportMyData,
  fetchConsents,
  fetchLinkedPeople,
  removeLink,
  withdrawConsent,
  type ConsentRow,
  type LinkedPerson,
} from '@/lib/privacy'

/**
 * The page where POPIA rights are actually exercised rather than described.
 *
 * The notice at /popia explains the rights; this is where a learner or parent
 * uses them: see what is held, take a copy, see who can read their progress,
 * cut a link, withdraw a consent, or delete the account.
 */
export function AccountPrivacy() {
  const { profile, session } = useAccountAuth()
  const [consents, setConsents] = useState<ConsentRow[]>([])
  const [linked, setLinked] = useState<LinkedPerson[]>([])
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    if (!profile) return
    fetchConsents(profile.id).then(setConsents)
    fetchLinkedPeople(profile.id).then(setLinked)
  }, [profile])

  if (!profile) return null

  const held = [
    { label: 'Your name', value: profile.full_name },
    { label: 'Your email address', value: session?.user.email ?? '—' },
    { label: 'Your role', value: profile.role },
    ...(profile.grade ? [{ label: 'Your grade', value: `Grade ${profile.grade}` }] : []),
    ...(profile.subject_id ? [{ label: 'Your subject', value: profile.subject_id }] : []),
    { label: 'Topics you have practised', value: 'One row per topic, with a mastery percentage' },
  ]

  const handleExport = async () => {
    setBusy('export')
    setError('')
    setMessage('')
    try {
      const data = await exportMyData(profile.id)
      downloadExport(data, profile.full_name)
      setMessage('Your data has been downloaded as a JSON file.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not prepare your data. Please try again.')
    } finally {
      setBusy('')
    }
  }

  const handleUnlink = async (person: LinkedPerson) => {
    setBusy(person.profileId)
    setError('')
    setMessage('')
    const { error: err } = await removeLink(profile.id, person.profileId, person.relationship)
    if (err) setError(err)
    else {
      setLinked((prev) => prev.filter((p) => p.profileId !== person.profileId))
      setMessage(`${person.fullName} can no longer see this progress.`)
    }
    setBusy('')
  }

  const handleWithdraw = async (consent: ConsentRow) => {
    setBusy(consent.id)
    setError('')
    setMessage('')
    const { error: err } = await withdrawConsent(consent.id)
    if (err) setError(err)
    else {
      setConsents((prev) =>
        prev.map((c) => (c.id === consent.id ? { ...c, withdrawn_at: new Date().toISOString() } : c)),
      )
      setMessage('Consent withdrawn. Please also delete the account below if you want the information removed now.')
    }
    setBusy('')
  }

  const handleDelete = async () => {
    setBusy('delete')
    setError('')
    const { error: err } = await deleteMyAccount()
    if (err) {
      setError(err)
      setBusy('')
    }
    // On success deleteMyAccount signs out, so the auth context unmounts this page.
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Privacy &amp; data"
        title="What we hold about you"
        description="Under POPIA you can see this information, take a copy of it, and have it deleted. You can do all three here."
      />

      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="card p-5">
        <h2 className="text-base font-bold text-navy-900">Information we hold</h2>
        <dl className="mt-3 divide-y divide-navy-100">
          {held.map((row) => (
            <div key={row.label} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2.5">
              <dt className="text-sm text-navy-600">{row.label}</dt>
              <dd className="text-sm font-semibold text-navy-900">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-navy-500">
          The answers you type into a question stay in your own browser and are never sent to us. The{' '}
          <Link to="/popia" className="font-semibold underline">
            POPIA notice
          </Link>{' '}
          explains why each item is kept.
        </p>
        <button type="button" onClick={handleExport} disabled={busy === 'export'} className="btn-secondary mt-4">
          {busy === 'export' ? 'Preparing…' : 'Download everything we hold'}
        </button>
      </section>

      <section className="card p-5">
        <h2 className="text-base font-bold text-navy-900">Who can see your progress</h2>
        {linked.length === 0 ? (
          <p className="mt-2 text-sm text-navy-600">
            Nobody outside your school is linked to this account.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-navy-100">
            {linked.map((person) => (
              <li key={person.profileId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  <span className="block text-sm font-semibold text-navy-900">{person.fullName}</span>
                  <span className="block text-xs text-navy-500">
                    {person.relationship === 'parent'
                      ? 'Can see your progress as your parent or guardian'
                      : 'You can see their progress as their parent or guardian'}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => handleUnlink(person)}
                  disabled={busy === person.profileId}
                  className="btn-secondary text-xs"
                >
                  {busy === person.profileId ? 'Removing…' : 'Remove link'}
                </button>
              </li>
            ))}
          </ul>
        )}
        {profile.school_id ? (
          <p className="mt-3 text-xs text-navy-500">
            Teachers and staff at your school can also see your progress, because your account is registered to that
            school.
          </p>
        ) : null}
      </section>

      <section className="card p-5">
        <h2 className="text-base font-bold text-navy-900">Your permission</h2>
        {consents.length === 0 ? (
          <p className="mt-2 text-sm text-navy-600">No consent record found for this account.</p>
        ) : (
          <ul className="mt-3 divide-y divide-navy-100">
            {consents.map((consent) => (
              <li key={consent.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  <span className="block text-sm font-semibold text-navy-900">
                    {consent.kind === 'guardian'
                      ? `Given by ${consent.guardian_name ?? 'a parent or guardian'}`
                      : 'Given by you'}
                  </span>
                  <span className="block text-xs text-navy-500">
                    {new Date(consent.granted_at).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {' · notice version '}
                    {consent.notice_version}
                    {consent.withdrawn_at ? ' · withdrawn' : ''}
                  </span>
                </span>
                {consent.withdrawn_at ? null : (
                  <button
                    type="button"
                    onClick={() => handleWithdraw(consent)}
                    disabled={busy === consent.id}
                    className="btn-secondary text-xs"
                  >
                    {busy === consent.id ? 'Withdrawing…' : 'Withdraw'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card border-rose-200 p-5">
        <h2 className="text-base font-bold text-navy-900">Delete this account</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          This removes your profile, your progress on every topic, any links to a parent or child, and your consent
          record. It cannot be undone, so download your data first if you want to keep it.
        </p>
        <p className="mt-2 text-xs text-navy-500">
          Your email address sits in our sign-in system, which this button cannot reach. Email{' '}
          <a href="mailto:donewellpublication@gmail.com" className="font-semibold underline">
            donewellpublication@gmail.com
          </a>{' '}
          and we will remove that too.
        </p>
        <label className="mt-4 block text-xs font-medium text-navy-500" htmlFor="confirmDelete">
          Type DELETE to confirm
        </label>
        <input
          id="confirmDelete"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="input mt-1 max-w-xs"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleDelete}
          disabled={confirmText !== 'DELETE' || busy === 'delete'}
          className="mt-3 inline-flex items-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-navy-400"
        >
          {busy === 'delete' ? 'Deleting…' : 'Delete my account and data'}
        </button>
      </section>
    </div>
  )
}
