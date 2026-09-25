import type { Question, SceneSpec, ScenePoint } from '@/types'

/**
 * Life Sciences sketches read off the question's words: graphs a question
 * describes ("a graph shows the rate rising to a peak at pH 7 ..."), the
 * microscope's field of view, the pedigree key and the DNA-to-mRNA strip.
 *
 * A question that says "a graph shows" is written about a graph the paper
 * prints, so the graph goes beside the question -- drawn to the shape the words
 * give, with only the numbers they state on its axes. The pedigree key and the
 * transcribed mRNA are answers, so they go with the answer.
 */

type Q = Pick<Question, 'id' | 'topicId' | 'prompt' | 'context' | 'answer'>

const pt = (id: string, x: number, y: number, label?: string): ScenePoint => ({ id, x, y, label })
const show = (n: number) => String(n).replace('.', ',')

/** Axes 0..10 by 0..7 with their names, and optional ticks on x. */
function axes(xName: string, yName: string, ticks: { at: number; text: string }[] = []): Pick<SceneSpec, 'points' | 'segments' | 'texts'> {
  return {
    points: [pt('O', 0, 0), pt('Xa', 10.6, 0), pt('Ya', 0, 7.6)],
    segments: [
      { a: 'O', b: 'Xa', arrow: true },
      { a: 'O', b: 'Ya', arrow: true },
    ],
    texts: [
      { x: 0.3, y: 8, text: yName, anchor: 'start', size: 10 },
      { x: 10.6, y: -1.3, text: xName, anchor: 'end', size: 10 },
      ...ticks.map((t) => ({ x: t.at, y: -0.6, text: t.text, size: 10 })),
    ],
  }
}

const curve = (f: (x: number) => number, from = 0.3, to = 10): [number, number][] =>
  Array.from({ length: 80 }, (_, i) => {
    const x = from + ((to - from) * i) / 79
    return [x, f(x)]
  })

/** Rises to an optimum, then falls away faster. */
const optimum = (peakAt: number) => (x: number) => (x < peakAt ? 6 * Math.exp(-(((x - peakAt) / 3.2) ** 2)) : 6 * Math.exp(-(((x - peakAt) / 1.6) ** 2)))
/** Rises, then levels off. */
const plateau = (height: number, k: number) => (x: number) => height * (1 - Math.exp(-k * x))

