/**
 * Physical Sciences questions for the thinnest sub-topics -- the parts of a
 * topic where practice and weekly tests ran out first, as the sub-topic
 * coverage check counted them:
 *
 *   Electric circuits (Grade 12): power and cost -- 1; combining resistors -- 4.
 *   Electrodynamics (Grade 12): motors -- 2.
 *   The photoelectric effect (Grade 12): photons -- 5; why it needed the
 *     photon model -- 6.
 *   Rate of reaction (Grade 12): factors affecting rate -- 4; the
 *     Maxwell-Boltzmann distribution -- 3.
 *   Chemical equilibrium (Grade 12): dynamic equilibrium -- 4.
 *   Electromagnetism (Grade 11): Faraday's law -- 2; Lenz's law -- 2.
 *   Sound (Grade 10): ultrasound and hearing damage -- 1.
 *   The periodic table (Grade 10): groups -- 2; predicting behaviour -- 4.
 *   Transverse pulses (Grade 10): superposition -- 8.
 *
 * Every number is computed from the values declared with it. Numbers are
 * written with a decimal comma; h = 6,63 × 10⁻³⁴ J·s and c = 3,0 × 10⁸ m·s⁻¹.
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
/* Electric circuits, Grade 12: power and cost, combining resistors       */
/* ===================================================================== */

const circuits = { topicId: 'phys-electric-circuits', grade: 12 } as const

{
  const [p, minutes, days, tariff] = [2000, 15, 30, 2.8]
  const kwh = (p / 1000) * (minutes / 60) * days
  out.push({
    ...circuits,
    id: 'pg-ps12-cost-kettle',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A kettle with a power rating of ${n(p)} W is used for ${minutes} minutes every day for ${days} days. Electricity costs R${n(tariff)} per kWh. Calculate the cost of using the kettle for the ${days} days.`,
    answer: `R${n(kwh * tariff)}`,
    explanation: `Work in kilowatts and hours, because the tariff is per kilowatt-hour. P = ${n(p / 1000)} kW and the total time is ${minutes} min × ${days} = ${n((minutes * days) / 60)} h. E = Pt = ${n(p / 1000)} × ${n((minutes * days) / 60)} = ${n(kwh)} kWh. Cost = ${n(kwh)} × R${n(tariff)} = R${n(kwh * tariff)}.`,
    memo: [
      { code: 'M', marks: 1, text: `Convert to kW and hours: ${n(p / 1000)} kW, ${n((minutes * days) / 60)} h` },
      { code: 'A', marks: 1, text: `E = ${n(kwh)} kWh` },
      { code: 'M', marks: 1, text: 'Cost = energy × tariff' },
      { code: 'CA', marks: 1, text: `R${n(kwh * tariff)}` },
    ],
  })
}

{
  const [p, v] = [1500, 230]
  out.push({
    ...circuits,
    id: 'pg-ps12-heater-rated',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A heater is rated at ${n(p)} W, ${v} V. Calculate (a) the current it draws when it works at its rated power and (b) its resistance.`,
    answer: `(a) ${n(p / v)} A  (b) ${n((v * v) / p)} Ω`,
    explanation: `(a) P = VI, so I = P/V = ${n(p)} ÷ ${v} = ${n(p / v)} A. (b) P = V²/R, so R = V²/P = ${v}² ÷ ${n(p)} = ${n((v * v) / p)} Ω. (R = V/I = ${v} ÷ ${n(p / v, 4)} gives the same answer.)`,
    memo: [
      { code: 'SF', marks: 1, text: `I = P/V = ${n(p)} ÷ ${v}` },
      { code: 'A', marks: 1, text: `${n(p / v)} A` },
      { code: 'SF', marks: 1, text: `R = V²/P = ${v}² ÷ ${n(p)}` },
      { code: 'A', marks: 1, text: `${n((v * v) / p)} Ω` },
    ],
  })
}

{
  const [r, i, minutes] = [12, 0.5, 5]
  const p = i * i * r
  out.push({
    ...circuits,
    id: 'pg-ps12-power-energy-resistor',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A current of ${n(i)} A flows through a ${r} Ω resistor. Calculate the power dissipated in the resistor and the energy consumed in ${minutes} minutes.`,
    answer: `P = ${n(p)} W; W = ${n(p * minutes * 60)} J`,
    explanation: `P = I²R = ${n(i)}² × ${r} = ${n(p)} W. The energy is the power multiplied by the time in seconds: W = Pt = ${n(p)} × ${minutes * 60} = ${n(p * minutes * 60)} J.`,
    memo: [
      { code: 'SF', marks: 1, text: `P = I²R = ${n(i)}² × ${r}` },
      { code: 'A', marks: 1, text: `${n(p)} W` },
      { code: 'SF', marks: 1, text: `W = Pt = ${n(p)} × ${minutes * 60} s` },
      { code: 'CA', marks: 1, text: `${n(p * minutes * 60)} J` },
    ],
  })
}

{
  const v = 230
  const [pa, pb] = [60, 100]
  const [ra, rb] = [(v * v) / pa, (v * v) / pb]
  out.push({
    ...circuits,
    id: 'pg-ps12-lamps-parallel',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Two lamps are rated at ${pa} W, ${v} V and ${pb} W, ${v} V. They are connected in parallel to a ${v} V supply. Calculate the resistance of each lamp, and explain which lamp glows brighter.`,
    answer: `${pa} W lamp: ${n(ra)} Ω; ${pb} W lamp: ${n(rb)} Ω. The ${pb} W lamp glows brighter.`,
    explanation: `R = V²/P: the ${pa} W lamp has R = ${v}² ÷ ${pa} = ${n(ra)} Ω and the ${pb} W lamp R = ${v}² ÷ ${pb} = ${n(rb)} Ω. In parallel each lamp has the full ${v} V across it, so each works at its rated power. Since P = V²/R with V the same, the lamp with the smaller resistance -- the ${pb} W lamp -- dissipates more power and glows brighter.`,
    memo: [
      { code: 'SF', marks: 1, text: `R = V²/P = ${v}² ÷ ${pa}` },
      { code: 'A', marks: 1, text: `${n(ra)} Ω` },
      { code: 'A', marks: 1, text: `${n(rb)} Ω` },
      { code: 'R', marks: 1, text: 'Same potential difference across each lamp in parallel' },
      { code: 'C', marks: 1, text: `Smaller resistance, so more power: the ${pb} W lamp is brighter` },
    ],
  })
}

