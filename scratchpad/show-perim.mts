import { papersForSubject } from '../src/data/papers/index.ts'
const PERIM = /\b(perimeter|circumference)\b/i
const papers: any[] = (await papersForSubject('mat-lit', undefined, 12 as any)) as any
for (const pa of papers) for (const s of pa.sections) for (const i of s.items) {
  if (i.topicId !== 'measurement') continue
  if (!PERIM.test(`${i.prompt} ${i.context ?? ''}`)) continue
  console.log('---', i.id, i.marks, 'mk L' + i.cognitiveLevel, i.difficulty)
  if (i.context) console.log('CTX:', i.context)
  console.log('Q:', i.prompt)
  console.log('A:', i.answer)
  console.log('E:', (i.explanation ?? '').slice(0, 300))
}
