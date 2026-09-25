import type { ChartSpec, Question } from '@/types'
import { bandFor, bmiOf, curveAt, type Sex } from '@/data/bmiReference'
import { fiveNumberSummary } from '@/data/chartSpecs'

/**
 * Mathematical Literacy content for reading a BMI-for-age percentile chart and
 * a box-and-whisker diagram -- the two chart types the Grade 12 ATP names that
 * the question bank could not show.
 *
 * WHY. The WCED 2026 ATP puts "percentiles" and "box-and-whisker plots" in
 * Grade 12 Data Handling and "BMI" in Grade 12 Measurement. The bank had one BMI
 * question, a bare calculation, and nothing at all on reading a percentile
 * chart -- although that chart is how BMI is actually set in a Paper 2, as an
 * annexure the learner reads a child's weight category off. Box-and-whisker
 * diagrams had three questions, each describing the diagram in words.
 *
 * EVERY ANSWER IS WORKED OUT FROM THE CHART THE LEARNER SEES. A child's weight
 * category comes from `bandFor`, which reads the same curves the chart draws;
 * a five-number summary comes from `fiveNumberSummary` over the listed data.
 * `npm run check:charts` then re-reads each child's band from the raw curve
 * table with its own interpolation -- not by calling `bandFor` -- and fails if
 * the answer names a different band, or if a child sits so close to a curve
 * that two careful readings of the chart could disagree.
 */

const n = (v: number, dp = 1): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  return r.toFixed(dp).replace('.', ',')
}
const whole = (v: number): string => String(Math.round(v * 100) / 100).replace('.', ',')

const out: Question[] = []
const dh12 = { topicId: 'data-handling', grade: 12 } as const
const me12 = { topicId: 'measurement', grade: 12 } as const

const chartFor = (sex: Sex, points?: { age: number; bmi: number; label: string }[]): ChartSpec => ({
  kind: 'bmi-for-age',
  title: `BMI-for-age percentile chart: ${sex}s aged 2 to 20`,
  sex,
  ...(points ? { points } : {}),
})

/* ===================================================================== */
/* Reading a BMI-for-age percentile chart                                */
/* ===================================================================== */

{
  // Reading a value OFF a curve: the first skill, before any classifying.
  const age = 10
  const bmi = curveAt('girl', 50, age)
  out.push({
    ...dh12,
    id: 'gap-ml-bmi-read-curve',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: `Use the BMI-for-age percentile chart for girls to read off the BMI of a ${age}-year-old girl whose BMI is on the 50th percentile.`,
    answer: `About ${n(bmi)} kg/m². Go up from age ${age} on the horizontal axis to the 50th percentile curve, then across to the BMI axis. (Any reading from ${n(bmi - 0.4)} to ${n(bmi + 0.4)} is accepted.)`,
    explanation:
      'A percentile chart is read like any graph: find the age on the horizontal axis, go up to the curve you want, then across to read the value. The 50th percentile is the middle child: half the girls of that age have a lower BMI and half have a higher one.',
    memo: [
      { code: 'RT', marks: 1, text: `reading at age ${age} on the 50th percentile curve` },
      { code: 'A', marks: 1, text: `${n(bmi)} kg/m² (accept ${n(bmi - 0.4)} to ${n(bmi + 0.4)})` },
    ],
    chart: chartFor('girl'),
  })
}

