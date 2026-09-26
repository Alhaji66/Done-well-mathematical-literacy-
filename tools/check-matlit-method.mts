/**
 * Mathematical Literacy must use Mathematical Literacy's methods.
 *
 * TWO THINGS ARE CHECKED.
 *
 * 1. COMPOUND INTEREST HAS NO FORMULA IN MAT LIT. A = P(1 + i)ⁿ belongs to
 *    Mathematics. It is not in the Mathematical Literacy curriculum and is not
 *    supplied in the exam, so a learner who reaches for it is working outside
 *    the method the marks are written for. It had crept into the Mat Lit
 *    Finance note's formula list, where a learner would have read it as the
 *    way to do the work. Mat Lit works compound interest out one year at a
 *    time. Mathematics is left alone -- the same string there is correct.
 *
 * 2. THE SARS TABLE MUST HANG TOGETHER. The bracket figures are not
 *    independent: the rand amount at the start of each row is the tax at the
 *    top of the row before it, and each tax threshold is exactly the income at
 *    which the table's tax equals the rebates. Both are checked by arithmetic,
 *    so a mistyped bracket or a rebate updated without its threshold fails the
 *    build instead of teaching a wrong figure. This is also the check that
 *    confirms a new tax year has been entered correctly end to end.
 *
 * Run:  npm run check:matlit-method
 */
import { topics } from '../src/data/topics.ts'
import { getTopicNote } from '../src/data/topicNotes.ts'
import { filterSubjectQuestions } from '../src/data/questionBank.ts'
import { SARS_TABLES, rebateFor, taxBeforeRebates } from '../src/data/taxTables.ts'

/** The Mathematics compound/annuity formulae, in the spellings the corpus uses. */
const MATHS_FORMULA = /A\s*=\s*P\s*\(1\s*\+\s*i\)\s*(ⁿ|\^n)|\(1\s*\+\s*i\)\s*(ⁿ|\^n)/i

let failures = 0

// ---------------------------------------------------------------- 1. method
const matLitTopics = topics.filter((t) => t.subjectId === 'mat-lit')

for (const topic of matLitTopics) {
  const note = getTopicNote(topic.id)
  if (!note) continue
  const strings: [string, string][] = [
    ...(note.formulae ?? []).map((f, i) => [`formulae[${i}]`, f] as [string, string]),
    ...(note.keyIdeas ?? []).map((f, i) => [`keyIdeas[${i}]`, f] as [string, string]),
    ...(note.commonMistakes ?? []).map((f, i) => [`commonMistakes[${i}]`, f] as [string, string]),
    ...(note.subtopics ?? []).flatMap((s) =>
      (s.points ?? []).map((p, i) => [`${s.name}[${i}]`, p] as [string, string]),
    ),
  ]
  for (const [where, text] of strings) {
    // The common-mistakes entry that names the formula in order to warn against
    // it is the one place it is allowed to appear.
    if (/not supplied|Mathematics method|does not use/i.test(text)) continue
    if (MATHS_FORMULA.test(text)) {
      console.log(`  FAIL  ${topic.name} note ${where} presents the Mathematics formula:`)
      console.log(`        ${text}`)
      failures++
    }
  }
}

for (const grade of [10, 11, 12] as const) {
  const qs = await filterSubjectQuestions('mat-lit', { grade })
  for (const q of qs) {
    const text = `${q.prompt} ${q.answer} ${q.explanation ?? ''}`
    if (/not supplied|Mathematics method|does not use/i.test(text)) continue
    if (MATHS_FORMULA.test(text)) {
      console.log(`  FAIL  Mat Lit G${grade} ${q.id} uses the Mathematics compound formula`)
      failures++
    }
  }
}

// ------------------------------------------------------------- 2. tax table
// Every year held, not just the current one: past papers print their own
// year's table, and a mistyped old table teaches a wrong figure just as well.
for (const TABLE of SARS_TABLES) {
  for (let i = 1; i < TABLE.brackets.length; i++) {
    const prevTop = TABLE.brackets[i - 1].to!
    const implied = taxBeforeRebates(prevTop, TABLE)
    const stated = TABLE.brackets[i].base
    if (Math.abs(implied - stated) >= 1) {
      console.log(
        `  FAIL  ${TABLE.taxYear} row ${i + 1}: states ${stated} but the row above ends at ${implied.toFixed(2)}`,
      )
      failures++
    }
  }

  for (const [label, income, age] of [
    ['under 65', TABLE.thresholds.under65, 30],
    ['65 to 74', TABLE.thresholds.from65, 70],
    ['75 and older', TABLE.thresholds.from75, 80],
  ] as const) {
    const tax = taxBeforeRebates(income, TABLE)
    const rebate = rebateFor(age, TABLE)
    if (Math.abs(tax - rebate) >= 2) {
      console.log(
        `  FAIL  ${TABLE.taxYear}: the ${label} threshold of ${income} gives tax ${tax.toFixed(2)} against rebates ${rebate}` +
          ' -- a threshold is the income where those are equal',
      )
      failures++
    }
  }
}

if (failures) {
  console.log(`\n${failures} problem(s).`)
  process.exit(1)
}
console.log(
  `Mathematical Literacy works compound interest year by year, and all ${SARS_TABLES.length} SARS tables\n` +
    `(${SARS_TABLES.map((t) => t.taxYear).join(', ')}) are internally consistent: every bracket\n` +
    'follows on from the one before, and all three thresholds reconcile exactly with the rebates.',
)
