import { useMemo } from 'react'
import { MathText } from '@/components/practise/MathText'

/**
 * Render a question's `context` -- the block of information printed ABOVE the
 * prompt -- as paragraphs and, where the author wrote one, a real table.
 *
 * WHY THIS EXISTS. A `context` is a plain string, and it was being rendered
 * into a single `<p>`. HTML collapses newlines, so a SARS tax table that the
 * data had already laid out as ten separate lines arrived on the learner's
 * screen as one unbroken paragraph:
 *
 *   "SARS TAX TABLE - 2025/2026 ... R1 - R237 100: 18% of taxable income
 *   R237 101 - R370 500: R42 678 + 26% of taxable income above R237 100 ..."
 *
 * which is exactly the thing a learner has to read a value out of under time
 * pressure. An NSC paper prints these as ruled tables, so the app should too.
 *
 * THE SYNTAX is deliberately the smallest thing that does the job, and is the
 * one every author already knows from Markdown:
 *
 *   |+ SARS TAX TABLE -- 2025/2026 year of assessment      <- caption (optional)
 *   | Taxable income | Rates of tax |                      <- header row
 *   |---|---|                                              <- makes it a header
 *   | R1 - R237 100  | 18% of taxable income |             <- body rows
 *
 * A run of consecutive `| ... |` lines is one table. Any other line is prose,
 * and a run of prose lines is one paragraph whose own newlines are kept. So
 * text that uses none of this renders exactly as before, which matters: most
 * of the corpus is prose and must not be re-read.
 *
 * WHY THE `|---|` LINE IS REQUIRED for a header rather than the first row just
 * being one. Plenty of these tables have no header at all -- a municipal
 * account is a column of charges against a column of rands, and "Item" /
 * "Amount" would be noise above it. If the first row were always promoted,
 * every one of those would lose its first charge into a heading, which is
 * worse than having no heading. So the author says which they meant, in the
 * same notation Markdown already uses for it.
 *
 * NO HEURISTIC GUESSING. An earlier sketch tried to spot "label: value" lines
 * and promote them to table rows on its own. It cannot work -- "Tax rebates:
 * primary R17 235; secondary ..." is a sentence with a colon in it, not a row,
 * and the rule would have ruled a box around it. Whether something is a table
 * is a decision only the author can make, so the author writes the pipes.
 */

interface TableBlock {
  kind: 'table'
  caption?: string
  /** Absent when the author wrote no `|---|` divider: the table has no header. */
  head?: string[]
  rows: string[][]
}

interface ParagraphBlock {
  kind: 'p'
  text: string
}

export type ContextBlock = TableBlock | ParagraphBlock

const CAPTION = /^\|\+\s*(.*)$/
/** A row is a line fenced by pipes with at least one cell between them. */
const ROW = /^\|(.*)\|$/
/** `|---|---|` under the first row: Markdown's "that row was the header". */
const DIVIDER = /^:?-{2,}:?$/

/** Split `| a | b |` into its cells, dropping the empty ends the fences make. */
function cells(line: string): string[] {
  return line
    .replace(ROW, '$1')
    .split('|')
    .map((c) => c.trim())
}

/**
 * Keep a South African number in one piece inside a narrow column.
 *
 * Rands are printed "R237 100", so the thousands separator is an ordinary
 * space and a phone-width column happily breaks the line inside the number:
 * "R1 – R237" on one line and "100" on the next, which reads as two different
 * figures. Gluing the digit groups with a non-breaking space stops that while
 * still letting the cell wrap between words -- "R1 817 001 and above" breaks
 * before "and", where it should.
 *
 * Only the RENDERED cell is changed. The data stays written with ordinary
 * spaces, so nobody has to type an invisible character to author a table, and
 * every checker still reads the plain text it always did.
 */
function glueNumbers(cell: string): string {
  // Skipped when the cell holds mathematics: inside `$...$` the spacing is
  // KaTeX's business, not ours.
  if (cell.includes('$')) return cell
  return cell.replace(/(\d) (?=\d)/g, '$1\u00A0')
}