{
  // The healthy range for one age: two curve readings, not one.
  const age = 16
  const lo = curveAt('boy', 5, age)
  const hi = curveAt('boy', 85, age)
  out.push({
    ...dh12,
    id: 'gap-ml-bmi-healthy-range',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Use the BMI-for-age percentile chart for boys to state the range of BMI values that would place a ${age}-year-old boy in the healthy weight category.`,
    answer: `From about ${n(lo)} to about ${n(hi)} kg/m². The healthy weight band runs from the 5th percentile curve up to the 85th percentile curve, so read both curves at age ${age}.`,
    explanation:
      'A weight category on this chart is not one number but the space BETWEEN two curves. Healthy weight is from the 5th up to the 85th percentile, so the answer needs both readings. A common slip is to give the 50th percentile, which is only the middle of the healthy band.',
    memo: [
      { code: 'R', marks: 1, text: 'healthy weight lies between the 5th and 85th percentile curves' },
      { code: 'RT', marks: 1, text: `about ${n(lo)} kg/m² on the 5th percentile at age ${age}` },
      { code: 'RT', marks: 1, text: `about ${n(hi)} kg/m² on the 85th percentile at age ${age}` },
    ],
    chart: chartFor('boy'),
  })
}

{
  // Classifying one child from a given BMI.
  const age = 14
  const bmi = 24.5
  const band = bandFor('boy', age, bmi)
  out.push({
    ...dh12,
    id: 'gap-ml-bmi-classify',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Lwazi is a ${age}-year-old boy with a BMI of ${n(bmi)} kg/m². Use the BMI-for-age percentile chart for boys to determine his weight category, and state between which two percentile curves his BMI lies.`,
    answer: `Lwazi is ${band}. At age ${age} his BMI of ${n(bmi)} lies between the 85th percentile curve (about ${n(curveAt('boy', 85, age))}) and the 95th percentile curve (about ${n(curveAt('boy', 95, age))}).`,
    explanation:
      'Plot the point first -- age across, BMI up -- and only then decide the band. The band is named by the curves on either side of the point: between the 85th and 95th percentiles is the overweight band on this chart.',
    memo: [
      { code: 'RT', marks: 1, text: `point plotted at age ${age}, BMI ${n(bmi)}` },
      { code: 'A', marks: 1, text: 'between the 85th and 95th percentile curves' },
      { code: 'CA', marks: 1, text: band },
    ],
    chart: chartFor('boy'),
    answerChart: chartFor('boy', [{ age, bmi, label: 'Lwazi' }]),
  })
}

{
  // Calculate first, then read the chart: the way a Paper 2 sets it.
  const age = 12
  const mass = 38
  const height = 1.5
  const bmi = bmiOf(mass, height)
  const band = bandFor('girl', age, bmi)
  out.push({
    ...dh12,
    id: 'gap-ml-bmi-calc-then-chart',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: 'BMI = mass (kg) ÷ [height (m)]²',
    prompt: `Aneesa is ${age} years old, has a mass of ${mass} kg and is ${n(height, 2)} m tall. Calculate her BMI, then use the BMI-for-age percentile chart for girls to determine her weight category.`,
    answer: `BMI = ${mass} ÷ ${n(height, 2)}² = ${mass} ÷ ${n(height * height, 2)} = ${n(bmi)} kg/m². At age ${age} this lies between the 5th percentile (about ${n(curveAt('girl', 5, age))}) and the 85th percentile (about ${n(curveAt('girl', 85, age))}), so Aneesa is a ${band}.`,
    explanation:
      'Square the height before dividing -- the most common error is dividing by 1,5 instead of by 2,25. Then use the chart for the right sex and the right age: the same BMI can fall in a different band for a boy, or for a girl two years older.',
    memo: [
      { code: 'SF', marks: 1, text: `${mass} ÷ ${n(height, 2)}²` },
      { code: 'A', marks: 1, text: `${n(bmi)} kg/m²` },
      { code: 'RT', marks: 1, text: 'point read between the 5th and 85th percentile curves' },
      { code: 'CA', marks: 1, text: band },
    ],
    chart: chartFor('girl'),
    answerChart: chartFor('girl', [{ age, bmi: Math.round(bmi * 10) / 10, label: 'Aneesa' }]),
  })
}

{
  // The same BMI at two ages: the whole reason the chart has an age axis.
  const bmi = 20
  const young = 9
  const old = 17
  const bandYoung = bandFor('boy', young, bmi)
  const bandOld = bandFor('boy', old, bmi)
  out.push({
    ...dh12,
    id: 'gap-ml-bmi-same-bmi-two-ages',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Two boys both have a BMI of ${bmi} kg/m². Thabo is ${young} years old and Kagiso is ${old} years old. Use the BMI-for-age percentile chart for boys to determine each boy's weight category, and explain why the same BMI gives a different result at different ages.`,
    answer: `Thabo (age ${young}) is ${bandYoung}: his BMI is above the 85th percentile (about ${n(curveAt('boy', 85, young))}) but below the 95th (about ${n(curveAt('boy', 95, young))}). Kagiso (age ${old}) is a ${bandOld}: his BMI is between the 5th percentile (about ${n(curveAt('boy', 5, old))}) and the 50th (about ${n(curveAt('boy', 50, old))}). A child's BMI naturally rises as they grow, so the chart compares a child only with others of the same age and sex. A BMI of ${bmi} is high for a ${young}-year-old but ordinary for a ${old}-year-old.`,
    explanation:
      'Adults are classified with fixed BMI cut-offs; children are not, because body shape changes as they grow. That is what the curves rising from left to right show. So a child is judged by their PERCENTILE -- where they stand among children of the same age -- not by the BMI number on its own.',
    memo: [
      { code: 'RT', marks: 1, text: `Thabo: between the 85th and 95th percentiles at age ${young}` },
      { code: 'CA', marks: 1, text: bandYoung },
      { code: 'RT', marks: 1, text: `Kagiso: between the 5th and 50th percentiles at age ${old}` },
      { code: 'CA', marks: 1, text: bandOld },
      { code: 'R', marks: 1, text: 'BMI rises with age, so a child is compared only with children of the same age' },
    ],
    chart: chartFor('boy'),
    answerChart: chartFor('boy', [
      { age: young, bmi, label: 'Thabo' },
      { age: old, bmi, label: 'Kagiso' },
    ]),
  })
}

