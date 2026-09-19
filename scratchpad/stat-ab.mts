import { questionsForSubject } from '../src/data/questionBank.ts'
import { subtopicRulesFor } from '../src/data/subtopics.ts'
const pool = (await questionsForSubject('mathematics')).filter((q) => q.topicId === 'math-statistics')
const cur = subtopicRulesFor('math-statistics')
const B = cur.map((r) =>
  r.name === 'Grouped data, histograms and frequency polygons'
    ? { name: r.name, match: /\b(histogram|grouped\w*|class interval\w*|frequency polygon|modal class|midpoint of each)\b/i }
    : r,
)
const place = (rules: any[], q: any) => { const t = `${q.prompt} ${q.context ?? ''}`; for (const r of rules) if (r.match.test(t)) return r.name; return '(unsorted)' }
let moved = 0
for (const q of pool) {
  const a = place(cur, q), b = place(B, q)
  if (a !== b) { moved++; console.log(`G${q.grade} ${q.id.padEnd(24)} ${a} -> ${b}\n     ${q.prompt.slice(0, 90)}`) }
}
console.log(`\n${moved} of ${pool.length} move.`)
