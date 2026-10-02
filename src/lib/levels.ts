import { capsLevel } from '@/lib/capsScale'
import { markBookTasks, programmeFor } from '@/data/sba'
import type { SbaMarkRow } from '@/lib/sbaMarks'
import type { TestAttempt, WeeklyTest } from '@/lib/weeklyTests'
import type { TestKind } from '@/lib/testKinds'
import type { Grade } from '@/types'

/**
 * Learners' CAPS achievement levels, 1 to 7, from the tests they have written:
 * the weekly tests set in the app and the formal tasks in the SBA mark book.
 *
 * A class teacher sees each learner's level; a principal or head of department
 * sees how many learners are at each level -- the tally that tells a school
 * where a subject stands without reading a class list.
 *
 * A learner's level for a period is the level of their AVERAGE over the tests
 * they wrote in it, rounded to a whole per cent first, as report marks are.
 * A test a learner missed, or was excused from, gives them no level for it; it
 * is not counted as nought here, because a level describes what they showed.
 */

export type LevelSource = 'weekly' | 'sba'
export type Term = 1 | 2 | 3 | 4
export const LEVELS = [7, 6, 5, 4, 3, 2, 1] as const

/** One learner's result on one test. */
export interface LevelResult {
  learnerId: string
  /** The learner's class in this subject, or null if they are in none. */
  classId: string | null
  subjectId: string
  grade: Grade
  source: LevelSource
  /** A weekly test's id, or a formal task's key (unique across subjects and grades). */
  itemId: string
  title: string
  /** When it was written, as YYYY-MM-DD, where known. */
  date: string | null
  term: Term
  percent: number
  /** For a weekly test: its kind and topics. */
  kind?: TestKind
  topicIds?: string[]
}

export interface LevelClass {
  id: string
  name: string
  subject_id: string
  grade: Grade
  /** The class teacher's name, where known -- for letters home. */
  teacher?: string | null
}

export interface LevelData {
  year: number
  /** The school's name, for printed headings, where known. */
  school?: string | null
  classes: LevelClass[]
  /** Learner id to name. Empty where names are not shown. */
  names: Map<string, string>
  members: Map<string, string[]>
  results: LevelResult[]
}

export const levelOf = (percent: number) => capsLevel(Math.round(percent)).level

export const LEVEL_NAMES: Record<number, string> = {
  7: 'Outstanding',
  6: 'Meritorious',
  5: 'Substantial',
  4: 'Adequate',
  3: 'Moderate',
  2: 'Elementary',
  1: 'Not achieved',
}

export const LEVEL_RANGES: Record<number, string> = {
  7: '80–100%',
  6: '70–79%',
  5: '60–69%',
  4: '50–59%',
  3: '40–49%',
  2: '30–39%',
  1: '0–29%',
}

/** The 2026 terms' first days; a date in a holiday belongs to the term before. */
const TERM_STARTS: [Term, string][] = [
  [4, '10-06'],
  [3, '07-21'],
  [2, '04-08'],
  [1, '01-01'],
]

/** The school term a date falls in (or the holiday after). */
export function termOfDate(iso: string): Term {
  const md = iso.slice(5, 10)
  return TERM_STARTS.find(([, start]) => md >= start)![0]
}

/** The term to open on: today's, or the latest one anything has been written in (0 for none). */
export function startingTerm(results: LevelResult[], today: Date): Term | 0 {
  const now = termOfDate(today.toISOString().slice(0, 10))
  if (results.some((r) => r.term === now)) return now
  const latest = Math.max(0, ...results.map((r) => r.term))
  return (latest || now) as Term
}

/** How many of a set of percentages fall at each level. */
export function tally(percents: number[]): Record<number, number> {
  const out: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }
  for (const p of percents) out[levelOf(p)] += 1
  return out
}

export interface Filter {
  subjectId?: string
  grade?: Grade
  classId?: string
  /** A term, or null for the whole year. */
  term: Term | null
  source: LevelSource | 'all'
}

export function filterResults(results: LevelResult[], f: Filter): LevelResult[] {
  return results.filter(
    (r) =>
      (!f.subjectId || r.subjectId === f.subjectId) &&
      (!f.grade || r.grade === f.grade) &&
      (!f.classId || r.classId === f.classId) &&
      (f.term === null || r.term === f.term) &&
      (f.source === 'all' || r.source === f.source),
  )
}

export interface LearnerLevel {
  learnerId: string
  classId: string | null
  subjectId: string
  grade: Grade
  results: LevelResult[]
  /** Their average over the tests, rounded to a whole per cent. */
  percent: number
  level: number
}

