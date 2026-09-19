import { papersForSubject } from '../src/data/papers/index.ts'
const subj = process.argv[2]
const needle = process.argv[3].toLowerCase()
const list: any[] = (await papersForSubject(subj)) as any
for (const p of list) for (const s of p.sections) for (const i of s.items)
  if (i.prompt.toLowerCase().includes(needle)) {
    console.log(`--- ${i.id} (${p.id}) ${i.marks}mk`)
    if (i.context) console.log(`  CTX: ${i.context.slice(0,200)}`)
    console.log(`  Q: ${i.prompt}`)
    console.log(`  A: ${i.answer}`)
    console.log(`  E: ${i.explanation.slice(0,300)}\n`)
  }
