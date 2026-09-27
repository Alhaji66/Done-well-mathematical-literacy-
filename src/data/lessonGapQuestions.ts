/**
 * Mathematics, Physical Sciences and Life Sciences questions for the
 * sub-topics the lesson plans found empty. The Mat Lit ones are in
 * matlitLessonGaps.ts, for the same reason and in the same way.
 *
 *   Word problems and setting up equations, Mathematics Grade 10 -- 4.
 *   When friction acts, Physical Sciences Grade 10 -- 4.
 *   Safety applications of momentum, Physical Sciences Grade 12 -- 3.
 *   The work-energy theorem, Physical Sciences Grade 12 -- 3 named, once the
 *     rule in subtopics.ts stopped the scorer filing the rest elsewhere.
 *   Reproduction in angiosperms, Life Sciences Grade 11 -- mostly a filing
 *     fix (see subtopics.ts); four questions here cover the note's new point
 *     on why seeds matter to people.
 *
 * Every number is computed from the values declared with it. Physical
 * Sciences uses g = 9,8 m·s⁻² and writes numbers with a decimal comma.
 */
import type { Question } from '@/types'

/** A number with a decimal comma, to `dp` places, trailing zeros dropped. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(r).split('.')
  return whole.replace('-', '−').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}

const g = 9.8
const out: Question[] = []

/* ===================================================================== */
/* Word problems and setting up equations, Mathematics Grade 10          */
/* ===================================================================== */

const alg10 = { topicId: 'math-algebra', grade: 10 } as const

{
  const sum = 84
  const a = (sum - 3) / 3
  out.push({
    ...alg10,
    id: 'lg-m10-word-consecutive-84',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `The sum of three consecutive integers is ${sum}. Find the integers.`,
    answer: `${a}, ${a + 1} and ${a + 2}`,
    explanation: `Let the integers be x, x + 1 and x + 2. Then 3x + 3 = ${sum}, so 3x = ${sum - 3} and x = ${a}. Check: ${a} + ${a + 1} + ${a + 2} = ${sum}.`,
    memo: [
      { code: 'M', marks: 1, text: 'x + (x + 1) + (x + 2) = ' + sum },
      { code: 'A', marks: 1, text: `x = ${a}` },
      { code: 'CA', marks: 1, text: `${a}, ${a + 1}, ${a + 2}` },
    ],
  })
}

{
  // 3x + 12 = 2(x + 12)
  const x = 12
  out.push({
    ...alg10,
    id: 'lg-m10-word-ages',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Thabo is three times as old as his daughter. In 12 years\' time he will be twice as old as she will be then. Let x be the daughter\'s age now. Set up an equation and find both of their ages now.',
    answer: `The daughter is ${x} and Thabo is ${3 * x}.`,
    explanation: `Now: daughter x, Thabo 3x. In 12 years: x + 12 and 3x + 12. So 3x + 12 = 2(x + 12) = 2x + 24, which gives x = ${x}. Thabo is 3 × ${x} = ${3 * x}. Check: in 12 years they will be ${x + 12} and ${3 * x + 12}, and ${3 * x + 12} = 2 × ${x + 12}.`,
    memo: [
      { code: 'M', marks: 1, text: 'Ages in 12 years: x + 12 and 3x + 12' },
      { code: 'M', marks: 1, text: '3x + 12 = 2(x + 12)' },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'CA', marks: 1, text: `Thabo is ${3 * x}` },
    ],
  })
}

{
  const p = 56
  const x = (p - 8) / 4
  out.push({
    ...alg10,
    id: 'lg-m10-word-garden',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `The length of a rectangular garden is 4 m more than its width, and its perimeter is ${p} m. Let x be the width in metres. Write an equation in x and find the length and the width.`,
    answer: `Width ${x} m, length ${x + 4} m`,
    explanation: `Perimeter = 2(length + width) = 2(x + 4 + x) = 4x + 8. So 4x + 8 = ${p}, 4x = ${p - 8} and x = ${x}. The length is ${x} + 4 = ${x + 4} m.`,
    memo: [
      { code: 'M', marks: 1, text: `2x + 2(x + 4) = ${p}` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'CA', marks: 1, text: `${x + 4} m by ${x} m` },
    ],
  })
}

