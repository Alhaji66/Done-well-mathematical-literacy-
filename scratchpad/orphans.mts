/**
 * Items whose prompt points at a value they do not carry.
 *
 * "Convert this volume to litres" is answerable inside a paper, where the
 * previous item worked the volume out, and unanswerable anywhere else. The app
 * shows items outside their paper -- topic practice, search, the weekly test --
 * so a back-reference with no `context` of its own is a broken question.
 *
 * THE NUMBER TEST NEEDS CARE. A first pass dismissed any prompt containing a
 * digit, on the grounds that the value might be stated inline. That let the
 * single worst case through: "Convert this volume to litres (1 m³ = 1 000
 * litres)" has digits, but they are the CONVERSION FACTOR, not the volume.
 * Parenthesised text is therefore stripped before the test.
 */
import { papersForSubject } from '../src/data/papers/index.ts'

/*
 * "that" is deliberately absent from the noun branch. It is far more often a
 * relative pronoun than a demonstrative -- "properties of water THAT RESULT
 * from hydrogen bonding" is not a back-reference -- and including it produced
 * 14 Physical Sciences hits of which 14 were false. "this/these/those" before
 * a quantity noun does not have that ambiguity.
 */
const BACKREF =
  /\b(this|these|those)\s+(volume|figure|amount|value|number|answer|total|cost|price|area|length|distance|time|mass|percentage|result|rate|reading|speed|mean)\b|^(calculate|convert|express|write down|round)\s+(this|that|these)\b/i

for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const bad: any[] = []
  let total = 0
  for (const p of list)
    for (const s of p.sections)
      for (const i of s.items) {
        total++
        if (i.context) continue
        if (!BACKREF.test(i.prompt)) continue
        // Only digits OUTSIDE parentheses can be the value being referred to.
        if (/\d/.test(i.prompt.replace(/\([^)]*\)/g, ''))) continue
        bad.push({ ...i, paper: p.id })
      }
  console.log(`\n=== ${subject}: ${bad.length} orphaned of ${total} items`)
  const byPrompt = new Map<string, any[]>()
  for (const b of bad) byPrompt.set(b.prompt, [...(byPrompt.get(b.prompt) ?? []), b])
  for (const [prompt, items] of [...byPrompt.entries()].sort((a, b) => b[1].length - a[1].length))
    console.log(`  ×${String(items.length).padStart(2)}  [${items[0].marks}mk]  ${prompt.slice(0, 92)}`)
}
