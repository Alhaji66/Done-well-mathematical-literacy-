import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'

interface AccountGateProps {
  /** 'session': must be signed in (used by onboarding -- and redirects away if already onboarded).
   *  'profile': must be signed in AND have completed onboarding (used by the dashboard). */
  require: 'session' | 'profile'
}

export function AccountGate({ require }: AccountGateProps) {
  const { configured, loading, session, profile } = useAccountAuth()
  const location = useLocation()

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4 text-center">
        <p className="max-w-sm text-sm text-navy-600">
          Real accounts aren't set up on this deployment yet. Try the free demo from the homepage instead.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50">
        <p className="text-sm text-navy-500">Loading your account…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/account/sign-in" replace state={{ from: location }} />
  }

  if (require === 'profile' && !profile) {
    return <Navigate to="/account/onboarding" replace />
  }

  if (require === 'session' && profile) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}
