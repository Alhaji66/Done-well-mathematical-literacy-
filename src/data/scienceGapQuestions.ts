/**
 * The last two science topics the question-type report (tools/question-type-
 * coverage.mts) found with no investigation at all:
 *
 *   Vectors and scalars (Physical Sciences, Grade 10): no investigation, no
 *     data to interpret, and two each of explain, diagram and compare.
 *   Biodiversity in animals (Life Sciences, Grade 11): no investigation, no
 *     calculation and no diagram.
 *
 * Each topic gets two investigations of the kind a school practical or an NSC
 * paper sets -- a table of results, a question on how it was planned and one
 * on what it found -- and standalone questions for the other thin types.
 * Grade 10 vectors stay in one dimension, as CAPS teaches them in Grade 10.
 * Every number is computed from the values declared beside it, and written
 * with a decimal comma.
 */
import type { Grade, MemoStep, Question } from '@/types'

const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(Math.abs(r)).split('.')
  return (r < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}
/** Fixed decimals, as a recorded measurement: 3,0 not 3. */
const f = (v: number, dp: number): string => Math.abs(v).toFixed(dp).replace('.', ',')
const table = (title: string, head: string[], rows: string[][]) =>
  `|+ TABLE: ${title}\n| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

interface Part {
  marks: number
  prompt: string
  answer: string
  explanation: string
  memo: MemoStep[]
}

const out: Question[] = []

function investigation(topicId: string, grade: Grade, id: string, context: string, design: Part, analysis: Part) {
  out.push(
    { id: `${id}-design`, topicId, grade, difficulty: 'Moderate', cognitiveLevel: 2, context, ...design },
    { id: `${id}-results`, topicId, grade, difficulty: 'Challenge', cognitiveLevel: 3, context, ...analysis },
  )
}

// ============================================== VECTORS AND SCALARS, GRADE 10

const VEC = { topicId: 'phys-vectors-scalars-g10', grade: 10 as Grade }

// --- Two forces along one line: does the resultant add or subtract?
{
  // Spring balances A and B pull a ring along one straight line; balance C holds
  // it still, so C reads the equilibrant. Readings sit a little off the ideal.
  const runs = [
    { a: 3.0, b: 2.0, same: true, err: -0.1 },
    { a: 3.0, b: 2.0, same: false, err: 0.1 },
    { a: 4.5, b: 1.5, same: true, err: -0.1 },
    { a: 4.5, b: 1.5, same: false, err: -0.1 },
  ]
  const ideal = runs.map((r) => (r.same ? r.a + r.b : r.a - r.b))
  const reading = runs.map((r, i) => ideal[i] + r.err)
  investigation(
    VEC.topicId,
    VEC.grade,
    'vg-10-vectors-collinear-forces',
    `Learners investigate the resultant of two forces that act along the same straight line. Spring balances A and B pull on a small ring lying on a smooth table, either in the same direction or in opposite directions. A third spring balance, C, is attached so that the ring stays at rest, and its reading is recorded.\n${table(
      'RESULTS',
      ['Run', 'Force A (N)', 'Force B (N)', 'Direction of B', 'Reading on C (N)'],
      runs.map((r, i) => [`${i + 1}`, f(r.a, 1), f(r.b, 1), r.same ? 'same as A' : 'opposite to A', f(reading[i], 1)]),
    )}`,
    {
      marks: 4,
      prompt: 'Write down an investigative question for this experiment, name the independent and the dependent variable, and give ONE precaution that makes the readings more accurate.',
      answer:
        'Investigative question: How does the resultant of two forces acting along the same line depend on whether they act in the same or in opposite directions? Independent variable: the direction of force B (and the sizes of A and B). Dependent variable: the resultant force, read on balance C. Precaution: keep all three balances along the same straight line (or: zero the balances before use; read the scale at eye level).',
      explanation:
        'The learners choose the directions and sizes of A and B, so those are what they change; what they measure is the force needed on C, which tells them the resultant. The balances must lie on one straight line: a balance pulling at an angle would no longer act along the line of the other forces, and the one-dimensional rule would not apply.',
      memo: [
        { code: 'A', marks: 1, text: 'investigative question relating the directions to the resultant' },
        { code: 'A', marks: 1, text: 'independent: direction of B (sizes of the forces)' },
        { code: 'A', marks: 1, text: 'dependent: resultant force / reading on C' },
        { code: 'A', marks: 1, text: 'precaution: balances in one straight line / zeroed / read at eye level' },
      ],
    },
    {
      marks: 6,
      prompt:
        'Take the direction of A as positive. Calculate the resultant of A and B for runs 2 and 4, compare each with the reading on C, and write a conclusion for the investigation. In which direction does balance C pull?',
      answer: `Run 2: R = ${f(runs[1].a, 1)} + (−${f(runs[1].b, 1)}) = ${f(ideal[1], 1)} N in the direction of A; C reads ${f(reading[1], 1)} N. Run 4: R = ${f(runs[3].a, 1)} + (−${f(runs[3].b, 1)}) = ${f(ideal[3], 1)} N in the direction of A; C reads ${f(reading[3], 1)} N. The readings agree with the calculated resultants within experimental error. Conclusion: forces in the same direction add, and forces in opposite directions subtract, the resultant pointing in the direction of the larger force. C pulls opposite to the resultant: it is the equilibrant.`,
      explanation: `With A positive, B is negative when it pulls the other way, so the resultant is the algebraic sum. The ring stays at rest, so C must balance the resultant of A and B: equal in size, opposite in direction. That is why its reading is the size of the resultant. The 0,1 N differences are reading errors on the balances.`,
      memo: [
        { code: 'M', marks: 1, text: 'opposite direction taken as negative' },
        { code: 'A', marks: 1, text: `run 2: ${f(ideal[1], 1)} N in the direction of A` },
        { code: 'A', marks: 1, text: `run 4: ${f(ideal[3], 1)} N in the direction of A` },
        { code: 'C', marks: 1, text: 'agree with C within experimental error' },
        { code: 'C', marks: 1, text: 'same direction add; opposite directions subtract' },
        { code: 'R', marks: 1, text: 'C pulls opposite to the resultant: the equilibrant' },
      ],
    },
  )
}

// --- Distance against displacement on a measured walk
{
  const legs = [
    { m: 12.0, dir: 'east' },
    { m: 5.0, dir: 'west' },
    { m: 8.5, dir: 'east' },
    { m: 20.0, dir: 'west' },
  ]
  const distance = legs.reduce((s, l) => s + l.m, 0)
  const disp = legs.reduce((s, l) => s + (l.dir === 'east' ? l.m : -l.m), 0)
  investigation(
    VEC.topicId,
    VEC.grade,
    'vg-10-vectors-walk',
    `In an experiment on distance and displacement, a learner walks along a straight school corridor that runs east–west, starting at a chalk mark. A partner measures each part of the walk with a measuring tape and records it.\n${table(
      'RESULTS',
      ['Part of the walk', 'Length (m)', 'Direction'],
      legs.map((l, i) => [`${i + 1}`, f(l.m, 1), l.dir]),
    )}`,
    {
      marks: 4,
      prompt:
        'Why must the learners mark a fixed starting point and choose a positive direction before the walk begins? Which column of the table on its own describes a scalar, and what has to be added to it to describe a vector? Give ONE source of error in the measurements.',
      answer:
        'Displacement is measured from a reference point and has a direction, so a fixed start and a chosen positive direction are needed to give each part a sign. The length column alone is a scalar (distance: magnitude only); adding the direction makes each part a displacement vector. Source of error: the tape not kept straight along the corridor (or: the end points of each part marked inaccurately).',
      explanation:
        'A vector needs magnitude AND direction, so the record needs both columns. Without a fixed reference point there is nothing for a displacement to be measured from, and without a positive direction "east" and "west" cannot be added with signs.',
      memo: [
        { code: 'R', marks: 1, text: 'displacement is measured from a reference point' },
        { code: 'R', marks: 1, text: 'a positive direction gives each part a sign' },
        { code: 'A', marks: 1, text: 'length: scalar; add the direction to get a vector' },
        { code: 'A', marks: 1, text: 'source of error: tape not straight / end points inaccurate' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the total distance walked and the learner\'s resultant displacement from the chalk mark. Explain why the two answers are different.',
      answer: `Distance = ${legs.map((l) => f(l.m, 1)).join(' + ')} = ${n(distance, 1)} m. Displacement (east positive) = ${legs.map((l, i) => (l.dir === 'east' ? (i ? '+ ' : '') + f(l.m, 1) : '− ' + f(l.m, 1))).join(' ')} = ${n(disp, 1)} m, i.e. ${n(Math.abs(disp), 1)} m ${disp < 0 ? 'west' : 'east'} of the chalk mark. Distance is a scalar, so every part adds; displacement is a vector, so parts in opposite directions cancel.`,
      explanation: `Distance is the length of the whole path walked, whatever the direction. Displacement is the change in position from the start, so the westward parts are subtracted from the eastward parts. The learner ends ${n(Math.abs(disp), 1)} m ${disp < 0 ? 'west' : 'east'} of the start after walking ${n(distance, 1)} m.`,
      memo: [
        { code: 'A', marks: 1, text: `distance = ${n(distance, 1)} m` },
        { code: 'M', marks: 1, text: 'one direction positive, the other negative' },
        { code: 'A', marks: 1, text: `displacement = ${n(Math.abs(disp), 1)} m` },
        { code: 'A', marks: 1, text: disp < 0 ? 'west' : 'east' },
        { code: 'R', marks: 1, text: 'distance scalar adds; displacement vector cancels' },
      ],
    },
  )
}

// --- Explain
{
  const [a, b] = [6, 4]
  out.push({
    ...VEC,
    id: 'vg-10-vectors-explain-two-forces',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Explain why a force of ${a} N and a force of ${b} N acting along the same straight line can only have a resultant of ${a + b} N or ${a - b} N. State the direction of the resultant in each case.`,
    answer: `Along one line the forces either act in the same direction, when they add (${a} + ${b} = ${a + b} N, in the direction of both forces), or in opposite directions, when they subtract (${a} − ${b} = ${a - b} N, in the direction of the ${a} N force). There is no other possibility in one dimension.`,
    explanation: 'In one dimension a vector can only point one way or the other along the line, so only the two sums are possible. In two dimensions the resultant could take any value in between, which is Grade 11 work.',
    memo: [
      { code: 'R', marks: 1, text: `same direction: add, ${a + b} N in that direction` },
      { code: 'R', marks: 1, text: `opposite directions: subtract, ${a - b} N` },
      { code: 'A', marks: 1, text: `in the direction of the ${a} N force` },
    ],
  })
}
out.push({
  ...VEC,
  id: 'vg-10-vectors-explain-equilibrant',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 3,
  prompt: 'Explain what is meant by the equilibrant of a set of forces, and how it is related to their resultant. The resultant of three forces on a crate is 7 N to the left: state the equilibrant.',
  answer: 'The equilibrant is the single force that keeps the object in equilibrium when it acts together with the other forces. It is equal in magnitude to the resultant and opposite in direction. Equilibrant: 7 N to the right.',
  explanation: 'Adding the equilibrant to the forces makes the net force zero, which can only happen if it exactly cancels their resultant: same size, opposite direction.',
  memo: [
    { code: 'A', marks: 1, text: 'the force that keeps the object in equilibrium' },
    { code: 'R', marks: 1, text: 'equal in magnitude, opposite in direction to the resultant' },
    { code: 'A', marks: 1, text: '7 N to the right' },
  ],
})
out.push({
  ...VEC,
  id: 'vg-10-vectors-explain-velocities',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 3,
  prompt: 'Why is it wrong to say that a velocity of 5 m·s⁻¹ north added to a velocity of 3 m·s⁻¹ south gives 8 m·s⁻¹? Give the correct resultant.',
  answer: 'Velocity is a vector, so its direction counts: north and south are opposite, so the velocities subtract. Resultant = 5 − 3 = 2 m·s⁻¹ north.',
  explanation: 'Only scalars, such as speeds, can be added as plain numbers. Taking north as positive, the south velocity is −3 m·s⁻¹, and 5 + (−3) = 2 m·s⁻¹, positive, so north.',
  memo: [
    { code: 'R', marks: 1, text: 'velocity is a vector: direction counts' },
    { code: 'M', marks: 1, text: 'opposite directions subtract' },
    { code: 'A', marks: 1, text: '2 m·s⁻¹ north' },
  ],
})

