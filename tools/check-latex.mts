/**
 * Every `$...$` span in the corpus must actually render.
 *
 * KaTeX is configured with `throwOnError: false` in the app, so a malformed
 * formula does not blank out the question around it -- it renders the broken
 * source in red instead. That is the right behaviour at runtime and the wrong
 * one at author time, because it means a typo ships silently and is only ever
 * found by a learner. This check renders every span with errors turned back on.
 *
 * It also catches the failure that is easy to miss by eye: an UNPAIRED `$`.
 * The splitter treats a string with an odd number of delimiters as plain text
 * rather than letting one formula run to the end, so an unpaired `$` does not
 * corrupt anything -- but it does mean the author's intended formula is being
 * shown as raw LaTeX source, which they would want to know about.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import katex from 'katex'
import { splitMath } from '../src/components/practise/MathText.tsx'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const files = [
  'src/data/questions.ts',
  ...readdirSync(join(root, 'src/data/papers'))
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')
    .map((f) => `src/data/papers/${f}`),
  'src/data/topicNotes.ts',
]

/**
 * Pull out every string literal, un-escaping what TypeScript escaped.
 *
 * This is a character scanner rather than a regex because a regex cannot tell
 * a quote from an apostrophe. The first version here was
 * `/'((?:[^'\\]|\\.)*)'/g`, which silently found NOTHING: a comment reading
 * "Faraday's law" contributed one unmatched `'`, and from that line on every
 * quote paired with its neighbour instead of its partner, so the real string
 * literals all fell into the gaps between "matches". A checker that reports
 * zero problems because it is reading the file wrongly is worse than no
 * checker, so the scanner tracks comments and quoting explicitly.
 */
function stringLiterals(source: string): string[] {
  const out: string[] = []
  let i = 0
  while (i < source.length) {
    const c = source[i]

    if (c === '/' && source[i + 1] === '/') {
      i = source.indexOf('\n', i)
      if (i === -1) break
      continue
    }
    if (c === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2)
      i = end === -1 ? source.length : end + 2
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      const quote = c
      let value = ''
      i++
      while (i < source.length) {
        if (source[i] === '\\') {
          // Keep the escape intact; it is undone once the literal is complete.
          value += source[i] + (source[i + 1] ?? '')
          i += 2
          continue
        }
        if (source[i] === quote) {
          i++
          break
        }
        value += source[i++]
      }
      out.push(value.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\'))
      continue
    }
    i++
  }
  return out
}

let spans = 0
let failures = 0
let unpaired = 0

for (const rel of files) {
  const source = readFileSync(join(root, rel), 'utf8')
  for (const literal of stringLiterals(source)) {
    if (!literal.includes('$')) continue

    // An odd number of unescaped delimiters means one is unpaired.
    const delimiters = literal.replace(/\\\$/g, '').split('$').length - 1
    if (delimiters % 2 === 1) {
      unpaired++
      console.error(`  unpaired $ in ${rel}:\n    ${literal.slice(0, 120)}`)
      continue
    }

    for (const seg of splitMath(literal)) {
      if (seg.kind !== 'math') continue
      spans++
      try {
        katex.renderToString(seg.value, { throwOnError: true, strict: false })
      } catch (error) {
        failures++
        console.error(`  ${rel}: ${JSON.stringify(seg.value)}\n    ${String(error).split('\n')[0]}`)
      }
    }
  }
}

if (failures || unpaired) {
  console.error(`\n${failures} formula(e) failed to render, ${unpaired} unpaired delimiter(s).`)
  process.exit(1)
}
console.log(`Checked ${spans} LaTeX span(s) across ${files.length} file(s). Every one renders.`)
