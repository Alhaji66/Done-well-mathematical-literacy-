/**
 * Write a cognitiveLevel onto every paper item that does not already carry one.
 *
 * The classification rules and the reasoning behind them live in
 * ./cognitive-level.mts. This file only applies them.
 *
 *   npm run level:papers -- --dry-run    print what would change
 *   npm run level:papers                 write it
 *
 * Items that already carry a cognitiveLevel are never touched, so the
 * hand-levelled Life Sciences corpus is safe from this tool.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { classify } from './cognitive-level.mts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const SUBJECT_FILES: Record<string, string> = {
  'mat-lit': 'src/data/papers/mat-lit.ts',
  mathematics: 'src/data/papers/mathematics.ts',
  'physical-sciences': 'src/data/papers/physical-sciences.ts',
}

/**
 * Insert `cognitiveLevel` immediately after each item's `difficulty` line.
 *
 * Editing the source text rather than re-serialising the module is deliberate:
 * these files are hand-written and hand-reviewed, and a round-trip through a
 * serialiser would reformat all 50 000 lines and bury the one-line change this
 * tool actually makes in a diff nobody can review.
 */
function applyToFile(path: string, dryRun: boolean, force: boolean) {
  const full = join(root, path)
  const lines = readFileSync(full, 'utf8').split('\n')
  const out: string[] = []
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  const markCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  const unreadable: string[] = []
  let changed = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    out.push(line)
    const m = line.match(/^(\s*)difficulty: '(Easy|Moderate|Challenge)',\s*$/)
    if (!m) continue
    const alreadyLevelled = /^\s*cognitiveLevel:/.test(lines[i + 1] ?? '')
    // --force re-derives levels that this tool wrote before, so a rule fix can
    // be applied to the whole corpus instead of only to new items. It is safe
    // for these three subjects precisely because every level in them came from
    // these rules; Life Sciences is hand-levelled and is never touched here.
    if (alreadyLevelled && !force) continue

    // Skip the old level line when re-deriving, so it is replaced not doubled.
    if (alreadyLevelled) i++

    // The window must stop at the END OF THIS ITEM, at the `},` sitting two
    // spaces shallower than the `difficulty:` line. A fixed 16-line window was
    // the first attempt and it was wrong in a way that produced confidently
    // incorrect levels rather than obvious breakage: it ran on into the NEXT
    // item, so whenever an item's own field could not be read, the regex
    // happily matched the neighbour's instead.
    const closer = `${m[1].slice(0, -2)}},`
    let end = i
    while (end < lines.length && lines[end] !== closer) end++
    const window = lines.slice(i, end).join('\n')

    const marks = Number(window.match(/\bmarks: (\d+)/)?.[1] ?? '0')
    // Both quote styles. 364 fields in the corpus are double-quoted, because
    // they contain an apostrophe -- "Calculate Sipho's profit for June". A
    // single-quote-only regex read every one of them as empty, and with the
    // unbounded window above that meant they were levelled against whatever
    // the next item happened to ask.
    const field = (name: string) =>
      window.match(new RegExp(`\\b${name}:\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`))?.[1] ??
      window.match(new RegExp(`\\b${name}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1] ??
      ''
    const prompt = field('prompt')
    const context = field('context')
    // An item with no readable prompt means the extractor is broken, not that
    // the item has no prompt -- every item in the corpus has one. Levelling it
    // anyway is how the neighbour-bleeding bug produced confident nonsense, so
    // refuse rather than guess.
    if (!prompt.trim()) unreadable.push(`${path}:${i + 1}`)
    const { level } = classify({ prompt, context, marks, difficulty: m[2] })
    counts[level]++
    markCounts[level] += marks
    changed++
    out.push(`${m[1]}cognitiveLevel: ${level},`)
  }

  if (unreadable.length) {
    console.error(`\n${unreadable.length} item(s) with an unreadable prompt -- the extractor is broken:`)
    for (const u of unreadable.slice(0, 10)) console.error(`  ${u}`)
    process.exit(1)
  }

  if (!dryRun && changed) writeFileSync(full, out.join('\n'))
  return { changed, counts, markCounts }
}

const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')

/**
 * --subject <id> limits the run to one file, and it exists because --force is
 * dangerous without it.
 *
 * --force re-derives every level this tool previously wrote, across all three
 * files. That is fine for a subject whose levels are entirely machine-written.
 * It is NOT fine for Physical Sciences, where 141 Level 4 items were authored
 * and verified by hand: many of them embed a calculation, and the classifier
 * is documented (in cognitive-level.mts and physics-level.mts) as unreliable on
 * exactly those, so a blanket --force could silently demote a session's worth
 * of hand-checked content.
 *
 * Life Sciences is safe by omission -- it is not in SUBJECT_FILES at all,
 * because it was hand-levelled from the start.
 */
const subjectArg = process.argv[process.argv.indexOf('--subject') + 1]
const only = process.argv.includes('--subject') ? subjectArg : null
if (only && !(only in SUBJECT_FILES)) {
  console.error(`Unknown subject "${only}". Known: ${Object.keys(SUBJECT_FILES).join(', ')}`)
  process.exit(1)
}
if (force && !only) {
  console.error(
    '--force without --subject would re-derive every machine-written level in all three\n' +
      'subjects, including hand-verified Physical Sciences content. Name a subject.',
  )
  process.exit(1)
}

let total = 0
for (const [subject, path] of Object.entries(SUBJECT_FILES)) {
  if (only && subject !== only) continue
  const { changed, markCounts } = applyToFile(path, dryRun, force)
  total += changed
  const all = markCounts[1] + markCounts[2] + markCounts[3] + markCounts[4]
  const pct = (n: number) => (all ? Math.round((n / all) * 100) : 0)
  console.log(
    `${subject.padEnd(20)} ${String(changed).padStart(5)} items   by MARKS: ` +
      `L1 ${String(pct(markCounts[1])).padStart(2)}%  L2 ${String(pct(markCounts[2])).padStart(2)}%  ` +
      `L3 ${String(pct(markCounts[3])).padStart(2)}%  L4 ${String(pct(markCounts[4])).padStart(2)}%`,
  )
}
console.log(`\n${dryRun ? 'Would level' : 'Levelled'} ${total} items.`)
if (dryRun) console.log('Dry run -- nothing written.')
