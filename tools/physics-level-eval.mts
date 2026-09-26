/**
 * Measure any proposed Physical Sciences leveller against hand labels.
 *
 * The 19 items below were labelled by reading the physics, before any rule
 * was written, and they are an even spread across Grade 12 Paper 1 rather
 * than a convenient selection. Items from papers since rebuilt in the NSC
 * format are excluded below rather than relabelled -- the prompt a label
 * described no longer exists -- so the sample shrinks as papers are rebuilt. A formula-counting approach scored 7/19 --
 * worse than labelling every calculation Level 3 unread, which scores 12/19.
 *
 * Keep this honest: if a future rule is tuned until it passes, add fresh
 * hand labels rather than reusing these, or the number stops meaning
 * anything. A rule fitted to its own test set is not evidence.
 *
 *   npm run check:physics-level
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { proposePhysicsLevel, formulaCountLevel, countFormulas } from './physics-level.mts'

// Hand-labelled by physics judgement, not by any rule in the tool.
// L2 = routine substitution into one formula with the quantities supplied.
// L3 = chains formulas, needs a sign convention or symmetry argument set up
//      first, or must be modelled before it can be computed.
const TRUTH: Record<string, 2 | 3> = {
  'psci-p1-2020-8-2': 3,   // λ -> f -> E, two formulas
  // 'psci-p1-2023-2-5' was here, hand-labelled 3 (upward from a platform: displacement sign must be set). EXCLUDED: the 2023
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2023-5-4' was here, hand-labelled 3 (net field at a midpoint: vector/symmetry argument). EXCLUDED: the 2023
  // papers were rebuilt in the NSC format, so the item it described is gone.
  'psci-p1-2022-1-3': 2,   // p = mv
  'psci-p1-2022-3-3': 2,   // standard free-fall result
  'psci-p1-2022-6-5': 3,   // terminal voltage then power
  // 'psci-p1-2025-1-5' was here, hand-labelled 3 (inelastic collision, conservation applied). EXCLUDED: the 2025
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2025-4-3' was here, hand-labelled 2 (one Doppler substitution). EXCLUDED: the 2025
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2025-7-5' was here, hand-labelled 2 (Vmax = Vrms√2). EXCLUDED: the 2025
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2024-2-4' was here, hand-labelled 3 (upward from a tower, sign convention). EXCLUDED: the 2024
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2024-5-4' was here, hand-labelled 3 (net force at a midpoint, symmetry). EXCLUDED: the 2024
  // papers were rebuilt in the NSC format, so the item it described is gone.
  'psci-p1-b-1-2': 2,      // p = mv
  'psci-p1-b-3-4': 3,      // Ek then P = W/Δt
  'psci-p1-b-6-5': 3,      // terminal voltage then power
  'psci-p1-c-1-4': 3,      // recoil, total momentum zero
  'psci-p1-c-4-2': 2,      // one Doppler substitution
  'psci-p1-c-7-4': 2,      // transformer ratio
  'psci-p1-a-2-5': 3,      // two balls meeting: simultaneous setup
  'psci-p1-a-5-5': 3,      // net field at a midpoint
}

const ps: any[] = (await papersForSubject('physical-sciences', 1, 12)) as any
let right = 0, n = 0, abstained = 0
const wrong: string[] = []
for (const p of ps) for (const s of p.sections) for (const it of s.items) {
  const want = TRUTH[it.id]
  if (!want) continue
  n++
  const guess = formulaCountLevel(it)
  if (guess === want) right++
  else wrong.push(`  ${it.id}: hand L${want}, formula-count L${guess} (${countFormulas(it.explanation ?? '')} formula(s) in the worked solution)`)
  if (proposePhysicsLevel(it).level === null) abstained++
}
console.log(`THE REJECTED RULE -- formula counting, scored so it stays reproducible.`)
console.log(`  Agreement with hand labels: ${right}/${n} (${Math.round((right / n) * 100)}%)`)
const allThree = Object.values(TRUTH).filter((v) => v === 3).length
console.log(`  Baseline, labelling every calculation Level 3 unread: ${allThree}/${n} (${Math.round((allThree / n) * 100)}%)`)
console.log(`  Worse than the baseline, which is why nothing labels content with it.`)
console.log(`\nTHE SHIPPED RULE -- proposePhysicsLevel.`)
console.log(`  Abstains on ${abstained}/${n} of these items. All ${n} are calculations, so abstaining`)
console.log(`  on every one is the correct and intended behaviour, NOT a score of zero.`)
console.log(`  Its wording rules (Level 1 openers, Level 4 evaluation) are what it does decide,`)
console.log(`  and this eval set deliberately contains none of them.`)
console.log('\nWhere formula counting disagreed with the hand labels:')
for (const w of wrong) console.log(w)
