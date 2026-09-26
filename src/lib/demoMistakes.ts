import type { MistakeSource } from '@/lib/mistakes'
import { getTopic } from '@/data/topics'

/**
 * My Mistakes for the demo, kept in this browser.
 *
 * The real list lives in the database against a signed-in learner (see
 * mistakes.ts). The demo has no account, so the same idea is kept in
 * localStorage: anything answered wrong in the demo's Practise, Papers or
 * weekly Tests lands here, and a right answer takes it off. A few example
 * mistakes from Karabo's weakest topics are added the first time, so the page
 * shows what it is for before the visitor has got anything wrong.
 *
 * Storage can be missing (private windows, blocked site data); every read and
 * write is guarded, and the page then simply shows the examples.
 */

export interface DemoMistake {
  questionId: string
  topicId: string
  subjectId: string
  source: MistakeSource
  timesWrong: number
  lastWrongAt: string
  resolvedAt: string | null
  /** One of the examples added for the demo, not something the visitor got wrong. */
  example?: boolean
}

const KEY = 'donewell-demo-mistakes'
const CHANGED = 'donewell-demo-mistakes-changed'

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

/** Karabo's examples: maps and plans is the weakest topic, then data handling. */
const EXAMPLES: DemoMistake[] = [
  { questionId: 'map-c1', topicId: 'maps-plans', subjectId: 'mat-lit', source: 'practice', timesWrong: 2, lastWrongAt: daysAgo(1), resolvedAt: null, example: true },
  { questionId: 'gap-ml-bmi-classify', topicId: 'data-handling', subjectId: 'mat-lit', source: 'weekly_test', timesWrong: 1, lastWrongAt: daysAgo(3), resolvedAt: null, example: true },
  { questionId: 'gap-ml-box-read-iqr', topicId: 'data-handling', subjectId: 'mat-lit', source: 'paper', timesWrong: 1, lastWrongAt: daysAgo(5), resolvedAt: null, example: true },
]

/** The saved list, or the examples if nothing has been saved in this browser yet. */
export function loadDemoMistakes(): DemoMistake[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as DemoMistake[]) : EXAMPLES.map((e) => ({ ...e }))
  } catch {
    return EXAMPLES.map((e) => ({ ...e }))
  }
}

export function saveDemoMistakes(rows: DemoMistake[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows))
    window.dispatchEvent(new Event(CHANGED))
  } catch {
    // Storage unavailable: the list lasts only as long as the page.
  }
}

/** Record one answer from the demo: wrong adds or counts again, right clears. */
export function recordDemoAnswer(q: { id: string; topicId: string }, source: MistakeSource, correct: boolean): void {
  const subjectId = getTopic(q.topicId)?.subjectId
  if (!subjectId) return
  const rows = loadDemoMistakes()
  const now = new Date().toISOString()
  const i = rows.findIndex((r) => r.questionId === q.id)
  if (correct) {
    if (i >= 0 && !rows[i].resolvedAt) rows[i] = { ...rows[i], resolvedAt: now }
    else return
  } else if (i >= 0) {
    rows[i] = { ...rows[i], timesWrong: rows[i].timesWrong + 1, lastWrongAt: now, resolvedAt: null, source }
  } else {
    rows.unshift({ questionId: q.id, topicId: q.topicId, subjectId, source, timesWrong: 1, lastWrongAt: now, resolvedAt: null })
  }
  saveDemoMistakes(rows)
}

/** How many are still to fix, for the Home card. */
export function openDemoMistakeCount(): number {
  return loadDemoMistakes().filter((r) => !r.resolvedAt).length
}

/** Call `fn` whenever the list changes, in this tab or another. Returns an unsubscribe. */
export function onDemoMistakesChange(fn: () => void): () => void {
  const storage = (e: StorageEvent) => e.key === KEY && fn()
  window.addEventListener(CHANGED, fn)
  window.addEventListener('storage', storage)
  return () => {
    window.removeEventListener(CHANGED, fn)
    window.removeEventListener('storage', storage)
  }
}
