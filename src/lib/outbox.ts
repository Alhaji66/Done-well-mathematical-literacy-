import { supabase } from '@/lib/supabaseClient'

/**
 * Answers given with no signal, kept on the phone until there is one.
 *
 * Practice works offline -- the questions are in the app -- but saving the
 * result to the learner's account needs the network. Rather than lose those
 * answers, each save that could not be sent is written here and sent, in the
 * order it happened, as soon as the phone is back online.
 *
 * Progress rows are absolute values (the new mastery), so only the latest one
 * per topic is kept; each My Mistakes answer counts, so every one is kept.
 */

type Item =
  | {
      kind: 'progress'
      row: { learner_id: string; topic_id: string; mastery_percent: number; questions_attempted: number; updated_at: string }
    }
  | { kind: 'answer'; learnerId: string; args: { p_question: string; p_topic: string; p_source: string; p_correct: boolean } }

const owner = (i: Item) => (i.kind === 'progress' ? i.row.learner_id : i.learnerId)

const KEY = 'donewell-outbox'
const CHANGED = 'donewell-outbox-changed'

function load(): Item[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Item[]
  } catch {
    return []
  }
}

function save(items: Item[]) {
  try {
    if (items.length) localStorage.setItem(KEY, JSON.stringify(items))
    else localStorage.removeItem(KEY)
  } catch {
    // Storage full or blocked: nothing more can be done offline.
  }
  window.dispatchEvent(new Event(CHANGED))
}

export function enqueue(item: Item) {
  let items = load()
  if (item.kind === 'progress') {
    items = items.filter((i) => !(i.kind === 'progress' && i.row.learner_id === item.row.learner_id && i.row.topic_id === item.row.topic_id))
  }
  save([...items, item])
}

export const pendingCount = () => load().length

export function onOutboxChange(fn: () => void) {
  window.addEventListener(CHANGED, fn)
  return () => window.removeEventListener(CHANGED, fn)
}

/** A failure that means "no signal", as opposed to the server saying no. */
export function isNetworkError(error: { message?: string } | null | undefined) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true
  return /failed to fetch|networkerror|load failed|network request failed/i.test(error?.message ?? '')
}

let flushing = false

/** Send what is waiting. Stops at the first network failure and tries again later. */
export async function flushOutbox() {
  if (flushing || !supabase || (typeof navigator !== 'undefined' && !navigator.onLine)) return
  flushing = true
  try {
    // Only the signed-in learner's own saves are sent; on a shared phone the
    // rest wait for their owner to sign in.
    const { data } = await supabase.auth.getSession()
    const me = data.session?.user.id
    if (!me) return
    for (;;) {
      const item = load().find((i) => owner(i) === me)
      if (!item) break
      const { error } =
        item.kind === 'progress'
          ? await supabase.from('learner_progress').upsert(item.row)
          : await supabase.rpc('record_answer', item.args)
      if (error && isNetworkError(error)) break
      // Anything else is the database refusing it, which a retry will not
      // change, so it is dropped rather than retried forever.
      if (error) console.warn('Could not send a saved answer:', error.message)
      const items = load()
      const at = items.findIndex((i) => JSON.stringify(i) === JSON.stringify(item))
      if (at >= 0) items.splice(at, 1)
      save(items)
    }
  } finally {
    flushing = false
  }
}

let started = false

/** Sends anything left from last time, and again whenever the signal returns. Safe to call more than once. */
export function startOutbox() {
  void flushOutbox()
  if (started) return
  started = true
  window.addEventListener('online', () => void flushOutbox())
}
