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
function applyToFile(path: string, dryRun: boolean) {
  const full = join(root, path)
  const lines = readFileSync(full, 'utf8').split('\n')
  const out: string[] = []
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  const markCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  let changed = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    out.push(line)
    const m = line.match(/^(\s*)difficulty: '(Easy|Moderate|Challenge)',\s*$/)
    if (!m) continue
    if (/^\s*cognitiveLevel:/.test(lines[i + 1] ?? '')) continue

    // marks, prompt and context all sit within the next few lines of the
    // object literal; 16 lines covers the longest item in the corpus.
    const window = lines.slice(i, i + 16).join('\n')
    const marks = Number(window.match(/\bmarks: (\d+)/)?.[1] ?? '0')
    const prompt = window.match(/\bprompt:\s*\n?\s*'((?:[^'\\]|\\.)*)'/)?.[1] ?? ''
    const context = window.match(/\bcontext:\s*\n?\s*'((?:[^'\\]|\\.)*)'/)?.[1] ?? ''
    const { level } = classify({ prompt, context, marks, difficulty: m[2] })
    counts[level]++
    markCounts[level] += marks
    changed++
    out.push(`${m[1]}cognitiveLevel: ${level},`)
  }

  if (!dryRun && changed) writeFileSync(full, out.join('\n'))
  return { changed, counts, markCounts }
}

const dryRun = process.argv.includes('--dry-run')
let total = 0
for (const [subject, path] of Object.entries(SUBJECT_FILES)) {
  const { changed, markCounts } = applyToFile(path, dryRun)
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
