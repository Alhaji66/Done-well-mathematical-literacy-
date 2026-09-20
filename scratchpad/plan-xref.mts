/**
 * Repair items that name the part they depend on.
 *
 * "Using your answer to 3.1", "the triangle in 2.1", "the accumulated amount
 * (3.3)" all state exactly which item supplies the missing data, so there is
 * no guessing to do: look that label up in the SAME PAPER and carry its
 * question and answer across as context. This is stronger than the
 * nearest-earlier-context rule, which has to be verified statistically because
 * it is an inference about authoring order.
 *
 * The context reads like the cross-reference a real paper would print, so the
 * item still makes sense inside the paper as well as outside it.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { writeFileSync } from 'node:fs'

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
const valuesOf = (s: string): number[] => {
  const c = s.replace(/(\d)[  ](?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2')
  return (c.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).sort((a, b) => a - b)
}
const disagree = (a: string, b: string) => {
  const x = valuesOf(a), y = valuesOf(b)
  if (!x.length || !y.length) return false
  for (let k = 0; k < Math.min(x.length, y.length); k++) {
    const sc = Math.max(Math.abs(x[k]), Math.abs(y[k]), 1e-30)
    if (Math.abs(x[k] - y[k]) / sc > 0.01) return true
  }
  return false
}
/** Labels named in the prompt: "to 3.1", "in 2.1", "(3.3)". */
const refsIn = (prompt: string): string[] => {
  const out = new Set<string>()
  for (const m of prompt.matchAll(/(?:answer to|answers to|in|from|of)\s+(\d+\.\d+)\b/gi)) out.add(m[1])
  for (const m of prompt.matchAll(/\((\d+\.\d+)\)/g)) out.add(m[1])
  return [...out]
}

const out: any[] = []
const left: string[] = []
for (const subject of ['mat-lit', 'mathematics']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const groups = new Map<string, any[]>()
  const byPaper = new Map<string, Map<string, any>>()
  const paperOf = new Map<string, string>()
  for (const p of list) {
    const lbl = new Map<string, any>()
    for (const s of p.sections) for (const i of s.items) { lbl.set(String(i.label), i); paperOf.set(i.id, p.id) }
    byPaper.set(p.id, lbl)
    for (const s of p.sections) for (const i of s.items)
      groups.set(`${norm(i.prompt)}||${norm(i.context ?? '')}`, [...(groups.get(`${norm(i.prompt)}||${norm(i.context ?? '')}`) ?? []), i])
  }
  for (const [, v] of groups) {
    if (v.length < 2) continue
    if (!v.some((i: any) => disagree(i.answer, v[0].answer))) continue
    for (const item of v) {
      const refs = refsIn(item.prompt)
      const lbl = byPaper.get(paperOf.get(item.id)!)!
      const parts = refs.map((r) => lbl.get(r)).filter(Boolean)
      if (!parts.length || parts.length !== refs.length) { left.push(item.id); continue }
      const ctx = parts.map((p: any) => `${p.label} ${p.prompt} — ${p.answer}`).join('\n')
      out.push({
        subject, id: item.id, marks: item.marks, difficulty: item.difficulty,
        cognitiveLevel: item.cognitiveLevel, context: ctx,
        prompt: item.prompt, answer: item.answer, explanation: item.explanation,
      })
    }
  }
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1))
console.log(`${out.length} repaired from a NAMED cross-reference; ${left.length} still unresolved`)
for (const o of out.slice(0, 3)) console.log(`   ${o.id}\n      CTX: ${o.context.replace(/\n/g, ' | ').slice(0, 130)}`)
