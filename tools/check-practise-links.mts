/**
 * Every link into a Practise route must carry subject, grade AND topic.
 *
 * An external audit of the deployed site found `/app/learner/practise?topic=finance`
 * — a link with no subject and no grade. The Practise page then had to invent
 * both, and what it invented was the demo profile's Grade 12. So a learner who
 * opened a Grade 10 card from Learn was shown Grade 12 topics, asked for Grade
 * 10 questions on one of them, and told "No sample questions at this difficulty
 * yet" about a topic whose count Learn had just advertised.
 *
 * The reachability check could not catch this: Learn's counts and Practise's
 * query were each internally consistent, and only disagreed because the link
 * between them lost the grade in transit. This guards the link itself.
 *
 * A partial link is worse than a broken one. A broken link fails visibly; a
 * link missing its grade lands somewhere plausible and quietly shows the wrong
 * year's work.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'src')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : full.endsWith('.tsx') || full.endsWith('.ts') ? [full] : []
  })
}

/** A practise URL written as a literal, up to the closing quote or backtick. */
const LINK = /(["'`])((?:\/app|\/account)\/learner\/practise\?[^"'`]*)\1/g

const problems: string[] = []
let checked = 0

for (const file of walk(srcDir)) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(LINK)) {
    const url = match[2]
    checked++
    const missing = (['subject', 'grade', 'topic'] as const).filter((key) => !url.includes(`${key}=`))
    if (missing.length) {
      const line = source.slice(0, match.index).split('\n').length
      problems.push(`${relative(root, file)}:${line} — missing ${missing.join(', ')}\n      ${url}`)
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`  ${p}`)
  console.error(`\n${problems.length} practise link(s) that do not carry their full context.`)
  process.exit(1)
}
console.log(`Checked ${checked} practise link(s). Every one carries subject, grade and topic.`)
