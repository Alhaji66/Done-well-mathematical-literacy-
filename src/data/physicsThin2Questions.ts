/**
 * The third round of Physical Sciences questions for the thinnest
 * sub-topics, as the sub-topic coverage report counted them before this file:
 *
 *   Classification of matter (Grade 10): separation methods -- 7.
 *   Electric circuits (Grade 12): combining resistors -- 7.
 *   Intermolecular forces (Grade 11): solubility -- 7.
 *   The periodic table (Grade 10): predicting behaviour -- 7.
 *   Rate of reaction (Grade 12): the Maxwell-Boltzmann distribution -- 7;
 *     factors affecting rate -- 8.
 *   Vectors and scalars (Grade 10): adding vectors in one dimension -- 7.
 *   2D and 3D wavefronts (Grade 11): wavefronts -- 7.
 *   The atom (Grade 10): electron arrangement -- 8.
 *   Electromagnetic radiation (Grade 12): photons -- 8.
 *
 * Six more each, across the four cognitive levels. Every number is computed
 * from the values declared with it. Numbers are written with a decimal comma;
 * h = 6,63 × 10⁻³⁴ J·s and c = 3,0 × 10⁸ m·s⁻¹.
 */
import type { Question } from '@/types'

/** A number with a decimal comma, to `dp` places, trailing zeros dropped. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(r).split('.')
  return whole.replace('-', '−').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }

/** Scientific notation with a decimal comma: 3,75 × 10⁻¹⁹. */
const sci = (v: number, dp = 2): string => {
  const exp = Math.floor(Math.log10(Math.abs(v)))
  const mant = v / 10 ** exp
  return `${n(mant, dp)} × 10${String(exp)
    .split('')
    .map((c) => SUP[c])
    .join('')}`
}

const h = 6.63e-34
const c = 3.0e8
const out: Question[] = []

/* ===================================================================== */
/* Classification of matter, Grade 10: separation methods                 */
/* ===================================================================== */

const matter = { topicId: 'phys-classification-matter', grade: 10 } as const

{
  const [spot, front, known] = [3.6, 8.0, 0.45]
  const rf = spot / front
  out.push({
    ...matter,
    id: 'ps6-10-chromatography-rf',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `In paper chromatography, an unknown dye travels ${n(spot, 1)} cm while the solvent travels ${n(front, 1)} cm. Calculate how far the dye travels as a fraction of the solvent (its Rf value), and decide whether it could be a known dye with an Rf value of ${n(known)} in the same solvent.`,
    answer: `Rf = distance travelled by the dye ÷ distance travelled by the solvent = ${n(spot, 1)} ÷ ${n(front, 1)} = ${n(rf)}. It matches the known dye’s ${n(known)}, so the unknown could be that dye.`,
    explanation: 'Chromatography separates dissolved substances by how far they travel with the solvent. A substance always has the same Rf value in the same solvent, so matching values suggest the same substance.',
    memo: [
      { code: 'SF', marks: 1, text: 'Rf = dye distance ÷ solvent distance' },
      { code: 'SF', marks: 1, text: `${n(spot, 1)} ÷ ${n(front, 1)}` },
      { code: 'A', marks: 1, text: `${n(rf)}` },
      { code: 'A', marks: 1, text: 'Matches: could be the known dye' },
    ],
  })
}

out.push(
  {
    ...matter,
    id: 'ps6-10-recover-solvent-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which separation method recovers the pure solvent (water) from a salt solution?',
    options: [
      { id: 'a', label: 'Filtration' },
      { id: 'b', label: 'Evaporation' },
      { id: 'c', label: 'Distillation' },
      { id: 'd', label: 'Chromatography' },
    ],
    correctOptionId: 'c',
    answer: 'Distillation',
    explanation: 'Evaporation recovers the dissolved salt but lets the water escape. Distillation boils off the water and condenses it again, so the solvent is recovered.',
    memo: [{ code: 'A', marks: 2, text: 'C: distillation' }],
  },
  {
    ...matter,
    id: 'ps6-10-sand-salt-iron',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Describe, step by step, the separation methods you would use to recover sand, salt and iron filings from a mixture of all three.',
    answer:
      'First use a magnet: magnetism separates the magnetic iron filings. Then add water and stir, so the salt dissolves. Filtration then separates the insoluble sand, which stays in the filter paper. Finally, evaporation (or crystallisation) of the filtrate recovers the dissolved salt.',
    explanation: 'Each method works on a different property: magnetism, solubility, particle size and boiling point.',
    memo: [
      { code: 'A', marks: 1, text: 'Magnet removes iron' },
      { code: 'A', marks: 1, text: 'Dissolve the salt in water' },
      { code: 'A', marks: 1, text: 'Filter to remove sand' },
      { code: 'A', marks: 1, text: 'Evaporate the filtrate to recover salt' },
    ],
  },
  {
    ...matter,
    id: 'ps6-10-filtration-cannot-salt',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why filtration separates an insoluble solid such as sand from a liquid, but cannot separate a dissolved solid such as salt from the liquid it is dissolved in.',
    answer:
      'Filtration separates an insoluble solid from a liquid: sand grains are too large to pass through the filter paper. Salt is dissolved: its particles are spread between the water particles and are small enough to pass through the paper with the liquid.',
    explanation: 'To recover a dissolved solid you need evaporation or crystallisation instead.',
    memo: [
      { code: 'A', marks: 1, text: 'Sand is insoluble and its grains are too large to pass through' },
      { code: 'A', marks: 1, text: 'Salt is dissolved: its particles pass through the filter' },
    ],
  },
  {
    ...matter,
    id: 'ps6-10-separating-funnel-oil',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Name the apparatus used to separate two immiscible liquids such as cooking oil and water, and explain how the separation works.',
    answer:
      'A separating funnel. The two liquids do not mix, so they form two layers, with the less dense oil on top. The tap at the bottom is opened to run off the water, and closed just as the boundary reaches it, leaving the oil in the funnel.',
    explanation: 'Immiscible means the liquids do not dissolve in each other.',
    memo: [
      { code: 'A', marks: 1, text: 'Separating funnel' },
      { code: 'A', marks: 1, text: 'Liquids form two layers (oil on top)' },
      { code: 'A', marks: 1, text: 'Bottom layer run off through the tap' },
    ],
  },
  {
    ...matter,
    id: 'ps6-10-distil-ethanol-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'Distillation separates liquids with different boiling points: ethanol’s boiling point is 78 °C and water’s is 100 °C. A learner claims that simple distillation of an ethanol–water mixture will give pure ethanol. Evaluate this claim, and suggest a better separation method.',
    answer:
      'The claim is not fully correct. Distillation separates liquids with different boiling points, so the first liquid to boil off will be mostly ethanol. But at 78 °C water also evaporates a little, and its boiling point is not far above ethanol’s, so some water vapour is carried over and the distillate is not pure. Fractional distillation, with a fractionating column, separates liquids with close boiling points much better.',
    explanation: 'The closer the boiling points, the poorer the separation in simple distillation.',
    memo: [
      { code: 'J', marks: 1, text: 'Not fully correct' },
      { code: 'A', marks: 1, text: 'Distillate is mostly ethanol (lower boiling point)' },
      { code: 'A', marks: 1, text: 'Some water evaporates too, so it is not pure' },
      { code: 'A', marks: 1, text: 'Fractional distillation is better' },
    ],
  },
)

