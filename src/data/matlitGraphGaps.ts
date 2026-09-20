import type { Question } from '@/types'

/**
 * Mathematical Literacy content for the sub-topics the coverage report found
 * thin, and for the three that stop or start partway up the grades.
 *
 * THE GRAPH SUB-TOPICS. Mat Lit is a subject about reading real documents, and
 * three of the sub-topics that do exactly that held almost nothing: Misleading
 * graphs and data quality had five questions, Representing data in tables and
 * graphs eight, Interpreting and comparing graphs eleven -- against 107 for
 * Reading values off tables and graphs. Reading a value off a graph is the
 * Level 1 skill; judging whether the graph is honest, and comparing two of
 * them, is where the Level 3 and 4 marks are.
 *
 * THE PER-GRADE GAPS. Collecting and organising data had two questions at
 * Grade 12 and none below it, although data collection is a Grade 10 topic and
 * the Grade 10 exam sets it. Route planning and travel time had nothing at
 * Grade 10, and Surface area nothing at Grade 10, both of which CAPS teaches
 * from Grade 10 up.
 *
 * Every figure below is computed from the data declared with the question, so
 * a total, a percentage or a scale reading cannot drift from the table it was
 * read off.
 */

/** A number as a Mat Lit answer writes it: comma decimal, true minus sign. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  return String(r).replace('.', ',').replace('-', '−')
}

/** Rands, grouped in threes, as a South African paper prints them. */
const rand = (v: number): string => 'R' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

const out: Question[] = []

/* ===================================================================== */
/* Misleading graphs and data quality                                    */
/* ===================================================================== */

const dh = (grade: 10 | 11 | 12) => ({ topicId: 'data-handling', grade }) as const

{
  // A truncated axis: the bars differ by 4% but LOOK like a doubling.
  const before = 62
  const after = 66
  const realRise = ((after - before) / before) * 100
  // Drawn from 60 to 68, the visible bar heights are 2 and 6 units.
  const apparentRatio = (after - 60) / (before - 60)
  out.push({
    ...dh(11),
    id: 'gap-ml-mislead-truncated-axis',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context:
      '|+ Pass rate at a school, shown in a bar graph whose vertical axis runs from 60% to 68%\n| Year | Pass rate |\n|---|---|\n| 2024 | 62% |\n| 2025 | 66% |',
    prompt:
      'The principal says the bar graph shows the pass rate "shot up" last year, because the 2025 bar is three times the height of the 2024 bar. Calculate the actual percentage increase in the pass rate, explain why the bars give a misleading impression, and state what should be changed about the graph.',
    answer:
      `The actual rise is ${after} − ${before} = 4 percentage points, which as a percentage increase is 4 ÷ ${before} × 100 = ${n(realRise)}%. ` +
      `The bars mislead because the vertical axis starts at 60% rather than 0: only the part above 60 is drawn, so the visible heights are 2 units and 6 units, a ratio of ${n(apparentRatio, 0)} to 1, while the real figures are in the ratio 66 to 62. ` +
      'The axis should start at zero, so that the height of each bar is proportional to the value it represents.',
    explanation:
      'A truncated axis is the commonest way an honest set of numbers is made to tell a dishonest story, and it is worth being able to name. The test is simple: a bar graph claims that height is proportional to value, and that claim only holds if the axis starts at zero. Here it does not, so the eye compares 2 against 6 instead of 62 against 66. Note that the numbers themselves are not wrong — nothing has been faked. It is the drawing that misleads, which is why the fix is to the axis and not to the data.',
    memo: [
      { code: 'M', marks: 1, text: '4 ÷ 62 × 100' },
      { code: 'CA', marks: 1, text: `${n(realRise)}% increase` },
      { code: 'R', marks: 1, text: 'the vertical axis starts at 60%, not 0' },
      { code: 'R', marks: 1, text: 'so bar height is not proportional to the value: 2 units against 6 units' },
      { code: 'J', marks: 1, text: 'the axis should start at zero' },
    ],
  })
}