// --- Draw a vector diagram (tail to head, to scale)
{
  const forces = [8, -6, 4]
  const scale = 2
  const r = forces.reduce((s, x) => s + x, 0)
  out.push({
    ...VEC,
    id: 'vg-10-vectors-draw-forces',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Three forces act on a box along a straight line: 8 N east, 6 N west and 4 N east. Draw a labelled vector diagram, tail to head, using the scale 1 cm : ${scale} N, and use it to find the resultant force.`,
    answer: `Arrows of ${forces.map((x) => n(Math.abs(x) / scale, 1) + ' cm').join(', ')} (east, west, east), drawn tail to head, offset so they do not overlap. The resultant runs from the tail of the first to the head of the last: ${n(r / scale, 1)} cm, so ${n(r, 1)} N east.`,
    explanation: `Each arrow's length is its force ÷ ${scale}: 8 N → 4 cm, 6 N → 3 cm, 4 N → 2 cm. Tail to head, the arrows end ${n(r / scale, 1)} cm east of where they began, and ${n(r / scale, 1)} cm × ${scale} N/cm = ${n(r, 1)} N. Check: 8 − 6 + 4 = ${r} N east.`,
    memo: [
      { code: 'M', marks: 1, text: 'scale used: 4 cm, 3 cm, 2 cm' },
      { code: 'M', marks: 1, text: 'arrows drawn tail to head, in the right directions' },
      { code: 'A', marks: 1, text: 'forces labelled with size and direction' },
      { code: 'A', marks: 1, text: 'resultant drawn from first tail to last head' },
      { code: 'A', marks: 1, text: `${r} N east` },
    ],
  })
}
{
  const legs = [50, -80, 20]
  const scale = 10
  const r = legs.reduce((s, x) => s + x, 0)
  out.push({
    ...VEC,
    id: 'vg-10-vectors-draw-displacement',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A dog runs 50 m north, then 80 m south, then 20 m north. Draw a labelled vector diagram using the scale 1 cm : ${scale} m, and use it to determine the dog's resultant displacement.`,
    answer: `Arrows of 5 cm north, 8 cm south and 2 cm north, tail to head. The resultant arrow is ${n(Math.abs(r) / scale, 1)} cm long, pointing ${r < 0 ? 'south' : 'north'}: ${Math.abs(r)} m ${r < 0 ? 'south' : 'north'}.`,
    explanation: `With north positive: 50 − 80 + 20 = ${r} m, so ${Math.abs(r)} m ${r < 0 ? 'south' : 'north'} of the start, which the diagram shows as a ${n(Math.abs(r) / scale, 1)} cm arrow.`,
    memo: [
      { code: 'M', marks: 1, text: 'arrows 5 cm, 8 cm and 2 cm to scale' },
      { code: 'M', marks: 1, text: 'tail to head, labelled' },
      { code: 'A', marks: 1, text: 'resultant from start to end' },
      { code: 'A', marks: 1, text: `${Math.abs(r)} m ${r < 0 ? 'south' : 'north'}` },
    ],
  })
}
out.push({
  ...VEC,
  id: 'vg-10-vectors-draw-equal-negative',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 3,
  prompt: 'Draw and label a diagram showing (a) two equal vectors, and (b) a vector P and its negative, −P. State what makes two vectors equal.',
  answer: '(a) Two arrows of the same length pointing the same way. (b) Two arrows of the same length pointing in opposite directions, labelled P and −P. Two vectors are equal when they have the same magnitude AND the same direction (where they are drawn does not matter).',
  explanation: 'A vector is only its size and direction, so moving it without turning or stretching it leaves it the same vector. The negative of a vector has the same size and the opposite direction.',
  memo: [
    { code: 'A', marks: 1, text: 'equal vectors: same length, same direction' },
    { code: 'A', marks: 1, text: 'P and −P: same length, opposite directions, labelled' },
    { code: 'R', marks: 1, text: 'equal: same magnitude and same direction' },
  ],
})

