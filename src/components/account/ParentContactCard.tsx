import { useEffect, useState, type FormEvent } from 'react'
import { deleteContact, fetchContacts, saveContact } from '@/lib/parentReplies'
import { PHONE_PATTERN } from '@/lib/parentReplyTypes'

/**
 * A parent's phone number for the school, on the Privacy & data page: add,
 * change or remove it at any time, not only when asking for a call. Staff at
 * their child's school see it on their list of calls to make, and nobody
 * else does (STEP 33).
 */
export function ParentContactCard({ parentId }: { parentId: string }) {
  const [saved, setSaved] = useState<{ phone: string; best_time: string } | null>(null)
  const [phone, setPhone] = useState('')
  const [bestTime, setBestTime] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let live = true
    fetchContacts([parentId]).then((rows) => {
      if (!live || !rows[0]) return
      setSaved({ phone: rows[0].phone, best_time: rows[0].best_time })
      setPhone(rows[0].phone)
      setBestTime(rows[0].best_time)
    })
    return () => {
      live = false
    }
  }, [parentId])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (!PHONE_PATTERN.test(phone.trim())) return setError('That phone number does not look right. Use digits, spaces and an optional + at the start.')
    setBusy(true)
    const err = await saveContact(parentId, phone, bestTime)
    setBusy(false)
    if (err) return setError(err)
    setSaved({ phone: phone.trim(), best_time: bestTime.trim() })
    setMessage('Saved. Your child’s school can now call you on this number.')
  }

  const remove = async () => {
    setMessage('')
    setError('')
    setBusy(true)
    const err = await deleteContact(parentId)
    setBusy(false)
    if (err) return setError(err)
    setSaved(null)
    setPhone('')
    setBestTime('')
    setMessage('Removed. The school no longer sees a number for you.')
  }

  return (
    <section className="card p-5">
      <h2 className="text-base font-bold text-navy-900">Your phone number for the school</h2>
      <p className="mt-1 text-sm text-navy-600">
        So that your child’s teacher can call you about an early warning. Only staff at your child’s school see it, and you can change or
        remove it at any time.
      </p>
      <form onSubmit={save} className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-navy-600">
          Phone number
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
            className="input mt-1 w-full"
          />
        </label>
        <label className="block text-xs font-medium text-navy-600">
          Best time to call
          <input maxLength={80} value={bestTime} onChange={(e) => setBestTime(e.target.value)} placeholder="e.g. after 5 pm" className="input mt-1 w-full" />
        </label>
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <button type="submit" disabled={busy} className="btn-primary btn-sm">
            {saved ? 'Save changes' : 'Save number'}
          </button>
          {saved ? (
            <button type="button" disabled={busy} onClick={remove} className="btn-outline btn-sm">
              Remove my number
            </button>
          ) : null}
        </div>
      </form>
      {message ? <p className="mt-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </section>
  )
}
