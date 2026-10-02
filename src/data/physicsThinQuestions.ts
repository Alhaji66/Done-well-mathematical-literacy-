/**
 * The second round of Physical Sciences questions for the thinnest
 * sub-topics, as the sub-topic coverage report counted them before this file:
 *
 *   Electromagnetism (Grade 11): Lenz's law and applications -- 5;
 *     Faraday's law -- 6.
 *   Electrodynamics (Grade 12): motors -- 6.
 *   Electric circuits (Grade 12): power and cost -- 6.
 *   Electromagnetic radiation (Grade 10): effects and uses -- 6; wave and
 *     particle nature -- 6.
 *   Longitudinal waves (Grade 10): speed in different media -- 6.
 *   The periodic table (Grade 10): groups -- 6.
 *   Physical and chemical change (Grade 10): energy in reactions -- 6.
 *   Sound (Grade 10): ultrasound and hearing damage -- 6.
 *   Vectors in two dimensions (Grade 11): resolving into components -- 6.
 *
 * Six more each, across the four cognitive levels. Every number is computed
 * from the values declared with it. Numbers are written with a decimal comma;
 * h = 6,63 × 10⁻³⁴ J·s, c = 3,0 × 10⁸ m·s⁻¹ and g = 9,8 m·s⁻².
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

const rad = (deg: number) => (deg * Math.PI) / 180
const h = 6.63e-34
const c = 3.0e8
const g = 9.8
const out: Question[] = []

/* ===================================================================== */
/* Electromagnetism, Grade 11: Faraday's law                              */
/* ===================================================================== */

const emag = { topicId: 'phys-electromagnetism', grade: 11 } as const

{
  const [b, a, theta] = [0.2, 0.05, 60]
  const before = b * a
  const after = b * a * Math.cos(rad(theta))
  const change = before - after
  out.push({
    ...emag,
    id: 'ps5-11-flux-change-rotate',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A loop of area ${n(a)} m² lies with its normal along a uniform ${n(b)} T magnetic field. It is then turned so that the angle between the field and the normal is ${theta}°. Calculate the magnetic flux through the loop before and after, and the change in flux, in webers.`,
    answer: `Before: ${n(b)} × ${n(a)} × cos 0° = ${sci(before)} Wb. After: ${n(b)} × ${n(a)} × cos ${theta}° = ${sci(after)} Wb. Change in flux = ${sci(change)} Wb (a decrease).`,
    explanation: 'Φ = BA cos θ, with θ measured from the normal to the loop. Turning the loop away from the field reduces the flux through it, and it is this change that induces an emf.',
    memo: [
      { code: 'SF', marks: 1, text: 'Φ = BA cos θ' },
      { code: 'A', marks: 1, text: `Before: ${sci(before)} Wb` },
      { code: 'A', marks: 1, text: `After: ${sci(after)} Wb` },
      { code: 'CA', marks: 1, text: `Change: ${sci(change)} Wb` },
    ],
  })
}

{
  const [turns, area, b1, b2, t] = [150, 0.03, 0.1, 0.5, 0.2]
  const emf = (turns * area * (b2 - b1)) / t
  out.push({
    ...emag,
    id: 'ps5-11-emf-changing-field',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A coil of ${turns} turns and area ${n(area)} m² is placed with its normal along a magnetic field. The field strength increases from ${n(b1)} T to ${n(b2)} T in ${n(t)} s. Use Faraday's law to calculate the magnitude of the induced emf.`,
    answer: `Change in flux = (${n(b2)} − ${n(b1)}) × ${n(area)} = ${sci((b2 - b1) * area)} Wb. emf = N ΔΦ / Δt = ${turns} × ${sci((b2 - b1) * area)} ÷ ${n(t)} = ${n(emf)} V.`,
    explanation: 'Here the flux changes because B changes while the area and angle stay fixed, so ΔΦ = A ΔB.',
    memo: [
      { code: 'SF', marks: 1, text: 'ε = −N ΔΦ / Δt' },
      { code: 'SF', marks: 1, text: `ΔΦ = ${n(area)} × (${n(b2)} − ${n(b1)})` },
      { code: 'SF', marks: 1, text: `${turns} × ${sci((b2 - b1) * area)} ÷ ${n(t)}` },
      { code: 'A', marks: 1, text: `${n(emf)} V` },
    ],
  })
}

out.push(
  {
    ...emag,
    id: 'ps5-11-flux-unit-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'In which unit is magnetic flux measured?',
    options: [
      { id: 'a', label: 'Tesla' },
      { id: 'b', label: 'Weber' },
      { id: 'c', label: 'Volt' },
      { id: 'd', label: 'Ampere' },
    ],
    correctOptionId: 'b',
    answer: 'Weber',
    explanation: 'Flux Φ = BA cos θ, so its unit is tesla × square metre, which is called the weber (Wb). The tesla is the unit of magnetic field strength B.',
    memo: [{ code: 'A', marks: 2, text: 'B: weber' }],
  },
  {
    ...emag,
    id: 'ps5-11-magnet-at-rest-no-emf',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'A magnet rests motionless inside a coil, so there is magnetic flux through the coil, yet the galvanometer reads zero. Use Faraday’s law to explain why no emf is induced.',
    answer:
      'Faraday’s law says an emf is induced only while the magnetic flux through the coil is changing. With the magnet at rest, the flux is constant, so the rate of change of flux is zero and no emf is induced.',
    explanation: 'It is the change in flux, not the flux itself, that matters: move the magnet in or out and the needle deflects.',
    memo: [
      { code: 'A', marks: 1, text: 'An emf is induced only while the flux is changing' },
      { code: 'A', marks: 1, text: 'Magnet at rest: flux is constant' },
      { code: 'A', marks: 1, text: 'Rate of change of flux is zero, so no emf' },
    ],
  },
  {
    ...emag,
    id: 'ps5-11-drop-height-emf-trend',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'A magnet is dropped through a coil from different heights and the largest emf is recorded each time. Describe the trend and use Faraday’s law to explain it.',
    context: '| Drop height (cm) | Largest emf (V) |\n|---|---|\n| 10 | 0,8 |\n| 20 | 1,1 |\n| 40 | 1,6 |',
    answer:
      'The higher the drop, the larger the induced emf. A magnet dropped from higher is moving faster when it passes through the coil, so the flux through the coil changes in a shorter time. By Faraday’s law the emf depends on the rate of change of flux, so a faster change gives a larger emf.',
    explanation: 'Note that the emf does not double when the height doubles: the speed grows with the square root of the height, not in proportion to it.',
    memo: [
      { code: 'A', marks: 1, text: 'Greater height, larger emf' },
      { code: 'A', marks: 1, text: 'Magnet moves faster through the coil' },
      { code: 'A', marks: 1, text: 'Flux changes in a shorter time' },
      { code: 'A', marks: 1, text: 'emf is proportional to the rate of change of flux' },
    ],
  },
  {
    ...emag,
    id: 'ps5-11-turns-area-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'A learner says that doubling the number of turns of a coil and halving its area, with the same changing magnetic field, will double the induced emf. Evaluate this claim using Faraday’s law.',
    answer:
      'The claim is wrong. ε = −N ΔΦ / Δt and Φ = BA cos θ, so the emf is proportional to N × A. Doubling N multiplies the emf by 2, but halving A halves the flux and so halves its change, multiplying the emf by ½. Overall the emf is unchanged (2 × ½ = 1).',
    explanation: 'When two changes act on the same formula, combine their factors before judging the result.',
    memo: [
      { code: 'J', marks: 1, text: 'Claim is incorrect' },
      { code: 'A', marks: 1, text: 'emf proportional to N and to A (ε = −N ΔΦ/Δt, Φ = BA cos θ)' },
      { code: 'A', marks: 1, text: 'Doubling N doubles it; halving A halves it' },
      { code: 'A', marks: 1, text: 'Net effect: emf unchanged' },
    ],
  },
)

/* ===================================================================== */
/* Electromagnetism, Grade 11: Lenz's law and applications                */
/* ===================================================================== */

