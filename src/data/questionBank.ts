import type { Difficulty, Grade, Question } from '@/types'
import { questions as standaloneQuestions } from '@/data/questions'
import { papersForSubject } from '@/data/papers'

/**
 * Learn and Practise draw from the same content as Assessments.
 *
 * questions.ts is a small hand-written bank that only ever covered Mat Lit and
 * Mathematics (75 questions), so the science subjects had topics but nothing to
 * practise. The exam papers hold thousands of items in the same shape as
 * Question, so this module treats them as one pool rather than maintaining a
 * second parallel bank.
 *
 * Papers are lazy-loaded per subject, so this is async -- callers need to await
 * it the way the Assessments pages already await papersForSubject().
 */

/**
 * A handful of paper items lean on something outside themselves -- a value
 * carried over from an earlier sub-question, or a table printed once at the top
 * of a section. Those read as unanswerable on their own, so they stay in the
 * papers and out of topic practice.
 */
const DEPENDS_ON_SIBLING =
  /\b(using your answer|from your answer|your answer (to|in)|answer to \d|in \d\.\d|from \d\.\d|the (table|graph|diagram|data|information) (above|below|shown|given)|described above|this (graph|table|diagram))\b/i

const isSelfContained = (q: Question) => !DEPENDS_ON_SIBLING.test(q.prompt)

const cache = new Map<string, Question[]>()

/** Every practisable question for a subject: the standalone bank plus its paper items. */
export async function questionsForSubject(subjectId: string): Promise<Question[]> {
  const cached = cache.get(subjectId)
  if (cached) return cached

  const papers = await papersForSubject(subjectId)
  const fromPapers = papers.flatMap((p) => p.sections.flatMap((s) => s.items))

  // A topic's questions can legitimately appear in both sources; id wins.
  const byId = new Map<string, Question>()
  for (const q of standaloneQuestions) byId.set(q.id, q)
  for (const q of fromPapers) if (isSelfContained(q) && !byId.has(q.id)) byId.set(q.id, q)

  const pool = [...byId.values()]
  cache.set(subjectId, pool)
  return pool
}

export async function filterSubjectQuestions(
  subjectId: string,
  opts: { topicId?: string; difficulty?: Difficulty | string; grade?: Grade | number } = {},
): Promise<Question[]> {
  const pool = await questionsForSubject(subjectId)
  return pool.filter(
    (q) =>
      (!opts.topicId || q.topicId === opts.topicId) &&
      (!opts.difficulty || q.difficulty === opts.difficulty) &&
      (!opts.grade || q.grade === opts.grade),
  )
}

/** Question counts per topic, for the topic lists on Learn. */
export async function topicQuestionCounts(subjectId: string, grade?: Grade): Promise<Record<string, number>> {
  const pool = await questionsForSubject(subjectId)
  const counts: Record<string, number> = {}
  for (const q of pool) {
    if (grade !== undefined && q.grade !== grade) continue
    counts[q.topicId] = (counts[q.topicId] ?? 0) + 1
  }
  return counts
}
