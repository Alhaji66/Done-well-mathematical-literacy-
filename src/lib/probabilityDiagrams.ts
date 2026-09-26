import type { Prob, Question, TreeBranch, TreeSpec, VennRegion, VennSpec } from '@/types'

/**
 * Tree diagrams and Venn diagrams for the probability questions.
 *
 * Built from the question's own words rather than typed in beside it. Every one
 * of these questions already states its numbers -- "a bag contains 6 red and 4
 * blue counters", "18 play soccer, 12 play netball and 5 play both" -- and a
 * diagram typed a second time could disagree with them. Reading them off the
 * words means the picture and the question cannot drift apart, and a new
 * question written in the same shape gets its diagram for nothing.
 *
 * They are shown WITH THE ANSWER, never beside the question. A finished tree
 * carries every product the learner is asked to find, and a filled-in Venn
 * diagram has the "neither" number sitting in its corner: shown up front, both
 * would answer the question before it was attempted. After the attempt they are
 * the memo -- the working a marker wants to see, drawn out.
 *
 * `npm run check:probability` reads every diagram back against the memo: the
 * highlighted branches or regions must add up to a number the answer states.
 */

const text = (q: Pick<Question, 'prompt' | 'context'>) => [q.context ?? '', q.prompt].join(' ')

/** "0,17" and "0.17" alike. */
const num = (s: string) => Number(s.replace(',', '.'))

/** Rounded to 6 places, so 0,17 + 0,14 is 0,31 and not 0,31000000000000005. */
const tidy = (v: number) => Math.round(v * 1e6) / 1e6

export const probValue = (p: Prob) => (typeof p === 'number' ? p : p[0] / p[1])

/* ------------------------------------------------------------------ */
/* Trees                                                               */
/* ------------------------------------------------------------------ */

/** Two draws from a bag of red and blue, with or without putting the first back. */
export function bagTree(red: number, blue: number, item: string, replaced: boolean): TreeSpec {
  const n = red + blue
  const second = (r: number, b: number, m: number): TreeBranch[] => [
    { label: 'R', name: 'red', p: [r, m] },
    { label: 'B', name: 'blue', p: [b, m] },
  ]
  return {
    title: `${replaced ? 'With' : 'Without'} replacement: ${red} red and ${blue} blue ${item}s`,
    stages: [`1st ${item}`, `2nd ${item}`],
    branches: replaced
      ? [
          { label: 'R', name: 'red', p: [red, n], next: second(red, blue, n) },
          { label: 'B', name: 'blue', p: [blue, n], next: second(red, blue, n) },
        ]
      : [
          { label: 'R', name: 'red', p: [red, n], next: second(red - 1, blue, n - 1) },
          { label: 'B', name: 'blue', p: [blue, n], next: second(red, blue - 1, n - 1) },
        ],
  }
}

/** Two independent trials of the same event, each with probability p. */
export function repeatTree(
  title: string,
  stages: [string, string],
  yes: { label: string; name: string },
  no: { label: string; name: string },
  p: Prob,
): TreeSpec {
  const q: Prob = typeof p === 'number' ? tidy(1 - p) : [p[1] - p[0], p[1]]
  const stage = (): TreeBranch[] => [
    { ...yes, p },
    { ...no, p: q },
  ]
  return {
    title,
    stages,
    branches: [
      { ...yes, p, next: stage() },
      { ...no, p: q, next: stage() },
    ],
  }
}

/**
 * Which complete paths the question is asking about. Only one event is picked
 * out: a question that asks for "both red, and both blue" is two questions, and
 * highlighting four leaves at once would suggest they are to be added.
 */