/** Each learner's average and level over the results given, one per learner per subject. */
export function learnerLevels(results: LevelResult[]): LearnerLevel[] {
  const groups = new Map<string, LevelResult[]>()
  for (const r of results) {
    const key = `${r.learnerId}|${r.subjectId}|${r.grade}`
    groups.set(key, [...(groups.get(key) ?? []), r])
  }
  return [...groups.values()].map((rs) => {
    const percent = Math.round(rs.reduce((s, r) => s + r.percent, 0) / rs.length)
    const first = rs[0]
    return {
      learnerId: first.learnerId,
      classId: rs.find((r) => r.classId)?.classId ?? null,
      subjectId: first.subjectId,
      grade: first.grade,
      results: rs,
      percent,
      level: levelOf(percent),
    }
  })
}

export interface TestTally {
  source: LevelSource
  itemId: string
  title: string
  date: string | null
  term: Term
  written: number
  average: number
  counts: Record<number, number>
}

/** The tally for each test, newest first. */
export function testTallies(results: LevelResult[]): TestTally[] {
  const groups = new Map<string, LevelResult[]>()
  for (const r of results) groups.set(`${r.source}|${r.itemId}`, [...(groups.get(`${r.source}|${r.itemId}`) ?? []), r])
  return [...groups.values()]
    .map((rs) => ({
      source: rs[0].source,
      itemId: rs[0].itemId,
      title: rs[0].title,
      date: rs[0].date,
      term: rs[0].term,
      written: rs.length,
      average: Math.round(rs.reduce((s, r) => s + r.percent, 0) / rs.length),
      counts: tally(rs.map((r) => r.percent)),
    }))
    .sort((a, b) => b.term - a.term || (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title))
}

// ------------------------------------------------------------ building results

/** The class a learner is in for a subject and grade, from the class lists. */
function classFinder(classes: LevelClass[], members: Map<string, string[]>) {
  const index = new Map<string, string>()
  for (const c of classes) for (const id of members.get(c.id) ?? []) index.set(`${id}|${c.subject_id}|${c.grade}`, c.id)
  return (learnerId: string, subjectId: string, grade: Grade) => index.get(`${learnerId}|${subjectId}|${grade}`) ?? null
}

/**
 * Results from weekly tests. Only handed-in attempts count, and not the
 * reassessments set for a catch-up group: those are sat by the few learners
 * who were behind, so they would skew a class's tally.
 */
export function weeklyResults(
  tests: WeeklyTest[],
  attempts: TestAttempt[],
  classes: LevelClass[],
  members: Map<string, string[]>,
  year: number,
): LevelResult[] {
  const classOf = classFinder(classes, members)
  const byId = new Map(tests.map((t) => [t.id, t]))
  const out: LevelResult[] = []
  for (const a of attempts) {
    const t = byId.get(a.test_id)
    if (!t || t.intervention_id || !a.submitted_at || !a.marks_total) continue
    const date = (a.submitted_at ?? t.due_at).slice(0, 10)
    if (Number(date.slice(0, 4)) !== year) continue
    out.push({
      learnerId: a.learner_id,
      classId: t.class_id ?? classOf(a.learner_id, t.subject_id, t.grade),
      subjectId: t.subject_id,
      grade: t.grade,
      source: 'weekly',
      itemId: t.id,
      title: t.title,
      date: t.due_at.slice(0, 10),
      term: termOfDate(t.due_at.slice(0, 10)),
      percent: ((a.marks_awarded ?? 0) / a.marks_total) * 100,
      kind: t.kind ?? 'weekly',
      topicIds: t.topic_ids,
    })
  }
  return out
}

/** Results from the formal tasks in the mark book: marked entries only. */
export function sbaResults(
  rows: Pick<SbaMarkRow, 'class_id' | 'learner_id' | 'task_key' | 'mark' | 'status' | 'out_of'>[],
  classes: LevelClass[],
): LevelResult[] {
  const byId = new Map(classes.map((c) => [c.id, c]))
  const tasksFor = new Map<string, Map<string, { key: string; title: string; term: Term }>>()
  const out: LevelResult[] = []
  for (const r of rows) {
    const c = byId.get(r.class_id)
    if (!c || r.status !== 'marked' || !r.out_of) continue
    const key = `${c.subject_id}|${c.grade}`
    if (!tasksFor.has(key))
      tasksFor.set(key, new Map(markBookTasks(programmeFor(c.subject_id, c.grade)).map((t) => [t.slot, { key: t.key, title: t.title.split(':')[0], term: t.term }])))
    const task = tasksFor.get(key)!.get(r.task_key)
    if (!task) continue
    out.push({
      learnerId: r.learner_id,
      classId: c.id,
      subjectId: c.subject_id,
      grade: c.grade,
      source: 'sba',
      itemId: task.key,
      title: task.title,
      date: null,
      term: task.term,
      percent: ((r.mark ?? 0) / r.out_of) * 100,
    })
  }
  return out
}

