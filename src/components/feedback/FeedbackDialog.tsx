import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { submitFeedback } from '@/lib/feedback'
import { cn } from '@/lib/utils'

const RATINGS = [
  { value: 1, label: 'Very poor' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Very good' },
]

/** The feedback form: a rating, a comment, and a way to reply if they want one. */
export function FeedbackDialog({ role, onClose }: { role: string; onClose: () => void }) {
  const { pathname } = useLocation()
  const [rating, setRating] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const box = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    box.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Please write a comment before sending.')
      return
    }
    setStatus('sending')
    setError('')
    const problem = await submitFeedback({ page: pathname, role, rating, message, contact })
    if (problem) {
      setStatus('idle')
      setError(problem)
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-navy-900/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl">
        {status === 'sent' ? (
          <div className="space-y-3 text-center">
            <p id="feedback-title" className="text-lg font-bold text-navy-900">
              Thank you!
            </p>
            <p className="text-sm text-navy-600">Your feedback has reached the DONE WELL team. It helps us make the app better for every learner.</p>
            <button type="button" onClick={onClose} className="btn-primary w-full">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-4">
            <div>
              <p id="feedback-title" className="text-lg font-bold text-navy-900">
                Send feedback
              </p>
              <p className="mt-0.5 text-sm text-navy-600">What works well? What is confusing or missing? Every comment is read.</p>
            </div>

            <fieldset>
              <legend className="text-xs font-medium text-navy-500">How is DONE WELL so far? (optional)</legend>
              <div className="mt-1.5 flex gap-1.5">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    aria-pressed={rating === r.value}
                    aria-label={`${r.value} of 5: ${r.label}`}
                    title={r.label}
                    onClick={() => setRating(rating === r.value ? null : r.value)}
                    className={cn(
                      'flex h-10 flex-1 items-center justify-center rounded-lg border text-sm font-bold',
                      rating !== null && r.value <= rating ? 'border-gold-500 bg-gold-400 text-navy-900' : 'border-navy-200 text-navy-500',
                    )}
                  >
                    {r.value}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-navy-400">1 = very poor, 5 = very good</p>
            </fieldset>

            <div>
              <label htmlFor="feedback-message" className="text-xs font-medium text-navy-500">
                Your comment
              </label>
              <textarea
                id="feedback-message"
                ref={box}
                required
                maxLength={2000}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input mt-1 !h-auto"
                placeholder="e.g. The practice questions are clear, but I could not find my marks."
              />
              <p className="mt-1 text-[11px] text-navy-400">Please do not include learners' names or other personal details.</p>
            </div>

            <div>
              <label htmlFor="feedback-contact" className="text-xs font-medium text-navy-500">
                Email or phone, if you would like a reply (optional)
              </label>
              <input
                id="feedback-contact"
                maxLength={200}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="input mt-1"
                autoComplete="email"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-rose-600">
                {error}
              </p>
            ) : null}

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" disabled={status === 'sending'} className="btn-primary flex-1">
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
