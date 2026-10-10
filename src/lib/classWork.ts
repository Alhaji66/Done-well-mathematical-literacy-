import { supabase } from '@/lib/supabaseClient'
import type { Grade } from '@/types'

/**
 * Class work (STEP 42): a teacher's own work for their classes -- a district
 * test, a DBE past paper, their own worksheet -- uploaded as files, typed as
 * questions, or both, with a memo that opens at the due date.
 *
 * Who may read, write and mark what is decided in the database and in the
 * `class-work` bucket's rules; this file only asks.
 */

export const BUCKET = 'class-work'

export type ItemKind = 'written' | 'mcq'

export interface WorkItem {
  id: string
  /** "1.1", "2.3" ... */
  label: string
  prompt: string
  marks: number
  kind: ItemKind
  /** Multiple choice: the options, shown as A, B, C ... */
  options?: string[]
}

export interface ClassWork {
  id: string
  school_id: string
  created_by: string | null
  subject_id: string
  grade: Grade
  title: string
  instructions: string
  class_ids: string[]
  items: WorkItem[]
  paper_files: string[]
  total_marks: number
  minutes: number | null
  opens_at: string
  due_at: string
  memo_released_at: string | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface WorkMemo {
  work_id: string
  /** Per item: the model answer, and for multiple choice the correct letter. */
  answers: Record<string, { answer?: string; correct?: string }>
  memo_text: string
  memo_files: string[]
}

export interface ItemMark {
  awarded: number
  feedback?: string
  /** Marked on hand-in (multiple choice). */
  auto?: boolean
}

export interface Submission {
  id: string
  work_id: string
  learner_id: string
  school_id: string
  started_at: string
  deadline: string
  submitted_at: string | null
  answers: Record<string, string>
  files: string[]
  status: 'writing' | 'submitted' | 'marked'
  marking: Record<string, ItemMark>
  marks_awarded: number | null
  marks_total: number | null
  percent: number | null
  comment: string | null
  marked_by: string | null
  marked_at: string | null
}

/** The key a whole-work mark is kept under, for work that is not split into questions. */
export const OVERALL = '_overall'

export const letter = (i: number) => String.fromCharCode(65 + i)

/** The memo opens at the due date, or when the teacher releases it. */
export const memoIsOpen = (w: Pick<ClassWork, 'due_at' | 'memo_released_at'>, now = Date.now()) =>
  new Date(w.due_at).getTime() <= now || (w.memo_released_at !== null && new Date(w.memo_released_at).getTime() <= now)

const asWork = (row: unknown) => {
  const w = row as ClassWork
  return { ...w, items: Array.isArray(w.items) ? w.items : [], paper_files: w.paper_files ?? [], class_ids: w.class_ids ?? [] }
}

const asSubmission = (row: unknown) => {
  const s = row as Submission
  return {
    ...s,
    answers: s.answers ?? {},
    files: s.files ?? [],
    marking: s.marking ?? {},
    marks_awarded: s.marks_awarded === null ? null : Number(s.marks_awarded),
    percent: s.percent === null ? null : Number(s.percent),
  }
}

const missing = (e: { code?: string; message?: string } | null) =>
  Boolean(e && (e.code === '42P01' || e.code === 'PGRST205' || e.code === 'PGRST202' || /does not exist|schema cache/i.test(e.message ?? '')))

export interface Listed<T> {
  rows: T[]
  /** STEP 42 has not been run on this database yet. */
  notSetUp: boolean
}

/** Every piece of work this person may see: staff, theirs to manage; a learner, what is set for them. */
export async function fetchClassWork(): Promise<Listed<ClassWork>> {
  if (!supabase) return { rows: [], notSetUp: true }
  const { data, error } = await supabase.from('class_work').select('*').order('due_at', { ascending: false }).limit(300)
  if (error) return { rows: [], notSetUp: missing(error) }
  return { rows: (data ?? []).map(asWork), notSetUp: false }
}

export async function fetchWork(id: string): Promise<{ work: ClassWork | null; memo: WorkMemo | null }> {
  if (!supabase) return { work: null, memo: null }
  const [w, m] = await Promise.all([
    supabase.from('class_work').select('*').eq('id', id).maybeSingle(),
    supabase.from('class_work_memos').select('*').eq('work_id', id).maybeSingle(),
  ])
  return { work: w.data ? asWork(w.data) : null, memo: (m.data as WorkMemo | null) ?? null }
}

export type WorkDraft = Omit<ClassWork, 'id' | 'school_id' | 'created_by' | 'created_at' | 'updated_at'>

export async function saveWork(id: string, work: WorkDraft, memo: Omit<WorkMemo, 'work_id'>): Promise<{ work?: ClassWork; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase.rpc('save_class_work', { p_id: id, p_work: work, p_memo: memo })
  if (error) return { error: missing(error) ? 'Class work is not switched on yet: run STEP 42 of supabase/schema.sql.' : error.message }
  return { work: asWork(data) }
}

export async function deleteWork(id: string): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('delete_class_work', { p_id: id })
  return !error && data === true
}

