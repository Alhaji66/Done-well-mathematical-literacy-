import type { Question, SceneSpec, ScenePoint } from '@/types'

/**
 * Chemistry drawings, shown with the answer:
 *
 * - STRUCTURAL FORMULAE. "Draw the structural formula of but-2-ene" is
 *   answered in the memo with a condensed formula, CH₃−CH=CH−CH₃, and a
 *   learner checking their drawing against a line of text has to translate it
 *   first. This reads the condensed formula and draws it out in full -- every
 *   carbon, every hydrogen, every bond -- the way the exam wants it drawn.
 *   A formula that does not come out with four bonds on every carbon is not
 *   drawn at all.
 * - LEWIS DIAGRAMS for the small molecules the syllabus names.
 * - IONIC BONDING as electron transfer, from the valence electrons the
 *   question gives.
 */

type Q = Pick<Question, 'id' | 'topicId' | 'prompt' | 'context' | 'answer'>

const pt = (id: string, x: number, y: number): ScenePoint => ({ id, x, y })
const sub = (s: string) => s.replace(/[₀-₉]/g, (c) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)))

/* ------------------------------------------------------------------ */
/* Condensed formula -> molecule                                       */
/* ------------------------------------------------------------------ */

type Sub = 'CH3' | 'C2H5' | 'OH' | 'Cl' | 'Br' | '=O'
export interface Carbon {
  h: number
  subs: Sub[]
}
export interface Molecule {
  carbons: Carbon[]
  /** Bond order between carbon i and i + 1. */
  bonds: number[]
}

const SUB_VALENCE: Record<Sub, number> = { CH3: 1, C2H5: 1, OH: 1, Cl: 1, Br: 1, '=O': 2 }

/** CH₃−CH(OH)−CH₃, CH₃CH₂CH₂OH, CH≡C−CH₂−CH₃, CH₃−CO−CH₂−CH₃ ... or null. */
export function parseCondensed(raw: string): Molecule | null {
  const s = sub(raw).replace(/[−–-]/g, '-').replace(/\s+/g, '')
  const carbons: Carbon[] = []
  const bonds: number[] = []
  let i = 0
  let pending = 1
  while (i < s.length) {
    const ch = s[i]
    if (ch === '-') {
      pending = 1
      i++
      continue
    }
    if (ch === '=') {
      pending = 2
      i++
      continue
    }
    if (ch === '≡') {
      pending = 3
      i++
      continue
    }
    // A substituent standing on its own after a bond belongs to the carbon before it.
    const lone = s.slice(i).match(/^(OH|Cl|Br)/)
    if (lone && carbons.length) {
      carbons[carbons.length - 1].subs.push(lone[1] as Sub)
      i += lone[1].length
      pending = 1
      continue
    }
    const m = s.slice(i).match(/^C(?:H(\d)?)?/)
    if (!m) return null
    if (carbons.length) bonds.push(pending)
    pending = 1
    const c: Carbon = { h: m[0].length === 1 ? 0 : Number(m[1] ?? 1), subs: [] }
    i += m[0].length
    // Branches and attached groups.
    for (;;) {
      const b = s.slice(i).match(/^\((CH3|C2H5|CH2CH3|OH|Cl|Br)\)/)
      if (b) {
        c.subs.push(b[1] === 'CH2CH3' ? 'C2H5' : (b[1] as Sub))
        i += b[0].length
        continue
      }
      const a = s.slice(i).match(/^(OH|Cl|Br)/)
      if (a) {
        c.subs.push(a[1] as Sub)
        i += a[1].length
        continue
      }
      // "CO" in a chain: a carbonyl, C=O.
      if (s[i] === 'O' && c.h === 0) {
        c.subs.push('=O')
        i++
        continue
      }
      break
    }
    carbons.push(c)
  }
  if (!carbons.length) return null
  // Every carbon must end up with exactly four bonds.
  for (let k = 0; k < carbons.length; k++) {
    const c = carbons[k]
    const used = c.h + c.subs.reduce((a, x) => a + SUB_VALENCE[x], 0) + (bonds[k - 1] ?? 0) + (bonds[k] ?? 0)
    if (used !== 4) return null
  }
  return { carbons, bonds }
}

