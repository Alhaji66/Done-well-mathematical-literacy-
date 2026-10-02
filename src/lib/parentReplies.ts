import { supabase } from '@/lib/supabaseClient'
import type { ParentReply, ReplyChoice } from '@/lib/parentReplyTypes'

/**
 * Parents' replies to early warnings (STEP 31). A parent reads their own; a
 * member of staff reads those at their school -- the database decides which.
 * Before STEP 31 is run there are none, and nothing fails.
 */
export async function fetchReplies(since: string, learnerIds?: string[]): Promise<ParentReply[]> {
  if (!supabase) return []
  let q = supabase.from('parent_replies').select('parent_id, learner_id, test_id, choice, message, updated_at').gte('updated_at', since)
  if (learnerIds?.length) q = q.in('learner_id', learnerIds)
  const { data, error } = await q
  return error ? [] : ((data ?? []) as ParentReply[])
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