// --- Compare / distinguish
out.push({
  ...VEC,
  id: 'vg-10-vectors-tabulate',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 5,
  prompt: 'Distinguish between a scalar and a vector quantity. Then tabulate these quantities as scalars or vectors: mass, weight, speed, velocity, distance, displacement, time, acceleration.',
  answer: 'A scalar has magnitude only; a vector has magnitude and direction. Scalars: mass, speed, distance, time. Vectors: weight, velocity, displacement, acceleration.',
  explanation: 'Ask whether the quantity can point somewhere. Weight is a force, which acts in a direction (down), so it is a vector; mass is the amount of matter and has no direction.',
  memo: [
    { code: 'A', marks: 1, text: 'scalar: magnitude only' },
    { code: 'A', marks: 1, text: 'vector: magnitude and direction' },
    { code: 'A', marks: 1, text: 'scalars: mass, speed, distance, time' },
    { code: 'A', marks: 1, text: 'vectors: weight, velocity, displacement, acceleration' },
    { code: 'A', marks: 1, text: 'table correctly headed' },
  ],
})
out.push({
  ...VEC,
  id: 'vg-10-vectors-distinguish-lap',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  prompt: 'Distinguish between distance and displacement, using an athlete who runs exactly one lap of a 400 m athletics track and stops where she started.',
  answer: 'Distance is the total length of the path travelled (a scalar): 400 m. Displacement is the change in position from start to end, with direction (a vector): 0 m, because she ends where she started.',
  explanation: 'However far she ran, her position at the end is the same as at the start, so there is no displacement. That is the clearest case of the two differing.',
  memo: [
    { code: 'A', marks: 1, text: 'distance: total path length, scalar' },
    { code: 'A', marks: 1, text: 'displacement: change in position, vector' },
    { code: 'A', marks: 1, text: 'distance 400 m' },
    { code: 'A', marks: 1, text: 'displacement 0 m' },
  ],
})
{
  const [d, t] = [30, 1]
  out.push({
    ...VEC,
    id: 'vg-10-vectors-compare-speed-velocity',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `A taxi drives ${d} km east and then ${d} km back west to where it started, taking ${t} h altogether. Compare its average speed with its average velocity for the trip by calculating both.`,
    answer: `Average speed = total distance ÷ time = ${2 * d} km ÷ ${t} h = ${(2 * d) / t} km·h⁻¹. Average velocity = displacement ÷ time = 0 km ÷ ${t} h = 0 km·h⁻¹. The speed is not zero but the velocity is, because velocity uses displacement, a vector.`,
    explanation: 'Speed and velocity differ exactly as distance and displacement do: the taxi covered 60 km of road, but its change in position is zero.',
    memo: [
      { code: 'M', marks: 1, text: 'speed = distance ÷ time' },
      { code: 'A', marks: 1, text: `${(2 * d) / t} km·h⁻¹` },
      { code: 'M', marks: 1, text: 'velocity = displacement ÷ time' },
      { code: 'A', marks: 1, text: '0 km·h⁻¹' },
      { code: 'R', marks: 1, text: 'velocity uses displacement (vector)' },
    ],
  })
}