out.push({
  ...dh(12),
  id: 'gap-ml-mislead-sample-bias',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 4,
  context:
    'A shop wants to know how its customers travel to the shop. A researcher stands in the shop car park on a Saturday morning and asks 100 people how they travelled. 94 say they came by car.',
  prompt:
    'The shop concludes that 94% of its customers travel by car and decides to spend its budget on more parking. Explain why this sample is not representative, state what the conclusion would need to be valid, and suggest one better place to collect the data.',
  answer:
    'The sample is not representative because it was taken in the CAR PARK, so almost everyone in it arrived by car by definition — people who walked, took a taxi or came by bus would not pass through it. The conclusion would only be valid if every customer had an equal chance of being asked. Asking at the shop entrance or at the till, where all customers pass regardless of how they arrived, would give a better sample.',
  explanation:
    'The number 94% is perfectly accurate for the people who were asked; the problem is who was asked. A sample is biased when the way it is collected makes some group more likely to appear than it should, and standing in a car park does exactly that — it selects for car drivers before a single question is asked. Note also the Saturday morning: shoppers on a weekday after work may travel quite differently. The fix is always the same in principle, which is to sample where the whole population passes.',
  memo: [
    { code: 'R', marks: 1, text: 'the sample was taken in the car park, so it selects car users' },
    { code: 'R', marks: 1, text: 'people who walked, took a taxi or came by bus could not be included' },
    { code: 'J', marks: 1, text: 'every customer would need an equal chance of being asked' },
    { code: 'J', marks: 1, text: 'ask at the entrance or the till, where all customers pass' },
  ],
})

{
  const values = [4, 5, 5, 6, 6, 7, 8, 9, 130]
  const total = values.reduce((a, v) => a + v, 0)
  const mean = total / values.length
  const sorted = [...values].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  out.push({
    ...dh(12),
    id: 'gap-ml-mislead-mean-outlier',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context: `The nine staff at a small business earn, in thousands of rand per month: ${values.join(', ')}.`,
    prompt:
      'The owner advertises that "the average salary here is over R20 000 a month". Calculate the mean and the median of the nine salaries, and explain why quoting the mean here is misleading about what a new employee could expect to earn.',
    answer:
      `Mean = ${total} ÷ 9 = ${n(mean)} thousand, that is about ${rand(mean * 1000)} a month. Median = the fifth value when they are in order = ${median} thousand, that is ${rand(median * 1000)} a month. ` +
      'The median is far more honest here. One salary of R130 000 — the owner\'s own — is an outlier that drags the mean up above every other salary in the business: eight of the nine staff earn less than the mean. A new employee would join the group earning around R6 000, which is what the median describes.',
    explanation:
      'The owner\'s claim is not a lie; the mean really is over R20 000. That is what makes this worth practising — a statistic can be arithmetically correct and still mislead, and the skill is saying exactly how. The mean uses every value, so a single extreme value pulls it a long way; the median only cares about position, so one enormous salary moves it by one place at most. When a distribution has an outlier, the median is the fairer summary, and "eight of the nine earn less than the mean" is the sentence that proves it.',
    memo: [
      { code: 'M', marks: 1, text: `${total} ÷ 9` },
      { code: 'CA', marks: 1, text: `mean ≈ ${n(mean)} thousand` },
      { code: 'A', marks: 1, text: `median = ${median} thousand` },
      { code: 'R', marks: 1, text: 'the R130 000 salary is an outlier that pulls the mean up' },
      { code: 'J', marks: 1, text: 'the median is more honest: eight of the nine staff earn less than the mean' },
    ],
  })
}

/* ===================================================================== */
/* Representing data in tables and graphs                                */
/* ===================================================================== */

