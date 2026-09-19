import { questionsForSubject } from '../src/data/questionBank.ts'
const pool = await questionsForSubject('mat-lit')
for (const id of ['ml-p2-a-4-3','ml-p2-b-4-3','ml-p2-25-4-2','ml-p1-20-2-3','ml-g10-p1-25-2-5','ml-g10-p1-23-2-7']) {
  const q: any = pool.find((x: any) => x.id === id)!
  console.log('---', id)
  console.log('CTX:', q.context ?? '(none)')
  console.log('Q:', q.prompt)
}
