import { useState } from 'react'
import { markSplitFor, type SbaTask } from '@/data/sba'
import { printPart } from '@/lib/print'
import { shortDate, todayIso, type TaskDate } from '@/lib/sbaSchedule'
import { PrinterIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

const pct = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const shortTitle = (t: SbaTask) => t.title.split(':')[0]
const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

/**
 * The class's assessment schedule: the date of each formal task, with a short
 * note ("bring a calculator"). The class teacher, the HOD or the principal
 * sets the dates; learners and parents see them, and are told when one is set
 * or moved. It prints as the handout a school gives out each term.
 */
export function SchedulePanel(props: {
  tasks: SbaTask[]
  dates: Map<string, TaskDate>
  editable: boolean
  onSave: (task: SbaTask, dueOn: string | null, note: string) => Promise<string | undefined>
  /** For the printed schedule. */
  heading: { school: string | null; classLabel: string; subject: string; grade: Grade; year: number; teacher: string | null }
}) {
  const { tasks, dates, editable, onSave, heading } = props
  const [drafts, setDrafts] = useState<Record<string, { due: string; note: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState('')
  const today = todayIso()
  const split = markSplitFor(heading.grade)

  const value = (t: SbaTask) => drafts[t.slot] ?? { due: dates.get(t.slot)?.due_on ?? '', note: dates.get(t.slot)?.note ?? '' }
  const commit = async (t: SbaTask) => {
    const d = drafts[t.slot]
    if (!d) return
    const saved = dates.get(t.slot)
    if (d.due === (saved?.due_on ?? '') && d.note.trim() === (saved?.note ?? '')) {
      setDrafts(({ [t.slot]: _, ...rest }) => rest)
      return
    }
    if (!d.due && d.note.trim()) {
      setError('Choose a date before adding a note.')
      return
    }
    setSaving(t.slot)
    setError('')
    const problem = await onSave(t, d.due || null, d.note)
    setSaving(null)
    if (problem) setError(problem)
    else setDrafts(({ [t.slot]: _, ...rest }) => rest)
  }
  const terms = ([1, 2, 3, 4] as const).map((term) => ({ term, tasks: tasks.filter((t) => t.term === term) })).filter((g) => g.tasks.length)
  const set = tasks.filter((t) => dates.has(t.slot)).length

  return (
    <>
      <section className="card space-y-4 p-5 print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-xl">
            <h3 className="font-bold text-navy-900">Assessment schedule</h3>
            <p className="mt-1 text-xs text-navy-500">
              {editable
                ? 'Set the date of each task. Learners and their parents see the dates, and are told when you set or move one that is still to come.'
                : 'The dates of the class’s formal tasks, as its teacher has set them.'}{' '}
              {set} of {tasks.length} dates set.
            </p>
          </div>
          <button type="button" className="btn-outline btn-sm inline-flex items-center gap-1.5" onClick={() => printPart('schedule')}>
            <PrinterIcon className="h-4 w-4" /> Print schedule
          </button>
        </div>

        <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
          {terms.map(({ term, tasks: termTasks }) => (
            <div key={term}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">Term {term}</h4>
              <ul className="mt-1 divide-y divide-navy-100">
                {termTasks.map((t) => {
                  const v = value(t)
                  const saved = dates.get(t.slot)
                  const past = saved && saved.due_on < today
                  return (
                    <li key={t.slot} className="grid grid-cols-1 gap-2 py-2 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-900">{shortTitle(t)}</p>
                        <p className="text-[11px] text-navy-500">
                          {t.marks} marks{t.sbaWeight ? ` · ${pct(t.sbaWeight)}% of the SBA` : ''}
                          {saved && !editable ? ` · ${shortDate(saved.due_on)}${saved.note ? ` · ${saved.note}` : ''}` : ''}
                        </p>
                      </div>
                      {editable ? (
                        <div className="flex flex-wrap items-center gap-2" onBlur={() => commit(t)}>
                          <input
                            type="date"
                            className={cn('input w-auto py-1 text-sm', past && 'text-navy-400')}
                            aria-label={`Date of ${shortTitle(t)}`}
                            value={v.due}
                            onChange={(e) => setDrafts((d) => ({ ...d, [t.slot]: { ...v, due: e.target.value } }))}
                          />
                          <input
                            className="input min-w-0 flex-1 py-1 text-sm sm:w-40 sm:flex-none"
                            maxLength={200}
                            placeholder="Note (optional)"
                            aria-label={`Note for ${shortTitle(t)}`}
                            value={v.note}
                            onChange={(e) => setDrafts((d) => ({ ...d, [t.slot]: { ...v, note: e.target.value } }))}
                          />
                          {saving === t.slot ? <span className="text-xs text-navy-400">Saving…</span> : null}
                        </div>
                      ) : !saved ? (
                        <span className="text-xs text-navy-400">No date yet</span>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </section>

      <div className="sba-schedule print-area hidden text-[12px] text-navy-900 print:block">
        <div className="flex items-start justify-between gap-4">
          <p className="font-bold">{heading.school ?? ''}</p>
          <p>{heading.year}</p>
        </div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-gold-700">Programme of assessment</p>
        <h2 className="text-lg font-bold">
          {heading.subject} · Grade {heading.grade} · {heading.classLabel}
        </h2>
        {heading.teacher ? <p className="text-navy-600">Teacher: {heading.teacher}</p> : null}
        <p className="mt-2 max-w-2xl">
          These are the formal tasks for the school-based assessment (SBA) this year. The SBA counts for {split.sba}% of the{' '}
          {heading.grade === 12 ? 'final mark' : 'promotion mark'}; the {split.examName} is the other {split.exam}%. A task missed without a valid
          reason scores 0. Dates may change; learners are told in class and in the DONE WELL app.
        </p>
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-navy-300 text-left">
              <th className="py-1 pr-2 font-semibold">Term</th>
              <th className="py-1 pr-2 font-semibold">Task</th>
              <th className="py-1 pr-2 text-right font-semibold">Marks</th>
              <th className="py-1 pr-2 text-right font-semibold">Share of SBA</th>
              <th className="py-1 pr-2 font-semibold">Date</th>
              <th className="py-1 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const d = dates.get(t.slot)
              return (
                <tr key={t.slot} className="border-b border-navy-100 align-top">
                  <td className="py-1.5 pr-2">{t.term}</td>
                  <td className="py-1.5 pr-2 font-medium">{shortTitle(t)}</td>
                  <td className="py-1.5 pr-2 text-right tabular-nums">{t.marks}</td>
                  <td className="py-1.5 pr-2 text-right tabular-nums">{t.sbaWeight ? `${pct(t.sbaWeight)}%` : '—'}</td>
                  <td className="py-1.5 pr-2">{d ? longDate(d.due_on) : 'To be announced'}</td>
                  <td className="py-1.5">{d?.note ?? ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="mt-10 grid grid-cols-2 gap-8">
          {['Parent or guardian', 'Learner'].map((who) => (
            <div key={who}>
              <div className="border-b border-navy-400" />
              <p className="mt-1 text-navy-600">{who} · signature and date</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
