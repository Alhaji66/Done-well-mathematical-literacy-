import { useMemo, useState, type ReactNode } from 'react'
import { atpFor } from '@/data/atp'
import { earlyWarnings, levelOf, type EarlyWarning, type LevelClass, type LevelData, type WarningReason } from '@/lib/levels'
import { TEST_KIND_LABEL } from '@/lib/testKinds'
import { LevelChip, LEVEL_FILL } from '@/components/levels/LevelChip'
import { CatchUpGroupForm, type StartGroupInput } from '@/components/levels/CatchUpGroupForm'
import { AlertIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`

function reasonText(w: EarlyWarning, r: WarningReason): string {
  switch (r) {
    case 'below_40':
      return `Below 40% · ${Math.round(w.latest.percent)}%`
    case 'dropped':
      return `L${levelOf(w.previous!.percent)} → L${levelOf(w.latest.percent)} since the last test`
    case 'month_drop':
      return `This month ${w.month!.now}%, last month ${w.month!.before}%`
    case 'falling':
      return 'Down three tests in a row'
  }
}

/** The learner's recent tests as small bars, oldest on the left. */
function Spark({ w }: { w: EarlyWarning }) {
  return (
    <span className="flex h-7 items-end gap-0.5" aria-label={`Recent tests: ${w.recent.map((r) => `${Math.round(r.percent)}%`).join(', ')}`}>
      {w.recent.map((r) => (
        <span
          key={r.itemId}
          title={`${r.title}: ${Math.round(r.percent)}%`}
          className={cn('w-2 rounded-sm', LEVEL_FILL[levelOf(r.percent)])}
          style={{ height: `${Math.max(8, r.percent)}%` }}
        />
      ))}
    </span>
  )
}

/**
 * Early warning for one class: learners whose recent weekly tests, topic
 * tests or monthly checks show trouble, found test by test instead of at the
 * end of the term -- with a catch-up group on the topic they slipped on one
 * step away.
 */
export function EarlyWarningPanel({
  data,
  cls,
  today,
  name,
  onStartGroup,
  groupsLink,
}: {
  data: LevelData
  cls: LevelClass
  today: Date
  name: (id: string) => string
  onStartGroup?: (input: StartGroupInput) => Promise<string | undefined>
  groupsLink?: ReactNode
}) {
  const warnings = useMemo(() => earlyWarnings(data.results, { classId: cls.id }, today), [data.results, cls.id, today])
  const [picked, setPicked] = useState<Set<string>>(() => new Set(warnings.map((w) => w.learnerId)))
  const chosen = warnings.filter((w) => picked.has(w.learnerId))
  const hasTests = data.results.some((r) => r.source === 'weekly' && r.classId === cls.id)

  // The topics the chosen learners last slipped on come first, then the rest of the ATP.
  const hits = new Map<string, number>()
  for (const w of chosen) for (const t of w.latest.topicIds ?? []) hits.set(t, (hits.get(t) ?? 0) + 1)
  const atpTopics = [...new Set((atpFor(cls.subject_id, cls.grade)?.weeks ?? []).map((w) => w.topicId).filter((x): x is string => !!x))]
  const topics = [
    ...[...hits.entries()].sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, note: `in the last test of ${n} learner${n === 1 ? '' : 's'}` })),
    ...atpTopics.filter((id) => !hits.has(id)).map((id) => ({ id })),
  ]

  return (
    <section className={cn('card space-y-3 p-4 sm:p-5 print:hidden', warnings.length ? 'border-rose-200' : '')}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 font-bold text-navy-900">
          <AlertIcon className={cn('h-5 w-5', warnings.length ? 'text-rose-600' : 'text-navy-400')} /> Early warning
        </h3>
        <p className={cn('text-sm font-semibold', warnings.length ? 'text-rose-700' : 'text-navy-500')}>
          {warnings.length} learner{warnings.length === 1 ? '' : 's'} to catch now
        </p>
      </div>
      <p className="text-xs text-navy-500">
        After every weekly test, topic test and monthly check, not at the end of the term. A learner is flagged for a result below 40%, a fall in
        level since their previous test, a month a level below the one before, or three falling tests in a row, where the fall lands at Level 4 or
        below or is two levels or more.
      </p>

      {!hasTests ? (
        <p className="rounded-lg bg-navy-50 p-3 text-sm text-navy-700">Set a weekly test, topic test or monthly check for this class, and warnings appear here as learners hand them in.</p>
      ) : warnings.length === 0 ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">No learner in this class needs a warning from their recent tests.</p>
      ) : (
        <>
          <ul className="divide-y divide-navy-100">
            {warnings.map((w) => (
              <li key={w.learnerId} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5">
                {onStartGroup ? (
                  <input
                    type="checkbox"
                    aria-label={`Choose ${name(w.learnerId)}`}
                    checked={picked.has(w.learnerId)}
                    onChange={() =>
                      setPicked((p) => {
                        const next = new Set(p)
                        if (next.has(w.learnerId)) next.delete(w.learnerId)
                        else next.add(w.learnerId)
                        return next
                      })
                    }
                  />
                ) : null}
                <span className="min-w-[10rem] flex-1">
                  <span className="block text-sm font-medium text-navy-900">{name(w.learnerId)}</span>
                  <span className="block text-xs text-navy-500">
                    {w.latest.title.startsWith(TEST_KIND_LABEL[w.latest.kind ?? 'weekly']) ? '' : `${TEST_KIND_LABEL[w.latest.kind ?? 'weekly']} · `}
                    {w.latest.title} · {shortDate(w.latest.date!)}
                  </span>
                </span>
                <Spark w={w} />
                <LevelChip level={levelOf(w.latest.percent)} />
                <span className="flex w-full flex-wrap gap-1.5 sm:w-auto">
                  {w.reasons.map((r) => (
                    <span key={r} className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                      {reasonText(w, r)}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          {onStartGroup ? (
            <CatchUpGroupForm
              key={cls.id}
              classId={cls.id}
              chosen={chosen.map((w) => ({ id: w.learnerId, baseline: Math.round(w.latest.percent) }))}
              topics={topics}
              planFor={(topic) => `Early warning from recent tests: re-teach ${topic} in small steps, practise together, then set a short reassessment.`}
              baselineNote="Each learner’s latest test result is kept as their starting point, to measure the group against."
              onStartGroup={onStartGroup}
              groupsLink={groupsLink}
            />
          ) : null}
        </>
      )}
    </section>
  )
}
