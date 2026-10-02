import { subjects } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import {
  earlyWarnings,
  filterResults,
  learnerLevels,
  LEVEL_NAMES,
  levelMovement,
  levelOf,
  startingTerm,
  type EarlyWarning,
  type LevelResult,
  type Term,
} from '@/lib/levels'
import { shortDate } from '@/components/levels/warningText'
import { LevelChip } from '@/components/levels/LevelChip'
import { ReplyBox, type ContactValue, type ReplyValue } from '@/components/levels/ReplyBox'
import type { ReplyChoice } from '@/lib/parentReplyTypes'
import { AlertIcon, LevelsIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id

/**
 * An early warning in plain words, for the learner ("your") or a parent
 * (the child's first name): what the test showed and what helps.
 */
function WarningNote({
  w,
  child,
  reply,
  contact,
  onReply,
  replyNote,
}: {
  w: EarlyWarning
  child?: string
  reply?: ReplyValue
  contact?: ContactValue
  onReply?: (choice: ReplyChoice, message: string, contact?: ContactValue) => Promise<string | undefined>
  replyNote?: string
}) {
  const t = w.latest
  const pct = Math.round(t.percent)
  const topic = (t.topicIds ?? []).map((id) => getTopic(id)?.name).filter(Boolean).join(' and ') || 'this topic'
  const whose = child ? `${child}’s` : 'your'
  const reasons = [
    w.reasons.includes('below_40') ? 'below 40%' : null,
    w.reasons.includes('dropped') && w.previous ? `down from ${Math.round(w.previous.percent)}% (Level ${levelOf(w.previous.percent)}) on the test before` : null,
    w.reasons.includes('month_drop') && w.month ? `the last four weeks average ${w.month.now}%, down from ${w.month.before}%` : null,
    w.reasons.includes('falling') ? 'the third test in a row to go down' : null,
  ].filter(Boolean)
  return (
    <li className="space-y-1.5 py-2.5">
      <p className="text-sm text-navy-900">
        <span className="font-semibold">{subjectName(t.subjectId)}:</span> {child ? `${child} scored` : 'you scored'} <strong>{pct}%</strong> (Level{' '}
        {levelOf(t.percent)}) on “{t.title}” on {shortDate(t.date!)}
        {reasons.length ? ` — ${reasons.join('; ')}.` : '.'}
      </p>
      {child ? (
        <ul className="list-disc space-y-0.5 pl-5 text-xs text-navy-700">
          <li>Ask {child} to show you the test and explain the questions that were hard.</li>
          <li>
            Help {child} practise {topic} for about 30 minutes a day in the app; every question has a worked solution.
          </li>
          <li>Check that homework is done, and that {child} goes to every lesson and any extra lessons.</li>
        </ul>
      ) : (
        <p className="text-xs text-navy-700">
          Practise {topic} for about 30 minutes a day in Practise, and check your working against the worked solutions. Your teacher will help
          you catch up, then give a short test to see {whose} progress.
        </p>
      )}
      {child ? (
        <p className="text-[11px] text-navy-500">
          {child}’s teacher has been told too, and will give extra help with {topic}.
        </p>
      ) : null}
      {child && onReply ? <ReplyBox reply={reply} contact={contact} onReply={onReply} note={replyNote} /> : null}
    </li>
  )
}

/**
 * One learner's CAPS level in each subject: this term's, how it moved since
 * the term before, and the year so far. For the learner on their dashboard,
 * and for a parent, one card per child. Built from the learner's own weekly
 * tests and the SBA marks their teacher has released.
 */
export function MyLevelsCard({
  results,
  title = 'My levels',
  hiddenTests = 0,
  today = new Date(),
  child,
  replies,
  contact,
  onReply,
  replyNote,
}: {
  results: LevelResult[]
  title?: string
  hiddenTests?: number
  today?: Date
  /** The child's first name, on a parent's card; absent on the learner's own. */
  child?: string
  /** On a parent's card: their replies to early warnings, by test. */
  replies?: Map<string, ReplyValue>
  contact?: ContactValue
  onReply?: (testId: string, choice: ReplyChoice, message: string, contact?: ContactValue) => Promise<string | undefined>
  replyNote?: string
}) {
  if (!results.length && !hiddenTests) return null
  const term = (startingTerm(results, today) || 1) as Term
  const now = learnerLevels(filterResults(results, { term, source: 'all' }))
  const year = new Map(learnerLevels(filterResults(results, { term: null, source: 'all' })).map((l) => [`${l.subjectId}|${l.grade}`, l]))
  const moves = new Map(levelMovement(results, term, { source: 'all' }).map((m) => [`${m.subjectId}|${m.grade}`, m]))
  const warnings = earlyWarnings(results, {}, today)
  const subjectsSeen = [...year.values()].sort((a, b) => subjectName(a.subjectId).localeCompare(subjectName(b.subjectId)))

  return (
    <section className="card p-5">
      <h3 className="flex items-center gap-2 font-bold text-navy-900">
        <LevelsIcon className="h-5 w-5 text-navy-500" /> {title} · Term {term}
      </h3>
      {warnings.length ? (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50/60 px-3">
          <p className="flex items-center gap-1.5 pt-2.5 text-xs font-bold uppercase tracking-wider text-rose-800">
            <AlertIcon className="h-4 w-4" /> Early warning
          </p>
          <ul className="divide-y divide-rose-100">
            {warnings.map((w) => (
              <WarningNote
                key={`${w.subjectId}|${w.grade}`}
                w={w}
                child={child}
                reply={replies?.get(w.latest.itemId)}
                contact={contact}
                onReply={onReply ? (choice, message, c) => onReply(w.latest.itemId, choice, message, c) : undefined}
                replyNote={replyNote}
              />
            ))}
          </ul>
        </div>
      ) : null}
      <ul className="mt-3 divide-y divide-navy-100">
        {subjectsSeen.map((y) => {
          const key = `${y.subjectId}|${y.grade}`
          const t = now.find((l) => `${l.subjectId}|${l.grade}` === key)
          const m = moves.get(key)
          return (
            <li key={key} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5">
              <span className="min-w-[11rem] flex-1">
                <span className="block text-sm font-semibold text-navy-900">{subjectName(y.subjectId)}</span>
                <span className="block text-xs text-navy-500">
                  Grade {y.grade} · year so far {y.percent}% (Level {y.level})
                </span>
              </span>
              {t ? (
                <span className="flex items-center gap-2">
                  <LevelChip level={t.level} />
                  <span className="text-sm">
                    <span className="font-semibold text-navy-900">{LEVEL_NAMES[t.level]}</span>
                    <span className="text-navy-500"> · {t.percent}%</span>
                  </span>
                  {m && m.to !== m.from ? (
                    <span className={cn('text-xs font-semibold', m.to > m.from ? 'text-emerald-700' : 'text-rose-700')}>
                      {m.to > m.from ? '▲' : '▼'} from L{m.from} in Term {term - 1}
                    </span>
                  ) : null}
                </span>
              ) : (
                <span className="text-xs text-navy-400">No tests yet in Term {term}</span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-xs text-navy-500">
        From weekly tests and the SBA marks the teacher has released. Level 7 is 80% and above; Level 1 is below 30%.
        {hiddenTests ? ` ${hiddenTests} weekly ${hiddenTests === 1 ? 'test is' : 'tests are'} not shown yet: the school’s database needs STEP 27.` : ''}
      </p>
    </section>
  )
}
