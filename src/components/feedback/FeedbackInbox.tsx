import { useEffect, useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fetchFeedback, setFeedbackStatus, type FeedbackItem, type FeedbackStatus } from '@/lib/feedback'
import { cn } from '@/lib/utils'

const when = (d: string) =>
  new Date(d).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const STATUS_LABEL: Record<FeedbackStatus, string> = { new: 'New', read: 'Read', done: 'Dealt with' }

/** Who sent it, in words: 'demo:teacher' reads as "Teacher (demo)". */
function who(role: string) {
  const [first, second] = role.split(':')
  const name = (r: string) => (r === 'hod' ? 'Head of Department' : r.charAt(0).toUpperCase() + r.slice(1))
  return first === 'demo' && second ? `${name(second)} (demo)` : name(first)
}

/**
 * Feedback sent from the "Feedback" button on every page (STEP 37). Newest
 * first; "New" shows only what nobody has looked at yet.
 */
export function FeedbackInbox() {
  const [rows, setRows] = useState<FeedbackItem[]>([])
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [show, setShow] = useState<'new' | 'all'>('new')

  const load = async () => {
    const r = await fetchFeedback()
    setRows(r.rows)
    setError(r.error ?? '')
    setLoaded(true)
  }
  useEffect(() => {
    void load()
  }, [])

  const mark = async (id: string, status: FeedbackStatus) => {
    const problem = await setFeedbackStatus(id, status)
    if (problem) setError(problem)
    else setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const fresh = rows.filter((r) => r.status === 'new').length
  const shown = show === 'new' ? rows.filter((r) => r.status === 'new') : rows
  const rated = rows.filter((r) => r.rating !== null)
  const average = rated.length ? rated.reduce((t, r) => t + (r.rating ?? 0), 0) / rated.length : null

  return (
    <section className="space-y-4">
      <SectionHeading
        eyebrow="Feedback"
        title={fresh ? `Feedback · ${fresh} new` : 'Feedback'}
        description="Comments sent with the Feedback button by learners, teachers, parents, schools and demo visitors. Newest first."
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-navy-200 bg-white p-1">
          {(['new', 'all'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={show === v}
              onClick={() => setShow(v)}
              className={cn('rounded-md px-3 py-1.5 text-xs font-semibold', show === v ? 'bg-navy-900 text-white' : 'text-navy-600')}
            >
              {v === 'new' ? `New (${fresh})` : `All (${rows.length})`}
            </button>
          ))}
        </div>
        {average !== null ? (
          <p className="text-sm text-navy-600">
            Average rating <strong className="tabular-nums text-navy-900">{average.toFixed(1).replace('.', ',')}</strong> of 5, from{' '}
            {rated.length} {rated.length === 1 ? 'rating' : 'ratings'}
          </p>
        ) : null}
        <button type="button" onClick={() => void load()} className="btn-ghost btn-sm">
          Refresh
        </button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {!loaded ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="card p-5 text-sm text-navy-500">{show === 'new' ? 'No new feedback. Everything has been read.' : 'No feedback yet.'}</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((r) => (
            <li key={r.id} className={cn('card space-y-2 p-4', r.status === 'new' && 'border-gold-300')}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-500">
                <span className="font-semibold text-navy-800">{who(r.role)}</span>
                <span>{when(r.created_at)}</span>
                <span className="font-mono">{r.page}</span>
                {r.rating !== null ? <span className="rounded bg-gold-100 px-1.5 py-0.5 font-semibold text-navy-900">{r.rating}/5</span> : null}
                <span className="ml-auto rounded bg-navy-50 px-1.5 py-0.5">{STATUS_LABEL[r.status]}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-navy-900">{r.message}</p>
              {r.contact ? <p className="text-xs text-navy-600">Reply to: {r.contact}</p> : null}
              <div className="flex gap-2">
                {r.status !== 'read' ? (
                  <button type="button" className="btn-outline btn-sm" onClick={() => void mark(r.id, 'read')}>
                    Mark read
                  </button>
                ) : null}
                {r.status !== 'done' ? (
                  <button type="button" className="btn-outline btn-sm" onClick={() => void mark(r.id, 'done')}>
                    Dealt with
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
