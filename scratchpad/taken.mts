import { papersForSubject } from '../src/data/papers/index.ts'
const families: [string, number, number, RegExp][] = [
  ['mathematics', 11, 2, /^Simplify without using a calculator:/i],
  ['mathematics', 11, 2, /Chord AB subtends an angle of/i],
  ['mathematics', 11, 2, /OM ⊥ chord AB/i],
  ['physical-sciences', 12, 1, /threshold frequency of/i],
  ['physical-sciences', 12, 2, /Draw the structural formula of/i],
  ['physical-sciences', 12, 2, /empirical formula of/i],
]
for (const [subj, grade, pn, re] of families) {
  const ps: any[] = (await papersForSubject(subj, pn, grade as any)) as any
  const hits = new Set<string>()
  for (const p of ps) for (const s of p.sections) for (const i of s.items) if (re.test(i.prompt)) hits.add(i.prompt.slice(0, 110))
  console.log(`\n=== ${subj} G${grade} P${pn} :: ${re}`)
  for (const h of [...hits].sort()) console.log('   ', h)
}
