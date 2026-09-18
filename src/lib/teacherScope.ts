import { supabase } from '@/lib/supabaseClient'
import { getTopic } from '@/data/topics'
import type { AccountProfile } from '@/context/AccountAuthContext'
import type { RosterLearner, RosterProgressRow } from '@/lib/teacherRoster'

/**
 * What a teacher should be looking at, as opposed to what a school should.
 *
 * Both roles were showing every learner at the school and every topic anybody
 * had touched. For a school head that is the job. For a Mathematical Literacy
 * teacher it meant Life Sciences topics in their own analytics, next to
 * learners they do not teach -- which is not a filter preference, it is the
 * screen answering a question they did not ask.
 *
 * So: a teacher is scoped to their own subject, a school sees everything. The
 * scope is the teacher's own subject_id, which is now set at onboarding and can
 * be changed later from the dashboard.
 */

/** The subject a view should be limited to, or null to show everything. */
export function scopeSubjectFor(profile: AccountProfile | null): string | null {
  if (!profile) return null
  return profile.role === 'teacher' ? profile.subject_id : null
}

export function learnersInScope(learners: RosterLearner[], subjectId: string | null): RosterLearner[] {
  if (!subjectId) return learners
  return learners.filter((l) => l.subject_id === subjectId)
}

/**
 * Progress rows are filtered by the SUBJECT OF THE TOPIC, not by the learner.
 * A learner registered for Mathematical Literacy who has also practised a Life
 * Sciences topic would otherwise drag a foreign topic into the Mat Lit
 * teacher's averages through the back door.
 */
export function progressInScope(rows: RosterProgressRow[], subjectId: string | null): RosterProgressRow[] {
  if (!subjectId) return rows
  return rows.filter((row) => getTopic(row.topic_id)?.subjectId === subjectId)
}

/** Change the subject a teacher is scoped to. */
export async function setMySubject(profileId: string, subjectId: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('profiles').update({ subject_id: subjectId }).eq('id', profileId)
  if (error) {
    console.error('Failed to change the subject you teach:', error)
    return error.message
  }
  return undefined
}

/**
 * Correct somebody's role at your own school.
 *
 * Every account picks its role on the first screen it ever sees, so mistaps are
 * inevitable -- a teacher tapping "Learner" ends up on their colleague's class
 * list with a mastery bar. Without this the only remedy was an administrator in
 * the database, which is not a remedy a school has.
 */
export async function setAccountRole(
  profileId: string,
  role: 'learner' | 'teacher' | 'school' | 'parent',
): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase
    .from('profiles')
    // A person who is not a learner has no grade, and carrying a stale one into
    // a teacher row would put them back in grade filters later.
    .update({ role, ...(role === 'learner' ? {} : { grade: null }) })
    .eq('id', profileId)
  if (error) {
    console.error('Failed to change this account\'s role:', error)
    return error.message
  }
  return undefined
}
