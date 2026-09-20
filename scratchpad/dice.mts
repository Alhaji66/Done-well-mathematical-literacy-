import { papersForSubject } from '../src/data/papers/index.ts'
for (const [g, pn] of [[12, 1], [11, 1]] as const) {
  const ps: any[] = (await papersForSubject('mathematics', pn, g as any)) as any
  const c = new Map<string, number>()
  for (const p of ps) for (const s of p.sections) for (const i of s.items) if (/dice are rolled/i.test(i.prompt)) c.set(i.prompt, (c.get(i.prompt) ?? 0) + 1)
  console.log('--- G' + g + ' P' + pn)
  for (const [k, v] of [...c].sort()) console.log('  ', v + 'x', k.slice(0, 100))
}
