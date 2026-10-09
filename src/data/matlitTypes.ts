/**
 * Mathematical Literacy Finance, Maps and Plans, and Measurement: the
 * examiner question types that report:question-types found thin.
 *
 *   Finance, Grade 10 -- payslips, simple and compound interest, tariffs,
 *     cost price, selling price and profit, budgets, bank statements, till
 *     slips (the Grade 10 plan in atp.ts; inflation, exchange rates and
 *     break-even are Grade 11 and 12 work and stay there).
 *   Finance, Grade 11 -- tariffs with a fixed and a variable part.
 *   Finance, Grade 12 -- percentage increase and decrease.
 *   Maps and plans -- bar scales and grid references in every grade; floor
 *     plans and travel routes in Grade 10.
 *   Measurement -- elapsed time and timetables and scaling a recipe (Grade
 *     10); surface area and BMI (Grade 11).
 *
 * Interest is worked out year by year, never by formula (capsConcepts.ts).
 * Every number in an answer is computed below from the data declared with
 * it, written with a decimal comma, and every question carries an NSC-style
 * marking memo that adds up to its marks.
 */
import type { Grade, Question } from '@/types'

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
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const round2 = (v: number) => Math.round(v * 100) / 100
const hm = (mins: number) => `${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')} min`
const clock = (mins: number) => `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`

const t = (topicId: 'finance' | 'maps-plans' | 'measurement', grade: Grade) => ({ topicId, grade }) as const
const out: Question[] = []

// ================================================================= FINANCE

// --- Grade 10: payslip
{
  const basic = 9800
  const overtimeHours = 6
  const rate = 70
  const overtime = overtimeHours * rate
  const gross = basic + overtime
  const pension = round2(0.075 * basic)
  const medical = 650
  const ded = pension + medical
  const net = gross - ded
  const dedPct = (ded / gross) * 100
  const claim = 15
  const ctx = `|+ PAYSLIP: Ms N. Zulu, shop assistant — March\n| Earnings | Amount |\n|---|---|\n| Basic salary | ${R(basic)} |\n| Overtime: ${overtimeHours} hours at ${R(rate)} per hour | ? |\n\n| Deductions | Amount |\n|---|---|\n| Pension: 7,5% of basic salary | ? |\n| Medical aid | ${R(medical)} |`
  out.push({
    id: 'mlt-g10-payslip-net',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 6,
    context: ctx,
    prompt: 'Calculate Ms Zulu\'s gross salary, her total deductions and her net salary.',
    answer: `Gross ${R(gross)}; deductions ${R(ded)}; net ${R(net)}`,
    explanation: `Overtime = ${overtimeHours} × ${R(rate)} = ${R(overtime)}. Gross = ${R(basic)} + ${R(overtime)} = ${R(gross)}. Pension = 7,5% of the BASIC salary = 0,075 × ${R(basic)} = ${R(pension)} (not 7,5% of the gross). Deductions = ${R(pension)} + ${R(medical)} = ${R(ded)}. Net = ${R(gross)} − ${R(ded)} = ${R(net)}.`,
    memo: [
      { code: 'A', marks: 1, text: `overtime ${R(overtime)}` },
      { code: 'CA', marks: 1, text: `gross ${R(gross)}` },
      { code: 'M', marks: 1, text: '7,5% of the basic salary' },
      { code: 'A', marks: 1, text: `pension ${R(pension)}` },
      { code: 'CA', marks: 1, text: `deductions ${R(ded)}` },
      { code: 'CA', marks: 1, text: `net ${R(net)}` },
    ],
  })
  out.push({
    id: 'mlt-g10-payslip-percentage',
    ...t('finance', 10),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    context: ctx,
    prompt: `Ms Zulu says that "less than ${claim}% of my gross salary is taken off every month". Verify, showing all calculations, whether she is correct.`,
    answer: `${dedPct < claim ? 'She is correct' : 'She is not correct'}: deductions of ${R(ded)} are ${n(dedPct, 1)}% of her gross ${R(gross)}.`,
    explanation: `Gross = ${R(gross)}; deductions = ${R(pension)} + ${R(medical)} = ${R(ded)}. As a percentage: ${n(ded)} ÷ ${n(gross)} × 100 = ${n(dedPct, 1)}%, which is ${dedPct < claim ? 'less' : 'more'} than ${claim}%.`,
    memo: [
      { code: 'A', marks: 1, text: `deductions ${R(ded)} and gross ${R(gross)}` },
      { code: 'M', marks: 1, text: 'deductions ÷ gross × 100' },
      { code: 'A', marks: 1, text: `${n(dedPct, 1)}%` },
      { code: 'C', marks: 1, text: dedPct < claim ? 'she is correct' : 'she is not correct' },
    ],
  })
}

// --- Grade 10: simple and compound interest, year by year
{
  const p = 4000
  const rate = 0.075
  const years = 3
  const si = p * rate
  const simpleTotal = p + si * years
  const rows: string[] = []
  let bal = p
  for (let y = 1; y <= years; y++) {
    const i = round2(bal * rate)
    rows.push(`Year ${y}: ${R(bal)} × 7,5% = ${R(i)}, balance ${R(bal + i)}`)
    bal = round2(bal + i)
  }
  out.push({
    id: 'mlt-g10-simple-interest',
    ...t('finance', 10),
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    context: `Kabelo invests ${R(p)} in a savings account that pays 7,5% simple interest per year.`,
    prompt: `Calculate how much interest he earns each year, and the amount in the account after ${years} years.`,
    answer: `${R(si)} a year; ${R(simpleTotal)} after ${years} years`,
    explanation: `Simple interest is worked out on the original amount every year: 7,5% × ${R(p)} = 0,075 × ${R(p)} = ${R(si)}. Over ${years} years: ${years} × ${R(si)} = ${R(si * years)}. Amount = ${R(p)} + ${R(si * years)} = ${R(simpleTotal)}.`,
    memo: [
      { code: 'A', marks: 1, text: `${R(si)} per year` },
      { code: 'M', marks: 1, text: `${years} × ${R(si)} added to ${R(p)}` },
      { code: 'CA', marks: 1, text: R(simpleTotal) },
    ],
  })
  out.push({
    id: 'mlt-g10-compound-interest',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: `Kabelo's sister invests ${R(p)} at 7,5% per year, compounded annually, for ${years} years. Kabelo invests the same amount at 7,5% simple interest.`,
    prompt: 'Calculate the balance in the sister\'s account after 3 years, working year by year, and determine how much more she has than Kabelo.',
    answer: `${R(bal)}; ${R(bal - simpleTotal)} more than Kabelo's ${R(simpleTotal)}`,
    explanation: `${rows.join('. ')}. Each year's interest is on the NEW balance, so she earns interest on interest. Kabelo has ${R(p)} + 3 × ${R(si)} = ${R(simpleTotal)}. Difference: ${R(bal)} − ${R(simpleTotal)} = ${R(bal - simpleTotal)}.`,
    memo: [
      { code: 'A', marks: 1, text: rows[0] },
      { code: 'CA', marks: 1, text: rows[1] },
      { code: 'CA', marks: 1, text: rows[2] },
      { code: 'A', marks: 1, text: `Kabelo ${R(simpleTotal)}` },
      { code: 'CA', marks: 1, text: `difference ${R(bal - simpleTotal)}` },
    ],
  })
}

