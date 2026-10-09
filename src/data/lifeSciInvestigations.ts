/**
 * Life Sciences investigations: the question types report:question-types found
 * thinnest -- INVESTIGATION SKILLS (aim, hypothesis, variables, controls,
 * reliability and validity, conclusion) and GRAPH OR DATA INTERPRETATION
 * (reading a table, the graph to draw, a calculation from the data).
 *
 * Each investigation is the kind an NSC paper sets, with a table of results
 * and two questions on it: one on how it was planned, and one analysing what
 * it found. Calculated values -- means, percentage changes, estimates -- are
 * computed from the table, so the table and its memo cannot disagree.
 */
import type { Grade, MemoStep, Question } from '@/types'

const n = (v: number, dp = 1): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(Math.abs(r)).split('.')
  return (r < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}
const table = (title: string, head: string[], rows: (string | number)[][]) =>
  `|+ TABLE: ${title}\n| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.map((c) => (typeof c === 'number' ? n(c, 2) : c)).join(' | ')} |`).join('\n')}`
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
const pct = (from: number, to: number) => ((to - from) / from) * 100

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

// ================================================================ GRADE 10

// --- Cells: osmosis in potato cylinders
{
  const conc = [0, 0.2, 0.4, 0.6, 0.8]
  const change = [12, 4, -3, -9, -14]
  // Where the line crosses zero, between 0,2 and 0,4.
  const zero = conc[1] + (change[1] / (change[1] - change[2])) * (conc[2] - conc[1])
  investigation(
    'life-sci-cells',
    10,
    'lsi-10-osmosis-potato',
    `In an investigation, potato cylinders of the same size were weighed, placed in sugar solutions of different concentrations for 24 hours, then dried and reweighed. Three cylinders were used for each solution.\n${table('RESULTS: MEAN PERCENTAGE CHANGE IN MASS', ['Sugar concentration (mol·dm⁻³)', 'Mean change in mass (%)'], conc.map((c, i) => [n(c, 1), `${change[i] > 0 ? '+' : ''}${n(change[i], 0)}`]))}`,
    {
      marks: 5,
      prompt: 'State the aim of this investigation and name the independent and dependent variables. Give ONE way the investigation was made reliable, and explain why the cylinders were dried before reweighing.',
      answer: 'Aim: to investigate the effect of the concentration of a sugar solution on the mass of potato tissue (osmosis). Independent: the concentration of the sugar solution. Dependent: the percentage change in mass. Reliability: three cylinders were used for each solution and the mean was calculated. Drying removes the solution clinging to the surface, so only the water taken into or lost from the cells is measured.',
      explanation: 'Repeating each treatment and averaging makes the results reliable. Using percentage change, not change in mass, allows for small differences in starting mass.',
      memo: [
        { code: 'A', marks: 1, text: 'aim' },
        { code: 'A', marks: 1, text: 'independent: concentration' },
        { code: 'A', marks: 1, text: 'dependent: % change in mass' },
        { code: 'A', marks: 1, text: 'three cylinders per solution, mean taken' },
        { code: 'R', marks: 1, text: 'surface liquid would add mass' },
      ],
    },
    {
      marks: 5,
      prompt: 'Explain the results for the 0 and 0,8 mol·dm⁻³ solutions in terms of osmosis. Use the results to estimate the concentration of the cell sap of the potato cells, and explain how you got it.',
      answer: `0 mol·dm⁻³ (pure water): water moved INTO the cells by osmosis, from a high to a low water potential, so the mass increased. 0,8 mol·dm⁻³: water moved OUT of the cells into the more concentrated solution, so the mass decreased. Cell sap ≈ ${n(zero, 2)} mol·dm⁻³: where there is no change in mass, the solution and the cells have the same water potential.`,
      explanation: `The change in mass crosses zero between 0,2 (+${change[1]}%) and 0,4 mol·dm⁻³ (${n(change[2], 0)}%). Reading the graph at 0% (or interpolating): 0,2 + ${change[1]}/${change[1] - change[2]} × 0,2 ≈ ${n(zero, 2)} mol·dm⁻³.`,
      memo: [
        { code: 'A', marks: 1, text: 'water: water enters, mass increases' },
        { code: 'A', marks: 1, text: '0,8: water leaves, mass decreases' },
        { code: 'R', marks: 1, text: 'osmosis from high to low water potential' },
        { code: 'A', marks: 1, text: `≈ ${n(zero, 2)} mol·dm⁻³` },
        { code: 'R', marks: 1, text: 'no change in mass: equal water potentials' },
      ],
    },
  )
}

// --- Animal tissues: muscle fatigue
{
  const counts = [58, 52, 45, 40, 36]
  investigation(
    'life-sci-animal-tissues',
    10,
    'lsi-10-muscle-fatigue',
    `In an investigation, a learner squeezed a clothes peg between thumb and forefinger as many times as possible in five consecutive 30-second periods, without resting.\n${table('RESULTS', ['Period', ...counts.map((_, i) => `${i + 1}`)], [['Number of squeezes', ...counts.map((c) => `${c}`)]])}`,
    {
      marks: 4,
      prompt: 'Formulate a hypothesis about the effect of continuous use on a muscle of the hand. Name the dependent variable, and TWO factors that must be kept constant.',
      answer: 'Hypothesis: the number of times a muscle can contract in a fixed time decreases as the muscle is used continuously (fatigue). Dependent: the number of squeezes per 30 seconds. Constant: the same hand and fingers; the same peg; the same length of each period; no rest between periods.',
      explanation: 'A different peg or hand would need a different force, which would affect the count for reasons other than fatigue.',
      memo: [
        { code: 'A', marks: 1, text: 'hypothesis' },
        { code: 'A', marks: 1, text: 'dependent: number of squeezes' },
        { code: 'A', marks: 2, text: 'two constant factors' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the percentage decrease in the number of squeezes from period 1 to period 5. Explain why the muscle became fatigued. Suggest how the results could be made more reliable.',
      answer: `Decrease of ${n(-pct(counts[0], counts[4]))}%. With continuous contraction, oxygen cannot reach the muscle fast enough, so it respires anaerobically; lactic acid builds up and the muscle tires. Reliability: repeat with more learners and calculate the mean.`,
      explanation: `(${counts[0]} − ${counts[4]}) ÷ ${counts[0]} × 100 = ${n(-pct(counts[0], counts[4]))}%. One learner's result could be unusual; a larger sample makes the trend trustworthy.`,
      memo: [
        { code: 'M', marks: 1, text: `(${counts[0]} − ${counts[4]}) ÷ ${counts[0]} × 100` },
        { code: 'A', marks: 1, text: `${n(-pct(counts[0], counts[4]))}%` },
        { code: 'R', marks: 1, text: 'insufficient oxygen: anaerobic respiration' },
        { code: 'R', marks: 1, text: 'lactic acid builds up' },
        { code: 'A', marks: 1, text: 'repeat / more learners / mean' },
      ],
    },
  )
}

