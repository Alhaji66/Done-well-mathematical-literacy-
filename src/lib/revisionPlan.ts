import { getTopic, topicsForSubject } from '@/data/topics'
import { subtopicFor, subtopicRulesFor } from '@/data/subtopics'
import type { Difficulty, Grade, Question } from '@/types'

/**
 * Exam countdown: a day-by-day revision plan from the learner's exam date and
 * their marks per topic.
 *
 * - Every day up to the exam gets one topic. The weaker the topic, the more
 *   days it gets -- weight is the squared gap to 100%, so a topic at 40% gets
 *   about twice the days of one at 60% -- and every topic gets at least one,
 *   so a strong topic still comes round before the exam instead of being forgotten.
 * - Topics are spread out, not bunched: a weak topic comes back every few days
 *   rather than taking a solid week, which is how spaced practice works.
 * - The last days before the exam are past-paper practice across every topic,
 *   the way the exam itself mixes them.
 * - Each day has three practice questions from DONE WELL's own bank, getting
 *   harder as the exam gets closer. They are chosen the same way every time
 *   for a given day, so the plan does not reshuffle when the page is opened.
 *
 * Everything here runs on the phone and is kept in this browser, so the plan
 * works offline once the subject's questions have loaded once.
 */

export interface TopicMark {
  topicId: string
  /** 0-100. A topic never practised has no mark; it is treated as middling. */
  mastery: number | null
}

export interface PlanDay {
  /** YYYY-MM-DD, local time. */
  date: string
  kind: 'topic' | 'mixed'
  topicId: string | null
  /** For a topic day: which sub-topic to focus on, rotating through them. */
  subtopic: string | null
  /** 1-based: this is session `session` of `sessions` for its topic. */
  session: number
  sessions: number
}

export interface RevisionPlan {
  examDate: string
  /** Whole days from today to the exam; 0 on the day itself. */
  daysLeft: number
  days: PlanDay[]
  /** Topics by weakness, with how many days each was given. */
  focus: { topicId: string; mastery: number | null; days: number }[]
}

/** A topic with no mark yet is planned as if it were at this level. */
const UNTRIED = 45
/** Added to the gap, so a topic at 100% still has some weight. */
const FLOOR = 5

export const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const parseDay = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const daysFromToday = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return isoDay(d)
}

/** The demo opens on an exam five weeks away, so its plan shows on first look. */
export const demoExampleExamDate = () => daysFromToday(35)

export const daysBetween = (from: string, to: string) => Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / 86_400_000)

const addDays = (s: string, n: number) => {
  const d = parseDay(s)
  d.setDate(d.getDate() + n)
  return isoDay(d)
}

export function buildPlan(opts: { subjectId: string; grade: Grade; examDate: string; marks: TopicMark[]; today?: string }): RevisionPlan | null {
  const today = opts.today ?? isoDay(new Date())
  const daysLeft = daysBetween(today, opts.examDate)
  if (!Number.isFinite(daysLeft) || daysLeft < 0) return null

  const markOf = new Map(opts.marks.map((m) => [m.topicId, m.mastery]))
  const topics = topicsForSubject(opts.subjectId, opts.grade).map((t) => {
    const mastery = markOf.get(t.id) ?? null
    return { topicId: t.id, mastery, weight: (100 - (mastery ?? UNTRIED) + FLOOR) ** 2 }
  })
  topics.sort((a, b) => b.weight - a.weight)

  // Days before the exam day itself. The last one or two go to mixed papers.
  const total = daysLeft
  const mixed = total >= 10 ? 2 : total >= 4 ? 1 : 0
  const topicDays = total - mixed

  // How many days each topic gets: proportional to weight, each at least one
  // when there is room for all of them, otherwise only the weakest.
  const count = new Map<string, number>()
  if (topicDays > 0 && topics.length) {
    const chosen = topicDays >= topics.length ? topics : topics.slice(0, topicDays)
    for (const t of chosen) count.set(t.topicId, 1)
    let left = topicDays - chosen.length
    if (left > 0) {
      const sum = chosen.reduce((s, t) => s + t.weight, 0)
      const share = chosen.map((t) => ({ id: t.topicId, exact: (left * t.weight) / sum }))
      for (const s of share) count.set(s.id, count.get(s.id)! + Math.floor(s.exact))
      left -= share.reduce((n, s) => n + Math.floor(s.exact), 0)
      // Largest remainders take the days rounding left over.
      for (const s of share.sort((a, b) => (b.exact % 1) - (a.exact % 1)).slice(0, left)) count.set(s.id, count.get(s.id)! + 1)
    }
  }

  // Spread the sessions out: each day goes to the topic furthest behind its
  // fair share so far (smooth weighted round-robin), so a topic with 6 of 20
  // days comes round every three or four days rather than six days running.
  const order: string[] = []
  const credit = new Map([...count.keys()].map((id) => [id, 0]))
  const remaining = new Map(count)
  for (let i = 0; i < topicDays; i++) {
    let best: string | null = null
    for (const [id, n] of count) {
      if (!remaining.get(id)) continue
      credit.set(id, credit.get(id)! + n)
      if (best === null || credit.get(id)! > credit.get(best)!) best = id
    }
    if (!best) break
    credit.set(best, credit.get(best)! - topicDays)
    remaining.set(best, remaining.get(best)! - 1)
    order.push(best)
  }

  const seen = new Map<string, number>()
  const days: PlanDay[] = order.map((topicId, i) => {
    const session = (seen.get(topicId) ?? 0) + 1
    seen.set(topicId, session)
    const names = subtopicsAt(topicId)
    return {
      date: addDays(today, i),
      kind: 'topic',
      topicId,
      subtopic: names.length ? names[(session - 1) % names.length] : null,
      session,
      sessions: count.get(topicId)!,
    }
  })
  for (let i = 0; i < mixed; i++)
    days.push({ date: addDays(today, topicDays + i), kind: 'mixed', topicId: null, subtopic: null, session: i + 1, sessions: mixed })

  return {
    examDate: opts.examDate,
    daysLeft,
    days,
    focus: topics.map((t) => ({ topicId: t.topicId, mastery: t.mastery, days: count.get(t.topicId) ?? 0 })),
  }
}

