import type { Question, SceneSpec, ScenePoint } from '@/types'

/**
 * Geometry sketches built from the question's own words.
 *
 * An exam paper prints a diagram beside every triangle, circle and solid it
 * asks about; the question bank here had the words and no picture. The words
 * follow a small number of patterns -- "In triangle DEF, DE = 12, angle D = 35°
 * and angle E = 80°", "O is the centre ..., OM ⊥ chord AB, AB = 16 and radius
 * OA = 10", "a cylinder has a radius of 7 cm and a height of 10 cm" -- so each
 * pattern is read here and drawn, from those numbers and no others.
 *
 * The sketch goes WITH the question, because it holds only what the question
 * gives: each given length or angle carries its value, and the one the learner
 * must find is marked "?". `npm run check:geometry` measures every sketch drawn
 * to scale against its own labels and checks each label's number against the
 * question.
 */

type Q = Pick<Question, 'id' | 'topicId' | 'prompt' | 'context'>

const DEG = Math.PI / 180
const rad = (d: number) => d * DEG

/** One spelling for everything: Â becomes "angle A", ∠ and △ become words, 6,5 becomes 6.5. */
function norm(s: string) {
  return s
    .normalize('NFD')
    .replace(/([A-Z])̂/g, 'angle $1')
    .replace(/∠\s?/g, 'angle ')
    .replace(/[△Δ]\s?/g, 'triangle ')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/(\d) (\d{3})\b/g, '$1$2')
}

/** A value as the paper writes it: 6,5 cm. */
const show = (n: number, unit?: string) => `${String(Math.round(n * 1000) / 1000).replace('.', ',')}${unit ? ` ${unit}` : ''}`
const deg = (n: number) => `${show(n)}°`

const NUM = '(\\d+(?:\\.\\d+)?)'
const UNIT = '(?:\\s?(mm|cm|m|km|units?)\\b)?'

const pt = (id: string, x: number, y: number, label?: string, dot?: boolean): ScenePoint => ({ id, x, y, label, dot })
const polar = (cx: number, cy: number, r: number, degrees: number) => ({ x: cx + r * Math.cos(rad(degrees)), y: cy + r * Math.sin(rad(degrees)) })

/* ------------------------------------------------------------------ */
/* Triangles                                                           */
/* ------------------------------------------------------------------ */

const key = (a: string, b: string) => [a, b].sort().join('')

interface TriangleFacts {
  names: [string, string, string]
  angles: Record<string, number>
  sides: Record<string, { v: number; unit?: string }>
  right?: string
  equal?: [string, string]
}

/**
 * Every side and angle of a triangle from enough of them, or null when the
 * givens do not fix its shape (two sides and an angle that is not between them
 * can make two different triangles).
 */
function solveTriangle(t: TriangleFacts): { A: number[]; L: number[] } | null {
  const [p, q, r] = t.names
  const idx = { [p]: 0, [q]: 1, [r]: 2 } as Record<string, number>
  const A: (number | undefined)[] = [t.angles[p], t.angles[q], t.angles[r]]
  if (t.right) A[idx[t.right]] = 90
  // Side opposite each vertex.
  const opp = [key(q, r), key(p, r), key(p, q)]
  const L: (number | undefined)[] = opp.map((k) => t.sides[k]?.v)

  if (t.equal) {
    // Isosceles: the vertex the two equal sides share is the apex.
    const [s1, s2] = t.equal
    const apex = [...s1].find((c) => s2.includes(c))
    if (apex && idx[apex] !== undefined) {
      const i = idx[apex]
      const base = [0, 1, 2].filter((k) => k !== i)
      if (A[i] !== undefined) base.forEach((k) => (A[k] = (180 - A[i]!) / 2))
      else {
        const known = base.find((k) => A[k] !== undefined)
        if (known !== undefined) {
          base.forEach((k) => (A[k] = A[known]))
          A[i] = 180 - 2 * A[known]!
        }
      }
    }
  }

  const knownA = A.filter((a) => a !== undefined).length
  if (knownA === 2) {
    const miss = A.findIndex((a) => a === undefined)
    A[miss] = 180 - A.reduce<number>((s, a) => s + (a ?? 0), 0)
  }
  if (A.every((a) => a !== undefined)) {
    if (A.some((a) => a! <= 0)) return null
    const k = L.findIndex((l) => l !== undefined)
    const scale = k >= 0 ? L[k]! / Math.sin(rad(A[k]!)) : 1
    return { A: A as number[], L: A.map((a) => scale * Math.sin(rad(a!))) }
  }

  const knownL = L.filter((l) => l !== undefined).length
  if (knownL === 2) {
    const miss = L.findIndex((l) => l === undefined)
    const [i, j] = [0, 1, 2].filter((k) => k !== miss)
    if (A[miss] !== undefined) {
      // The angle between the two known sides: the cosine rule.
      L[miss] = Math.sqrt(L[i]! ** 2 + L[j]! ** 2 - 2 * L[i]! * L[j]! * Math.cos(rad(A[miss]!)))
    } else if (A[i] === 90 || A[j] === 90) {
      // The hypotenuse is known and so is one leg.
      const h = A[i] === 90 ? i : j
      const leg = h === i ? j : i
      if (L[h]! <= L[leg]!) return null
      L[miss] = Math.sqrt(L[h]! ** 2 - L[leg]! ** 2)
    } else return null
  }
  if (L.every((l) => l !== undefined)) {
    const [a, b, c] = L as number[]
    if (a + b <= c || a + c <= b || b + c <= a) return null
    const ang = (x: number, y: number, z: number) => Math.acos((y * y + z * z - x * x) / (2 * y * z)) / DEG
    return { A: [ang(a, b, c), ang(b, a, c), ang(c, a, b)], L: [a, b, c] }
  }
  return null
}

function triangleScene(title: string, t: TriangleFacts, asked: { sides: string[]; angles: string[]; exteriorAt?: string }): SceneSpec | null {
  const sol = solveTriangle(t)
  if (!sol) return null
  const [p, q, r] = t.names
  // p at the origin, q along the x-axis, r above.
  const pq = sol.L[2]
  const pr = sol.L[1]
  const pts: ScenePoint[] = [pt(p, 0, 0, p), pt(q, pq, 0, q), pt(r, pr * Math.cos(rad(sol.A[0])), pr * Math.sin(rad(sol.A[0])), r)]
  const sideLabel = (a: string, b: string) => {
    const k = key(a, b)
    if (t.sides[k]) return show(t.sides[k].v, t.sides[k].unit)
    return asked.sides.includes(k) ? '?' : undefined
  }
  const segments: NonNullable<SceneSpec['segments']> = [
    { a: p, b: q, label: sideLabel(p, q) },
    { a: q, b: r, label: sideLabel(q, r) },
    { a: p, b: r, label: sideLabel(p, r) },
  ]
  if (t.equal) {
    for (const s of t.equal) {
      const g = segments.find((g) => key(g.a, g.b) === key(s[0], s[1]))
      if (g) g.ticks = 1
    }
  }
  const others = (v: string) => t.names.filter((n) => n !== v) as [string, string]
  const angles: NonNullable<SceneSpec['angles']> = []
  for (const v of t.names) {
    const [a, b] = others(v)
    if (t.right === v) angles.push({ at: v, a, b, right: true })
    else if (t.angles[v] !== undefined) angles.push({ at: v, a, b, label: deg(t.angles[v]) })
    else if (asked.angles.includes(v)) angles.push({ at: v, a, b, label: '?' })
  }
  if (asked.exteriorAt) {
    // Produce the side from the next vertex through this one, and mark the angle outside.
    const v = asked.exteriorAt
    const [from, other] = others(v).reverse() as [string, string]
    const V = pts.find((x) => x.id === v)!
    const F = pts.find((x) => x.id === from)!
    const len = Math.hypot(V.x - F.x, V.y - F.y)
    const ext = { x: V.x + ((V.x - F.x) / len) * pq * 0.45, y: V.y + ((V.y - F.y) / len) * pq * 0.45 }
    pts.push(pt('ext', ext.x, ext.y))
    segments.push({ a: v, b: 'ext', dashed: true })
    angles.push({ at: v, a: 'ext', b: other, label: '?' })
  }
  return { title, points: pts, segments, angles, toScale: true }
}