{
  const v = 230
  const [pa, pb] = [60, 100]
  const [ra, rb] = [(v * v) / pa, (v * v) / pb]
  const i = v / (ra + rb)
  out.push({
    ...circuits,
    id: 'pg-ps12-lamps-series',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    prompt: `The same two lamps, rated at ${pa} W, ${v} V and ${pb} W, ${v} V, are now connected in series to the ${v} V supply. Calculate the power each lamp now dissipates, and explain why the result surprises many learners.`,
    answer: `${pa} W lamp: ${n(i * i * ra, 1)} W; ${pb} W lamp: ${n(i * i * rb, 1)} W. The ${pa} W lamp is now the brighter one.`,
    explanation: `The resistances do not change: ${n(ra)} Ω and ${n(rb)} Ω. In series the total resistance is ${n(ra + rb)} Ω, so I = ${v} ÷ ${n(ra + rb)} = ${n(i, 3)} A, the same through both lamps. P = I²R: the ${pa} W lamp dissipates ${n(i, 3)}² × ${n(ra)} = ${n(i * i * ra, 1)} W and the ${pb} W lamp ${n(i, 3)}² × ${n(rb)} = ${n(i * i * rb, 1)} W. With the same current, the larger resistance takes the larger share of the power, so the lamp with the LOWER rating glows brighter -- the rating only describes the lamp working on its own at ${v} V.`,
    memo: [
      { code: 'M', marks: 1, text: `Total resistance = ${n(ra)} + ${n(rb)} = ${n(ra + rb)} Ω` },
      { code: 'A', marks: 1, text: `I = ${n(i, 3)} A` },
      { code: 'CA', marks: 1, text: `${pa} W lamp: ${n(i * i * ra, 1)} W` },
      { code: 'CA', marks: 1, text: `${pb} W lamp: ${n(i * i * rb, 1)} W` },
      { code: 'R', marks: 1, text: 'Same current in series, so P = I²R is larger for the larger resistance' },
      { code: 'C', marks: 1, text: `The ${pa} W lamp is brighter; the rating applies only at ${v} V on its own` },
    ],
  })
}

{
  const [r1, r2, r3, v] = [6, 3, 4, 12]
  const rp = (r1 * r2) / (r1 + r2)
  const rt = rp + r3
  const i = v / rt
  const vp = i * rp
  out.push({
    ...circuits,
    id: 'pg-ps12-resistors-combined',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 6,
    prompt: `A ${r1} Ω resistor and a ${r2} Ω resistor are connected in parallel. This combination is connected in series with a ${r3} Ω resistor across a ${v} V battery. Ignore the resistance of the battery and the wires. Calculate (a) the total resistance, (b) the current from the battery and (c) the current in the ${r2} Ω resistor.`,
    answer: `(a) ${n(rt)} Ω  (b) ${n(i)} A  (c) ${n(vp / r2)} A`,
    explanation: `(a) Parallel part: 1/R = 1/${r1} + 1/${r2}, so R = ${n(rp)} Ω; total = ${n(rp)} + ${r3} = ${n(rt)} Ω. (b) I = V/R = ${v} ÷ ${n(rt)} = ${n(i)} A. (c) The potential difference across the parallel part is IR = ${n(i)} × ${n(rp)} = ${n(vp)} V, so the current in the ${r2} Ω resistor is ${n(vp)} ÷ ${r2} = ${n(vp / r2)} A.`,
    memo: [
      { code: 'SF', marks: 1, text: `1/R = 1/${r1} + 1/${r2}; R = ${n(rp)} Ω` },
      { code: 'CA', marks: 1, text: `Total resistance = ${n(rt)} Ω` },
      { code: 'CA', marks: 1, text: `I = ${n(i)} A` },
      { code: 'M', marks: 1, text: 'V across the parallel part = I × R(parallel)' },
      { code: 'CA', marks: 1, text: `${n(vp)} V` },
      { code: 'CA', marks: 1, text: `${n(vp / r2)} A` },
    ],
  })
}

{
  const r = 9
  out.push({
    ...circuits,
    id: 'pg-ps12-three-equal-resistors',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 5,
    prompt: `Three identical ${r} Ω resistors are available. Calculate the equivalent resistance when (a) all three are in series, (b) all three are in parallel and (c) two are in parallel and that pair is in series with the third.`,
    answer: `(a) ${r * 3} Ω  (b) ${n(r / 3)} Ω  (c) ${n(r / 2 + r)} Ω`,
    explanation: `(a) In series the resistances add: ${r} + ${r} + ${r} = ${r * 3} Ω. (b) For n equal resistors in parallel, R = R₁/n = ${r} ÷ 3 = ${n(r / 3)} Ω. (c) The parallel pair gives ${r} ÷ 2 = ${n(r / 2)} Ω, and in series with the third: ${n(r / 2)} + ${r} = ${n(r / 2 + r)} Ω.`,
    memo: [
      { code: 'A', marks: 1, text: `${r * 3} Ω` },
      { code: 'SF', marks: 1, text: `1/R = 1/${r} + 1/${r} + 1/${r}` },
      { code: 'A', marks: 1, text: `${n(r / 3)} Ω` },
      { code: 'M', marks: 1, text: `Pair in parallel = ${n(r / 2)} Ω, then add ${r} Ω` },
      { code: 'CA', marks: 1, text: `${n(r / 2 + r)} Ω` },
    ],
  })
}

out.push({
  ...circuits,
  id: 'pg-ps12-add-parallel-resistor',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 3,
  prompt:
    'A resistor is connected across a battery. A second resistor is then connected in parallel with the first. Assuming the battery keeps the same potential difference, explain what happens to the total resistance of the circuit and to the current from the battery.',
  answer: 'The total resistance decreases, so the current from the battery increases.',
  explanation:
    'Adding a branch in parallel gives the charge another path, so the equivalent resistance is smaller than either resistor on its own. With the same potential difference across a smaller resistance, I = V/R is larger. The current in the first resistor is unchanged (it still has the same potential difference across it); the extra current flows through the new branch.',
  memo: [
    { code: 'A', marks: 1, text: 'Total resistance decreases' },
    { code: 'R', marks: 1, text: 'An extra path for the charge / 1/R = 1/R₁ + 1/R₂ is larger' },
    { code: 'C', marks: 1, text: 'Same V over a smaller R, so the current increases' },
  ],
})

/* ===================================================================== */
/* Electrodynamics, Grade 12: motors                                      */
/* ===================================================================== */

const dynamo = { topicId: 'phys-electrodynamics', grade: 12 } as const

