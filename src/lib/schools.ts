import { supabase } from '@/lib/supabaseClient'

/**
 * Attaching a person to a school.
 *
 * This used to be done by matching the name they typed against `schools.name`
 * with ilike, creating a new school when nothing matched. A live test showed
 * why that cannot work: a teacher who types "Gojela High School" and a learner
 * who types "Gojela High" end up in two different schools, so the learner never
 * appears on their own teacher's roster, and once two similar names exist the
 * lookup matches both and onboarding fails outright for everyone at that school.
 *
 * So a school is now identified by a code. It is created once, by the school or
 * the first teacher, and everyone else joins with the code. Joining can never
 * create a school, which is what makes forking impossible rather than unlikely.
 */

export interface SchoolRef {
  id: string
  name: string
}

export interface NewSchool extends SchoolRef {
  joinCode: string
}

/** Codes are shown and typed in groups, and never contain O, 0, I or 1. */
export const normaliseJoinCode = (raw: string) => raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

/**
 * Postgres errors raised by `raise exception` arrive with the message we wrote,
 * which is already written for the person reading it. Anything else is a fault
 * rather than a rejection, so it gets a generic line and a console entry.
 */
const messageFor = (err: unknown, fallback: string) => {
  const message =
    typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : ''
  if (!message) return fallback
  // PostgREST prefixes RPC failures; the useful half is after the last colon
  // only when our own exception text is in there.
  return message
}

export async function createSchool(name: string): Promise<{ school?: NewSchool; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase.rpc('create_school', { p_name: name })
  if (error) {
    console.error('create_school failed:', error)
    return { error: messageFor(error, 'Could not register the school. Please try again.') }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return { error: 'Could not register the school. Please try again.' }
  return { school: { id: row.school_id, name: row.school_name, joinCode: row.join_code } }
}

export async function joinSchool(code: string): Promise<{ school?: SchoolRef; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const cleaned = normaliseJoinCode(code)
  if (cleaned.length !== 6) {
    return { error: 'A school code is 6 letters and numbers. Check it with your teacher.' }
  }
  const { data, error } = await supabase.rpc('join_school', { p_code: cleaned })
  if (error) {
    console.error('join_school failed:', error)
    return { error: messageFor(error, 'Could not find that school code. Please try again.') }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return { error: 'Could not find that school code. Please check it with your teacher.' }
  return { school: { id: row.school_id, name: row.school_name } }
}

/** The code for the school this person already belongs to, for handing out. */
export async function fetchJoinCode(schoolId: string): Promise<{ name: string; joinCode: string } | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('schools').select('name, join_code').eq('id', schoolId).maybeSingle()
  if (error || !data) {
    if (error) console.error('Failed to load the school join code:', error)
    return null
  }
  return { name: data.name, joinCode: data.join_code }
}
