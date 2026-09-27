import { useEffect, useState } from 'react'
import { markSplitFor, programmeFor, type SbaTask } from '@/data/sba'
import { getSubject } from '@/data/subjects'
import { capsLevel, fetchLearnerMarks, groupLearnerMarks, learnerResult, markBookTasks, type MarkReport, type SbaMarkRow } from '@/lib/sbaMarks'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardCheckIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>

const pct = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
const shortTitle = (t: SbaTask) => t.title.split(':')[0]

function TaskLine({ task, row }: { task: SbaTask; row: Row | undefined }) {
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
          <span className="text-xs text-navy-400">Not marked yet</span>
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
export function SbaReport({ subjectId, grade, year, marks }: { subjectId: string; grade: Grade; year: number; marks: Map<string, Row> }) {
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
            <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">Term {term}</h4>
            <ul className="divide-y divide-navy-100">
              {termTasks.map((t) => (
                <TaskLine key={t.slot} task={t} row={marks.get(t.slot)} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Every SBA report for one learner, fetched live: the learner's own page and their parents'. */
export function LearnerSbaReports({ learnerId, empty }: { learnerId: string; empty: string }) {
  const [state, setState] = useState<{ reports: MarkReport[]; notSetUp: boolean } | null>(null)

  useEffect(() => {
    let live = true
    setState(null)
    fetchLearnerMarks(learnerId).then(({ rows, notSetUp }) => {
      if (live) setState({ reports: groupLearnerMarks(rows), notSetUp })
    })
    return () => {
      live = false
    }
  }, [learnerId])

  if (!state) return <p className="text-sm text-navy-500">Loading…</p>
  if (state.notSetUp || state.reports.length === 0) {
    return <EmptyState icon={<ClipboardCheckIcon className="h-6 w-6" />} title="No SBA marks yet" description={empty} />
  }
  return (
    <div className="space-y-4">
      {state.reports.map((r) => (
        <SbaReport key={`${r.year}|${r.classId}`} subjectId={r.subjectId} grade={r.grade} year={r.year} marks={r.marks} />
      ))}
    </div>
  )
}