out.push(
  {
    ...dynamo,
    id: 'pg-ps12-motor-energy',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    prompt: 'State the energy conversion that takes place in an electric motor, and name TWO everyday applications of electric motors.',
    answer: 'Electrical energy is converted into mechanical (kinetic) energy. Applications: any two of fans, pumps, power tools, electric vehicles, washing machines.',
    explanation: 'A motor is fed with electrical energy and delivers rotation. (A generator does the reverse: it turns rotation into electrical energy.)',
    memo: [
      { code: 'A', marks: 1, text: 'Electrical energy to mechanical (kinetic) energy' },
      { code: 'A', marks: 1, text: 'First application, e.g. a fan or a pump' },
      { code: 'A', marks: 1, text: 'Second application, e.g. a power tool or an electric vehicle' },
    ],
  },
  {
    ...dynamo,
    id: 'pg-ps12-motor-turning',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why a current-carrying coil placed in a magnetic field experiences a turning effect, as it does in a motor.',
    answer:
      'Each side of the coil is a current-carrying conductor in a magnetic field, so each experiences a force. The current flows in opposite directions in the two sides, so the forces are in opposite directions. The two opposite forces on opposite sides of the coil produce a turning effect about its axis.',
    explanation: 'The motor effect acts on each side separately. Because the forces are equal, opposite and not in line, they turn the coil rather than move it along.',
    memo: [
      { code: 'A', marks: 1, text: 'A current-carrying conductor in a magnetic field experiences a force' },
      { code: 'R', marks: 1, text: 'The current is in opposite directions in the two sides, so the forces are opposite' },
      { code: 'C', marks: 1, text: 'Opposite forces on opposite sides produce a turning effect' },
    ],
  },
  {
    ...dynamo,
    id: 'pg-ps12-motor-commutator',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain the function of the commutator in a DC motor, and what would happen to the rotation of the motor without it.',
    answer:
      'The commutator reverses the direction of the current in the coil every half turn. This keeps the force on each side of the coil acting in the direction that continues the rotation, so the motor turns continuously in one direction. Without it, the coil would rock back and forth and come to rest instead of rotating.',
    explanation:
      'After half a turn the two sides of the coil have swapped places. If the current did not reverse, the forces would now turn the coil back the way it came. Reversing the current each half turn keeps the turning effect in the same direction.',
    memo: [
      { code: 'A', marks: 1, text: 'Reverses the current in the coil every half turn' },
      { code: 'R', marks: 1, text: 'So the forces keep turning the coil the same way' },
      { code: 'C', marks: 1, text: 'Without it the coil oscillates and stops instead of rotating' },
    ],
  },
  {
    ...dynamo,
    id: 'pg-ps12-motor-faster',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'State THREE changes that would make a DC motor turn faster, and give the reason they all work in terms of the force on the current-carrying coil of the motor.',
    answer: 'Increase the current; use a stronger magnet (stronger magnetic field); use more turns of wire on the coil. Each increases the force on the sides of the coil, and so the turning effect.',
    explanation: 'The force on a current-carrying conductor in a magnetic field increases with the current, the strength of the field and the length of wire in the field -- more turns means more wire.',
    memo: [
      { code: 'A', marks: 1, text: 'More current' },
      { code: 'A', marks: 1, text: 'Stronger magnet / magnetic field, or more turns on the coil' },
      { code: 'R', marks: 1, text: 'Each increases the force on the coil, so the turning effect' },
    ],
  },
)

/* ===================================================================== */
/* The photoelectric effect, Grade 12: photons, why it needed them        */
/* ===================================================================== */

const photo = { topicId: 'phys-em-radiation', grade: 12 } as const

{
  const lambda = 530e-9
  const e = (h * c) / lambda
  out.push({
    ...photo,
    id: 'pg-ps12-photon-green',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Calculate the energy of a photon of green light of wavelength 530 nm.',
    answer: `${sci(e)} J`,
    explanation: `E = hc/λ = (6,63 × 10⁻³⁴ × 3,0 × 10⁸) ÷ (530 × 10⁻⁹) = ${sci(e)} J. Convert nanometres to metres first: 1 nm = 10⁻⁹ m.`,
    memo: [
      { code: 'SF', marks: 1, text: 'E = hc/λ' },
      { code: 'SF', marks: 1, text: '(6,63 × 10⁻³⁴)(3,0 × 10⁸) ÷ (530 × 10⁻⁹)' },
      { code: 'A', marks: 1, text: `${sci(e)} J` },
    ],
  })
}

{
  const [p, lambda] = [5e-3, 650e-9]
  const e = (h * c) / lambda
  out.push({
    ...photo,
    id: 'pg-ps12-laser-photons',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: 'A laser pointer has an output power of 5 mW and emits red light of wavelength 650 nm. Calculate the number of photons it emits every second.',
    answer: `${sci(p / e)} photons per second`,
    explanation: `First the energy of one photon: E = hc/λ = (6,63 × 10⁻³⁴ × 3,0 × 10⁸) ÷ (650 × 10⁻⁹) = ${sci(e)} J. The laser emits 5 × 10⁻³ J every second, so the number of photons per second = ${'5 × 10⁻³'} ÷ ${sci(e)} = ${sci(p / e)}.`,
    memo: [
      { code: 'SF', marks: 1, text: 'E = hc/λ with λ = 650 × 10⁻⁹ m' },
      { code: 'A', marks: 1, text: `E = ${sci(e)} J` },
      { code: 'M', marks: 1, text: 'Power is the energy emitted per second' },
      { code: 'M', marks: 1, text: 'Number per second = power ÷ energy of one photon' },
      { code: 'CA', marks: 1, text: `${sci(p / e)}` },
    ],
  })
}