// --- Circulatory system: heart rate and exercise
{
  const rest = [68, 72, 75, 64, 71]
  const after = [118, 126, 130, 110, 121]
  investigation(
    'life-sci-circulatory-system',
    10,
    'lsi-10-heart-rate-exercise',
    `In an investigation, five learners measured their heart rate at rest and immediately after running on the spot for three minutes.\n${table('RESULTS: HEART RATE (beats per minute)', ['Learner', 'At rest', 'After exercise'], rest.map((r, i) => [`${String.fromCharCode(65 + i)}`, `${r}`, `${after[i]}`]))}`,
    {
      marks: 4,
      prompt: 'Name the independent and dependent variables, and TWO variables that should be controlled. Why did the learners measure their resting heart rate first?',
      answer: 'Independent: exercise (rest or after running). Dependent: heart rate. Controlled: the type and length of exercise; the way the pulse is counted (same time interval); the learners\' state before starting (seated, rested). The resting rate is a baseline (control) to compare with.',
      explanation: 'Without the resting value there is nothing to show that the exercise changed the heart rate.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: exercise' },
        { code: 'A', marks: 1, text: 'dependent: heart rate' },
        { code: 'A', marks: 1, text: 'two controlled variables' },
        { code: 'R', marks: 1, text: 'baseline / control for comparison' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the mean heart rate at rest and after exercise, and the percentage increase in the mean. Explain why the heart rate increases during exercise.',
      answer: `Mean at rest ${n(mean(rest))}; after exercise ${n(mean(after))} beats per minute: an increase of ${n(pct(mean(rest), mean(after)))}%. Muscles respire faster during exercise and need more oxygen and glucose, and more carbon dioxide must be removed; the heart beats faster to pump blood more quickly.`,
      explanation: `Rest: ${rest.join(' + ')} = ${rest.reduce((a, b) => a + b, 0)} ÷ 5 = ${n(mean(rest))}. After: ${after.reduce((a, b) => a + b, 0)} ÷ 5 = ${n(mean(after))}. (${n(mean(after))} − ${n(mean(rest))}) ÷ ${n(mean(rest))} × 100 = ${n(pct(mean(rest), mean(after)))}%.`,
      memo: [
        { code: 'A', marks: 1, text: `rest ${n(mean(rest))}` },
        { code: 'A', marks: 1, text: `after ${n(mean(after))}` },
        { code: 'A', marks: 1, text: `${n(pct(mean(rest), mean(after)))}%` },
        { code: 'R', marks: 1, text: 'more oxygen and glucose needed by muscles' },
        { code: 'R', marks: 1, text: 'more CO₂ to remove; blood pumped faster' },
      ],
    },
  )
}

// --- Skeletal system: bone density and age
{
  const ages = [20, 30, 40, 50, 60, 70]
  const dens = [1.2, 1.18, 1.12, 1.02, 0.92, 0.84]
  investigation(
    'life-sci-skeletal-system',
    10,
    'lsi-10-bone-density-age',
    `A study measured the mean bone mineral density of women of different ages.\n${table('RESULTS', ['Age (years)', 'Mean bone density (g·cm⁻²)'], ages.map((a, i) => [`${a}`, dens[i].toFixed(2).replace('.', ',')]))}`,
    {
      marks: 3,
      prompt: 'Name the independent and dependent variables in this study, and state the type of graph that should be used to show the results. Give a reason.',
      answer: 'Independent: age. Dependent: bone density. A line graph, because both variables are continuous (numerical) and the trend over time is being shown.',
      explanation: 'Bar graphs are for discontinuous categories; age and density both vary continuously.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: age' },
        { code: 'A', marks: 1, text: 'dependent: bone density' },
        { code: 'R', marks: 1, text: 'line graph: continuous data' },
      ],
    },
    {
      marks: 5,
      prompt: 'Describe the trend in the results. Calculate the percentage decrease in bone density between the ages of 40 and 70. Name the condition this loss can lead to, and suggest TWO ways of reducing the risk.',
      answer: `Bone density stays fairly constant to about 40 and then decreases more and more quickly. Decrease from 40 to 70: ${n(-pct(dens[2], dens[5]))}%. Osteoporosis (brittle, easily broken bones). Reduce the risk with a diet rich in calcium and vitamin D, and regular weight-bearing exercise.`,
      explanation: `(${n(dens[2], 2)} − ${n(dens[5], 2)}) ÷ ${n(dens[2], 2)} × 100 = ${n(-pct(dens[2], dens[5]))}%. After menopause, lower oestrogen levels speed up the loss of calcium from bone.`,
      memo: [
        { code: 'A', marks: 1, text: 'constant, then decreasing after 40' },
        { code: 'M', marks: 1, text: 'decrease ÷ value at 40 × 100' },
        { code: 'A', marks: 1, text: `${n(-pct(dens[2], dens[5]))}%` },
        { code: 'A', marks: 1, text: 'osteoporosis' },
        { code: 'A', marks: 1, text: 'calcium / vitamin D / exercise (two)' },
      ],
    },
  )
}

