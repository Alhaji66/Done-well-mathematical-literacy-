/**
 * Mathematics content for sub-topics the per-grade report found empty.
 *
 * WHY ONE FILE FOR FOUR SUB-TOPICS. These are not related by topic; they are
 * related by how they were found. check:subtopics reports sub-topics that hold
 * questions at some grades and none at another, and four of its findings were
 * plainly CAPS content with nothing behind them:
 *
 *   Simultaneous equations, Grade 11 -- eleven questions at Grade 10, none at
 *     Grade 11, where CAPS adds the case of one linear and one quadratic
 *     equation. That case is the whole of what Grade 11 adds, and it was absent.
 *
 *   Grouped data, histograms and frequency polygons, Grades 11 and 12 -- two
 *     questions at Grade 10 and none above it, although both grades work with
 *     grouped data and estimate a mean from it.
 *
 *   Scatter plots, Grade 11 -- eighteen questions at Grade 12 and none at
 *     Grade 11, which is where scatter plots and a line of best fit by eye are
 *     introduced, before the regression line arrives in Grade 12.
 *
 *   Timelines and changing interest rates, Grade 11 -- three at Grade 12, none
 *     at Grade 11, where a timeline with a rate change is first examined.
 *
 * Every figure is computed from the data declared once, including the grouped
 * mean and the correlation, so a question and its answer cannot drift apart.
 */
import type { Question } from '@/types'

/** A number as this corpus writes it, to at most two decimals. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  return String(r).replace('-', '−')
}

/** Rands with cents, which is how a finance answer is marked. */
const rand = (v: number): string =>
  'R' + (Math.round(v * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d)\.)/g, ' ')

const out: Question[] = []

/* ===================================================================== */
/* Simultaneous equations: one linear and one quadratic (Grade 11)       */
/* ===================================================================== */

const alg = { topicId: 'math-algebra', grade: 11 } as const

out.push({
  ...alg,
  id: 'gap-g11-simul-circle',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 6,
  prompt: 'Solve for x and y simultaneously: y = x + 1 and x² + y² = 25',
  answer:
    'Substitute y = x + 1 into the second equation: x² + (x + 1)² = 25, so x² + x² + 2x + 1 = 25 and 2x² + 2x − 24 = 0. Divide by 2: x² + x − 12 = 0, which factorises as (x + 4)(x − 3) = 0, so x = −4 or x = 3. Substitute each back into the LINEAR equation: when x = −4, y = −3; when x = 3, y = 4. The solutions are (−4 ; −3) and (3 ; 4).',
  explanation:
    'Always substitute into the linear equation, never the quadratic one — the linear equation gives one y for each x, while the quadratic would give two and half of them would not satisfy both equations. Dividing through by the common factor of 2 before factorising keeps the numbers small. The answers must be given as PAIRS: x = −4 with y = −3, and x = 3 with y = 4. Listing four separate values loses the pairing, which is the thing being solved for, and markers treat it as an incomplete answer.',
  memo: [
    { code: 'M', marks: 1, text: 'y = x + 1 substituted into x² + y² = 25' },
    { code: 'M', marks: 1, text: '2x² + 2x − 24 = 0, simplified to x² + x − 12 = 0' },
    { code: 'M', marks: 1, text: 'Factorised: (x + 4)(x − 3) = 0' },
    { code: 'A', marks: 1, text: 'x = −4 or x = 3' },
    { code: 'CA', marks: 1, text: 'y = −3 and y = 4, from the linear equation' },
    { code: 'A', marks: 1, text: 'Answers paired: (−4 ; −3) and (3 ; 4)' },
  ],
})