out.push(
  {
    ...emag,
    id: 'ps5-11-lenz-conservation-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Lenz’s law is a consequence of which conservation law?',
    options: [
      { id: 'a', label: 'Conservation of charge' },
      { id: 'b', label: 'Conservation of momentum' },
      { id: 'c', label: 'Conservation of energy' },
      { id: 'd', label: 'Conservation of mass' },
    ],
    correctOptionId: 'c',
    answer: 'Conservation of energy',
    explanation: 'Because the induced current opposes the change, work must be done to keep the magnet moving, and that work is the source of the electrical energy.',
    memo: [{ code: 'A', marks: 2, text: 'C: conservation of energy' }],
  },
  {
    ...emag,
    id: 'ps5-11-lenz-south-pole-pulled-away',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt:
      'The south pole of a bar magnet is pulled away from one end of a coil connected in a closed circuit. Use Lenz’s law to state the magnetic polarity of the near face of the coil, and whether the coil attracts or repels the magnet.',
    answer:
      'The near face becomes a north pole. By Lenz’s law the induced current opposes the change causing it; the change is the south pole moving away, so the coil attracts it, which needs a north pole facing the magnet’s south pole.',
    explanation: 'Pushing a pole in gives a like pole that repels; pulling a pole out gives an unlike pole that attracts. Either way the coil resists the motion.',
    memo: [
      { code: 'A', marks: 1, text: 'North pole' },
      { code: 'A', marks: 1, text: 'Induced current opposes the change (the magnet moving away)' },
      { code: 'A', marks: 1, text: 'Coil attracts the magnet' },
    ],
  },
  {
    ...emag,
    id: 'ps5-11-lenz-work-to-keep-moving',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Use Lenz’s law to explain why work must be done to keep pushing a magnet into a coil that is connected in a closed circuit, but not when the circuit is open.',
    answer:
      'In a closed circuit, pushing the magnet in induces a current, and by Lenz’s law that current makes the near face of the coil the same pole as the approaching magnet, so the coil repels it. Work must be done against this repulsion, and that work becomes electrical energy. In an open circuit no current flows, so there is no opposing magnetic field and no extra work is needed.',
    explanation: 'This is the energy argument behind Lenz’s law: no work in, no electrical energy out.',
    memo: [
      { code: 'A', marks: 1, text: 'Closed circuit: induced current makes a repelling pole' },
      { code: 'A', marks: 1, text: 'Work done against the repulsion becomes electrical energy' },
      { code: 'A', marks: 1, text: 'Open circuit: no current, so no opposing force' },
    ],
  },
  {
    ...emag,
    id: 'ps5-11-lenz-copper-tube',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'A strong magnet dropped down a long copper tube falls much more slowly than the same magnet dropped down a plastic tube. Use Lenz’s law to explain this.',
    answer:
      'As the magnet falls, the magnetic flux through each section of the copper tube changes, inducing currents in the copper (copper conducts; plastic does not). By Lenz’s law these induced currents produce magnetic fields that oppose the change causing them, which means they oppose the motion of the magnet. This upward magnetic force slows the magnet. In the plastic tube no current can flow, so the magnet falls freely.',
    explanation: 'The kinetic energy the magnet does not gain is converted into heat in the copper by the induced currents.',
    memo: [
      { code: 'A', marks: 1, text: 'Changing flux induces currents in the copper' },
      { code: 'A', marks: 1, text: 'Induced currents oppose the change / the motion of the magnet' },
      { code: 'A', marks: 1, text: 'Upward force slows the magnet' },
      { code: 'A', marks: 1, text: 'Plastic is an insulator: no induced current, so no opposing force' },
    ],
  },
  {
    ...emag,
    id: 'ps5-11-lenz-induction-cooktops',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'Name TWO applications of electromagnetic induction besides induction cooktops, then explain how induction cooktops heat a steel pot without the cooktop surface itself getting hot first.',
    answer:
      'Applications: generators and transformers (also accepted: dynamos, wireless chargers). In an induction cooktop, an alternating current in a coil under the surface produces a rapidly changing magnetic field. The changing flux through the base of the steel pot induces currents in it, and these currents heat the pot directly. The glass surface is not a conductor, so no current is induced in it; it warms only from the hot pot.',
    explanation: 'The pot must be made of a suitable metal: a glass or clay pot would stay cold because no current can be induced in it.',
    memo: [
      { code: 'A', marks: 1, text: 'Two applications (generators, transformers, ...)' },
      { code: 'A', marks: 1, text: 'AC in the coil gives a changing magnetic field' },
      { code: 'A', marks: 1, text: 'Changing flux induces currents in the pot' },
      { code: 'A', marks: 1, text: 'The currents heat the pot; the surface is not a conductor' },
    ],
  },
  {
    ...emag,
    id: 'ps5-11-lenz-free-energy-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'A learner suggests that if the induced current HELPED the change instead of opposing it, a generator could produce electricity for free. Evaluate this idea using Lenz’s law and the conservation of energy.',
    answer:
      'The learner is right that it would give energy for nothing, and that is exactly why it cannot happen. If the induced current helped the change, a magnet pushed into a coil would be pulled in faster, inducing a bigger current, pulling harder still: kinetic and electrical energy would both increase with no work done. That would create energy, breaking the conservation of energy. Lenz’s law says the induced current opposes the change, so work must always be done to produce electrical energy.',
    explanation: 'Lenz’s law is the conservation of energy applied to induction.',
    memo: [
      { code: 'A', marks: 1, text: 'A helping current would speed the magnet up' },
      { code: 'A', marks: 1, text: 'Energy would increase with no work done' },
      { code: 'A', marks: 1, text: 'This breaks the conservation of energy' },
      { code: 'J', marks: 1, text: 'So the induced current must oppose the change: the idea is impossible' },
    ],
  },
)

/* ===================================================================== */
/* Electrodynamics, Grade 12: motors                                      */
/* ===================================================================== */

const dyn = { topicId: 'phys-electrodynamics', grade: 12 } as const

