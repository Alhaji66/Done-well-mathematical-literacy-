/**
 * The third round of questions for the thinnest sub-topics, as the coverage
 * report counted them before this file (Physical Sciences, Mathematics and
 * Mathematical Literacy):
 *
 *   Energy in reactions (Gr 10) -- 2; resolving vectors into components
 *   (Gr 11) -- 2; speed of sound in different media (Gr 10) -- 2; the wave and
 *   particle nature of light (Gr 10) -- 2; solubility (Gr 11) -- 3; Coulomb's
 *   law (Gr 11) -- 5; energy changes in reactions (Gr 11) -- 5; equations of
 *   motion (Gr 10) -- 5; internal resistance and power (Gr 11) -- 5; Snell's
 *   law (Gr 11) -- 5; work (Gr 12) -- 5.
 *   Estimating surds and the real number system (Mathematics Gr 10) -- 5 each.
 *   Misleading graphs and data quality (Mat Lit) -- 7.
 *
 * Most of what these sub-topics held was definitions; most of what is added
 * here is calculation and application. Every number is computed from the
 * values declared with it, and written with a decimal comma.
 */
import type { Question } from '@/types'

/** A number with a decimal comma, to `dp` places, trailing zeros dropped. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(Math.abs(r)).split('.')
  return (r < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }

/** Scientific notation with a decimal comma: 3,65 × 10⁻¹⁹. */
const sci = (v: number, dp = 2): string => {
  const exp = Math.floor(Math.log10(Math.abs(v)))
  const mant = v / 10 ** exp
  return `${n(mant, dp)} × 10${String(exp)
    .split('')
    .map((c) => SUP[c])
    .join('')}`
}