out.push({
  ...alg,
  id: 'gap-g11-simul-product',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 6,
  prompt: 'Solve for x and y simultaneously: x + y = 6 and xy = 8',
  answer:
    'From the linear equation, y = 6 − x. Substitute into xy = 8: x(6 − x) = 8, so 6x − x² = 8 and x² − 6x + 8 = 0. This factorises as (x − 2)(x − 4) = 0, so x = 2 or x = 4. Then y = 6 − 2 = 4, and y = 6 − 4 = 2. The solutions are (2 ; 4) and (4 ; 2).',
  explanation:
    'Rearranging the linear equation first is what makes this work, and it is worth choosing which variable to make the subject — here x + y = 6 is symmetric so it makes no difference, but where one variable has a coefficient of 1 that is the one to isolate. Notice that the two solutions are each other reversed, which the symmetry of the two equations guarantees: swapping x and y leaves both equations unchanged. That is a useful check rather than a coincidence.',
  memo: [
    { code: 'M', marks: 1, text: 'y = 6 − x' },
    { code: 'M', marks: 1, text: 'Substituted: x(6 − x) = 8' },
    { code: 'M', marks: 1, text: 'x² − 6x + 8 = 0' },
    { code: 'M', marks: 1, text: 'Factorised: (x − 2)(x − 4) = 0' },
    { code: 'A', marks: 1, text: 'x = 2 or x = 4' },
    { code: 'CA', marks: 1, text: 'Paired: (2 ; 4) and (4 ; 2)' },
  ],
})

out.push({
  ...alg,
  id: 'gap-g11-simul-two-graphs',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 6,
  prompt:
    'Solve for x and y simultaneously: y = x − 3 and y = x² − 2x − 3. State what the solutions tell you about the graphs of the two equations.',
  answer:
    'Since both equations are equal to y, set them equal to each other: x² − 2x − 3 = x − 3. Then x² − 3x = 0, so x(x − 3) = 0 and x = 0 or x = 3. Substituting into y = x − 3 gives y = −3 and y = 0. The solutions are (0 ; −3) and (3 ; 0). Those are the two points where the straight line y = x − 3 cuts the parabola y = x² − 2x − 3 — solving two equations simultaneously finds exactly the points that lie on both graphs at once.',
  explanation:
    'Setting the two right-hand sides equal is legitimate because both are equal to the same y, and it saves a substitution step. The −3 on both sides can be cancelled, which is why the quadratic has no constant term and factorises by taking out x rather than into two brackets — losing the root x = 0 by dividing both sides by x instead of factorising is the classic error here, and it throws away half the answer. The geometric reading is what makes the algebra worth doing: two solutions means the line cuts the parabola twice, one solution would mean it is a tangent, and no real solution would mean it misses the parabola altogether.',
  memo: [
    { code: 'M', marks: 1, text: 'x² − 2x − 3 = x − 3' },
    { code: 'M', marks: 1, text: 'x² − 3x = 0' },
    { code: 'M', marks: 1, text: 'Factorised as x(x − 3) = 0, keeping the root x = 0' },
    { code: 'A', marks: 1, text: 'x = 0 or x = 3' },
    { code: 'CA', marks: 1, text: '(0 ; −3) and (3 ; 0)' },
    { code: 'J', marks: 1, text: 'These are the points where the line cuts the parabola' },
  ],
})

/* ===================================================================== */
/* Grouped data (Grades 11 and 12)                                       */
/* ===================================================================== */

/** One grouped frequency table, used by every question below. */
const CLASSES: { from: number; to: number; f: number }[] = [
  { from: 0, to: 10, f: 3 },
  { from: 10, to: 20, f: 7 },
  { from: 20, to: 30, f: 12 },
  { from: 30, to: 40, f: 18 },
  { from: 40, to: 50, f: 6 },
  { from: 50, to: 60, f: 4 },
]
const total = CLASSES.reduce((a, c) => a + c.f, 0)
const midpoint = (c: (typeof CLASSES)[number]) => (c.from + c.to) / 2
const sumFX = CLASSES.reduce((a, c) => a + midpoint(c) * c.f, 0)
const groupedMean = sumFX / total
const modalClass = CLASSES.reduce((a, c) => (c.f > a.f ? c : a))
/** The class the middle value falls in, found from the running totals. */
const medianClass = (() => {
  let running = 0
  for (const c of CLASSES) {
    running += c.f
    if (running >= total / 2) return c
  }
  return CLASSES[CLASSES.length - 1]
})()
const tableContext =
  `Test marks of ${total} learners, grouped:\n` +
  CLASSES.map((c) => `${c.from} ≤ x < ${c.to}: ${c.f} learners`).join('\n')

