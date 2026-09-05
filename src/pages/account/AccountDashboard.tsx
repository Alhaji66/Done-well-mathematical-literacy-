import { useAccountAuth } from '@/context/AccountAuthContext'
import { LogOutIcon } from '@/components/ui/Icons'

/**
 * Fallback only -- every real role (Learner, Teacher, Parent, School) now
 * has its own full multi-page experience and is redirected there by
 * AccountIndexRedirect. This only renders if a profile somehow has a role
 * outside that set, which the database enum doesn't allow in practice.
 */
export function AccountDashboard() {
  const { profile, signOut } = useAccountAuth()

  if (!profile) return null

  return (
    <div className="min-h-screen bg-navy-50 px-4 py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="mt-1 truncate text-xl font-bold text-navy-900">Welcome, {profile.full_name}</h1>
            </div>
            <button type="button" onClick={signOut} className="btn-ghost btn-sm inline-flex shrink-0 items-center gap-1.5">
              <LogOutIcon className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
          <strong>Something's not quite right.</strong> We couldn't find a dashboard for your account type. Please contact support.
        </div>
      </div>
    </div>
  )
}
