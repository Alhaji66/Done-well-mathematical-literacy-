/** A/B the Measurement rules: current, superscripts fixed, and holds? handled. */
import { questionsForSubject } from '../src/data/questionBank.ts'
import { subtopicRulesFor } from '../src/data/subtopics.ts'

const pool = (await questionsForSubject('mat-lit')).filter((q: any) => q.topicId === 'measurement')
const current = subtopicRulesFor('measurement')

const variant = (holds: RegExp | null) =>
  current.map((r) => {
    if (r.name === 'Volume and capacity')
      return {
        name: r.name,
        match: holds
          ? new RegExp(`\\b(volume|capacity|litres?|cubic|fill(ed)? (the|a)? ?(tank|container))\\b|m³|${holds.source}`, 'i')
          : /\b(volume|capacity|litres?|cubic|fill(ed)? (the|a)? ?(tank|container))\b|m³/i,
      }
    if (r.name === 'Area') return { name: r.name, match: /\b(area|square metre|tiles? needed|coverage)\b|m²/i }
    return r
  })

const place = (rules: any[], q: any) => {
  const text = `${q.prompt} ${q.context ?? ''}`
  for (const r of rules) if (r.match.test(text)) return r.name
  return '(scorer/unsorted)'
}

const A = variant(null)
const B = variant(/\bholds? \d/)

let movedA = 0, movedB = 0
const rows: string[] = []
for (const q of pool) {
  const c = place(current, q)
  const a = place(A, q)
  const b = place(B, q)
  if (c !== a || c !== b) {
    if (c !== a) movedA++
    if (c !== b) movedB++
    rows.push(`${q.id.padEnd(22)} now=${c.padEnd(26)} A=${a.padEnd(26)} B=${b}`)
  }
}
console.log(rows.slice(0, 60).join('\n'))
console.log(`\n${pool.length} measurement questions. A moves ${movedA}, B moves ${movedB}.`)
for (const [label, rules] of [['now', current], ['A', A], ['B', B]] as const) {
  const counts = new Map<string, number>()
  for (const q of pool) { const n = place(rules as any, q); counts.set(n, (counts.get(n) ?? 0) + 1) }
  console.log(label.padEnd(4), [...counts].sort((x, y) => y[1] - x[1]).map(([n, c]) => `${n}:${c}`).join('  '))
}
