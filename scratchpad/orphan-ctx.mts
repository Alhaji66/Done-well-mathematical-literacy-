/** Each orphaned item with the sibling that supplies the value it refers to. */
import { papersForSubject } from '../src/data/papers/index.ts'
const BACKREF =
  /\b(this|these|those)\s+(volume|figure|amount|value|number|answer|total|cost|price|area|length|distance|time|mass|percentage|result|rate|reading|speed|mean)\b|^(calculate|convert|express|write down|round)\s+(this|that|these)\b/i
const list: any[] = (await papersForSubject('mat-lit')) as any
for (const p of list.sort((a, b) => a.id.localeCompare(b.id)))
  for (const s of p.sections)
    s.items.forEach((i: any, n: number) => {
      if (i.context || !BACKREF.test(i.prompt)) return
      if (/\d/.test(i.prompt.replace(/\([^)]*\)/g, ''))) return
      const prev = s.items[n - 1]
      console.log(`--- ${i.id} [${i.label}] ${i.marks}mk L${i.cognitiveLevel} ${i.difficulty} topic=${i.topicId}`)
      console.log(`  PREV ${prev ? prev.id : '(none)'}: ${prev ? prev.prompt.slice(0, 95) : ''}`)
      console.log(`  PREV ANS: ${prev ? prev.answer : ''}`)
      console.log(`  Q: ${i.prompt}`)
      console.log(`  A: ${i.answer}`)
      console.log(`  E: ${i.explanation}`)
    })