{
  const [v, i, m, height, t] = [12, 2, 4, 1.5, 4]
  const pIn = v * i
  const pOut = (m * g * height) / t
  const eff = (pOut / pIn) * 100
  out.push({
    ...dyn,
    id: 'ps5-12-motor-lift-efficiency',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Electric motors are used in pumps and power tools. A small electric motor draws ${i} A from a ${v} V supply and lifts a ${m} kg load through ${n(height)} m at a constant speed in ${t} s. Calculate the electrical power input, the useful power output, and the efficiency of the motor.`,
    answer: `P in = VI = ${v} × ${i} = ${n(pIn)} W. P out = mgh / t = ${m} × 9,8 × ${n(height)} ÷ ${t} = ${n(pOut)} W. Efficiency = ${n(pOut)} ÷ ${n(pIn)} × 100 = ${n(eff, 1)}%.`,
    explanation: 'The rest of the input power is lost as heat in the coil (its resistance) and as friction and sound in the moving parts.',
    memo: [
      { code: 'SF', marks: 1, text: `P in = ${v} × ${i} = ${n(pIn)} W` },
      { code: 'SF', marks: 1, text: `P out = ${m} × 9,8 × ${n(height)} ÷ ${t}` },
      { code: 'A', marks: 1, text: `${n(pOut)} W` },
      { code: 'SF', marks: 1, text: 'Efficiency = P out ÷ P in × 100' },
      { code: 'CA', marks: 1, text: `${n(eff, 1)}%` },
    ],
  })
}

{
  const current = [0.5, 1.0, 1.5, 2.0]
  const perAmp = 1200
  const speed = current.map((x) => x * perAmp)
  const next = 2.5
  out.push({
    ...dyn,
    id: 'ps5-12-motor-speed-current-data',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `A small DC motor turning a fan is tested with different currents. Describe the relationship shown, explain it in terms of the force on the current-carrying coil in the magnetic field, and predict the speed at ${n(next, 1)} A.`,
    context: `| Current (A) | Speed (revolutions per minute) |\n|---|---|\n${current.map((x, k) => `| ${n(x, 1)} | ${n(speed[k], 0)} |`).join('\n')}`,
    answer: `The speed is directly proportional to the current: doubling the current doubles the speed (${n(perAmp, 0)} rpm per ampere). The force on each side of the coil is proportional to the current, so a larger current gives a larger turning effect and the motor turns faster. Predicted speed at ${n(next, 1)} A: ${n(next * perAmp, 0)} rpm.`,
    explanation: 'Real motors are only roughly like this: friction and air resistance on the fan grow with speed, so the line would curve at high currents.',
    memo: [
      { code: 'A', marks: 1, text: 'Directly proportional' },
      { code: 'A', marks: 1, text: 'Force on the coil is proportional to the current' },
      { code: 'A', marks: 1, text: 'Larger force, larger turning effect, faster rotation' },
      { code: 'CA', marks: 1, text: `${n(next * perAmp, 0)} rpm` },
    ],
  })
}

out.push(
  {
    ...dyn,
    id: 'ps5-12-motor-reverses-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which part of a DC motor reverses the direction of the current in the coil every half turn, so that the rotation continues in one direction?',
    options: [
      { id: 'a', label: 'The brushes' },
      { id: 'b', label: 'The split-ring commutator' },
      { id: 'c', label: 'The permanent magnets' },
      { id: 'd', label: 'The slip rings' },
    ],
    correctOptionId: 'b',
    answer: 'The split-ring commutator',
    explanation: 'The brushes only make contact; slip rings are used in an AC generator and do not reverse the connection.',
    memo: [{ code: 'A', marks: 2, text: 'B: split-ring commutator' }],
  },
  {
    ...dyn,
    id: 'ps5-12-motor-coil-parallel-largest',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why the coil of a motor experiences the largest turning effect when the plane of the coil is parallel to the magnetic field, and none when it is perpendicular.',
    answer:
      'The force on each side of the coil is always at right angles to the field. When the plane of the coil is parallel to the field, these forces act at right angles to the coil, as far as possible from the axis, so they give the largest turning effect. When the plane is perpendicular to the field, the forces act along the plane of the coil, through the axis, so they cannot turn it.',
    explanation: 'The momentum of the coil carries it past the perpendicular position, where the commutator then reverses the current.',
    memo: [
      { code: 'A', marks: 1, text: 'Forces on the sides are perpendicular to the field' },
      { code: 'A', marks: 1, text: 'Parallel: forces at right angles to the coil, largest turning effect' },
      { code: 'A', marks: 1, text: 'Perpendicular: forces in the plane of the coil, through the axis: no turning' },
    ],
  },
  {
    ...dyn,
    id: 'ps5-12-motor-magnet-swapped',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'The magnets of a toy electric motor are turned around so that the north and south poles swap places, with the battery connected as before. Predict and explain what happens to the motor.',
    answer:
      'The motor turns in the opposite direction. The force on a current-carrying conductor depends on the directions of both the current and the magnetic field. Reversing the field while keeping the current the same reverses the force on each side of the coil, so the turning effect is reversed.',
    explanation: 'Reversing both the current and the field together would leave the direction of rotation unchanged.',
    memo: [
      { code: 'A', marks: 1, text: 'Rotates in the opposite direction' },
      { code: 'A', marks: 1, text: 'Force depends on the field direction (and current)' },
      { code: 'A', marks: 1, text: 'Field reversed, so the force on each side reverses' },
    ],
  },
  {
    ...dyn,
    id: 'ps5-12-motor-vehicle-braking',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'An electric vehicle is driven by motors. When it slows down, the motors are disconnected from the battery and their spinning coils charge it instead. Explain how a motor can do this.',
    answer:
      'A motor and a generator have the same parts: a coil that can rotate in a magnetic field. While the wheels keep the coil spinning, the magnetic flux through it keeps changing, so an emf is induced (Faraday’s law) and a current flows to charge the battery. The kinetic energy of the vehicle is converted into electrical energy, which also slows it down.',
    explanation: 'This is called regenerative braking. By Lenz’s law the induced current opposes the rotation, which is what produces the braking.',
    memo: [
      { code: 'A', marks: 1, text: 'Spinning coil in a magnetic field: changing flux' },
      { code: 'A', marks: 1, text: 'An emf/current is induced, charging the battery' },
      { code: 'A', marks: 1, text: 'Kinetic energy converted to electrical energy' },
    ],
  },
)

/* ===================================================================== */
/* Electric circuits, Grade 12: power and cost                            */
/* ===================================================================== */

const circuits = { topicId: 'phys-electric-circuits', grade: 12 } as const

{
  const [p, v] = [2000, 220]
  const i = p / v
  const r = (v * v) / p
  out.push({
    ...circuits,
    id: 'ps5-12-geyser-current-resistance',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A geyser element has a power rating of ${n(p, 0)} W when connected to the ${v} V mains. Calculate the current in the element and its resistance.`,
    answer: `I = P / V = ${n(p, 0)} ÷ ${v} = ${n(i)} A. R = V² / P = ${v}² ÷ ${n(p, 0)} = ${n(r, 1)} Ω.`,
    explanation: 'Any two of P = VI, P = I²R and P = V²/R give the same results; V²/R avoids using a rounded current.',
    memo: [
      { code: 'SF', marks: 1, text: `I = ${n(p, 0)} ÷ ${v}` },
      { code: 'A', marks: 1, text: `${n(i)} A` },
      { code: 'SF', marks: 1, text: `R = ${v}² ÷ ${n(p, 0)}` },
      { code: 'A', marks: 1, text: `${n(r, 1)} Ω` },
    ],
  })
}

{
  const items = [
    { name: 'Television', watts: 150, hours: 5 },
    { name: 'Fridge', watts: 200, hours: 24 },
    { name: 'Kettle', watts: 2200, hours: 0.5 },
  ]
  const [days, tariff] = [31, 2.85]
  const kwhPerDay = items.reduce((s, x) => s + (x.watts / 1000) * x.hours, 0)
  const kwh = kwhPerDay * days
  const cost = kwh * tariff
  out.push({
    ...circuits,
    id: 'ps5-12-household-month-cost',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Use the table to calculate the energy consumed by the three appliances in a ${days}-day month, in kWh, and the cost of that energy at R${n(tariff)} per kWh.`,
    context: `| Appliance | Power rating (W) | Use per day (h) |\n|---|---|---|\n${items.map((x) => `| ${x.name} | ${n(x.watts, 0)} | ${n(x.hours, 1)} |`).join('\n')}`,
    answer: `Per day: ${items.map((x) => `${n(x.watts / 1000, 2)} × ${n(x.hours, 1)}`).join(' + ')} = ${n(kwhPerDay, 2)} kWh. Per month: ${n(kwhPerDay, 2)} × ${days} = ${n(kwh, 2)} kWh. Cost = ${n(kwh, 2)} × R${n(tariff)} = R${n(cost)}.`,
    explanation: 'Convert watts to kilowatts before multiplying by hours, so that the energy comes out in kWh, the unit the tariff uses.',
    memo: [
      { code: 'M', marks: 1, text: 'Watts converted to kW' },
      { code: 'SF', marks: 1, text: 'E = P × t for each appliance' },
      { code: 'A', marks: 1, text: `${n(kwhPerDay, 2)} kWh per day` },
      { code: 'CA', marks: 1, text: `${n(kwh, 2)} kWh per month` },
      { code: 'CA', marks: 1, text: `R${n(cost)}` },
    ],
  })
}

{
  const [r, i, minutes] = [12, 1.5, 10]
  const p = i * i * r
  const e = p * minutes * 60
  out.push({
    ...circuits,
    id: 'ps5-12-resistor-power-energy',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${r} Ω resistor carries a current of ${n(i, 1)} A. Use P = I²R to calculate the power dissipated in it, and the energy converted to heat in ${minutes} minutes.`,
    answer: `P = I²R = ${n(i, 1)}² × ${r} = ${n(p)} W. E = P t = ${n(p)} × ${minutes * 60} = ${n(e, 0)} J.`,
    explanation: 'Time must be in seconds for the energy to come out in joules.',
    memo: [
      { code: 'SF', marks: 1, text: `${n(i, 1)}² × ${r}` },
      { code: 'A', marks: 1, text: `${n(p)} W` },
      { code: 'SF', marks: 1, text: `${n(p)} × ${minutes * 60}` },
      { code: 'CA', marks: 1, text: `${n(e, 0)} J` },
    ],
  })
}