/** C₄H₁₀O, counted off the molecule, to compare with the question. */
export function molecularFormula(m: Molecule): string {
  let c = m.carbons.length
  let h = 0
  let o = 0
  let cl = 0
  let br = 0
  for (const k of m.carbons) {
    h += k.h
    for (const s of k.subs) {
      if (s === 'CH3') (c += 1), (h += 3)
      if (s === 'C2H5') (c += 2), (h += 5)
      if (s === 'OH') (o += 1), (h += 1)
      if (s === '=O') o += 1
      if (s === 'Cl') cl += 1
      if (s === 'Br') br += 1
    }
  }
  return `C${c}H${h}${o ? `O${o > 1 ? o : ''}` : ''}${cl ? `Cl${cl > 1 ? cl : ''}` : ''}${br ? `Br${br > 1 ? br : ''}` : ''}`
}

/* ------------------------------------------------------------------ */
/* Molecule -> drawing                                                 */
/* ------------------------------------------------------------------ */

const DIRS = { up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0] } as const
type Dir = keyof typeof DIRS

export function structuralScene(m: Molecule, title: string): SceneSpec {
  const points: ScenePoint[] = []
  const segments: NonNullable<SceneSpec['segments']> = []
  const texts: NonNullable<SceneSpec['texts']> = []
  let n = 0
  const atom = (x: number, y: number, symbol: string) => {
    const id = `a${n++}`
    texts.push({ x, y, text: symbol, size: 13 })
    return { id, x, y }
  }
  /** A bond drawn between two atoms, stopping short of each letter. */
  const bond = (a: { x: number; y: number }, b: { x: number; y: number }, order = 1) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy)
    const ux = dx / len
    const uy = dy / len
    const gap = 0.36
    for (let k = 0; k < order; k++) {
      const off = (k - (order - 1) / 2) * 0.16
      const p = pt(`b${n++}`, a.x + ux * gap - uy * off, a.y + uy * gap + ux * off)
      const q = pt(`b${n++}`, b.x - ux * gap - uy * off, b.y - uy * gap + ux * off)
      points.push(p, q)
      segments.push({ a: p.id, b: q.id })
    }
  }
  const STEP = 1.8
  const main = m.carbons.map((_, i) => atom(i * STEP * 1.2, 0, 'C'))
  m.bonds.forEach((o, i) => bond(main[i], main[i + 1], o))
  m.carbons.forEach((c, i) => {
    const free: Dir[] = ['up', 'down']
    if (i === 0) free.unshift('left')
    if (i === m.carbons.length - 1) free.push('right')
    // A double bond to the next carbon still leaves up and down free.
    const place = (d: Dir) => free.splice(free.indexOf(d), 1)
    const next = (): Dir => {
      const d = free.find((x) => x === 'up') ?? free.find((x) => x === 'down') ?? free[0]
      place(d)
      return d
    }
    const C = main[i]
    for (const s of c.subs) {
      const d = next()
      const [ux, uy] = DIRS[d]
      if (s === 'CH3' || s === 'C2H5') {
        const b1 = atom(C.x + ux * STEP, C.y + uy * STEP, 'C')
        bond(C, b1)
        let tip = b1
        if (s === 'C2H5') {
          const b2 = atom(b1.x + ux * STEP, b1.y + uy * STEP, 'C')
          bond(b1, b2)
          for (const [hx, hy] of [
            [-1, 0],
            [1, 0],
          ]) bond(b1, atom(b1.x + hx * 1.2, b1.y + hy * 1.2, 'H'))
          tip = b2
        }
        for (const [hx, hy] of [
          [-1, 0],
          [1, 0],
          [ux, uy],
        ]) bond(tip, atom(tip.x + hx * 1.2, tip.y + hy * 1.2, 'H'))
      } else if (s === 'OH') {
        const o = atom(C.x + ux * STEP, C.y + uy * STEP, 'O')
        bond(C, o)
        bond(o, atom(o.x + ux * 1.3, o.y + uy * 1.3, 'H'))
      } else if (s === '=O') {
        bond(C, atom(C.x + ux * STEP, C.y + uy * STEP, 'O'), 2)
      } else {
        bond(C, atom(C.x + ux * STEP, C.y + uy * STEP, s))
      }
    }
    for (let k = 0; k < c.h; k++) {
      const d = next()
      const [ux, uy] = DIRS[d]
      bond(C, atom(C.x + ux * 1.3, C.y + uy * 1.3, 'H'))
    }
  })
  return { title, points, segments, texts, toScale: false, schematic: true }
}

