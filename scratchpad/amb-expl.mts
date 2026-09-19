import { papersForSubject } from '../src/data/papers/index.ts'
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
const valuesOf = (s: string): number[] => {
  const c = s.replace(/(\d)[  ](?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2')
  return (c.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).sort((a, b) => a - b)
}
const disagree = (a: string, b: string) => {
  const x = valuesOf(a), y = valuesOf(b)
  if (!x.length || !y.length) return false
  for (let k = 0; k < Math.min(x.length, y.length); k++) {
    const sc = Math.max(Math.abs(x[k]), Math.abs(y[k]), 1e-30)
    if (Math.abs(x[k] - y[k]) / sc > 0.01) return true
  }
  return false
}
for (const subject of ['mat-lit', 'mathematics']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const g = new Map<string, any[]>()
  for (const p of list) for (const s of p.sections) for (const i of s.items)
    g.set(`${norm(i.prompt)}||${norm(i.context ?? '')}`, [...(g.get(`${norm(i.prompt)}||${norm(i.context ?? '')}`) ?? []), i])
  for (const [, v] of g) {
    if (v.length < 2 || !v.some((i: any) => disagree(i.answer, v[0].answer))) continue
    console.log(`\n## ${v[0].prompt}`)
    for (const i of v) console.log(`   ${i.id.padEnd(22)} E: ${i.explanation.slice(0, 120)}`)
  }
}
