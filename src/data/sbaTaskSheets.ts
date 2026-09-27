import type { Grade } from '@/types'

/**
 * Practical investigations, experiments, investigations and projects for the
 * formal Programme of Assessment.
 *
 * A test or an assignment can be assembled from the question bank; these
 * cannot. Each is a task sheet a teacher can hand out as it stands: what the
 * learners do, what they hand in, and the rubric it is marked against, with
 * notes for the teacher on the results to expect and what to watch for.
 *
 * They are written for an ordinary school: the equipment is what a FET
 * science room or a household has, and the Mathematics and Mathematical
 * Literacy tasks need a calculator and the learners' own data. Where a
 * province prescribes a particular practical for a term, the province's
 * version is the one to use -- these are ready-made where it does not, and a
 * model of the format where it does.
 */

export type SheetKind = 'Investigation' | 'Project' | 'Practical investigation' | 'Experiment' | 'Practical task'

export interface RubricRow {
  criterion: string
  marks: number
  /** What a low, a middle and a full-marks response looks like. */
  levels: [string, string, string]
}

export interface TaskSheet {
  id: string
  subjectId: string
  grade: Grade
  term: 1 | 2 | 3 | 4
  kind: SheetKind
  topicId: string
  title: string
  /** Time the learners need, as the teacher would tell them. */
  time: string
  /** The opening paragraph the learners read. */
  intro: string
  /** Equipment or resources, for the practical tasks. */
  materials?: string[]
  /** Safety precautions, printed on the learner copy. */
  safety?: string[]
  /** What the learners do, in order. */
  steps: string[]
  /** What they hand in. */
  handIn: string[]
  rubric: RubricRow[]
  /** For the teacher only: expected results and what to look for when marking. */
  teacherNotes: string[]
}

export const sheetMarks = (s: TaskSheet) => s.rubric.reduce((a, r) => a + r.marks, 0)

