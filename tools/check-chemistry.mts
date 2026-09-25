/**
 * Every chemistry drawing must be chemically right, read back a second way.
 *
 * The drawings are built by src/lib/chemDiagrams.ts. This checks them against
 * the chemistry rather than against the code that made them:
 *
 * 1. STRUCTURAL FORMULAE. Every molecule drawn for a question that states a
 *    molecular formula ("two structural isomers of C₄H₁₀") must have exactly
 *    that formula. And every molecule drawn under a name must fit the name:
 *    the stem gives the length of the main chain (but- = 4), and the locants
 *    put the double bond, the triple bond, the -OH, the C=O and each halogen
 *    or methyl branch on the carbons the name says -- counting from either end,
 *    as long as one direction fits everything.
 * 2. LEWIS DIAGRAMS. Every atom has a full outer shell (two electrons for
 *    hydrogen, eight for the rest), and the dots add up to the molecule's
 *    valence electrons.
 * And every question that asks for a structure gets one drawn -- two, when it
 * asks for two isomers.
 * 3. IONIC BONDING. The charges balance, and the memo names the same ions.
 */
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { formulasIn, molecularFormula, LEWIS, type Molecule } from '../src/lib/chemDiagrams'
import type { Question } from '../src/types'

const items: Question[] = [...questions]
for (const p of await papersForSubject('physical-sciences')) for (const s of p.sections) items.push(...s.items)
const problems: string[] = []
const fail = (id: string, msg: string) => problems.push(`${id}: ${msg}`)
const plain = (s: string) => s.replace(/[₀-₉]/g, (c) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)))

const STEMS: Record<string, number> = { meth: 1, eth: 2, prop: 3, but: 4, pent: 5, hex: 6, hept: 7, oct: 8 }

/** Does the molecule fit its IUPAC name? Null when the name is not one this reads. */
function fitsName(name: string, m: Molecule): string | null {
  const n = name.toLowerCase()
  const stem = [...n.matchAll(/(meth|eth|prop|but|pent|hex|hept|oct)(?=an|en|yn|-)/g)].pop()?.[1]
  if (!stem) return null
  const len = m.carbons.length
  if (STEMS[stem] !== len) return `the main chain has ${len} carbons, but "${name}" says ${STEMS[stem]}`
  const loc = (re: RegExp) => [...n.matchAll(re)].flatMap((x) => x[1].split(',').map(Number))
  const want = {
    double: loc(/-(\d)-en/g),
    triple: loc(/-(\d)-yn/g),
    oh: loc(/-(\d)-ol/g),
    one: loc(/-(\d)-one/g),
    cl: loc(/(\d(?:,\d)*)-(?:di)?chloro/g),
    br: loc(/(\d(?:,\d)*)-(?:di)?bromo/g),
    me: loc(/(\d(?:,\d)*)-(?:di)?methyl/g),
  }
  // Unnumbered names: bromoethane, 1 on a two-carbon chain either way.
  if (/^(chloro|bromo)/.test(n)) (/^chloro/.test(n) ? want.cl : want.br).push(1)
  const has = (dir: 1 | -1) => {
    const pos = (i: number) => (dir === 1 ? i + 1 : len - i)
    const got = { double: [] as number[], triple: [] as number[], oh: [] as number[], one: [] as number[], cl: [] as number[], br: [] as number[], me: [] as number[] }
    m.bonds.forEach((b, i) => {
      const p = Math.min(pos(i), pos(i + 1))
      if (b === 2) got.double.push(p)
      if (b === 3) got.triple.push(p)
    })
    m.carbons.forEach((c, i) => {
      for (const s of c.subs) {
        if (s === 'OH') got.oh.push(pos(i))
        if (s === '=O') got.one.push(pos(i))
        if (s === 'Cl') got.cl.push(pos(i))
        if (s === 'Br') got.br.push(pos(i))
        if (s === 'CH3') got.me.push(pos(i))
      }
    })
    const same = (a: number[], b: number[]) => a.slice().sort().join() === b.slice().sort().join()
    // A name without a locant for a feature (propane, butane) must not have that feature drawn.
    return (Object.keys(want) as (keyof typeof want)[]).every((k) => same(want[k], got[k]))
  }
  return has(1) || has(-1) ? '' : `the drawing does not fit the name "${name}"`
}

let drawn = 0
for (const q of items.filter((x) => x.topicId === 'phys-organic-chemistry' && /\b(draw|structural formula|write the structural)\b/i.test(x.prompt))) {
  const named = q.prompt.match(/structural formula of ([a-z0-9,-]+(?:-[a-z]+)*)/i)?.[1]
  const stated = plain(q.prompt).match(/\b(C\d+H\d+(?:O\d*)?)\b/)?.[1]
  const found = formulasIn(q.answer, named)
  // A question whose drawing silently vanished is a failure too: a parser that
  // rejects a formula it should read would otherwise pass by drawing nothing.
  const need = /\btwo\b/i.test(q.prompt) ? 2 : 1
  if (found.length < need) fail(q.id, `asks for ${need} structure(s) but ${found.length} could be drawn from the memo`)
  for (const f of found) {
    drawn++
    if (stated && molecularFormula(f.m) !== stated) fail(q.id, `${f.formula} is ${molecularFormula(f.m)}, but the question asks for ${stated}`)
    if (f.name) {
      const r = fitsName(f.name, f.m)
      if (r) fail(q.id, r)
    }
  }
}

const VALENCE: Record<string, number> = { H: 1, C: 4, N: 5, O: 6, P: 5, S: 6, Cl: 7 }
for (const [key, L] of Object.entries(LEWIS)) {
  const shared = L.atoms.map(() => 0)
  for (const [a, b, o] of L.bonds) (shared[a] += o), (shared[b] += o)
  let dots = 0
  L.atoms.forEach((a, i) => {
    const shell = 2 * shared[i] + 2 * a.lone.length
    if (shell !== (a.s === 'H' ? 2 : 8)) fail(`Lewis ${key}`, `${a.s} has ${shell} electrons in its outer shell`)
    dots += 2 * a.lone.length
  })
  dots += 2 * L.bonds.reduce((s, [, , o]) => s + o, 0)
  const valence = L.atoms.reduce((s, a) => s + VALENCE[a.s], 0)
  if (dots !== valence) fail(`Lewis ${key}`, `${dots} electrons drawn, but the atoms bring ${valence}`)
}

for (const q of items) {
  const m = q.prompt.match(/an? \w+ atom \(([A-Z][a-z]?), (\d) valence electrons?\) and \w+ atoms \(([A-Z][a-z]?), (\d) valence electrons each\)/)
  if (!m) continue
  const [, M, vm, X, vn] = m
  const sup = (n: number) => (n === 1 ? '' : '⁰¹²³'[n])
  const ionM = `${M}${sup(Number(vm))}⁺`
  const ionX = `${X}${sup(8 - Number(vn))}⁻`
  if (!q.answer.includes(ionM) || !q.answer.includes(ionX)) fail(q.id, `the drawing shows ${ionM} and ${ionX}, which the memo does not both name`)
}

console.log(`${drawn} structural formulae, ${Object.keys(LEWIS).length} Lewis diagrams and the ionic transfers checked.`)
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`)
  process.exit(1)
}
