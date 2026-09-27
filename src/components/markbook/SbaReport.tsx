import { useEffect, useState } from 'react'
import { markSplitFor, programmeFor, type SbaTask } from '@/data/sba'
import { ComingUp } from '@/components/markbook/ComingUp'
import { getSubject } from '@/data/subjects'
import { capsLevel, fetchLearnerMarks, groupLearnerMarks, learnerResult, markBookTasks, termResult, type MarkReport, type SbaMarkRow } from '@/lib/sbaMarks'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardCheckIcon } from '@/components/ui/Icons'
import { fetchLearnerDates, shortDate, todayIso, type TaskDate } from '@/lib/sbaSchedule'
import { fetchLearnerComments, type TermComment } from '@/lib/sbaComments'

export { ComingUp }
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>

const pct = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const shortTitle = (t: SbaTask) => t.title.split(':')[0]

function TaskLine({ task, row, date }: { task: SbaTask; row: Row | undefined; date?: TaskDate }) {
  const percent = row?.status === 'marked' ? ((row.mark ?? 0) / row.out_of) * 100 : null
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-navy-900">{shortTitle(task)}</p>
        <p className="text-[11px] text-navy-500">
          {task.kind === shortTitle(task) ? '' : `${task.kind} · `}out of {task.marks}
          {task.sbaWeight ? ` · ${pct(task.sbaWeight)}% of the SBA` : task.exam === 'end-of-year' ? ' · not part of the SBA' : ''}
        </p>
      </div>
      <div className="text-right">
        {!row ? (
          date ? (
            <span className="text-xs font-semibold text-navy-700">
              {date.due_on >= todayIso() ? shortDate(date.due_on) : `Written ${shortDate(date.due_on)}`}
              <span className="block text-[11px] font-normal text-navy-400">{date.due_on >= todayIso() ? (date.note || 'Coming up') : 'No mark yet'}</span>
            </span>
          ) : (
            <span className="text-xs text-navy-400">No mark yet</span>
          )
        ) : row.status === 'absent' ? (
          <span className="text-sm font-semibold text-rose-700">
            Absent <span className="block text-[11px] font-normal">counts as 0</span>
          </span>
        ) : row.status === 'exempt' ? (
          <span className="text-sm font-semibold text-navy-600">
            Excused <span className="block text-[11px] font-normal text-navy-500">not counted</span>
          </span>
        ) : (
          <span className="text-sm font-semibold tabular-nums text-navy-900">
            {String(row.mark).replace('.', ',')} / {row.out_of}
            <span className="block text-[11px] font-normal text-navy-500">{pct(percent!)}%</span>
          </span>
        )}
      </div>
      {percent !== null ? <ProgressBar percent={percent} size="sm" className="col-span-2" label={`${shortTitle(task)}: ${pct(percent)}%`} /> : null}
    </li>
  )
}

/**
 * One subject's SBA marks, as a learner or a parent sees them: each formal
 * task of the programme with its mark (or that it is still to come), and the
 * SBA mark so far with its CAPS achievement level.
 */
