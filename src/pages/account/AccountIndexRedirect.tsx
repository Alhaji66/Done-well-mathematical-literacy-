import { Navigate } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { AccountDashboard } from '@/pages/account/AccountDashboard'

/**
 * The real, multi-page Learner experience lives at /account/learner/*.
 * Parent/Teacher/School real dashboards aren't built yet, so those roles
 * still land on the generic placeholder page for now.
 */
export function AccountIndexRedirect() {
  const { profile } = useAccountAuth()
  if (profile?.role === 'learner') return <Navigate to="/account/learner/dashboard" replace />
  return <AccountDashboard />
}
