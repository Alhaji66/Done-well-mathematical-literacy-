import type { SbaTask } from '@/data/sba'
import { difference, summarise, TOLERANCE, type ModerationDecision, type ModerationMark } from '@/lib/sbaModeration'

export interface ReportInfo {
  school: string | null
  classLabel: string
  subject: string
  grade: number
  year: number
  /** The class teacher's name. */
  teacher: string | null
  /** Names of learners and staff, by id. */
  names: Map<string, string>
}

const num = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const signed = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${num(Math.abs(n))}`
const day = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })

/** Print `print-area` elements as the moderation report alone (see index.css). */
export function printModerationReport() {
  document.body.dataset.print = 'moderation'
  const done = () => {
    delete document.body.dataset.print
    window.removeEventListener('afterprint', done)
  }
  window.addEventListener('afterprint', done)
  window.print()
}

/**
 * A task's moderation as a sheet for the subject's SBA file: the class and the
 * task, who marked and who moderated, the sample with each difference, the
 * summary, the decision, and lines for the teacher, the moderator and the
 * principal to sign. Hidden on screen; printed by printModerationReport().
 */
export function ModerationReport({
  info,
  task,
  samples,
  decision,
  scripts,
}: {
  info: ReportInfo
  task: SbaTask
  samples: ModerationMark[]
  decision: ModerationDecision | undefined
  /** How many scripts the teacher marked. */
  scripts: number
}) {
  const summary = summarise(samples)
  const name = (id: string | null | undefined) => (id ? (info.names.get(id) ?? '') : '')
  const moderator = name(decision?.moderator_id ?? samples.find((s) => s.moderator_id)?.moderator_id)
  const latest = samples.reduce((a, s) => (s.updated_at > a ? s.updated_at : a), '')
  const rows = [...samples].sort((a, b) => b.teacher_mark - a.teacher_mark)

  const field = (label: string, value: string) => (
    <div className="flex gap-2 border-b border-navy-200 py-1">
      <span className="w-28 shrink-0 text-navy-500">{label}</span>
      <span className="font-medium text-navy-900">{value || ' '}</span>
    </div>
  )

  return (
    <div className="moderation-report print-area hidden text-[11px] text-navy-900 print:block">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-700">DONE WELL® · SBA moderation report</p>
      <h2 className="mt-0.5 text-base font-bold">
        {info.subject} Grade {info.grade} · {task.title.split(':')[0]} (Term {task.term})
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-x-6">
        {field('School', info.school ?? '')}
        {field('Year', String(info.year))}
        {field('Class', info.classLabel)}
        {field('Task total', `${task.marks} marks`)}
        {field('Teacher', info.teacher ?? '')}
        {field('Scripts marked', String(scripts))}
        {field('Moderator', moderator)}
        {field('Moderated', latest ? day(latest) : '')}
      </div>

      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-navy-300 text-left">
            <th className="py-1 pr-2 font-semibold">#</th>
            <th className="py-1 pr-2 font-semibold">Learner</th>
            <th className="py-1 pr-2 text-right font-semibold">Teacher’s mark</th>
            <th className="py-1 pr-2 text-right font-semibold">Moderated mark</th>
            <th className="py-1 pr-2 text-right font-semibold">Difference (points)</th>
            <th className="py-1 text-right font-semibold">Within ±{TOLERANCE}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => {
            const d = difference(s)
            return (
              <tr key={s.learner_id} className="border-b border-navy-100">
                <td className="py-1 pr-2 tabular-nums">{i + 1}</td>
                <td className="py-1 pr-2">{name(s.learner_id) || 'A learner'}</td>
                <td className="py-1 pr-2 text-right tabular-nums">
                  {num(s.teacher_mark)}/{s.out_of}
                </td>
                <td className="py-1 pr-2 text-right tabular-nums">
                  {num(s.moderated_mark)}/{s.out_of}
                </td>
                <td className="py-1 pr-2 text-right tabular-nums">{signed(d)}</td>
                <td className="py-1 text-right">{Math.abs(d) > TOLERANCE ? 'No' : 'Yes'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {summary ? (
        <p className="mt-3">
          {summary.n} of {scripts} scripts moderated. Average difference {num(summary.meanDifference)} points; largest {num(summary.largest)};{' '}
          {summary.outside} outside ±{TOLERANCE}.
          {Math.abs(summary.bias) >= 1
            ? ` On average the moderated marks are ${num(Math.abs(summary.bias))} points ${summary.bias > 0 ? 'higher' : 'lower'} than the teacher’s.`
            : ''}
        </p>
      ) : null}

      <div className="mt-3 rounded border border-navy-300 p-2">
        <p className="font-semibold">
          Decision:{' '}
          {decision ? (decision.status === 'accepted' ? 'marks accepted' : 'marks returned to the teacher') : 'not yet decided'}
          {decision ? ` on ${day(decision.decided_at)}` : ''}
        </p>
        <p className="mt-1 min-h-[3rem] whitespace-pre-line">{decision?.comment || 'Comment:'}</p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">
        {['Teacher', 'Moderator (HOD)', 'Principal'].map((role) => (
          <div key={role}>
            <div className="h-8 border-b border-navy-400" />
            <p className="mt-1 text-navy-600">{role} · signature and date</p>
          </div>
        ))}
      </div>
    </div>
  )
}
