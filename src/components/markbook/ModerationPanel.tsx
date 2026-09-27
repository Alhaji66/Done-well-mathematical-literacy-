import { useMemo, useState } from 'react'
import type { SbaTask } from '@/data/sba'
import type { SbaMarkRow } from '@/lib/sbaMarks'
import { difference, suggestSample, summarise, TOLERANCE, type ModerationDecision, type ModerationMark } from '@/lib/sbaModeration'
import { cn } from '@/lib/utils'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>

const num = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const shortTitle = (t: SbaTask) => t.title.split(':')[0]
const signed = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${num(Math.abs(n))}`

/**
 * Moderation of one class's tasks, under its mark book. The moderator (the
 * subject's HOD or the principal) re-marks a sample of scripts and accepts the
 * task's marks or returns them with a comment; everyone else sees the result.
 */
export function ModerationPanel(props: {
  tasks: SbaTask[]
  learners: { id: string; name: string }[]
  marks: Map<string, Map<string, Row>>
  samples: ModerationMark[]
  decisions: Map<string, ModerationDecision>
  canModerate: boolean
  onSave: (task: SbaTask, learnerId: string, mark: number | null) => Promise<string | undefined>
  onDecide: (task: SbaTask, accept: boolean, comment: string) => Promise<string | undefined>
  onReopen: (task: SbaTask) => Promise<string | undefined>
}) {
  const { learners, marks, samples, decisions, canModerate, onSave, onDecide, onReopen } = props
  const names = new Map(learners.map((l) => [l.id, l.name]))
  // Only tasks with marked scripts can be moderated.
  const tasks = props.tasks.filter((t) => learners.some((l) => marks.get(l.id)?.get(t.slot)?.status === 'marked'))
  const [slot, setSlot] = useState(() => tasks.find((t) => !decisions.has(t.slot))?.slot ?? tasks[0]?.slot ?? '')
  const task = tasks.find((t) => t.slot === slot) ?? tasks[0]
  const [pending, setPending] = useState<Record<string, string[]>>({})
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const scripts = useMemo(
    () =>
      task
        ? learners
            .map((l) => ({ learnerId: l.id, row: marks.get(l.id)?.get(task.slot) }))
            .filter((s): s is { learnerId: string; row: Row } => s.row?.status === 'marked')
            .map((s) => ({ learnerId: s.learnerId, mark: s.row.mark ?? 0, percent: ((s.row.mark ?? 0) / s.row.out_of) * 100 }))
        : [],
    [task, learners, marks],
  )

  if (!task) {
    return (
      <section className="card space-y-2 p-5 print:hidden">
        <h3 className="font-bold text-navy-900">Moderation</h3>
        <p className="text-sm text-navy-500">Once a task has marks in, its scripts can be moderated here.</p>
      </section>
    )
  }

  const saved = samples.filter((s) => s.task_key === task.slot)
  const savedIds = new Set(saved.map((s) => s.learner_id))
  const pendingIds = (pending[task.slot] ?? []).filter((id) => !savedIds.has(id))
  const decision = decisions.get(task.slot)
  const locked = decision?.status === 'accepted'
  const editable = canModerate && !locked
  const summary = summarise(saved)
  const suggested = suggestSample(scripts)
  const current = new Map(scripts.map((s) => [s.learnerId, s.mark]))
  const rows = [
    ...saved.map((s) => ({ learnerId: s.learner_id, sample: s as ModerationMark | undefined })),
    ...pendingIds.map((id) => ({ learnerId: id, sample: undefined as ModerationMark | undefined })),
  ].sort((a, b) => (current.get(b.learnerId) ?? 0) - (current.get(a.learnerId) ?? 0))
  const notInSample = scripts.filter((s) => !savedIds.has(s.learnerId) && !pendingIds.includes(s.learnerId))

  const addToSample = (ids: string[]) => setPending((p) => ({ ...p, [task.slot]: [...new Set([...(p[task.slot] ?? []), ...ids])] }))

  const commit = async (learnerId: string) => {
    const id = `${task.slot}|${learnerId}`
    const text = drafts[id]
    if (text === undefined) return
    const value = text.trim() === '' ? null : Number(text.trim().replace(',', '.'))
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > task.marks)) {
      setError(`A moderated mark is a number from 0 to ${task.marks}.`)
      return
    }
    setError('')
    const problem = await onSave(task, learnerId, value === null ? null : Math.round(value * 10) / 10)
    if (problem) {
      setError(problem)
      return
    }
    setDrafts(({ [id]: _, ...rest }) => rest)
    if (value === null) setPending((p) => ({ ...p, [task.slot]: (p[task.slot] ?? []).filter((x) => x !== learnerId) }))
  }

  const run = async (action: () => Promise<string | undefined>) => {
    setBusy(true)
    setError('')
    const problem = await action()
    setBusy(false)
    if (problem) setError(problem)
    else setComment('')
  }

  return (
    <section className="card space-y-4 p-5 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <h3 className="font-bold text-navy-900">Moderation</h3>
          <p className="mt-1 text-xs text-navy-500">
            The subject’s head of department or the principal re-marks a sample of scripts: a tenth of the class and at least five, from the
            highest mark to the lowest. A moderated mark more than {TOLERANCE} percentage points from the teacher’s is flagged.
          </p>
        </div>
        <label className="text-xs font-medium text-navy-500">
          Task
          <select className="select mt-1 block" value={task.slot} onChange={(e) => setSlot(e.target.value)}>
            {tasks.map((t) => (
              <option key={t.slot} value={t.slot}>
                T{t.term} {shortTitle(t)}
                {decisions.get(t.slot) ? (decisions.get(t.slot)!.status === 'accepted' ? ' · accepted' : ' · returned') : ''}
              </option>
            ))}
          </select>
        </label>
      </div>

      {decision ? (
        <div className={cn('rounded-lg p-3 text-sm', decision.status === 'accepted' ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900')}>
          <p className="font-semibold">
            {decision.status === 'accepted' ? 'Marks accepted' : 'Returned to the teacher'} ·{' '}
            {new Date(decision.decided_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          {decision.comment ? <p className="mt-1 whitespace-pre-line">{decision.comment}</p> : null}
        </div>
      ) : (
        <p className="text-sm text-navy-600">{saved.length ? 'Being moderated.' : 'Not moderated yet.'}</p>
      )}

      {editable && suggested.some((id) => !savedIds.has(id) && !pendingIds.includes(id)) ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button type="button" className="btn-outline btn-sm" onClick={() => addToSample(suggested)}>
            Take the suggested sample ({suggested.length} of {scripts.length} scripts)
          </button>
          {notInSample.length ? (
            <select className="select" value="" onChange={(e) => e.target.value && addToSample([e.target.value])} aria-label="Add a script to the sample">
              <option value="">Add a script…</option>
              {notInSample.map((s) => (
                <option key={s.learnerId} value={s.learnerId}>
                  {names.get(s.learnerId) ?? 'A learner'} ({num(s.mark)})
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ) : null}

      {rows.length ? (
        <div className="overflow-x-auto rounded-lg border border-navy-100">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-navy-50 text-left text-xs text-navy-600">
                <th className="px-2 py-2 sm:px-3 font-semibold">Learner</th>
                <th className="px-2 py-2 sm:px-3 text-right font-semibold">Teacher</th>
                <th className="px-2 py-2 sm:px-3 text-right font-semibold">
                  <span className="sm:hidden">Mod.</span>
                  <span className="hidden sm:inline">Moderated</span>
                </th>
                <th className="px-2 py-2 sm:px-3 text-right font-semibold">
                  <span className="sm:hidden">Diff.</span>
                  <span className="hidden sm:inline">Difference</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ learnerId, sample }) => {
                const id = `${task.slot}|${learnerId}`
                const d = sample ? difference(sample) : null
                const now = current.get(learnerId)
                return (
                  <tr key={learnerId} className="border-t border-navy-100">
                    <td className="px-2 py-1.5 sm:px-3 text-navy-900">{names.get(learnerId) ?? 'A learner'}</td>
                    <td className="px-2 py-1.5 sm:px-3 text-right tabular-nums text-navy-700">
                      {num(sample ? sample.teacher_mark : (now ?? 0))}/{task.marks}
                      {sample && now !== undefined && now !== sample.teacher_mark ? (
                        <span className="block text-[11px] text-gold-800">now {num(now)}</span>
                      ) : null}
                    </td>
                    <td className="px-2 py-1.5 sm:px-3 text-right">
                      {editable ? (
                        <input
                          className="input w-16 py-1 text-right tabular-nums sm:w-20"
                          inputMode="decimal"
                          aria-label={`Moderated mark for ${names.get(learnerId) ?? 'this learner'}, out of ${task.marks}`}
                          value={drafts[id] ?? (sample ? num(sample.moderated_mark) : '')}
                          onChange={(e) => setDrafts((x) => ({ ...x, [id]: e.target.value }))}
                          onBlur={() => commit(learnerId)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                        />
                      ) : (
                        <span className="tabular-nums">{sample ? num(sample.moderated_mark) : '—'}</span>
                      )}
                    </td>
                    <td
                      className={cn(
                        'whitespace-nowrap px-2 py-1.5 text-right font-semibold tabular-nums sm:px-3',
                        d === null ? 'text-navy-400' : Math.abs(d) > TOLERANCE ? 'text-rose-700' : 'text-emerald-700',
                      )}
                    >
                      {d === null ? '—' : `${signed(d)} pts`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {summary ? (
        <p className="text-sm text-navy-700">
          {summary.n} script{summary.n === 1 ? '' : 's'} moderated · average difference {num(summary.meanDifference)} points · largest{' '}
          {num(summary.largest)} ·{' '}
          <span className={summary.outside ? 'font-semibold text-rose-700' : 'font-semibold text-emerald-700'}>
            {summary.outside} outside ±{TOLERANCE}
          </span>
          {Math.abs(summary.bias) >= 1 ? (
            <span className="block text-xs text-navy-500">
              On average the moderated marks are {num(Math.abs(summary.bias))} points {summary.bias > 0 ? 'higher' : 'lower'} than the teacher’s: the
              marking may be {summary.bias > 0 ? 'too strict' : 'too lenient'}.
            </span>
          ) : null}
        </p>
      ) : null}

      {canModerate ? (
        locked ? (
          <button type="button" disabled={busy} className="btn-outline btn-sm" onClick={() => run(() => onReopen(task))}>
            Reopen moderation
          </button>
        ) : saved.length ? (
          <div className="space-y-2">
            <textarea
              className="input min-h-[4.5rem]"
              maxLength={1000}
              placeholder="A comment for the teacher (needed when you return the marks): which questions to look at again, and whether to re-mark the class."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={busy} className="btn-primary btn-sm" onClick={() => run(() => onDecide(task, true, comment))}>
                Accept the marks
              </button>
              <button
                type="button"
                disabled={busy || !comment.trim()}
                className="btn-outline btn-sm"
                onClick={() => run(() => onDecide(task, false, comment))}
              >
                Return to the teacher
              </button>
            </div>
          </div>
        ) : null
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </section>
  )
}
