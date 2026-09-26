import type { Question, SceneSpec, ScenePoint } from '@/types'
import { chemDiagramsFor } from '@/lib/chemDiagrams'

/**
 * Physical Sciences sketches, built from the question's own words and drawn by
 * GeometryDiagram.
 *
 * Two kinds, placed differently:
 *
 * - A question that GIVES numbers -- "a 10 kg block slides down an incline of
 *   30°", "a ray travels from air (n = 1,00) into glass (n = 1,50) at 40°",
 *   "4 consecutive crests span 1,8 m" -- gets a sketch of exactly that beside
 *   the question, the givens labelled and the unknown marked "?". An exam
 *   prints these, and the learner reads the situation off them.
 *
 * - A question that asks the learner to DEFINE or DESCRIBE something that is
 *   a picture -- a compression, the energy profile of an endothermic
 *   reaction, the volume of gas against time with and without a catalyst --
 *   gets the standard labelled figure with the answer. Shown before, it would
 *   be the answer.
 *
 * `npm run check:geometry` holds these to the same rules as the geometry
 * sketches: every number on a sketch must be one the question states, and any
 * sketch drawn to scale is measured.
 */

type Q = Pick<Question, 'id' | 'topicId' | 'prompt' | 'context' | 'answer'>

const DEG = Math.PI / 180
const NUM = '(\\d+(?:\\.\\d+)?)'

function norm(s: string) {
  return s.replace(/(\d),(\d)/g, '$1.$2').replace(/(\d) (\d{3})\b/g, '$1$2').replace(/\s+/g, ' ')
}
/** An index of refraction keeps its written places: n = 1,00, not n = 1. */
const nIdx = (raw: string) => raw.replace('.', ',')

/**
 * A medium's name and index, e.g. "Glass (n = 1,50)", as free text. A long name
 * -- "Transparent plastic block" -- is set on two lines, the index under it, so
 * that it stays in its own quarter of the figure instead of running across the
 * normal and the rays.
 */
function medium(name: string, n: string, x: number, y: number, anchor: 'start' | 'end'): { x: number; y: number; text: string; anchor: 'start' | 'end' }[] {
  const full = `${name} (n = ${nIdx(n)})`
  if (full.length <= 17) return [{ x, y, text: full, anchor }]
  const rows: string[] = []
  for (const word of name.split(' ')) {
    const last = rows.length - 1
    if (last >= 0 && `${rows[last]} ${word}`.length <= 13) rows[last] += ` ${word}`
    else rows.push(word)
  }
  rows.push(`(n = ${nIdx(n)})`)
  return rows.map((text, i) => ({ x, y: y + 0.25 - i * 0.55, text, anchor }))
}
const show = (n: number, unit?: string) => `${String(Math.round(n * 1000) / 1000).replace('.', ',')}${unit ? ` ${unit}` : ''}`
const pt = (id: string, x: number, y: number, label?: string): ScenePoint => ({ id, x, y, label })
const SPEED = 'm·s⁻¹'

/* ------------------------------------------------------------------ */
/* Waves                                                               */
/* ------------------------------------------------------------------ */

function sine(from: number, to: number, lambda: number, amp: number, phase = 0): [number, number][] {
  const pts: [number, number][] = []
  const n = 48 * Math.max(1, Math.round((to - from) / lambda))
  for (let i = 0; i <= n; i++) {
    const x = from + ((to - from) * i) / n
    pts.push([x, amp * Math.cos((2 * Math.PI * (x - from)) / lambda + phase)])
  }
  return pts
}

