import { questionsForSubject } from '../src/data/questionBank.ts'
import { subtopicRulesFor } from '../src/data/subtopics.ts'
const pool = (await questionsForSubject('mat-lit')).filter((q: any) => q.topicId === 'measurement')
const cur = subtopicRulesFor('measurement')
const AREA = { name: 'Area', match: /\b(area|square metre|tiles? needed|coverage)\b|m²/i }
const mk = (m: RegExp) => cur.map((r) => (r.name === 'Volume and capacity' ? { name: r.name, match: m } : r.name === 'Area' ? AREA : r))
const A = mk(/\b(volume|capacity|litres?|cubic|fill(ed)? (the|a)? ?(tank|container))\b|m³/i)
const D = mk(/\b(volume|capacity|litres?|cubic|fill(ed)? (the|a)? ?(tank|container)|fits? (in|into|inside)|packed (in|into|inside))\b|m³/i)
const place = (rules: any[], q: any) => { const t = `${q.prompt} ${q.context ?? ''}`; for (const r of rules) if (r.match.test(t)) return r.name; return '(unsorted)' }
for (const q of pool) {
  const a = place(A, q), d = place(D, q)
  if (a !== d) { console.log(`${q.id.padEnd(22)} A=${a.padEnd(24)} D=${d}`); console.log('   ', `${q.prompt} ${q.context ?? ''}`.slice(0, 160)) }
}
