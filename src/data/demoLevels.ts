import { atpFor, termWeeks } from '@/data/atp'
import { markBookTasks, programmeFor } from '@/data/sba'
import { CLASSES, learners as markBookLearners, sampleMarks, tasksOf } from '@/data/demoMarkBook'
import { earlyWarnings, sbaResults, termOfDate, type LevelClass, type LevelData, type LevelResult, type Term } from '@/lib/levels'
import { TEST_KIND_LABEL, type TestKind } from '@/lib/testKinds'
import type { ParentReply } from '@/lib/parentReplyTypes'
import type { Grade } from '@/types'

/**
 * The demo's levels: the three Mathematical Literacy classes of the demo mark
 * book, with their SBA marks, plus a class in each of the other subjects so a
 * principal's tally covers the school. Every class also has weekly tests on
 * the ATP's topics for Terms 1 to 3. Each learner's weekly results sit around
 * their SBA marks, so a learner who struggles in one struggles in the other.
 */

const OTHER_CLASSES: LevelClass[] = [
  { id: 'demo-10m', name: '10A Mathematics', subject_id: 'mathematics', grade: 10 },
  { id: 'demo-12m', name: '12B Mathematics', subject_id: 'mathematics', grade: 12 },
  { id: 'demo-11p', name: '11C Physical Sciences', subject_id: 'physical-sciences', grade: 11 },
  { id: 'demo-10l', name: '10B Life Sciences', subject_id: 'life-sciences', grade: 10 },
]

/** Who teaches each demo class. The demo teacher is Alhaji T. */
export const DEMO_CLASS_TEACHER: Record<string, string> = {
  'demo-11a': 'Alhaji T',
  'demo-11b': 'Mangyani T.S',
  'demo-12a': 'Alhaji T',
  'demo-10m': 'Ms. F. Adams',
  'demo-12m': 'Ms. F. Adams',
  'demo-11p': 'Mr. K. Mokoena',
  'demo-10l': 'Mr. T. Sithole',
}

const OTHER_NAMES = [
  'Mpho Radebe', 'Naledi Zulu', 'Owethu Cele', 'Palesa Tau', 'Qhawe Ngcobo', 'Refilwe Sebola',
  'Sipho Maseko', 'Thandi Shabalala', 'Unathi Mkhize', 'Vusi Mabaso', 'Wandile Hadebe', 'Zanele Ntuli',
]

const seeded = (a: number, b: number) => {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return x - Math.floor(x)
}
const clamp = (p: number) => Math.max(8, Math.min(98, p))

/** Up to three weekly tests a term, on the ATP's topics, set on the Friday of weeks 3, 6 and 9. */
function weeklyTestsFor(subjectId: string, grade: Grade, today: string) {
  const atp = atpFor(subjectId, grade)
  const out: { id: string; title: string; date: string; term: Term; kind: TestKind; topicIds: string[] }[] = []
  // Each term: a weekly test, then a topic test, then a monthly check.
  const kinds: TestKind[] = ['weekly', 'topic', 'monthly']
  for (const term of [1, 2, 3, 4] as Term[]) {
    const weeksWithTopics = [...new Map((atp?.weeks ?? []).filter((w) => w.term === term && w.topicId).map((w) => [w.label, w])).values()].slice(0, 3)
    const weeks = termWeeks(term)
    weeksWithTopics.forEach((w, i) => {
      const week = weeks[Math.min(weeks.length - 1, 2 + i * 3)]
      const date = week.end.toISOString().slice(0, 10)
      const kind = kinds[i]
      if (date <= today)
        out.push({
          id: `demo-wt-${subjectId}-${grade}-${term}-${i}`,
          title: `${TEST_KIND_LABEL[kind]}: ${w.label.split(/[:(]/)[0].trim()}`,
          date,
          term,
          kind,
          topicIds: [w.topicId!],
        })
    })
  }
  return out
}

function weeklyFor(c: LevelClass, learnerIds: string[], ability: (i: number) => number, today: string, seed: number): LevelResult[] {
  return weeklyTestsFor(c.subject_id, c.grade, today).flatMap((t, ti) =>
    learnerIds.flatMap((learnerId, li) => {
      // Now and then a learner misses a test.
      if (seeded(li + seed, ti + 40) < 0.06) return []
      return [
        {
          learnerId,
          classId: c.id,
          subjectId: c.subject_id,
          grade: c.grade,
          source: 'weekly' as const,
          itemId: t.id,
          title: t.title,
          date: t.date,
          term: termOfDate(t.date),
          percent: Math.round(clamp(ability(li) + (seeded(li + seed, ti) - 0.5) * 24)),
          kind: t.kind,
          topicIds: t.topicIds,
        },
      ]
    }),
  )
}

