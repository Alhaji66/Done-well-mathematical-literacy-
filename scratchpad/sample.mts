/**
 * Sample the shortest items in a subject against the cognitive level they were
 * assigned, to see whether the levelling is believable.
 *
 * WHAT THIS FOUND for Mathematics, and it is the reason the script exists:
 * 83 of the 92 one- and two-mark items are labelled Level 1, and the sample
 * shows what they actually are --
 *
 *   L1 [2mk] Solve for x: 5x + 8 = 33
 *   L1 [2mk] Simplify fully: (2x2y3) x (3x-1y) / (4xy2)
 *   L1 [2mk] Determine the 17th term of the arithmetic sequence: 9, 14, 19, ...
 *
 * Those are routine procedures, which is Level 2. Level 1 is knowing a fact.
 * tools/cognitive-level.mts reads the command verb and falls back on MARKS
 * when the prompt is symbolic, so short algebra lands in Level 1 by default --
 * the same failure documented for Physical Sciences in tools/physics-level.mts.
 *
 * The consequence is double-edged and worth stating both ways: Mathematics
 * Level 1 is INFLATED by miscategorised procedures, and it still measures only
 * 0-6.7% against a 25% target. So the gap is real AND the labels are wrong,
 * and any Mathematics weighting work has to re-level by hand before it can
 * trust its own baseline.
 *
 * Run:  npx tsx scratchpad/sample.mts <subject-id>
 */
import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject(process.argv[2])) as any
const all = list.flatMap((p:any)=>p.sections.flatMap((s:any)=>s.items.map((i:any)=>({...i, grade:p.grade, pn:p.paperNumber}))))
const small = all.filter((i:any)=> i.marks <= 2)
console.log(`${all.length} items; ${small.length} of 1-2 marks`)
const dist: Record<number, number> = {}
for (const i of small) dist[i.cognitiveLevel] = (dist[i.cognitiveLevel] ?? 0) + 1
console.log('levels assigned to those small items:', dist)
console.log('\n--- sample of 1-2 mark items and their assigned level ---')
for (let n = 0; n < Math.min(12, small.length); n++) {
  const i = small[Math.floor((n * small.length) / 12)]
  console.log(`  L${i.cognitiveLevel} [${i.marks}mk] ${i.prompt.slice(0, 96)}`)
}