// --- Transport in plants: transpiration and wind
{
  const still = [12, 13, 11]
  const fan = [27, 30, 28]
  investigation(
    'life-sci-transport-plants',
    10,
    'lsi-10-transpiration-wind',
    `In an investigation, a potometer with a leafy shoot was used to measure the distance an air bubble moved in 10 minutes, first in still air and then with a fan blowing on the shoot. Each was done three times.\n${table('RESULTS: DISTANCE MOVED BY THE BUBBLE (mm in 10 min)', ['Condition', 'Trial 1', 'Trial 2', 'Trial 3'], [['Still air', ...still.map(String)], ['Fan on', ...fan.map(String)]])}`,
    {
      marks: 4,
      prompt: 'State the aim of the investigation. Name the independent variable and TWO variables that must be kept constant. Why was each condition repeated three times?',
      answer: 'Aim: to investigate the effect of wind on the rate of transpiration. Independent: wind (fan on or off). Constant: temperature; light intensity; humidity; the same shoot. Repeating makes the results more reliable.',
      explanation: 'Light, temperature and humidity also affect transpiration, so they must stay the same while only the air movement changes.',
      memo: [
        { code: 'A', marks: 1, text: 'aim' },
        { code: 'A', marks: 1, text: 'independent: wind' },
        { code: 'A', marks: 1, text: 'two constant variables' },
        { code: 'R', marks: 1, text: 'reliability' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the mean distance for each condition and the mean rate of water uptake with the fan on, in mm per minute. Write a conclusion and explain the effect of wind.',
      answer: `Still air ${n(mean(still))} mm; fan on ${n(mean(fan))} mm, a rate of ${n(mean(fan) / 10, 2)} mm·min⁻¹. Conclusion: wind increases the rate of transpiration. Wind blows away the water vapour around the leaf, keeping the air outside the stomata dry, so water vapour diffuses out faster.`,
      explanation: `Still: (${still.join(' + ')}) ÷ 3 = ${n(mean(still))}; fan: (${fan.join(' + ')}) ÷ 3 = ${n(mean(fan))}; ${n(mean(fan))} ÷ 10 min = ${n(mean(fan) / 10, 2)} mm·min⁻¹. A potometer measures water uptake, which is taken to equal water lost by transpiration.`,
      memo: [
        { code: 'A', marks: 1, text: `still ${n(mean(still))} mm` },
        { code: 'A', marks: 1, text: `fan ${n(mean(fan))} mm` },
        { code: 'A', marks: 1, text: `${n(mean(fan) / 10, 2)} mm·min⁻¹` },
        { code: 'A', marks: 1, text: 'wind increases transpiration' },
        { code: 'R', marks: 1, text: 'removes water vapour: steeper diffusion gradient' },
      ],
    },
  )
}

// --- Ecosystems: a transect from shade into open ground
{
  const pts = [1, 2, 3, 4, 5]
  const light = [800, 2400, 5200, 8600, 12000]
  const ferns = [14, 11, 6, 2, 0]
  investigation(
    'life-sci-ecosystem-energy-flow',
    10,
    'lsi-10-transect-light',
    `In an investigation, learners laid a line transect from the shade of a forest into open grassland. At five points along it they measured the light intensity and counted the ferns in a 1 m² quadrat.\n${table('RESULTS', ['Point', 'Light intensity (lux)', 'Number of ferns'], pts.map((p, i) => [`${p}`, n(light[i], 0), `${ferns[i]}`]))}`,
    {
      marks: 4,
      prompt: 'State the aim of this investigation. Is light an abiotic or a biotic factor? Name the dependent variable, and ONE way to make the results more reliable.',
      answer: 'Aim: to investigate the effect of light intensity on the distribution of ferns. Light is an abiotic factor. Dependent: the number of ferns. Reliability: use more than one transect / several quadrats at each point and calculate the mean.',
      explanation: 'Abiotic factors are the non-living parts of the environment, such as light, temperature and water.',
      memo: [
        { code: 'A', marks: 1, text: 'aim' },
        { code: 'A', marks: 1, text: 'abiotic' },
        { code: 'A', marks: 1, text: 'dependent: number of ferns' },
        { code: 'A', marks: 1, text: 'more transects / quadrats, mean' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the relationship between light intensity and the number of ferns. Suggest why another abiotic factor, not light, might also explain the pattern.',
      answer: 'As the light intensity increases, the number of ferns decreases: ferns grow best in shade. Soil moisture (or temperature) also changes from forest to grassland -- shaded soil stays wetter -- so it could also explain the pattern; the investigation did not control it.',
      explanation: `From ${ferns[0]} ferns at ${n(light[0], 0)} lux to ${ferns[4]} at ${n(light[4], 0)} lux. In a field study many factors change together along a transect, so a correlation with one of them does not prove it is the cause.`,
      memo: [
        { code: 'A', marks: 1, text: 'more light, fewer ferns' },
        { code: 'A', marks: 1, text: 'ferns favour shade' },
        { code: 'A', marks: 1, text: 'another abiotic factor named' },
        { code: 'R', marks: 1, text: 'it also changes along the transect: not controlled' },
      ],
    },
  )
}

// ================================================================ GRADE 11

// --- Photosynthesis: light intensity and rate
{
  const dist = [10, 20, 30, 40, 50]
  const bubbles = [48, 30, 18, 11, 8]
  investigation(
    'life-sci-photosynthesis',
    11,
    'lsi-11-elodea-light',
    `In an investigation, a water plant (Elodea) in a test tube of water with a little sodium bicarbonate was placed at different distances from a lamp. After 5 minutes at each distance, the bubbles of gas released in one minute were counted.\n${table('RESULTS', ['Distance from the lamp (cm)', 'Bubbles per minute'], dist.map((d, i) => [`${d}`, `${bubbles[i]}`]))}`,
    {
      marks: 5,
      prompt: 'Name the independent and dependent variables. Why was sodium bicarbonate added to the water, and why was the plant left for 5 minutes at each new distance? Name ONE variable that must be kept constant.',
      answer: 'Independent: light intensity (distance from the lamp). Dependent: the rate of photosynthesis (bubbles per minute). Sodium bicarbonate supplies carbon dioxide, so that CO₂ does not limit the rate. The 5 minutes lets the plant adjust to the new light intensity. Constant: temperature (a heat shield / water bath) / the same plant.',
      explanation: 'A lamp also heats; temperature affects enzyme activity, so it must be kept the same while only light intensity changes.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: light intensity' },
        { code: 'A', marks: 1, text: 'dependent: rate (bubbles)' },
        { code: 'R', marks: 1, text: 'NaHCO₃ supplies CO₂' },
        { code: 'R', marks: 1, text: 'time to adjust' },
        { code: 'A', marks: 1, text: 'temperature constant' },
      ],
    },
    {
      marks: 4,
      prompt: 'Describe the trend in the results and write a conclusion. Name the gas in the bubbles. Suggest why counting bubbles is not a very accurate measure of the rate.',
      answer: 'The closer the lamp (the higher the light intensity), the more bubbles per minute. Conclusion: the rate of photosynthesis increases as light intensity increases. The gas is oxygen. Bubbles are not all the same size, and some oxygen dissolves in the water; collecting and measuring the volume of gas is better.',
      explanation: `The rate falls from ${bubbles[0]} to ${bubbles[4]} bubbles per minute as the lamp moves from ${dist[0]} to ${dist[4]} cm away.`,
      memo: [
        { code: 'A', marks: 1, text: 'closer lamp, more bubbles' },
        { code: 'A', marks: 1, text: 'conclusion' },
        { code: 'A', marks: 1, text: 'oxygen' },
        { code: 'R', marks: 1, text: 'bubbles differ in size / gas dissolves' },
      ],
    },
  )
}

// --- Respiration: yeast and temperature
{
  const temps = [10, 20, 30, 40, 50, 60]
  const rate = [4, 11, 22, 30, 9, 0]
  investigation(
    'life-sci-respiration',
    11,
    'lsi-11-yeast-temperature',
    `In an investigation, yeast in glucose solution was kept at different temperatures, and the bubbles of carbon dioxide released in one minute were counted.\n${table('RESULTS', ['Temperature (°C)', 'Bubbles of CO₂ per minute'], temps.map((t, i) => [`${t}`, `${rate[i]}`]))}`,
    {
      marks: 4,
      prompt: 'Formulate a hypothesis for this investigation. Name TWO variables that must be controlled. Describe a suitable control for the investigation.',
      answer: 'Hypothesis: the rate of respiration in yeast increases with temperature up to an optimum, then decreases. Controlled: the mass of yeast; the concentration and volume of the glucose solution. Control: the same set-up with boiled (dead) yeast, which shows the bubbles come from living yeast.',
      explanation: 'A control is identical except for the factor being tested for, so any difference can be put down to that factor.',
      memo: [
        { code: 'A', marks: 1, text: 'hypothesis' },
        { code: 'A', marks: 2, text: 'two controlled variables' },
        { code: 'A', marks: 1, text: 'a valid control' },
      ],
    },
    {
      marks: 5,
      prompt: 'Identify the optimum temperature from the results. Explain the rates at 50 °C and 60 °C. Is this aerobic or anaerobic respiration? Give a reason, and name the other product.',
      answer: `Optimum about 40 °C (${rate[3]} bubbles per minute). Above it, the enzymes that control respiration are denatured: at 50 °C partly, at 60 °C completely, so respiration stops. Anaerobic (fermentation): the yeast is in a solution with little oxygen. The other product is ethanol (alcohol).`,
      explanation: 'Respiration is controlled by enzymes, which work fastest at their optimum temperature and lose their shape (denature) when heated too much.',
      memo: [
        { code: 'A', marks: 1, text: '40 °C' },
        { code: 'R', marks: 1, text: 'enzymes denatured' },
        { code: 'A', marks: 1, text: '60 °C: respiration stops' },
        { code: 'A', marks: 1, text: 'anaerobic, with reason' },
        { code: 'A', marks: 1, text: 'ethanol' },
      ],
    },
  )
}

// --- Gaseous exchange: breathing rate and exercise
{
  const acts = ['Resting', 'Walking', 'Jogging', 'Running']
  const rate = [14, 20, 28, 36]
  investigation(
    'life-sci-gaseous-exchange',
    11,
    'lsi-11-breathing-rate',
    `In an investigation, a learner measured her breathing rate after four minutes of each activity.\n${table('RESULTS', ['Activity', 'Breaths per minute'], acts.map((a, i) => [a, `${rate[i]}`]))}`,
    {
      marks: 4,
      prompt: 'Name the independent and dependent variables, and the type of graph you would draw to show these results. Give a reason for your choice of graph. Why is the result for one learner not valid for all learners?',
      answer: 'Independent: the type of activity. Dependent: breathing rate. A bar graph, because the activities are separate categories (discontinuous data). One learner is too small a sample: other people may respond differently.',
      explanation: 'A line graph would wrongly suggest there are values between "walking" and "jogging".',
      memo: [
        { code: 'A', marks: 1, text: 'variables' },
        { code: 'A', marks: 1, text: 'bar graph' },
        { code: 'R', marks: 1, text: 'categories / discontinuous' },
        { code: 'R', marks: 1, text: 'sample of one' },
      ],
    },
    {
      marks: 5,
      prompt: 'Calculate the percentage increase in breathing rate from resting to running. Explain how the body detects the need to breathe faster during exercise.',
      answer: `${n(pct(rate[0], rate[3]))}% increase. During exercise more CO₂ is produced by respiring muscles. Receptors in the carotid arteries detect the higher CO₂ level and send impulses to the medulla oblongata, which signals the intercostal muscles and diaphragm to contract faster and more strongly.`,
      explanation: `(${rate[3]} − ${rate[0]}) ÷ ${rate[0]} × 100 = ${n(pct(rate[0], rate[3]))}%. Breathing faster removes the extra CO₂ and takes in more oxygen.`,
      memo: [
        { code: 'M', marks: 1, text: `(${rate[3]} − ${rate[0]}) ÷ ${rate[0]} × 100` },
        { code: 'A', marks: 1, text: `${n(pct(rate[0], rate[3]))}%` },
        { code: 'A', marks: 1, text: 'more CO₂ in the blood' },
        { code: 'A', marks: 1, text: 'receptors in the carotid arteries' },
        { code: 'A', marks: 1, text: 'medulla oblongata; breathing muscles' },
      ],
    },
  )
}

// --- Excretion: water intake and urine
{
  const times = [0, 30, 60, 90, 120]
  const water = [40, 160, 210, 90, 45]
  const salty = [40, 35, 30, 30, 35]
  investigation(
    'life-sci-excretion',
    11,
    'lsi-11-urine-volume',
    `In an investigation, two groups of learners emptied their bladders, then group A drank 1 litre of water and group B 1 litre of salty water. The mean volume of urine produced in each 30-minute period was measured.\n${table('RESULTS: MEAN VOLUME OF URINE (cm³)', ['Time (min)', ...times.map(String)], [['Group A (water)', ...water.map(String)], ['Group B (salty water)', ...salty.map(String)]])}`,
    {
      marks: 4,
      prompt: 'Name the independent and dependent variables. Why were the bladders emptied at the start, and why were groups used instead of single learners?',
      answer: 'Independent: the type of drink (water or salty water). Dependent: the volume of urine produced. Emptying the bladders means all urine collected was produced during the investigation. Groups (and a mean) give more reliable results.',
      explanation: 'A larger sample reduces the effect of one person\'s unusual result.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: type of drink' },
        { code: 'A', marks: 1, text: 'dependent: urine volume' },
        { code: 'R', marks: 1, text: 'only urine made during the test is measured' },
        { code: 'R', marks: 1, text: 'reliability' },
      ],
    },
    {
      marks: 5,
      prompt: 'Describe the results for group A, and explain them in terms of ADH. Explain why group B produced little urine.',
      answer: `Group A produced much more urine, peaking at ${Math.max(...water)} cm³ at 60 minutes, then falling back. The water lowered the solute concentration of the blood, so less ADH was secreted by the pituitary; the collecting ducts became less permeable to water, less was reabsorbed, and more dilute urine was produced. Group B: the salt raised the solute concentration of the blood, so more ADH was secreted, more water was reabsorbed and little urine was made.`,
      explanation: 'ADH (antidiuretic hormone) increases the permeability of the walls of the distal convoluted tubules and collecting ducts to water. This negative feedback keeps the water balance of the blood constant (osmoregulation).',
      memo: [
        { code: 'A', marks: 1, text: 'A: urine volume rises, peaks, falls' },
        { code: 'A', marks: 1, text: 'less ADH secreted' },
        { code: 'A', marks: 1, text: 'less water reabsorbed in the collecting ducts' },
        { code: 'A', marks: 1, text: 'B: more ADH' },
        { code: 'A', marks: 1, text: 'more water reabsorbed: little urine' },
      ],
    },
  )
}