{
  // Tracking one child over time, and a claim that reads the change wrongly.
  const a1 = 8
  const b1 = 17
  const a2 = 13
  const b2 = 23.5
  const first = bandFor('girl', a1, b1)
  const second = bandFor('girl', a2, b2)
  out.push({
    ...dh12,
    id: 'gap-ml-bmi-evaluate-claim',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context: `A clinic recorded Zanele's BMI as ${n(b1)} kg/m² at age ${a1} and as ${n(b2)} kg/m² at age ${a2}.`,
    prompt: `A nurse says: "Her BMI went up by ${n(b2 - b1)}, so she has moved from a healthy weight to obese." Use the BMI-for-age percentile chart for girls to evaluate the nurse's statement.`,
    answer: `The statement is only partly right. At age ${a1}, a BMI of ${n(b1)} lies between the 5th and 85th percentiles, so Zanele was a ${first}. At age ${a2}, a BMI of ${n(b2)} lies between the 85th percentile (about ${n(curveAt('girl', 85, a2))}) and the 95th (about ${n(curveAt('girl', 95, a2))}), so she is now ${second} -- not obese. The nurse is right that her category has worsened, but wrong about how far. The rise of ${n(b2 - b1)} does not decide anything by itself: some rise is expected as a child grows, and only the chart at each age shows whether she has moved to a higher band.`,
    explanation:
      'Evaluate a claim by checking each part of it against the evidence. Here there are two parts -- "moved up a category" and "to obese" -- and the chart supports the first and contradicts the second. The size of the change is a trap: on a BMI-for-age chart a change in the number means nothing until it is placed against the curves for the new age.',
    memo: [
      { code: 'RT', marks: 1, text: `age ${a1}: between the 5th and 85th percentiles, ${first}` },
      { code: 'RT', marks: 1, text: `age ${a2}: between the 85th and 95th percentiles` },
      { code: 'CA', marks: 1, text: `${second}, not obese` },
      { code: 'J', marks: 1, text: 'partly correct: the category worsened, but only to overweight' },
      { code: 'R', marks: 1, text: 'a rise in BMI is expected with age, so the rise alone does not classify her' },
    ],
    chart: chartFor('girl'),
    answerChart: chartFor('girl', [
      { age: a1, bmi: b1, label: 'Age 8' },
      { age: a2, bmi: b2, label: 'Age 13' },
    ]),
  })
}

{
  // What a percentile MEANS, without any chart reading.
  out.push({
    ...dh12,
    id: 'gap-ml-bmi-percentile-meaning',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt:
      "A clinic card says a 10-year-old boy's BMI is on the 85th percentile. Explain what the 85th percentile means for him.",
    answer:
      'About 85% of 10-year-old boys have a lower BMI than him, and about 15% have a higher one. A percentile is a position in a group, not a score out of 100.',
    explanation:
      'Percentiles split ordered data into 100 equal parts, the way quartiles split it into four -- the lower quartile is the 25th percentile and the median the 50th. The 85th percentile is not "85%" of anything about the boy himself; it says where he stands among boys of his age.',
    memo: [
      { code: 'A', marks: 1, text: 'about 85% of boys of the same age have a lower BMI' },
      { code: 'A', marks: 1, text: 'about 15% have a higher BMI' },
    ],
  })
}

/* ===================================================================== */
/* BMI in Measurement: the calculation, forwards and backwards           */
/* ===================================================================== */