/* ===================================================================== */
/* Electric circuits, Grade 12: combining resistors                       */
/* ===================================================================== */

const circuits = { topicId: 'phys-electric-circuits', grade: 12 } as const

const par = (...rs: number[]) => 1 / rs.reduce((s, r) => s + 1 / r, 0)

{
  const [a, b, s] = [4, 12, 5]
  const rp = par(a, b)
  out.push({
    ...circuits,
    id: 'ps6-12-parallel-then-series',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A ${a} Ω resistor and a ${b} Ω resistor are connected in parallel, and the combination is connected in series with a ${s} Ω resistor. Calculate the equivalent resistance of the network.`,
    answer: `Parallel part: 1/Rp = 1/${a} + 1/${b}, so Rp = ${n(rp)} Ω. Total = ${n(rp)} + ${s} = ${n(rp + s)} Ω.`,
    explanation: 'Reduce the innermost combination first (the parallel pair), then add the series resistor.',
    memo: [
      { code: 'SF', marks: 1, text: `1/Rp = 1/${a} + 1/${b}` },
      { code: 'A', marks: 1, text: `Rp = ${n(rp)} Ω` },
      { code: 'SF', marks: 1, text: `Rs = ${n(rp)} + ${s}` },
      { code: 'CA', marks: 1, text: `${n(rp + s)} Ω` },
    ],
  })
}

{
  const [v, rs, r1, r2] = [12, 6, 3, 6]
  const rp = par(r1, r2)
  const total = rs + rp
  const i = v / total
  const vp = i * rp
  const i1 = vp / r1
  out.push({
    ...circuits,
    id: 'ps6-12-branch-current',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `A ${v} V supply (with negligible resistance) is connected across a ${rs} Ω resistor in series with a parallel combination of ${r1} Ω and ${r2} Ω. Calculate the total resistance, the current from the supply, and the current in the ${r1} Ω resistor.`,
    answer: `Rp = (${r1} × ${r2}) ÷ (${r1} + ${r2}) = ${n(rp)} Ω; total resistance = ${rs} + ${n(rp)} = ${n(total)} Ω. I = V / R = ${v} ÷ ${n(total)} = ${n(i)} A. Potential difference across the parallel part = ${n(i)} × ${n(rp)} = ${n(vp)} V, so the current in the ${r1} Ω resistor = ${n(vp)} ÷ ${r1} = ${n(i1)} A.`,
    explanation: 'Branches in parallel share the same potential difference; the current then divides in inverse proportion to their resistances.',
    memo: [
      { code: 'A', marks: 1, text: `Rp = ${n(rp)} Ω` },
      { code: 'CA', marks: 1, text: `Total ${n(total)} Ω` },
      { code: 'CA', marks: 1, text: `I = ${n(i)} A` },
      { code: 'CA', marks: 1, text: `V across parallel = ${n(vp)} V` },
      { code: 'CA', marks: 1, text: `${n(i1)} A` },
    ],
  })
}

{
  const r = 10
  const fifteen = par(r, r) + r
  const twoInSeriesParallel = par(r + r, r)
  out.push({
    ...circuits,
    id: 'ps6-12-design-three-resistors',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `You have three ${r} Ω resistors. Describe how to connect all three to get an equivalent resistance of (a) ${n(fifteen)} Ω and (b) ${n(twoInSeriesParallel)} Ω, showing a calculation for each. Also state the largest and smallest total resistance possible with all three.`,
    answer: `(a) Two in parallel give ${n(par(r, r))} Ω; in series with the third: ${n(par(r, r))} + ${r} = ${n(fifteen)} Ω. (b) Two in series give ${2 * r} Ω; in parallel with the third: (${2 * r} × ${r}) ÷ (${2 * r} + ${r}) = ${n(twoInSeriesParallel)} Ω. Largest: all three in series, ${3 * r} Ω. Smallest: all three in parallel, ${n(par(r, r, r))} Ω.`,
    explanation: 'Series combinations always increase the total; parallel combinations always give less than the smallest branch.',
    memo: [
      { code: 'A', marks: 1, text: '(a) two in parallel, then in series with the third' },
      { code: 'SF', marks: 1, text: `${n(par(r, r))} + ${r} = ${n(fifteen)}` },
      { code: 'A', marks: 1, text: '(b) two in series, then in parallel with the third' },
      { code: 'SF', marks: 1, text: `(${2 * r} × ${r}) ÷ ${3 * r} = ${n(twoInSeriesParallel)}` },
      { code: 'A', marks: 1, text: `Largest ${3 * r} Ω; smallest ${n(par(r, r, r))} Ω` },
    ],
  })
}

out.push(
  {
    ...circuits,
    id: 'ps6-12-three-six-ohm-parallel-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Three 6 Ω resistors are connected in parallel. What is their equivalent resistance?',
    options: [
      { id: 'a', label: '18 Ω' },
      { id: 'b', label: '6 Ω' },
      { id: 'c', label: '3 Ω' },
      { id: 'd', label: '2 Ω' },
    ],
    correctOptionId: 'd',
    answer: '2 Ω',
    explanation: '1/Rp = 1/6 + 1/6 + 1/6 = 3/6, so Rp = 2 Ω. For n identical resistors in parallel, Rp = R ÷ n.',
    memo: [{ code: 'A', marks: 2, text: 'D: 2 Ω' }],
  },
  {
    ...circuits,
    id: 'ps6-12-parallel-smaller-than-smallest',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why the equivalent resistance of resistors in parallel is always smaller than the smallest resistance in the combination.',
    answer:
      'Each extra branch gives the charge another path to flow through, so more current can flow for the same potential difference. More current for the same potential difference means less total resistance, so the total is less than even the smallest branch on its own.',
    explanation: 'Adding a path can only make it easier for charge to flow, never harder.',
    memo: [
      { code: 'A', marks: 1, text: 'Each branch is an extra path for the current' },
      { code: 'A', marks: 1, text: 'More current for the same potential difference: lower resistance' },
    ],
  },
  {
    ...circuits,
    id: 'ps6-12-extra-bulb-in-parallel',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'Three identical bulbs are connected in parallel across a supply with negligible resistance. A fourth identical bulb is added in parallel. State and explain what happens to the total resistance, the current from the supply, and the brightness of the first three bulbs.',
    answer:
      'The total resistance decreases, because there is another path in parallel. The current from the supply increases, because the potential difference is the same and the resistance is lower. The first three bulbs stay equally bright, because each still has the full supply potential difference across it.',
    explanation: 'If the supply had internal resistance, the lost volts would rise and the bulbs would dim slightly; here it is negligible.',
    memo: [
      { code: 'A', marks: 1, text: 'Total resistance decreases' },
      { code: 'A', marks: 1, text: 'Supply current increases' },
      { code: 'A', marks: 1, text: 'Brightness unchanged: same potential difference across each' },
    ],
  },
)

/* ===================================================================== */
/* Intermolecular forces, Grade 11: solubility                            */
/* ===================================================================== */

const imf = { topicId: 'phys-intermolecular-forces', grade: 11 } as const

out.push(
  {
    ...imf,
    id: 'ps6-11-dissolves-in-hexane-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Hexane is a non-polar solvent. Which of these solutes dissolves best in hexane?',
    options: [
      { id: 'a', label: 'Sodium chloride' },
      { id: 'b', label: 'Sugar' },
      { id: 'c', label: 'Iodine (I₂)' },
      { id: 'd', label: 'Ammonia' },
    ],
    correctOptionId: 'c',
    answer: 'Iodine (I₂)',
    explanation: 'Like dissolves like: I₂ is non-polar, so it dissolves in non-polar hexane. Salt is ionic and sugar and ammonia are polar.',
    memo: [{ code: 'A', marks: 2, text: 'C: iodine' }],
  },
  {
    ...imf,
    id: 'ps6-11-petrol-water-oil',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why petrol does not dissolve in water but does dissolve in cooking oil.',
    answer:
      'Petrol and oil are both non-polar, and water is polar. Like dissolves like: the London forces between petrol and oil molecules are comparable to those within each liquid, so they mix. Petrol molecules cannot form hydrogen bonds with water, so they cannot replace the strong hydrogen bonds between water molecules, and petrol does not dissolve.',
    explanation: 'A solute dissolves only when the new solute–solvent forces are comparable to the forces that must be broken.',
    memo: [
      { code: 'A', marks: 1, text: 'Petrol and oil non-polar; water polar' },
      { code: 'A', marks: 1, text: 'Like dissolves like: similar forces between petrol and oil' },
      { code: 'A', marks: 1, text: 'Petrol cannot form hydrogen bonds with water' },
    ],
  },
  {
    ...imf,
    id: 'ps6-11-ethanol-dissolves-water',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Ethanol (CH₃CH₂OH) dissolves in water in all proportions. Explain why, in terms of the forces between solute and solvent.',
    answer:
      'Ethanol has an –OH group, so it is polar and can form hydrogen bonds. When it dissolves, hydrogen bonds form between ethanol and water molecules. These solute–solvent forces are comparable to the hydrogen bonds broken in water and in ethanol, so the two mix freely.',
    explanation: 'Its short non-polar CH₃CH₂– part is too small to keep it out of the water.',
    memo: [
      { code: 'A', marks: 1, text: 'Ethanol is polar / has an –OH group' },
      { code: 'A', marks: 1, text: 'Forms hydrogen bonds with water' },
      { code: 'A', marks: 1, text: 'New forces comparable to those broken, so it dissolves' },
    ],
  },
  {
    ...imf,
    id: 'ps6-11-soap-grease',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Water alone will not wash grease off your hands, but soapy water will. Use the idea of like dissolves like to explain why.',
    answer:
      'Grease is non-polar, so it does not dissolve in polar water. A soap particle has a long non-polar tail and a polar (charged) head. The non-polar tail dissolves in the grease and the polar head dissolves in the water, so the soap holds the grease in tiny droplets that the water rinses away.',
    explanation: 'Soap is a bridge between a polar and a non-polar substance.',
    memo: [
      { code: 'A', marks: 1, text: 'Grease non-polar: does not dissolve in polar water' },
      { code: 'A', marks: 1, text: 'Soap has a non-polar tail (dissolves in grease)' },
      { code: 'A', marks: 1, text: 'And a polar head (dissolves in water)' },
    ],
  },
  {
    ...imf,
    id: 'ps6-11-iodine-water-hexane',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Iodine (I₂) dissolves only slightly in water but readily in hexane. Explain both observations in terms of the forces broken and formed when a solute dissolves.',
    answer:
      'To dissolve in water, iodine must break the strong hydrogen bonds between water molecules, but it can only form weak London forces with water. The forces formed are not comparable to those broken, so very little dissolves. In hexane, only London forces are broken (between I₂ molecules and between hexane molecules), and similar London forces form between I₂ and hexane, so it dissolves readily.',
    explanation: 'Solubility is a balance: the solute–solvent forces must be comparable to the solute–solute and solvent–solvent forces.',
    memo: [
      { code: 'A', marks: 1, text: 'Water: must break strong hydrogen bonds' },
      { code: 'A', marks: 1, text: 'Only weak London forces form with water: little dissolves' },
      { code: 'A', marks: 1, text: 'Hexane: London forces broken' },
      { code: 'A', marks: 1, text: 'Similar London forces formed: dissolves' },
    ],
  },
  {
    ...imf,
    id: 'ps6-11-alcohol-chain-solubility-data',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Describe the trend in the solubility of these alcohols in water, and explain it in terms of the polar and non-polar parts of the molecules.',
    context:
      '| Alcohol | Carbon atoms | Solubility in water (g per 100 g) |\n|---|---|---|\n| Methanol | 1 | Mixes in all proportions |\n| Ethanol | 2 | Mixes in all proportions |\n| Butanol | 4 | 7,7 |\n| Hexanol | 6 | 0,6 |',
    answer:
      'Solubility decreases as the carbon chain gets longer. Each alcohol has one polar –OH group that forms hydrogen bonds with water, but the hydrocarbon chain is non-polar. As the chain grows, the non-polar part becomes a larger share of the molecule, so it disrupts more of water’s hydrogen bonding without forming comparable forces, and less of the alcohol dissolves.',
    explanation: 'The –OH group pulls the molecule into water; the chain pushes it out. Longer chains win.',
    memo: [
      { code: 'A', marks: 1, text: 'Solubility decreases with chain length' },
      { code: 'A', marks: 1, text: '–OH group is polar / forms hydrogen bonds with water' },
      { code: 'A', marks: 1, text: 'Hydrocarbon chain is non-polar' },
      { code: 'A', marks: 1, text: 'Larger non-polar part: less like water, less soluble' },
    ],
  },
)

/* ===================================================================== */
/* The periodic table, Grade 10: predicting behaviour                     */
/* ===================================================================== */

const periodic = { topicId: 'phys-periodic-table', grade: 10 } as const

out.push(
  {
    ...periodic,
    id: 'ps6-10-oxygen-ion-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Oxygen is in group 16. Which ion does an oxygen atom form?',
    options: [
      { id: 'a', label: 'O²⁺' },
      { id: 'b', label: 'O⁺' },
      { id: 'c', label: 'O⁻' },
      { id: 'd', label: 'O²⁻' },
    ],
    correctOptionId: 'd',
    answer: 'O²⁻',
    explanation: 'Oxygen has six valence electrons and gains two to fill its outer energy level, forming a 2− ion.',
    memo: [{ code: 'A', marks: 2, text: 'D: O²⁻' }],
  },
  {
    ...periodic,
    id: 'ps6-10-aluminium-ion-predict',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Aluminium is a metal in group 13. Predict the ion it forms and explain your prediction.',
    answer:
      'Al³⁺. Aluminium has three valence electrons. As a metal it loses electrons rather than gaining them: losing three leaves a full outer energy level, and with three more protons than electrons the ion has a 3+ charge.',
    explanation: 'Metals lose their valence electrons to form positive ions.',
    memo: [
      { code: 'A', marks: 1, text: 'Al³⁺' },
      { code: 'A', marks: 1, text: 'Three valence electrons' },
      { code: 'A', marks: 1, text: 'Metal: loses all three, giving a 3+ charge' },
    ],
  },
  {
    ...periodic,
    id: 'ps6-10-sodium-potassium-same-ion',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why sodium and potassium both form ions with a 1+ charge.',
    answer:
      'Both elements are in group 1, so each has one valence electron. Each atom loses that one electron to form a positive ion with a 1+ charge.',
    explanation: 'Elements in the same group form ions with the same charge because they have the same number of valence electrons.',
    memo: [
      { code: 'A', marks: 1, text: 'Same group: one valence electron each' },
      { code: 'A', marks: 1, text: 'Each loses one electron: 1+ ion' },
    ],
  },
  {
    ...periodic,
    id: 'ps6-10-magnesium-chloride-formula',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Predict the formula of the compound formed between magnesium and chlorine, using the ions each element forms.',
    answer:
      'Magnesium (group 2) loses two electrons to form Mg²⁺. Chlorine (group 17) gains one electron to form Cl⁻. Two Cl⁻ ions are needed to balance the charge of one Mg²⁺ ion, so the formula is MgCl₂.',
    explanation: 'The total positive charge must equal the total negative charge in an ionic compound.',
    memo: [
      { code: 'A', marks: 1, text: 'Mg²⁺' },
      { code: 'A', marks: 1, text: 'Cl⁻' },
      { code: 'A', marks: 1, text: 'MgCl₂' },
    ],
  },
  {
    ...periodic,
    id: 'ps6-10-element-x-2-8-7',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Element X has the electron configuration 2, 8, 7. Predicting its behaviour from this, state whether it is a metal or a non-metal, the ion it forms, and name ONE element that would react in a similar way.',
    answer:
      'X has seven valence electrons, so it is a non-metal (it is chlorine, in group 17). It gains one electron to form a 1− ion, X⁻. Fluorine or bromine would react similarly, because they are in the same group and also have seven valence electrons.',
    explanation: 'Read the group from the number of valence electrons, then apply what you know about that group.',
    memo: [
      { code: 'A', marks: 1, text: 'Non-metal' },
      { code: 'A', marks: 1, text: 'Gains one electron: X⁻' },
      { code: 'A', marks: 1, text: 'Fluorine / bromine / iodine' },
      { code: 'A', marks: 1, text: 'Same group: same number of valence electrons' },
    ],
  },
  {
    ...periodic,
    id: 'ps6-10-calcium-fluoride-ratio',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Calcium forms Ca²⁺ ions and fluorine forms F⁻ ions. Predict the formula of calcium fluoride, and explain in terms of electrons lost and gained why the ratio of ions must be 1 : 2.',
    answer:
      'CaF₂. Each calcium atom loses two electrons to form Ca²⁺, but each fluorine atom gains only one electron to form F⁻. The two electrons lost by one calcium atom must go somewhere, so two fluorine atoms are needed to gain them. Electrons are neither created nor destroyed, so for every Ca²⁺ there must be two F⁻, and the compound is neutral.',
    explanation: 'Thinking about where the electrons go is the reason behind “balancing the charges”.',
    memo: [
      { code: 'A', marks: 1, text: 'CaF₂' },
      { code: 'A', marks: 1, text: 'Calcium loses two electrons' },
      { code: 'A', marks: 1, text: 'Each fluorine gains only one' },
      { code: 'A', marks: 1, text: 'So two fluorine atoms per calcium: neutral compound' },
    ],
  },
)

/* ===================================================================== */
/* Rate of reaction, Grade 12: the Maxwell-Boltzmann distribution         */
/* ===================================================================== */

const rate = { topicId: 'phys-reaction-rate', grade: 12 } as const

{
  const [total, low, high] = [5.0e23, 2, 4]
  const extra = (total * (high - low)) / 100
  out.push({
    ...rate,
    id: 'ps6-12-mb-fraction-particles',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `In a gas sample of ${sci(total, 1)} particles, the Maxwell-Boltzmann distribution shows that ${low}% of the particles have energy above the activation energy at 25 °C, and ${high}% at 35 °C. Calculate how many more particles can react at 35 °C, and explain why the rate roughly doubles.`,
    answer: `At 25 °C: ${low}% × ${sci(total, 1)} = ${sci((total * low) / 100, 1)}. At 35 °C: ${high}% × ${sci(total, 1)} = ${sci((total * high) / 100, 1)}. Extra = ${sci(extra, 1)} particles. The fraction of particles to the right of the activation energy has doubled, so twice as many collisions are effective, and the rate roughly doubles.`,
    explanation: 'Only particles with at least the activation energy can react, so the rate depends on that fraction.',
    memo: [
      { code: 'A', marks: 1, text: `${sci((total * low) / 100, 1)} at 25 °C` },
      { code: 'A', marks: 1, text: `${sci((total * high) / 100, 1)} at 35 °C` },
      { code: 'CA', marks: 1, text: `${sci(extra, 1)} more` },
      { code: 'A', marks: 1, text: 'Fraction above the activation energy doubled: more effective collisions' },
    ],
  })
}

{
  const temps = [300, 310, 320, 330]
  const frac = [0.01, 0.02, 0.04, 0.08]
  out.push({
    ...rate,
    id: 'ps6-12-mb-temperature-fraction-data',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'The table gives the fraction of particles with energy above the activation energy at different temperatures, read from Maxwell-Boltzmann distribution curves. Describe the pattern, predict the value at 340 K, and explain the pattern using the shape of the curve.',
    context: `| Temperature (K) | Particles above the activation energy (%) |\n|---|---|\n${temps.map((t, i) => `| ${t} | ${n(frac[i])} |`).join('\n')}`,
    answer: `The fraction doubles for every 10 K rise. Predicted at 340 K: ${n(frac[3] * 2)}%. Raising the temperature shifts the curve to the right and flattens it. The activation energy lies far out in the tail of the curve, and a small shift moves a large share of the tail past it, so a small temperature rise greatly increases the fraction that can react.`,
    explanation: 'The average energy rises only slightly with 10 K, but the number of particles in the high-energy tail changes a lot.',
    memo: [
      { code: 'A', marks: 1, text: 'Doubles every 10 K' },
      { code: 'CA', marks: 1, text: `${n(frac[3] * 2)}%` },
      { code: 'A', marks: 1, text: 'Curve shifts right and flattens' },
      { code: 'A', marks: 1, text: 'Much larger fraction in the tail above the activation energy' },
    ],
  })
}

out.push(
  {
    ...rate,
    id: 'ps6-12-mb-area-right-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'On a Maxwell-Boltzmann distribution curve, what does the area under the curve to the right of the activation energy represent?',
    options: [
      { id: 'a', label: 'The total number of particles in the sample' },
      { id: 'b', label: 'The number of particles with enough kinetic energy to react' },
      { id: 'c', label: 'The average kinetic energy of the particles' },
      { id: 'd', label: 'The energy released by the reaction' },
    ],
    correctOptionId: 'b',
    answer: 'The number of particles with enough kinetic energy to react',
    explanation: 'The whole area represents all the particles; the part beyond the activation energy is the fraction that can react on collision.',
    memo: [{ code: 'A', marks: 2, text: 'B' }],
  },
  {
    ...rate,
    id: 'ps6-12-mb-curve-higher-temperature',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Describe how the Maxwell-Boltzmann distribution curve changes when the temperature is raised, and explain why the total area under the curve stays the same.',
    answer:
      'The peak moves to the right (to higher kinetic energies) and becomes lower, and the curve flattens and spreads out, with more particles in the high-energy tail. The total area stays the same because it represents the total number of particles, which does not change when the sample is heated.',
    explanation: 'A taller-and-narrower curve or a lower-and-wider one can enclose the same area.',
    memo: [
      { code: 'A', marks: 1, text: 'Peak shifts right' },
      { code: 'A', marks: 1, text: 'Curve lower and flatter / more in the tail' },
      { code: 'A', marks: 1, text: 'Area = total number of particles, which is unchanged' },
    ],
  },
  {
    ...rate,
    id: 'ps6-12-mb-catalyst-line-moves',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Use the Maxwell-Boltzmann distribution to explain how a catalyst increases the rate of a reaction even though the curve itself does not change.',
    answer:
      'A catalyst provides a pathway with a lower activation energy, which moves the activation energy line to the left on the distribution. The curve stays the same because the temperature has not changed, but a larger area now lies to the right of the line, so a larger fraction of the existing particles can react and more collisions are effective.',
    explanation: 'Temperature changes the curve; a catalyst changes the line.',
    memo: [
      { code: 'A', marks: 1, text: 'Lower activation energy: line moves left' },
      { code: 'A', marks: 1, text: 'Curve unchanged (same temperature)' },
      { code: 'A', marks: 1, text: 'Larger fraction can react: more effective collisions' },
    ],
  },
  {
    ...rate,
    id: 'ps6-12-mb-ten-degree-doubling',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A 10 °C rise raises the average kinetic energy of the particles by only about 3%, yet it can double the rate. Use the Maxwell-Boltzmann distribution to explain this.',
    answer:
      'The rate depends not on the average energy but on the fraction of particles with energy at or above the activation energy. That activation energy is far out in the tail of the distribution. A small rise in temperature shifts the curve to the right and flattens it, which greatly increases the area to the right of the activation energy, so the number of particles that can react roughly doubles.',
    explanation: 'This is the key idea of the topic: small changes in temperature, large changes in the high-energy tail.',
    memo: [
      { code: 'A', marks: 1, text: 'Rate depends on the fraction above the activation energy' },
      { code: 'A', marks: 1, text: 'Activation energy is in the tail of the curve' },
      { code: 'A', marks: 1, text: 'Small shift greatly increases that fraction' },
    ],
  },
)

/* ===================================================================== */
/* Rate of reaction, Grade 12: factors affecting rate                     */
/* ===================================================================== */

out.push(
  {
    ...rate,
    id: 'ps6-12-powder-faster-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Powdered marble reacts faster with hydrochloric acid than a single lump of marble of the same mass. Which factor is responsible?',
    options: [
      { id: 'a', label: 'A higher temperature' },
      { id: 'b', label: 'A larger surface area' },
      { id: 'c', label: 'A higher concentration of acid' },
      { id: 'd', label: 'A catalyst' },
    ],
    correctOptionId: 'b',
    answer: 'A larger surface area',
    explanation: 'In the powder, many more particles of marble are exposed to the acid, so there are more collisions per second.',
    memo: [{ code: 'A', marks: 2, text: 'B: larger surface area' }],
  },
  {
    ...rate,
    id: 'ps6-12-concentration-collisions',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Use collision theory to explain why magnesium ribbon reacts faster in more concentrated acid.',
    answer:
      'A higher concentration means more acid particles per unit volume. The magnesium surface is therefore hit by acid particles more often: there are more collisions per second, so more effective collisions per second, and the reaction is faster.',
    explanation: 'Concentration changes how often particles collide, not how hard.',
    memo: [
      { code: 'A', marks: 1, text: 'More particles per unit volume' },
      { code: 'A', marks: 1, text: 'More collisions per second' },
      { code: 'A', marks: 1, text: 'More effective collisions per second: faster rate' },
    ],
  },
  {
    ...rate,
    id: 'ps6-12-gas-pressure-rate',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why increasing the pressure increases the rate of a reaction between two gases.',
    answer:
      'Increasing the pressure pushes the same number of gas particles into a smaller volume, so there are more particles per unit volume. They collide more often, giving more effective collisions per second, so the reaction is faster.',
    explanation: 'For gases, raising the pressure is the same as raising the concentration.',
    memo: [
      { code: 'A', marks: 1, text: 'More particles per unit volume' },
      { code: 'A', marks: 1, text: 'More frequent collisions: faster rate' },
    ],
  },
  {
    ...rate,
    id: 'ps6-12-zinc-experiments-factors',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: 'Zinc reacted with hydrochloric acid under the conditions in the table. Identify which of the factors affecting rate is investigated when experiment 1 is compared with each of experiments 2, 3 and 4, and explain why experiment 2 was the fastest.',
    context:
      '| Experiment | Zinc | Acid concentration (mol·dm⁻³) | Temperature (°C) | Time to finish (s) |\n|---|---|---|---|---|\n| 1 | Lump | 1 | 25 | 120 |\n| 2 | Powder | 1 | 25 | 40 |\n| 3 | Lump | 2 | 25 | 60 |\n| 4 | Lump | 1 | 35 | 55 |',
    answer:
      '1 and 2: surface area (only the zinc’s form changed). 1 and 3: concentration. 1 and 4: temperature. Experiment 2 was fastest because the powder has a much larger surface area: far more zinc particles are exposed to the acid, so there are more collisions per second.',
    explanation: 'A fair comparison changes only one factor. Find the one column that differs between the two experiments.',
    memo: [
      { code: 'A', marks: 1, text: '1 vs 2: surface area' },
      { code: 'A', marks: 1, text: '1 vs 3: concentration' },
      { code: 'A', marks: 1, text: '1 vs 4: temperature' },
      { code: 'A', marks: 1, text: 'Powder: larger surface area, more particles exposed' },
      { code: 'A', marks: 1, text: 'More collisions per second' },
    ],
  },
  {
    ...rate,
    id: 'ps6-12-fridge-food-lasts',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Milk goes sour in two days on a warm kitchen counter but lasts a week in a fridge. Use the factors affecting rate to explain this.',
    answer:
      'Souring is caused by chemical reactions (driven by enzymes in micro-organisms). At the lower temperature of the fridge, particles move more slowly, so collisions are less frequent and a much smaller fraction of them have energy above the activation energy. The reactions are slower, so the milk takes much longer to go sour.',
    explanation: 'Cooling does not stop the reactions; it slows them down.',
    memo: [
      { code: 'A', marks: 1, text: 'Lower temperature: particles move more slowly' },
      { code: 'A', marks: 1, text: 'Fewer collisions / fewer above the activation energy' },
      { code: 'A', marks: 1, text: 'Slower reactions: milk lasts longer' },
    ],
  },
  {
    ...rate,
    id: 'ps6-12-catalyst-more-energy-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'A learner states: “A catalyst makes a reaction faster because it gives the particles more energy, so they collide harder.” Evaluate this statement.',
    answer:
      'The statement is incorrect. A catalyst does not give the particles any energy: their kinetic energies stay the same at the same temperature. Instead it provides an alternative pathway with a lower activation energy. More of the existing collisions then have enough energy to succeed, so the rate increases. The catalyst itself is not used up.',
    explanation: 'Raising the temperature gives particles more energy; a catalyst lowers the energy they need.',
    memo: [
      { code: 'J', marks: 1, text: 'Incorrect' },
      { code: 'A', marks: 1, text: 'Catalyst does not change the particles’ energy' },
      { code: 'A', marks: 1, text: 'Provides an alternative pathway with lower activation energy' },
      { code: 'A', marks: 1, text: 'More collisions are effective: faster rate' },
    ],
  },
)

/* ===================================================================== */
/* Vectors and scalars, Grade 10: adding vectors in one dimension         */
/* ===================================================================== */

const vec = { topicId: 'phys-vectors-scalars-g10', grade: 10 } as const

{
  const [boat, current] = [3.0, 1.2]
  out.push({
    ...vec,
    id: 'ps6-10-boat-against-current',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A boat moves upstream at ${n(boat, 1)} m·s⁻¹ relative to the water, while the river flows downstream at ${n(current, 1)} m·s⁻¹. Taking upstream as the positive direction, add the velocities to find the resultant velocity of the boat.`,
    answer: `Resultant = (+${n(boat, 1)}) + (−${n(current, 1)}) = +${n(boat - current, 1)} m·s⁻¹, so ${n(boat - current, 1)} m·s⁻¹ upstream.`,
    explanation: 'Give each vector a sign from the chosen positive direction, then add algebraically.',
    memo: [
      { code: 'A', marks: 1, text: 'Upstream positive, current negative' },
      { code: 'SF', marks: 1, text: `${n(boat, 1)} + (−${n(current, 1)})` },
      { code: 'A', marks: 1, text: `${n(boat - current, 1)} m·s⁻¹ upstream` },
    ],
  })
}