// --- Micro-organisms: antibiotics and bacteria
{
  const abx: [string, number][] = [
    ['A', 22],
    ['B', 8],
    ['C', 15],
    ['D', 0],
  ]
  investigation(
    'life-sci-biodiversity-microorganisms',
    11,
    'lsi-11-antibiotic-discs',
    `In an investigation, paper discs soaked in four different antibiotics were placed on an agar plate covered with bacteria. A fifth disc was soaked in sterile water. After 48 hours at 30 °C, the width of the clear zone around each disc was measured.\n${table('RESULTS', ['Antibiotic', ...abx.map(([a]) => a), 'Sterile water'], [['Clear zone (mm)', ...abx.map(([, w]) => `${w}`), '0']])}`,
    {
      marks: 5,
      prompt: 'Name the independent and dependent variables. What is the purpose of the disc soaked in sterile water? Why were the plates incubated at 30 °C and not at 37 °C? Name ONE safety precaution.',
      answer: 'Independent: the type of antibiotic. Dependent: the width of the clear zone (where bacteria did not grow). The sterile-water disc is the control: it shows that the clear zones are caused by the antibiotics and not by the paper or water. 30 °C reduces the risk of growing bacteria that cause disease in humans (body temperature). Precaution: seal the plates and do not open them / wash hands / sterilise equipment.',
      explanation: 'A clear zone is an area where the antibiotic has stopped the bacteria growing.',
      memo: [
        { code: 'A', marks: 1, text: 'independent: antibiotic' },
        { code: 'A', marks: 1, text: 'dependent: clear zone' },
        { code: 'R', marks: 1, text: 'control' },
        { code: 'R', marks: 1, text: 'avoids growing human pathogens' },
        { code: 'A', marks: 1, text: 'safety precaution' },
      ],
    },
    {
      marks: 4,
      prompt: 'Which antibiotic was most effective against these bacteria? Explain. Suggest why antibiotic D had no effect, and why patients are told to finish a course of antibiotics.',
      answer: 'Antibiotic A: it has the widest clear zone, so it stopped the most bacterial growth. The bacteria may be RESISTANT to D. Finishing the course kills all the bacteria; stopping early lets the most resistant ones survive and multiply, so resistance spreads.',
      explanation: `Clear zones: ${abx.map(([a, w]) => `${a} ${w} mm`).join(', ')}. Resistance arises by natural selection: bacteria that happen to survive pass the resistance on.`,
      memo: [
        { code: 'A', marks: 1, text: 'A' },
        { code: 'R', marks: 1, text: 'widest clear zone' },
        { code: 'A', marks: 1, text: 'bacteria resistant to D' },
        { code: 'R', marks: 1, text: 'surviving resistant bacteria multiply' },
      ],
    },
  )
}

