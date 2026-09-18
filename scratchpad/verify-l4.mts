import { papersForSubject } from '../src/data/papers/index.ts'
import { proposePhysicsLevel } from '../tools/physics-level.mts'

const ids = process.argv.slice(2)
const list: any[] = (await papersForSubject('physical-sciences')) as any
const all = new Map<string, any>()
for (const p of list) for (const s of p.sections) for (const i of s.items) all.set(i.id, i)
let bad = 0
for (const id of ids) {
  const it = all.get(id)
  if (!it) { console.log(`MISSING ${id}`); bad++; continue }
  const { level, why } = proposePhysicsLevel(it)
  const ok = level === it.cognitiveLevel
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${id.padEnd(22)} stored L${it.cognitiveLevel} proposed L${level}  ${why}`)
}
console.log(bad === 0 ? 'all agree' : `${bad} disagreement(s)`)
