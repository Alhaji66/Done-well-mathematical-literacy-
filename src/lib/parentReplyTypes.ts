/** A parent's answer to an early warning about their child (STEP 31). */
export type ReplyChoice = 'seen' | 'call'

export interface ParentReply {
  parent_id: string
  learner_id: string
  test_id: string
  choice: ReplyChoice
  message: string
  updated_at: string
  /** When someone at the school dealt with it -- for a call, made the call (STEP 32). */
  handled_at?: string | null
  handled_by?: string | null
  handled_note?: string
}

/** What each answer says, in the parent's words. */
export const REPLY_TEXT: Record<ReplyChoice, string> = {
  seen: 'We have seen it and will practise at home',
  call: 'Please call me',
}

/** The same, as a teacher reads it beside the learner. */
export const REPLY_FOR_TEACHER: Record<ReplyChoice, string> = {
  seen: 'Parent: seen, practising at home',
  call: 'Parent asks for a call',
}