function graphs(t: string): SceneSpec | null {
  if (!/\bgraph shows\b/i.test(t)) return null
  const rate = /photosynthesis/i.test(t) ? 'rate of photosynthesis' : /enzyme|reaction/i.test(t) ? 'rate of reaction' : 'rate'

  // Rise to an optimum and fall: pH or temperature.
  const byPH = /\bpH\b/.test(t)
  const byT = /temperature/i.test(t) && /(optimum|peak)/i.test(t)
  if ((byPH || byT) && /(peak|optimum|maximum)/i.test(t)) {
    const unit = byPH ? 'pH' : '°C'
    const nums = [...t.matchAll(byPH ? /pH (\d+(?:\.\d+)?)/g : /(\d+(?:\.\d+)?) ?°C/g)].map((m) => Number(m[1]))
    const peak = Number(
      (byPH ? t.match(/(?:peak|optimum|maximum)[^.]*?pH (\d+(?:\.\d+)?)/) : t.match(/(?:peak|optimum)[^.]*?(\d+(?:\.\d+)?) ?°C/))?.[1] ?? NaN,
    )
    if (!Number.isFinite(peak)) return null
    const lo = Math.min(...nums)
    const hi = Math.max(...nums)
    const span = hi > lo ? hi - lo : 1
    const X = (v: number) => (hi > lo ? 0.8 + ((v - lo) / span) * 8.6 : 5)
    const px = hi > lo && lo !== peak && hi !== peak ? X(peak) : hi > peak ? X(peak) : lo < peak ? 6.5 : 4
    const ticks = [...new Set([lo, peak, hi])].filter((v) => Number.isFinite(v) && (hi > lo || v === peak)).map((v) => ({ at: v === peak ? px : X(v), text: byPH ? show(v) : `${show(v)}°C` }))
    const who = /photosynthesis/i.test(t) ? 'Photosynthesis' : 'Enzyme activity'
    return {
      title: `${who} against ${byPH ? 'pH' : 'temperature'}: an optimum at ${byPH ? `pH ${show(peak)}` : `${show(peak)} °C`}`,
      ...axes(byPH ? 'pH' : `temperature (${unit})`, rate, ticks),
      curves: [{ points: curve(optimum(px)), accent: true }],
      toScale: false,
    }
  }

  // The 28-day cycle and pregnancy.
  const day = (d: number) => (d / 28) * 10
  const cycleTicks = [
    { at: day(1), text: '1' },
    { at: day(14), text: '14' },
    { at: day(28), text: '28' },
  ].filter((k) => new RegExp(`\\b${k.text}\\b`).test(t))
  const lines: NonNullable<SceneSpec['curves']> = []
  const labels: NonNullable<SceneSpec['texts']> = []
  const add = (name: string, f: (d: number) => number, accent = false) => {
    lines.push({ points: Array.from({ length: 113 }, (_, i) => [day(i / 4), f(i / 4)] as [number, number]), accent })
    const peakD = Array.from({ length: 113 }, (_, i) => i / 4).reduce((a, b) => (f(b) > f(a) ? b : a), 0)
    labels.push({ x: day(peakD), y: f(peakD) + 0.5, text: name, size: 9, accent })
  }
  const spike = (at: number, w: number, h: number) => (d: number) => h * Math.exp(-(((d - at) / w) ** 2))
  if (/28-day menstrual cycle/i.test(t)) {
    if (/\bLH\b/.test(t)) add('LH', (d) => 0.6 + spike(14, 0.8, 5)(d), true)
    if (/oestrogen/i.test(t)) add('oestrogen', (d) => 0.8 + spike(12.5, 2.5, 3.6)(d) + spike(21.5, 3.5, /smaller second/.test(t) ? 1.4 : 2.2)(d))
    if (/progesterone/i.test(t)) add('progesterone', (d) => 0.5 + spike(21.5, 3.6, 3.8)(d))
    if (/basal body temperature|\bBBT\b/i.test(t)) add('body temperature', (d) => (d < 14 ? 2.5 : d < 27 ? 3.8 : 2.5), true)
    if (/uterine lining|endometrium/i.test(t)) add('endometrium thickness', (d) => (d <= 5 ? 1 : d < 22 ? 1 + ((d - 5) / 17) * 4.2 : d < 27 ? 5.2 - (d - 22) * 0.1 : 1), true)
    if (!lines.length) return null
    const base = axes('day of cycle', /temperature/i.test(t) ? 'temperature' : /thickness/i.test(t) ? 'thickness' : 'concentration in blood', cycleTicks)
    return { title: 'The 28-day cycle, as the graph describes it', ...base, curves: lines, texts: [...(base.texts ?? []), ...labels], toScale: false }
  }
  if (/\bhCG\b/.test(t) && /week 10/.test(t)) {
    const w = (x: number) => (x / 40) * 10
    const f = (x: number) => 0.6 + 5.4 * Math.exp(-(((x - w(10)) / 1.1) ** 2)) + (x > w(10) ? 1.2 * (1 - Math.exp(-(x - w(10)) * 2)) : 0)
    return {
      title: 'hCG in the blood during pregnancy',
      ...axes('weeks of pregnancy', 'hCG concentration', [{ at: w(10), text: '10' }]),
      curves: [{ points: curve(f, 0, 10), accent: true }],
      toScale: false,
    }
  }
  // Rise and level off -- one curve, or two compared.
  if (/(level(?:s|ling)? off|plateau)/i.test(t)) {
    const xName = /light intensity/i.test(t) && !/carbon dioxide concentration increases/i.test(t) ? 'light intensity' : /carbon dioxide/i.test(t) ? 'CO₂ concentration' : /substrate/i.test(t) ? 'substrate concentration' : 'factor'
    const two: [string, string] | null = /shade-adapted/i.test(t)
      ? ['sun-adapted', 'shade-adapted']
      : /two different constant light intensities|high light intensity/i.test(t)
        ? ['high light intensity', 'low light intensity']
        : /higher, constant carbon dioxide|low, constant carbon dioxide/i.test(t)
          ? ['higher CO₂', 'low CO₂']
          : null
    if (/remaining low and constant/i.test(t)) {
      // Three phases: flat, rising, flat again.
      const f = (x: number) => (x < 3 ? 1 : 1 + 5 / (1 + Math.exp(-(x - 5.5) * 1.6)))
      const tick = [...t.matchAll(/(\d+(?:\.\d+)?)%/g)].map((m) => m[1])
      return {
        title: 'Photosynthesis against CO₂ concentration: three phases',
        ...axes(xName, rate, tick.length >= 2 ? [{ at: 0.5, text: `${show(Number(tick[0]))}%` }, { at: 3, text: `${show(Number(tick[1]))}%` }] : []),
        curves: [{ points: curve(f), accent: true }],
        toScale: false,
      }
    }
    if (two) {
      const shade = two[1] === 'shade-adapted'
      const base = axes(xName, rate)
      return {
        title: `Rate of photosynthesis: ${two[0]} and ${two[1]}`,
        ...base,
        curves: [{ points: curve(plateau(6, 0.35)), accent: true }, { points: curve(plateau(3, shade ? 1.1 : 0.35)) }],
        texts: [...(base.texts ?? []), { x: 9.8, y: 6.5, text: two[0], anchor: 'end', size: 9, accent: true }, { x: 9.8, y: 3.5, text: two[1], anchor: 'end', size: 9 }],
        toScale: false,
      }
    }
    return {
      title: `${rate.charAt(0).toUpperCase() + rate.slice(1)} against ${xName}: rising, then levelling off`,
      ...axes(xName, rate),
      curves: [{ points: curve(plateau(6, 0.45)), accent: true }],
      toScale: false,
    }
  }

  return null
}

