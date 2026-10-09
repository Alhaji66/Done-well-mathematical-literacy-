/**
 * Mathematical Literacy Data Handling: the question TYPES examiners set that
 * the bank was missing.
 *
 * A count of the Grade 10 and 11 pool found 48 and 39 "calculate the mean"
 * questions against 5 and 2 on the median and 3 each on the mode, and none at
 * all that give a measure and ask for the missing value -- "what must she score
 * in test 5 for an average of 68%?", "the median of this ordered list is 20,
 * find x" -- which are among the commonest data-handling questions in the
 * NSC papers. Frequency tables, stem-and-leaf plots, choosing the measure that
 * best represents the data, combined and weighted means, and the effect of a
 * change on the measures were missing too. Grade 12 adds quartiles, the
 * inter-quartile range, percentiles and box-and-whisker plots, which the ATP
 * teaches in Grade 12 only (capsConcepts.ts).
 *
 * Every number in an answer is computed below from the data declared with it,
 * and written with a decimal comma. Each question carries a marking memo in
 * the NSC style (M method, A accuracy, CA consequential accuracy, RT reading
 * from a table, J justification, C conclusion) that adds up to its marks.
 */
import type { Grade, Question } from '@/types'

/** A number with a decimal comma, to `dp` places, trailing zeros dropped; spaces in thousands. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(Math.abs(r)).split('.')
  return (r < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}
/** Rands to the cent: R14 500,00. */
const R = (v: number) => {
  const s = n(v, 2)
  const [, dec] = s.split(',')
  return `R${dec === undefined ? `${s},00` : dec.length === 1 ? `${s}0` : s}`
}
const list = (xs: number[], sep = '; ') => xs.map((x) => n(x)).join(sep)
/** 22nd, 23rd, 11th. */
const ord = (k: number) => `${k}${k % 100 >= 11 && k % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][k % 10] ?? 'th'}`
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const asc = (xs: number[]) => [...xs].sort((a, b) => a - b)
const median = (xs: number[]) => {
  const s = asc(xs)
  const m = s.length / 2
  return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2
}
/** Quartiles the Mat Lit way: the median of each half, leaving out the median itself when the count is odd. */
const quartiles = (xs: number[]) => {
  const s = asc(xs)
  const h = Math.floor(s.length / 2)
  return { q1: median(s.slice(0, h)), q2: median(s), q3: median(s.slice(s.length % 2 ? h + 1 : h)) }
}

const dh = (grade: Grade) => ({ topicId: 'data-handling', grade }) as const

const g10: Question[] = []
const g11: Question[] = []
const g12: Question[] = []

// ---------------------------------------------------------------- Grade 10

