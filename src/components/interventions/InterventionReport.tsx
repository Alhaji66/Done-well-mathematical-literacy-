import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { downloadCsv } from '@/lib/csv'
import { levelOf } from '@/lib/levels'
import { impactTotals, signed, type ImpactGroup } from '@/lib/catchUpImpact'
import { ImpactTable, Tiles, VIEW_LABEL, type View } from '@/components/interventions/CatchUpImpact'
import { DownloadIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

export interface Flagged {
  learnerId: string
  subjectId: string
  grade: number
  classId: string | null
}

const STATUS: Record<ImpactGroup['status'], string> = { active: 'Running', completed: 'Completed', cancelled: 'Cancelled' }
const subjectName = (id: string) => getSubject(id)?.name ?? id
const topicName = (id: string) => getTopic(id)?.name ?? id
const day = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })

/**
 * The intervention report for a term or the year, for a principal to take to
 * an SMT or district meeting, an HOD to file for the department, or a
 * teacher to keep: who the early warnings flagged, who was helped in a
 * catch-up group, whether it worked, and who still needs help next term. It
 * prints on its own (the browser's print, which also saves a PDF), and the
 * list of groups downloads as CSV.
 *
 * Learners are named for teachers and HODs; a principal sees counts, as on
 * the Levels page.
 */