/** Rands to the cent: R19,20. */
const rand = (v: number) => `R${(Math.round(v * 100) / 100).toFixed(2).replace('.', ',')}`
const rad = (deg: number) => (deg * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI
const [h, c, k, g] = [6.63e-34, 3.0e8, 9.0e9, 9.8]

const out: Question[] = []

/* ===================================================================== */
/* Energy in reactions (Grade 10)                                         */
/* ===================================================================== */

const pcc = { topicId: 'phys-physical-chemical-change', grade: 10 } as const

{
  const [hh, clcl, hcl] = [436, 242, 431]
  const absorbed = hh + clcl
  const released = 2 * hcl
  const net = absorbed - released
  out.push({
    ...pcc,
    id: 'tsq-ps10-bond-energy-hcl',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `For the reaction H₂ + Cl₂ → 2HCl, breaking bonds absorbs ${hh} kJ for one mole of H–H bonds and ${clcl} kJ for one mole of Cl–Cl bonds; making bonds releases ${hcl} kJ for each mole of H–Cl bonds. Calculate the net energy change and state whether the reaction is exothermic or endothermic.`,
    answer: `Energy absorbed in breaking bonds = ${hh} + ${clcl} = ${absorbed} kJ. Energy released in making bonds = 2 × ${hcl} = ${released} kJ. Net change = ${absorbed} − ${released} = ${n(net)} kJ. More energy is released than absorbed, so the reaction is exothermic.`,
    explanation: 'Two moles of H–Cl bonds form, so the energy released is doubled. A negative net change means energy leaves the reaction to the surroundings.',
    memo: [
      { code: 'A', marks: 1, text: `${absorbed} kJ absorbed` },
      { code: 'A', marks: 1, text: `${released} kJ released` },
      { code: 'CA', marks: 1, text: `${n(net)} kJ` },
      { code: 'R', marks: 1, text: 'Exothermic: more released in making bonds than absorbed in breaking them' },
    ],
  })
}
out.push(
  {
    ...pcc,
    id: 'tsq-ps10-temperature-drop',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'When citric acid reacts with sodium hydrogen carbonate in a test tube, the temperature falls from 22 °C to 9 °C. State whether the reaction is exothermic or endothermic, and explain using the energy absorbed in breaking bonds and the energy released in making bonds.',
    answer: 'Endothermic. More energy is absorbed in breaking the bonds of the reactants than is released in making the bonds of the products, so the reaction takes energy from its surroundings and the test tube feels cold.',
    explanation: 'The thermometer measures the surroundings: a fall in temperature means energy has gone into the reaction.',
    memo: [
      { code: 'A', marks: 1, text: 'Endothermic' },
      { code: 'R', marks: 1, text: 'More energy absorbed in breaking bonds than released in making bonds' },
      { code: 'R', marks: 1, text: 'Energy taken from the surroundings, so the temperature falls' },
    ],
  },
  {
    ...pcc,
    id: 'tsq-ps10-classify-reactions',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 4,
    prompt: 'Classify each of these reactions as exothermic or endothermic: (a) burning methane; (b) photosynthesis; (c) neutralising hydrochloric acid with sodium hydroxide; (d) the thermal decomposition of calcium carbonate.',
    answer: '(a) Exothermic. (b) Endothermic. (c) Exothermic. (d) Endothermic.',
    explanation: 'Combustion and neutralisation release energy; photosynthesis needs light energy and thermal decomposition needs heating.',
    memo: [
      { code: 'A', marks: 1, text: 'Exothermic' },
      { code: 'A', marks: 1, text: 'Endothermic' },
      { code: 'A', marks: 1, text: 'Exothermic' },
      { code: 'A', marks: 1, text: 'Endothermic' },
    ],
  },
  {
    ...pcc,
    id: 'tsq-ps10-hand-warmer',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 2,
    prompt: 'A chemical hand warmer gets warm when it is activated. Is the reaction inside exothermic or endothermic? Explain in terms of energy and bonds.',
    answer: 'Exothermic: more energy is released in making the bonds of the products than is absorbed in breaking the bonds of the reactants, and the extra energy heats the surroundings (the hands).',
    explanation: 'A product that feels warm is releasing energy, the defining feature of an exothermic reaction.',
    memo: [
      { code: 'A', marks: 1, text: 'Exothermic' },
      { code: 'R', marks: 1, text: 'More energy released in making bonds than absorbed in breaking bonds' },
    ],
  },
)

/* ===================================================================== */
/* Resolving vectors into components (Grade 11)                           */
/* ===================================================================== */

const vec = { topicId: 'phys-vectors-2d', grade: 11 } as const

{
  const [f, a] = [50, 30]
  const [fx, fy] = [f * Math.cos(rad(a)), f * Math.sin(rad(a))]
  out.push({
    ...vec,
    id: 'tsq-ps11-resolve-50n',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A force of ${f} N acts at ${a}° above the horizontal. Draw the vector and the angle, then resolve the force into its horizontal component Fx = F cos θ and its vertical component Fy = F sin θ.`,
    answer: `Fx = F cos θ = ${f} cos ${a}° = ${n(fx)} N horizontally. Fy = F sin θ = ${f} sin ${a}° = ${n(fy)} N vertically upwards.`,
    explanation: 'With θ measured from the horizontal, the horizontal component uses cos θ and the vertical one sin θ.',
    memo: [
      { code: 'SF', marks: 1, text: `Fx = ${f} cos ${a}°` },
      { code: 'A', marks: 1, text: `${n(fx)} N` },
      { code: 'SF', marks: 1, text: `Fy = ${f} sin ${a}°` },
      { code: 'A', marks: 1, text: `${n(fy)} N` },
    ],
  })
}
{
  const [f, a] = [120, 25]
  const [fx, fy] = [f * Math.cos(rad(a)), f * Math.sin(rad(a))]
  out.push({
    ...vec,
    id: 'tsq-ps11-resolve-pull-box',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A learner pulls a box across the floor with a rope, applying ${f} N at ${a}° above the horizontal. Resolve the pull into components, and explain why pulling at an angle reduces the normal force on the box.`,
    answer: `Horizontal component = ${f} cos ${a}° = ${n(fx)} N; vertical component = ${f} sin ${a}° = ${n(fy)} N upwards. The upward component carries part of the box's weight, so the floor pushes up less: the normal force is reduced by ${n(fy)} N.`,
    explanation: 'Only the horizontal component moves the box forward; the vertical one lifts slightly, reducing the normal force and therefore the friction.',
    memo: [
      { code: 'A', marks: 1, text: `${n(fx)} N horizontal` },
      { code: 'A', marks: 1, text: `${n(fy)} N vertical` },
      { code: 'R', marks: 1, text: 'Vertical component acts upwards' },
      { code: 'R', marks: 1, text: 'So the floor supports less of the weight: smaller normal force' },
    ],
  })
}
{
  const [v, a] = [20, 40]
  const [ve, vn] = [v * Math.cos(rad(a)), v * Math.sin(rad(a))]
  out.push({
    ...vec,
    id: 'tsq-ps11-resolve-velocity',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A boat’s velocity is a vector of ${v} m·s⁻¹ at an angle of ${a}° north of east. Draw the vector and the angle, then resolve it into an east component and a north component.`,
    answer: `East: ${v} cos ${a}° = ${n(ve)} m·s⁻¹. North: ${v} sin ${a}° = ${n(vn)} m·s⁻¹.`,
    explanation: 'Any vector can be resolved, not only forces; the angle here is measured from east.',
    memo: [
      { code: 'M', marks: 1, text: 'cos for the east component, sin for the north component' },
      { code: 'A', marks: 1, text: `${n(ve)} m·s⁻¹ east` },
      { code: 'A', marks: 1, text: `${n(vn)} m·s⁻¹ north` },
    ],
  })
}
{
  const [f, a] = [80, 60]
  const [fx, fy] = [-f * Math.cos(rad(a)), -f * Math.sin(rad(a))]
  out.push({
    ...vec,
    id: 'tsq-ps11-resolve-signs',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A force of ${f} N points to the left and downwards, at ${a}° below the horizontal. Taking right and up as positive, resolve it into components and give each its sign.`,
    answer: `Fx = −${f} cos ${a}° = ${n(fx)} N (to the left). Fy = −${f} sin ${a}° = ${n(fy)} N (downwards).`,
    explanation: 'The size of each component comes from cos and sin; the sign comes from the positive directions chosen at the start.',
    memo: [
      { code: 'A', marks: 1, text: `|Fx| = ${n(-fx)} N` },
      { code: 'A', marks: 1, text: `|Fy| = ${n(-fy)} N` },
      { code: 'A', marks: 1, text: 'Fx negative (left)' },
      { code: 'A', marks: 1, text: 'Fy negative (down)' },
    ],
  })
}

/* ===================================================================== */
/* Speed of sound in different media (Grade 10)                           */
/* ===================================================================== */

const sound = { topicId: 'phys-longitudinal-waves-g10', grade: 10 } as const

{
  const [len, steel, air] = [1700, 5000, 340]
  const [ts, ta] = [len / steel, len / air]
  out.push({
    ...sound,
    id: 'tsq-ps10-rail-two-sounds',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A hammer strikes one end of a steel rail ${n(len, 0)} m long. Sound travels at ${n(steel, 0)} m·s⁻¹ in steel and ${air} m·s⁻¹ in air. Calculate how long the sound takes to reach the other end through each medium, and explain why a listener there hears two sounds.`,
    answer: `Steel: t = ${n(len, 0)} ÷ ${n(steel, 0)} = ${n(ts)} s. Air: t = ${n(len, 0)} ÷ ${air} = ${n(ta)} s. The sound through the steel arrives ${n(ta - ts)} s earlier, because particles in a solid are closer together and pass the vibration on faster.`,
    explanation: 'The same sound travels at different speeds in different media, so the two paths arrive at different times.',
    memo: [
      { code: 'A', marks: 1, text: `${n(ts)} s through steel` },
      { code: 'A', marks: 1, text: `${n(ta)} s through air` },
      { code: 'R', marks: 1, text: 'Sound is faster in the solid' },
      { code: 'R', marks: 1, text: 'Closer particles pass the vibration on more quickly' },
    ],
  })
}
{
  const [f, vAir, vWater] = [680, 340, 1500]
  out.push({
    ...sound,
    id: 'tsq-ps10-wavelength-water',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Sound travels faster in liquids than in gases: ${vAir} m·s⁻¹ in air but ${n(vWater, 0)} m·s⁻¹ in water. Explain, in terms of how close the particles are, why sound travels faster in the water, then calculate the wavelength of a ${f} Hz sound in each medium.`,
    answer: `The particles in a liquid are much closer together than in a gas, so each one passes the vibration to the next more quickly. λ = v ÷ f. In air: ${vAir} ÷ ${f} = ${n(vAir / f)} m. In water: ${n(vWater, 0)} ÷ ${f} = ${n(vWater / f)} m.`,
    explanation: 'The source sets the frequency; the medium sets the speed, so the wavelength changes in proportion to the speed.',
    memo: [
      { code: 'SF', marks: 1, text: 'λ = v ÷ f' },
      { code: 'A', marks: 1, text: `${n(vAir / f)} m in air` },
      { code: 'A', marks: 1, text: `${n(vWater / f)} m in water` },
      { code: 'R', marks: 1, text: 'Water particles are closer together, so they pass the vibration on faster' },
    ],
  })
}
out.push(
  {
    ...sound,
    id: 'tsq-ps10-rank-media',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Rank steel, water and air from the medium in which sound travels fastest to the one in which it travels slowest, and explain the order in terms of the particles.',
    answer: 'Steel, then water, then air. The particles are closest together in a solid and furthest apart in a gas, and closer particles pass the vibration on more quickly.',
    explanation: 'Sound is a longitudinal wave passed from particle to particle, so its speed depends on how close and how strongly linked the particles are.',
    memo: [
      { code: 'A', marks: 1, text: 'Steel > water > air' },
      { code: 'R', marks: 1, text: 'Particles closest in solids, furthest apart in gases' },
      { code: 'R', marks: 1, text: 'Closer particles transmit the vibration faster' },
    ],
  },
  {
    ...sound,
    id: 'tsq-ps10-moon-vacuum',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Two astronauts standing on the Moon cannot hear each other shout, but they can talk by touching helmets together. Explain why sound cannot travel through a vacuum, and why it can travel through the solid helmets.',
    answer: 'The Moon has no air, so there is a vacuum with no particles to carry the sound. When the helmets touch, the vibrations travel through the solid helmets instead.',
    explanation: 'Sound needs a medium; it travels through solids, liquids and gases, but not through a vacuum.',
    memo: [
      { code: 'R', marks: 1, text: 'Vacuum: no particles to carry sound' },
      { code: 'R', marks: 1, text: 'Vibrations travel through the solid helmets' },
    ],
  },
)

/* ===================================================================== */
/* The wave and particle nature of light (Grade 10)                        */
/* ===================================================================== */

const emr = { topicId: 'phys-em-radiation-g10', grade: 10 } as const

{
  const f = 5.5e14
  const e = h * f
  out.push({
    ...emr,
    id: 'tsq-ps10-photon-green',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Light behaves as a stream of photons. Calculate the energy of one photon of green light of frequency ${sci(f, 1)} Hz. (h = 6,63 × 10⁻³⁴ J·s)`,
    answer: `E = h f = 6,63 × 10⁻³⁴ × ${sci(f, 1)} = ${sci(e)} J.`,
    explanation: 'Each photon is a packet of energy; its energy depends only on the frequency of the light.',
    memo: [
      { code: 'SF', marks: 1, text: 'E = hf with values substituted' },
      { code: 'A', marks: 1, text: `${sci(e)}` },
      { code: 'A', marks: 1, text: 'Unit: J' },
    ],
  })
}
{
  const lambda = 450e-9
  const f = c / lambda
  const e = h * f
  out.push({
    ...emr,
    id: 'tsq-ps10-photon-wavelength',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Blue light of wavelength 450 nm can be treated as a stream of particles (photons). Calculate its frequency, and then the energy of one photon using E = h f. (c = 3,0 × 10⁸ m·s⁻¹; h = 6,63 × 10⁻³⁴ J·s)`,
    answer: `f = c ÷ λ = 3,0 × 10⁸ ÷ 4,5 × 10⁻⁷ = ${sci(f)} Hz. E = h f = 6,63 × 10⁻³⁴ × ${sci(f)} = ${sci(e)} J.`,
    explanation: 'The wave equation gives the frequency; the photon model then gives the energy each packet carries. 450 nm = 4,5 × 10⁻⁷ m.',
    memo: [
      { code: 'C', marks: 1, text: '450 nm = 4,5 × 10⁻⁷ m' },
      { code: 'A', marks: 1, text: `f = ${sci(f)} Hz` },
      { code: 'SF', marks: 1, text: 'E = hf substituted' },
      { code: 'CA', marks: 1, text: `E = ${sci(e)} J` },
    ],
  })
}
{
  const [fuv, fradio] = [1.0e15, 1.0e8]
  out.push({
    ...emr,
    id: 'tsq-ps10-photon-uv-radio',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Calculate how many times more energy a photon of ultraviolet light (${sci(fuv, 1)} Hz) carries than a photon of radio waves (${sci(fradio, 1)} Hz), and use the particle nature of light to say why only one of them can damage skin cells.`,
    answer: `E is proportional to f, so the ratio is ${sci(fuv, 1)} ÷ ${sci(fradio, 1)} = ${sci(fuv / fradio, 0)}. Each ultraviolet photon carries enough energy to damage molecules such as DNA in a cell; a radio photon carries far too little, however many arrive.`,
    explanation: 'Damage depends on the energy of each photon, not the total amount of radiation.',
    memo: [
      { code: 'M', marks: 1, text: 'Ratio of frequencies (E ∝ f)' },
      { code: 'A', marks: 1, text: `${sci(fuv / fradio, 0)} times` },
      { code: 'R', marks: 1, text: 'Each UV photon has enough energy to damage cells; a radio photon does not' },
    ],
  })
}
out.push({
  ...emr,
  id: 'tsq-ps10-double-slit',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'Light passing through two narrow slits forms a pattern of bright and dark bands on a screen. State whether this shows the wave nature or the particle nature of light, and explain.',
  answer: 'The wave nature. The bands are made by interference: where waves from the two slits meet in phase they reinforce (bright), and where they meet out of phase they cancel (dark).',
  explanation: 'Interference and diffraction are wave behaviours; the photoelectric effect is the evidence for particles.',
  memo: [
    { code: 'A', marks: 1, text: 'Wave nature' },
    { code: 'R', marks: 1, text: 'Interference of waves from the two slits' },
  ],
})

/* ===================================================================== */
/* Solubility (Grade 11)                                                  */
/* ===================================================================== */

const imf = { topicId: 'phys-intermolecular-forces', grade: 11 } as const

out.push(
  {
    ...imf,
    id: 'tsq-ps11-dissolve-in-water',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Predict whether each substance dissolves well in water, using the rule "like dissolves like": (a) sodium chloride; (b) ethanol; (c) iodine (I₂); (d) hexane.',
    answer: '(a) Dissolves: ionic, attracted to polar water molecules. (b) Dissolves: polar, forms hydrogen bonds with water. (c) Hardly dissolves: non-polar molecules. (d) Does not dissolve: non-polar.',
    explanation: 'Polar and ionic solutes dissolve in a polar solvent like water; non-polar solutes dissolve in non-polar solvents.',
    memo: [
      { code: 'A', marks: 1, text: 'NaCl dissolves' },
      { code: 'A', marks: 1, text: 'Ethanol dissolves' },
      { code: 'A', marks: 1, text: 'Iodine hardly dissolves' },
      { code: 'A', marks: 1, text: 'Hexane does not dissolve' },
    ],
  },
  {
    ...imf,
    id: 'tsq-ps11-iodine-hexane',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Iodine dissolves readily in hexane but only slightly in water. Explain this difference in solubility in terms of intermolecular forces.',
    answer: 'Iodine and hexane are both non-polar, held by London forces of similar strength, so iodine-hexane forces can replace the forces broken. Water molecules are held by strong hydrogen bonds, which iodine cannot replace, so little iodine dissolves.',
    explanation: 'A solute dissolves when the new solute-solvent forces are comparable to those that must be broken.',
    memo: [
      { code: 'A', marks: 1, text: 'Iodine and hexane both non-polar (London forces)' },
      { code: 'R', marks: 1, text: 'Similar forces, so like dissolves like' },
      { code: 'R', marks: 1, text: 'Iodine cannot replace water’s hydrogen bonds' },
    ],
  },
  {
    ...imf,
    id: 'tsq-ps11-ethanol-mixes',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Ethanol and water mix in all proportions. Explain this solubility by referring to the intermolecular forces in each liquid.',
    answer: 'Both are polar and both have hydrogen bonds between their molecules (each has an –OH group). Ethanol molecules can form hydrogen bonds with water molecules, which replace the ones broken, so they mix completely.',
    explanation: 'Like dissolves like: two liquids with the same kind of intermolecular force mix readily.',
    memo: [
      { code: 'A', marks: 1, text: 'Both polar with hydrogen bonds' },
      { code: 'R', marks: 1, text: 'Ethanol forms hydrogen bonds with water' },
      { code: 'R', marks: 1, text: 'These replace the forces broken, so they mix' },
    ],
  },
  {
    ...imf,
    id: 'tsq-ps11-grease-petrol',
    difficulty: 'Easy',
    cognitiveLevel: 3,
    marks: 2,
    prompt: 'A mechanic finds that grease will not wash off his hands with water alone, but comes off with a little petrol. Explain, using "like dissolves like".',
    answer: 'Grease is non-polar. Water is polar, so it cannot dissolve the grease; petrol is non-polar, so it dissolves the grease.',
    explanation: 'Soap works differently: one end of a soap molecule dissolves in the grease and the other in the water.',
    memo: [
      { code: 'A', marks: 1, text: 'Grease non-polar, water polar' },
      { code: 'R', marks: 1, text: 'Non-polar petrol dissolves non-polar grease' },
    ],
  },
)

/* ===================================================================== */
/* Coulomb's law (Grade 11)                                               */
/* ===================================================================== */

const es = { topicId: 'phys-electrostatics-g11', grade: 11 } as const

{
  const [q1, q2, r] = [3e-6, 5e-6, 0.2]
  const f = (k * q1 * q2) / r ** 2
  out.push({
    ...es,
    id: 'tsq-ps11-coulomb-force',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `Use Coulomb's law to calculate the electrostatic force between a +3 µC charge and a −5 µC charge placed ${n(r)} m apart, and state whether it is attractive or repulsive. (k = 9,0 × 10⁹ N·m²·C⁻²)`,
    answer: `F = kQ₁Q₂ / r² = 9,0 × 10⁹ × 3 × 10⁻⁶ × 5 × 10⁻⁶ ÷ ${n(r)}² = ${n(f, 3)} N. The charges are opposite, so the force is attractive.`,
    explanation: 'Use the magnitudes in the formula; decide attraction or repulsion from the signs separately.',
    memo: [
      { code: 'SF', marks: 1, text: 'F = kQ₁Q₂/r² with values substituted' },
      { code: 'C', marks: 1, text: 'µC converted to C' },
      { code: 'A', marks: 1, text: `${n(f, 3)} N` },
      { code: 'A', marks: 1, text: 'Attractive' },
    ],
  })
}
{
  const f0 = 0.8
  out.push({
    ...es,
    id: 'tsq-ps11-coulomb-inverse-square',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Two point charges exert an electrostatic force of ${n(f0)} N on each other. Using Coulomb's law, calculate the force (a) if the distance between them is tripled, and (b) if instead both charges are doubled at the original distance.`,
    answer: `(a) F ∝ 1/r², so tripling r divides F by 9: ${n(f0)} ÷ 9 = ${n(f0 / 9, 3)} N. (b) F ∝ Q₁Q₂, so doubling both multiplies F by 4: ${n(f0 * 4)} N.`,
    explanation: 'Reason with proportion rather than recalculating from scratch: each change multiplies the force by a fixed factor.',
    memo: [
      { code: 'R', marks: 1, text: 'Inverse square: ÷ 9' },
      { code: 'A', marks: 1, text: `${n(f0 / 9, 3)} N` },
      { code: 'A', marks: 1, text: `${n(f0 * 4)} N` },
    ],
  })
}
{
  const [q, f] = [2e-6, 0.9]
  const r = Math.sqrt((k * q * q) / f)
  out.push({
    ...es,
    id: 'tsq-ps11-coulomb-find-r',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Two identical charges of +2 µC repel each other with a force of ${n(f)} N. Use Coulomb's law to calculate the distance between them.`,
    answer: `r² = kQ₁Q₂ / F = 9,0 × 10⁹ × (2 × 10⁻⁶)² ÷ ${n(f)} = ${n(r * r, 2)} m², so r = ${n(r)} m.`,
    explanation: 'Rearrange the formula for r² first, then take the square root.',
    memo: [
      { code: 'SF', marks: 1, text: 'Coulomb’s law with values substituted' },
      { code: 'M', marks: 1, text: 'Made r² the subject' },
      { code: 'A', marks: 1, text: `r² = ${n(r * r)}` },
      { code: 'CA', marks: 1, text: `r = ${n(r)} m` },
    ],
  })
}
{
  const f1 = (k * 2e-6 * 1e-6) / 0.5 ** 2
  const f2 = (k * 3e-6 * 1e-6) / 0.2 ** 2
  const net = f2 - f1
  out.push({
    ...es,
    id: 'tsq-ps11-coulomb-three-charges',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Three charges lie on a straight line: Q₁ = +2 µC at 0 m, Q₂ = −3 µC at 0,3 m and Q₃ = +1 µC at 0,5 m. Use Coulomb\'s law to calculate the net electrostatic force on Q₃.',
    answer: `Force of Q₁ on Q₃ (r = 0,5 m): ${n(f1, 3)} N, repulsive, to the right. Force of Q₂ on Q₃ (r = 0,2 m): ${n(f2, 3)} N, attractive, to the left. Net force = ${n(f2, 3)} − ${n(f1, 3)} = ${n(net, 3)} N to the left.`,
    explanation: 'Find each force separately with its own distance, give each a direction, and add them as vectors.',
    memo: [
      { code: 'A', marks: 1, text: `F₁₃ = ${n(f1, 3)} N` },
      { code: 'A', marks: 1, text: 'Right (repulsion)' },
      { code: 'A', marks: 1, text: `F₂₃ = ${n(f2, 3)} N` },
      { code: 'A', marks: 1, text: 'Left (attraction)' },
      { code: 'CA', marks: 1, text: `${n(net, 3)} N to the left` },
    ],
  })
}

/* ===================================================================== */
/* Energy changes in reactions (Grade 11)                                 */
/* ===================================================================== */

const ecc = { topicId: 'phys-energy-chem-change', grade: 11 } as const

{
  const dh = -92
  const mol = 3
  out.push(
    {
      ...ecc,
      id: 'tsq-ps11-ammonia-exothermic',
      difficulty: 'Easy',
      cognitiveLevel: 2,
      marks: 3,
      prompt: `For N₂ + 3H₂ → 2NH₃, ΔH = ${dh} kJ·mol⁻¹. Is the reaction exothermic or endothermic? Compare the energy of the products with that of the reactants, and say what happens to the temperature of the surroundings.`,
      answer: 'Exothermic, because ΔH is negative. The products have less energy than the reactants; the difference is released, so the surroundings warm up.',
      explanation: 'ΔH = energy of products − energy of reactants, so a negative value means energy was given out.',
      memo: [
        { code: 'A', marks: 1, text: 'Exothermic' },
        { code: 'R', marks: 1, text: 'Products have less energy than reactants' },
        { code: 'A', marks: 1, text: 'Surroundings warm up' },
      ],
    },
    {
      ...ecc,
      id: 'tsq-ps11-ammonia-energy-released',
      difficulty: 'Moderate',
      cognitiveLevel: 3,
      marks: 3,
      prompt: `For N₂ + 3H₂ → 2NH₃, ΔH = ${dh} kJ·mol⁻¹ (per 2 mol of NH₃ formed). Calculate the energy released when ${mol} mol of NH₃ is formed.`,
      answer: `${-dh} kJ is released per 2 mol NH₃, so ${mol} mol releases ${-dh} × ${mol}/2 = ${n((-dh * mol) / 2)} kJ.`,
      explanation: 'ΔH belongs to the balanced equation as written, so scale it by the number of moles actually formed.',
      memo: [
        { code: 'A', marks: 1, text: `${-dh} kJ per 2 mol NH₃` },
        { code: 'M', marks: 1, text: `× ${mol}/2` },
        { code: 'A', marks: 1, text: `${n((-dh * mol) / 2)} kJ released` },
      ],
    },
  )
}
{
  const [dh, mass, m] = [178, 250, 100]
  const mol = mass / m
  out.push({
    ...ecc,
    id: 'tsq-ps11-caco3-decompose',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `The thermal decomposition CaCO₃ → CaO + CO₂ has ΔH = +${dh} kJ·mol⁻¹. Calculate the energy needed to decompose ${mass} g of calcium carbonate (M = ${m} g·mol⁻¹), and state whether the reaction is exothermic or endothermic.`,
    answer: `n = ${mass} ÷ ${m} = ${n(mol)} mol. Energy = ${n(mol)} × ${dh} = ${n(mol * dh)} kJ absorbed. ΔH is positive, so the reaction is endothermic.`,
    explanation: 'An endothermic reaction must be supplied with energy continuously -- here by heating in a kiln.',
    memo: [
      { code: 'A', marks: 1, text: `n = ${n(mol)} mol` },
      { code: 'M', marks: 1, text: `${n(mol)} × ${dh}` },
      { code: 'A', marks: 1, text: `${n(mol * dh)} kJ` },
      { code: 'A', marks: 1, text: 'Endothermic' },
    ],
  })
}
out.push({
  ...ecc,
  id: 'tsq-ps11-photosynthesis-energy',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'Photosynthesis is endothermic. State where the energy for it comes from, and compare the energy of the products (glucose and oxygen) with that of the reactants.',
  answer: 'The energy comes from sunlight absorbed by chlorophyll. The products have more energy than the reactants, because energy has been taken in and stored in the glucose.',
  explanation: 'This stored energy is released again in respiration, an exothermic reaction.',
  memo: [
    { code: 'A', marks: 1, text: 'Sunlight / light energy' },
    { code: 'A', marks: 1, text: 'Products have more energy than reactants' },
  ],
})

/* ===================================================================== */
/* Equations of motion (Grade 10)                                         */
/* ===================================================================== */

const motion = { topicId: 'phys-motion-1d', grade: 10 } as const

{
  const [vi, a, t] = [12, 2.5, 6]
  const vf = vi + a * t
  const dx = vi * t + 0.5 * a * t * t
  out.push({
    ...motion,
    id: 'tsq-ps10-car-accelerates',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A car moving at ${vi} m·s⁻¹ accelerates uniformly at ${n(a)} m·s⁻² for ${t} s. Use the equations of motion to calculate its final velocity and the distance it covers.`,
    answer: `vf = vi + aΔt = ${vi} + ${n(a)} × ${t} = ${n(vf)} m·s⁻¹. Δx = viΔt + ½aΔt² = ${vi} × ${t} + ½ × ${n(a)} × ${t}² = ${n(dx)} m.`,
    explanation: 'List what is given (vi, a, Δt) and what is required before choosing each equation.',
    memo: [
      { code: 'SF', marks: 1, text: 'vf = vi + aΔt substituted' },
      { code: 'A', marks: 1, text: `${n(vf)} m·s⁻¹` },
      { code: 'SF', marks: 1, text: 'Δx = viΔt + ½aΔt² substituted' },
      { code: 'A', marks: 1, text: `${n(dx)} m` },
    ],
  })
}
{
  const [vi, dist] = [25, 50]
  const a = (0 - vi * vi) / (2 * dist)
  const t = (0 - vi) / a
  out.push({
    ...motion,
    id: 'tsq-ps10-braking',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A driver brakes and brings a car travelling at ${vi} m·s⁻¹ to rest in ${dist} m, with uniform acceleration. Use the equations of motion to calculate the acceleration and the time taken to stop.`,
    answer: `vf² = vi² + 2aΔx: 0 = ${vi}² + 2a(${dist}), so a = ${n(a)} m·s⁻² (negative: against the motion). Δt = (vf − vi) ÷ a = (0 − ${vi}) ÷ (${n(a)}) = ${n(t)} s.`,
    explanation: 'Taking the direction of motion as positive, a deceleration comes out as a negative acceleration.',
    memo: [
      { code: 'SF', marks: 1, text: 'vf² = vi² + 2aΔx with vf = 0' },
      { code: 'A', marks: 1, text: `a = ${n(a)} m·s⁻²` },
      { code: 'SF', marks: 1, text: 'vf = vi + aΔt substituted' },
      { code: 'CA', marks: 1, text: `${n(t)} s` },
    ],
  })
}
{
  const t = 2.5
  const vf = g * t
  const dy = 0.5 * g * t * t
  out.push({
    ...motion,
    id: 'tsq-ps10-dropped-ball',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A ball is dropped from rest from a high balcony and falls freely for ${n(t)} s. Taking g = 9,8 m·s⁻², use the equations of motion to calculate its velocity after ${n(t)} s and the distance it has fallen.`,
    answer: `vf = vi + gΔt = 0 + 9,8 × ${n(t)} = ${n(vf)} m·s⁻¹ downwards. Δy = viΔt + ½gΔt² = ½ × 9,8 × ${n(t)}² = ${n(dy)} m.`,
    explanation: 'In free fall the acceleration is 9,8 m·s⁻² downwards; "dropped" means the initial velocity is zero.',
    memo: [
      { code: 'A', marks: 1, text: 'vi = 0 and a = 9,8 m·s⁻²' },
      { code: 'A', marks: 1, text: `${n(vf)} m·s⁻¹ downwards` },
      { code: 'SF', marks: 1, text: 'Δy = ½gΔt² substituted' },
      { code: 'A', marks: 1, text: `${n(dy)} m` },
    ],
  })
}
{
  const vi = 15
  const hMax = (vi * vi) / (2 * g)
  const tUp = vi / g
  out.push({
    ...motion,
    id: 'tsq-ps10-thrown-up',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A stone is thrown straight up at ${vi} m·s⁻¹. Ignoring air resistance and taking g = 9,8 m·s⁻², use the equations of motion to calculate the maximum height it reaches and the time it takes to get there.`,
    answer: `At the top vf = 0. vf² = vi² + 2aΔy with a = −9,8 (up positive): 0 = ${vi}² − 2(9,8)Δy, so Δy = ${n(hMax)} m. vf = vi + aΔt: 0 = ${vi} − 9,8Δt, so Δt = ${n(tUp)} s.`,
    explanation: 'The acceleration is 9,8 m·s⁻² downwards the whole time, even on the way up; with up positive it is −9,8.',
    memo: [
      { code: 'A', marks: 1, text: 'vf = 0 at the top; a = −9,8 (up positive)' },
      { code: 'A', marks: 1, text: `${n(hMax)} m` },
      { code: 'SF', marks: 1, text: 'vf = vi + aΔt substituted' },
      { code: 'A', marks: 1, text: `${n(tUp)} s` },
    ],
  })
}

/* ===================================================================== */
/* Internal resistance and power (Grade 11)                               */
/* ===================================================================== */

const circ = { topicId: 'phys-electric-circuits-g11', grade: 11 } as const

{
  const [emf, r, rExt] = [12, 0.5, 5.5]
  const i = emf / (rExt + r)
  out.push({
    ...circ,
    id: 'tsq-ps11-terminal-pd',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A battery with an emf of ${emf} V and internal resistance ${n(r)} Ω is connected to an external resistor of ${n(rExt)} Ω. Calculate the current, the terminal potential difference and the "lost volts" across the internal resistance.`,
    answer: `I = emf ÷ (R + r) = ${emf} ÷ (${n(rExt)} + ${n(r)}) = ${n(i)} A. Terminal pd = IR = ${n(i)} × ${n(rExt)} = ${n(i * rExt)} V. Lost volts = Ir = ${n(i * r)} V (and ${n(i * rExt)} + ${n(i * r)} = ${emf} V).`,
    explanation: 'emf = I(R + r): part of the battery’s energy per coulomb is used inside the battery itself.',
    memo: [
      { code: 'SF', marks: 1, text: 'emf = I(R + r)' },
      { code: 'A', marks: 1, text: `I = ${n(i)} A` },
      { code: 'CA', marks: 1, text: `Terminal pd ${n(i * rExt)} V` },
      { code: 'CA', marks: 1, text: `Lost volts ${n(i * r)} V` },
    ],
  })
}
{
  const [emf, v, i] = [9, 8.1, 1.5]
  const r = (emf - v) / i
  out.push({
    ...circ,
    id: 'tsq-ps11-find-internal-resistance',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A battery of emf ${emf} V has a terminal potential difference of ${n(v)} V when it delivers ${n(i)} A. Calculate its internal resistance.`,
    answer: `Lost volts = emf − V = ${emf} − ${n(v)} = ${n(emf - v)} V. r = ${n(emf - v)} ÷ ${n(i)} = ${n(r)} Ω.`,
    explanation: 'The difference between the emf and the terminal potential difference is the potential difference across the internal resistance.',
    memo: [
      { code: 'A', marks: 1, text: `Lost volts ${n(emf - v)} V` },
      { code: 'SF', marks: 1, text: 'r = (emf − V) ÷ I' },
      { code: 'CA', marks: 1, text: `${n(r)} Ω` },
    ],
  })
}
{
  const [p, minutes, days, rate] = [2000, 6, 30, 3.2]
  const kwh = (p / 1000) * (minutes / 60) * days
  out.push({
    ...circ,
    id: 'tsq-ps11-kettle-kwh',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${n(p, 0)} W kettle is used for ${minutes} minutes a day for ${days} days. Calculate the electrical energy used in kilowatt hours and its cost at ${rand(rate)} per kWh.`,
    answer: `E = Pt = ${n(p / 1000)} kW × ${n(minutes / 60)} h × ${days} = ${n(kwh)} kWh. Cost = ${n(kwh)} × ${rand(rate)} = ${rand(kwh * rate)}.`,
    explanation: 'For an electricity account, power is in kilowatts and time in hours, so the energy comes out in kilowatt hours.',
    memo: [
      { code: 'C', marks: 1, text: `${n(p / 1000)} kW and ${n(minutes / 60)} h` },
      { code: 'SF', marks: 1, text: 'E = Pt' },
      { code: 'A', marks: 1, text: `${n(kwh)} kWh` },
      { code: 'CA', marks: 1, text: rand(kwh * rate) },
    ],
  })
}
out.push({
  ...circ,
  id: 'tsq-ps11-headlights-dim',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 3,
  prompt: 'A car’s headlights dim while the starter motor is turning. Explain this using the internal resistance of the battery.',
  answer: 'The starter motor draws a very large current from the battery. The potential difference lost across the internal resistance (Ir) becomes large, so the terminal potential difference falls. The headlights, connected to the same terminals, receive a lower potential difference and dim.',
  explanation: 'Terminal pd = emf − Ir: the more current drawn, the lower the potential difference available to everything connected.',
  memo: [
    { code: 'A', marks: 1, text: 'Starter draws a large current' },
    { code: 'R', marks: 1, text: 'Large Ir, so the terminal pd falls' },
    { code: 'R', marks: 1, text: 'Lower pd across the headlights, so they dim' },
  ],
})

/* ===================================================================== */
/* Snell's law (Grade 11)                                                 */
/* ===================================================================== */

const optics = { topicId: 'phys-geometric-optics', grade: 11 } as const

{
  const [n1, n2, i] = [1.0, 1.5, 40]
  const r = deg(Math.asin((n1 * Math.sin(rad(i))) / n2))
  out.push({
    ...optics,
    id: 'tsq-ps11-snell-air-glass',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A ray of light passes from air (n = 1,0) into glass (n = 1,5) at an angle of incidence of ${i}°. Use Snell's law to calculate the angle of refraction.`,
    answer: `n₁ sin θ₁ = n₂ sin θ₂: 1,0 × sin ${i}° = 1,5 × sin θ₂, so sin θ₂ = ${n(Math.sin(rad(i)) / n2, 4)} and θ₂ = ${n(r, 1)}°.`,
    explanation: 'Entering a medium with a higher refractive index, the ray bends towards the normal: the angle of refraction is smaller.',
    memo: [
      { code: 'SF', marks: 1, text: 'n₁ sin θ₁ = n₂ sin θ₂ substituted' },
      { code: 'A', marks: 1, text: `sin θ₂ = ${n(Math.sin(rad(i)) / n2, 4)}` },
      { code: 'A', marks: 1, text: `θ₂ = ${n(r, 1)}°` },
      { code: 'R', marks: 1, text: 'Bends towards the normal' },
    ],
  })
}
{
  const [n1, n2, i] = [1.33, 1.0, 30]
  const s = (n1 * Math.sin(rad(i))) / n2
  const r = deg(Math.asin(s))
  out.push({
    ...optics,
    id: 'tsq-ps11-snell-water-air',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Light travels from water (refractive index 1,33) into air (refractive index 1,0) at an angle of incidence of ${i}°. Use Snell's law, n₁ sin θ₁ = n₂ sin θ₂, to calculate the angle of refraction, and compare it with the angle of incidence.`,
    answer: `1,33 × sin ${i}° = 1,0 × sin θ₂, so sin θ₂ = ${n(s, 3)} and θ₂ = ${n(r, 1)}°. The ray bends away from the normal, because it enters a medium with a lower refractive index.`,
    explanation: 'Light speeds up when it enters air from water, and bends away from the normal.',
    memo: [
      { code: 'SF', marks: 1, text: 'Snell’s law substituted' },
      { code: 'A', marks: 1, text: `sin θ₂ = ${n(s, 3)}` },
      { code: 'A', marks: 1, text: `θ₂ = ${n(r, 1)}°` },
      { code: 'A', marks: 1, text: 'Larger than the angle of incidence: away from the normal' },
    ],
  })
}
{
  const [i, r] = [50, 33]
  const idx = Math.sin(rad(i)) / Math.sin(rad(r))
  out.push({
    ...optics,
    id: 'tsq-ps11-snell-find-n',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A ray of light in air strikes the surface of an unknown liquid at an angle of incidence of ${i}° and is refracted at ${r}°. Use Snell's law to calculate the refractive index of the liquid.`,
    answer: `n = sin ${i}° ÷ sin ${r}° = ${n(Math.sin(rad(i)), 4)} ÷ ${n(Math.sin(rad(r)), 4)} = ${n(idx)}.`,
    explanation: 'With air as the first medium (n = 1,0), Snell’s law reduces to n = sin θ₁ ÷ sin θ₂.',
    memo: [
      { code: 'SF', marks: 1, text: '1,0 × sin 50° = n sin 33°' },
      { code: 'M', marks: 1, text: 'n made the subject' },
      { code: 'A', marks: 1, text: `n = ${n(idx)}` },
    ],
  })
}
{
  const nWater = 1.33
  const v = c / nWater
  out.push({
    ...optics,
    id: 'tsq-ps11-speed-in-water',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `The refractive index of water is ${n(nWater)}. Calculate the speed of light in water, and use it to explain why light refracts as it enters water at an angle, as Snell's law describes. (c = 3,0 × 10⁸ m·s⁻¹)`,
    answer: `v = c ÷ n = 3,0 × 10⁸ ÷ ${n(nWater)} = ${sci(v)} m·s⁻¹. Light slows down as it enters the water, which changes its direction at the boundary.`,
    explanation: 'n = c/v: the refractive index tells you how many times slower light travels in the medium.',
    memo: [
      { code: 'A', marks: 1, text: `${sci(v)} m·s⁻¹` },
      { code: 'R', marks: 1, text: 'Change in speed at the boundary causes the change in direction' },
    ],
  })
}

/* ===================================================================== */
/* Work (Grade 12)                                                        */
/* ===================================================================== */

const work = { topicId: 'phys-work-energy-power', grade: 12 } as const

{
  const [f, d, a] = [200, 15, 30]
  const w = f * d * Math.cos(rad(a))
  out.push({
    ...work,
    id: 'tsq-ps12-work-angle',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A crate is pulled ${d} m along a horizontal floor by a rope that exerts ${f} N at ${a}° above the horizontal. Calculate the work done on the crate by the rope.`,
    answer: `W = F Δx cos θ = ${f} × ${d} × cos ${a}° = ${n(w)} J.`,
    explanation: 'Only the component of the force along the displacement does work, hence the cos θ.',
    memo: [
      { code: 'SF', marks: 1, text: 'W = FΔx cos θ substituted' },
      { code: 'A', marks: 1, text: `${n(w)}` },
      { code: 'A', marks: 1, text: 'Unit: J' },
    ],
  })
}
{
  const [ff, d] = [40, 8]
  out.push({
    ...work,
    id: 'tsq-ps12-work-friction',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A box slides ${d} m across a rough floor, and the frictional force on it is ${ff} N. Calculate the work done on the box by friction using W = FΔx cos θ, and explain why friction does negative work.`,
    answer: `W = f Δx cos 180° = ${ff} × ${d} × (−1) = ${n(-ff * d)} J. Friction acts opposite to the displacement, so it does negative work: it removes kinetic energy from the box.`,
    explanation: 'The angle between friction and the displacement is 180°, and cos 180° = −1.',
    memo: [
      { code: 'SF', marks: 1, text: 'W = fΔx cos 180°' },
      { code: 'A', marks: 1, text: `${n(-ff * d)} J` },
      { code: 'R', marks: 1, text: 'Friction opposes the motion, so the work is negative' },
    ],
  })
}
{
  const [m, hh] = [2, 5]
  const w = m * g * hh
  out.push({
    ...work,
    id: 'tsq-ps12-work-gravity',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Calculate the work done by gravity on a ${m} kg ball as it falls ${hh} m, and state the work done by gravity when the same ball is thrown ${hh} m upwards.`,
    answer: `Falling: W = mgΔy cos 0° = ${m} × 9,8 × ${hh} = ${n(w)} J (positive: gravity acts along the motion). Rising: W = ${n(-w)} J (negative: gravity opposes the motion).`,
    explanation: 'The sign of the work depends on whether the force points along the displacement or against it.',
    memo: [
      { code: 'SF', marks: 1, text: 'W = mgΔy' },
      { code: 'A', marks: 1, text: `${n(w)} J falling` },
      { code: 'A', marks: 1, text: `${n(-w)} J rising` },
    ],
  })
}
{
  const [m, hh] = [5, 1.2]
  const w = m * g * hh
  out.push({
    ...work,
    id: 'tsq-ps12-work-lifting',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A ${m} kg box is lifted vertically through ${n(hh)} m at constant velocity. Using W = FΔx cos θ, calculate the work done by the lifting force, and state whether it is positive or negative.`,
    answer: `At constant velocity the lifting force equals the weight: F = mg = ${m} × 9,8 = ${n(m * g)} N. W = FΔy cos 0° = ${n(m * g)} × ${n(hh)} = ${n(w)} J, positive because the force acts along the displacement.`,
    explanation: 'Constant velocity means zero net force, so the applied force balances the weight exactly.',
    memo: [
      { code: 'A', marks: 1, text: `F = ${n(m * g)} N` },
      { code: 'SF', marks: 1, text: 'W = FΔy' },
      { code: 'A', marks: 1, text: `${n(w)} J` },
    ],
  })
}

/* ===================================================================== */
/* Mathematics, Grade 10: estimating surds and the real number system     */
/* ===================================================================== */

const num = { topicId: 'math-number-systems', grade: 10 } as const

out.push(
  {
    ...num,
    id: 'tsq-m10-cube-root-between',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Without using a calculator, determine between which two consecutive integers ∛100 lies.',
    answer: '4³ = 64 and 5³ = 125, and 64 < 100 < 125, so 4 < ∛100 < 5.',
    explanation: 'The method for square roots works for cube roots too, using perfect cubes instead of perfect squares.',
    memo: [
      { code: 'M', marks: 1, text: '64 < 100 < 125' },
      { code: 'A', marks: 1, text: 'Between 4 and 5' },
    ],
  },
  {
    ...num,
    id: 'tsq-m10-sum-of-surds',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Without using a calculator, determine between which two consecutive integers √20 + √50 lies.',
    answer: '4,4² = 19,36 and 4,5² = 20,25, so 4,4 < √20 < 4,5. 7,0² = 49 and 7,1² = 50,41, so 7,0 < √50 < 7,1. Adding: 11,4 < √20 + √50 < 11,6, so the sum lies between 11 and 12.',
    explanation: 'Estimating each surd only to the nearest whole number gives 4 + 7 to 5 + 8, which is not narrow enough; one decimal place settles it.',
    memo: [
      { code: 'M', marks: 1, text: '√20 between 4,4 and 4,5' },
      { code: 'M', marks: 1, text: '√50 between 7,0 and 7,1' },
      { code: 'A', marks: 1, text: 'Between 11 and 12' },
    ],
  },
  {
    ...num,
    id: 'tsq-m10-closer-to',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Without using a calculator, decide whether √29 is closer to 5 or to 6, and give a reason.',
    answer: '25 < 29 < 36. 29 is 4 away from 25 but 7 away from 36, so √29 is closer to 5 (it is about 5,39).',
    explanation: 'Comparing the distances to the neighbouring perfect squares gives a quick, reliable estimate.',
    memo: [
      { code: 'M', marks: 1, text: '25 < 29 < 36 compared' },
      { code: 'A', marks: 1, text: 'Closer to 5' },
    ],
  },
  {
    ...num,
    id: 'tsq-m10-classify-numbers',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 4,
    prompt: 'For each number, write down whether it is a natural number, an integer, a rational number or an irrational number (give the smallest set it belongs to): −3; 2/5; √9; √11.',
    answer: '−3: integer. 2/5: rational. √9 = 3: natural number. √11: irrational.',
    explanation: 'The sets are nested: every natural number is an integer, every integer is rational, and every rational and irrational number is real.',
    memo: [
      { code: 'A', marks: 1, text: '−3: integer' },
      { code: 'A', marks: 1, text: '2/5: rational' },
      { code: 'A', marks: 1, text: '√9: natural' },
      { code: 'A', marks: 1, text: '√11: irrational' },
    ],
  },
  {
    ...num,
    id: 'tsq-m10-never-repeats',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Is the number 0,121121112… (where the pattern of 1s and 2s goes on forever and never repeats) rational or irrational? Explain.',
    answer: 'Irrational. It goes on forever without a repeating block, so it cannot be written as a fraction a/b of integers.',
    explanation: 'A rational number ends or repeats; a number that does neither is irrational.',
    memo: [
      { code: 'A', marks: 1, text: 'Irrational' },
      { code: 'R', marks: 1, text: 'Never ends and never repeats, so not a/b' },
    ],
  },
  {
    ...num,
    id: 'tsq-m10-give-examples',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Give an example of each: (a) an integer that is not a natural number; (b) a rational number that is not an integer; (c) an irrational number between 3 and 4.',
    answer: '(a) For example −2 (or 0). (b) For example 1/2. (c) For example √10 or π.',
    explanation: 'For (c), any √n with 9 < n < 16 and n not a perfect square works.',
    memo: [
      { code: 'A', marks: 1, text: 'A negative integer or 0' },
      { code: 'A', marks: 1, text: 'A fraction such as 1/2' },
      { code: 'A', marks: 1, text: 'e.g. √10 or π' },
    ],
  },
)

/* ===================================================================== */
/* Mat Lit: misleading graphs and data quality                             */
/* ===================================================================== */

const data = (grade: 10 | 11 | 12) => ({ topicId: 'data-handling', grade }) as const

{
  const [a, b, axis] = [42000, 46000, 40000]
  const pct = ((b - a) / a) * 100
  const look = (b - axis) / (a - axis)
  out.push({
    ...data(10),
    id: 'tsq-ml10-axis-not-zero',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: `A school’s bar graph shows its electricity cost: R${n(a, 0)} in 2024 and R${n(b, 0)} in 2025. The vertical axis starts at R${n(axis, 0)}, so the 2025 bar looks ${look} times as tall as the 2024 bar.`,
    prompt: 'Calculate the actual percentage increase in the cost, and explain why the graph is misleading.',
    answer: `Increase = (${n(b, 0)} − ${n(a, 0)}) ÷ ${n(a, 0)} × 100 = ${n(pct)}%. Because the vertical axis does not start at zero, the 2025 bar looks ${look} times as tall, exaggerating a ${n(pct)}% rise.`,
    explanation: 'An axis that does not start at zero cuts off the bottom of every bar, so differences between the bars look much bigger than they are.',
    memo: [
      { code: 'M', marks: 1, text: 'Difference ÷ original × 100' },
      { code: 'A', marks: 1, text: `${n(pct)}%` },
      { code: 'R', marks: 1, text: 'Axis does not start at zero' },
      { code: 'J', marks: 1, text: `Bars look ${look} times as big, which exaggerates the increase` },
    ],
  })
}
out.push(
  {
    ...data(11),
    id: 'tsq-ml11-canteen-sample',
    difficulty: 'Moderate',
    cognitiveLevel: 4,
    marks: 4,
    context: 'A school of 1 100 learners posts a notice: "9 out of 10 learners prefer the new canteen menu!" The survey asked 20 learners who were buying lunch at the canteen on one Monday.',
    prompt: 'Identify TWO problems with how the data was collected, and explain why the notice is not a valid conclusion about the whole school.',
    answer:
      'The sample is very small (20 of 1 100 learners, under 2%). It is biased: only learners already buying from the canteen were asked, and only on one day, so learners who avoid the canteen were left out. The sample is not representative, so it cannot support a claim about the whole school.',
    explanation: 'A valid conclusion about a population needs a large enough sample chosen so that every group has a fair chance of being asked.',
    memo: [
      { code: 'A', marks: 1, text: 'Sample too small (20 of 1 100)' },
      { code: 'A', marks: 1, text: 'Biased: only canteen buyers / one day' },
      { code: 'R', marks: 1, text: 'Not representative of all learners' },
      { code: 'J', marks: 1, text: 'So the claim about the whole school is not valid' },
    ],
  },
)
{
  const [h2015, h2025] = [1200, 2400]
  out.push({
    ...data(12),
    id: 'tsq-ml12-pictogram-area',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 3,
    context: `A municipal report uses a pictogram of a house to show that ${n(h2015, 0)} houses were built in 2015 and ${n(h2025, 0)} in 2025. The 2025 house picture is drawn twice as tall and twice as wide as the 2015 picture.`,
    prompt: 'Explain why this pictogram is misleading, using the area of the pictures.',
    answer: `The number of houses doubled (${n(h2015, 0)} to ${n(h2025, 0)}), but doubling both the height and the width makes the picture's area 2 × 2 = 4 times as large. The eye compares areas, so the pictogram makes the increase look twice as big as it really was.`,
    explanation: 'Pictures drawn at different sizes distort a comparison; the honest way is to repeat same-sized icons.',
    memo: [
      { code: 'A', marks: 1, text: 'Houses doubled' },
      { code: 'M', marks: 1, text: 'Area 2 × 2 = 4 times larger' },
      { code: 'J', marks: 1, text: 'Increase looks twice as large as it is' },
    ],
  })
}
out.push({
  ...data(12),
  id: 'tsq-ml12-uneven-years',
  difficulty: 'Moderate',
  cognitiveLevel: 4,
  marks: 3,
  context: 'A line graph of a town’s water use has these years equally spaced along its horizontal axis: 2010, 2015, 2020, 2022, 2023, 2024.',
  prompt: 'Explain why the horizontal axis makes this graph misleading, and describe how it distorts the trend.',
  answer:
    'The intervals are unequal (5 years, 5 years, then 2, 1 and 1) but drawn the same width. Changes over five years are squeezed into the same space as changes over one year, so the early trend looks steeper than it was and the recent years look slower than they were, making the trend hard to compare.',
  explanation: 'Unequal intervals on an axis, drawn as if equal, distort the rate of change shown by the line.',
  memo: [
    { code: 'A', marks: 1, text: 'Unequal intervals drawn as equal' },
    { code: 'R', marks: 1, text: 'Five-year and one-year changes take the same space' },
    { code: 'J', marks: 1, text: 'So the rate of change is distorted' },
  ],
})

export const thinSubtopicQuestions: Question[] = out
