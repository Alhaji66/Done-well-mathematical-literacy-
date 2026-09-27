/**
 * The formal Programme of Assessment (school-based assessment, SBA) for each
 * subject and grade, and the tasks themselves.
 *
 * THE PROGRAMME IS THE DBE'S. Every task, term, raw total, term weight and
 * SBA weight below is transcribed from the Department of Basic Education's
 * national "2024-2025 Programme of Assessment" (sections 24 Life Sciences,
 * 25 Mathematical Literacy, 26 Mathematics and 31 Physical Sciences), and
 * each grade's SBA weights add up to 100 -- check:sba fails if one does not.
 * Two cells in the Mathematics tables disagree with themselves. Grade 11's
 * end-of-year papers are "150 x 2" but "2 hours per paper"; the school sets
 * them, so they are 2 x 100 marks, 2 hours each, like Grade 10's and to match
 * the 200-mark mid-year examination. Grade 12's final papers say "100 marks
 * each for 2 hours" but "150 x 2" and 150 per paper in the final-mark table:
 * the NSC papers are 150 marks, 3 hours each, and that is used.
 *
 * WHERE THE TASKS COME FROM.
 *
 *   Tests, controlled tests and assignments are assembled from the question
 *   bank, out of the topics the ATP puts in that term, to the task's DBE raw
 *   total, and balanced to the subject's CAPS cognitive-level weighting
 *   (capsWeighting.ts). An assignment leans on longer, contextual questions.
 *
 *   Investigations, practical tasks and experiments are the written task
 *   sheets in sbaTaskSheets.ts, each with a rubric totalling the DBE raw mark.
 *
 *   Examinations are the full papers already in Assessments.
 */
import { atpFor } from './atp'
import { capsWeightingFor } from './capsWeighting'
import { getTopic } from './topics'
import { taskSheetFor, taskSheets, type SheetKind, type TaskSheet } from './sbaTaskSheets'
import type { Grade, Question } from '@/types'

/**
 * How the final mark is made up, which IS national: the SBA against the
 * examination.
 *
 *   Grades 10 and 11: SBA 40%, end-of-year examination 60%. This is DBE
 *   Circular S33 of 2022, which reintroduced the June and full end-of-year
 *   examinations in these grades and set the new split from January 2023
 *   (before that, CAPS had 25% : 75% here too).
 *
 *   Grade 12: SBA 25%, NSC final examination 75%, unchanged.
 *
 * How the SBA itself is split between its tasks is the DBE Programme of
 * Assessment, below.
 */
export interface MarkSplit {
  sba: number
  exam: number
  examName: string
  source: string
}

export function markSplitFor(grade: Grade): MarkSplit {
  return grade === 12
    ? { sba: 25, exam: 75, examName: 'NSC final examination', source: 'CAPS, Grade 12' }
    : { sba: 40, exam: 60, examName: 'end-of-year examination', source: 'DBE Circular S33 of 2022, from 2023' }
}

export type TaskKind = 'Test' | 'Assignment' | 'Examination' | SheetKind
export type ExamKind = 'mid-year' | 'preparatory' | 'end-of-year' | 'final'

export interface SbaTask {
  key: string
  /** The task's place in the grade's programme, "t1-0": how the mark book stores it. */
  slot: string
  term: 1 | 2 | 3 | 4
  kind: TaskKind
  title: string
  /** The DBE raw total: what the task is marked out of. */
  marks: number
  /** For a test or an assignment: the time allowed. */
  minutes?: number
  exam?: ExamKind
  /** The papers, for an examination: "2 papers × 75 marks, 1,5 hours each". */
  papers?: string
  /** Which of several tests in one term this is, and how many there are; it decides the topics. */
  part?: number
  parts?: number
  /** The DBE term weight and SBA weight, in per cent. Absent for the final examination. */
  termWeight?: number
  sbaWeight?: number
}

/** [term, kind, title, raw total, term weight, SBA weight, exam, papers] */
type Row = [1 | 2 | 3 | 4, TaskKind, string, number, number?, number?, ExamKind?, string?]

