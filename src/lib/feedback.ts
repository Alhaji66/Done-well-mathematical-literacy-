import { supabase } from '@/lib/supabaseClient'

/**
 * Feedback from anyone using DONE WELL (STEP 37 of supabase/schema.sql).
 *
 * Sent through submit_feedback(), which trims and caps every field, takes a
 * signed-in person's role from their profile, and refuses a flood. Only DONE
 * WELL's administrators can read it, in the Platform console.
 */

export type FeedbackStatus = 'new' | 'read' | 'done'

export interface FeedbackItem {
  id: string
  created_at: string
  role: string
  page: string
  rating: number | null
  message: string
  contact: string | null
  status: FeedbackStatus
}

export async function submitFeedback(input: {
  page: string
  role: string
  rating: number | null
  message: string
  contact: string
}): Promise<string | undefined> {
  if (!supabase) return 'Feedback cannot be sent from this copy of the site.'
  const { error } = await supabase.rpc('submit_feedback', {
    p_page: input.page,
    p_role: input.role,
    p_rating: input.rating,
    p_message: input.message,
    p_contact: input.contact,
  })
  if (!error) return undefined
  if (/function .*submit_feedback|does not exist|schema cache/i.test(error.message)) {
    return 'Feedback is not switched on yet. Please try again later.'
  }
  if (/fetch|network/i.test(error.message)) return 'Could not reach DONE WELL. Check your connection and try again.'
  return error.message
}

export async function fetchFeedback(): Promise<{ rows: FeedbackItem[]; error?: string }> {
  if (!supabase) return { rows: [] }
  const { data, error } = await supabase
    .from('feedback')
    .select('id, created_at, role, page, rating, message, contact, status')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return { rows: [], error: /does not exist|schema cache/i.test(error.message) ? 'Feedback is not set up yet: run STEP 37 in Supabase.' : error.message }
  return { rows: (data ?? []) as FeedbackItem[] }
}

export async function setFeedbackStatus(id: string, status: FeedbackStatus): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('feedback').update({ status }).eq('id', id)
  return error?.message
}