{
  const legs = [25, -40, 10]
  const resultant = legs.reduce((a, b) => a + b, 0)
  const distance = legs.reduce((a, b) => a + Math.abs(b), 0)
  out.push({
    ...vec,
    id: 'ps6-10-walk-east-west-resultant',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A learner walks ${legs[0]} m east, then ${-legs[1]} m west, then ${legs[2]} m east. Taking east as positive, calculate the resultant displacement and the total distance walked.`,
    answer: `Displacement = (+${legs[0]}) + (${n(legs[1])}) + (+${legs[2]}) = ${n(resultant)} m, which is ${Math.abs(resultant)} m west. Distance = ${legs.map(Math.abs).join(' + ')} = ${distance} m.`,
    explanation: 'Displacement is a vector, so directions cancel. Distance is a scalar, so every leg adds.',
    memo: [
      { code: 'SF', marks: 1, text: `${legs[0]} − ${-legs[1]} + ${legs[2]}` },
      { code: 'A', marks: 1, text: `${n(resultant)} m` },
      { code: 'A', marks: 1, text: `${Math.abs(resultant)} m west` },
      { code: 'A', marks: 1, text: `Distance ${distance} m` },
    ],
  })
}

{
  const left = [520, 480, 610]
  const right = [700, 650]
  const sumL = left.reduce((a, b) => a + b, 0)
  const sumR = right.reduce((a, b) => a + b, 0)
  const res = sumR - sumL
  out.push({
    ...vec,
    id: 'ps6-10-tug-of-war-resultant',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `In a tug-of-war, three learners pull to the left with forces of ${left.join(' N, ')} N, and two learners pull to the right with forces of ${right.join(' N and ')} N. Taking right as positive, calculate the resultant force on the rope and state which way it will move.`,
    answer: `Right: +${n(sumR)} N. Left: −${n(sumL)} N. Resultant = ${n(sumR)} + (−${n(sumL)}) = ${n(res)} N. The negative sign means ${Math.abs(res)} N to the left, so the rope moves to the left.`,
    explanation: 'Fewer learners can still lose or win: it is the sum of the forces with their signs that decides.',
    memo: [
      { code: 'A', marks: 1, text: `Right total ${n(sumR)} N` },
      { code: 'A', marks: 1, text: `Left total −${n(sumL)} N` },
      { code: 'CA', marks: 1, text: `${n(res)} N` },
      { code: 'A', marks: 1, text: 'To the left' },
    ],
  })
}

out.push(
  {
    ...vec,
    id: 'ps6-10-opposite-forces-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Taking right as positive, what is the resultant of a force of 8 N to the right and a force of 13 N to the left?',
    options: [
      { id: 'a', label: '+21 N' },
      { id: 'b', label: '+5 N' },
      { id: 'c', label: '−5 N' },
      { id: 'd', label: '−21 N' },
    ],
    correctOptionId: 'c',
    answer: '−5 N',
    explanation: '(+8) + (−13) = −5 N, which means 5 N to the left, the negative direction.',
    memo: [{ code: 'A', marks: 2, text: 'C: −5 N' }],
  },
  {
    ...vec,
    id: 'ps6-10-negative-resultant-meaning',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'After adding the forces on a trolley, a learner gets a resultant of −12 N, having taken east as positive. Explain what the negative sign means.',
    answer:
      'The negative sign does not mean the force is less than zero. It means the resultant points in the negative direction, which is west. The resultant is 12 N west.',
    explanation: 'In one dimension the sign of a vector carries its direction.',
    memo: [
      { code: 'A', marks: 1, text: 'Sign shows direction, not size' },
      { code: 'A', marks: 1, text: '12 N west' },
    ],
  },
  {
    ...vec,
    id: 'ps6-10-lift-sign-choice-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'A lift has a weight of 600 N acting downwards and a cable tension of 750 N acting upwards. Learner A takes up as positive and gets a resultant of +150 N. Learner B takes down as positive and gets −150 N. Evaluate whether both answers are correct.',
    answer:
      'Both are correct. A: (+750) + (−600) = +150 N, which is 150 N upwards. B: (−750) + (+600) = −150 N, which is 150 N in the negative direction; for B negative means upwards, so this is also 150 N upwards. The choice of positive direction only changes the sign, not the physical answer, as long as each learner states and uses their choice consistently.',
    explanation: 'Any positive direction works; what matters is stating it and sticking to it.',
    memo: [
      { code: 'J', marks: 1, text: 'Both correct' },
      { code: 'A', marks: 1, text: 'A: +150 N means 150 N up' },
      { code: 'A', marks: 1, text: 'B: −150 N with down positive also means 150 N up' },
      { code: 'A', marks: 1, text: 'Sign depends on the chosen positive direction' },
    ],
  },
)

/* ===================================================================== */
/* 2D and 3D wavefronts, Grade 11: wavefronts                             */
/* ===================================================================== */

const waves = { topicId: 'phys-wavefronts', grade: 11 } as const

{
  const [spacingCm, f] = [1.5, 12]
  const v = (spacingCm / 100) * f
  out.push({
    ...waves,
    id: 'ps6-11-ripple-tank-speed',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `In a ripple tank, straight wavefronts drawn along the crests are ${n(spacingCm, 1)} cm apart, and the dipper vibrates at ${f} Hz. Calculate the speed of the waves.`,
    answer: `The distance between adjacent wavefronts (crests) is one wavelength: λ = ${n(spacingCm / 100, 3)} m. v = f λ = ${f} × ${n(spacingCm / 100, 3)} = ${n(v)} m·s⁻¹.`,
    explanation: 'Wavefronts drawn on the crests are one wavelength apart, which is what makes them useful for measuring λ.',
    memo: [
      { code: 'A', marks: 1, text: `λ = ${n(spacingCm / 100, 3)} m` },
      { code: 'SF', marks: 1, text: `v = ${f} × ${n(spacingCm / 100, 3)}` },
      { code: 'A', marks: 1, text: `${n(v)} m·s⁻¹` },
    ],
  })
}

{
  const [radius, t, count] = [1.2, 4, 8]
  const v = radius / t
  const f = count / t
  const lambda = v / f
  out.push({
    ...waves,
    id: 'ps6-11-pond-circular-wavefronts',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A toy bobbing at a point on a pond makes circular wavefronts. ${t} s after it starts, the first wavefront has a radius of ${n(radius, 1)} m, and ${count} crests have been produced. Calculate the speed of the waves, their frequency and their wavelength, and describe how the wavefronts would look far from the toy.`,
    answer: `v = distance ÷ time = ${n(radius, 1)} ÷ ${t} = ${n(v)} m·s⁻¹. f = ${count} ÷ ${t} = ${n(f)} Hz. λ = v ÷ f = ${n(v)} ÷ ${n(f)} = ${n(lambda)} m. Far from the toy the circles are so large that each small section looks almost straight, so the wavefronts would look like straight, parallel lines (plane waves).`,
    explanation: 'The outermost wavefront has been travelling for the whole time, so it gives the speed directly.',
    memo: [
      { code: 'A', marks: 1, text: `v = ${n(v)} m·s⁻¹` },
      { code: 'A', marks: 1, text: `f = ${n(f)} Hz` },
      { code: 'SF', marks: 1, text: `λ = ${n(v)} ÷ ${n(f)}` },
      { code: 'CA', marks: 1, text: `${n(lambda)} m` },
      { code: 'A', marks: 1, text: 'Almost straight / plane wavefronts far away' },
    ],
  })
}

