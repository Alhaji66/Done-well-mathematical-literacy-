import { useMemo, useState } from 'react'
import { getSubject } from '@/data/subjects'
import { programmeFor } from '@/data/sba'
import { capsLevel, markBookTasks, type SbaMarkRow } from '@/lib/sbaMarks'
import { atRiskLearners, type AtRisk } from '@/lib/sbaProgress'
import { DownloadIcon, PrinterIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { OverviewClass } from '@/components/markbook/MarkBookOverview'

type Row = Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>
type Filter = 'all' | AtRisk['band']

const BAND_ORDER: Record<AtRisk['band'], number> = { 'below-30': 0, '30-39': 1, gaps: 2 }
const num = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')

const BAND: Record<AtRisk['band'], { label: string; chip: string }> = {
  'below-30': { label: 'Below 30%', chip: 'bg-rose-100 text-rose-800' },
  '30-39': { label: '30–39%', chip: 'bg-gold-100 text-gold-900' },
  gaps: { label: 'Absent or missing', chip: 'bg-navy-100 text-navy-700' },
}

/**
 * The learners across the classes in view whose SBA so far puts the subject
 * at risk, or who have gaps in their marks, worst first -- a list to act on:
 * a word with the learner, a letter home, a catch-up group, a missed task
 * written.
 */
export function AtRiskList(props: {
  classes: OverviewClass[]
  year: number
  members: Map<string, string[]>
  marks: Map<string, Map<string, Map<string, Row>>>
  names: Map<string, string>
  onOpen: (classId: string) => void
  today?: Date
}) {
  const { classes, year, members, marks, names, onOpen } = props
  const today = useMemo(() => props.today ?? new Date(), [props.today])
  const [filter, setFilter] = useState<Filter>('all')

  const rows = useMemo(
    () =>
      classes.flatMap((c) =>
        atRiskLearners(markBookTasks(programmeFor(c.subject_id, c.grade)), c.grade, members.get(c.id) ?? [], marks.get(c.id) ?? new Map(), year, today).map(
          (r) => ({ ...r, cls: c }),
        ),
      ).sort((a, b) => BAND_ORDER[a.band] - BAND_ORDER[b.band] || (a.sba ?? 0) - (b.sba ?? 0)),
    [classes, members, marks, year, today],
  )
  const count = (f: Filter) => (f === 'all' ? rows.length : rows.filter((r) => r.band === f).length)
  const shown = filter === 'all' ? rows : rows.filter((r) => r.band === filter)
  const name = (id: string) => names.get(id) ?? 'A learner'

  const exportCsv = () => {
    const q = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
    const head = ['Learner', 'Class', 'Subject', 'Grade', 'SBA so far %', 'CAPS level', 'Absent', 'Missing', 'Lowest task', 'Lowest %']
    const lines = shown.map((r) =>
      [
        name(r.learnerId),
        r.cls.name,
        getSubject(r.cls.subject_id)?.name ?? r.cls.subject_id,
        String(r.cls.grade),
        r.sba === null ? '' : (Math.round(r.sba * 10) / 10).toString(),
        r.sba === null ? '' : String(capsLevel(r.sba).level),
        String(r.absent),
        String(r.missing),
        r.lowest ? r.lowest.task.title.split(':')[0] : '',
        r.lowest ? (Math.round(r.lowest.percent * 10) / 10).toString() : '',
      ]
        .map(q)
        .join(','),
    )
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `learners-at-risk-${year}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-sm text-navy-600">
        To pass a year, a learner needs at least 30% in a subject (and 40% in three subjects, one of them the home language). These are the
        learners whose SBA so far is below that line or close to it, or who have been absent for a task or are missing a mark for one that is
        overdue.
      </p>

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <div className="flex flex-wrap rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label="Which learners">
          {(['all', 'below-30', '30-39', 'gaps'] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', filter === f ? 'bg-navy-900 text-white' : 'text-navy-600')}
            >
              {f === 'all' ? 'All' : BAND[f].label} <span className="tabular-nums opacity-70">{count(f)}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn-outline btn-sm ml-auto inline-flex items-center gap-1.5" onClick={exportCsv} disabled={!shown.length}>
          <DownloadIcon className="h-4 w-4" /> Export CSV
        </button>
        <button type="button" className="btn-primary btn-sm inline-flex items-center gap-1.5" onClick={() => window.print()} disabled={!shown.length}>
          <PrinterIcon className="h-4 w-4" /> Print
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
          {rows.length === 0 ? 'No learner is below 40% or has a gap in their marks so far.' : 'No learners in this group.'}
        </p>
      ) : (
        <div className="print-area">
          <div className="hidden print:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">DONE WELL® SBA · {year}</p>
            <h2 className="text-base font-bold text-navy-900">Learners at risk{filter === 'all' ? '' : ` · ${BAND[filter].label}`}</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-navy-100">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-navy-50 text-left text-xs text-navy-600">
                  <th className="px-3 py-2 font-semibold">Learner</th>
                  <th className="px-3 py-2 font-semibold">Class</th>
                  <th className="px-3 py-2 text-right font-semibold">SBA so far</th>
                  <th className="px-3 py-2 text-right font-semibold">Absent</th>
                  <th className="px-3 py-2 text-right font-semibold">Missing</th>
                  <th className="px-3 py-2 font-semibold">Lowest task</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={`${r.cls.id}|${r.learnerId}`} className="border-t border-navy-100 align-top">
                    <td className="px-3 py-2">
                      <span className="font-medium text-navy-900">{name(r.learnerId)}</span>
                      <span className={cn('mt-0.5 block w-fit rounded-full px-2 text-[10px] font-semibold', BAND[r.band].chip)}>{BAND[r.band].label}</span>
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => onOpen(r.cls.id)} className="text-left text-navy-800 underline-offset-2 hover:underline print:no-underline">
                        {r.cls.name}
                      </button>
                      <span className="block text-[11px] text-navy-400">
                        {getSubject(r.cls.subject_id)?.name ?? r.cls.subject_id} · Grade {r.cls.grade}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                      <span className="font-semibold text-navy-900">{r.sba === null ? '—' : `${num(r.sba)}%`}</span>
                      {r.sba !== null ? <span className="block text-[11px] text-navy-500">Level {capsLevel(r.sba).level}</span> : null}
                    </td>
                    <td className={cn('px-3 py-2 text-right tabular-nums', r.absent ? 'font-semibold text-rose-700' : 'text-navy-400')}>{r.absent}</td>
                    <td className={cn('px-3 py-2 text-right tabular-nums', r.missing ? 'font-semibold text-rose-700' : 'text-navy-400')}>{r.missing}</td>
                    <td className="px-3 py-2 text-navy-700">
                      {r.lowest ? (
                        <>
                          {r.lowest.task.title.split(':')[0]}
                          <span className="block text-[11px] tabular-nums text-navy-500">
                            T{r.lowest.task.term} · {num(r.lowest.percent)}%
                          </span>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