const ADULT_TABLE =
  '|+ BMI categories for adults\n| BMI (kg/m²) | Category |\n|---|---|\n| below 18,5 | Underweight |\n| 18,5 to 24,9 | Normal weight |\n| 25 to 29,9 | Overweight |\n| 30 and above | Obese |'

const adultBand = (bmi: number) =>
  bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal weight' : bmi < 30 ? 'overweight' : 'obese'

{
  const mass = 82
  const height = 1.75
  const bmi = bmiOf(mass, height)
  out.push({
    ...me12,
    id: 'gap-ml-bmi-adult-calc',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    context: `BMI = mass (kg) ÷ [height (m)]²\n${ADULT_TABLE}`,
    prompt: `An adult has a mass of ${mass} kg and a height of ${n(height, 2)} m. Calculate their BMI, rounded to one decimal place, and use the table to state their BMI category.`,
    answer: `BMI = ${mass} ÷ ${n(height, 2)}² = ${mass} ÷ ${n(height * height, 4)} = ${n(bmi)} kg/m². This is in the 25 to 29,9 row, so the category is ${adultBand(bmi)}.`,
    explanation:
      'Square the height first, then divide the mass by it. For an ADULT the category comes straight from fixed cut-offs in a table; it is children and teenagers who need a BMI-for-age chart, because their BMI changes as they grow.',
    memo: [
      { code: 'SF', marks: 1, text: `${mass} ÷ ${n(height, 2)}²` },
      { code: 'A', marks: 1, text: `${n(bmi)} kg/m²` },
      { code: 'CA', marks: 1, text: adultBand(bmi) },
    ],
  })
}

{
  // Working backwards from a target BMI to a mass.
  const height = 1.62
  const target = 25
  const mass = target * height * height
  out.push({
    ...me12,
    id: 'gap-ml-bmi-mass-for-target',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: `BMI = mass (kg) ÷ [height (m)]²\n${ADULT_TABLE}`,
    prompt: `A woman is ${n(height, 2)} m tall. Calculate the mass at which her BMI would reach ${target}, the start of the overweight range, rounded to one decimal place.`,
    answer: `Rearrange the formula: mass = BMI × height² = ${target} × ${n(height, 2)}² = ${target} × ${n(height * height, 4)} = ${n(mass)} kg. At ${n(mass)} kg or more her BMI is ${target} or more, which the table places in the overweight range.`,
    explanation:
      'When the unknown is the mass, multiply instead of dividing: mass = BMI × height². Check the answer by putting it back in: ' +
      `${n(mass)} ÷ ${n(height * height, 4)} gives ${target} again.`,
    memo: [
      { code: 'M', marks: 1, text: 'mass = BMI × height²' },
      { code: 'S', marks: 1, text: `${target} × ${n(height, 2)}²` },
      { code: 'A', marks: 1, text: `${n(mass)} kg` },
      { code: 'R', marks: 1, text: 'at or above this mass the BMI is 25 or more: overweight' },
    ],
  })
}

{
  // A target and a rate: is the plan safe?
  const height = 1.8
  const bmiNow = 31.2
  const massNow = bmiNow * height * height
  const massTarget = 25 * height * height
  const toLose = massNow - massTarget
  const weeks = 4
  const safe = 1
  const minWeeks = Math.ceil(toLose / safe)
  out.push({
    ...me12,
    id: 'gap-ml-bmi-weight-loss-plan',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    context: `BMI = mass (kg) ÷ [height (m)]²\n${ADULT_TABLE}\nA safe rate of weight loss is about 0,5 kg to 1 kg per week.`,
    prompt: `Sipho is ${n(height, 2)} m tall and his BMI is ${n(bmiNow)}. He plans to bring his BMI down to 25 in ${weeks} weeks. Calculate how much mass he would need to lose, and evaluate whether his plan is sensible.`,
    answer: `His mass now = ${n(bmiNow)} × ${n(height, 2)}² = ${n(bmiNow)} × ${n(height * height, 2)} = ${n(massNow)} kg. At a BMI of 25 his mass would be 25 × ${n(height * height, 2)} = ${n(massTarget)} kg. He must lose ${n(massNow)} − ${n(massTarget)} = ${n(toLose)} kg. In ${weeks} weeks that is about ${n(toLose / weeks)} kg a week -- far above the safe rate of at most 1 kg a week. At a safe rate the loss would take at least ${minWeeks} weeks, about ${Math.round(minWeeks / 4.33)} months. The goal is reasonable; the time frame is not.`,
    explanation:
      'Two masses are needed: the one he has now, from his current BMI, and the one that gives a BMI of 25. Their difference is the loss. Evaluating the plan then means comparing the weekly rate it demands with the safe rate given -- a judgement the numbers support, not an opinion.',
    memo: [
      { code: 'M', marks: 1, text: `mass now = ${n(bmiNow)} × ${n(height, 2)}²` },
      { code: 'A', marks: 1, text: `${n(massNow)} kg` },
      { code: 'CA', marks: 1, text: `target mass ${n(massTarget)} kg` },
      { code: 'CA', marks: 1, text: `loss of ${n(toLose)} kg` },
      { code: 'CA', marks: 1, text: `about ${n(toLose / weeks)} kg per week, above the safe 1 kg` },
      { code: 'J', marks: 1, text: `not sensible in ${weeks} weeks; at least ${minWeeks} weeks at a safe rate` },
    ],
  })
}

