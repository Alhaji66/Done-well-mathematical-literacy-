/**
 * Find stems that can never match because a \b sits against a non-word char.
 * Decompose each rule of the form \b( a | b | c )\b and test each alternative
 * against a sentence that contains it surrounded by spaces.
 */
import { topics } from '../src/data/topics.ts'
import { subtopicRulesFor } from '../src/data/subtopics.ts'

let dead = 0
for (const topic of topics) {
  for (const rule of subtopicRulesFor(topic.id)) {
    const src = rule.match.source
    // Every \b(...)\b group in the rule.
    for (const group of src.matchAll(/\\b\(([^()]*(?:\([^()]*\)[^()]*)*)\)\\b/g)) {
      for (const alt of group[1].split('|')) {
        // Only alternatives with no regex metacharacters can be tested literally.
        if (/[\\\[\]{}*+?^$]/.test(alt)) continue
        const literal = alt.replace(/[()]/g, '')
        if (!literal || /^[a-z0-9 ]+$/i.test(literal)) continue
        const probe = `the ${literal} of it`
        if (!rule.match.test(probe)) {
          console.log(`  DEAD  ${topic.id} / ${rule.name}: "${literal}" never matches`)
          dead++
        }
      }
    }
  }
}
console.log(dead ? `\n${dead} dead stem(s).` : '\nNo dead stems.')
