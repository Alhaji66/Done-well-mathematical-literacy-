/**
 * Level 3 items whose prompt NAMES every step it wants.
 *
 * CAPS separates Level 2 from Level 3 on whether the learner has to CHOOSE
 * the procedure. "Calculate the mean attendance, and calculate what percentage
 * of the mean the highest day represents" names both procedures, so the
 * choosing has been done for the learner: that is Level 2 with two steps, not
 * Level 3. Level 3 is where the steps are not all signalled.
 *
 * Deliberately narrow: the prompt must be built from named calculate/determine
 * steps joined by "and", must NOT end on a judgement clause (that is Level 4
 * territory, handled elsewhere), and must not ask the learner to decide or
 * choose anything.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
const SIGNALLED = /^(calculate|determine)\b[^.]*,\s*and\s+(calculate|determine)\b[^.]*\.?$/i
const JUDGEMENT = /\b(state whether|state what|state which|state why|decide|choose|explain why|worth|should)\b/i
const g = Number(process.argv[2]), pn = Number(process.argv[3])
const list: any[] = (await papersForSubject('mat-lit', pn as 1 | 2, g as any)) as any
let marks = 0
const ids: string[] = []
for (const p of list.sort((a, b) => a.id.localeCompare(b.id)))
  for (const s of p.sections)
    for (const i of s.items) {
      if (i.cognitiveLevel !== 3) continue
      if (!SIGNALLED.test(i.prompt.trim())) continue
      if (JUDGEMENT.test(i.prompt)) continue
      marks += i.marks
      ids.push(i.id)
      console.log(`${i.id.padEnd(22)} ${i.marks}mk  ${i.prompt.slice(0, 104)}`)
    }
console.log(`\n${ids.length} items, ${marks} marks`)
console.log(JSON.stringify(ids.map((id) => ({ id, from: 3, to: 2 }))))