export interface Movement {
  learnerId: string
  classId: string | null
  subjectId: string
  grade: Grade
  /** Average and level in the term before. */
  before: number
  from: number
  /** Average and level in the term chosen. */
  after: number
  to: number
}

/**
 * How each learner's level changed from the term before to the term given,
 * for learners with tests in both. A learner with no tests in one of the
 * terms has no movement to report, rather than a fall to nothing.
 */
export function levelMovement(results: LevelResult[], term: Term, f: Omit<Filter, 'term'>): Movement[] {
  if (term === 1) return []
  const key = (l: LearnerLevel) => `${l.learnerId}|${l.subjectId}|${l.grade}`
  const prev = new Map(learnerLevels(filterResults(results, { ...f, term: (term - 1) as Term })).map((l) => [key(l), l]))
  return learnerLevels(filterResults(results, { ...f, term })).flatMap((l) => {
    const p = prev.get(key(l))
    return p
      ? [{ learnerId: l.learnerId, classId: l.classId, subjectId: l.subjectId, grade: l.grade, before: p.percent, from: p.level, after: l.percent, to: l.level }]
      : []
  })
}

// ------------------------------------------------------------ early warning

export type WarningReason = 'below_40' | 'dropped' | 'month_drop' | 'falling'

export interface EarlyWarning {
  learnerId: string
  classId: string | null
  subjectId: string
  grade: Grade
  reasons: WarningReason[]
  latest: LevelResult
  previous: LevelResult | null
  /** This month's and last month's averages, where both have tests. */
  month: { now: number; before: number } | null
  /** The learner's recent tests, oldest first, for a sparkline. */
  recent: LevelResult[]
}

const DAY = 86_400_000

/**
 * A fall in level that needs action: to Level 4 (Adequate) or below, or by
 * two levels or more. A slip from 7 to 6 is left alone.
 */
export const worrying = (from: number, to: number) => to < from && (to <= 4 || from - to >= 2)
/** A learner whose latest test is older than this is not "early" any more. */
const FRESH_DAYS = 35

/**
 * Learners to catch now, test by test, rather than at the end of the term:
 * those whose latest weekly test, topic test or monthly check was below 40%,
 * who dropped a level since their previous test, whose average this month is
 * a level below last month's, or whose last three tests each fell (by ten
 * points or more in all) -- a fall counting only when it is worrying(): to
 * Level 4 or below, or by two levels or more. Only tests set in the app count -- they carry a
 * date -- and only learners with a test in the last five weeks.
 */
export function earlyWarnings(results: LevelResult[], f: { classId?: string; subjectId?: string }, today: Date): EarlyWarning[] {
  const now = today.getTime()
  const groups = new Map<string, LevelResult[]>()
  for (const r of results) {
    if (r.source !== 'weekly' || !r.date) continue
    if (f.classId && r.classId !== f.classId) continue
    if (f.subjectId && r.subjectId !== f.subjectId) continue
    const key = `${r.learnerId}|${r.subjectId}|${r.grade}`
    groups.set(key, [...(groups.get(key) ?? []), r])
  }
  const out: EarlyWarning[] = []
  for (const rs of groups.values()) {
    const sorted = [...rs].sort((a, b) => a.date!.localeCompare(b.date!))
    const latest = sorted[sorted.length - 1]
    const age = (now - new Date(`${latest.date}T00:00:00Z`).getTime()) / DAY
    if (age > FRESH_DAYS || age < -1) continue
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null
    const reasons: WarningReason[] = []
    if (Math.round(latest.percent) < 40) reasons.push('below_40')
    if (previous && worrying(levelOf(previous.percent), levelOf(latest.percent))) reasons.push('dropped')

    const end = new Date(`${latest.date}T00:00:00Z`).getTime()
    const inWindow = (r: LevelResult, from: number, to: number) => {
      const t = new Date(`${r.date}T00:00:00Z`).getTime()
      return t > end - to * DAY && t <= end - from * DAY
    }
    const avg = (xs: LevelResult[]) => xs.reduce((s, r) => s + r.percent, 0) / xs.length
    const thisMonth = sorted.filter((r) => inWindow(r, 0, 28))
    const lastMonth = sorted.filter((r) => inWindow(r, 28, 56))
    const month = thisMonth.length && lastMonth.length ? { now: Math.round(avg(thisMonth)), before: Math.round(avg(lastMonth)) } : null
    if (month && worrying(levelOf(month.before), levelOf(month.now))) reasons.push('month_drop')

    const last3 = sorted.slice(-3)
    if (
      last3.length === 3 &&
      last3[0].percent > last3[1].percent &&
      last3[1].percent > last3[2].percent &&
      last3[0].percent - last3[2].percent >= 10 &&
      worrying(levelOf(last3[0].percent), levelOf(last3[2].percent))
    )
      reasons.push('falling')

    if (reasons.length)
      out.push({ learnerId: latest.learnerId, classId: latest.classId, subjectId: latest.subjectId, grade: latest.grade, reasons, latest, previous, month, recent: sorted.slice(-6) })
  }
  return out.sort((a, b) => b.reasons.length - a.reasons.length || a.latest.percent - b.latest.percent)
}


