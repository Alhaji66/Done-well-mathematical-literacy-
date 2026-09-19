/**
 * Systematic sample of the population about to be re-levelled: Mat Lit items
 * stored at Level 3 whose prompt ENDS on a "and <verb> ..." clause.
 *
 * Every 12th such item, corpus sorted by id, so the sample is reproducible and
 * cannot have been picked. Prints the closing clause only -- that clause is
 * what decides the level, and showing the whole prompt just invites labelling
 * on the arithmetic instead.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
const FINAL_JUDGEMENT =
  /,\s*and\s+(state|say|explain|comment on|decide|justify|give (a|one) reason)\b[^.]*\.?\s*$/i
const list: any[] = (await papersForSubject('mat-lit')) as any
const hits: any[] = []
for (const p of list) for (const s of p.sections) for (const i of s.items)
  if (i.cognitiveLevel === 3 && FINAL_JUDGEMENT.test(i.prompt)) hits.push(i)
hits.sort((a, b) => a.id.localeCompare(b.id))
console.log(`${hits.length} items in the population; sampling every 12th\n`)
for (let n = 0; n < hits.length; n += 12) {
  const i = hits[n]
  const clause = i.prompt.match(FINAL_JUDGEMENT)![0].replace(/^,\s*and\s+/i, '')
  console.log(`'${i.id}': [${i.marks}mk] ${clause.trim()}`)
}
