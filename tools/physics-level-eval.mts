/**
 * Measure any proposed Physical Sciences leveller against hand labels.
 *
 * The first 19 items were labelled by reading the physics, before any rule
 * was written, and they were an even spread across Grade 12 Paper 1 rather
 * than a convenient selection. On them a formula-counting approach scored
 * 7/19 -- worse than labelling every calculation Level 3 unread, 12/19.
 * Every Grade 12 paper has since been rebuilt in the NSC format, which took
 * all 19 prompts away; they are kept below as excluded comments, not
 * relabelled, and a SECOND DRAW of 19 replaces them. Its caveat: the same
 * hand wrote those items and their paper levels, so the labels are less
 * independent of the content than the first draw's were.
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
  // 'psci-p1-2020-8-2' was here, hand-labelled 3 (λ -> f -> E, two formulas). EXCLUDED: the 2020
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2023-2-5' was here, hand-labelled 3 (upward from a platform: displacement sign must be set). EXCLUDED: the 2023
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2023-5-4' was here, hand-labelled 3 (net field at a midpoint: vector/symmetry argument). EXCLUDED: the 2023
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2022-1-3' was here, hand-labelled 2 (p = mv). EXCLUDED: the 2022
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2022-3-3' was here, hand-labelled 2 (standard free-fall result). EXCLUDED: the 2022
  // papers were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-2022-6-5' was here, hand-labelled 3 (terminal voltage then power). EXCLUDED: the 2022
  // papers were rebuilt in the NSC format, so the item it described is gone.
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
  // 'psci-p1-b-1-2' was here, hand-labelled 2 (p = mv). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-b-3-4' was here, hand-labelled 3 (Ek then P = W/Δt). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-b-6-5' was here, hand-labelled 3 (terminal voltage then power). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-c-1-4' was here, hand-labelled 3 (recoil, total momentum zero). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-c-4-2' was here, hand-labelled 2 (one Doppler substitution). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-c-7-4' was here, hand-labelled 2 (transformer ratio). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-a-2-5' was here, hand-labelled 3 (two balls meeting: simultaneous setup). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // 'psci-p1-a-5-5' was here, hand-labelled 3 (net field at a midpoint). EXCLUDED: the predicted
  // sets were rebuilt in the NSC format, so the item it described is gone.
  // SECOND DRAW. Every item of the first draw above is gone, so a fresh sample was
  // taken: the 200 "Calculate ..." items in the NSC-format Grade 12 Paper 1s, in
  // corpus order, every 200/19-th one from the middle of each step -- a mechanical
  // pick, not a choice. Each was then labelled against the L2/L3 definitions above.
  'psci-p1-21n-4-2': 3,    // recoil from rest: total momentum zero, signs set first
  'psci-p1-21n-8-3': 3,    // series sum, then emf = I(R + r)
  'psci-p1-20n-3-2': 2,    // one equation of motion, all quantities given, all downward
  'psci-p1-20n-7-4': 3,    // two fields added as vectors
  'psci-p1-23n-3-2': 3,    // symmetry argument before vf = vi + aΔt
  'psci-p1-23n-8-2': 2,    // R = V²/P from the rating
  'psci-p1-22n-2-3': 3,    // components along a slope, Fnet = 0 modelled
  'psci-p1-22n-7-3': 3,    // net field at a midpoint
  'psci-p1-25n-2-3': 2,    // one body, Fnet = ma with a given
  'psci-p1-25n-8-2': 2,    // one parallel-resistance formula
  'psci-p1-25n-10-2-3': 2, // f0 = W0/h
  'psci-p1-24n-6-2': 2,    // one Doppler substitution
  'psci-p1-24n-9-5': 2,    // Pave = Vrms Irms
  'psci-p1-bn-5-3': 3,     // Wnc = ΔEk + ΔEp, two energies first
  'psci-p1-bn-8-6': 3,     // P = I²R, then W = PΔt
  'psci-p1-cn-4-2': 3,     // impulse modelled as area under a force-time graph
  'psci-p1-cn-8-4': 3,     // parallel, series, then emf = I(R + r)
  'psci-p1-an-3-4': 3,     // quadratic in Δt, two roots interpreted
  'psci-p1-an-8-6': 3,     // parallel p.d. from the total current, then I = V/R
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
