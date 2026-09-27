import { supabase } from '@/lib/supabaseClient'
import { markSplitFor, type SbaTask } from '@/data/sba'
export { capsLevel } from '@/lib/capsScale'
export { markBookTasks } from '@/data/sba'
import type { Grade } from '@/types'

/**
 * The SBA mark book: each learner's mark for each formal task of the DBE
 * Programme of Assessment, per class. Access rules are in STEP 21 of
 * supabase/schema.sql. Only raw marks are stored; the SBA and promotion marks
 * are worked out here from the programme's weights.
 */

export type MarkStatus = 'marked' | 'absent' | 'exempt'

export interface SbaMarkRow {
  id: number
  class_id: string
  learner_id: string
  subject_id: string
  grade: Grade
  year: number
  task_key: string
  out_of: number
  mark: number | null
  status: MarkStatus
  updated_at: string
}

/** What a teacher types in a cell: a number, "a" for absent, "e" for excused, or nothing. */
export type CellValue = number | 'absent' | 'exempt' | null

export function parseCell(text: string): CellValue | 'invalid' {
  const t = text.trim().toLowerCase()
  if (!t) return null
  if (t === 'a' || t === 'ab' || t === 'abs' || t === 'absent') return 'absent'
  if (t === 'e' || t === 'ex' || t === 'exempt' || t === 'excused') return 'exempt'
  const n = Number(t.replace(',', '.'))
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 10) / 10 : 'invalid'
}

export function cellText(row: Pick<SbaMarkRow, 'mark' | 'status'> | undefined): string {
  if (!row) return ''
  if (row.status === 'absent') return 'ABS'
  if (row.status === 'exempt') return 'EX'
  return String(row.mark).replace('.', ',')
}

const isMissing = (error: { code?: string; message?: string }) =>
  error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message ?? '')

export async function fetchClassMarks(classId: string, year: number): Promise<{ rows: SbaMarkRow[]; notSetUp: boolean }> {
  if (!supabase) return { rows: [], notSetUp: true }
  const { data, error } = await supabase.from('sba_marks').select('*').eq('class_id', classId).eq('year', year)
  if (error) {
    if (!isMissing(error)) console.error('Failed to load marks:', error)
    return { rows: [], notSetUp: isMissing(error) }
  }
  return { rows: (data ?? []) as SbaMarkRow[], notSetUp: false }
}

/** Every mark a learner has, in every class and year: for the learner and their linked parents. */
export async function fetchLearnerMarks(learnerId: string): Promise<{ rows: SbaMarkRow[]; notSetUp: boolean }> {
  if (!supabase) return { rows: [], notSetUp: true }
  const { data, error } = await supabase.from('sba_marks').select('*').eq('learner_id', learnerId)
  if (error) {
    if (!isMissing(error)) console.error('Failed to load marks:', error)
    return { rows: [], notSetUp: isMissing(error) }
  }
  return { rows: (data ?? []) as SbaMarkRow[], notSetUp: false }
}

export interface MarkReport {
  classId: string
  year: number
  subjectId: string
  grade: Grade
  marks: Map<string, SbaMarkRow>
}

/** A learner's marks as one report per class and year, the latest year first. */
export function groupLearnerMarks(rows: SbaMarkRow[]): MarkReport[] {
  const out = new Map<string, MarkReport>()
  for (const r of rows) {
    const id = `${r.year}|${r.class_id}`
    if (!out.has(id)) out.set(id, { classId: r.class_id, year: r.year, subjectId: r.subject_id, grade: r.grade, marks: new Map() })
    out.get(id)!.marks.set(r.task_key, r)
  }
  return [...out.values()].sort((a, b) => b.year - a.year || a.subjectId.localeCompare(b.subjectId))
}

/** Save one cell. An empty cell deletes the mark. Resolves to the saved row, or an error message. */
export async function saveMark(input: {
  classId: string
  learnerId: string
  year: number
  taskKey: string
  outOf: number
  value: CellValue
}): Promise<{ row?: SbaMarkRow; deleted?: boolean; error?: string }> {
  if (!supabase) return { error: 'Not connected.' }
  const where = { class_id: input.classId, learner_id: input.learnerId, year: input.year, task_key: input.taskKey }
  if (input.value === null) {
    const { error } = await supabase.from('sba_marks').delete().match(where)
    return error ? { error: error.message } : { deleted: true }
  }
  const { data, error } = await supabase
    .from('sba_marks')
    .upsert(
      {
        ...where,
        out_of: input.outOf,
        mark: typeof input.value === 'number' ? input.value : null,
        status: typeof input.value === 'number' ? 'marked' : input.value,
      },
      { onConflict: 'class_id,learner_id,year,task_key' },
    )
    .select('*')
    .single()
  if (error) return { error: /row-level security|42501/i.test(error.message) ? 'You cannot enter marks for this class.' : error.message }
  return { row: data as SbaMarkRow }
}

/**
 * Which tasks a class's learners and parents can see (STEP 22): the task keys
 * released for the class and year. Null before STEP 22 is run, when every
 * mark shows as soon as it is entered.
 */
export async function fetchReleases(classId: string, year: number): Promise<Set<string> | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('sba_releases').select('task_key').eq('class_id', classId).eq('year', year)
  if (error) {
    if (!isMissing(error)) console.error('Failed to load releases:', error)
    return null
  }
  return new Set((data ?? []).map((r) => r.task_key as string))
}

