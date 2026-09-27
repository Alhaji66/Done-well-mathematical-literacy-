import { supabase } from '@/lib/supabaseClient'
import type { Grade } from '@/types'

/**
 * The assessment schedule (STEP 24): the date each formal task is written,
 * handed in or examined, per class. Learners and parents see it; overdue
 * marks count from it.
 */

export interface TaskDate {
  class_id: string
  year: number
  task_key: string
  subject_id: string
  grade: Grade
  /** YYYY-MM-DD. */
  due_on: string
  note: string
}

const isMissing = (error: { code?: string; message?: string }) =>
  error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message ?? '')

/** Every date the signed-in person may see for the year, or null before STEP 24. */
async function fetchDates(filter: (q: ReturnType<ReturnType<NonNullable<typeof supabase>['from']>['select']>) => typeof q): Promise<TaskDate[] | null> {
  if (!supabase) return null
  const { data, error } = await filter(supabase.from('sba_task_dates').select('class_id, year, task_key, subject_id, grade, due_on, note'))
  if (error) {
    if (!isMissing(error)) console.error('Failed to load the assessment schedule:', error)
    return null
  }
  return (data ?? []) as TaskDate[]
}

export async function fetchDatesFor(classIds: string[], year: number): Promise<Map<string, Map<string, TaskDate>> | null> {
  if (classIds.length === 0) return new Map()
  const rows = await fetchDates((q) => q.in('class_id', classIds).eq('year', year))
  if (!rows) return null
  const out = new Map<string, Map<string, TaskDate>>()
  for (const r of rows) {
    if (!out.has(r.class_id)) out.set(r.class_id, new Map())
    out.get(r.class_id)!.set(r.task_key, r)
  }
  return out
}

/** The dates of the classes a learner is in (for the learner, or a linked parent). */
export async function fetchLearnerDates(learnerId: string, year: number): Promise<TaskDate[] | null> {
  if (!supabase) return null
  const { data: members } = await supabase.from('class_members').select('class_id').eq('learner_id', learnerId)
  const ids = (members ?? []).map((m) => m.class_id as string)
  if (ids.length === 0) return []
  return fetchDates((q) => q.in('class_id', ids).eq('year', year))
}

/** Set or move a task's date, or clear it (null). Resolves to an error message, if any. */
export async function saveTaskDate(classId: string, year: number, taskKey: string, dueOn: string | null, note: string): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const key = { class_id: classId, year, task_key: taskKey }
  const { error } =
    dueOn === null
      ? await supabase.from('sba_task_dates').delete().match(key)
      : // The database fills in the school, subject and grade from the class; these are placeholders.
        await supabase
          .from('sba_task_dates')
          .upsert({ ...key, due_on: dueOn, note: note.trim(), subject_id: '-', grade: 12, school_id: '00000000-0000-0000-0000-000000000000' }, {
            onConflict: 'class_id,year,task_key',
          })
  if (!error) return undefined
  return /row-level security|42501/i.test(error.message) ? 'Only the class teacher, the HOD or the principal can set dates for this class.' : error.message
}

/** "Mon 12 Oct", from YYYY-MM-DD. */
export const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

/** Today as YYYY-MM-DD, in the viewer's own time zone. */
export const todayIso = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