// --- Grade 10: tariffs
{
  const fixed = 185
  const perKl = 24.5
  const used = 18
  const total = fixed + perKl * used
  out.push({
    id: 'mlt-g10-tariff-water',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `A municipality charges for water with a fixed basic charge of ${R(fixed)} per month plus ${R(perKl)} for every kilolitre (kℓ) used.`,
    prompt: `Calculate the water bill for a household that used ${used} kℓ in a month, and write down the cost of the water if the household had used no water at all.`,
    answer: `${R(total)}; ${R(fixed)} with no water used`,
    explanation: `Usage: ${used} × ${R(perKl)} = ${R(perKl * used)}. Bill = fixed charge + usage = ${R(fixed)} + ${R(perKl * used)} = ${R(total)}. With no water used, only the fixed charge is paid: ${R(fixed)}.`,
    memo: [
      { code: 'M', marks: 1, text: `${used} × ${R(perKl)}` },
      { code: 'A', marks: 1, text: R(perKl * used) },
      { code: 'CA', marks: 1, text: R(total) },
      { code: 'A', marks: 1, text: `${R(fixed)} (the fixed charge)` },
    ],
  })
  const planA = { fixed: 99, perMin: 0.85 }
  const planB = { fixed: 0, perMin: 1.6 }
  const breakMins = (planA.fixed - planB.fixed) / (planB.perMin - planA.perMin)
  out.push({
    id: 'mlt-g10-tariff-compare',
    ...t('finance', 10),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `Two cellphone options: Option A costs ${R(planA.fixed)} a month plus ${R(planA.perMin)} per minute of calls. Option B has no monthly fee and costs ${R(planB.perMin)} per minute.`,
    prompt: 'Calculate the monthly cost of each option for 100 minutes and for 160 minutes of calls. Determine the number of minutes at which the two options cost the same, and advise someone who talks for about 2 hours a month.',
    answer: `100 min: A ${R(planA.fixed + 100 * planA.perMin)}, B ${R(100 * planB.perMin)}. 160 min: A ${R(planA.fixed + 160 * planA.perMin)}, B ${R(160 * planB.perMin)}. Same cost at ${n(breakMins, 0)} minutes. 2 hours = 120 minutes, below ${n(breakMins, 0)}, so Option B is cheaper.`,
    explanation: `A: ${R(planA.fixed)} + 100 × ${R(planA.perMin)} = ${R(planA.fixed + 100 * planA.perMin)}; B: 100 × ${R(planB.perMin)} = ${R(100 * planB.perMin)}. A: ${R(planA.fixed)} + 160 × ${R(planA.perMin)} = ${R(planA.fixed + 160 * planA.perMin)}; B: 160 × ${R(planB.perMin)} = ${R(160 * planB.perMin)}. Equal when ${planA.fixed} + ${n(planA.perMin)}m = ${n(planB.perMin)}m, so ${planA.fixed} = ${n(planB.perMin - planA.perMin)}m and m = ${n(breakMins, 0)} minutes. At 120 minutes A costs ${R(planA.fixed + 120 * planA.perMin)} and B ${R(120 * planB.perMin)}.`,
    memo: [
      { code: 'A', marks: 1, text: `100 min: A ${R(planA.fixed + 100 * planA.perMin)}, B ${R(100 * planB.perMin)}` },
      { code: 'A', marks: 1, text: `160 min: A ${R(planA.fixed + 160 * planA.perMin)}, B ${R(160 * planB.perMin)}` },
      { code: 'M', marks: 1, text: 'setting the two costs equal (or a table of values)' },
      { code: 'A', marks: 1, text: `${n(breakMins, 0)} minutes` },
      { code: 'M', marks: 1, text: '2 hours = 120 minutes' },
      { code: 'C', marks: 1, text: 'Option B' },
    ],
  })
}

// --- Grade 10: cost price, selling price, profit
{
  const costPerPack = 36
  const packsBought = 40
  const sellEach = 8
  const perPack = 6
  const sold = 210
  const cost = costPerPack * packsBought
  const income = sold * sellEach
  out.push({
    id: 'mlt-g10-profit-tuckshop',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: `A learner runs a tuck shop. She buys ${packsBought} packs of juice at ${R(costPerPack)} a pack; each pack holds ${perPack} bottles. She sells each bottle for ${R(sellEach)} and sells ${sold} bottles in a month.`,
    prompt: 'Calculate her total cost, her income and her profit for the month, and determine the cost price of ONE bottle.',
    answer: `Cost ${R(cost)}; income ${R(income)}; profit ${R(income - cost)}; ${R(costPerPack / perPack)} per bottle`,
    explanation: `Cost = ${packsBought} × ${R(costPerPack)} = ${R(cost)}. Income = ${sold} × ${R(sellEach)} = ${R(income)}. Profit = income − cost = ${R(income)} − ${R(cost)} = ${R(income - cost)}. Cost price of one bottle = ${R(costPerPack)} ÷ ${perPack} = ${R(costPerPack / perPack)}.`,
    memo: [
      { code: 'A', marks: 1, text: `cost ${R(cost)}` },
      { code: 'A', marks: 1, text: `income ${R(income)}` },
      { code: 'M', marks: 1, text: 'income − cost' },
      { code: 'CA', marks: 1, text: `profit ${R(income - cost)}` },
      { code: 'A', marks: 1, text: `${R(costPerPack / perPack)} per bottle` },
    ],
  })
  const markup = 0.35
  const cp = 240
  out.push({
    id: 'mlt-g10-markup',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context: `A clothing stall buys a jacket for ${R(cp)} and adds a mark-up of 35% to get its selling price.`,
    prompt: 'Calculate the selling price of the jacket and the profit the stall makes on it.',
    answer: `Selling price ${R(cp * (1 + markup))}; profit ${R(cp * markup)}`,
    explanation: `Mark-up = 35% of the COST price = 0,35 × ${R(cp)} = ${R(cp * markup)}. Selling price = ${R(cp)} + ${R(cp * markup)} = ${R(cp * (1 + markup))}. The profit on one jacket is the mark-up, ${R(cp * markup)}.`,
    memo: [
      { code: 'M', marks: 1, text: `35% × ${R(cp)}` },
      { code: 'A', marks: 1, text: `profit ${R(cp * markup)}` },
      { code: 'CA', marks: 1, text: `selling price ${R(cp * (1 + markup))}` },
    ],
  })
}