{
  const d = [14, 9, 17, 12, 20, 11, 15]
  const s = asc(d)
  const m = median(d)
  g10.push({
    id: 'dht-g10-median-odd',
    ...dh(10),
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    context: `A taxi marshal counted the taxis leaving a rank each hour one morning: ${list(d, ', ')}.`,
    prompt: 'Determine the median number of taxis per hour.',
    answer: `${m} taxis`,
    explanation: `Arrange the values in order first: ${list(s, ', ')}. There are ${d.length} values, so the median is the ${ord((d.length + 1) / 2)} value: ${m}.`,
    memo: [
      { code: 'M', marks: 1, text: `arranging in order: ${list(s, ', ')}` },
      { code: 'M', marks: 1, text: 'identifying the middle (4th) value' },
      { code: 'A', marks: 1, text: `median = ${m}` },
    ],
  })
}
{
  const d = [31, 28, 35, 33, 29, 34]
  const s = asc(d)
  const m = median(d)
  g10.push({
    id: 'dht-g10-median-even',
    ...dh(10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context: `The maximum temperatures (°C) in Upington over six days were: ${list(d, ', ')}.`,
    prompt: 'Determine the median maximum temperature.',
    answer: `${n(m)} °C`,
    explanation: `In order: ${list(s, ', ')}. With an even number of values (${d.length}), the median is halfway between the two middle values: (${s[2]} + ${s[3]}) ÷ 2 = ${n(m)} °C. The median does not have to be one of the readings.`,
    memo: [
      { code: 'M', marks: 1, text: 'arranging in order' },
      { code: 'M', marks: 1, text: `(${s[2]} + ${s[3]}) ÷ 2` },
      { code: 'A', marks: 1, text: `${n(m)} °C` },
    ],
  })
}
{
  const d = [5, 6, 6, 7, 7, 7, 8, 8, 9, 6, 7, 10]
  g10.push({
    id: 'dht-g10-mode-shoes',
    ...dh(10),
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    context: `A shoe shop recorded the sizes of school shoes sold on one Saturday: ${list(d, ', ')}.`,
    prompt: 'Determine the modal shoe size, and explain why the mode is the most useful measure for the shop owner when ordering new stock.',
    answer: 'Size 7. The mode is the size sold most often, which is what the owner needs to keep most of; a mean size such as 7,2 cannot be ordered.',
    explanation: `Count each size: 5 (1), 6 (3), 7 (4), 8 (2), 9 (1), 10 (1). Size 7 occurs most often, so the mode is 7. The mean is ${n(sum(d) / d.length, 1)}, which is not a shoe size.`,
    memo: [
      { code: 'RT', marks: 1, text: 'counting the frequency of each size' },
      { code: 'A', marks: 1, text: 'mode = size 7' },
      { code: 'J', marks: 1, text: 'the mode is an actual size and shows which size sells most' },
    ],
  })
}
{
  const d = [0, 2, 1, 3, 2, 0, 4, 1, 2, 0]
  g10.push({
    id: 'dht-g10-mode-bimodal',
    ...dh(10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context: `The number of goals a school soccer team scored in its last ten matches: ${list(d, ', ')}.`,
    prompt: 'Determine the mode of the goals scored. Explain your answer.',
    answer: 'There are two modes, 0 and 2: each occurs three times. The data is bimodal.',
    explanation: 'Count each value: 0 goals (3 times), 1 (2), 2 (3), 3 (1), 4 (1). Two values share the highest frequency, so both are modes. Do not average them: the mode is not 1.',
    memo: [
      { code: 'RT', marks: 1, text: 'frequencies: 0 and 2 each occur 3 times' },
      { code: 'A', marks: 1, text: 'modes are 0 and 2' },
      { code: 'J', marks: 1, text: 'two values share the highest frequency (bimodal)' },
    ],
  })
}
{
  const d = [6500, 7000, 7200, 6800, 45000]
  const mean = sum(d) / d.length
  const med = median(d)
  g10.push({
    id: 'dht-g10-best-measure-salaries',
    ...dh(10),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `The monthly earnings of everyone at a small car-wash business are: ${d.map(R).join('; ')}. The R45 000,00 is the owner's.`,
    prompt: 'Calculate the mean and the median monthly earnings. The owner advertises a job saying "average earnings of R14 500 a month". Explain whether this is a fair description of what a worker can expect to earn.',
    answer: `Mean = ${R(mean)}; median = ${R(med)}. It is not fair: the mean is pulled up by the owner's R45 000. Four of the five people earn under R7 300, so the median (${R(med)}) describes a typical worker much better.`,
    explanation: `Mean: (${d.map((x) => n(x)).join(' + ')}) ÷ 5 = ${n(sum(d))} ÷ 5 = ${R(mean)}. Median: in order ${asc(d).map((x) => n(x)).join(', ')}; the middle value is ${R(med)}. One very large value (an outlier) moves the mean a long way but leaves the median almost unchanged.`,
    memo: [
      { code: 'M', marks: 1, text: 'adding all five amounts and dividing by 5' },
      { code: 'A', marks: 1, text: `mean = ${R(mean)}` },
      { code: 'M', marks: 1, text: 'arranging in order' },
      { code: 'A', marks: 1, text: `median = ${R(med)}` },
      { code: 'J', marks: 1, text: "the owner's earnings are an outlier that pull the mean up" },
      { code: 'C', marks: 1, text: 'not fair; the median better describes a worker' },
    ],
  })
}
{
  const marks = [62, 75, 58, 71]
  const target = 68
  const need = target * 5 - sum(marks)
  g10.push({
    id: 'dht-g10-missing-from-mean-test',
    ...dh(10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `Thandi's marks (%) for the first four Mathematical Literacy tests are ${list(marks, ', ')}. There are five tests in the term.`,
    prompt: `Determine the mark Thandi must score in the fifth test for her mean (average) mark to be exactly ${target}%.`,
    answer: `${need}%`,
    explanation: `For a mean of ${target} over 5 tests, the marks must add up to ${target} × 5 = ${target * 5}. Her four marks add up to ${sum(marks)}. So the fifth mark must be ${target * 5} − ${sum(marks)} = ${need}%.`,
    memo: [
      { code: 'M', marks: 1, text: `total needed = ${target} × 5 = ${target * 5}` },
      { code: 'A', marks: 1, text: `sum of four marks = ${sum(marks)}` },
      { code: 'M', marks: 1, text: 'subtracting' },
      { code: 'CA', marks: 1, text: `${need}%` },
    ],
  })
}
{
  const known = [12, 18, 9, 20, 14]
  const mean = 15
  const x = mean * 6 - sum(known)
  g10.push({
    id: 'dht-g10-missing-from-mean-plain',
    ...dh(10),
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `The mean of six numbers is ${mean}. Five of the numbers are ${list(known, ', ')}. Determine the sixth number.`,
    answer: `${x}`,
    explanation: `Six numbers with a mean of ${mean} add up to 6 × ${mean} = ${mean * 6}. The five given numbers add up to ${sum(known)}, so the sixth is ${mean * 6} − ${sum(known)} = ${x}.`,
    memo: [
      { code: 'M', marks: 1, text: `6 × ${mean} = ${mean * 6}` },
      { code: 'A', marks: 1, text: `${sum(known)}` },
      { code: 'CA', marks: 1, text: `sixth number = ${x}` },
    ],
  })
}
{
  g10.push({
    id: 'dht-g10-missing-from-range',
    ...dh(10),
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    context: 'The monthly rainfall at a farm near Bethlehem was recorded for a year. The lowest monthly rainfall was 12 mm and the range was 46 mm.',
    prompt: 'Determine the highest monthly rainfall.',
    answer: '58 mm',
    explanation: 'Range = highest − lowest, so highest = lowest + range = 12 + 46 = 58 mm.',
    memo: [
      { code: 'M', marks: 1, text: 'highest = lowest + range' },
      { code: 'A', marks: 1, text: '58 mm' },
    ],
  })
}
{
  const left = [12, 15, 18]
  const right = [26, 30]
  const med = 20
  const x = 2 * med - left[2]
  g10.push({
    id: 'dht-g10-missing-from-median',
    ...dh(10),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `The following data is arranged in ascending order: ${list(left, ', ')}, x, ${list(right, ', ')}. The median is ${med}. Determine the value of x.`,
    answer: `x = ${x}`,
    explanation: `There are six values, so the median is halfway between the 3rd and 4th values: (${left[2]} + x) ÷ 2 = ${med}. So ${left[2]} + x = ${2 * med} and x = ${x}. Check: ${x} lies between ${left[2]} and ${right[0]}, so the list is still in order.`,
    memo: [
      { code: 'M', marks: 1, text: `(${left[2]} + x) ÷ 2 = ${med}` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'J', marks: 1, text: `checking ${left[2]} ≤ ${x} ≤ ${right[0]}` },
    ],
  })
}
{
  g10.push({
    id: 'dht-g10-missing-from-mode',
    ...dh(10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'The number of learners absent from a class on seven days was: 4, 7, x, 9, 7, 4, 10. The mode is 4. Determine the value of x, and give a reason.',
    answer: 'x = 4',
    explanation: 'Without x, both 4 and 7 occur twice. For 4 to be the only mode it must occur more often than 7, so x = 4 (4 then occurs three times).',
    memo: [
      { code: 'A', marks: 1, text: 'x = 4' },
      { code: 'J', marks: 1, text: '4 must occur more often than 7, which occurs twice' },
    ],
  })
}
{
  const kids = [0, 1, 2, 3, 4]
  const f = [3, 5, 8, 3, 1]
  const N = sum(f)
  const fx = kids.map((k, i) => k * f[i])
  const mean = sum(fx) / N
  const table = `|+ TABLE: Number of children living in each of ${N} households\n| Children | Number of households |\n|---|---|\n${kids.map((k, i) => `| ${k} | ${f[i]} |`).join('\n')}`
  g10.push({
    id: 'dht-g10-freq-mean',
    ...dh(10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: table,
    prompt: 'Calculate the mean number of children per household.',
    answer: `${n(mean)} children`,
    explanation: `Multiply each number of children by its frequency and add: ${kids.map((k, i) => `${k} × ${f[i]}`).join(' + ')} = ${sum(fx)} children in total. Divide by the number of households: ${sum(fx)} ÷ ${N} = ${n(mean)}. Dividing by 5 (the number of rows) is the usual mistake.`,
    memo: [
      { code: 'M', marks: 1, text: 'multiplying each value by its frequency' },
      { code: 'A', marks: 1, text: `total = ${sum(fx)}` },
      { code: 'M', marks: 1, text: `dividing by ${N} households` },
      { code: 'CA', marks: 1, text: `mean = ${n(mean)}` },
    ],
  })
  g10.push({
    id: 'dht-g10-freq-median-mode',
    ...dh(10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: table,
    prompt: 'Write down the modal number of children, and determine the median number of children per household.',
    answer: 'Mode = 2 children. Median = 2 children.',
    explanation: `The mode is the value with the highest frequency: 2 children (8 households). For the median, there are ${N} households, so it lies between the 10th and 11th values. Counting up: 0 children covers households 1–3, 1 child covers 4–8, 2 children covers 9–16. The 10th and 11th are both 2, so the median is 2.`,
    memo: [
      { code: 'RT', marks: 1, text: 'mode = 2' },
      { code: 'M', marks: 1, text: 'median lies between the 10th and 11th values' },
      { code: 'M', marks: 1, text: 'cumulative counting: 3, 8, 16' },
      { code: 'A', marks: 1, text: 'median = 2' },
    ],
  })
}
{
  g10.push({
    id: 'dht-g10-effect-of-increase',
    ...dh(10),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    context: 'The eight workers at a nursery earn a mean daily wage of R350,00. The range of their daily wages is R120,00.',
    prompt: 'Every worker is given an increase of R20,00 a day. Write down the new mean daily wage and the new range, and explain your answers.',
    answer: 'New mean = R370,00; the range stays R120,00.',
    explanation: 'Adding the same amount to every value adds that amount to the total (8 × R20) and so to the mean: R350 + R20 = R370. The highest and the lowest wage both go up by R20, so the gap between them, the range, does not change.',
    memo: [
      { code: 'A', marks: 1, text: 'mean = R370,00' },
      { code: 'A', marks: 1, text: 'range = R120,00' },
      { code: 'J', marks: 1, text: 'every value rises by R20, so the highest and lowest move together' },
    ],
  })
}
{
  const count = 5
  const mean = 30
  const add = 48
  const nm = (count * mean + add) / (count + 1)
  g10.push({
    id: 'dht-g10-new-mean',
    ...dh(10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `The mean age of the ${count} passengers in a minibus taxi is ${mean} years. A ${add}-year-old passenger gets in. Calculate the new mean age.`,
    answer: `${n(nm)} years`,
    explanation: `The ${count} ages add up to ${count} × ${mean} = ${count * mean}. With the new passenger the total is ${count * mean} + ${add} = ${count * mean + add}, shared over ${count + 1} people: ${count * mean + add} ÷ ${count + 1} = ${n(nm)} years.`,
    memo: [
      { code: 'M', marks: 1, text: `total = ${count} × ${mean} = ${count * mean}` },
      { code: 'M', marks: 1, text: `(${count * mean} + ${add}) ÷ ${count + 1}` },
      { code: 'CA', marks: 1, text: `${n(nm)} years` },
    ],
  })
}

// ---------------------------------------------------------------- Grade 11

{
  const d = [28, 29, 31, 34, 34, 37, 40, 42, 42, 42, 45, 48, 51, 53, 56]
  const stem = '|+ Masses of 15 lambs (kg). Key: 3 | 4 means 34 kg\n| Stem | Leaf |\n|---|---|\n| 2 | 8  9 |\n| 3 | 1  4  4  7 |\n| 4 | 0  2  2  2  5  8 |\n| 5 | 1  3  6 |'
  g11.push({
    id: 'dht-g11-stem-leaf-median-range',
    ...dh(11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: `A farmer recorded the masses of 15 lambs in a stem-and-leaf plot.\n${stem}`,
    prompt: 'Use the stem-and-leaf plot to write down the mode, and determine the median and the range of the masses.',
    answer: `Mode = 42 kg; median = ${median(d)} kg; range = ${d[d.length - 1] - d[0]} kg`,
    explanation: `A stem-and-leaf plot is already in order. Mode: 42 appears three times. Median: 15 values, so the 8th: counting 2, then 4 (6 so far), then the 2nd value in the 40s row is ${median(d)}. Range: highest 56 − lowest 28 = ${d[d.length - 1] - d[0]} kg.`,
    memo: [
      { code: 'RT', marks: 1, text: 'mode = 42 kg' },
      { code: 'M', marks: 1, text: 'median is the 8th value' },
      { code: 'A', marks: 1, text: `median = ${median(d)} kg` },
      { code: 'M', marks: 1, text: '56 − 28' },
      { code: 'A', marks: 1, text: `range = ${d[d.length - 1] - d[0]} kg` },
    ],
  })
}
{
  const pts = [3, 1, 0, 3, 3, 1]
  const mean = 2
  const x = mean * 7 - sum(pts)
  g11.push({
    id: 'dht-g11-missing-log-points',
    ...dh(11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context: 'In a netball league a team gets 3 points for a win, 1 for a draw and 0 for a loss. A team\'s points in its first seven matches were: 3, 1, 0, 3, x, 3, 1.',
    prompt: `The team's mean is ${mean} points per match. Determine x, and state whether the team won, drew or lost that match.`,
    answer: `x = ${x}: the team won that match.`,
    explanation: `Seven matches at a mean of ${mean} give ${mean * 7} points. The six known results add up to ${sum(pts)}, so x = ${mean * 7} − ${sum(pts)} = ${x}. Three points means a win.`,
    memo: [
      { code: 'M', marks: 1, text: `${mean} × 7 = ${mean * 7}` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'C', marks: 1, text: 'a win' },
    ],
  })
}
{
  const a = { n: 30, m: 58 }
  const b = { n: 25, m: 64 }
  const comb = (a.n * a.m + b.n * b.m) / (a.n + b.n)
  g11.push({
    id: 'dht-g11-combined-mean',
    ...dh(11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: `Class 11A has ${a.n} learners whose mean test mark was ${a.m}%. Class 11B has ${b.n} learners whose mean was ${b.m}%.`,
    prompt: `A teacher says the mean for the two classes together is ${(a.m + b.m) / 2}%, halfway between the two. Calculate the correct combined mean, and explain why the teacher's method is wrong.`,
    answer: `Combined mean = ${n(comb)}%. The teacher's method treats the classes as the same size; 11A has more learners, so its lower mean counts for more.`,
    explanation: `Total marks: 11A ${a.n} × ${a.m} = ${a.n * a.m}; 11B ${b.n} × ${b.m} = ${b.n * b.m}. Together ${a.n * a.m + b.n * b.m} marks over ${a.n + b.n} learners: ${a.n * a.m + b.n * b.m} ÷ ${a.n + b.n} = ${n(comb)}%. That is below ${(a.m + b.m) / 2}% because more learners are in the class with the lower mean.`,
    memo: [
      { code: 'M', marks: 1, text: `${a.n} × ${a.m} and ${b.n} × ${b.m}` },
      { code: 'A', marks: 1, text: `total ${a.n * a.m + b.n * b.m}` },
      { code: 'M', marks: 1, text: `dividing by ${a.n + b.n}` },
      { code: 'CA', marks: 1, text: `${n(comb)}%` },
      { code: 'J', marks: 1, text: 'the classes are different sizes' },
    ],
  })
}
{
  // Five values in order: 8; 10; x; 15; y. Range 12, mean 13.
  const lo = 8
  const range = 12
  const mean = 13
  const y = lo + range
  const x = mean * 5 - (lo + 10 + 15 + y)
  g11.push({
    id: 'dht-g11-missing-two-values',
    ...dh(11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Five values are arranged in ascending order: ${lo}; 10; x; 15; y. The range is ${range} and the mean is ${mean}. Determine y, then x, and then write down the median.`,
    answer: `y = ${y}, x = ${x}, median = ${x}`,
    explanation: `Range = y − ${lo} = ${range}, so y = ${y}. The five values add up to 5 × ${mean} = ${mean * 5}: ${lo} + 10 + x + 15 + ${y} = ${mean * 5}, so x = ${mean * 5} − ${lo + 10 + 15 + y} = ${x}. The median is the middle (3rd) value, x = ${x}. Check: 10 ≤ ${x} ≤ 15.`,
    memo: [
      { code: 'M', marks: 1, text: `y − ${lo} = ${range}` },
      { code: 'A', marks: 1, text: `y = ${y}` },
      { code: 'M', marks: 1, text: `sum = 5 × ${mean} = ${mean * 5}` },
      { code: 'CA', marks: 1, text: `x = ${x}` },
      { code: 'CA', marks: 1, text: `median = ${x}` },
    ],
  })
}
{
  const classes = ['0 – < 10', '10 – < 20', '20 – < 30', '30 – < 40', '40 – < 50']
  const f = [6, 15, 10, 6, 3]
  const N = sum(f)
  const over30 = f[3] + f[4]
  const table = `|+ TABLE: Time (minutes) ${N} learners take to travel to school\n| Time (minutes) | Number of learners |\n|---|---|\n${classes.map((c, i) => `| ${c} | ${f[i]} |`).join('\n')}`
  g11.push({
    id: 'dht-g11-grouped-modal-median-class',
    ...dh(11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: table,
    prompt: 'Write down the modal class, determine the class in which the median lies, and calculate the percentage of learners who take 30 minutes or longer.',
    answer: `Modal class: 10 – < 20 minutes. Median class: 10 – < 20 minutes. ${n((over30 / N) * 100, 1)}% take 30 minutes or longer.`,
    explanation: `The modal class has the highest frequency (15). The median of ${N} values lies between the 20th and 21st: the first class holds 6, the second takes the count to 21, so both are in 10 – < 20. Thirty minutes or longer: ${f[3]} + ${f[4]} = ${over30} learners; ${over30} ÷ ${N} × 100 = ${n((over30 / N) * 100, 1)}%.`,
    memo: [
      { code: 'RT', marks: 1, text: 'modal class 10 – < 20' },
      { code: 'M', marks: 1, text: 'median between the 20th and 21st values; cumulative 6, 21' },
      { code: 'A', marks: 1, text: 'median class 10 – < 20' },
      { code: 'M', marks: 1, text: `(${over30} ÷ ${N}) × 100` },
      { code: 'A', marks: 1, text: `${n((over30 / N) * 100, 1)}%` },
    ],
  })
}
{
  const weights = [0.25, 0.25, 0.5]
  const scores = [60, 72, 55]
  const term = sum(weights.map((w, i) => w * scores[i]))
  g11.push({
    id: 'dht-g11-weighted-mean',
    ...dh(11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: 'A school works out a term mark from three tasks: a test counts 25%, an assignment counts 25% and the exam counts 50%. Sipho scored 60% in the test, 72% in the assignment and 55% in the exam.',
    prompt: 'Calculate Sipho\'s term mark, and explain why it is not the ordinary mean of his three marks.',
    answer: `${n(term)}%. The exam counts twice as much as each other task, so it is a weighted mean, not (60 + 72 + 55) ÷ 3 = ${n(sum(scores) / 3, 1)}%.`,
    explanation: `Weighted mean: 25% × 60 + 25% × 72 + 50% × 55 = 15 + 18 + 27,5 = ${n(term)}%. The ordinary mean, ${n(sum(scores) / 3, 1)}%, would treat each task as equally important.`,
    memo: [
      { code: 'M', marks: 1, text: 'multiplying each mark by its weight' },
      { code: 'A', marks: 1, text: '15 + 18 + 27,5' },
      { code: 'CA', marks: 1, text: `${n(term)}%` },
      { code: 'J', marks: 1, text: 'the tasks do not count equally' },
    ],
  })
}
{
  const ann = [12.4, 12.6, 12.5, 12.3, 12.7, 12.5]
  const ben = [12.0, 13.1, 12.2, 12.9, 11.8, 12.6]
  const rA = Math.max(...ann) - Math.min(...ann)
  const rB = Math.max(...ben) - Math.min(...ben)
  g11.push({
    id: 'dht-g11-consistency-range',
    ...dh(11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `Two sprinters' times (seconds) for the 100 m over six races:\nAnele: ${ann.map((t) => t.toFixed(1).replace('.', ',')).join('; ')}\nBongi: ${ben.map((t) => t.toFixed(1).replace('.', ',')).join('; ')}`,
    prompt: 'Calculate the mean and the range of each sprinter\'s times. The coach must choose ONE sprinter for a relay where a steady time matters most. Who should be chosen? Use your calculations to justify the choice.',
    answer: `Anele: mean ${n(sum(ann) / 6)} s, range ${n(rA, 1)} s. Bongi: mean ${n(sum(ben) / 6)} s, range ${n(rB, 1)} s. Choose Anele: the means are almost the same, but Anele's range is much smaller, so her times are more consistent.`,
    explanation: `Anele: ${n(sum(ann), 1)} ÷ 6 = ${n(sum(ann) / 6)} s; range ${n(Math.max(...ann), 1)} − ${n(Math.min(...ann), 1)} = ${n(rA, 1)} s. Bongi: ${n(sum(ben), 1)} ÷ 6 = ${n(sum(ben) / 6)} s; range ${n(Math.max(...ben), 1)} − ${n(Math.min(...ben), 1)} = ${n(rB, 1)} s. The range measures spread: a small range means steady performance.`,
    memo: [
      { code: 'A', marks: 1, text: `Anele mean ${n(sum(ann) / 6)} s` },
      { code: 'A', marks: 1, text: `Anele range ${n(rA, 1)} s` },
      { code: 'A', marks: 1, text: `Bongi mean ${n(sum(ben) / 6)} s` },
      { code: 'A', marks: 1, text: `Bongi range ${n(rB, 1)} s` },
      { code: 'C', marks: 1, text: 'Anele' },
      { code: 'J', marks: 1, text: 'smaller range, so more consistent; means about equal' },
    ],
  })
}
{
  const prices = [620, 640, 655, 680, 700, 2400]
  const withAll = sum(prices) / prices.length
  const without = sum(prices.slice(0, 5)) / 5
  g11.push({
    id: 'dht-g11-outlier-effect',
    ...dh(11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: `Monthly rents (R) for rooms advertised near a college: ${list(prices, '; ')}. The R2 400 room is a self-contained flat.`,
    prompt: 'Calculate the mean rent with and without the flat, and determine the median rent with the flat included. Which measure would you give a student looking for a room, and why?',
    answer: `With the flat: mean ${R(withAll)}; without: ${R(without)}. Median ${R(median(prices))}. Give the median: it is hardly affected by the one unusually expensive flat.`,
    explanation: `With all six: ${n(sum(prices))} ÷ 6 = ${R(withAll)}. Without the flat: ${n(sum(prices.slice(0, 5)))} ÷ 5 = ${R(without)}. Median of six: (${prices[2]} + ${prices[3]}) ÷ 2 = ${R(median(prices))}. The single outlier raises the mean by about R${n(withAll - without, 0)} but the median stays close to the typical rooms.`,
    memo: [
      { code: 'A', marks: 1, text: `mean with flat ${R(withAll)}` },
      { code: 'A', marks: 1, text: `mean without ${R(without)}` },
      { code: 'A', marks: 1, text: `median ${R(median(prices))}` },
      { code: 'C', marks: 1, text: 'the median' },
      { code: 'J', marks: 1, text: 'the outlier affects the mean, not the median' },
    ],
  })
}
{
  const sizes = [1, 2, 3, 4, 5, 6]
  const f = [5, 9, 12, 10, 6, 2]
  const N = sum(f)
  g11.push({
    id: 'dht-g11-freq-median-even',
    ...dh(11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `|+ TABLE: Number of people in each of ${N} households in a street\n| People in household | Number of households |\n|---|---|\n${sizes.map((s, i) => `| ${s} | ${f[i]} |`).join('\n')}`,
    prompt: 'Determine the median household size, showing how you located it.',
    answer: 'Median = 3 people',
    explanation: `There are ${N} households, so the median lies between the ${ord(N / 2)} and ${ord(N / 2 + 1)} values. Counting up: size 1 covers 1–5, size 2 covers 6–14, size 3 covers 15–26. The ${ord(N / 2)} and ${ord(N / 2 + 1)} are both 3, so the median is 3.`,
    memo: [
      { code: 'M', marks: 1, text: `total ${N}; median between the ${ord(N / 2)} and ${ord(N / 2 + 1)}` },
      { code: 'M', marks: 1, text: 'cumulative counting: 5, 14, 26' },
      { code: 'A', marks: 1, text: 'both values are 3' },
      { code: 'CA', marks: 1, text: 'median = 3' },
    ],
  })
}

// ---------------------------------------------------------------- Grade 12

{
  const d = [12, 15, 18, 20, 22, 25, 27, 30, 33, 36, 40]
  const { q1, q2, q3 } = quartiles(d)
  g12.push({
    id: 'dht-g12-quartiles-odd',
    ...dh(12),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: `The number of customers served at a clinic pharmacy on eleven days, arranged in order: ${list(d, '; ')}.`,
    prompt: 'Determine the median, the lower quartile, the upper quartile and the inter-quartile range.',
    answer: `Median = ${q2}; Q1 = ${q1}; Q3 = ${q3}; IQR = ${q3 - q1}`,
    explanation: `Median: the 6th of 11 values = ${q2}. Lower quartile: the median of the five values below it (${list(d.slice(0, 5), ', ')}) = ${q1}. Upper quartile: the median of the five above it (${list(d.slice(6), ', ')}) = ${q3}. IQR = Q3 − Q1 = ${q3} − ${q1} = ${q3 - q1}.`,
    memo: [
      { code: 'A', marks: 1, text: `median = ${q2}` },
      { code: 'M', marks: 1, text: 'median of the lower half' },
      { code: 'A', marks: 1, text: `Q1 = ${q1}` },
      { code: 'A', marks: 1, text: `Q3 = ${q3}` },
      { code: 'CA', marks: 1, text: `IQR = ${q3 - q1}` },
    ],
  })
}
{
  const d = [41, 45, 47, 50, 52, 55, 58, 60, 63, 66, 70, 74]
  const { q1, q2, q3 } = quartiles(d)
  g12.push({
    id: 'dht-g12-five-number-even',
    ...dh(12),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 6,
    context: `The marks (%) of twelve learners in a Mathematical Literacy test, in order: ${list(d, '; ')}.`,
    prompt: 'Write down the five-number summary of the marks and calculate the inter-quartile range.',
    answer: `Minimum ${d[0]}; Q1 ${n(q1)}; median ${n(q2)}; Q3 ${n(q3)}; maximum ${d[d.length - 1]}. IQR = ${n(q3 - q1)}.`,
    explanation: `Twelve values: the median is halfway between the 6th and 7th, (${d[5]} + ${d[6]}) ÷ 2 = ${n(q2)}. The lower half is the first six; its middle is (${d[2]} + ${d[3]}) ÷ 2 = ${n(q1)}. The upper half is the last six; its middle is (${d[8]} + ${d[9]}) ÷ 2 = ${n(q3)}. IQR = ${n(q3)} − ${n(q1)} = ${n(q3 - q1)}.`,
    memo: [
      { code: 'RT', marks: 1, text: `minimum ${d[0]} and maximum ${d[d.length - 1]}` },
      { code: 'A', marks: 1, text: `median ${n(q2)}` },
      { code: 'M', marks: 1, text: 'median of each half' },
      { code: 'A', marks: 1, text: `Q1 ${n(q1)}` },
      { code: 'A', marks: 1, text: `Q3 ${n(q3)}` },
      { code: 'CA', marks: 1, text: `IQR ${n(q3 - q1)}` },
    ],
  })
}
{
  const A = [22, 41, 55, 68, 91]
  const B = [30, 48, 52, 57, 76]
  const ctx = `|+ TABLE: Five-number summaries of the Grade 12 Mathematical Literacy trial results (%) at two schools\n| | Minimum | Q1 | Median | Q3 | Maximum |\n|---|---|---|---|---|---|\n| School A | ${A.join(' | ')} |\n| School B | ${B.join(' | ')} |`
  g12.push({
    id: 'dht-g12-box-compare',
    ...dh(12),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `${ctx}\nEach school's results were drawn as a box-and-whisker plot from these values.`,
    prompt: 'Calculate the inter-quartile range for each school. Which school\'s results are more consistent, and which school had the higher median? A district official says "School A did better, because its best learner scored 91%". Comment on this statement.',
    answer: `IQR: School A ${A[3] - A[1]}, School B ${B[3] - B[1]}. School B is more consistent (much smaller IQR); School A has the higher median (${A[2]}% against ${B[2]}%). The statement is not valid: one top learner says nothing about the whole school — the median and quartiles describe the typical learner.`,
    explanation: `IQR = Q3 − Q1: A ${A[3]} − ${A[1]} = ${A[3] - A[1]}; B ${B[3]} − ${B[1]} = ${B[3] - B[1]}. The middle half of B's learners lie within ${B[3] - B[1]} percentage points, A's within ${A[3] - A[1]}. A's median is higher, so A's typical learner did slightly better, but A also has far more learners at the bottom (its Q1 is ${A[1]}% and its minimum ${A[0]}%). The maximum is a single learner.`,
    memo: [
      { code: 'A', marks: 1, text: `IQR A = ${A[3] - A[1]}` },
      { code: 'A', marks: 1, text: `IQR B = ${B[3] - B[1]}` },
      { code: 'C', marks: 1, text: 'School B more consistent' },
      { code: 'RT', marks: 1, text: 'School A higher median' },
      { code: 'J', marks: 2, text: 'the maximum is one learner; the median/quartiles describe the school' },
    ],
  })
}
{
  const ordered = [5, 8, 9, 12, 14, 'x', 18, 21] as const
  const q3 = 17
  const x = 2 * q3 - 18
  g12.push({
    id: 'dht-g12-missing-from-quartile',
    ...dh(12),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `The number of hours eight learners spent on social media in a week, in ascending order: ${ordered.join('; ')}. The upper quartile is ${q3}. Determine x and the inter-quartile range.`,
    answer: `x = ${x}; IQR = ${n(q3 - (8 + 9) / 2)}`,
    explanation: `With eight values, the upper half is the last four: 14; x; 18; 21. Q3 is their middle: (x + 18) ÷ 2 = ${q3}, so x = ${x}. Check: 14 ≤ ${x} ≤ 18. Q1 is the middle of 5; 8; 9; 12: (8 + 9) ÷ 2 = ${n((8 + 9) / 2)}. IQR = ${q3} − ${n((8 + 9) / 2)} = ${n(q3 - (8 + 9) / 2)}.`,
    memo: [
      { code: 'M', marks: 1, text: `(x + 18) ÷ 2 = ${q3}` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'A', marks: 1, text: `Q1 = ${n((8 + 9) / 2)}` },
      { code: 'CA', marks: 1, text: `IQR = ${n(q3 - (8 + 9) / 2)}` },
    ],
  })
}
{
  g12.push({
    id: 'dht-g12-percentile-meaning',
    ...dh(12),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: 'In a national assessment, 320 learners at a school wrote the same test. Lerato\'s result was at the 75th percentile, and the 25th percentile mark was 38%.',
    prompt: 'Explain what it means that Lerato\'s result was at the 75th percentile, and determine about how many of the learners scored below the 25th percentile mark of 38%.',
    answer: 'About 75% of the learners scored lower than Lerato (and about 25% scored higher). About 80 learners scored below 38%.',
    explanation: 'A percentile gives position, not a mark: the 75th percentile is the value below which 75% of the results lie — it does not mean Lerato scored 75%. The 25th percentile has 25% of the results below it: 25% of 320 = 0,25 × 320 = 80 learners.',
    memo: [
      { code: 'J', marks: 2, text: 'about 75% of learners scored below her (not that she scored 75%)' },
      { code: 'M', marks: 1, text: '25% × 320' },
      { code: 'A', marks: 1, text: '80 learners' },
    ],
  })
}
{
  const d = [180, 210, 195, 240, 205, 980, 220, 190, 215]
  const s = asc(d)
  const mean = sum(d) / d.length
  const { q1, q2, q3 } = quartiles(d)
  g12.push({
    id: 'dht-g12-skew-measure',
    ...dh(12),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 7,
    context: `A municipality recorded the monthly water use (kilolitres) of nine properties in one street: ${list(d, '; ')}. One property is a guest house with a pool.`,
    prompt: 'Calculate the mean and the median water use, and determine the inter-quartile range. The municipality wants ONE number to describe "a typical household" in its newsletter. Which measure should it use? Give TWO reasons based on your answers.',
    answer: `Mean ${n(mean)} kℓ; median ${q2} kℓ; IQR = ${n(q3)} − ${n(q1)} = ${n(q3 - q1)} kℓ. Use the median: (1) the guest house (980 kℓ) is an outlier that lifts the mean far above every household but itself; (2) the households cluster closely (IQR only ${n(q3 - q1)} kℓ) around the median.`,
    explanation: `In order: ${list(s, '; ')}. Mean = ${n(sum(d))} ÷ 9 = ${n(mean)} kℓ, higher than eight of the nine properties. Median = 5th value = ${q2} kℓ. Q1 = median of the lower four, (${s[1]} + ${s[2]}) ÷ 2 = ${n(q1)}; Q3 = median of the upper four, (${s[6]} + ${s[7]}) ÷ 2 = ${n(q3)}. IQR = ${n(q3 - q1)} kℓ.`,
    memo: [
      { code: 'A', marks: 1, text: `mean ${n(mean)} kℓ` },
      { code: 'A', marks: 1, text: `median ${q2} kℓ` },
      { code: 'A', marks: 1, text: `Q1 ${n(q1)} and Q3 ${n(q3)}` },
      { code: 'CA', marks: 1, text: `IQR ${n(q3 - q1)} kℓ` },
      { code: 'C', marks: 1, text: 'the median' },
      { code: 'J', marks: 2, text: 'the outlier distorts the mean; the households cluster around the median' },
    ],
  })
}
{
  const target = 65
  const marks = [58, 71, 67]
  const done = sum(marks.map((m) => m * 0.2))
  const need = (target - done) / 0.4
  g12.push({
    id: 'dht-g12-missing-weighted',
    ...dh(12),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context: `A bursary needs a final mark of at least ${target}%. The final mark is a weighted mean: three tasks worth 20% each and an exam worth 40%. Zodwa scored ${marks[0]}%, ${marks[1]}% and ${marks[2]}% in the three tasks.`,
    prompt: 'Determine the minimum exam mark Zodwa needs to qualify for the bursary.',
    answer: `${n(need)}%: since marks are whole numbers, at least ${Math.ceil(need)}%.`,
    explanation: `The tasks contribute 20% × ${marks[0]} + 20% × ${marks[1]} + 20% × ${marks[2]} = ${n(done)} percentage points. She needs ${target} − ${n(done)} = ${n(target - done)} more from the exam, which counts 40%: exam mark × 0,4 = ${n(target - done)}, so the exam mark = ${n(target - done)} ÷ 0,4 = ${n(need)}%. Marks are usually whole numbers, so she needs ${Math.ceil(need)}%.`,
    memo: [
      { code: 'M', marks: 1, text: 'weighting each task by 20%' },
      { code: 'A', marks: 1, text: `${n(done)}` },
      { code: 'M', marks: 1, text: `${target} − ${n(done)}` },
      { code: 'M', marks: 1, text: 'dividing by 0,4' },
      { code: 'CA', marks: 1, text: `${n(need)}% (${Math.ceil(need)}%)` },
    ],
  })
}

export const dataHandlingTypes: Question[] = [...g10, ...g11, ...g12]
