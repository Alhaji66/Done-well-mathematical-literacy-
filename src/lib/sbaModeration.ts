import { supabase } from '@/lib/supabaseClient'
import type { AccountProfile } from '@/context/AccountAuthContext'

/**
 * Internal moderation of the SBA (STEP 23): the subject's head of department
 * or the principal re-marks a sample of a class's scripts for a task, compares
 * the moderated marks with the teacher's, and accepts the task's marks or
 * returns them with a comment.
 */

export interface ModerationMark {
  class_id: string
  year: number
  task_key: string
  learner_id: string
  teacher_mark: number
  moderated_mark: number
  out_of: number
  updated_at: string
}

export interface ModerationDecision {
  class_id: string
  year: number
  task_key: string
  status: 'accepted' | 'returned'
  comment: string
  sample_size: number
  mean_difference: number
  moderator_id: string | null
  decided_at: string
}

/** A moderated mark more than this many percentage points from the teacher's is flagged. */
export const TOLERANCE = 5

/** The HOD of the class's subject or the principal -- not the class's own teacher. */
export function canModerate(profile: AccountProfile | null, cls: { subject_id: string; teacher_id: string | null }): boolean {
  if (!profile || cls.teacher_id === profile.id) return false
  return profile.role === 'school' || (profile.role === 'hod' && profile.subject_id === cls.subject_id)
}

const isMissing = (error: { code?: string; message?: string }) =>
  error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message ?? '')

/** A class's moderation for the year, or null before STEP 23 is run. */
export async function fetchModeration(classId: string, year: number): Promise<{ samples: ModerationMark[]; decisions: ModerationDecision[] } | null> {
  if (!supabase) return null
  const [samples, decisions] = await Promise.all([
    supabase.from('sba_moderation_marks').select('*').eq('class_id', classId).eq('year', year),
    supabase.from('sba_moderations').select('*').eq('class_id', classId).eq('year', year),
  ])
  if (samples.error || decisions.error) {
    const error = (samples.error ?? decisions.error)!
    if (!isMissing(error)) console.error('Failed to load moderation:', error)
    return null
  }
  return {
    samples: (samples.data ?? []).map((r) => ({ ...r, teacher_mark: Number(r.teacher_mark), moderated_mark: Number(r.moderated_mark) })) as ModerationMark[],
    decisions: (decisions.data ?? []).map((r) => ({ ...r, mean_difference: Number(r.mean_difference) })) as ModerationDecision[],
  }
}

/** The moderation decisions of several classes, for the overview; null before STEP 23. */
export async function fetchDecisionsFor(classIds: string[], year: number): Promise<Map<string, Map<string, ModerationDecision>> | null> {
  if (!supabase) return null
  if (classIds.length === 0) return new Map()
  const { data, error } = await supabase.from('sba_moderations').select('*').in('class_id', classIds).eq('year', year)
  if (error) {
    if (!isMissing(error)) console.error('Failed to load moderation:', error)
    return null
  }
  const out = new Map<string, Map<string, ModerationDecision>>()
  for (const d of (data ?? []) as ModerationDecision[]) {
    if (!out.has(d.class_id)) out.set(d.class_id, new Map())
    out.get(d.class_id)!.set(d.task_key, d)
  }
  return out
}

const explain = (message: string) =>
  /row-level security|42501/i.test(message) ? 'You cannot moderate this class, or its moderation has been accepted.' : message

/** Save a moderated mark, or take the script out of the sample (null). */
export async function saveModeratedMark(
  key: { classId: string; year: number; taskKey: string; learnerId: string },
  mark: number | null,
): Promise<{ row?: ModerationMark; error?: string }> {
  if (!supabase) return { error: 'Not connected.' }
  const where = { class_id: key.classId, year: key.year, task_key: key.taskKey, learner_id: key.learnerId }
  if (mark === null) {
    const { error } = await supabase.from('sba_moderation_marks').delete().match(where)
    return error ? { error: explain(error.message) } : {}
  }
  // The database fills in the teacher's mark and the total; these are placeholders.
  const { data, error } = await supabase
    .from('sba_moderation_marks')
    .upsert({ ...where, moderated_mark: mark, teacher_mark: 0, out_of: 1 }, { onConflict: 'class_id,year,task_key,learner_id' })
    .select('*')
    .single()
  if (error) return { error: explain(error.message) }
  return { row: { ...data, teacher_mark: Number(data.teacher_mark), moderated_mark: Number(data.moderated_mark) } as ModerationMark }
}

export async function decideModeration(classId: string, year: number, taskKey: string, accept: boolean, comment: string): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('decide_sba_moderation', { p_class: classId, p_year: year, p_task: taskKey, p_accept: accept, p_comment: comment })
  return error ? explain(error.message) : undefined
}

export async function reopenModeration(classId: string, year: number, taskKey: string): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.from('sba_moderations').delete().match({ class_id: classId, year, task_key: taskKey })
  return error ? explain(error.message) : undefined
}

/**
 * The scripts to moderate: a tenth of the marked scripts and at least five
 * (or all of them, if fewer), spread evenly from the highest mark to the
 * lowest so the sample covers the whole range.
 */
export function suggestSample(scripts: { learnerId: string; percent: number }[]): string[] {
  const sorted = [...scripts].sort((a, b) => b.percent - a.percent || a.learnerId.localeCompare(b.learnerId))
  const n = Math.min(sorted.length, Math.max(5, Math.ceil(sorted.length / 10)))
  if (n === 0) return []
  if (n === 1) return [sorted[0].learnerId]
  const picked = new Set<number>()
  for (let i = 0; i < n; i++) picked.add(Math.round((i * (sorted.length - 1)) / (n - 1)))
  return [...picked].map((i) => sorted[i].learnerId)
}

export interface ModerationSummary {
  n: number
  /** The mean of the absolute differences, in percentage points. */
  meanDifference: number
  /** The mean of the signed differences: positive when the moderator gave more. */
  bias: number
  largest: number
  outside: number
}

/** Differences in percentage points of the task total: moderated minus the teacher's. */
export const difference = (m: Pick<ModerationMark, 'teacher_mark' | 'moderated_mark' | 'out_of'>) =>
  ((m.moderated_mark - m.teacher_mark) / m.out_of) * 100

export function summarise(samples: Pick<ModerationMark, 'teacher_mark' | 'moderated_mark' | 'out_of'>[]): ModerationSummary | null {
  if (samples.length === 0) return null
  const d = samples.map(difference)
  return {
    n: d.length,
    meanDifference: d.reduce((a, x) => a + Math.abs(x), 0) / d.length,
    bias: d.reduce((a, x) => a + x, 0) / d.length,
    largest: Math.max(...d.map(Math.abs)),
    outside: d.filter((x) => Math.abs(x) > TOLERANCE).length,
  }
}
