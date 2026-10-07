import { supabase } from '@/lib/supabaseClient'

/**
 * The subjects a learner takes (STEP 38). A learner used to have ONE subject,
 * so a learner taking Mathematics, Physical Sciences and Life Sciences only
 * ever reached one of their three teachers.
 */

export const LEARNER_SUBJECTS = [
  { id: 'mat-lit', name: 'Mathematical Literacy' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'physical-sciences', name: 'Physical Sciences' },
  { id: 'life-sciences', name: 'Life Sciences' },
] as const

/** CAPS: a learner takes Mathematics or Mathematical Literacy, never both. */
export const MATHS_PAIR: Record<string, string> = { mathematics: 'mat-lit', 'mat-lit': 'mathematics' }

/** Toggle one subject in a list, swapping out the other Maths subject when needed. */
export function toggleSubject(list: string[], id: string): string[] {
  if (list.includes(id)) return list.length > 1 ? list.filter((s) => s !== id) : list
  const other = MATHS_PAIR[id]
  return [...list.filter((s) => s !== other), id]
}

/** Does this learner take the subject? Learners from before STEP 38 have only their profile subject. */
export function takesSubject(learner: { subject_id: string | null; subjects?: string[] }, subjectId: string): boolean {
  if (learner.subjects?.length) return learner.subjects.includes(subjectId)
  return learner.subject_id === null || learner.subject_id === subjectId
}

/** The table is not there until STEP 38 is run. */
const missing = (code?: string) => code === '42P01' || code === 'PGRST205' || code === 'PGRST202' || code === '42883'

export async function fetchMySubjects(learnerId: string, mainSubject: string | null): Promise<string[]> {
  const fallback = mainSubject ? [mainSubject] : []
  if (!supabase) return fallback
  const { data, error } = await supabase.from('learner_subjects').select('subject_id').eq('learner_id', learnerId).order('added_at')
  if (error || !data?.length) {
    if (error && !missing(error.code)) console.error('Failed to load subjects:', error)
    return fallback
  }
  // The main subject first: it is what the learner's screens open on.
  const ids = data.map((r) => r.subject_id as string)
  return mainSubject && ids.includes(mainSubject) ? [mainSubject, ...ids.filter((s) => s !== mainSubject)] : ids
}

/** Every learner's subjects that the signed-in staff member may see (their own school's). */
export async function fetchSubjectsByLearner(): Promise<Map<string, string[]> | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('learner_subjects').select('learner_id, subject_id').limit(20000)
  if (error) {
    if (!missing(error.code)) console.error('Failed to load learner subjects:', error)
    return null
  }
  const map = new Map<string, string[]>()
  for (const r of data ?? []) map.set(r.learner_id as string, [...(map.get(r.learner_id as string) ?? []), r.subject_id as string])
  return map
}

/** Replace the signed-in learner's subjects with this list, in one step. */
export async function saveMySubjects(subjects: string[]): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('set_my_subjects', { p_subjects: subjects })
  if (!error) return undefined
  if (missing(error.code)) return 'Choosing more than one subject is not switched on yet. Ask DONE WELL to run STEP 38.'
  return error.message
}