/** The field of view with the stated number of cells laid across its diameter. */
function microscope(t: string): SceneSpec | null {
  const m = t.match(/diameter of the field of view is (\d+(?:[.,]\d+)?) ?mm, and exactly (\d+) cells fit end to end across the diameter/)
  if (!m) return null
  const n = Number(m[2])
  const r = 5
  const w = (2 * r) / n
  return {
    title: 'The field of view with the cells across its diameter',
    points: [pt('O', 0, 0), pt('L', -r, -r - 0.9), pt('R', r, -r - 0.9)],
    circles: [{ c: 'O', r }],
    segments: [{ a: 'L', b: 'R', label: `${m[1]} mm`, arrow: true }],
    discs: Array.from({ length: n }, (_, i) => ({ x: -r + w / 2 + i * w, y: 0, r: w / 2, fill: 'none' as const })),
    notes: [`${n} cells fit across the diameter`],
    toScale: false,
  }
}

/** What each symbol in a pedigree means. */
function pedigreeKey(): SceneSpec {
  const s = 0.8
  const square = (id: string, x: number, y: number) => [pt(`${id}a`, x - s, y - s), pt(`${id}b`, x + s, y - s), pt(`${id}c`, x + s, y + s), pt(`${id}d`, x - s, y + s)]
  const box = (id: string) => [
    { a: `${id}a`, b: `${id}b` },
    { a: `${id}b`, b: `${id}c` },
    { a: `${id}c`, b: `${id}d` },
    { a: `${id}d`, b: `${id}a` },
  ]
  return {
    title: 'How a pedigree is drawn',
    points: [...square('m', 1, 6), ...square('p', 5.6, 6), pt('j0', 6.4, 6), pt('j1', 8.4, 6), pt('k0', 7.4, 6), pt('k1', 7.4, 4.6), pt('c0', 6.2, 4.6), pt('c1', 8.6, 4.6), pt('c2', 6.2, 3.8), pt('c3', 8.6, 3.8)],
    segments: [...box('m'), ...box('p'), { a: 'j0', b: 'j1' }, { a: 'k0', b: 'k1' }, { a: 'c0', b: 'c1' }, { a: 'c0', b: 'c2' }, { a: 'c1', b: 'c3' }],
    discs: [
      { x: 1, y: 3.6, r: 0.8, fill: 'none' },
      { x: 1, y: 1.2, r: 0.8, fill: 'ink' },
      { x: 9.2, y: 6, r: 0.8, fill: 'none' },
    ],
    texts: [
      { x: 2.2, y: 6, text: 'male', anchor: 'start', size: 10 },
      { x: 2.2, y: 3.6, text: 'female', anchor: 'start', size: 10 },
      { x: 2.2, y: 1.2, text: 'affected: shaded', anchor: 'start', size: 10 },
      { x: 7.4, y: 7.3, text: 'parents: a horizontal line', size: 10 },
      { x: 7.4, y: 2.8, text: 'children below', size: 10 },
    ],
    notes: ['Square = male, circle = female, shaded = shows the trait. A horizontal line joins the parents; a vertical line leads down to their children.'],
    toScale: false,
    schematic: true,
  }
}

