import { demoLevelData } from '@/data/demoLevels'
import type { ImpactGroup } from '@/lib/catchUpImpact'
import type { LevelResult } from '@/lib/levels'

/**
 * The demo's catch-up groups, for the dashboards: in each sample class, the
 * learners below 50% on two of this year's tests were grouped on that test's
 * topic and reassessed a few weeks later; the class's latest test has a group
 * that is still running, not yet reassessed. Most learners improve, a few do
 * not -- as in a real school.
 */

const TEACHERS: Record<string, string> = {
  'demo-11a': 'Alhaji T',
  'demo-11b': 'Mangyani T.S',
  'demo-12a': 'Alhaji T',
  'demo-10m': 'Ms. F. Adams',
  'demo-12m': 'Ms. F. Adams',
  'demo-11p': 'Mr. K. Mokoena',
  'demo-10l': 'Mr. T. Sithole',
}

const seeded = (a: number, b: number) => {
  const x = Math.sin(a * 91.17 + b * 47.53) * 24634.6345
  return x - Math.floor(x)
}

export function demoImpactGroups(scope: 'teacher' | 'hod' | 'school', now = new Date()): ImpactGroup[] {
  const data = demoLevelData(scope, now)
  const groups: ImpactGroup[] = []
  data.classes.forEach((c, ci) => {
    const byTest = new Map<string, LevelResult[]>()
    for (const r of data.results) if (r.source === 'weekly' && r.classId === c.id) byTest.set(r.itemId, [...(byTest.get(r.itemId) ?? []), r])
    const tests = [...byTest.values()].sort((a, b) => a[0].date!.localeCompare(b[0].date!))
    const picks = [tests.length - 5, tests.length - 3, tests.length - 1].filter((i) => i >= 0)
    picks.forEach((ti, pi) => {
      const rs = tests[ti]
      const behind = rs.filter((r) => r.percent < 50)
      if (!behind.length) return
      const running = pi === picks.length - 1
      groups.push({
        id: `demo-cu-${c.id}-${ti}`,
        subjectId: c.subject_id,
        grade: c.grade,
        topicId: rs[0].topicIds?.[0] ?? '',
        createdBy: TEACHERS[c.id] ?? null,
        status: running ? 'active' : 'completed',
        createdAt: rs[0].date!,
        outcomes: behind.map((r, li) => ({
          learnerId: r.learnerId,
          baseline: Math.round(r.percent),
          // A gain of −6 to +24 points, mostly upward.
          latest: running ? null : Math.max(5, Math.min(95, Math.round(r.percent + seeded(li * 3 + ci * 5 + 1, ti + 2) * 30 - 6))),
        })),
      })
    })
  })
  // The demo teacher is Alhaji T, and a teacher sees the groups they started.
  return scope === 'teacher' ? groups.filter((g) => g.createdBy === 'Alhaji T') : groups
}
