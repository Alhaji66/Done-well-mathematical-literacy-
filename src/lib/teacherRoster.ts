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

export async function fetchSchoolLearners(schoolId: string): Promise<RosterLearner[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, grade, subject_id')
    .eq('school_id', schoolId)
    .eq('role', 'learner')
  if (error) {
    console.error('Failed to load school learners:', error)
    return []
  }
  return data ?? []
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