/* ===================================================================== */
/* Box-and-whisker diagrams                                              */
/* ===================================================================== */

const rankA = { label: 'Rank A', min: 2, q1: 5, median: 8, q3: 13, max: 25 }
const rankB = { label: 'Rank B', min: 4, q1: 7, median: 9, q3: 11, max: 16 }
const WAIT_AXIS: [number, number] = [0, 30]

{
  const b = rankA
  out.push({
    ...dh12,
    id: 'gap-ml-box-read-iqr',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt:
      'The box-and-whisker diagram shows how long commuters waited for a taxi at a rank one morning. Write down the median waiting time, and calculate the interquartile range.',
    answer: `Median = ${b.median} minutes, the line inside the box. Interquartile range = upper quartile − lower quartile = ${b.q3} − ${b.q1} = ${b.q3 - b.q1} minutes.`,
    explanation:
      'The box runs from the lower quartile to the upper quartile, so the interquartile range is simply the length of the box. It is the spread of the middle half of the waiting times, and unlike the range it is not pulled about by one unusually long wait.',
    memo: [
      { code: 'RT', marks: 1, text: `median ${b.median} minutes` },
      { code: 'RT', marks: 1, text: `Q3 = ${b.q3} and Q1 = ${b.q1}` },
      { code: 'CA', marks: 1, text: `IQR = ${b.q3 - b.q1} minutes` },
    ],
    chart: {
      kind: 'boxplot',
      title: 'Taxi waiting times at the rank',
      axis: WAIT_AXIS,
      step: 5,
      xLabel: 'Waiting time (minutes)',
      boxes: [{ min: b.min, q1: b.q1, median: b.median, q3: b.q3, max: b.max }],
    },
  })
}

