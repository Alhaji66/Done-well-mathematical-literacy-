import { supabase } from '@/lib/supabaseClient'
import type { Grade } from '@/types'

/**
 * A teacher's record of a week they taught from a lesson plan, and the head
 * of department's sign-off on it. Access rules are in STEP 20 of
 * supabase/schema.sql.
 *
 * The plan itself is not stored: it is rebuilt from the ATP week, the weeks on
 * the topic and the period length, which is exactly what the teacher chose.
 */

export type RecordStatus = 'draft' | 'submitted' | 'signed' | 'returned'

export interface LessonPlanRecord {
  id: string
  school_id: string
  teacher_id: string
  subject_id: string
  grade: Grade
  year: number
  week_index: number
  title: string
  term: number
  topic_id: string | null
  weeks: number | null
  lesson_minutes: number
  lessons_planned: number
  lessons_taught: number
  dates: string
  reflection: string
  status: RecordStatus
  submitted_at: string | null
  review_comment: string
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

/** What the teacher fills in; everything else is set by the database. */
export type RecordDraft = Pick<
  LessonPlanRecord,
  | 'subject_id'
  | 'grade'
  | 'week_index'
  | 'title'
  | 'term'
  | 'topic_id'
  | 'weeks'
  | 'lesson_minutes'
  | 'lessons_planned'
  | 'lessons_taught'
  | 'dates'
  | 'reflection'
>

export const STATUS_LABEL: Record<RecordStatus, string> = {
  draft: 'Draft',
  submitted: 'Waiting for sign-off',
  signed: 'Signed off',
  returned: 'Returned to you',
}

const isMissing = (error: { code?: string; message?: string }) =>
  error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message ?? '')

export async function fetchMyRecords(teacherId: string): Promise<{ records: LessonPlanRecord[]; notSetUp: boolean }> {
  if (!supabase) return { records: [], notSetUp: true }
  const { data, error } = await supabase
    .from('lesson_plan_records')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('updated_at', { ascending: false })
  if (error) {
    if (!isMissing(error)) console.error('Failed to load lesson plan records:', error)
    return { records: [], notSetUp: isMissing(error) }
  }
  return { records: (data ?? []) as LessonPlanRecord[], notSetUp: false }
}

/**
 * Save the teacher's record of a week, creating it the first time. A record
 * is one per teacher, subject, grade, year and ATP week.
 */
export async function saveRecord(
  existing: LessonPlanRecord | undefined,
  draft: RecordDraft,
  status: 'draft' | 'submitted',
  who: { teacherId: string; schoolId: string },
): Promise<{ record?: LessonPlanRecord; error?: string }> {
  if (!supabase) return { error: 'Not connected.' }
  const query = existing
    ? supabase.from('lesson_plan_records').update({ ...draft, status }).eq('id', existing.id)
    : supabase.from('lesson_plan_records').insert({ ...draft, status, teacher_id: who.teacherId, school_id: who.schoolId })
  const { data, error } = await query.select('*').single()
  if (error) return { error: error.message }
  return { record: data as LessonPlanRecord }
}

export async function deleteRecord(id: string): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.from('lesson_plan_records').delete().eq('id', id)
  return error?.message
}

/** Every record the HOD (or principal) may review at the school, newest first. */
export async function fetchRecordsForReview(
  schoolId: string,
  subjectId: string | null,
): Promise<{ records: LessonPlanRecord[]; names: Map<string, string>; notSetUp: boolean }> {
  if (!supabase) return { records: [], names: new Map(), notSetUp: true }
  let query = supabase.from('lesson_plan_records').select('*').eq('school_id', schoolId).neq('status', 'draft')
  if (subjectId) query = query.eq('subject_id', subjectId)
  const [{ data, error }, people] = await Promise.all([
    query.order('submitted_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name').eq('school_id', schoolId),
  ])
  if (error) {
    if (!isMissing(error)) console.error('Failed to load lesson plan records:', error)
    return { records: [], names: new Map(), notSetUp: isMissing(error) }
  }
  const names = new Map((people.data ?? []).map((p) => [p.id as string, p.full_name as string]))
  return { records: (data ?? []) as LessonPlanRecord[], names, notSetUp: false }
}

export async function reviewRecord(id: string, sign: boolean, comment: string): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('review_lesson_plan', { p_record: id, p_sign: sign, p_comment: comment })
  return error?.message
}

export const formatDay = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