export function InterventionReport({
  school,
  scopeLabel,
  period,
  groups: all,
  flagged,
  named,
  learnerName,
  teacherName,
  className,
  views,
  csvName,
}: {
  school: string
  scopeLabel: string
  period: string
  groups: ImpactGroup[]
  flagged: Flagged[]
  named: boolean
  learnerName: (id: string) => string
  teacherName: (id: string | null) => string
  /** A class's name, or the grade and subject where a group or learner has no class. */
  className: (classId: string | null | undefined, grade: number, subjectId: string) => string
  views: View[]
  csvName: string
}) {
  const groups = all.filter((g) => g.status !== 'cancelled')
  const t = impactTotals(groups)
  const produced = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })

  // From early warning to catch-up: which flagged learners were then placed in a group in the same subject.
  const placed = new Map<string, ImpactGroup['outcomes'][number]>()
  for (const g of groups) for (const o of g.outcomes) placed.set(`${o.learnerId}|${g.subjectId}`, o)
  const flaggedPlaced = flagged.filter((f) => placed.has(`${f.learnerId}|${f.subjectId}`))
  const flaggedImproved = flaggedPlaced.filter((f) => {
    const o = placed.get(`${f.learnerId}|${f.subjectId}`)!
    return o.baseline !== null && o.latest !== null && o.latest > o.baseline
  })
  const flaggedReassessed = flaggedPlaced.filter((f) => {
    const o = placed.get(`${f.learnerId}|${f.subjectId}`)!
    return o.baseline !== null && o.latest !== null
  })
  const notPlaced = flagged.filter((f) => !placed.has(`${f.learnerId}|${f.subjectId}`))

  // Reassessed, and still below Level 4: the ones to carry into next term.
  const stillBelow = groups.flatMap((g) =>
    g.outcomes.filter((o) => o.baseline !== null && o.latest !== null && levelOf(o.latest) < 4).map((o) => ({ g, o })),
  )

  const sorted = [...groups].sort((a, b) => a.subjectId.localeCompare(b.subjectId) || a.createdAt.localeCompare(b.createdAt))

  return (
    <div className="print-area card space-y-6 p-6">
      <header className="border-b border-navy-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">DONE WELL · {school || 'Your school'}</p>
        <h2 className="mt-1 text-xl font-bold text-navy-900">Intervention report · {period}</h2>
        <p className="mt-0.5 text-sm text-navy-600">
          {scopeLabel} · produced {produced}
        </p>
      </header>

      <section className="space-y-2 print-avoid-break">
        <h3 className="font-bold text-navy-900">From early warning to catch-up</h3>
        <ol className="grid gap-2 sm:grid-cols-4">
          {[
            { n: flagged.length, label: 'learners flagged by an early warning', tone: 'text-rose-700' },
            { n: flaggedPlaced.length, label: 'of them placed in a catch-up group', tone: 'text-navy-900' },
            { n: flaggedImproved.length, label: `improved when reassessed, of ${flaggedReassessed.length} reassessed so far`, tone: 'text-emerald-700' },
            { n: notPlaced.length, label: 'flagged and not yet in a group', tone: notPlaced.length ? 'text-amber-700' : 'text-navy-900' },
          ].map((s) => (
            <li key={s.label} className="rounded-lg border border-navy-100 p-3">
              <p className={cn('text-2xl font-bold tabular-nums', s.tone)}>{s.n}</p>
              <p className="text-xs text-navy-600">{s.label}</p>
            </li>
          ))}
        </ol>
        <p className="text-xs text-navy-500">
          A learner is flagged for a weekly test, topic test or monthly check below 40%, or a fall in CAPS level to Level 4 or below, or of two
          levels or more, since their previous test.
        </p>
      </section>

      <section className="space-y-3 print-avoid-break">
        <h3 className="font-bold text-navy-900">Did the catch-up groups work?</h3>
        {groups.length === 0 ? (
          <p className="text-sm text-navy-600">No catch-up group was started in this period.</p>
        ) : t.measured === 0 ? (
          <p className="text-sm text-navy-600">
            {groups.length} group{groups.length === 1 ? '' : 's'} started, with {t.learners} learner{t.learners === 1 ? '' : 's'}; none has
            been reassessed yet.
          </p>
        ) : (
          <Tiles t={t} />
        )}
      </section>

      {t.measured > 0
        ? views.map((v) => (
            <section key={v} className="space-y-2 print-avoid-break">
              <h3 className="font-bold text-navy-900">{VIEW_LABEL[v]}</h3>
              <ImpactTable groups={groups} view={v} teacherName={teacherName} />
            </section>
          ))
        : null}

      {groups.length ? (
        <section className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 break-after-avoid">
            <h3 className="font-bold text-navy-900">The groups</h3>
            <button
              type="button"
              onClick={() =>
                downloadCsv(
                  csvName,
                  ['Subject', 'Grade', 'Class', 'Topic', 'Teacher', 'Started', 'Status', 'Learners', 'Reassessed', 'Improved', 'Up a level', 'Average change'],
                  sorted.map((g) => {
                    const r = impactTotals([g])
                    return [
                      subjectName(g.subjectId),
                      g.grade,
                      className(g.classId, g.grade, g.subjectId),
                      topicName(g.topicId),
                      teacherName(g.createdBy),
                      g.createdAt.slice(0, 10),
                      STATUS[g.status],
                      r.learners,
                      r.measured,
                      r.improved,
                      r.movedUp,
                      r.averageChange,
                    ]
                  }),
                )
              }
              className="btn-outline btn-sm inline-flex items-center gap-1.5 print:hidden"
            >
              <DownloadIcon className="h-4 w-4" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full min-w-[40rem] text-sm print:min-w-0 print:text-xs">
              <thead>
                <tr className="border-b border-navy-200 text-left text-xs text-navy-500">
                  <th className="py-2 font-medium">Topic</th>
                  <th className="py-2 font-medium">Class</th>
                  <th className="py-2 font-medium">Teacher</th>
                  <th className="py-2 font-medium">Started</th>
                  <th className="py-2 text-right font-medium">Learners</th>
                  <th className="py-2 pl-2 text-right font-medium">Improved</th>
                  <th className="py-2 pl-2 text-right font-medium">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 tabular-nums">
                {sorted.map((g) => ({ g, r: impactTotals([g]) })).map(({ g, r }) => (
                  <tr key={g.id} className="print-avoid-break">
                    <td className="py-1.5 pr-2 text-navy-900">
                      {topicName(g.topicId)}
                      {g.status === 'active' ? <span className="ml-1.5 text-[11px] font-semibold text-gold-800">running</span> : null}
                    </td>
                    <td className="py-1.5 pr-2 text-navy-700">{className(g.classId, g.grade, g.subjectId)}</td>
                    <td className="py-1.5 pr-2 text-navy-700">{teacherName(g.createdBy)}</td>
                    <td className="whitespace-nowrap py-1.5 pr-2 text-navy-700">{day(g.createdAt)}</td>
                    <td className="py-1.5 text-right text-navy-700">{r.learners}</td>
                    <td className="py-1.5 text-right text-navy-700">{r.measured ? `${r.improved} of ${r.measured}` : 'not yet'}</td>
                    <td
                      className={cn(
                        'py-1.5 text-right font-semibold',
                        r.averageChange === null ? 'text-navy-400' : r.averageChange > 0 ? 'text-emerald-700' : r.averageChange < 0 ? 'text-rose-700' : 'text-navy-600',
                      )}
                    >
                      {r.averageChange === null ? '—' : signed(r.averageChange)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="space-y-2 print-avoid-break">
        <h3 className="font-bold text-navy-900">Still to help next term</h3>
        {stillBelow.length === 0 && notPlaced.length === 0 ? (
          <p className="text-sm text-navy-600">Every flagged learner was placed in a group, and every learner reassessed reached Level 4.</p>
        ) : (
          <>
            <p className="text-sm text-navy-700">
              {stillBelow.length} learner{stillBelow.length === 1 ? ' was' : 's were'} reassessed and {stillBelow.length === 1 ? 'is' : 'are'} still
              below Level 4 (50%), and {notPlaced.length} flagged learner{notPlaced.length === 1 ? ' is' : 's are'} not yet in a group.
            </p>
            {named && stillBelow.length ? (
              <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {stillBelow.map(({ g, o }) => (
                  <li key={`${g.id}|${o.learnerId}`} className="flex justify-between gap-3 border-b border-navy-50 py-1">
                    <span className="text-navy-900">
                      {learnerName(o.learnerId)}{' '}
                      <span className="text-xs text-navy-500">
                        · {className(g.classId, g.grade, g.subjectId)} · {topicName(g.topicId)}
                      </span>
                    </span>
                    <span className="tabular-nums text-navy-700">
                      {o.baseline}% → {o.latest}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            {named && notPlaced.length ? (
              <p className="text-sm text-navy-700">
                <span className="font-semibold">Flagged, not yet in a group:</span>{' '}
                {notPlaced
                  .map((f) => `${learnerName(f.learnerId)} (${className(f.classId, f.grade, f.subjectId)})`)
                  .sort((a, b) => a.localeCompare(b))
                  .join(', ')}
                .
              </p>
            ) : null}
          </>
        )}
      </section>

      <section className="space-y-4 border-t border-navy-200 pt-4 text-sm text-navy-700 print-avoid-break">
        <p>
          Comments: <span className="inline-block w-full border-b border-dotted border-navy-300 pt-6" />
          <span className="inline-block w-full border-b border-dotted border-navy-300 pt-6" />
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {['Head of department', 'Principal', 'Date'].map((who) => (
            <p key={who}>
              <span className="block border-b border-navy-400 pt-8" />
              <span className="text-xs text-navy-500">{who}</span>
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}