out.push(
  {
    ...waves,
    id: 'ps6-11-wavefront-definition-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'What are wavefronts?',
    options: [
      { id: 'a', label: 'Lines joining points on a wave that are in phase' },
      { id: 'b', label: 'The direction in which a wave travels' },
      { id: 'c', label: 'The distance between two crests' },
      { id: 'd', label: 'The highest point of a wave' },
    ],
    correctOptionId: 'a',
    answer: 'Lines joining points on a wave that are in phase',
    explanation: 'Wavefronts are usually drawn along the crests. The direction of travel is shown by a ray, drawn perpendicular to the wavefronts.',
    memo: [{ code: 'A', marks: 2, text: 'A' }],
  },
  {
    ...waves,
    id: 'ps6-11-point-source-shape',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Describe the shape of the wavefronts from a point source of waves, close to the source and far from it, and draw a conclusion about the rays far from the source.',
    answer:
      'Close to a point source the wavefronts are circles (in two dimensions) or spheres (in three) centred on the source. Far from it they are almost straight, so they are treated as plane waves. The rays, which are perpendicular to the wavefronts, are then almost parallel.',
    explanation: 'This is why light from the distant Sun arrives as nearly parallel rays.',
    memo: [
      { code: 'A', marks: 1, text: 'Near: circular / spherical' },
      { code: 'A', marks: 1, text: 'Far: almost straight / plane' },
      { code: 'A', marks: 1, text: 'Rays almost parallel far away' },
    ],
  },
  {
    ...waves,
    id: 'ps6-11-rays-and-wavefronts',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'State how rays are drawn in relation to wavefronts, and what a ray shows.',
    answer: 'Rays are drawn perpendicular (at 90°) to the wavefronts. A ray shows the direction in which the wave travels.',
    explanation: 'Wavefronts show where the wave is; rays show where it is going.',
    memo: [
      { code: 'A', marks: 1, text: 'Perpendicular to the wavefronts' },
      { code: 'A', marks: 1, text: 'Shows the direction of travel' },
    ],
  },
  {
    ...waves,
    id: 'ps6-11-shallow-water-wavefronts',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'In a ripple tank, straight wavefronts pass from deep water into shallow water and the lines drawn along the crests become closer together. The frequency does not change. Explain what this shows about the speed of the waves.',
    answer:
      'The wavefronts drawn along the crests are one wavelength apart, so closer wavefronts mean a shorter wavelength. Since v = f λ and the frequency is unchanged, a shorter wavelength means the waves travel more slowly in the shallow water.',
    explanation: 'The frequency is fixed by the source, so any change in wavelength must come from a change in speed.',
    memo: [
      { code: 'A', marks: 1, text: 'Closer wavefronts: shorter wavelength' },
      { code: 'A', marks: 1, text: 'v = f λ with f constant' },
      { code: 'A', marks: 1, text: 'Speed decreases in shallow water' },
    ],
  },
)

