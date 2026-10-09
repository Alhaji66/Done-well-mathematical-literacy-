/**
 * Physical Sciences investigations: the two question types report:question-types
 * found thinnest across almost every topic -- INVESTIGATION SKILLS (variables,
 * the investigative question, hypothesis, precautions, conclusion) and GRAPH OR
 * DATA INTERPRETATION (reading a table of results, the straight-line graph to
 * plot, a value from the gradient or intercept).
 *
 * Each investigation is one experiment of the kind CAPS prescribes or an NSC
 * paper sets, with a table of results, and two questions on it: one on how
 * the investigation was designed, and one analysing its results. The results
 * are computed from the physics with the values declared beside them, rounded
 * the way a learner would record them, so a table and its memo cannot
 * disagree. Numbers use a decimal comma.
 */
import type { Grade, MemoStep, Question } from '@/types'

/** A number with a decimal comma, to `dp` places, trailing zeros dropped. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(Math.abs(r)).split('.')
  return (r < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}
/** Fixed decimals, as a recorded measurement: 0,40 not 0,4. */
const f = (v: number, dp: number): string => {
  const s = Math.abs(v).toFixed(dp).replace('.', ',')
  return (v < 0 ? '−' : '') + s
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
const table = (title: string, head: string[], rows: string[][]) =>
  `|+ TABLE: ${title}\n| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`

interface Part {
  marks: number
  prompt: string
  answer: string
  explanation: string
  memo: MemoStep[]
}

const out: Question[] = []

/** One investigation: its design question and its analysis question, sharing the results. */
function investigation(topicId: string, grade: Grade, id: string, context: string, design: Part, analysis: Part) {
  out.push(
    { id: `${id}-design`, topicId, grade, difficulty: 'Moderate', cognitiveLevel: 2, context, ...design },
    { id: `${id}-results`, topicId, grade, difficulty: 'Challenge', cognitiveLevel: 3, context, ...analysis },
  )
}

const g = 9.8
const k = 9.0e9
const h = 6.63e-34

// ================================================================ GRADE 12

// --- Momentum: is momentum conserved when two trolleys collide and stick?
{
  const mA = 1.5
  const vA = 0.8
  const mB = [0.5, 1.0, 1.5]
  // Measured speeds after the collision, a little below the ideal because of friction.
  const after = mB.map((m) => Math.floor(((mA * vA) / (mA + m)) * 100 - 0.6) / 100)
  const r = 2
  const pBefore = mA * vA
  const pAfter = (mA + mB[r]) * after[r]
  investigation(
    'phys-momentum-impulse',
    12,
    'psi-12-momentum-trolleys',
    `Learners investigate collisions on a level runway. Trolley A (mass ${n(mA)} kg) moves at ${n(vA)} m·s⁻¹ towards a stationary trolley B. The trolleys stick together and their common velocity is measured. The mass of trolley B is changed by adding bricks.\n${table('RESULTS', ['Run', 'Mass of B (kg)', 'Velocity of A before (m·s⁻¹)', 'Velocity of A and B after (m·s⁻¹)'], mB.map((m, i) => [`${i + 1}`, f(m, 1), f(vA, 2), f(after[i], 2)]))}`,
    {
      marks: 4,
      prompt: 'Write down an investigative question for this experiment, and name the independent variable and ONE controlled variable. Why must the runway be level and as frictionless as possible?',
      answer: 'Investigative question: Is the total momentum of a system of two trolleys conserved when they collide? (or: How does the velocity after the collision depend on the mass of trolley B?) Independent variable: the mass of trolley B. Controlled variable: the mass of trolley A, or the velocity of A before the collision. The system must be ISOLATED: friction is an external force that would change the total momentum.',
      explanation: 'An investigative question names what is changed and what is measured. What the learners change is the mass of B; what they keep the same is A\'s mass and speed. The principle of conservation of linear momentum only holds when the net external force on the system is zero, and friction on the runway is an external force.',
      memo: [
        { code: 'A', marks: 1, text: 'investigative question relating the variables' },
        { code: 'A', marks: 1, text: 'independent: mass of B' },
        { code: 'A', marks: 1, text: 'controlled: mass or initial velocity of A' },
        { code: 'R', marks: 1, text: 'friction is an external force: the system must be isolated' },
      ],
    },
    {
      marks: 5,
      prompt: `Use the results of run ${r + 1} to calculate the total momentum before and after the collision. Do the results support the principle of conservation of linear momentum? Explain why the momentum after is slightly smaller.`,
      answer: `Before: ${n(pBefore)} kg·m·s⁻¹. After: ${n(pAfter, 3)} kg·m·s⁻¹. Yes: the two are equal within experimental error, so momentum is conserved. The small loss is caused by friction (an external force) acting on the trolleys.`,
      explanation: `p = mv. Before: only A moves, so p = ${n(mA)} × ${n(vA)} = ${n(pBefore)} kg·m·s⁻¹ (B is at rest). After: the trolleys move together with mass ${n(mA)} + ${n(mB[r])} = ${n(mA + mB[r])} kg, so p = ${n(mA + mB[r])} × ${f(after[r], 2)} = ${n(pAfter, 3)} kg·m·s⁻¹. The difference is ${n(((pBefore - pAfter) / pBefore) * 100, 1)}%, small enough to be friction and measurement error.`,
      memo: [
        { code: 'SF', marks: 1, text: `p = ${n(mA)} × ${n(vA)}` },
        { code: 'A', marks: 1, text: `${n(pBefore)} kg·m·s⁻¹` },
        { code: 'A', marks: 1, text: `${n(pAfter, 3)} kg·m·s⁻¹` },
        { code: 'C', marks: 1, text: 'yes: equal within experimental error' },
        { code: 'R', marks: 1, text: 'friction (an external force)' },
      ],
    },
  )
}

// --- Vertical projectile motion: g from the time to fall
{
  const hs = [0.5, 1.0, 1.5, 2.0]
  const ts = hs.map((y) => Math.round(Math.sqrt((2 * y) / g) * 100) / 100)
  const t2 = ts.map((t) => t * t)
  const grad = (hs[3] - hs[0]) / (t2[3] - t2[0])
  investigation(
    'phys-vertical-projectile',
    12,
    'psi-12-projectile-g',
    `In an investigation to determine the gravitational acceleration, a steel ball is dropped from rest from different heights and the time it takes to reach the floor is measured with an electronic timer.\n${table('RESULTS', ['Height h (m)', 'Time t (s)', 't² (s²)'], hs.map((y, i) => [f(y, 1), f(ts[i], 2), i === 1 ? '?' : f(t2[i], 3)]))}`,
    {
      marks: 4,
      prompt: 'Name the independent variable, the dependent variable and ONE controlled variable. Why is a steel ball used rather than a table-tennis ball?',
      answer: 'Independent: the height from which the ball is dropped. Dependent: the time to reach the floor. Controlled: the same ball (mass, size), or dropped from rest each time. A steel ball is dense, so air resistance is negligible compared with its weight and the motion is close to free fall.',
      explanation: 'The height is chosen by the learners (independent); the time is measured (dependent). The equation Δy = vᵢΔt + ½gΔt² only holds for free fall, where gravity is the only force; a light table-tennis ball is slowed noticeably by air resistance.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: height' },
        { code: 'A', marks: 1, text: 'dependent: time' },
        { code: 'A', marks: 1, text: 'controlled: same ball / released from rest' },
        { code: 'R', marks: 1, text: 'air resistance negligible: free fall' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the missing value of t². The graph of h against t² is a straight line through the origin. Use the first and last rows of the table to calculate its gradient, and hence the gravitational acceleration.',
      answer: `t² = ${f(t2[1], 3)} s². Gradient = ${n(grad, 2)} m·s⁻²; g = 2 × gradient = ${n(2 * grad, 2)} m·s⁻².`,
      explanation: `${f(ts[1], 2)}² = ${f(t2[1], 3)} s². From rest, Δy = ½gΔt², so h = (½g)t²: a graph of h against t² is a straight line through the origin with gradient ½g. Gradient = (${f(hs[3], 1)} − ${f(hs[0], 1)}) ÷ (${f(t2[3], 3)} − ${f(t2[0], 3)}) = ${n(grad, 2)} m·s⁻², so g = 2 × ${n(grad, 2)} = ${n(2 * grad, 2)} m·s⁻², close to the accepted 9,8 m·s⁻².`,
      memo: [
        { code: 'A', marks: 1, text: `t² = ${f(t2[1], 3)} s²` },
        { code: 'M', marks: 1, text: 'gradient = Δh ÷ Δ(t²)' },
        { code: 'A', marks: 1, text: `${n(grad, 2)} m·s⁻²` },
        { code: 'M', marks: 1, text: 'gradient = ½g' },
        { code: 'CA', marks: 1, text: `g = ${n(2 * grad, 2)} m·s⁻²` },
      ],
    },
  )
}

// --- Work, energy and power: the work-energy theorem
{
  const m = 0.5
  const F = 2.0
  const ds = [0.2, 0.4, 0.6, 0.8]
  const vs = ds.map((d) => Math.round(Math.sqrt((2 * F * d) / m) * 100) / 100)
  const r = 2
  const W = F * ds[r]
  const dEk = 0.5 * m * vs[r] ** 2
  investigation(
    'phys-work-energy-power',
    12,
    'psi-12-work-energy-theorem',
    `In an investigation, a trolley of mass ${n(m)} kg starts from rest on a frictionless horizontal track and is pulled by a constant net force of ${n(F)} N. Its speed is measured after it has moved different distances.\n${table('RESULTS', ['Distance (m)', 'Speed (m·s⁻¹)'], ds.map((d, i) => [f(d, 1), f(vs[i], 2)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and the dependent variable, and formulate a hypothesis about the net work done on the trolley.',
      answer: 'Independent: the distance moved (and hence the net work done). Dependent: the speed (kinetic energy) of the trolley. Hypothesis: the net work done on the trolley is equal to the change in its kinetic energy.',
      explanation: 'A hypothesis is a testable prediction relating the variables. Here the prediction is the work-energy theorem itself: W_net = ΔEk.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: distance / net work' },
        { code: 'A', marks: 1, text: 'dependent: speed / kinetic energy' },
        { code: 'A', marks: 1, text: 'hypothesis relating W_net and ΔEk' },
      ],
    },
    {
      marks: 5,
      prompt: `For the distance of ${f(ds[r], 1)} m, calculate the net work done on the trolley and its change in kinetic energy. What conclusion can be drawn? What graph of the results would be a straight line through the origin?`,
      answer: `W_net = ${n(W, 2)} J; ΔEk = ${n(dEk, 2)} J. Conclusion: the net work done on the trolley equals its change in kinetic energy. A graph of v² against distance (or ΔEk against W_net) is a straight line through the origin.`,
      explanation: `W_net = FΔx cos θ = ${n(F)} × ${f(ds[r], 1)} × cos 0° = ${n(W, 2)} J. ΔEk = ½mv_f² − ½mv_i² = ½(${n(m)})(${f(vs[r], 2)})² − 0 = ${n(dEk, 2)} J. These agree within rounding. Since Fx = ½mv², v² = (2F/m)x, so v² is directly proportional to the distance.`,
      memo: [
        { code: 'SF', marks: 1, text: `W = ${n(F)} × ${f(ds[r], 1)} × cos 0°` },
        { code: 'A', marks: 1, text: `${n(W, 2)} J` },
        { code: 'A', marks: 1, text: `ΔEk = ${n(dEk, 2)} J` },
        { code: 'C', marks: 1, text: 'W_net = ΔEk' },
        { code: 'A', marks: 1, text: 'v² against distance' },
      ],
    },
  )
}

// --- Doppler effect
{
  const fs = 500
  const vSound = 340
  const speeds = [0, 10, 20, 30]
  const heard = speeds.map((v) => Math.round((fs * vSound) / (vSound - v)))
  const unknownF = 540
  const vUnknown = vSound - (fs * vSound) / unknownF
  investigation(
    'phys-doppler-effect',
    12,
    'psi-12-doppler-speed',
    `In an investigation, a buzzer emitting a sound of frequency ${fs} Hz is mounted on a remote-controlled car. The car moves at different constant speeds TOWARDS a stationary microphone, which records the frequency it detects. Take the speed of sound in air as ${vSound} m·s⁻¹.\n${table('RESULTS', ['Speed of the car (m·s⁻¹)', 'Frequency detected (Hz)'], speeds.map((v, i) => [`${v}`, `${heard[i]}`]))}`,
    {
      marks: 4,
      prompt: 'Write down the investigative question, the dependent variable and TWO controlled variables for this investigation.',
      answer: 'Investigative question: How does the speed of a sound source moving towards a listener affect the frequency the listener detects? Dependent variable: the detected frequency. Controlled variables: the frequency of the buzzer; the direction of motion (towards the microphone); the air temperature (speed of sound).',
      explanation: 'Only the speed of the source is changed. The buzzer\'s own frequency and the speed of sound must stay the same, or the detected frequency would change for other reasons.',
      memo: [
        { code: 'A', marks: 1, text: 'question naming speed of source and detected frequency' },
        { code: 'A', marks: 1, text: 'dependent: detected frequency' },
        { code: 'A', marks: 2, text: 'two of: buzzer frequency, direction of motion, air temperature' },
      ],
    },
    {
      marks: 5,
      prompt: `Describe the trend in the results. In a further run the microphone detects ${unknownF} Hz. Calculate the speed of the car in that run.`,
      answer: `The faster the source moves towards the listener, the higher the detected frequency. Speed = ${n(vUnknown, 1)} m·s⁻¹.`,
      explanation: `f_L = [v/(v − v_s)] f_s for a source moving towards a stationary listener. ${unknownF} = [${vSound}/(${vSound} − v_s)] × ${fs}, so ${vSound} − v_s = ${vSound} × ${fs} ÷ ${unknownF} = ${n((vSound * fs) / unknownF, 1)} and v_s = ${n(vUnknown, 1)} m·s⁻¹. This lies between the 20 and 30 m·s⁻¹ runs, as the table predicts.`,
      memo: [
        { code: 'A', marks: 1, text: 'higher speed towards: higher frequency' },
        { code: 'SF', marks: 1, text: 'f_L = v/(v − v_s) × f_s' },
        { code: 'SF', marks: 1, text: `${unknownF} = ${vSound}/(${vSound} − v_s) × ${fs}` },
        { code: 'M', marks: 1, text: 'solving for v_s' },
        { code: 'A', marks: 1, text: `${n(vUnknown, 1)} m·s⁻¹` },
      ],
    },
  )
}

// --- Electrostatics, Grade 12: force against distance
{
  const Q = 2.0e-7
  const rs = [0.1, 0.2, 0.3, 0.4]
  const Fs = rs.map((r) => (k * Q * Q) / (r * r))
  investigation(
    'phys-electrostatics',
    12,
    'psi-12-coulomb-distance',
    `In an investigation, two small identical spheres carry equal charges. The electrostatic force between them is measured for different distances between their centres.\n${table('RESULTS', ['Distance r (m)', 'Force F (N)'], rs.map((r, i) => [f(r, 1), sci(Fs[i], 2)]))}`,
    {
      marks: 4,
      prompt: 'This investigation tests Coulomb\'s law. Name the independent and dependent variables, ONE controlled variable, and formulate a hypothesis.',
      answer: 'Independent: the distance between the spheres. Dependent: the electrostatic force. Controlled: the charge on each sphere. Hypothesis: the electrostatic force is inversely proportional to the square of the distance between the charges.',
      explanation: 'Coulomb\'s law has two variables on its right-hand side; to test the effect of distance, the charges must be kept constant.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: distance' },
        { code: 'A', marks: 1, text: 'dependent: force' },
        { code: 'A', marks: 1, text: 'controlled: charges' },
        { code: 'A', marks: 1, text: 'F ∝ 1/r²' },
      ],
    },
    {
      marks: 6,
      prompt: 'Compare the force at 0,1 m and at 0,2 m: what happens to the force when the distance is doubled? Which graph of the results would be a straight line through the origin? Use Coulomb\'s law and one row of the table to calculate the charge on each sphere.',
      answer: `Doubling the distance makes the force a QUARTER as large (${sci(Fs[0], 2)} N to ${sci(Fs[1], 2)} N). A graph of F against 1/r² is a straight line through the origin. Q = ${sci(Q, 1)} C.`,
      explanation: `${sci(Fs[0], 2)} ÷ ${sci(Fs[1], 2)} = ${n(Fs[0] / Fs[1], 0)}, so F ∝ 1/r²: F against 1/r² is a straight line through the origin with gradient kQ². From the first row: F = kQ²/r², so Q² = Fr²/k = (${sci(Fs[0], 2)})(0,1)² ÷ (9,0 × 10⁹) = ${sci(Q * Q, 1)} and Q = ${sci(Q, 1)} C.`,
      memo: [
        { code: 'A', marks: 1, text: 'force becomes a quarter' },
        { code: 'C', marks: 1, text: 'F ∝ 1/r²' },
        { code: 'A', marks: 1, text: 'F against 1/r²' },
        { code: 'SF', marks: 1, text: `${sci(Fs[0], 2)} = (9,0 × 10⁹)Q²/(0,1)²` },
        { code: 'M', marks: 1, text: 'solving for Q' },
        { code: 'A', marks: 1, text: `${sci(Q, 1)} C` },
      ],
    },
  )
}

// --- Electric circuits, Grade 12: emf and internal resistance
{
  const emf = 6.0
  const r = 0.8
  const Is = [0.5, 1.0, 1.5, 2.0, 2.5]
  const Vs = Is.map((i) => emf - i * r)
  investigation(
    'phys-electric-circuits',
    12,
    'psi-12-internal-resistance',
    `In an investigation to determine the emf and internal resistance of a battery, learners connect it to a rheostat, an ammeter and a high-resistance voltmeter across the battery. They change the resistance of the rheostat and record the readings.\n${table('RESULTS', ['Current I (A)', 'Potential difference V (V)'], Is.map((i, j) => [f(i, 1), f(Vs[j], 1)]))}`,
    {
      marks: 4,
      prompt: 'Name the independent and dependent variables and ONE controlled variable. Why should the switch be closed only while a reading is taken?',
      answer: 'Independent: the current (changed with the rheostat). Dependent: the potential difference across the battery (terminal potential difference). Controlled: the same battery / the temperature. Leaving current flowing heats the battery and runs it down, which would change its emf and internal resistance during the experiment.',
      explanation: 'The rheostat changes the external resistance and so the current; the voltmeter reads the terminal potential difference. Keeping the battery cool and fresh keeps ε and r constant, which the method assumes.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: current / external resistance' },
        { code: 'A', marks: 1, text: 'dependent: terminal potential difference' },
        { code: 'A', marks: 1, text: 'controlled: same battery / temperature' },
        { code: 'R', marks: 1, text: 'prevents heating / the battery running down' },
      ],
    },
    {
      marks: 6,
      prompt: 'The graph of V against I is a straight line. Use it to determine the emf of the battery and its internal resistance. Explain, in terms of the internal resistance, why the reading on the voltmeter decreases as the current increases.',
      answer: `emf = ${n(emf, 1)} V (the y-intercept); r = ${n(r, 1)} Ω (from −gradient). V = ε − Ir: a larger current means more "lost volts" (Ir) across the internal resistance, so less potential difference is left across the terminals.`,
      explanation: `V = ε − Ir is a straight line with gradient −r and y-intercept ε. Gradient = (${f(Vs[4], 1)} − ${f(Vs[0], 1)}) ÷ (${f(Is[4], 1)} − ${f(Is[0], 1)}) = ${n((Vs[4] - Vs[0]) / (Is[4] - Is[0]), 1)} V·A⁻¹, so r = ${n(r, 1)} Ω. Extending the line to I = 0: V = ${f(Vs[0], 1)} + ${f(Is[0], 1)} × ${n(r, 1)} = ${n(emf, 1)} V.`,
      memo: [
        { code: 'A', marks: 1, text: 'emf is the y-intercept' },
        { code: 'A', marks: 1, text: `${n(emf, 1)} V` },
        { code: 'M', marks: 1, text: 'gradient = −r' },
        { code: 'A', marks: 1, text: `r = ${n(r, 1)} Ω` },
        { code: 'R', marks: 2, text: 'larger I, larger Ir (lost volts), smaller V across the terminals' },
      ],
    },
  )
}

// --- Electrodynamics: generator emf against speed of rotation
{
  const fr = [5, 10, 15, 20]
  const per = 0.24
  const Vmax = fr.map((x) => x * per)
  investigation(
    'phys-electrodynamics',
    12,
    'psi-12-generator-speed',
    `In an investigation, a small AC generator is turned at different constant rates and the maximum emf it produces is recorded.\n${table('RESULTS', ['Frequency of rotation (Hz)', 'Maximum emf (V)'], fr.map((x, i) => [`${x}`, f(Vmax[i], 1)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent variable and TWO controlled variables for this investigation.',
      answer: 'Independent: the frequency (speed) of rotation of the coil. Controlled: the number of turns on the coil; the strength of the magnetic field (the same magnets); the area of the coil.',
      explanation: 'By Faraday\'s law the induced emf depends on the number of turns and on how fast the flux changes; flux depends on the field strength and the area. Only the rate of rotation may change.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: frequency / speed of rotation' },
        { code: 'A', marks: 2, text: 'controlled: number of turns, magnetic field, area (any two)' },
      ],
    },
    {
      marks: 5,
      prompt: 'Describe the relationship between the maximum emf and the frequency of rotation, and use Faraday\'s law to explain it. Predict the maximum emf at 25 Hz, and calculate the rms value of that emf.',
      answer: `The maximum emf is directly proportional to the frequency of rotation. Faster rotation changes the magnetic flux linkage more quickly, and the induced emf equals the rate of change of flux linkage. At 25 Hz: ${n(25 * per, 1)} V; V_rms = ${n((25 * per) / Math.SQRT2, 2)} V.`,
      explanation: `Each row has emf ÷ frequency = ${n(per, 2)} V·Hz⁻¹, so doubling the frequency doubles the emf. ε = −NΔΦ/Δt: turning faster makes Δt smaller for the same change in flux. 25 × ${n(per, 2)} = ${n(25 * per, 1)} V; V_rms = V_max/√2 = ${n(25 * per, 1)} ÷ 1,414 = ${n((25 * per) / Math.SQRT2, 2)} V.`,
      memo: [
        { code: 'A', marks: 1, text: 'directly proportional' },
        { code: 'R', marks: 1, text: 'faster rate of change of flux (Faraday\'s law)' },
        { code: 'A', marks: 1, text: `${n(25 * per, 1)} V` },
        { code: 'SF', marks: 1, text: `V_rms = ${n(25 * per, 1)}/√2` },
        { code: 'CA', marks: 1, text: `${n((25 * per) / Math.SQRT2, 2)} V` },
      ],
    },
  )
}

// --- Photoelectric effect: kinetic energy against frequency
{
  const W0 = 3.68e-19
  const fsx = [6.0e14, 7.0e14, 8.0e14, 9.0e14]
  const Ek = fsx.map((x) => h * x - W0)
  const f0 = W0 / h
  investigation(
    'phys-em-radiation',
    12,
    'psi-12-photoelectric-graph',
    `In an investigation, light of different frequencies is shone on a clean metal surface in a photocell, and the maximum kinetic energy of the emitted electrons is determined.\n${table('RESULTS', ['Frequency (× 10¹⁴ Hz)', 'Maximum kinetic energy (× 10⁻¹⁹ J)'], fsx.map((x, i) => [n(x / 1e14, 1), f(Ek[i] / 1e-19, 2)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and dependent variables and ONE controlled variable for this investigation.',
      answer: 'Independent: the frequency of the light. Dependent: the maximum kinetic energy of the photo-electrons. Controlled: the metal used (its work function).',
      explanation: 'The work function belongs to the metal, so the same metal must be used throughout. (The intensity of the light does not affect the kinetic energy, only the number of electrons.)',
      memo: [
        { code: 'A', marks: 1, text: 'independent: frequency' },
        { code: 'A', marks: 1, text: 'dependent: maximum kinetic energy' },
        { code: 'A', marks: 1, text: 'controlled: the same metal' },
      ],
    },
    {
      marks: 6,
      prompt: 'A graph of maximum kinetic energy against frequency is a straight line. Calculate its gradient, and state what the gradient represents. Determine the work function of the metal and its threshold frequency.',
      answer: `Gradient = ${sci(h, 2)} J·s, which is Planck's constant. Work function = ${sci(W0, 2)} J; threshold frequency = ${sci(f0, 2)} Hz.`,
      explanation: `Gradient = ΔE ÷ Δf = (${f(Ek[3] / 1e-19, 2)} − ${f(Ek[0] / 1e-19, 2)}) × 10⁻¹⁹ ÷ (3,0 × 10¹⁴) = ${sci(h, 2)} J·s. From E = W₀ + Ek(max): Ek(max) = hf − W₀, a straight line with gradient h and y-intercept −W₀. W₀ = hf − Ek = (${sci(h, 2)})(${sci(fsx[0], 1)}) − ${f(Ek[0] / 1e-19, 2)} × 10⁻¹⁹ = ${sci(W0, 2)} J. f₀ = W₀/h = ${sci(f0, 2)} Hz, where the line cuts the frequency axis.`,
      memo: [
        { code: 'M', marks: 1, text: 'gradient = ΔEk ÷ Δf' },
        { code: 'A', marks: 1, text: `${sci(h, 2)} J·s` },
        { code: 'A', marks: 1, text: "Planck's constant" },
        { code: 'SF', marks: 1, text: 'W₀ = hf − Ek(max)' },
        { code: 'A', marks: 1, text: `${sci(W0, 2)} J` },
        { code: 'CA', marks: 1, text: `f₀ = ${sci(f0, 2)} Hz` },
      ],
    },
  )
}

// --- Chemical equilibrium: Kc against temperature
{
  const Ts = [300, 325, 350]
  const Kc = [4.6e-3, 2.1e-2, 8.0e-2]
  investigation(
    'phys-chemical-equilibrium',
    12,
    'psi-12-kc-temperature',
    `Learners investigate the equilibrium N₂O₄(g) ⇌ 2NO₂(g) in a sealed flask. N₂O₄ is colourless and NO₂ is dark brown. The equilibrium constant is determined at three temperatures.\n${table('RESULTS', ['Temperature (K)', 'Kc'], Ts.map((T, i) => [`${T}`, sci(Kc[i], 1)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent variable and the dependent variable, and give a reason why the flask must be sealed.',
      answer: 'Independent: the temperature. Dependent: the equilibrium constant (Kc). The flask must be sealed because chemical equilibrium can only be established in a CLOSED system -- no gas may escape.',
      explanation: 'Kc is a constant only at a given temperature; temperature is the one variable that changes its value.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: temperature' },
        { code: 'A', marks: 1, text: 'dependent: Kc' },
        { code: 'R', marks: 1, text: 'equilibrium needs a closed system' },
      ],
    },
    {
      marks: 5,
      prompt: 'Is the forward reaction exothermic or endothermic? Explain your answer using the results and Le Chatelier\'s principle. How will the colour of the gas in the flask change when it is heated?',
      answer: 'Endothermic. Kc increases as the temperature increases, so heating favours the forward reaction: by Le Chatelier\'s principle a rise in temperature favours the endothermic reaction (it absorbs the added heat). More NO₂ forms, so the gas becomes darker brown.',
      explanation: `Kc = [NO₂]²/[N₂O₄]. It rises from ${sci(Kc[0], 1)} to ${sci(Kc[2], 1)}, so at higher temperature there are more products at equilibrium. The system opposes the increase in temperature by favouring the reaction that absorbs heat -- here the forward reaction, so ΔH > 0.`,
      memo: [
        { code: 'A', marks: 1, text: 'endothermic' },
        { code: 'A', marks: 1, text: 'Kc increases with temperature: more products' },
        { code: 'R', marks: 1, text: 'a temperature increase favours the endothermic reaction' },
        { code: 'A', marks: 1, text: 'more NO₂ forms' },
        { code: 'A', marks: 1, text: 'darker brown' },
      ],
    },
  )
}

// --- Electrochemistry: cell potential with different metals
{
  const cu = 0.34
  const metals: [string, string, number][] = [
    ['Zinc', 'Zn', -0.76],
    ['Iron', 'Fe', -0.44],
    ['Nickel', 'Ni', -0.25],
    ['Lead', 'Pb', -0.13],
  ]
  const emfs = metals.map(([, , e]) => cu - e)
  investigation(
    'phys-electrochemistry',
    12,
    'psi-12-cell-potential-metals',
    `In an investigation, learners build galvanic cells, each with a Cu | Cu²⁺ half-cell joined to a different metal in a solution of its own ions, all at standard conditions. They measure the initial emf of each cell.\n${table('RESULTS', ['Metal half-cell', 'emf of the cell (V)'], metals.map(([name, sym], i) => [`${name} (${sym}²⁺/${sym})`, f(emfs[i], 2)]))}`,
    {
      marks: 4,
      prompt: 'Name the independent variable and the dependent variable. State the standard conditions that must be kept constant, and the function of the salt bridge.',
      answer: 'Independent: the metal (half-cell) used with copper. Dependent: the emf of the cell. Standard conditions: a temperature of 25 °C (298 K) and solution concentrations of 1 mol·dm⁻³ (pressure 101,3 kPa for gases). The salt bridge completes the circuit and keeps the solutions electrically neutral by allowing ions to move.',
      explanation: 'Cell potentials depend on concentration and temperature, so these are the controlled variables; changing the metal is the only difference between the cells.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: the metal' },
        { code: 'A', marks: 1, text: 'dependent: emf' },
        { code: 'A', marks: 1, text: '25 °C and 1 mol·dm⁻³' },
        { code: 'A', marks: 1, text: 'salt bridge: completes the circuit / maintains neutrality' },
      ],
    },
    {
      marks: 5,
      prompt: 'Which metal is the strongest reducing agent? Give a reason based on the results. Use the results to calculate the emf of a cell made from the zinc and nickel half-cells, and state which half-cell is the anode.',
      answer: `Zinc: its cell has the largest emf, so zinc loses electrons most readily. Zn–Ni cell: ${n(metals[2][2] - metals[0][2], 2)} V, with zinc as the anode.`,
      explanation: `In each cell copper is the cathode and the other metal is oxidised at the anode; the bigger the emf, the more strongly that metal pushes electrons out. E°(metal) = 0,34 − emf, giving Zn ${n(metals[0][2], 2)} V and Ni ${n(metals[2][2], 2)} V. E°cell = E°cathode − E°anode = ${n(metals[2][2], 2)} − (${n(metals[0][2], 2)}) = ${n(metals[2][2] - metals[0][2], 2)} V. Zinc, the stronger reducing agent, is oxidised: the anode.`,
      memo: [
        { code: 'A', marks: 1, text: 'zinc' },
        { code: 'R', marks: 1, text: 'largest emf with copper' },
        { code: 'SF', marks: 1, text: 'E°cell = E°cathode − E°anode' },
        { code: 'A', marks: 1, text: `${n(metals[2][2] - metals[0][2], 2)} V` },
        { code: 'A', marks: 1, text: 'zinc is the anode' },
      ],
    },
  )
}

// --- Acids and bases: a titration
{
  const cNaOH = 0.1
  const vAcid = 25
  const trials = [25.3, 24.6, 24.4, 24.5]
  const avg = (trials[1] + trials[2] + trials[3]) / 3
  const nNaOH = cNaOH * (avg / 1000)
  const nAcid = nNaOH / 2
  const cAcid = nAcid / (vAcid / 1000)
  investigation(
    'phys-acids-bases',
    12,
    'psi-12-titration-oxalic',
    `In an investigation, ${vAcid},0 cm³ of an oxalic acid solution (H₂C₂O₄) of unknown concentration is titrated with sodium hydroxide of concentration ${n(cNaOH, 1)} mol·dm⁻³, using phenolphthalein. The balanced equation is H₂C₂O₄ + 2NaOH → Na₂C₂O₄ + 2H₂O.\n${table('RESULTS: VOLUME OF NaOH USED', ['Titration', 'Rough', '1', '2', '3'], [['Volume (cm³)', ...trials.map((v) => f(v, 1))]])}`,
    {
      marks: 4,
      prompt: 'Give a reason why phenolphthalein is a suitable indicator for this titration. Why is the rough titration not used in the calculation? State TWO precautions for an accurate result.',
      answer: 'Oxalic acid is a weak acid and NaOH a strong base, so the solution at the endpoint is slightly basic; phenolphthalein changes colour in the basic range (pH about 8 to 10). The rough titration only locates the endpoint approximately (it overshoots). Precautions: rinse the burette with the NaOH solution; read the burette at eye level at the bottom of the meniscus; swirl the flask; add the base drop by drop near the endpoint.',
      explanation: 'The salt of a weak acid and a strong base hydrolyses to give a basic solution, so the indicator must change colour above pH 7. Only concordant readings (within about 0,1 cm³) are averaged.',
      memo: [
        { code: 'R', marks: 1, text: 'weak acid + strong base: endpoint in the basic range' },
        { code: 'R', marks: 1, text: 'rough titration overshoots / is only approximate' },
        { code: 'A', marks: 2, text: 'two valid precautions' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the average volume of NaOH used, and the concentration of the oxalic acid solution.',
      answer: `Average ${n(avg, 2)} cm³; c(H₂C₂O₄) = ${n(cAcid, 3)} mol·dm⁻³.`,
      explanation: `Average of the three accurate titrations: (${trials.slice(1).map((v) => f(v, 1)).join(' + ')}) ÷ 3 = ${n(avg, 2)} cm³. n(NaOH) = cV = ${n(cNaOH, 1)} × ${n(avg / 1000, 5)} = ${sci(nNaOH, 3)} mol. The mole ratio acid : base is 1 : 2, so n(H₂C₂O₄) = ${sci(nAcid, 3)} mol. c = n/V = ${sci(nAcid, 3)} ÷ 0,025 = ${n(cAcid, 3)} mol·dm⁻³.`,
      memo: [
        { code: 'A', marks: 1, text: `average ${n(avg, 2)} cm³` },
        { code: 'SF', marks: 1, text: `n(NaOH) = ${n(cNaOH, 1)} × ${n(avg / 1000, 5)}` },
        { code: 'M', marks: 1, text: 'mole ratio 1 : 2' },
        { code: 'SF', marks: 1, text: 'c = n/V with V = 0,025 dm³' },
        { code: 'CA', marks: 1, text: `${n(cAcid, 3)} mol·dm⁻³` },
      ],
    },
  )
}

// ================================================================ GRADE 11

// --- Newton's second law: acceleration against net force (Grade 11)
{
  const m = 0.8
  const Fs = [0.4, 0.8, 1.2, 1.6]
  const as = Fs.map((F) => F / m)
  investigation(
    'phys-newtons-laws',
    11,
    'psi-11-newton2-force',
    `In an investigation, a trolley on a frictionless horizontal track is pulled by different constant net forces, and its acceleration is measured with a ticker timer.\n${table('RESULTS', ['Net force (N)', 'Acceleration (m·s⁻²)'], Fs.map((F, i) => [f(F, 1), f(as[i], 2)]))}`,
    {
      marks: 4,
      prompt: 'Write down an investigative question and name the independent, dependent and controlled variables.',
      answer: 'Investigative question: What is the relationship between the net force acting on an object and its acceleration? Independent: the net force. Dependent: the acceleration. Controlled: the mass of the trolley.',
      explanation: 'Newton\'s second law relates three quantities (Fnet = ma); to see how acceleration depends on force, the third quantity, mass, is kept constant.',
      memo: [
        { code: 'A', marks: 1, text: 'investigative question' },
        { code: 'A', marks: 1, text: 'independent: net force' },
        { code: 'A', marks: 1, text: 'dependent: acceleration' },
        { code: 'A', marks: 1, text: 'controlled: mass' },
      ],
    },
    {
      marks: 5,
      prompt: 'Describe the relationship shown by the results and write a conclusion. A graph of acceleration against net force is a straight line through the origin; calculate its gradient and use it to determine the mass of the trolley.',
      answer: `The acceleration is directly proportional to the net force (when the mass is constant). Gradient = ${n(1 / m, 2)} kg⁻¹; mass = ${n(m, 1)} kg.`,
      explanation: `Doubling the force from ${f(Fs[0], 1)} N to ${f(Fs[1], 1)} N doubles the acceleration. Gradient = Δa ÷ ΔF = (${f(as[3], 2)} − ${f(as[0], 2)}) ÷ (${f(Fs[3], 1)} − ${f(Fs[0], 1)}) = ${n(1 / m, 2)} kg⁻¹. Since a = F/m, the gradient is 1/m, so m = 1 ÷ ${n(1 / m, 2)} = ${n(m, 1)} kg.`,
      memo: [
        { code: 'A', marks: 1, text: 'a directly proportional to Fnet' },
        { code: 'C', marks: 1, text: 'conclusion with "mass constant"' },
        { code: 'M', marks: 1, text: 'gradient = Δa ÷ ΔF' },
        { code: 'A', marks: 1, text: `${n(1 / m, 2)} kg⁻¹` },
        { code: 'CA', marks: 1, text: `m = ${n(m, 1)} kg` },
      ],
    },
  )
}

// --- Newton's second law: acceleration against mass (Grade 12)
{
  const F = 2.0
  const ms = [0.5, 1.0, 1.5, 2.0]
  const as = ms.map((m) => F / m)
  investigation(
    'phys-newtons-laws',
    12,
    'psi-12-newton2-mass',
    `In an investigation, a constant net force pulls a trolley along a frictionless track. Bricks are added to the trolley to change its mass, and the acceleration is measured.\n${table('RESULTS', ['Mass (kg)', 'Acceleration (m·s⁻²)', '1/mass (kg⁻¹)'], ms.map((m, i) => [f(m, 1), f(as[i], 2), i === 2 ? '?' : f(1 / m, 2)]))}`,
    {
      marks: 3,
      prompt: 'This investigation tests how acceleration depends on mass when Fnet = ma applies with a constant net force. Name the independent variable and the controlled variable, and formulate a hypothesis.',
      answer: 'Independent: the mass of the trolley. Controlled: the net force. Hypothesis: the acceleration of an object is inversely proportional to its mass when the net force is constant.',
      explanation: 'The hypothesis is a prediction that the results can confirm or reject: here, that doubling the mass halves the acceleration.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: mass' },
        { code: 'A', marks: 1, text: 'controlled: net force' },
        { code: 'A', marks: 1, text: 'a inversely proportional to m' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the missing value of 1/mass. Explain why a graph of acceleration against 1/mass is drawn rather than acceleration against mass. Use Fnet = ma and the results to determine the net force on the trolley.',
      answer: `1/m = ${f(1 / ms[2], 2)} kg⁻¹. a against m is a curve (a hyperbola), which cannot show inverse proportion clearly; a against 1/m is a straight line through the origin, which can. Net force = ${n(F, 1)} N.`,
      explanation: `1 ÷ ${f(ms[2], 1)} = ${f(1 / ms[2], 2)} kg⁻¹. Since a = F × (1/m), a graph of a against 1/m is a straight line through the origin with gradient F. Any row gives F = ma: ${f(ms[0], 1)} × ${f(as[0], 2)} = ${n(F, 1)} N.`,
      memo: [
        { code: 'A', marks: 1, text: `${f(1 / ms[2], 2)} kg⁻¹` },
        { code: 'R', marks: 1, text: 'a against m is a curve' },
        { code: 'R', marks: 1, text: 'a against 1/m is a straight line: inverse proportion' },
        { code: 'SF', marks: 1, text: 'F = ma, from a row of the table' },
        { code: 'A', marks: 1, text: `${n(F, 1)} N` },
      ],
    },
  )
}

// --- Vectors in two dimensions: three forces in equilibrium
{
  const F1 = 3.0
  const F2 = 4.0
  const angles = [60, 90, 120]
  const F3 = angles.map((a) => Math.sqrt(F1 ** 2 + F2 ** 2 + 2 * F1 * F2 * Math.cos((a * Math.PI) / 180)))
  investigation(
    'phys-vectors-2d',
    11,
    'psi-11-force-board',
    `In an investigation using a force board, three spring balances pull on a small ring. Two of the forces are kept at ${n(F1, 1)} N and ${n(F2, 1)} N, and the angle between them is changed. The third balance is adjusted until the ring is in equilibrium, and its reading is recorded.\n${table('RESULTS', ['Angle between the 3,0 N and 4,0 N forces', 'Reading on the third balance (N)'], angles.map((a, i) => [`${a}°`, f(F3[i], 1)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and dependent variables. How is the reading on the third balance related to the resultant of the other two forces?',
      answer: 'Independent: the angle between the two forces. Dependent: the reading on the third balance. The third force is the EQUILIBRANT: equal in magnitude and opposite in direction to the resultant of the other two forces.',
      explanation: 'The ring is in equilibrium, so the three forces add up to zero; the third must cancel the resultant of the first two exactly.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: angle' },
        { code: 'A', marks: 1, text: 'dependent: third reading' },
        { code: 'A', marks: 1, text: 'equal and opposite to the resultant (equilibrant)' },
      ],
    },
    {
      marks: 5,
      prompt: 'Describe how the reading on the third balance changes as the angle increases, and explain why. Use the 90° result to check the reading by calculation, and determine the angle the equilibrant makes with the 4,0 N force.',
      answer: `The reading decreases as the angle increases, because the two forces point less in the same direction and partly cancel. At 90°: √(3,0² + 4,0²) = ${n(F3[1], 1)} N, as measured. The equilibrant is at ${n(180 - (Math.atan(F1 / F2) * 180) / Math.PI, 1)}° to the 4,0 N force (opposite the resultant, which is at ${n((Math.atan(F1 / F2) * 180) / Math.PI, 1)}° to it).`,
      explanation: `At 90° the forces are perpendicular, so the resultant is √(9 + 16) = 5,0 N. tan θ = 3,0/4,0 gives θ = ${n((Math.atan(F1 / F2) * 180) / Math.PI, 1)}° between the resultant and the 4,0 N force; the equilibrant points the opposite way, ${n(180 - (Math.atan(F1 / F2) * 180) / Math.PI, 1)}° from it. The readings fall from ${f(F3[0], 1)} N to ${f(F3[2], 1)} N as the angle widens.`,
      memo: [
        { code: 'A', marks: 1, text: 'decreases' },
        { code: 'R', marks: 1, text: 'the forces partly cancel at larger angles' },
        { code: 'SF', marks: 1, text: '√(3,0² + 4,0²)' },
        { code: 'A', marks: 1, text: `${n(F3[1], 1)} N` },
        { code: 'A', marks: 1, text: `${n(180 - (Math.atan(F1 / F2) * 180) / Math.PI, 1)}°` },
      ],
    },
  )
}

// --- Geometric optics: Snell's law
{
  const nGlass = 1.5
  const is = [20, 30, 40, 50, 60]
  const rs = is.map((i) => (Math.asin(Math.sin((i * Math.PI) / 180) / nGlass) * 180) / Math.PI)
  const si = is.map((i) => Math.sin((i * Math.PI) / 180))
  const sr = rs.map((r) => Math.sin((Math.round(r * 10) / 10) * Math.PI / 180))
  const grad = (si[4] - si[0]) / (sr[4] - sr[0])
  investigation(
    'phys-geometric-optics',
    11,
    'psi-11-snell-glass',
    `In an investigation, a ray of light passes from air into a rectangular glass block. The angle of incidence is changed and the angle of refraction is measured.\n${table('RESULTS', ['Angle of incidence', 'Angle of refraction', 'sin i', 'sin r'], is.map((i, j) => [`${i}°`, `${n(rs[j], 1)}°`, f(si[j], 2), f(sr[j], 2)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent variable, the dependent variable and ONE controlled variable.',
      answer: 'Independent: the angle of incidence. Dependent: the angle of refraction. Controlled: the type of glass (the same block) / the colour (frequency) of the light.',
      explanation: 'The refractive index depends on the material and on the frequency of the light, so both must stay the same.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: angle of incidence' },
        { code: 'A', marks: 1, text: 'dependent: angle of refraction' },
        { code: 'A', marks: 1, text: 'controlled: same glass / same colour of light' },
      ],
    },
    {
      marks: 5,
      prompt: 'Which graph of the results gives a straight line through the origin? Use the first and last rows to calculate its gradient, and state what the gradient represents. Write a conclusion for the investigation.',
      answer: `sin i against sin r. Gradient = ${n(grad, 2)}, the refractive index of the glass. Conclusion: the ratio sin i/sin r is constant for light passing from air into glass (Snell's law).`,
      explanation: `n₁ sin θ₁ = n₂ sin θ₂ with n(air) = 1 gives sin i = n(glass) × sin r: a straight line through the origin with gradient n(glass). Gradient = (${f(si[4], 2)} − ${f(si[0], 2)}) ÷ (${f(sr[4], 2)} − ${f(sr[0], 2)}) = ${n(grad, 2)}.`,
      memo: [
        { code: 'A', marks: 1, text: 'sin i against sin r' },
        { code: 'M', marks: 1, text: 'gradient = Δ(sin i) ÷ Δ(sin r)' },
        { code: 'A', marks: 1, text: `${n(grad, 2)}` },
        { code: 'A', marks: 1, text: 'the refractive index of the glass' },
        { code: 'C', marks: 1, text: 'sin i/sin r is constant' },
      ],
    },
  )
}

// --- Electrostatics, Grade 11: force against charge
{
  const r = 0.15
  const Q1 = 4.0e-8
  const Q2 = [1, 2, 3, 4].map((x) => x * 1e-8)
  const Fs = Q2.map((q) => (k * Q1 * q) / (r * r))
  investigation(
    'phys-electrostatics-g11',
    11,
    'psi-11-coulomb-charge',
    `In an investigation, two small charged spheres are held ${n(r, 2)} m apart. The charge on sphere A is kept at ${sci(Q1, 1)} C and the charge on sphere B is changed. The electrostatic force between them is measured.\n${table('RESULTS', ['Charge on B (× 10⁻⁸ C)', 'Force (× 10⁻⁴ N)'], Q2.map((q, i) => [n(q / 1e-8, 1), f(Fs[i] / 1e-4, 1)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent variable and TWO controlled variables for this investigation.',
      answer: 'Independent: the charge on sphere B. Controlled: the distance between the spheres; the charge on sphere A.',
      explanation: 'In F = kQ₁Q₂/r² only Q₂ changes; Q₁ and r must be kept the same.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: charge on B' },
        { code: 'A', marks: 2, text: 'controlled: distance; charge on A' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the relationship between the force and the charge on B. Use one row of the table to verify the results with Coulomb\'s law.',
      answer: `The force is directly proportional to the charge on B. For example, Q₂ = 2,0 × 10⁻⁸ C: F = ${sci(Fs[1], 1)} N, as in the table.`,
      explanation: `Doubling the charge on B doubles the force (${f(Fs[0] / 1e-4, 1)} to ${f(Fs[1] / 1e-4, 1)} × 10⁻⁴ N). F = kQ₁Q₂/r² = (9,0 × 10⁹)(${sci(Q1, 1)})(2,0 × 10⁻⁸)/(${n(r, 2)})² = ${sci(Fs[1], 1)} N.`,
      memo: [
        { code: 'A', marks: 1, text: 'directly proportional' },
        { code: 'SF', marks: 1, text: 'F = kQ₁Q₂/r² with values' },
        { code: 'A', marks: 1, text: `${sci(Fs[1], 1)} N` },
        { code: 'C', marks: 1, text: 'agrees with the table' },
      ],
    },
  )
}

// --- Electromagnetism: induced emf against number of turns
{
  const turns = [50, 100, 150, 200]
  const per = 0.012
  const emfs = turns.map((t) => t * per)
  investigation(
    'phys-electromagnetism',
    11,
    'psi-11-induction-turns',
    `In an investigation, a bar magnet is pushed into coils with different numbers of turns, at the same speed each time, and the maximum induced emf is recorded.\n${table('RESULTS', ['Number of turns', 'Maximum induced emf (V)'], turns.map((t, i) => [`${t}`, f(emfs[i], 1)]))}`,
    {
      marks: 4,
      prompt: 'Name the dependent variable and TWO controlled variables. Why must the magnet be moved at the same speed each time?',
      answer: 'Dependent: the induced emf. Controlled: the speed of the magnet; the strength of the magnet; the cross-sectional area of the coil. The speed determines the rate of change of magnetic flux, which also affects the emf; it must stay the same so that only the number of turns changes.',
      explanation: 'Faraday\'s law: ε = −NΔΦ/Δt. Both N and ΔΦ/Δt affect the emf, so a fair test changes only N.',
      memo: [
        { code: 'A', marks: 1, text: 'dependent: induced emf' },
        { code: 'A', marks: 2, text: 'two controlled variables' },
        { code: 'R', marks: 1, text: 'speed affects the rate of change of flux' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the relationship shown by the results, and state Faraday\'s law of electromagnetic induction. Predict the emf for a coil of 250 turns.',
      answer: `The induced emf is directly proportional to the number of turns. Faraday's law: the emf induced is directly proportional to the rate of change of magnetic flux (linkage). 250 turns: ${n(250 * per, 1)} V.`,
      explanation: `emf ÷ turns = ${n(per, 3)} V per turn in every row; 250 × ${n(per, 3)} = ${n(250 * per, 1)} V.`,
      memo: [
        { code: 'A', marks: 1, text: 'directly proportional' },
        { code: 'A', marks: 2, text: "Faraday's law" },
        { code: 'A', marks: 1, text: `${n(250 * per, 1)} V` },
      ],
    },
  )
}

// --- Electric circuits, Grade 11: Ohm's law, a resistor and a bulb
{
  const Vs = [1.0, 2.0, 3.0, 4.0, 5.0]
  const R = 10
  const Ir = Vs.map((v) => v / R)
  const Ib = [0.18, 0.28, 0.35, 0.4, 0.44]
  investigation(
    'phys-electric-circuits-g11',
    11,
    'psi-11-ohm-resistor-bulb',
    `In an investigation, learners measure the current through a resistor, and then through a small light bulb, at different potential differences.\n${table('RESULTS', ['Potential difference (V)', 'Current in the resistor (A)', 'Current in the bulb (A)'], Vs.map((v, i) => [f(v, 1), f(Ir[i], 2), f(Ib[i], 2)]))}`,
    {
      marks: 4,
      prompt: 'Write down an investigative question for the resistor part of the investigation, and name the independent variable and the controlled variable. State Ohm\'s law.',
      answer: 'Investigative question: What is the relationship between the potential difference across a resistor and the current through it? Independent: the potential difference. Controlled: the temperature (of the resistor). Ohm\'s law: the potential difference across a conductor is directly proportional to the current in it, at constant temperature.',
      explanation: 'Temperature is the condition in Ohm\'s law: the resistance of most conductors changes when they heat up.',
      memo: [
        { code: 'A', marks: 1, text: 'investigative question' },
        { code: 'A', marks: 1, text: 'independent: potential difference' },
        { code: 'A', marks: 1, text: 'controlled: temperature' },
        { code: 'A', marks: 1, text: "Ohm's law with 'constant temperature'" },
      ],
    },
    {
      marks: 6,
      prompt: 'Calculate the resistance of the resistor. Calculate the resistance of the bulb at 1,0 V and at 5,0 V. Compare the two components: which one obeys Ohm\'s law? Explain the behaviour of the bulb.',
      answer: `Resistor: R = ${R} Ω at every reading. Bulb: ${n(Vs[0] / Ib[0], 1)} Ω at 1,0 V and ${n(Vs[4] / Ib[4], 1)} Ω at 5,0 V. The resistor obeys Ohm's law (V/I is constant: ohmic); the bulb does not (non-ohmic). As the current increases, the filament gets hotter, and its resistance increases.`,
      explanation: `R = V/I. Resistor: ${f(Vs[2], 1)} ÷ ${f(Ir[2], 2)} = ${R} Ω, the same for every row. Bulb: ${f(Vs[0], 1)} ÷ ${f(Ib[0], 2)} = ${n(Vs[0] / Ib[0], 1)} Ω and ${f(Vs[4], 1)} ÷ ${f(Ib[4], 2)} = ${n(Vs[4] / Ib[4], 1)} Ω. Its V–I graph curves, because the temperature of the filament does not stay constant.`,
      memo: [
        { code: 'A', marks: 1, text: `${R} Ω` },
        { code: 'A', marks: 1, text: `${n(Vs[0] / Ib[0], 1)} Ω` },
        { code: 'A', marks: 1, text: `${n(Vs[4] / Ib[4], 1)} Ω` },
        { code: 'C', marks: 1, text: 'resistor ohmic; bulb non-ohmic' },
        { code: 'R', marks: 2, text: 'the filament heats up, so its resistance increases' },
      ],
    },
  )
}

// --- Atomic combinations: bond length and bond energy
{
  const rows: [string, number, number][] = [
    ['H–F', 92, 567],
    ['H–Cl', 127, 431],
    ['H–Br', 141, 366],
    ['H–I', 161, 299],
  ]
  investigation(
    'phys-atomic-combinations',
    11,
    'psi-11-bond-length-energy',
    `The table gives the bond length and bond energy of the hydrogen halides, which are all polar covalent molecules.\n${table('DATA', ['Bond', 'Bond length (pm)', 'Bond energy (kJ·mol⁻¹)'], rows.map(([b, l, e]) => [b, `${l}`, `${e}`]))}`,
    {
      marks: 3,
      prompt: 'An investigation uses these data. Name the independent and dependent variables, and write a hypothesis linking them.',
      answer: 'Independent: the bond length (the halogen atom bonded to hydrogen). Dependent: the bond energy. Hypothesis: the longer the bond, the lower the bond energy.',
      explanation: 'Bond length is set by the size of the halogen atom; the bond energy is the property that depends on it.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: bond length' },
        { code: 'A', marks: 1, text: 'dependent: bond energy' },
        { code: 'A', marks: 1, text: 'hypothesis relating them' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the trend in the data and explain it in terms of atomic size. Calculate the percentage decrease in bond energy from H–F to H–I.',
      answer: `As the bond length increases, the bond energy decreases. Down group 17 the halogen atoms are larger, so the bonding electrons are further from the nucleus and attracted less strongly: the bond is longer and weaker. Decrease: ${n(((rows[0][2] - rows[3][2]) / rows[0][2]) * 100, 1)}%.`,
      explanation: `(${rows[0][2]} − ${rows[3][2]}) ÷ ${rows[0][2]} × 100 = ${n(((rows[0][2] - rows[3][2]) / rows[0][2]) * 100, 1)}%. A weaker bond needs less energy to break.`,
      memo: [
        { code: 'A', marks: 1, text: 'longer bond, lower bond energy' },
        { code: 'R', marks: 1, text: 'larger atoms: weaker attraction for the shared electrons' },
        { code: 'M', marks: 1, text: 'decrease ÷ original × 100' },
        { code: 'A', marks: 1, text: `${n(((rows[0][2] - rows[3][2]) / rows[0][2]) * 100, 1)}%` },
      ],
    },
  )
}

// --- Intermolecular forces: rate of evaporation
{
  const liquids: [string, number, number][] = [
    ['Water', 34, 100],
    ['Ethanol', 13, 78],
    ['Propanone (acetone)', 5, 56],
  ]
  investigation(
    'phys-intermolecular-forces',
    11,
    'psi-11-evaporation-imf',
    `In an investigation, equal volumes of three liquids are placed in identical dishes in the same room, and the time each takes to evaporate completely is recorded.\n${table('RESULTS', ['Liquid', 'Time to evaporate (min)', 'Boiling point (°C)'], liquids.map(([l, t, b]) => [l, `${t}`, `${b}`]))}`,
    {
      marks: 4,
      prompt: 'Write down the investigative question and name TWO controlled variables. State a hypothesis for the investigation.',
      answer: 'Investigative question: How does the strength of the intermolecular forces in a liquid affect its rate of evaporation? Controlled: the volume of each liquid; the surface area (identical dishes); the temperature of the room. Hypothesis: the stronger the intermolecular forces, the slower the rate of evaporation.',
      explanation: 'Evaporation also depends on surface area, temperature and air movement, so these must be the same for every liquid.',
      memo: [
        { code: 'A', marks: 1, text: 'investigative question' },
        { code: 'A', marks: 2, text: 'two controlled variables' },
        { code: 'A', marks: 1, text: 'hypothesis' },
      ],
    },
    {
      marks: 5,
      prompt: 'Which liquid has the strongest intermolecular forces? Use the results to explain your answer. Name the strongest type of intermolecular force in water and in propanone, and explain how the boiling points support the conclusion.',
      answer: 'Water: it takes the longest to evaporate, so the most energy is needed to separate its molecules. Water: hydrogen bonding. Propanone: dipole-dipole forces. Boiling points follow the same order as the evaporation times -- stronger forces, higher boiling point.',
      explanation: 'Molecules evaporate when they gain enough kinetic energy to overcome the forces holding them in the liquid. Hydrogen bonding (in water and ethanol) is stronger than the dipole-dipole forces between propanone molecules; water forms more hydrogen bonds per molecule than ethanol.',
      memo: [
        { code: 'A', marks: 1, text: 'water' },
        { code: 'R', marks: 1, text: 'slowest evaporation: strongest forces' },
        { code: 'A', marks: 1, text: 'water: hydrogen bonding' },
        { code: 'A', marks: 1, text: 'propanone: dipole-dipole' },
        { code: 'R', marks: 1, text: 'higher boiling point, stronger forces' },
      ],
    },
  )
}

// --- Ideal gases: Boyle's law and Charles's law
{
  const pV = 2000
  const Vs = [20, 25, 32, 40]
  const ps = Vs.map((v) => pV / v)
  investigation(
    'phys-ideal-gases',
    11,
    'psi-11-boyle',
    `In an investigation, a fixed mass of air is trapped in a syringe connected to a pressure gauge. The volume is changed slowly and the pressure is recorded.\n${table('RESULTS', ['Volume (cm³)', 'Pressure (kPa)'], Vs.map((v, i) => [`${v}`, f(ps[i], 1)]))}`,
    {
      marks: 4,
      prompt: 'Name the independent variable and TWO controlled variables. Why must the volume be changed slowly?',
      answer: 'Independent: the volume of the gas. Controlled: the temperature; the mass (amount) of gas. Changing the volume slowly lets the gas stay at room temperature: a fast compression heats it.',
      explanation: "Boyle's law holds only for a fixed mass of gas at constant temperature.",
      memo: [
        { code: 'A', marks: 1, text: 'independent: volume' },
        { code: 'A', marks: 2, text: 'controlled: temperature; mass of gas' },
        { code: 'R', marks: 1, text: 'keeps the temperature constant' },
      ],
    },
    {
      marks: 5,
      prompt: "Show, using the results, that the pressure is inversely proportional to the volume. What graph of the results would be a straight line through the origin? Predict the pressure when the volume is 50 cm³.",
      answer: `pV = ${n(pV)} kPa·cm³ in every row, a constant, so p ∝ 1/V. A graph of p against 1/V is a straight line through the origin. At 50 cm³: ${n(pV / 50, 1)} kPa.`,
      explanation: `${Vs.map((v, i) => `${v} × ${f(ps[i], 1)}`).join('; ')} all give ${n(pV)}. p₁V₁ = p₂V₂: ${n(pV)} = p × 50, so p = ${n(pV / 50, 1)} kPa.`,
      memo: [
        { code: 'M', marks: 1, text: 'calculating pV for the rows' },
        { code: 'A', marks: 1, text: 'pV constant' },
        { code: 'A', marks: 1, text: 'p against 1/V' },
        { code: 'SF', marks: 1, text: `${n(pV)} = p × 50` },
        { code: 'A', marks: 1, text: `${n(pV / 50, 1)} kPa` },
      ],
    },
  )
  const Tc = [0, 25, 50, 75, 100]
  const V0 = 30
  const Vc = Tc.map((t) => (V0 * (t + 273)) / 273)
  out.push({
    id: 'psi-11-charles-absolute-zero',
    topicId: 'phys-ideal-gases',
    grade: 11,
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: `In an investigation, a fixed mass of gas at constant pressure is heated, and its volume is recorded at different temperatures.\n${table('RESULTS', ['Temperature (°C)', 'Volume (cm³)'], Tc.map((t, i) => [`${t}`, f(Vc[i], 1)]))}`,
    prompt: 'Name the controlled variables. A graph of volume against temperature in °C is a straight line. Use the gradient to determine the temperature at which the volume would be zero, and explain the significance of that temperature.',
    answer: `Controlled: the pressure and the mass of gas. Gradient = ${n((Vc[4] - Vc[0]) / 100, 3)} cm³·°C⁻¹; the line reaches V = 0 at about −273 °C, absolute zero (0 K): the lowest possible temperature, where the particles would have no kinetic energy.`,
    explanation: `Gradient = (${f(Vc[4], 1)} − ${f(Vc[0], 1)}) ÷ (100 − 0) = ${n((Vc[4] - Vc[0]) / 100, 3)} cm³ per °C. Extrapolating back from ${f(Vc[0], 1)} cm³ at 0 °C: ${f(Vc[0], 1)} ÷ ${n((Vc[4] - Vc[0]) / 100, 3)} = ${n(Vc[0] / ((Vc[4] - Vc[0]) / 100), 0)} °C below zero. Charles's law: V ∝ T only when T is in kelvin.`,
    memo: [
      { code: 'A', marks: 1, text: 'pressure and mass of gas' },
      { code: 'M', marks: 1, text: 'gradient = ΔV ÷ ΔT' },
      { code: 'M', marks: 1, text: 'extrapolating to V = 0' },
      { code: 'A', marks: 1, text: '−273 °C' },
      { code: 'A', marks: 1, text: 'absolute zero: particles have minimum kinetic energy' },
    ],
  })
}

// --- Quantitative aspects of chemical change: limiting reagent
{
  const nHCl = 0.045
  const masses = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  const Vm = 24
  const vol = masses.map((m) => Math.min(m / 100, nHCl / 2) * Vm)
  investigation(
    'phys-quantitative-chem-change',
    11,
    'psi-11-limiting-caco3',
    `In an investigation, different masses of calcium carbonate are added to the same volume of hydrochloric acid, containing ${n(nHCl, 3)} mol HCl each time, and the volume of carbon dioxide produced is measured at room temperature, where the molar gas volume is ${Vm} dm³·mol⁻¹.\nCaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂\n${table('RESULTS', ['Mass of CaCO₃ (g)', 'Volume of CO₂ (dm³)'], masses.map((m, i) => [f(m, 1), f(vol[i], 2)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent variable, the dependent variable and ONE controlled variable.',
      answer: 'Independent: the mass of calcium carbonate. Dependent: the volume of CO₂ produced. Controlled: the volume and concentration of the hydrochloric acid / the temperature.',
      explanation: 'The amount of acid is the same in every run; only the mass of carbonate changes.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: mass of CaCO₃' },
        { code: 'A', marks: 1, text: 'dependent: volume of CO₂' },
        { code: 'A', marks: 1, text: 'controlled: amount of acid / temperature' },
      ],
    },
    {
      marks: 6,
      prompt: 'Use a calculation to verify the volume of CO₂ for 1,0 g of CaCO₃. Explain why 2,5 g and 3,0 g of CaCO₃ produce the same volume of CO₂, and identify the limiting reagent in the last run.',
      answer: `1,0 g: n(CaCO₃) = 0,01 mol, so n(CO₂) = 0,01 mol and V = ${f(0.01 * Vm, 2)} dm³. From about 2,25 g, all ${n(nHCl, 3)} mol of HCl is used up: the acid becomes the limiting reagent and the extra CaCO₃ is in excess, so no more CO₂ can form (maximum ${f((nHCl / 2) * Vm, 2)} dm³). In the 3,0 g run HCl is the limiting reagent.`,
      explanation: `n = m/M = 1,0 ÷ 100 = 0,01 mol; mole ratio CaCO₃ : CO₂ = 1 : 1; V = nVm = 0,01 × ${Vm} = ${f(0.01 * Vm, 2)} dm³. The acid can react with at most ${n(nHCl, 3)} ÷ 2 = ${n(nHCl / 2, 4)} mol CaCO₃ (${n((nHCl / 2) * 100, 2)} g), giving ${n(nHCl / 2, 4)} × ${Vm} = ${f((nHCl / 2) * Vm, 2)} dm³ of CO₂.`,
      memo: [
        { code: 'SF', marks: 1, text: 'n = 1,0 ÷ 100' },
        { code: 'M', marks: 1, text: '1 : 1 mole ratio' },
        { code: 'A', marks: 1, text: `${f(0.01 * Vm, 2)} dm³` },
        { code: 'R', marks: 1, text: 'all the HCl has reacted' },
        { code: 'A', marks: 1, text: 'CaCO₃ in excess' },
        { code: 'A', marks: 1, text: 'HCl is limiting' },
      ],
    },
  )
}

// --- Energy and chemical change: dissolving salts
{
  const start = 22.0
  const salts: [string, number][] = [
    ['Ammonium nitrate', 14.5],
    ['Sodium hydroxide', 31.0],
    ['Potassium chloride', 18.6],
  ]
  investigation(
    'phys-energy-chem-change',
    11,
    'psi-11-dissolving-temperature',
    `In an investigation, 5 g of each salt is dissolved in 50 cm³ of water at ${f(start, 1)} °C in a polystyrene cup, and the final temperature is recorded.\n${table('RESULTS', ['Salt', 'Final temperature (°C)'], salts.map(([s, t]) => [s, f(t, 1)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent variable and TWO controlled variables. Why is a polystyrene cup used to measure the energy change?',
      answer: 'Independent: the salt dissolved. Controlled: the mass of salt; the volume of water; the starting temperature. Polystyrene is a good insulator, so little energy is gained from or lost to the surroundings.',
      explanation: 'The temperature change is the measure of the energy change, so heat exchange with the room must be kept small.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: type of salt' },
        { code: 'A', marks: 1, text: 'two controlled variables' },
        { code: 'R', marks: 1, text: 'insulator: reduces energy exchange' },
      ],
    },
    {
      marks: 5,
      prompt: 'Classify the dissolving of each salt as exothermic or endothermic, with a reason from the results. For ammonium nitrate, state the sign of ΔH and whether the energy of the products is higher or lower than that of the reactants.',
      answer: 'Ammonium nitrate: endothermic (the temperature drops: energy is absorbed from the water). Sodium hydroxide: exothermic (the temperature rises). Potassium chloride: endothermic (slight drop). For ammonium nitrate ΔH > 0, and the products have MORE energy than the reactants.',
      explanation: `Changes: ${salts.map(([s, t]) => `${s.toLowerCase()} ${t - start > 0 ? '+' : '−'}${f(Math.abs(t - start), 1)} °C`).join('; ')}. An endothermic process takes energy from its surroundings, which is why the water cools.`,
      memo: [
        { code: 'A', marks: 1, text: 'ammonium nitrate endothermic, with reason' },
        { code: 'A', marks: 1, text: 'sodium hydroxide exothermic, with reason' },
        { code: 'A', marks: 1, text: 'potassium chloride endothermic' },
        { code: 'A', marks: 1, text: 'ΔH > 0' },
        { code: 'A', marks: 1, text: 'products higher in energy' },
      ],
    },
  )
}

// --- Types of reactions: a pH curve
{
  const vols = [0, 10, 20, 24, 25, 26, 30]
  const pH = [1.0, 1.4, 2.1, 2.9, 7.0, 11.1, 12.3]
  const cBase = 0.1
  const vAcid = 25
  investigation(
    'phys-types-of-reactions',
    11,
    'psi-11-ph-neutralisation',
    `In an investigation, sodium hydroxide solution (${n(cBase, 1)} mol·dm⁻³) is added from a burette to ${vAcid} cm³ of hydrochloric acid, and the pH of the mixture is measured with a pH meter after each addition.\n${table('RESULTS', ['Volume of NaOH added (cm³)', 'pH'], vols.map((v, i) => [`${v}`, f(pH[i], 1)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and the dependent variable, and write a balanced equation for the reaction.',
      answer: 'Independent: the volume of NaOH added. Dependent: the pH of the mixture. NaOH + HCl → NaCl + H₂O.',
      explanation: 'This is a neutralisation (acid-base) reaction: an acid and a base react to form a salt and water.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: volume of NaOH' },
        { code: 'A', marks: 1, text: 'dependent: pH' },
        { code: 'A', marks: 1, text: 'balanced equation' },
      ],
    },
    {
      marks: 5,
      prompt: 'At what volume of NaOH is the acid exactly neutralised? Give a reason. Use this volume to calculate the concentration of the hydrochloric acid. Describe the pH change near the endpoint.',
      answer: `25 cm³, where the pH is 7. c(HCl) = ${n((cBase * 25) / vAcid, 1)} mol·dm⁻³. The pH rises very sharply, from about 3 to about 11, with only 2 cm³ of base near the endpoint.`,
      explanation: `n(NaOH) = cV = ${n(cBase, 1)} × 0,025 = ${n(cBase * 0.025, 4)} mol. Ratio 1 : 1, so n(HCl) = ${n(cBase * 0.025, 4)} mol, and c = ${n(cBase * 0.025, 4)} ÷ 0,025 = ${n((cBase * 25) / vAcid, 1)} mol·dm⁻³. Strong acid–strong base: the salt is neutral, so the endpoint is at pH 7.`,
      memo: [
        { code: 'A', marks: 1, text: '25 cm³' },
        { code: 'R', marks: 1, text: 'pH = 7' },
        { code: 'SF', marks: 1, text: 'n(NaOH) = 0,1 × 0,025' },
        { code: 'A', marks: 1, text: `${n((cBase * 25) / vAcid, 1)} mol·dm⁻³` },
        { code: 'A', marks: 1, text: 'sharp rise near the endpoint' },
      ],
    },
  )
}

// ================================================================ GRADE 10

// --- Motion in one dimension: a ticker tape
{
  const dt = 0.1
  const xs = [0, 0.15, 0.3, 0.45, 0.6]
  const v = (xs[4] - xs[0]) / (4 * dt)
  investigation(
    'phys-motion-1d',
    10,
    'psi-10-ticker-constant-velocity',
    `In an investigation, a trolley rolls along a slightly sloped runway (to cancel friction), pulling a ticker tape. Its position is read off the tape every ${n(dt, 1)} s.\n${table('RESULTS', ['Time (s)', 'Position (m)'], xs.map((x, i) => [f(i * dt, 1), f(x, 2)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and the dependent variable in this investigation. Why is the runway sloped slightly?',
      answer: 'Independent: time. Dependent: position (displacement) of the trolley. The slope makes the component of gravity along the runway cancel friction, so the net force is zero and the trolley can move at constant velocity.',
      explanation: 'Time is fixed by the ticker timer\'s frequency; position is what is measured from the tape.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: time' },
        { code: 'A', marks: 1, text: 'dependent: position' },
        { code: 'R', marks: 1, text: 'compensates for friction' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the motion of the trolley, using the results. Calculate its velocity, and describe the shape of its position–time graph.',
      answer: `Constant velocity: it covers equal displacements (0,15 m) in equal time intervals. v = ${n(v, 1)} m·s⁻¹. The position–time graph is a straight line through the origin with gradient ${n(v, 1)} m·s⁻¹.`,
      explanation: `v = Δx/Δt = (${f(xs[4], 2)} − 0) ÷ ${n(4 * dt, 1)} = ${n(v, 1)} m·s⁻¹. The gradient of a position–time graph is the velocity, so a constant velocity gives a straight line.`,
      memo: [
        { code: 'A', marks: 1, text: 'constant velocity: equal displacements in equal times' },
        { code: 'SF', marks: 1, text: 'v = Δx/Δt' },
        { code: 'A', marks: 1, text: `${n(v, 1)} m·s⁻¹` },
        { code: 'A', marks: 1, text: 'straight line through the origin' },
      ],
    },
  )
}

// --- Mechanical energy: conservation for a falling ball
{
  const m = 0.2
  const top = 2.0
  const hs = [2.0, 1.5, 1.0, 0.5]
  const vs = hs.map((y) => Math.round(Math.sqrt(2 * g * (top - y)) * 100) / 100)
  const Em = m * g * top
  investigation(
    'phys-mechanical-energy-g10',
    10,
    'psi-10-falling-ball-energy',
    `In an investigation, a ball of mass ${n(m, 1)} kg is dropped from rest from ${n(top, 1)} m above the floor. Light gates measure its speed at different heights. Ignore air resistance.\n${table('RESULTS', ['Height above the floor (m)', 'Speed (m·s⁻¹)'], hs.map((y, i) => [f(y, 1), f(vs[i], 2)]))}`,
    {
      marks: 3,
      prompt: 'Write down an investigative question for this experiment, and name the independent and dependent variables.',
      answer: 'Investigative question: Is the mechanical energy of a falling ball conserved? (or: How does the speed of a falling ball change as its height decreases?) Independent: the height of the ball. Dependent: its speed (kinetic energy).',
      explanation: 'The heights of the light gates are chosen; the speed is what the gates measure.',
      memo: [
        { code: 'A', marks: 1, text: 'investigative question' },
        { code: 'A', marks: 1, text: 'independent: height' },
        { code: 'A', marks: 1, text: 'dependent: speed' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the gravitational potential energy, the kinetic energy and the mechanical energy of the ball at 1,0 m. What conclusion can you draw?',
      answer: `Ep = ${n(m * g * 1.0, 2)} J; Ek = ${n(0.5 * m * vs[2] ** 2, 2)} J; Emech = ${n(m * g * 1.0 + 0.5 * m * vs[2] ** 2, 2)} J, the same as the ${n(Em, 2)} J it had at the top. Mechanical energy is conserved.`,
      explanation: `Ep = mgh = ${n(m, 1)} × 9,8 × 1,0 = ${n(m * g * 1.0, 2)} J. Ek = ½mv² = ½ × ${n(m, 1)} × ${f(vs[2], 2)}² = ${n(0.5 * m * vs[2] ** 2, 2)} J. At the top, Emech = mgh = ${n(Em, 2)} J (Ek = 0). Without air resistance, the energy lost as Ep is gained as Ek.`,
      memo: [
        { code: 'A', marks: 1, text: `Ep = ${n(m * g * 1.0, 2)} J` },
        { code: 'A', marks: 1, text: `Ek = ${n(0.5 * m * vs[2] ** 2, 2)} J` },
        { code: 'A', marks: 1, text: `Emech = ${n(m * g * 1.0 + 0.5 * m * vs[2] ** 2, 2)} J` },
        { code: 'A', marks: 1, text: `top: ${n(Em, 2)} J` },
        { code: 'C', marks: 1, text: 'mechanical energy is conserved' },
      ],
    },
  )
}

// --- Transverse waves: frequency and wavelength
{
  const v = 3.0
  const fr = [2, 4, 6, 8]
  const lam = fr.map((x) => v / x)
  investigation(
    'phys-transverse-waves-g10',
    10,
    'psi-10-rope-frequency-wavelength',
    `In an investigation, learners send transverse waves along the same stretched rope at different frequencies and measure the wavelength each time.\n${table('RESULTS', ['Frequency (Hz)', 'Wavelength (m)'], fr.map((x, i) => [`${x}`, f(lam[i], 3)]))}`,
    {
      marks: 4,
      prompt: 'Name the independent and the dependent variable, and ONE controlled variable. Why must it be the same rope, at the same tension, throughout? Define the wavelength of a transverse wave.',
      answer: 'Independent: frequency. Dependent: wavelength. Controlled: the rope / its tension. The speed of a wave depends on the medium; keeping the medium the same keeps the wave speed constant. Wavelength: the distance between two consecutive points in phase, such as two adjacent crests.',
      explanation: 'v = fλ: if the speed changed as well, the effect of frequency on wavelength could not be isolated.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: frequency' },
        { code: 'A', marks: 1, text: 'dependent: wavelength' },
        { code: 'R', marks: 1, text: 'same medium, same wave speed' },
        { code: 'A', marks: 1, text: 'definition of wavelength' },
      ],
    },
    {
      marks: 5,
      prompt: 'Describe the relationship between frequency and wavelength. Calculate the wave speed. Predict the wavelength at 10 Hz, and the period of the wave at that frequency.',
      answer: `Wavelength is inversely proportional to frequency (doubling f halves λ). Speed = ${n(v, 1)} m·s⁻¹. At 10 Hz: λ = ${n(v / 10, 2)} m and T = 1/f = 0,1 s.`,
      explanation: `f × λ = ${fr.map((x, i) => `${x} × ${f(lam[i], 3)}`).join(' = ')} = ${n(v, 1)} m·s⁻¹ in every row: v = fλ. λ = v/f = ${n(v, 1)} ÷ 10 = ${n(v / 10, 2)} m.`,
      memo: [
        { code: 'A', marks: 1, text: 'inversely proportional' },
        { code: 'SF', marks: 1, text: 'v = fλ' },
        { code: 'A', marks: 1, text: `${n(v, 1)} m·s⁻¹` },
        { code: 'A', marks: 1, text: `${n(v / 10, 2)} m` },
        { code: 'A', marks: 1, text: 'T = 1/f = 0,1 s' },
      ],
    },
  )
}

// --- Longitudinal waves: speed of sound by echo
{
  const vS = 340
  const ds = [50, 100, 150]
  const ts = ds.map((d) => Math.round(((2 * d) / vS) * 100) / 100)
  investigation(
    'phys-longitudinal-waves-g10',
    10,
    'psi-10-echo-speed',
    `In an investigation to measure the speed of sound, a learner claps in front of a large wall and times the echo. The distance to the wall is changed.\n${table('RESULTS', ['Distance to the wall (m)', 'Time for the echo (s)'], ds.map((d, i) => [`${d}`, f(ts[i], 2)]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and dependent variables. Suggest how the learner can make the time measurement more accurate.',
      answer: 'Independent: the distance to the wall. Dependent: the time for the echo. Time many claps in a rhythm (clap in time with the echo, time 20 echoes and divide), or repeat each reading and use an average.',
      explanation: 'Human reaction time (about 0,2 s) is a large fraction of each echo time, so a single reading is not reliable.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: distance' },
        { code: 'A', marks: 1, text: 'dependent: time' },
        { code: 'A', marks: 1, text: 'repeat / time many echoes and average' },
      ],
    },
    {
      marks: 4,
      prompt: 'Explain why the distance must be doubled in the calculation. Use the results for 100 m to calculate the speed of sound, and state what type of wave sound is.',
      answer: `The sound travels to the wall AND back. v = ${n((2 * ds[1]) / ts[1], 0)} m·s⁻¹. Sound is a longitudinal wave: the particles of air vibrate parallel to the direction the wave travels.`,
      explanation: `v = distance ÷ time = (2 × ${ds[1]}) ÷ ${f(ts[1], 2)} = ${n((2 * ds[1]) / ts[1], 0)} m·s⁻¹, close to the accepted 340 m·s⁻¹ in air.`,
      memo: [
        { code: 'R', marks: 1, text: 'there and back' },
        { code: 'SF', marks: 1, text: `v = 200 ÷ ${f(ts[1], 2)}` },
        { code: 'A', marks: 1, text: `${n((2 * ds[1]) / ts[1], 0)} m·s⁻¹` },
        { code: 'A', marks: 1, text: 'longitudinal' },
      ],
    },
  )
}

// --- Sound: pitch of a vibrating ruler
{
  const Ls = [10, 15, 20, 25]
  const fr = Ls.map((L) => Math.round(12000 / (L * L)))
  investigation(
    'phys-sound-g10',
    10,
    'psi-10-ruler-pitch',
    `In an investigation, a ruler is clamped to a desk and the overhanging end is flicked. The overhanging length is changed, and the frequency of the sound is measured with a phone app.\n${table('RESULTS', ['Overhanging length (cm)', 'Frequency (Hz)'], Ls.map((L, i) => [`${L}`, `${fr[i]}`]))}`,
    {
      marks: 4,
      prompt: 'Write down a hypothesis for this investigation, and name the independent variable and TWO controlled variables.',
      answer: 'Hypothesis: the shorter the overhanging length, the higher the frequency (pitch) of the sound. Independent: the overhanging length. Controlled: the same ruler; the same force used to flick it (amplitude); the same clamp/desk.',
      explanation: 'A hypothesis predicts a relationship that the results can test.',
      memo: [
        { code: 'A', marks: 1, text: 'hypothesis' },
        { code: 'A', marks: 1, text: 'independent: length' },
        { code: 'A', marks: 2, text: 'two controlled variables' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the trend in the results and relate it to the pitch heard. Which property of the sound would change if the ruler were flicked harder?',
      answer: 'The shorter the overhanging length, the higher the frequency, so the higher the pitch. Flicking harder increases the amplitude, so the sound is LOUDER; the pitch stays the same.',
      explanation: `The frequency rises from ${fr[3]} Hz at ${Ls[3]} cm to ${fr[0]} Hz at ${Ls[0]} cm. Pitch depends on frequency; loudness depends on amplitude.`,
      memo: [
        { code: 'A', marks: 1, text: 'shorter length, higher frequency' },
        { code: 'A', marks: 1, text: 'higher pitch' },
        { code: 'A', marks: 1, text: 'amplitude increases' },
        { code: 'A', marks: 1, text: 'louder, same pitch' },
      ],
    },
  )
}

// --- States of matter: the heating curve of ice
{
  const times = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const temps = [-10, -5, 0, 0, 0, 0, 6, 12, 18]
  investigation(
    'phys-states-matter-kmt',
    10,
    'psi-10-heating-curve-ice',
    `In an investigation, crushed ice is heated steadily in a beaker and stirred, and its temperature is recorded every minute.\n${table('RESULTS', ['Time (min)', 'Temperature (°C)'], times.map((t, i) => [`${t}`, `${temps[i]}`]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and dependent variables. Why is the ice stirred during heating, while the change of state from solid to liquid takes place?',
      answer: 'Independent: time (of heating). Dependent: temperature. Stirring spreads the energy evenly, so the thermometer reads the temperature of the whole sample.',
      explanation: 'The heat is supplied at a steady rate, so time stands for the energy added.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: time' },
        { code: 'A', marks: 1, text: 'dependent: temperature' },
        { code: 'R', marks: 1, text: 'even temperature throughout' },
      ],
    },
    {
      marks: 5,
      prompt: 'Write down the melting point of ice from the results. Explain, using the kinetic molecular theory, why the temperature stays constant from 2 to 5 minutes although heating continues. In which phase is the water at 7 minutes?',
      answer: 'Melting point: 0 °C. While melting, the energy supplied is used to overcome the intermolecular forces between the water molecules, not to increase their kinetic energy, so the temperature does not rise. At 7 minutes the water is liquid.',
      explanation: 'Temperature is a measure of the average kinetic energy of the particles. During a phase change the energy goes into potential energy (separating the particles); once all the ice has melted, the temperature rises again.',
      memo: [
        { code: 'A', marks: 1, text: '0 °C' },
        { code: 'R', marks: 1, text: 'energy overcomes the intermolecular forces' },
        { code: 'R', marks: 1, text: 'the average kinetic energy does not increase' },
        { code: 'A', marks: 1, text: 'temperature constant during the phase change' },
        { code: 'A', marks: 1, text: 'liquid' },
      ],
    },
  )
}

// --- The periodic table: ionisation energy across period 3
{
  const els: [string, number][] = [
    ['Na', 496],
    ['Mg', 738],
    ['Al', 578],
    ['Si', 787],
    ['P', 1012],
    ['S', 1000],
    ['Cl', 1251],
    ['Ar', 1521],
  ]
  investigation(
    'phys-periodic-table',
    10,
    'psi-10-ionisation-period3',
    `The first ionisation energies of the elements of period 3 are given.\n${table('DATA', ['Element', ...els.map(([e]) => e)], [['First ionisation energy (kJ·mol⁻¹)', ...els.map(([, v]) => `${v}`)]])}`,
    {
      marks: 3,
      prompt: 'Define first ionisation energy. An investigation uses these data to study the trend across a period: name the independent and dependent variables.',
      answer: 'First ionisation energy: the energy needed per mole to remove the first electron from an atom in the gaseous phase. Independent: the element (atomic number). Dependent: the first ionisation energy.',
      explanation: 'Atomic number increases across the period; the ionisation energy is the property that depends on it.',
      memo: [
        { code: 'A', marks: 1, text: 'definition' },
        { code: 'A', marks: 1, text: 'independent: atomic number' },
        { code: 'A', marks: 1, text: 'dependent: ionisation energy' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the general trend in first ionisation energy across period 3 and explain it. Which element does not follow the trend between Mg and Si?',
      answer: 'It generally increases from Na to Ar. Across a period the nuclear charge increases while the electrons are in the same energy level, and the atomic radius decreases, so the outer electron is held more strongly. Aluminium (578 kJ·mol⁻¹, lower than Mg) does not follow the trend.',
      explanation: `Na ${els[0][1]} to Ar ${els[7][1]} kJ·mol⁻¹. (Al is lower than Mg because its outer electron is in a p orbital, slightly further from the nucleus.)`,
      memo: [
        { code: 'A', marks: 1, text: 'increases across the period' },
        { code: 'R', marks: 1, text: 'greater nuclear charge, same energy level' },
        { code: 'R', marks: 1, text: 'smaller radius: electron held more strongly' },
        { code: 'A', marks: 1, text: 'aluminium' },
      ],
    },
  )
}

// --- Chemical bonding: properties of substances
{
  const subs: [string, string, string, string][] = [
    ['Sodium chloride', '801', 'No', 'Yes'],
    ['Sugar (sucrose)', '186', 'No', 'No'],
    ['Copper', '1 085', 'Yes', '(does not dissolve)'],
    ['Silicon dioxide', '1 710', 'No', '(does not dissolve)'],
  ]
  investigation(
    'phys-chemical-bonding-g10',
    10,
    'psi-10-bonding-properties',
    `In an investigation, learners test four substances.\n${table('RESULTS', ['Substance', 'Melting point (°C)', 'Conducts as a solid?', 'Conducts when dissolved in water?'], subs.map((r) => [...r]))}`,
    {
      marks: 3,
      prompt: 'Write down an investigative question for this investigation. Name ONE safety precaution when testing the melting points.',
      answer: 'Investigative question: How does the type of bonding in a substance affect its melting point and electrical conductivity? Precaution: wear safety goggles / heat in a fume cupboard / use tongs to handle hot apparatus.',
      explanation: 'The properties tested are the evidence for the type of bonding.',
      memo: [
        { code: 'A', marks: 2, text: 'investigative question linking bonding and properties' },
        { code: 'A', marks: 1, text: 'a safety precaution' },
      ],
    },
    {
      marks: 5,
      prompt: 'Use the results to identify the type of bonding in each substance, and explain why sodium chloride conducts when dissolved but not as a solid.',
      answer: 'Sodium chloride: ionic. Sugar: covalent (molecular). Copper: metallic. Silicon dioxide: covalent network. Solid NaCl has its ions fixed in a lattice; dissolved in water, the ions are free to move and carry charge.',
      explanation: 'High melting point and conduction only when dissolved or molten point to ionic bonding; conduction as a solid to metallic (delocalised electrons); a low melting point and no conduction to small molecules; a very high melting point with no conduction to a covalent network.',
      memo: [
        { code: 'A', marks: 1, text: 'NaCl ionic' },
        { code: 'A', marks: 1, text: 'sugar covalent' },
        { code: 'A', marks: 1, text: 'copper metallic' },
        { code: 'A', marks: 1, text: 'SiO₂ covalent network' },
        { code: 'R', marks: 1, text: 'ions free to move only in solution' },
      ],
    },
  )
}

// --- Physical and chemical change: mass in an open and a closed system
{
  const before = 25.42
  const after = 25.58
  investigation(
    'phys-physical-chemical-change',
    10,
    'psi-10-magnesium-mass',
    `In an investigation, magnesium ribbon is heated strongly in a crucible with a lid lifted now and then to let air in, until it has all turned to white powder.\n${table('RESULTS', ['Measurement', 'Mass (g)'], [['Crucible, lid and magnesium before heating', f(before, 2)], ['Crucible, lid and powder after heating', f(after, 2)]])}`,
    {
      marks: 3,
      prompt: 'Is this a physical or a chemical change? Give TWO reasons from the investigation. Write a balanced equation for the reaction.',
      answer: 'A chemical change: a new substance (white magnesium oxide) forms, and energy (light and heat) is released. 2Mg + O₂ → 2MgO.',
      explanation: 'In a chemical change the bonds between atoms are broken and new bonds form, producing a substance with different properties.',
      memo: [
        { code: 'A', marks: 1, text: 'chemical change' },
        { code: 'R', marks: 1, text: 'a new substance forms / energy released' },
        { code: 'A', marks: 1, text: '2Mg + O₂ → 2MgO' },
      ],
    },
    {
      marks: 4,
      prompt: 'Calculate the change in mass. A learner says the results show that the law of conservation of mass is false. Explain why she is wrong.',
      answer: `The mass increased by ${n(after - before, 2)} g. Oxygen from the air combined with the magnesium. The crucible was not a closed system, so the oxygen was not weighed at the start; counting it, the total mass of reactants equals the mass of products.`,
      explanation: `${f(after, 2)} − ${f(before, 2)} = ${n(after - before, 2)} g: the mass of oxygen that reacted. The law of conservation of mass applies to a closed system: no atoms are created or destroyed, they are rearranged.`,
      memo: [
        { code: 'A', marks: 1, text: `${n(after - before, 2)} g` },
        { code: 'R', marks: 1, text: 'oxygen from the air was added' },
        { code: 'R', marks: 1, text: 'not a closed system' },
        { code: 'A', marks: 1, text: 'mass of reactants = mass of products' },
      ],
    },
  )
}

export const physicsInvestigations: Question[] = out