/** Every condensed formula in a memo, each with the name written beside it. */
export function formulasIn(answer: string, fallbackName?: string): { name: string; m: Molecule; formula: string }[] {
  const out: { name: string; m: Molecule; formula: string }[] = []
  // A carbon is "C" not followed by "l" -- the C of Cl is chlorine.
  const re = /(?:CH[₀-₉]?|C(?!l))(?:[−–=≡-]?(?:C(?!l)(?:H[₀-₉]?)?(?:O(?!H))?|\((?:CH₃|OH|Cl|Br|CH₂CH₃)\)|OH|Cl|Br))+/g
  // IUPAC-looking names only: 2-methylpropane, but-1-ene, propan-2-ol, butan-2-one.
  const iupac = /^(?:\d+(?:,\d+)*-)?[A-Za-z]+(?:-\d+(?:,\d+)*-[a-z]+)*$/
  const looksNamed = (w: string) => iupac.test(w) && /(ane|ene|yne|ol|one|al)$/i.test(w)
  for (const m of answer.matchAll(re)) {
    const mol = parseCondensed(m[0])
    if (!mol) continue
    const before = answer.slice(0, m.index).match(/([A-Za-z0-9,-]+)\s*\($/)?.[1]
    const after = answer.slice((m.index ?? 0) + m[0].length).match(/^\s*\(([A-Za-z0-9,-]+)\)/)?.[1]
    const name = [before, after].find((w) => w && looksNamed(w)) ?? fallbackName ?? ''
    out.push({ name, m: mol, formula: m[0] })
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Lewis diagrams                                                      */
/* ------------------------------------------------------------------ */

interface Lewis {
  atoms: { s: string; x: number; y: number; lone: Dir[] }[]
  bonds: [number, number, number][]
}

export const LEWIS: Record<string, Lewis> = {
  NH3: { atoms: [{ s: 'N', x: 0, y: 0, lone: ['up'] }, { s: 'H', x: -2, y: 0, lone: [] }, { s: 'H', x: 2, y: 0, lone: [] }, { s: 'H', x: 0, y: -2, lone: [] }], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] },
  PH3: { atoms: [{ s: 'P', x: 0, y: 0, lone: ['up'] }, { s: 'H', x: -2, y: 0, lone: [] }, { s: 'H', x: 2, y: 0, lone: [] }, { s: 'H', x: 0, y: -2, lone: [] }], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] },
  H2O: { atoms: [{ s: 'O', x: 0, y: 0, lone: ['up', 'down'] }, { s: 'H', x: -2, y: 0, lone: [] }, { s: 'H', x: 2, y: 0, lone: [] }], bonds: [[0, 1, 1], [0, 2, 1]] },
  H2S: { atoms: [{ s: 'S', x: 0, y: 0, lone: ['up', 'down'] }, { s: 'H', x: -2, y: 0, lone: [] }, { s: 'H', x: 2, y: 0, lone: [] }], bonds: [[0, 1, 1], [0, 2, 1]] },
  CO2: { atoms: [{ s: 'C', x: 0, y: 0, lone: [] }, { s: 'O', x: -2.4, y: 0, lone: ['up', 'down'] }, { s: 'O', x: 2.4, y: 0, lone: ['up', 'down'] }], bonds: [[0, 1, 2], [0, 2, 2]] },
  N2: { atoms: [{ s: 'N', x: 0, y: 0, lone: ['left'] }, { s: 'N', x: 2.4, y: 0, lone: ['right'] }], bonds: [[0, 1, 3]] },
  O2: { atoms: [{ s: 'O', x: 0, y: 0, lone: ['up', 'down'] }, { s: 'O', x: 2.4, y: 0, lone: ['up', 'down'] }], bonds: [[0, 1, 2]] },
  Cl2: { atoms: [{ s: 'Cl', x: 0, y: 0, lone: ['up', 'down', 'left'] }, { s: 'Cl', x: 2.4, y: 0, lone: ['up', 'down', 'right'] }], bonds: [[0, 1, 1]] },
  HCl: { atoms: [{ s: 'H', x: 0, y: 0, lone: [] }, { s: 'Cl', x: 2.2, y: 0, lone: ['up', 'down', 'right'] }], bonds: [[0, 1, 1]] },
  CH4: { atoms: [{ s: 'C', x: 0, y: 0, lone: [] }, { s: 'H', x: -2, y: 0, lone: [] }, { s: 'H', x: 2, y: 0, lone: [] }, { s: 'H', x: 0, y: 2, lone: [] }, { s: 'H', x: 0, y: -2, lone: [] }], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
}

function lewisScene(key: string): SceneSpec {
  const L = LEWIS[key]
  const discs: NonNullable<SceneSpec['discs']> = []
  const dot = (x: number, y: number) => discs.push({ x, y, r: 0.06, fill: 'ink' })
  const pair = (x: number, y: number, horizontal: boolean) => {
    if (horizontal) (dot(x - 0.17, y), dot(x + 0.17, y))
    else (dot(x, y - 0.17), dot(x, y + 0.17))
  }
  for (const [a, b, order] of L.bonds) {
    const A = L.atoms[a]
    const B = L.atoms[b]
    const mx = (A.x + B.x) / 2
    const my = (A.y + B.y) / 2
    const horizontal = A.y === B.y
    // Shared pairs sit between the two atoms, stacked across the bond.
    // Each shared pair is a pair of dots across the bond; a double or triple
    // bond puts its pairs side by side along it.
    for (let k = 0; k < order; k++) {
      const off = (k - (order - 1) / 2) * 0.32
      if (horizontal) pair(mx + off, my, false)
      else pair(mx, my + off, true)
    }
  }
  for (const A of L.atoms)
    for (const d of A.lone) {
      const [ux, uy] = DIRS[d]
      pair(A.x + ux * 0.62, A.y + uy * 0.62, uy !== 0)
    }
  const pretty = key.replace(/(\d)/g, (c) => '₀₁₂₃₄₅₆₇₈₉'[Number(c)])
  return {
    title: `Lewis diagram of ${pretty}`,
    points: L.atoms.map((a, i) => pt(`l${i}`, a.x, a.y)),
    discs,
    texts: L.atoms.map((a) => ({ x: a.x, y: a.y, text: a.s, size: 17 })),
    notes: ['Each pair of dots between two atoms is a shared (bonding) pair; each pair on one atom alone is a lone pair.'],
    toScale: false,
    schematic: true,
  }
}

/* ------------------------------------------------------------------ */
/* Ionic bonding                                                       */
/* ------------------------------------------------------------------ */

const SUP: Record<string, string> = { '1': '', '2': '²', '3': '³' }

function ionicScene(metal: string, vm: number, nonmetal: string, vn: number): SceneSpec | null {
  const gain = 8 - vn
  if (gain < 1 || vm < 1 || vm > 3) return null
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a)
  const d = g(vm, gain)
  const nM = gain / d
  const nX = vm / d
  const discs: NonNullable<SceneSpec['discs']> = []
  const texts: NonNullable<SceneSpec['texts']> = []
  const points: ScenePoint[] = []
  const segments: NonNullable<SceneSpec['segments']> = []
  const around = (x: number, y: number, count: number, fill: 'ink' | 'accent') => {
    const spots: [number, number][] = [
      [0, 0.75], [0.2, 0.75], [0.75, 0], [0.75, -0.2], [0, -0.75], [-0.2, -0.75], [-0.75, 0], [-0.75, 0.2],
    ]
    spots.slice(0, count).forEach(([dx, dy]) => discs.push({ x: x + dx, y: y + dy, r: 0.08, fill }))
  }
  // Before: atoms with their valence electrons.
  const top = 3
  for (let i = 0; i < nM; i++) {
    texts.push({ x: i * 2.2, y: top, text: metal, size: 14 })
    around(i * 2.2, top, vm, 'accent')
  }
  const x0 = nM * 2.2 + 1.4
  for (let j = 0; j < nX; j++) {
    texts.push({ x: x0 + j * 2.4, y: top, text: nonmetal, size: 14 })
    around(x0 + j * 2.4, top, vn, 'ink')
  }
  points.push(pt('t0', (nM - 1) * 1.1 + 0.9, top + 0.9), pt('t1', x0 + (nX - 1) * 1.2 - 0.9, top + 0.9))
  segments.push({ a: 't0', b: 't1', arrow: true, accent: true })
  texts.push({ x: ((nM - 1) * 1.1 + x0 + (nX - 1) * 1.2) / 2, y: top + 1.5, text: 'electrons transferred', size: 9, accent: true })
  // After: ions in brackets with their charges.
  const bottom = 0
  const cM = `${SUP[String(vm)]}⁺`
  const cX = `${SUP[String(gain)]}⁻`
  for (let i = 0; i < nM; i++) texts.push({ x: i * 2.2, y: bottom, text: `[${metal}]${cM}`, size: 13 })
  for (let j = 0; j < nX; j++) {
    texts.push({ x: x0 + j * 2.4, y: bottom, text: `[${nonmetal}]${cX}`, size: 13 })
    around(x0 + j * 2.4 - 0.2, bottom, 8, 'ink')
  }
  points.push(pt('d0', -1, top - 1.4), pt('d1', x0 + (nX - 1) * 2.4 + 1, top - 1.4))
  segments.push({ a: 'd0', b: 'd1', dashed: true })
  return {
    title: `Ionic bonding: ${metal} gives electrons to ${nonmetal}`,
    points,
    segments,
    discs,
    texts,
    notes: [`Each ${metal} atom loses its valence electrons; each ${nonmetal} atom gains enough to complete its octet. The oppositely charged ions attract.`],
    toScale: false,
    schematic: true,
  }
}

/* ------------------------------------------------------------------ */

export function chemDiagramsFor(q: Q): SceneSpec[] {
  const t = [q.context ?? '', q.prompt].join(' ')
  const out: SceneSpec[] = []

  if (q.topicId === 'phys-organic-chemistry' && /\b(draw|structural formula|write the structural)\b/i.test(q.prompt)) {
    const named = q.prompt.match(/structural formula of ([a-z0-9,-]+(?:-[a-z]+)*)/i)?.[1]
    for (const f of formulasIn(q.answer, named)) out.push(structuralScene(f.m, f.name ? `${f.name.charAt(0).toUpperCase()}${f.name.slice(1)}` : 'Structural formula'))
  }

  const lewis =
    t.match(/(?:Lewis|electron dot)[^.]*?(?:molecule of|for) (?:[a-z ]+, )?([A-Z][a-z]?[₀-₉]?(?:[A-Z][a-z]?[₀-₉]?)*)/)?.[1] ??
    t.match(/to form an? ([A-Z][a-z]?[₀-₉]) molecule/)?.[1]
  if (lewis && /Lewis|electron dot/i.test(t)) {
    const key = sub(lewis)
    if (LEWIS[key]) out.push(lewisScene(key))
  }

  const ionic = t.match(/an? \w+ atom \(([A-Z][a-z]?), (\d) valence electrons?\) and \w+ atoms \(([A-Z][a-z]?), (\d) valence electrons each\)/)
  if (ionic) {
    const s = ionicScene(ionic[1], Number(ionic[2]), ionic[3], Number(ionic[4]))
    if (s) out.push(s)
  }
  return out
}
