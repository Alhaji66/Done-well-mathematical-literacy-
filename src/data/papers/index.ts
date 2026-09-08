import type { Grade } from '@/types'
import type { Paper } from './types'

export type { Paper, PaperSection, PaperQuestionItem, PaperKind } from './types'

/**
 * Each subject's papers are their own module (mat-lit.ts, mathematics.ts,
 * physical-sciences.ts, life-sciences.ts) instead of one combined array --
 * this file used to export ~53 000 lines of paper data as a single static
 * array, which meant every subject's content (whether or not a learner
 * ever opens it) shipped in one ~1.6MB lazy chunk the moment anyone visited
 * Assessments. Splitting per subject means a learner only downloads the
 * subject(s) they actually browse.
 *
 * Paper ids are prefixed by subject ('ml-', 'math-', 'physsci-', 'lifesci-')
 * so getPaper() can pick the right module to load without needing an
 * upfront id -> subject index (which would itself have to list all ids).
 */
const subjectLoaders: Record<string, () => Promise<{ default: Paper[] }>> = {
  'mat-lit': () => import('./mat-lit'),
  mathematics: () => import('./mathematics'),
  'physical-sciences': () => import('./physical-sciences'),
  'life-sciences': () => import('./life-sciences'),
}

const idPrefixToSubject: [prefix: string, subjectId: string][] = [
  ['ml-', 'mat-lit'],
  ['math-', 'mathematics'],
  ['physsci-', 'physical-sciences'],
  ['lifesci-', 'life-sciences'],
]

export async function papersForSubject(subjectId: string, paperNumber?: 1 | 2, grade?: Grade): Promise<Paper[]> {
  const loadSubject = subjectLoaders[subjectId]
  if (!loadSubject) return []
  const { default: papers } = await loadSubject()
  return papers.filter((p) => (paperNumber === undefined || p.paperNumber === paperNumber) && (grade === undefined || p.grade === grade))
}

export async function getPaper(id: string): Promise<Paper | undefined> {
  const match = idPrefixToSubject.find(([prefix]) => id.startsWith(prefix))
  if (!match) return undefined
  const { default: papers } = await subjectLoaders[match[1]]()
  return papers.find((p) => p.id === id)
}
