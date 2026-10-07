/**
 * Mathematical Literacy questions for the sub-topics the lesson plans found
 * empty at Grades 10 and 11.
 *
 * WHY THIS FILE EXISTS. The lesson plans give every CAPS sub-topic in an ATP
 * week its share of the lessons, and fill each lesson's classwork from the
 * questions filed under that sub-topic at that grade. check:lesson-plans
 * reported lessons with no classwork at all, and every one traced back to a
 * sub-topic that Grade 12 covers well and Grades 10 and 11 hardly at all:
 *
 *   Taxation (VAT and UIF), Grade 10 -- 3 questions against 126 at Grade 12.
 *   Models, assembly diagrams and instructions, Grades 10 and 11 -- 2 each.
 *   Collecting and organising data, Grade 11 -- 1.
 *   Time, temperature and reading instruments, Grade 11 -- 1.
 *   Exchange rates and inflation, Grade 11 -- 3.
 *   Financial documents: payslips, bills and statements, Grade 11 -- 1.
 *
 * WORDING. Each question is filed by the rules in subtopics.ts, which read its
 * words, so each one is worded the way that sub-topic is actually examined --
 * a payslip question says "payslip" and "deductions" -- and avoids the words
 * an earlier rule claims. A payslip question here never says "tax", because
 * the taxation rule would take it, even though a real payslip would show it.
 *
 * NUMBERS. Every figure is computed from values declared once, so a prompt
 * and its answer cannot disagree. VAT is 15%, and UIF is 1% of gross pay from
 * the worker and 1% from the employer, on earnings below the UIF ceiling.
 */
import type { Question } from '@/types'
import { rands } from '@/data/taxTables'

