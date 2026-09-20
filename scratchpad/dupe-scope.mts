/**
 * Where do repeated questions repeat?
 *
 * Across papers is normal -- a real exam asks "State Ohm's Law" most years,
 * and a learner working through six papers should meet it six times. Inside
 * ONE paper it is a mistake: the same marks awarded twice for the same recall.
 * Across the three predicted sets is a middle case, since a learner is likely
 * to sit A, B and C back to back.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
let samePaper = 0, sameSet = 0, across = 0
const worst: string[] = []
for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const g = new Map<string, any[]>()
  for (const p of list) for (const s of p.sections) for (const i of s.items) {
    const k = `${subject}||${norm(i.prompt)}||${norm(i.context ?? '')}`
    g.set(k, [...(g.get(k) ?? []), { ...i, paper: p.id }])
  }
  for (const [, v] of g) {
    if (v.length < 2) continue
    const papers = new Set(v.map((i: any) => i.paper))
    if (papers.size < v.length) {
      samePaper++
      worst.push(`${subject}  ${v.map((i: any) => i.id).join(' ')}\n      ${v[0].prompt.slice(0, 90)}`)
    } else if ([...papers].every((p) => /pred|set[abc]|-[abc]$/.test(String(p)))) {
      sameSet++
      worst.push(`SET  ${subject}  ${v.map((i: any) => i.id).join(' ')}\n      [${v[0].marks}mk] ${v[0].prompt.slice(0, 92)}`)
    }
    else across++
  }
}
console.log(`repeated INSIDE one paper : ${samePaper} groups  <- these are mistakes`)
console.log(`repeated across pred sets : ${sameSet} groups  <- a learner may meet these back to back`)
console.log(`repeated across years     : ${across} groups  <- normal, a real paper does this`)
if (worst.length) { console.log('\nInside one paper:'); for (const w of worst) console.log(`  ${w}`) }
