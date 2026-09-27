import { Fragment, useMemo, useState } from 'react'
import { subjects } from '@/data/subjects'
import {
  filterResults,
  learnerLevels,
  levelOf,
  LEVEL_NAMES,
  LEVEL_RANGES,
  LEVELS,
  tally,
  termOfDate,
  testTallies,
  type LevelData,
  type LevelResult,
  type LevelSource,
  type Term,
} from '@/lib/levels'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`

/** Fill for a level in a bar, and the chip's colours -- red at the bottom, green at the top. */
const FILL: Record<number, string> = {
  7: 'bg-emerald-700',
  6: 'bg-emerald-500',
  5: 'bg-emerald-300',
  4: 'bg-navy-300',
  3: 'bg-amber-300',
  2: 'bg-rose-300',
  1: 'bg-rose-600',
}
const CHIP: Record<number, string> = {
  7: 'bg-emerald-100 text-emerald-900',
  6: 'bg-emerald-50 text-emerald-800',
  5: 'bg-emerald-50 text-emerald-700',
  4: 'bg-navy-50 text-navy-700',
  3: 'bg-amber-50 text-amber-900',
  2: 'bg-rose-50 text-rose-800',
  1: 'bg-rose-100 text-rose-900',
}

export function LevelChip({ level, className }: { level: number; className?: string }) {
  return (
    <span
      title={`Level ${level}: ${LEVEL_NAMES[level]} (${LEVEL_RANGES[level]})`}
      className={cn('inline-flex min-w-[2.25rem] justify-center rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums', CHIP[level], className)}
    >
      L{level}
    </span>
  )
}

/** A bar split by level, 7 on the left. */
function TallyBar({ counts, total }: { counts: Record<number, number>; total: number }) {
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-navy-100" aria-hidden>
      {total
        ? LEVELS.map((l) => (counts[l] ? <div key={l} className={FILL[l]} style={{ width: `${(counts[l] / total) * 100}%` }} /> : null))
        : null}
    </div>
  )
}

/** Seven cells, 7 down to 1, with how many learners are at each. */
function TallyCells({ counts, compact }: { counts: Record<number, number>; compact?: boolean }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {LEVELS.map((l) => (
        <div key={l} className={cn('rounded-md border border-navy-100 text-center', compact ? 'py-0.5' : 'py-1.5')}>
          <p className="text-[10px] font-semibold text-navy-500">L{l}</p>
          <p className={cn('font-bold tabular-nums', compact ? 'text-sm' : 'text-lg', counts[l] ? 'text-navy-900' : 'text-navy-300')}>{counts[l]}</p>
        </div>
      ))}
    </div>
  )
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy-600">
      {LEVELS.map((l) => (
        <li key={l} className="flex items-center gap-1.5">
          <span className={cn('h-2.5 w-2.5 rounded-sm', FILL[l])} />
          <span className="font-semibold text-navy-800">{l}</span> {LEVEL_NAMES[l]} · {LEVEL_RANGES[l]}
        </li>
      ))}
    </ul>
  )
}

function Segmented<T extends string | number>(props: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label={props.label}>
      {props.options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={props.value === o.value}
          onClick={() => props.onChange(o.value)}
          className={cn('whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-semibold', props.value === o.value ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

const SOURCES: { value: LevelSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All tests' },
  { value: 'weekly', label: 'Weekly tests' },
  { value: 'sba', label: 'SBA tasks' },
]
const PERIODS: { value: Term | 0; label: string }[] = [
  { value: 1, label: 'Term 1' },
  { value: 2, label: 'Term 2' },
  { value: 3, label: 'Term 3' },
  { value: 4, label: 'Term 4' },
  { value: 0, label: 'Year' },
]

/** The term to open on: today's, or the latest one anything has been written in. */
function startingTerm(results: LevelResult[], today: Date): Term | 0 {
  const now = termOfDate(today.toISOString().slice(0, 10))
  if (results.some((r) => r.term === now)) return now
  const latest = Math.max(0, ...results.map((r) => r.term))
  return (latest || now) as Term
}

/**
 * Learners' levels, 1 to 7, over the weekly tests and SBA tasks of a term or
 * the year. `mode` decides what is shown:
 *
 *   learners -- a class teacher's view: each learner in the class with their
 *               result and level on every test, their average and its level.
 *   tally    -- a principal's view: how many learners are at each level, by
 *               subject and grade, then by class and by test. No names: the
 *               tally is the point.
 *   both     -- a head of department's view: the tally for their subject, and
 *               a switch to each learner's level class by class.
 */
export function LevelsView({ data, mode, today = new Date() }: { data: LevelData; mode: 'learners' | 'tally' | 'both'; today?: Date }) {
  const [source, setSource] = useState<LevelSource | 'all'>('all')
  const [show, setShow] = useState<'tally' | 'learners'>(mode === 'learners' ? 'learners' : 'tally')
  const [period, setPeriod] = useState<Term | 0>(() => startingTerm(data.results, today))
  const term = period === 0 ? null : period

  return (
    <div className="space-y-5">
      <section className="card space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented label="Which tests" value={source} options={SOURCES} onChange={setSource} />
          <Segmented label="Period" value={period} options={PERIODS} onChange={setPeriod} />
          {mode === 'both' ? (
            <Segmented
              label="Show"
              value={show}
              options={[
                { value: 'tally', label: 'Counts' },
                { value: 'learners', label: 'Learners' },
              ]}
              onChange={setShow}
            />
          ) : null}
        </div>
        <Legend />
        <p className="text-xs text-navy-500">
          A learner’s level is the level of their average over the tests they wrote {term ? `in Term ${term}` : `in ${data.year}`}. A test they missed or were
          excused from is left out, not counted as nought. Catch-up group reassessments are not included.
        </p>
      </section>

      {show === 'learners' ? <ClassLevels data={data} source={source} term={term} /> : <SchoolTally data={data} source={source} term={term} />}
    </div>
  )
}

// ------------------------------------------------------------- teacher view

function ClassLevels({ data, source, term }: { data: LevelData; source: LevelSource | 'all'; term: Term | null }) {
  const [classId, setClassId] = useState(data.classes[0]?.id ?? '')
  const [sort, setSort] = useState<'name' | 'level'>('name')
  const cls = data.classes.find((c) => c.id === classId)
  const results = useMemo(() => (cls ? filterResults(data.results, { classId: cls.id, term, source }) : []), [data.results, cls, term, source])
  const tests = useMemo(() => testTallies(results).reverse(), [results])
  const levels = useMemo(() => new Map(learnerLevels(results).map((l) => [l.learnerId, l])), [results])

  if (!cls) return <p className="card p-5 text-sm text-navy-600">You have no classes yet. Once a class is set up, its learners’ levels show here.</p>

  const ids = data.members.get(cls.id) ?? []
  const name = (id: string) => data.names.get(id) ?? 'Learner'
  const rows = [...ids].sort((a, b) =>
    sort === 'level' ? (levels.get(b)?.percent ?? -1) - (levels.get(a)?.percent ?? -1) || name(a).localeCompare(name(b)) : name(a).localeCompare(name(b)),
  )
  const counts = tally([...levels.values()].map((l) => l.percent))
  const withLevel = levels.size

  return (
    <section className="card space-y-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="block">
          <span className="text-xs font-semibold text-navy-600">Class</span>
          <select className="input mt-1" value={classId} onChange={(e) => setClassId(e.target.value)}>
            {data.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-navy-600">
          {subjectName(cls.subject_id)} · Grade {cls.grade} · {withLevel} of {ids.length} learners with a level
        </p>
      </div>

      <TallyCells counts={counts} />

      {tests.length === 0 ? (
        <p className="text-sm text-navy-500">No tests written {term ? `in Term ${term}` : 'this year'} yet{source === 'all' ? '' : ' of this kind'}.</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-navy-500">
              {tests.length} {tests.length === 1 ? 'test' : 'tests'}. Hover or tap a level to see its name.
            </p>
            <Segmented
              label="Sort"
              value={sort}
              options={[
                { value: 'name', label: 'By name' },
                { value: 'level', label: 'By level' },
              ]}
              onChange={setSort}
            />
          </div>
          <div className="-mx-4 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-left align-bottom text-xs text-navy-600">
                  <th className="sticky left-0 z-10 bg-white py-2 pl-4 pr-3 font-semibold sm:pl-0">Learner</th>
                  {tests.map((t) => (
                    <th key={`${t.source}|${t.itemId}`} className="max-w-[7rem] px-2 py-2 font-semibold">
                      <span className="line-clamp-2">{t.title}</span>
                      <span className="block font-normal text-navy-400">
                        {t.source === 'sba' ? `SBA · T${t.term}` : t.date ? shortDate(t.date) : `T${t.term}`}
                      </span>
                    </th>
                  ))}
                  <th className="px-2 py-2 font-semibold">Average</th>
                  <th className="py-2 pl-2 pr-4 font-semibold sm:pr-0">Level</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((id) => {
                  const l = levels.get(id)
                  const by = new Map(l?.results.map((r) => [`${r.source}|${r.itemId}`, r]))
                  return (
                    <tr key={id} className="border-b border-navy-100">
                      <td className="sticky left-0 z-10 bg-white py-2 pl-4 pr-3 font-medium text-navy-900 sm:pl-0">{name(id)}</td>
                      {tests.map((t) => {
                        const r = by.get(`${t.source}|${t.itemId}`)
                        return (
                          <td key={`${t.source}|${t.itemId}`} className="px-2 py-2 tabular-nums">
                            {r ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-9 text-right text-navy-700">{Math.round(r.percent)}%</span>
                                <LevelChip level={levelOf(r.percent)} className="min-w-0 px-1 text-[11px] font-semibold" />
                              </span>
                            ) : (
                              <span className="text-navy-300">—</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-2 py-2 font-semibold tabular-nums text-navy-900">{l ? `${l.percent}%` : '—'}</td>
                      <td className="py-2 pl-2 pr-4 sm:pr-0">{l ? <LevelChip level={l.level} /> : <span className="text-xs text-navy-400">No tests</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

// ------------------------------------------------------ principal / HOD view

interface Row {
  key: string
  subjectId: string
  grade: Grade
  learners: number
  counts: Record<number, number>
  average: number
}

function SchoolTally({ data, source, term }: { data: LevelData; source: LevelSource | 'all'; term: Term | null }) {
  const [subjectId, setSubjectId] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const results = useMemo(() => filterResults(data.results, { subjectId: subjectId || undefined, term, source }), [data.results, subjectId, term, source])
  const levels = useMemo(() => learnerLevels(results), [results])
  const inView = [...new Set(data.classes.map((c) => c.subject_id).concat(data.results.map((r) => r.subjectId)))]

  const rows: Row[] = useMemo(() => {
    const groups = new Map<string, typeof levels>()
    for (const l of levels) groups.set(`${l.subjectId}|${l.grade}`, [...(groups.get(`${l.subjectId}|${l.grade}`) ?? []), l])
    return [...groups.entries()]
      .map(([key, ls]) => ({
        key,
        subjectId: ls[0].subjectId,
        grade: ls[0].grade,
        learners: ls.length,
        counts: tally(ls.map((l) => l.percent)),
        average: Math.round(ls.reduce((s, l) => s + l.percent, 0) / ls.length),
      }))
      .sort((a, b) => subjectName(a.subjectId).localeCompare(subjectName(b.subjectId)) || a.grade - b.grade)
  }, [levels])

  const all = tally(levels.map((l) => l.percent))
  const total = levels.length
  const low = all[1] + all[2]

  return (
    <div className="space-y-5">
      <section className="card space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-bold text-navy-900">{subjectId ? subjectName(subjectId) : inView.length > 1 ? 'All subjects' : subjectName(inView[0] ?? '')}</h3>
            <p className="text-sm text-navy-600">
              {total} learner {total === 1 ? 'level' : 'levels'}
              {total ? ` · ${low} at Level 1 or 2 (${Math.round((low / total) * 100)}%)` : ''}
            </p>
          </div>
          {inView.length > 1 ? (
            <label className="block">
              <span className="text-xs font-semibold text-navy-600">Subject</span>
              <select className="input mt-1" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                <option value="">All subjects</option>
                {inView.map((s) => (
                  <option key={s} value={s}>
                    {subjectName(s)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <TallyCells counts={all} />
        <p className="text-xs text-navy-500">A learner who takes two subjects is counted once in each.</p>
      </section>

      {rows.length === 0 ? (
        <p className="card p-5 text-sm text-navy-600">No tests written {term ? `in Term ${term}` : 'this year'} yet{source === 'all' ? '' : ' of this kind'}.</p>
      ) : (
        <section className="card divide-y divide-navy-100">
          {rows.map((r) => {
            const isOpen = open === r.key
            return (
              <Fragment key={r.key}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : r.key)}
                  className="grid w-full gap-2 p-4 text-left hover:bg-navy-50/60 sm:grid-cols-[15rem_1fr_17rem] sm:items-center sm:gap-4 sm:px-5"
                >
                  <span>
                    <span className="block font-semibold text-navy-900">
                      {subjectName(r.subjectId)} · Gr {r.grade}
                    </span>
                    <span className="block text-xs text-navy-500">
                      {r.learners} learners · average {r.average}% <LevelChip level={levelOf(r.average)} className="ml-1 min-w-0 px-1 py-0 text-[10px]" />
                    </span>
                  </span>
                  <TallyBar counts={r.counts} total={r.learners} />
                  <TallyCells counts={r.counts} compact />
                </button>
                {isOpen ? <RowDetail data={data} results={results.filter((x) => x.subjectId === r.subjectId && x.grade === r.grade)} /> : null}
              </Fragment>
            )
          })}
        </section>
      )}
    </div>
  )
}

/** One subject and grade opened up: the tally for each class, then for each test. */
function RowDetail({ data, results }: { data: LevelData; results: LevelResult[] }) {
  const levels = learnerLevels(results)
  const classIds = [...new Set(levels.map((l) => l.classId))]
  const byClass = classIds
    .map((id) => {
      const ls = levels.filter((l) => l.classId === id)
      return { id, name: data.classes.find((c) => c.id === id)?.name ?? 'Not in a class', counts: tally(ls.map((l) => l.percent)), n: ls.length }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
  const tests = testTallies(results)

  return (
    <div className="space-y-5 bg-navy-50/50 p-4 sm:px-5">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-500">By class</h4>
        <ul className="mt-2 space-y-2">
          {byClass.map((c) => (
            <li key={c.id ?? 'none'} className="grid gap-2 sm:grid-cols-[15rem_1fr_17rem] sm:items-center sm:gap-4">
              <span className="text-sm text-navy-800">
                {c.name} <span className="text-navy-500">· {c.n}</span>
              </span>
              <TallyBar counts={c.counts} total={c.n} />
              <TallyCells counts={c.counts} compact />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-500">By test</h4>
        <ul className="mt-2 space-y-2">
          {tests.map((t) => (
            <li key={`${t.source}|${t.itemId}`} className="grid gap-2 sm:grid-cols-[15rem_1fr_17rem] sm:items-center sm:gap-4">
              <span className="text-sm text-navy-800">
                {t.title}
                <span className="block text-xs text-navy-500">
                  {t.source === 'sba' ? `SBA task · Term ${t.term}` : `Weekly test${t.date ? ` · ${shortDate(t.date)}` : ''}`} · {t.written} wrote · average{' '}
                  {t.average}%
                </span>
              </span>
              <TallyBar counts={t.counts} total={t.written} />
              <TallyCells counts={t.counts} compact />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