const PROGRAMMES: Record<string, Row[]> = {
  // 26. Mathematics
  'mathematics-10': [
    [1, 'Investigation', 'Investigation or project', 50, 25, 15],
    [1, 'Test', 'Test', 50, 75, 14],
    [2, 'Assignment', 'Assignment', 50, 25, 15],
    [2, 'Examination', 'Mid-year examination', 100, 75, 14, 'mid-year'],
    [3, 'Test', 'Test 1', 50, 25, 14],
    [3, 'Test', 'Test 2', 50, 75, 14],
    [3, 'Test', 'Test 3', 50, 0, 14],
    [4, 'Examination', 'End-of-year examination', 200, undefined, undefined, 'end-of-year', '2 papers × 100 marks, 2 hours each'],
  ],
  'mathematics-11': [
    [1, 'Investigation', 'Investigation or project', 50, 25, 15],
    [1, 'Test', 'Test', 50, 75, 14],
    [2, 'Assignment', 'Assignment', 50, 25, 15],
    [2, 'Examination', 'Mid-year examination', 200, 75, 14, 'mid-year'],
    [3, 'Test', 'Test 1', 50, 25, 14],
    [3, 'Test', 'Test 2', 50, 75, 14],
    [3, 'Test', 'Test 3', 50, 0, 14],
    [4, 'Examination', 'End-of-year examination', 200, undefined, undefined, 'end-of-year', '2 papers × 100 marks, 2 hours each'],
  ],
  'mathematics-12': [
    [1, 'Investigation', 'Investigation or project', 50, 25, 15],
    [1, 'Test', 'Test', 50, 75, 15],
    [2, 'Assignment', 'Assignment', 50, 25, 15],
    [2, 'Examination', 'Mid-year examination', 300, 75, 15, 'mid-year'],
    [3, 'Test', 'Test', 50, 25, 15],
    [3, 'Examination', 'Preparatory examination', 300, 75, 25, 'preparatory'],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 3 hours each'],
  ],
  // 25. Mathematical Literacy
  'mat-lit-10': [
    [1, 'Investigation', 'Investigation', 50, 40, 10],
    [1, 'Test', 'Controlled test 1', 50, 60, 20],
    [2, 'Assignment', 'Assignment', 50, 40, 10],
    [2, 'Examination', 'June examination', 100, 60, 30, 'mid-year', '2 papers × 50 marks, 1 hour each'],
    [3, 'Assignment', 'Assignment', 50, 40, 10],
    [3, 'Test', 'Controlled test 2', 50, 60, 20],
    [4, 'Examination', 'End-of-year examination', 150, undefined, undefined, 'end-of-year', '2 papers × 75 marks, 1,5 hours each'],
  ],
  'mat-lit-11': [
    [1, 'Investigation', 'Investigation', 50, 40, 10],
    [1, 'Test', 'Controlled test 1', 50, 60, 20],
    [2, 'Assignment', 'Assignment', 50, 40, 10],
    [2, 'Examination', 'June examination', 150, 60, 30, 'mid-year', '2 papers × 75 marks, 1,5 hours each'],
    [3, 'Assignment', 'Assignment', 50, 40, 10],
    [3, 'Test', 'Controlled test 2', 50, 60, 20],
    [4, 'Examination', 'End-of-year examination', 200, undefined, undefined, 'end-of-year', '2 papers × 100 marks, 2 hours each'],
  ],
  'mat-lit-12': [
    [1, 'Investigation', 'Investigation', 50, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 15],
    [2, 'Assignment', 'Assignment', 50, 25, 10],
    [2, 'Examination', 'June examination or controlled test', 200, 75, 25, 'mid-year', '2 papers × 100 marks, 2 hours each'],
    [3, 'Test', 'Controlled test 2', 50, 25, 15],
    [3, 'Examination', 'Preparatory examination', 300, 75, 25, 'preparatory', '2 papers × 150 marks, 3 hours each'],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 3 hours each'],
  ],
  // 31. Physical Sciences
  'physical-sciences-10': [
    [1, 'Test', 'Controlled test', 75, 100, 25],
    [2, 'Examination', 'June examination', 100, 60, 25, 'mid-year'],
    [2, 'Experiment', 'Experiment', 50, 40, 12.5],
    [3, 'Test', 'Controlled test', 75, 40, 25],
    [3, 'Experiment', 'Experiment', 50, 60, 12.5],
    [4, 'Examination', 'End-of-year examination', 200, undefined, undefined, 'end-of-year', '2 papers × 100 marks, 2 hours each'],
  ],
  'physical-sciences-11': [
    [1, 'Test', 'Controlled test', 100, 60, 25],
    [1, 'Experiment', 'Experiment', 50, 40, 12.5],
    [2, 'Examination', 'June examination', 200, 100, 25, 'mid-year'],
    [3, 'Test', 'Controlled test', 100, 60, 25],
    [3, 'Experiment', 'Experiment', 50, 40, 12.5],
    [4, 'Examination', 'End-of-year examination', 300, undefined, undefined, 'end-of-year', '2 papers × 150 marks, 3 hours each'],
  ],
  'physical-sciences-12': [
    [1, 'Test', 'Controlled test', 100, 75, 20],
    [1, 'Experiment', 'Experiment', 50, 25, 15],
    [2, 'Examination', 'June examination or controlled test', 300, 100, 20, 'mid-year'],
    [3, 'Examination', 'Preparatory examination', 300, 75, 30, 'preparatory'],
    [3, 'Experiment', 'Experiment', 50, 25, 15],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 3 hours each'],
  ],
  // 24. Life Sciences
  'life-sciences-10': [
    [1, 'Practical task', 'Practical task 1', 30, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 20],
    [2, 'Assignment', 'Assignment', 50, 25, 20],
    [2, 'Examination', 'June examination', 150, 75, 20, 'mid-year'],
    [3, 'Practical task', 'Practical task 2', 30, 25, 10],
    [3, 'Test', 'Controlled test 2', 50, 75, 20],
    [4, 'Examination', 'End-of-year examination', 300, undefined, undefined, 'end-of-year', '2 papers × 150 marks, 2,5 hours each'],
  ],
  'life-sciences-11': [
    [1, 'Practical task', 'Practical task 1', 30, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 20],
    [2, 'Assignment', 'Assignment', 50, 25, 20],
    [2, 'Examination', 'June examination', 150, 75, 20, 'mid-year'],
    [3, 'Practical task', 'Practical task 2', 30, 25, 10],
    [3, 'Test', 'Controlled test 2', 50, 75, 20],
    [4, 'Examination', 'End-of-year examination', 300, undefined, undefined, 'end-of-year', '2 papers × 150 marks, 2,5 hours each'],
  ],
  'life-sciences-12': [
    [1, 'Practical task', 'Practical task 1', 30, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 15],
    [2, 'Practical task', 'Practical task 2', 30, 50, 10],
    [2, 'Examination', 'Controlled test or June examination', 150, 50, 15, 'mid-year'],
    [3, 'Assignment', 'Assignment', 50, 25, 20],
    [3, 'Examination', 'Preparatory examination', 300, 75, 30, 'preparatory', '2 papers × 150 marks, 2,5 hours each'],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 2,5 hours each'],
  ],
}

