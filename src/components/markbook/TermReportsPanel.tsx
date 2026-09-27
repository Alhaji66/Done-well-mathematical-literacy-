import { useState } from 'react'
import { markSplitFor, type SbaTask } from '@/data/sba'
import { capsLevel, learnerResult, termResult, type SbaMarkRow } from '@/lib/sbaMarks'
import { printPart } from '@/lib/print'
import type { TermComment } from '@/lib/sbaComments'
import { PrinterIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>

const num = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const shortTitle = (t: SbaTask) => t.title.split(':')[0]
const markText = (r: Row | undefined) =>
  !r ? '—' : r.status === 'absent' ? 'Absent' : r.status === 'exempt' ? 'Excused' : `${String(r.mark).replace('.', ',')} / ${r.out_of}`

export interface ReportHeading {
  school: string | null
  classLabel: string
  subject: string
  grade: Grade
  year: number
  teacher: string | null
}

/**
 * Term reports for a class: each learner's term mark (the term's tasks by the
 * DBE term weights) with its level, their SBA so far, and the teacher's
 * comment, which the learner and their parents can read. Prints one report a
 * page for the term.
 */
export function TermReportsPanel(props: {
  tasks: SbaTask[]
  learners: { id: string; name: string }[]
  marks: Map<string, Map<string, Row>>
  /** Comments by "learnerId|term"; null before STEP 26 (no comments then). */
  comments: Map<string, TermComment> | null
  editable: boolean
  onSave: (learnerId: string, term: number, comment: string) => Promise<string | undefined>
  heading: ReportHeading
}) {
  const { tasks, learners, marks, comments, editable, onSave, heading } = props
  const terms = ([1, 2, 3, 4] as const).filter((t) => tasks.some((x) => x.term === t))
  const latest = [...terms].reverse().find((t) => learners.some((l) => tasks.some((x) => x.term === t && marks.get(l.id)?.has(x.slot)))) ?? terms[0]
  const [term, setTerm] = useState<number>(latest)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState('')
  const split = markSplitFor(heading.grade)

  const commentOf = (learnerId: string) => comments?.get(`${learnerId}|${term}`)?.comment ?? ''
  const commit = async (learnerId: string) => {
    const id = `${learnerId}|${term}`
    const text = drafts[id]
    if (text === undefined || text.trim() === commentOf(learnerId)) {
      setDrafts(({ [id]: _, ...rest }) => rest)
      return
    }
    setSaving(id)
    setError('')
    const problem = await onSave(learnerId, term, text)
    setSaving(null)
    if (problem) setError(problem)
    else setDrafts(({ [id]: _, ...rest }) => rest)
  }

  const rows = learners.map((l) => {
    const m = marks.get(l.id) ?? new Map<string, Row>()
    return { learner: l, term: termResult(tasks, term, m), sba: learnerResult(tasks, heading.grade, m) }
  })
  const written = rows.filter((r) => commentOf(r.learner.id)).length

  return (
    <>
      <section className="card space-y-4 p-5 print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-xl">
            <h3 className="font-bold text-navy-900">Term reports</h3>
            <p className="mt-1 text-xs text-navy-500">
              The term mark weighs the term’s tasks by the DBE term weights.{' '}
              {comments === null
                ? 'Comments need STEP 26 of the database set-up.'
                : `${editable ? 'Write a short comment for each learner; they and their parents can read it.' : 'Comments from the class teacher.'} ${written} of ${learners.length} written.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label="Term">
              {terms.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={term === t}
                  onClick={() => setTerm(t)}
                  className={cn('rounded-md px-3 py-1 text-sm font-semibold', term === t ? 'bg-navy-900 text-white' : 'text-navy-600')}
                >
                  Term {t}
                </button>
              ))}
            </div>
            <button type="button" className="btn-outline btn-sm inline-flex items-center gap-1.5" onClick={() => printPart('reports')}>
              <PrinterIcon className="h-4 w-4" /> Print reports
            </button>
          </div>
        </div>

        <ul className="divide-y divide-navy-100">
          {rows.map(({ learner, term: tr }) => {
            const id = `${learner.id}|${term}`
            const level = tr.percent === null ? null : capsLevel(tr.percent)
            return (
              <li key={learner.id} className="grid gap-2 py-2 sm:grid-cols-[12rem_6rem_1fr] sm:items-start">
                <p className="text-sm font-medium text-navy-900">{learner.name}</p>
                <p className="text-sm tabular-nums">
                  <span className="font-semibold text-navy-900">{tr.percent === null ? '—' : `${num(tr.percent)}%`}</span>
                  {level ? (
                    <span className={cn('block text-[11px]', level.level >= 3 ? 'text-navy-500' : 'text-rose-700')}>Level {level.level}</span>
                  ) : null}
                </p>
                {comments === null ? null : editable ? (
                  <div>
                    <textarea
                      className="input min-h-[2.5rem] py-1.5 text-sm"
                      rows={2}
                      maxLength={600}
                      aria-label={`Comment for ${learner.name}, Term ${term}`}
                      placeholder="A comment for the report"
                      value={drafts[id] ?? commentOf(learner.id)}
                      onChange={(e) => setDrafts((d) => ({ ...d, [id]: e.target.value }))}
                      onBlur={() => commit(learner.id)}
                    />
                    {saving === id ? <span className="text-[11px] text-navy-400">Saving…</span> : null}
                  </div>
                ) : (
                  <p className="text-sm text-navy-700">{commentOf(learner.id) || <span className="text-navy-400">No comment</span>}</p>
                )}
              </li>
            )
          })}
        </ul>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </section>

      <div className="term-reports print-area hidden text-[12px] text-navy-900 print:block">
        {rows.map(({ learner, term: tr, sba }, i) => {
          const level = tr.percent === null ? null : capsLevel(tr.percent)
          const sbaLevel = sba.sba === null ? null : capsLevel(sba.sba)
          const comment = commentOf(learner.id)
          return (
            <section key={learner.id} className={i ? 'print-break-before' : undefined}>
              <div className="flex items-start justify-between gap-4">
                <p className="font-bold">{heading.school ?? ''}</p>
                <p>
                  Term {term} · {heading.year}
                </p>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-gold-700">Term report</p>
              <h2 className="text-lg font-bold">{learner.name}</h2>
              <p className="text-navy-600">
                {heading.subject} · Grade {heading.grade} · {heading.classLabel}
                {heading.teacher ? ` · Teacher: ${heading.teacher}` : ''}
              </p>

              <table className="mt-4 w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-navy-300 text-left">
                    <th className="py-1 pr-2 font-semibold">Formal task, Term {term}</th>
                    <th className="py-1 pr-2 text-right font-semibold">Mark</th>
                    <th className="py-1 pr-2 text-right font-semibold">%</th>
                    <th className="py-1 text-right font-semibold">Share of the term</th>
                  </tr>
                </thead>
                <tbody>
                  {tr.tasks.map((t) => {
                    const r = marks.get(learner.id)?.get(t.slot)
                    return (
                      <tr key={t.slot} className="border-b border-navy-100">
                        <td className="py-1.5 pr-2">{shortTitle(t)}</td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">{markText(r)}</td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">{r?.status === 'marked' ? `${num(((r.mark ?? 0) / r.out_of) * 100)}%` : ''}</td>
                        <td className="py-1.5 text-right tabular-nums">{t.termWeight ? `${num(t.termWeight)}%` : ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded border border-navy-300 p-3">
                  <p className="text-navy-500">Term {term} mark</p>
                  <p className="text-2xl font-bold tabular-nums">{tr.percent === null ? '—' : `${num(tr.percent)}%`}</p>
                  {level ? <p>Level {level.level}: {level.name}</p> : null}
                </div>
                <div className="rounded border border-navy-300 p-3">
                  <p className="text-navy-500">SBA so far</p>
                  <p className="text-2xl font-bold tabular-nums">{sba.sba === null ? '—' : `${num(sba.sba)}%`}</p>
                  {sbaLevel ? <p>Level {sbaLevel.level}: {sbaLevel.name}</p> : null}
                  <p className="mt-1 text-[10px] text-navy-500">
                    {split.sba}% of the {heading.grade === 12 ? 'final' : 'promotion'} mark
                    {sba.promotion !== null ? ` · promotion mark ${num(sba.promotion)}%` : ''}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded border border-navy-300 p-3">
                <p className="text-navy-500">Teacher’s comment</p>
                <p className="mt-1 min-h-[3.5rem] whitespace-pre-line">{comment}</p>
              </div>

              <p className="mt-3 text-[10px] text-navy-500">
                Levels: 7 Outstanding (80–100%) · 6 Meritorious (70–79%) · 5 Substantial (60–69%) · 4 Adequate (50–59%) · 3 Moderate (40–49%) · 2
                Elementary (30–39%) · 1 Not achieved (0–29%). Absent scores 0; excused is left out.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6">
                {['Teacher', 'HOD or principal', 'Parent or guardian'].map((who) => (
                  <div key={who}>
                    <div className="h-8 border-b border-navy-400" />
                    <p className="mt-1 text-navy-600">{who} · signature and date</p>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
