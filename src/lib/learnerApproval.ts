import { supabase } from '@/lib/supabaseClient'
import type { AccountProfile } from '@/context/AccountAuthContext'

/**
 * Learners are approved, and paid places are a limit (STEP 34 of
 * supabase/schema.sql).
 *
 * Every learner is given the school's join code, so the code alone cannot be
 * what puts someone in a school: a friend at another school, or a learner who
 * left last year, could use it. A learner who joins now WAITS until staff at
 * the school approve them -- or, if the school chooses, is let in at once while
 * paid places remain. Once the places on the licence are used, the next
 * learner waits and the database refuses to approve them until one is freed.
 *
 * As with staff approval, a missing column (`undefined`) means the database has
 * not had STEP 34 yet and must NOT read as waiting, or deploying this code
 * before running the SQL would hide every learner.
 */

export type ApprovalMode = 'manual' | 'auto'

export interface SeatStatus {
  /** Places on the current licence; `null` when the school has no limit. */
  seats: number | null
  used: number
  pending: number
  approval: ApprovalMode
}

export interface PendingLearner {
  id: string
  full_name: string
  grade: number | null
  subject_id: string | null
  created_at: string
}

/** Is this learner waiting for their school to approve them? */
export function isAwaitingSchool(profile: AccountProfile | null): boolean {
  if (!profile || profile.role !== 'learner' || !profile.school_id) return false
  return profile.learner_approved_at === null
}

/** Can this person change how learners are approved, and the school code? */
export const canManageAccess = (profile: AccountProfile | null) => profile?.role === 'school' || profile?.role === 'hod'

const messageOf = (error: { message?: string } | null) => error?.message ?? 'Something went wrong. Please try again.'

/** Learners who have joined with the code and are waiting, oldest first. */
export async function fetchPendingLearners(schoolId: string): Promise<PendingLearner[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, grade, subject_id, created_at')
    .eq('school_id', schoolId)
    .eq('role', 'learner')
    .is('learner_approved_at', null)
    .order('created_at')
  // Before STEP 34 the column does not exist and this errors: nobody is waiting.
  if (error) return []
  return (data ?? []) as PendingLearner[]
}

/** Places on the licence, how many are used, and how learners get in. */
export async function fetchSeatStatus(): Promise<SeatStatus | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('school_seat_status')
  if (error) return null
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return null
  return { seats: row.seats ?? null, used: row.used ?? 0, pending: row.pending ?? 0, approval: row.approval === 'auto' ? 'auto' : 'manual' }
}

/** Approve one waiting learner, or turn them away. Returns an error message, if any. */
export async function decideLearner(profileId: string, approve: boolean): Promise<string | null> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('approve_learner', { p_profile: profileId, p_approve: approve })
  return error ? messageOf(error) : null
}

/** Take a learner who has left off the school, freeing their place. They keep their own account. */
export async function removeLearner(profileId: string): Promise<string | null> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('remove_learner', { p_profile: profileId })
  return error ? messageOf(error) : null
}

export async function setApprovalMode(mode: ApprovalMode): Promise<string | null> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('set_learner_approval', { p_mode: mode })
  return error ? messageOf(error) : null
}

/** A new school code; the old one stops working at once. */
export async function rotateJoinCode(): Promise<{ code?: string; error?: string }> {
  if (!supabase) return { error: 'Not connected.' }
  const { data, error } = await supabase.rpc('rotate_join_code')
  if (error) return { error: messageOf(error) }
  return { code: String(data) }
}

/** A learner asks to join (or move to) a school by its code. */
export async function requestSchool(code: string): Promise<{ school?: string; approved?: boolean; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const cleaned = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  if (cleaned.length !== 6) return { error: 'A school code is 6 letters and numbers. Check it with your teacher.' }
  const { data, error } = await supabase.rpc('request_school', { p_code: cleaned })
  if (error) return { error: messageOf(error) }
  const row = Array.isArray(data) ? data[0] : data
  return { school: row?.school_name, approved: Boolean(row?.approved) }
}

/** The school a waiting learner asked to join -- they cannot read the school row itself yet. */
export async function fetchMySchoolRequest(): Promise<{ school: string; approved: boolean } | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('my_school_request')
  if (error) return null
  const row = Array.isArray(data) ? data[0] : data
  return row ? { school: String(row.school_name), approved: Boolean(row.approved) } : null
}