{
  const [red, violet] = [700, 400]
  out.push({
    ...photo,
    id: 'pg-ps12-photon-red-violet',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Compare the energy of each photon of red light (${red} nm) with that of violet light (${violet} nm). Which is greater, and by what factor?`,
    answer: `The violet photon, by a factor of ${n(red / violet)}.`,
    explanation: `E = hc/λ, so the photon energy is inversely proportional to the wavelength. The violet photon has the shorter wavelength and so the greater energy: E(violet)/E(red) = λ(red)/λ(violet) = ${red}/${violet} = ${n(red / violet)}.`,
    memo: [
      { code: 'R', marks: 1, text: 'E = hc/λ: energy is inversely proportional to wavelength' },
      { code: 'A', marks: 1, text: 'Violet photon has more energy' },
      { code: 'A', marks: 1, text: `Factor ${red}/${violet} = ${n(red / violet)}` },
    ],
  })
}

out.push(
  {
    ...photo,
    id: 'pg-ps12-wave-model-threshold',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'The wave model cannot explain why light below the threshold frequency frees no electrons, however long it shines. Explain why the wave model fails here, and how the photon model explains what is actually seen.',
    answer:
      'In the wave model the energy delivered depends on the brightness and the time, so light of any frequency should eventually eject electrons if it is bright enough or shines long enough. Instead, below the threshold frequency no electrons are emitted however bright the light. In the photon model light arrives in photons of energy E = hf, and one photon gives its energy to one electron. An electron can only be ejected if a single photon has at least the work function, hf ≥ W₀, so there is a minimum frequency.',
    explanation: 'The threshold is a fact about single photons, not about the total energy: a million photons each too weak cannot combine their energy on one electron.',
    memo: [
      { code: 'A', marks: 1, text: 'Wave model: enough brightness or time should eject electrons at any frequency' },
      { code: 'A', marks: 1, text: 'Observed: no emission below the threshold frequency, however bright' },
      { code: 'R', marks: 1, text: 'Photon model: each photon has E = hf and gives it to one electron' },
      { code: 'C', marks: 1, text: 'Emission only if hf ≥ W₀, so a minimum (threshold) frequency' },
    ],
  },
  {
    ...photo,
    id: 'pg-ps12-classical-delay',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'According to classical physics, what should happen when very dim light above the threshold frequency shines on a metal? State what is actually observed and explain it with the photon model.',
    answer:
      'Classical physics predicts a delay: the electrons would have to absorb energy from the weak wave gradually until they had enough to escape. In fact electrons are emitted immediately, even in very dim light. In the photon model each photon delivers all of its energy to one electron at once, so an electron is ejected as soon as a photon with enough energy arrives; dim light simply means fewer photons, and so fewer electrons.',
    explanation: 'Emission with no delay is one of the observations that forced the photon model: energy arrives in packets, not spread thinly over the surface.',
    memo: [
      { code: 'A', marks: 1, text: 'Classical prediction: a delay while electrons build up energy' },
      { code: 'A', marks: 1, text: 'Observed: emission is immediate' },
      { code: 'R', marks: 1, text: 'Each photon gives all its energy to one electron at once' },
      { code: 'C', marks: 1, text: 'Dim light = fewer photons, so fewer electrons, but no delay' },
    ],
  },
  {
    ...photo,
    id: 'pg-ps12-intensity-number-energy',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'Increasing the intensity of light above the threshold frequency increases the number of electrons emitted each second, but does not change their maximum kinetic energy. Explain both observations using the photon model.',
    answer:
      'A higher intensity at the same frequency means more photons arrive each second. Each photon can eject one electron, so more electrons are emitted each second. But each photon still has the same energy, hf, so the maximum kinetic energy of an ejected electron, Ek(max) = hf − W₀, is unchanged.',
    explanation: 'Intensity controls how many photons there are; frequency controls how much energy each one carries. The photoelectric equation contains only the frequency.',
    memo: [
      { code: 'A', marks: 1, text: 'Higher intensity = more photons per second' },
      { code: 'R', marks: 1, text: 'One photon ejects one electron, so more electrons per second' },
      { code: 'A', marks: 1, text: 'Each photon still has energy hf' },
      { code: 'C', marks: 1, text: 'Ek(max) = hf − W₀ is unchanged' },
    ],
  },
)

/* ===================================================================== */
/* Rate of reaction, Grade 12: factors, the Maxwell-Boltzmann distribution */
/* ===================================================================== */

const rate = { topicId: 'phys-reaction-rate', grade: 12 } as const

out.push(
  {
    ...rate,
    id: 'pg-ps12-rate-surface-area',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt:
      'Equal masses of zinc powder and zinc granules (lumps) are added to separate flasks of the same hydrochloric acid. Which reacts faster? Explain using the collision theory.',
    answer:
      'The zinc powder. It has a larger surface area, so more zinc particles are exposed to the acid, giving more collisions per second and so more effective collisions per second.',
    explanation: 'Only the particles on the surface of the solid can collide with the acid. Breaking a lump into powder exposes far more of them.',
    memo: [
      { code: 'A', marks: 1, text: 'The powder' },
      { code: 'R', marks: 1, text: 'Larger surface area: more particles exposed' },
      { code: 'C', marks: 1, text: 'More (effective) collisions per second' },
    ],
  },
  {
    ...rate,
    id: 'pg-ps12-rate-concentration',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain, using the collision theory, why increasing the concentration of an acid increases the rate at which it reacts with magnesium ribbon.',
    answer:
      'A higher concentration means more acid particles per unit volume. The particles collide with the magnesium more often, so there are more effective collisions per second and the rate increases.',
    explanation: 'Concentration changes how often particles collide, not how hard: the fraction of collisions with enough energy is unchanged, but there are more collisions in total.',
    memo: [
      { code: 'A', marks: 1, text: 'More particles per unit volume' },
      { code: 'R', marks: 1, text: 'More collisions per second' },
      { code: 'C', marks: 1, text: 'More effective collisions per second, so a higher rate' },
    ],
  },
  {
    ...rate,
    id: 'pg-ps12-rate-pressure',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why increasing the pressure of a mixture of reacting gases increases the rate of the reaction.',
    answer: 'At a higher pressure the gas particles are closer together -- more particles per unit volume -- so they collide more often, giving more effective collisions per second.',
    explanation: 'For gases, raising the pressure has the same effect as raising the concentration.',
    memo: [
      { code: 'A', marks: 1, text: 'More particles per unit volume (particles closer together)' },
      { code: 'R', marks: 1, text: 'More effective collisions per second' },
    ],
  },
  {
    ...rate,
    id: 'pg-ps12-rate-catalyst-pathway',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain how a catalyst increases the rate of a reaction, and state what happens to the catalyst itself.',
    answer:
      'A catalyst provides an alternative pathway (reaction route) with a lower activation energy. More particles now have enough energy to react, so there are more effective collisions per second. The catalyst is not used up: it is chemically unchanged at the end.',
    explanation: 'The catalyst does not give the particles more energy; it lowers the barrier they have to get over.',
    memo: [
      { code: 'A', marks: 1, text: 'Alternative pathway with a lower activation energy' },
      { code: 'R', marks: 1, text: 'More particles have enough energy: more effective collisions per second' },
      { code: 'A', marks: 1, text: 'The catalyst is chemically unchanged / not used up' },
    ],
  },
  {
    ...rate,
    id: 'pg-ps12-mb-area',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'On a Maxwell-Boltzmann distribution curve of the kinetic energies of gas particles, what does the area under the curve to the right of the activation energy represent?',
    answer: 'The number (fraction) of particles with kinetic energy equal to or greater than the activation energy -- the particles that can react when they collide.',
    explanation: 'The whole area under the curve is all the particles; the part beyond the activation energy is the share with enough energy for an effective collision.',
    memo: [
      { code: 'A', marks: 1, text: 'The number / fraction of particles' },
      { code: 'A', marks: 1, text: 'With kinetic energy ≥ the activation energy (enough to react)' },
    ],
  },
  {
    ...rate,
    id: 'pg-ps12-mb-temperature',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Describe how the Maxwell-Boltzmann distribution curve changes when the temperature of a gas is increased, and use it to explain why the rate of reaction increases.',
    answer:
      'The peak of the curve moves to the right (higher kinetic energy) and becomes lower, and the curve spreads out; the total area under it stays the same because the number of particles is unchanged. A much larger fraction of the particles now has kinetic energy above the activation energy, so there are more effective collisions per second and the rate increases.',
    explanation: 'The activation energy itself does not change with temperature -- the particles move to meet it.',
    memo: [
      { code: 'A', marks: 1, text: 'Peak moves right (to higher energy) and is lower' },
      { code: 'A', marks: 1, text: 'Curve broader; area under it unchanged' },
      { code: 'R', marks: 1, text: 'Larger fraction of particles above the activation energy' },
      { code: 'C', marks: 1, text: 'More effective collisions per second' },
    ],
  },
  {
    ...rate,
    id: 'pg-ps12-mb-catalyst',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Use the Maxwell-Boltzmann distribution curve to explain how a catalyst increases the rate of reaction even though the curve itself does not change.',
    answer:
      'The curve depends only on the temperature, which the catalyst does not change. But the catalyst lowers the activation energy, so on the distribution the activation energy line moves to the left. A larger area under the curve lies to the right of the new line: a larger fraction of the particles has enough kinetic energy to react, so there are more effective collisions per second.',
    explanation: 'Temperature changes the curve; a catalyst changes where the line is drawn on it. Both enlarge the area beyond the line.',
    memo: [
      { code: 'A', marks: 1, text: 'The curve is unchanged (same temperature)' },
      { code: 'A', marks: 1, text: 'The activation energy line moves left (lower)' },
      { code: 'C', marks: 1, text: 'Larger fraction of particles beyond it, so more effective collisions per second' },
    ],
  },
  {
    ...rate,
    id: 'pg-ps12-mb-small-rise',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 3,
    prompt:
      'A rise of 10 °C often roughly doubles the rate of a reaction, even though the average kinetic energy of the particles increases by only a few per cent. Use the Maxwell-Boltzmann distribution to explain this.',
    answer:
      'The activation energy usually lies far out in the tail of the distribution, well above the average kinetic energy. When the curve shifts slightly to the right, the small tail beyond the activation energy grows by a large proportion -- it can roughly double -- even though the average energy has hardly changed. The rate depends on the number of effective collisions, and so on this fraction, not on the average.',
    explanation: 'What matters is the number of particles above a fixed threshold, and near the tail a small shift of the curve changes that number greatly.',
    memo: [
      { code: 'A', marks: 1, text: 'The activation energy is in the tail, far above the average' },
      { code: 'R', marks: 1, text: 'A small shift of the curve greatly increases the fraction beyond it' },
      { code: 'C', marks: 1, text: 'Rate depends on that fraction (effective collisions), not the average energy' },
    ],
  },
)

/* ===================================================================== */
/* Chemical equilibrium, Grade 12: dynamic equilibrium                    */
/* ===================================================================== */

const equilibrium = { topicId: 'phys-chemical-equilibrium', grade: 12 } as const

out.push(
  {
    ...equilibrium,
    id: 'pg-ps12-dynamic-properties',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    prompt: 'State THREE features of a reversible reaction that has reached dynamic equilibrium.',
    answer:
      'Any three: it is in a closed system; the rate of the forward reaction equals the rate of the reverse reaction; the concentrations of reactants and products stay constant; both reactions are still taking place; the macroscopic properties (colour, pressure) no longer change.',
    explanation: 'Dynamic equilibrium describes a balance of rates, not a stop.',
    memo: [
      { code: 'A', marks: 1, text: 'Closed system' },
      { code: 'A', marks: 1, text: 'Forward rate = reverse rate' },
      { code: 'A', marks: 1, text: 'Concentrations constant (both reactions continue)' },
    ],
  },
  {
    ...equilibrium,
    id: 'pg-ps12-dynamic-not-static',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why chemical equilibrium is described as dynamic and not static.',
    answer: 'Both the forward and the reverse reactions are still taking place at equilibrium, at the same rate, so there is no net change -- the reactions have not stopped.',
    explanation: 'A static balance would mean nothing is happening. At a dynamic equilibrium particles are constantly reacting in both directions.',
    memo: [
      { code: 'A', marks: 1, text: 'Forward and reverse reactions continue' },
      { code: 'R', marks: 1, text: 'At the same rate, so no net change' },
    ],
  },
  {
    ...equilibrium,
    id: 'pg-ps12-dynamic-closed-system',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why a reversible reaction that produces a gas can only reach equilibrium in a closed system.',
    answer: 'In an open system the gas escapes, so it cannot react in the reverse direction. The reverse reaction can then never reach the rate of the forward reaction, and the reaction runs to completion instead.',
    explanation: 'Equilibrium needs every substance to stay available to react; a closed system keeps them all in.',
    memo: [
      { code: 'A', marks: 1, text: 'In an open system the gas (product) escapes' },
      { code: 'R', marks: 1, text: 'So the reverse reaction cannot keep pace: no equilibrium' },
    ],
  },
  {
    ...equilibrium,
    id: 'pg-ps12-dynamic-not-equal',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 2,
    prompt: 'A learner says that at equilibrium the concentrations of the reactants and the products are equal. Is the learner correct? Explain.',
    answer: 'No. At equilibrium the concentrations are constant, not necessarily equal. It is the rates of the forward and reverse reactions that are equal.',
    explanation: 'The value of Kc shows how far from equal the concentrations can be: a large Kc means mostly products, a small Kc mostly reactants.',
    memo: [
      { code: 'A', marks: 1, text: 'No: concentrations are constant, not necessarily equal' },
      { code: 'R', marks: 1, text: 'It is the rates that are equal' },
    ],
  },
  {
    ...equilibrium,
    id: 'pg-ps12-dynamic-rates-over-time',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt:
      'A reversible reaction is started with only reactants in a closed container. Describe how the rates of the forward and reverse reactions change from the start until equilibrium is reached.',
    answer:
      'The forward rate is highest at the start and decreases as the reactants are used up. The reverse rate starts at zero and increases as products form. When the two rates become equal, equilibrium is reached, and from then on both stay constant.',
    explanation: 'On a graph of rate against time the two lines approach each other and join, then run level together.',
    memo: [
      { code: 'A', marks: 1, text: 'Forward rate decreases from its maximum' },
      { code: 'A', marks: 1, text: 'Reverse rate increases from zero' },
      { code: 'A', marks: 1, text: 'Equilibrium when the rates are equal; then both constant' },
    ],
  },
)

/* ===================================================================== */
/* Electromagnetism, Grade 11: Faraday's law, Lenz's law                  */
/* ===================================================================== */

const emag = { topicId: 'phys-electromagnetism', grade: 11 } as const

{
  const [b, a, theta] = [0.4, 0.02, 30]
  const phi = b * a * Math.cos((theta * Math.PI) / 180)
  out.push({
    ...emag,
    id: 'pg-ps11-flux-angle',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A loop of wire of area ${n(a)} m² is in a uniform magnetic field of ${n(b)} T. The angle between the field and the normal to the loop is ${theta}°. Calculate the magnetic flux through the loop in webers.`,
    answer: `${sci(phi)} Wb`,
    explanation: `Φ = BA cos θ = ${n(b)} × ${n(a)} × cos ${theta}° = ${sci(phi)} Wb. The angle is measured from the normal to the loop, so a field straight through the loop (θ = 0°) gives the largest flux.`,
    memo: [
      { code: 'SF', marks: 1, text: 'Φ = BA cos θ' },
      { code: 'SF', marks: 1, text: `${n(b)} × ${n(a)} × cos ${theta}°` },
      { code: 'A', marks: 1, text: `${sci(phi)} Wb` },
    ],
  })
}