export function demoLevelData(scope: 'teacher' | 'hod' | 'school', now = new Date()): LevelData {
  const today = now.toISOString().slice(0, 10)
  const classes: LevelClass[] = (scope === 'school' ? [...CLASSES, ...OTHER_CLASSES] : [...CLASSES]).map((c) => ({
    ...c,
    teacher: DEMO_CLASS_TEACHER[c.id] ?? null,
  }))
  const names = new Map<string, string>()
  const members = new Map<string, string[]>()
  const results: LevelResult[] = []

  // The mark book's classes: its own marks, with learner ids made unique to the class.
  CLASSES.forEach((c, ci) => {
    const ids = markBookLearners.map((l) => `${c.id}:${l.id}`)
    markBookLearners.forEach((l, i) => names.set(ids[i], l.name))
    members.set(c.id, ids)
    const marks = sampleMarks(tasksOf(c.grade), c.id)
    const rows = markBookLearners.flatMap((l, i) =>
      [...(marks.get(l.id) ?? new Map()).entries()].map(([slot, r]) => ({ class_id: c.id, learner_id: ids[i], task_key: slot, ...r })),
    )
    const sba = sbaResults(rows, [c])
    results.push(...sba)
    const average = (i: number) => {
      const own = sba.filter((r) => r.learnerId === ids[i])
      return own.length ? own.reduce((s, r) => s + r.percent, 0) / own.length : 50
    }
    results.push(...weeklyFor(c, ids, average, today, ci * 17))
  })

  if (scope === 'school')
    OTHER_CLASSES.forEach((c, ci) => {
      const ids = OTHER_NAMES.map((_, i) => `${c.id}:l${i}`)
      OTHER_NAMES.forEach((n, i) => names.set(ids[i], n))
      members.set(c.id, ids)
      const ability = (i: number) => 22 + 66 * seeded(i + ci * 5, 7)
      const rows = markBookTasks(programmeFor(c.subject_id, c.grade))
        .filter((t) => t.term <= 3 && t.exam !== 'end-of-year')
        .flatMap((t, ti) =>
          ids.map((id, i) => ({
            class_id: c.id,
            learner_id: id,
            task_key: t.slot,
            mark: Math.round((clamp(ability(i) + (seeded(i + ci, ti + 9) - 0.5) * 20) / 100) * t.marks),
            status: 'marked' as const,
            out_of: t.marks,
          })),
        )
      results.push(...sbaResults(rows, [c]), ...weeklyFor(c, ids, ability, today, 100 + ci * 13))
    })

  // Two parents in 11A have answered the early warning about their child.
  const latest = results.reduce((m, r) => (r.date && r.date > m ? r.date : m), '')
  const warnDay = new Date(new Date(`${latest}T12:00:00Z`).getTime() + 3 * 86_400_000)
  const replies: ParentReply[] = earlyWarnings(results, { classId: 'demo-11a' }, warnDay)
    .slice(0, 2)
    .map((w, i) => ({
      parent_id: `demo-parent-${i}`,
      learner_id: w.learnerId,
      test_id: w.latest.itemId,
      choice: i === 0 ? 'seen' : 'call',
      message: i === 0 ? 'We have started practising every evening after supper.' : 'I work shifts; please phone after 5 pm.',
      updated_at: `${w.latest.date}T18:00:00Z`,
    }))

  const contacts = replies.filter((r) => r.choice === 'call').map((r) => ({ parent_id: r.parent_id, phone: '082 555 0147', best_time: 'after 5 pm on weekdays' }))

  return { year: now.getFullYear(), school: 'Gojela High School', classes, names: scope === 'school' ? new Map() : names, members, results, replies, contacts }
}

/**
 * The demo learner's own levels, for the learner and parent demo dashboards:
 * one learner of the sample 12A class, standing in for Karabo -- one an early
 * warning has flagged, where there is one, so the demo shows what a learner
 * and a parent see then.
 */
export function demoMyLevels(now = new Date()): LevelResult[] {
  const data = demoLevelData('teacher', now)
  const flagged = earlyWarnings(data.results, { classId: 'demo-12a' }, demoToday(data))
  // From the latest test, and the mildest case: a fall in level rather than a very low mark.
  const pick =
    [...flagged].sort((a, b) => b.latest.date!.localeCompare(a.latest.date!) || b.latest.percent - a.latest.percent)[0]?.learnerId ??
    'demo-12a:demo-learner-0'
  return data.results.filter((r) => r.learnerId === pick).map((r) => ({ ...r, learnerId: 'demo-karabo' }))
}

/**
 * The demo's "today": a few days after its latest sample test. The sample
 * tests stop at the real date, so the early warnings the demo shows are
 * always current, whenever it is opened.
 */
export function demoToday(data: Pick<LevelData, 'results'>): Date {
  const latest = data.results.reduce((m, r) => (r.date && r.date > m ? r.date : m), '')
  return latest ? new Date(new Date(`${latest}T12:00:00Z`).getTime() + 3 * 86_400_000) : new Date()
}