out.push({
  topicId: 'math-statistics',
  grade: 11,
  id: 'gap-g11-grouped-modal-median',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  context: tableContext,
  prompt: 'Write down the modal class, and determine the class interval in which the median lies.',
  answer:
    `The modal class is ${modalClass.from} ≤ x < ${modalClass.to}, because it has the highest frequency (${modalClass.f}). ` +
    `For the median, the running totals are ${CLASSES.reduce<number[]>((a, c) => [...a, (a[a.length - 1] ?? 0) + c.f], []).join(', ')}. ` +
    `With ${total} values the middle ones are the ${total / 2}th and ${total / 2 + 1}th, and the running total first reaches ${total / 2} inside the interval ` +
    `${medianClass.from} ≤ x < ${medianClass.to}, so the median lies in that interval.`,
  explanation:
    'Grouped data gives up the individual values, so neither the mode nor the median can be stated as a number — only the INTERVAL each falls in. The modal class is the tallest bar and is read straight off the frequencies. The median class needs running totals, and the answer must name an interval: writing a single figure for the median of grouped data claims to know something the table does not record.',
  memo: [
    { code: 'A', marks: 1, text: `Modal class ${modalClass.from} ≤ x < ${modalClass.to}` },
    { code: 'M', marks: 1, text: 'Running totals worked out' },
    { code: 'M', marks: 1, text: `Middle value is the ${total / 2}th` },
    { code: 'A', marks: 1, text: `Median lies in ${medianClass.from} ≤ x < ${medianClass.to}` },
  ],
})

out.push({
  topicId: 'math-statistics',
  grade: 11,
  id: 'gap-g11-grouped-mean',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 5,
  context: tableContext,
  prompt: 'Estimate the mean mark, and explain why the answer is an estimate rather than the exact mean.',
  answer:
    `Use the midpoint of each interval as the value for everyone in it: ${CLASSES.map((c) => n(midpoint(c))).join(', ')}. ` +
    `Then Σ(f × midpoint) = ${CLASSES.map((c) => `${c.f}(${n(midpoint(c))})`).join(' + ')} = ${n(sumFX)}. ` +
    `Estimated mean = ${n(sumFX)} ÷ ${total} = ${n(groupedMean)}. It is an estimate because the table does not record the individual marks: ` +
    'every learner in an interval is treated as if they scored the midpoint, and the real marks are spread across the interval.',
  explanation:
    'The midpoint stands in for every value in its class, which is a reasonable assumption precisely because the values above the midpoint and below it roughly cancel — but only roughly, which is where the word "estimate" comes from. Dividing by the number of INTERVALS instead of the number of learners is the usual error and gives a figure about eight times too large. The divisor is always the total frequency.',
  memo: [
    { code: 'M', marks: 1, text: 'Midpoints of all six intervals' },
    { code: 'M', marks: 1, text: 'Each midpoint multiplied by its frequency' },
    { code: 'A', marks: 1, text: `Σ(f × midpoint) = ${n(sumFX)}` },
    { code: 'CA', marks: 1, text: `Divided by ${total}: mean ≈ ${n(groupedMean)}` },
    { code: 'J', marks: 1, text: 'An estimate because the midpoint replaces every value in its interval' },
  ],
})