/** A transverse wave with its wavelength -- or a span of several -- marked. */
function transverse(t: string, prompt: string): SceneSpec | null {
  const given: string[] = []
  const f = t.match(new RegExp(`frequency (?:of )?${NUM} ?Hz`))
  const v = t.match(new RegExp(`(?:speed of|at a speed of|travels (?:along [\\w ]+ )?at) ${NUM} ?(?:m·s⁻¹|m/s)`))
  if (f) given.push(`f = ${show(+f[1])} Hz`)
  if (v) given.push(`v = ${show(+v[1])} ${SPEED}`)

  // "4 consecutive crests ... 1,8 m" / "Four consecutive troughs ... span 2,4 m"
  const words: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 }
  const span = t.match(new RegExp(`(\\d|two|three|four|five|six|Two|Three|Four|Five|Six) consecutive (crests|troughs)[^.]*?${NUM} ?m\\b`))
  if (span) {
    const count = Number(span[1]) || words[span[1]]
    const d = Number(span[3])
    const lambda = d / (count - 1)
    const amp = lambda * 0.3
    const troughs = span[2] === 'troughs'
    const phase = troughs ? Math.PI : 0
    const curve = sine(-lambda * 0.25, d + lambda * 0.25, lambda, amp, phase + (2 * Math.PI * 0.25))
    const mark = Array.from({ length: count }, (_, i) => ({ x: i * lambda, y: troughs ? -amp : amp, r: lambda * 0.035, fill: 'accent' as const }))
    const yLine = troughs ? -amp * 1.7 : amp * 1.7
    return {
      title: `${count} consecutive ${span[2]} of the wave`,
      points: [pt('s0', 0, yLine), pt('s1', d, yLine), pt('e0', -lambda * 0.25, 0), pt('e1', d + lambda * 0.25, 0)],
      segments: [
        { a: 'e0', b: 'e1', dashed: true },
        { a: 's0', b: 's1', label: show(d, 'm') },
      ],
      curves: [{ points: curve }],
      discs: mark,
      notes: given.length ? given : undefined,
      toScale: false,
    }
  }

  const l = t.match(new RegExp(`wavelength (?:of |is )?${NUM} ?m\\b`))
  if (!l && !(f && v)) return null
  const lambda = l ? Number(l[1]) : 1
  const amp = lambda * 0.3
  return {
    title: 'The transverse wave',
    points: [pt('e0', 0, 0), pt('e1', 2 * lambda, 0), pt('c0', 0.25 * lambda, amp * 1.6), pt('c1', 1.25 * lambda, amp * 1.6)],
    segments: [
      { a: 'e0', b: 'e1', dashed: true },
      { a: 'c0', b: 'c1', label: l ? `λ = ${show(lambda, 'm')}` : /wavelength/.test(prompt) ? 'λ = ?' : 'λ' },
    ],
    curves: [{ points: sine(0, 2 * lambda, lambda, amp, -Math.PI / 2) }],
    discs: [
      { x: 0.25 * lambda, y: amp, r: lambda * 0.03, fill: 'accent' },
      { x: 1.25 * lambda, y: amp, r: lambda * 0.03, fill: 'accent' },
    ],
    notes: given.length ? given : undefined,
    toScale: false,
  }
}

function longitudinalScene(title: string, label: string, between: 'compressions' | 'rarefactions', notes?: string[], teach = false): SceneSpec {
  const L = 1
  const cycles = 2.5
  const pts: ScenePoint[] = []
  const segments: NonNullable<SceneSpec['segments']> = []
  // Particle positions: evenly spaced, displaced by a sine so they bunch every λ.
  const n = 44
  for (let i = 0; i <= n; i++) {
    const x0 = (cycles * L * i) / n
    const x = x0 - 0.12 * Math.sin((2 * Math.PI * x0) / L)
    pts.push(pt(`p${i}t`, x, 0.25), pt(`p${i}b`, x, -0.25))
    segments.push({ a: `p${i}t`, b: `p${i}b` })
  }
  // Compressions sit where the displacement bunches the lines: x = 0, 1, 2 (× λ).
  const at = between === 'compressions' ? [0, 1] : [0.5, 1.5]
  pts.push(pt('m0', at[0], -0.45), pt('m1', at[1], -0.45))
  segments.push({ a: 'm0', b: 'm1', label })
  const texts: NonNullable<SceneSpec['texts']> = teach
    ? [
        { x: 1, y: 0.42, text: 'C', accent: true },
        { x: 1.5, y: 0.42, text: 'R' },
        { x: 2, y: 0.42, text: 'C', accent: true },
      ]
    : []
  return {
    title,
    points: pts,
    segments,
    texts,
    notes: teach ? ['C = compression (particles close together), R = rarefaction (particles far apart)', ...(notes ?? [])] : notes,
    toScale: false,
  }
}

function longitudinal(t: string, prompt: string): SceneSpec | null {
  const given: string[] = []
  const f = t.match(new RegExp(`frequency (?:of )?${NUM} ?Hz`))
  const v = t.match(new RegExp(`(?:speed of|at|at a speed of|speed is) ${NUM} ?(?:m·s⁻¹|m/s)`))
  const T = t.match(new RegExp(`period of ${NUM} ?s\\b`))
  if (f) given.push(`f = ${show(+f[1])} Hz`)
  if (v) given.push(`v = ${show(+v[1])} ${SPEED}`)
  if (T) given.push(`T = ${show(+T[1])} s`)
  const apart = t.match(new RegExp(`(?:successive|adjacent) (compressions|rarefactions)[^.]*?${NUM} ?m\\b`)) ?? t.match(new RegExp(`between (?:two )?(?:successive|adjacent) (compressions|rarefactions)[^.]*?${NUM} ?m\\b`))
  if (apart) return longitudinalScene(`Successive ${apart[1]} of the wave`, show(+apart[2], 'm'), apart[1] as 'compressions' | 'rarefactions', given)
  const l = t.match(new RegExp(`wavelength (?:of |is )?${NUM} ?m\\b`))
  if (l) return longitudinalScene('The longitudinal wave', `λ = ${show(+l[1], 'm')}`, 'compressions', given)
  if (f && v && /wavelength/.test(prompt)) return longitudinalScene('The sound wave', 'λ = ?', 'compressions', given)
  return null
}