/* ===================================================================== */
/* The atom, Grade 10: electron arrangement                               */
/* ===================================================================== */

const atom = { topicId: 'phys-the-atom', grade: 10 } as const

out.push(
  {
    ...atom,
    id: 'ps6-10-second-level-holds-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'In the simple model of electron arrangement used for the first 20 elements, how many electrons can the second energy level hold?',
    options: [
      { id: 'a', label: '2' },
      { id: 'b', label: '8' },
      { id: 'c', label: '18' },
      { id: 'd', label: '32' },
    ],
    correctOptionId: 'b',
    answer: '8',
    explanation: 'The first energy level holds 2 electrons and the second holds 8 (2 in the 2s orbital and 6 in the three 2p orbitals).',
    memo: [{ code: 'A', marks: 2, text: 'B: 8' }],
  },
  {
    ...atom,
    id: 'ps6-10-sodium-arrangement',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'A sodium atom has 11 electrons. Write its electron arrangement by energy level, and state how many valence electrons it has.',
    answer: '2, 8, 1: two in the first energy level, eight in the second, and one in the third. It has one valence electron.',
    explanation: 'Fill the lowest energy level first, then move upwards once each level is full.',
    memo: [
      { code: 'A', marks: 1, text: '2, 8, 1' },
      { code: 'A', marks: 1, text: 'One valence electron' },
    ],
  },
  {
    ...atom,
    id: 'ps6-10-fill-lowest-first',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why electrons fill the energy levels from the lowest upwards.',
    answer:
      'Electrons closest to the nucleus are held most strongly and have the lowest energy. An atom is most stable when its energy is as low as possible, so each electron occupies the lowest energy level that still has space.',
    explanation: 'This is called the Aufbau principle: build up from the bottom.',
    memo: [
      { code: 'A', marks: 1, text: 'Lowest level has the lowest energy' },
      { code: 'A', marks: 1, text: 'Lowest energy is most stable, so they fill first' },
    ],
  },
  {
    ...atom,
    id: 'ps6-10-nitrogen-sp-notation',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Write the electron arrangement of nitrogen (7 electrons) in sp notation, and state how many unpaired electrons it has. Explain why.',
    answer:
      '1s² 2s² 2p³. It has three unpaired electrons: by Hund’s rule, the three 2p electrons each occupy a separate p orbital before any pairing happens.',
    explanation: 'Electrons spread out over orbitals of equal energy before they pair up, because paired electrons repel each other.',
    memo: [
      { code: 'A', marks: 1, text: '1s² 2s² 2p³' },
      { code: 'A', marks: 1, text: 'Three unpaired electrons' },
      { code: 'A', marks: 1, text: 'Hund’s rule: one per p orbital before pairing' },
    ],
  },
  {
    ...atom,
    id: 'ps6-10-sulfur-2-8-6',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'An atom has the electron arrangement 2, 8, 6. State how many valence electrons it has, which energy level is its outermost, and how it can achieve a full outer energy level.',
    answer:
      'It has six valence electrons, in the third energy level, which is its outermost. It can achieve a full outer energy level of eight by gaining two electrons (or by sharing two electrons in covalent bonds).',
    explanation: 'Atoms react so as to achieve a full outer energy level.',
    memo: [
      { code: 'A', marks: 1, text: 'Six valence electrons' },
      { code: 'A', marks: 1, text: 'Third energy level' },
      { code: 'A', marks: 1, text: 'Gain (or share) two electrons' },
    ],
  },
  {
    ...atom,
    id: 'ps6-10-argon-potassium-arrangement',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Argon (2, 8, 8) and potassium (2, 8, 8, 1) differ by only one electron, yet argon is almost completely unreactive and potassium is very reactive. Use the electron arrangement of each to explain this.',
    answer:
      'Argon’s outermost energy level holds eight electrons: it is already full, so argon has no tendency to gain, lose or share electrons, and it is unreactive. Potassium has a single electron in a new, fourth energy level, far from the nucleus and weakly held. Losing that one electron gives it the same full arrangement as argon, which happens very easily, so potassium is very reactive.',
    explanation: 'Chemical behaviour is decided by the valence electrons, not by the total number of electrons.',
    memo: [
      { code: 'A', marks: 1, text: 'Argon: full outer energy level' },
      { code: 'A', marks: 1, text: 'So no tendency to react' },
      { code: 'A', marks: 1, text: 'Potassium: one electron in a new outer level, weakly held' },
      { code: 'A', marks: 1, text: 'Loses it easily to reach a full outer level' },
    ],
  },
)