// =========================================== BIODIVERSITY IN ANIMALS, GRADE 11

const BIO = { topicId: 'life-sci-biodiversity-animals', grade: 11 as Grade }

// --- Earthworms (Annelida) in a choice chamber: moist or dry?
{
  const worms = 10
  const moist = [8, 9, 7, 9, 8]
  const m = mean(moist)
  investigation(
    BIO.topicId,
    BIO.grade,
    'lb-11-animals-earthworm-moisture',
    `Learners investigated whether earthworms (phylum Annelida) prefer moist or dry soil. They half-filled a choice chamber with moist soil and half with dry soil, kept it in the dark at room temperature, placed ${worms} earthworms on the line between the halves, and counted the worms on each side after 15 minutes. They repeated this five times with fresh soil, then returned the earthworms to the garden.\n${table(
      'RESULTS',
      ['Trial', 'Number on moist soil', 'Number on dry soil'],
      moist.map((x, i) => [`${i + 1}`, `${x}`, `${worms - x}`]),
    )}`,
    {
      marks: 5,
      prompt: 'State a hypothesis for this investigation. Name the independent and the dependent variable and TWO variables that were kept constant. Why was the investigation repeated five times?',
      answer:
        'Hypothesis: earthworms prefer moist soil to dry soil (more earthworms will be found on the moist soil). Independent variable: the moisture of the soil. Dependent variable: the number of earthworms on each side. Constant: temperature, light (dark), type of soil, number of earthworms, time allowed. Repeated to make the results reliable.',
      explanation: 'A hypothesis is a testable statement that predicts the result. The moisture is what the learners set up differently; the number of worms on each side is what they count. Repeating the trials shows whether the pattern is consistent rather than chance.',
      memo: [
        { code: 'A', marks: 1, text: 'hypothesis predicting the preference' },
        { code: 'A', marks: 1, text: 'independent: moisture of the soil' },
        { code: 'A', marks: 1, text: 'dependent: number of earthworms on each side' },
        { code: 'A', marks: 1, text: 'TWO constants (temperature, light, soil type, number, time)' },
        { code: 'R', marks: 1, text: 'repetition improves reliability' },
      ],
    },
    {
      marks: 6,
      prompt: 'Calculate the mean number of earthworms found on the moist soil, and the percentage of the earthworms this represents. Write a conclusion, and explain the result in terms of how an earthworm exchanges gases.',
      answer: `Mean = (${moist.join(' + ')}) ÷ 5 = ${n(m, 1)}; percentage = ${n(m, 1)} ÷ ${worms} × 100 = ${n((m / worms) * 100, 0)}%. Conclusion: earthworms prefer moist soil. An earthworm has no lungs: it exchanges gases through its thin skin, which must stay moist for oxygen to dissolve and diffuse in, so it moves away from dry soil.`,
      explanation: `The total is ${moist.reduce((a, b) => a + b, 0)} earthworms over 5 trials, so the mean is ${n(m, 1)} out of ${worms}, or ${n((m / worms) * 100, 0)}%. Annelids are soft-bodied with a thin, moist body wall; drying out would stop gas exchange.`,
      memo: [
        { code: 'M', marks: 1, text: 'sum ÷ 5' },
        { code: 'A', marks: 1, text: `mean = ${n(m, 1)}` },
        { code: 'A', marks: 1, text: `${n((m / worms) * 100, 0)}%` },
        { code: 'C', marks: 1, text: 'earthworms prefer moist soil' },
        { code: 'R', marks: 1, text: 'gas exchange through the skin' },
        { code: 'R', marks: 1, text: 'skin must be moist for gases to dissolve/diffuse' },
      ],
    },
  )
}

