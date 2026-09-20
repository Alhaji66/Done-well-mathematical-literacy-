/**
 * One-off: turn the run-on "label: value" tables in the paper contexts into
 * the pipe rows `QuestionText` rules as a real table.
 *
 * Run with `--write` to apply; without it, prints every before/after so the
 * conversion can be read before it touches a file.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const write = process.argv.includes('--write')

/**
 * A caption the author already wrote as one: "TABLE 2: Sipho's sales". The
 * "TABLE n" label is kept -- nothing cross-references it today, but that is
 * how a real paper prints a caption, and dropping it would be a change to the
 * content rather than to how the content is laid out.
 */
const CAPTION_LINE = /^(TABLE\b[^:]*:\s*.+)$/
/**
 * A table row. The value side must be SHORT and must not run into a second
 * sentence -- that is what separates "Rates: R450.00" from the trailing note
 * "Note: Property rates are VAT-exempt. VAT of 15% is added to ...", which
 * reads as a pair but is prose and must stay prose.
 */
const ROW_LINE = /^([^|:]{1,44}):\s+(\S.{0,44})$/

function isRow(line: string): boolean {
  const m = ROW_LINE.exec(line.trim())
  return m !== null && !/\.\s/.test(m[2]) && !CAPTION_LINE.test(line.trim())
}

/** Returns the rewritten context, or null when there is no table in it. */
export function convert(context: string): string | null {
  const lines = context.split('\n')
  if (lines.some((l) => l.trim().startsWith('|'))) return null

  // The longest run of row lines, which is the table.
  let start = -1
  let len = 0
  let run = 0
  for (let i = 0; i <= lines.length; i += 1) {
    if (i < lines.length && isRow(lines[i])) {
      run += 1
    } else {
      if (run > len) {
        len = run
        start = i - run
      }
      run = 0
    }
  }
  if (len < 3) return null

  const before = lines.slice(0, start)
  const rows = lines.slice(start, start + len)
  const after = lines.slice(start + len)

  const out: string[] = []
  // A "TABLE n: ..." line directly above the rows is the table's caption.
  const lead = before[before.length - 1]?.trim()
  const captionMatch = lead ? CAPTION_LINE.exec(lead) : null
  if (captionMatch) {
    out.push(...before.slice(0, -1))
    out.push(`|+ ${captionMatch[1]}`)
  } else {
    out.push(...before)
  }
  for (const line of rows) {
    const m = ROW_LINE.exec(line.trim())!
    out.push(`| ${m[1].trim()} | ${m[2].trim()} |`)
  }
  out.push(...after)
  return out.join('\n')
}

/* --------------------------------------------------------------------- */

/** Re-encode a string the way these files quote it, so it can be found. */
function encodings(s: string): string[] {
  const body = s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')
  return [`'${body.replace(/'/g, "\\'")}'`, `"${body.replace(/"/g, '\\"')}"`]
}

const files = readdirSync(join(root, 'src/data/papers'))
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')
  .map((f) => join('src/data/papers', f))

let converted = 0
let missed = 0
for (const rel of files) {
  const path = join(root, rel)
  let source = readFileSync(path, 'utf8')
  let touched = false

  // Every single-line `context: '...'` literal that carries a newline escape.
  const literals = new Set<string>()
  for (const m of source.matchAll(/context:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g)) {
    if (m[1].includes('\\n')) literals.add(m[1])
  }

  for (const literal of literals) {
    const quote = literal[0]
    const decoded = literal
      .slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(new RegExp(`\\\\${quote}`, 'g'), quote)
      .replace(/\\\\/g, '\\')
    const next = convert(decoded)
    if (next === null) continue

    const [single, double] = encodings(next)
    const replacement = quote === "'" && !next.includes("'") ? single : next.includes('"') ? single : double
    if (!source.includes(literal)) {
      missed += 1
      continue
    }
    console.log(`\n=== ${rel}\n--- before\n${decoded}\n--- after\n${next}`)
    source = source.split(literal).join(replacement)
    converted += 1
    touched = true
  }

  if (touched && write) writeFileSync(path, source)
}

console.log(`\nconverted ${converted} context literal(s)${missed ? `, ${missed} not found in source` : ''}`)
if (!write) console.log('(dry run -- pass --write to apply)')