/* ------------------------------------------------------------------ */
/* Inclines                                                            */
/* ------------------------------------------------------------------ */

function incline(t: string): SceneSpec | null {
  const m = t.match(new RegExp(`${NUM} kg (block|crate|box|trolley|object)`))
  if (!m) return null
  const angle = t.match(new RegExp(`incline (?:of|at|inclined at) ${NUM}°`)) ?? t.match(new RegExp(`${NUM}° incline`))
  const height = t.match(new RegExp(`incline of height ${NUM} ?m`)) ?? t.match(new RegExp(`${NUM} ?m high incline`))
  if (!angle && !height) return null
  const th = angle ? Number(angle[1]) : 30
  const L = 10
  const base = L * Math.cos(th * DEG)
  const h = L * Math.sin(th * DEG)
  // A block sitting halfway up the slope.
  const u = [Math.cos(th * DEG), Math.sin(th * DEG)]
  const nrm = [-u[1], u[0]]
  const s = 1.6
  const c0 = [base * 0.45, h * 0.45]
  const b = (k: number, j: number) => [c0[0] + u[0] * k + nrm[0] * j, c0[1] + u[1] * k + nrm[1] * j]
  const [b0, b1, b2, b3] = [b(-s / 2, 0), b(s / 2, 0), b(s / 2, s), b(-s / 2, s)]
  const mu = t.match(new RegExp(`coefficient of (?:kinetic |static )?friction[^.]*? ${NUM}`))
  const friction = /frictionless/.test(t) ? 'frictionless surface' : mu ? `μ = ${show(+mu[1])}` : undefined
  return {
    title: `A ${show(+m[1], 'kg')} ${m[2]} on an incline`,
    points: [pt('A', 0, 0), pt('B', base, 0), pt('C', base, h), pt('b0', b0[0], b0[1]), pt('b1', b1[0], b1[1]), pt('b2', b2[0], b2[1]), pt('b3', b3[0], b3[1])],
    segments: [
      { a: 'A', b: 'B', thick: true },
      { a: 'B', b: 'C', label: height ? show(+height[1], 'm') : undefined },
      { a: 'A', b: 'C' },
      { a: 'b0', b: 'b1' },
      { a: 'b1', b: 'b2' },
      { a: 'b2', b: 'b3' },
      { a: 'b3', b: 'b0' },
    ],
    angles: [...(angle ? [{ at: 'A', a: 'B', b: 'C', label: `${show(th)}°` }] : []), { at: 'B', a: 'A', b: 'C', right: true }],
    texts: [{ x: (b0[0] + b2[0]) / 2, y: (b0[1] + b2[1]) / 2, text: show(+m[1], 'kg'), size: 10 }],
    notes: friction ? [friction] : undefined,
    toScale: !!angle && !height,
  }
}

/* ------------------------------------------------------------------ */
/* Light at a boundary                                                 */
/* ------------------------------------------------------------------ */

