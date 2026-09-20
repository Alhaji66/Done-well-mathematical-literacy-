import { papersForSubject } from '../src/data/papers/index.ts'
for (const s of ['mat-lit']) for (const p of (await papersForSubject(s)) as any[]) {
  if (!String(p.id).includes('pred-a')) continue
  const n = p.sections.reduce((a: number, x: any) => a + x.items.length, 0)
  const mk = p.sections.reduce((a: number, x: any) => a + x.items.reduce((b: number, i: any) => b + i.marks, 0), 0)
  console.log(`${p.id.padEnd(22)} G${p.grade} P${p.paperNumber}  ${n} items, ${mk} marks`)
}