out.push({
  topicId: 'math-statistics',
  grade: 12,
  id: 'gap-g12-frequency-polygon',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 5,
  context: tableContext,
  prompt:
    'Describe exactly which points you would plot to draw the frequency polygon for this data, and explain what the frequency polygon shows about the shape of the distribution that a list of frequencies does not.',
  answer:
    `Plot the frequency of each interval against its MIDPOINT: ${CLASSES.map((c) => `(${n(midpoint(c))} ; ${c.f})`).join(', ')}. ` +
    `Then join the points with straight lines, and close the polygon by joining down to the x-axis at the midpoint of an empty interval at each end — at (${n(midpoint(CLASSES[0]) - 10)} ; 0) and (${n(midpoint(CLASSES[CLASSES.length - 1]) + 10)} ; 0). ` +
    `The shape shows that the marks rise to a peak in ${modalClass.from} ≤ x < ${modalClass.to} and then fall away more sharply on the right than they climbed on the left, so the distribution is skewed to the left — the tail is the long slow rise at the low marks. A list of frequencies contains the same numbers but makes that shape much harder to see.`,
  explanation:
    'A frequency polygon is plotted at midpoints, not at the boundaries of the intervals, and that is the detail worth getting right: plotting at the upper boundaries turns it into something closer to an ogive, which answers a different question. Closing the polygon down to the axis at each end is part of the construction and is worth a mark. Reading the skewness is where the marks for interpretation are: the direction of skew is named after the side the long TAIL is on, which is the opposite of where the peak sits, and that is the wrong way round from most learners’ first instinct.',
  memo: [
    { code: 'M', marks: 1, text: 'Frequency plotted against the midpoint of each interval' },
    { code: 'A', marks: 1, text: 'All six points listed correctly' },
    { code: 'M', marks: 1, text: 'Polygon closed to the axis at an empty interval each end' },
    { code: 'A', marks: 1, text: `Peak identified in ${modalClass.from} ≤ x < ${modalClass.to}` },
    { code: 'J', marks: 1, text: 'Skewness read off the shape, named for the side the tail is on' },
  ],
})

/* ===================================================================== */
/* Scatter plots and a line of best fit (Grade 11)                       */
/* ===================================================================== */

const PAIRS: [number, number][] = [
  [2, 45],
  [3, 52],
  [5, 61],
  [6, 68],
  [8, 79],
  [10, 88],
]
const meanX = PAIRS.reduce((a, [x]) => a + x, 0) / PAIRS.length
const meanY = PAIRS.reduce((a, [, y]) => a + y, 0) / PAIRS.length
const scatterContext =
  'Hours spent revising (x) and the test mark out of 100 (y) for six learners:\n' +
  PAIRS.map(([x, y]) => `${x} hours: ${y}%`).join('\n')

out.push({
  topicId: 'math-statistics',
  grade: 11,
  id: 'gap-g11-scatter-describe',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  context: scatterContext,
  prompt:
    'Describe the correlation between the hours spent revising and the test mark, in terms of both its direction and its strength, and state what the scatter plot does NOT tell you.',
  answer:
    'The mark rises steadily as the number of hours rises, and the points lie very close to a straight line, so there is a strong positive correlation between hours revised and mark. What the scatter plot does not tell you is that revising CAUSED the higher marks. Correlation is not causation: the learners who revise longer may also be the ones who attend more lessons, or who find the subject easier and enjoy it more, and either of those could explain both variables at once.',
  explanation:
    'Two words are needed and marks are given for each: the DIRECTION, positive or negative, from whether y rises or falls as x rises, and the STRENGTH, from how closely the points hug a line. "Good correlation" names neither and earns nothing. The causation point is the one examiners return to most often in this section, and it is worth being able to name a plausible third factor rather than just reciting the slogan.',
  memo: [
    { code: 'A', marks: 1, text: 'Positive: the mark rises as the hours rise' },
    { code: 'A', marks: 1, text: 'Strong: the points lie close to a straight line' },
    { code: 'J', marks: 1, text: 'Correlation does not establish causation' },
    { code: 'J', marks: 1, text: 'A plausible third factor named' },
  ],
})

