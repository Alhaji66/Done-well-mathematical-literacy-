import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { MessageIcon } from '@/components/ui/Icons'

export function AccountSignIn() {
  const { configured, loading, session } = useAccountAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  if (!loading && session) {
    return <Navigate to="/account" replace />
  }

  const sendMagicLink = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setStatus('sending')
    setError('')
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}account/sign-in`
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })
    if (sendError) {
      setStatus('error')
      setError(sendError.message)
    } else {
      setStatus('sent')
    }
  }

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
              DONE WELL<span className="align-super text-[0.6em] text-gold-600">®</span>
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
                We sent a sign-in link to <strong>{email}</strong>. Open it on this device to continue -- no password
                needed.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="btn-outline mt-6 w-full"
              >
                Use a different email
              </button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-navy-900">Sign in</h1>
              <p className="mt-1.5 text-sm text-navy-600">
                Enter your email and we'll send you a one-time sign-in link -- no password to remember.
              </p>

              <form onSubmit={sendMagicLink} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-navy-500" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input mt-1"
                  />
                </div>

                {status === 'error' ? <p className="text-sm text-rose-600">{error}</p> : null}

                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
                  {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
                </button>
              </form>
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
