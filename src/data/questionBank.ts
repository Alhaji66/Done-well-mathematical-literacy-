import type { Difficulty, Grade, Question } from '@/types'
import { subjectContent, type SubjectContent } from '@/data/contentSource'
import { topicsForSubject } from '@/data/topics'
import { groupBySubtopic } from '@/data/subtopics'
import { withSectionStimulus } from '@/data/sharedStimulus'
import { awaitingStimulus } from '@/data/awaitingStimulus'

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

const namesItsOwnDependency = (q: Question) => !DEPENDS_ON_SIBLING.test(q.prompt)

/**
 * The regex above only catches items that announce their dependency. Far more of
 * them point at a shared stimulus in passing -- "Determine T5.", "Convert this
 * volume to litres.", "Determine the mean of the data set." Each reads as a
 * complete question, so no wording test finds them.
 *
 * Where the stimulus travels with the item, in its own `context`, there is no
 * problem: QuestionCard renders the context above the prompt, so "Determine T5."
 * arrives with the pattern it belongs to. Those items are practisable as they are.
 *
 * The broken ones are the items with no context of their own, which were leaning on
 * a table or a value printed against a sibling item. The papers give a reliable way
 * to spot them: papers within a grade and paper number are built from a shared
 * skeleton, so such a stub recurs across them with a different stimulus each time --
 * and therefore a different answer. A genuinely self-contained question keeps its
 * answer wherever it appears.
 *
 * So, for context-less items: group by prompt, and where a prompt recurs, let the
 * answers decide. Matching answers mean one question asked twice (keep a single
 * copy); answers that disagree mean the prompt was never carrying the question on
 * its own (drop them from practice, leaving them intact in the papers).
 */

/** Quantities in an answer, normalised so "1 500" and "1,500" compare equal. */
const quantities = (answer: string) =>
  (answer.match(/\d[\d\s.,]*/g) ?? []).map((n) => n.replace(/[\s,]/g, '').replace(/[.,]$/, '')).sort().join('|')

const words = (answer: string) => new Set(answer.toLowerCase().match(/[a-z]+/g) ?? [])

const overlap = (a: Set<string>, b: Set<string>) => {
  const shared = [...a].filter((w) => b.has(w)).length
  return shared / Math.max(1, new Set([...a, ...b]).size)
}

/**
 * Do these same-prompt items answer to the same question? Their quantities have to
 * match exactly -- differing numbers mean differing stimuli. Wording is then only
 * checked loosely, because two papers word one definition differently; the bar is
 * low enough to pass those and still separate "South" from "West".
 *
 * It errs towards dropping. Two papers that word one answer differently enough --
 * "½" against "0,5", or two phrasings of one definition -- read as disagreeing, and
 * roughly 26 sound prompts across the four subjects are held out of practice that
 * way. That is the cheap direction to be wrong in: those items are still in the
 * papers, every topic still has questions, and the alternative is a hand-tuned list
 * of stimulus words that would quietly rot as content is added. Keeping one
 * unanswerable question costs a learner more than losing one good one.
 */
const SAME_ANSWER_WORDING = 0.35

const askTheSameQuestion = (items: Question[]) => {
  const quantity = quantities(items[0].answer)
  if (!items.every((q) => quantities(q.answer) === quantity)) return false
  const wording = words(items[0].answer)
  return items.every((q) => overlap(wording, words(q.answer)) >= SAME_ANSWER_WORDING)
}

/** Paper items that stand on their own, one copy each. */
function practisableItems(fromPapers: Question[]): Question[] {
  const carryTheirStimulus: Question[] = []
  const byPrompt = new Map<string, Question[]>()

  for (const q of fromPapers) {
    if (!namesItsOwnDependency(q)) continue
    // Needs a map or table that has not been entered yet (awaitingStimulus.ts).
    if (awaitingStimulus.has(q.id)) continue
    if (q.context) {
      carryTheirStimulus.push(q)
      continue
    }
    const key = q.prompt.trim()
    const group = byPrompt.get(key)
    if (group) group.push(q)
    else byPrompt.set(key, [q])
  }

  const kept: Question[] = []
  // One copy per distinct question: same prompt and same stimulus is the same question.
  const seen = new Set<string>()
  for (const q of carryTheirStimulus) {
    const key = `${q.prompt.trim()}\u0000${q.context!.trim()}`
    if (seen.has(key)) continue
    seen.add(key)
    kept.push(q)
  }
  for (const group of byPrompt.values()) {
    if (group.length === 1 || askTheSameQuestion(group)) kept.push(group[0])
  }
  return kept
}

// Keyed by the content object itself: a signed-in account's full pack and the
// demo's sample are different objects, so signing in recomputes the pool.
const cache = new WeakMap<SubjectContent, Question[]>()

