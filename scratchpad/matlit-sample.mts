/**
 * Pull a systematic, reproducible sample of Mat Lit items for hand-labelling.
 *
 * Every Nth item of the whole corpus sorted by id -- not a hand-picked
 * selection, and not random, so the same sample comes back every run and
 * nobody (including me) can quietly choose the convenient items.
 *
 * The stored cognitiveLevel is DELIBERATELY NOT PRINTED. A hand label written
 * after seeing the machine's answer is not an independent measurement, and the
 * whole point of this exercise is to find out whether the machine is right.
 */
import { papersForSubject } from '../src/data/papers/index.ts'

const N = Number(process.argv[2] ?? 24)
const list: any[] = (await papersForSubject('mat-lit')) as any
const all = list
  .flatMap((p: any) => p.sections.flatMap((s: any) => s.items.map((i: any) => ({ ...i, grade: p.grade, pn: p.paperNumber, sec: s.title }))))
  .sort((a: any, b: any) => a.id.localeCompare(b.id))

console.log(`${all.length} Mat Lit items; sampling every ${Math.floor(all.length / N)}th\n`)
for (let k = 0; k < N; k++) {
  const i = all[Math.floor((k * all.length) / N)]
  console.log(`[${k + 1}] ${i.id}  G${i.grade}P${i.pn}  ${i.marks}mk  ${i.sec}`)
  if (i.context) console.log(`     CONTEXT: ${String(i.context).slice(0, 180)}`)
  console.log(`     ${i.prompt}`)
  console.log('')
}