/** DNA template strand above the mRNA transcribed from it, in codons. */
function transcription(t: string, answer: string): SceneSpec | null {
  const m = t.match(/DNA template strand:? ((?:[ACGT] ){5,}[ACGT])/)
  if (!m) return null
  const bases = m[1].split(' ')
  const pair: Record<string, string> = { A: 'U', T: 'A', C: 'G', G: 'C' }
  const mrna = bases.map((b) => pair[b])
  // Only draw what the memo itself gives: the answer must contain this mRNA.
  if (!answer.replace(/[^ACGU]/g, '').includes(mrna.join(''))) return null
  const texts: NonNullable<SceneSpec['texts']> = []
  bases.forEach((b, i) => {
    const x = i + Math.floor(i / 3) * 0.6
    texts.push({ x, y: 2, text: b, size: 12 }, { x, y: 0, text: mrna[i], size: 12, accent: true })
  })
  const n = bases.length
  const width = n + Math.floor((n - 1) / 3) * 0.6
  return {
    title: 'Transcription: the template strand and the mRNA built from it',
    points: [pt('l0', -0.6, 1), pt('l1', width - 0.4, 1)],
    segments: [{ a: 'l0', b: 'l1', dashed: true }],
    texts: [...texts, { x: -1, y: 2, text: 'DNA', anchor: 'end', size: 10 }, { x: -1, y: 0, text: 'mRNA', anchor: 'end', size: 10, accent: true }],
    notes: ['Each base pairs with its partner: A–U, T–A, C–G, G–C. Every three mRNA bases form one codon.'],
    toScale: false,
    schematic: true,
  }
}


/* ------------------------------------------------------------------ */
/* Biological molecules, with the answer                              */
/* ------------------------------------------------------------------ */

/** A hydrocarbon tail drawn as a zigzag, stepping down. */
const zigzag = (x0: number, y0: number, n: number, step = 0.5, dx = 0.28): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => [x0 + (i % 2 ? dx : 0), y0 - i * step] as [number, number])

function phospholipid(): SceneSpec {
  const tails = (x: number, y: number, kink = false): NonNullable<SceneSpec['curves']> => [
    { points: zigzag(x - 0.35, y, 7) },
    { points: kink ? [...zigzag(x + 0.35, y, 3), [x + 0.9, y - 2.1], [x + 1.1, y - 2.6], [x + 0.85, y - 3.1]] : zigzag(x + 0.35, y, 7) },
  ]
  const bilayer: NonNullable<SceneSpec['discs']> = []
  const bl: NonNullable<SceneSpec['curves']> = []
  for (let i = 0; i < 6; i++) {
    const x = 6.5 + i * 0.8
    bilayer.push({ x, y: 0.2, r: 0.3, fill: 'accent' }, { x, y: -4.2, r: 0.3, fill: 'accent' })
    bl.push({ points: [[x - 0.1, -0.1], [x - 0.1, -1.9]] }, { points: [[x + 0.1, -0.1], [x + 0.1, -1.9]] })
    bl.push({ points: [[x - 0.1, -2.3], [x - 0.1, -3.9]] }, { points: [[x + 0.1, -2.3], [x + 0.1, -3.9]] })
  }
  return {
    title: 'A phospholipid, and the bilayer phospholipids form',
    points: [pt('a', 0, 0)],
    discs: [{ x: 0, y: 0.4, r: 0.55, fill: 'accent' }, ...bilayer],
    curves: [...tails(0, -0.3), ...bl],
    texts: [
      { x: 0.8, y: 0.9, text: 'phosphate head: hydrophilic', anchor: 'start', size: 9 },
      { x: 0.9, y: -2, text: 'two fatty acid tails:', anchor: 'start', size: 9 },
      { x: 0.9, y: -2.5, text: 'hydrophobic', anchor: 'start', size: 9 },
      { x: 8.5, y: 1.2, text: 'water outside', size: 9 },
      { x: 8.5, y: -5.1, text: 'water inside the cell', size: 9 },
    ],
    notes: ['The heads face the water on both sides; the tails hide from it in the middle -- the bilayer of the cell membrane.'],
    toScale: false,
    schematic: true,
  }
}

