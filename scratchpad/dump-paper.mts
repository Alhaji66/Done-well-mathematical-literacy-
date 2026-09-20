import { papersForSubject } from '../src/data/papers/index.ts'
for (const p of (await papersForSubject('mat-lit')) as any[]) {
  if (p.id !== process.argv[2]) continue
  for (const s of p.sections) for (const i of s.items) {
    console.log(`--- ${i.id} [${i.label}] ${i.marks}mk`)
    console.log(`Q: ${i.prompt}`)
    console.log(`A: ${i.answer}`)
  }
}
