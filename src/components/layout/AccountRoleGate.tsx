import { Navigate, Outlet } from 'react-router-dom'
import { useAccountAuth, type AccountRole } from '@/context/AccountAuthContext'

/** Nest this inside <AccountGate require="profile" /> so `profile` is guaranteed set. */
export function AccountRoleGate({ role }: { role: AccountRole }) {
  const { profile } = useAccountAuth()
  if (profile && profile.role !== role) return <Navigate to="/account" replace />
  return <Outlet />
}
