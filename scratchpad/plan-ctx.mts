/**
 * For every provably-ambiguous item, find the context it lost and CHECK it.
 *
 * The governing context is the nearest one earlier in the same section. That
 * is a guess about authoring order, so it is verified rather than trusted:
 * the numbers in the candidate context must actually turn up in the item's
 * own worked explanation or answer. "Data set: 12, 15, 9, 18, 15, 21, 15"
 * belongs to an item whose explanation reads "12 + 15 + 9 + 18 + 15 + 21 + 15
 * = 105"; a context from some other question would not match like that.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { writeFileSync } from 'node:fs'

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
const valuesOf = (s: string): number[] => {
  const c = s.replace(/(\d)[  ](?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2')
  return (c.match(/\d+(?:\.\d+)?/g) ?? []).map(Number)
}
const disagree = (a: string, b: string) => {
  const x = valuesOf(a).sort((p, q) => p - q)
  const y = valuesOf(b).sort((p, q) => p - q)
  if (!x.length || !y.length) return false
  for (let k = 0; k < Math.min(x.length, y.length); k++) {
    const sc = Math.max(Math.abs(x[k]), Math.abs(y[k]), 1e-30)
    if (Math.abs(x[k] - y[k]) / sc > 0.01) return true
  }
  return false
}

const out: any[] = []
const unresolved: string[] = []
for (const subject of ['mat-lit', 'mathematics']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const groups = new Map<string, any[]>()
  const where = new Map<string, { sec: any; idx: number; paper: string }>()
  for (const p of list)
    for (const s of p.sections)
      s.items.forEach((i: any, idx: number) => {
        const key = `${norm(i.prompt)}||${norm(i.context ?? '')}`
        groups.set(key, [...(groups.get(key) ?? []), i])
        where.set(i.id, { sec: s, idx, paper: p.id })
      })

  for (const [, v] of groups) {
    if (v.length < 2) continue
    if (!v.some((i: any) => disagree(i.answer, v[0].answer))) continue
    for (const item of v) {
      const w = where.get(item.id)!
      let cand: string | null = null
      for (let k = w.idx - 1; k >= 0; k--) {
        if (w.sec.items[k].context) { cand = w.sec.items[k].context; break }
      }
      if (!cand) { unresolved.push(`${item.id} -- no earlier context in its section`); continue }
      // Verify: the context's numbers must show up in this item's own working.
      const ctxNums = valuesOf(cand)
      const mine = new Set(valuesOf(`${item.explanation} ${item.answer}`).map((n) => n.toFixed(4)))
      const hit = ctxNums.filter((n) => mine.has(n.toFixed(4))).length
      const ratio = ctxNums.length ? hit / ctxNums.length : 0
      if (ratio < 0.6) {
        unresolved.push(`${item.id} -- nearest context matches only ${Math.round(ratio * 100)}% of its working`)
        continue
      }
      out.push({
        subject,
        id: item.id,
        marks: item.marks,
        difficulty: item.difficulty,
        cognitiveLevel: item.cognitiveLevel,
        context: cand,
        prompt: item.prompt,
        answer: item.answer,
        explanation: item.explanation,
      })
    }
  }
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1))
console.log(`${out.length} item(s) can be repaired from a VERIFIED nearest context`)
console.log(`${unresolved.length} need a human:`)
for (const u of unresolved.slice(0, 20)) console.log(`   ${u}`)