out.push({
  topicId: 'math-statistics',
  grade: 11,
  id: 'gap-g11-line-of-best-fit',
  difficulty: 'Challenge',
  cognitiveLevel: 3,
  marks: 5,
  context: scatterContext,
  prompt:
    'Explain how to place a line of best fit on this scatter plot by eye, calculate the one point the line must pass through, and use the line to comment on the reliability of an estimate of the mark for a learner who revises for 20 hours.',
  answer:
    `A line of best fit is drawn so that it follows the trend of the points with roughly as many points above it as below it, and as close to all of them as possible — it is not drawn through the first and last points, and it need not pass through any point at all. It must pass through the mean point (x̄ ; ȳ). Here x̄ = ${n(PAIRS.reduce((a, [x]) => a + x, 0))} ÷ ${PAIRS.length} = ${n(meanX)} and ȳ = ${n(PAIRS.reduce((a, [, y]) => a + y, 0))} ÷ ${PAIRS.length} = ${n(meanY)}, so the line passes through (${n(meanX)} ; ${n(meanY)}). An estimate for 20 hours would be unreliable: the data only covers ${Math.min(...PAIRS.map(([x]) => x))} to ${Math.max(...PAIRS.map(([x]) => x))} hours, so 20 hours is well outside it. That is extrapolation, and it assumes the straight-line trend continues — which here it cannot, since the line would predict a mark above 100%.`,
  explanation:
    'Three things carry the marks. Placing the line by balancing points either side, rather than joining the extreme points, is the method. The mean point is the one fixed point every line of best fit must pass through, and calculating it turns a freehand line into something checkable. And the distinction between interpolation, estimating inside the range of the data, and extrapolation, estimating outside it, is what makes the last part answerable — the mark above 100% is the detail that turns a general caution into a specific one.',
  memo: [
    { code: 'M', marks: 1, text: 'Line follows the trend with points balanced either side' },
    { code: 'M', marks: 1, text: `x̄ = ${n(meanX)} and ȳ = ${n(meanY)}` },
    { code: 'A', marks: 1, text: `Line passes through (${n(meanX)} ; ${n(meanY)})` },
    { code: 'J', marks: 1, text: '20 hours is outside the data range — extrapolation' },
    { code: 'J', marks: 1, text: 'The straight line would predict a mark above 100%' },
  ],
})

/* ===================================================================== */
/* Timelines and changing interest rates (Grade 11)                      */
/* ===================================================================== */

{
  const p = 20_000
  const r1 = 8
  const y1 = 3
  const r2 = 11
  const y2 = 2
  const afterFirst = p * (1 + r1 / 100) ** y1
  const final = afterFirst * (1 + r2 / 100) ** y2
  out.push({
    topicId: 'math-finance-growth',
    grade: 11,
    id: 'gap-g11-timeline-rate-change',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `${rand(p)} is invested at ${n(r1)}% per annum compounded annually for ${y1} years. The rate then changes to ${n(r2)}% per annum compounded annually for a further ${y2} years. Calculate the value of the investment at the end of the ${y1 + y2} years.`,
    answer:
      `For the first ${y1} years: A = ${rand(p)}(1 + ${n(r1 / 100)})^${y1} = ${rand(afterFirst)}. That amount becomes the principal for the next period. ` +
      `For the next ${y2} years: A = ${rand(afterFirst)}(1 + ${n(r2 / 100)})^${y2} = ${rand(final)}. ` +
      `In one line: A = ${rand(p)}(1 + ${n(r1 / 100)})^${y1}(1 + ${n(r2 / 100)})^${y2} = ${rand(final)}.`,
    explanation:
      'A rate change splits the timeline into two periods, and the balance at the end of the first is the principal for the second — which is why the two factors multiply rather than add. Two things go wrong here regularly: averaging the two rates and applying the average for all five years, which gives a different and wrong answer because compounding is not linear; and rounding the intermediate amount to the nearest rand before continuing, which shifts the final figure. Keep the full value in the calculator and round only at the end.',
    memo: [
      { code: 'M', marks: 1, text: `First period: ${rand(p)}(1 + ${n(r1 / 100)})^${y1}` },
      { code: 'A', marks: 1, text: `${rand(afterFirst)}` },
      { code: 'M', marks: 1, text: 'That amount carried forward as the new principal' },
      { code: 'M', marks: 1, text: `× (1 + ${n(r2 / 100)})^${y2}` },
      { code: 'CA', marks: 1, text: `${rand(final)}` },
    ],
  })
}