// --- Plants: germination and temperature
{
  const temps = [5, 15, 25, 35]
  const sown = 50
  const germ = [5, 30, 46, 20]
  investigation(
    'life-sci-biodiversity-plants',
    11,
    'lsi-11-germination-temperature',
    `In an investigation, ${sown} bean seeds were placed on moist cotton wool in each of four incubators at different temperatures. The number that had germinated after 7 days was counted.\n${table('RESULTS', ['Temperature (°C)', 'Seeds germinated (out of 50)'], temps.map((t, i) => [`${t}`, `${germ[i]}`]))}`,
    {
      marks: 4,
      prompt: 'Formulate a hypothesis and name TWO variables that were kept constant. Why were 50 seeds used at each temperature rather than one?',
      answer: 'Hypothesis: temperature affects the percentage of seeds that germinate (germination increases up to an optimum temperature, then decreases). Constant: the type of seed; the amount of water (moist cotton wool); the time (7 days); light. A large sample makes the result reliable: one seed might be dead or damaged.',
      explanation: 'Germination needs water, oxygen and a suitable temperature; only temperature may change.',
      memo: [
        { code: 'A', marks: 1, text: 'hypothesis' },
        { code: 'A', marks: 2, text: 'two constant variables' },
        { code: 'R', marks: 1, text: 'reliability: large sample' },
      ],
    },
    {
      marks: 4,
      prompt: 'Calculate the percentage germination at each temperature. Identify the optimum temperature among those tested, and explain why fewer seeds germinated at 35 °C.',
      answer: `${temps.map((t, i) => `${t} °C: ${n((germ[i] / sown) * 100, 0)}%`).join('; ')}. Optimum: 25 °C. At 35 °C the enzymes that break down the food stored in the seed begin to denature, so fewer seeds can germinate.`,
      explanation: `Percentage = number germinated ÷ ${sown} × 100, for example ${germ[2]} ÷ ${sown} × 100 = ${n((germ[2] / sown) * 100, 0)}%.`,
      memo: [
        { code: 'M', marks: 1, text: `÷ ${sown} × 100` },
        { code: 'A', marks: 1, text: 'all four percentages' },
        { code: 'A', marks: 1, text: '25 °C' },
        { code: 'R', marks: 1, text: 'enzymes denature' },
      ],
    },
  )
}

