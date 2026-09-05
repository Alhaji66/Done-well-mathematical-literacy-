import { supabase } from '@/lib/supabaseClient'

export interface ProgressRow {
  topic_id: string
  mastery_percent: number
  questions_attempted: number
}

const MASTERY_STEP = 5

export async function fetchLearnerProgress(learnerId: string): Promise<ProgressRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('learner_progress')
    .select('topic_id, mastery_percent, questions_attempted')
    .eq('learner_id', learnerId)
  if (error) {
    console.error('Failed to load learner progress:', error)
    return []
  }
  return data ?? []
}

/**
 * Records one practice attempt for a topic and returns the updated row.
 * Mastery is a simple, explainable heuristic (not a real IRT/mastery model):
 * starts at 50, nudged +/-5 per correct/incorrect MCQ answer, clamped 0-100.
 * Open-ended questions (correct === null) can't be auto-graded, so they only
 * count toward questions_attempted and don't move the mastery number.
 */
export async function recordAttempt(
  learnerId: string,
  topicId: string,
  correct: boolean | null,
  existing: ProgressRow | undefined,
): Promise<ProgressRow | null> {
  if (!supabase) return null

  const baseMastery = existing?.mastery_percent ?? 50
  const delta = correct === true ? MASTERY_STEP : correct === false ? -MASTERY_STEP : 0
  const mastery_percent = Math.min(100, Math.max(0, baseMastery + delta))
  const questions_attempted = (existing?.questions_attempted ?? 0) + 1

  const { error } = await supabase.from('learner_progress').upsert({
    learner_id: learnerId,
    topic_id: topicId,
    mastery_percent,
    questions_attempted,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Failed to record practice attempt:', error)
    return null
  }

  return { topic_id: topicId, mastery_percent, questions_attempted }
}
