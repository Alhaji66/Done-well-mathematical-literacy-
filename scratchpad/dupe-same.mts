/** Groups where prompt AND context match -- the learner sees the same question twice. */
import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject(process.argv[2])) as any
const seen = new Map<string, any[]>()
for (const p of list) for (const s of p.sections) for (const i of s.items)
  seen.set(i.prompt.trim().toLowerCase().replace(/\s+/g, ' '), [...(seen.get(i.prompt.trim().toLowerCase().replace(/\s+/g,' ')) ?? []), { ...i, paper: p.id }])
let n = 0
for (const [k, v] of [...seen.entries()].sort((a, b) => b[1].length - a[1].length)) {
  if (v.length < 2) continue
  if (new Set(v.map((i: any) => (i.context ?? '').trim().toLowerCase())).size !== 1) continue
  const answers = new Set(v.map((i: any) => i.answer.trim()))
  n++
  console.log(`×${v.length} [${v[0].marks}mk ${v[0].topicId}] answers:${answers.size}  ${k.slice(0, 88)}`)
  console.log(`     ctx: ${(v[0].context ?? '(none)').slice(0, 88).replace(/\n/g, ' | ')}`)
  console.log(`     ${v.map((i: any) => i.id).join(' ')}`)
}
console.log(`\n${n} groups where prompt and context are both identical`)
