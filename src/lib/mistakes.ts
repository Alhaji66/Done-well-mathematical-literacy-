import { supabase } from '@/lib/supabaseClient'

/**
 * My Mistakes: every question a learner has got wrong, until they get it right.
 *
 * Recorded through record_answer() (STEP 15 of supabase/schema.sql), which
 * counts repeat misses and clears a mistake once it is answered correctly. The
 * learner's teachers and linked parents can read the list; nobody else can.
 */

export type MistakeSource = 'practice' | 'paper' | 'weekly_test'

export interface Mistake {
  learner_id: string
  question_id: string
  topic_id: string
  source: MistakeSource
  times_wrong: number
  first_wrong_at: string
  last_wrong_at: string
  resolved_at: string | null
}

/**
 * Record one answer. Fire-and-forget from the learner's point of view: a
 * failure here (including a database without STEP 15) must never get in the
 * way of practising, so it is logged and swallowed.
 */
export async function recordAnswer(
  questionId: string,
  topicId: string,
  source: MistakeSource,
  correct: boolean,
): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.rpc('record_answer', {
    p_question: questionId,
    p_topic: topicId,
    p_source: source,
    p_correct: correct,
  })
  if (error) console.warn('Could not update My Mistakes:', error.message)
}

export interface MistakesResult {
  mistakes: Mistake[]
  notSetUp: boolean
}

export async function fetchMistakes(learnerIds: string[]): Promise<MistakesResult> {
  if (!supabase || learnerIds.length === 0) return { mistakes: [], notSetUp: !supabase }
  const { data, error } = await supabase
    .from('learner_mistakes')
    .select('*')
    .in('learner_id', learnerIds)
    .order('last_wrong_at', { ascending: false })
  if (error) {
    const missing = error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message)
    if (!missing) console.error('Failed to load mistakes:', error)
    return { mistakes: [], notSetUp: missing }
  }
  return { mistakes: (data ?? []) as Mistake[], notSetUp: false }
}

/** Take a resolved mistake off the list entirely. */
export async function clearMistake(learnerId: string, questionId: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('learner_mistakes').delete().eq('learner_id', learnerId).eq('question_id', questionId)
  return error ? error.message : undefined
}