function fattyAcids(): SceneSpec {
  const straight: [number, number][] = Array.from({ length: 11 }, (_, i) => [i * 0.6, i % 2 ? 0.3 : 0])
  // Unsaturated: the same zigzag, bent where the C=C double bond sits.
  const kinked: [number, number][] = [
    ...Array.from({ length: 6 }, (_, i) => [i * 0.6, -2.4 + (i % 2 ? 0.3 : 0)] as [number, number]),
    [3.4, -2.9],
    [3.7, -3.5],
    [4.25, -3.7],
    [4.55, -4.3],
    [5.1, -4.5],
  ]
  return {
    title: 'Saturated and unsaturated fatty acids',
    points: [pt('d0', 3.0, -2.4), pt('d1', 3.4, -2.9)],
    segments: [{ a: 'd0', b: 'd1', accent: true }],
    curves: [{ points: straight }, { points: kinked }],
    texts: [
      { x: 0, y: -0.8, text: 'saturated: single bonds only, a straight chain', anchor: 'start', size: 9 },
      { x: 0, y: -5.3, text: 'unsaturated: a C=C double bond kinks the chain', anchor: 'start', size: 9, accent: true },
    ],
    notes: ['Straight chains pack tightly, so saturated fats are solid at room temperature; kinked chains cannot, so unsaturated fats are liquid (oils).'],
    toScale: false,
    schematic: true,
  }
}

function proteinLevels(): SceneSpec {
  // Four panels in a 2 x 2 grid, so the labels have room at phone width.
  const beads: NonNullable<SceneSpec['discs']> = Array.from({ length: 7 }, (_, i) => ({ x: i * 0.55, y: 3.2, r: 0.22, fill: i % 2 ? 'none' : 'accent' }) as const)
  const helix: [number, number][] = Array.from({ length: 60 }, (_, i) => [5.4 + i * 0.05, 3.2 + 0.4 * Math.sin(i / 3)])
  const fold: [number, number][] = Array.from({ length: 90 }, (_, i) => {
    const a = (i / 90) * Math.PI * 4
    return [1.65 + 0.9 * Math.cos(a) + 0.3 * Math.cos(3 * a), 0.9 * Math.sin(a) * Math.cos(a / 2)]
  })
  const blob = (cx: number): [number, number][] => Array.from({ length: 40 }, (_, i) => {
    const a = (i / 39) * Math.PI * 2
    return [cx + 0.7 * Math.cos(a), 0.7 * Math.sin(a)]
  })
  const label = (x: number, y: number, name: string, a: string, b: string): NonNullable<SceneSpec['texts']> => [
    { x, y, text: name, size: 11 },
    { x, y: y - 0.5, text: a, size: 9 },
    { x, y: y - 0.95, text: b, size: 9 },
  ]
  return {
    title: 'The four levels of protein structure',
    points: [pt('a', 0, 0)],
    discs: [...beads],
    curves: [{ points: helix, accent: true }, { points: fold }, { points: blob(6.3), accent: true }, { points: blob(7.6) }],
    texts: [
      ...label(1.65, 2.2, 'primary', 'amino acid sequence,', 'peptide bonds'),
      ...label(6.9, 2.2, 'secondary', 'helix or sheet,', 'hydrogen bonds'),
      ...label(1.65, -1.4, 'tertiary', 'whole folded shape,', 'bonds between R-groups'),
      ...label(6.9, -1.4, 'quaternary', 'several chains', 'held together'),
    ],
    notes: ['The sequence (primary) decides where the chain folds, so one changed amino acid can change the final shape -- and the function.'],
    toScale: false,
    schematic: true,
  }
}