/* ===================================================================== */
/* Electromagnetic radiation, Grade 12: photons                           */
/* ===================================================================== */

const emr = { topicId: 'phys-em-radiation', grade: 12 } as const

{
  const nm = 450
  const e = (h * c) / (nm * 1e-9)
  out.push({
    ...emr,
    id: 'ps6-12-blue-photon-energy',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Calculate the energy of a photon of blue light of wavelength ${nm} nm, using E = hc / λ.`,
    answer: `E = hc / λ = 6,63 × 10⁻³⁴ × 3,0 × 10⁸ ÷ (${nm} × 10⁻⁹) = ${sci(e)} J.`,
    explanation: 'Convert nanometres to metres before substituting.',
    memo: [
      { code: 'SF', marks: 1, text: 'E = hc / λ' },
      { code: 'SF', marks: 1, text: `6,63 × 10⁻³⁴ × 3,0 × 10⁸ ÷ (${nm} × 10⁻⁹)` },
      { code: 'A', marks: 1, text: `${sci(e)} J` },
    ],
  })
}

{
  const e = 3.3e-19
  const f = e / h
  out.push({
    ...emr,
    id: 'ps6-12-frequency-from-photon-energy',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `The energy of a photon is ${sci(e, 1)} J. Calculate its frequency.`,
    answer: `E = hf, so f = E / h = ${sci(e, 1)} ÷ 6,63 × 10⁻³⁴ = ${sci(f)} Hz.`,
    explanation: 'Rearrange E = hf before substituting.',
    memo: [
      { code: 'SF', marks: 1, text: 'f = E / h' },
      { code: 'SF', marks: 1, text: `${sci(e, 1)} ÷ 6,63 × 10⁻³⁴` },
      { code: 'A', marks: 1, text: `${sci(f)} Hz` },
    ],
  })
}

{
  const [powerMw, nm] = [5, 650]
  const e = (h * c) / (nm * 1e-9)
  const perSecond = (powerMw / 1000) / e
  out.push({
    ...emr,
    id: 'ps6-12-laser-photons-per-second',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${powerMw} mW laser pointer emits red light of wavelength ${nm} nm. Calculate the energy of one photon, and how many photons the laser emits per second.`,
    answer: `E = hc / λ = 6,63 × 10⁻³⁴ × 3,0 × 10⁸ ÷ (${nm} × 10⁻⁹) = ${sci(e)} J. Power is energy per second, so the number of photons per second = ${powerMw} × 10⁻³ ÷ ${sci(e)} = ${sci(perSecond)}.`,
    explanation: 'Even a weak laser emits an enormous number of photons each second, which is why light usually seems continuous.',
    memo: [
      { code: 'SF', marks: 1, text: 'E = hc / λ' },
      { code: 'A', marks: 1, text: `${sci(e)} J` },
      { code: 'SF', marks: 1, text: `${powerMw} × 10⁻³ ÷ ${sci(e)}` },
      { code: 'CA', marks: 1, text: `${sci(perSecond)} photons per second` },
    ],
  })
}

