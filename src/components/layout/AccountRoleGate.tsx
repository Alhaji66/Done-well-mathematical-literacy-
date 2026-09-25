import { Navigate, Outlet } from 'react-router-dom'
import { useAccountAuth, type AccountRole } from '@/context/AccountAuthContext'
import { isAwaitingApproval } from '@/lib/staffApproval'
import { AwaitingApproval } from '@/components/account/AwaitingApproval'

/** Nest this inside <AccountGate require="profile" /> so `profile` is guaranteed set. */
export function AccountRoleGate({ role }: { role: AccountRole }) {
  const { profile } = useAccountAuth()
  if (profile && profile.role !== role) return <Navigate to="/account" replace />
  // A staff account nobody has approved yet would load every staff page empty,
  // because the database now refuses it staff access. Say so, rather than
  // leaving a new teacher looking at a blank class list and assuming it broke.
  if (isAwaitingApproval(profile)) return <AwaitingApproval />
  return <Outlet />
}
