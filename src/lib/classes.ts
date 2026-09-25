import { supabase } from '@/lib/supabaseClient'
import type { AccountProfile } from '@/context/AccountAuthContext'
import type { Grade } from '@/types'

/**
 * Classes: a teacher's own group of learners, inside a school.
 *
 * Before these existed a teacher's "class" was every learner at the school in
 * their subject, narrowed by the grades they ticked -- so two Grade 12 Mat Lit
 * teachers each saw the other's learners and the other's average. The rules
 * about who may see and change a class live in the database (STEP 14 of
 * supabase/schema.sql); this file only asks.
 */

export interface SchoolClass {
  id: string
  school_id: string
  name: string
  grade: Grade
  subject_id: string
  teacher_id: string | null
  created_at: string
}

export interface ClassMember {
  class_id: string
  learner_id: string
  added_at: string
}

/**
 * Did the request fail because STEP 14 has not been run yet?
 *
 * The app ships before the SQL is run, so a missing table must read as "not
 * switched on" rather than as an error the teacher can do nothing about.
 */
function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    /does not exist|schema cache/i.test(error.message ?? '')
  )
}

export interface ClassesResult {
  classes: SchoolClass[]
  /** True when the database does not have classes yet (STEP 14 not run). */
  notSetUp: boolean
  error?: string
}

export async function fetchClasses(schoolId: string): Promise<ClassesResult> {
  if (!supabase) return { classes: [], notSetUp: true }
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('school_id', schoolId)
    .order('grade')
    .order('name')
  if (isMissingTable(error)) return { classes: [], notSetUp: true }
  if (error) {
    console.error('Failed to load classes:', error)
    return { classes: [], notSetUp: false, error: error.message }
  }
  return { classes: (data ?? []) as SchoolClass[], notSetUp: false }
}

export async function fetchClassMembers(classIds: string[]): Promise<ClassMember[]> {
  if (!supabase || classIds.length === 0) return []
  const { data, error } = await supabase.from('class_members').select('*').in('class_id', classIds)
  if (error) {
    if (!isMissingTable(error)) console.error('Failed to load class lists:', error)
    return []
  }
  return (data ?? []) as ClassMember[]
}

/**
 * The classes a learner is in. The database shows a learner only their own
 * membership rows, so this is safe to call from a learner's session.
 */
export async function fetchMyClassIds(learnerId: string): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('class_members').select('class_id').eq('learner_id', learnerId)
  if (error) {
    if (!isMissingTable(error)) console.error('Failed to load your classes:', error)
    return []
  }
  return (data ?? []).map((r) => r.class_id as string)
}

/**
 * Can this person manage this class? Mirrors can_manage_class() in the schema
 * so the app does not offer buttons the database will refuse. The database is
 * still the one that decides.
 */
export function canManageClass(profile: AccountProfile | null, cls: Pick<SchoolClass, 'teacher_id'>): boolean {
  if (!profile) return false
  if (profile.role === 'school' || profile.role === 'hod') return true
  return profile.role === 'teacher' && cls.teacher_id === profile.id
}

/** A database refusal, in words a teacher can act on. */
function explain(error: { code?: string; message?: string }): string {
  if (error.code === '23505') return 'There is already a class with that name at your school. Choose another name.'
  if (error.code === '23503') {
    return 'This class still has weekly tests, which hold learners’ results. Delete its tests first, then the class.'
  }
  if (error.code === '42501' || /row-level security/i.test(error.message ?? '')) {
    return 'You do not have permission to do that. A teacher manages their own classes; the school account and HODs can manage any class.'
  }
  return error.message ?? 'Something went wrong.'
}

export async function createClass(input: {
  schoolId: string
  name: string
  grade: Grade
  subjectId: string
  teacherId: string | null
}): Promise<{ created?: SchoolClass; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase
    .from('classes')
    .insert({
      school_id: input.schoolId,
      name: input.name.trim(),
      grade: input.grade,
      subject_id: input.subjectId,
      teacher_id: input.teacherId,
    })
    .select('*')
    .single()
  if (error) {
    console.error('Failed to create the class:', error)
    return { error: explain(error) }
  }
  return { created: data as SchoolClass }
}

export async function updateClass(
  classId: string,
  changes: Partial<Pick<SchoolClass, 'name' | 'teacher_id'>>,
): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const patch = changes.name === undefined ? changes : { ...changes, name: changes.name.trim() }
  const { error } = await supabase.from('classes').update(patch).eq('id', classId)
  if (error) {
    console.error('Failed to change the class:', error)
    return explain(error)
  }
  return undefined
}

export async function deleteClass(classId: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('classes').delete().eq('id', classId)
  if (error) {
    console.error('Failed to delete the class:', error)
    return explain(error)
  }
  return undefined
}

export async function addLearnersToClass(classId: string, learnerIds: string[]): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  if (learnerIds.length === 0) return undefined
  const { error } = await supabase
    .from('class_members')
    .upsert(
      learnerIds.map((learner_id) => ({ class_id: classId, learner_id })),
      { onConflict: 'class_id,learner_id', ignoreDuplicates: true },
    )
  if (error) {
    console.error('Failed to add learners to the class:', error)
    return explain(error)
  }
  return undefined
}

export async function removeLearnerFromClass(classId: string, learnerId: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('class_members').delete().eq('class_id', classId).eq('learner_id', learnerId)
  if (error) {
    console.error('Failed to remove the learner from the class:', error)
    return explain(error)
  }
  return undefined
}

/**
 * The classes a person should see first: a teacher's own, or for a school
 * leader every class (an HOD's narrowed to their department).
 */
export function classesInView(profile: AccountProfile | null, classes: SchoolClass[]): SchoolClass[] {
  if (!profile) return []
  if (profile.role === 'teacher') return classes.filter((c) => c.teacher_id === profile.id)
  if (profile.role === 'hod' && profile.subject_id) return classes.filter((c) => c.subject_id === profile.subject_id)
  return classes
}
