import { papersForSubject } from '../src/data/papers/index.ts'
const ids = process.argv.slice(2)
for (const s of ['mathematics']) {
  const ps: any[] = (await papersForSubject(s)) as any
  for (const p of ps) for (const sec of p.sections) for (const i of sec.items) if (ids.includes(i.id)) {
    console.log('===', i.id, `[${p.id}]`, i.marks + 'mk')
    console.log('CTX:', i.context ?? '(none)')
    console.log('Q:', i.prompt)
    console.log('A:', i.answer)
  }
}
