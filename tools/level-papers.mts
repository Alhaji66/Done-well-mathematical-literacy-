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
 * Subjects that now contain levels a person set by reading the item, with a
 * note on what would be lost by re-deriving them.
 *
 * --force re-derives every level this tool previously wrote. That is safe for
 * a subject whose levels are ENTIRELY machine-written, and destructive for one
 * where a human has since overruled the machine -- which is precisely the case
 * wherever the classifier was found to be wrong, because that is what prompted
 * the hand-checking in the first place. Re-deriving would restore the very
 * levels that were measured and rejected.
 *
 * Life Sciences needs no entry: it is not in SUBJECT_FILES at all, because it
 * was hand-levelled from the start.
 */
const HAND_VERIFIED: Record<string, string> = {
  'physical-sciences':
    '141 Level 4 items authored and verified by hand. Many embed a calculation, and\n' +
    '    both cognitive-level.mts and physics-level.mts document the classifier as\n' +
    '    unreliable on exactly those.',
  'mat-lit':
    '256 items whose level was set by reading them -- 243 corrected from Level 3 to\n' +
    '    Level 4, plus 13 rewritten. The classifier reads the OPENING command verb, and\n' +
    "    all of these open with 'Determine' while ending on the judgement that decides\n" +
    '    the level, so re-deriving would send every one of them back to Level 3.',
}

/**
 * --subject <id> limits the run to one file, and it exists because --force is
 * dangerous without it.
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
      'subjects, including hand-verified content. Name a subject.',
  )
  process.exit(1)
}
/*
 * Naming the subject is no longer enough on its own. Two of the three now hold
 * levels a person set after reading the item, so --force on them is not a
 * refresh but a revert. --i-know is deliberately awkward to type: it should be
 * reached for only by someone who has read what they are about to discard.
 */
if (force && only && HAND_VERIFIED[only] && !process.argv.includes('--i-know')) {
  console.error(
    `--force on ${only} would discard hand-verified levels:\n\n    ${HAND_VERIFIED[only]}\n\n` +
      'Re-run with --i-know if you have read the above and still want to re-derive them.',
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
