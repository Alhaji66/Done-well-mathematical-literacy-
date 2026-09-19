/**
 * Fail if any item's prompt points at a value the item does not carry.
 *
 * WHY THIS IS A BUG AND NOT A STYLE POINT. "Convert this volume to litres" is
 * answerable inside a paper, where the previous item worked the volume out. The
 * app shows items OUTSIDE their paper -- topic practice, search, the weekly
 * test -- and there the learner is asked to convert a volume they were never
 * given. Thirty-two such items were found in Mathematical Literacy, twenty-six
 * of them the same prompt, and every one of them was unanswerable in practice
 * mode while looking perfectly fine in the paper it was written for.
 *
 * The fix is to restate the value in the prompt, which is also better exam
 * practice: a candidate who gets 4.1 wrong can still earn the marks for 4.2.
 *
 * TWO THINGS THIS RULE GETS RIGHT ONLY BECAUSE THEY WERE GOT WRONG FIRST:
 *
 *   "that" is not in the noun branch. It is far more often a relative pronoun
 *   than a demonstrative -- "properties of water THAT RESULT from hydrogen
 *   bonding" is not a back-reference -- and including it produced fourteen
 *   Physical Sciences hits, all fourteen false.
 *
 *   Parenthesised text is stripped before the "does the prompt state a number?"
 *   test. A first pass dismissed any prompt containing a digit, which let the
 *   single worst case through: "Convert this volume to litres (1 m³ = 1 000
 *   litres)" has digits, but they are the conversion factor, not the volume.
 *
 *   npm run check:orphans
 */
import { papersForSubject } from '../src/data/papers/index.ts'

const BACKREF =
  /\b(this|these|those)\s+(volume|figure|amount|value|number|answer|total|cost|price|area|length|distance|time|mass|percentage|result|rate|reading|speed|mean)\b|^(calculate|convert|express|write down|round)\s+(this|that|these)\b/i

let bad = 0
let checked = 0
for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  for (const p of list)
    for (const s of p.sections)
      for (const i of s.items) {
        checked++
        if (i.context) continue
        if (!BACKREF.test(i.prompt)) continue
        if (/\d/.test(i.prompt.replace(/\([^)]*\)/g, ''))) continue
        bad++
        console.error(`  ${p.id} ${i.id}\n      ${i.prompt}`)
      }
}

if (bad) {
  console.error(
    `\n${bad} item(s) refer to a value they do not state. Restate it in the prompt,\n` +
      'or give the item a context of its own. See the comment in this file.',
  )
  process.exit(1)
}
console.log(`Checked ${checked} items. Every prompt states the values it asks about.`)