export function SbaReport({
  subjectId,
  grade,
  year,
  marks,
  dates,
  comments,
}: {
  subjectId: string
  grade: Grade
  year: number
  marks: Map<string, Row>
  /** The dates the class's tasks are set for, by task. */
  dates?: Map<string, TaskDate>
  /** The teacher's comment on each term, by term. */
  comments?: Map<number, string>
}) {
  const tasks = markBookTasks(programmeFor(subjectId, grade))
  const result = learnerResult(tasks, grade, marks)
  const split = markSplitFor(grade)
  const subject = getSubject(subjectId)?.name ?? subjectId
  const level = result.sba === null ? null : capsLevel(result.sba)
  const terms = ([1, 2, 3, 4] as const).map((term) => ({ term, tasks: tasks.filter((t) => t.term === term) })).filter((t) => t.tasks.length)

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-navy-100 p-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
            SBA · {year}
          </p>
          <h3 className="text-lg font-bold text-navy-900">
            {subject} <span className="font-medium text-navy-500">Grade {grade}</span>
          </h3>
          <p className="mt-1 max-w-md text-xs text-navy-500">
            The SBA is {split.sba}% of the {grade === 12 ? 'final mark' : 'promotion mark'}; the {split.examName} is the other {split.exam}%.
          </p>
        </div>
        <div className="flex gap-5 text-right">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-navy-500">{result.covered < 100 ? 'SBA so far' : 'SBA'}</p>
            <p className="text-2xl font-bold tabular-nums text-navy-900">{result.sba === null ? '—' : `${pct(result.sba)}%`}</p>
            {level ? (
              <p className={cn('text-[11px] font-semibold', level.level >= 5 ? 'text-emerald-700' : level.level >= 3 ? 'text-gold-700' : 'text-rose-700')}>
                Level {level.level} · {level.name}
              </p>
            ) : null}
          </div>
          {result.promotion !== null ? (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy-500">Promotion</p>
              <p className="text-2xl font-bold tabular-nums text-navy-900">{pct(result.promotion)}%</p>
            </div>
          ) : null}
        </div>
      </div>
      {result.sba !== null && result.covered < 100 ? (
        <p className="border-b border-navy-100 bg-navy-50 px-5 py-2 text-xs text-navy-600">
          Worked out from the tasks marked so far, worth {pct(result.covered)}% of the SBA. It will change as more marks come in.
        </p>
      ) : null}
      <div className="grid gap-x-8 p-5 pt-3 sm:grid-cols-2">
        {terms.map(({ term, tasks: termTasks }) => (
          <div key={term} className="pt-2">
            <h4 className="flex items-baseline justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-navy-500">
              Term {term}
              {(() => {
                const t = termResult(tasks, term, marks)
                return t.percent === null ? null : (
                  <span className="normal-case tracking-normal text-navy-700">
                    Term mark <span className="tabular-nums text-navy-900">{pct(t.percent)}%</span>
                    {t.covered < 100 ? ' so far' : ''}
                  </span>
                )
              })()}
            </h4>
            <ul className="divide-y divide-navy-100">
              {termTasks.map((t) => (
                <TaskLine key={t.slot} task={t} row={marks.get(t.slot)} date={dates?.get(t.slot)} />
              ))}
            </ul>
            {comments?.get(term) ? (
              <p className="mt-1 rounded-lg bg-navy-50 p-2 text-xs text-navy-700">
                <span className="font-semibold">Teacher’s comment: </span>
                {comments.get(term)}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

/** Every SBA report for one learner, fetched live: the learner's own page and their parents'. */
export function LearnerSbaReports({
  learnerId,
  empty,
  topicLink,
  revise,
}: {
  learnerId: string
  empty: string
  topicLink?: (subjectId: string, grade: Grade, topicId: string) => string
  revise?: string
}) {
  const [state, setState] = useState<{ reports: MarkReport[]; dates: TaskDate[]; comments: TermComment[]; notSetUp: boolean } | null>(null)

  useEffect(() => {
    let live = true
    setState(null)
    const year = new Date().getFullYear()
    Promise.all([fetchLearnerMarks(learnerId), fetchLearnerDates(learnerId, year), fetchLearnerComments(learnerId)]).then(([{ rows, notSetUp }, dates, notes]) => {
      if (!live) return
      const reports = groupLearnerMarks(rows)
      // A class with dates set but no marks released yet still gets its card, to show what is coming.
      for (const d of dates ?? []) {
        if (!reports.some((r) => r.classId === d.class_id && r.year === d.year)) {
          reports.push({ classId: d.class_id, year: d.year, subjectId: d.subject_id, grade: d.grade, marks: new Map() })
        }
      }
      setState({ reports, dates: dates ?? [], comments: notes, notSetUp: notSetUp && !(dates ?? []).length })
    })
    return () => {
      live = false
    }
  }, [learnerId])

  if (!state) return <p className="text-sm text-navy-500">Loading…</p>
  if (state.notSetUp || state.reports.length === 0) {
    return <EmptyState icon={<ClipboardCheckIcon className="h-6 w-6" />} title="No SBA marks yet" description={empty} />
  }
  const datesOf = (classId: string, year: number) =>
    new Map(state.dates.filter((d) => d.class_id === classId && d.year === year).map((d) => [d.task_key, d]))
  return (
    <div className="space-y-4">
      <ComingUp dates={state.dates} topicLink={topicLink} revise={revise} />
      {state.reports.map((r) => (
        <SbaReport
          key={`${r.year}|${r.classId}`}
          subjectId={r.subjectId}
          grade={r.grade}
          year={r.year}
          marks={r.marks}
          dates={datesOf(r.classId, r.year)}
          comments={new Map(state.comments.filter((c) => c.class_id === r.classId && c.year === r.year).map((c) => [c.term, c.comment]))}
        />
      ))}
    </div>
  )
}