// --- Daphnia (an arthropod): heart rate and temperature
{
  const temps = [10, 15, 20, 25]
  const beats = [
    [150, 156, 147],
    [198, 204, 195],
    [252, 246, 258],
    [300, 309, 297],
  ]
  const means = beats.map(mean)
  const rise = ((means[3] - means[0]) / means[0]) * 100
  investigation(
    BIO.topicId,
    BIO.grade,
    'lb-11-animals-daphnia-temperature',
    `Daphnia (the water flea) is a small arthropod with a transparent body, so its heart can be seen beating under a microscope. Learners placed a Daphnia in a drop of pond water on a cavity slide, warmed the water to each temperature in a water bath, and counted the heartbeats for one minute. They used three Daphnia at each temperature, and returned them to pond water afterwards.\n${table(
      'RESULTS',
      ['Temperature (°C)', 'Daphnia 1 (beats/min)', 'Daphnia 2 (beats/min)', 'Daphnia 3 (beats/min)', 'Mean (beats/min)'],
      temps.map((t, i) => [`${t}`, ...beats[i].map(String), i === 1 ? '?' : n(means[i], 0)]),
    )}`,
    {
      marks: 4,
      prompt: 'Write down the aim of this investigation, and identify the independent and the dependent variable. Explain why three Daphnia were used at each temperature.',
      answer:
        'Aim: to investigate the effect of temperature on the heart rate of Daphnia. Independent variable: temperature. Dependent variable: heart rate (beats per minute). Three Daphnia were used so that a mean could be taken, which makes the results more reliable (one Daphnia may not be typical).',
      explanation: 'Individual animals differ, so a single animal at each temperature could give an unusual reading. Averaging three reduces the effect of any one.',
      memo: [
        { code: 'A', marks: 1, text: 'aim: effect of temperature on heart rate' },
        { code: 'A', marks: 1, text: 'independent: temperature' },
        { code: 'A', marks: 1, text: 'dependent: heart rate' },
        { code: 'R', marks: 1, text: 'a mean of several makes the results reliable' },
      ],
    },
    {
      marks: 6,
      prompt: `Calculate the missing mean heart rate at ${temps[1]} °C, and the percentage increase in the mean heart rate from ${temps[0]} °C to ${temps[3]} °C. Daphnia is an ectotherm: describe the trend and explain it.`,
      answer: `Mean at ${temps[1]} °C = (${beats[1].join(' + ')}) ÷ 3 = ${n(means[1], 0)} beats/min. Increase = (${n(means[3], 0)} − ${n(means[0], 0)}) ÷ ${n(means[0], 0)} × 100 = ${n(rise, 1)}%. Trend: the heart rate increases as the temperature increases. Daphnia is an ectotherm: its body temperature follows the water temperature, and warmer conditions speed up its metabolism (enzyme activity), so the heart beats faster.`,
      explanation: `The heart rate roughly doubles between ${temps[0]} °C and ${temps[3]} °C. Arthropods do not keep a constant body temperature, so the rate of their body processes depends on their surroundings.`,
      memo: [
        { code: 'A', marks: 1, text: `${n(means[1], 0)} beats/min` },
        { code: 'M', marks: 1, text: 'difference ÷ original × 100' },
        { code: 'A', marks: 1, text: `${n(rise, 1)}%` },
        { code: 'A', marks: 1, text: 'heart rate increases with temperature' },
        { code: 'R', marks: 1, text: 'ectotherm: body temperature follows surroundings' },
        { code: 'R', marks: 1, text: 'faster metabolism / enzyme activity' },
      ],
    },
  )
}