// --- Grade 10: budget and bank statement
{
  const income = 8600
  const items: [string, number][] = [
    ['Rent', 3200],
    ['Food', 2150],
    ['Transport', 980],
    ['Prepaid power', 640],
    ['Cellphone', 299],
    ['Burial society', 180],
  ]
  const exp = sum(items.map(([, a]) => a))
  out.push({
    id: 'mlt-g10-budget-balance',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: `|+ MONTHLY BUDGET: the Mokoena household (income ${R(income)})\n| Expense | Amount |\n|---|---|\n${items.map(([k, a]) => `| ${k} | ${R(a)} |`).join('\n')}`,
    prompt: 'Calculate the total expenses and the balance. Classify rent and prepaid power as fixed or variable expenses, and suggest which expense the family could most easily reduce.',
    answer: `Expenses ${R(exp)}; balance ${R(income - exp)} (a surplus). Rent is fixed; prepaid power is variable. Power or food could be reduced most easily, since they depend on use.`,
    explanation: `Total: ${items.map(([, a]) => n(a)).join(' + ')} = ${R(exp)}. Balance = ${R(income)} − ${R(exp)} = ${R(income - exp)}. Fixed expenses stay the same every month (rent, under a lease); variable ones change with use (prepaid power).`,
    memo: [
      { code: 'A', marks: 1, text: `expenses ${R(exp)}` },
      { code: 'CA', marks: 1, text: `balance ${R(income - exp)}` },
      { code: 'A', marks: 1, text: 'rent: fixed' },
      { code: 'A', marks: 1, text: 'prepaid power: variable' },
      { code: 'J', marks: 1, text: 'a variable expense such as power or food' },
    ],
  })
  const open = 2450.6
  const tx: [string, number][] = [
    ['Salary deposit', 7800],
    ['ATM withdrawal', -1500],
    ['Debit order: insurance', -385],
    ['Card purchase: groceries', -1264.35],
    ['Monthly account fee', -69],
  ]
  let b = open
  const bals = tx.map(([, a]) => (b = round2(b + a)))
  out.push({
    id: 'mlt-g10-bank-statement',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `|+ BANK STATEMENT: opening balance ${R(open)}\n| Transaction | Amount |\n|---|---|\n${tx.map(([k, a]) => `| ${k} | ${a < 0 ? '−' : ''}${R(Math.abs(a))} |`).join('\n')}`,
    prompt: 'Calculate the closing balance, and calculate the total of all the money that went OUT of the account.',
    answer: `Closing balance ${R(bals[bals.length - 1])}; money out ${R(-sum(tx.filter(([, a]) => a < 0).map(([, a]) => a)))}`,
    explanation: `Running balance: ${tx.map(([k], i) => `after ${k.toLowerCase()} ${R(bals[i])}`).join('; ')}. Money out: ${tx.filter(([, a]) => a < 0).map(([, a]) => n(-a)).join(' + ')} = ${R(-sum(tx.filter(([, a]) => a < 0).map(([, a]) => a)))}.`,
    memo: [
      { code: 'M', marks: 1, text: 'adding deposits and subtracting withdrawals in order' },
      { code: 'A', marks: 1, text: `closing balance ${R(bals[bals.length - 1])}` },
      { code: 'M', marks: 1, text: 'adding the debits' },
      { code: 'A', marks: 1, text: R(-sum(tx.filter(([, a]) => a < 0).map(([, a]) => a))) },
    ],
  })
}

