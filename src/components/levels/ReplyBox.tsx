import { useState } from 'react'
import { PHONE_PATTERN, REPLY_TEXT, type ReplyChoice } from '@/lib/parentReplyTypes'

export interface ReplyValue {
  choice: ReplyChoice
  message: string
}

export interface ContactValue {
  phone: string
  best_time: string
}

/**
 * A parent's answer to an early warning, under the warning on their child's
 * levels card: "we have seen it and will practise at home" or "please call
 * me", with a message if they like. Once sent it shows what they said, and
 * can be changed.
 */
export function ReplyBox({
  reply,
  contact,
  onReply,
  note,
}: {
  reply?: ReplyValue
  /** The parent's saved phone number, offered again for a call. */
  contact?: ContactValue
  onReply: (choice: ReplyChoice, message: string, contact?: ContactValue) => Promise<string | undefined>
  /** A line under the box, e.g. that the demo does not send. */
  note?: string
}) {
  const [editing, setEditing] = useState(!reply)
  const [message, setMessage] = useState(reply?.message ?? '')
  const [phone, setPhone] = useState(contact?.phone ?? '')
  const [bestTime, setBestTime] = useState(contact?.best_time ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const send = async (choice: ReplyChoice) => {
    setError('')
    const p = phone.trim()
    if (choice === 'call' && !PHONE_PATTERN.test(p))
      return setError(p ? 'That phone number does not look right. Use digits, spaces and an optional + at the start.' : 'Add a phone number so the teacher can call you.')
    setBusy(true)
    const e = await onReply(choice, message, p && PHONE_PATTERN.test(p) ? { phone: p, best_time: bestTime.trim() } : undefined)
    setBusy(false)
    if (e) setError(e)
    else setEditing(false)
  }

  if (reply && !editing)
    return (
      <div className="rounded-md bg-white/70 px-2.5 py-2 text-xs text-navy-700">
        <span className="font-semibold text-emerald-800">You replied:</span> {REPLY_TEXT[reply.choice]}
        {reply.message ? <span className="italic"> · “{reply.message}”</span> : null}
        {reply.choice === 'call' && contact?.phone ? (
          <span>
            {' '}
            · on {contact.phone}
            {contact.best_time ? `, ${contact.best_time}` : ''}
          </span>
        ) : null}
        <button type="button" onClick={() => setEditing(true)} className="ml-2 font-semibold text-navy-700 underline underline-offset-2">
          Change
        </button>
        {note ? <span className="mt-1 block text-[11px] text-navy-500">{note}</span> : null}
      </div>
    )

  return (
    <div className="space-y-2 rounded-md bg-white/70 px-2.5 py-2">
      <label className="block text-xs font-semibold text-navy-800">
        Reply to the teacher
        <textarea
          rows={2}
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A message for the teacher, if you like"
          className="input mt-1 w-full text-sm font-normal"
        />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-navy-700">
          Your phone number, for a call
          <input
            type="tel"
            inputMode="tel"
            maxLength={20}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setError('')
            }}
            placeholder="e.g. 082 555 0123"
            className="input mt-1 w-full text-sm"
          />
        </label>
        <label className="block text-xs text-navy-700">
          Best time to call
          <input
            maxLength={80}
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
            placeholder="e.g. after 5 pm"
            className="input mt-1 w-full text-sm"
          />
        </label>
      </div>
      <p className="text-[11px] text-navy-500">Only staff at your child’s school see your number.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => send('seen')} className="btn-primary btn-sm">
          {REPLY_TEXT.seen}
        </button>
        <button type="button" disabled={busy} onClick={() => send('call')} className="btn-outline btn-sm">
          {REPLY_TEXT.call}
        </button>
      </div>
      {error ? <p className="text-xs text-rose-700">{error}</p> : null}
      {note ? <p className="text-[11px] text-navy-500">{note}</p> : null}
    </div>
  )
}