// --- Calculate: surface area to volume, flat worm against round worm
{
  const box = { l: 20, w: 5, h: 0.5 }
  const boxSa = 2 * (box.l * box.w + box.l * box.h + box.w * box.h)
  const boxV = box.l * box.w * box.h
  const cyl = { r: 3, l: 100 }
  const cylSa = 2 * Math.PI * cyl.r * cyl.l + 2 * Math.PI * cyl.r ** 2
  const cylV = Math.PI * cyl.r ** 2 * cyl.l
  out.push({
    ...BIO,
    id: 'lb-11-animals-surface-volume',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    prompt: `A flatworm (phylum Platyhelminthes) can be modelled as a block ${box.l} mm long, ${box.w} mm wide and ${n(box.h, 1)} mm thick. An earthworm (phylum Annelida) can be modelled as a cylinder ${cyl.l} mm long with a radius of ${cyl.r} mm. Calculate the surface area to volume ratio of each, and explain why the flatworm needs no blood system while the earthworm has one. (Area of a cylinder = 2πrl + 2πr²; volume = πr²l.)`,
    answer: `Flatworm: SA = 2(${box.l} × ${box.w} + ${box.l} × ${n(box.h, 1)} + ${box.w} × ${n(box.h, 1)}) = ${n(boxSa, 1)} mm²; V = ${n(boxV, 1)} mm³; ratio = ${n(boxSa / boxV, 1)} : 1. Earthworm: SA = ${n(cylSa, 1)} mm²; V = ${n(cylV, 1)} mm³; ratio = ${n(cylSa / cylV, 2)} : 1. The flat body gives a large surface for its volume and no cell is far from the surface, so oxygen reaches every cell by diffusion alone. The thicker earthworm has a much smaller ratio, so diffusion is too slow and a blood system carries oxygen to its cells.`,
    explanation: `The flatworm's ratio is about ${n(boxSa / boxV / (cylSa / cylV), 0)} times the earthworm's. Being flat is how flatworms manage without circulatory or respiratory systems, a key feature of the phylum.`,
    memo: [
      { code: 'A', marks: 1, text: `flatworm SA ${n(boxSa, 1)} mm², V ${n(boxV, 1)} mm³` },
      { code: 'A', marks: 1, text: `ratio ${n(boxSa / boxV, 1)} : 1` },
      { code: 'A', marks: 1, text: `earthworm SA ${n(cylSa, 1)} mm², V ${n(cylV, 1)} mm³` },
      { code: 'A', marks: 1, text: `ratio ${n(cylSa / cylV, 2)} : 1` },
      { code: 'R', marks: 1, text: 'flatworm: large ratio, diffusion is enough' },
      { code: 'R', marks: 1, text: 'earthworm: small ratio, needs transport' },
    ],
  })
}

