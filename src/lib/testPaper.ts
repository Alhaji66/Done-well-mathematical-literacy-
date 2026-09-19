/**
 * Building a test paper from the bundled curriculum.
 *
 * Split out of weeklyTests.ts, which also talks to Supabase: this half is pure
 * -- a test description in, a list of questions out -- and keeping it free of
 * the database client is what lets it be run and checked directly, which
 * `npm run check:test-coverage` does.
 */
import { questionsForSubject } from '@/data/questionBank'
import { subtopicFor, UNSORTED } from '@/data/subtopics'
import type { Grade, Question } from '@/types'

/** What building a paper needs to know. WeeklyTest satisfies this. */
export interface TestSpec {
  id: string
  subject_id: string
  grade: Grade
  topic_ids: string[]
  subtopics: string[] | null
  question_count: number
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
 * A sub-topic, qualified by the topic it belongs to.
 *
 * Sub-topic names are only unique WITHIN a topic -- "Interpreting and comparing
 * graphs" could plausibly appear under two -- and a test may span several
 * topics, so the stored name has to carry its topic with it.
 */
export const qualify = (topicId: string, name: string) => `${topicId}::${name}`

/**
 * Which sub-topics a test actually draws from, in a stable order.
 *
 * A test with `subtopics` set is a WEEK's test: it covers what was taught this
 * week and nothing else. A test with none is a TOPIC test, and a topic test
 * must span the whole topic -- so the sub-topics are worked out from the pool
 * rather than left to chance.
 */
function subtopicsOf(pool: Question[]): Map<string, Question[]> {
  const buckets = new Map<string, Question[]>()
  for (const q of pool) {
    const key = qualify(q.topicId, subtopicFor(q) ?? UNSORTED)
    const bucket = buckets.get(key)
    if (bucket) bucket.push(q)
    else buckets.set(key, [q])
  }
  return buckets
}

/**
 * Build the paper for a test. Sorted by id before shuffling, because
 * questionsForSubject merges a standalone bank with the papers and its natural
 * order is not guaranteed stable across builds -- without the sort, the same
 * seed could produce a different paper after a content change.
 *
 * A TOPIC TEST COVERS EVERY SUB-TOPIC. Shuffling the whole topic and taking
 * the first eight does not do that, and the gap is not small: measured across
 * 107 topic/grade cells, an 8-question test reached 4.0 of Data Handling's 8
 * sub-topics and 2.3 of Grade 10 Statistics' 5. Half the topic went untested,
 * differently for each teacher, because the seed decided it.
 *
 * So the questions are taken round-robin across the sub-topics: one from each
 * before a second from any. Every sub-topic is represented as long as the test
 * is at least as long as the number of sub-topics, and `missingSubtopics()`
 * below tells the teacher when it is not. Within a sub-topic the order is
 * still the seeded shuffle, so two classes sitting the same test still get the
 * same paper and a reload still returns it.
 */
export async function buildTestPaper(test: TestSpec): Promise<Question[]> {
  const all = await questionsForSubject(test.subject_id)
  let pool = all
    .filter((q) => q.grade === test.grade && test.topic_ids.includes(q.topicId))
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))

  const wanted = test.subtopics ?? []
  if (wanted.length) {
    const want = new Set(wanted)
    pool = pool.filter((q) => want.has(qualify(q.topicId, subtopicFor(q) ?? UNSORTED)))
  }
  if (pool.length === 0) return []

  const rand = mulberry32(seedFrom(test.id))
  const buckets = subtopicsOf(pool)
  // Shuffle the bucket ORDER too, so the same sub-topic does not always open
  // the paper, and shuffle within each bucket so the question does not either.
  const order = shuffle([...buckets.keys()].sort(), rand)
  const queues = order.map((key) => shuffle(buckets.get(key)!, rand))

  const out: Question[] = []
  for (let round = 0; out.length < test.question_count; round++) {
    let added = false
    for (const queue of queues) {
      if (round < queue.length && out.length < test.question_count) {
        out.push(queue[round])
        added = true
      }
    }
    if (!added) break
  }
  return out
}

/**
 * The sub-topics a test cannot reach because it is too short, so the teacher
 * can lengthen it before setting it rather than discovering it afterwards.
 */
export async function missingSubtopics(test: TestSpec): Promise<string[]> {
  const all = await questionsForSubject(test.subject_id)
  const pool = all.filter((q) => q.grade === test.grade && test.topic_ids.includes(q.topicId))
  const want = test.subtopics?.length ? new Set(test.subtopics) : null
  const present = [...subtopicsOf(pool).keys()].filter((k) => !want || want.has(k))
  const paper = await buildTestPaper(test)
  const covered = new Set(paper.map((q) => qualify(q.topicId, subtopicFor(q) ?? UNSORTED)))
  return present.filter((k) => !covered.has(k)).map((k) => k.split('::')[1])
}

export const totalMarks = (questions: Question[]) => questions.reduce((sum, q) => sum + q.marks, 0)