function polysaccharide(): SceneSpec {
  const hex = (cx: number): [number, number][] => Array.from({ length: 7 }, (_, i) => [cx + 0.5 * Math.cos((Math.PI / 3) * i), 0.5 * Math.sin((Math.PI / 3) * i)])
  const pts: ScenePoint[] = []
  const segments: NonNullable<SceneSpec['segments']> = []
  for (let i = 0; i < 4; i++) {
    pts.push(pt(`g${i}a`, i * 1.6 + 0.5, 0), pt(`g${i}b`, i * 1.6 + 1.1, 0))
    if (i < 3) segments.push({ a: `g${i}a`, b: `g${i}b` })
  }
  return {
    title: 'A polysaccharide: a chain of glucose units',
    points: pts,
    segments,
    curves: [0, 1.6, 3.2, 4.8].map((c) => ({ points: hex(c) })),
    texts: [
      { x: 0, y: 0, text: 'G', size: 10 },
      { x: 1.6, y: 0, text: 'G', size: 10 },
      { x: 3.2, y: 0, text: 'G', size: 10 },
      { x: 4.8, y: 0, text: 'G', size: 10 },
      { x: 5.6, y: 0, text: '…', anchor: 'start', size: 12 },
      { x: 0.8, y: -0.85, text: 'glycosidic bond', size: 8, accent: true },
    ],
    notes: ['G = a glucose monomer. Condensation joins each pair and releases a water molecule. Starch and cellulose are both glucose chains; the way the units are joined differs.'],
    toScale: false,
    schematic: true,
  }
}

function nucleotide(): SceneSpec {
  const pent: [number, number][] = Array.from({ length: 6 }, (_, i) => [2.2 + 0.6 * Math.cos((2 * Math.PI * i) / 5 + Math.PI / 2), 0.6 * Math.sin((2 * Math.PI * i) / 5 + Math.PI / 2)])
  return {
    title: 'A nucleotide',
    points: [pt('p', 0.45, 0), pt('s0', 1.6, 0), pt('s1', 2.8, 0), pt('b0', 3.7, 0), pt('r0', 3.7, 0.5), pt('r1', 5.1, 0.5), pt('r2', 5.1, -0.5), pt('r3', 3.7, -0.5)],
    segments: [
      { a: 'p', b: 's0' },
      { a: 's1', b: 'b0' },
      { a: 'r0', b: 'r1' },
      { a: 'r1', b: 'r2' },
      { a: 'r2', b: 'r3' },
      { a: 'r3', b: 'r0' },
    ],
    discs: [{ x: 0, y: 0, r: 0.45, fill: 'accent' }],
    curves: [{ points: pent }],
    texts: [
      { x: 0, y: -1, text: 'phosphate', size: 9 },
      { x: 2.2, y: -1, text: 'sugar', size: 9 },
      { x: 4.4, y: -1, text: 'nitrogenous base', size: 9 },
    ],
    notes: ['DNA: deoxyribose sugar, bases A, T, C, G. RNA: ribose sugar, bases A, U, C, G.'],
    toScale: false,
    schematic: true,
  }
}

function biomolecules(t: string): SceneSpec[] {
  if (/phospholipid/i.test(t)) return [phospholipid()]
  if (/saturated|fatty acid|triglyceride/i.test(t)) return [fattyAcids()]
  if (/(primary|secondary|tertiary|quaternary) (level|structure)|levels of protein|protein structure/i.test(t)) return [proteinLevels()]
  if (/nucleotide/i.test(t)) return [nucleotide()]
  if (/polysaccharide|structure of (starch|cellulose|glycogen)|cellulose and starch/i.test(t)) return [polysaccharide()]
  return []
}

/** Sketches for a Life Sciences question: beside it, and with its answer. */
export function lifeSciDiagramsFor(q: Q): { prompt: SceneSpec[]; answer: SceneSpec[] } {
  if (!q.topicId.startsWith('life-sci')) return { prompt: [], answer: [] }
  const t = [q.context ?? '', q.prompt].join(' ').replace(/\s+/g, ' ')
  const prompt = graphs(t) ?? microscope(t)
  const answer: SceneSpec[] = []
  if (/\bpedigree\b/i.test(t)) answer.push(pedigreeKey())
  const tr = transcription(t, q.answer)
  if (tr) answer.push(tr)
  if (q.topicId === 'life-sci-chemistry-of-life') answer.push(...biomolecules(t))
  return { prompt: prompt ? [prompt] : [], answer }
}