// --- Calculate: a leaf-litter survey
{
  const counts = { Arthropoda: 146, Annelida: 18, Platyhelminthes: 6, Chordata: 4 }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  out.push({
    ...BIO,
    id: 'lb-11-animals-leaf-litter',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context: table(
      'ANIMALS FOUND IN 1 m² OF LEAF LITTER',
      ['Phylum', 'Number of animals'],
      Object.entries(counts).map(([p, c]) => [p, `${c}`]),
    ),
    prompt: 'Calculate the percentage of the animals found that were arthropods. Give TWO features of arthropods that help explain why they are the most successful animal phylum.',
    answer: `Total = ${Object.values(counts).join(' + ')} = ${total}. Arthropods = ${counts.Arthropoda} ÷ ${total} × 100 = ${n((counts.Arthropoda / total) * 100, 1)}%. Features: a hard exoskeleton that protects them and stops them drying out; jointed limbs for movement; many reproduce quickly in large numbers (any TWO).`,
    explanation: 'The exoskeleton of chitin is the key to living on land: it supports, protects and keeps water in. Jointed limbs and specialised mouthparts let arthropods live in almost every habitat and eat almost anything.',
    memo: [
      { code: 'A', marks: 1, text: `total ${total}` },
      { code: 'M', marks: 1, text: 'arthropods ÷ total × 100' },
      { code: 'A', marks: 1, text: `${n((counts.Arthropoda / total) * 100, 1)}%` },
      { code: 'A', marks: 2, text: 'TWO features (exoskeleton, jointed limbs, rapid reproduction)' },
    ],
  })
}

