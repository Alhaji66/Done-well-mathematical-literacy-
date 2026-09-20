import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject(process.argv[2])) as any
for (const p of list) { if (p.id !== process.argv[3]) continue
  for (const s of p.sections) { if (!s.items.some((i: any) => i.id === process.argv[4])) continue
    console.log(`### ${p.id} / ${s.title}`)
    for (const i of s.items) {
      console.log(`  ${i.id.padEnd(22)} [${i.label}] ${i.marks}mk`)
      if (i.context) console.log(`      CTX: ${i.context.replace(/\n/g, ' | ')}`)
      console.log(`      Q: ${i.prompt}`)
      console.log(`      A: ${i.answer.slice(0, 90)}`)
    }
  }
}