/** Item id -> the predicted paper it comes from, per content pack. */
const predictedPaperOf = new WeakMap<SubjectContent, Map<string, string>>()

function predictedItems(content: SubjectContent): Map<string, string> {
  let map = predictedPaperOf.get(content)
  if (!map) {
    map = new Map()
    for (const p of content.papers) if (p.kind === 'predicted') for (const s of p.sections) for (const q of s.items) map.set(q.id, p.id)
    predictedPaperOf.set(content, map)
  }
  return map
}

/**
 * The pool a learner practises from. A predicted paper is written under exam
 * conditions with its memo locked until the time is up (STEP 41), so its
 * questions -- with their memos -- stay out of Practise until this learner has
 * written that paper. Past papers stay in, for revision. Signed out (the demo),
 * nothing is held back.
 *
 * Staff screens, and a weekly test resolving the questions a teacher chose, use
 * questionsForSubject unfiltered.
 */
export async function learnerQuestionsForSubject(subjectId: string): Promise<Question[]> {
  const [pool, content, written] = await Promise.all([
    questionsForSubject(subjectId),
    subjectContent(subjectId),
    import('@/lib/paperAttempts').then((m) => m.writtenPaperIds()),
  ])
  if (!written) return pool
  const predicted = predictedItems(content)
  return pool.filter((q) => {
    const paper = predicted.get(q.id)
    return !paper || written.has(paper)
  })
}

/** Every practisable question for a subject: the standalone bank plus its paper items. */
export async function questionsForSubject(subjectId: string): Promise<Question[]> {
  const content = await subjectContent(subjectId)
  const cached = cache.get(content)
  if (cached) return cached

  // Each sub-question brings its section's tables and visuals (sharedStimulus.ts).
  const fromPapers = content.papers.flatMap((p) => p.sections.flatMap((s) => withSectionStimulus(s.items)))

  // Only questions whose topic belongs to this subject. Callers filter by topic
  // anyway, which hid this, but questionsForSubject is also read on its own --
  // for counts, for instance.
  const subjectTopics = new Set(topicsForSubject(subjectId).map((t) => t.id))

  // A topic's questions can legitimately appear in both sources; id wins.
  const byId = new Map<string, Question>()
  for (const q of content.questions) if (subjectTopics.has(q.topicId)) byId.set(q.id, q)
  for (const q of practisableItems(fromPapers)) if (!byId.has(q.id)) byId.set(q.id, q)

  const pool = [...byId.values()]
  cache.set(content, pool)
  return pool
}

/**
 * Find questions by id, wherever they live -- the standalone bank or ANY paper
 * item, including the ones topic practice leaves out. My Mistakes needs this:
 * a question missed in a paper is still that learner's mistake even if it is
 * not in the practice pool.
 */
export async function questionsById(subjectId: string, ids: string[]): Promise<Map<string, Question>> {
  const wanted = new Set(ids)
  const found = new Map<string, Question>()
  const content = await subjectContent(subjectId)
  for (const q of content.questions) if (wanted.has(q.id)) found.set(q.id, q)
  for (const p of content.papers) {
    for (const s of p.sections) for (const q of withSectionStimulus(s.items)) if (wanted.has(q.id) && !found.has(q.id)) found.set(q.id, q)
  }
  return found
}

export async function filterSubjectQuestions(
  subjectId: string,
  opts: { topicId?: string; difficulty?: Difficulty | string; grade?: Grade | number; learner?: boolean } = {},
): Promise<Question[]> {
  // learner: the learner's pool, holding back predicted papers not yet written.
  const pool = await (opts.learner ? learnerQuestionsForSubject(subjectId) : questionsForSubject(subjectId))
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

/**
 * Question counts per sub-topic, keyed by topic, for the topic cards on Learn.
 *
 * Learn advertises a topic and then hands the learner the whole of it. That is
 * the wrong granularity for revision: somebody who knows they are weak on
 * taxation wants taxation, not the 1 700 questions Finance holds. Counting per
 * sub-topic here lets each card offer its sub-topics as their own entry points,
 * with the same figures the Practise headings will show.
 *
 * Only sub-topics that actually hold a question at this grade come back, so a
 * card never offers a link that opens an empty list.
 */
export async function subtopicQuestionCounts(
  subjectId: string,
  grade?: Grade,
): Promise<Record<string, Record<string, number>>> {
  const pool = await questionsForSubject(subjectId)
  const counts: Record<string, Record<string, number>> = {}
  for (const topic of topicsForSubject(subjectId, grade)) {
    const rows = pool.filter((q) => q.topicId === topic.id && (grade === undefined || q.grade === grade))
    if (!rows.length) continue
    const perSubtopic: Record<string, number> = {}
    for (const group of groupBySubtopic(topic.id, rows)) perSubtopic[group.name] = group.questions.length
    counts[topic.id] = perSubtopic
  }
  return counts
}