// --- Grade 10: till slip with VAT
{
  const items: [string, number][] = [
    ['Bread', 18.99],
    ['Milk 2 ℓ', 32.49],
    ['Washing powder', 74.95],
  ]
  const total = round2(sum(items.map(([, a]) => a)))
  const excl = round2(total / 1.15)
  out.push({
    id: 'mlt-g10-till-slip-vat',
    ...t('finance', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `|+ TILL SLIP (prices include 15% VAT)\n| Item | Price |\n|---|---|\n${items.map(([k, a]) => `| ${k} | ${R(a)} |`).join('\n')}\n| TOTAL | ? |`,
    prompt: 'Calculate the total on the till slip, the amount excluding VAT and the VAT included in it.',
    answer: `Total ${R(total)}; excluding VAT ${R(excl)}; VAT ${R(total - excl)}`,
    explanation: `Total = ${items.map(([, a]) => n(a)).join(' + ')} = ${R(total)}. The VAT-inclusive price is 115% of the VAT-exclusive price, so excluding VAT = ${R(total)} ÷ 1,15 = ${R(excl)}. VAT = ${R(total)} − ${R(excl)} = ${R(total - excl)}. Taking 15% of the total (${R(total * 0.15)}) is wrong: the 15% is of the price before VAT.`,
    memo: [
      { code: 'A', marks: 1, text: `total ${R(total)}` },
      { code: 'M', marks: 1, text: '÷ 1,15' },
      { code: 'A', marks: 1, text: `excl. VAT ${R(excl)}` },
      { code: 'CA', marks: 1, text: `VAT ${R(total - excl)}` },
    ],
  })
}

// --- Grade 11: tariffs with a fixed and a variable part
{
  const blocks: [string, number][] = [
    ['0 – 350 kWh', 2.12],
    ['351 – 600 kWh', 2.74],
    ['above 600 kWh', 3.31],
  ]
  const service = 245
  const used = 520
  const b1 = 350 * blocks[0][1]
  const b2 = (used - 350) * blocks[1][1]
  const total = service + b1 + b2
  out.push({
    id: 'mlt-g11-tariff-block',
    ...t('finance', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `|+ MUNICIPAL ELECTRICITY TARIFF (per month)\n| Part | Charge |\n|---|---|\n| Fixed service charge | ${R(service)} |\n${blocks.map(([k, r]) => `| ${k} | ${R(r)} per kWh |`).join('\n')}`,
    prompt: `Calculate the electricity bill for a household that used ${used} kWh. A neighbour says the bill should be ${used} × ${R(blocks[1][1])} + ${R(service)}. Explain the neighbour's mistake and how much too high that answer is.`,
    answer: `${R(total)}. The neighbour charged every kWh at the second block's rate; the first 350 kWh cost only ${R(blocks[0][1])} each. Their answer, ${R(used * blocks[1][1] + service)}, is ${R(used * blocks[1][1] + service - total)} too high.`,
    explanation: `Block 1: 350 × ${R(blocks[0][1])} = ${R(b1)}. Block 2: (${used} − 350) × ${R(blocks[1][1])} = ${used - 350} × ${R(blocks[1][1])} = ${R(b2)}. Total = ${R(service)} + ${R(b1)} + ${R(b2)} = ${R(total)}. The neighbour: ${used} × ${R(blocks[1][1])} + ${R(service)} = ${R(used * blocks[1][1] + service)}.`,
    memo: [
      { code: 'A', marks: 1, text: `block 1 ${R(b1)}` },
      { code: 'M', marks: 1, text: `${used - 350} kWh in block 2` },
      { code: 'A', marks: 1, text: `block 2 ${R(b2)}` },
      { code: 'CA', marks: 1, text: `total ${R(total)}` },
      { code: 'J', marks: 1, text: 'each block is charged at its own rate' },
      { code: 'CA', marks: 1, text: `${R(used * blocks[1][1] + service - total)} too high` },
    ],
  })
  const callout = 350
  const hourly = 420
  const quote = 1610
  const hours = (quote - callout) / hourly
  out.push({
    id: 'mlt-g11-tariff-reverse',
    ...t('finance', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context: `A plumber's tariff is a call-out fee of ${R(callout)} plus ${R(hourly)} for every hour worked. A customer's bill is ${R(quote)}.`,
    prompt: 'Determine how many hours the plumber worked.',
    answer: `${n(hours)} hours`,
    explanation: `Subtract the fixed part first: ${R(quote)} − ${R(callout)} = ${R(quote - callout)} for labour. Hours = ${R(quote - callout)} ÷ ${R(hourly)} = ${n(hours)} hours.`,
    memo: [
      { code: 'M', marks: 1, text: `${R(quote)} − ${R(callout)}` },
      { code: 'M', marks: 1, text: `÷ ${R(hourly)}` },
      { code: 'A', marks: 1, text: `${n(hours)} hours` },
    ],
  })
}

// --- Grade 12: percentage increase and decrease
{
  const old = 1450
  const now = 1595
  const pct = ((now - old) / old) * 100
  out.push({
    id: 'mlt-g12-pct-increase-rent',
    ...t('finance', 12),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context: `A room's monthly rent rose from ${R(old)} to ${R(now)}.`,
    prompt: 'Calculate the percentage increase in the rent.',
    answer: `${n(pct, 1)}%`,
    explanation: `Increase = ${R(now)} − ${R(old)} = ${R(now - old)}. Percentage increase = increase ÷ ORIGINAL × 100 = ${n(now - old)} ÷ ${n(old)} × 100 = ${n(pct, 1)}%.`,
    memo: [
      { code: 'A', marks: 1, text: `increase ${R(now - old)}` },
      { code: 'M', marks: 1, text: '÷ the original amount × 100' },
      { code: 'CA', marks: 1, text: `${n(pct, 1)}%` },
    ],
  })
  const sale = 1840
  const off = 0.2
  const original = sale / (1 - off)
  out.push({
    id: 'mlt-g12-pct-reverse-discount',
    ...t('finance', 12),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    context: `A store advertises "20% off everything". A fridge is marked at the sale price of ${R(sale)}.`,
    prompt: `A customer says the original price was ${R(sale * 1.2)}, because "20% of ${R(sale)} is ${R(sale * 0.2)}". Explain the customer's error, and determine the original price before the percentage discount.`,
    answer: `Original price ${R(original)}. The 20% was taken off the ORIGINAL price, not the sale price, so the sale price is 80% of the original.`,
    explanation: `Sale price = 80% of the original, so original = ${R(sale)} ÷ 0,8 = ${R(original)}. Check: 20% of ${R(original)} = ${R(original * off)}, and ${R(original)} − ${R(original * off)} = ${R(sale)}. The customer worked out 20% of the wrong amount.`,
    memo: [
      { code: 'M', marks: 1, text: 'sale price = 80% of the original' },
      { code: 'M', marks: 1, text: `${R(sale)} ÷ 0,8` },
      { code: 'A', marks: 1, text: R(original) },
      { code: 'J', marks: 1, text: 'the discount is a percentage of the original price' },
    ],
  })
  const a = 12.5
  const b = 10
  const fare = 24
  const jan = fare * (1 + a / 100)
  const jun = jan * (1 - b / 100)
  const overall = ((jun - fare) / fare) * 100
  out.push({
    id: 'mlt-g12-pct-successive',
    ...t('finance', 12),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context: `A taxi fare of ${R(fare)} rose by ${n(a)}% in January. In June it fell by ${b}%.`,
    prompt: `Calculate the fare after each change. A commuter says the fare is now back to ${R(fare)}, "because it went up by ${n(a)}% and down by ${b}%, which nearly cancel". Is the commuter correct? Calculate the overall percentage change to support your answer.`,
    answer: `January ${R(jan)}; June ${R(jun)}. Not correct: the fare is ${R(jun - fare)} higher than before, an overall change of +${n(overall, 2)}%, because the ${b}% decrease is of the higher fare.`,
    explanation: `January: ${R(fare)} + ${n(a)}% × ${R(fare)} = ${R(fare)} + ${R(jan - fare)} = ${R(jan)}. June: ${R(jan)} − ${b}% × ${R(jan)} = ${R(jan)} − ${R(jan - jun)} = ${R(jun)}. Overall: (${R(jun)} − ${R(fare)}) ÷ ${R(fare)} × 100 = ${n(overall, 2)}%. The percentages do not cancel, because each is of a different amount.`,
    memo: [
      { code: 'A', marks: 1, text: `January ${R(jan)}` },
      { code: 'CA', marks: 1, text: `June ${R(jun)}` },
      { code: 'M', marks: 1, text: 'change ÷ original × 100' },
      { code: 'CA', marks: 1, text: `+${n(overall, 2)}%` },
      { code: 'C', marks: 1, text: 'not back to the old fare: the decrease was of the higher fare' },
    ],
  })
}

// =========================================================== MAPS AND PLANS

// --- Bar scales, every grade
{
  // Grade 10: bar scale to real distance.
  {
    const cm = 2
    const km = 5
    const map = 7.4
    const real = (map / cm) * km
    out.push({
      id: 'mlt-g10-bar-scale-distance',
      ...t('maps-plans', 10),
      difficulty: 'Easy',
      cognitiveLevel: 2,
      marks: 3,
      context: `The bar scale on a map of a game reserve shows that ${cm} cm represents ${km} km. On the map, the gravel road from the gate to the picnic site is ${n(map)} cm long.`,
      prompt: 'Use the bar scale to calculate the real length of the gravel road, in km.',
      answer: `${n(real)} km`,
      explanation: `On the bar scale, 1 cm represents ${n(km)} ÷ ${cm} = ${n(km / cm)} km. So ${n(map)} cm represents ${n(map)} × ${n(km / cm)} = ${n(real)} km.`,
      memo: [
        { code: 'M', marks: 1, text: `1 cm = ${n(km / cm)} km` },
        { code: 'M', marks: 1, text: `${n(map)} × ${n(km / cm)}` },
        { code: 'A', marks: 1, text: `${n(real)} km` },
      ],
    })
  }
  // Grade 11: bar scale to number scale, and why a bar scale survives copying.
  {
    const cm = 2
    const m = 500
    const ratio = (m * 100) / cm
    out.push({
      id: 'mlt-g11-bar-to-number-scale',
      ...t('maps-plans', 11),
      difficulty: 'Moderate',
      cognitiveLevel: 2,
      marks: 4,
      context: `A town map has a bar scale on which ${cm} cm represents ${m} m in reality.`,
      prompt: 'Write the bar scale as a number scale in the form 1 : …, and explain why the bar scale is still correct if the map is enlarged on a photocopier, but the number scale is not.',
      answer: `1 : ${n(ratio)}. When the map is enlarged, the bar scale is enlarged with it, so its length still matches the map; the number scale stays printed as 1 : ${n(ratio)} although the map is now larger.`,
      explanation: `Same units first: ${m} m = ${n(m * 100)} cm. So ${cm} cm : ${n(m * 100)} cm, and dividing by ${cm}: 1 : ${n(ratio)}. A bar scale is a drawing on the map, so it stretches with the map; a number scale is a ratio written in text and does not change.`,
      memo: [
        { code: 'M', marks: 1, text: `${m} m = ${n(m * 100)} cm` },
        { code: 'A', marks: 1, text: `1 : ${n(ratio)}` },
        { code: 'J', marks: 2, text: 'the bar scale is enlarged with the map; the number scale is not' },
      ],
    })
  }
  // Grade 12: bar scale, distance and travel time.
  {
    const cm = 4
    const km = 25
    const map = 13.2
    const real = (map / cm) * km
    const speed = 110
    const mins = Math.round((real / speed) * 60)
    out.push({
      id: 'mlt-g12-bar-scale-time',
      ...t('maps-plans', 12),
      difficulty: 'Moderate',
      cognitiveLevel: 3,
      marks: 5,
      context: `The bar scale on a road map shows that ${cm} cm represents ${km} km. On the map the route from Polokwane to Mokopane is ${n(map)} cm long.`,
      prompt: `Use the bar scale to calculate the real distance from Polokwane to Mokopane. A driver leaves Polokwane at 07:40 and travels at an average speed of ${speed} km/h. Determine the time she arrives in Mokopane.`,
      answer: `${n(real)} km; she arrives at ${clock(7 * 60 + 40 + mins)}.`,
      explanation: `1 cm represents ${km} ÷ ${cm} = ${n(km / cm)} km, so ${n(map)} cm represents ${n(map)} × ${n(km / cm)} = ${n(real)} km. Time = distance ÷ speed = ${n(real)} ÷ ${speed} = ${n(real / speed, 3)} h, and ${n(real / speed, 3)} × 60 = ${mins} minutes. 07:40 + ${mins} min = ${clock(7 * 60 + 40 + mins)}.`,
      memo: [
        { code: 'M', marks: 1, text: `1 cm = ${n(km / cm)} km` },
        { code: 'A', marks: 1, text: `${n(real)} km` },
        { code: 'M', marks: 1, text: 'time = distance ÷ speed' },
        { code: 'CA', marks: 1, text: `${mins} minutes` },
        { code: 'CA', marks: 1, text: clock(7 * 60 + 40 + mins) },
      ],
    })
  }
}

// --- Grid references, every grade (the grid is a table: columns A–E, rows 1–4)
{
  const grid = `|+ STREET MAP OF A TOWN CENTRE (each block is 250 m by 250 m; north is up)\n| | A | B | C | D | E |\n|---|---|---|---|---|---|\n| 1 | Taxi rank | | Clinic | | Police station |\n| 2 | | Library | | Market | |\n| 3 | School | | Post office | | Sports field |\n| 4 | | Church | | Municipal offices | Hospital |`
  out.push({
    id: 'mlt-g10-grid-reference',
    ...t('maps-plans', 10),
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    context: grid,
    prompt: 'Write down the grid reference of the post office and of the hospital, and name the building in block D2.',
    answer: 'Post office C3; hospital E4; D2 is the market.',
    explanation: 'A grid reference gives the column letter first, then the row number: the post office is in column C, row 3 (C3); the hospital in column E, row 4 (E4). Block D2 is column D, row 2: the market.',
    memo: [
      { code: 'RT', marks: 1, text: 'C3' },
      { code: 'RT', marks: 1, text: 'E4' },
      { code: 'RT', marks: 1, text: 'market' },
    ],
  })
  out.push({
    id: 'mlt-g11-grid-direction',
    ...t('maps-plans', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: grid,
    prompt: 'In which general direction is the hospital from the taxi rank? A learner walks from the school (grid reference A3) straight east to the sports field (grid reference E3). Calculate the distance she walks, centre to centre.',
    answer: 'South-east. 1 000 m (1 km).',
    explanation: 'The hospital (E4) is to the right (east) of and below (south of) the taxi rank (A1), so it is south-east. From column A to column E is 4 blocks; 4 × 250 m = 1 000 m = 1 km.',
    memo: [
      { code: 'A', marks: 1, text: 'south-east' },
      { code: 'M', marks: 1, text: '4 blocks from A to E' },
      { code: 'M', marks: 1, text: '× 250 m' },
      { code: 'A', marks: 1, text: '1 000 m' },
    ],
  })
  const east = 4
  const south = 3
  const walk = (east + south) * 250
  const speedKmh = 4.5
  const mins = Math.round((walk / 1000 / speedKmh) * 60)
  out.push({
    id: 'mlt-g12-grid-route-time',
    ...t('maps-plans', 12),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: `${grid}\nPeople may walk only along the grid lines (streets), not diagonally through blocks.`,
    prompt: `A nurse walks from the taxi rank (grid reference A1) to the hospital (grid reference E4) along the streets, taking the shortest route. Determine the shortest walking distance and, at ${n(speedKmh)} km/h, the walking time in minutes. Explain why the straight-line distance would underestimate the walk.`,
    answer: `Shortest street route: ${east} blocks east and ${south} blocks south = ${east + south} blocks = ${n(walk)} m. Time ≈ ${mins} minutes. A straight line cuts through blocks, which a walker cannot do.`,
    explanation: `From A to E is ${east} blocks east, and from row 1 to row 4 is ${south} blocks south: ${east + south} blocks × 250 m = ${n(walk)} m = ${n(walk / 1000)} km. Time = ${n(walk / 1000)} ÷ ${n(speedKmh)} = ${n(walk / 1000 / speedKmh, 3)} h × 60 ≈ ${mins} minutes. Every shortest street route has the same ${east + south} blocks, in any order.`,
    memo: [
      { code: 'M', marks: 1, text: `${east} blocks east and ${south} blocks south` },
      { code: 'A', marks: 1, text: `${n(walk)} m` },
      { code: 'M', marks: 1, text: 'time = distance ÷ speed, converted to minutes' },
      { code: 'CA', marks: 1, text: `≈ ${mins} minutes` },
      { code: 'J', marks: 1, text: 'the straight line passes through blocks' },
    ],
  })
}

// --- Floor plans, Grade 10
{
  const scale = 100
  const room = { l: 4.2, w: 3.5 }
  const plan = `|+ FLOOR PLAN OF A FLAT, scale 1 : ${scale} (measurements on the plan, in cm)\n| Room | Length on plan | Width on plan |\n|---|---|---|\n| Bedroom | ${n(room.l)} cm | ${n(room.w)} cm |\n| Kitchen | 3,0 cm | 2,4 cm |\n| Lounge | 5,5 cm | 4,0 cm |\n| Bathroom | 2,2 cm | 1,8 cm |`
  out.push({
    id: 'mlt-g10-floor-plan-area',
    ...t('maps-plans', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: plan,
    prompt: 'Determine the real length and width of the bedroom in metres, and calculate its real floor area.',
    answer: `${n(room.l)} m by ${n(room.w)} m; area ${n(room.l * room.w)} m²`,
    explanation: `At 1 : ${scale}, 1 cm on the plan is ${scale} cm = 1 m in reality. So the bedroom is ${n(room.l)} m by ${n(room.w)} m, and its area is ${n(room.l)} × ${n(room.w)} = ${n(room.l * room.w)} m².`,
    memo: [
      { code: 'M', marks: 1, text: '1 cm on the plan = 1 m' },
      { code: 'A', marks: 1, text: `${n(room.l)} m by ${n(room.w)} m` },
      { code: 'M', marks: 1, text: 'length × width' },
      { code: 'CA', marks: 1, text: `${n(room.l * room.w)} m²` },
    ],
  })
  const tile = 0.6
  const lounge = { l: 5.5, w: 4.0 }
  const along = Math.ceil(lounge.l / tile)
  const across = Math.ceil(lounge.w / tile)
  out.push({
    id: 'mlt-g10-floor-plan-tiles',
    ...t('maps-plans', 10),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: plan,
    prompt: `The lounge will be tiled with square tiles of ${n(tile * 100)} cm by ${n(tile * 100)} cm, laid in rows. Tiles are cut to fit at the walls, and a cut tile cannot be reused. Determine how many tiles are needed.`,
    answer: `${along * across} tiles (${along} along the length × ${across} across the width)`,
    explanation: `Real lounge: ${n(lounge.l)} m by ${n(lounge.w)} m. Along the length: ${n(lounge.l)} ÷ ${n(tile)} = ${n(lounge.l / tile)}, so ${along} tiles (the last one cut). Across: ${n(lounge.w)} ÷ ${n(tile)} = ${n(lounge.w / tile)}, so ${across} tiles. Total ${along} × ${across} = ${along * across}. Dividing the area by the area of one tile (${n((lounge.l * lounge.w) / (tile * tile))}) undercounts, because cut pieces cannot be reused.`,
    memo: [
      { code: 'A', marks: 1, text: `${n(lounge.l)} m by ${n(lounge.w)} m` },
      { code: 'M', marks: 1, text: `${n(lounge.l)} ÷ ${n(tile)} rounded UP` },
      { code: 'A', marks: 1, text: `${along} tiles` },
      { code: 'A', marks: 1, text: `${across} tiles` },
      { code: 'CA', marks: 1, text: `${along * across} tiles` },
    ],
  })
}

// --- Routes and travel time, Grade 10
{
  const legs: [string, number][] = [
    ['Mthatha to Butterworth', 113],
    ['Butterworth to East London', 116],
  ]
  const stop = 25
  const speed = 90
  const dist = sum(legs.map(([, d]) => d))
  const drive = Math.round((dist / speed) * 60)
  const leave = 6 * 60 + 50
  out.push({
    id: 'mlt-g10-route-arrival',
    ...t('maps-plans', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context: `|+ ROUTE ON THE N2\n| Section | Distance |\n|---|---|\n${legs.map(([k, d]) => `| ${k} | ${d} km |`).join('\n')}`,
    prompt: `A family leaves Mthatha at ${clock(leave)} and drives to East London at an average speed of ${speed} km/h, stopping for ${stop} minutes in Butterworth. Determine the total distance and the time they arrive.`,
    answer: `${dist} km; they arrive at about ${clock(leave + drive + stop)}.`,
    explanation: `Distance = ${legs.map(([, d]) => d).join(' + ')} = ${dist} km. Driving time = ${dist} ÷ ${speed} = ${n(dist / speed, 3)} h × 60 ≈ ${drive} min = ${hm(drive)}. Add the ${stop}-minute stop: ${drive + stop} min. ${clock(leave)} + ${hm(drive + stop)} = ${clock(leave + drive + stop)}.`,
    memo: [
      { code: 'A', marks: 1, text: `${dist} km` },
      { code: 'M', marks: 1, text: 'time = distance ÷ speed' },
      { code: 'A', marks: 1, text: `≈ ${drive} min driving` },
      { code: 'M', marks: 1, text: `adding the ${stop}-minute stop` },
      { code: 'CA', marks: 1, text: clock(leave + drive + stop) },
    ],
  })
}

// ============================================================== MEASUREMENT

// --- Grade 10: elapsed time and timetables
{
  const deps = [6 * 60 + 15, 7 * 60 + 5, 7 * 60 + 50, 8 * 60 + 40]
  const trip = 52
  const tt = `|+ BUS TIMETABLE: Mamelodi to Pretoria CBD (journey time ${trip} minutes)\n| Bus | Departs |\n|---|---|\n${deps.map((d, i) => `| ${i + 1} | ${clock(d)} |`).join('\n')}`
  const mustArrive = 8 * 60 + 30
  const latest = deps.filter((d) => d + trip <= mustArrive).pop()!
  out.push({
    id: 'mlt-g10-timetable',
    ...t('measurement', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: tt,
    prompt: `Lindiwe must be at work in the CBD by ${clock(mustArrive)}, and it takes her 8 minutes to walk from the bus stop to her office. Which is the latest bus she can take, and at what time will she reach her office?`,
    answer: `Bus ${deps.indexOf(latest) + 1} (${clock(latest)}); she reaches her office at ${clock(latest + trip + 8)}.`,
    explanation: `She must step off the bus by ${clock(mustArrive)} − 8 min = ${clock(mustArrive - 8)}, so the bus must leave by ${clock(mustArrive - 8 - trip)}. Bus ${deps.indexOf(latest) + 1} at ${clock(latest)} arrives at ${clock(latest + trip)} and she reaches the office at ${clock(latest + trip + 8)}. The next bus, at ${clock(deps[deps.indexOf(latest) + 1])}, would arrive at ${clock(deps[deps.indexOf(latest) + 1] + trip)}, too late.`,
    memo: [
      { code: 'M', marks: 1, text: 'working back from 08:30: journey + walk' },
      { code: 'A', marks: 1, text: `latest departure ${clock(mustArrive - 8 - trip)}` },
      { code: 'A', marks: 1, text: `bus ${deps.indexOf(latest) + 1} at ${clock(latest)}` },
      { code: 'CA', marks: 1, text: `office at ${clock(latest + trip + 8)}` },
    ],
  })
  const start = 21 * 60 + 45
  const end = 5 * 60 + 15
  const dur = 24 * 60 - start + end
  out.push({
    id: 'mlt-g10-elapsed-overnight',
    ...t('measurement', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    context: `A security guard starts a night shift at ${clock(start)} and finishes at ${clock(end)} the next morning. He is paid R38,50 an hour.`,
    prompt: 'Calculate the elapsed time of his shift and how much he earns for it.',
    answer: `${hm(dur)}; ${R((dur / 60) * 38.5)}`,
    explanation: `From ${clock(start)} to midnight is ${hm(24 * 60 - start)}; from midnight to ${clock(end)} is ${hm(end)}. Total ${hm(dur)} = ${n(dur / 60, 2)} hours. Pay = ${n(dur / 60, 2)} × R38,50 = ${R((dur / 60) * 38.5)}.`,
    memo: [
      { code: 'M', marks: 1, text: 'splitting the time at midnight' },
      { code: 'A', marks: 1, text: hm(dur) },
      { code: 'CA', marks: 1, text: R((dur / 60) * 38.5) },
    ],
  })
}

// --- Grade 10: scaling a recipe
{
  const serves = 6
  const want = 15
  const ing: [string, number, string][] = [
    ['Maize meal', 500, 'g'],
    ['Water', 1.2, 'ℓ'],
    ['Salt', 10, 'mℓ'],
  ]
  const f = want / serves
  out.push({
    id: 'mlt-g10-recipe-scale',
    ...t('measurement', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `|+ RECIPE: stiff pap (serves ${serves})\n| Ingredient | Amount |\n|---|---|\n${ing.map(([k, a, u]) => `| ${k} | ${n(a)} ${u} |`).join('\n')}\nMaize meal is sold in 1 kg and 2,5 kg bags.`,
    prompt: `Calculate the amount of each ingredient needed to serve ${want} people, and determine whether one 1 kg bag of maize meal is enough.`,
    answer: `Maize meal ${n(500 * f)} g (${n((500 * f) / 1000)} kg); water ${n(1.2 * f)} ℓ; salt ${n(10 * f)} mℓ. One 1 kg bag is not enough: she needs the 2,5 kg bag (or two 1 kg bags).`,
    explanation: `Scale factor = ${want} ÷ ${serves} = ${n(f)}. Maize meal: 500 g × ${n(f)} = ${n(500 * f)} g = ${n((500 * f) / 1000)} kg. Water: 1,2 ℓ × ${n(f)} = ${n(1.2 * f)} ℓ. Salt: 10 mℓ × ${n(f)} = ${n(10 * f)} mℓ. ${n((500 * f) / 1000)} kg is more than 1 kg, so one 1 kg bag is not enough: buy the 2,5 kg bag or two 1 kg bags.`,
    memo: [
      { code: 'M', marks: 1, text: `scale factor ${want} ÷ ${serves} = ${n(f)}` },
      { code: 'A', marks: 1, text: `maize meal ${n(500 * f)} g` },
      { code: 'A', marks: 1, text: `water ${n(1.2 * f)} ℓ and salt ${n(10 * f)} mℓ` },
      { code: 'C', marks: 1, text: 'not enough: the 2,5 kg bag (or two 1 kg bags)' },
    ],
  })
  const mass = 2.3
  const per = 20
  const extra = 20
  const grams = Math.round(mass * 1000)
  const mins = (grams / 500) * per + extra
  out.push({
    id: 'mlt-g10-roast-time',
    ...t('measurement', 10),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    context: `A recipe says: roast chicken for ${per} minutes per 500 g, plus an extra ${extra} minutes. Thabo's chicken has a mass of ${n(mass)} kg, and he wants to serve it at 18:30.`,
    prompt: 'Calculate the cooking time, and the latest time the chicken must go into the oven.',
    answer: `${hm(mins)}; it must go in by ${clock(18 * 60 + 30 - mins)}.`,
    explanation: `${n(mass)} kg = ${n(grams)} g = ${n(grams / 500)} × 500 g. Time = ${n(grams / 500)} × ${per} + ${extra} = ${mins} minutes = ${hm(mins)}. 18:30 − ${hm(mins)} = ${clock(18 * 60 + 30 - mins)}.`,
    memo: [
      { code: 'M', marks: 1, text: `${n(grams)} g ÷ 500 g` },
      { code: 'A', marks: 1, text: `${mins} minutes` },
      { code: 'M', marks: 1, text: 'working back from 18:30' },
      { code: 'CA', marks: 1, text: clock(18 * 60 + 30 - mins) },
    ],
  })
}

// --- Grade 11: surface area
{
  const L = 40
  const W = 30
  const H = 25
  const sa = 2 * (L * W + L * H + W * H)
  const open = sa - L * W
  out.push({
    id: 'mlt-g11-surface-area-box',
    ...t('measurement', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `A rectangular storage box is ${L} cm long, ${W} cm wide and ${H} cm high. You may use: surface area of a closed box = 2(l × w + l × h + w × h).`,
    prompt: 'Calculate the surface area of the closed box, and the area of cardboard needed if the box has NO lid.',
    answer: `${n(sa)} cm² closed; ${n(open)} cm² without a lid`,
    explanation: `l × w = ${n(L * W)}, l × h = ${n(L * H)}, w × h = ${n(W * H)}. Closed: 2(${n(L * W)} + ${n(L * H)} + ${n(W * H)}) = ${n(sa)} cm². Without a lid, one ${L} × ${W} face is left out: ${n(sa)} − ${n(L * W)} = ${n(open)} cm².`,
    memo: [
      { code: 'SF', marks: 1, text: 'substituting into the formula' },
      { code: 'A', marks: 1, text: `${n(sa)} cm²` },
      { code: 'M', marks: 1, text: 'subtracting one l × w face' },
      { code: 'CA', marks: 1, text: `${n(open)} cm²` },
    ],
  })
  const r = 0.35
  const h = 1.2
  const pi = 3.142
  const side = 2 * pi * r * h
  const top = pi * r * r
  const coverage = 8
  const area = side + top
  out.push({
    id: 'mlt-g11-surface-area-paint',
    ...t('measurement', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: `A cylindrical water tank with a radius of ${n(r)} m and a height of ${n(h)} m stands on its base. Its curved side and its top must be painted; the base is not painted. You may use: curved area = 2 × π × r × h; area of a circle = π × r²; π = 3,142. One litre of paint covers ${coverage} m².`,
    prompt: 'Calculate the surface area to be painted, and determine whether one 500 mℓ tin of paint is enough.',
    answer: `${n(area)} m²; this needs ${n(area / coverage, 3)} ℓ (${n((area / coverage) * 1000, 0)} mℓ), so one 500 mℓ tin is enough.`,
    explanation: `Curved side: 2 × 3,142 × ${n(r)} × ${n(h)} = ${n(side, 3)} m². Top: 3,142 × ${n(r)}² = ${n(top, 3)} m². Total = ${n(area)} m². Paint = ${n(area)} ÷ ${coverage} = ${n(area / coverage, 3)} ℓ = ${n((area / coverage) * 1000, 0)} mℓ, less than 500 mℓ.`,
    memo: [
      { code: 'A', marks: 1, text: `curved ${n(side, 3)} m²` },
      { code: 'A', marks: 1, text: `top ${n(top, 3)} m²` },
      { code: 'CA', marks: 1, text: `total ${n(area)} m²` },
      { code: 'M', marks: 1, text: `÷ ${coverage} m² per litre` },
      { code: 'C', marks: 1, text: 'one tin is enough' },
    ],
  })
}

// --- Grade 11: BMI
{
  const mass = 78
  const height = 1.74
  const bmi = mass / (height * height)
  const target = 24.9
  const targetMass = target * height * height
  const bands = '|+ BMI CATEGORIES FOR ADULTS\n| BMI (kg/m²) | Category |\n|---|---|\n| below 18,5 | Underweight |\n| 18,5 – 24,9 | Healthy weight |\n| 25 – 29,9 | Overweight |\n| 30 and above | Obese |'
  out.push({
    id: 'mlt-g11-bmi-category',
    ...t('measurement', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    context: `${bands}\nBMI = mass (kg) ÷ height (m)². Mr Ndlovu has a mass of ${mass} kg and is ${n(height)} m tall.`,
    prompt: 'Calculate Mr Ndlovu\'s BMI, rounded to one decimal place, and state his category.',
    answer: `BMI ${n(bmi, 1)} kg/m²: ${bmi >= 25 ? 'overweight' : 'healthy weight'}`,
    explanation: `Height squared first: ${n(height)} × ${n(height)} = ${n(height * height, 4)}. BMI = ${mass} ÷ ${n(height * height, 4)} = ${n(bmi, 1)} kg/m². That lies in 25 – 29,9, so he is overweight. Dividing by the height and THEN squaring is the usual error.`,
    memo: [
      { code: 'M', marks: 1, text: `height² = ${n(height * height, 4)}` },
      { code: 'M', marks: 1, text: 'mass ÷ height²' },
      { code: 'A', marks: 1, text: `${n(bmi, 1)} kg/m²` },
      { code: 'RT', marks: 1, text: 'overweight' },
    ],
  })
  out.push({
    id: 'mlt-g11-bmi-target-mass',
    ...t('measurement', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    context: `${bands}\nBMI = mass (kg) ÷ height (m)². Mr Ndlovu has a mass of ${mass} kg and is ${n(height)} m tall.`,
    prompt: `Determine the greatest mass Mr Ndlovu can have and still be in the healthy-weight range (BMI ${n(target)}), and how many kilograms he would need to lose to reach it.`,
    answer: `${n(targetMass, 1)} kg; he would need to lose about ${n(mass - targetMass, 1)} kg.`,
    explanation: `Rearrange BMI = mass ÷ height²: mass = BMI × height² = ${n(target)} × ${n(height * height, 4)} = ${n(targetMass, 1)} kg. He must lose ${mass} − ${n(targetMass, 1)} = ${n(mass - targetMass, 1)} kg.`,
    memo: [
      { code: 'M', marks: 1, text: 'mass = BMI × height²' },
      { code: 'A', marks: 1, text: `${n(targetMass, 1)} kg` },
      { code: 'M', marks: 1, text: `${mass} − ${n(targetMass, 1)}` },
      { code: 'CA', marks: 1, text: `${n(mass - targetMass, 1)} kg` },
    ],
  })
}

export const matlitTypes: Question[] = out
