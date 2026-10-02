import { supabase } from '@/lib/supabaseClient'
import type { ParentContact, ParentReply, ReplyChoice } from '@/lib/parentReplyTypes'

/**
 * Parents' replies to early warnings (STEP 31). A parent reads their own; a
 * member of staff reads those at their school -- the database decides which.
 * Before STEP 31 is run there are none, and nothing fails.
 */
export async function fetchReplies(since: string, learnerIds?: string[]): Promise<ParentReply[]> {
  if (!supabase) return []
  const base = 'parent_id, learner_id, test_id, choice, message, updated_at'
  const run = (cols: string) => {
    let q = supabase!.from('parent_replies').select(cols).gte('updated_at', since)
    if (learnerIds?.length) q = q.in('learner_id', learnerIds)
    return q
  }
  // The marking columns arrive with STEP 32; before it, read the replies without them.
  const withMarks = await run(`${base}, handled_at, handled_by, handled_note`)
  if (!withMarks.error) return (withMarks.data ?? []) as unknown as ParentReply[]
  const plain = await run(base)
  return plain.error ? [] : ((plain.data ?? []) as unknown as ParentReply[])
}

/** Mark a parent's reply dealt with -- a call made -- with a note; or, with done false, put it back on the list. */
export async function markReplyHandled(r: Pick<ParentReply, 'parent_id' | 'learner_id' | 'test_id'>, note: string, done = true): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.rpc('mark_reply_handled', {
    p_parent: r.parent_id,
    p_learner: r.learner_id,
    p_test: r.test_id,
    p_note: note.trim().slice(0, 300),
    p_done: done,
  })
  if (error) {
    console.error('Failed to mark the call:', error)
    return /mark_reply_handled|schema cache|does not exist/i.test(error.message)
      ? 'Marking calls is not switched on yet: the school needs to run STEP 32 of the database update.'
      : error.message
  }
  return undefined
}

/** Answer an early warning, or change the answer: one reply per parent for each test. */
export async function saveReply(r: { parentId: string; learnerId: string; testId: string; choice: ReplyChoice; message: string }): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase
    .from('parent_replies')
    .upsert(
      { parent_id: r.parentId, learner_id: r.learnerId, test_id: r.testId, choice: r.choice, message: r.message.trim().slice(0, 500) },
      { onConflict: 'parent_id,learner_id,test_id' },
    )
  if (error) {
    console.error('Failed to send the reply:', error)
    return /parent_replies|schema cache|does not exist/i.test(error.message)
      ? 'Replies are not switched on yet: the school needs to run STEP 31 of the database update.'
      : error.message
  }
  return undefined
}

/** Phone numbers of parents: a parent's own, or (for staff) those of their learners' parents. Empty before STEP 33. */
export async function fetchContacts(parentIds?: string[]): Promise<ParentContact[]> {
  if (!supabase) return []
  let q = supabase.from('parent_contacts').select('parent_id, phone, best_time')
  if (parentIds) {
    if (!parentIds.length) return []
    q = q.in('parent_id', parentIds)
  }
  const { data, error } = await q
  return error ? [] : ((data ?? []) as ParentContact[])
}

/** Save the parent's own phone number and best time to call. */
export async function saveContact(parentId: string, phone: string, bestTime: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase
    .from('parent_contacts')
    .upsert({ parent_id: parentId, phone: phone.trim(), best_time: bestTime.trim().slice(0, 80) }, { onConflict: 'parent_id' })
  if (error) {
    console.error('Failed to save the phone number:', error)
    if (/parent_contacts|schema cache|does not exist/i.test(error.message)) return 'Phone numbers are not switched on yet: the school needs to run STEP 33.'
    if (/check/i.test(error.message)) return 'That phone number does not look right. Use digits, spaces and an optional + at the start.'
    return error.message
  }
  return undefined
}