export const PROGRAMME_SOURCE = 'DBE 2024–2025 Programme of Assessment'

/** About 1,2 minutes a mark, as the controlled tests are set: 50 marks in an hour, 100 in two. */
const minutesFor = (kind: TaskKind, marks: number) => (kind === 'Assignment' ? 90 : marks <= 50 ? 60 : marks <= 75 ? 90 : 120)

export function programmeFor(subjectId: string, grade: Grade): SbaTask[] {
  const rows = PROGRAMMES[`${subjectId}-${grade}`]
  if (!rows) return []
  return rows.map(([term, kind, title, marks, termWeight, sbaWeight, exam, papers], i) => {
    const sameKind = rows.filter((r) => r[0] === term && r[1] === kind)
    const parts = kind === 'Test' && sameKind.length > 1 ? sameKind.length : undefined
    const part = parts ? sameKind.findIndex((r) => r === rows[i]) + 1 : undefined
    const sheet = exam || kind === 'Test' || kind === 'Assignment' ? undefined : taskSheetFor(subjectId, grade, term, kind as SheetKind)
    return {
      key: `${subjectId}-g${grade}-t${term}-${i}`,
      slot: `t${term}-${i}`,
      term,
      kind,
      title: sheet ? `${title}: ${sheet.title}` : title,
      marks,
      minutes: kind === 'Test' || kind === 'Assignment' ? minutesFor(kind, marks) : undefined,
      exam,
      papers,
      part,
      parts,
      termWeight,
      sbaWeight,
    }
  })
}

/** Task sheets for the grade that the formal programme does not use: extra practical work, for practice. */
export function extraSheets(subjectId: string, grade: Grade): TaskSheet[] {
  const used = new Set(
    programmeFor(subjectId, grade)
      .map((t) => sheetForTask(subjectId, grade, t)?.id)
      .filter(Boolean),
  )
  return taskSheets.filter((s) => s.subjectId === subjectId && s.grade === grade && !used.has(s.id))
}

/**
 * The SBA mark from the marks a learner has so far: each task's mark as a
 * fraction of its raw total, times its SBA weight. `covered` is how much of
 * the SBA the entered tasks are worth, so a part-year mark can be read as
 * "so far".
 */
export function sbaMark(tasks: SbaTask[], marks: Record<string, number>): { percent: number; covered: number } {
  let earned = 0
  let covered = 0
  for (const t of tasks) {
    const m = marks[t.key]
    if (!t.sbaWeight || m === undefined || !Number.isFinite(m)) continue
    earned += (Math.min(Math.max(m, 0), t.marks) / t.marks) * t.sbaWeight
    covered += t.sbaWeight
  }
  return { percent: covered ? (earned / covered) * 100 : 0, covered }
}