/** A number the way a South African paper prints it: spaced thousands, decimal comma. */
const sa = (n: number, dp = 2): string => {
  const r = Math.round(n * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(r).split('.')
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}

const VAT = 0.15
const UIF = 0.01

/** A 24-hour time from minutes after midnight. */
const hhmm = (mins: number) => {
  const m = ((mins % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

const out: Question[] = []

/* ===================================================================== */
/* Taxation: VAT and UIF, Grade 10                                        */
/* ===================================================================== */

const tax10 = { topicId: 'finance', grade: 10 } as const
// UIF is new in Grade 11 (WCED ATP 2026, Grade 11 Term 2 Finance), so the UIF
// questions below are Grade 11 even though they sit with the Grade 10 VAT work.
const uif11 = { topicId: 'finance', grade: 11 } as const

{
  const price = 95
  const vat = price * VAT
  out.push({
    ...tax10,
    id: 'lg-ml10-vat-cement',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: `VAT in South Africa is charged at 15%. A bag of cement costs ${rands(price)} before VAT. Calculate the VAT on one bag.`,
    answer: rands(vat),
    explanation: `VAT = 15% × ${rands(price)} = 0,15 × ${sa(price)} = ${rands(vat)}. The VAT is only the tax part, not the new price.`,
    memo: [
      { code: 'M', marks: 1, text: `15% × ${rands(price)}` },
      { code: 'A', marks: 1, text: rands(vat) },
    ],
  })
}

{
  const price = 459
  const incl = price * (1 + VAT)
  out.push({
    ...tax10,
    id: 'lg-ml10-vat-kettle',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `A kettle is marked ${rands(price)} excluding VAT. Calculate its price including 15% VAT.`,
    answer: rands(incl),
    explanation: `Price including VAT = ${rands(price)} × 1,15 = ${rands(incl)}. Multiplying by 1,15 adds the 15% in one step; working out ${rands(price * VAT)} and adding it gives the same answer.`,
    memo: [
      { code: 'M', marks: 1, text: `${rands(price)} × 1,15 (or ${rands(price)} + ${rands(price * VAT)})` },
      { code: 'A', marks: 1, text: rands(incl) },
    ],
  })
}

{
  const total = 862.5
  const excl = total / (1 + VAT)
  const vat = total - excl
  out.push({
    ...tax10,
    id: 'lg-ml10-vat-included',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A till slip shows a total of ${rands(total)}, including 15% VAT. Calculate how much of the total is VAT.`,
    answer: rands(vat),
    explanation: `The total is 115% of the price before VAT, so the price before VAT = ${rands(total)} ÷ 1,15 = ${rands(excl)}. The VAT is ${rands(total)} − ${rands(excl)} = ${rands(vat)}. Taking 15% of ${rands(total)} is the common mistake: it takes VAT on the VAT and gives ${rands(total * VAT)}.`,
    memo: [
      { code: 'M', marks: 1, text: `${rands(total)} ÷ 1,15` },
      { code: 'A', marks: 1, text: `${rands(excl)} before VAT` },
      { code: 'CA', marks: 1, text: `VAT = ${rands(vat)}` },
    ],
  })
}

out.push({
  ...tax10,
  id: 'lg-ml10-vat-zero-rated',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 3,
  prompt: 'Some basic foods are zero-rated for VAT in South Africa. Name TWO zero-rated foods, and explain why the government zero-rates them.',
  answer:
    'Any two of: brown bread, maize meal, samp, rice, dried beans, lentils, eggs, milk, fresh fruit and vegetables, vegetable oil, tinned pilchards. They are zero-rated so that the poorest households, who spend most of their income on these foods, do not pay VAT on them.',
  explanation:
    'Zero-rated means VAT is charged at 0%, so the shelf price has no VAT in it. The list is kept to basic foods that most households need, which is why luxuries such as cold drinks and sweets are not on it.',
  memo: [
    { code: 'A', marks: 1, text: 'First zero-rated food' },
    { code: 'A', marks: 1, text: 'Second zero-rated food' },
    { code: 'J', marks: 1, text: 'Keeps basic food affordable for poor households' },
  ],
})

{
  const gross = 8450
  const uif = gross * UIF
  out.push({
    ...uif11,
    id: 'lg-ml10-uif-monthly',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `Workers contribute 1% of their gross salary to the Unemployment Insurance Fund (UIF). Lerato earns a gross salary of ${rands(gross)} a month. Calculate her monthly UIF contribution.`,
    answer: rands(uif),
    explanation: `UIF = 1% × ${rands(gross)} = ${rands(uif)}. It is worked out on the gross salary, before anything else is deducted.`,
    memo: [
      { code: 'M', marks: 1, text: `1% × ${rands(gross)}` },
      { code: 'A', marks: 1, text: rands(uif) },
    ],
  })
}

{
  const gross = 6200
  const each = gross * UIF
  const year = each * 2 * 12
  out.push({
    ...uif11,
    id: 'lg-ml10-uif-year',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Sipho earns a gross salary of ${rands(gross)} a month. He pays 1% of it to UIF, and his employer pays another 1%. Calculate the total paid into UIF for Sipho in one year.`,
    answer: rands(year),
    explanation: `Sipho pays 1% × ${rands(gross)} = ${rands(each)} a month, and his employer pays the same, so ${rands(each * 2)} a month goes in. Over 12 months that is ${rands(each * 2)} × 12 = ${rands(year)}.`,
    memo: [
      { code: 'M', marks: 1, text: `1% × ${rands(gross)} = ${rands(each)}` },
      { code: 'M', marks: 1, text: `Doubled for the employer and × 12` },
      { code: 'A', marks: 1, text: rands(year) },
    ],
  })
}

out.push({
  ...uif11,
  id: 'lg-ml10-uif-meaning',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'What does UIF stand for, and give ONE situation in which a worker can claim from it.',
  answer:
    'Unemployment Insurance Fund. A worker can claim when they lose their job through retrenchment or dismissal, when they are on maternity or adoption leave, or when they are too ill to work; their dependants can claim if they die.',
  explanation:
    'UIF is insurance: every worker and employer pays in a little each month so that a worker has some income while they are out of work. A worker who resigns cannot normally claim unemployment benefits.',
  memo: [
    { code: 'A', marks: 1, text: 'Unemployment Insurance Fund' },
    { code: 'A', marks: 1, text: 'A valid situation, e.g. retrenchment or maternity leave' },
  ],
})

{
  const paid = 2300
  const excl = paid / (1 + VAT)
  const vat = paid - excl
  out.push({
    ...tax10,
    id: 'lg-ml10-vat-spaza',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `A spaza shop owner who is not registered for VAT buys stock for ${rands(paid)}, including VAT, from a wholesaler. He says that because he is not registered, he pays no VAT on his stock. Is he correct? Show how much VAT he paid, and explain.`,
    answer: `No. The price of ${rands(paid)} already includes VAT of ${rands(vat)} (the stock is worth ${rands(excl)} before VAT). He pays it like any customer; a business that is not registered simply cannot claim it back from SARS.`,
    explanation: `VAT is charged by the seller, the wholesaler, who is registered. VAT in the price = ${rands(paid)} − ${rands(paid)} ÷ 1,15 = ${rands(paid)} − ${rands(excl)} = ${rands(vat)}. Registration decides whether a business charges VAT on its own sales and claims back what it paid; it does not stop it paying VAT when it buys.`,
    memo: [
      { code: 'M', marks: 1, text: `${rands(paid)} ÷ 1,15 = ${rands(excl)}` },
      { code: 'A', marks: 1, text: `VAT = ${rands(vat)}` },
      { code: 'J', marks: 1, text: 'Not correct: VAT is included in the price he pays' },
      { code: 'J', marks: 1, text: 'Being unregistered means he cannot claim it back' },
    ],
  })
}

{
  const a = 320
  const bExcl = 285
  const bIncl = bExcl * (1 + VAT)
  out.push({
    ...tax10,
    id: 'lg-ml10-vat-compare',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Shop A sells a school bag for ${rands(a)}, including VAT. Shop B advertises the same bag for ${rands(bExcl)}, excluding VAT. Which shop is cheaper, and by how much?`,
    answer: `Shop A, by ${rands(bIncl - a)}.`,
    explanation: `Compare like with like: Shop B's price including VAT is ${rands(bExcl)} × 1,15 = ${rands(bIncl)}. That is ${rands(bIncl - a)} more than Shop A's ${rands(a)}, so Shop A is cheaper although its price looks higher.`,
    memo: [
      { code: 'M', marks: 1, text: `${rands(bExcl)} × 1,15` },
      { code: 'A', marks: 1, text: rands(bIncl) },
      { code: 'CA', marks: 1, text: `Shop A cheaper by ${rands(bIncl - a)}` },
    ],
  })
}

/* ===================================================================== */
/* Models, assembly diagrams and instructions, Grade 10                    */
/* ===================================================================== */

const maps10 = { topicId: 'maps-plans', grade: 10 } as const

{
  const parts = { 'side panels': 2, shelves: 4, 'back panel': 1, screws: 16, 'wooden dowels': 8 }
  const total = Object.values(parts).reduce((a, b) => a + b, 0)
  out.push({
    ...maps10,
    id: 'lg-ml10-model-parts',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    context: `The parts list of a flat-pack bookshelf: ${Object.entries(parts)
      .map(([k, v]) => `${v} ${k}`)
      .join(', ')}.`,
    prompt: 'How many pieces are there in the kit altogether?',
    answer: `${total} pieces`,
    explanation: `Add every line of the parts list: ${Object.values(parts).join(' + ')} = ${total}. Checking the parts against the list before starting is the first step of any assembly instruction.`,
    memo: [
      { code: 'RT', marks: 1, text: 'All five quantities read from the list' },
      { code: 'A', marks: 1, text: String(total) },
    ],
  })
}

{
  const kit = 16
  const shelves = 3
  const perShelf = 4
  const back = 2
  const spare = kit - shelves * perShelf - back
  out.push({
    ...maps10,
    id: 'lg-ml10-model-screws',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `The assembly instructions for a cupboard say: Step 3 — fix each of the ${shelves} shelves with ${perShelf} screws. Step 5 — fix the back panel with ${back} screws. The kit contains ${kit} screws. How many screws should be left over?`,
    answer: `${spare} screws`,
    explanation: `Screws used = ${shelves} × ${perShelf} + ${back} = ${shelves * perShelf + back}. Left over = ${kit} − ${shelves * perShelf + back} = ${spare}. Kits usually include a spare or two, so a few left over does not mean a step was missed.`,
    memo: [
      { code: 'M', marks: 1, text: `${shelves} × ${perShelf} + ${back} = ${shelves * perShelf + back}` },
      { code: 'A', marks: 1, text: String(spare) },
    ],
  })
}

{
  const scale = 25
  const model = 20
  const real = (model * scale) / 100
  out.push({
    ...maps10,
    id: 'lg-ml10-model-taxi',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A scale model of a minibus taxi is built to a scale of 1 : ${scale}. The model is ${model} cm long. Calculate the real length of the taxi in metres.`,
    answer: `${sa(real)} m`,
    explanation: `1 : ${scale} means every 1 cm on the model is ${scale} cm in real life. Real length = ${model} × ${scale} = ${model * scale} cm, and ${model * scale} cm ÷ 100 = ${sa(real)} m.`,
    memo: [
      { code: 'M', marks: 1, text: `${model} × ${scale}` },
      { code: 'A', marks: 1, text: `${model * scale} cm` },
      { code: 'C', marks: 1, text: `${sa(real)} m` },
    ],
  })
}

{
  const scale = 50
  const [l, w] = [30, 18]
  const [ml, mw] = [(l * 100) / scale, (w * 100) / scale]
  out.push({
    ...maps10,
    id: 'lg-ml10-model-hall',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `An architect builds a model of a school hall at a scale of 1 : ${scale}. The real hall is ${l} m long and ${w} m wide. Calculate the length and the width of the model in centimetres.`,
    answer: `${ml} cm long and ${mw} cm wide`,
    explanation: `Convert to centimetres first, because the model will be measured in centimetres: ${l} m = ${l * 100} cm and ${w} m = ${w * 100} cm. Then divide by ${scale}: ${l * 100} ÷ ${scale} = ${ml} cm and ${w * 100} ÷ ${scale} = ${mw} cm.`,
    memo: [
      { code: 'C', marks: 1, text: `${l * 100} cm and ${w * 100} cm` },
      { code: 'M', marks: 1, text: `Divided by ${scale}` },
      { code: 'A', marks: 1, text: `${ml} cm` },
      { code: 'A', marks: 1, text: `${mw} cm` },
    ],
  })
}

{
  const [L, W, H] = [15, 8, 4]
  // Laid out as a cross: front, base, back and lid in a column; the two ends beside the base.
  const tall = H + W + H + W
  const wide = H + L + H
  out.push({
    ...maps10,
    id: 'lg-ml10-model-net',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    context: `A closed box for a cellphone must be ${L} cm long, ${W} cm wide and ${H} cm high. It is folded from a net laid out as a cross: the base in the middle, the front and the back attached to its long sides, the two ends attached to its short sides, and the lid attached to the far edge of the back.`,
    prompt: 'Calculate the length and breadth of the smallest rectangle of cardboard that the net of the box can be cut from.',
    answer: `${tall} cm by ${wide} cm`,
    explanation: `Down the column: front (${H} cm) + base (${W} cm) + back (${H} cm) + lid (${W} cm) = ${tall} cm. Across the middle: end (${H} cm) + base (${L} cm) + end (${H} cm) = ${wide} cm. Sketching the net and writing the measurement on each edge is the way to avoid adding the wrong edges.`,
    memo: [
      { code: 'M', marks: 1, text: 'Net sketched, or the edges in each direction identified' },
      { code: 'A', marks: 1, text: `${H} + ${W} + ${H} + ${W} = ${tall} cm` },
      { code: 'A', marks: 1, text: `${H} + ${L} + ${H} = ${wide} cm` },
      { code: 'CA', marks: 1, text: `Rectangle ${tall} cm × ${wide} cm` },
    ],
  })
}

out.push({
  ...maps10,
  id: 'lg-ml10-model-exploded',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Assembly instructions often include an exploded diagram. Explain what an exploded diagram shows and why it helps.',
  answer:
    'It shows all the parts pulled slightly apart but still in their correct positions, often with lines showing where each part goes, so you can see how the parts fit together and in what order.',
  explanation:
    'A photograph of the finished item hides the joins. Separating the parts along the lines they join shows every part and exactly where it fits.',
  memo: [
    { code: 'A', marks: 1, text: 'Parts shown separated but in their positions' },
    { code: 'A', marks: 1, text: 'Shows how and in what order they fit together' },
  ],
})

{
  const start = 14 * 60 + 20
  const mins = 45
  out.push({
    ...maps10,
    id: 'lg-ml10-model-time',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `The instructions for a kit table say: "Two people needed. Assembly time: ${mins} minutes." Tumi and her brother start at ${hhmm(start)}. At what time should they finish?`,
    answer: hhmm(start + mins),
    explanation: `${hhmm(start)} + ${mins} minutes: 40 minutes takes it to 15:00, and the remaining 5 minutes to ${hhmm(start + mins)}.`,
    memo: [
      { code: 'M', marks: 1, text: `${hhmm(start)} + ${mins} min` },
      { code: 'A', marks: 1, text: hhmm(start + mins) },
    ],
  })
}

{
  const [l, w] = [12, 9]
  const [s1, s2] = [50, 40]
  const board = [30, 20]
  const a = [(l * 100) / s1, (w * 100) / s1]
  const b = [(l * 100) / s2, (w * 100) / s2]
  out.push({
    ...maps10,
    id: 'lg-ml10-model-house',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `For a project, Ayanda is building a model of her house, which is ${l} m long and ${w} m wide. The base of the model must fit on a sheet of cardboard ${board[0]} cm by ${board[1]} cm. She plans a scale of 1 : ${s1}; a friend suggests 1 : ${s2} to show more detail. Which scale can she use? Show your calculations.`,
    answer: `At 1 : ${s1} the base is ${sa(a[0])} cm × ${sa(a[1])} cm, which fits. At 1 : ${s2} it is ${sa(b[0])} cm × ${sa(b[1])} cm, and ${sa(b[1])} cm is wider than ${board[1]} cm, so it does not fit. She should use 1 : ${s1}.`,
    explanation: `A larger second number makes a SMALLER model, so 1 : ${s2} gives a bigger model than 1 : ${s1}. Convert the house to centimetres (${l * 100} cm × ${w * 100} cm) and divide by each scale. Both lengths must fit, and the width is the one that fails at 1 : ${s2}.`,
    memo: [
      { code: 'C', marks: 1, text: `${l * 100} cm and ${w * 100} cm` },
      { code: 'A', marks: 1, text: `1 : ${s1}: ${sa(a[0])} cm × ${sa(a[1])} cm` },
      { code: 'A', marks: 1, text: `1 : ${s2}: ${sa(b[0])} cm × ${sa(b[1])} cm` },
      { code: 'J', marks: 1, text: `${sa(b[1])} cm > ${board[1]} cm, so 1 : ${s2} does not fit` },
      { code: 'J', marks: 1, text: `Use 1 : ${s1}` },
    ],
  })
}

/* ===================================================================== */
/* Models, assembly diagrams and instructions, Grade 11                    */
/* ===================================================================== */

const maps11 = { topicId: 'maps-plans', grade: 11 } as const

{
  const scale = 43
  const real = 4.3
  const model = (real * 100) / scale
  out.push({
    ...maps11,
    id: 'lg-ml11-model-car',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `A collector's model car is built to a scale of 1 : ${scale}. The real car is ${sa(real)} m long. Calculate the length of the model in centimetres.`,
    answer: `${sa(model)} cm`,
    explanation: `${sa(real)} m = ${real * 100} cm, and ${real * 100} ÷ ${scale} = ${sa(model)} cm.`,
    memo: [
      { code: 'C', marks: 1, text: `${real * 100} cm` },
      { code: 'A', marks: 1, text: `${sa(model)} cm` },
    ],
  })
}

{
  const model = 12
  const real = 2.4
  const k = (real * 100) / model
  out.push({
    ...maps11,
    id: 'lg-ml11-model-tank-scale',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A model of a water tank is ${model} cm high. The real tank is ${sa(real)} m high. Determine the scale of the model in the form 1 : …`,
    answer: `1 : ${k}`,
    explanation: `Both measurements must be in the same unit before they are compared: ${sa(real)} m = ${real * 100} cm. Then ${model} : ${real * 100} simplifies, by dividing both by ${model}, to 1 : ${k}.`,
    memo: [
      { code: 'C', marks: 1, text: `${real * 100} cm` },
      { code: 'M', marks: 1, text: `${model} : ${real * 100}` },
      { code: 'A', marks: 1, text: `1 : ${k}` },
    ],
  })
}

{
  const side = 9
  const faces = 6 * side * side
  const withFlaps = faces * 1.1
  out.push({
    ...maps11,
    id: 'lg-ml11-model-cube-net',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `The net of a cube-shaped gift box with sides of ${side} cm is cut from cardboard, and the designer adds 10% extra for the glue flaps. Calculate the area of cardboard needed for one box.`,
    answer: `${sa(withFlaps)} cm²`,
    explanation: `A cube's net has 6 square faces: 6 × ${side} × ${side} = ${faces} cm². Adding 10% for the flaps: ${faces} × 1,1 = ${sa(withFlaps)} cm².`,
    memo: [
      { code: 'M', marks: 1, text: `One face: ${side} × ${side} = ${side * side} cm²` },
      { code: 'M', marks: 1, text: `× 6 = ${faces} cm²` },
      { code: 'M', marks: 1, text: '× 1,1 for the flaps' },
      { code: 'A', marks: 1, text: `${sa(withFlaps)} cm²` },
    ],
  })
}

{
  const scale = 500
  const [ml, mw] = [21, 13.6]
  const [rl, rw] = [(ml * scale) / 100, (mw * scale) / 100]
  out.push({
    ...maps11,
    id: 'lg-ml11-model-stadium',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A scale model of a stadium was built at 1 : ${scale}. On the model the pitch is ${sa(ml)} cm long and ${sa(mw)} cm wide. Calculate the real area of the pitch in m².`,
    answer: `${sa(rl * rw)} m²`,
    explanation: `Scale each length, not the area: ${sa(ml)} × ${scale} = ${sa(ml * scale)} cm = ${sa(rl)} m, and ${sa(mw)} × ${scale} = ${sa(mw * scale)} cm = ${sa(rw)} m. Area = ${sa(rl)} × ${sa(rw)} = ${sa(rl * rw)} m².`,
    memo: [
      { code: 'M', marks: 1, text: `Both lengths × ${scale}` },
      { code: 'C', marks: 1, text: `${sa(rl)} m and ${sa(rw)} m` },
      { code: 'M', marks: 1, text: 'Length × width' },
      { code: 'A', marks: 1, text: `${sa(rl * rw)} m²` },
    ],
  })
}

{
  const [a, am, b, bm] = [4, 6, 3, 9]
  const total = a * am + b * bm
  out.push({
    ...maps11,
    id: 'lg-ml11-model-braai-steps',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `The assembly instructions for a braai stand have ${a + b} steps. Steps 1 to ${a} take about ${am} minutes each and steps ${a + 1} to ${a + b} about ${bm} minutes each. How long should the whole assembly take, in hours and minutes?`,
    answer: `${Math.floor(total / 60)} h ${total % 60} min`,
    explanation: `${a} × ${am} + ${b} × ${bm} = ${a * am} + ${b * bm} = ${total} minutes, which is ${Math.floor(total / 60)} hour${Math.floor(total / 60) === 1 ? '' : 's'} and ${total % 60} minutes.`,
    memo: [
      { code: 'M', marks: 1, text: `${a} × ${am} + ${b} × ${bm} = ${total} min` },
      { code: 'A', marks: 1, text: `${Math.floor(total / 60)} h ${total % 60} min` },
    ],
  })
}

{
  const scale = 20
  const [l, w] = [4, 3]
  const modelCm2 = ((l * 100) / scale) * ((w * 100) / scale)
  const ratio = (l * w * 10000) / modelCm2
  out.push({
    ...maps11,
    id: 'lg-ml11-model-area-claim',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `A model builder claims that on a 1 : ${scale} scale model every AREA is ${scale} times smaller than the real area. Use a real floor ${l} m by ${w} m to test the claim.`,
    answer: `The claim is wrong. The real floor is ${l * w} m² = ${sa(l * w * 10000)} cm². On the model it is ${(l * 100) / scale} cm × ${(w * 100) / scale} cm = ${modelCm2} cm². ${sa(l * w * 10000)} ÷ ${modelCm2} = ${ratio}, so areas are ${ratio} (= ${scale} × ${scale}) times smaller.`,
    explanation: `A scale applies to lengths. An area is a length times a length, so both are ${scale} times smaller and the area is ${scale}² = ${ratio} times smaller. Converting both areas to the same unit before dividing is essential.`,
    memo: [
      { code: 'M', marks: 1, text: `Model: ${(l * 100) / scale} cm × ${(w * 100) / scale} cm` },
      { code: 'A', marks: 1, text: `${modelCm2} cm² and ${sa(l * w * 10000)} cm²` },
      { code: 'CA', marks: 1, text: `Ratio ${ratio}` },
      { code: 'J', marks: 1, text: `Claim wrong: areas are ${scale}² times smaller` },
    ],
  })
}

out.push({
  ...maps11,
  id: 'lg-ml11-model-prototype',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Give TWO reasons why a company builds a prototype (a working model) of a new product before it starts manufacturing.',
  answer:
    'Any two of: to test that the design works; to find and fix problems before spending money on production; to check its size, look and ease of use; to show it to customers or investors for feedback; to work out the materials and costs.',
  explanation: 'Changing a design on a prototype is cheap; changing it after thousands have been made is not.',
  memo: [
    { code: 'A', marks: 1, text: 'First valid reason' },
    { code: 'A', marks: 1, text: 'Second valid reason' },
  ],
})

{
  const [doors, hinges, screws, kit] = [4, 3, 4, 64]
  const used = doors * hinges * screws
  out.push({
    ...maps11,
    id: 'lg-ml11-model-wardrobe',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A flat-pack wardrobe has ${doors} doors. The instructions say each door hangs on ${hinges} hinges, and each hinge is fixed with ${screws} screws. The parts list includes ${kit} screws. How many screws are left for the rest of the assembly?`,
    answer: `${kit - used} screws`,
    explanation: `Hinges = ${doors} × ${hinges} = ${doors * hinges}; screws for them = ${doors * hinges} × ${screws} = ${used}. Left = ${kit} − ${used} = ${kit - used}.`,
    memo: [
      { code: 'M', marks: 1, text: `${doors} × ${hinges} = ${doors * hinges} hinges` },
      { code: 'A', marks: 1, text: `${used} screws for the doors` },
      { code: 'CA', marks: 1, text: `${kit - used} left` },
    ],
  })
}

/* ===================================================================== */
/* Collecting and organising data, Grade 11                               */
/* ===================================================================== */

const data11 = { topicId: 'data-handling', grade: 11 } as const

out.push({
  ...data11,
  id: 'lg-ml11-data-pop-sample',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'In a survey of Grade 11 learners at a school, explain the difference between the population and a sample.',
  answer:
    'The population is every Grade 11 learner at the school, the whole group the survey is about. A sample is the smaller group of those learners who are actually asked.',
  explanation: 'A sample is used when asking everyone would take too long or cost too much; its answers are used to say something about the whole population.',
  memo: [
    { code: 'A', marks: 1, text: 'Population: the whole group being studied' },
    { code: 'A', marks: 1, text: 'Sample: the part of it that is surveyed' },
  ],
})

out.push({
  ...data11,
  id: 'lg-ml11-data-discrete',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 3,
  prompt: 'Classify each as discrete or continuous data: (a) the number of learners in each class; (b) the time taken to run 100 m; (c) the mass of each learner\'s school bag.',
  answer: '(a) discrete; (b) continuous; (c) continuous.',
  explanation: 'Discrete data is counted and can only take separate values — you cannot have 32,5 learners. Continuous data is measured and can take any value in a range, limited only by how precisely you measure it.',
  memo: [
    { code: 'A', marks: 1, text: '(a) discrete' },
    { code: 'A', marks: 1, text: '(b) continuous' },
    { code: 'A', marks: 1, text: '(c) continuous' },
  ],
})

out.push({
  ...data11,
  id: 'lg-ml11-data-leading-question',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 3,
  prompt: 'A questionnaire about the school tuck shop asks: "Don\'t you agree that the tuck shop\'s prices are far too high?" Explain what is wrong with this question, and rewrite it so that it is fair.',
  answer:
    'It is a leading question: it tells the learner what answer is expected and pushes them to agree. A fair version: "How would you rate the tuck shop\'s prices? Too high / About right / Too low."',
  explanation: 'Survey questions should be neutral and offer every possible answer, so the results show what people really think rather than what the question suggested.',
  memo: [
    { code: 'A', marks: 1, text: 'Leading: suggests the expected answer' },
    { code: 'J', marks: 1, text: 'Pushes people to agree, so the results are not trustworthy' },
    { code: 'A', marks: 1, text: 'Neutral rewrite with a choice of answers' },
  ],
})

{
  const heights = [12, 15, 9, 21, 18, 11, 24, 16, 13, 19, 8, 22]
  const classes: [number, number][] = [
    [5, 9],
    [10, 14],
    [15, 19],
    [20, 24],
  ]
  const counts = classes.map(([lo, hi]) => heights.filter((h) => h >= lo && h <= hi).length)
  out.push({
    ...data11,
    id: 'lg-ml11-data-class-intervals',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `The heights (in cm) of ${heights.length} seedlings, collected for a science project: ${heights.join('; ')}.`,
    prompt: `Organise the heights into the class intervals ${classes.map(([a, b]) => `${a}–${b}`).join(', ')}, and give the number of seedlings in each.`,
    answer: classes.map(([a, b], i) => `${a}–${b}: ${counts[i]}`).join('; '),
    explanation: `Go through the list once, placing each height in its interval, and cross it off as you go. Check the counts add up to the number of seedlings: ${counts.join(' + ')} = ${heights.length}.`,
    memo: counts.map((c, i) => ({ code: 'A' as const, marks: 1, text: `${classes[i][0]}–${classes[i][1]}: ${c}` })),
  })
}

out.push({
  ...data11,
  id: 'lg-ml11-data-methods',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'A school wants to know how its learners travel to school each day. Describe TWO different ways it could collect this data.',
  answer:
    'Any two of: a questionnaire handed to every class; interviewing a group of learners; observing and counting at the gate one morning (walking, taxi, bus, car); asking class teachers to take a show of hands.',
  explanation: 'Questionnaires reach many people quickly; interviews allow follow-up questions; observation records what people actually do rather than what they say.',
  memo: [
    { code: 'A', marks: 1, text: 'First valid method' },
    { code: 'A', marks: 1, text: 'Second valid method' },
  ],
})

{
  const households = 8400
  const every = 40
  out.push({
    ...data11,
    id: 'lg-ml11-data-sample-size',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A municipality wants to survey a town of ${sa(households, 0)} households about their water supply. It will visit 1 in every ${every} households. How many households will be in the sample, and give ONE reason for using a sample rather than the whole population.`,
    answer: `${sa(households / every, 0)} households. Visiting every household would take too long and cost too much; a well-chosen sample gives a good picture more quickly and cheaply.`,
    explanation: `${sa(households, 0)} ÷ ${every} = ${households / every}. Choosing every ${every}th household on a list spreads the sample across the whole town.`,
    memo: [
      { code: 'M', marks: 1, text: `${sa(households, 0)} ÷ ${every}` },
      { code: 'A', marks: 1, text: String(households / every) },
      { code: 'J', marks: 1, text: 'Saves time and money' },
    ],
  })
}

out.push({
  ...data11,
  id: 'lg-ml11-data-sampling-flaw',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 4,
  prompt: 'A cellphone company surveys only people who walk into its shop in one mall on a weekday morning, and concludes that most South Africans prefer its network. Give TWO reasons why the way this data was collected makes the conclusion unreliable, and suggest how the sample could be improved.',
  answer:
    'People who walk into that company\'s shop are more likely to be its customers already; one mall in one area does not reflect the whole country; weekday-morning shoppers leave out people at work or school. Improve it by surveying people in many places across the country, at different times, and not only in the company\'s own shop.',
  explanation: 'A conclusion about "most South Africans" needs a sample drawn from all kinds of South Africans. Where and when the data is collected decides who can be in the sample.',
  memo: [
    { code: 'J', marks: 1, text: 'Shoppers there are likely already its customers' },
    { code: 'J', marks: 1, text: 'One place or one time of day is not the whole country' },
    { code: 'A', marks: 1, text: 'Sample from many places' },
    { code: 'A', marks: 1, text: 'At different times, not only at its own shop' },
  ],
})

out.push({
  ...data11,
  id: 'lg-ml11-data-grouped-census',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'Census reports often give people\'s ages as grouped data, for example 15–19, 20–24 and 25–29. Give TWO reasons why ages are grouped like this.',
  answer:
    'Any two of: there are too many different ages to list each one separately; grouping makes the data easier to read and summarise; it shows the overall pattern more clearly; it protects people\'s privacy.',
  explanation: 'Grouping loses the exact values but makes a very large data set manageable.',
  memo: [
    { code: 'A', marks: 1, text: 'First valid reason' },
    { code: 'A', marks: 1, text: 'Second valid reason' },
  ],
})

/* ===================================================================== */
/* Time, temperature and reading instruments, Grade 11                   */
/* ===================================================================== */

const meas11 = { topicId: 'measurement', grade: 11 } as const

{
  const f = 392
  const c = (f - 32) / 1.8
  out.push({
    ...meas11,
    id: 'lg-ml11-time-oven-f',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `An American recipe says to bake at ${f} °F. Convert this to °C using °C = (°F − 32) ÷ 1,8.`,
    answer: `${sa(c)} °C`,
    explanation: `Subtract first, then divide: (${f} − 32) ÷ 1,8 = ${f - 32} ÷ 1,8 = ${sa(c)} °C. Dividing before subtracting is the usual error.`,
    memo: [
      { code: 'SF', marks: 1, text: `(${f} − 32) ÷ 1,8` },
      { code: 'A', marks: 1, text: `${sa(c)} °C` },
    ],
  })
}

{
  const [lo, hi] = [-6, 13]
  out.push({
    ...meas11,
    id: 'lg-ml11-time-sutherland',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `In Sutherland the temperature at 06:00 was ${sa(lo)} °C, and by 14:00 it had risen to ${hi} °C. By how many degrees did the temperature rise?`,
    answer: `${hi - lo} °C`,
    explanation: `From ${sa(lo)} °C up to 0 °C is ${-lo} degrees, and from 0 °C up to ${hi} °C is ${hi} more: ${-lo} + ${hi} = ${hi - lo}. Equivalently, ${hi} − (${sa(lo)}) = ${hi - lo}.`,
    memo: [
      { code: 'M', marks: 1, text: `${hi} − (${sa(lo)})` },
      { code: 'A', marks: 1, text: `${hi - lo} °C` },
    ],
  })
}

{
  const dep = 21 * 60 + 45
  const arr = 5 * 60 + 20
  const dur = arr + 1440 - dep
  out.push({
    ...meas11,
    id: 'lg-ml11-time-overnight-bus',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `An overnight bus leaves Durban at ${hhmm(dep)} and arrives in Johannesburg at ${hhmm(arr)} the next morning. Calculate the time taken for the journey in hours and minutes.`,
    answer: `${Math.floor(dur / 60)} h ${dur % 60} min`,
    explanation: `Split it at midnight: ${hhmm(dep)} to 00:00 is ${Math.floor((1440 - dep) / 60)} h ${(1440 - dep) % 60} min, and 00:00 to ${hhmm(arr)} is ${Math.floor(arr / 60)} h ${arr % 60} min. Together: ${Math.floor(dur / 60)} h ${dur % 60} min.`,
    memo: [
      { code: 'M', marks: 1, text: 'Split at midnight (or add 24 h to the arrival)' },
      { code: 'A', marks: 1, text: `${Math.floor((1440 - dep) / 60)} h ${(1440 - dep) % 60} min and ${Math.floor(arr / 60)} h ${arr % 60} min` },
      { code: 'CA', marks: 1, text: `${Math.floor(dur / 60)} h ${dur % 60} min` },
    ],
  })
}

out.push({
  ...meas11,
  id: 'lg-ml11-time-12-24',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'Write 7:35 p.m. in 24-hour time, and write 04:10 in 12-hour time.',
  answer: '19:35, and 4:10 a.m.',
  explanation: 'For p.m. times add 12 to the hour (7 + 12 = 19). A 24-hour time before 12:00 is a.m., and the hour stays the same.',
  memo: [
    { code: 'A', marks: 1, text: '19:35' },
    { code: 'A', marks: 1, text: '4:10 a.m.' },
  ],
})

out.push({
  ...meas11,
  id: 'lg-ml11-time-measuring-jug',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'A measuring jug has a long line at every 500 ml and small lines marked every 50 ml in between. The liquid is three small lines above the 500 ml line. What is the reading?',
  answer: '650 ml',
  explanation: 'First work out what one small division is worth (50 ml), then count: 500 + 3 × 50 = 650 ml. Read with your eye level with the surface of the liquid.',
  memo: [
    { code: 'M', marks: 1, text: '500 + 3 × 50' },
    { code: 'A', marks: 1, text: '650 ml' },
  ],
})

out.push({
  ...meas11,
  id: 'lg-ml11-time-zones',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 3,
  prompt: 'South Africa is on UTC+2. Using the time zone differences, what time is it in London in summer (UTC+1) and in Perth, Australia (UTC+8) when it is 15:00 in South Africa?',
  answer: 'London 14:00; Perth 21:00.',
  explanation: 'London is 1 hour behind South Africa (2 − 1), so subtract 1 hour. Perth is 6 hours ahead (8 − 2), so add 6 hours. A place with a bigger UTC number is further ahead.',
  memo: [
    { code: 'M', marks: 1, text: 'Differences: −1 h and +6 h' },
    { code: 'A', marks: 1, text: 'London 14:00' },
    { code: 'A', marks: 1, text: 'Perth 21:00' },
  ],
})

{
  const serve = 18 * 60 + 30
  const bake = 75
  const stand = 20
  const c = 180
  out.push({
    ...meas11,
    id: 'lg-ml11-time-cake',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A recipe says: bake at ${c} °C for 1 hour 15 minutes, then leave to stand for ${stand} minutes. Nomsa wants to serve the cake at ${hhmm(serve)}. (a) What is the latest time she can put it in the oven? (b) Her oven dial is marked in °F. Convert ${c} °C using °F = 1,8 × °C + 32.`,
    answer: `(a) ${hhmm(serve - bake - stand)}; (b) ${sa(1.8 * c + 32)} °F`,
    explanation: `(a) Work backwards: 1 h 15 min + ${stand} min = 1 h 35 min, and ${hhmm(serve)} − 1 h 35 min = ${hhmm(serve - bake - stand)}. (b) 1,8 × ${c} + 32 = ${sa(1.8 * c)} + 32 = ${sa(1.8 * c + 32)} °F.`,
    memo: [
      { code: 'M', marks: 1, text: 'Total time 1 h 35 min, subtracted' },
      { code: 'A', marks: 1, text: hhmm(serve - bake - stand) },
      { code: 'SF', marks: 1, text: `1,8 × ${c} + 32` },
      { code: 'A', marks: 1, text: `${sa(1.8 * c + 32)} °F` },
    ],
  })
}

out.push({
  ...meas11,
  id: 'lg-ml11-time-vaccine-fridge',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 3,
  context: 'Vaccines at a clinic must be kept between 2 °C and 8 °C. The fridge thermometer was read every 4 hours: 06:00 — 4 °C; 10:00 — 6 °C; 14:00 — 9 °C; 18:00 — 7 °C; 22:00 — 3 °C.',
  prompt: 'Was the fridge safe for the vaccines all day? Explain, and state the longest time the temperature could have been out of range, judging from these readings alone.',
  answer:
    'No. At 14:00 the temperature was 9 °C, above the 8 °C limit. It was within range at 10:00 and again at 18:00, so it could have been out of range for up to 8 hours, between 10:00 and 18:00.',
  explanation:
    'Readings only show the temperature at those moments. All we know is that it was fine at 10:00, too warm at 14:00 and fine again at 18:00 — so the problem lasted somewhere between a moment and 8 hours. That is why clinics record the temperature more often, or use a thermometer that records the maximum.',
  memo: [
    { code: 'RT', marks: 1, text: '9 °C at 14:00 is above 8 °C' },
    { code: 'J', marks: 1, text: 'Not safe all day' },
    { code: 'A', marks: 1, text: 'Up to 8 hours (10:00 to 18:00)' },
  ],
})

/* ===================================================================== */
/* Exchange rates and inflation, Grade 11                                 */
/* ===================================================================== */

const fin11 = { topicId: 'finance', grade: 11 } as const

{
  const rate = 18.4
  const usd = 250
  out.push({
    ...fin11,
    id: 'lg-ml11-fx-dollars',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `The exchange rate is R${sa(rate)} = 1 US dollar. Convert $${usd} to rand.`,
    answer: rands(usd * rate),
    explanation: `Each dollar is worth R${sa(rate)}, so $${usd} = ${usd} × R${sa(rate)} = ${rands(usd * rate)}.`,
    memo: [
      { code: 'M', marks: 1, text: `${usd} × ${sa(rate)}` },
      { code: 'A', marks: 1, text: rands(usd * rate) },
    ],
  })
}

{
  const perRand = 0.054
  const r = 3000
  out.push({
    ...fin11,
    id: 'lg-ml11-fx-euros',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `A bank's exchange rate is R1 = €${sa(perRand, 3)}. How many euros will R${sa(r, 0)} buy?`,
    answer: `€${sa(r * perRand)}`,
    explanation: `The rate is given per rand, so multiply: ${sa(r, 0)} × ${sa(perRand, 3)} = €${sa(r * perRand)}. If the rate were given per euro you would divide instead.`,
    memo: [
      { code: 'M', marks: 1, text: `${sa(r, 0)} × ${sa(perRand, 3)}` },
      { code: 'A', marks: 1, text: `€${sa(r * perRand)}` },
    ],
  })
}

{
  const gbp = 400
  const rate = 23.1
  const gross = gbp * rate
  const fee = gross * 0.015
  out.push({
    ...fin11,
    id: 'lg-ml11-fx-commission',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A tourist from the UK changes £${gbp} into rand at R${sa(rate)} per pound. The bureau de change charges a commission of 1,5% of the rand amount. How much does she receive after commission?`,
    answer: rands(gross - fee),
    explanation: `£${gbp} × ${sa(rate)} = ${rands(gross)}. Commission = 1,5% × ${rands(gross)} = ${rands(fee)}. She receives ${rands(gross)} − ${rands(fee)} = ${rands(gross - fee)}.`,
    memo: [
      { code: 'M', marks: 1, text: `${gbp} × ${sa(rate)} = ${rands(gross)}` },
      { code: 'A', marks: 1, text: `Commission ${rands(fee)}` },
      { code: 'CA', marks: 1, text: rands(gross - fee) },
    ],
  })
}

{
  const p = 18.5
  const i = 0.06
  const two = p * (1 + i) ** 2
  out.push({
    ...fin11,
    id: 'lg-ml11-infl-bread',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A loaf of bread costs ${rands(p)}. If inflation stays at 6% a year, what will the loaf cost in two years' time?`,
    answer: rands(two),
    explanation: `Inflation compounds: each year's price is 1,06 times the year before. After one year: ${rands(p)} × 1,06 = ${rands(p * (1 + i))}. After two: ${rands(p * (1 + i))} × 1,06 = ${rands(two)}. Adding 12% in one step gives ${rands(p * 1.12)}, which is too little.`,
    memo: [
      { code: 'M', marks: 1, text: `${rands(p)} × 1,06` },
      { code: 'M', marks: 1, text: 'Again × 1,06 (or × 1,06²)' },
      { code: 'A', marks: 1, text: rands(two) },
    ],
  })
}

{
  const [a, b] = [14, 15.4]
  const infl = 5.2
  const pct = ((b - a) / a) * 100
  out.push({
    ...fin11,
    id: 'lg-ml11-infl-taxi-fare',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A taxi fare rose from ${rands(a)} to ${rands(b)} over a year in which inflation was ${sa(infl)}%. Calculate the increase in the fare as a percentage, and say whether the fare rose faster than inflation.`,
    answer: `${sa(pct)}%; yes, faster than the ${sa(infl)}% inflation.`,
    explanation: `Increase = ${rands(b - a)}. As a percentage of the OLD fare: ${rands(b - a)} ÷ ${rands(a)} × 100 = ${sa(pct)}%. ${sa(pct)}% > ${sa(infl)}%, so the fare rose faster than prices in general.`,
    memo: [
      { code: 'M', marks: 1, text: `(${sa(b)} − ${sa(a)}) ÷ ${sa(a)} × 100` },
      { code: 'A', marks: 1, text: `${sa(pct)}%` },
      { code: 'J', marks: 1, text: `Faster, since ${sa(pct)}% > ${sa(infl)}%` },
    ],
  })
}

{
  const [before, after] = [2090, 2190]
  const infl = 4.4
  const kept = before * (1 + infl / 100)
  out.push({
    ...fin11,
    id: 'lg-ml11-infl-grant',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `A pensioner's monthly grant went up from ${rands(before)} to ${rands(after)} in a year when inflation was ${sa(infl)}%. Did the increase keep up with inflation? Show your calculations.`,
    answer: `Yes, just. To keep up, the grant needed to reach ${rands(kept)}; it reached ${rands(after)}, which is ${rands(after - kept)} more.`,
    explanation: `Keeping up with inflation means rising by at least ${sa(infl)}%: ${rands(before)} × ${sa(1 + infl / 100, 3)} = ${rands(kept)}. The actual grant, ${rands(after)}, is above that. As a percentage, the increase was ${sa(((after - before) / before) * 100)}%, which is more than ${sa(infl)}%.`,
    memo: [
      { code: 'M', marks: 1, text: `${rands(before)} × ${sa(1 + infl / 100, 3)}` },
      { code: 'A', marks: 1, text: rands(kept) },
      { code: 'J', marks: 1, text: `${rands(after)} > ${rands(kept)}` },
      { code: 'J', marks: 1, text: 'So it kept up, by a small amount' },
    ],
  })
}

{
  const rate = 17.95
  const [price, ship] = [899, 45]
  out.push({
    ...fin11,
    id: 'lg-ml11-fx-laptop',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A laptop costs $${price} on an overseas website, plus $${ship} for delivery. The exchange rate is R${sa(rate)} per US dollar. Calculate the total cost in rand.`,
    answer: rands((price + ship) * rate),
    explanation: `Total in dollars: $${price} + $${ship} = $${price + ship}. In rand: ${price + ship} × ${sa(rate)} = ${rands((price + ship) * rate)}.`,
    memo: [
      { code: 'M', marks: 1, text: `$${price + ship}` },
      { code: 'M', marks: 1, text: `× ${sa(rate)}` },
      { code: 'A', marks: 1, text: rands((price + ship) * rate) },
    ],
  })
}

/* ===================================================================== */
/* Financial documents: payslips, bills and statements, Grade 11          */
/* ===================================================================== */

{
  const basic = 12400
  const overtime = 1350
  const deductions = { 'medical aid': 1150, 'retirement fund': 780, 'union fees': 95 }
  const gross = basic + overtime
  const ded = Object.values(deductions).reduce((a, b) => a + b, 0)
  const context = `Extract from Thandi's payslip for March. Earnings: basic salary ${rands(basic)}; overtime ${rands(overtime)}. Deductions: ${Object.entries(
    deductions,
  )
    .map(([k, v]) => `${k} ${rands(v)}`)
    .join('; ')}.`

  out.push({
    ...fin11,
    id: 'lg-ml11-doc-payslip-gross',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    context,
    prompt: 'Calculate Thandi\'s gross salary for March.',
    answer: rands(gross),
    explanation: `Gross salary is everything earned before deductions: ${rands(basic)} + ${rands(overtime)} = ${rands(gross)}.`,
    memo: [
      { code: 'RT', marks: 1, text: 'Basic salary and overtime read from the payslip' },
      { code: 'A', marks: 1, text: rands(gross) },
    ],
  })

  out.push({
    ...fin11,
    id: 'lg-ml11-doc-payslip-net',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context,
    prompt: 'Calculate the total deductions on the payslip, and Thandi\'s net salary for March.',
    answer: `Deductions ${rands(ded)}; net salary ${rands(gross - ded)}.`,
    explanation: `Deductions: ${Object.values(deductions)
      .map((v) => rands(v))
      .join(' + ')} = ${rands(ded)}. Net salary = gross − deductions = ${rands(gross)} − ${rands(ded)} = ${rands(gross - ded)}.`,
    memo: [
      { code: 'A', marks: 1, text: `Deductions ${rands(ded)}` },
      { code: 'M', marks: 1, text: 'Gross − deductions' },
      { code: 'CA', marks: 1, text: rands(gross - ded) },
    ],
  })

  out.push({
    ...fin11,
    id: 'lg-ml11-doc-payslip-drop',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 3,
    context,
    prompt: `In April Thandi's net salary on her payslip was ${rands(gross - ded - 245)}, although her basic salary had not changed. Suggest TWO possible reasons, and say which section of the payslip she should check.`,
    answer:
      'Possible reasons: she worked less overtime in April; a deduction went up (for example her medical aid contribution); a new deduction was added (for example a funeral policy). She should compare the earnings and the deductions sections of the two payslips line by line.',
    explanation: 'Net salary changes when either what she earns or what is taken off changes. Since the basic salary is fixed, the difference must be in overtime or other earnings, or in the deductions.',
    memo: [
      { code: 'J', marks: 1, text: 'First valid reason' },
      { code: 'J', marks: 1, text: 'Second valid reason' },
      { code: 'A', marks: 1, text: 'Check the earnings and deductions sections' },
    ],
  })
}

out.push({
  ...fin11,
  id: 'lg-ml11-doc-gross-net',
  difficulty: 'Easy',
  cognitiveLevel: 1,
  marks: 2,
  prompt: 'On a payslip, what is the difference between gross salary and net salary?',
  answer: 'Gross salary is the total earned before any deductions. Net salary is what is actually paid into the worker\'s account after all the deductions have been taken off.',
  explanation: 'Net is always less than gross. It is net salary that a household budget has to be planned around.',
  memo: [
    { code: 'A', marks: 1, text: 'Gross: before deductions' },
    { code: 'A', marks: 1, text: 'Net: after deductions, the amount received' },
  ],
})

{
  const opening = 3420
  const rows: [string, number][] = [
    ['03 Mar debit order: gym', -399],
    ['05 Mar deposit: salary', 9850],
    ['12 Mar card purchase: groceries', -1236.45],
    ['20 Mar ATM withdrawal', -800],
    ['31 Mar bank charges', -68.5],
  ]
  const closing = rows.reduce((b, [, v]) => b + v, opening)
  const debits = rows.filter(([, v]) => v < 0)
  const debitTotal = -debits.reduce((a, [, v]) => a + v, 0)
  const context = `Extract from Kagiso's bank statement for March. Opening balance ${rands(opening)}. ${rows
    .map(([k, v]) => `${k} ${v < 0 ? '−' : '+'}${rands(Math.abs(v))}`)
    .join('; ')}.`

  out.push({
    ...fin11,
    id: 'lg-ml11-doc-statement-closing',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context,
    prompt: 'Calculate the closing balance on the bank statement at the end of March.',
    answer: rands(closing),
    explanation: `Start from the opening balance, add the deposit and subtract every debit: ${rands(opening)} + ${rands(9850)} − ${rands(debitTotal)} = ${rands(closing)}.`,
    memo: [
      { code: 'RT', marks: 1, text: 'All five transactions read correctly' },
      { code: 'M', marks: 1, text: 'Deposit added, debits subtracted, from the opening balance' },
      { code: 'A', marks: 1, text: rands(closing) },
    ],
  })

  out.push({
    ...fin11,
    id: 'lg-ml11-doc-statement-debits',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    context,
    prompt: 'Which transactions on the statement are debits? Calculate the total of the debits, and say what share of the salary deposit they used up, to the nearest whole number.',
    answer: `The gym debit order, the grocery purchase, the ATM withdrawal and the bank charges: ${rands(debitTotal)} in total, about ${Math.round((debitTotal / 9850) * 100)} in every 100 rand of the salary.`,
    explanation: `A debit is money leaving the account. ${debits.map(([, v]) => rands(-v)).join(' + ')} = ${rands(debitTotal)}. ${rands(debitTotal)} ÷ ${rands(9850)} ≈ ${sa(debitTotal / 9850, 3)}, so about ${Math.round((debitTotal / 9850) * 100)} rand in every 100.`,
    memo: [
      { code: 'RT', marks: 1, text: 'The four debits identified' },
      { code: 'A', marks: 1, text: rands(debitTotal) },
      { code: 'CA', marks: 1, text: `About ${Math.round((debitTotal / 9850) * 100)} in every 100` },
    ],
  })
}

{
  const items: [string, number][] = [
    ['2 kg rice', 42.99],
    ['cooking oil', 54.99],
    ['6 eggs', 24.5],
    ['bread', 17.99],
  ]
  const total = items.reduce((a, [, v]) => a + v, 0)
  out.push({
    ...fin11,
    id: 'lg-ml11-doc-till-slip',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: `A till slip lists: ${items.map(([k, v]) => `${k} ${rands(v)}`).join('; ')}. The customer paid with a R200 note. Calculate the total on the slip and the change she should receive.`,
    answer: `Total ${rands(total)}; change ${rands(200 - total)}.`,
    explanation: `${items.map(([, v]) => rands(v)).join(' + ')} = ${rands(total)}. Change = R200,00 − ${rands(total)} = ${rands(200 - total)}. Checking a till slip before leaving the shop catches items rung up twice.`,
    memo: [
      { code: 'A', marks: 1, text: `Total ${rands(total)}` },
      { code: 'CA', marks: 1, text: `Change ${rands(200 - total)}` },
    ],
  })
}

{
  const [hours, rate, parts, callout, deposit] = [3, 420, 685, 350, 500]
  const total = hours * rate + parts + callout
  out.push({
    ...fin11,
    id: 'lg-ml11-doc-invoice',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A plumber's invoice shows ${hours} hours of labour at ${rands(rate)} per hour, parts costing ${rands(parts)} and a call-out charge of ${rands(callout)}. The customer paid a deposit of ${rands(deposit)} before the work started. Calculate the amount still owing on the invoice.`,
    answer: rands(total - deposit),
    explanation: `Labour = ${hours} × ${rands(rate)} = ${rands(hours * rate)}. Invoice total = ${rands(hours * rate)} + ${rands(parts)} + ${rands(callout)} = ${rands(total)}. Still owing = ${rands(total)} − ${rands(deposit)} = ${rands(total - deposit)}.`,
    memo: [
      { code: 'M', marks: 1, text: `${hours} × ${rands(rate)} = ${rands(hours * rate)}` },
      { code: 'A', marks: 1, text: `Invoice total ${rands(total)}` },
      { code: 'CA', marks: 1, text: `${rands(total - deposit)} owing` },
    ],
  })
}

export const matlitLessonGaps = out
