import type { Question } from '@/types'
import type { Paper } from '@/data/papers/types'
import { topicsForSubject } from '@/data/topics'

/**
 * Where a subject's papers and questions come from.
 *
 * THIS file reads them straight from the source modules in src/data. It is what
 * the content tools (tools/*.mts) and the content-pack builder see.
 *
 * The browser NEVER uses this file: vite.config.ts points '@/data/contentSource'
 * at contentSource.client.ts instead, which downloads the subject's content
 * pack from the server for a signed-in account and falls back to a small
 * bundled sample otherwise. That swap is what keeps the question bank out of
 * the website's own files -- if any page imported the source modules directly,
 * they would be bundled again, and `npm run verify:bundle` would say so.
 */
export interface SubjectContent {
  papers: Paper[]
  /** The standalone (non-paper) questions whose topic belongs to this subject. */
  questions: Question[]
}

const paperModules: Record<string, () => Promise<{ default: Paper[] }>> = {
  'mat-lit': () => import('./papers/mat-lit'),
  mathematics: () => import('./papers/mathematics'),
  'physical-sciences': () => import('./papers/physical-sciences'),
  'life-sciences': () => import('./papers/life-sciences'),
}

export async function subjectContent(subjectId: string): Promise<SubjectContent> {
  const load = paperModules[subjectId]
  if (!load) return { papers: [], questions: [] }
  const [{ default: papers }, { questions }] = await Promise.all([load(), import('./questions')])
  const topics = new Set(topicsForSubject(subjectId).map((t) => t.id))
  return { papers, questions: questions.filter((q) => topics.has(q.topicId)) }
}
