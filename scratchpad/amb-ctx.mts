/** One ambiguous group, with each item's section-mates that DO carry context. */
import { papersForSubject } from '../src/data/papers/index.ts'
const subj = process.argv[2]
const needle = process.argv[3].toLowerCase()
const list: any[] = (await papersForSubject(subj)) as any
for (const p of list) for (const s of p.sections) {
  const n = s.items.findIndex((i: any) => i.prompt.toLowerCase().includes(needle))
  if (n === -1) continue
  console.log(`### ${p.id} / ${s.title}`)
  s.items.forEach((i: any, k: number) => {
    const mark = k === n ? '>>>' : '   '
    console.log(`${mark} ${i.id.padEnd(22)} ctx=${i.context ? 'YES' : 'no '}  ${i.prompt.slice(0, 70)}`)
    if (i.context && k <= n) console.log(`        CTX: ${i.context.slice(0, 160).replace(/\n/g, ' | ')}`)
  })
  console.log()
  break
}
