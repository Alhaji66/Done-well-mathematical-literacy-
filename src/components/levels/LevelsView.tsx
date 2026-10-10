import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { subjects } from '@/data/subjects'
import { atpFor } from '@/data/atp'
import { getTopic } from '@/data/topics'
import {
  filterResults,
  earlyWarnings,
  learnerLevels,
  levelMovement,
  startingTerm,
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
import { LevelChip, LEVEL_FILL } from '@/components/levels/LevelChip'
import { EarlyWarningPanel } from '@/components/levels/EarlyWarningPanel'
import { CatchUpGroupForm, type StartGroupInput } from '@/components/levels/CatchUpGroupForm'
import { downloadCsv } from '@/lib/csv'
import { printPart } from '@/lib/print'
import { DownloadIcon, PrinterIcon } from '@/components/ui/Icons'
import type { Grade } from '@/types'

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`
const periodLabel = (term: Term | null, year: number) => (term ? `Term ${term} ${year}` : `${year}`)
const sourceLabel = (source: LevelSource | 'all') =>
  source === 'all' ? 'weekly tests, papers and SBA tasks' : source === 'weekly' ? 'weekly tests' : source === 'paper' ? 'papers and class work' : 'SBA tasks'
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const testHeading = (t: { source: LevelSource; title: string; date: string | null; term: Term }) =>
  `${t.title} (${t.source === 'sba' ? `SBA, T${t.term}` : t.date ? shortDate(t.date) : `T${t.term}`})`

/** Print and download buttons, side by side. */
function ExportButtons({ onPrint, onCsv, printLabel }: { onPrint: () => void; onCsv: () => void; printLabel: string }) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" className="btn-outline btn-sm inline-flex items-center gap-1.5" onClick={onPrint}>
        <PrinterIcon className="h-4 w-4" /> {printLabel}
      </button>
      <button type="button" className="btn-outline btn-sm inline-flex items-center gap-1.5" onClick={onCsv}>
        <DownloadIcon className="h-4 w-4" /> Download CSV
      </button>
    </div>
  )
}

/** The level key printed under each table, with the rule a level follows. */
function PrintedKey() {
  return (
    <p className="mt-3 text-[10px] text-navy-500">
      Levels: {LEVELS.map((l) => `${l} ${LEVEL_NAMES[l]} (${LEVEL_RANGES[l]})`).join(' · ')}. A learner’s level is the level of their average over the tests
      they wrote; a missed or excused test is left out.
    </p>
  )
}

const FILL = LEVEL_FILL
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
  { value: 'paper', label: 'Papers & class work' },
  { value: 'sba', label: 'SBA tasks' },
]
const PERIODS: { value: Term | 0; label: string }[] = [
  { value: 1, label: 'Term 1' },
  { value: 2, label: 'Term 2' },
  { value: 3, label: 'Term 3' },
  { value: 4, label: 'Term 4' },
  { value: 0, label: 'Year' },
]


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
export interface StartGroup {
  /** Start a catch-up group for some learners in one class; resolves to an error message, if any. */
  onStartGroup?: (input: StartGroupInput) => Promise<string | undefined>
  /** Where the catch-up groups are, shown once one has been started. */
  groupsLink?: ReactNode
}

export function LevelsView({
  data,
  mode,
  today = new Date(),
  onStartGroup,
  groupsLink,
}: { data: LevelData; mode: 'learners' | 'tally' | 'both'; today?: Date } & StartGroup) {
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

      {show === 'learners' ? (
        <ClassLevels data={data} source={source} term={term} today={today} onStartGroup={onStartGroup} groupsLink={groupsLink} />
      ) : (
        <SchoolTally data={data} source={source} term={term} today={today} />
      )}
    </div>
  )
}

// ------------------------------------------------------------- teacher view

function ClassLevels({
  data,
  source,
  term,
  today,
  onStartGroup,
  groupsLink,
}: { data: LevelData; source: LevelSource | 'all'; term: Term | null; today: Date } & StartGroup) {
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
    <>
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
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="text-sm text-navy-600">
              {subjectName(cls.subject_id)} · Grade {cls.grade} · {withLevel} of {ids.length} learners with a level
            </p>
            <ExportButtons
              printLabel="Print class list"
              onPrint={() => printPart('levels')}
              onCsv={() =>
                downloadCsv(
                  `levels-${slug(cls.name)}-${slug(periodLabel(term, data.year))}.csv`,
                  ['Learner', ...tests.map(testHeading), 'Average %', 'Level', 'Level name'],
                  rows.map((id) => {
                    const l = levels.get(id)
                    const by = new Map(l?.results.map((r) => [`${r.source}|${r.itemId}`, r]))
                    return [
                      name(id),
                      ...tests.map((t) => {
                        const r = by.get(`${t.source}|${t.itemId}`)
                        return r ? Math.round(r.percent) : null
                      }),
                      l ? l.percent : null,
                      l ? l.level : null,
                      l ? LEVEL_NAMES[l.level] : 'No tests',
                    ]
                  }),
                )
              }
            />
          </div>
        </div>

        <TallyCells counts={counts} />
      </section>

      <EarlyWarningPanel key={cls.id} data={data} cls={cls} today={today} name={name} onStartGroup={onStartGroup} groupsLink={groupsLink} />

      <section className="card space-y-4 p-4 sm:p-5">

        {tests.length === 0 ? (
          <p className="text-sm text-navy-500">
            No tests written {term ? `in Term ${term}` : 'this year'} yet
            {source === 'all' ? '' : ' of this kind'}.
          </p>
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
                        <td className="py-2 pl-2 pr-4 sm:pr-0">
                          {l ? <LevelChip level={l.level} /> : <span className="text-xs text-navy-400">No tests</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
      {term && term > 1 ? (
        <MovementPanel
          key={`${cls.id}|${term}|${source}`}
          data={data}
          cls={cls}
          term={term}
          source={source}
          name={name}
          onStartGroup={onStartGroup}
          groupsLink={groupsLink}
        />
      ) : null}
      <div className="levels-print print-area hidden text-[11px] text-navy-900 print:block">
        <div className="flex items-start justify-between gap-4">
          <p className="font-bold">{data.school ?? ''}</p>
          <p>{periodLabel(term, data.year)}</p>
        </div>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-gold-700">Learner levels</p>
        <h2 className="text-lg font-bold">{cls.name}</h2>
        <p className="text-navy-600">
          {subjectName(cls.subject_id)} · Grade {cls.grade} · from {sourceLabel(source)}
        </p>
        <table className="mt-3 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-navy-300 text-left align-bottom">
              <th className="py-1 pr-2 font-semibold">Learner</th>
              {tests.length <= 8
                ? tests.map((t) => (
                    <th key={`${t.source}|${t.itemId}`} className="px-1 py-1 text-right font-semibold">
                      {testHeading(t)}
                    </th>
                  ))
                : null}
              <th className="px-1 py-1 text-right font-semibold">Average</th>
              <th className="py-1 pl-1 text-right font-semibold">Level</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((id) => {
              const l = levels.get(id)
              const by = new Map(l?.results.map((r) => [`${r.source}|${r.itemId}`, r]))
              return (
                <tr key={id} className="border-b border-navy-100">
                  <td className="whitespace-nowrap py-1 pr-2">{name(id)}</td>
                  {tests.length <= 8
                    ? tests.map((t) => {
                        const r = by.get(`${t.source}|${t.itemId}`)
                        return (
                          <td key={`${t.source}|${t.itemId}`} className="px-1 py-1 text-right tabular-nums">
                            {r ? `${Math.round(r.percent)}%` : '—'}
                          </td>
                        )
                      })
                    : null}
                  <td className="px-1 py-1 text-right font-semibold tabular-nums">{l ? `${l.percent}%` : '—'}</td>
                  <td className="whitespace-nowrap py-1 pl-1 text-right">{l ? `${l.level} ${LEVEL_NAMES[l.level]}` : 'No tests'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="mt-3">Learners at each level: {LEVELS.map((l) => `L${l}: ${counts[l]}`).join(' · ')}</p>
        <PrintedKey />
        <div className="mt-8 grid grid-cols-2 gap-6">
          {['Teacher', 'HOD'].map((who) => (
            <div key={who}>
              <div className="h-8 border-b border-navy-400" />
              <p className="mt-1 text-navy-600">{who} · signature and date</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------- level movement

/**
 * Since the term before: how many learners in the class moved down, up or
 * stayed at the same level, and who moved down -- with a catch-up group one
 * step away for the ones the teacher picks.
 */
function MovementPanel({
  data,
  cls,
  term,
  source,
  name,
  onStartGroup,
  groupsLink,
}: {
  data: LevelData
  cls: LevelData['classes'][number]
  term: Term
  source: LevelSource | 'all'
  name: (id: string) => string
} & StartGroup) {
  const moves = useMemo(() => levelMovement(data.results, term, { classId: cls.id, source }), [data.results, term, cls.id, source])
  const down = moves.filter((m) => m.to < m.from).sort((a, b) => a.to - a.from - (b.to - b.from) || a.after - b.after)
  const up = moves.filter((m) => m.to > m.from).length
  const same = moves.length - down.length - up
  const [picked, setPicked] = useState<Set<string>>(() => new Set(down.map((m) => m.learnerId)))
  const termTopics = [...new Set((atpFor(cls.subject_id, cls.grade)?.weeks ?? []).filter((w) => w.term === term && w.topicId).map((w) => w.topicId!))]
  const allTopics = [...new Set((atpFor(cls.subject_id, cls.grade)?.weeks ?? []).map((w) => w.topicId).filter((x): x is string => !!x))]
  const topics = [...termTopics.map((id) => ({ id, note: `Term ${term}` })), ...allTopics.filter((t) => !termTopics.includes(t)).map((id) => ({ id }))]
  const chosen = down.filter((m) => picked.has(m.learnerId))

  if (!moves.length) return null

  return (
    <section className="card space-y-3 p-4 sm:p-5 print:hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-navy-900">Since Term {term - 1}</h3>
        <p className="text-sm text-navy-600">
          <span className={cn('font-semibold', down.length ? 'text-rose-700' : 'text-navy-500')}>▼ {down.length} down</span> ·{' '}
          <span className={cn('font-semibold', up ? 'text-emerald-700' : 'text-navy-500')}>▲ {up} up</span> · {same} the same
        </p>
      </div>
      <p className="text-xs text-navy-500">Compares each learner’s level in Term {term} with Term {term - 1}, for learners with tests in both terms.</p>

      {down.length ? (
        <>
          <ul className="divide-y divide-navy-100">
            {down.map((m) => (
              <li key={m.learnerId} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                {onStartGroup ? (
                  <input
                    type="checkbox"
                    aria-label={`Choose ${name(m.learnerId)}`}
                    checked={picked.has(m.learnerId)}
                    onChange={() =>
                      setPicked((p) => {
                        const next = new Set(p)
                        if (next.has(m.learnerId)) next.delete(m.learnerId)
                        else next.add(m.learnerId)
                        return next
                      })
                    }
                  />
                ) : null}
                <span className="min-w-[10rem] flex-1 text-sm font-medium text-navy-900">{name(m.learnerId)}</span>
                <span className="flex items-center gap-1.5 text-sm tabular-nums text-navy-600">
                  <LevelChip level={m.from} /> → <LevelChip level={m.to} />
                  <span className="w-24 text-xs">
                    {m.before}% → {m.after}%
                  </span>
                  <span className="w-8 text-right text-xs font-semibold text-rose-700">▼{m.from - m.to}</span>
                </span>
              </li>
            ))}
          </ul>
          {onStartGroup ? (
            <CatchUpGroupForm
              classId={cls.id}
              chosen={chosen.map((m) => ({ id: m.learnerId, baseline: m.after }))}
              topics={topics}
              planFor={(topic) => `Levels dropped since Term ${term - 1}: re-teach ${topic} in small steps, practise together, then set a reassessment.`}
              baselineNote={`Each learner’s Term ${term} average is kept as their starting point, to measure the group against.`}
              onStartGroup={onStartGroup}
              groupsLink={groupsLink}
            />
          ) : null}
        </>
      ) : (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">No learner in this class has dropped a level since Term {term - 1}.</p>
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

function SchoolTally({ data, source, term, today }: { data: LevelData; source: LevelSource | 'all'; term: Term | null; today: Date }) {
  const [subjectId, setSubjectId] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const results = useMemo(
    () =>
      filterResults(data.results, {
        subjectId: subjectId || undefined,
        term,
        source,
      }),
    [data.results, subjectId, term, source],
  )
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

  // Learners flagged by their recent tests, as a count only.
  const warned = useMemo(() => earlyWarnings(data.results, { subjectId: subjectId || undefined }, today).length, [data.results, subjectId, today])

  // Movement since the term before, as counts only.
  const moves = useMemo(() => {
    if (!term || term === 1) return null
    const m = levelMovement(data.results, term, { subjectId: subjectId || undefined, source })
    return m.length ? { up: m.filter((x) => x.to > x.from).length, down: m.filter((x) => x.to < x.from).length } : null
  }, [data.results, term, subjectId, source])

  // The printed schedule and the CSV: each subject and grade, then its classes.
  const scheduleRows = rows.flatMap((r) => [
    {
      subjectId: r.subjectId,
      grade: r.grade,
      className: '',
      n: r.learners,
      counts: r.counts,
      average: r.average,
    },
    ...classTallies(
      data,
      results.filter((x) => x.subjectId === r.subjectId && x.grade === r.grade),
    ).map((c) => ({
      subjectId: r.subjectId,
      grade: r.grade,
      className: c.name,
      n: c.n,
      counts: c.counts,
      average: c.average,
    })),
  ])

  return (
    <div className="space-y-5">
      <section className="card space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-bold text-navy-900">
              {subjectId ? subjectName(subjectId) : inView.length > 1 ? 'All subjects' : subjectName(inView[0] ?? '')}
            </h3>
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-navy-500">
            A learner who takes two subjects is counted once in each.
            {moves ? ` Since Term ${term! - 1}: ${moves.up} moved up a level or more, ${moves.down} moved down.` : ''}
          </p>
          <p className={cn('w-full text-sm font-semibold', warned ? 'text-rose-700' : 'text-navy-500')}>
            Early warning: {warned} learner{warned === 1 ? '' : 's'} flagged by their recent weekly tests, topic tests and monthly checks
            {warned ? '; their teachers see who they are.' : '.'}
          </p>
          {rows.length ? (
            <ExportButtons
              printLabel="Print schedule"
              onPrint={() => printPart('levels')}
              onCsv={() =>
                downloadCsv(
                  `levels-schedule-${slug(periodLabel(term, data.year))}.csv`,
                  ['Subject', 'Grade', 'Class', 'Learners', ...LEVELS.map((l) => `Level ${l}`), 'Level 1-2 %', 'Average %'],
                  scheduleRows.map((r) => [
                    subjectName(r.subjectId),
                    r.grade,
                    r.className,
                    r.n,
                    ...LEVELS.map((l) => r.counts[l]),
                    r.n ? Math.round(((r.counts[1] + r.counts[2]) / r.n) * 100) : null,
                    r.average,
                  ]),
                )
              }
            />
          ) : null}
        </div>
      </section>

      <div className="levels-print print-area hidden text-[11px] text-navy-900 print:block">
        <div className="flex items-start justify-between gap-4">
          <p className="font-bold">{data.school ?? ''}</p>
          <p>{periodLabel(term, data.year)}</p>
        </div>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-gold-700">Schedule of learner levels</p>
        <h2 className="text-lg font-bold">{subjectId ? subjectName(subjectId) : 'All subjects'}</h2>
        <p className="text-navy-600">
          From {sourceLabel(source)} · {total} learner {total === 1 ? 'level' : 'levels'}
          {total ? ` · ${low} at Level 1 or 2 (${Math.round((low / total) * 100)}%)` : ''}
        </p>
        <table className="mt-3 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-navy-300 text-left align-bottom">
              <th className="py-1 pr-2 font-semibold">Subject and class</th>
              <th className="px-1 py-1 text-right font-semibold">Learners</th>
              {LEVELS.map((l) => (
                <th key={l} className="px-1 py-1 text-right font-semibold">
                  L{l}
                </th>
              ))}
              <th className="px-1 py-1 text-right font-semibold">L1–2</th>
              <th className="py-1 pl-1 text-right font-semibold">Average</th>
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((r) => (
              <tr key={`${r.subjectId}|${r.grade}|${r.className}`} className={cn('border-b border-navy-100', r.className ? '' : 'bg-navy-50 font-semibold')}>
                <td className={cn('py-1 pr-2', r.className ? 'pl-4' : '')}>{r.className || `${subjectName(r.subjectId)} · Grade ${r.grade}`}</td>
                <td className="px-1 py-1 text-right tabular-nums">{r.n}</td>
                {LEVELS.map((l) => (
                  <td key={l} className="px-1 py-1 text-right tabular-nums">
                    {r.counts[l]}
                  </td>
                ))}
                <td className="px-1 py-1 text-right tabular-nums">{r.n ? `${Math.round(((r.counts[1] + r.counts[2]) / r.n) * 100)}%` : '—'}</td>
                <td className="py-1 pl-1 text-right tabular-nums">{r.average}%</td>
              </tr>
            ))}
            <tr className="border-t-2 border-navy-300 font-bold">
              <td className="py-1 pr-2">Total</td>
              <td className="px-1 py-1 text-right tabular-nums">{total}</td>
              {LEVELS.map((l) => (
                <td key={l} className="px-1 py-1 text-right tabular-nums">
                  {all[l]}
                </td>
              ))}
              <td className="px-1 py-1 text-right tabular-nums">{total ? `${Math.round((low / total) * 100)}%` : '—'}</td>
              <td className="py-1 pl-1" />
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-[10px] text-navy-500">A learner who takes two subjects is counted once in each.</p>
        <PrintedKey />
        <div className="mt-8 grid grid-cols-2 gap-6">
          {['Principal', 'Date'].map((who) => (
            <div key={who}>
              <div className="h-8 border-b border-navy-400" />
              <p className="mt-1 text-navy-600">{who}</p>
            </div>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="card p-5 text-sm text-navy-600">
          No tests written {term ? `in Term ${term}` : 'this year'} yet
          {source === 'all' ? '' : ' of this kind'}.
        </p>
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

/** The tally for each class among some results, by class name. */
function classTallies(data: LevelData, results: LevelResult[]) {
  const levels = learnerLevels(results)
  return [...new Set(levels.map((l) => l.classId))]
    .map((id) => {
      const ls = levels.filter((l) => l.classId === id)
      return {
        id,
        name: data.classes.find((c) => c.id === id)?.name ?? 'Not in a class',
        counts: tally(ls.map((l) => l.percent)),
        n: ls.length,
        average: Math.round(ls.reduce((s, l) => s + l.percent, 0) / ls.length),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** One subject and grade opened up: the tally for each class, then for each test. */
function RowDetail({ data, results }: { data: LevelData; results: LevelResult[] }) {
  const byClass = classTallies(data, results)
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
                  {t.source === 'sba' ? `SBA task · Term ${t.term}` : `${t.source === 'paper' ? (t.itemId.startsWith('cw:') ? 'Class work' : 'Paper') : 'Weekly test'}${t.date ? ` · ${shortDate(t.date)}` : ''}`} · {t.written} wrote · average{' '}
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