{
  const p = 50_000
  const r = 9
  const beforeWithdrawal = 4
  const withdrawal = 15_000
  const after = 3
  const atWithdrawal = p * (1 + r / 100) ** beforeWithdrawal
  const remaining = atWithdrawal - withdrawal
  const final = remaining * (1 + r / 100) ** after
  out.push({
    topicId: 'math-finance-growth',
    grade: 11,
    id: 'gap-g11-timeline-withdrawal',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    prompt: `${rand(p)} is invested at ${n(r)}% per annum compounded annually. After ${beforeWithdrawal} years, ${rand(withdrawal)} is withdrawn. The remaining money stays invested at the same rate for a further ${after} years. Calculate the value of the investment at the end.`,
    answer:
      `Value after ${beforeWithdrawal} years: A = ${rand(p)}(1 + ${n(r / 100)})^${beforeWithdrawal} = ${rand(atWithdrawal)}. ` +
      `After the withdrawal: ${rand(atWithdrawal)} − ${rand(withdrawal)} = ${rand(remaining)}. ` +
      `That amount grows for ${after} more years: A = ${rand(remaining)}(1 + ${n(r / 100)})^${after} = ${rand(final)}.`,
    explanation:
      'Drawing the timeline before calculating anything is what keeps this straight: mark the deposit at year 0, the withdrawal at year 4 and the end at year 7, and the two growth periods appear as the gaps between them. The withdrawal is subtracted at the moment it happens, not at the start and not at the end — taking it off the original R50 000 instead would have it forgo four years of growth it actually earned, and taking it off at the end would give it three years it never had. Each placement gives a different answer, and only one of them matches what happened.',
    memo: [
      { code: 'M', marks: 1, text: `${rand(p)}(1 + ${n(r / 100)})^${beforeWithdrawal}` },
      { code: 'A', marks: 1, text: `${rand(atWithdrawal)}` },
      { code: 'M', marks: 1, text: 'Withdrawal subtracted at year 4' },
      { code: 'A', marks: 1, text: `${rand(remaining)}` },
      { code: 'M', marks: 1, text: `× (1 + ${n(r / 100)})^${after}` },
      { code: 'CA', marks: 1, text: `${rand(final)}` },
    ],
  })
}

{
  const p = 20_000
  const rA = 8
  const rB = 11
  const yA = 3
  const yB = 2
  const order1 = p * (1 + rA / 100) ** yA * (1 + rB / 100) ** yB
  const order2 = p * (1 + rB / 100) ** yB * (1 + rA / 100) ** yA
  out.push({
    topicId: 'math-finance-growth',
    grade: 11,
    id: 'gap-g11-timeline-order',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `${rand(p)} is invested for ${yA + yB} years, spending ${yA} years at ${n(rA)}% per annum and ${yB} years at ${n(rB)}% per annum, both compounded annually. A learner says the final value depends on which rate comes first. Show by calculation whether the learner is right, and explain the result.`,
    answer:
      `${n(rA)}% first: A = ${rand(p)}(1 + ${n(rA / 100)})^${yA}(1 + ${n(rB / 100)})^${yB} = ${rand(order1)}. ` +
      `${n(rB)}% first: A = ${rand(p)}(1 + ${n(rB / 100)})^${yB}(1 + ${n(rA / 100)})^${yA} = ${rand(order2)}. ` +
      'The two are identical, so the learner is wrong. The reason is that the final value is the principal multiplied by both growth factors, and multiplication can be done in any order — the order of the periods changes which factor is applied first but not the product.',
    explanation:
      'The calculation settles it, but the reason is the part worth holding on to: compound growth is repeated multiplication, and multiplication is commutative. It is also worth knowing exactly how far that goes. The final VALUE is the same either way, but the balance partway through is not — with the higher rate first the investment is worth more at every point in between, which matters the moment anything is withdrawn or added partway. So the learner is wrong about the end and would be right about the middle.',
    memo: [
      { code: 'M', marks: 1, text: 'Both orders written out as a product of growth factors' },
      { code: 'A', marks: 1, text: `${rand(order1)}` },
      { code: 'A', marks: 1, text: `${rand(order2)} — the same` },
      { code: 'J', marks: 1, text: 'The factors multiply, and multiplication is order-independent' },
      { code: 'J', marks: 1, text: 'The balance partway through does differ, which matters if money moves' },
    ],
  })
}

/** Everything above, in one list. Exported last so it cannot be read before it is filled. */
export const mathSubtopicGaps: Question[] = out
