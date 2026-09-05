import type { Paper } from '@/data/papers'

const STORAGE_PREFIX = 'donewell-paper-progress'

function storageKey(learnerId: string, paperId: string) {
  return `${STORAGE_PREFIX}:${learnerId}:${paperId}`
}

/** Ids of the question items a learner has attempted within one paper, persisted locally per-browser. */
export function getAnsweredItemIds(learnerId: string, paperId: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(learnerId, paperId))
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function markItemAnswered(learnerId: string, paperId: string, itemId: string): void {
  try {
    const ids = getAnsweredItemIds(learnerId, paperId)
    ids.add(itemId)
    localStorage.setItem(storageKey(learnerId, paperId), JSON.stringify([...ids]))
  } catch {
    // Private browsing / storage disabled -- progress simply won't persist.
  }
}

export function countPaperItems(paper: Paper): number {
  return paper.sections.reduce((sum, section) => sum + section.items.length, 0)
}