function ray(t: string, prompt: string): SceneSpec | null {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  // Refraction into a denser medium.
  let m = t.match(new RegExp(`from (air) \\(n = ${NUM}\\) into (?:a |an )?([\\w ]+?) \\(n = ${NUM}\\), striking the surface at an angle of incidence of ${NUM}°`))
  if (m) {
    const [, a, n1, b, n2, i] = m
    const r = Math.asin((Number(n1) * Math.sin(Number(i) * DEG)) / Number(n2)) / DEG
    const P = [-Math.sin(Number(i) * DEG) * 3, Math.cos(Number(i) * DEG) * 3]
    const Qp = [Math.sin(r * DEG) * 3, -Math.cos(r * DEG) * 3]
    return {
      title: `Light passing from ${a} into ${b}`,
      points: [pt('O', 0, 0), pt('P', P[0], P[1]), pt('Q', Qp[0], Qp[1]), pt('N1', 0, 3.2), pt('N2', 0, -3.2), pt('L', -3.4, 0), pt('R', 3.4, 0)],
      segments: [
        { a: 'L', b: 'R', thick: true },
        { a: 'N1', b: 'N2', dashed: true },
        { a: 'P', b: 'O', arrow: true },
        { a: 'O', b: 'Q', arrow: true, accent: true },
      ],
      angles: [
        { at: 'O', a: 'N1', b: 'P', label: `${show(+i)}°` },
        { at: 'O', a: 'N2', b: 'Q', label: '?' },
      ],
      texts: [
        ...medium(cap(a), n1, 3.3, 1.6, 'end'),
        // The refracted ray runs down to the right, so the second medium is named on the left.
        ...medium(cap(b), n2, -3.3, -1.6, 'start'),
        { x: 0.15, y: 3.35, text: 'normal', anchor: 'start', size: 9 },
      ],
      toScale: true,
    }
  }

  // The critical angle, from the denser side.
  m = t.match(new RegExp(`critical angle for light travelling from ([\\w ]+?) \\(n = ${NUM}\\) into ([\\w ]+?) \\(n = ${NUM}\\)`))
  if (m) {
    const [, a, n1, b, n2] = m
    const c = Math.asin(Number(n2) / Number(n1)) / DEG
    const P = [-Math.sin(c * DEG) * 3, -Math.cos(c * DEG) * 3]
    return {
      title: `Light in ${a} meeting the ${a}–${b} boundary at the critical angle`,
      points: [pt('O', 0, 0), pt('P', P[0], P[1]), pt('N1', 0, 3), pt('N2', 0, -3.2), pt('L', -3.4, 0), pt('R', 3.4, 0), pt('G', 3.2, 0)],
      segments: [
        { a: 'L', b: 'R', thick: true },
        { a: 'N1', b: 'N2', dashed: true },
        { a: 'P', b: 'O', arrow: true },
        { a: 'O', b: 'G', arrow: true, accent: true },
      ],
      angles: [{ at: 'O', a: 'N2', b: 'P', label: 'θc = ?' }],
      texts: [
        ...medium(cap(b), n2, -3.3, 1.4, 'start'),
        ...medium(cap(a), n1, 3.3, -2.2, 'end'),
        { x: 0.3, y: 0.5, text: 'along the boundary', anchor: 'start', size: 9, accent: true },
      ],
      toScale: false,
    }
  }

  // Inside a denser block, meeting the boundary: total internal reflection or not?
  m =
    t.match(new RegExp(`travels inside (?:a |an )?([\\w ]+?)(?: block)? \\(n = ${NUM}\\) and strikes the [\\w-]+ boundary at an angle of incidence of ${NUM}°`)) ??
    t.match(new RegExp(`travels inside (a medium) of refractive index ${NUM} and strikes the boundary with air at an angle of incidence of ${NUM}°`))
  if (m) {
    const [, a, n1, i] = m
    const P = [-Math.sin(Number(i) * DEG) * 3, -Math.cos(Number(i) * DEG) * 3]
    return {
      title: `A ray inside the ${a.replace(/^a /, '')} reaching the boundary with air`,
      points: [pt('O', 0, 0), pt('P', P[0], P[1]), pt('N1', 0, 2.4), pt('N2', 0, -3.2), pt('L', -3.4, 0), pt('R', 3.4, 0)],
      segments: [
        { a: 'L', b: 'R', thick: true },
        { a: 'N1', b: 'N2', dashed: true },
        { a: 'P', b: 'O', arrow: true },
      ],
      angles: [{ at: 'O', a: 'N2', b: 'P', label: `${show(+i)}°` }],
      texts: [
        { x: -3.3, y: 1.2, text: 'Air', anchor: 'start' },
        { x: 3.3, y: -2.2, text: `n = ${nIdx(n1)}`, anchor: 'end' },
        { x: 0.3, y: 1.3, text: 'reflected or refracted?', anchor: 'start', size: 9, accent: true },
      ],
      toScale: true,
    }
  }
  void prompt
  return null
}

/* ------------------------------------------------------------------ */
/* Vectors                                                             */
/* ------------------------------------------------------------------ */

const DIR: Record<string, [number, number]> = { north: [0, 1], south: [0, -1], east: [1, 0], west: [-1, 0], right: [1, 0], left: [-1, 0] }

