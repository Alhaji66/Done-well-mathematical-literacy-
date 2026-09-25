/**
 * A BMI-for-age percentile chart for exam practice.
 *
 * WHAT THIS IS, AND WHAT IT IS NOT. An NSC Mathematical Literacy paper that
 * sets a BMI-for-age question prints its own chart as an annexure, simplified
 * for the exam, and the learner reads it -- they are not expected to know any
 * reference values. This is that kind of chart. Its curves follow the shape and
 * approximate values of the widely used 2-to-20-year BMI-for-age charts, but
 * they were set down here for practice, not taken from a published data file,
 * and the chart says so on its face. It must never be used to judge a real
 * child's weight.
 *
 * WHY ONE TABLE DRIVES BOTH THE PICTURE AND THE MEMO. Every BMI-for-age
 * question in the bank is marked against these same numbers: `bandFor` works
 * out which band a child falls in, and `npm run check:charts` fails if a
 * question's answer names a different band from the one its own chart shows.
 * A memo written against one chart and a picture drawn from another would mark
 * a learner wrong for reading the picture correctly.
 */

export type Sex = 'girl' | 'boy'

/** The percentile curves printed on the chart, in order from lowest. */
export const PERCENTILES = [5, 50, 85, 95] as const
export type Percentile = (typeof PERCENTILES)[number]

/**
 * BMI (kg/m²) on each curve at each whole year of age, 2 to 20.
 * Columns are the 5th, 50th, 85th and 95th percentiles.
 */
export const BMI_TABLE: Record<Sex, Record<number, [number, number, number, number]>> = {
  boy: {
    2: [14.7, 16.6, 18.2, 19.3],
    3: [14.4, 16.0, 17.4, 18.2],
    4: [14.0, 15.6, 16.9, 17.8],
    5: [13.8, 15.4, 16.8, 18.0],
    6: [13.7, 15.3, 17.0, 18.4],
    7: [13.7, 15.5, 17.4, 19.1],
    8: [13.8, 15.8, 17.9, 20.0],
    9: [14.0, 16.1, 18.6, 21.0],
    10: [14.2, 16.6, 19.4, 22.0],
    11: [14.6, 17.2, 20.2, 23.2],
    12: [15.0, 17.8, 21.0, 24.2],
    13: [15.5, 18.4, 21.8, 25.1],
    14: [16.0, 19.1, 22.6, 26.0],
    15: [16.6, 19.8, 23.4, 26.8],
    16: [17.1, 20.5, 24.2, 27.5],
    17: [17.7, 21.1, 24.9, 28.2],
    18: [18.2, 21.7, 25.6, 28.9],
    19: [18.7, 22.2, 26.3, 29.7],
    20: [19.1, 22.6, 27.0, 30.6],
  },
  girl: {
    2: [14.4, 16.4, 18.0, 19.1],
    3: [14.0, 15.8, 17.2, 18.3],
    4: [13.7, 15.3, 16.8, 18.0],
    5: [13.5, 15.2, 16.8, 18.3],
    6: [13.4, 15.2, 17.1, 18.8],
    7: [13.4, 15.4, 17.6, 19.7],
    8: [13.6, 15.8, 18.3, 20.7],
    9: [13.9, 16.3, 19.1, 21.8],
    10: [14.2, 16.9, 19.9, 22.9],
    11: [14.6, 17.5, 20.8, 24.0],
    12: [15.1, 18.1, 21.7, 25.2],
    13: [15.6, 18.7, 22.6, 26.2],
    14: [16.1, 19.4, 23.3, 27.2],
    15: [16.5, 19.9, 24.0, 28.1],
    16: [16.9, 20.4, 24.6, 28.9],
    17: [17.2, 20.8, 25.1, 29.6],
    18: [17.5, 21.3, 25.6, 30.3],
    19: [17.8, 21.6, 26.1, 31.0],
    20: [17.9, 21.7, 26.5, 31.8],
  },
}

export const AGE_RANGE: [number, number] = [2, 20]
export const BMI_RANGE: [number, number] = [12, 32]

/** The BMI on one curve at any age in range, interpolated between whole years. */
export function curveAt(sex: Sex, percentile: Percentile, age: number): number {
  const col = PERCENTILES.indexOf(percentile)
  const a = Math.min(Math.max(age, AGE_RANGE[0]), AGE_RANGE[1])
  const lo = Math.floor(a)
  const hi = Math.min(lo + 1, AGE_RANGE[1])
  const t = a - lo
  return BMI_TABLE[sex][lo][col] * (1 - t) + BMI_TABLE[sex][hi][col] * t
}

/**
 * The weight-status bands a BMI-for-age chart divides into, and the words a
 * memo uses for each. The boundaries are the usual ones: below the 5th
 * percentile, from the 5th up to the 85th, from the 85th up to the 95th, and
 * at or above the 95th.
 */
export const BANDS = [
  { name: 'underweight', from: null, to: 5 },
  { name: 'healthy weight', from: 5, to: 85 },
  { name: 'overweight', from: 85, to: 95 },
  { name: 'obese', from: 95, to: null },
] as const
export type BandName = (typeof BANDS)[number]['name']

/** Which band a child of this age and BMI falls in, read off the chart. */
export function bandFor(sex: Sex, age: number, bmi: number): BandName {
  if (bmi < curveAt(sex, 5, age)) return 'underweight'
  if (bmi < curveAt(sex, 85, age)) return 'healthy weight'
  if (bmi < curveAt(sex, 95, age)) return 'overweight'
  return 'obese'
}

/**
 * How far a point sits from the nearest curve, in BMI units.
 *
 * A question whose child lands almost ON a curve is a bad question: two
 * learners reading the same chart carefully can put the point on opposite
 * sides of the line, and the memo then marks one of them wrong for a reading
 * the chart cannot settle. The checker requires every plotted child to sit
 * clearly inside a band.
 */
export function clearanceFor(sex: Sex, age: number, bmi: number): number {
  return Math.min(...PERCENTILES.map((p) => Math.abs(bmi - curveAt(sex, p, age))))
}

/** BMI = mass (kg) ÷ height (m)², the formula the Measurement questions use. */
export const bmiOf = (massKg: number, heightM: number): number => massKg / (heightM * heightM)
