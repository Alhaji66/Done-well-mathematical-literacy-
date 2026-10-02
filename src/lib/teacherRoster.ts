import { supabase } from '@/lib/supabaseClient'
import type { Grade } from '@/types'

export interface RosterLearner {
  id: string
  full_name: string
  grade: Grade | null
  subject_id: string | null
}

export interface RosterProgressRow {
  learner_id: string
  topic_id: string
  mastery_percent: number
  questions_attempted: number
}

/**
 * The school's learners -- only those the school has approved (STEP 34). A
 * learner still waiting is listed on the approval card instead, and the
 * database would not show their results anyway.
 */
export async function fetchSchoolLearners(schoolId: string): Promise<RosterLearner[]> {
  if (!supabase) return []
  const query = (columns: string) =>
    supabase!.from('profiles').select(columns).eq('school_id', schoolId).eq('role', 'learner')
  let { data, error } = await query('id, full_name, grade, subject_id, learner_approved_at')
  // 42703: the column is not there yet (STEP 34 not run). Every learner counts.
  if (error?.code === '42703') ({ data, error } = await query('id, full_name, grade, subject_id'))
  if (error) {
    console.error('Failed to load school learners:', error)
    return []
  }
  return ((data ?? []) as unknown as (RosterLearner & { learner_approved_at?: string | null })[])
    .filter((l) => l.learner_approved_at !== null)
    .map(({ id, full_name, grade, subject_id }) => ({ id, full_name, grade, subject_id }))
}

export async function fetchProgressForLearners(learnerIds: string[]): Promise<RosterProgressRow[]> {
  if (!supabase || learnerIds.length === 0) return []
  const { data, error } = await supabase
    .from('learner_progress')
    .select('learner_id, topic_id, mastery_percent, questions_attempted')
    .in('learner_id', learnerIds)
  if (error) {
    console.error('Failed to load learner progress for roster:', error)
    return []
  }
  return data ?? []
}

export function averageMastery(learnerId: string, progress: RosterProgressRow[]): number | null {
  const rows = progress.filter((p) => p.learner_id === learnerId)
  if (rows.length === 0) return null
  return Math.round(rows.reduce((s, p) => s + p.mastery_percent, 0) / rows.length)
}
