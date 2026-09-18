import { proposeLevel } from '../tools/caps-level.mts'
import { proposePhysicsLevel } from '../tools/physics-level.mts'
import { papersForSubject } from '../src/data/papers/index.ts'

const mine = [
  "Evaluate the coach's reasoning, using the impulse-momentum theorem.",
  "Evaluate the manufacturer's claim using the impulse-momentum theorem.",
  "Evaluate Learner A's claim, and give the impact speed.",
  "Evaluate the learner's claim, supporting your answer with a calculation.",
  "Evaluate the driver's argument.",
  "Evaluate this claim.",
]
console.log('--- does the PROSE rule (caps-level) already accept these?')
for (const p of mine) console.log(`  caps-level -> L${proposeLevel(p)}   ${p}`)

// How many Life Sciences Level 4 items -- hand-written long before this rule --
// use a possessive between the verb and the noun?
const ls: any[] = (await papersForSubject('life-sciences')) as any
const poss = /\b(evaluate|assess) (the|this|that|their|his|her) [\w-]+['’]s (claim|statement|argument|conclusion|method|design|proposal|reasoning|explanation|advice|prediction|objection|plan|concern)/i
let n = 0, l4 = 0
for (const p of ls) for (const s of p.sections) for (const i of s.items) {
  if (i.cognitiveLevel === 4) l4++
  if (poss.test(i.prompt)) { n++; if (n <= 6) console.log(`  [L${i.cognitiveLevel}] ${i.prompt.slice(0, 110)}`) }
}
console.log(`\nLife Sciences: ${l4} Level 4 items; ${n} use a possessive after evaluate/assess`)