/** Where a file goes: <school>/<work>/<paper|memo>/<name>, or answers/<learner>/<name>. */
export function filePath(schoolId: string, workId: string, folder: 'paper' | 'memo' | `answers/${string}`, file: File): string {
  const safe = file.name.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-80) || 'file'
  return `${schoolId}/${workId}/${folder}/${Date.now().toString(36)}-${safe}`
}

export const MAX_FILE_MB = 15

export async function uploadFile(path: string, file: File): Promise<{ path?: string; error?: string }> {
  if (!supabase) return { error: 'Not set up.' }
  if (file.size > MAX_FILE_MB * 1024 * 1024) return { error: `${file.name} is larger than ${MAX_FILE_MB} MB.` }
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined, upsert: false })
  if (error) return { error: `${file.name} could not be uploaded: ${error.message}` }
  return { path }
}

export async function removeFile(path: string): Promise<void> {
  if (!supabase) return
  await supabase.storage.from(BUCKET).remove([path])
}

/** A link that opens a private file for an hour. */
export async function fileLink(path: string): Promise<string | null> {
  if (!supabase) return null
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600)
  return data?.signedUrl ?? null
}

/** The file's name as the person uploaded it, without the folder or the time prefix. */
export const fileName = (path: string) => path.split('/').pop()!.replace(/^[a-z0-9]+-/, '')

export const isImage = (path: string) => /\.(jpe?g|png|webp)$/i.test(path)

// ------------------------------------------------------------------ learners

export async function fetchMySubmissions(): Promise<Submission[]> {
  if (!supabase) return []
  const { data: auth } = await supabase.auth.getSession()
  const uid = auth.session?.user.id
  if (!uid) return []
  const { data } = await supabase.from('class_work_submissions').select('*').eq('learner_id', uid)
  return (data ?? []).map(asSubmission)
}

export async function startWork(workId: string): Promise<{ submission?: Submission; error?: string }> {
  if (!supabase) return { error: 'Not set up.' }
  const { data, error } = await supabase.rpc('start_class_work', { p_work: workId })
  if (error) return { error: error.message }
  return { submission: asSubmission(data) }
}

export async function saveAnswers(subId: string, answers: Record<string, string>, files: string[]): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('save_class_work_answers', { p_sub: subId, p_answers: answers, p_files: files })
  return !error && data === true
}

export async function handIn(subId: string, answers: Record<string, string>, files: string[]): Promise<Submission | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('submit_class_work', { p_sub: subId, p_answers: answers, p_files: files })
  return error || !data ? null : asSubmission(data)
}

// --------------------------------------------------------------------- staff

export async function fetchSubmissions(workId: string): Promise<Submission[]> {
  if (!supabase) return []
  const { data } = await supabase.from('class_work_submissions').select('*').eq('work_id', workId)
  return (data ?? []).map(asSubmission)
}

export async function markSubmission(subId: string, marking: Record<string, ItemMark>, comment: string): Promise<{ submission?: Submission; error?: string }> {
  if (!supabase) return { error: 'Not set up.' }
  const { data, error } = await supabase.rpc('mark_class_work', { p_sub: subId, p_marking: marking, p_comment: comment })
  if (error) return { error: error.message }
  return { submission: asSubmission(data) }
}

/** Marked class work, with its subject and grade, for Levels and the early warnings. */
export interface MarkedWork {
  learner_id: string
  work_id: string
  title: string
  subject_id: string
  grade: Grade
  submitted_at: string
  percent: number
}

export async function fetchMarkedWork(since: string): Promise<MarkedWork[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('class_work_submissions')
    .select('learner_id, work_id, submitted_at, percent, class_work(title, subject_id, grade)')
    .eq('status', 'marked')
    .gte('submitted_at', since)
    .limit(5000)
  if (error) return []
  type Row = { learner_id: string; work_id: string; submitted_at: string | null; percent: number | null; class_work: { title: string; subject_id: string; grade: Grade } | null }
  return ((data ?? []) as unknown as Row[])
    .filter((r) => r.class_work && r.submitted_at && r.percent !== null)
    .map((r) => ({
      learner_id: r.learner_id,
      work_id: r.work_id,
      title: r.class_work!.title,
      subject_id: r.class_work!.subject_id,
      grade: r.class_work!.grade,
      submitted_at: r.submitted_at!,
      percent: Number(r.percent),
    }))
}