{
  const counts = { Walk: 14, Taxi: 22, Bus: 9, Car: 5 }
  const total = Object.values(counts).reduce((a, v) => a + v, 0)
  const angle = (v: number) => (v / total) * 360
  out.push({
    ...dh(10),
    id: 'gap-ml-represent-pie-angles',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context: `A Grade 10 class of ${total} learners was asked how they travel to school. Walk: ${counts.Walk}. Taxi: ${counts.Taxi}. Bus: ${counts.Bus}. Car: ${counts.Car}.`,
    prompt:
      'Calculate the angle of the sector that would represent taxi on a pie chart, correct to the nearest degree, and calculate the angle for bus. Then explain how you can check that all four angles have been worked out correctly.',
    answer:
      `Taxi: ${counts.Taxi} ÷ ${total} × 360 = ${n(angle(counts.Taxi), 0)}°. Bus: ${counts.Bus} ÷ ${total} × 360 = ${n(angle(counts.Bus), 0)}°. ` +
      'The check is that all four angles must add up to 360°, because the sectors together make one complete circle. (Rounding each to the nearest degree may make the total 359° or 361°, which is acceptable, but a total far from 360° means an error.)',
    explanation:
      'A pie chart divides 360° in the same ratio as the data divides the total, so every sector angle is "its share of the total, times 360". Work with the fraction before multiplying rather than converting to a percentage first — going via a rounded percentage loses accuracy twice. The check at the end is the one worth building a habit of: the angles of a pie chart must close the circle, and that catches an arithmetic slip in a single addition.',
    memo: [
      { code: 'M', marks: 1, text: `${counts.Taxi} ÷ ${total} × 360` },
      { code: 'CA', marks: 1, text: `${n(angle(counts.Taxi), 0)}°` },
      { code: 'M', marks: 1, text: `${counts.Bus} ÷ ${total} × 360` },
      { code: 'CA', marks: 1, text: `${n(angle(counts.Bus), 0)}°` },
      { code: 'R', marks: 1, text: 'the four angles must add to 360°, the whole circle' },
    ],
  })
}

{
  const bins: [string, number][] = [
    ['0 ≤ m < 20', 3],
    ['20 ≤ m < 40', 8],
    ['40 ≤ m < 60', 14],
    ['60 ≤ m < 80', 11],
    ['80 ≤ m < 100', 4],
  ]
  const total = bins.reduce((a, [, f]) => a + f, 0)
  const modal = bins.reduce((a, b) => (b[1] > a[1] ? b : a))
  out.push({
    ...dh(11),
    id: 'gap-ml-represent-histogram',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context:
      '|+ Marks out of 100 for a class test, as a frequency table\n| Mark interval | Frequency |\n|---|---|\n' +
      bins.map(([b, f]) => `| ${b} | ${f} |`).join('\n'),
    prompt:
      'State how many learners wrote the test, write down the modal class, and explain why this data must be drawn as a histogram with bars touching rather than as a bar graph with gaps between the bars.',
    answer:
      `${total} learners wrote the test, found by adding the frequencies: ${bins.map(([, f]) => f).join(' + ')} = ${total}. The modal class is ${modal[0]}, the interval with the highest frequency (${modal[1]}). ` +
      'The bars must touch because the marks are CONTINUOUS data: a mark of 40 sits exactly where one interval ends and the next begins, so there is no gap in the data and there must be no gap on the graph. A bar graph with gaps is for categories such as walk, taxi and bus, between which nothing exists.',
    explanation:
      'Continuous against categorical is the distinction that decides the whole shape of the drawing, and it is examined directly. Marks, heights, masses and times run without breaks, so their bars touch; modes of travel, favourite colours and provinces do not, so their bars are separated. Note that the modal CLASS is an interval, not a number — grouped data has thrown away the individual marks, so naming a single modal mark claims to know something the table no longer records.',
    memo: [
      { code: 'M', marks: 1, text: 'frequencies added' },
      { code: 'A', marks: 1, text: `${total} learners` },
      { code: 'A', marks: 1, text: `modal class ${modal[0]}` },
      { code: 'R', marks: 1, text: 'marks are continuous data' },
      { code: 'R', marks: 1, text: 'so there is no gap between intervals and the bars must touch' },
    ],
  })
}

/* ===================================================================== */
/* Interpreting and comparing graphs                                     */
/* ===================================================================== */

