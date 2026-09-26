import type { ChartSpec } from '@/types'

/**
 * Charts for the Mathematical Literacy questions that describe one in words.
 *
 * Fourteen questions described a chart instead of showing it: box-and-whisker
 * diagrams, histograms, pie charts and two misleading bar graphs. The numbers
 * below are the ones those questions state, and `npm run check:charts` fails if
 * any value on a chart is not written in its question -- so a chart here cannot
 * quietly disagree with the words beside it.
 *
 * WHICH SIDE A CHART GOES ON is the same judgement as for a graph or a diagram.
 * Where the question hands the learner a chart to READ ("a histogram shows ...",
 * "two box-and-whisker diagrams show ..."), it goes beside the question, as an
 * exam prints it. Where the question asks the learner to PRODUCE what the chart
 * would show -- a sector angle, a five-number summary -- it goes with the answer,
 * because drawing it above the prompt answers the question.
 *
 * THE TWO MISLEADING GRAPHS are drawn misleadingly on purpose, with the axis
 * starting where the question says it does, and the honest version goes with
 * the answer. A misleading graph drawn honestly leaves nothing to spot.
 */

/**
 * The five-number summary the way CAPS teaches it: the median splits the
 * ordered data, and each quartile is the median of its half, with the middle
 * value left out of both halves when there is an odd number of values.
 */
export function fiveNumberSummary(values: number[]) {
  const v = [...values].sort((a, b) => a - b)
  const med = (xs: number[]) => {
    const m = Math.floor(xs.length / 2)
    return xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2
  }
  const half = Math.floor(v.length / 2)
  return {
    min: v[0],
    q1: med(v.slice(0, half)),
    median: med(v),
    q3: med(v.slice(v.length % 2 ? half + 1 : half)),
    max: v[v.length - 1],
  }
}

const TRAVEL = ['Walk', 'Taxi', 'Bus', 'Car']

