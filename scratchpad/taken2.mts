import { papersForSubject } from '../src/data/papers/index.ts'
const ps: any[] = (await papersForSubject('physical-sciences', 2, 12 as any)) as any
for (const re of [/Calculate the pH of a solution/i, /empirical formula of/i, /Write the Kc expression/i]) {
  const counts = new Map<string, number>()
  for (const p of ps) for (const s of p.sections) for (const i of s.items) if (re.test(i.prompt)) counts.set(i.prompt.slice(0, 100), (counts.get(i.prompt.slice(0, 100)) ?? 0) + 1)
  console.log(`\n=== ${re}`)
  for (const [k, v] of [...counts].sort()) console.log(`   ${v}x  ${k}`)
}
