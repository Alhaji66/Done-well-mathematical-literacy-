import { questionsForSubject } from '../src/data/questionBank.ts'
import { subtopicRulesFor } from '../src/data/subtopics.ts'
const pool = (await questionsForSubject('mat-lit')).filter((q: any) => q.topicId === 'measurement')
const cur = subtopicRulesFor('measurement')
const VOL = { name: 'Volume and capacity', match: /\b(volume|capacity|litres?|cubic|fill(ed)? (the|a)? ?(tank|container))\b|m³|\bholds? \d/i }
const AREA = { name: 'Area', match: /\b(area|square metre|tiles? needed|coverage)\b|m²/i }
// C: Area before Volume
const C = cur.flatMap((r) => (r.name === 'Volume and capacity' ? [AREA, VOL] : r.name === 'Area' ? [] : [r]))
const B = cur.map((r) => (r.name === 'Volume and capacity' ? VOL : r.name === 'Area' ? AREA : r))
const place = (rules: any[], q: any) => { const t = `${q.prompt} ${q.context ?? ''}`; for (const r of rules) if (r.match.test(t)) return r.name; return '(unsorted)' }
let n = 0
for (const q of pool) {
  const b = place(B, q), c = place(C, q)
  if (b !== c) { n++; console.log(`${q.id.padEnd(22)} B=${b.padEnd(22)} C=${c}`); console.log('   ', `${q.prompt} ${q.context ?? ''}`.slice(0, 150)) }
}
console.log(`\n${n} differ between B (Volume first) and C (Area first).`)