function vectors(t: string): SceneSpec | null {
  // Two forces at right angles.
  let m = t.match(new RegExp(`Two forces, ${NUM} N and ${NUM} N, act at right angles`))
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])]
    return {
      title: 'Two forces at right angles, drawn tail to head',
      points: [pt('O', 0, 0), pt('A', a, 0), pt('B', a, b)],
      segments: [
        { a: 'O', b: 'A', label: show(a, 'N'), arrow: true },
        { a: 'A', b: 'B', label: show(b, 'N'), arrow: true },
        { a: 'O', b: 'B', label: 'R = ?', arrow: true, accent: true },
      ],
      angles: [
        { at: 'O', a: 'A', b: 'B', label: 'θ' },
        { at: 'A', a: 'O', b: 'B', right: true },
      ],
      toScale: true,
    }
  }

  // Two legs of a journey, or two forces along a line.
  const legs = [...t.matchAll(new RegExp(`${NUM} ?(m|km) due (north|south|east|west)`, 'g'))].map((x) => ({ v: Number(x[1]), unit: x[2], dir: x[3] }))
  const forces = [...t.matchAll(new RegExp(`force of ${NUM} N to the (right|left|east|west)`, 'g'))].map((x) => ({ v: Number(x[1]), unit: 'N', dir: x[2] }))
  const pair = legs.length === 2 ? legs : forces.length === 2 ? forces : null
  if (!pair) return null
  const [p, q] = pair
  const d1 = DIR[p.dir]
  const d2 = DIR[q.dir]
  const A = [d1[0] * p.v, d1[1] * p.v]
  const collinear = d1[0] * d2[1] - d1[1] * d2[0] === 0
  if (!collinear) {
    const B = [A[0] + d2[0] * q.v, A[1] + d2[1] * q.v]
    const span = Math.max(p.v, q.v)
    return {
      title: 'The two displacements, drawn tail to head',
      points: [pt('O', 0, 0, 'start'), pt('A', A[0], A[1]), pt('B', B[0], B[1], 'end'), pt('n0', -span * 0.35, span * 0.05), pt('n1', -span * 0.35, span * 0.3)],
      segments: [
        { a: 'O', b: 'A', label: show(p.v, p.unit), arrow: true },
        { a: 'A', b: 'B', label: show(q.v, q.unit), arrow: true },
        { a: 'O', b: 'B', label: '?', arrow: true, accent: true },
        { a: 'n0', b: 'n1', arrow: true },
      ],
      angles: [{ at: 'A', a: 'O', b: 'B', right: true }],
      texts: [{ x: -span * 0.35, y: span * 0.4, text: 'N', size: 12 }],
      toScale: true,
    }
  }
  // Along one line: the second vector drawn from the head of the first, a
  // little above so the two do not overlap.
  const lift = Math.max(p.v, q.v) * 0.12
  const B = A[0] + d2[0] * q.v
  const end = [B, 0]
  return {
    title: pair === forces ? 'The two forces, drawn head to tail' : 'The two displacements, drawn head to tail',
    points: [pt('O', 0, 0), pt('A', A[0], 0), pt('A2', A[0], lift), pt('B2', B, lift), pt('R0', 0, -lift), pt('R1', end[0], -lift)],
    segments: [
      { a: 'O', b: 'A', label: show(p.v, p.unit), arrow: true },
      { a: 'A2', b: 'B2', label: show(q.v, q.unit), arrow: true },
      { a: 'R0', b: 'R1', label: 'resultant = ?', arrow: true, accent: true },
    ],
    toScale: true,
  }
}

/* ------------------------------------------------------------------ */
/* Charges                                                             */
/* ------------------------------------------------------------------ */

function charges(t: string): SceneSpec | null {
  const m = t.match(new RegExp(`point charges, ([+−-])${NUM} ?μC and ([+−-])${NUM} ?μC,? (?:are )?(?:placed|held) ${NUM} ?m apart`))
  if (!m) return null
  const [, s1, q1, s2, q2, d] = m
  const D = Number(d)
  const sign = (s: string) => (s === '+' ? '+' : '−')
  return {
    title: 'Two point charges',
    points: [pt('A', 0, 0), pt('B', D, 0), pt('a', 0, -D * 0.22), pt('b', D, -D * 0.22)],
    segments: [{ a: 'a', b: 'b', label: show(D, 'm') }],
    discs: [
      { x: 0, y: 0, r: D * 0.07, text: sign(s1), fill: s1 === '+' ? 'accent' : 'ink' },
      { x: D, y: 0, r: D * 0.07, text: sign(s2), fill: s2 === '+' ? 'accent' : 'ink' },
    ],
    texts: [
      { x: 0, y: D * 0.17, text: `${sign(s1)}${show(+q1)} μC` },
      { x: D, y: D * 0.17, text: `${sign(s2)}${show(+q2)} μC` },
    ],
    toScale: false,
  }
}

/* ------------------------------------------------------------------ */
/* Velocity-time graphs described in words                             */
/* ------------------------------------------------------------------ */

