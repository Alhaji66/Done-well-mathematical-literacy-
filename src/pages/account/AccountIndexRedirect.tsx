import { Navigate } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { AccountDashboard } from '@/pages/account/AccountDashboard'

/**
 * The real, multi-page Learner, Teacher and Parent experiences live at
 * /account/learner/*, /account/teacher/* and /account/parent/*. School's
 * real dashboard isn't built yet, so that role still lands on the generic
 * placeholder page for now.
 */
export function AccountIndexRedirect() {
  const { profile } = useAccountAuth()
  if (profile?.role === 'learner') return <Navigate to="/account/learner/dashboard" replace />
  if (profile?.role === 'teacher') return <Navigate to="/account/teacher/dashboard" replace />
  if (profile?.role === 'parent') return <Navigate to="/account/parent/dashboard" replace />
  return <AccountDashboard />
}
