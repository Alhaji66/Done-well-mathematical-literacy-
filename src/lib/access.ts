import { supabase } from '@/lib/supabaseClient'

/**
 * Who may have the full question bank (STEP 39 of supabase/schema.sql).
 *
 * The database decides -- has_content_access() guards the private `content`
 * bucket -- and my_access() says which rule applies, so a page can explain it:
 * a place at a school with a current licence, a personal plan, the free trial,
 * or none of these (the sample only). Nothing here grants anything.
 */

export type AccessReason = 'admin' | 'editor' | 'school' | 'plan' | 'trial'

/** The account's school, as far as access goes. `null` when it has none. */
export type SchoolState = 'current' | 'overdue' | 'ended' | 'none' | 'paused' | 'waiting'

export interface MyAccess {
  /** Why the account has the full bank; `null` when it has only the sample. */
  reason: AccessReason | null
  trialEndsAt: string | null
  planEndsOn: string | null
  schoolState: SchoolState | null
  licenceEndsOn: string | null
}

export const TRIAL_DAYS = 14

/** Where to ask about a plan or a school licence. */
export const ACCESS_CONTACT = {
  email: 'donewellpublication@gmail.com',
  whatsapp: '27717713275',
  whatsappLabel: '+27 71 771 3275',
}

let cached: { userId: string; at: number; value: Promise<MyAccess | null> } | null = null

/**
 * The signed-in account's access. `null` when it cannot be known -- offline,
 * no account, or a database without STEP 39 -- and callers then carry on as
 * before rather than locking anyone out on a guess. Kept for a minute, so the
 * pages of one visit ask once.
 */
export function fetchMyAccess(userId: string | undefined): Promise<MyAccess | null> {
  if (!supabase || !userId) return Promise.resolve(null)
  if (cached && cached.userId === userId && Date.now() - cached.at < 60_000) return cached.value
  const client = supabase
  const value = (async () => {
    try {
      const { data, error } = await client.rpc('my_access')
      if (error) return null
      const row = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
      if (!row) return null
      return {
        reason: (row.reason as AccessReason | null) ?? null,
        trialEndsAt: (row.trial_ends_at as string | null) ?? null,
        planEndsOn: (row.plan_ends_on as string | null) ?? null,
        schoolState: (row.school_state as SchoolState | null) ?? null,
        licenceEndsOn: (row.licence_ends_on as string | null) ?? null,
      }
    } catch {
      return null
    }
  })()
  cached = { userId, at: Date.now(), value }
  void value.then((v) => {
    if (!v && cached?.value === value) cached = null
  })
  return value
}

export function forgetMyAccess() {
  cached = null
}

/** Whole days from now until a date or time; negative once it has passed. */
export function daysUntil(when: string): number {
  const end = when.length === 10 ? new Date(`${when}T23:59:59`) : new Date(when)
  return Math.ceil((end.getTime() - Date.now()) / 86_400_000)
}

export const longDate = (when: string) =>
  new Date(when.length === 10 ? `${when}T00:00:00` : when).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export type PersonalPlan = 'month' | 'year' | 'exam_season' | 'custom'

export const PERSONAL_PLAN_LABEL: Record<PersonalPlan, string> = {
  month: 'One month',
  year: 'One year',
  exam_season: 'Exam season pass',
  custom: 'Other period',
}

/** The end date a plan bought today would usually have. */
export function suggestedPlanEnd(plan: PersonalPlan, from = new Date()): string {
  const d = new Date(from)
  if (plan === 'month') d.setMonth(d.getMonth() + 1)
  else if (plan === 'year') d.setFullYear(d.getFullYear() + 1)
  else if (plan === 'exam_season') {
    // To the end of the November exams.
    d.setMonth(10, 30)
    if (d < from) d.setFullYear(d.getFullYear() + 1)
  } else d.setDate(d.getDate() + 30)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export interface PersonalPlanRow {
  id: string
  email: string
  plan: PersonalPlan
  starts_on: string
  ends_on: string
  reference: string | null
  created_at: string
}

export async function fetchPersonalPlans(): Promise<{ rows: PersonalPlanRow[]; error?: string }> {
  if (!supabase) return { rows: [] }
  const { data, error } = await supabase.rpc('admin_personal_plans')
  if (error) return { rows: [], error: error.message }
  return { rows: (data ?? []) as PersonalPlanRow[] }
}

/** Records a paid plan for the account with this sign-in email. `found: false` when there is no such account. */
export async function grantPersonalPlan(input: {
  email: string
  plan: PersonalPlan
  endsOn: string
  reference: string
}): Promise<{ found?: boolean; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase.rpc('admin_grant_plan', {
    p_email: input.email,
    p_plan: input.plan,
    p_ends_on: input.endsOn,
    p_reference: input.reference,
  })
  if (error) return { error: error.message }
  return { found: Boolean(data) }
}

export async function endPersonalPlan(id: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.rpc('admin_end_plan', { p_plan: id })
  return error?.message
}