function treeEvent(prompt: string): { paths: string[]; name: string } | null {
  const events: { paths: string[]; name: string }[] = []
  const has = (re: RegExp) => re.test(prompt)
  if (has(/same colour/i)) events.push({ paths: ['RR', 'BB'], name: 'same colour' })
  if (has(/different colours?/i)) events.push({ paths: ['RB', 'BR'], name: 'different colours' })
  if (has(/at least one (?:is |of them is )?blue/i)) events.push({ paths: ['RB', 'BR', 'BB'], name: 'at least one blue' })
  if (has(/at least one (?:is |of them is )?red/i)) events.push({ paths: ['RR', 'RB', 'BR'], name: 'at least one red' })
  // "Show that red-then-blue equals blue-then-red" compares two paths rather
  // than adding them, so it is left unhighlighted: a sum under the tree would
  // be a number the question never asks for.
  if (!events.length && !(has(/red then blue/i) && has(/blue then red/i))) {
    if (has(/\bboth\b[\w ]{0,20}?\bred\b/i)) events.push({ paths: ['RR'], name: 'both red' })
    if (has(/\bboth\b[\w ]{0,20}?\bblue\b/i)) events.push({ paths: ['BB'], name: 'both blue' })
  }
  return events.length === 1 ? events[0] : null
}

export function treesFor(q: Pick<Question, 'id' | 'prompt' | 'context'>): TreeSpec[] {
  const override = treeOverrides[q.id]
  if (override) return override
  const t = text(q)

  // A fair coin tossed twice.
  if (/coin is tossed twice|tossed twice|two coins are tossed/i.test(t)) {
    return [repeatTree('A fair coin tossed twice', ['1st toss', '2nd toss'], { label: 'H', name: 'heads' }, { label: 'T', name: 'tails' }, [1, 2])]
  }

  // A bag of red and blue, two drawn.
  const bag = t.match(/(\d+) red(?: (?:marbles|balls|counters))? and (\d+) blue/i) ?? t.match(/\((\d+) red, (\d+) blue\)/i)
  if (!bag || !/\b(two|second|both)\b/i.test(t)) return []
  const red = Number(bag[1])
  const blue = Number(bag[2])
  const item = t.match(/\b(marble|ball|counter)s?\b/i)?.[1].toLowerCase() ?? 'counter'

  // "without replacement", "NOT replaced" -- and, separately, any mention of
  // putting it back. A question comparing the two gets both trees.
  const without = /without replacement|not replaced/i.test(t)
  const withBack = /\breplaced\b|with replacement/i.test(t.replace(/without replacement|not replaced/gi, ''))
  const trees: TreeSpec[] = []
  if (without) trees.push(bagTree(red, blue, item, false))
  if (withBack) trees.push(bagTree(red, blue, item, true))
  const event = treeEvent(q.prompt)
  return trees.map((tree) => (event ? { ...tree, highlight: event.paths, highlightName: event.name } : tree))
}

/** Questions whose tree cannot be read off a pattern, written out once. */
const treeOverrides: Record<string, TreeSpec[]> = {
  // Empty for now. Its one entry, 'ml-p2-24-1-11' (two independent lucky
  // draws), went when the 2024 Paper 2 was rebuilt in the NSC format. Keep the
  // map: it is where the next question whose tree has no pattern goes.
}

/* ------------------------------------------------------------------ */
/* Venn diagrams                                                       */
/* ------------------------------------------------------------------ */

const VERB = '(?:play|plays|like|likes|take|takes|study|studies|chose|choose|own|owns|have|has|read|reads|watch|watches|use|uses|prefer|prefers|enjoy|enjoys)'
const AMOUNT = '(\\d+)(%)?(?: of (?:the )?\\w+)?'
const SET = '([A-Za-z][\\w ]*?)(?: \\(([A-Za-z]{1,2})\\))?'
/** "18 play soccer, 12 play netball and 5 play both" -- and "... 6 play neither". */
const THREE_CLAUSES = new RegExp(`${AMOUNT} ${VERB} ${SET},?(?: and)? (\\d+)%? ${VERB} ${SET},?(?: and)? (\\d+)%? (?:${VERB} )?(both|neither)`, 'i')

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** A one- or two-letter symbol for a set: the question's own if it gives one. */
function symbols(a: string, b: string, givenA?: string, givenB?: string): [string, string] {
  if (givenA && givenB) return [givenA, givenB]
  const own = (s: string) => s.match(/^Subject (\w)$/)?.[1]
  const sa = own(a) ?? a.charAt(0).toUpperCase()
  const sb = own(b) ?? b.charAt(0).toUpperCase()
  if (sa !== sb) return [sa, sb]
  return [cap(a.slice(0, 2)), cap(b.slice(0, 2))]
}

