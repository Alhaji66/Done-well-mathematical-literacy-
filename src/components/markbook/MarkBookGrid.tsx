import { useMemo, useState } from 'react'
import type { SbaTask } from '@/data/sba'
import { cellText, learnerResult, parseCell, type CellValue, type SbaMarkRow } from '@/lib/sbaMarks'
import { DownloadIcon, PrinterIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>
type CellState = 'saving' | 'saved' | 'error'

const pct = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const shortTitle = (t: SbaTask) => t.title.split(':')[0]

/**
 * A class's SBA mark book: a row per learner, a column per formal task of the
 * DBE programme (and, in Grades 10 and 11, the end-of-year examination), with
 * the SBA and promotion marks worked out as marks go in.
 *
 * Typing: a number is a mark; "a" is absent (scores 0); "e" is excused (left
 * out, the other tasks carrying its weight); an empty cell clears the mark.
 * A cell saves when it loses focus; Enter moves down to the next learner.
 */
export function MarkBookGrid(props: {
  title: string
  grade: Grade
  tasks: SbaTask[]
  learners: { id: string; name: string }[]
  marks: Map<string, Map<string, Row>>
  editable: boolean
  onSave: (learnerId: string, task: SbaTask, value: CellValue) => Promise<string | undefined>
  /** The tasks released to learners and parents; leave out where there is no release step. */
  released?: Set<string>
  onRelease?: (task: SbaTask, released: boolean) => Promise<string | undefined>
}) {
  const { title, grade, tasks, learners, marks, editable, onSave, released, onRelease } = props
  const [releasing, setReleasing] = useState<string | null>(null)
  const [releaseError, setReleaseError] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [states, setStates] = useState<Record<string, CellState>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const hasExam = tasks.some((t) => t.exam === 'end-of-year')

  const results = useMemo(
    () => new Map(learners.map((l) => [l.id, learnerResult(tasks, grade, marks.get(l.id) ?? new Map())])),
    [learners, tasks, grade, marks],
  )

  const averages = tasks.map((t) => {
    const vals = learners
      .map((l) => marks.get(l.id)?.get(t.slot))
      .filter((r): r is Row => !!r && r.status === 'marked')
      .map((r) => ((r.mark ?? 0) / r.out_of) * 100)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  })

  const commit = async (learnerId: string, task: SbaTask) => {
    const id = `${learnerId}|${task.slot}`
    const text = drafts[id]
    if (text === undefined) return
    const saved = cellText(marks.get(learnerId)?.get(task.slot))
    if (text.trim() === saved) {
      setDrafts(({ [id]: _, ...rest }) => rest)
      return
    }
    const value = parseCell(text)
    if (value === 'invalid' || (typeof value === 'number' && value > task.marks)) {
      setStates((s) => ({ ...s, [id]: 'error' }))
      setErrors((e) => ({ ...e, [id]: value === 'invalid' ? 'Type a mark, a (absent) or e (excused)' : `More than ${task.marks}` }))
      return
    }
    setStates((s) => ({ ...s, [id]: 'saving' }))
    const error = await onSave(learnerId, task, value)
    if (error) {
      setStates((s) => ({ ...s, [id]: 'error' }))
      setErrors((e) => ({ ...e, [id]: error }))
      return
    }
    setStates((s) => ({ ...s, [id]: 'saved' }))
    setErrors(({ [id]: _, ...rest }) => rest)
    setDrafts(({ [id]: _, ...rest }) => rest)
  }

  const toggleRelease = async (task: SbaTask) => {
    if (!onRelease || !released) return
    const on = !released.has(task.slot)
    if (!on && !window.confirm(`Hide the ${shortTitle(task)} marks from learners and parents again?`)) return
    setReleasing(task.slot)
    setReleaseError('')
    const error = await onRelease(task, on)
    setReleasing(null)
    if (error) setReleaseError(error)
  }

  const exportCsv = () => {
    const q = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
    const head = ['Learner', ...tasks.map((t) => `T${t.term} ${shortTitle(t)} (/${t.marks})`), 'SBA %', ...(hasExam ? ['Promotion %'] : [])]
    const lines = learners.map((l) => {
      const r = results.get(l.id)!
      return [
        l.name,
        ...tasks.map((t) => cellText(marks.get(l.id)?.get(t.slot)).replace(',', '.')),
        r.sba === null ? '' : (Math.round(r.sba * 10) / 10).toString(),
        ...(hasExam ? [r.promotion === null ? '' : (Math.round(r.promotion * 10) / 10).toString()] : []),
      ]
        .map(q)
        .join(',')
    })
    const blob = new Blob([[head.map(q).join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${title.replace(/[^\w]+/g, '-')}-mark-book.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-auto text-xs text-navy-500">
          {editable ? 'Type a mark, a for absent (scores 0) or e for excused (not counted). Enter moves down.' : 'Read only: only the class teacher, the HOD or the principal can enter marks.'}
          {released && editable ? ' Learners and parents see a task’s marks once you release it.' : ''}
        </p>
        <button type="button" className="btn-outline btn-sm inline-flex items-center gap-1.5" onClick={exportCsv}>
          <DownloadIcon className="h-4 w-4" /> Export CSV
        </button>
        <button type="button" className="btn-primary btn-sm inline-flex items-center gap-1.5" onClick={() => window.print()}>
          <PrinterIcon className="h-4 w-4" /> Print
        </button>
      </div>

      {releaseError ? <p className="text-sm text-rose-600">{releaseError}</p> : null}

      <div className="print-area mark-sheet">
        <div className="hidden print:block">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">DONE WELL® SBA mark book</p>
          <h2 className="text-base font-bold text-navy-900">{title}</h2>
        </div>
        <div className="mark-sheet-scroll overflow-x-auto rounded-lg border border-navy-100">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-navy-50 text-navy-600">
                <th className="mark-sheet-name sticky left-0 z-10 min-w-[9rem] bg-navy-50 px-2 py-1.5 text-left font-semibold">Learner</th>
                {tasks.map((t) => (
                  <th key={t.slot} className="min-w-[4.5rem] border-l border-navy-100 px-1 py-1.5 text-center align-bottom font-semibold">
                    <span className="block text-[10px] font-normal text-navy-400">T{t.term}</span>
                    {shortTitle(t)}
                    <span className="block font-normal text-navy-500">
                      /{t.marks}
                      {t.sbaWeight ? ` · ${pct(t.sbaWeight)}%` : ''}
                    </span>
                    {released ? (
                      editable && onRelease ? (
                        <button
                          type="button"
                          disabled={releasing === t.slot}
                          onClick={() => toggleRelease(t)}
                          title={released.has(t.slot) ? 'Learners and parents can see these marks. Click to hide them again.' : 'Learners and parents cannot see these marks yet. Click to release them.'}
                          className={cn(
                            'mt-1 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[10px] font-semibold print:hidden',
                            released.has(t.slot) ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gold-300 bg-white text-gold-800 hover:bg-gold-50',
                          )}
                        >
                          {releasing === t.slot ? '…' : released.has(t.slot) ? '✓ Released' : 'Release'}
                        </button>
                      ) : (
                        <span className={cn('mt-1 block text-[10px] font-semibold print:hidden', released.has(t.slot) ? 'text-emerald-700' : 'text-navy-400')}>
                          {released.has(t.slot) ? 'Released' : 'Not released'}
                        </span>
                      )
                    ) : null}
                  </th>
                ))}
                <th className="min-w-[4rem] border-l border-navy-200 px-1 py-1.5 text-center font-semibold">SBA %</th>
                {hasExam ? <th className="min-w-[4.5rem] border-l border-navy-200 px-1 py-1.5 text-center font-semibold">Promotion %</th> : null}
              </tr>
            </thead>
            <tbody>
              {learners.map((l, li) => {
                const r = results.get(l.id)!
                return (
                  <tr key={l.id} className="border-t border-navy-100">
                    <td className="sticky left-0 z-10 bg-white px-2 py-1 font-medium text-navy-900">{l.name}</td>
                    {tasks.map((t, ti) => {
                      const id = `${l.id}|${t.slot}`
                      const saved = cellText(marks.get(l.id)?.get(t.slot))
                      const state = states[id]
                      return (
                        <td key={t.slot} className="border-l border-navy-100 p-0.5 text-center">
                          {editable ? (
                            <input
                              data-cell={`${li}-${ti}`}
                              className={cn(
                                'w-full rounded border px-1 py-1 text-center tabular-nums outline-none focus:border-navy-500',
                                state === 'error' ? 'border-rose-400 bg-rose-50' : state === 'saving' ? 'border-gold-300' : 'border-transparent',
                              )}
                              inputMode="decimal"
                              aria-label={`${l.name}, ${t.title}, out of ${t.marks}`}
                              title={errors[id]}
                              value={drafts[id] ?? saved}
                              onChange={(e) => setDrafts((d) => ({ ...d, [id]: e.target.value }))}
                              onBlur={() => commit(l.id, t)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const next = document.querySelector<HTMLInputElement>(`[data-cell="${li + 1}-${ti}"]`)
                                  if (next) next.focus()
                                  else (e.target as HTMLInputElement).blur()
                                }
                              }}
                            />
                          ) : (
                            <span className="tabular-nums">{saved}</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="border-l border-navy-200 px-1 text-center font-semibold tabular-nums text-navy-900">
                      {r.sba === null ? '—' : pct(r.sba)}
                      {r.sba !== null && r.covered < 100 ? <span className="block text-[10px] font-normal text-navy-400">so far</span> : null}
                    </td>
                    {hasExam ? (
                      <td className="border-l border-navy-200 px-1 text-center font-semibold tabular-nums text-navy-900">
                        {r.promotion === null ? '—' : pct(r.promotion)}
                      </td>
                    ) : null}
                  </tr>
                )
              })}
              <tr className="border-t-2 border-navy-200 bg-navy-50 text-navy-600">
                <td className="sticky left-0 z-10 bg-navy-50 px-2 py-1 font-semibold">Class average</td>
                {averages.map((a, i) => (
                  <td key={tasks[i].slot} className="border-l border-navy-100 px-1 py-1 text-center tabular-nums">
                    {a === null ? '' : `${pct(a)}%`}
                  </td>
                ))}
                <td className="border-l border-navy-200" />
                {hasExam ? <td className="border-l border-navy-200" /> : null}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-navy-500">
          SBA % uses the DBE Programme of Assessment weights. Absent (ABS) scores 0; excused (EX) is left out. {hasExam ? 'Promotion % = SBA × 40% + end-of-year examination × 60%.' : ''}
        </p>
      </div>
    </div>
  )
}