{
  const townA = [18, 22, 26, 24, 20, 16]
  const townB = [24, 25, 26, 25, 24, 23]
  const rangeA = Math.max(...townA) - Math.min(...townA)
  const rangeB = Math.max(...townB) - Math.min(...townB)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  out.push({
    ...dh(11),
    id: 'gap-ml-interpret-compare-two-lines',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context:
      '|+ Highest daily temperature (°C) recorded each month in two towns\n| Month | Town A | Town B |\n|---|---|---|\n' +
      months.map((m, i) => `| ${m} | ${townA[i]} | ${townB[i]} |`).join('\n'),
    prompt:
      'Both towns are drawn on the same axes. Compare the two towns: calculate the difference between the highest and lowest temperature for each, identify the month where the two lines cross, and explain which town a visitor who dislikes temperature changes should choose, giving a reason based on the figures.',
    answer:
      `Town A: range = ${Math.max(...townA)} − ${Math.min(...townA)} = ${rangeA} °C. Town B: range = ${Math.max(...townB)} − ${Math.min(...townB)} = ${rangeB} °C. ` +
      `The two towns are the same in March, where both are 26 °C — this is where the two lines cross. ` +
      `The visitor should choose Town B: its range of ${rangeB} °C is far smaller than Town A's ${rangeA} °C, so its temperature stays much more even across the six months, which shows as a nearly flat line against Town A's rise and fall.`,
    explanation:
      'Comparing two graphs means comparing their SHAPES, not just reading points off them. Two features carry the comparison here: where the lines cross, which is where the two quantities are equal, and how steeply each line moves, which the range measures numerically. Town A and Town B reach the same highest temperature, so a learner who compares only the peaks would conclude the towns are alike — the range is what shows they are not. Always support the judgement with a figure; "Town B is more even" without the two ranges earns the opinion mark and not the reasoning ones.',
    memo: [
      { code: 'A', marks: 1, text: `range of Town A = ${rangeA} °C` },
      { code: 'A', marks: 1, text: `range of Town B = ${rangeB} °C` },
      { code: 'A', marks: 1, text: 'the same in March, at 26 °C, where the lines cross' },
      { code: 'J', marks: 1, text: 'Town B' },
      { code: 'R', marks: 1, text: `because its range is ${rangeB} °C against ${rangeA} °C, so it changes far less` },
    ],
  })
}

{
  const fixedA = 150
  const rateA = 0.9
  const fixedB = 0
  const rateB = 1.4
  const breakEven = (fixedA - fixedB) / (rateB - rateA)
  out.push({
    ...dh(12),
    id: 'gap-ml-interpret-break-even',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    context:
      `Two cellphone packages are drawn as two straight lines on one set of axes, showing cost against minutes used. Package A costs ${rand(fixedA)} per month plus R${n(rateA)} per minute. Package B has no monthly fee and costs R${n(rateB)} per minute.`,
    prompt:
      'Compare the two packages. Calculate the cost of each for 200 minutes, determine the number of minutes at which the two graph lines cross, and advise a user who talks for about 500 minutes a month which package to choose, with a reason.',
    answer:
      `At 200 minutes: A = ${rand(fixedA)} + 200 × R${n(rateA)} = ${rand(fixedA + 200 * rateA)}; B = 200 × R${n(rateB)} = ${rand(200 * rateB)}. ` +
      `The graphs cross where the costs are equal: ${fixedA} + ${n(rateA)}m = ${n(rateB)}m, so ${fixedA} = ${n(rateB - rateA)}m and m = ${n(breakEven, 0)} minutes. ` +
      `For 500 minutes, Package A costs ${rand(fixedA + 500 * rateA)} and Package B costs ${rand(500 * rateB)}, so Package A is cheaper by ${rand(500 * rateB - (fixedA + 500 * rateA))}. A user talking about 500 minutes is well past the crossing point at ${n(breakEven, 0)} minutes, where A becomes the cheaper of the two.`,
    explanation:
      'The point where two cost graphs cross is the break-even point, and it is the single most useful thing to read off a pair of tariff graphs: below it one package wins, above it the other does. Package B is cheaper at first because it has no monthly fee, but its steeper line — R1,40 a minute against R0,90 — means it overtakes. Notice that the advice must name which side of the break-even point the user falls on; saying "A is cheaper" without that is a statement about one number rather than a reason.',
    memo: [
      { code: 'M', marks: 1, text: `${fixedA} + 200 × ${n(rateA)}` },
      { code: 'CA', marks: 1, text: `A = ${rand(fixedA + 200 * rateA)}, B = ${rand(200 * rateB)}` },
      { code: 'M', marks: 1, text: `${fixedA} + ${n(rateA)}m = ${n(rateB)}m` },
      { code: 'CA', marks: 1, text: `m = ${n(breakEven, 0)} minutes` },
      { code: 'J', marks: 1, text: 'Package A' },
      { code: 'R', marks: 1, text: `500 minutes is past the crossing point at ${n(breakEven, 0)} minutes, where A becomes cheaper` },
    ],
  })
}

/* ===================================================================== */
/* Collecting and organising data (Grades 10 and 11)                     */
/* ===================================================================== */