export const taskSheets: TaskSheet[] = [
  // ------------------------------------------------------------ Mathematics
  {
    id: 'math-g10-t1-inv',
    subjectId: 'mathematics',
    grade: 10,
    term: 1,
    kind: 'Investigation',
    topicId: 'math-number-patterns',
    title: 'Squares in a staircase',
    time: 'Two lessons in class, plus one at home to write up',
    intro:
      'A staircase is built from unit squares: step 1 is one square, step 2 adds a column of two squares, step 3 adds a column of three, and so on. You will investigate how many squares a staircase of n steps needs, and whether the pattern is linear.',
    materials: ['Squared paper', 'Ruler and pencil', 'Calculator'],
    steps: [
      'Draw the staircases with 1, 2, 3, 4 and 5 steps on squared paper and count the squares in each.',
      'Record the number of steps n and the total number of squares Tₙ in a table.',
      'Work out the first differences between consecutive totals. Is the pattern linear? Explain how you can tell.',
      'Work out the second differences. Describe what you notice.',
      'Predict T₆ and T₁₀ from your table, then check T₆ by drawing it.',
      'Explain, using the drawing, why two staircases of n steps fit together to make a rectangle n by (n + 1). Use this to write a formula for Tₙ.',
      'Use your formula to find the number of steps in a staircase that needs 210 squares.',
    ],
    handIn: ['Your drawings and table', 'Your working for each step', 'A short conclusion: what kind of pattern is this, and what is its formula?'],
    rubric: [
      { criterion: 'Drawings and table', marks: 6, levels: ['Incomplete or inaccurate', 'Mostly correct, with one or two counting errors', 'All five staircases drawn and counted correctly, neat table'] },
      { criterion: 'First and second differences', marks: 8, levels: ['Differences not found', 'Differences found but not interpreted', 'Both found and correctly used to say the pattern is not linear'] },
      { criterion: 'Prediction and checking', marks: 6, levels: ['No prediction', 'Prediction made without checking', 'T₆ = 21 and T₁₀ = 55 predicted and T₆ checked by drawing'] },
      { criterion: 'Formula from the rectangle', marks: 12, levels: ['No formula', 'Formula guessed or stated without the rectangle argument', 'Tₙ = n(n + 1)/2 derived clearly from the rectangle'] },
      { criterion: 'Using the formula', marks: 8, levels: ['Not attempted', 'Equation set up but not solved correctly', 'n(n + 1) = 420 solved to n = 20, negative root rejected'] },
      { criterion: 'Communication and conclusion', marks: 10, levels: ['Hard to follow, no conclusion', 'Reasonably clear, conclusion partly supported', 'Clear, logical write-up with a conclusion supported by the evidence'] },
    ],
    teacherNotes: [
      'Totals: 1, 3, 6, 10, 15, 21, …; first differences 2, 3, 4, 5, …; second difference constant at 1, so the pattern is not linear (it is quadratic, which Grade 10s meet informally here).',
      'Formula: Tₙ = n(n + 1)/2. For 210 squares, n² + n − 420 = 0 gives n = 20.',
      'Credit a correct formula found by another valid route, for example by fitting, as long as it is justified.',
    ],
  },
  {
    id: 'math-g11-t1-inv',
    subjectId: 'mathematics',
    grade: 11,
    term: 1,
    kind: 'Investigation',
    topicId: 'math-analytical-geometry',
    title: 'Gradient and the angle of inclination',
    time: 'Two lessons in class, plus one at home to write up',
    intro:
      'You will investigate how the gradient of a straight line is related to the angle the line makes with the positive x-axis, and use what you find to explain why perpendicular lines have gradients whose product is −1.',
    materials: ['Graph paper', 'Protractor and ruler', 'Scientific calculator'],
    steps: [
      'Draw six lines through the origin with gradients 1/2, 1, 2, −1/2, −1 and −2 on the same axes.',
      'Measure the angle each line makes with the positive x-axis, measured anticlockwise, and record it next to its gradient.',
      'For each line, calculate tan of the measured angle. Compare it with the gradient and describe the relationship.',
      'State the relationship as a rule, and explain why the angle of a negative gradient is between 90° and 180°.',
      'Choose two of your lines that look perpendicular. Use the angles to show that they differ by 90°, and use tan to show that the product of their gradients is −1.',
      'Find the angle of inclination of the line through A(−2 ; 3) and B(4 ; −1), and the equation of the line through A that is perpendicular to AB.',
    ],
    handIn: ['Your graph with angles marked', 'Your table and calculations', 'A conclusion stating the rule and the perpendicular-lines result'],
    rubric: [
      { criterion: 'Accurate graph and measurements', marks: 8, levels: ['Lines or angles largely wrong', 'Most lines correct, angles roughly measured', 'All six lines accurate, angles within 2°'] },
      { criterion: 'Comparing tan θ with the gradient', marks: 8, levels: ['No comparison', 'Values calculated but not compared', 'tan θ = m found for every line, with measurement error discussed'] },
      { criterion: 'Rule and negative gradients', marks: 8, levels: ['No rule', 'Rule stated without the obtuse-angle case', 'm = tan θ, with θ = 180° + tan⁻¹m for negative m explained'] },
      { criterion: 'Perpendicular lines', marks: 12, levels: ['Not attempted', 'Angles differ by 90° shown, but no product', 'Both the 90° difference and m₁ × m₂ = −1 shown and explained'] },
      { criterion: 'Application', marks: 8, levels: ['Not attempted', 'Inclination or equation correct, not both', 'θ = 146,31° and y = (3/2)x + 6 both correct'] },
      { criterion: 'Communication', marks: 6, levels: ['Unclear', 'Mostly clear', 'Clear, well organised and concluded'] },
    ],
    teacherNotes: [
      'Expected angles: 26,6°, 45°, 63,4°, 153,4°, 135°, 116,6°.',
      'm_AB = −4/6 = −2/3, so θ = 180° − 33,69° = 146,31°. The perpendicular gradient is 3/2, and 3 = (3/2)(−2) + c gives c = 6.',
    ],
  },
  {
    id: 'math-g12-t1-inv',
    subjectId: 'mathematics',
    grade: 12,
    term: 1,
    kind: 'Investigation',
    topicId: 'math-finance-growth',
    title: 'Buy now or save first?',
    time: 'One week, working at home and in two lessons',
    intro:
      'Thabo wants a R60 000 second-hand car. He can take a loan now at 14% p.a. compounded monthly, repaid over 4 years, or save the same monthly amount in an account earning 7% p.a. compounded monthly and buy the car when he has saved enough. You will investigate which choice is better, and by how much.',
    materials: ['Scientific calculator', 'A spreadsheet if one is available (optional)'],
    steps: [
      'Calculate Thabo’s monthly instalment if he takes the loan now.',
      'Calculate the total he pays over the 4 years, and the total interest.',
      'If he instead saves that same monthly amount at 7% p.a. compounded monthly, how many months does it take to reach R60 000? Show your use of logarithms.',
      'Compare the total he has paid out in each case, and the time he has the car. Which option costs less? Which gives him the car sooner?',
      'Car prices rise by about 5% a year. Recalculate the savings option if the car costs 5% more for each year he saves.',
      'Write a recommendation for Thabo. Include at least one factor that is not about money.',
    ],
    handIn: ['All calculations with formulae shown', 'A comparison table', 'Your recommendation'],
    rubric: [
      { criterion: 'Loan instalment and totals', marks: 10, levels: ['Incorrect formula', 'Correct formula, errors in n or i', 'Instalment about R1 639,59 and interest about R18 700, correctly worked'] },
      { criterion: 'Savings period using logs', marks: 10, levels: ['Not attempted', 'Future value set up, logs misapplied', 'Correct future-value equation solved with logs for n'] },
      { criterion: 'Comparison', marks: 8, levels: ['No comparison', 'Totals compared without reasoning', 'Cost and time both compared with reasons'] },
      { criterion: 'Effect of rising prices', marks: 10, levels: ['Not attempted', 'Price increase applied incorrectly', 'Rising target handled correctly and its effect explained'] },
      { criterion: 'Recommendation', marks: 7, levels: ['No recommendation', 'Recommendation not supported', 'Well-supported recommendation including a non-financial factor'] },
      { criterion: 'Presentation', marks: 5, levels: ['Disorganised', 'Mostly clear', 'Clear, with formulae, units and a table'] },
    ],
    teacherNotes: [
      'Loan: x = 60 000 × (0,14/12) ÷ [1 − (1 + 0,14/12)⁻⁴⁸] ≈ R1 639,59; total ≈ R78 700; interest ≈ R18 700.',
      'Saving R1 639,59 a month at 7%: 60 000 = x[(1 + 0,07/12)ⁿ − 1] ÷ (0,07/12) gives n = 33,3, so 34 months and about R55 700 paid in.',
      'With the price rising 5% a year, the target keeps moving: he reaches it after about 39 months, when the car costs about R70 300 -- five months later than before. Accept answers that model this reasonably, for example year by year.',
    ],
  },

  // ------------------------------------------------ Mathematical Literacy
  {
    id: 'ml-g10-t2-inv',
    subjectId: 'mat-lit',
    grade: 10,
    term: 2,
    kind: 'Investigation',
    topicId: 'measurement',
    title: 'Painting the classroom',
    time: 'Two lessons, including measuring in class',
    intro:
      'The school wants to paint the four walls of your classroom (not the ceiling). You will measure the room, work out how much paint is needed, and find the cheapest way to buy it.',
    materials: ['Measuring tape (at least 5 m)', 'Calculator', 'Paint prices from a hardware store or advert (your teacher may supply these)'],
    safety: ['Work in pairs when measuring high up. Do not climb on desks or chairs.'],
    steps: [
      'Measure the length, width and height of the classroom in metres, to the nearest centimetre.',
      'Measure every door and window, and calculate the area that will not be painted.',
      'Calculate the total wall area to be painted.',
      'The paint covers 8 m² per litre per coat, and two coats are needed. Calculate the litres of paint required.',
      'Paint is sold in 1 ℓ, 5 ℓ and 20 ℓ tins. Using the prices you were given, find the cheapest combination of tins that gives enough paint.',
      'Add 15% VAT if the prices exclude it, and state the final cost.',
      'Suggest one reason why a painter might buy more paint than your calculation shows.',
    ],
    handIn: ['A labelled sketch of the room with your measurements', 'All calculations', 'Your cheapest combination and final cost'],
    rubric: [
      { criterion: 'Measurements and sketch', marks: 8, levels: ['Missing or unrealistic', 'Mostly measured, sketch unclear', 'All measured sensibly and shown on a labelled sketch'] },
      { criterion: 'Wall area with openings subtracted', marks: 10, levels: ['Area not found', 'Area found but openings not subtracted', 'Correct area with doors and windows subtracted'] },
      { criterion: 'Litres of paint', marks: 8, levels: ['Not calculated', 'One coat only, or coverage misused', 'Two coats at 8 m²/ℓ correctly calculated and rounded up'] },
      { criterion: 'Cheapest combination and cost', marks: 12, levels: ['Not attempted', 'A combination found but not the cheapest, or VAT wrong', 'Cheapest combination found, compared with alternatives, VAT correct'] },
      { criterion: 'Reasoning and presentation', marks: 7, levels: ['No reasoning', 'Some reasoning', 'Sensible reason for extra paint and clear presentation'] },
    ],
    teacherNotes: [
      'Answers depend on the room. Check the method: area of four walls = 2(l + w) × h, minus openings; litres = area × 2 ÷ 8, rounded up.',
      'Accept any realistic reason for buying extra: wastage, uneven walls, touch-ups, a third coat over dark colours.',
    ],
  },
  {
    id: 'ml-g11-t2-inv',
    subjectId: 'mat-lit',
    grade: 11,
    term: 2,
    kind: 'Investigation',
    topicId: 'finance',
    title: 'Contract or prepaid?',
    time: 'One week, including research at home',
    intro:
      'You will investigate whether a cellphone contract or prepaid airtime is cheaper for a teenager, using your own usage or that of someone in your household.',
    materials: ['Current contract and prepaid tariffs from one network (adverts or the network’s website)', 'Calculator', 'Graph paper'],
    steps: [
      'Record the calls (in minutes) and data (in MB or GB) used in one typical week, and scale it up to a month.',
      'Write down the monthly cost and inclusions of one contract, and the prepaid rates for calls and data from the same network.',
      'Calculate the monthly cost of your usage on prepaid and on the contract, including any out-of-bundle charges.',
      'Draw a graph of monthly cost against data used (0 to 5 GB) for both options, on the same axes.',
      'Find the break-even point from your graph and by calculation, and explain what it means.',
      'Which option would you recommend for the person you studied, and why? Mention one advantage of the other option.',
    ],
    handIn: ['Your usage record', 'The tariffs you used, with their source', 'Calculations, graph and recommendation'],
    rubric: [
      { criterion: 'Usage data and tariffs', marks: 8, levels: ['Missing', 'Incomplete or unrealistic', 'Realistic monthly usage and tariffs with a source'] },
      { criterion: 'Monthly costs', marks: 10, levels: ['Incorrect', 'One option correct', 'Both options correct, including out-of-bundle charges'] },
      { criterion: 'Graph', marks: 10, levels: ['Missing or wrong', 'Plotted with errors in scale or labels', 'Both lines accurately plotted with a title, labels and scale'] },
      { criterion: 'Break-even point', marks: 10, levels: ['Not found', 'Found from the graph only', 'Found both ways and correctly interpreted'] },
      { criterion: 'Recommendation', marks: 7, levels: ['Missing', 'Stated without reasons', 'Justified by the data, with an advantage of the other option'] },
    ],
    teacherNotes: [
      'Tariffs change often; accept any current, sourced tariffs. Check that the contract line is flat up to its bundle and then rises, and the prepaid line rises from zero.',
    ],
  },
  {
    id: 'ml-g12-t2-inv',
    subjectId: 'mat-lit',
    grade: 12,
    term: 2,
    kind: 'Investigation',
    topicId: 'finance',
    title: 'Has the price of bread kept up with inflation?',
    time: 'One week, including research',
    intro:
      'Inflation measures how fast prices rise on average. You will investigate whether the price of a loaf of bread has risen faster or slower than inflation over the last ten years.',
    materials: ['Bread prices from ten years ago and today (ask a family member, or use data your teacher gives you)', 'Annual CPI inflation rates for the period (Stats SA; your teacher may supply these)', 'Calculator'],
    steps: [
      'Record the price of a white loaf ten years ago and today, and the source of each.',
      'Calculate the percentage increase in the price of the loaf over the ten years.',
      'Using the annual inflation rates, calculate what the old price would be today if it had risen exactly with inflation. Show each year.',
      'Compare your answer with today’s actual price. Has bread risen faster or slower than inflation?',
      'Calculate the average annual rate at which the bread price has risen, and compare it with the average inflation rate.',
      'Give two reasons why the price of one item can rise faster than inflation.',
    ],
    handIn: ['Your prices and sources', 'A year-by-year table', 'Your comparison and reasons'],
    rubric: [
      { criterion: 'Data and sources', marks: 6, levels: ['Missing', 'Prices without sources', 'Both prices and inflation rates with sources'] },
      { criterion: 'Percentage increase', marks: 6, levels: ['Wrong', 'Method right, calculation wrong', 'Correct percentage increase'] },
      { criterion: 'Applying inflation year by year', marks: 14, levels: ['Not attempted', 'Simple instead of compound, or errors', 'Each year compounded correctly in a table'] },
      { criterion: 'Comparison and average rate', marks: 12, levels: ['No comparison', 'Comparison without the average rate', 'Both, with the average rate found by a correct method'] },
      { criterion: 'Reasons', marks: 7, levels: ['None', 'One reason, or vague reasons', 'Two sound reasons, such as input costs, drought or fuel prices'] },
    ],
    teacherNotes: [
      'The key skill is compounding the inflation rates year by year: P₁₀ = P₀(1 + i₁)(1 + i₂)…(1 + i₁₀). A single average rate applied as simple interest is a common error.',
      'Average annual rate: (today ÷ then)^(1/10) − 1. Accept a clear trial-and-improvement approach.',
    ],
  },

  // ---------------------------------------------------- Physical Sciences
  {
    id: 'ps-g10-t1-prac',
    subjectId: 'physical-sciences',
    grade: 10,
    term: 1,
    kind: 'Practical investigation',
    topicId: 'phys-states-matter-kmt',
    title: 'The heating curve of water',
    time: 'One double period',
    intro: 'You will heat ice until it melts and the water boils, recording the temperature regularly, and use the kinetic molecular theory to explain the shape of the graph.',
    materials: ['Crushed ice', 'Beaker (250 ml)', 'Bunsen burner or hot plate', 'Tripod and gauze', 'Thermometer (−10 °C to 110 °C)', 'Stirring rod', 'Stopwatch'],
    safety: ['Wear safety glasses.', 'Do not stir with the thermometer.', 'Handle the hot beaker with tongs.'],
    steps: [
      'Write an investigative question and a hypothesis.',
      'Half-fill the beaker with crushed ice and record its starting temperature.',
      'Heat gently, stirring all the time, and record the temperature every 30 seconds until the water has boiled for three minutes.',
      'Record your readings in a table.',
      'Draw a graph of temperature against time.',
      'Identify the melting and boiling points on your graph and label the phases.',
      'Use the kinetic molecular theory to explain why the temperature stays constant during melting and boiling.',
      'Name two sources of error and one way to reduce each.',
    ],
    handIn: ['Investigative question and hypothesis', 'Table and graph', 'Answers to the analysis questions and a conclusion'],
    rubric: [
      { criterion: 'Investigative question and hypothesis', marks: 4, levels: ['Missing', 'Present but not testable', 'Testable question and a matching hypothesis'] },
      { criterion: 'Table of results', marks: 6, levels: ['Incomplete', 'Complete, headings or units missing', 'Complete with headings and units'] },
      { criterion: 'Graph', marks: 10, levels: ['Missing or wrong axes', 'Plotted, scale or labels poor', 'Accurate, titled, labelled axes with units, suitable scale'] },
      { criterion: 'Interpretation using the KMT', marks: 12, levels: ['No explanation', 'Plateaus identified but not explained', 'Plateaus explained: energy breaks intermolecular forces, not raising kinetic energy'] },
      { criterion: 'Errors and conclusion', marks: 8, levels: ['Missing', 'Errors or conclusion vague', 'Relevant errors with improvements and a valid conclusion'] },
    ],
    teacherNotes: [
      'Expect a plateau near 0 °C and one below 100 °C (atmospheric pressure inland lowers the boiling point; Gauteng is about 94 °C to 95 °C).',
      'During a phase change the energy supplied overcomes intermolecular forces, so the average kinetic energy, and therefore the temperature, stays constant.',
    ],
  },
  {
    id: 'ps-g10-t2-exp',
    subjectId: 'physical-sciences',
    grade: 10,
    term: 2,
    kind: 'Experiment',
    topicId: 'phys-transverse-waves-g10',
    title: 'The speed of a pulse in a spring',
    time: 'One double period',
    intro: 'You will send pulses along a stretched slinky spring and investigate whether the speed of a pulse depends on its amplitude.',
    materials: ['Slinky spring', 'Measuring tape', 'Stopwatch', 'Masking tape to mark the ends'],
    steps: [
      'Stretch the spring along the floor to a fixed length (about 4 m) and mark both ends.',
      'Send a small pulse from one end and time how long it takes to travel to the other end and back. Repeat three times.',
      'Repeat with a medium pulse and a large pulse, keeping the length of the spring the same.',
      'Calculate the average time and the speed of each pulse (v = distance ÷ time).',
      'State the independent, dependent and controlled variables.',
      'Does the amplitude affect the speed? What does affect the speed of a pulse in a medium?',
    ],
    handIn: ['Table of times and speeds', 'Variables', 'Conclusion'],
    rubric: [
      { criterion: 'Variables', marks: 6, levels: ['Missing', 'Some correct', 'All three correctly identified'] },
      { criterion: 'Results table with averages', marks: 8, levels: ['Incomplete', 'Complete, averages or units missing', 'Complete, with averages and units'] },
      { criterion: 'Speed calculations', marks: 8, levels: ['Wrong', 'Some correct', 'All correct, using the return distance'] },
      { criterion: 'Conclusion', marks: 8, levels: ['Missing', 'Stated without evidence', 'Speed does not depend on amplitude, supported by the data'] },
    ],
    teacherNotes: ['The speed should be about the same for all amplitudes; it depends on the medium (the spring’s tension and mass per length). Remind learners the pulse travels twice the length there and back.'],
  },
  {
    id: 'ps-g10-t3-exp',
    subjectId: 'physical-sciences',
    grade: 10,
    term: 3,
    kind: 'Experiment',
    topicId: 'phys-motion-1d',
    title: 'Motion of a ball down a ramp',
    time: 'One double period',
    intro: 'You will measure the time a ball takes to roll different distances down a ramp and use a graph to decide whether it accelerates uniformly.',
    materials: ['A plank about 2 m long propped up at one end', 'Marble or small ball', 'Measuring tape', 'Stopwatch'],
    steps: [
      'Mark distances of 0,4 m, 0,8 m, 1,2 m, 1,6 m and 2,0 m from the top of the ramp.',
      'Release the ball from rest at the top and time how long it takes to reach each mark. Repeat each three times.',
      'Record the times and calculate the average for each distance.',
      'Draw a graph of distance against time, and a graph of distance against time².',
      'Use the second graph to calculate the acceleration of the ball (x = ½at²).',
      'Explain whether the motion is uniformly accelerated.',
    ],
    handIn: ['Table', 'Both graphs', 'Calculation of acceleration and conclusion'],
    rubric: [
      { criterion: 'Results table', marks: 6, levels: ['Incomplete', 'Complete, no averages', 'Complete with averages and units'] },
      { criterion: 'Distance-time graph', marks: 6, levels: ['Missing', 'Plotted with errors', 'Accurate curve with labels and units'] },
      { criterion: 'Distance-time² graph', marks: 8, levels: ['Missing', 'Plotted but not a straight line fit', 'Accurate with a line of best fit through the origin'] },
      { criterion: 'Acceleration from the gradient', marks: 6, levels: ['Missing', 'Gradient found but not doubled', 'a = 2 × gradient, with units'] },
      { criterion: 'Conclusion', marks: 4, levels: ['Missing', 'Stated without evidence', 'Uniform acceleration supported by the straight line'] },
    ],
    teacherNotes: ['A straight line on the distance-time² graph shows uniform acceleration. Because x = ½at², the gradient is a/2.'],
  },
  {
    id: 'ps-g11-t1-prac',
    subjectId: 'physical-sciences',
    grade: 11,
    term: 1,
    kind: 'Practical investigation',
    topicId: 'phys-newtons-laws',
    title: 'Newton’s second law: force and acceleration',
    time: 'One double period',
    intro: 'You will investigate how the acceleration of a trolley depends on the net force on it, keeping its mass constant.',
    materials: ['Trolley', 'Runway', 'Pulley and string', 'Set of slotted masses (10 g to 50 g)', 'Ticker timer and tape, or stopwatch and metre rule'],
    steps: [
      'Write the investigative question, a hypothesis and the variables.',
      'Compensate the runway for friction so that the trolley moves at constant speed when pushed gently.',
      'Attach a hanging mass over the pulley and release the trolley from rest. Measure its acceleration.',
      'Move masses from the trolley to the hanger so that the total mass stays the same, and repeat for five different forces.',
      'Record the force (weight of the hanging mass) and the acceleration in a table.',
      'Draw a graph of acceleration against net force and describe the relationship.',
      'Use the gradient to find the mass of the system and compare it with the measured mass.',
    ],
    handIn: ['Question, hypothesis and variables', 'Table and graph', 'Conclusion and comparison of masses'],
    rubric: [
      { criterion: 'Question, hypothesis and variables', marks: 6, levels: ['Missing', 'Partly correct', 'All correct and testable'] },
      { criterion: 'Method, including friction compensation', marks: 6, levels: ['Not followed', 'Partly followed', 'Followed carefully, total mass kept constant'] },
      { criterion: 'Results table', marks: 6, levels: ['Incomplete', 'Complete, units missing', 'Complete with units'] },
      { criterion: 'Graph', marks: 10, levels: ['Missing', 'Plotted with errors', 'Accurate straight line through the origin, labelled with units'] },
      { criterion: 'Analysis and conclusion', marks: 12, levels: ['Missing', 'Relationship stated only', 'a ∝ F with mass from 1/gradient compared with the measured mass'] },
    ],
    teacherNotes: ['The gradient of a-F is 1/m for the whole system (trolley plus hanging masses). Moving masses from trolley to hanger keeps the system mass constant, which is why the method asks for it.'],
  },
  {
    id: 'ps-g11-t2-exp',
    subjectId: 'physical-sciences',
    grade: 11,
    term: 2,
    kind: 'Experiment',
    topicId: 'phys-geometric-optics',
    title: 'Refraction through a glass block',
    time: 'One double period',
    intro: 'You will measure angles of incidence and refraction for light entering a glass block, and use them to find the refractive index of the glass.',
    materials: ['Rectangular glass block', 'Ray box or pins', 'Protractor', 'A3 paper'],
    safety: ['Do not look directly into the ray box.'],
    steps: [
      'Trace the outline of the block and draw a normal where the ray will enter.',
      'Shine a ray at angles of incidence of 10°, 20°, 30°, 40°, 50° and 60°, and mark the emerging ray each time.',
      'Draw in the refracted ray inside the block and measure each angle of refraction.',
      'Record the angles and calculate sin i and sin r.',
      'Draw a graph of sin i against sin r and use its gradient to find the refractive index of the glass.',
      'Compare your value with the accepted value of about 1,5 and suggest reasons for any difference.',
    ],
    handIn: ['Ray diagram', 'Table and graph', 'Refractive index and discussion'],
    rubric: [
      { criterion: 'Ray diagram and measurement', marks: 8, levels: ['Inaccurate', 'Mostly accurate', 'Accurate rays, normals and angles'] },
      { criterion: 'Table with sines', marks: 6, levels: ['Incomplete', 'Complete with errors', 'Complete and correct'] },
      { criterion: 'Graph', marks: 8, levels: ['Missing', 'Plotted with errors', 'Accurate straight line through the origin'] },
      { criterion: 'Refractive index and discussion', marks: 8, levels: ['Missing', 'Value without discussion', 'Value from the gradient compared with 1,5 and errors discussed'] },
    ],
    teacherNotes: ['Snell’s law: n₁ sin i = n₂ sin r, so with air (n ≈ 1) the gradient of sin i against sin r is the refractive index of the glass, about 1,5.'],
  },
  {
    id: 'ps-g11-t3-exp',
    subjectId: 'physical-sciences',
    grade: 11,
    term: 3,
    kind: 'Experiment',
    topicId: 'phys-ideal-gases',
    title: 'Boyle’s law',
    time: 'One double period',
    intro: 'You will investigate how the volume of a fixed mass of gas changes with pressure at constant temperature.',
    materials: ['Boyle’s law apparatus, or a sealed syringe with a pressure gauge'],
    steps: [
      'Write the investigative question, hypothesis and variables, including the two controlled variables.',
      'Record the volume of the trapped air at atmospheric pressure.',
      'Increase the pressure in steps, waiting a moment after each change for the temperature to settle, and record pressure and volume at least six times.',
      'Calculate 1/V for each reading.',
      'Draw a graph of pressure against 1/V.',
      'State the relationship and Boyle’s law, and explain it using the kinetic molecular theory.',
    ],
    handIn: ['Question, hypothesis and variables', 'Table and graph', 'Conclusion and explanation'],
    rubric: [
      { criterion: 'Question, hypothesis and variables', marks: 6, levels: ['Missing', 'Partly correct', 'All correct, mass and temperature controlled'] },
      { criterion: 'Results with 1/V', marks: 6, levels: ['Incomplete', 'Complete, 1/V wrong', 'Complete and correct'] },
      { criterion: 'Graph', marks: 10, levels: ['Missing', 'Plotted with errors', 'Straight line through the origin, labelled with units'] },
      { criterion: 'Conclusion and KMT explanation', marks: 8, levels: ['Missing', 'Law stated only', 'p ∝ 1/V explained by collisions per unit area'] },
    ],
    teacherNotes: ['p against 1/V should be a straight line through the origin. Waiting after each change lets the gas return to room temperature, which keeps T constant.'],
  },
  {
    id: 'ps-g12-t1-prac',
    subjectId: 'physical-sciences',
    grade: 12,
    term: 1,
    kind: 'Practical investigation',
    topicId: 'phys-organic-chemistry',
    title: 'Preparing esters',
    time: 'One double period',
    intro: 'You will prepare esters from alcohols and carboxylic acids, identify them by smell, and name the products.',
    materials: ['Methanol, ethanol and pentan-1-ol', 'Ethanoic acid and methanoic acid (or salicylic acid)', 'Concentrated sulfuric acid (teacher to dispense)', 'Test tubes, beaker of hot water (about 70 °C)', 'Dropper, cotton wool'],
    safety: ['Wear safety glasses and gloves.', 'Alcohols are flammable: no open flames — heat in a water bath.', 'Concentrated sulfuric acid is corrosive; only the teacher dispenses it.', 'Waft to smell; never sniff directly.'],
    steps: [
      'Mix 1 ml of an alcohol with 1 ml of a carboxylic acid in a test tube and add three drops of concentrated sulfuric acid.',
      'Plug the tube with cotton wool and place it in the hot water bath for about 5 minutes.',
      'Pour the contents into a beaker of cold water and waft the smell towards you. Record it.',
      'Repeat for two other alcohol and acid combinations.',
      'For each ester, write the balanced equation using structural formulae, and give the IUPAC name.',
      'State the function of the sulfuric acid, and why the mixture is heated in a water bath rather than over a flame.',
      'Name the type of reaction.',
    ],
    handIn: ['Table of reactants, smells and ester names', 'Equations with structural formulae', 'Answers to the questions'],
    rubric: [
      { criterion: 'Safe and correct procedure', marks: 6, levels: ['Unsafe or not followed', 'Mostly followed', 'Followed safely with all precautions'] },
      { criterion: 'Observations', marks: 6, levels: ['Missing', 'Some recorded', 'All smells recorded in a table'] },
      { criterion: 'Equations and structural formulae', marks: 12, levels: ['Missing or wrong', 'Partly correct', 'All correct with the functional groups shown'] },
      { criterion: 'IUPAC names', marks: 6, levels: ['Wrong', 'Some correct', 'All correct'] },
      { criterion: 'Questions', marks: 10, levels: ['Not answered', 'Partly answered', 'Catalyst and dehydrating agent; flammable alcohols; esterification (condensation)'] },
    ],
    teacherNotes: [
      'Examples: methanol + ethanoic acid → methyl ethanoate; ethanol + ethanoic acid → ethyl ethanoate (nail-polish remover smell); pentan-1-ol + ethanoic acid → pentyl ethanoate (banana).',
      'Sulfuric acid is a catalyst and absorbs the water formed. Heat in a water bath because the alcohols are flammable.',
    ],
  },
  {
    id: 'ps-g12-t2-exp',
    subjectId: 'physical-sciences',
    grade: 12,
    term: 2,
    kind: 'Experiment',
    topicId: 'phys-reaction-rate',
    title: 'Concentration and the rate of reaction',
    time: 'One double period',
    intro: 'You will investigate how the concentration of sodium thiosulfate affects the rate of its reaction with hydrochloric acid, timing how long a cross takes to disappear.',
    materials: ['Sodium thiosulfate solution (40 g/dm³)', 'Hydrochloric acid (1 mol/dm³)', 'Measuring cylinders', 'Conical flask', 'Paper marked with a black cross', 'Stopwatch'],
    safety: ['Wear safety glasses.', 'Work in a ventilated room: sulfur dioxide is produced.'],
    steps: [
      'Write the investigative question, hypothesis and variables.',
      'Place the flask on the cross. Add 50 ml of thiosulfate solution, then 5 ml of acid, and start timing.',
      'Stop timing when the cross is no longer visible from above. Record the time.',
      'Repeat using 40, 30, 20 and 10 ml of thiosulfate made up to 50 ml with water each time.',
      'Calculate the rate as 1/time for each concentration.',
      'Draw a graph of rate against volume (concentration) of thiosulfate.',
      'Explain your results using the collision theory.',
    ],
    handIn: ['Question, hypothesis and variables', 'Table and graph', 'Explanation and conclusion'],
    rubric: [
      { criterion: 'Question, hypothesis and variables', marks: 6, levels: ['Missing', 'Partly correct', 'All correct, total volume and temperature controlled'] },
      { criterion: 'Results table with rate', marks: 8, levels: ['Incomplete', 'Complete, 1/t missing', 'Complete with times, rates and units'] },
      { criterion: 'Graph', marks: 8, levels: ['Missing', 'Plotted with errors', 'Accurate, labelled, with a line of best fit'] },
      { criterion: 'Collision theory explanation', marks: 8, levels: ['Missing', 'Stated without the theory', 'More particles per volume, more effective collisions per second'] },
    ],
    teacherNotes: ['Rate should increase roughly in proportion to concentration. Diluting to the same total volume keeps the depth of liquid, and so the view of the cross, the same.'],
  },
  {
    id: 'ps-g12-t3-exp',
    subjectId: 'physical-sciences',
    grade: 12,
    term: 3,
    kind: 'Experiment',
    topicId: 'phys-electric-circuits',
    title: 'The internal resistance of a battery',
    time: 'One double period',
    intro: 'You will measure the terminal potential difference of a battery for different currents and use a graph to find its emf and internal resistance.',
    materials: ['Battery (two 1,5 V cells in a holder)', 'Rheostat', 'Ammeter and voltmeter', 'Switch and connecting wires'],
    steps: [
      'Draw the circuit diagram, with the voltmeter across the battery.',
      'Set up the circuit and close the switch briefly for each reading, to stop the cells warming up.',
      'Record the current and the terminal potential difference for at least six rheostat settings.',
      'Draw a graph of terminal potential difference against current.',
      'Use the graph to find the emf (y-intercept) and the internal resistance (negative of the gradient).',
      'Explain why the terminal potential difference falls as the current increases.',
    ],
    handIn: ['Circuit diagram', 'Table and graph', 'emf, internal resistance and explanation'],
    rubric: [
      { criterion: 'Circuit diagram', marks: 6, levels: ['Wrong', 'Meters misplaced', 'Correct with standard symbols'] },
      { criterion: 'Results table', marks: 6, levels: ['Incomplete', 'Complete, units missing', 'Complete with units'] },
      { criterion: 'Graph', marks: 8, levels: ['Missing', 'Plotted with errors', 'Accurate straight line, labelled with units'] },
      { criterion: 'emf and internal resistance', marks: 6, levels: ['Missing', 'One correct', 'Both from the graph with units'] },
      { criterion: 'Explanation', marks: 4, levels: ['Missing', 'Partly correct', 'Lost volts Ir increase with current, V = ε − Ir'] },
    ],
    teacherNotes: ['V = ε − Ir: the y-intercept is ε and the gradient is −r. Expect ε close to 3 V and r of a few tenths of an ohm to about 1 Ω for ordinary cells.'],
  },

  // -------------------------------------------------------- Life Sciences
  {
    id: 'ls-g10-t1-prac',
    subjectId: 'life-sciences',
    grade: 10,
    term: 1,
    kind: 'Practical task',
    topicId: 'life-sci-chemistry-of-life',
    title: 'Food tests',
    time: 'One double period',
    intro: 'You will test a range of foods for starch, glucose, protein and fat, and use your results to explain which nutrients each food provides.',
    materials: ['Iodine solution', 'Benedict’s solution and a hot water bath', 'Biuret reagent (or copper sulfate and sodium hydroxide)', 'Brown paper or ethanol', 'Samples: bread, apple, egg white, cooking oil, potato, milk', 'Test tubes and droppers'],
    safety: ['Wear safety glasses.', 'Use a water bath for Benedict’s test; do not heat test tubes directly in a flame.'],
    steps: [
      'Draw up a results table with the foods down the side and the four tests across the top.',
      'Test each food for starch with iodine, glucose with Benedict’s solution, protein with Biuret reagent and fat with the brown-paper (or ethanol emulsion) test.',
      'Record the colour change for each test and whether the result is positive or negative.',
      'Explain why a control (water) is tested alongside the foods.',
      'Which food would you recommend for energy, and which for growth? Use your results.',
    ],
    handIn: ['Completed results table', 'Answers to the questions'],
    rubric: [
      { criterion: 'Following the method safely', marks: 5, levels: ['Unsafe', 'Mostly followed', 'All tests done safely'] },
      { criterion: 'Results table', marks: 10, levels: ['Incomplete', 'Complete, colours missing', 'Complete with colour changes and results'] },
      { criterion: 'Control', marks: 5, levels: ['Missing', 'Mentioned only', 'Purpose of the control explained'] },
      { criterion: 'Interpretation', marks: 10, levels: ['Missing', 'Partly supported', 'Recommendations supported by the results'] },
    ],
    teacherNotes: ['Positive results: iodine blue-black (starch); Benedict’s orange/brick red on heating (reducing sugar); Biuret violet (protein); translucent mark on brown paper or milky emulsion (fat).'],
  },
  {
    id: 'ls-g10-t3-prac',
    subjectId: 'life-sciences',
    grade: 10,
    term: 3,
    kind: 'Practical task',
    topicId: 'life-sci-circulatory-system',
    title: 'Pulse rate and exercise',
    time: 'One double period',
    intro: 'You will measure the effect of exercise on pulse rate and how long the pulse takes to return to normal.',
    materials: ['Stopwatch', 'A step or low bench'],
    safety: ['Learners with a heart or breathing condition record data only and do not exercise.'],
    steps: [
      'Write a hypothesis about the effect of exercise on pulse rate.',
      'Measure your resting pulse at the wrist for 15 seconds and multiply by 4. Repeat three times and take the average.',
      'Step up and down for 2 minutes, then measure your pulse immediately.',
      'Measure your pulse every minute until it returns to resting.',
      'Record the class data in a table and draw a line graph of pulse rate against time for your own results.',
      'Explain why pulse rate rises during exercise, referring to oxygen and carbon dioxide.',
      'Explain why the recovery time differs between learners.',
    ],
    handIn: ['Hypothesis', 'Table and graph', 'Explanations'],
    rubric: [
      { criterion: 'Hypothesis', marks: 3, levels: ['Missing', 'Vague', 'Clear and testable'] },
      { criterion: 'Results table', marks: 6, levels: ['Incomplete', 'Complete, averages missing', 'Complete with averages and units'] },
      { criterion: 'Line graph', marks: 8, levels: ['Missing', 'Plotted with errors', 'Accurate, titled, labelled with units'] },
      { criterion: 'Explanation of the rise', marks: 8, levels: ['Missing', 'Partly correct', 'More oxygen to muscles and CO₂ removed faster, so the heart beats faster'] },
      { criterion: 'Recovery and fitness', marks: 5, levels: ['Missing', 'Vague', 'Recovery linked to fitness'] },
    ],
    teacherNotes: ['Typical resting rates are 60 to 100 beats per minute. Fitter learners usually have lower resting rates and recover faster.'],
  },
  {
    id: 'ls-g11-t1-prac',
    subjectId: 'life-sciences',
    grade: 11,
    term: 1,
    kind: 'Practical task',
    topicId: 'life-sci-biodiversity-microorganisms',
    title: 'Growing mould on bread',
    time: 'Set up in one lesson, observed over 7 days',
    intro: 'You will investigate how moisture and temperature affect the growth of mould (a fungus) on bread.',
    materials: ['Four slices of the same bread (without preservatives if possible)', 'Four sealable plastic bags', 'Water spray', 'Labels'],
    safety: ['Keep the bags sealed. Do not open or smell them: mould spores can cause allergies. Dispose of the bags sealed.'],
    steps: [
      'Write an investigative question, hypothesis and variables.',
      'Prepare four bags: dry bread at room temperature, moist bread at room temperature, dry bread in a fridge, and moist bread in a fridge.',
      'Observe every day for seven days, estimating the percentage of each slice covered by mould.',
      'Record your results in a table and draw a bar graph for day 7.',
      'Explain your results.',
      'Name the kingdom that mould belongs to and describe two ways fungi are useful to people.',
    ],
    handIn: ['Question, hypothesis and variables', 'Table and bar graph', 'Explanation and answers'],
    rubric: [
      { criterion: 'Planning: question, hypothesis, variables', marks: 8, levels: ['Missing', 'Partly correct', 'All correct and testable'] },
      { criterion: 'Observations over time', marks: 8, levels: ['Incomplete', 'Some days missing', 'All seven days recorded'] },
      { criterion: 'Bar graph', marks: 6, levels: ['Missing', 'Plotted with errors', 'Accurate, titled and labelled'] },
      { criterion: 'Explanation', marks: 8, levels: ['Missing', 'Partly supported', 'Moisture and warmth favour growth, supported by the data'] },
      { criterion: 'Kingdom and uses', marks: 5, levels: ['Missing', 'Partly correct', 'Fungi; two correct uses such as bread-making and antibiotics'] },
    ],
    teacherNotes: ['Moist bread at room temperature should grow mould fastest; dry bread in the fridge slowest. Emphasise that the bags stay sealed.'],
  },
  {
    id: 'ls-g11-t3-prac',
    subjectId: 'life-sciences',
    grade: 11,
    term: 3,
    kind: 'Practical task',
    topicId: 'life-sci-respiration',
    title: 'Temperature and fermentation in yeast',
    time: 'One double period',
    intro: 'You will investigate how temperature affects the rate of anaerobic respiration (fermentation) in yeast by measuring the carbon dioxide it produces.',
    materials: ['Dried yeast', 'Sugar', 'Four test tubes or bottles with balloons', 'Water baths at about 10 °C, 25 °C, 40 °C and 60 °C', 'Thermometer and string or ruler'],
    steps: [
      'Write the investigative question, hypothesis and variables.',
      'Mix equal amounts of yeast, sugar and warm water in each container and cover each with a balloon.',
      'Place one container in each water bath.',
      'After 20 minutes, measure the circumference of each balloon.',
      'Record the results in a table and draw a graph of balloon size against temperature.',
      'Explain the results, including why there is little gas at 60 °C.',
      'Write the word equation for alcoholic fermentation.',
    ],
    handIn: ['Planning', 'Table and graph', 'Explanation and equation'],
    rubric: [
      { criterion: 'Planning', marks: 6, levels: ['Missing', 'Partly correct', 'All correct, with the controlled variables'] },
      { criterion: 'Results table', marks: 5, levels: ['Incomplete', 'Complete, units missing', 'Complete with units'] },
      { criterion: 'Graph', marks: 7, levels: ['Missing', 'Plotted with errors', 'Accurate and labelled'] },
      { criterion: 'Explanation', marks: 8, levels: ['Missing', 'Partly correct', 'Enzyme activity rises to an optimum; enzymes denature at 60 °C'] },
      { criterion: 'Equation', marks: 4, levels: ['Missing', 'Partly correct', 'Glucose → ethanol + carbon dioxide + energy'] },
    ],
    teacherNotes: ['Most gas is usually produced around 35 °C to 40 °C. At 60 °C yeast enzymes denature and little gas forms.'],
  },
  {
    id: 'ls-g12-t1-prac',
    subjectId: 'life-sciences',
    grade: 12,
    term: 1,
    kind: 'Practical task',
    topicId: 'life-sci-meiosis',
    title: 'Modelling meiosis',
    time: 'One double period',
    intro: 'You will model meiosis with coloured paper chromosomes to see how crossing over and independent assortment produce variation in gametes.',
    materials: ['Coloured paper strips in two colours (maternal and paternal)', 'Scissors, glue, A3 paper'],
    steps: [
      'Make two pairs of homologous chromosomes, each chromosome with two chromatids, one colour from each parent. Mark two genes on each.',
      'Show and label crossing over in prophase I by swapping matching segments between non-sister chromatids.',
      'Arrange the pairs on the equator for metaphase I in two different ways, and show the cells produced by each arrangement.',
      'Complete meiosis II for one arrangement and paste the four gametes.',
      'List the different gametes you obtained.',
      'Explain how crossing over and independent assortment each increase variation.',
      'Explain what would happen to the chromosome number if gametes were made by mitosis.',
    ],
    handIn: ['Labelled model on A3', 'Answers to the questions'],
    rubric: [
      { criterion: 'Chromosome model', marks: 6, levels: ['Incorrect', 'Partly correct', 'Homologous pairs with chromatids and genes, correctly built'] },
      { criterion: 'Crossing over', marks: 8, levels: ['Missing', 'Shown, not labelled', 'Shown and labelled between non-sister chromatids'] },
      { criterion: 'Independent assortment', marks: 8, levels: ['Missing', 'One arrangement', 'Two arrangements and their products'] },
      { criterion: 'Meiosis II and gametes', marks: 6, levels: ['Missing', 'Partly correct', 'Four haploid gametes shown'] },
      { criterion: 'Explanations', marks: 12, levels: ['Missing', 'Partly correct', 'Both sources of variation and the chromosome number explained'] },
    ],
    teacherNotes: ['Gametes must be haploid. If gametes were made by mitosis, the chromosome number would double every generation.'],
  },
  {
    id: 'ls-g12-t3-prac',
    subjectId: 'life-sciences',
    grade: 12,
    term: 3,
    kind: 'Practical task',
    topicId: 'life-sci-genetics',
    title: 'Testing Mendel’s ratios with coins',
    time: 'One double period',
    intro: 'You will use coin tosses to model a monohybrid cross between two heterozygous parents and compare your results with the ratio Mendel predicted.',
    materials: ['Two coins per pair of learners (heads = dominant allele T, tails = recessive allele t)'],
    steps: [
      'Draw the Punnett square for the cross Tt × Tt and state the expected genotype and phenotype ratios.',
      'Toss both coins together 100 times and record each genotype (TT, Tt or tt).',
      'Combine your results with the class results.',
      'Calculate the observed genotype and phenotype ratios for your pair and for the class.',
      'Compare them with the expected ratios. Which is closer, and why?',
      'Explain how the coin model represents the separation of alleles in meiosis and random fertilisation.',
    ],
    handIn: ['Punnett square', 'Tables of pair and class results', 'Comparison and explanation'],
    rubric: [
      { criterion: 'Punnett square and expected ratios', marks: 8, levels: ['Wrong', 'Square correct, ratios wrong', '1 TT : 2 Tt : 1 tt and 3 tall : 1 short'] },
      { criterion: 'Results tables', marks: 8, levels: ['Incomplete', 'Pair data only', 'Pair and class data recorded'] },
      { criterion: 'Observed ratios', marks: 8, levels: ['Missing', 'Calculated with errors', 'Correct for pair and class'] },
      { criterion: 'Comparison with sample size', marks: 8, levels: ['Missing', 'Compared without reasons', 'Class closer because the sample is larger'] },
      { criterion: 'Link to meiosis and fertilisation', marks: 8, levels: ['Missing', 'Partly correct', 'Each coin a gamete, alleles separate in meiosis, random fertilisation'] },
    ],
    teacherNotes: ['The class total should be closer to 1 : 2 : 1 than a single pair’s 100 tosses: larger samples reduce the effect of chance.'],
  },
]

export const taskSheetFor = (subjectId: string, grade: Grade, term: number, kind?: SheetKind) =>
  taskSheets.find((s) => s.subjectId === subjectId && s.grade === grade && s.term === term && (!kind || s.kind === kind))