export interface WarningWeek {
  /** Learners flagged by a test in the window. */
  flagged: number
  /** Learners flagged in the five weeks before it whose latest test in the window is at Level 4 or above. */
  recovered: number
  /** Tests handed in during the window. */
  handedIn: number
}

/**
 * A window of days in early warnings, counted the way the Monday summary to
 * principals and HODs counts its week: a test flags a learner when it is
 * below 40% or a worrying() fall from their previous test. Dates are
 * yyyy-mm-dd; the window runs from `from` up to, not including, `to`.
 */
/** Each learner's weekly results in a subject, oldest first, up to `to`, with which of them flag the learner. */
function flaggedSeries(results: LevelResult[], f: { subjectId?: string }, to: string) {
  const groups = new Map<string, LevelResult[]>()
  for (const r of results) {
    if (r.source !== 'weekly' || !r.date || r.date >= to) continue
    if (f.subjectId && r.subjectId !== f.subjectId) continue
    const key = `${r.learnerId}|${r.subjectId}|${r.grade}`
    groups.set(key, [...(groups.get(key) ?? []), r])
  }
  return [...groups.values()].map((rs) => {
    const sorted = [...rs].sort((a, b) => a.date!.localeCompare(b.date!))
    const flags = sorted.map((r, i) => Math.round(r.percent) < 40 || (i > 0 && worrying(levelOf(sorted[i - 1].percent), levelOf(r.percent))))
    return { sorted, flags }
  })
}

export function warningWeek(results: LevelResult[], f: { subjectId?: string }, from: string, to: string): WarningWeek {
  const before = new Date(new Date(`${from}T00:00:00Z`).getTime() - FRESH_DAYS * DAY).toISOString().slice(0, 10)
  let flagged = 0
  let recovered = 0
  let handedIn = 0
  for (const { sorted, flags } of flaggedSeries(results, f, to)) {
    const inWeek = sorted.filter((r) => r.date! >= from)
    handedIn += inWeek.length
    const now = sorted.some((r, i) => flags[i] && r.date! >= from)
    const earlier = sorted.some((r, i) => flags[i] && r.date! >= before && r.date! < from)
    if (now) flagged += 1
    else if (earlier && inWeek.length && levelOf(inWeek[inWeek.length - 1].percent) >= 4) recovered += 1
  }
  return { flagged, recovered, handedIn }
}

/** The learners an early warning flagged in a window of days, by the same rule -- once each per subject. */
export function flaggedBetween(
  results: LevelResult[],
  f: { subjectId?: string },
  from: string,
  to: string,
): { learnerId: string; subjectId: string; grade: Grade; classId: string | null }[] {
  return flaggedSeries(results, f, to).flatMap(({ sorted, flags }) => {
    const i = sorted.findIndex((r, j) => flags[j] && r.date! >= from)
    if (i < 0) return []
    const r = sorted[i]
    return [{ learnerId: r.learnerId, subjectId: r.subjectId, grade: r.grade, classId: r.classId }]
  })
}

/** A term's dates in a year, yyyy-mm-dd, as the app counts terms: from its first day up to, not including, the next term's. */
export function termRange(term: Term, year: number): { from: string; to: string } {
  const start = (t: Term) => TERM_STARTS.find(([x]) => x === t)![1]
  return { from: `${year}-${start(term)}`, to: term === 4 ? `${year + 1}-01-01` : `${year}-${start((term + 1) as Term)}` }
}
