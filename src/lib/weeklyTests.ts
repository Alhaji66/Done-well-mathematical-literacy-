import { supabase } from '@/lib/supabaseClient'
import { questionsForSubject } from '@/data/questionBank'
import type { Grade, Question } from '@/types'

/**
 * Weekly tests: a teacher sets one, a learner sits it, the result comes back.
 *
 * The questions are NOT stored in the database. A test records what it is ABOUT
 * -- subject, grade, topics, how many questions -- and the paper is rebuilt from
 * the bundled curriculum whenever it is opened, in an order seeded by the test's
 * own id. That keeps three promises at once: every learner in the class sits the
 * same paper, a learner who reloads mid-test gets their paper back rather than a
 * new one, and no question text is ever duplicated into a database row that
 * could drift from the corpus it came from.
 */

export interface WeeklyTest {
  id: string
  school_id: string
  created_by: string
  title: string
  subject_id: string
  grade: Grade
  topic_ids: string[]
  question_count: number
  due_at: string
  created_at: string
}

export interface PerQuestionMark {
  questionId: string
  awarded: number
  outOf: number
  /**
   * What the learner actually wrote, before they saw the memo.
   *
   * A mark on its own says a learner got 1 of 4 and nothing about why. The
   * answer is what turns that into error analysis a teacher can teach from --
   * whether the class used the wrong formula, dropped a unit, or rounded early.
   * Optional because attempts handed in before this existed have no answers.
   */
  answer?: string
}

export interface TestAttempt {
  id: string
  test_id: string
  learner_id: string
  started_at: string
  submitted_at: string | null
  marks_awarded: number | null
  marks_total: number | null
  per_question: PerQuestionMark[] | null
}

/**
 * A small deterministic PRNG, seeded from the test id.
 *
 * Math.random() cannot be used here: the paper has to come out the same for
 * every learner and on every reload, and a random shuffle would hand each
 * learner a different test and change it under them when they refreshed.
 * mulberry32 is a few lines, has no dependency, and is more than good enough
 * for shuffling a question list.
 */
function seedFrom(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates, driven by the seeded generator rather than Math.random. */
function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Build the paper for a test. Sorted by id before shuffling, because
 * questionsForSubject merges a standalone bank with the papers and its natural
 * order is not guaranteed stable across builds -- without the sort, the same
 * seed could produce a different paper after a content change.
 */
export async function buildTestPaper(test: WeeklyTest): Promise<Question[]> {
  const all = await questionsForSubject(test.subject_id)
  const pool = all
    .filter((q) => q.grade === test.grade && test.topic_ids.includes(q.topicId))
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
  if (pool.length === 0) return []
  return shuffle(pool, mulberry32(seedFrom(test.id))).slice(0, test.question_count)
}

export const totalMarks = (questions: Question[]) => questions.reduce((sum, q) => sum + q.marks, 0)

// --------------------------------------------------------------------- reads

export async function fetchTestsForSchool(schoolId: string): Promise<WeeklyTest[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('weekly_tests')
    .select('*')
    .eq('school_id', schoolId)
    .order('due_at', { ascending: false })
  if (error) {
    console.error('Failed to load weekly tests:', error)
    return []
  }
  return (data ?? []) as WeeklyTest[]
}

/** The tests a particular learner is expected to sit: their subject and grade. */
export async function fetchTestsForLearner(
  schoolId: string,
  subjectId: string | null,
  grade: Grade | null,
): Promise<WeeklyTest[]> {
  const all = await fetchTestsForSchool(schoolId)
  return all.filter((t) => (!subjectId || t.subject_id === subjectId) && (!grade || t.grade === grade))
}

export async function fetchMyAttempts(learnerId: string): Promise<TestAttempt[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('weekly_test_attempts').select('*').eq('learner_id', learnerId)
  if (error) {
    console.error('Failed to load your test attempts:', error)
    return []
  }
  return (data ?? []) as TestAttempt[]
}

export async function fetchAttemptsForTest(testId: string): Promise<TestAttempt[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('weekly_test_attempts').select('*').eq('test_id', testId)
  if (error) {
    console.error('Failed to load attempts for this test:', error)
    return []
  }
  return (data ?? []) as TestAttempt[]
}

// -------------------------------------------------------------------- writes

export async function createTest(input: {
  schoolId: string
  createdBy: string
  title: string
  subjectId: string
  grade: Grade
  topicIds: string[]
  questionCount: number
  dueAt: string
}): Promise<{ test?: WeeklyTest; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase
    .from('weekly_tests')
    .insert({
      school_id: input.schoolId,
      created_by: input.createdBy,
      title: input.title.trim(),
      subject_id: input.subjectId,
      grade: input.grade,
      topic_ids: input.topicIds,
      question_count: input.questionCount,
      due_at: input.dueAt,
    })
    .select('*')
    .single()
  if (error) {
    console.error('Failed to set the test:', error)
    return { error: error.message }
  }
  return { test: data as WeeklyTest }
}

export async function deleteTest(testId: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('weekly_tests').delete().eq('id', testId)
  if (error) {
    console.error('Failed to delete the test:', error)
    return error.message
  }
  return undefined
}

/**
 * Record a finished attempt. Upsert on (test_id, learner_id) so a learner who
 * sits the test twice replaces their own row rather than hitting a unique
 * violation they cannot understand or recover from.
 */
export async function submitAttempt(input: {
  testId: string
  learnerId: string
  perQuestion: PerQuestionMark[]
  marksTotal: number
}): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const awarded = input.perQuestion.reduce((sum, m) => sum + m.awarded, 0)
  const { error } = await supabase.from('weekly_test_attempts').upsert(
    {
      test_id: input.testId,
      learner_id: input.learnerId,
      submitted_at: new Date().toISOString(),
      marks_awarded: awarded,
      marks_total: input.marksTotal,
      per_question: input.perQuestion,
    },
    { onConflict: 'test_id,learner_id' },
  )
  if (error) {
    console.error('Failed to submit the test:', error)
    return error.message
  }
  return undefined
}
