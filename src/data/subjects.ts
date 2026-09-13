import type { Subject } from '@/types'

/**
 * The subjects DONE WELL covers.
 *
 * Four subjects, all four of which carry content: Mathematical Literacy,
 * Mathematics, Life Sciences and Physical Sciences.
 *
 * ENGLISH FAL WAS REGISTERED HERE AND HAS BEEN REMOVED. It never had topics,
 * so every selector filtered it out and no learner ever saw it -- it existed
 * only as a promise this file made and nothing kept. Finishing the four
 * subjects already in build comes first, and a placeholder that six call
 * sites have to remember to hide is a liability in the meantime. The
 * selectors still filter on topic count, because that guard is right for any
 * subject added in future, not because anything is currently hidden by it.
 *
 * ACCOUNTING IS DEFINITIVELY OUT OF SCOPE. An external review asked whether
 * it was meant to be a fourth subject and noted it should not be assumed
 * from wording alone. It was never intended, and the decision is recorded
 * here rather than left open: do not add it without the product owner
 * asking for it by name.
 *
 * The reason is structural, not a matter of authoring effort. Every subject
 * here fits the Question model in src/types/index.ts -- prompt, context,
 * answer and explanation are all plain strings. NSC Accounting is answered
 * in tables: General Ledger accounts, journals, the Income Statement,
 * Balance Sheet, Cash Flow Statement and their notes. Those answers cannot
 * be stored as prose, rendered by the paper runner, or marked line by line
 * the way an Accounting memo marks. Supporting it would need a tabular
 * answer type, a shared trial-balance context spanning a whole question,
 * and a per-line marking path -- changes that touch every subject's code.
 * If Accounting is ever wanted, that model comes first and the content
 * second, and the prose-answer parts (ratio analysis and interpretation,
 * VAT, inventory valuation, cost accounting, internal control and ethics)
 * are the only ones that could ship before it exists.
 */
export const subjects: Subject[] = [
  { id: 'mat-lit', name: 'Mathematical Literacy', grades: [10, 11, 12] },
  { id: 'mathematics', name: 'Mathematics', grades: [10, 11, 12] },
  { id: 'life-sciences', name: 'Life Sciences', grades: [10, 11, 12] },
  { id: 'physical-sciences', name: 'Physical Sciences', grades: [10, 11, 12] },
]

export const getSubject = (id: string) => subjects.find((s) => s.id === id)
