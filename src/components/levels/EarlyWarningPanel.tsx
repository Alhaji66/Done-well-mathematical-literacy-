import { useMemo, useState, type ReactNode } from 'react'
import { atpFor } from '@/data/atp'
import { earlyWarnings, levelOf, type EarlyWarning, type LevelClass, type LevelData } from '@/lib/levels'
import { reasonText, shortDate } from '@/components/levels/warningText'
import { TEST_KIND_LABEL } from '@/lib/testKinds'
import { LevelChip, LEVEL_FILL } from '@/components/levels/LevelChip'
import { CatchUpGroupForm, type StartGroupInput } from '@/components/levels/CatchUpGroupForm'
import { EarlyWarningLetters } from '@/components/levels/EarlyWarningLetters'
import { REPLY_FOR_TEACHER } from '@/lib/parentReplyTypes'
import { printPart } from '@/lib/print'
import { AlertIcon, PrinterIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

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

  // Parents' replies about the tests behind each warning, newest first.
  const repliesFor = (w: EarlyWarning) =>
    (data.replies ?? [])
      .filter((r) => r.learner_id === w.learnerId && w.recent.some((x) => x.itemId === r.test_id))
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))

  // Letters home go to the learners chosen for the group, or to everyone flagged where there is no choosing.
  const lettersFor = onStartGroup ? chosen : warnings

  return (
    <>
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
                  {repliesFor(w).map((r) => (
                    <span key={`${r.parent_id}|${r.test_id}`} className="w-full text-xs">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                          r.choice === 'call' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-emerald-800',
                        )}
                      >
                        {REPLY_FOR_TEACHER[r.choice]}
                      </span>
                      {r.message ? <span className="ml-2 italic text-navy-600">“{r.message}”</span> : null}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!lettersFor.length}
                onClick={() => printPart('letters')}
                className="btn-outline btn-sm inline-flex items-center gap-1.5"
              >
                <PrinterIcon className="h-4 w-4" /> Print letters home{lettersFor.length ? ` (${lettersFor.length})` : ''}
              </button>
              <span className="text-xs text-navy-500">
                One page each, with the test, the result, what helps at home and a reply slip.{onStartGroup ? ' For the learners ticked above.' : ''}
              </span>
            </div>
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
      <EarlyWarningLetters warnings={lettersFor} cls={cls} school={data.school} name={name} />
    </>
  )
}