/**
 * The topics a task covers, from the ATP: a test or an assignment covers its
 * term's topics (a share of them when a term has several tests), and an
 * examination covers everything taught up to it.
 */
export function topicsFor(subjectId: string, grade: Grade, task: SbaTask): string[] {
  const atp = atpFor(subjectId, grade)
  if (!atp) return []
  const upTo = task.exam === 'mid-year' ? 2 : task.exam === 'preparatory' ? 3 : task.exam ? 4 : task.term
  const from = task.exam ? 1 : task.term
  const ids = [
    ...new Set(atp.weeks.filter((w) => w.topicId && w.term >= from && w.term <= upTo).map((w) => w.topicId!)),
  ]
  if (!task.part || !task.parts) return ids
  const size = Math.ceil(ids.length / task.parts)
  const share = ids.slice((task.part - 1) * size, task.part * size)
  // Fewer topics than tests: a later test revises the whole term.
  return share.length ? share : ids
}

export const sheetForTask = (subjectId: string, grade: Grade, task: SbaTask): TaskSheet | undefined =>
  task.exam || task.kind === 'Test' || task.kind === 'Assignment'
    ? undefined
    : taskSheetFor(subjectId, grade, task.term, task.kind as SheetKind)

/** A small, stable hash, so a task's questions are the same every time it is opened until the teacher asks for another version. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const level = (q: Question) => q.cognitiveLevel ?? 2

export interface BuiltTest {
  questions: Question[]
  marks: number
  /** Marks at Levels 1 to 4, and the targets they were built to. */
  levels: [number, number, number, number]
  targets: [number, number, number, number]
}

/**
 * Assemble a test or an assignment of about `marks` marks.
 *
 * Each cognitive level is filled to its share of the marks in turn, taking
 * questions round-robin across the topics so that no topic crowds the others
 * out, and never overshooting a level's share by more than a small question.
 * Whatever is still short at the end is topped up from any level. An
 * assignment only takes questions worth 3 marks or more: it is for sustained,
 * contextual work, not recall.
 */
export function buildTest(opts: {
  subjectId: string
  grade: Grade
  topicIds: string[]
  questions: Question[]
  marks: number
  kind: 'Test' | 'Assignment'
  version: number
}): BuiltTest {
  const { subjectId, grade, topicIds, marks, kind, version } = opts
  const w = capsWeightingFor(subjectId, grade)
  const shares = w ? [w.level1, w.level2, w.level3, w.level4] : [25, 35, 25, 15]
  const targets = shares.map((p) => Math.round((marks * p) / 100)) as BuiltTest['targets']

  const pool = opts.questions
    .filter((q) => q.grade === grade && topicIds.includes(q.topicId))
    .filter((q) => kind === 'Test' || q.marks >= 3)
    .sort((a, b) => hash(`${version}:${a.id}`) - hash(`${version}:${b.id}`))

  const used = new Set<string>()
  const picked: Question[] = []
  const got = [0, 0, 0, 0]

  const fill = (lv: number, cap: number) => {
    const byTopic = topicIds.map((t) => pool.filter((q) => q.topicId === t && level(q) === lv))
    let progress = true
    while (got[lv - 1] < cap && progress) {
      progress = false
      for (const list of byTopic) {
        const sum = got.reduce((a, b) => a + b, 0)
        const q = list.find((x) => !used.has(x.id) && got[lv - 1] + x.marks <= cap + 2 && sum + x.marks <= marks + 2)
        if (!q || got[lv - 1] >= cap) continue
        used.add(q.id)
        picked.push(q)
        got[lv - 1] += q.marks
        progress = true
      }
    }
  }
  // The higher levels first: their questions are the scarcer ones, and
  // filling Levels 1 and 2 first can leave no room under the mark total.
  ;[3, 2, 1, 0].forEach((i) => fill(i + 1, targets[i]))
  // Top up anything the levels could not supply, from any level.
  let total = got.reduce((a, b) => a + b, 0)
  for (const q of pool) {
    if (total >= marks - 1) break
    if (used.has(q.id) || total + q.marks > marks + 2) continue
    used.add(q.id)
    picked.push(q)
    got[level(q) - 1] += q.marks
    total += q.marks
  }

  // Easiest first within each topic, topics in teaching order.
  const order = new Map(topicIds.map((t, i) => [t, i]))
  picked.sort((a, b) => (order.get(a.topicId)! - order.get(b.topicId)!) || level(a) - level(b))
  return { questions: picked, marks: total, levels: got as BuiltTest['levels'], targets }
}

export const topicNames = (ids: string[]) => ids.map((id) => getTopic(id)?.name ?? id)