/** A topic's sub-topic names, in the order the curriculum lists them. */
function subtopicsAt(topicId: string): string[] {
  return [...new Set(subtopicRulesFor(topicId).map((r) => r.name))]
}

/** A small, stable hash, so a day's questions are the same every time it is opened. */
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function pick(list: Question[], seed: string, n: number): Question[] {
  return list
    .map((q) => ({ q, k: hash(`${seed}:${q.id}`) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, n)
    .map((x) => x.q)
}

/**
 * Three questions for a day. Early in the plan they lean Easy and Moderate;
 * in the last weeks Moderate and Challenge. A mixed day draws from every topic,
 * weakest first.
 */
export async function questionsForDay(
  plan: RevisionPlan,
  day: PlanDay,
  subjectId: string,
  grade: Grade,
): Promise<Question[]> {
  const index = plan.days.indexOf(day)
  const progress = plan.days.length > 1 ? index / (plan.days.length - 1) : 1
  const levels: Difficulty[] = progress < 0.34 ? ['Easy', 'Moderate', 'Moderate'] : progress < 0.67 ? ['Moderate', 'Moderate', 'Challenge'] : ['Moderate', 'Challenge', 'Challenge']
  const seed = `${day.date}:${day.topicId ?? 'mixed'}`
  // Loaded here, not at the top: Home shows the countdown and should not pull
  // in the question bank to do it.
  const { filterSubjectQuestions } = await import('@/data/questionBank')

  if (day.kind === 'mixed') {
    const pool = await filterSubjectQuestions(subjectId, { grade })
    const weakest = plan.focus.slice(0, 3).map((f) => f.topicId)
    const out: Question[] = []
    weakest.forEach((topicId, i) => {
      const from = pool.filter((q) => q.topicId === topicId && !out.includes(q))
      const atLevel = from.filter((q) => q.difficulty === levels[i])
      out.push(...pick(atLevel.length ? atLevel : from, `${seed}:${i}`, 1))
    })
    return out
  }

  const pool = await filterSubjectQuestions(subjectId, { topicId: day.topicId!, grade })
  const inSub = day.subtopic ? pool.filter((q) => subtopicFor(q) === day.subtopic) : []
  const from = inSub.length >= 3 ? inSub : pool
  const out: Question[] = []
  levels.forEach((level, i) => {
    const rest = from.filter((q) => !out.includes(q))
    const atLevel = rest.filter((q) => q.difficulty === level)
    out.push(...pick(atLevel.length ? atLevel : rest, `${seed}:${i}`, 1))
  })
  return out
}

export const topicName = (id: string | null) => (id ? getTopic(id)?.name ?? id : 'Mixed exam practice')

// ---- What is kept on the phone ------------------------------------------------

const dateKey = (scope: string, subjectId: string, grade: Grade) => `donewell-exam-date:${scope}:${subjectId}:${grade}`
const doneKey = (scope: string, subjectId: string, grade: Grade) => `donewell-revision-done:${scope}:${subjectId}:${grade}`

export function loadExamDate(scope: string, subjectId: string, grade: Grade): string | null {
  try {
    return localStorage.getItem(dateKey(scope, subjectId, grade))
  } catch {
    return null
  }
}

export function saveExamDate(scope: string, subjectId: string, grade: Grade, date: string | null) {
  try {
    if (date) localStorage.setItem(dateKey(scope, subjectId, grade), date)
    else localStorage.removeItem(dateKey(scope, subjectId, grade))
  } catch {
    // Private browsing: the plan still works for this visit.
  }
}

export function loadDone(scope: string, subjectId: string, grade: Grade): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(doneKey(scope, subjectId, grade)) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

export function saveDone(scope: string, subjectId: string, grade: Grade, done: Set<string>) {
  try {
    localStorage.setItem(doneKey(scope, subjectId, grade), JSON.stringify([...done]))
  } catch {
    // as above
  }
}