function readTriangle(t: string, prompt: string): SceneSpec | null {
  let names: [string, string, string] | undefined
  const m = t.match(/\btriangle ([A-Z])([A-Z])([A-Z])\b/)
  if (m) names = [m[1], m[2], m[3]]
  const facts: TriangleFacts = { names: names ?? ['A', 'B', 'C'], angles: {}, sides: {} }

  // "two sides of 9 and 11 units with an included angle of 50°"
  const sas = t.match(new RegExp(`two sides of ${NUM} and ${NUM}${UNIT} with an included angle of ${NUM}°`))
  if (!names && sas) {
    facts.sides.BC = { v: Number(sas[1]), unit: sas[3] === 'units' || sas[3] === 'unit' ? undefined : sas[3] }
    facts.sides.AC = { v: Number(sas[2]), unit: facts.sides.BC.unit }
    facts.angles.C = Number(sas[4])
    return triangleScene('Two sides and the included angle', facts, { sides: [], angles: [] })
  }
  if (!names) return null
  const set = new Set(names)

  for (const a of t.matchAll(new RegExp(`angle ([A-Z]) = ${NUM}°`, 'g'))) if (set.has(a[1])) facts.angles[a[1]] = Number(a[2])
  for (const s of t.matchAll(new RegExp(`\\b([A-Z])([A-Z]) = ${NUM}${UNIT}`, 'g')))
    if (set.has(s[1]) && set.has(s[2])) facts.sides[key(s[1], s[2])] = { v: Number(s[3]), unit: s[4] && !s[4].startsWith('unit') ? s[4] : undefined }
  const right = t.match(/right angle at ([A-Z])|right-angled at ([A-Z])/)
  if (right) facts.right = right[1] ?? right[2]
  const iso = t.match(/isosceles triangle [A-Z]{3},? (?:with )?([A-Z]{2}) = ([A-Z]{2})/)
  if (iso) facts.equal = [iso[1], iso[2]]

  const p = norm(prompt)
  const askedSides = [...p.matchAll(/\b(?:length of|determine|calculate|find)\s+(?:the length of\s+)?([A-Z])([A-Z])\b/g)]
    .filter((x) => set.has(x[1]) && set.has(x[2]))
    .map((x) => key(x[1], x[2]))
    .filter((k) => !facts.sides[k])
  const askedAngles = [...p.matchAll(/angle ([A-Z])\b(?! =)/g)].map((x) => x[1]).filter((v) => set.has(v) && facts.angles[v] === undefined)
  const exterior = p.match(/exterior angle of the triangle at ([A-Z])/)?.[1]

  const what = facts.right ? `Right-angled triangle ${names.join('')}` : facts.equal ? `Isosceles triangle ${names.join('')}` : `Triangle ${names.join('')}`
  return triangleScene(what, facts, { sides: askedSides, angles: askedAngles, exteriorAt: exterior && set.has(exterior) ? exterior : undefined })
}

/** sin θ = 3/5 and friends: the right-angled triangle that ratio describes. */
function readRatio(t: string): SceneSpec | null {
  const m = t.match(/(sin|cos|tan)\s?\(?θ\)? = (\d+)\/(\d+)/)
  if (!m) return null
  const [, fn, n, d] = m
  const num = Number(n)
  const den = Number(d)
  let opp: number, adj: number, hyp: number
  if (fn === 'sin') [opp, hyp, adj] = [num, den, Math.sqrt(den * den - num * num)]
  else if (fn === 'cos') [adj, hyp, opp] = [num, den, Math.sqrt(den * den - num * num)]
  else [opp, adj, hyp] = [num, den, Math.hypot(num, den)]
  if (!Number.isFinite(opp + adj + hyp) || opp <= 0 || adj <= 0) return null
  const lab = (v: number, given: boolean) => (given ? show(v) : '?')
  return {
    title: `A right-angled triangle for ${fn} θ = ${num}/${den}`,
    points: [pt('T', 0, 0), pt('R', adj, 0), pt('P', adj, opp)],
    segments: [
      { a: 'T', b: 'R', label: lab(adj, fn !== 'sin') },
      { a: 'R', b: 'P', label: lab(opp, fn !== 'cos') },
      { a: 'T', b: 'P', label: lab(hyp, fn !== 'tan') },
    ],
    angles: [
      { at: 'T', a: 'R', b: 'P', label: 'θ' },
      { at: 'R', a: 'T', b: 'P', right: true },
    ],
    toScale: true,
  }
}

/* ------------------------------------------------------------------ */
/* Heights and distances                                               */
/* ------------------------------------------------------------------ */

