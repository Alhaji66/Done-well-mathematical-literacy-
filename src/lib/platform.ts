import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Platform administration, subscriptions and sponsors (STEP 17 of
 * supabase/schema.sql). An administrator sees every school in COUNTS; a
 * sponsor sees its programme in TOTALS; neither sees a learner. Every rule is
 * enforced by the database -- these functions only ask.
 */

export type Plan = 'pilot' | 'school' | 'sponsored'
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'expired'

export const PLAN_LABEL: Record<Plan, string> = {
  pilot: 'Pilot',
  school: 'School licence',
  sponsored: 'Sponsored programme',
}
export const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: 'Active',
  past_due: 'Payment overdue',
  cancelled: 'Cancelled',
  expired: 'Expired',
}

export interface SchoolOverview {
  school_id: string
  name: string
  created_at: string
  suspended_at: string | null
  learners: number
  staff: number
  pending_staff: number
  active_7d: number
  plan: Plan | null
  status: SubscriptionStatus | null
  learner_seats: number | null
  ends_on: string | null
}

export interface Subscription {
  id: string
  school_id: string
  plan: Plan
  status: SubscriptionStatus
  learner_seats: number | null
  starts_on: string
  ends_on: string | null
  programme_id: string | null
}

export interface Sponsor {
  id: string
  name: string
}

export interface Programme {
  id: string
  sponsor_id: string
  name: string
  starts_on: string | null
  ends_on: string | null
}

export interface ProgrammeSchool {
  programme_id: string
  school_id: string
}

export interface ProgrammeTotals {
  school_id: string
  school_name: string
  withheld: boolean
  learners: number | null
  active_7d: number | null
  answers_7d: number | null
  average_mastery: number | null
  tests_handed_in: number | null
  reassessed: number | null
  improved: number | null
}

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v))

/** Is the signed-in person a platform administrator, and do they belong to a sponsor? */
export function usePlatformAccess(userId: string | undefined): { admin: boolean; sponsor: boolean; checked: boolean } {
  const [state, setState] = useState({ admin: false, sponsor: false, checked: false })
  useEffect(() => {
    if (!supabase || !userId) {
      setState({ admin: false, sponsor: false, checked: true })
      return
    }
    let active = true
    Promise.all([supabase.rpc('is_platform_admin'), supabase.rpc('my_sponsor_ids')]).then(([a, s]) => {
      if (!active) return
      setState({
        admin: a.error ? false : Boolean(a.data),
        sponsor: s.error ? false : Array.isArray(s.data) && s.data.length > 0,
        checked: true,
      })
    })
    return () => {
      active = false
    }
  }, [userId])
  return state
}

export async function fetchSchoolOverview(): Promise<{ rows: SchoolOverview[]; error?: string }> {
  if (!supabase) return { rows: [] }
  const { data, error } = await supabase.rpc('admin_school_overview')
  if (error) return { rows: [], error: error.message }
  return {
    rows: ((data ?? []) as SchoolOverview[]).map((r) => ({
      ...r,
      learners: Number(r.learners),
      staff: Number(r.staff),
      pending_staff: Number(r.pending_staff),
      active_7d: Number(r.active_7d),
    })),
  }
}

export async function setSchoolSuspended(schoolId: string, suspend: boolean): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.rpc('set_school_suspended', { p_school: schoolId, p_suspend: suspend })
  return error?.message
}

/** Subscriptions for one school (a school's own staff), or every school (an administrator). */
export async function fetchSubscriptions(schoolId?: string): Promise<Subscription[]> {
  if (!supabase) return []
  let q = supabase.from('subscriptions').select('*').order('starts_on', { ascending: false })
  if (schoolId) q = q.eq('school_id', schoolId)
  const { data, error } = await q
  if (error) return []
  return (data ?? []) as Subscription[]
}

export async function saveSubscription(
  input: Omit<Subscription, 'id'> & { id?: string },
): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { id, ...fields } = input
  const { error } = id
    ? await supabase.from('subscriptions').update(fields).eq('id', id)
    : await supabase.from('subscriptions').insert(fields)
  return error?.message
}

export async function fetchSponsorsAndProgrammes(): Promise<{
  sponsors: Sponsor[]
  programmes: Programme[]
  links: ProgrammeSchool[]
}> {
  if (!supabase) return { sponsors: [], programmes: [], links: [] }
  const [s, p, l] = await Promise.all([
    supabase.from('sponsors').select('id, name').order('name'),
    supabase.from('programmes').select('id, sponsor_id, name, starts_on, ends_on').order('name'),
    supabase.from('programme_schools').select('programme_id, school_id'),
  ])
  return {
    sponsors: (s.data ?? []) as Sponsor[],
    programmes: (p.data ?? []) as Programme[],
    links: (l.data ?? []) as ProgrammeSchool[],
  }
}

export async function createSponsor(name: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('sponsors').insert({ name: name.trim() })
  return error ? (error.code === '23505' ? 'There is already a sponsor with that name.' : error.message) : undefined
}

export async function createProgramme(input: {
  sponsorId: string
  name: string
  startsOn: string | null
  endsOn: string | null
}): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('programmes').insert({
    sponsor_id: input.sponsorId,
    name: input.name.trim(),
    starts_on: input.startsOn || null,
    ends_on: input.endsOn || null,
  })
  return error?.message
}

export async function setProgrammeSchool(programmeId: string, schoolId: string, include: boolean): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = include
    ? await supabase.from('programme_schools').insert({ programme_id: programmeId, school_id: schoolId })
    : await supabase.from('programme_schools').delete().eq('programme_id', programmeId).eq('school_id', schoolId)
  return error?.message
}

/** Adds someone who already has a DONE WELL sign-in to a sponsor. False if no such account. */
export async function addSponsorMember(sponsorId: string, email: string): Promise<{ found?: boolean; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase.rpc('add_sponsor_member', { p_sponsor: sponsorId, p_email: email })
  if (error) return { error: error.message }
  return { found: Boolean(data) }
}

export async function fetchProgrammeTotals(programmeId: string): Promise<{ rows: ProgrammeTotals[]; error?: string }> {
  if (!supabase) return { rows: [] }
  const { data, error } = await supabase.rpc('programme_totals', { p_programme: programmeId })
  if (error) return { rows: [], error: error.message }
  return {
    rows: ((data ?? []) as ProgrammeTotals[]).map((r) => ({
      ...r,
      learners: num(r.learners),
      active_7d: num(r.active_7d),
      answers_7d: num(r.answers_7d),
      average_mastery: num(r.average_mastery),
      tests_handed_in: num(r.tests_handed_in),
      reassessed: num(r.reassessed),
      improved: num(r.improved),
    })),
  }
}

/** The subscription that applies today: the latest one that has started. */
export function currentSubscription(subs: Subscription[]): Subscription | null {
  const today = new Date().toISOString().slice(0, 10)
  return subs.filter((s) => s.starts_on <= today).sort((a, b) => b.starts_on.localeCompare(a.starts_on))[0] ?? null
}
