import { supabase } from '@/lib/supabaseClient'

export interface SchoolTeacher {
  id: string
  full_name: string
  created_at: string
}

export async function fetchSchoolTeachers(schoolId: string): Promise<SchoolTeacher[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, created_at')
    .eq('school_id', schoolId)
    .eq('role', 'teacher')
  if (error) {
    console.error('Failed to load school teachers:', error)
    return []
  }
  return data ?? []
}
