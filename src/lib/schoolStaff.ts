import { supabase } from '@/lib/supabaseClient'

export interface SchoolTeacher {
  id: string
  full_name: string
  created_at: string
  /** 'teacher' or 'hod' -- needed so a principal can tell them apart and correct a mistap. */
  role?: string
}

export async function fetchSchoolTeachers(schoolId: string): Promise<SchoolTeacher[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, created_at, role')
    .eq('school_id', schoolId)
    // An HOD is teaching staff too. Filtering on role = 'teacher' alone left
    // every head of department missing from their own principal's staff list.
    .in('role', ['teacher', 'hod'])
  if (error) {
    console.error('Failed to load school teachers:', error)
    return []
  }
  return data ?? []
}

/**
 * The teachers in one department -- same school, same subject.
 *
 * A Head of Department's roster is not "everyone who teaches here", which is
 * what fetchSchoolTeachers returns for a principal. It is the people teaching
 * the HOD's own subject, and the subject is what makes them a department.
 *
 * Teachers who have not set a subject yet are deliberately excluded rather
 * than shown to every HOD at the school: a null subject_id means "not stated",
 * and guessing which department an unstated teacher belongs to would put a
 * colleague on the wrong person's list.
 */
export async function fetchDepartmentTeachers(schoolId: string, subjectId: string): Promise<SchoolTeacher[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, created_at')
    .eq('school_id', schoolId)
    .eq('subject_id', subjectId)
    .in('role', ['teacher', 'hod'])
  if (error) {
    console.error('Failed to load department teachers:', error)
    return []
  }
  return data ?? []
}
