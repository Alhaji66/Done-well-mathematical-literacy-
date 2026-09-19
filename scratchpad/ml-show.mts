import { papersForSubject } from '../src/data/papers/index.ts'
const ids = new Set(process.argv.slice(2))
const list: any[] = (await papersForSubject('mat-lit')) as any
for (const p of list) for (const s of p.sections) for (const i of s.items) if (ids.has(i.id)) {
  console.log(`--- ${i.id} [${i.label}] ${i.marks}mk L${i.cognitiveLevel} ${i.difficulty} topic=${i.topicId}`)
  if (i.context) console.log(`  CTX: ${i.context}`)
  console.log(`  Q: ${i.prompt}`)
  console.log(`  A: ${i.answer}`)
  console.log(`  E: ${i.explanation}\n`)
}
