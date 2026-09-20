import { papersForSubject } from '../src/data/papers/index.ts'
const ids = process.argv.slice(2)
for (const s of ['mat-lit', 'mathematics', 'physical-sciences']) {
  const ps: any[] = (await papersForSubject(s)) as any
  for (const p of ps) for (const sec of p.sections) for (const i of sec.items) {
    if (!ids.includes(i.id)) continue
    const extra = [i.memo && 'memo', i.figure && 'figure', i.answerFigure && 'answerFigure'].filter(Boolean)
    if (extra.length) console.log(i.id, 'has', extra.join(','))
  }
}
console.log('checked', ids.length, 'ids')
