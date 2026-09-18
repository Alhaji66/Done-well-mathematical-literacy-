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
  // An HOD is scoped to their subject exactly as a teacher is -- the
  // department IS a subject. What differs is the breadth WITHIN it: a
  // teacher also filters by the grades they teach, and an HOD does not,
  // because every grade in the subject is theirs to look at.
  return profile.role === 'teacher' || profile.role === 'hod' ? profile.subject_id : null
}

export function learnersInScope(learners: RosterLearner[], subjectId: string | null): RosterLearner[] {
  if (!subjectId) return learners
  return learners.filter((l) => l.subject_id === subjectId)
}

/**
 * The grades a teacher actually teaches.
 *
 * Subject alone is not enough scope. A school runs one Mathematical Literacy
 * teacher for Grade 10 and another for Grade 12, and each was being shown the
 * other's class average as if it were their own -- a number that moves when
 * they have taught nobody.
 *
 * This is kept per browser rather than on the profile on purpose: it needs no
 * migration, no SQL for the school to run, and a teacher whose allocation
 * changes in January fixes it in one tap. The cost is that it does not follow
 * them to another device, which for a filter is the right trade.
 */
export const ALL_GRADES = [10, 11, 12] as const

const gradeKey = (profileId: string) => `donewell:teaching-grades:${profileId}`

export function readTeachingGrades(profileId: string): number[] {
  try {
    const raw = localStorage.getItem(gradeKey(profileId))
    if (!raw) return [...ALL_GRADES]
    const parsed = JSON.parse(raw)
    // A stored empty array would silently hide every learner, so treat any
    // unusable value as "all grades" rather than as a filter.
    if (!Array.isArray(parsed) || parsed.length === 0) return [...ALL_GRADES]
    return parsed.filter((g): g is number => ALL_GRADES.includes(g as 10 | 11 | 12))
  } catch {
    return [...ALL_GRADES]
  }
}

export function writeTeachingGrades(profileId: string, grades: number[]) {
  try {
    localStorage.setItem(gradeKey(profileId), JSON.stringify(grades))
  } catch {
    // Private browsing, blocked site data -- the filter just does not persist.
  }
}

/** Narrow a roster to the grades the teacher selected. */
export function learnersInGrades(learners: RosterLearner[], grades: number[]): RosterLearner[] {
  if (grades.length === 0 || grades.length === ALL_GRADES.length) return learners
  return learners.filter((l) => l.grade !== null && grades.includes(l.grade))
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
  role: 'learner' | 'teacher' | 'school' | 'parent' | 'hod',
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
