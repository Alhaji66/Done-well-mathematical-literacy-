import { papersForSubject } from '../src/data/papers/index.ts'
import { filterSubjectQuestions } from '../src/data/questionBank.ts'

// Perimeter across Mat Lit, by grade, papers + bank
const PERIM = /\b(perimeter|circumference)\b/i
for (const grade of [10, 11, 12]) {
  const papers: any[] = (await papersForSubject('mat-lit', undefined, grade as any)) as any
  let p = 0, tot = 0
  for (const pa of papers) for (const s of pa.sections) for (const i of s.items) {
    if (i.topicId !== 'measurement') continue
    tot++
    if (PERIM.test(`${i.prompt} ${i.context ?? ''}`)) p++
  }
  const bank = (await filterSubjectQuestions('mat-lit', { grade: grade as any })).filter((q: any) => q.topicId === 'measurement')
  const bp = bank.filter((q: any) => PERIM.test(`${q.prompt} ${q.context ?? ''}`)).length
  console.log(`Mat Lit G${grade} measurement: papers ${p}/${tot} perimeter, bank ${bp}/${bank.length}`)
}