{
  const [turns, phi1, phi2, t] = [150, 2.0e-3, 8.0e-3, 0.05]
  const emf = (turns * (phi2 - phi1)) / t
  out.push({
    ...emag,
    id: 'pg-ps11-faraday-coil-150',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `The magnetic flux through a coil of ${turns} turns increases from 2,0 × 10⁻³ Wb to 8,0 × 10⁻³ Wb in ${n(t)} s. Use Faraday's law to calculate the magnitude of the induced emf.`,
    answer: `${n(emf)} V`,
    explanation: `ΔΦ = 8,0 × 10⁻³ − 2,0 × 10⁻³ = 6,0 × 10⁻³ Wb. By Faraday's law, the magnitude of the emf is N ΔΦ/Δt = ${turns} × 6,0 × 10⁻³ ÷ ${n(t)} = ${n(emf)} V.`,
    memo: [
      { code: 'A', marks: 1, text: 'ΔΦ = 6,0 × 10⁻³ Wb' },
      { code: 'SF', marks: 1, text: 'ε = N ΔΦ/Δt' },
      { code: 'SF', marks: 1, text: `${turns} × 6,0 × 10⁻³ ÷ ${n(t)}` },
      { code: 'CA', marks: 1, text: `${n(emf)} V` },
    ],
  })
}

