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
 * WHAT COUNTS AS A RUN-ON TABLE: three or more consecutive lines of
 * "short label: short value". The two qualifiers matter. "Note: Property
 * rates are VAT-exempt. VAT of 15% is added to ..." is a sentence with a
 * colon in it, and a rule that counted it would demand a table row be ruled
 * around a footnote. So the value side has to be short and free of a second
 * sentence before a line counts.
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

  // 2. A table whose rows disagree about how many columns it has, which
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
