import { supabase } from '@/lib/supabaseClient'
import type { Paper } from '@/data/papers'
import type { Grade } from '@/types'

/**
 * A past or predicted paper written under exam conditions (STEP 41).
 *
 * The learner starts the paper, which fixes its deadline on the server; their
 * answers are saved as they write; they hand it in, or the time runs out. Only
 * then does the memo open, and the paper is marked by the mark-paper function
 * -- multiple choice exactly, written answers against the memo -- which writes
 * the marks and tells the learner's teacher.
 */

export type AttemptStatus = 'writing' | 'submitted' | 'marking' | 'marked'

export interface ItemMark {
  awarded: number
  outOf: number
  feedback: string
  how: 'mcq' | 'ai' | 'auto' | 'blank'
}

export interface PaperAttempt {
  id: string
  learner_id: string
  school_id: string | null
  paper_id: string
  subject_id: string
  grade: Grade
  title: string
  started_at: string
  deadline: string
  submitted_at: string | null
  answers: Record<string, string>
  status: AttemptStatus
  marked_at: string | null
  marked_by: 'ai' | 'auto' | null
  provisional: boolean
  marks_awarded: number | null
  marks_total: number | null
  percent: number | null
  marking: Record<string, ItemMark> | null
  per_topic: Record<string, { awarded: number; outOf: number }> | null
}

/** Whether the memo may be shown: the paper is handed in, or its time is up. */
export const memoOpen = (a: Pick<PaperAttempt, 'submitted_at' | 'deadline'>, now = Date.now()) =>
  Boolean(a.submitted_at) || new Date(a.deadline).getTime() <= now

export type StartError = 'no_access' | 'not_set_up' | 'offline' | 'unknown'

const asAttempt = (row: unknown) => {
  const a = row as PaperAttempt
  return { ...a, answers: a.answers ?? {}, marks_awarded: a.marks_awarded === null ? null : Number(a.marks_awarded), percent: a.percent === null ? null : Number(a.percent) }
}

/** This learner's attempts at one paper, newest first. */
export async function fetchMyPaperAttempts(paperId: string): Promise<PaperAttempt[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('paper_attempts').select('*').eq('paper_id', paperId).order('started_at', { ascending: false })
  if (error) return null
  return (data ?? []).map(asAttempt)
}

/** This learner's marked papers, newest first -- for their own record. */
export async function fetchMyMarkedPapers(): Promise<PaperAttempt[]> {
  if (!supabase) return []
  const { data } = await supabase.from('paper_attempts').select('*').eq('status', 'marked').order('submitted_at', { ascending: false }).limit(50)
  return (data ?? []).map(asAttempt)
}

export async function startPaper(paper: Paper): Promise<{ attempt?: PaperAttempt; error?: StartError }> {
  if (!supabase) return { error: 'not_set_up' }
  const { data, error } = await supabase.rpc('start_paper', {
    p_paper: paper.id,
    p_subject: paper.subjectId,
    p_grade: paper.grade,
    p_title: paper.title,
    p_minutes: paper.durationMinutes,
  })
  if (!error && data) return { attempt: asAttempt(data) }
  if (error?.code === '42501') return { error: 'no_access' }
  if (error?.code === 'PGRST202' || error?.code === '42P01' || error?.code === '42883') return { error: 'not_set_up' }
  return { error: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'unknown' }
}

/** Saves the answers so far; false once the paper is closed (or offline). */
export async function savePaperAnswers(attemptId: string, answers: Record<string, string>): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('save_paper_answers', { p_attempt: attemptId, p_answers: answers })
  return !error && data === true
}

export async function submitPaper(attemptId: string, answers: Record<string, string>): Promise<PaperAttempt | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('submit_paper', { p_attempt: attemptId, p_answers: answers })
  return error || !data ? null : asAttempt(data)
}

export type MarkError = 'not_set_up' | 'still_writing' | 'paper_unavailable' | 'offline' | 'unknown'

/**
 * Asks for the paper to be marked. "marking" means another request is already
 * on it -- the caller polls the attempt until it is marked.
 */
export async function requestMarking(attemptId: string, remark = false): Promise<{ status?: 'marked' | 'marking'; error?: MarkError }> {
  if (!supabase) return { error: 'not_set_up' }
  if (typeof navigator !== 'undefined' && !navigator.onLine) return { error: 'offline' }
  const { data, error } = await supabase.functions.invoke<{ status: 'marked' | 'marking' }>('mark-paper', { body: { attemptId, remark } })
  if (!error && data) return { status: data.status }
  const context = (error as { context?: Response } | null)?.context
  if (context && typeof context.json === 'function') {
    if (context.status === 404 && !(await context.clone().text()).includes('not_found')) return { error: 'not_set_up' }
    try {
      const body = (await context.json()) as { error?: MarkError; status?: 'marking' }
      if (body?.status === 'marking') return { status: 'marking' }
      if (body?.error) return { error: body.error }
    } catch {
      // not JSON
    }
  }
  return { error: 'unknown' }
}

export async function fetchPaperAttempt(attemptId: string): Promise<PaperAttempt | null> {
  if (!supabase) return null
  const { data } = await supabase.from('paper_attempts').select('*').eq('id', attemptId).maybeSingle()
  return data ? asAttempt(data) : null
}

/**
 * Marked papers a member of staff may see (RLS decides: their subject, their
 * classes, or the whole school for the principal), from a given date.
 */
export async function fetchPaperResultsForStaff(schoolId: string, since: string): Promise<PaperAttempt[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('paper_attempts')
    .select('*')
    .eq('school_id', schoolId)
    .eq('status', 'marked')
    .gte('submitted_at', since)
    .order('submitted_at', { ascending: false })
    .limit(2000)
  return (data ?? []).map(asAttempt)
}

/** Minutes and seconds left, as "1:42:05" or "12:09". */
export function timeLeft(deadline: string, now = Date.now()): string {
  const s = Math.max(0, Math.floor((new Date(deadline).getTime() - now) / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}
