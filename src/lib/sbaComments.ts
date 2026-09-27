import { supabase } from '@/lib/supabaseClient'

/** The teacher's comment on a learner's term (STEP 26), printed on the term report. */
export interface TermComment {
  class_id: string
  learner_id: string
  year: number
  term: number
  comment: string
}

const isMissing = (error: { code?: string; message?: string }) =>
  error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message ?? '')

/** A class's comments for the year, by "learnerId|term"; null before STEP 26. */
export async function fetchClassComments(classId: string, year: number): Promise<Map<string, TermComment> | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('sba_term_comments').select('class_id, learner_id, year, term, comment').eq('class_id', classId).eq('year', year)
  if (error) {
    if (!isMissing(error)) console.error('Failed to load term comments:', error)
    return null
  }
  return new Map((data ?? []).map((c) => [`${c.learner_id}|${c.term}`, c as TermComment]))
}

/** A learner's own comments (for the learner, or a linked parent). */
export async function fetchLearnerComments(learnerId: string): Promise<TermComment[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('sba_term_comments').select('class_id, learner_id, year, term, comment').eq('learner_id', learnerId)
  if (error) return []
  return (data ?? []) as TermComment[]
}

/** Write, change or (with an empty comment) clear a comment. Resolves to an error message, if any. */
export async function saveComment(key: { classId: string; learnerId: string; year: number; term: number }, comment: string): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const where = { class_id: key.classId, learner_id: key.learnerId, year: key.year, term: key.term }
  const text = comment.trim()
  const { error } = !text
    ? await supabase.from('sba_term_comments').delete().match(where)
    : // The database fills in the school, subject and grade from the class; these are placeholders.
      await supabase
        .from('sba_term_comments')
        .upsert({ ...where, comment: text, subject_id: '-', grade: 12, school_id: '00000000-0000-0000-0000-000000000000' }, {
          onConflict: 'class_id,learner_id,year,term',
        })
  if (!error) return undefined
  return /row-level security|42501/i.test(error.message) ? 'Only the class teacher, the HOD or the principal can write comments for this class.' : error.message
}