out.push({
  ...dh(10),
  id: 'gap-ml-collect-g10-question-design',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 4,
  context:
    'A learner wants to find out how much time learners at her school spend on homework. She plans to ask: "You probably spend far too long on homework — how many hours do you waste on it each night?"',
  prompt:
    'Explain two separate problems with the wording of this question, and rewrite it so that it would collect useful data.',
  answer:
    'First, it is a leading question: "you probably spend far too long" tells the respondent what answer is expected, and people tend to agree with the suggestion put to them. Second, "waste" is loaded — it assumes homework has no value, which may push a respondent to overstate the time in order to agree, or understate it to disagree. A better wording: "How many hours did you spend on homework last night?"',
  explanation:
    'Data collection goes wrong before a single number is recorded, and the wording of the question is where it usually happens. A good question is neutral, uses no words that carry a judgement, and asks about something the respondent can actually recall — "last night" is answerable, while "usually" invites a guess. Two distinct faults must be named here, and "it is a bad question" counts as neither.',
  memo: [
    { code: 'R', marks: 1, text: 'it is a leading question: it suggests the answer' },
    { code: 'R', marks: 1, text: '"waste" is a loaded word that assumes homework has no value' },
    { code: 'A', marks: 1, text: 'a neutral rewording is given' },
    { code: 'A', marks: 1, text: 'the rewording asks for a specific, recallable period such as "last night"' },
  ],
})

{
  const tallies: [string, number][] = [
    ['0', 4],
    ['1', 9],
    ['2', 7],
    ['3', 5],
    ['4 or more', 3],
  ]
  const total = tallies.reduce((a, [, f]) => a + f, 0)
  const atLeastTwo = tallies.slice(2).reduce((a, [, f]) => a + f, 0)
  out.push({
    ...dh(11),
    id: 'gap-ml-collect-g11-organise-tally',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context:
      '|+ A survey of one class: how many times each learner visited the library last week\n| Visits | Number of learners |\n|---|---|\n' +
      tallies.map(([v, f]) => `| ${v} | ${f} |`).join('\n'),
    prompt:
      `State how many learners were surveyed, state how many of them visited the library at least twice, and explain why the last row of the table is written as "4 or more" rather than as separate rows for 4, 5, 6 and so on.`,
    answer:
      `${tallies.map(([, f]) => f).join(' + ')} = ${total} learners were surveyed. At least twice means 2, 3, or 4 or more: ${tallies
        .slice(2)
        .map(([, f]) => f)
        .join(' + ')} = ${atLeastTwo} learners. ` +
      'The last row is grouped as "4 or more" because very few learners visited that often, and separate rows for 4, 5, 6 and 7 would each hold one or two learners, making the table long and the pattern harder to see. Grouping the tail keeps the table readable.',
    explanation:
      '"At least twice" means two or more, so the 2 row is included — reading it as "more than twice" and starting at 3 is the commonest error, and it is a reading error rather than a calculation one. The last part is about how collected data is ORGANISED rather than about calculating with it: an open-ended final category is a normal and honest way to handle a long thin tail, and its cost is that the exact values inside it are no longer recoverable from the table.',
    memo: [
      { code: 'M', marks: 1, text: 'frequencies added' },
      { code: 'A', marks: 1, text: `${total} learners surveyed` },
      { code: 'M', marks: 1, text: 'the 2, 3 and "4 or more" rows added' },
      { code: 'A', marks: 1, text: `${atLeastTwo} learners visited at least twice` },
      { code: 'R', marks: 1, text: 'few learners visited that often, so grouping the tail keeps the table readable' },
    ],
  })
}

/* ===================================================================== */
/* Route planning and travel time (Grade 10)                             */
/* ===================================================================== */