function vennEvent(prompt: string, spec: VennSpec): { regions: VennRegion[]; name: string } | null {
  const events: { regions: VennRegion[]; name: string }[] = []
  // "takes Geography only", "only soccer"
  spec.sets.forEach((set, i) => {
    const n = set.name.toLowerCase()
    if (new RegExp(`\\b${n} only\\b|\\bonly ${n}\\b`, 'i').test(prompt))
      events.push({ regions: [i === 0 ? 'onlyA' : 'onlyB'], name: `${n} only` })
  })
  // "Mutually exclusive, independent, or neither" is a verdict, not the region.
  const neither = /(?<!or )\bneither\b/i.test(prompt)
  if (neither) events.push({ regions: ['neither'], name: 'neither' })
  if (/exactly one/i.test(prompt)) events.push({ regions: ['onlyA', 'onlyB'], name: 'exactly one' })
  if (/how many (?:\w+ )*(?:play|like|take)s? both/i.test(prompt)) events.push({ regions: ['both'], name: 'both' })
  if (/determine P\(A and B\)/i.test(prompt)) events.push({ regions: ['both'], name: 'A and B' })
  if (!neither && /\b(either|at least one)\b|\b(?!more\b|less\b)\w+ or (?!less\b|more\b)\w+/i.test(prompt))
    events.push({ regions: ['onlyA', 'both', 'onlyB'], name: 'at least one' })
  return events.length === 1 ? events[0] : null
}

export function countsVenn(
  title: string,
  names: [string, string],
  syms: [string, string],
  unit: 'count' | '%',
  total: number,
  a: number,
  b: number,
  both: number,
): VennSpec | null {
  const spec: VennSpec = {
    title,
    sets: [
      { name: cap(names[0]), symbol: syms[0] },
      { name: cap(names[1]), symbol: syms[1] },
    ],
    unit,
    total,
    onlyA: a - both,
    both,
    onlyB: b - both,
    neither: total - (a + b - both),
  }
  // A region below zero means the words do not describe a possible group --
  // better no diagram than a wrong one. check:probability lists these.
  return [spec.onlyA, spec.both, spec.onlyB, spec.neither].every((v) => v >= 0) ? spec : null
}

/** The Venn diagram for a question, or null when it does not describe two overlapping sets. */
export function vennFor(q: Pick<Question, 'id' | 'prompt' | 'context' | 'answer'>): VennSpec | null {
  const spec = vennOverrides[q.id]?.() ?? vennFromText(q)
  if (!spec) return null
  const event = vennEvent(q.prompt, spec)
  return event ? { ...spec, highlight: event.regions, highlightName: event.name } : spec
}

