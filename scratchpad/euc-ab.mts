import { questionsForSubject } from '../src/data/questionBank.ts'
import { subtopicRulesFor } from '../src/data/subtopics.ts'
import { similarityG12 } from '../src/data/similarityG12.ts'
const pool = [...(await questionsForSubject('mathematics')).filter((q) => q.topicId === 'math-euclidean-geometry'), ...similarityG12]
const cur = subtopicRulesFor('math-euclidean-geometry')

const PROP = {
  name: 'Proportionality and the mid-point theorem',
  match: /\b(proportion\w*|mid[- ]?point theorem|divides .* proportionally|ratio of the areas)\b|\b[A-Z] lies on [A-Z]{2}\b[^.]{0,80}\bparallel\b/i,
}
const QUAD = { name: 'Properties of quadrilaterals', match: /\b(parallelogram|rhombus|rectangle|trapezium|kite|quadrilateral)\b|\bsquares?\b(?! units| root| centimetres| metres)/i }
const PROOF = cur.find((r) => r.name === 'Writing a geometry proof')!

// B: proportion configuration recognised, "square units" no longer a quadrilateral,
// and the proof rule moved below the subject-matter rules.
const B = [
  ...cur.filter((r) => r.name !== 'Writing a geometry proof').map((r) => (r.name === PROP.name ? PROP : r.name === QUAD.name ? QUAD : r)),
]
const idx = B.findIndex((r) => r.name === 'Lines, angles and triangles')
B.splice(idx, 0, PROOF)

const place = (rules: any[], q: any) => { const t = `${q.prompt} ${q.context ?? ''}`; for (const r of rules) if (r.match.test(t)) return r.name; return '(unsorted)' }
let moved = 0
for (const q of pool) {
  const a = place(cur, q), b = place(B, q)
  if (a !== b) { moved++; if (moved <= 22) console.log(`G${q.grade} ${q.id.padEnd(24)} ${a}  ->  ${b}\n      ${q.prompt.slice(0, 95)}`) }
}
console.log(`\n${moved} of ${pool.length} move.`)
for (const [label, rules] of [['now', cur], ['B', B]] as const) {
  const c = new Map<string, number>()
  for (const q of pool) { const k = place(rules as any, q); c.set(k, (c.get(k) ?? 0) + 1) }
  console.log(label.padEnd(4), [...c].sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}:${v}`).join('  '))
}