function readHeights(t: string): SceneSpec | null {
  // A ladder against a wall, from its angle and how far its foot is out.
  let m = t.match(new RegExp(`ladder leans against a wall, making an angle of ${NUM}° with the ground\\. The foot of the ladder is ${NUM} m from the wall`))
  if (m) return ladder(Number(m[1]), { foot: Number(m[2]) })
  m = t.match(new RegExp(`${NUM} m ladder leans against a wall at ${NUM}° to the ground`))
  if (m) return ladder(Number(m[2]), { length: Number(m[1]) })

  // The angle of depression from a cliff top to a boat.
  m = t.match(new RegExp(`top of (?:a vertical cliff ${NUM} m high|an? ${NUM} m cliff),? the angle of depression to a boat(?: at sea)? is ${NUM}°`))
  if (m) {
    const h = Number(m[1] ?? m[2])
    const a = Number(m[3])
    const x = h / Math.tan(rad(a))
    return {
      title: 'The cliff and the boat',
      points: [pt('B', 0, 0), pt('T', 0, h), pt('S', x, 0, 'boat', true), pt('H', x, h), pt('G', x * 1.12, 0)],
      segments: [
        { a: 'B', b: 'T', label: show(h, 'm'), thick: true },
        { a: 'B', b: 'S', label: '?' },
        { a: 'S', b: 'G' },
        { a: 'T', b: 'S' },
        { a: 'T', b: 'H', dashed: true },
      ],
      angles: [
        { at: 'T', a: 'H', b: 'S', label: deg(a) },
        { at: 'B', a: 'T', b: 'S', right: true },
      ],
      toScale: true,
    }
  }

  // Two angles of elevation from points a known distance apart.
  m =
    t.match(new RegExp(`From point ([A-Z]) on the ground, the angle of elevation to the top of an? (\\w+) is ${NUM}°\\. From point ([A-Z]), ${NUM} m closer to the \\w+ along the same line, the angle of elevation is ${NUM}°`)) ??
    null
  let far: string, near: string, what: string, a1: number, d: number, a2: number
  if (m) {
    ;[far, what, near] = [m[1], m[2], m[4]]
    ;[a1, d, a2] = [Number(m[3]), Number(m[5]), Number(m[6])]
  } else {
    const n = t.match(new RegExp(`angle of elevation to the top of an? (\\w+) is ${NUM}°\\. From a point ${NUM} m closer to the \\w+ the angle is ${NUM}°`))
    if (!n) return null
    ;[far, near, what] = ['A', 'B', n[1]]
    ;[a1, d, a2] = [Number(n[2]), Number(n[3]), Number(n[4])]
  }
  if (a2 <= a1) return null
  const h = d / (1 / Math.tan(rad(a1)) - 1 / Math.tan(rad(a2)))
  const xb = h / Math.tan(rad(a2))
  return {
    title: `The ${what}, seen from two points on the ground`,
    points: [pt('F', 0, 0), pt('T', 0, h), pt(near, -xb, 0, near), pt(far, -xb - d, 0, far)],
    segments: [
      { a: 'F', b: 'T', label: '?', thick: true },
      { a: far, b: near, label: show(d, 'm') },
      { a: near, b: 'F' },
      { a: far, b: 'T' },
      { a: near, b: 'T' },
    ],
    angles: [
      { at: far, a: 'F', b: 'T', label: deg(a1) },
      { at: near, a: 'F', b: 'T', label: deg(a2) },
      { at: 'F', a: near, b: 'T', right: true },
    ],
    toScale: true,
  }
}

function ladder(angle: number, given: { foot?: number; length?: number }): SceneSpec {
  const L = given.length ?? given.foot! / Math.cos(rad(angle))
  const x = L * Math.cos(rad(angle))
  const y = L * Math.sin(rad(angle))
  return {
    title: 'A ladder against a wall',
    points: [pt('F', 0, 0), pt('W', x, 0), pt('T', x, y), pt('U', x, y * 1.15), pt('G', -x * 0.15, 0)],
    segments: [
      { a: 'G', b: 'F', thick: true },
      { a: 'F', b: 'W', label: given.foot !== undefined ? show(given.foot, 'm') : undefined, thick: true },
      { a: 'W', b: 'T', label: given.length !== undefined ? '?' : undefined, thick: true },
      { a: 'T', b: 'U', thick: true },
      { a: 'F', b: 'T', label: given.length !== undefined ? show(given.length, 'm') : '?' },
    ],
    angles: [
      { at: 'F', a: 'W', b: 'T', label: deg(angle) },
      { at: 'W', a: 'F', b: 'T', right: true },
    ],
    toScale: true,
  }
}

/* ------------------------------------------------------------------ */
/* Circles                                                             */
/* ------------------------------------------------------------------ */