function vennFromText(q: Pick<Question, 'prompt' | 'context' | 'answer'>): VennSpec | null {
  const t = text(q)

  // Counts or percentages of a group.
  const m = t.match(THREE_CLAUSES)
  if (m) {
    const [, a, pct, nameA, symA, b, nameB, symB, c, which] = m
    const unit = pct ? '%' : 'count'
    const total = unit === '%' ? 100 : Number(t.match(/\b(?:class|group|survey|team|school|club) of (\d+)\b/i)?.[1] ?? t.match(/\b(\d+) learners\b/i)?.[1] ?? NaN)
    if (!Number.isFinite(total)) return null
    const clean = (s: string) => s.replace(/\bsubjects?\b|\bsports?\b/gi, '').trim()
    const names: [string, string] = [clean(nameA), clean(nameB)]
    const both = which.toLowerCase() === 'both' ? Number(c) : Number(a) + Number(b) - (total - Number(c))
    const who = unit === '%' ? 'a group' : `${total} learners`
    return countsVenn(`Venn diagram: ${who}, ${names[0]} and ${names[1]}`, names, symbols(names[0], names[1], symA, symB), unit, total, Number(a), Number(b), both)
  }

  // Probabilities of two events A and B.
  const pa = t.match(/P\(A\) = (\d+[,.]?\d*)/)
  const pb = t.match(/P\(B\) = (\d+[,.]?\d*)/)
  if (pa && pb) {
    const a = num(pa[1])
    const b = num(pb[1])
    let both: number | null = null
    let disjoint = false
    if (/mutually exclusive/i.test(t) && !/whether (?:A and B|they|the events) are mutually exclusive/i.test(t)) {
      both = 0
      disjoint = true
    } else {
      const inter = t.match(/P\(A and B\) = (\d+[,.]?\d*)/)
      const union = t.match(/P\(A or B\) = (\d+[,.]?\d*)/)
      if (inter) both = num(inter[1])
      else if (union) both = tidy(a + b - num(union[1]))
      else if (/\bindependent\b/i.test(t) && !/whether/i.test(t)) both = tidy(a * b)
    }
    if (both === null) return null
    const spec: VennSpec = {
      title: disjoint ? 'Venn diagram: A and B are mutually exclusive' : 'Venn diagram: events A and B',
      sets: [
        { name: 'A', symbol: 'A' },
        { name: 'B', symbol: 'B' },
      ],
      unit: 'p',
      total: 1,
      onlyA: tidy(a - both),
      both,
      onlyB: tidy(b - both),
      neither: tidy(1 - (a + b - both)),
      disjoint,
    }
    return [spec.onlyA, spec.both, spec.onlyB, spec.neither].every((v) => v >= 0) ? spec : null
  }

  // Worked in the answer as P(X) = a/N, P(Y) = b/N, P(X and Y) = c/N -- the
  // pack of cards, where the counts come from knowing the pack.
  const ps = new Map<string, [number, number]>()
  for (const f of q.answer.matchAll(/P\(([^()=]+?)\) = (\d+)\/(\d+)/g)) ps.set(f[1].trim(), [Number(f[2]), Number(f[3])])
  for (const [key, [c, n]] of ps) {
    const parts = key.split(' and ')
    if (parts.length !== 2) continue
    const [x, y] = parts
    const fx = ps.get(x)
    const fy = ps.get(y)
    if (!fx || !fy || fx[1] !== n || fy[1] !== n) continue
    const unitName = /card/i.test(t) ? 'cards' : 'outcomes'
    return countsVenn(`Venn diagram: ${n} ${unitName}, ${x} and ${y}`, [x, y], symbols(x, y), 'count', n, fx[0], fy[0], c)
  }
  return null
}

/**
 * Follow-up questions that say "using the information in 5.3": the numbers are
 * in the question before, which this one cannot see, so they are restated here
 * -- from that question's context, word for word.
 */
const vennOverrides: Record<string, () => VennSpec | null> = {
  // 5.3: "In a class of 30 learners, 18 take Geography (G) and 15 take History (H), and 8 take both subjects."
  'math-g10-p1-a-5-5': () => countsVenn('Venn diagram: 30 learners, Geography and History', ['Geography', 'History'], ['G', 'H'], 'count', 30, 18, 15, 8),
  // 5.3: "In a class of 38 learners, 24 take Geography (G) and 21 take History (H), and 15 take both subjects."
  'math-g10-p1-22-5-5': () => countsVenn('Venn diagram: 38 learners, Geography and History', ['Geography', 'History'], ['G', 'H'], 'count', 38, 24, 21, 15),
}

/** Everything to draw for one question, with its answer. */
export function probabilityDiagramsFor(q: Pick<Question, 'id' | 'topicId' | 'prompt' | 'context' | 'answer'>) {
  if (q.topicId !== 'math-counting-probability' && q.topicId !== 'data-handling') return { trees: [], venn: null }
  return { trees: treesFor(q), venn: vennFor(q) }
}