{
  const [oldW, ledW, hours, tariff, extraCost] = [60, 9, 6, 3.0, 45]
  const savedKwhPerDay = ((oldW - ledW) / 1000) * hours
  const savedRandPerDay = savedKwhPerDay * tariff
  const payback = extraCost / savedRandPerDay
  out.push({
    ...circuits,
    id: 'ps5-12-led-payback',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A ${oldW} W incandescent bulb and a ${ledW} W LED bulb give the same light. Each is used ${hours} h a day, and electricity costs R${n(tariff)} per kWh. The LED bulb costs R${extraCost} more to buy. Calculate the saving per day, and how many days it takes for the LED bulb to pay back its extra cost. Should a family switch? Give a reason.`,
    answer: `Energy saved per day = (${oldW} − ${ledW}) ÷ 1 000 × ${hours} = ${n(savedKwhPerDay, 3)} kWh. Saving per day = ${n(savedKwhPerDay, 3)} × R${n(tariff)} = R${n(savedRandPerDay)}. Payback = R${extraCost} ÷ R${n(savedRandPerDay)} = ${n(payback, 0)} days. Yes: the extra cost is recovered in under two months, and LED bulbs last for years, so the family saves money for the rest of the bulb’s life.`,
    explanation: 'Payback time = extra cost ÷ saving per unit of time. Anything well inside the lifetime of the product makes the switch worthwhile.',
    memo: [
      { code: 'SF', marks: 1, text: `(${oldW} − ${ledW}) ÷ 1 000 × ${hours}` },
      { code: 'A', marks: 1, text: `${n(savedKwhPerDay, 3)} kWh` },
      { code: 'CA', marks: 1, text: `R${n(savedRandPerDay)} per day` },
      { code: 'CA', marks: 1, text: `${n(payback, 0)} days` },
      { code: 'J', marks: 1, text: 'Yes: paid back quickly, long lifetime' },
    ],
  })
}

out.push(
  {
    ...circuits,
    id: 'ps5-12-kwh-meaning-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'What is 1 kWh (one kilowatt hour)?',
    options: [
      { id: 'a', label: 'The power of an appliance that uses 1 000 J every hour' },
      { id: 'b', label: 'The energy used by a 1 kW appliance running for 1 hour' },
      { id: 'c', label: 'The current drawn by a 1 kW appliance' },
      { id: 'd', label: 'The cost of running a 1 kW appliance for 1 hour' },
    ],
    correctOptionId: 'b',
    answer: 'The energy used by a 1 kW appliance running for 1 hour',
    explanation: 'A kilowatt hour is a unit of energy, not power: 1 kWh = 1 000 W × 3 600 s = 3,6 × 10⁶ J.',
    memo: [{ code: 'A', marks: 2, text: 'B' }],
  },
  {
    ...circuits,
    id: 'ps5-12-bill-in-kwh-not-watts',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why an electricity bill charges for the number of kWh used and not for the power rating of the appliances in the home.',
    answer:
      'Power is only the rate of using energy. What the supplier delivers, and what costs money to produce, is energy, which depends on both the power and how long each appliance runs (E = P t). A high-power kettle used for a few minutes can use less energy than a low-power fridge running all day, so the bill must be based on energy, measured in kWh.',
    explanation: 'Watts tell you how fast the meter turns; kWh tell you how far it has turned.',
    memo: [
      { code: 'A', marks: 1, text: 'Power is the rate of energy use' },
      { code: 'A', marks: 1, text: 'Energy depends on power AND time (E = Pt)' },
      { code: 'A', marks: 1, text: 'The supplier delivers energy, measured in kWh' },
    ],
  },
)

/* ===================================================================== */
/* Electromagnetic radiation, Grade 10: effects and uses                  */
/* ===================================================================== */

const emr = { topicId: 'phys-em-radiation-g10', grade: 10 } as const

{
  const [fUv, fRadio] = [1.5e15, 1.0e8]
  const eUv = h * fUv
  const eRadio = h * fRadio
  const ratio = eUv / eRadio
  out.push({
    ...emr,
    id: 'ps5-10-uv-radio-sunburn',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `Ultraviolet radiation of frequency ${sci(fUv, 1)} Hz and radio waves of frequency ${sci(fRadio, 1)} Hz both reach your skin. Calculate the energy of one photon of each (E = hf), and use your answers to explain why ultraviolet causes sunburn and skin cancer but radio waves do not.`,
    answer: `Ultraviolet: E = 6,63 × 10⁻³⁴ × ${sci(fUv, 1)} = ${sci(eUv)} J. Radio: E = 6,63 × 10⁻³⁴ × ${sci(fRadio, 1)} = ${sci(eRadio)} J. Each ultraviolet photon carries about ${sci(ratio, 1)} times more energy. That is enough to damage the molecules in skin cells, including DNA, which causes sunburn and can lead to skin cancer. A radio photon has far too little energy to break any molecule, however many arrive.`,
    explanation: 'Damage depends on the energy of each photon, which depends on frequency -- not on how much radiation there is in total.',
    memo: [
      { code: 'SF', marks: 1, text: 'E = hf' },
      { code: 'A', marks: 1, text: `UV: ${sci(eUv)} J` },
      { code: 'A', marks: 1, text: `Radio: ${sci(eRadio)} J` },
      { code: 'A', marks: 1, text: 'UV photons carry enough energy to damage skin cells/DNA' },
      { code: 'A', marks: 1, text: 'Radio photons have too little energy to cause damage' },
    ],
  })
}

out.push(
  {
    ...emr,
    id: 'ps5-10-thermal-imaging-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which type of electromagnetic radiation is detected by a camera used for thermal imaging, such as one that finds people trapped in smoke?',
    options: [
      { id: 'a', label: 'Ultraviolet' },
      { id: 'b', label: 'X-rays' },
      { id: 'c', label: 'Infrared' },
      { id: 'd', label: 'Microwaves' },
    ],
    correctOptionId: 'c',
    answer: 'Infrared',
    explanation: 'Warm bodies give off infrared radiation, and infrared passes through smoke better than visible light does.',
    memo: [{ code: 'A', marks: 2, text: 'C: infrared' }],
  },
  {
    ...emr,
    id: 'ps5-10-xray-gamma-living-tissue',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why X-rays and gamma rays are dangerous to living tissue while radio waves are not.',
    answer:
      'X-rays and gamma rays have very high frequencies, so their photons carry a lot of energy. They are ionising: they can knock electrons out of atoms and damage the molecules in cells, including DNA, which can kill cells or cause cancer. Radio waves have very low frequencies and their photons have too little energy to ionise anything.',
    explanation: 'This is why exposure to X-rays and gamma rays must be limited, while radio waves surround us all the time.',
    memo: [
      { code: 'A', marks: 1, text: 'High frequency: high-energy photons' },
      { code: 'A', marks: 1, text: 'Ionising: damage cells/DNA' },
      { code: 'A', marks: 1, text: 'Radio: low energy, not ionising' },
    ],
  },
  {
    ...emr,
    id: 'ps5-10-uv-uses-effects',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Give ONE of the uses of ultraviolet radiation, and TWO of its harmful effects on the skin and eyes.',
    answer:
      'Use: sterilising water or medical instruments by killing micro-organisms (also accepted: detecting forged banknotes, curing dental fillings). Harmful effects: sunburn and skin cancer, and damage to the eyes such as cataracts.',
    explanation: 'Sunscreen and sunglasses with a UV rating reduce the exposure.',
    memo: [
      { code: 'A', marks: 1, text: 'One use (sterilising, detecting forgeries, ...)' },
      { code: 'A', marks: 1, text: 'Sunburn / skin cancer' },
      { code: 'A', marks: 1, text: 'Eye damage / cataracts' },
    ],
  },
  {
    ...emr,
    id: 'ps5-10-radiographer-exposure',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Exposure to X-rays must be limited. Explain why a radiographer stands behind a lead screen every time X-rays are taken, even though the patient is not protected in the same way.',
    answer:
      'X-rays are ionising and damage living tissue, and the damage adds up with every exposure. A patient has only a few X-rays, so their total exposure is small and the benefit of the diagnosis outweighs the risk. The radiographer takes many X-rays every day, so without the lead screen (which absorbs X-rays) their total exposure would become dangerous.',
    explanation: 'The rule is to keep exposure as low as possible, and to accept it only where there is a clear benefit.',
    memo: [
      { code: 'A', marks: 1, text: 'X-rays are ionising: they damage tissue' },
      { code: 'A', marks: 1, text: 'Exposure builds up over many X-rays: radiographer is exposed daily' },
      { code: 'A', marks: 1, text: 'Lead absorbs X-rays / patient’s small exposure is justified by the benefit' },
    ],
  },
  {
    ...emr,
    id: 'ps5-10-microwave-cooking-communication',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Microwaves have uses in both cooking and cellphone communication. Explain how each use works, and why a cellphone does not cook your ear.',
    answer:
      'Cooking: microwaves of a particular frequency are absorbed by water molecules in food, making them vibrate faster, which heats the food. Communication: microwaves pass easily through the atmosphere and carry signals between phones and masts. A cellphone sends out a very low power (about 1 W, compared with about 800 W in an oven), so the heating effect is far too small to cook tissue.',
    explanation: 'The same radiation can be harmless or harmful depending on how much energy is delivered and how quickly.',
    memo: [
      { code: 'A', marks: 1, text: 'Cooking: absorbed by water molecules, heating the food' },
      { code: 'A', marks: 1, text: 'Communication: carry signals through the atmosphere' },
      { code: 'A', marks: 1, text: 'Cellphone power is very low' },
      { code: 'A', marks: 1, text: 'So the heating effect is too small to cause harm' },
    ],
  },
)

/* ===================================================================== */
/* Electromagnetic radiation, Grade 10: wave and particle nature          */
/* ===================================================================== */

{
  const f = 5.6e14
  const e = h * f
  out.push({
    ...emr,
    id: 'ps5-10-green-photon-energy',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Light behaves as particles called photons, each a packet of energy. Calculate the energy of one photon of green light of frequency ${sci(f, 1)} Hz.`,
    answer: `E = hf = 6,63 × 10⁻³⁴ × ${sci(f, 1)} = ${sci(e)} J.`,
    explanation: 'Planck’s constant h = 6,63 × 10⁻³⁴ J·s links the frequency of the wave to the energy of each photon.',
    memo: [
      { code: 'SF', marks: 1, text: 'E = hf' },
      { code: 'SF', marks: 1, text: `6,63 × 10⁻³⁴ × ${sci(f, 1)}` },
      { code: 'A', marks: 1, text: `${sci(e)} J` },
    ],
  })
}

