import { papersForSubject } from '../src/data/papers/index.ts'
import { classify } from '../tools/cognitive-level.mts'

/*
 * Candidate: a compound item whose FINAL clause asks which of two results to
 * act on, or what a result actually means. Deliberately requires a comparative
 * or a modal of obligation -- "state which figure is larger" is arithmetic,
 * "state which figure the clinic should use" is a judgement.
 */
const CANDIDATE =
  /\b((state|explain|say|decide) (whether|which|why)[^.]{0,80}\b(better|best|more useful|more appropriate|more reliable|more representative|should (be )?(use|used|rely|relied|choose|chosen|take|taken)|actually means|really means|means that|is the same as|qualifies as|counts as)\b)/i

const list: any[] = (await papersForSubject('mat-lit')) as any
const all = list.flatMap((p: any) => p.sections.flatMap((s: any) => s.items.map((i: any) => ({ ...i, grade: p.grade }))))

const moved = all.filter((i: any) => {
  const got: any = classify(i)
  const level = typeof got === 'number' ? got : got.level
  return level !== 4 && CANDIDATE.test(i.prompt)
})

const marks = moved.reduce((s: number, i: any) => s + i.marks, 0)
console.log(`${all.length} Mat Lit items scanned`)
console.log(`newly matched by the candidate: ${moved.length} items, ${marks} marks`)
const from: Record<number, number> = {}
for (const i of moved) {
  const got: any = classify(i)
  const l = typeof got === 'number' ? got : got.level
  from[l] = (from[l] ?? 0) + 1
}
console.log('currently labelled:', from)
console.log('\n--- an even spread of what it would move, to judge by hand ---')
for (let n = 0; n < Math.min(14, moved.length); n++) {
  const i = moved[Math.floor((n * moved.length) / Math.min(14, moved.length))]
  console.log(`  [${i.marks}mk] ${i.prompt.slice(-150)}`)
}
