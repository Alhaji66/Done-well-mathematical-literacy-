import type { Question } from '@/types'

/**
 * Worksheets and tests should read like an exam, not like one question asked
 * six times with different numbers. The pool is built from many papers that
 * share a skeleton, so "Calculate the mean ... over the 6 weeks" and "Determine
 * the range and express it as a percentage of the mean" appear in paper after
 * paper; taken in pool order, a worksheet could be a block of them.
 *
 * So before choosing:
 *   1. one question per TEMPLATE -- the prompt with its numbers taken out;
 *   2. then the questions are interleaved by SKILL (mean, median, mode, a
 *      missing value, quartiles, probability, ...), so each skill present gets
 *      a turn before any skill gets a second one.
 */

/** The prompt with numbers, money and quoted values taken out. */
export function promptTemplate(q: Pick<Question, 'prompt'>): string {
  return q.prompt
    .toLowerCase()
    .replace(/r?\s?\d[\d\s.,]*/g, '#')
    .replace(/[“”"'‘’][^“”"'‘’]{1,40}[“”"'‘’]/g, '"…"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** What a question mainly asks for. The first match wins, most specific first. */
const SKILLS: [string, RegExp][] = [
  ['missing value', /\b(missing|unknown)\b|\bvalue of [a-z]\b|\bdetermine [a-z]\b|\bfind [a-z]\b|what (mark|score|value) must|needs? to (score|get)/i],
  ['quartiles', /quartile|\biqr\b|five-number|box[- ]and[- ]whisker/i],
  ['percentile', /percentile/i],
  ['median', /\bmedian\b/i],
  ['mode', /\bmod(e|al)\b/i],
  ['mean', /\bmean\b|\baverage\b/i],
  ['range', /\brange\b/i],
  ['probability', /probabilit|chance|likely/i],
  ['frequency', /frequenc|tally/i],
  ['graph', /\bgraph|chart|histogram|plot\b/i],
  ['percentage', /percentage|\bper ?cent\b|%/i],
  ['ratio', /\bratio\b|proportion/i],
  ['money', /profit|loss|income|expens|budget|vat|tax|interest|inflation|tariff|cost|price/i],
  ['measurement', /area|volume|perimeter|length|mass|capacity|convert/i],
  ['time', /\btime\b|duration|minutes|hours|clock/i],
  ['explain', /^(explain|why|give a reason|comment|discuss|suggest|verify|justify)/i],
]

export function questionSkill(q: Pick<Question, 'prompt'>): string {
  for (const [skill, re] of SKILLS) if (re.test(q.prompt)) return skill
  return promptTemplate(q).split(' ').slice(0, 2).join(' ')
}

/**
 * One question per template, then interleaved by skill. The order within a
 * skill is kept, so a caller that shuffled or sorted first keeps that order.
 */
export function varied<T extends Pick<Question, 'prompt'>>(qs: T[]): T[] {
  const seen = new Set<string>()
  const groups = new Map<string, T[]>()
  for (const q of qs) {
    const t = promptTemplate(q)
    if (seen.has(t)) continue
    seen.add(t)
    const s = questionSkill(q)
    const g = groups.get(s)
    if (g) g.push(q)
    else groups.set(s, [q])
  }
  const queues = [...groups.values()]
  const out: T[] = []
  for (let round = 0; out.length < seen.size; round++) {
    let added = false
    for (const queue of queues) {
      if (round < queue.length) {
        out.push(queue[round])
        added = true
      }
    }
    if (!added) break
  }
  return out
}