// --- Population ecology: mark-recapture, and a growth curve
{
  const marked = 60
  const second = 50
  const recaptured = 12
  const N = (marked * second) / recaptured
  investigation(
    'life-sci-population-ecology',
    11,
    'lsi-11-mark-recapture',
    `In an investigation to estimate the population of field mice on a farm, ecologists trapped ${marked} mice, marked them and released them. A week later they trapped ${second} mice, of which ${recaptured} were marked.\n${table('RESULTS', ['Mice marked and released', 'Mice caught in the second sample', 'Marked mice recaptured'], [[`${marked}`, `${second}`, `${recaptured}`]])}`,
    {
      marks: 4,
      prompt: 'State TWO assumptions on which the mark-recapture method depends. Why must the mark not make the mice more visible to predators?',
      answer: 'Assumptions: the marked mice mix evenly with the rest of the population; no mice are born, die, arrive or leave between the samples; marks are not lost. A visible mark would make marked mice more likely to be eaten, so fewer would be recaptured and the population would be OVERestimated.',
      explanation: 'The method assumes the proportion marked in the second sample equals the proportion marked in the whole population.',
      memo: [
        { code: 'A', marks: 2, text: 'two assumptions' },
        { code: 'R', marks: 1, text: 'marked mice would be eaten more' },
        { code: 'A', marks: 1, text: 'population overestimated' },
      ],
    },
    {
      marks: 3,
      prompt: 'Calculate the estimated size of the mouse population. Suggest how the estimate could be made more reliable.',
      answer: `${n(N, 0)} mice. Repeat the recapture several times and calculate the mean estimate.`,
      explanation: `Population = (number marked × number in second sample) ÷ number recaptured = (${marked} × ${second}) ÷ ${recaptured} = ${n(N, 0)}.`,
      memo: [
        { code: 'SF', marks: 1, text: `(${marked} × ${second}) ÷ ${recaptured}` },
        { code: 'A', marks: 1, text: `${n(N, 0)}` },
        { code: 'A', marks: 1, text: 'repeat and take the mean' },
      ],
    },
  )
  const days = [0, 2, 4, 6, 8, 10, 12]
  const yeast = [10, 25, 90, 250, 380, 410, 405]
  out.push({
    id: 'lsi-11-yeast-growth-curve',
    topicId: 'life-sci-population-ecology',
    grade: 11,
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `In an investigation, a small number of yeast cells was added to a flask of nutrient solution, and the number of cells in 1 mm³ was counted every two days.\n${table('RESULTS', ['Day', ...days.map(String)], [['Yeast cells per mm³', ...yeast.map(String)]])}`,
    prompt: 'Name the type of population growth curve the results would give. Identify the days on which the population grows fastest, and the carrying capacity of the flask. Explain why the population stops increasing, and name TWO environmental resistance factors in the flask.',
    answer: `A sigmoid (S-shaped) logistic growth curve. Fastest growth between day 4 and day 6 (an increase of ${yeast[3] - yeast[2]} cells per mm³). Carrying capacity: about 410 cells per mm³. The population stops growing when environmental resistance limits it: births equal deaths. Factors: shortage of food (glucose); build-up of toxic wastes (alcohol, CO₂); lack of space.`,
    explanation: `Increases per 2 days: ${yeast.slice(1).map((y, i) => n(y - yeast[i], 0)).join('; ')}. The largest is between days 4 and 6 (the exponential phase). The population then levels off (stationary phase) at the carrying capacity, the maximum the environment can support.`,
    memo: [
      { code: 'A', marks: 1, text: 'sigmoid / logistic' },
      { code: 'A', marks: 1, text: 'days 4 to 6' },
      { code: 'A', marks: 1, text: 'about 410 per mm³' },
      { code: 'R', marks: 1, text: 'environmental resistance: births = deaths' },
      { code: 'A', marks: 2, text: 'two factors' },
    ],
  })
}

