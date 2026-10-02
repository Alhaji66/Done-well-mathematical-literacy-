import { useState, type ReactNode } from 'react'
import { getTopic } from '@/data/topics'

export interface StartGroupInput {
  classId: string
  learners: { id: string; baseline: number }[]
  topicId: string
  plan: string
}

/**
 * "Start a catch-up group with N learners": the button, then a topic and a
 * plan, then the group. Shared by the early-warning list and the term
 * movement list on the Levels page.
 */
export function CatchUpGroupForm({
  classId,
  chosen,
  topics,
  planFor,
  baselineNote,
  onStartGroup,
  groupsLink,
}: {
  classId: string
  chosen: { id: string; baseline: number }[]
  /** Topic ids, the likeliest first, each with an optional note shown beside it. */
  topics: { id: string; note?: string }[]
  planFor: (topicName: string) => string
  baselineNote: string
  onStartGroup: (input: StartGroupInput) => Promise<string | undefined>
  groupsLink?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [topicId, setTopicId] = useState('')
  const [plan, setPlan] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [started, setStarted] = useState('')
  const topicName = (id: string) => getTopic(id)?.name ?? 'the topic'

  const openForm = () => {
    const first = topics[0]?.id ?? ''
    setTopicId(first)
    setPlan(planFor(topicName(first)))
    setError('')
    setStarted('')
    setOpen(true)
  }
  const start = async () => {
    if (!topicId) return setError('Choose the topic the group needs help with.')
    setBusy(true)
    setError('')
    const problem = await onStartGroup({ classId, learners: chosen, topicId, plan })
    setBusy(false)
    if (problem) return setError(problem)
    setStarted(`Started a catch-up group on ${topicName(topicId)} for ${chosen.length} learner${chosen.length === 1 ? '' : 's'}.`)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <button type="button" className="btn-outline btn-sm" disabled={!chosen.length} onClick={openForm}>
        Start a catch-up group with {chosen.length} learner{chosen.length === 1 ? '' : 's'}
      </button>
      {open ? (
        <div className="space-y-2 border-t border-navy-100 pt-3">
          <label className="block text-xs font-medium text-navy-500">
            Topic
            <select className="select mt-1 block w-full max-w-full sm:w-auto" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {topicName(t.id)}
                  {t.note ? ` · ${t.note}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-navy-500">
            Plan
            <textarea className="input mt-1 min-h-[4rem]" maxLength={2000} value={plan} onChange={(e) => setPlan(e.target.value)} />
          </label>
          <p className="text-xs text-navy-500">{baselineNote}</p>
          <div className="flex gap-2">
            <button type="button" className="btn-primary btn-sm" disabled={busy} onClick={start}>
              {busy ? 'Starting…' : 'Start the group'}
            </button>
            <button type="button" className="btn-outline btn-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {started ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          {started} {groupsLink}
        </p>
      ) : null}
    </div>
  )
}