/** Release a task's marks to the class, or withdraw the release. Resolves to an error message, if any. */
export async function setReleased(classId: string, year: number, taskKey: string, released: boolean): Promise<string | undefined> {
  if (!supabase) return 'Not connected.'
  const { error } = released
    ? await supabase.from('sba_releases').insert({ class_id: classId, year, task_key: taskKey })
    : await supabase.from('sba_releases').delete().match({ class_id: classId, year, task_key: taskKey })
  if (!error || error.code === '23505') return undefined
  return /row-level security|42501/i.test(error.message) ? 'You cannot release marks for this class.' : error.message
}

const PAGE = 1000

/** Every mark in these classes for the year, for the progress overview. Paged: the API returns at most 1000 rows a request. */
export async function fetchMarksFor(classIds: string[], year: number): Promise<SbaMarkRow[] | null> {
  if (!supabase || classIds.length === 0) return []
  const rows: SbaMarkRow[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('sba_marks')
      .select('*')
      .in('class_id', classIds)
      .eq('year', year)
      .order('id')
      .range(from, from + PAGE - 1)
    if (error) {
      if (!isMissing(error)) console.error('Failed to load marks:', error)
      return null
    }
    rows.push(...((data ?? []) as SbaMarkRow[]))
    if (!data || data.length < PAGE) return rows
  }
}

/** The released tasks of each of these classes, or null before STEP 22. */
export async function fetchReleasesFor(classIds: string[], year: number): Promise<Map<string, Set<string>> | null> {
  if (!supabase) return null
  if (classIds.length === 0) return new Map()
  const { data, error } = await supabase.from('sba_releases').select('class_id, task_key').in('class_id', classIds).eq('year', year)
  if (error) {
    if (!isMissing(error)) console.error('Failed to load releases:', error)
    return null
  }
  const out = new Map<string, Set<string>>()
  for (const r of data ?? []) {
    if (!out.has(r.class_id as string)) out.set(r.class_id as string, new Set())
    out.get(r.class_id as string)!.add(r.task_key as string)
  }
  return out
}

export interface LearnerResult {
  /** SBA as a percentage of the weight covered so far, or null before any mark. */
  sba: number | null
  /** How much of the SBA (in per cent) the entered marks cover. */
  covered: number
  /** Grades 10-11: the promotion mark, once the end-of-year exam is entered. */
  promotion: number | null
}

/**
 * A learner's SBA and promotion marks from their row of the mark book.
 *
 * An absent learner scores 0 for the task; an excused one is left out, and the
 * other tasks are scaled up to fill its weight -- the usual handling of a
 * valid absence. The end-of-year examination (Grades 10-11) is not SBA; it
 * combines with the SBA by the national split.
 */
export function learnerResult(tasks: SbaTask[], grade: Grade, byTask: Map<string, Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>>): LearnerResult {
  let earned = 0
  let covered = 0
  let excused = 0
  for (const t of tasks) {
    if (!t.sbaWeight) continue
    const row = byTask.get(t.slot)
    if (!row) continue
    if (row.status === 'exempt') {
      excused += t.sbaWeight
      continue
    }
    const fraction = row.status === 'absent' ? 0 : Math.min(1, (row.mark ?? 0) / row.out_of)
    earned += fraction * t.sbaWeight
    covered += t.sbaWeight
  }
  const sba = covered ? (earned / covered) * 100 : null
  const exam = tasks.find((t) => t.exam === 'end-of-year')
  const examRow = exam ? byTask.get(exam.slot) : undefined
  const split = markSplitFor(grade)
  const promotion =
    sba !== null && examRow && examRow.status !== 'exempt'
      ? (sba * split.sba + (examRow.status === 'absent' ? 0 : ((examRow.mark ?? 0) / examRow.out_of) * 100) * split.exam) / 100
      : null
  return { sba, covered: covered + excused, promotion }
}

/**
 * A learner's term mark: the term's formal tasks weighted by the DBE term
 * weights (equally where the programme gives none, as for a term with only the
 * end-of-year examination). Absent scores 0; excused is left out, the other
 * tasks carrying its weight. Null before any of the term's tasks is marked.
 */
export function termResult(
  tasks: SbaTask[],
  term: number,
  byTask: Map<string, Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>>,
): { percent: number | null; covered: number; tasks: SbaTask[] } {
  const inTerm = tasks.filter((t) => t.term === term)
  const weightOf = (t: SbaTask) => (inTerm.some((x) => x.termWeight) ? (t.termWeight ?? 0) : 1)
  const total = inTerm.reduce((a, t) => a + weightOf(t), 0)
  let earned = 0
  let weight = 0
  let excused = 0
  for (const t of inTerm) {
    const row = byTask.get(t.slot)
    if (!row) continue
    if (row.status === 'exempt') {
      excused += weightOf(t)
      continue
    }
    const fraction = row.status === 'absent' ? 0 : Math.min(1, (row.mark ?? 0) / row.out_of)
    earned += fraction * weightOf(t)
    weight += weightOf(t)
  }
  return {
    percent: weight ? (earned / weight) * 100 : null,
    covered: total ? ((weight + excused) / total) * 100 : 0,
    tasks: inTerm,
  }
}