// --- Draw labelled diagrams of body plans
out.push({
  ...BIO,
  id: 'lb-11-animals-draw-germ-layers',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 6,
  prompt: 'Draw labelled diagrams of a cross-section through the body of (a) a diploblastic animal and (b) a triploblastic coelomate animal, to show the difference between them. Name a phylum for each.',
  answer: '(a) Two layers, ectoderm (outer) and endoderm (inner), with jelly-like mesoglea between them around the gut cavity; e.g. Cnidaria. (b) Three layers, ectoderm, mesoderm and endoderm, with a fluid-filled coelom inside the mesoderm, between the body wall and the gut; e.g. Annelida (or Arthropoda, Chordata).',
  explanation: 'Diploblastic means two germ layers; triploblastic adds the mesoderm, from which muscles and organs develop. The coelom is a cavity lined by mesoderm, so only triploblastic animals can have one.',
  memo: [
    { code: 'A', marks: 1, text: '(a) ectoderm and endoderm labelled' },
    { code: 'A', marks: 1, text: '(a) mesoglea / gut cavity' },
    { code: 'A', marks: 1, text: '(b) ectoderm, mesoderm, endoderm labelled' },
    { code: 'A', marks: 1, text: '(b) coelom shown within the mesoderm' },
    { code: 'A', marks: 1, text: 'Cnidaria for (a)' },
    { code: 'A', marks: 1, text: 'Annelida / Arthropoda / Chordata for (b)' },
  ],
})
out.push({
  ...BIO,
  id: 'lb-11-animals-draw-symmetry',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 5,
  prompt: 'Draw simple labelled diagrams to show radial symmetry and bilateral symmetry, marking the plane or planes of symmetry on each. Name ONE phylum with each kind of symmetry, and state ONE advantage of bilateral symmetry.',
  answer: 'Radial: a round body (e.g. a jellyfish seen from above) with several planes through the centre. Bilateral: a body with a head and tail end (e.g. a flatworm) with ONE plane dividing it into mirror-image left and right halves. Radial: Cnidaria. Bilateral: Platyhelminthes, Annelida, Arthropoda or Chordata. Advantage: a front end that meets the environment first, so sense organs gather there (cephalisation) and the animal moves forward efficiently.',
  explanation: 'Radially symmetrical animals meet their surroundings equally from all sides, which suits sitting still or drifting. Bilateral symmetry goes with directed movement and a head.',
  memo: [
    { code: 'A', marks: 1, text: 'radial: several planes through the centre' },
    { code: 'A', marks: 1, text: 'bilateral: one plane, left and right halves' },
    { code: 'A', marks: 1, text: 'radial phylum: Cnidaria' },
    { code: 'A', marks: 1, text: 'bilateral phylum named' },
    { code: 'R', marks: 1, text: 'cephalisation / efficient forward movement' },
  ],
})
out.push({
  ...BIO,
  id: 'lb-11-animals-draw-gut',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 5,
  prompt: 'Draw labelled diagrams of an animal with a blind gut (one opening) and an animal with a through gut (two openings). Name a phylum for each, and explain ONE advantage of a through gut.',
  answer: 'Blind gut: a sac-like gut with a single opening that is both mouth and anus; e.g. Cnidaria or Platyhelminthes. Through gut: a tube from mouth to anus; e.g. Annelida, Arthropoda or Chordata. Advantage: food moves in one direction, so different regions can specialise (digestion, absorption) and the animal can feed continuously while waste leaves separately.',
  explanation: 'In a blind gut food and waste use the same opening, so the gut must empty before the animal feeds again. A through gut works like a production line.',
  memo: [
    { code: 'A', marks: 1, text: 'blind gut: one opening labelled mouth/anus' },
    { code: 'A', marks: 1, text: 'through gut: mouth and anus labelled' },
    { code: 'A', marks: 1, text: 'phylum for the blind gut' },
    { code: 'A', marks: 1, text: 'phylum for the through gut' },
    { code: 'R', marks: 1, text: 'one-way flow: specialised regions / continuous feeding' },
  ],
})

export const scienceGapQuestions: Question[] = out
