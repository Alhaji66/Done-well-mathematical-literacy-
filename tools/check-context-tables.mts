/**
 * A table printed above a question must BE a table.
 *
 * HTML collapses newlines, so a context written as
 *
 *   TABLE 2: Sipho's spaza shop monthly sales
 *   Jan: R8 200
 *   Feb: R7 650
 *   ...
 *
 * reached the learner as one unbroken paragraph -- "TABLE 2: Sipho's spaza
 * shop monthly sales Jan: R8 200 Feb: R7 650 ..." -- which is unreadable at
 * exactly the moment a learner has to read one value out of it under time
 * pressure. `QuestionText` renders pipe rows as a ruled table instead; this
 * check stops anyone writing the run-on form again, and checks that the
 * tables that do exist are well formed.
 *
 * WHAT COUNTS AS A RUN-ON TABLE, in two shapes.
 *
 * THE FIRST is three or more consecutive lines of "short label: short value".
 * The two qualifiers matter. "Note: Property rates are VAT-exempt. VAT of 15%
 * is added to ..." is a sentence with a colon in it, and a rule that counted it
 * would demand a table row be ruled around a footnote. So the value side has to
 * be short and free of a second sentence before a line counts.
 *
 * THE SECOND is a financial document written as ONE line, with its rows
 * separated by commas and full stops instead of newlines:
 *
 *   "A bank statement shows an opening balance of R4 320,00, then: 03/05 Salary
 *   deposit R12 800,00. 07/05 Debit order R2 450,00. 12/05 Card purchase ..."
 *
 * This shape was found only after a learner reported it, because the original
 * check looked for a table that had LOST its line breaks and this one never had
 * any. It is the same bug wearing different clothes, and it was hiding fourteen
 * more documents -- budgets, price lists, municipal accounts -- behind the
 * three that were reported.
 *
 * WHAT IT DOES NOT COUNT. Prose that happens to mention money. "Zanele earns
 * R9 800 a month. Her total expenses come to R6 294.15, of which R2 450.00 is
 * groceries" is a sentence a learner reads straight through, not a record they
 * read a value out of, and ruling a box around it would help nobody. So a line
 * only counts when it is a LABELLED AMOUNT -- a CAPITALISED noun phrase
 * immediately followed by a rand figure -- and the threshold is set where a
 * list stops reading as a sentence.
 *
 * WHERE THAT LEAVES A GAP, stated plainly rather than papered over. The capital
 * letter is what keeps the rule off prose, and it also means a document whose
 * labels are lower-case -- "Expenses: stock R900, electricity R120" -- slips
 * past. Dropping the capital was tried and caught one more real document at the
 * cost of two false alarms on ordinary sentences, which is the wrong trade for
 * a check that has to be trusted every build. The three that shape missed were
 * fixed by hand; a future one will need an eye rather than this rule.
 */
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { subjects } from '../src/data/subjects'
import { parseContext } from '../src/components/practise/QuestionText'

interface Item {
  id: string
  where: string
  context: string
}

const items: Item[] = []
for (const q of questions) {
  if (q.context) items.push({ id: q.id, where: 'question bank', context: q.context })
}
for (const subject of subjects) {
  for (const paper of await papersForSubject(subject.id)) {
    for (const section of paper.sections) {
      for (const item of section.items) {
        if (item.context) items.push({ id: item.id, where: paper.id, context: item.context })
      }
    }
  }
}

const PAIR = /^([^|:]{1,44}):\s+(\S.{0,44})$/

/**
 * "Venue hire R45 000," or "03/05 Salary deposit R12 800,00." -- a short label
 * with a rand amount stuck to the end of it, which is what a row of a financial
 * document looks like once its line break has been taken away.
 *
 * The label is capped at 30 characters and may not contain a full stop, so a
 * whole clause ending in an amount ("she puts R800.00 into savings") does not
 * count as a row.
 */
const LABELLED_AMOUNT = /(?:^|[,.;:]\s|\n)\s*(?:\d{2}\/\d{2}\s+)?[A-Z][A-Za-z()\/ -]{2,30}?\s+R\s?\d/g
/** Below this many labelled amounts on one line, it still reads as a sentence. */
const RUN_ON_THRESHOLD = 4

const problems: string[] = []
const seen = new Set<string>()

for (const { id, where, context } of items) {
  if (seen.has(context)) continue
  seen.add(context)

  const lines = context.split('\n')
  const blocks = parseContext(context)

  // 1. A run of "label: value" lines that is not already a table.
  let run = 0
  let worst = 0
  for (const line of lines) {
    const m = PAIR.exec(line.trim())
    const isRow = m !== null && !/\.\s/.test(m[2])
    run = isRow ? run + 1 : 0
    worst = Math.max(worst, run)
  }
  if (worst >= 3 && !blocks.some((b) => b.kind === 'table')) {
    problems.push(
      `${id} (${where}): ${worst} consecutive "label: value" lines run together as one paragraph.\n` +
        `    Write them as pipe rows -- | label | value | -- so they render as a table.`,
    )
  }

  // 2. A financial document written as a single unbroken line.
  if (!blocks.some((b) => b.kind === 'table')) {
    for (const line of lines) {
      const hits = (line.match(LABELLED_AMOUNT) ?? []).length
      if (hits >= RUN_ON_THRESHOLD) {
        problems.push(
          `${id} (${where}): ${hits} labelled amounts run together in one line.\n` +
            `    "${line.trim().slice(0, 90)}..."\n` +
            `    A learner has to read a value out of this under time pressure. Write the\n` +
            `    rows as pipes -- | label | amount | -- so they render as a ruled table.`,
        )
        break
      }
    }
  }

  // 3. A table whose rows disagree about how many columns it has, which
  //    renders as a ragged table with holes in it.
  for (const block of blocks) {
    if (block.kind !== 'table') continue
    const widths = new Set([...(block.head ? [block.head.length] : []), ...block.rows.map((r) => r.length)])
    if (widths.size > 1) {
      problems.push(
        `${id} (${where}): table rows have ${[...widths].sort().join(' and ')} cells. Every row needs the same number.`,
      )
    }
    if (block.rows.length === 0) {
      problems.push(`${id} (${where}): a table with a header and no rows under it.`)
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} context table problem(s):\n`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}

const tables = [...seen].reduce(
  (n, c) => n + parseContext(c).filter((b) => b.kind === 'table').length,
  0,
)
console.log(
  `${seen.size} distinct context(s) checked: ${tables} render as a ruled table, ` +
    `and none of the rest hides a table inside a paragraph.`,
)
