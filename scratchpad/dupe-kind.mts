import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject(process.argv[2])) as any
const seen = new Map<string, any[]>()
for (const p of list) for (const s of p.sections) for (const i of s.items) {
  const k = i.prompt.trim().toLowerCase().replace(/\s+/g, ' ')
  seen.set(k, [...(seen.get(k) ?? []), { ...i, paper: p.id }])
}
let sameCtx = 0, diffCtx = 0, extraSame = 0, extraDiff = 0
for (const [, v] of seen) {
  if (v.length < 2) continue
  // Same question AND same context = the learner literally sees it twice.
  const ctxs = new Set(v.map((i: any) => (i.context ?? '').trim().toLowerCase()))
  if (ctxs.size === 1) { sameCtx++; extraSame += v.length - 1 } else { diffCtx++; extraDiff += v.length - 1 }
}
console.log(`identical prompt AND identical context: ${sameCtx} groups, ${extraSame} redundant items`)
console.log(`identical prompt, DIFFERENT context:    ${diffCtx} groups, ${extraDiff} items (answer differs -- not redundant)`)
