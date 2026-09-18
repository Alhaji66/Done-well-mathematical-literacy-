import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { describeAuthError } from '@/lib/authErrors'
import { MessageIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

/**
 * WHY THERE IS A PASSWORD OPTION AT ALL.
 *
 * This screen used to offer only a magic link. In a live test at a school most
 * learners could not sign in, and the few who could were the first few to try.
 * That is the signature of Supabase's built-in email sender, which is rate
 * limited per project per hour: the first handful of messages go out and the
 * rest are refused. Thirty learners signing up in one lesson will never fit
 * through it.
 *
 * A magic link also assumes every learner has working email on the device in
 * front of them, which in a school computer room is often not true.
 *
 * So a password is the default here and the link is the alternative, rather
 * than the other way round. Password sign-in sends no email at all, so a whole
 * class can sign in at once.
 */

type Mode = 'password' | 'link'

export function AccountSignIn() {
  const { configured, loading, session } = useAccountAuth()
  const [mode, setMode] = useState<Mode>('password')
  const [creating, setCreating] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'working' | 'sent' | 'confirm' | 'error'>('idle')
  const [error, setError] = useState('')

  if (!loading && session) {
    return <Navigate to="/account" replace />
  }

  const reset = () => {
    setStatus('idle')
    setError('')
  }

  const withPassword = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (creating && password.length < 8) {
      setStatus('error')
      setError('Use at least 8 characters for your password.')
      return
    }
    setStatus('working')
    setError('')

    const credentials = { email: email.trim(), password }
    const { data, error: authError } = creating
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials)

    if (authError) {
      setStatus('error')
      setError(describeAuthError(authError))
      return
    }

    // A project with "Confirm email" switched on returns a user but no session:
    // nothing is signed in until they click the link. Saying "done" here would
    // be a lie, and the learner would sit at a screen that never moves.
    if (creating && !data.session) {
      setStatus('confirm')
      return
    }
    // A session means onAuthStateChange has it; the redirect at the top of this
    // component takes over from here.
    setStatus('idle')
  }

  const sendMagicLink = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setStatus('working')
    setError('')
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}account/sign-in`
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })
    if (sendError) {
      setStatus('error')
      setError(describeAuthError(sendError))
    } else {
      setStatus('sent')
    }
  }

  const busy = status === 'working'

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 15 12 5l7 10" />
                <circle cx="12" cy="18" r="1.4" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-tight text-navy-900">
              DONE WELL<span className="align-super text-[0.6em] text-gold-700">®</span>
            </span>
          </Link>
        </div>

        <div className="card p-6 sm:p-8">
          {!configured ? (
            <>
              <h1 className="text-xl font-bold text-navy-900">Real accounts aren't set up yet</h1>
              <p className="mt-1.5 text-sm text-navy-600">This deployment hasn't been connected to a database yet.</p>
            </>
          ) : status === 'sent' ? (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <MessageIcon className="h-5 w-5" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-navy-900">Check your email</h1>
              <p className="mt-1.5 text-sm text-navy-600">
                We sent a sign-in link to <strong>{email}</strong>. Open it on this device to continue.
              </p>
              <button type="button" onClick={reset} className="btn-outline mt-6 w-full">
                Back
              </button>
            </>
          ) : status === 'confirm' ? (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <MessageIcon className="h-5 w-5" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-navy-900">Confirm your email</h1>
              <p className="mt-1.5 text-sm text-navy-600">
                Your account was created. Open the confirmation link we sent to <strong>{email}</strong>, then come back
                and sign in with your password.
              </p>
              <button type="button" onClick={() => { setCreating(false); reset() }} className="btn-outline mt-6 w-full">
                Back to sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-navy-900">{creating ? 'Create your account' : 'Sign in'}</h1>
              <p className="mt-1.5 text-sm text-navy-600">
                {mode === 'password'
                  ? creating
                    ? 'Choose a password you will remember. You will use it every time you sign in.'
                    : 'Use the email and password you signed up with.'
                  : "We'll email you a one-time link -- no password needed."}
              </p>

              <div className="mt-5 flex rounded-lg border border-navy-200 p-0.5">
                {(['password', 'link'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mode === m}
                    onClick={() => {
                      setMode(m)
                      reset()
                    }}
                    className={cn(
                      'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                      mode === m ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
                    )}
                  >
                    {m === 'password' ? 'Password' : 'Email link'}
                  </button>
                ))}
              </div>

              <form onSubmit={mode === 'password' ? withPassword : sendMagicLink} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-navy-500" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input mt-1"
                  />
                </div>

                {mode === 'password' ? (
                  <div>
                    <label className="text-xs font-medium text-navy-500" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={creating ? 8 : undefined}
                      autoComplete={creating ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={creating ? 'At least 8 characters' : 'Your password'}
                      className="input mt-1"
                    />
                  </div>
                ) : null}

                {status === 'error' ? <p className="text-sm text-rose-600">{error}</p> : null}

                <button type="submit" disabled={busy} className="btn-primary w-full">
                  {busy
                    ? 'Working…'
                    : mode === 'link'
                      ? 'Send sign-in link'
                      : creating
                        ? 'Create account'
                        : 'Sign in'}
                </button>
              </form>

              {mode === 'password' ? (
                <p className="mt-4 text-center text-xs text-navy-500">
                  {creating ? 'Already have an account?' : "Don't have an account yet?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCreating(!creating)
                      reset()
                    }}
                    className="font-semibold text-navy-800 underline hover:text-navy-900"
                  >
                    {creating ? 'Sign in' : 'Create one'}
                  </button>
                </p>
              ) : null}
            </>
          )}

          <p className="mt-4 text-center text-xs text-navy-400">
            Just exploring?{' '}
            <Link to="/sign-in" className="font-medium text-navy-600 underline hover:text-navy-900">
              Try the free demo
            </Link>{' '}
            instead -- no account needed.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-navy-500">
          <Link to="/" className="font-medium text-navy-700 hover:text-navy-900">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  )
}