{
  const lambdaNm = 500
  const f = c / (lambdaNm * 1e-9)
  const e = h * f
  out.push({
    ...emr,
    id: 'ps5-10-photon-from-wavelength',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Light of wavelength ${lambdaNm} nm shows its wave nature in a diffraction experiment. Treating it instead as particles, calculate the frequency of the light and the energy of one photon.`,
    answer: `f = c / λ = 3,0 × 10⁸ ÷ (${lambdaNm} × 10⁻⁹) = ${sci(f, 1)} Hz. E = hf = 6,63 × 10⁻³⁴ × ${sci(f, 1)} = ${sci(e)} J.`,
    explanation: 'Convert nanometres to metres (× 10⁻⁹) first. The wave property (wavelength) and the particle property (photon energy) are linked through the frequency.',
    memo: [
      { code: 'SF', marks: 1, text: `f = 3,0 × 10⁸ ÷ (${lambdaNm} × 10⁻⁹)` },
      { code: 'A', marks: 1, text: `${sci(f, 1)} Hz` },
      { code: 'SF', marks: 1, text: `E = 6,63 × 10⁻³⁴ × ${sci(f, 1)}` },
      { code: 'CA', marks: 1, text: `${sci(e)} J` },
    ],
  })
}

{
  const [red, violet] = [700, 400]
  const eRed = (h * c) / (red * 1e-9)
  const eViolet = (h * c) / (violet * 1e-9)
  const ratio = eViolet / eRed
  out.push({
    ...emr,
    id: 'ps5-10-red-violet-photons',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `Calculate the energy of a photon of red light (${red} nm) and of violet light (${violet} nm), and how many times more energy the violet photon has. Use the particle nature of light to explain why violet light can release electrons from a certain metal while red light cannot, however bright it is.`,
    answer: `E = hc / λ. Red: 6,63 × 10⁻³⁴ × 3,0 × 10⁸ ÷ (${red} × 10⁻⁹) = ${sci(eRed)} J. Violet: 6,63 × 10⁻³⁴ × 3,0 × 10⁸ ÷ (${violet} × 10⁻⁹) = ${sci(eViolet)} J. Ratio = ${n(ratio)}. Each electron is released by absorbing ONE photon. A violet photon has enough energy to release an electron; a red photon does not. Brighter red light only means more red photons, each still with too little energy, so no electrons are released.`,
    explanation: 'This is the photoelectric effect, the evidence for the particle nature of light: a wave model predicts that brighter light of any colour should eventually work, which is not what happens.',
    memo: [
      { code: 'SF', marks: 1, text: 'E = hc / λ' },
      { code: 'A', marks: 1, text: `Red: ${sci(eRed)} J; violet: ${sci(eViolet)} J` },
      { code: 'CA', marks: 1, text: `${n(ratio)} times` },
      { code: 'A', marks: 1, text: 'One photon releases one electron' },
      { code: 'A', marks: 1, text: 'Red photons each have too little energy; brightness only adds more photons' },
    ],
  })
}

out.push(
  {
    ...emr,
    id: 'ps5-10-particle-nature-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which observation shows the particle nature of light?',
    options: [
      { id: 'a', label: 'Diffraction of light through a narrow slit' },
      { id: 'b', label: 'Interference of light from two slits' },
      { id: 'c', label: 'The photoelectric effect' },
      { id: 'd', label: 'Refraction of light in a glass block' },
    ],
    correctOptionId: 'c',
    answer: 'The photoelectric effect',
    explanation: 'Diffraction and interference show the wave nature; in the photoelectric effect light behaves as photons that each give their energy to one electron.',
    memo: [{ code: 'A', marks: 2, text: 'C: photoelectric effect' }],
  },
  {
    ...emr,
    id: 'ps5-10-wave-particle-duality',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain what is meant by the wave–particle (dual) nature of electromagnetic radiation, giving ONE piece of evidence for each.',
    answer:
      'Electromagnetic radiation behaves as a wave in some situations and as a stream of particles (photons) in others. Wave nature: it shows diffraction and interference. Particle nature: in the photoelectric effect it behaves as photons, each a packet of energy E = hf.',
    explanation: 'Neither model alone explains everything, so both are used, each where it fits.',
    memo: [
      { code: 'A', marks: 1, text: 'Behaves as a wave and as particles (photons)' },
      { code: 'A', marks: 1, text: 'Wave evidence: diffraction / interference' },
      { code: 'A', marks: 1, text: 'Particle evidence: photoelectric effect' },
    ],
  },
  {
    ...emr,
    id: 'ps5-10-slit-and-metal-observations',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'Observation 1: light passing through a very narrow slit spreads out into a pattern of bright and dark bands. Observation 2: ultraviolet light shone on clean zinc knocks electrons out of the metal. State which nature of light each observation shows, and explain why.',
    answer:
      'Observation 1 shows the wave nature: spreading through a slit is diffraction, and the bright and dark bands come from interference, which only waves do. Observation 2 shows the particle nature: it is the photoelectric effect, in which each photon gives its packet of energy to a single electron, knocking it out of the metal.',
    explanation: 'An exam answer names the nature AND the phenomenon that shows it.',
    memo: [
      { code: 'A', marks: 1, text: '1: wave nature' },
      { code: 'A', marks: 1, text: 'Diffraction/interference are wave behaviour' },
      { code: 'A', marks: 1, text: '2: particle nature' },
      { code: 'A', marks: 1, text: 'Photoelectric effect: each photon releases one electron' },
    ],
  },
)

/* ===================================================================== */
/* Longitudinal waves, Grade 10: speed in different media                 */
/* ===================================================================== */

const longWaves = { topicId: 'phys-longitudinal-waves-g10', grade: 10 } as const

{
  const [length, vSteel, vAir] = [1020, 5100, 340]
  const tSteel = length / vSteel
  const tAir = length / vAir
  out.push({
    ...longWaves,
    id: 'ps5-10-rail-two-sounds',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A hammer strikes one end of a ${n(length, 0)} m steel rail. A listener at the other end hears the sound twice: once through the steel and once through the air. The speed of sound is ${n(vSteel, 0)} m·s⁻¹ in steel and ${vAir} m·s⁻¹ in air. Calculate the time between the two sounds.`,
    answer: `Steel: t = d / v = ${n(length, 0)} ÷ ${n(vSteel, 0)} = ${n(tSteel)} s. Air: t = ${n(length, 0)} ÷ ${vAir} = ${n(tAir)} s. Time between them = ${n(tAir)} − ${n(tSteel)} = ${n(tAir - tSteel)} s.`,
    explanation: 'Sound travels fastest in solids, so the sound through the rail arrives first.',
    memo: [
      { code: 'SF', marks: 1, text: 't = d / v' },
      { code: 'A', marks: 1, text: `Steel: ${n(tSteel)} s` },
      { code: 'A', marks: 1, text: `Air: ${n(tAir)} s` },
      { code: 'CA', marks: 1, text: `${n(tAir - tSteel)} s` },
    ],
  })
}