// --- Human impact: carbon dioxide over time, and acid on germination
{
  const years = [1960, 1980, 2000, 2020]
  const co2 = [317, 339, 370, 414]
  out.push({
    id: 'lsi-11-co2-trend',
    topicId: 'life-sci-human-impact',
    grade: 11,
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 6,
    context: `${table('MEAN ATMOSPHERIC CARBON DIOXIDE MEASURED AT AN OBSERVATORY', ['Year', ...years.map(String)], [['CO₂ (parts per million)', ...co2.map(String)]])}`,
    prompt: 'Describe the trend in the data. Calculate the percentage increase in CO₂ from 1960 to 2020, and the mean increase per year from 2000 to 2020. Name TWO human activities responsible, and ONE consequence of the increase.',
    answer: `CO₂ increased throughout, and faster in each later period. Increase 1960–2020: ${n(pct(co2[0], co2[3]))}%. 2000–2020: ${n((co2[3] - co2[2]) / 20, 1)} ppm per year. Activities: burning fossil fuels (power stations, vehicles); deforestation. Consequence: an enhanced greenhouse effect and global warming (climate change).`,
    explanation: `(${co2[3]} − ${co2[0]}) ÷ ${co2[0]} × 100 = ${n(pct(co2[0], co2[3]))}%. (${co2[3]} − ${co2[2]}) ÷ 20 = ${n((co2[3] - co2[2]) / 20, 1)} ppm per year, compared with ${n((co2[1] - co2[0]) / 20, 1)} ppm per year from 1960 to 1980.`,
    memo: [
      { code: 'A', marks: 1, text: 'increasing, more rapidly' },
      { code: 'A', marks: 1, text: `${n(pct(co2[0], co2[3]))}%` },
      { code: 'A', marks: 1, text: `${n((co2[3] - co2[2]) / 20, 1)} ppm per year` },
      { code: 'A', marks: 2, text: 'two human activities' },
      { code: 'A', marks: 1, text: 'global warming / climate change' },
    ],
  })
  const vinegar = [0, 5, 10, 20]
  const germinated = [18, 15, 9, 2]
  investigation(
    'life-sci-human-impact',
    11,
    'lsi-11-acid-rain-germination',
    `In an investigation to model the effect of acid rain, learners watered dishes of 20 radish seeds each with solutions of different vinegar concentrations for a week.\n${table('RESULTS', ['Vinegar concentration (%)', 'Seeds germinated (out of 20)'], vinegar.map((v, i) => [`${v}`, `${germinated[i]}`]))}`,
    {
      marks: 4,
      prompt: 'Name the independent and dependent variables. Which dish is the control, and why is it needed? Name ONE variable that must be kept constant.',
      answer: 'Independent: the concentration of vinegar (acid). Dependent: the number of seeds that germinated. Control: the dish watered with 0% vinegar (plain water); it shows how many seeds germinate without acid, for comparison. Constant: the volume of solution; the type and number of seeds; temperature.',
      explanation: 'Without the control the learners could not tell how much of any failure to germinate was caused by the acid.',
      memo: [
        { code: 'A', marks: 1, text: 'variables' },
        { code: 'A', marks: 1, text: 'the 0% dish' },
        { code: 'R', marks: 1, text: 'for comparison' },
        { code: 'A', marks: 1, text: 'a constant variable' },
      ],
    },
    {
      marks: 4,
      prompt: 'Calculate the percentage of seeds that germinated in the 0% and 20% dishes. Write a conclusion, and name the gases from human activities that cause acid rain.',
      answer: `0%: ${n((germinated[0] / 20) * 100, 0)}%; 20%: ${n((germinated[3] / 20) * 100, 0)}%. Conclusion: the higher the acid concentration, the fewer seeds germinate. Acid rain is caused by sulfur dioxide and nitrogen oxides from burning fossil fuels.`,
      explanation: `${germinated[0]} ÷ 20 × 100 = ${n((germinated[0] / 20) * 100, 0)}% and ${germinated[3]} ÷ 20 × 100 = ${n((germinated[3] / 20) * 100, 0)}%. These gases dissolve in rainwater to form sulfuric and nitric acid.`,
      memo: [
        { code: 'A', marks: 1, text: `${n((germinated[0] / 20) * 100, 0)}%` },
        { code: 'A', marks: 1, text: `${n((germinated[3] / 20) * 100, 0)}%` },
        { code: 'A', marks: 1, text: 'conclusion' },
        { code: 'A', marks: 1, text: 'SO₂ and nitrogen oxides' },
      ],
    },
  )
}