{
  const b = rankA
  out.push({
    ...dh12,
    id: 'gap-ml-box-quarters',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Use the box-and-whisker diagram of taxi waiting times to state the percentage of commuters who waited longer than ${b.q3} minutes, and the percentage who waited between ${b.q1} and ${b.q3} minutes. Explain how you know without counting any of the data.`,
    answer: `25% waited longer than ${b.q3} minutes, and 50% waited between ${b.q1} and ${b.q3} minutes. The three lines of the box -- lower quartile, median and upper quartile -- cut the ordered data into four quarters, each holding 25% of the commuters. Above the upper quartile is one quarter; inside the box are two quarters.`,
    explanation:
      'Every section of a box-and-whisker diagram holds the same share of the data -- a quarter -- however long or short it is drawn. A long section means those values are spread out, not that there are more of them. This is the idea most often tested and most often missed.',
    memo: [
      { code: 'A', marks: 1, text: `25% longer than ${b.q3} minutes` },
      { code: 'A', marks: 1, text: `50% between ${b.q1} and ${b.q3} minutes` },
      { code: 'R', marks: 1, text: 'the quartiles and median split the data into four quarters' },
      { code: 'R', marks: 1, text: 'each quarter holds 25%, whatever its length on the diagram' },
    ],
    chart: {
      kind: 'boxplot',
      title: 'Taxi waiting times at the rank',
      axis: WAIT_AXIS,
      step: 5,
      xLabel: 'Waiting time (minutes)',
      boxes: [{ min: b.min, q1: b.q1, median: b.median, q3: b.q3, max: b.max }],
    },
  })
}

{
  const iqrA = rankA.q3 - rankA.q1
  const iqrB = rankB.q3 - rankB.q1
  const rangeA = rankA.max - rankA.min
  const rangeB = rankB.max - rankB.min
  out.push({
    ...dh12,
    id: 'gap-ml-box-compare-ranks',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    prompt:
      'The two box-and-whisker diagrams show taxi waiting times at two ranks on the same morning. A commuter says: "Rank B is more reliable, even though you usually wait a bit longer there." Use the medians, the interquartile ranges and the ranges to evaluate this claim.',
    answer: `Medians: Rank A ${rankA.median} minutes, Rank B ${rankB.median} minutes, so a typical wait is ${rankB.median - rankA.median} minute longer at Rank B -- the second part of the claim is correct. Interquartile ranges: Rank A ${rankA.q3} − ${rankA.q1} = ${iqrA} minutes, Rank B ${rankB.q3} − ${rankB.q1} = ${iqrB} minutes. Ranges: Rank A ${rankA.max} − ${rankA.min} = ${rangeA} minutes, Rank B ${rankB.max} − ${rankB.min} = ${rangeB} minutes. Rank B's waits are far more tightly grouped on both measures, so a commuter there can predict their wait much better, and the worst wait is ${rankA.max - rankB.max} minutes shorter. The claim is supported: Rank B is more reliable, at the cost of about one extra minute on a typical day.`,
    explanation:
      '"Reliable" is a claim about SPREAD, not about the middle, so the median alone cannot settle it. The median answers "how long do I usually wait"; the interquartile range and range answer "how sure can I be". A full evaluation checks each part of the claim against the measure that fits it.',
    memo: [
      { code: 'RT', marks: 1, text: `medians ${rankA.median} and ${rankB.median} minutes` },
      { code: 'CA', marks: 1, text: `IQR: A ${iqrA}, B ${iqrB} minutes` },
      { code: 'CA', marks: 1, text: `range: A ${rangeA}, B ${rangeB} minutes` },
      { code: 'R', marks: 1, text: 'Rank B has a slightly longer typical wait' },
      { code: 'R', marks: 1, text: 'Rank B has a much smaller spread, so its waits are more predictable' },
      { code: 'J', marks: 1, text: 'the claim is supported' },
    ],
    chart: {
      kind: 'boxplot',
      title: 'Taxi waiting times at two ranks',
      axis: WAIT_AXIS,
      step: 5,
      xLabel: 'Waiting time (minutes)',
      boxes: [rankA, rankB],
    },
  })
}

{
  // An ODD number of values, where the median is left out of both halves --
  // the case the even-numbered question in the bank never exercises.
  const loaves = [18, 22, 25, 27, 30, 31, 34, 36, 40, 44, 52]
  const s = fiveNumberSummary(loaves)
  out.push({
    ...dh12,
    id: 'gap-ml-box-odd-data',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: `The number of loaves of bread a spaza shop sold on eleven days, in order: ${loaves.join(', ')}.`,
    prompt: 'Determine the five-number summary needed to draw a box-and-whisker diagram of these sales.',
    answer: `Minimum = ${s.min}, maximum = ${s.max}. With 11 values the median is the 6th: ${whole(s.median)}. Leave the median out and split the rest: the lower five are ${loaves.slice(0, 5).join(', ')}, whose middle value is the lower quartile, ${whole(s.q1)}; the upper five are ${loaves.slice(6).join(', ')}, whose middle value is the upper quartile, ${whole(s.q3)}. Five-number summary: ${[s.min, s.q1, s.median, s.q3, s.max].map(whole).join('; ')}.`,
    explanation:
      'With an odd number of values the median is an actual data value, and it belongs to neither half -- leave it out before finding the quartiles. With an even number, the median falls between two values and each half takes exactly half the data.',
    memo: [
      { code: 'A', marks: 1, text: `minimum ${s.min} and maximum ${s.max}` },
      { code: 'A', marks: 1, text: `median ${whole(s.median)}` },
      { code: 'M', marks: 1, text: 'median excluded from both halves' },
      { code: 'CA', marks: 1, text: `Q1 = ${whole(s.q1)} and Q3 = ${whole(s.q3)}` },
    ],
    answerChart: {
      kind: 'boxplot',
      title: 'Loaves sold per day, as a box-and-whisker diagram',
      axis: [10, 60],
      step: 5,
      xLabel: 'Loaves sold in a day',
      boxes: [s],
    },
  })
}

export const matlitChartGaps: Question[] = out
