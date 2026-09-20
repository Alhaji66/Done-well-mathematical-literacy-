/**
 * For each Mathematics cell, solve for the split marks and relevel marks that
 * put ALL FOUR levels inside their CAPS bands at once.
 *
 * Splitting peels n marks off an item at level L into a new Level 1 item:
 *   L1 += n, L_L -= n.  The paper total never changes.
 * Relevelling moves marks between L2 and L3 without touching L1.
 *
 * The solver aims at the MIDDLE of each band, not the edge, so that a later
 * item added anywhere cannot push a cell straight back out of compliance.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { capsWeightingFor, WEIGHTING_TOLERANCE as TOL } from '../src/data/capsWeighting.ts'

const list: any[] = (await papersForSubject('mathematics')) as any
type Cell = { mk: Record<number, number>; t: number; g: number; sup: Record<number, number> }
const cells = new Map<string, Cell>()
for (const p of list) {
  const k = `G${p.grade} P${p.paperNumber}`
  const c = cells.get(k) ?? { mk: { 1: 0, 2: 0, 3: 0, 4: 0 }, t: 0, g: p.grade, sup: { 2: 0, 3: 0 } }
  for (const s of p.sections)
    for (const i of s.items) {
      c.mk[i.cognitiveLevel] += i.marks
      c.t += i.marks
      // a 4mk+ item can give up 2 marks; a 3mk item can give up 1
      if (i.cognitiveLevel === 2 || i.cognitiveLevel === 3)
        c.sup[i.cognitiveLevel] += i.marks >= 4 ? 2 : i.marks === 3 ? 1 : 0
    }
  cells.set(k, c)
}

for (const k of [...cells.keys()].sort()) {
  const c = cells.get(k)!
  const w = capsWeightingFor('mathematics', c.g as any)!
  const want = { 1: w.level1, 2: w.level2, 3: w.level3, 4: w.level4 }
  // target the band middle for L1; keep L4 where it is (already compliant)
  const tgt1 = Math.round((want[1] / 100) * c.t)
  const peel = tgt1 - c.mk[1] // total marks to move into L1
  // after peeling, L2+L3 must be split so both sit mid-band
  const rest = c.mk[2] + c.mk[3] - peel
  const share2 = want[2] / (want[2] + want[3])
  const tgt2 = Math.round(rest * share2)
  const tgt3 = rest - tgt2
  // choose peel split so neither source is drained below its target
  const peel3 = Math.max(0, Math.min(peel, c.mk[3] - tgt3))
  const peel2 = peel - peel3
  const after2 = c.mk[2] - peel2
  const relevel = after2 - tgt2 // >0: L2 -> L3, <0: L3 -> L2
  const pc = (n: number) => ((n / c.t) * 100).toFixed(1) + '%'
  console.log(
    `${k}  total ${c.t}\n` +
      `   now   L1 ${pc(c.mk[1])}  L2 ${pc(c.mk[2])}  L3 ${pc(c.mk[3])}  L4 ${pc(c.mk[4])}\n` +
      `   want  L1 ${want[1]}±${TOL}  L2 ${want[2]}±${TOL}  L3 ${want[3]}±${TOL}  L4 ${want[4]}±${TOL}\n` +
      `   peel ${peel} marks into L1:  ${peel2} from L2 (supply ${c.sup[2]}),  ${peel3} from L3 (supply ${c.sup[3]})\n` +
      `   then relevel ${Math.abs(relevel)} marks  ${relevel >= 0 ? 'L2 -> L3' : 'L3 -> L2'}\n` +
      `   ends  L1 ${pc(tgt1)}  L2 ${pc(tgt2)}  L3 ${pc(tgt3)}  L4 ${pc(c.mk[4])}`,
  )
}
