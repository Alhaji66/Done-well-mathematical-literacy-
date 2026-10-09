import type { Question } from '@/types'

/**
 * An exam question is a section: a table, passage or graph printed once, then
 * sub-questions that all lean on it, often with facts stated along the way
 * ("Data costs R70 per GB."). In the paper that is fine: the candidate has read
 * everything above. Outside it -- topic practice, a worksheet, a weekly test --
 * a sub-question arrived alone, and "Calculate the mean monthly rainfall over
 * the 6 months" came without the rainfall.
 *
 * So a sub-question taken out of its paper brings what a candidate would have
 * read above it, within its own part of the question (2.2.1-2.2.5 share 2.2;
 * 2.3's exchange rates are a different scenario and are left out):
 *
 *   - every table or passage given with an earlier sub-question, in order;
 *   - the plain facts stated in earlier sub-questions ("The family uses all
 *     5 GB over 4 weeks."), but never their questions, never a claim to be
 *     checked ("Themba says ...") and never an "if" that belonged to one part;
 *   - then its own context;
 *   - and, in stimulusIds, the earlier sub-questions nearest first, so the
 *     question card can show a graph, chart, circuit or figure drawn for one
 *     of them when this one has none.
 *
 * Papers themselves are untouched: the paper view already shows the section.
 */

/** 2.2.3 belongs to part 2.2; a two-level label (4.3) names no part of its own. */
const part = (label?: string): string | null => {
  const p = (label ?? '').split('.')
  return p.length >= 3 ? p.slice(0, -1).join('.') : null
}

const ASKS =
  /^(calculate|determine|write|show|explain|what|how|which|why|when|where|who|state|give|verify|name|use|using|find|identify|list|describe|draw|sketch|complete|convert|express|estimate|compare|prove|solve|simplify|factorise|evaluate|hence|if|suppose|assume|predict|discuss|suggest|comment|do|does|is|are|can|would|should|round|work|read|measure|label|plot|choose|select|decide|justify|motivate|tabulate|define|distinguish|classify|tick|circle|match|fill|in|for|by|from|after|before|now|then|also|again|instead|look|refer|study|consider|note|see|answer)\b/i
const NOT_A_FACT = /\b(says|said|claims?|states?|thinks?|believes?|argues?|reckons?|suggests?|random|if|instead|suppose)\b/i

/** The plain, numbered statements in a prompt: the facts a later part may use. */
export function statedFacts(prompt: string): string[] {
  return prompt
    .split(/(?<=[.!])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12 && /\d/.test(s) && !/[?…]$|\.\.\.$/.test(s) && !ASKS.test(s) && !NOT_A_FACT.test(s))
}

export function withSectionStimulus<T extends Question>(items: T[]): T[] {
  const out: T[] = []
  // A new part starts only when the numbering moves from one part to another
  // (2.2.x to 2.3.x). Labels are not always tidy -- 1.1 followed by "1.2.2" --
  // and a stray label must not cut a sub-question off from 1.1's table.
  let group: string | null = null
  let contexts: string[] = []
  let facts: string[] = []
  let earlier: T[] = []
  for (const item of items) {
    const g = part((item as { label?: string }).label)
    if (g !== null && group !== null && g !== group) {
      contexts = []
      facts = []
      earlier = []
    }
    if (g !== null) group = g
    const own = item.context?.trim()
    const shared = contexts.filter((c) => c !== own)
    const carried = facts.filter((f) => !item.prompt.includes(f) && !(own ?? '').includes(f))
    const next: T = { ...item, ownContext: item.context ?? '' }
    const parts = [...shared, ...(carried.length ? [`Earlier in this question: ${carried.join(' ')}`] : []), ...(own ? [own] : [])]
    if (parts.length && (shared.length || carried.length)) next.context = parts.join('\n\n')
    if (earlier.length) {
      next.stimulusIds = earlier.map((q) => q.id).reverse()
      const hasOwn = item.graph || item.figure || item.chart || item.circuit
      if (!hasOwn) {
        const from = [...earlier].reverse().find((q) => q.graph || q.figure || q.chart || q.circuit)
        if (from) Object.assign(next, { graph: from.graph, figure: from.figure, chart: from.chart, circuit: from.circuit })
      }
    }
    out.push(next)
    if (own && !contexts.includes(own)) contexts.push(own)
    for (const f of statedFacts(item.prompt)) if (!facts.includes(f)) facts.push(f)
    earlier.push(item)
  }
  return out
}
