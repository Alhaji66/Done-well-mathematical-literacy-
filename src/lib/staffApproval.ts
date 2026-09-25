import { supabase } from '@/lib/supabaseClient'
import type { AccountProfile } from '@/context/AccountAuthContext'

/**
 * Staff access is granted by a colleague, not claimed on the sign-up screen.
 *
 * Every learner is given the school's join code, so "tap Teacher and enter the
 * code" cannot be what makes someone staff -- any learner could do it and read
 * every classmate's results. Since STEP 12 of supabase/schema.sql, a staff
 * account at a school that already has staff starts PENDING, and the database
 * refuses it staff access until an approved colleague approves it. These are
 * the app's two halves of that: telling the pending person why they see
 * nothing, and letting a colleague decide.
 */

const STAFF_ROLES = ['teacher', 'school', 'hod'] as const

/**
 * Is this profile waiting for a colleague to approve it?
 *
 * `null` means pending. `undefined` means the column is not there at all --
 * the database has not had STEP 12 applied yet -- and must NOT read as pending,
 * or deploying this code before running the SQL would lock every teacher out.
 */
export function isAwaitingApproval(profile: AccountProfile | null): boolean {
  if (!profile) return false
  if (!(STAFF_ROLES as readonly string[]).includes(profile.role)) return false
  if (!profile.school_id) return false
  return profile.staff_approved_at === null
}

export interface PendingStaff {
  id: string
  full_name: string
  role: string
  subject_id: string | null
  created_at: string
}

/** Staff at this school who signed up and are waiting for a colleague. */
export async function fetchPendingStaff(schoolId: string): Promise<PendingStaff[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, subject_id, created_at')
    .eq('school_id', schoolId)
    .in('role', [...STAFF_ROLES])
    .is('staff_approved_at', null)
    .order('created_at')
  if (error) {
    // Before STEP 12 the column does not exist and this errors; that is "no
    // one is pending", not something to show the user.
    return []
  }
  return data ?? []
}

/** Approve, or turn away, one pending staff account. */
export async function decideStaff(profileId: string, approve: boolean): Promise<string | null> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('approve_staff', { p_profile: profileId, p_approve: approve })
  return error ? error.message : null
}