{
  const [adult, learner, sold, takings] = [50, 30, 220, 8200]
  const x = (takings - learner * sold) / (adult - learner)
  out.push({
    ...alg10,
    id: 'lg-m10-word-tickets',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Adult tickets for a school concert cost R${adult} and learner tickets R${learner}. ${sold} tickets were sold, and the takings were R${takings}. Let x be the number of adult tickets. Set up an equation in x and find how many of each kind were sold.`,
    answer: `${x} adult tickets and ${sold - x} learner tickets`,
    explanation: `If x adult tickets were sold, ${sold} − x learner tickets were. Takings: ${adult}x + ${learner}(${sold} − x) = ${takings}. Expanding, ${adult}x + ${learner * sold} − ${learner}x = ${takings}, so ${adult - learner}x = ${takings - learner * sold} and x = ${x}. Check: ${adult} × ${x} + ${learner} × ${sold - x} = ${adult * x + learner * (sold - x)}.`,
    memo: [
      { code: 'M', marks: 1, text: `Learner tickets: ${sold} − x` },
      { code: 'M', marks: 1, text: `${adult}x + ${learner}(${sold} − x) = ${takings}` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'CA', marks: 1, text: `${sold - x} learner tickets` },
    ],
  })
}

{
  // x + (2x + 9) = 45
  const x = (45 - 9) / 3
  out.push({
    ...alg10,
    id: 'lg-m10-word-sum-two',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'The sum of two numbers is 45. One of them is 9 more than twice the other. Find the two numbers.',
    answer: `${x} and ${2 * x + 9}`,
    explanation: `Let the smaller number be x; the other is 2x + 9. Then x + 2x + 9 = 45, so 3x = 36 and x = ${x}. The other number is 2 × ${x} + 9 = ${2 * x + 9}. Check: ${x} + ${2 * x + 9} = 45.`,
    memo: [
      { code: 'M', marks: 1, text: 'x + (2x + 9) = 45' },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'CA', marks: 1, text: `Other number ${2 * x + 9}` },
    ],
  })
}

{
  const sum = 106
  const x = (sum - 2) / 2
  out.push({
    ...alg10,
    id: 'lg-m10-word-consecutive-even',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `The sum of two consecutive even numbers is ${sum}. Find the numbers.`,
    answer: `${x} and ${x + 2}`,
    explanation: `Consecutive even numbers differ by 2, so call them x and x + 2. Then 2x + 2 = ${sum}, 2x = ${sum - 2} and x = ${x}.`,
    memo: [
      { code: 'M', marks: 1, text: `x + (x + 2) = ${sum}` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'CA', marks: 1, text: `${x} and ${x + 2}` },
    ],
  })
}

{
  const [v1, v2, hours] = [80, 100, 4.5]
  const d = hours / (1 / v1 + 1 / v2)
  out.push({
    ...alg10,
    id: 'lg-m10-word-taxi-trip',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `A taxi drives from one town to another at an average speed of ${v1} km/h and comes back along the same road at ${v2} km/h. The whole round trip takes 4 hours 30 minutes. Let x be the distance between the towns in km. Set up an equation and find x.`,
    answer: `x = ${d} km`,
    explanation: `Time = distance ÷ speed, so the trip there takes x/${v1} hours and the trip back x/${v2} hours. Together: x/${v1} + x/${v2} = 4,5. Multiply every term by 400, the LCM of ${v1} and ${v2}: 5x + 4x = 1 800, so 9x = 1 800 and x = ${d}. Check: ${d}/${v1} = ${d / v1} h and ${d}/${v2} = ${d / v2} h, which add to 4,5 h.`,
    memo: [
      { code: 'M', marks: 1, text: 'Time = distance ÷ speed for each leg' },
      { code: 'M', marks: 1, text: `x/${v1} + x/${v2} = 4,5` },
      { code: 'M', marks: 1, text: 'Multiplied by 400: 9x = 1 800' },
      { code: 'A', marks: 1, text: `x = ${d} km` },
    ],
  })
}

{
  const sum = 57
  const x = (sum - 6) / 3
  out.push({
    ...alg10,
    id: 'lg-m10-word-consecutive-odd',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `The ages of three sisters are consecutive odd numbers, and their ages add up to ${sum}. How old is each sister?`,
    answer: `${x}, ${x + 2} and ${x + 4}`,
    explanation: `Consecutive odd numbers are 2 apart: x, x + 2 and x + 4. So 3x + 6 = ${sum}, 3x = ${sum - 6} and x = ${x}. Check that ${x} is odd — if the equation had given an even number, the problem would have no answer.`,
    memo: [
      { code: 'M', marks: 1, text: `x + (x + 2) + (x + 4) = ${sum}` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'CA', marks: 1, text: `${x}, ${x + 2}, ${x + 4}` },
    ],
  })
}

/* ===================================================================== */
/* Analytical geometry, Mathematics Grade 10 -- for the consolidation     */
/* lesson, which found every question already used by the lessons before  */
/* ===================================================================== */

const ag10 = { topicId: 'math-analytical-geometry', grade: 10 } as const
const pt = (label: string, x: number, y: number) => `${label}(${n(x)} ; ${n(y)})`

{
  const [p, q] = [
    [-3, 2],
    [5, 8],
  ]
  const d = Math.hypot(q[0] - p[0], q[1] - p[1])
  out.push({
    ...ag10,
    id: 'lg-m10-ag-map-distance',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `On a town map drawn on a grid where 1 unit represents 100 m, the taxi rank is at ${pt('P', p[0], p[1])} and the school at ${pt('Q', q[0], q[1])}. Calculate the straight-line distance from the taxi rank to the school in metres.`,
    answer: `${n(d * 100)} m`,
    explanation: `PQ = √[(${q[0]} − (${n(p[0])}))² + (${q[1]} − ${p[1]})²] = √(${(q[0] - p[0]) ** 2} + ${(q[1] - p[1]) ** 2}) = √${(q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2} = ${n(d)} units. At 100 m per unit that is ${n(d * 100)} m.`,
    memo: [
      { code: 'SF', marks: 1, text: 'Distance formula with P and Q substituted' },
      { code: 'A', marks: 1, text: `√${(q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2}` },
      { code: 'A', marks: 1, text: `${n(d)} units` },
      { code: 'CA', marks: 1, text: `${n(d * 100)} m` },
    ],
  })
}

{
  const [a, b] = [
    [-4, 7],
    [6, -1],
  ]
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const sq = (m[0] - a[0]) ** 2 + (m[1] - a[1]) ** 2
  out.push({
    ...ag10,
    id: 'lg-m10-ag-midpoint-half',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `M is the midpoint of ${pt('A', a[0], a[1])} and ${pt('B', b[0], b[1])}. Calculate the coordinates of M, and the length of AM in simplest surd form.`,
    answer: `${pt('M', m[0], m[1])}; AM = √${sq}`,
    explanation: `M = ((${n(a[0])} + ${b[0]}) ÷ 2 ; (${a[1]} + (${n(b[1])})) ÷ 2) = (${n(m[0])} ; ${n(m[1])}). AM = √[(${n(m[0])} − (${n(a[0])}))² + (${n(m[1])} − ${a[1]})²] = √${sq}. As a check, AB = √${4 * sq} = 2√${sq}, twice AM.`,
    memo: [
      { code: 'SF', marks: 1, text: 'Midpoint formula' },
      { code: 'A', marks: 1, text: `M(${n(m[0])} ; ${n(m[1])})` },
      { code: 'SF', marks: 1, text: 'Distance formula for AM' },
      { code: 'CA', marks: 1, text: `√${sq}` },
    ],
  })
}

out.push({
  ...ag10,
  id: 'lg-m10-ag-perp-gradient',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Line AB has a gradient of 2/3. Line CD is perpendicular to AB. Write down the gradient of CD, and state the rule you used.',
  answer: 'm(CD) = −3/2, because the product of the gradients of perpendicular lines is −1.',
  explanation: 'Flip the fraction and change the sign: 2/3 × (−3/2) = −1.',
  memo: [
    { code: 'A', marks: 1, text: '−3/2' },
    { code: 'R', marks: 1, text: 'Product of gradients of perpendicular lines is −1' },
  ],
})

{
  const [a, b, cy] = [[1, 2], [3, 6], 12]
  const grad = (b[1] - a[1]) / (b[0] - a[0])
  const k = a[0] + (cy - a[1]) / grad
  out.push({
    ...ag10,
    id: 'lg-m10-ag-collinear-k',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `The points ${pt('A', a[0], a[1])}, ${pt('B', b[0], b[1])} and C(k ; ${cy}) are collinear. Calculate the value of k.`,
    answer: `k = ${n(k)}`,
    explanation: `Collinear points lie on one line, so the gradient from A to C equals the gradient from A to B. m(AB) = (${b[1]} − ${a[1]}) ÷ (${b[0]} − ${a[0]}) = ${n(grad)}. Then (${cy} − ${a[1]}) ÷ (k − ${a[0]}) = ${n(grad)}, so ${cy - a[1]} = ${n(grad)}(k − ${a[0]}) and k = ${n(k)}.`,
    memo: [
      { code: 'A', marks: 1, text: `m(AB) = ${n(grad)}` },
      { code: 'M', marks: 1, text: 'm(AC) = m(AB)' },
      { code: 'S', marks: 1, text: `(${cy} − ${a[1]}) ÷ (k − ${a[0]}) = ${n(grad)}` },
      { code: 'A', marks: 1, text: `k = ${n(k)}` },
    ],
  })
}

out.push({
  ...ag10,
  id: 'lg-m10-ag-equilateral',
  difficulty: 'Challenge',
  cognitiveLevel: 3,
  marks: 4,
  prompt: 'Triangle PQR has vertices P(0 ; 0), Q(4 ; 0) and R(2 ; 2√3). Calculate the length of each side, and hence show that the triangle is equilateral.',
  answer: 'PQ = 4, QR = 4 and PR = 4, so all three sides are equal and the triangle is equilateral.',
  explanation: 'PQ = √(4² + 0²) = 4. QR = √[(2 − 4)² + (2√3)²] = √(4 + 12) = √16 = 4. PR = √[2² + (2√3)²] = √(4 + 12) = 4. Squaring 2√3 gives 4 × 3 = 12, not 2 × 3.',
  memo: [
    { code: 'A', marks: 1, text: 'PQ = 4' },
    { code: 'A', marks: 1, text: 'QR = √16 = 4' },
    { code: 'A', marks: 1, text: 'PR = √16 = 4' },
    { code: 'J', marks: 1, text: 'All sides equal, so equilateral' },
  ],
})

{
  const [a, c] = [[-1, 4], [5, -2]]
  const m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2]
  out.push({
    ...ag10,
    id: 'lg-m10-ag-square-diagonals',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `${pt('A', a[0], a[1])} and ${pt('C', c[0], c[1])} are opposite vertices of square ABCD. The diagonals of a square bisect each other. Calculate the coordinates of the point where the diagonals meet.`,
    answer: `(${n(m[0])} ; ${n(m[1])})`,
    explanation: `The diagonals bisect each other, so they meet at the midpoint of AC: ((${n(a[0])} + ${c[0]}) ÷ 2 ; (${a[1]} + (${n(c[1])})) ÷ 2) = (${n(m[0])} ; ${n(m[1])}).`,
    memo: [
      { code: 'M', marks: 1, text: 'Midpoint of AC' },
      { code: 'A', marks: 1, text: `(${n(m[0])} ; ${n(m[1])})` },
    ],
  })
}

/* ===================================================================== */
/* When friction acts, Physical Sciences Grade 10                          */
/* ===================================================================== */

const mech10 = { topicId: 'phys-mechanical-energy-g10', grade: 10 } as const

out.push({
  ...mech10,
  id: 'lg-ps10-friction-why',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Explain why mechanical energy is not conserved when friction acts on a moving object, and state what happens to the energy that seems to be missing.',
  answer:
    'Friction converts some of the mechanical energy into heat (thermal energy) and sound, which are not part of mechanical energy. The energy is not destroyed: the total energy of the system is still conserved.',
  explanation: 'Mechanical energy is kinetic plus gravitational potential energy only. Friction moves energy out of that total into forms the sum does not count.',
  memo: [
    { code: 'A', marks: 1, text: 'Friction converts mechanical energy into heat and sound' },
    { code: 'A', marks: 1, text: 'Total energy is still conserved' },
  ],
})

{
  const [m, h, v] = [2, 1.5, 4]
  const ep = m * g * h
  const ek = 0.5 * m * v * v
  out.push({
    ...mech10,
    id: 'lg-ps10-friction-ramp',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `A ${m} kg box slides from rest down a rough ramp from a height of ${n(h)} m and reaches the bottom at ${v} m·s⁻¹. Calculate how much mechanical energy friction converted to heat and sound.`,
    answer: `${n(ep - ek)} J`,
    explanation: `At the top: Ep = mgh = ${m} × 9,8 × ${n(h)} = ${n(ep)} J, and Ek = 0. At the bottom: Ek = ½mv² = ½ × ${m} × ${v}² = ${n(ek)} J, and Ep = 0. The difference, ${n(ep)} − ${n(ek)} = ${n(ep - ek)} J, is the energy friction converted to heat and sound.`,
    memo: [
      { code: 'SF', marks: 1, text: `Ep = ${m} × 9,8 × ${n(h)} = ${n(ep)} J` },
      { code: 'SF', marks: 1, text: `Ek = ½ × ${m} × ${v}² = ${n(ek)} J` },
      { code: 'M', marks: 1, text: 'Energy converted = Ep(top) − Ek(bottom)' },
      { code: 'A', marks: 1, text: `${n(ep - ek)} J` },
    ],
  })
}

{
  const [m, h, lost] = [60, 3, 0.4]
  const ep = m * g * h
  const ek = ep * (1 - lost)
  const v = Math.sqrt((2 * ek) / m)
  out.push({
    ...mech10,
    id: 'lg-ps10-friction-slide',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${m} kg learner starts from rest at the top of a playground slide ${h} m high. Friction converts 40% of her initial potential energy into heat and sound. Calculate her speed at the bottom of the slide.`,
    answer: `${n(v)} m·s⁻¹`,
    explanation: `Ep at the top = ${m} × 9,8 × ${h} = ${n(ep)} J. Only 60% of it becomes kinetic energy: Ek = 0,6 × ${n(ep)} = ${n(ek)} J. Then ½ × ${m} × v² = ${n(ek)}, so v² = ${n((2 * ek) / m)} and v = ${n(v)} m·s⁻¹.`,
    memo: [
      { code: 'SF', marks: 1, text: `Ep = ${n(ep)} J` },
      { code: 'M', marks: 1, text: `Ek = 60% of Ep = ${n(ek)} J` },
      { code: 'SF', marks: 1, text: `½ × ${m} × v² = ${n(ek)}` },
      { code: 'A', marks: 1, text: `${n(v)} m·s⁻¹` },
    ],
  })
}

{
  const [m, h, v] = [0.5, 10, 13]
  const ep = m * g * h
  const ek = 0.5 * m * v * v
  out.push({
    ...mech10,
    id: 'lg-ps10-friction-air',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A ${n(m)} kg ball is dropped from a height of ${h} m and hits the ground at ${v} m·s⁻¹. Calculate the energy that air friction converted to heat and sound on the way down.`,
    answer: `${n(ep - ek)} J`,
    explanation: `Ep at the top = ${n(m)} × 9,8 × ${h} = ${n(ep)} J. Ek at the ground = ½ × ${n(m)} × ${v}² = ${n(ek)} J. Air friction converted ${n(ep)} − ${n(ek)} = ${n(ep - ek)} J. Without friction the ball would have reached ${n(Math.sqrt(2 * g * h))} m·s⁻¹.`,
    memo: [
      { code: 'SF', marks: 1, text: `Ep = ${n(ep)} J` },
      { code: 'SF', marks: 1, text: `Ek = ${n(ek)} J` },
      { code: 'A', marks: 1, text: `${n(ep - ek)} J` },
    ],
  })
}

{
  const [m, pred, actual] = [75, 12, 9]
  const e1 = 0.5 * m * pred * pred
  const e2 = 0.5 * m * actual * actual
  out.push({
    ...mech10,
    id: 'lg-ps10-friction-cyclist',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A cyclist freewheels down a hill. Ignoring friction, the conservation of mechanical energy predicts a speed of ${pred} m·s⁻¹ at the bottom, but she actually reaches ${actual} m·s⁻¹. The cyclist and bicycle together have a mass of ${m} kg. Calculate the energy converted to heat and sound by friction.`,
    answer: `${n(e1 - e2)} J`,
    explanation: `The prediction corresponds to Ek = ½ × ${m} × ${pred}² = ${n(e1)} J. She actually has ½ × ${m} × ${actual}² = ${n(e2)} J. The difference, ${n(e1 - e2)} J, is what friction converted.`,
    memo: [
      { code: 'SF', marks: 1, text: `Predicted Ek = ${n(e1)} J` },
      { code: 'SF', marks: 1, text: `Actual Ek = ${n(e2)} J` },
      { code: 'A', marks: 1, text: `${n(e1 - e2)} J` },
    ],
  })
}

out.push({
  ...mech10,
  id: 'lg-ps10-friction-destroyed',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'A learner says: "Friction destroys some of a moving object\'s energy." Is the learner correct? Explain.',
  answer:
    'No. Energy cannot be destroyed. Friction transfers some of the object\'s kinetic energy into heat and sound in the object and its surroundings, so the total energy of the system stays the same.',
  explanation: 'This is the law of conservation of energy. What friction changes is how much of the energy is still mechanical energy.',
  memo: [
    { code: 'A', marks: 1, text: 'Not correct: energy is not destroyed' },
    { code: 'R', marks: 1, text: 'It is transferred to heat and sound; the total is conserved' },
  ],
})

{
  const [m, h, v] = [1.2, 0.8, 3.2]
  const ep = m * g * h
  const ek = 0.5 * m * v * v
  const pct = ((ep - ek) / ep) * 100
  out.push({
    ...mech10,
    id: 'lg-ps10-friction-trolley',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A ${n(m)} kg trolley is released from rest at the top of a track ${n(h)} m high, and at the bottom it is moving at ${n(v)} m·s⁻¹. (a) Show by calculation that friction acted on the trolley. (b) What percentage of the trolley's initial mechanical energy was converted to heat and sound?`,
    answer: `(a) Ep at the top is ${n(ep)} J but Ek at the bottom is only ${n(ek)} J, so mechanical energy was not conserved. (b) ${n(pct, 1)}%`,
    explanation: `(a) Ep = ${n(m)} × 9,8 × ${n(h)} = ${n(ep)} J; Ek = ½ × ${n(m)} × ${n(v)}² = ${n(ek)} J. If there were no friction the two would be equal. (b) Energy converted = ${n(ep - ek)} J, and ${n(ep - ek)} ÷ ${n(ep)} × 100 = ${n(pct, 1)}%.`,
    memo: [
      { code: 'SF', marks: 1, text: `Ep = ${n(ep)} J` },
      { code: 'SF', marks: 1, text: `Ek = ${n(ek)} J` },
      { code: 'J', marks: 1, text: 'Ek < Ep, so mechanical energy was not conserved: friction acted' },
      { code: 'M', marks: 1, text: `${n(ep - ek)} ÷ ${n(ep)} × 100` },
      { code: 'A', marks: 1, text: `${n(pct, 1)}%` },
    ],
  })
}

{
  const [m, v] = [5, 3]
  const ek = 0.5 * m * v * v
  out.push({
    ...mech10,
    id: 'lg-ps10-friction-crate',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A ${m} kg crate is given a push along a rough horizontal floor and slides to a stop from ${v} m·s⁻¹. How much mechanical energy does friction convert into heat and sound? Explain why its potential energy plays no part.`,
    answer: `${n(ek)} J. The floor is horizontal, so the crate's height, and therefore its potential energy, does not change: all of its kinetic energy is converted.`,
    explanation: `Ek at the start = ½ × ${m} × ${v}² = ${n(ek)} J, and it ends at rest with Ek = 0. With no change in height there is no change in Ep, so friction converted all ${n(ek)} J.`,
    memo: [
      { code: 'SF', marks: 1, text: `Ek = ½ × ${m} × ${v}²` },
      { code: 'A', marks: 1, text: `${n(ek)} J` },
      { code: 'R', marks: 1, text: 'No change in height, so no change in Ep' },
    ],
  })
}

/* ===================================================================== */
/* Safety applications of momentum, Physical Sciences Grade 12            */
/* ===================================================================== */

const mom12 = { topicId: 'phys-momentum-impulse', grade: 12 } as const

out.push({
  ...mom12,
  id: 'lg-ps12-safety-airbag',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 3,
  prompt: 'Use the relationship FnetΔt = Δp to explain how an airbag reduces the force on a driver\'s head in a collision.',
  answer:
    'The head\'s change in momentum is the same with or without the airbag, because it goes from the same speed to rest. The airbag increases the time Δt over which the head stops. Since Fnet = Δp/Δt, a longer time gives a smaller net force on the head.',
  explanation: 'An airbag does not reduce the change in momentum; it spreads the same change over a longer time.',
  memo: [
    { code: 'A', marks: 1, text: 'Δp is the same either way' },
    { code: 'A', marks: 1, text: 'The airbag increases the contact time' },
    { code: 'R', marks: 1, text: 'Fnet = Δp/Δt, so the force is smaller' },
  ],
})

{
  const [m, v, t1, t2] = [70, 20, 0.4, 0.02]
  const dp = m * v
  out.push({
    ...mom12,
    id: 'lg-ps12-safety-seatbelt',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${m} kg driver moving at ${v} m·s⁻¹ is brought to rest by a seatbelt in ${n(t1)} s. (a) Calculate the magnitude of the average net force on the driver. (b) Without a seatbelt the driver would stop against the dashboard in ${n(t2)} s. Calculate that force.`,
    answer: `(a) ${n(dp / t1)} N; (b) ${n(dp / t2)} N`,
    explanation: `Δp = m(vf − vi) = ${m}(0 − ${v}) = −${n(dp)} kg·m·s⁻¹, magnitude ${n(dp)}. (a) F = Δp/Δt = ${n(dp)} ÷ ${n(t1)} = ${n(dp / t1)} N. (b) ${n(dp)} ÷ ${n(t2)} = ${n(dp / t2)} N — ${n(t1 / t2)} times larger, because the time is ${n(t1 / t2)} times shorter.`,
    memo: [
      { code: 'SF', marks: 1, text: `Δp = ${m}(0 − ${v})` },
      { code: 'SF', marks: 1, text: `F = Δp/Δt with Δt = ${n(t1)} s` },
      { code: 'A', marks: 1, text: `${n(dp / t1)} N` },
      { code: 'A', marks: 1, text: `${n(dp / t2)} N` },
    ],
  })
}

{
  const [m, v, t1, t2] = [1200, 15, 0.05, 0.25]
  const dp = m * v
  out.push({
    ...mom12,
    id: 'lg-ps12-safety-crumple',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${n(m, 0)} kg car travelling at ${v} m·s⁻¹ crashes into a wall and stops. A rigid car stops in ${n(t1)} s; a car with a crumple zone stops in ${n(t2)} s. Calculate the magnitude of the average net force on each car, and state by what factor the crumple zone reduces it.`,
    answer: `Rigid: ${n(dp / t1)} N; crumple zone: ${n(dp / t2)} N; ${n(t2 / t1)} times smaller.`,
    explanation: `Both cars have the same change in momentum: ${n(m, 0)} × ${v} = ${n(dp)} kg·m·s⁻¹. F = Δp/Δt: ${n(dp)} ÷ ${n(t1)} = ${n(dp / t1)} N, and ${n(dp)} ÷ ${n(t2)} = ${n(dp / t2)} N. Making the time ${n(t2 / t1)} times longer makes the force ${n(t2 / t1)} times smaller.`,
    memo: [
      { code: 'A', marks: 1, text: `Δp = ${n(dp)} kg·m·s⁻¹` },
      { code: 'A', marks: 1, text: `${n(dp / t1)} N` },
      { code: 'A', marks: 1, text: `${n(dp / t2)} N` },
      { code: 'CA', marks: 1, text: `${n(t2 / t1)} times smaller` },
    ],
  })
}

out.push({
  ...mom12,
  id: 'lg-ps12-safety-gym-mat',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 3,
  prompt: 'A gymnast lands on thick padding instead of a hard floor. Explain why she is less likely to be injured, although her change in momentum is the same in both cases.',
  answer:
    'The padding compresses as she lands, so she comes to rest over a longer time. With the same change in momentum and a longer time, the net force on her (Fnet = Δp/Δt) is smaller.',
  explanation: 'The same idea explains bending your knees when you land from a jump: the legs make the stop take longer.',
  memo: [
    { code: 'A', marks: 1, text: 'Padding increases the stopping time' },
    { code: 'A', marks: 1, text: 'Δp is unchanged' },
    { code: 'R', marks: 1, text: 'Fnet = Δp/Δt is smaller' },
  ],
})

out.push({
  ...mom12,
  id: 'lg-ps12-safety-features',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Apart from airbags, name TWO safety features of a car that reduce injury by increasing the time over which a collision force acts.',
  answer: 'Any two of: crumple zones; seatbelts, which stretch slightly; a collapsible steering column; padded dashboards and headrests.',
  explanation: 'Each of these lengthens the time over which the occupant or the car comes to rest.',
  memo: [
    { code: 'A', marks: 1, text: 'First feature' },
    { code: 'A', marks: 1, text: 'Second feature' },
  ],
})

{
  const [m, v, t1, t2] = [5, 6, 0.015, 0.002]
  const dp = m * v
  out.push({
    ...mom12,
    id: 'lg-ps12-safety-helmet',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `In a fall, a cyclist's head (mass ${m} kg) moving at ${v} m·s⁻¹ is stopped by the foam lining of a helmet in ${n(t1, 3)} s. Without a helmet it would stop against the road in ${n(t2, 3)} s. Calculate the average force on the head in each case, and explain why a helmet that has cracked in a fall should be replaced.`,
    answer: `With the helmet ${n(dp / t1)} N; without it ${n(dp / t2)} N. A cracked helmet's foam has already been crushed, so it can no longer compress to lengthen the stopping time, and it would not reduce the force in another fall.`,
    explanation: `Δp = ${m} × ${v} = ${dp} kg·m·s⁻¹ either way. F = ${dp} ÷ ${n(t1, 3)} = ${n(dp / t1)} N with the helmet and ${dp} ÷ ${n(t2, 3)} = ${n(dp / t2)} N without: ${n(t1 / t2, 1)} times larger.`,
    memo: [
      { code: 'A', marks: 1, text: `Δp = ${dp} kg·m·s⁻¹` },
      { code: 'A', marks: 1, text: `${n(dp / t1)} N` },
      { code: 'A', marks: 1, text: `${n(dp / t2)} N` },
      { code: 'J', marks: 1, text: 'Crushed foam cannot lengthen the stopping time again' },
    ],
  })
}

/* ===================================================================== */
/* The work-energy theorem, Physical Sciences Grade 12                     */
/* ===================================================================== */

const wep12 = { topicId: 'phys-work-energy-power', grade: 12 } as const

{
  const [m, vi, vf] = [1500, 10, 25]
  const w = 0.5 * m * (vf * vf - vi * vi)
  out.push({
    ...wep12,
    id: 'lg-ps12-wet-car',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A ${n(m, 0)} kg car speeds up from ${vi} m·s⁻¹ to ${vf} m·s⁻¹. Use the work-energy theorem to calculate the net work done on the car.`,
    answer: `${n(w)} J`,
    explanation: `Wnet = ΔEk = ½mvf² − ½mvi² = ½ × ${n(m, 0)} × (${vf}² − ${vi}²) = ½ × ${n(m, 0)} × ${vf * vf - vi * vi} = ${n(w)} J.`,
    memo: [
      { code: 'SF', marks: 1, text: 'Wnet = ½mvf² − ½mvi²' },
      { code: 'S', marks: 1, text: `½ × ${n(m, 0)} × (${vf}² − ${vi}²)` },
      { code: 'A', marks: 1, text: `${n(w)} J` },
    ],
  })
}

{
  const [m, d, F, f] = [5, 8, 30, 12]
  const w = (F - f) * d
  const v = Math.sqrt((2 * w) / m)
  out.push({
    ...wep12,
    id: 'lg-ps12-wet-pulled-block',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `A ${m} kg block starts from rest and is pulled ${d} m across a rough horizontal surface by a constant horizontal force of ${F} N. The kinetic frictional force is ${f} N. Use the work-energy theorem to calculate the block's final speed.`,
    answer: `${n(v)} m·s⁻¹`,
    explanation: `Work by the applied force = ${F} × ${d} × cos 0° = ${F * d} J. Work by friction = ${f} × ${d} × cos 180° = −${f * d} J. The normal force and weight are perpendicular to the motion and do no work. Wnet = ${F * d} − ${f * d} = ${w} J = ½ × ${m} × v² − 0, so v² = ${n((2 * w) / m)} and v = ${n(v)} m·s⁻¹.`,
    memo: [
      { code: 'A', marks: 1, text: `W(applied) = ${F * d} J` },
      { code: 'A', marks: 1, text: `W(friction) = −${f * d} J` },
      { code: 'M', marks: 1, text: 'Wnet = ΔEk' },
      { code: 'S', marks: 1, text: `${w} = ½ × ${m} × v²` },
      { code: 'A', marks: 1, text: `${n(v)} m·s⁻¹` },
    ],
  })
}

{
  const [m, v, d] = [0.15, 30, 0.3]
  const dk = 0.5 * m * v * v
  out.push({
    ...wep12,
    id: 'lg-ps12-wet-catch',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${n(m)} kg cricket ball travelling at ${v} m·s⁻¹ is caught. The fielder's hands move back ${n(d)} m as the ball stops. Use the work-energy theorem to calculate the magnitude of the average force of the hands on the ball.`,
    answer: `${n(dk / d)} N`,
    explanation: `ΔEk = 0 − ½ × ${n(m)} × ${v}² = −${n(dk)} J. The only work is done by the hands, against the motion: F × ${n(d)} × cos 180° = −${n(dk)}, so F = ${n(dk)} ÷ ${n(d)} = ${n(dk / d)} N. Letting the hands move back further would make the force smaller.`,
    memo: [
      { code: 'A', marks: 1, text: `ΔEk = −${n(dk)} J` },
      { code: 'SF', marks: 1, text: `F × ${n(d)} × cos 180°` },
      { code: 'M', marks: 1, text: 'Wnet = ΔEk' },
      { code: 'A', marks: 1, text: `${n(dk / d)} N` },
    ],
  })
}

{
  const [m, d, deg, f] = [10, 5, 30, 20]
  const wg = m * g * Math.sin((deg * Math.PI) / 180) * d
  const wf = -f * d
  const v = Math.sqrt((2 * (wg + wf)) / m)
  out.push({
    ...wep12,
    id: 'lg-ps12-wet-incline',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `A ${m} kg crate slides from rest ${d} m down a slope inclined at ${deg}° to the horizontal. A constant frictional force of ${f} N acts on it. Use the work-energy theorem to calculate its speed at the bottom of the slope.`,
    answer: `${n(v)} m·s⁻¹`,
    explanation: `Gravity: the component along the slope is mg sin ${deg}° = ${n(m * g * Math.sin((deg * Math.PI) / 180))} N, so Wg = ${n(m * g * Math.sin((deg * Math.PI) / 180))} × ${d} = ${n(wg)} J. Friction: Wf = ${f} × ${d} × cos 180° = ${n(wf)} J. The normal force does no work. Wnet = ${n(wg)} + (${n(wf)}) = ${n(wg + wf)} J = ½ × ${m} × v², so v = ${n(v)} m·s⁻¹.`,
    memo: [
      { code: 'A', marks: 1, text: `Wg = ${n(wg)} J` },
      { code: 'A', marks: 1, text: `Wf = ${n(wf)} J` },
      { code: 'M', marks: 1, text: 'Wnet = ΔEk' },
      { code: 'S', marks: 1, text: `${n(wg + wf)} = ½ × ${m} × v²` },
      { code: 'A', marks: 1, text: `${n(v)} m·s⁻¹` },
    ],
  })
}

{
  const [m, v] = [60, 9]
  const w = 0.5 * m * v * v
  out.push({
    ...wep12,
    id: 'lg-ps12-wet-sprinter',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A ${m} kg sprinter accelerates from rest to ${v} m·s⁻¹. Calculate the net work done on her, and name the theorem you used.`,
    answer: `${n(w)} J, using the work-energy theorem.`,
    explanation: `Wnet = ΔEk = ½ × ${m} × ${v}² − 0 = ${n(w)} J. The work-energy theorem gives the net work from the change in speed alone, without knowing the forces or the distance.`,
    memo: [
      { code: 'SF', marks: 1, text: `Wnet = ½ × ${m} × ${v}² − 0` },
      { code: 'A', marks: 1, text: `${n(w)} J` },
      { code: 'A', marks: 1, text: 'The work-energy theorem' },
    ],
  })
}

out.push({
  ...wep12,
  id: 'lg-ps12-wet-braking-distance',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 4,
  prompt: 'A car travelling at speed v stops in a distance d when a constant braking force acts on it. Use the work-energy theorem to show what happens to the braking distance if the car travels twice as fast, with the same braking force.',
  answer:
    'The braking force does work −Fd = 0 − ½mv², so d = mv²/(2F). The distance is proportional to v². At 2v the kinetic energy is four times larger, so the braking distance is four times as long.',
  explanation: 'This is why speed limits near schools matter so much: a car at 60 km/h needs about four times the braking distance of one at 30 km/h, not twice.',
  memo: [
    { code: 'M', marks: 1, text: 'Wnet = ΔEk: −Fd = 0 − ½mv²' },
    { code: 'A', marks: 1, text: 'd = mv²/(2F)' },
    { code: 'R', marks: 1, text: 'd is proportional to v²' },
    { code: 'A', marks: 1, text: 'Four times the distance' },
  ],
})

{
  const [m, d, vi, vf] = [3, 4, 5, 3]
  const dk = 0.5 * m * (vf * vf - vi * vi)
  out.push({
    ...wep12,
    id: 'lg-ps12-wet-trolley-friction',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A ${m} kg trolley rolls ${d} m along a horizontal track and slows down from ${vi} m·s⁻¹ to ${vf} m·s⁻¹. Use the work-energy theorem to calculate the average frictional force on it.`,
    answer: `${n(-dk / d)} N`,
    explanation: `ΔEk = ½ × ${m} × (${vf}² − ${vi}²) = ${n(dk)} J. Friction is the only force doing work: f × ${d} × cos 180° = ${n(dk)}, so f = ${n(-dk / d)} N.`,
    memo: [
      { code: 'SF', marks: 1, text: `ΔEk = ½ × ${m} × (${vf}² − ${vi}²)` },
      { code: 'A', marks: 1, text: `${n(dk)} J` },
      { code: 'M', marks: 1, text: `f × ${d} × cos 180° = ΔEk` },
      { code: 'A', marks: 1, text: `${n(-dk / d)} N` },
    ],
  })
}

/* ===================================================================== */
/* Reproduction in angiosperms: why seeds matter, Life Sciences Grade 11  */
/* ===================================================================== */

const plants11 = { topicId: 'life-sci-biodiversity-plants', grade: 11 } as const

out.push({
  ...plants11,
  id: 'lg-ls11-seeds-uses',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Name TWO ways in which seeds are important to humans.',
  answer:
    'Any two of: as staple food (maize, wheat, rice, beans); as a source of cooking oil (sunflower); as animal feed; as a source of income for farmers and traders; for growing the next season\'s crops.',
  explanation: 'Most of the world\'s calories come from the seeds of a few grasses — maize, wheat and rice.',
  memo: [
    { code: 'A', marks: 1, text: 'First valid use' },
    { code: 'A', marks: 1, text: 'Second valid use' },
  ],
})

out.push({
  ...plants11,
  id: 'lg-ls11-seed-bank-purpose',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 3,
  prompt: 'Explain what a seed bank is, and give TWO reasons why seed banks are important for conserving plant diversity.',
  answer:
    'A seed bank stores seeds of many plant species, and varieties of crops, under controlled conditions. It protects species that are endangered in the wild from extinction, and keeps crop varieties that could be needed later — for example ones resistant to disease or drought — or that could be lost in a disaster.',
  explanation: 'A seed bank is insurance: if a species or variety disappears from the field, it can be grown again from stored seed.',
  memo: [
    { code: 'A', marks: 1, text: 'Stores seeds of many species under controlled conditions' },
    { code: 'A', marks: 1, text: 'Protects endangered species from extinction' },
    { code: 'A', marks: 1, text: 'Keeps useful crop varieties for the future' },
  ],
})

out.push({
  ...plants11,
  id: 'lg-ls11-seed-bank-storage',
  difficulty: 'Challenge',
  cognitiveLevel: 3,
  marks: 3,
  prompt: 'Seeds in a seed bank are dried until they hold very little water and are then kept at about −20 °C. Explain why these conditions keep the seeds alive for many years.',
  answer:
    'With very little water the seed cannot take up water to germinate, and its enzymes are inactive. The low temperature slows cellular respiration further, so the food store is used up extremely slowly. Dry, cold conditions also stop fungi and bacteria from growing on the seeds.',
  explanation: 'Germination needs water, oxygen and a suitable temperature. Removing the water and the warmth keeps the embryo alive but inactive.',
  memo: [
    { code: 'A', marks: 1, text: 'No water, so no germination and inactive enzymes' },
    { code: 'A', marks: 1, text: 'Low temperature slows respiration, saving the food store' },
    { code: 'A', marks: 1, text: 'Prevents fungal and bacterial growth' },
  ],
})

out.push({
  ...plants11,
  id: 'lg-ls11-seed-radicle-plumule',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Name the part of the embryo in a seed that develops into (a) the root and (b) the shoot of the new plant.',
  answer: '(a) the radicle; (b) the plumule',
  explanation: 'The radicle is the first part to emerge during germination, which anchors the seedling and lets it take up water before the plumule grows upwards.',
  memo: [
    { code: 'A', marks: 1, text: 'Radicle' },
    { code: 'A', marks: 1, text: 'Plumule' },
  ],
})

export const lessonGapQuestions = out