export const chartSpecs: Record<string, { chart?: ChartSpec; answerChart?: ChartSpec }> = {
  'gap-ml-mislead-truncated-axis': {
    chart: {
      kind: 'bar',
      title: 'Pass rate at the school, as the principal drew it',
      categories: ['2024', '2025'],
      values: [62, 66],
      unit: '%',
      yLabel: 'Pass rate',
      yFrom: 60,
      yTo: 68,
      yStep: 2,
    },
    answerChart: {
      kind: 'bar',
      title: 'The same pass rates, with the axis starting at zero',
      categories: ['2024', '2025'],
      values: [62, 66],
      unit: '%',
      yLabel: 'Pass rate',
      yTo: 70,
      yStep: 10,
    },
  },
  'dh-mis-1': {
    chart: {
      kind: 'bar',
      title: "The shop's sales graph, as advertised",
      categories: ['January', 'February', 'March'],
      values: [1000, 1020, 1040],
      yLabel: 'Units sold',
      yFrom: 980,
      yTo: 1050,
      yStep: 10,
    },
    answerChart: {
      kind: 'bar',
      title: 'The same sales, with the axis starting at zero',
      categories: ['January', 'February', 'March'],
      values: [1000, 1020, 1040],
      yLabel: 'Units sold',
      yTo: 1200,
      yStep: 200,
    },
  },
  'dh-pie-1': {
    chart: {
      kind: 'pie',
      title: 'How 400 learners travel to school',
      unit: '%',
      pies: [
        {
          slices: [
            { label: 'Walk', value: 45 },
            { label: 'Taxi', value: 30 },
            { label: 'Bus', value: 15 },
            { label: 'Own car', value: 10 },
          ],
        },
      ],
    },
  },
  'gap-ml-represent-pie-angles': {
    answerChart: {
      kind: 'pie',
      title: 'How the class of 50 travels to school, with each sector angle',
      showAngles: true,
      pies: [{ slices: [14, 22, 9, 5].map((value, i) => ({ label: TRAVEL[i], value })) }],
    },
  },
  'dh-pie-2': {
    answerChart: {
      kind: 'pie',
      title: 'Monthly household spending, with each sector angle',
      prefix: 'R',
      showAngles: true,
      pies: [
        {
          slices: [
            { label: 'Rent', value: 4800 },
            { label: 'Food', value: 3600 },
            { label: 'Transport', value: 2400 },
            { label: 'Other', value: 1200 },
          ],
        },
      ],
    },
  },
  'dh-pie-3': {
    // The question gives only the walking share at each school, so the rest of
    // each pie is drawn as one slice -- worked out as 100% minus the walkers,
    // and marked as such, rather than split into categories nobody stated.
    chart: {
      kind: 'pie',
      title: 'How learners get to school at the two schools',
      unit: '%',
      pies: [
        {
          label: 'School A',
          slices: [
            { label: 'Walk', value: 40 },
            { label: 'Other ways', value: 60, remainder: true },
          ],
        },
        {
          label: 'School B',
          slices: [
            { label: 'Walk', value: 25 },
            { label: 'Other ways', value: 75, remainder: true },
          ],
        },
      ],
    },
  },
  'gap-ml-represent-histogram': {
    answerChart: {
      kind: 'histogram',
      title: 'Class test marks drawn as a histogram',
      edges: [0, 20, 40, 60, 80, 100],
      counts: [3, 8, 14, 11, 4],
      xLabel: 'Mark out of 100',
      yLabel: 'Number of learners',
    },
  },
  'dh-hist-1': {
    chart: {
      kind: 'histogram',
      title: 'Time learners spent on homework',
      edges: [0, 20, 40, 60, 80],
      counts: [6, 14, 22, 8],
      xLabel: 'Time (minutes)',
      yLabel: 'Number of learners',
    },
  },
  'dh-hist-2': {
    chart: {
      kind: 'histogram',
      title: 'Monthly water use per household',
      edges: [0, 10, 20, 30, 40, 50],
      counts: [18, 35, 27, 12, 8],
      xLabel: 'Water used (kℓ)',
      yLabel: 'Number of households',
    },
  },
  'dh-box-1': {
    chart: {
      kind: 'boxplot',
      title: 'Test marks out of 50',
      axis: [0, 50],
      step: 5,
      xLabel: 'Mark out of 50',
      boxes: [{ min: 12, q1: 24, median: 30, q3: 38, max: 47 }],
    },
  },
  'dh-box-2': {
    answerChart: {
      kind: 'boxplot',
      title: "The twelve learners' marks as a box-and-whisker diagram",
      axis: [0, 50],
      step: 5,
      xLabel: 'Mark',
      boxes: [fiveNumberSummary([8, 11, 14, 16, 19, 21, 23, 26, 29, 33, 38, 45])],
    },
  },
  'dh-box-3': {
    chart: {
      kind: 'boxplot',
      title: 'The same test written by two classes',
      axis: [0, 100],
      step: 10,
      xLabel: 'Test mark',
      boxes: [
        { label: 'Class A', min: 20, q1: 34, median: 52, q3: 60, max: 72 },
        { label: 'Class B', min: 18, q1: 44, median: 54, q3: 58, max: 90 },
      ],
    },
  },
}

/**
 * Questions that describe a chart but deliberately have none, and why. The
 * checker fails on any chart-describing question missing from both lists, so
 * a new one cannot be written without someone deciding which it is.
 */
export const chartExempt: Record<string, string> = {
  'dat-c1':
    'Gives only January (120) and June (300). Drawing the months between would mean inventing four values the question never states.',
  'dh-hist-3':
    'Describes two wrongly drawn graphs without any frequencies. Drawing them would mean inventing the data.',
  'ml-p1-cn-5-1-5':
    'Asks the learner to name a suitable type of graph. Drawing one would give the answer away.',
}