{
  const [f, vAir, vWater] = [500, 340, 1500]
  out.push({
    ...longWaves,
    id: 'ps5-10-air-water-wavelength',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A sound of frequency ${f} Hz passes from air, where its speed is ${vAir} m·s⁻¹, into water, where its speed is ${n(vWater, 0)} m·s⁻¹. Calculate its wavelength in each of the two media, and state which quantity stays the same.`,
    answer: `λ = v / f. In air: ${vAir} ÷ ${f} = ${n(vAir / f)} m. In water: ${n(vWater, 0)} ÷ ${f} = ${n(vWater / f)} m. The frequency stays the same; the speed and wavelength change.`,
    explanation: 'The frequency is set by the source, so it cannot change when the wave enters a new medium. Faster speed with the same frequency means a longer wavelength.',
    memo: [
      { code: 'SF', marks: 1, text: 'λ = v / f' },
      { code: 'A', marks: 1, text: `Air: ${n(vAir / f)} m` },
      { code: 'A', marks: 1, text: `Water: ${n(vWater / f)} m` },
      { code: 'A', marks: 1, text: 'Frequency stays the same' },
    ],
  })
}

out.push(
  {
    ...longWaves,
    id: 'ps5-10-fastest-medium-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'In which medium does sound travel fastest?',
    options: [
      { id: 'a', label: 'Air' },
      { id: 'b', label: 'Water' },
      { id: 'c', label: 'Steel' },
      { id: 'd', label: 'A vacuum' },
    ],
    correctOptionId: 'c',
    answer: 'Steel',
    explanation: 'Sound travels fastest in solids, slower in liquids, slowest in gases, and not at all in a vacuum.',
    memo: [{ code: 'A', marks: 2, text: 'C: steel' }],
  },
  {
    ...longWaves,
    id: 'ps5-10-solids-faster-than-gases',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why sound travels faster through solids than through gases.',
    answer:
      'Sound is passed on by particles bumping into their neighbours. In a solid the particles are much closer together and strongly bonded, so each one passes the vibration to the next more quickly. In a gas the particles are far apart, so the vibration is transmitted more slowly.',
    explanation: 'The speed depends on how quickly one particle can affect the next.',
    memo: [
      { code: 'A', marks: 1, text: 'Particles in a solid are closer together / strongly bonded' },
      { code: 'A', marks: 1, text: 'So they transmit the vibration more quickly' },
    ],
  },
  {
    ...longWaves,
    id: 'ps5-10-vacuum-no-sound',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Two astronauts working outside a space station cannot hear each other shout, even when they are a metre apart. Explain why sound cannot travel through the vacuum of space.',
    answer:
      'Sound is a longitudinal wave that needs a medium: it travels by particles vibrating and passing the vibration on to neighbouring particles. A vacuum has no particles, so there is nothing to carry the vibration.',
    explanation: 'They can talk by radio, because radio waves are electromagnetic and need no medium.',
    memo: [
      { code: 'A', marks: 1, text: 'Sound needs a medium / particles to vibrate' },
      { code: 'A', marks: 1, text: 'A vacuum has no particles' },
    ],
  },
  {
    ...longWaves,
    id: 'ps5-10-denser-faster-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Use the data to evaluate the claim: “The denser the medium, the faster sound travels through it.”',
    context:
      '| Medium | Density (kg·m⁻³) | Speed of sound (m·s⁻¹) |\n|---|---|---|\n| Air | 1,2 | 340 |\n| Pine wood | 500 | 3 300 |\n| Water | 1 000 | 1 500 |\n| Steel | 7 800 | 5 100 |',
    answer:
      'The claim is only partly supported. Air is the least dense and slowest, and steel the densest and fastest, which fits. But pine wood is half as dense as water, yet sound travels more than twice as fast in it (3 300 compared with 1 500 m·s⁻¹). So density alone does not decide the speed: what matters is how closely and strongly the particles are bonded, which is why solids are fastest even when they are not very dense.',
    explanation: 'One clear counter-example is enough to show that a general claim is not always true.',
    memo: [
      { code: 'J', marks: 1, text: 'Partly supported / not always true' },
      { code: 'A', marks: 1, text: 'Air slowest and least dense; steel fastest and densest' },
      { code: 'A', marks: 1, text: 'Counter-example: wood less dense than water, yet faster' },
      { code: 'R', marks: 1, text: 'Speed depends on how strongly the particles are bonded (state), not density alone' },
    ],
  },
)

/* ===================================================================== */
/* The periodic table, Grade 10: groups                                   */
/* ===================================================================== */

const periodic = { topicId: 'phys-periodic-table', grade: 10 } as const

out.push(
  {
    ...periodic,
    id: 'ps5-10-noble-gases-group-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'In which group of the periodic table are the noble gases?',
    options: [
      { id: 'a', label: 'Group 1' },
      { id: 'b', label: 'Group 2' },
      { id: 'c', label: 'Group 17' },
      { id: 'd', label: 'Group 18' },
    ],
    correctOptionId: 'd',
    answer: 'Group 18',
    explanation: 'Group 1 holds the alkali metals, group 2 the alkaline earth metals, and group 17 the halogens.',
    memo: [{ code: 'A', marks: 2, text: 'D: group 18' }],
  },
  {
    ...periodic,
    id: 'ps5-10-calcium-group-2',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Calcium is in group 2. State the name of this group of metals, the number of valence electrons a calcium atom has, and whether calcium is more or less reactive than potassium in group 1.',
    answer:
      'The alkaline earth metals. Calcium has two valence electrons. It is less reactive than potassium: it must lose two electrons to react rather than one, which takes more energy.',
    explanation: 'Group 2 metals react with water too, but more slowly than the alkali metals next to them.',
    memo: [
      { code: 'A', marks: 1, text: 'Alkaline earth metals' },
      { code: 'A', marks: 1, text: 'Two valence electrons' },
      { code: 'A', marks: 1, text: 'Less reactive than potassium' },
    ],
  },
  {
    ...periodic,
    id: 'ps5-10-helium-in-group-18',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Helium has only two electrons, yet it is placed in group 18 with the noble gases, not in group 2. Explain why.',
    answer:
      'Helium’s two electrons fill its only energy level, so, like the other noble gases, it has a full outer energy level. That makes it unreactive, which matches the noble gases and not the reactive group 2 metals.',
    explanation: 'Groups collect elements that behave alike, and behaviour depends on whether the outer energy level is full.',
    memo: [
      { code: 'A', marks: 1, text: 'Its outer (first) energy level is full' },
      { code: 'A', marks: 1, text: 'So it is unreactive like the noble gases' },
    ],
  },
  {
    ...periodic,
    id: 'ps5-10-alkali-metals-under-oil',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Lithium, sodium and potassium are stored under oil. Use their position in group 1 to explain why, and name the most reactive of the three.',
    answer:
      'They are alkali metals with one valence electron, which they lose very easily, so they are very reactive and react with the oxygen and water vapour in air. Oil keeps the air away. Potassium is the most reactive, because reactivity increases down group 1.',
    explanation: 'Further down the group the valence electron is further from the nucleus and is lost more easily.',
    memo: [
      { code: 'A', marks: 1, text: 'One valence electron, lost easily: very reactive' },
      { code: 'A', marks: 1, text: 'Oil keeps out air/water vapour' },
      { code: 'A', marks: 1, text: 'Potassium: reactivity increases down the group' },
    ],
  },
  {
    ...periodic,
    id: 'ps5-10-halogen-displacement',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'When chlorine water is added to potassium bromide solution, bromine forms. When iodine is added to potassium chloride solution, nothing happens. Explain these results in terms of the reactivity of the halogens down group 17.',
    answer:
      'Reactivity decreases down group 17, so chlorine is more reactive than bromine, and iodine is less reactive than chlorine. A more reactive halogen takes the place of a less reactive one in its compound, so chlorine displaces bromine. Iodine is less reactive than chlorine, so it cannot displace it.',
    explanation: 'Further down the group the outer energy level is further from the nucleus, so the atom attracts an extra electron less strongly.',
    memo: [
      { code: 'A', marks: 1, text: 'Reactivity decreases down group 17' },
      { code: 'A', marks: 1, text: 'Chlorine more reactive than bromine: displaces it' },
      { code: 'A', marks: 1, text: 'Iodine less reactive than chlorine: no reaction' },
    ],
  },
  {
    ...periodic,
    id: 'ps5-10-astatine-predict',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Astatine (At) is below iodine in group 17 with the other halogens. Use the data to predict the state of astatine at room temperature (25 °C) and how its reactivity compares with iodine’s. Give reasons.',
    context:
      '| Halogen | Melting point (°C) | Boiling point (°C) | State at 25 °C |\n|---|---|---|---|\n| Fluorine | −220 | −188 | Gas |\n| Chlorine | −101 | −34 | Gas |\n| Bromine | −7 | 59 | Liquid |\n| Iodine | 114 | 184 | Solid |',
    answer:
      'Astatine will be a solid: melting points rise steadily down the group, so astatine’s melting point should be above iodine’s 114 °C, far above 25 °C. It will be less reactive than iodine, because reactivity decreases down group 17.',
    explanation: 'Predicting from a group trend means extending the pattern one step further, and saying which trend you used.',
    memo: [
      { code: 'A', marks: 1, text: 'Solid' },
      { code: 'R', marks: 1, text: 'Melting points increase down the group: above 114 °C' },
      { code: 'A', marks: 1, text: 'Less reactive than iodine' },
      { code: 'R', marks: 1, text: 'Reactivity decreases down group 17' },
    ],
  },
)

/* ===================================================================== */
/* Physical and chemical change, Grade 10: energy in reactions            */
/* ===================================================================== */

const change = { topicId: 'phys-physical-chemical-change', grade: 10 } as const

{
  const [hh, clcl, hcl] = [436, 242, 431]
  const broken = hh + clcl
  const made = 2 * hcl
  const net = made - broken
  out.push({
    ...change,
    id: 'ps5-10-hcl-bond-energy',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `For H₂ + Cl₂ → 2HCl, the energy needed to break the bonds is H–H: ${hh} kJ and Cl–Cl: ${clcl} kJ, and ${hcl} kJ is released in making each H–Cl bond (per mole). Calculate the energy absorbed in breaking bonds, the energy released in making bonds, and state whether the reaction is exothermic or endothermic.`,
    answer: `Breaking: ${hh} + ${clcl} = ${broken} kJ absorbed. Making: 2 × ${hcl} = ${made} kJ released. More energy is released than absorbed, by ${made} − ${broken} = ${net} kJ, so the reaction is exothermic.`,
    explanation: 'Two H–Cl bonds form, so multiply by two. Compare the two totals: if making releases more than breaking absorbs, the surroundings get warmer.',
    memo: [
      { code: 'A', marks: 1, text: `${broken} kJ absorbed` },
      { code: 'M', marks: 1, text: `2 × ${hcl}` },
      { code: 'A', marks: 1, text: `${made} kJ released` },
      { code: 'CA', marks: 1, text: `Net ${net} kJ released` },
      { code: 'A', marks: 1, text: 'Exothermic' },
    ],
  })
}

out.push(
  {
    ...change,
    id: 'ps5-10-endothermic-process-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which of these reactions is endothermic?',
    options: [
      { id: 'a', label: 'The combustion of methane' },
      { id: 'b', label: 'The neutralisation of an acid by a base' },
      { id: 'c', label: 'The thermal decomposition of calcium carbonate' },
      { id: 'd', label: 'Burning magnesium in air' },
    ],
    correctOptionId: 'c',
    answer: 'The thermal decomposition of calcium carbonate',
    explanation: 'Thermal decomposition needs a continuous supply of heat to keep going; combustion and neutralisation release energy.',
    memo: [{ code: 'A', marks: 2, text: 'C: thermal decomposition' }],
  },
  {
    ...change,
    id: 'ps5-10-methane-combustion-bonds',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain, in terms of breaking and making bonds, why the combustion of methane is exothermic.',
    answer:
      'Energy is absorbed to break the bonds in methane and oxygen, and energy is released when the new bonds in carbon dioxide and water form. More energy is released in making the new bonds than is absorbed in breaking the old ones, so overall energy is released to the surroundings.',
    explanation: 'Breaking bonds always takes energy; making bonds always gives it out. Exothermic or endothermic depends on which is bigger.',
    memo: [
      { code: 'A', marks: 1, text: 'Breaking bonds absorbs energy' },
      { code: 'A', marks: 1, text: 'Making bonds releases energy' },
      { code: 'A', marks: 1, text: 'More released than absorbed: exothermic' },
    ],
  },
  {
    ...change,
    id: 'ps5-10-cold-pack-endothermic',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'An instant cold pack for sports injuries contains a chemical that dissolves in water when the pack is squeezed, and the pack feels cold. Is the change exothermic or endothermic? Explain why the pack feels cold.',
    answer:
      'Endothermic. The change absorbs energy from its surroundings, including the injured skin, so the temperature of the surroundings drops and the container feels cold.',
    explanation: 'Feels cold: energy is flowing into the reaction. Feels warm: energy is flowing out of it.',
    memo: [
      { code: 'A', marks: 1, text: 'Endothermic' },
      { code: 'A', marks: 1, text: 'Absorbs energy from the surroundings' },
      { code: 'A', marks: 1, text: 'So the temperature of the surroundings falls' },
    ],
  },
  {
    ...change,
    id: 'ps5-10-two-reactions-temperatures',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Use the temperature readings to classify each reaction as exothermic or endothermic, and explain your reasoning for each.',
    context:
      '| Reaction | Start temperature (°C) | End temperature (°C) |\n|---|---|---|\n| A: magnesium ribbon in dilute acid | 21 | 34 |\n| B: citric acid with baking soda solution | 21 | 14 |',
    answer:
      'A is exothermic: the temperature rose by 13 °C, so energy was released to the surroundings. B is endothermic: the temperature fell by 7 °C, so energy was absorbed from the surroundings.',
    explanation: 'The thermometer measures the surroundings (the solution), not the reaction itself.',
    memo: [
      { code: 'A', marks: 1, text: 'A: exothermic' },
      { code: 'R', marks: 1, text: 'Temperature rose: energy released' },
      { code: 'A', marks: 1, text: 'B: endothermic' },
      { code: 'R', marks: 1, text: 'Temperature fell: energy absorbed' },
    ],
  },
  {
    ...change,
    id: 'ps5-10-breaking-bonds-misconception',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'A learner writes: “Burning fuels gives off heat because breaking bonds releases energy.” Evaluate this statement and correct it.',
    answer:
      'The statement is incorrect. Breaking bonds always absorbs energy; it never releases it. Burning releases heat because the new bonds formed in the products (carbon dioxide and water) release more energy when they form than was absorbed to break the bonds in the fuel and oxygen. Corrected: burning is exothermic because more energy is released in making bonds than is absorbed in breaking them.',
    explanation: 'This is one of the most common errors in chemistry answers; the energy comes from bond MAKING.',
    memo: [
      { code: 'J', marks: 1, text: 'Incorrect' },
      { code: 'A', marks: 1, text: 'Breaking bonds absorbs energy' },
      { code: 'A', marks: 1, text: 'Energy is released when new bonds form' },
      { code: 'A', marks: 1, text: 'More released in making than absorbed in breaking: exothermic' },
    ],
  },
)

/* ===================================================================== */
/* Sound, Grade 10: ultrasound and hearing damage                         */
/* ===================================================================== */

const sound = { topicId: 'phys-sound-g10', grade: 10 } as const

{
  const [v, t] = [5000, 6.0e-5]
  const d = (v * t) / 2
  out.push({
    ...sound,
    id: 'ps5-10-ultrasound-flaw-in-metal',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `To check a steel beam for flaws, an ultrasound pulse is sent into the metal. An echo from a crack returns after ${sci(t, 1)} s. The speed of sound in the steel is ${n(v, 0)} m·s⁻¹. Calculate the distance from the surface to the crack, in centimetres.`,
    answer: `Total path = v t = ${n(v, 0)} × ${sci(t, 1)} = ${n(v * t)} m. The pulse travels there and back, so the distance is half: ${n(d)} m = ${n(d * 100, 1)} cm.`,
    explanation: 'Echo questions always need the halving step: the time measured covers the trip there and back.',
    memo: [
      { code: 'SF', marks: 1, text: 'd = v t' },
      { code: 'A', marks: 1, text: `Total path ${n(v * t)} m` },
      { code: 'M', marks: 1, text: 'Divide by 2: there and back' },
      { code: 'CA', marks: 1, text: `${n(d * 100, 1)} cm` },
    ],
  })
}

{
  const [safeDb, safeHours, step, level] = [85, 8, 3, 97]
  const halvings = (level - safeDb) / step
  const safe = safeHours / 2 ** halvings
  out.push({
    ...sound,
    id: 'ps5-10-safe-exposure-97db',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Hearing damage is avoided if exposure to ${safeDb} dB lasts no more than ${safeHours} hours a day, and the safe time halves for every ${step} dB above that. Calculate the safe exposure time at ${level} dB, in minutes.`,
    answer: `${level} − ${safeDb} = ${level - safeDb} dB above, which is ${halvings} halvings. Safe time = ${safeHours} ÷ 2^${halvings} = ${n(safe, 2)} h = ${n(safe * 60, 0)} minutes.`,
    explanation: 'A 3 dB increase doubles the sound intensity, so the same dose of energy is reached in half the time.',
    memo: [
      { code: 'A', marks: 1, text: `${halvings} halvings` },
      { code: 'M', marks: 1, text: `${safeHours} ÷ 2^${halvings}` },
      { code: 'CA', marks: 1, text: `${n(safe * 60, 0)} minutes` },
    ],
  })
}