// --- Animal nutrition: amylase and temperature
{
  const temps = [10, 25, 37, 50, 70]
  const mins = [14, 6, 2, 9, null]
  investigation(
    'life-sci-animal-nutrition',
    11,
    'lsi-11-amylase-temperature',
    `In an investigation, starch solution and amylase were mixed at different temperatures. Every minute a drop of the mixture was tested with iodine solution, and the time until the iodine no longer turned blue-black was recorded.\n${table('RESULTS', ['Temperature (°C)', 'Time for starch to disappear (min)'], temps.map((t, i) => [`${t}`, mins[i] === null ? 'still present after 20 min' : `${mins[i]}`]))}`,
    {
      marks: 4,
      prompt: 'State the aim and name the dependent variable. Why were the starch and amylase solutions brought to the test temperature BEFORE they were mixed? Name ONE variable that must be controlled.',
      answer: 'Aim: to investigate the effect of temperature on the activity of amylase. Dependent: the time taken for the starch to be digested. If they were mixed first, the reaction would start at room temperature before reaching the test temperature. Controlled: the volume and concentration of starch and of amylase; the pH.',
      explanation: 'The iodine test shows when the starch has gone: iodine stays yellow-brown instead of turning blue-black.',
      memo: [
        { code: 'A', marks: 1, text: 'aim' },
        { code: 'A', marks: 1, text: 'dependent: time' },
        { code: 'R', marks: 1, text: 'reaction must start at the test temperature' },
        { code: 'A', marks: 1, text: 'a controlled variable' },
      ],
    },
    {
      marks: 4,
      prompt: 'At which temperature was amylase most active? Explain. Explain the result at 70 °C, and what would happen if the 10 °C mixture were warmed to 37 °C.',
      answer: '37 °C: the starch disappeared fastest (2 minutes), so the enzyme was most active -- body temperature. At 70 °C the amylase was denatured: its active site changed shape, so starch was not digested. At 10 °C the enzyme is only inactive (molecules move slowly), not denatured, so warming it to 37 °C would make it work faster again.',
      explanation: 'Low temperatures slow enzymes down reversibly; high temperatures destroy their shape irreversibly.',
      memo: [
        { code: 'A', marks: 1, text: '37 °C, shortest time' },
        { code: 'R', marks: 1, text: 'denatured at 70 °C' },
        { code: 'A', marks: 1, text: 'active site changes shape' },
        { code: 'A', marks: 1, text: '10 °C: becomes active again' },
      ],
    },
  )
}

// ================================================================ GRADE 12

// --- Meiosis: maternal age and Down syndrome
{
  const ages = ['20–24', '25–29', '30–34', '35–39', '40–44', '45+']
  const per10000 = [7, 8, 11, 35, 106, 333]
  out.push({
    id: 'lsi-12-maternal-age-down',
    topicId: 'life-sci-meiosis',
    grade: 12,
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `A study recorded the number of babies born with Down syndrome per 10 000 births, for mothers of different ages.\n${table('RESULTS', ['Age of mother (years)', 'Down syndrome per 10 000 births'], ages.map((a, i) => [a, `${per10000[i]}`]))}`,
    prompt: 'Name the independent and dependent variables in this study. Describe the trend in the data. How many times more likely is Down syndrome in babies of mothers aged 40–44 than of mothers aged 25–29? Explain how an abnormal event in meiosis causes Down syndrome.',
    answer: `Independent: the age of the mother. Dependent: the number of Down syndrome births per 10 000. The incidence increases with the mother's age, very steeply after 35. ${n(per10000[4] / per10000[1], 1)} times more likely. Non-disjunction: the chromosome 21 pair fails to separate during meiosis in the mother, so an egg receives two copies of chromosome 21; after fertilisation the zygote has three (trisomy 21), 47 chromosomes in all.`,
    explanation: `${per10000[4]} ÷ ${per10000[1]} = ${n(per10000[4] / per10000[1], 1)}. A woman's egg cells begin meiosis before she is born and complete it only at ovulation, so in older women they have been in arrested meiosis longer, which may make non-disjunction more likely.`,
    memo: [
      { code: 'A', marks: 1, text: 'variables' },
      { code: 'A', marks: 1, text: 'increases with age, sharply after 35' },
      { code: 'A', marks: 1, text: `${n(per10000[4] / per10000[1], 1)} times` },
      { code: 'A', marks: 1, text: 'non-disjunction of chromosome 21' },
      { code: 'A', marks: 1, text: 'gamete with an extra chromosome 21' },
      { code: 'A', marks: 1, text: 'trisomy 21: 47 chromosomes' },
    ],
  })
}

export const lifeSciInvestigations: Question[] = out