function motion(t: string): { spec: SceneSpec; answer: boolean } | null {
  const phases: { t: number; v: number }[] = []
  let v0 = 0
  let m = t.match(new RegExp(`accelerat\\w* uniformly from ${NUM} ?(?:m·s⁻¹|m/s) to ${NUM} ?(?:m·s⁻¹|m/s) over the first ${NUM} ?s`))
  if (m) {
    v0 = Number(m[1])
    phases.push({ t: Number(m[3]), v: Number(m[2]) })
  } else {
    m = t.match(new RegExp(`accelerates uniformly (?:from rest )?to ${NUM} ?(?:m·s⁻¹|m/s) in ${NUM} ?s`))
    if (!m || !/from rest|starts from rest/.test(t)) return null
    phases.push({ t: Number(m[2]), v: Number(m[1]) })
  }
  const vTop = phases[0].v
  const c = t.match(new RegExp(`(?:travels|travelling|moves) at (?:a |that )?constant (?:${NUM} ?(?:m·s⁻¹|m/s)|speed|velocity) for ${NUM} ?s`))
  if (c) phases.push({ t: Number(c[2]), v: vTop })
  const stop = t.match(new RegExp(`(?:decelerates|brakes|slows down) uniformly to rest in ${NUM} ?s`))
  if (stop) phases.push({ t: Number(stop[1]), v: 0 })

  const tEnd = phases.reduce((a, p) => a + p.t, 0)
  const X = 10 / tEnd
  const Y = 6 / vTop
  const pts: [number, number][] = [[0, v0 * Y]]
  let acc = 0
  for (const p of phases) {
    acc += p.t
    pts.push([acc * X, p.v * Y])
  }
  // Durations along the top, the speeds on the axis: every number is one the question states.
  let x = 0
  const texts: NonNullable<SceneSpec['texts']> = phases.map((p) => {
    const mid = (x + p.t / 2) * X
    x += p.t
    return { x: mid, y: vTop * Y + 0.8, text: show(p.t, 's'), size: 10 }
  })
  texts.push({ x: -0.4, y: vTop * Y, text: show(vTop), anchor: 'end', size: 10 })
  if (v0) texts.push({ x: -0.4, y: v0 * Y, text: show(v0), anchor: 'end', size: 10 })
  texts.push({ x: 0.3, y: 8.3, text: `v (${SPEED})`, anchor: 'start', size: 10 }, { x: 11, y: -0.6, text: 't (s)', anchor: 'end', size: 10 })
  return {
    spec: {
      title: 'Velocity-time graph of the motion',
      points: [pt('O', 0, 0), pt('Xa', 11, 0), pt('Ya', 0, 7.9), pt('v1', 0, vTop * Y), pt('v1e', phases[0].t * X, vTop * Y)],
      segments: [
        { a: 'O', b: 'Xa', arrow: true },
        { a: 'O', b: 'Ya', arrow: true },
        { a: 'v1', b: 'v1e', dashed: true },
      ],
      curves: [{ points: pts, accent: true }],
      texts,
      toScale: false,
    },
    answer: /describe the shape|sketch|draw/i.test(t),
  }
}

/* ------------------------------------------------------------------ */
/* Standard figures, shown with the answer                            */
/* ------------------------------------------------------------------ */

function labelledTransverse(): SceneSpec {
  const lambda = 4
  const amp = 1.2
  return {
    title: 'A transverse wave',
    points: [pt('e0', 0, 0), pt('e1', 8, 0), pt('c0', 1, 2.1), pt('c1', 5, 2.1), pt('a0', 7, 0), pt('a1', 7, -amp)],
    segments: [
      { a: 'e0', b: 'e1', dashed: true },
      { a: 'c0', b: 'c1', label: 'wavelength λ' },
      { a: 'a0', b: 'a1', label: 'amplitude' },
    ],
    curves: [{ points: sine(0, 8, lambda, amp, -Math.PI / 2) }],
    texts: [
      { x: 1, y: 1.5, text: 'crest', accent: true },
      { x: 3, y: -1.7, text: 'trough', accent: true },
      { x: 8.2, y: 0, text: 'rest position', anchor: 'start', size: 9 },
    ],
    notes: ['One wavelength is the distance from a crest to the next crest, or a trough to the next trough.'],
    toScale: false,
    schematic: true,
  }
}

function energyProfile(kind: 'exo' | 'endo', catalysed = false): SceneSpec {
  const r = kind === 'exo' ? 4 : 2
  const p = kind === 'exo' ? 2 : 4
  const peak = 7
  const curve = (h: number): [number, number][] => {
    const pts: [number, number][] = []
    for (let i = 0; i <= 60; i++) {
      const x = 1 + (8 * i) / 60
      const s = (x - 1) / 8
      const base = r + (p - r) * (s < 0.5 ? 2 * s * s : 1 - 2 * (1 - s) * (1 - s))
      const bump = (h - (r + p) / 2) * Math.exp(-(((x - 5) / 1.3) ** 2))
      pts.push([x, base + bump])
    }
    return [[0, r], ...pts, [10, p]]
  }
  const curves: NonNullable<SceneSpec['curves']> = [{ points: curve(peak) }]
  if (catalysed) curves.push({ points: curve(5.2), dashed: true, accent: true })
  return {
    title: `Energy profile of an ${kind === 'exo' ? 'exothermic' : 'endothermic'} reaction${catalysed ? ', with and without a catalyst' : ''}`,
    points: [pt('O', 0, 0), pt('Xa', 10.5, 0), pt('Ya', 0, 8.5), pt('ea0', 2.2, r), pt('ea1', 2.2, peak), pt('dh0', 9.3, r), pt('dh1', 9.3, p), pt('rl', 1, r), pt('rr', 9.6, r)],
    segments: [
      { a: 'O', b: 'Xa', arrow: true },
      { a: 'O', b: 'Ya', arrow: true },
      { a: 'ea0', b: 'ea1', arrow: true, label: 'Ea' },
      { a: 'rl', b: 'rr', dashed: true },
      { a: 'dh0', b: 'dh1', arrow: true, label: 'ΔH', accent: true },
    ],
    curves,
    notes: [
      kind === 'exo'
        ? 'Exothermic: the products have less energy than the reactants, so ΔH is negative.'
        : 'Endothermic: the products have more energy than the reactants, so ΔH is positive.',
      ...(catalysed ? ['The dashed curve is with a catalyst: it lowers Ea, and the reactants, products and ΔH stay the same.'] : []),
    ],
    texts: [
      // Under the reactants' level: above it, the Ea arrow and the rising curve run through the word.
      { x: 0.2, y: r - 0.7, text: 'reactants', anchor: 'start', size: 10 },
      { x: 10, y: p + (kind === 'exo' ? -0.5 : 0.5), text: 'products', anchor: 'end', size: 10 },
      { x: 5, y: peak + 0.6, text: 'activated complex', size: 10 },
      { x: 0.3, y: 8.9, text: 'potential energy', anchor: 'start', size: 10 },
      { x: 10.5, y: -0.6, text: 'course of reaction', anchor: 'end', size: 10 },
    ],
    toScale: false,
    schematic: true,
  }
}

