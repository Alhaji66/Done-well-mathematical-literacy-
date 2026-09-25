import { supabase } from '@/lib/supabaseClient'

/**
 * Participation: a short record of what people did, for "active learners" and
 * participation figures. STEP 16 of supabase/schema.sql stamps each event's
 * school and time itself, so the app sends only the kind and, at most, a topic.
 */

export type ActivityKind =
  | 'signed_in'
  | 'practice_answer'
  | 'paper_answer'
  | 'test_submitted'
  | 'mistake_fixed'
  | 'resource_opened'

/** Fire-and-forget. A failure (or a database without STEP 16) never interrupts the learner. */
export async function logActivity(actorId: string, kind: ActivityKind, topicId?: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('activity_events').insert({ actor_id: actorId, kind, topic_id: topicId ?? null })
  if (error && !/does not exist|schema cache/i.test(error.message)) console.warn('Could not record activity:', error.message)
}

/** "Signed in" at most once a day per browser, so a reload is not a new visit. */
export function logSignedIn(actorId: string): void {
  const key = `donewell:signed-in:${actorId}`
  const today = new Date().toISOString().slice(0, 10)
  try {
    if (localStorage.getItem(key) === today) return
    localStorage.setItem(key, today)
  } catch {
    // Storage blocked: log anyway; one extra event is harmless.
  }
  void logActivity(actorId, 'signed_in')
}

export interface Participation {
  actor_id: string
  active_days: number
  events: number
  answers: number
  last_active: string
}

/**
 * Participation per person over the last `days`, for everyone the caller may
 * see: a school's staff get their school, a parent their children, anyone else
 * only themselves. `null` means the feature is not switched on yet.
 */
export async function fetchParticipation(days = 7): Promise<Map<string, Participation> | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('participation', { p_days: days })
  if (error) {
    if (!/does not exist|schema cache|Could not find/i.test(error.message)) console.error('Failed to load participation:', error)
    return null
  }
  return new Map(
    ((data ?? []) as Participation[]).map((r) => [
      r.actor_id,
      { ...r, active_days: Number(r.active_days), events: Number(r.events), answers: Number(r.answers) },
    ]),
  )
}
