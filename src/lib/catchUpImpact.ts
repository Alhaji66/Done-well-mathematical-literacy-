import { levelOf, termOfDate, termRange, type Term } from '@/lib/levels'
import type { Grade } from '@/types'

/**
 * Whether catch-up groups are working, group by group and added up: each
 * learner's starting point against their latest reassessment. Pure, so the
 * account pages and the demo count the same way.
 */

export interface ImpactGroup {
  id: string
  subjectId: string
  grade: Grade
  topicId: string
  /** The class the group was drawn from, if one. */
  classId?: string | null
  /** Who started the group: a teacher's id, or their name in the demo. */
  createdBy: string | null
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  outcomes: { learnerId: string; baseline: number | null; latest: number | null }[]
}

export interface ImpactTotals {
  groups: number
  learners: number
  /** Learners with both a starting point and a reassessment. */
  measured: number
  improved: number
  /** Measured learners whose CAPS level rose. */
  movedUp: number
  /** Measured learners who started below Level 4 (50%)... */
  startedBelow4: number
  /** ...and how many of them reached it. */
  reached4: number
  /** Mean change in percentage points, over measured learners. */
  averageChange: number | null
}

export function impactTotals(groups: ImpactGroup[]): ImpactTotals {
  let learners = 0
  let measured = 0
  let improved = 0
  let movedUp = 0
  let startedBelow4 = 0
  let reached4 = 0
  let change = 0
  for (const g of groups) {
    learners += g.outcomes.length
    for (const o of g.outcomes) {
      if (o.baseline === null || o.latest === null) continue
      measured += 1
      change += o.latest - o.baseline
      if (o.latest > o.baseline) improved += 1
      if (levelOf(o.latest) > levelOf(o.baseline)) movedUp += 1
      if (levelOf(o.baseline) < 4) {
        startedBelow4 += 1
        if (levelOf(o.latest) >= 4) reached4 += 1
      }
    }
  }
  return {
    groups: groups.length,
    learners,
    measured,
    improved,
    movedUp,
    startedBelow4,
    reached4,
    averageChange: measured ? Math.round((change / measured) * 10) / 10 : null,
  }
}

/** The totals for each value of `key` -- subject, teacher or topic -- most groups first. */
export function impactBy(groups: ImpactGroup[], key: (g: ImpactGroup) => string): { key: string; totals: ImpactTotals }[] {
  const by = new Map<string, ImpactGroup[]>()
  for (const g of groups) by.set(key(g), [...(by.get(key(g)) ?? []), g])
  return [...by.entries()]
    .map(([k, gs]) => ({ key: k, totals: impactTotals(gs) }))
    .sort((a, b) => b.totals.groups - a.totals.groups || b.totals.measured - a.totals.measured || a.key.localeCompare(b.key))
}

/** "+4.5" or "−2" -- a change in points, signed. */
export const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0')

/** A report's period: one term, or the whole year. */
export type Period = Term | 'year'

export const periodLabel = (p: Period, year: number) => (p === 'year' ? `${year}` : `Term ${p}, ${year}`)

/** The period's dates, yyyy-mm-dd, from its first day up to, not including, the day after it ends. */
export const periodRange = (p: Period, year: number) => (p === 'year' ? { from: `${year}-01-01`, to: `${year + 1}-01-01` } : termRange(p, year))

/** The groups started in a period. */
export function groupsIn(groups: ImpactGroup[], p: Period, year: number): ImpactGroup[] {
  return groups.filter((g) => g.createdAt.slice(0, 4) === String(year) && (p === 'year' || termOfDate(g.createdAt.slice(0, 10)) === p))
}