{
  const [turns, a, b1, t] = [50, 0.01, 0.6, 0.2]
  const dphi = b1 * a
  out.push({
    ...emag,
    id: 'pg-ps11-faraday-field-falls',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A coil of ${turns} turns and area ${n(a)} m² lies with its plane perpendicular to a magnetic field. The field decreases steadily from ${n(b1)} T to zero in ${n(t)} s. Calculate the magnitude of the emf induced in the coil.`,
    answer: `${n((turns * dphi) / t)} V`,
    explanation: `The field is along the normal, so Φ = BA. The change in flux is ΔΦ = ${n(b1)} × ${n(a)} − 0 = ${n(dphi, 3)} Wb. The emf is N ΔΦ/Δt = ${turns} × ${n(dphi, 3)} ÷ ${n(t)} = ${n((turns * dphi) / t)} V.`,
    memo: [
      { code: 'SF', marks: 1, text: `ΔΦ = ΔB × A = ${n(b1)} × ${n(a)}` },
      { code: 'A', marks: 1, text: `${n(dphi, 3)} Wb` },
      { code: 'SF', marks: 1, text: 'ε = N ΔΦ/Δt' },
      { code: 'CA', marks: 1, text: `${n((turns * dphi) / t)} V` },
    ],
  })
}

out.push(
  {
    ...emag,
    id: 'pg-ps11-faraday-increase-emf',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: "A magnet is pushed into a coil connected to a galvanometer. State THREE changes that would increase the induced emf, and explain each using Faraday's law.",
    answer:
      'Push the magnet in faster: the flux changes in less time, so ΔΦ/Δt is larger. Use a coil with more turns: the emf is proportional to N. Use a stronger magnet: the change in flux is larger.',
    explanation: "Faraday's law, emf = N ΔΦ/Δt, names all three: more turns, a larger change in flux, or a shorter time.",
    memo: [
      { code: 'A', marks: 1, text: 'Faster movement: shorter Δt, larger rate of change of flux' },
      { code: 'A', marks: 1, text: 'More turns: emf proportional to N' },
      { code: 'A', marks: 1, text: 'Stronger magnet: larger ΔΦ' },
    ],
  },
  {
    ...emag,
    id: 'pg-ps11-lenz-state',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: "State Lenz's law.",
    answer: 'The induced current flows in such a direction that its magnetic field opposes the change in magnetic flux that produced it.',
    explanation: "Lenz's law gives the direction of the induced current; Faraday's law gives its size. It is the reason for the minus sign in ε = −N ΔΦ/Δt.",
    memo: [
      { code: 'A', marks: 1, text: 'The induced current (emf) is in a direction' },
      { code: 'A', marks: 1, text: 'that opposes the change in flux producing it' },
    ],
  },
  {
    ...emag,
    id: 'pg-ps11-lenz-north-pole',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: "The north pole of a bar magnet is pushed towards one end of a coil connected in a closed circuit. Use Lenz's law to state the magnetic polarity of that end of the coil while the magnet approaches, and explain.",
    answer:
      'That end becomes a north pole. The flux through the coil is increasing, and by Lenz\'s law the induced current opposes the change: a north pole facing the approaching north pole repels it, opposing its approach.',
    explanation: 'If the end became a south pole it would attract the magnet, the magnet would speed up and more energy would appear from nowhere -- which is why Lenz\'s law is a statement of energy conservation.',
    memo: [
      { code: 'A', marks: 1, text: 'A north pole' },
      { code: 'R', marks: 1, text: 'The induced current opposes the change (the increasing flux)' },
      { code: 'C', marks: 1, text: 'Like poles repel, opposing the approach' },
    ],
  },
  {
    ...emag,
    id: 'pg-ps11-lenz-effort',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 3,
    prompt:
      "Explain, using Lenz's law and the conservation of energy, why it takes more effort to push a magnet into a coil when the coil is part of a closed circuit than when the circuit is open.",
    answer:
      'With the circuit closed, a current is induced, and by Lenz\'s law its magnetic field opposes the magnet\'s motion, so extra work must be done against this opposing force. That work is the source of the electrical energy in the circuit. With the circuit open no current flows, so there is no opposing field and no extra work: no electrical energy is produced.',
    explanation: 'The opposing force is how energy is conserved: you cannot get electrical energy out of the coil without putting mechanical work in.',
    memo: [
      { code: 'A', marks: 1, text: 'Closed circuit: induced current whose field opposes the motion' },
      { code: 'R', marks: 1, text: 'Extra work against the opposing force becomes electrical energy' },
      { code: 'C', marks: 1, text: 'Open circuit: no current, no opposing force, no extra work' },
    ],
  },
)

/* ===================================================================== */
/* Sound, Grade 10: ultrasound and hearing damage                         */
/* ===================================================================== */

const sound = { topicId: 'phys-sound-g10', grade: 10 } as const

out.push({
  ...sound,
  id: 'pg-ps10-ultrasound-uses',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 3,
  prompt: 'What is ultrasound? Give TWO uses of ultrasound.',
  answer: 'Ultrasound is sound with a frequency above 20 000 Hz, too high for humans to hear. Uses (any two): prenatal imaging of a baby, detecting flaws in metal, echolocation by bats and dolphins, sonar.',
  explanation: 'The upper limit of human hearing is about 20 000 Hz; anything above it is ultrasound.',
  memo: [
    { code: 'A', marks: 1, text: 'Sound above 20 000 Hz (above human hearing)' },
    { code: 'A', marks: 1, text: 'First use, e.g. prenatal imaging' },
    { code: 'A', marks: 1, text: 'Second use, e.g. detecting flaws in metal / echolocation' },
  ],
})

{
  const [t, v] = [0.8, 1500]
  out.push({
    ...sound,
    id: 'pg-ps10-ultrasound-sonar-depth',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A ship sends a pulse of ultrasound down to the sea floor. The echo returns ${n(t)} s later. The speed of sound in sea water is ${n(v)} m·s⁻¹. Calculate the depth of the sea.`,
    answer: `${n((v * t) / 2)} m`,
    explanation: `The pulse travels down to the sea floor and back up, so the total distance is v × t = ${n(v)} × ${n(t)} = ${n(v * t)} m. The depth is half of that: ${n((v * t) / 2)} m.`,
    memo: [
      { code: 'SF', marks: 1, text: `Distance = v × t = ${n(v)} × ${n(t)}` },
      { code: 'A', marks: 1, text: `${n(v * t)} m (there and back)` },
      { code: 'M', marks: 1, text: 'Depth = half the total distance' },
      { code: 'CA', marks: 1, text: `${n((v * t) / 2)} m` },
    ],
  })
}