{
  const [safeDb, safeHours, step, level, listen] = [85, 8, 3, 100, 3]
  const halvings = (level - safeDb) / step
  const safe = safeHours / 2 ** halvings
  const times = listen / safe
  out.push({
    ...sound,
    id: 'ps5-10-earphones-risk-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A learner listens to music through earphones at ${level} dB for ${listen} hours every day. Using the rule that ${safeDb} dB is safe for ${safeHours} hours and the safe time halves for every ${step} dB more, evaluate the risk of hearing damage and suggest TWO changes.`,
    answer: `${level} − ${safeDb} = ${level - safeDb} dB, which is ${halvings} halvings: safe time = ${safeHours} ÷ 2^${halvings} = ${n(safe, 2)} h (${n(safe * 60, 0)} minutes). ${listen} h is ${n(times, 0)} times the safe limit, every day, so the learner is at serious risk of permanent hearing damage. Changes: turn the volume down to ${safeDb} dB or below, and listen for shorter periods with breaks (noise-cancelling earphones help keep the volume low).`,
    explanation: 'Damage from prolonged exposure is gradual and painless, and it is permanent, which is why limits matter before any symptoms appear.',
    memo: [
      { code: 'A', marks: 1, text: `${halvings} halvings` },
      { code: 'CA', marks: 1, text: `Safe time ${n(safe * 60, 0)} minutes` },
      { code: 'CA', marks: 1, text: `${n(times, 0)} times the limit` },
      { code: 'J', marks: 1, text: 'High risk of permanent hearing damage' },
      { code: 'A', marks: 1, text: 'Two changes: lower volume / shorter time / breaks' },
    ],
  })
}

