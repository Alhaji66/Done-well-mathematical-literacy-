import { papersForSubject } from '../src/data/papers/index.ts'
const ps: any[] = (await papersForSubject('mathematics', 2, 10 as any)) as any
for (const p of ps) for (const s of p.sections) for (const i of s.items)
  if (/parallelogram/i.test(i.prompt)) console.log(`${i.id} (${i.marks}mk): ${i.prompt.slice(0, 95)}`)
