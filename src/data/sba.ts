/**
 * The formal Programme of Assessment (school-based assessment, SBA) for each
 * subject and grade, and the tasks themselves.
 *
 * WHAT IS FIXED AND WHAT IS NOT. CAPS sets the KINDS of formal task each FET
 * subject uses -- tests and examinations everywhere; investigations and
 * assignments in Mathematics and Mathematical Literacy; practical
 * investigations and experiments in Physical Sciences; practical tasks and
 * assignments in Life Sciences -- and each province's SBA guideline then fixes
 * exactly which task falls in which term and what it weighs, and revises that
 * from year to year. So the programme below is the TYPICAL arrangement, not a
 * ruling, and the page says so: a teacher follows their provincial guideline
 * where it differs, and every task here can still be used as it stands.
 *
 * WHERE THE TASKS COME FROM.
 *
 *   Tests and assignments are assembled from the question bank, out of the
 *   topics the ATP puts in that term, and balanced to the subject's CAPS
 *   cognitive-level weighting (capsWeighting.ts) by marks -- the same targets
 *   the NSC papers are built to. An assignment leans on longer, contextual
 *   questions; a test takes the full range.
 *
 *   Investigations, projects, practicals and experiments are the written task
 *   sheets in sbaTaskSheets.ts, each with a rubric.
 *
 *   Examinations are the full papers already in Assessments. Building a
 *   second, lesser exam here would only compete with them.
 */
import { atpFor } from './atp'
import { capsWeightingFor } from './capsWeighting'
import { getTopic } from './topics'
import { taskSheetFor, type SheetKind, type TaskSheet } from './sbaTaskSheets'
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
 * What is NOT fixed nationally in this file is how the SBA itself is split
 * between its tasks; that is the DBE Programme of Assessment and the
 * province's guideline, which is why the programme below is the typical one.
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
  term: 1 | 2 | 3 | 4
  kind: TaskKind
  title: string
  /** For a test or an assignment: the marks it is built to. */
  marks?: number
  /** For a test or an assignment: the time allowed. */
  minutes?: number
  exam?: ExamKind
  /** Which of two tests in one term this is (1 or 2); it decides which topics it covers. */
  part?: 1 | 2
}

type Row = [1 | 2 | 3 | 4, TaskKind, (ExamKind | 1 | 2)?]

/** The typical programme, per subject, for Grades 10-11 and for Grade 12. */
const PROGRAMMES: Record<string, { fet: Row[]; g12: Row[] }> = {
  mathematics: {
    fet: [[1, 'Test'], [1, 'Investigation'], [2, 'Assignment'], [2, 'Examination', 'mid-year'], [3, 'Test', 1], [3, 'Test', 2], [4, 'Examination', 'end-of-year']],
    g12: [[1, 'Test'], [1, 'Investigation'], [2, 'Assignment'], [2, 'Examination', 'mid-year'], [3, 'Test'], [3, 'Examination', 'preparatory'], [4, 'Examination', 'final']],
  },
  'mat-lit': {
    fet: [[1, 'Assignment'], [1, 'Test'], [2, 'Investigation'], [2, 'Examination', 'mid-year'], [3, 'Assignment'], [3, 'Test'], [4, 'Examination', 'end-of-year']],
    g12: [[1, 'Assignment'], [1, 'Test'], [2, 'Investigation'], [2, 'Examination', 'mid-year'], [3, 'Test'], [3, 'Examination', 'preparatory'], [4, 'Examination', 'final']],
  },
  'physical-sciences': {
    fet: [[1, 'Practical investigation'], [1, 'Test'], [2, 'Experiment'], [2, 'Examination', 'mid-year'], [3, 'Experiment'], [3, 'Test'], [4, 'Examination', 'end-of-year']],
    g12: [[1, 'Practical investigation'], [1, 'Test'], [2, 'Experiment'], [2, 'Examination', 'mid-year'], [3, 'Experiment'], [3, 'Test'], [3, 'Examination', 'preparatory'], [4, 'Examination', 'final']],
  },
  'life-sciences': {
    fet: [[1, 'Practical task'], [1, 'Test'], [2, 'Assignment'], [2, 'Examination', 'mid-year'], [3, 'Practical task'], [3, 'Test'], [4, 'Examination', 'end-of-year']],
    g12: [[1, 'Practical task'], [1, 'Test'], [2, 'Assignment'], [2, 'Examination', 'mid-year'], [3, 'Practical task'], [3, 'Test'], [3, 'Examination', 'preparatory'], [4, 'Examination', 'final']],
  },
}

const EXAM_TITLES: Record<ExamKind, string> = {
  'mid-year': 'Mid-year examination',
  preparatory: 'Preparatory (trial) examination',
  'end-of-year': 'End-of-year examination',
  final: 'NSC final examination (set externally)',
}

export function programmeFor(subjectId: string, grade: Grade): SbaTask[] {
  const p = PROGRAMMES[subjectId]
  if (!p) return []
  const rows = grade === 12 ? p.g12 : p.fet
  return rows.map(([term, kind, extra], i) => {
    const exam = typeof extra === 'string' ? extra : undefined
    const part = typeof extra === 'number' ? extra : undefined
    const sheet = exam || kind === 'Test' || kind === 'Assignment' ? undefined : taskSheetFor(subjectId, grade, term, kind as SheetKind)
    return {
      key: `${subjectId}-g${grade}-t${term}-${i}`,
      term,
      kind,
      exam,
      part,
      title: exam
        ? EXAM_TITLES[exam]
        : sheet
          ? `${kind}: ${sheet.title}`
          : `${kind}${part ? ` ${part}` : ''}`,
      marks: kind === 'Test' ? 50 : kind === 'Assignment' ? 50 : undefined,
      minutes: kind === 'Test' ? 60 : kind === 'Assignment' ? 90 : undefined,
    }
  })
}

/**
 * The topics a task covers, from the ATP: a test or an assignment covers its
 * term's topics (the first or second half of them when a term has two tests),
 * and an examination covers everything taught up to it.
 */
export function topicsFor(subjectId: string, grade: Grade, task: SbaTask): string[] {
  const atp = atpFor(subjectId, grade)
  if (!atp) return []
  const upTo = task.exam === 'mid-year' ? 2 : task.exam === 'preparatory' ? 3 : task.exam ? 4 : task.term
  const from = task.exam ? 1 : task.term
  const ids = [
    ...new Set(atp.weeks.filter((w) => w.topicId && w.term >= from && w.term <= upTo).map((w) => w.topicId!)),
  ]
  if (!task.part) return ids
  const half = Math.ceil(ids.length / 2)
  return task.part === 1 ? ids.slice(0, half) : ids.slice(half)
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
