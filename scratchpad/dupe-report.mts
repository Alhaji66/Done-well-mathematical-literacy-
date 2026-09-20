/** Duplicate prompts in one subject, grouped, with marks and topic, worst first. */
import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject(process.argv[2])) as any
const seen = new Map<string, any[]>()
for (const p of list) for (const s of p.sections) for (const i of s.items) {
  const k = i.prompt.trim().toLowerCase().replace(/\s+/g, ' ')
  seen.set(k, [...(seen.get(k) ?? []), i])
}
const dupes = [...seen.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length)
let extra = 0
for (const [, v] of dupes) extra += v.length - 1
console.log(`${dupes.length} repeated prompts; ${extra} items beyond the first occurrence\n`)
for (const [k, v] of dupes) {
  console.log(`×${v.length}  [${v[0].marks}mk ${v[0].topicId}]  ${k.slice(0, 110)}`)
  console.log(`      ${v.map((i: any) => i.id).join(' ')}`)
}