{
  const [redW, redNm, blueW, blueNm] = [100, 700, 1, 450]
  const eRed = (h * c) / (redNm * 1e-9)
  const eBlue = (h * c) / (blueNm * 1e-9)
  const nRed = redW / eRed
  const nBlue = blueW / eBlue
  out.push({
    ...emr,
    id: 'ps6-12-red-bulb-blue-led-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A learner claims that a ${redW} W lamp emitting red light (${redNm} nm) gives out more energetic photons than a ${blueW} W LED emitting blue light (${blueNm} nm). Calculate the energy of each photon and the number of photons each source emits per second, and evaluate the claim.`,
    answer: `Red: E = hc / λ = ${sci(eRed)} J; number per second = ${redW} ÷ ${sci(eRed)} = ${sci(nRed)}. Blue: E = ${sci(eBlue)} J; number per second = ${blueW} ÷ ${sci(eBlue)} = ${sci(nBlue)}. The claim is wrong: each blue photon has more energy, because its wavelength is shorter (higher frequency). The red lamp is more powerful only because it emits far more photons per second.`,
    explanation: 'Power decides how many photons; frequency (colour) decides the energy of each.',
    memo: [
      { code: 'A', marks: 1, text: `Red photon ${sci(eRed)} J; blue ${sci(eBlue)} J` },
      { code: 'CA', marks: 1, text: `Red: ${sci(nRed)} per second` },
      { code: 'CA', marks: 1, text: `Blue: ${sci(nBlue)} per second` },
      { code: 'J', marks: 1, text: 'Claim wrong: blue photons more energetic' },
      { code: 'A', marks: 1, text: 'Red lamp just emits more photons per second' },
    ],
  })
}

