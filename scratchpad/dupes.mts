import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject(process.argv[2])) as any
const seen = new Map<string, string[]>()
for (const p of list) for (const s of p.sections) for (const i of s.items) {
  const k = i.prompt.trim().toLowerCase().replace(/\s+/g, ' ')
  seen.set(k, [...(seen.get(k) ?? []), i.id])
}
const dupes = [...seen.entries()].filter(([, ids]) => ids.length > 1)
console.log(`${seen.size} distinct prompts; ${dupes.length} repeated`)
for (const [k, ids] of dupes.slice(0, 25)) console.log(`  ×${ids.length}  ${k.slice(0, 95)}\n       ${ids.slice(0,4).join(' ')}`)
