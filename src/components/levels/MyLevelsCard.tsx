import { subjects } from '@/data/subjects'
import { filterResults, learnerLevels, LEVEL_NAMES, levelMovement, startingTerm, type LevelResult, type Term } from '@/lib/levels'
import { LevelChip } from '@/components/levels/LevelChip'
import { LevelsIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id

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
}: {
  results: LevelResult[]
  title?: string
  hiddenTests?: number
  today?: Date
}) {
  if (!results.length && !hiddenTests) return null
  const term = (startingTerm(results, today) || 1) as Term
  const now = learnerLevels(filterResults(results, { term, source: 'all' }))
  const year = new Map(learnerLevels(filterResults(results, { term: null, source: 'all' })).map((l) => [`${l.subjectId}|${l.grade}`, l]))
  const moves = new Map(levelMovement(results, term, { source: 'all' }).map((m) => [`${m.subjectId}|${m.grade}`, m]))
  const subjectsSeen = [...year.values()].sort((a, b) => subjectName(a.subjectId).localeCompare(subjectName(b.subjectId)))

  return (
    <section className="card p-5">
      <h3 className="flex items-center gap-2 font-bold text-navy-900">
        <LevelsIcon className="h-5 w-5 text-navy-500" /> {title} · Term {term}
      </h3>
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
