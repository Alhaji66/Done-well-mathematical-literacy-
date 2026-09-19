/**
 * Walk every family to its DECLARED capacity and check the declaration is true.
 *
 * A family that claims more distinct questions than its parameters can produce
 * is the one failure mode this generator cannot survive: the caller sizes a
 * batch against `capacity`, and a false claim shows up as a repeated question
 * inside one paper. Two families claimed capacity they did not have when this
 * check was first run, so it stays.
 */
import { generate, capacity } from './gen-l1.mts'

const TOPICS = [
  'math-algebra', 'math-number-patterns', 'math-functions', 'math-finance-growth',
  'math-calculus', 'math-statistics', 'math-analytical-geometry', 'math-trigonometry',
  'math-euclidean-geometry', 'math-counting-probability',
]

let bad = 0
for (const t of TOPICS) {
  const line: string[] = []
  for (const m of [1, 2] as const) {
    const cap = capacity(t, m)
    const seen = new Map<string, string>()
    for (let n = 0; n < cap; n++) {
      const it = generate(t, m, n)
      const prev = seen.get(it.prompt)
      if (prev !== undefined) { console.log(`DUPLICATE  ${t} ${m}mk #${n}: ${it.prompt}`); bad++ }
      seen.set(it.prompt, it.answer)
      const all = it.prompt + it.answer + it.explanation
      if (/undefined|NaN|Infinity|  /.test(all)) { console.log(`MALFORMED  ${t} ${m}mk #${n}: ${it.prompt} | ${it.answer}`); bad++ }
      if (!it.prompt.trim() || !it.answer.trim() || !it.explanation.trim()) { console.log(`EMPTY  ${t} ${m}mk #${n}`); bad++ }
    }
    line.push(`${m}mk ${String(cap).padStart(4)}`)
  }
  console.log(`${t.padEnd(28)} ${line.join('   ')}`)
}
console.log(bad === 0 ? '\nevery family delivers the capacity it declares' : `\n${bad} problem(s)`)
process.exit(bad === 0 ? 0 : 1)
