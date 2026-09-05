import { Navigate } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { AccountDashboard } from '@/pages/account/AccountDashboard'

/**
 * The real, multi-page Learner and Teacher experiences live at
 * /account/learner/* and /account/teacher/*. Parent/School real
 * dashboards aren't built yet, so those roles still land on the generic
 * placeholder page for now.
 */
export function AccountIndexRedirect() {
  const { profile } = useAccountAuth()
  if (profile?.role === 'learner') return <Navigate to="/account/learner/dashboard" replace />
  if (profile?.role === 'teacher') return <Navigate to="/account/teacher/dashboard" replace />
  return <AccountDashboard />
}