{
  const [t, v] = [0.02, 340]
  out.push({
    ...sound,
    id: 'pg-ps10-bat-echolocation',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A bat uses echolocation: it emits a pulse of ultrasound and hears the echo from a moth ${n(t)} s later. The speed of sound in air is ${v} m·s⁻¹. How far away is the moth?`,
    answer: `${n((v * t) / 2)} m`,
    explanation: `The echo travels to the moth and back: total distance = ${v} × ${n(t)} = ${n(v * t)} m, so the moth is ${n((v * t) / 2)} m away.`,
    memo: [
      { code: 'SF', marks: 1, text: `${v} × ${n(t)} = ${n(v * t)} m` },
      { code: 'M', marks: 1, text: 'Halve it: there and back' },
      { code: 'CA', marks: 1, text: `${n((v * t) / 2)} m` },
    ],
  })
}

{
  const [f, v] = [2e6, 1540]
  out.push({
    ...sound,
    id: 'pg-ps10-ultrasound-scan-wavelength',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `The ultrasound used for a prenatal scan has a frequency of 2 MHz. The speed of sound in soft body tissue is ${n(v)} m·s⁻¹. Calculate the wavelength of the ultrasound in the tissue, in millimetres.`,
    answer: `${n((v / f) * 1000)} mm`,
    explanation: `v = fλ, so λ = v/f = ${n(v)} ÷ (2 × 10⁶) = ${sci(v / f)} m = ${n((v / f) * 1000)} mm. The short wavelength is what lets the scan show fine detail.`,
    memo: [
      { code: 'SF', marks: 1, text: 'λ = v/f = 1 540 ÷ (2 × 10⁶)' },
      { code: 'A', marks: 1, text: `${sci(v / f)} m` },
      { code: 'CA', marks: 1, text: `${n((v / f) * 1000)} mm` },
    ],
  })
}

out.push({
  ...sound,
  id: 'pg-ps10-hearing-damage',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'Workers who operate loud machinery all day wear ear protection. Explain why, referring to prolonged exposure and the level of sound in decibels that damages hearing.',
  answer: 'Prolonged exposure to sound above about 85 decibels (dB) damages hearing permanently. Ear protection reduces the sound level reaching the ear.',
  explanation: 'Hearing damage depends on both the loudness and the time of exposure; a whole working day of loud noise is exactly the risk.',
  memo: [
    { code: 'A', marks: 1, text: 'Prolonged exposure above about 85 dB damages hearing permanently' },
    { code: 'R', marks: 1, text: 'Ear protection lowers the sound level reaching the ear' },
  ],
})

/* ===================================================================== */
/* The periodic table, Grade 10: groups, predicting behaviour             */
/* ===================================================================== */

const periodic = { topicId: 'phys-periodic-table', grade: 10 } as const

out.push(
  {
    ...periodic,
    id: 'pg-ps10-groups-names',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 4,
    prompt: 'Give the family name of the elements in group 1 and in group 17 of the periodic table (the alkali metals or the halogens), and the number of valence electrons in each group.',
    answer: 'Group 1: the alkali metals, with one valence electron. Group 17: the halogens, with seven valence electrons.',
    explanation: 'Elements in the same group have the same number of valence electrons, which is why they react alike.',
    memo: [
      { code: 'A', marks: 1, text: 'Group 1: alkali metals' },
      { code: 'A', marks: 1, text: 'One valence electron' },
      { code: 'A', marks: 1, text: 'Group 17: halogens' },
      { code: 'A', marks: 1, text: 'Seven valence electrons' },
    ],
  },
  {
    ...periodic,
    id: 'pg-ps10-noble-gases',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why the noble gases in group 18 are unreactive.',
    answer: 'They have a full outer energy level, which is a stable arrangement, so they do not need to lose, gain or share electrons.',
    explanation: 'Other atoms react to reach the full outer energy level the noble gases already have.',
    memo: [
      { code: 'A', marks: 1, text: 'Full outer energy level' },
      { code: 'R', marks: 1, text: 'Stable: no tendency to lose, gain or share electrons' },
    ],
  },
  {
    ...periodic,
    id: 'pg-ps10-alkali-reactivity',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'The alkali metals become more reactive down group 1. Explain why potassium reacts more vigorously with water than sodium does.',
    answer:
      'A potassium atom is larger than a sodium atom: its single valence electron is in an energy level further from the nucleus and more shielded by inner electrons. It is held less strongly, so potassium loses it more easily and reacts more vigorously.',
    explanation: 'The alkali metals react by losing their one valence electron; the easier it is to lose, the more reactive the metal.',
    memo: [
      { code: 'A', marks: 1, text: 'Potassium atom is larger; valence electron further from the nucleus' },
      { code: 'R', marks: 1, text: 'Weaker attraction (more shielding)' },
      { code: 'C', marks: 1, text: 'Electron lost more easily, so more reactive' },
    ],
  },
  {
    ...periodic,
    id: 'pg-ps10-halogen-reactivity',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'The halogens become less reactive down group 17. Explain why fluorine is more reactive than chlorine.',
    answer:
      'A fluorine atom is smaller, so an incoming electron comes closer to the nucleus and is attracted more strongly. Fluorine gains an electron more easily, so it is more reactive.',
    explanation: 'The halogens react by gaining one electron -- the opposite of the alkali metals, which is why the trend in reactivity runs the other way down the group.',
    memo: [
      { code: 'A', marks: 1, text: 'Fluorine atom is smaller' },
      { code: 'R', marks: 1, text: 'Incoming electron attracted more strongly by the nucleus' },
      { code: 'C', marks: 1, text: 'Gains an electron more easily, so more reactive' },
    ],
  },
  {
    ...periodic,
    id: 'pg-ps10-predict-magnesium-ion',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Magnesium is in group 2. Predict the charge on a magnesium ion and explain your prediction.',
    answer: '2+. Magnesium has two valence electrons, and as a metal it loses them to form a positive ion, Mg²⁺.',
    explanation: 'Metals lose electrons to form positive ions; the charge equals the number of electrons lost.',
    memo: [
      { code: 'A', marks: 1, text: 'Mg²⁺ (2+)' },
      { code: 'R', marks: 1, text: 'Loses its two valence electrons' },
    ],
  },
  {
    ...periodic,
    id: 'pg-ps10-predict-calcium-chloride',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Predict the formula of the compound formed when calcium reacts with chlorine. Explain how you worked out the charge on each ion.',
    answer: 'CaCl₂. Calcium (a metal with two valence electrons) loses two electrons to form Ca²⁺; chlorine (a non-metal with seven) gains one electron to form Cl⁻. Two chloride ions balance one calcium ion.',
    explanation: 'The formula is the ratio of ions that makes the total charge zero: 2+ and 2 × 1−.',
    memo: [
      { code: 'A', marks: 1, text: 'Ca²⁺: loses two electrons' },
      { code: 'A', marks: 1, text: 'Cl⁻: gains one electron' },
      { code: 'CA', marks: 1, text: 'CaCl₂' },
    ],
  },
  {
    ...periodic,
    id: 'pg-ps10-predict-rubidium',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Rubidium is below potassium in the same group, so it has the same number of valence electrons. Predict how rubidium reacts with water, and give reasons for your prediction.',
    answer:
      'It reacts even more vigorously than potassium, forming rubidium hydroxide and hydrogen gas. It reacts in the same way because it has the same number of valence electrons (one), and more vigorously because it is further down the group, so it loses that electron more easily.',
    explanation: 'Elements in the same group react similarly; their position in the group decides how vigorously.',
    memo: [
      { code: 'A', marks: 1, text: 'Reacts more vigorously than potassium, giving rubidium hydroxide and hydrogen' },
      { code: 'R', marks: 1, text: 'Same number of valence electrons, so a similar reaction' },
      { code: 'R', marks: 1, text: 'Further down: loses its electron more easily' },
    ],
  },
)

/* ===================================================================== */
/* Transverse pulses, Grade 10: superposition                             */
/* ===================================================================== */

const pulses = { topicId: 'phys-transverse-waves-g10', grade: 10 } as const

{
  const [a1, a2] = [3, 2]
  out.push({
    ...pulses,
    id: 'pg-ps10-superposition-amplitudes',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Two pulses with amplitudes of ${a1} cm and ${a2} cm travel towards each other on a rope. What is the amplitude of the resultant pulse when they meet if (a) both are crests, (b) one is a crest and the other a trough? Name the type of interference in each case.`,
    answer: `(a) ${a1 + a2} cm, constructive interference  (b) ${a1 - a2} cm, destructive interference`,
    explanation: `By the principle of superposition the displacements add. Crest + crest: ${a1} + ${a2} = ${a1 + a2} cm. Crest + trough: ${a1} + (−${a2}) = ${a1 - a2} cm.`,
    memo: [
      { code: 'A', marks: 1, text: `(a) ${a1 + a2} cm` },
      { code: 'A', marks: 1, text: `(b) ${a1 - a2} cm` },
      { code: 'A', marks: 1, text: '(a) constructive, (b) destructive interference' },
    ],
  })
}