{
  const legs: [string, number][] = [
    ['Home to the taxi rank', 8],
    ['Taxi rank to the town centre', 26],
    ['Town centre to the clinic', 12],
  ]
  const travel = legs.reduce((a, [, m]) => a + m, 0)
  const waiting = 15
  const total = travel + waiting
  out.push({
    ...({ topicId: 'maps-plans', grade: 10 } as const),
    id: 'gap-ml-route-g10-clinic-trip',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context:
      '|+ Stages of Thandi\'s trip to the clinic\n| Stage | Time |\n|---|---|\n' +
      legs.map(([s, m]) => `| ${s} | ${m} minutes |`).join('\n') +
      `\nShe also waits ${waiting} minutes at the taxi rank for the taxi to fill up.`,
    prompt:
      `Calculate Thandi's total travelling time including the wait, and determine the latest time she can leave home to arrive at the clinic by 09:30. She wants to arrive 10 minutes early, so work to an arrival time of 09:20.`,
    answer:
      `Travelling time = ${legs.map(([, m]) => m).join(' + ')} = ${travel} minutes, plus ${waiting} minutes waiting = ${total} minutes, which is ${Math.floor(total / 60)} hour ${total % 60} minutes. ` +
      `Working back from 09:20: 09:20 − 1 hour = 08:20, then − ${total % 60} minutes = ${String(8).padStart(2, '0')}:${String(20 - (total % 60) + 60).padStart(2, '0')}. So she must leave home by 07:59.`,
    explanation:
      'Route planning is addition and subtraction of times, and the two places marks are lost are both about minutes rather than method. First, the waiting time is part of the journey — a stage where nothing moves still takes time, and leaving it out makes her late. Second, subtract the hour and the minutes separately and borrow properly: 09:20 minus 21 minutes is not 09:01 but 08:59, because there are 60 minutes in an hour and not 100. Working back from the arrival time, rather than forward from a guess, is what makes the answer a single definite time.',
    memo: [
      { code: 'M', marks: 1, text: `${legs.map(([, m]) => m).join(' + ')}` },
      { code: 'A', marks: 1, text: `${travel} minutes of travelling` },
      { code: 'M', marks: 1, text: `${travel} + ${waiting} waiting` },
      { code: 'CA', marks: 1, text: `${total} minutes in total, or 1 hour ${total % 60} minutes` },
      { code: 'A', marks: 1, text: 'leave home by 07:59' },
    ],
  })
}

/* ===================================================================== */
/* Surface area (Grade 10)                                               */
/* ===================================================================== */

{
  const l = 1.2
  const w = 0.8
  const h = 0.5
  const sa = 2 * (l * w + l * h + w * h)
  const coverage = 8
  const litres = sa / coverage
  out.push({
    ...({ topicId: 'measurement', grade: 10 } as const),
    id: 'gap-ml-surface-g10-paint-box',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 6,
    context: `A closed wooden storage box measures ${n(l)} m long, ${n(w)} m wide and ${n(h)} m high. One litre of paint covers ${coverage} m².`,
    prompt:
      'Calculate the total surface area of the box using the formula Surface area = 2(l × w) + 2(l × h) + 2(w × h), and determine how many litres of paint are needed to give the outside one coat. Explain why the answer must be rounded up.',
    answer:
      `Surface area = 2(${n(l)} × ${n(w)}) + 2(${n(l)} × ${n(h)}) + 2(${n(w)} × ${n(h)}) = 2(${n(l * w)}) + 2(${n(l * h)}) + 2(${n(w * h)}) = ${n(2 * l * w)} + ${n(2 * l * h)} + ${n(2 * w * h)} = ${n(sa)} m². ` +
      `Paint needed = ${n(sa)} ÷ ${coverage} = ${n(litres)} litres. This must be rounded UP to ${Math.ceil(litres)} litres, because paint is sold in whole litres and ${Math.floor(litres)} litre(s) would not be enough to finish the box.`,
    explanation:
      'A closed box has six faces in three matching pairs, which is why each product is doubled — the formula is just "front and back, top and bottom, two sides" written out. Keep every measurement in metres so the area comes out in square metres and matches the units the paint coverage is given in; mixing metres and centimetres is the error that costs most marks here. The rounding decision is the reasoning mark: for a quantity you must BUY, round up, because two-thirds of a tin cannot be purchased and running short means a second trip.',
    memo: [
      { code: 'M', marks: 1, text: 'formula substituted with l = 1,2, w = 0,8, h = 0,5' },
      { code: 'M', marks: 1, text: `${n(2 * l * w)} + ${n(2 * l * h)} + ${n(2 * w * h)}` },
      { code: 'CA', marks: 1, text: `surface area = ${n(sa)} m²` },
      { code: 'M', marks: 1, text: `${n(sa)} ÷ ${coverage}` },
      { code: 'CA', marks: 1, text: `${n(litres)} litres` },
      { code: 'J', marks: 1, text: `rounded up to ${Math.ceil(litres)} litres, because paint is bought in whole litres` },
    ],
  })
}

export const matlitGraphGaps: Question[] = out