function gasVolume(kind: 'catalyst' | 'temperature' | 'single'): SceneSpec {
  const curve = (k: number): [number, number][] => Array.from({ length: 50 }, (_, i) => [(10 * i) / 49, 6 * (1 - Math.exp(-k * ((10 * i) / 49)))])
  const curves: NonNullable<SceneSpec['curves']> = [{ points: curve(0.35) }]
  const texts: NonNullable<SceneSpec['texts']> = [
    { x: 0.3, y: 7.4, text: 'volume of gas', anchor: 'start', size: 10 },
    { x: 10.5, y: -0.6, text: 'time', anchor: 'end', size: 10 },
  ]
  if (kind !== 'single') {
    curves.push({ points: curve(0.9), accent: true })
    texts.push({ x: 1.6, y: 6.7, text: kind === 'catalyst' ? 'with catalyst' : 'higher temperature (T₂)', anchor: 'start', size: 9, accent: true }, { x: 6.5, y: 4.4, text: kind === 'catalyst' ? 'without catalyst' : 'lower temperature (T₁)', size: 9 })
  }
  return {
    title: kind === 'single' ? 'Volume of gas produced against time' : 'Same final volume, reached sooner by the faster reaction',
    points: [pt('O', 0, 0), pt('Xa', 10.5, 0), pt('Ya', 0, 7.2)],
    segments: [
      { a: 'O', b: 'Xa', arrow: true },
      { a: 'O', b: 'Ya', arrow: true },
    ],
    curves,
    texts,
    notes: kind === 'single' ? ['Steep at first while reactants are plentiful; flat once one reactant is used up.'] : undefined,
    toScale: false,
    schematic: true,
  }
}


/** Plane wavefronts meeting a barrier with a gap, and what comes out the far side. */
function diffraction(): SceneSpec[] {
  const panel = (narrow: boolean): SceneSpec => {
    const gap = narrow ? 0.6 : 4
    const points: ScenePoint[] = [pt('w0', 0, 3.5), pt('w1', 0, gap / 2), pt('w2', 0, -gap / 2), pt('w3', 0, -3.5)]
    const segments: NonNullable<SceneSpec['segments']> = [
      { a: 'w0', b: 'w1', thick: true },
      { a: 'w2', b: 'w3', thick: true },
    ]
    // Incoming plane wavefronts.
    for (let k = 1; k <= 3; k++) {
      points.push(pt(`i${k}a`, -k * 1.1, 3), pt(`i${k}b`, -k * 1.1, -3))
      segments.push({ a: `i${k}a`, b: `i${k}b` })
    }
    points.push(pt('ra', -3.9, 0), pt('rb', -2.9, 0))
    segments.push({ a: 'ra', b: 'rb', arrow: true })
    // Outgoing wavefronts: arcs from a narrow gap, flat with curled ends from a wide one.
    const curves: NonNullable<SceneSpec['curves']> = []
    for (let k = 1; k <= 3; k++) {
      const r = k * 1.1
      if (narrow) curves.push({ points: Array.from({ length: 31 }, (_, i) => {
        const a = -Math.PI / 2 + (Math.PI * i) / 30
        return [r * Math.cos(a), r * Math.sin(a)] as [number, number]
      }), accent: true })
      else
        curves.push({
          points: [
            ...Array.from({ length: 8 }, (_, i) => {
              const a = -Math.PI / 2 + (Math.PI / 2) * (i / 7)
              return [r * 0.5 * Math.cos(a), -gap / 2 + r * 0.5 * Math.sin(a)] as [number, number]
            }).slice(0, -1),
            [r * 0.5, -gap / 2],
            [r * 0.5, gap / 2],
            ...Array.from({ length: 8 }, (_, i) => {
              const a = (Math.PI / 2) * (i / 7)
              return [r * 0.5 * Math.cos(a), gap / 2 + r * 0.5 * Math.sin(a)] as [number, number]
            }).slice(1),
          ],
          accent: true,
        })
    }
    return {
      title: narrow ? 'A gap close to the wavelength: strong diffraction' : 'A gap much wider than the wavelength: little diffraction',
      points,
      segments,
      curves,
      notes: [narrow ? 'The wave spreads out in circular wavefronts, as if the gap were a point source.' : 'The wave passes almost straight through; only the edges curve.'],
      toScale: false,
      schematic: true,
    }
  }
  return [panel(true), panel(false)]
}