function readCircle(t: string, prompt: string): SceneSpec | null {
  const centre = t.match(/\b([A-Z]) is the centre|centre ([A-Z])\b/)
  const O = centre?.[1] ?? centre?.[2] ?? 'O'

  // Perpendicular from the centre to a chord.
  let m = t.match(new RegExp(`([A-Z])([A-Z]) ⊥ chord ([A-Z])([A-Z]), \\3\\4 = ${NUM},? and radius ([A-Z]{2}) = ${NUM}`))
  if (m) {
    const [, , M, A, B, ab, , r] = m
    const half = Number(ab) / 2
    const R = Number(r)
    if (half >= R) return null
    const d = Math.sqrt(R * R - half * half)
    return {
      title: `Circle, centre ${O}, with ${O}${M} perpendicular to chord ${A}${B}`,
      points: [pt(O, 0, 0, O, true), pt(A, -half, -d, A), pt(B, half, -d, B), pt(M, 0, -d, M)],
      circles: [{ c: O, r: R }],
      segments: [
        { a: A, b: B, label: show(Number(ab)) },
        { a: O, b: M, label: '?' },
        { a: O, b: A, label: show(R) },
      ],
      angles: [{ at: M, a: O, b: B, right: true }],
      toScale: true,
    }
  }

  // Angle at the centre and at the circumference.
  m = t.match(new RegExp(`chord ([A-Z])([A-Z]) subtends an angle of ${NUM}° at (?:the centre|${O})`, 'i'))
  if (m) {
    const [, A, B, a] = m
    const theta = Number(a)
    if (theta >= 180) return null
    const C = t.match(/([A-Z]) (?:lies on|is a point on) the major arc/)?.[1] ?? 'C'
    return {
      title: `Circle, centre ${O}: angle ${A}${O}${B} at the centre`,
      points: [pt(O, 0, 0, O, true), { id: A, ...polar(0, 0, 1, -90 - theta / 2), label: A }, { id: B, ...polar(0, 0, 1, -90 + theta / 2), label: B }, { id: C, ...polar(0, 0, 1, 100), label: C }],
      circles: [{ c: O, r: 1 }],
      segments: [
        { a: O, b: A },
        { a: O, b: B },
        { a: C, b: A },
        { a: C, b: B },
      ],
      angles: [
        { at: O, a: A, b: B, label: deg(theta) },
        { at: C, a: A, b: B, label: '?' },
      ],
      toScale: true,
    }
  }

  // Angles in the same segment.
  m = t.match(new RegExp(`Chord ([A-Z])([A-Z]) subtends an angle of ${NUM}° at ([A-Z]) on the circumference\\. ([A-Z]) is another point`))
  if (m) {
    const [, A, B, a, C, D] = m
    const x = Number(a)
    return {
      title: `Angles ${A}${C}${B} and ${A}${D}${B} in the same segment`,
      points: [pt('O', 0, 0), { id: A, ...polar(0, 0, 1, -90 - x), label: A }, { id: B, ...polar(0, 0, 1, -90 + x), label: B }, { id: C, ...polar(0, 0, 1, 125), label: C }, { id: D, ...polar(0, 0, 1, 60), label: D }],
      circles: [{ c: 'O', r: 1 }],
      segments: [
        { a: C, b: A },
        { a: C, b: B },
        { a: D, b: A },
        { a: D, b: B },
      ],
      angles: [
        { at: C, a: A, b: B, label: deg(x) },
        { at: D, a: A, b: B, label: '?' },
      ],
      toScale: true,
    }
  }

  // A cyclic quadrilateral with one angle given.
  m = t.match(new RegExp(`([A-Z])([A-Z])([A-Z])([A-Z]) is a cyclic quadrilateral(?:\\.| with| in which)?(?: If)? angle ([A-Z]) = ${NUM}°`))
  if (m) {
    const names = [m[1], m[2], m[3], m[4]]
    const g = names.indexOf(m[5])
    if (g < 0) return null
    const given = Number(m[6])
    const s = 180 - given
    const phi = 215
    const at = [phi, phi + s, phi + 180, phi + 360 - s]
    const pts = names.map((n, i) => ({ id: n, ...polar(0, 0, 1, at[(i - g + 4) % 4]), label: n }))
    const asked = names.find((n) => n !== m![5] && new RegExp(`angle ${n}\\b`).test(norm(prompt)))
    const around = (i: number) => [names[(i + 3) % 4], names[(i + 1) % 4]] as const
    const angles: NonNullable<SceneSpec['angles']> = [{ at: names[g], a: around(g)[0], b: around(g)[1], label: deg(given) }]
    if (asked) {
      const i = names.indexOf(asked)
      angles.push({ at: asked, a: around(i)[0], b: around(i)[1], label: '?' })
    }
    return {
      title: `Cyclic quadrilateral ${names.join('')}`,
      points: [pt('O', 0, 0), ...pts],
      circles: [{ c: 'O', r: 1 }],
      segments: names.map((n, i) => ({ a: n, b: names[(i + 1) % 4] })),
      angles,
      toScale: true,
    }
  }

  // Two tangents from an external point.
  m = t.match(new RegExp(`From external point ([A-Z]), tangents \\1([A-Z]) and \\1([A-Z]) touch a circle with centre ([A-Z]) at \\2 and \\3\\. Angle \\2\\1\\3 = ${NUM}°`))
  if (m) {
    const [, P, A, B, C, a] = m
    const x = Number(a)
    const d = 1 / Math.sin(rad(x / 2))
    return {
      title: `Tangents ${P}${A} and ${P}${B} from the point ${P}`,
      points: [pt(C, 0, 0, C, true), pt(P, 0, -d, P), { id: A, ...polar(0, 0, 1, -90 - (90 - x / 2)), label: A }, { id: B, ...polar(0, 0, 1, -90 + (90 - x / 2)), label: B }],
      circles: [{ c: C, r: 1 }],
      segments: [
        { a: P, b: A },
        { a: P, b: B },
        { a: C, b: A },
        { a: C, b: B },
      ],
      angles: [
        { at: P, a: A, b: B, label: deg(x) },
        { at: C, a: A, b: B, label: '?' },
        { at: A, a: C, b: P, right: true },
        { at: B, a: C, b: P, right: true },
      ],
      toScale: true,
    }
  }

  // The tangent-chord angle.
  m =
    t.match(new RegExp(`([A-Z])([A-Z]) is a tangent to a circle at (?:point )?\\2\\. Chord \\2([A-Z]) makes an angle of ${NUM}° with the tangent`)) ??
    t.match(new RegExp(`([A-Z])([A-Z]) is a tangent to a circle at \\2, and \\2([A-Z]) is a chord such that the angle between \\1\\2 and \\2\\3 is ${NUM}°`))
  if (m) {
    const [, P, T, Qn, a] = m
    const b = Number(a)
    const Q = polar(0, 0, 1, -90 - 2 * b)
    const R = polar(0, 0, 1, 90 - b)
    return {
      title: `Tangent ${P}${T} and chord ${T}${Qn}`,
      points: [pt('O', 0, 0), pt(T, 0, -1, T), pt(P, -1.5, -1, P), pt('X', 1.2, -1), { id: Qn, ...Q, label: Qn }, { id: 'R', ...R, label: 'R' }],
      circles: [{ c: 'O', r: 1 }],
      segments: [
        { a: P, b: 'X' },
        { a: T, b: Qn },
        { a: 'R', b: T },
        { a: 'R', b: Qn },
      ],
      angles: [
        { at: T, a: P, b: Qn, label: deg(b) },
        { at: 'R', a: T, b: Qn, label: '?' },
      ],
      toScale: true,
    }
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Midpoints, parallel lines and similar triangles                     */
/* ------------------------------------------------------------------ */

function readProportion(t: string, prompt: string): SceneSpec | null {
  // The midpoint theorem.
  let m = t.match(new RegExp(`triangle ([A-Z])([A-Z])([A-Z]), ([A-Z]) and ([A-Z]) are the midpoints of \\1\\2 and \\1\\3 respectively, and ([A-Z]{2}) = ${NUM}${UNIT}`))
  if (m) {
    const [, A, B, C, D, E, side, v, unit] = m
    const pts = [pt(A, 3, 5, A), pt(B, 0, 0, B), pt(C, 8, 0, C), pt(D, 1.5, 2.5, D), pt(E, 5.5, 2.5, E)]
    const lab = (k: string) => (k === side ? show(Number(v), unit) : '?')
    return {
      title: `Triangle ${A}${B}${C} with the midpoints ${D} and ${E}`,
      points: pts,
      segments: [
        { a: A, b: D, ticks: 1 },
        { a: D, b: B, ticks: 1 },
        { a: A, b: E, ticks: 2 },
        { a: E, b: C, ticks: 2 },
        { a: B, b: C, label: lab(B + C) },
        { a: D, b: E, label: lab(D + E) },
      ],
      toScale: false,
    }
  }

  // Similar triangles, side by side.
  m = t.match(/Triangle ([A-Z])([A-Z])([A-Z]) is similar to triangle ([A-Z])([A-Z])([A-Z])/) ?? t.match(/Triangle ([A-Z])([A-Z])([A-Z]) \|\|\| triangle ([A-Z])([A-Z])([A-Z])/)
  if (m) {
    const [A, B, C, D, E, F] = m.slice(1)
    const sides: Record<string, string> = {}
    for (const s of t.matchAll(new RegExp(`\\b([A-Z]{2}) = ${NUM}${UNIT}`, 'g'))) sides[s[1]] = show(Number(s[2]), s[3] && !s[3].startsWith('unit') ? s[3] : undefined)
    const asked = norm(prompt).match(/length of ([A-Z]{2})/)?.[1]
    const lab = (a: string, b: string) => sides[a + b] ?? sides[b + a] ?? (asked === a + b || asked === b + a ? '?' : undefined)
    return {
      title: `Similar triangles ${A}${B}${C} and ${D}${E}${F}`,
      points: [pt(A, 1.2, 3, A), pt(B, 0, 0, B), pt(C, 4, 0, C), pt(D, 6.9, 2, D), pt(E, 6.1, 0, E), pt(F, 8.8, 0, F)],
      segments: [
        { a: A, b: B, label: lab(A, B) },
        { a: B, b: C, label: lab(B, C) },
        { a: A, b: C, label: lab(A, C) },
        { a: D, b: E, label: lab(D, E) },
        { a: E, b: F, label: lab(E, F) },
        { a: D, b: F, label: lab(D, F) },
      ],
      toScale: false,
    }
  }

  // Two triangles, each given by its three sides.
  m = t.match(new RegExp(`Triangle ([A-Z])([A-Z])([A-Z]) has sides \\1\\2 = ${NUM}, \\2\\3 = ${NUM} and \\1\\3 = ${NUM}\\. Triangle ([A-Z])([A-Z])([A-Z]) has sides \\7\\8 = ${NUM}, \\8\\9 = ${NUM} and \\7\\9 = ${NUM}`))
  if (m) {
    const [A, B, C] = [m[1], m[2], m[3]]
    const [D, E, F] = [m[7], m[8], m[9]]
    const first = triangleScene('', { names: [B, C, A], angles: {}, sides: { [key(A, B)]: { v: +m[4] }, [key(B, C)]: { v: +m[5] }, [key(A, C)]: { v: +m[6] } } }, { sides: [], angles: [] })
    const second = triangleScene('', { names: [E, F, D], angles: {}, sides: { [key(D, E)]: { v: +m[10] }, [key(E, F)]: { v: +m[11] }, [key(D, F)]: { v: +m[12] } } }, { sides: [], angles: [] })
    if (!first || !second) return null
    const gap = Math.max(...first.points.map((p) => p.x)) + Math.max(+m[4], +m[5]) * 0.3
    return {
      title: `Triangles ${A}${B}${C} and ${D}${E}${F}`,
      points: [...first.points, ...second.points.map((p) => ({ ...p, x: p.x + gap }))],
      segments: [...(first.segments ?? []), ...(second.segments ?? [])],
      toScale: true,
    }
  }

  // A line parallel to one side: the proportion theorem.
  m =
    t.match(/triangle ([A-Z])([A-Z])([A-Z]), ([A-Z]) lies on \1\2 and ([A-Z]) lies on \1\3/) ??
    t.match(/triangle ([A-Z])([A-Z])([A-Z]), ([A-Z]) and ([A-Z]) lie on \1\2 and \1\3 respectively/) ??
    t.match(/triangle ([A-Z])([A-Z])([A-Z]), ([A-Z])([A-Z]) is (?:drawn )?parallel to \2\3/)
  if (m) {
    const [A, B, C, D, E] = m.slice(1)
    const parallel = new RegExp(`${D}${E} (?:is )?(?:drawn )?(?:parallel to|∥) ${B}${C}`).test(t)
    const vals: Record<string, string> = {}
    for (const s of t.matchAll(new RegExp(`\\b([A-Z]{2}) = ${NUM}${UNIT}`, 'g'))) vals[s[1]] = show(Number(s[2]), s[3] && !s[3].startsWith('unit') ? s[3] : undefined)
    for (const s of t.matchAll(/\b([A-Z]{2}) = (x(?: [+−-] \d+)?)/g)) vals[s[1]] = s[2]
    const asked = norm(prompt).match(/(?:length of|determine|calculate) ([A-Z]{2})\b/)?.[1]
    const lab = (k: string) => vals[k] ?? vals[k[1] + k[0]] ?? (asked === k ? '?' : undefined)
    const pts = [pt(A, 3, 6, A), pt(B, 0, 0, B), pt(C, 8, 0, C), pt(D, 1.2, 3.6, D), pt(E, 4.6, 3.6, E)]
    return {
      title: parallel ? `Triangle ${A}${B}${C} with ${D}${E} parallel to ${B}${C}` : `Triangle ${A}${B}${C} with ${D} on ${A}${B} and ${E} on ${A}${C}`,
      points: pts,
      segments: [
        { a: A, b: D, label: lab(A + D) },
        { a: D, b: B, label: lab(D + B) },
        { a: A, b: E, label: lab(A + E) },
        { a: E, b: C, label: lab(E + C) },
        { a: B, b: C, label: lab(B + C), arrows: parallel ? 1 : 0 },
        { a: D, b: E, label: lab(D + E), arrows: parallel ? 1 : 0 },
      ],
      notes: vals[A + B] ? [`${A}${B} = ${vals[A + B]}`] : vals[A + C] ? [`${A}${C} = ${vals[A + C]}`] : undefined,
      toScale: false,
    }
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Polygons                                                            */
/* ------------------------------------------------------------------ */

function readPolygon(t: string): SceneSpec | null {
  const m = t.match(/polygon with (\d+) sides/)
  if (!m) return null
  const n = Number(m[1])
  if (n < 3 || n > 24) return null
  const exterior = /exterior angle/.test(t)
  const pts = Array.from({ length: n }, (_, i) => ({ id: `v${i}`, ...polar(0, 0, 1, -90 - 180 / n + (360 * i) / n) }))
  const segments: NonNullable<SceneSpec['segments']> = pts.map((p, i) => ({ a: p.id, b: pts[(i + 1) % n].id }))
  const angles: NonNullable<SceneSpec['angles']> = []
  if (exterior) {
    // Produce the bottom side past v1 and mark the turn.
    const a = pts[0]
    const b = pts[1]
    pts.push({ id: 'ext', x: b.x + (b.x - a.x) * 0.8, y: b.y + (b.y - a.y) * 0.8 })
    segments.push({ a: 'v1', b: 'ext', dashed: true })
    angles.push({ at: 'v1', a: 'ext', b: 'v2', label: '?' })
  } else angles.push({ at: 'v1', a: 'v0', b: 'v2', label: '?' })
  return { title: `A regular polygon with ${n} sides`, points: pts, segments, angles, toScale: true }
}

/* ------------------------------------------------------------------ */
/* Solids                                                              */
/* ------------------------------------------------------------------ */

/** A box in oblique projection: the front face flat, the depth drawn back at 35°. */
function prism(l: number, w: number, h: number, labels: { l?: string; w?: string; h?: string }, title: string): SceneSpec {
  const dx = w * 0.5 * Math.cos(rad(35))
  const dy = w * 0.5 * Math.sin(rad(35))
  const P = (id: string, x: number, y: number) => pt(id, x, y)
  return {
    title,
    points: [P('a', 0, 0), P('b', l, 0), P('c', l, h), P('d', 0, h), P('e', dx, dy), P('f', l + dx, dy), P('g', l + dx, h + dy), P('k', dx, h + dy)],
    segments: [
      { a: 'a', b: 'b', label: labels.l },
      { a: 'b', b: 'c', label: labels.h },
      { a: 'c', b: 'd' },
      { a: 'd', b: 'a' },
      { a: 'b', b: 'f', label: labels.w },
      { a: 'f', b: 'g' },
      { a: 'c', b: 'g' },
      { a: 'd', b: 'k' },
      { a: 'k', b: 'g' },
      { a: 'a', b: 'e', dashed: true },
      { a: 'e', b: 'f', dashed: true },
      { a: 'e', b: 'k', dashed: true },
    ],
    toScale: false,
  }
}

function cylinder(r: number, h: number, labels: { r?: string; d?: string; h?: string }, title: string): SceneSpec {
  const ry = r * 0.3
  return {
    title,
    points: [pt('l0', -r, 0), pt('r0', r, 0), pt('l1', -r, h), pt('r1', r, h), pt('o', 0, h, undefined, true)],
    ellipses: [
      { cx: 0, cy: 0, rx: r, ry, dashedTop: true },
      { cx: 0, cy: h, rx: r, ry },
    ],
    segments: [
      { a: 'l0', b: 'l1' },
      { a: 'r0', b: 'r1', label: labels.h },
      labels.d ? { a: 'l1', b: 'r1', label: labels.d, dashed: true } : { a: 'o', b: 'r1', label: labels.r, dashed: true },
    ],
    toScale: false,
  }
}

function readSolid(t: string, prompt: string): SceneSpec | null {
  const u = (x?: string) => (x && !x.startsWith('unit') ? x : undefined)
  let m = t.match(new RegExp(`length ${NUM}${UNIT},? width ${NUM}${UNIT},? and height ${NUM}${UNIT}`))
  if (m) return prism(Number(m[1]), Number(m[3]), Number(m[5]), { l: show(Number(m[1]), u(m[2])), w: show(Number(m[3]), u(m[4])), h: show(Number(m[5]), u(m[6])) }, 'Rectangular prism')
  m = t.match(new RegExp(`measures ${NUM}${UNIT} long, ${NUM}${UNIT} wide,? and ${NUM}${UNIT} (?:deep|high)`))
  if (m) return prism(Number(m[1]), Number(m[3]), Number(m[5]), { l: show(Number(m[1]), u(m[2])), w: show(Number(m[3]), u(m[4])), h: show(Number(m[5]), u(m[6])) }, 'Rectangular prism')
  m = t.match(new RegExp(`volume (?:of )?${NUM}${UNIT}³ has a square base of side ${NUM}${UNIT}`))
  if (m) {
    const s = Number(m[3])
    return prism(s, s, (Number(m[1]) / (s * s)), { l: show(s, u(m[4])), w: show(s, u(m[4])), h: '?' }, 'Prism on a square base')
  }
  m = t.match(new RegExp(`right-angled triangular cross-section with perpendicular sides ${NUM}${UNIT} and ${NUM}${UNIT},? and a length of ${NUM}${UNIT}`))
  if (m) {
    const a = Number(m[1])
    const b = Number(m[3])
    const L = Number(m[5])
    const dx = L * 0.5 * Math.cos(rad(35))
    const dy = L * 0.5 * Math.sin(rad(35))
    return {
      title: 'Triangular prism',
      points: [pt('p', 0, 0), pt('q', b, 0), pt('r', 0, a), pt('p2', dx, dy), pt('q2', b + dx, dy), pt('r2', dx, a + dy)],
      segments: [
        { a: 'p', b: 'q', label: show(b, u(m[4])) },
        { a: 'p', b: 'r', label: show(a, u(m[2])) },
        { a: 'q', b: 'r' },
        { a: 'q', b: 'q2', label: show(L, u(m[6])) },
        { a: 'r', b: 'r2' },
        { a: 'q2', b: 'r2' },
        { a: 'p', b: 'p2', dashed: true },
        { a: 'p2', b: 'q2', dashed: true },
        { a: 'p2', b: 'r2', dashed: true },
      ],
      angles: [{ at: 'p', a: 'q', b: 'r', right: true }],
      toScale: false,
    }
  }
  // Cylinders: radius or diameter, then height -- in either order.
  const cyl = /cylind/i.test(t)
  if (cyl) {
    const r = t.match(new RegExp(`radius (?:of )?${NUM}${UNIT}`))
    const d = t.match(new RegExp(`diameter (?:of )?${NUM}${UNIT}`))
    const h = t.match(new RegExp(`(?:height|depth|high|tall)(?: of| is)? ${NUM}${UNIT}`)) ?? t.match(new RegExp(`${NUM}${UNIT} (?:high|tall|deep)`))
    if ((r || d) && h) {
      const rr = r ? Number(r[1]) : Number(d![1]) / 2
      const hh = Number(h[1])
      // Two cylinders compared: draw the first, which is the one fully given.
      return cylinder(rr, hh, r ? { r: show(rr, u(r[2])), h: show(hh, u(h[2])) } : { d: show(Number(d![1]), u(d![2])), h: show(hh, u(h[2])) }, /tank/i.test(t) ? 'Cylindrical tank' : 'Cylinder')
    }
  }
  void prompt
  return null
}

/* ------------------------------------------------------------------ */
/* Plans                                                               */
/* ------------------------------------------------------------------ */

function readPlan(t: string): SceneSpec | null {
  const m =
    t.match(new RegExp(`(?:measures?|measuring|is|of) ${NUM}\\s?(cm|mm|m) by ${NUM}\\s?(cm|mm|m)\\b`)) ??
    t.match(new RegExp(`(?:measures?|measuring|is) ${NUM}\\s?(cm|mm|m) long and ${NUM}\\s?(cm|mm|m) (?:wide|high)`))
  if (!m) return null
  const a = Number(m[1])
  const b = Number(m[3])
  const raw = t.match(/1\s?:\s?(\d+)/)?.[1]
  // 1 : 1 000, spaced the way the paper writes it.
  const scale = raw?.replace(/\B(?=(\d{3})+$)/g, ' ')
  const onPlan = /on (?:the |a |its )?(?:same )?(?:site |floor |house )?plan|on the map/.test(t)
  // Name the thing that is measured: the last "the ... measures" before the dimensions.
  const named = [...t.slice(0, (m.index ?? 0) + 12).matchAll(/\b(?:the|a|an|one|its|their)\s+([a-z’' -]{3,40}?)\s+(?:is drawn|measures|measuring|is\b)/gi)]
  const what = named.length
    ? named[named.length - 1][1]
        .replace(/^(?:perimeter|area) of (?:a|an|the)\s+/, '')
        .replace(/\s+(?:that|itself|on (?:the|a|its) .*|within .*|along .*)$/, '')
        .trim()
    : undefined
  const thing = what && !/\bplan\b/.test(what) ? what : undefined
  const long = Math.max(a, b)
  const short = Math.min(a, b)
  return {
    title: onPlan ? `On the plan${thing ? `: the ${thing}` : ''}` : thing ? `The ${thing}` : 'Rectangle',
    points: [pt('a', 0, 0), pt('b', long, 0), pt('c', long, short), pt('d', 0, short)],
    segments: [
      { a: 'a', b: 'b', label: show(long, m[a >= b ? 2 : 4]), thick: true },
      { a: 'b', b: 'c', label: show(short, m[a >= b ? 4 : 2]), thick: true },
      { a: 'c', b: 'd', thick: true },
      { a: 'd', b: 'a', thick: true },
    ],
    notes: scale ? [`Scale 1 : ${scale}`] : undefined,
    toScale: true,
  }
}

/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/* The Cartesian plane                                                 */
/* ------------------------------------------------------------------ */

const COORD = '\\(\\s?(−?-?\\d+(?:\\.\\d+)?)\\s?;\\s?(−?-?\\d+(?:\\.\\d+)?)\\s?\\)'
const cnum = (s: string) => Number(s.replace('−', '-'))
const coord = (x: number, y: number) => `(${show(x).replace('-', '−')} ; ${show(y).replace('-', '−')})`

/** Axes through the origin, wide enough for everything on the plane. */
function plane(xs: number[], ys: number[]): { points: ScenePoint[]; segments: NonNullable<SceneSpec['segments']>; texts: NonNullable<SceneSpec['texts']> } {
  const pad = 1.5
  const x0 = Math.min(0, ...xs) - pad
  const x1 = Math.max(0, ...xs) + pad
  const y0 = Math.min(0, ...ys) - pad
  const y1 = Math.max(0, ...ys) + pad
  return {
    points: [pt('ax0', x0, 0), pt('ax1', x1, 0), pt('ay0', 0, y0), pt('ay1', 0, y1)],
    segments: [
      { a: 'ax0', b: 'ax1', arrow: true },
      { a: 'ay0', b: 'ay1', arrow: true },
    ],
    texts: [
      { x: x1, y: -0.7, text: 'x', size: 11 },
      { x: 0.5, y: y1, text: 'y', size: 11 },
      { x: -0.5, y: -0.7, text: 'O', size: 10 },
    ],
  }
}

function readCartesian(t: string, prompt: string): SceneSpec | null {
  // A circle: centre and radius, centre and a point on it, or its equation.
  let cx: number | undefined, cy: number | undefined, r: number | undefined
  const cr = t.match(new RegExp(`centre (?:[A-Z])?${COORD} and radius (\\d+(?:\\.\\d+)?)`))
  const eq = t.match(/\(x ([−+-]) (\d+(?:\.\d+)?)\)² \+ \(y ([−+-]) (\d+(?:\.\d+)?)\)² = (\d+(?:\.\d+)?)/)
  const origin = t.match(/x² \+ y² = (\d+(?:\.\d+)?)/)
  if (cr) [cx, cy, r] = [cnum(cr[1]), cnum(cr[2]), Number(cr[3])]
  else if (eq) {
    cx = (eq[1] === '+' ? -1 : 1) * Number(eq[2])
    cy = (eq[3] === '+' ? -1 : 1) * Number(eq[4])
    r = Math.sqrt(Number(eq[5]))
  } else if (origin) [cx, cy, r] = [0, 0, Math.sqrt(Number(origin[1]))]

  const named = [...t.matchAll(new RegExp(`\\b([A-Z])\\s?${COORD}`, 'g'))].map((m) => ({ id: m[1], x: cnum(m[2]), y: cnum(m[3]) }))
  const bare = [...t.matchAll(new RegExp(`(?:the point|point)\\s${COORD}`, 'g'))].map((m, i) => ({ id: `P${i}`, x: cnum(m[1]), y: cnum(m[2]) }))
  const seenId = new Set<string>()
  const pts = [...named, ...bare].filter((p) => (seenId.has(p.id) ? false : (seenId.add(p.id), true)))

  if (cx === undefined) {
    // A centre named with a point on the circle: the radius is the distance between them.
    const c = t.match(new RegExp(`centre (?:([A-Z]))?${COORD}`))
    if (c && pts.length) {
      cx = cnum(c[2])
      cy = cnum(c[3])
      const other = pts.find((p) => p.x !== cx || p.y !== cy)
      if (other) r = Math.hypot(other.x - cx, other.y - cy)
    }
  }
  const hasCircle = cx !== undefined && cy !== undefined && r !== undefined && r > 0
  if (!hasCircle && pts.length < 2) return null
  // An image under a transformation is the answer: draw only the point given.
  if (/image of/i.test(prompt) && !hasCircle) return null

  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  if (hasCircle) xs.push(cx! - r!, cx! + r!), ys.push(cy! - r!, cy! + r!)
  const base = plane(xs, ys)
  const points: ScenePoint[] = [...base.points, ...pts.map((p) => ({ id: p.id, x: p.x, y: p.y, label: p.id.startsWith('P') && p.id.length > 1 ? coord(p.x, p.y) : `${p.id}${coord(p.x, p.y)}`, dot: true }))]
  const segments = [...base.segments]
  const polygon = t.match(/(?:Triangle|Quadrilateral|triangle|quadrilateral) ([A-Z]{3,4})\b/)
  if (polygon && polygon[1].split('').every((c) => pts.some((p) => p.id === c))) {
    const ids = polygon[1].split('')
    ids.forEach((id, i) => segments.push({ a: id, b: ids[(i + 1) % ids.length] }))
  } else if (/line (?:passing )?through ([A-Z]) ?\(/.test(t) && pts.length === 2) segments.push({ a: pts[0].id, b: pts[1].id })
  let circles: SceneSpec['circles']
  if (hasCircle) {
    const centreId = pts.find((p) => p.x === cx && p.y === cy)?.id
    if (!centreId) points.push({ id: 'centre', x: cx!, y: cy!, label: coord(cx!, cy!), dot: true })
    circles = [{ c: centreId ?? 'centre', r: r! }]
    if (/tangent/i.test(t)) {
      const T = pts.find((p) => p.id !== centreId && Math.abs(Math.hypot(p.x - cx!, p.y - cy!) - r!) < 1e-6)
      if (T) {
        // The tangent at T, perpendicular to the radius -- its equation is what is asked, so it is dashed.
        const ux = -(T.y - cy!) / r!
        const uy = (T.x - cx!) / r!
        points.push(pt('t0', T.x - ux * r! * 0.8, T.y - uy * r! * 0.8), pt('t1', T.x + ux * r! * 0.8, T.y + uy * r! * 0.8))
        segments.push({ a: 't0', b: 't1', dashed: true }, { a: centreId ?? 'centre', b: T.id })
      }
    }
  }
  return {
    title: hasCircle ? 'The circle on the Cartesian plane' : polygon ? `${polygon[1]} on the Cartesian plane` : 'The points on the Cartesian plane',
    points,
    segments,
    circles,
    texts: base.texts,
    toScale: true,
  }
}

/** A parabola fixed by what the question gives: its x-intercepts (a = 1), or its turning point. */
function readParabola(t: string): SceneSpec | null {
  let f: ((x: number) => number) | null = null
  let marks: ScenePoint[] = []
  let xs: number[] = []
  const roots = t.match(/y = x² \+ bx \+ c has x-intercepts at (−?\d+(?:\.\d+)?) and (−?\d+(?:\.\d+)?)/)
  if (roots) {
    const [a, b] = [cnum(roots[1]), cnum(roots[2])]
    f = (x) => (x - a) * (x - b)
    marks = [{ id: 'r0', x: a, y: 0, label: show(a).replace('-', '−'), dot: true }, { id: 'r1', x: b, y: 0, label: show(b).replace('-', '−'), dot: true }]
    xs = [a, b]
  }
  const tp = t.match(new RegExp(`parabola opening (upward|downward), with a (?:minimum|maximum) turning point at ${COORD}`))
  if (tp) {
    const [p, q] = [cnum(tp[2]), cnum(tp[3])]
    const sgn = tp[1] === 'upward' ? 1 : -1
    f = (x) => sgn * (x - p) ** 2 + q
    marks = [{ id: 'tp', x: p, y: q, label: coord(p, q), dot: true }]
    xs = [p - 3, p + 3]
  }
  if (!f) return null
  const lo = Math.min(...xs) - 1.2
  const hi = Math.max(...xs) + 1.2
  const pts: [number, number][] = Array.from({ length: 60 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / 59
    return [x, f!(x)]
  })
  const base = plane([lo, hi], pts.map(([, y]) => y))
  return {
    title: roots ? 'The parabola through its x-intercepts' : 'The parabola and its turning point',
    points: [...base.points, ...marks],
    segments: base.segments,
    curves: [{ points: pts, accent: true }],
    texts: base.texts,
    notes: tp ? ['Sketch: the shape of the parabola is not given, only its turning point.'] : undefined,
    toScale: false,
  }
}

/**
 * The standard figure for a theorem the learner is asked to prove. An exam
 * prints one: the proof is about the general case, but it is written about
 * named points, and the names need a picture to belong to.
 */
function proofFigure(t: string): SceneSpec | null {
  const circle = (extra: ScenePoint[], segments: NonNullable<SceneSpec['segments']>, title: string, angles?: SceneSpec['angles']): SceneSpec => ({
    title,
    points: [pt('O', 0, 0, 'O', true), ...extra],
    circles: [{ c: 'O', r: 1 }],
    segments,
    angles,
    toScale: true,
  })
  const on = (id: string, d: number, label = id): ScenePoint => ({ id, ...polar(0, 0, 1, d), label })
  if (/perpendicular to (?:a|the) chord|to the midpoint of a chord|bisecting a chord/.test(t)) {
    const A = polar(0, 0, 1, 210)
    return circle([on('A', 210), on('B', 330), pt('M', 0, A.y, 'M')], [{ a: 'A', b: 'B' }, { a: 'O', b: 'M' }, { a: 'O', b: 'A' }, { a: 'O', b: 'B' }], 'Centre O, chord AB, and M on AB', [{ at: 'M', a: 'O', b: 'B', right: true }])
  }
  if (/twice the angle subtended/.test(t))
    return circle([on('A', 215), on('B', 325), on('C', 95)], [{ a: 'O', b: 'A' }, { a: 'O', b: 'B' }, { a: 'C', b: 'A' }, { a: 'C', b: 'B' }, { a: 'C', b: 'O', dashed: true }], 'Arc AB, the centre O and C on the circumference')
  if (/opposite angles of a cyclic quadrilateral|exterior angle/.test(t) && /cyclic/.test(t)) {
    const pts = [on('A', 200), on('B', 290), on('C', 20), on('D', 110)]
    const segs: NonNullable<SceneSpec['segments']> = [{ a: 'A', b: 'B' }, { a: 'B', b: 'C' }, { a: 'C', b: 'D' }, { a: 'D', b: 'A' }]
    if (/produced to E/.test(t)) {
      const A = pts[0]
      const B = pts[1]
      pts.push(pt('E', B.x + (B.x - A.x) * 0.6, B.y + (B.y - A.y) * 0.6, 'E'))
      segs.push({ a: 'B', b: 'E', dashed: true })
    }
    return circle(pts, segs, 'Cyclic quadrilateral ABCD')
  }
  if (/AB = AD/.test(t) && /cyclic/.test(t)) return circle([on('A', 200), on('B', 290), on('C', 20), on('D', 110)], [{ a: 'A', b: 'B', ticks: 1 }, { a: 'B', b: 'C' }, { a: 'C', b: 'D' }, { a: 'D', b: 'A', ticks: 1 }, { a: 'A', b: 'C', dashed: true }], 'Cyclic quadrilateral ABCD with AB = AD')
  if (/tangent-chord|tangent to a circle and a chord/.test(t))
    return circle([on('T', 270), pt('P', -1.5, -1, 'P'), pt('X', 1.3, -1), on('Q', 160), on('R', 45)], [{ a: 'P', b: 'X' }, { a: 'T', b: 'Q' }, { a: 'R', b: 'T' }, { a: 'R', b: 'Q' }], 'Tangent PT at T, chord TQ, and R in the alternate segment')
  if (/tangents? .*from an external point|two tangents/i.test(t)) {
    const d = 1 / Math.sin(rad(25))
    return circle([pt('P', 0, -d, 'P'), on('T', 270 - 65), on('S', 270 + 65)], [{ a: 'P', b: 'T' }, { a: 'P', b: 'S' }, { a: 'O', b: 'T', dashed: true }, { a: 'O', b: 'S', dashed: true }, { a: 'O', b: 'P', dashed: true }], 'Tangents PT and PS from the point P')
  }
  if (/tangent to a circle is perpendicular to the radius/.test(t))
    return circle([on('T', 270), pt('P', -1.4, -1, 'P'), pt('X', 1.4, -1)], [{ a: 'P', b: 'X' }, { a: 'O', b: 'T' }], 'Tangent at T and the radius OT')
  if (/PT² = PA · PB/.test(t)) {
    const A = polar(0, 0, 1, 160)
    const B = polar(0, 0, 1, 20)
    const Px = B.x + (B.x - A.x) * 0.7
    return circle([{ id: 'A', ...A, label: 'A' }, { id: 'B', ...B, label: 'B' }, pt('P', Px, B.y, 'P'), on('T', 300)], [{ a: 'A', b: 'P' }, { a: 'P', b: 'T' }], 'Chord AB produced to P, and the tangent PT')
  }
  if (/diameter of a circle with centre|angle in a semicircle/.test(t)) return circle([on('A', 180), on('B', 0), on('C', 60)], [{ a: 'A', b: 'B' }, { a: 'C', b: 'A' }, { a: 'C', b: 'B' }], 'Diameter AB and C on the circle')
  if (/parallel to BC|∥ BC/.test(t) && /triangle ABC/.test(t))
    return { title: 'Triangle ABC with DE parallel to BC', points: [pt('A', 3, 6, 'A'), pt('B', 0, 0, 'B'), pt('C', 8, 0, 'C'), pt('D', 1.2, 3.6, 'D'), pt('E', 4.6, 3.6, 'E')], segments: [{ a: 'A', b: 'B' }, { a: 'A', b: 'C' }, { a: 'B', b: 'C', arrows: 1 }, { a: 'D', b: 'E', arrows: 1 }], toScale: false }
  if (/right angle at A, and AD is drawn perpendicular to BC/.test(t))
    return { title: 'Triangle ABC, right-angled at A, with AD perpendicular to BC', points: [pt('A', 3.2, 2.4, 'A'), pt('B', 0, 0, 'B'), pt('C', 5, 0, 'C'), pt('D', 3.2, 0, 'D')], segments: [{ a: 'A', b: 'B' }, { a: 'A', b: 'C' }, { a: 'B', b: 'C' }, { a: 'A', b: 'D' }], angles: [{ at: 'A', a: 'B', b: 'C', right: true }, { at: 'D', a: 'A', b: 'C', right: true }], toScale: true }
  return null
}

const GEOMETRY_TOPICS = new Set(['math-euclidean-geometry', 'math-trigonometry', 'maps-plans', 'measurement', 'math-analytical-geometry', 'math-functions'])

/** The sketch to show with a question, or null. */
export function geometryDiagramFor(q: Q): SceneSpec | null {
  if (!GEOMETRY_TOPICS.has(q.topicId)) return null
  const t = norm([q.context ?? '', q.prompt].join(' '))
  const proof = /\bProve\b/.test(q.prompt) ? proofFigure(t) : null
  if (proof) return proof
  if (q.topicId === 'maps-plans' || q.topicId === 'measurement') return readSolid(t, q.prompt) ?? readPlan(t)
  if (q.topicId === 'math-analytical-geometry') return readCartesian(t, q.prompt)
  if (q.topicId === 'math-functions') return readParabola(t)
  return readCircle(t, q.prompt) ?? readProportion(t, q.prompt) ?? readHeights(t) ?? readRatio(t) ?? readSolid(t, q.prompt) ?? readPolygon(t) ?? readTriangle(t, q.prompt)
}