out.push(
  {
    ...pulses,
    id: 'pg-ps10-interference-define',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Define constructive interference and destructive interference.',
    answer: 'Constructive interference: two pulses (crests with crests, or troughs with troughs) overlap and their amplitudes add to give a larger pulse. Destructive interference: a crest overlaps a trough and the amplitudes subtract to give a smaller pulse.',
    explanation: 'Both follow from the principle of superposition: the resultant displacement is the sum of the separate displacements.',
    memo: [
      { code: 'A', marks: 1, text: 'Constructive: amplitudes add (crest meets crest)' },
      { code: 'A', marks: 1, text: 'Destructive: amplitudes subtract (crest meets trough)' },
    ],
  },
  {
    ...pulses,
    id: 'pg-ps10-superposition-cancel',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'A crest and a trough of exactly the same amplitude and shape travel towards each other on a rope. Describe the rope at the instant the pulses exactly overlap, and what happens afterwards.',
    answer:
      'At that instant the rope is flat -- the resultant displacement is zero everywhere, complete destructive interference. Afterwards the two pulses emerge and continue in their original directions, unchanged, as if they had never met.',
    explanation: 'The energy has not disappeared while the rope is flat: the rope is still moving. Pulses pass through each other and continue unchanged.',
    memo: [
      { code: 'A', marks: 1, text: 'Rope flat: zero displacement (complete destructive interference)' },
      { code: 'A', marks: 1, text: 'The pulses continue in their original directions' },
      { code: 'A', marks: 1, text: 'Unchanged in shape and amplitude' },
    ],
  },
)

export const physicsGapQuestions = out