out.push(
  {
    ...sound,
    id: 'ps5-10-hearing-damage-level-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Above roughly which sound level does prolonged exposure begin to cause permanent hearing damage?',
    options: [
      { id: 'a', label: '30 dB' },
      { id: 'b', label: '60 dB' },
      { id: 'c', label: '85 dB' },
      { id: 'd', label: '160 dB' },
    ],
    correctOptionId: 'c',
    answer: '85 dB',
    explanation: 'Normal conversation is about 60 dB and safe all day. From about 85 dB, long exposure damages the hair cells in the inner ear.',
    memo: [{ code: 'A', marks: 2, text: 'C: 85 dB' }],
  },
  {
    ...sound,
    id: 'ps5-10-prenatal-ultrasound-not-xray',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why ultrasound, and not X-rays, is used for prenatal imaging of an unborn baby.',
    answer:
      'X-rays are ionising and can damage the cells of the rapidly growing baby. Ultrasound is a sound wave, not ionising radiation, and at the levels used it is not known to cause damage, so it is safe for imaging the baby.',
    explanation: 'Echoes from the boundaries between tissues are used to build up the picture.',
    memo: [
      { code: 'A', marks: 1, text: 'X-rays are ionising: could harm the growing baby' },
      { code: 'A', marks: 1, text: 'Ultrasound is not ionising: safe' },
    ],
  },
  {
    ...sound,
    id: 'ps5-10-jackhammer-ear-protection',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'A road worker uses a jackhammer at about 110 dB for several hours a day. Explain why the worker must wear ear protection, using the idea of hearing damage.',
    answer:
      '110 dB is far above the safe level of about 85 dB. Prolonged exposure at this level damages the sensitive hair cells in the inner ear, and this damage is permanent because they do not grow back. Ear protectors reduce the sound level reaching the ear, so the exposure is safer.',
    explanation: 'Each 10 dB increase means ten times the sound intensity, so 110 dB is hundreds of times more intense than 85 dB.',
    memo: [
      { code: 'A', marks: 1, text: 'Far above about 85 dB' },
      { code: 'A', marks: 1, text: 'Prolonged exposure damages the inner ear permanently' },
      { code: 'A', marks: 1, text: 'Ear protectors reduce the sound level reaching the ear' },
    ],
  },
)

/* ===================================================================== */
/* Vectors in two dimensions, Grade 11: resolving into components         */
/* ===================================================================== */

const vectors = { topicId: 'phys-vectors-2d', grade: 11 } as const

{
  const [f, theta] = [50, 30]
  const fx = f * Math.cos(rad(theta))
  const fy = f * Math.sin(rad(theta))
  out.push({
    ...vectors,
    id: 'ps5-11-resolve-50n-30',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `By resolving the force, calculate the horizontal and vertical components of a ${f} N force acting at ${theta}° above the horizontal.`,
    answer: `Fx = F cos θ = ${f} cos ${theta}° = ${n(fx)} N. Fy = F sin θ = ${f} sin ${theta}° = ${n(fy)} N.`,
    explanation: 'With θ measured from the horizontal, the horizontal component uses cos and the vertical component uses sin.',
    memo: [
      { code: 'SF', marks: 1, text: `Fx = ${f} cos ${theta}°` },
      { code: 'A', marks: 1, text: `${n(fx)} N` },
      { code: 'SF', marks: 1, text: `Fy = ${f} sin ${theta}°` },
      { code: 'A', marks: 1, text: `${n(fy)} N` },
    ],
  })
}

{
  const [f, theta] = [80, 40]
  const fx = f * Math.cos(rad(theta))
  const fy = f * Math.sin(rad(theta))
  out.push({
    ...vectors,
    id: 'ps5-11-suitcase-handle-components',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A traveller pulls a suitcase with a force of ${f} N along the handle, which makes an angle of ${theta}° with the horizontal floor. By resolving the force into components, calculate the part that pulls the suitcase forward and the part that lifts it, and explain why a lower handle angle makes it easier to pull forward.`,
    answer: `Forward (horizontal) component = ${f} cos ${theta}° = ${n(fx)} N. Lifting (vertical) component = ${f} sin ${theta}° = ${n(fy)} N. A smaller angle makes cos θ larger, so more of the same force acts horizontally to move the suitcase forward.`,
    explanation: 'The two components together always make up the original force: √(Fx² + Fy²) = F.',
    memo: [
      { code: 'SF', marks: 1, text: `${f} cos ${theta}°` },
      { code: 'A', marks: 1, text: `${n(fx)} N forward` },
      { code: 'A', marks: 1, text: `${n(fy)} N upward` },
      { code: 'R', marks: 1, text: 'Smaller angle: larger cos θ, larger forward component' },
    ],
  })
}

{
  const [m, theta] = [20, 25]
  const w = m * g
  const along = w * Math.sin(rad(theta))
  const perp = w * Math.cos(rad(theta))
  out.push({
    ...vectors,
    id: 'ps5-11-box-on-slope-components',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `A ${m} kg box rests on a ramp inclined at ${theta}° to the horizontal. By resolving its weight, calculate the component of the weight parallel to the ramp and the component perpendicular to it.`,
    answer: `Weight = mg = ${m} × 9,8 = ${n(w, 0)} N. Parallel to the ramp: ${n(w, 0)} sin ${theta}° = ${n(along)} N. Perpendicular to the ramp: ${n(w, 0)} cos ${theta}° = ${n(perp)} N.`,
    explanation: 'On a slope the angle between the weight and the perpendicular to the ramp equals the slope angle, so the parallel component uses sin θ and the perpendicular one uses cos θ.',
    memo: [
      { code: 'A', marks: 1, text: `w = ${n(w, 0)} N` },
      { code: 'SF', marks: 1, text: `${n(w, 0)} sin ${theta}°` },
      { code: 'A', marks: 1, text: `${n(along)} N parallel` },
      { code: 'SF', marks: 1, text: `${n(w, 0)} cos ${theta}°` },
      { code: 'A', marks: 1, text: `${n(perp)} N perpendicular` },
    ],
  })
}

{
  const [v, theta] = [250, 35]
  const east = v * Math.cos(rad(theta))
  const north = v * Math.sin(rad(theta))
  out.push({
    ...vectors,
    id: 'ps5-11-plane-velocity-components',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `An aeroplane flies at ${v} m·s⁻¹ in a direction ${theta}° north of east. By resolving the velocity, calculate its east and north components, and how far north it travels in 10 minutes.`,
    answer: `East: ${v} cos ${theta}° = ${n(east)} m·s⁻¹. North: ${v} sin ${theta}° = ${n(north)} m·s⁻¹. Distance north in 600 s = ${n(north)} × 600 = ${n(north * 600, 0)} m (about ${n(north * 0.6, 1)} km).`,
    explanation: 'Any vector -- force, velocity or displacement -- is resolved the same way.',
    memo: [
      { code: 'A', marks: 1, text: `East: ${n(east)} m·s⁻¹` },
      { code: 'A', marks: 1, text: `North: ${n(north)} m·s⁻¹` },
      { code: 'M', marks: 1, text: '× 600 s' },
      { code: 'CA', marks: 1, text: `${n(north * 600, 0)} m` },
    ],
  })
}

{
  const [f, theta] = [100, 60]
  const fx = f * Math.cos(rad(theta))
  const fy = f * Math.sin(rad(theta))
  out.push({
    ...vectors,
    id: 'ps5-11-sin-cos-swapped-error',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `When resolving a ${f} N force acting at ${theta}° to the horizontal, a learner writes: Fx = ${f} sin ${theta}° = ${n(fy, 1)} N and Fy = ${f} cos ${theta}° = ${n(fx, 1)} N. Identify the error, explain how to avoid it, and give the correct components.`,
    answer: `The learner swapped sin and cos. With θ measured from the horizontal, the horizontal component is adjacent to the angle, so it uses cos: Fx = ${f} cos ${theta}° = ${n(fx, 1)} N, and Fy = ${f} sin ${theta}° = ${n(fy, 1)} N. To avoid the error, draw the vector and the angle first and check which side of the right-angled triangle is adjacent to θ. A quick check: a steep force (${theta}°) must have a larger vertical than horizontal component.`,
    explanation: 'cos goes with the component next to (adjacent to) the angle; sin with the one opposite it.',
    memo: [
      { code: 'A', marks: 1, text: 'sin and cos swapped' },
      { code: 'R', marks: 1, text: 'Horizontal component is adjacent to θ: uses cos' },
      { code: 'A', marks: 1, text: `Fx = ${n(fx, 1)} N, Fy = ${n(fy, 1)} N` },
      { code: 'A', marks: 1, text: 'Draw the angle first / steep force has the larger vertical component' },
    ],
  })
}

out.push({
  ...vectors,
  id: 'ps5-11-vertical-component-mcq',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'A force F acts at an angle θ above the horizontal. When resolving it, which expression gives its vertical component?',
  options: [
    { id: 'a', label: 'F cos θ' },
    { id: 'b', label: 'F sin θ' },
    { id: 'c', label: 'F tan θ' },
    { id: 'd', label: 'F ÷ sin θ' },
  ],
  correctOptionId: 'b',
  answer: 'F sin θ',
  explanation: 'The vertical component is opposite the angle measured from the horizontal, so it uses sin θ.',
  memo: [{ code: 'A', marks: 2, text: 'B: F sin θ' }],
})

export const physicsThinQuestions: Question[] = out