export function parseContext(input: string): ContextBlock[] {
  const lines = input.split('\n')
  const blocks: ContextBlock[] = []
  let prose: string[] = []

  const flushProse = () => {
    // Blank lines at the join between prose and a table are separators, not
    // content, so an author can space the source out without adding gaps.
    while (prose.length && prose[prose.length - 1].trim() === '') prose.pop()
    if (prose.length) blocks.push({ kind: 'p', text: prose.join('\n') })
    prose = []
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const captionMatch = CAPTION.exec(line.trim())
    const isCaption = captionMatch !== null
    const startsTable = isCaption
      ? ROW.test((lines[i + 1] ?? '').trim())
      : ROW.test(line.trim())

    if (!startsTable) {
      // A `|+` line with no table under it is just text -- an author's typo
      // must not swallow the line it was written on.
      prose.push(line)
      continue
    }

    flushProse()
    const caption = isCaption ? captionMatch[1].trim() : undefined
    if (isCaption) i += 1

    const rows: string[][] = []
    while (i < lines.length && ROW.test(lines[i].trim())) {
      rows.push(cells(lines[i].trim()))
      i += 1
    }
    i -= 1 // the outer loop steps past the first non-row line

    const hasHeader = rows.length > 1 && rows[1].every((c) => DIVIDER.test(c))
    blocks.push(
      hasHeader
        ? { kind: 'table', caption, head: rows[0], rows: rows.slice(2) }
        : { kind: 'table', caption, rows },
    )
  }

  flushProse()
  return blocks
}

interface QuestionTextProps {
  children: string
  /** Extra classes for the wrapper. */
  className?: string
}

export function QuestionText({ children, className }: QuestionTextProps) {
  const blocks = useMemo(() => parseContext(children ?? ''), [children])

  return (
    <div className={className}>
      {blocks.map((block, i) =>
        block.kind === 'p' ? (
          // `whitespace-pre-line` is what keeps an author's line breaks: it
          // honours newlines while still collapsing runs of spaces and
          // wrapping long lines, which `pre-wrap` would not.
          <p key={i} className="whitespace-pre-line [&+*]:mt-2.5">
            <MathText>{block.text}</MathText>
          </p>
        ) : (
          // The table gets its own scroll container so a wide one never makes
          // the whole page scroll sideways on a phone.
          <div key={i} className="-mx-1 overflow-x-auto px-1 [&+*]:mt-2.5">
            <table className="w-full border-collapse text-left text-[13px] tabular-nums">
              {block.caption ? (
                // Not uppercased: these captions are sentences ("Sipho's spaza
                // shop monthly sales"), and setting them in capitals makes the
                // table shout its title at the learner.
                <caption className="caption-top pb-1.5 text-left text-xs font-semibold text-navy-600">
                  <MathText>{block.caption}</MathText>
                </caption>
              ) : null}
              {block.head?.length ? (
                <thead>
                  <tr>
                    {block.head.map((cell, c) => (
                      <th
                        key={c}
                        scope="col"
                        className="border border-navy-200 bg-navy-100 px-2 py-1.5 align-top font-semibold text-navy-800"
                      >
                        <MathText>{glueNumbers(cell)}</MathText>
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className={r % 2 === 1 ? 'bg-navy-50/60' : undefined}>
                    {row.map((cell, c) =>
                      // In a two-column table with no header row, the left cell
                      // IS the row's heading -- "Rates", "Water (12 kl)", "Jan"
                      // -- so it is marked up as one and carries the weight that
                      // tells the eye which column to scan down.
                      c === 0 && !block.head && row.length === 2 ? (
                        <th
                          key={c}
                          scope="row"
                          className="border border-navy-200 px-2 py-1.5 text-left align-top font-medium text-navy-800"
                        >
                          <MathText>{glueNumbers(cell)}</MathText>
                        </th>
                      ) : (
                        <td
                          key={c}
                          className="border border-navy-200 px-2 py-1.5 align-top text-navy-700"
                        >
                          <MathText>{glueNumbers(cell)}</MathText>
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      )}
    </div>
  )
}