out.push(
  {
    ...emr,
    id: 'ps6-12-most-energetic-photon-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Using E = hf, which of these has the greatest photon energy?',
    options: [
      { id: 'a', label: 'Red light' },
      { id: 'b', label: 'Green light' },
      { id: 'c', label: 'Blue light' },
      { id: 'd', label: 'Ultraviolet radiation' },
    ],
    correctOptionId: 'd',
    answer: 'Ultraviolet radiation',
    explanation: 'Ultraviolet has the highest frequency of the four, and photon energy is proportional to frequency.',
    memo: [{ code: 'A', marks: 2, text: 'D: ultraviolet' }],
  },
  {
    ...emr,
    id: 'ps6-12-brighter-lamp-photons',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A green lamp is replaced by a brighter lamp of exactly the same colour. State and explain what happens to the number of photons emitted per second and to the energy of each photon.',
    answer:
      'The number of photons per second increases, because a brighter lamp delivers more energy per second and that energy arrives as more photons. The energy of each photon stays the same, because it depends only on the frequency (E = hf), and the colour, and so the frequency, has not changed.',
    explanation: 'Brightness and colour are separate: brightness counts the photons, colour sets the energy of each.',
    memo: [
      { code: 'A', marks: 1, text: 'More photons per second' },
      { code: 'A', marks: 1, text: 'Energy per photon unchanged' },
      { code: 'A', marks: 1, text: 'E = hf: same colour, same frequency' },
    ],
  },
)

export const physicsThin2Questions: Question[] = out