/** Huygens: each point on a wavefront sends out a wavelet; the new wavefront touches them all. */
function huygens(): SceneSpec {
  const points: ScenePoint[] = [pt('f0', 0, 3), pt('f1', 0, -3), pt('n0', 1.6, 3), pt('n1', 1.6, -3)]
  const curves: NonNullable<SceneSpec['curves']> = []
  const discs: NonNullable<SceneSpec['discs']> = []
  for (let k = -2; k <= 2; k++) {
    const y = k * 1.2
    discs.push({ x: 0, y, r: 0.07, fill: 'ink' })
    curves.push({ points: Array.from({ length: 21 }, (_, i) => {
      const a = -Math.PI / 2 + (Math.PI * i) / 20
      return [1.6 * Math.cos(a), y + 1.6 * Math.sin(a)] as [number, number]
    }), dashed: true })
  }
  return {
    title: "Huygens' principle",
    points,
    segments: [
      { a: 'f0', b: 'f1', label: 'wavefront now' },
      { a: 'n0', b: 'n1', label: 'new wavefront', accent: true },
    ],
    curves,
    discs,
    notes: ['Every point on a wavefront is a source of secondary wavelets; the new wavefront is the line touching all of them.'],
    toScale: false,
    schematic: true,
  }
}

function standardFigures(q: Q, t: string): SceneSpec[] {
  const hasNumbers = /\d/.test(q.prompt.replace(/\d+\.\d+|°/g, ''))
  if (q.topicId === 'phys-transverse-waves-g10' && !hasNumbers && /wavelength|amplitude|crest|trough/i.test(q.prompt)) return [labelledTransverse()]
  if (/longitudinal/.test(q.topicId) && !hasNumbers && /compression|rarefaction|longitudinal wave/i.test(q.prompt))
    return [longitudinalScene('A longitudinal wave', 'wavelength λ', 'compressions', undefined, true)]
  if (/energy \(activation-energy\) diagram|energy diagram|energy profile|activation energy diagram/i.test(t)) {
    if (/catalys/i.test(t)) return [energyProfile('exo', true)]
    const exo = /exothermic/i.test(t)
    const endo = /endothermic/i.test(t)
    if (exo && endo) return [energyProfile('exo'), energyProfile('endo')]
    if (endo) return [energyProfile('endo')]
    return [energyProfile('exo')]
  }
  if (q.topicId === 'phys-wavefronts') {
    if (/diffract|slit|gap|doorway|obstacle|around the corner/i.test(t)) return diffraction()
    if (/Huygens|wavelet|wavefront/i.test(t)) return [huygens()]
  }
  if (q.topicId === 'phys-reaction-rate' && /volume[- ]of[- ]gas|volume of gas produced|volume-time graph/i.test(t)) {
    if (/catalys/i.test(t)) return [gasVolume('catalyst')]
    if (/T₂|temperature/i.test(t)) return [gasVolume('temperature')]
    return [gasVolume('single')]
  }
  return []
}

/* ------------------------------------------------------------------ */

/** Sketches for a Physical Sciences question: beside it, and with its answer. */
export function physicsDiagramsFor(q: Q): { prompt: SceneSpec[]; answer: SceneSpec[] } {
  const none = { prompt: [], answer: [] }
  if (!q.topicId.startsWith('phys-')) return none
  const t = norm([q.context ?? '', q.prompt].join(' '))
  const mo = motion(t)
  if (mo) return mo.answer ? { prompt: [], answer: [mo.spec] } : { prompt: [mo.spec], answer: [] }
  const given =
    incline(t) ??
    ray(t, q.prompt) ??
    charges(t) ??
    vectors(t) ??
    (/longitudinal|sound|compression|rarefaction/i.test(t) ? longitudinal(t, q.prompt) : null) ??
    (/transverse|crests|troughs|rope|string/i.test(t) ? transverse(t, q.prompt) : null)
  if (given) return { prompt: [given], answer: [] }
  return { prompt: [], answer: [...standardFigures(q, t), ...chemDiagramsFor(q)] }
}

