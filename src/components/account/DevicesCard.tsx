import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { deviceId, deviceLimit, fetchDevices, signOutDevice, type AccountDevice } from '@/lib/devices'

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

/**
 * The devices this account is signed in on (STEP 35), and the two things a
 * person needs when they suspect someone else is using it: sign the other
 * devices out, and change the password so they cannot sign back in.
 */
export function DevicesCard({ role }: { role: string }) {
  const [devices, setDevices] = useState<AccountDevice[] | null>(null)
  const [limit, setLimit] = useState<number | null>(null)
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const here = deviceId()

  const load = () => {
    fetchDevices().then(setDevices)
    deviceLimit().then(setLimit)
  }
  useEffect(load, [])

  // Before STEP 35 there is no device list to show.
  if (devices === null) return null

  const signOut = async (id: string) => {
    setBusy(id)
    setError('')
    setMessage('')
    const failure = await signOutDevice(id)
    setBusy('')
    if (failure) return setError(failure)
    setMessage('That device has been signed out. It will be asked to sign in again.')
    load()
  }

  const signOutOthers = async () => {
    if (!supabase) return
    setBusy('others')
    setError('')
    setMessage('')
    for (const d of devices.filter((x) => x.device_id !== here)) await signOutDevice(d.device_id)
    await supabase.auth.signOut({ scope: 'others' }).then(
      () => undefined,
      () => undefined,
    )
    setBusy('')
    setMessage('Every other device has been signed out.')
    load()
  }

  const changePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setMessage('')
    if (password.length < 8) return setError('Use at least 8 characters for your new password.')
    if (password !== repeat) return setError('The two passwords are not the same.')
    setBusy('password')
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setBusy('')
    if (updateError) return setError(updateError.message)
    setPassword('')
    setRepeat('')
    setMessage('Password changed. Sign out your other devices too if you think someone else has been using your account.')
  }

  const others = devices.filter((d) => d.device_id !== here)

  return (
    <section className="card p-5">
      <h2 className="text-base font-bold text-navy-900">Your devices</h2>
      <p className="mt-1 text-xs leading-relaxed text-navy-500">
        {limit !== null
          ? `Your account can be signed in on ${limit} devices at a time${role === 'learner' ? ' — a phone and a computer, say' : ''}. Signing in on another one signs out the device used least recently.`
          : 'The devices your account is signed in on.'}
      </p>

      <ul className="mt-3 divide-y divide-navy-100">
        {devices.map((d) => (
          <li key={d.device_id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <div>
              <p className="text-sm font-semibold text-navy-900">
                {d.label || 'A device'}
                {d.device_id === here ? <span className="badge-green ml-2 align-middle">This device</span> : null}
              </p>
              <p className="text-xs text-navy-500">Last used {when(d.last_seen)}</p>
            </div>
            {d.device_id !== here ? (
              <button type="button" disabled={busy !== ''} onClick={() => void signOut(d.device_id)} className="btn-outline btn-sm">
                Sign out
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {others.length > 1 ? (
        <button type="button" disabled={busy !== ''} onClick={() => void signOutOthers()} className="btn-ghost btn-sm mt-2">
          Sign out every other device
        </button>
      ) : null}

      <form onSubmit={changePassword} className="mt-4 space-y-2 border-t border-navy-100 pt-4">
        <h3 className="text-sm font-bold text-navy-900">Change your password</h3>
        <p className="text-xs text-navy-500">Do this if you have shared your password or think someone else knows it.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs font-medium text-navy-600">
            New password
            <input type="password" autoComplete="new-password" className="input mt-1 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="text-xs font-medium text-navy-600">
            The same again
            <input type="password" autoComplete="new-password" className="input mt-1 w-full" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
          </label>
        </div>
        <button type="submit" disabled={busy !== '' || !password} className="btn-primary btn-sm">
          {busy === 'password' ? 'Saving…' : 'Change password'}
        </button>
      </form>

      {message ? <p className="mt-3 text-xs font-medium text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-xs font-medium text-rose-700">{error}</p> : null}
    </section>
  )
}
