/** Held-out sample: every 12th item at OFFSET 6, disjoint from the set the rule was built on. */
import { papersForSubject } from '../src/data/papers/index.ts'
const FINAL_JUDGEMENT =
  /,\s*and\s+(state|say|explain|comment on|decide|justify|give (a|one) reason)\b[^.]*\.?\s*$/i
const list: any[] = (await papersForSubject('mat-lit')) as any
const hits: any[] = []
for (const p of list) for (const s of p.sections) for (const i of s.items)
  if (i.cognitiveLevel === 3 && FINAL_JUDGEMENT.test(i.prompt)) hits.push(i)
hits.sort((a, b) => a.id.localeCompare(b.id))
for (let n = 6; n < hits.length; n += 12) {
  const i = hits[n]
  const clause = i.prompt.match(FINAL_JUDGEMENT)![0].replace(/^,\s*and\s+/i, '')
  console.log(`'${i.id}': [${i.marks}mk] ${clause.trim()}`)
}
