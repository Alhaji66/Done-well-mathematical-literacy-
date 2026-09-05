import { Navigate } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { AccountDashboard } from '@/pages/account/AccountDashboard'

/**
 * All four roles now have their own real, multi-page experience:
 * /account/learner/*, /account/teacher/*, /account/parent/* and
 * /account/school/*. AccountDashboard is kept around as a fallback for a
 * profile row with an unrecognized role, which shouldn't happen in
 * practice since the enum only allows these four.
 */
export function AccountIndexRedirect() {
  const { profile } = useAccountAuth()
  if (profile?.role === 'learner') return <Navigate to="/account/learner/dashboard" replace />
  if (profile?.role === 'teacher') return <Navigate to="/account/teacher/dashboard" replace />
  if (profile?.role === 'parent') return <Navigate to="/account/parent/dashboard" replace />
  if (profile?.role === 'school') return <Navigate to="/account/school/dashboard" replace />
  return <AccountDashboard />
}
