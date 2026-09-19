import { topics } from '../src/data/topics.ts'
import { subtopicRulesFor } from '../src/data/subtopics.ts'

/** Split a group's source on top-level | (not inside parens or classes). */
const alternatives = (src: string): string[] => {
  const out: string[] = []
  let depth = 0, cls = false, cur = ''
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (c === '\\') { cur += c + (src[i + 1] ?? ''); i++; continue }
    if (cls) { cls = c !== ']'; cur += c; continue }
    if (c === '[') { cls = true; cur += c; continue }
    if (c === '(') depth++
    if (c === ')') depth--
    if (c === '|' && depth === 0) { out.push(cur); cur = ''; continue }
    cur += c
  }
  out.push(cur)
  return out
}

const word = (c: string) => /[A-Za-z0-9_]/.test(c)
/** Can a \b sit at this end of the alternative? */
const badEnd = (alt: string) => {
  const m = alt.match(/(\\.|.)$/s)!
  const t = m[1]
  if (t.length === 2) return !word(t[1])            // an escaped literal
  return !word(t) && !'*+?)]}'.includes(t)          // a bare literal, not a quantifier or closer
}
const badStart = (alt: string) => {
  const m = alt.match(/^(\\.|.)/s)!
  const t = m[1]
  if (t.length === 2) return !word(t[1])
  return !word(t) && !'(['.includes(t)
}

let n = 0
for (const topic of topics) {
  for (const rule of subtopicRulesFor(topic.id)) {
    for (const g of rule.match.source.matchAll(/\\b\(((?:[^()\\]|\\.|\((?:[^()\\]|\\.)*\))*)\)\\b/g)) {
      for (const alt of alternatives(g[1])) {
        const bad = [badStart(alt) && 'leading \\b', badEnd(alt) && 'trailing \\b'].filter(Boolean)
        if (bad.length) { console.log(`  ${topic.id} / ${rule.name}: "${alt}" — ${bad.join(' and ')} can never match`); n++ }
      }
    }
  }
}
console.log(n ? `\n${n} dead stem(s).` : '\nNo dead stems.')
