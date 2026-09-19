import { questionsForSubject } from '../src/data/questionBank.ts'
const pool = (await questionsForSubject('mat-lit')).filter((q: any) => q.topicId === 'measurement')
const OTHER = /\b(volume|capacity|litre|litres|cubic|fill(ed)? (the|a)? ?(tank|container)|m³|cm³)\b/i
let onlyHolds = 0
for (const q of pool) {
  const text = `${q.prompt} ${q.context ?? ''}`
  if (!/\bholds?\b/i.test(text)) continue
  if (OTHER.test(text)) continue
  onlyHolds++
  const mm = text.match(/.{0,45}\bholds?\b.{0,45}/i)
  console.log(`  ${q.id}  …${mm?.[0]}…`)
}
console.log(`\n${onlyHolds} measurement questions are placed by "hold(s)" ALONE.`)
