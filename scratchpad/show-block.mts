import { papersForSubject } from '../src/data/papers/index.ts'
const want = process.argv.slice(2)
for (const subj of ['mathematics', 'physical-sciences']) {
  const ps: any[] = (await papersForSubject(subj)) as any
  for (const p of ps) {
    if (!want.includes(p.id)) continue
    for (const s of p.sections)
      for (const i of s.items) {
        if (!process.env.SEC || i.label?.startsWith(process.env.SEC)) {
          console.log(`[${p.id}] ${i.label} ${i.id} (${i.marks}mk)`)
          if (i.context) console.log('   CTX:', i.context)
          console.log('   Q:', i.prompt)
          console.log('   A:', i.answer)
        }
      }
  }
}
