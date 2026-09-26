import type { SceneSpec } from '@/types'

/**
 * Draws a geometry sketch -- triangles, circles, solids, plans -- from a
 * SceneSpec. The spec is in the problem's own units; this fits it to the page.
 *
 * Labels are placed by rule rather than by hand, so hundreds of generated
 * sketches can share one renderer: a point's name sits on the far side of it
 * from the middle of the figure, a length sits beside the middle of its line on
 * the outside, and an angle's size sits on the bisector just beyond its arc.
 * What the question asks for is labelled "?" and drawn in gold.
 *
 * Each of those spots is a first choice, not a fixed one. Every label is tried
 * against the lines, curves, arcs, dots and labels already placed, and moves to
 * the next candidate spot when something runs through it; the frame is then
 * sized to the drawing and all its labels, so none is cut off at the edge.
 */

const INK = '#1e3a5f'
const ACCENT = '#b8860b'

const PAD = 30
const SIDE = 46
// On a phone a diagram gets about 290 px. The drawing is kept narrow enough
// that, with its labels round it, it is shown at close to full size there --
// a 12-unit label reads as about 11 px, not 8.
const MAX_W = 240
const MAX_H = 200
/** The smallest text a phone can read comfortably, in viewBox units. */
const MIN_FONT = 10.5

type XY = { x: number; y: number }

/** A label's box, estimated from its length: SVG cannot measure before it draws. */
type Box = { l: number; r: number; t: number; b: number }
// Bold glyph widths as a fraction of the font size, erring wide: a label
// that is estimated too narrow is cut off at the edge of the frame.
const glyphWidth = (c: string) => (/[mwMW]/.test(c) ? 1 : /[il,.:;' ()|]/.test(c) ? 0.4 : /[A-Z]/.test(c) ? 0.8 : /[0-9]/.test(c) ? 0.72 : 0.66)
function textBox(x: number, y: number, text: string, size: number, anchor: 'start' | 'middle' | 'end'): Box {
  const w = [...text].reduce((sum, c) => sum + glyphWidth(c), 0) * size
  const l = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
  return { l, r: l + w, t: y - size * 0.78, b: y + size * 0.22 }
}
const hits = (a: Box, b: Box) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 0.5 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 0.5
/** Does the line from p to q pass through, or graze, the box? Clipped exactly (Liang–Barsky), with a 1.5-unit margin. */
function crosses(p: XY, q: XY, box: Box) {
  const l = box.l - 1.5
  const r = box.r + 1.5
  const t = box.t - 1.5
  const b = box.b + 1.5
  if (l >= r || t >= b) return false
  const dx = q.x - p.x
  const dy = q.y - p.y
  let lo = 0
  let hi = 1
  for (const [den, num] of [
    [-dx, p.x - l],
    [dx, r - p.x],
    [-dy, p.y - t],
    [dy, b - p.y],
  ]) {
    if (den === 0) {
      if (num < 0) return false
      continue
    }
    const k = num / den
    if (den < 0) lo = Math.max(lo, k)
    else hi = Math.min(hi, k)
    if (lo > hi) return false
  }
  return true
}

export function GeometryDiagram({ spec }: { spec: SceneSpec }) {
  const byId = new Map(spec.points.map((p) => [p.id, p]))
  const P = (id: string) => byId.get(id)!

  // Fit: the bounding box of every point, circle and ellipse.
  const xs: number[] = []
  const ys: number[] = []
  for (const p of spec.points) {
    xs.push(p.x)
    ys.push(p.y)
  }
  for (const c of spec.circles ?? []) {
    const o = P(c.c)
    xs.push(o.x - c.r, o.x + c.r)
    ys.push(o.y - c.r, o.y + c.r)
  }
  for (const e of spec.ellipses ?? []) {
    xs.push(e.cx - e.rx, e.cx + e.rx)
    ys.push(e.cy - e.ry, e.cy + e.ry)
  }
  for (const c of spec.curves ?? [])
    for (const [x, y] of c.points) {
      xs.push(x)
      ys.push(y)
    }
  for (const t of spec.texts ?? []) {
    xs.push(t.x)
    ys.push(t.y)
  }
  for (const d of spec.discs ?? []) {
    xs.push(d.x - d.r, d.x + d.r)
    ys.push(d.y - d.r, d.y + d.r)
  }
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const s = Math.min(MAX_W / (maxX - minX || 1), MAX_H / (maxY - minY || 1))
  const sx = (x: number) => SIDE + (x - minX) * s
  const sy = (y: number) => PAD + (maxY - y) * s
  const at = (id: string): XY => ({ x: sx(P(id).x), y: sy(P(id).y) })

  // The middle of the figure, which labels are pushed away from.
  const named = spec.points.filter((p) => p.label !== undefined || spec.segments?.some((g) => g.a === p.id || g.b === p.id))
  const mid: XY = {
    x: named.reduce((a, p) => a + sx(p.x), 0) / (named.length || 1),
    y: named.reduce((a, p) => a + sy(p.y), 0) / (named.length || 1),
  }
  const away = (from: XY, dist: number): XY => {
    const dx = from.x - mid.x
    const dy = from.y - mid.y
    const len = Math.hypot(dx, dy) || 1
    return { x: from.x + (dx / len) * dist, y: from.y + (dy / len) * dist }
  }
  const isAsk = (label?: string) => label !== undefined && /\?/.test(label)

  // Every straight line and curve, in page units, so labels can keep off them.
  const lines: { p: XY; q: XY }[] = []
  for (const g of spec.segments ?? []) lines.push({ p: at(g.a), q: at(g.b) })
  for (const c of spec.curves ?? [])
    for (let k = 1; k < c.points.length; k++)
      lines.push({ p: { x: sx(c.points[k - 1][0]), y: sy(c.points[k - 1][1]) }, q: { x: sx(c.points[k][0]), y: sy(c.points[k][1]) } })
  for (const e of spec.ellipses ?? []) {
    const cx = sx(e.cx)
    const cy = sy(e.cy)
    for (let k = 0; k < 24; k++) {
      const a1 = (k / 24) * 2 * Math.PI
      const a2 = ((k + 1) / 24) * 2 * Math.PI
      lines.push({ p: { x: cx + Math.cos(a1) * e.rx * s, y: cy + Math.sin(a1) * e.ry * s }, q: { x: cx + Math.cos(a2) * e.rx * s, y: cy + Math.sin(a2) * e.ry * s } })
    }
  }
  for (const c of spec.circles ?? []) {
    const o = at(c.c)
    for (let k = 0; k < 32; k++) {
      const a1 = (k / 32) * 2 * Math.PI
      const a2 = ((k + 1) / 32) * 2 * Math.PI
      lines.push({ p: { x: o.x + Math.cos(a1) * c.r * s, y: o.y + Math.sin(a1) * c.r * s }, q: { x: o.x + Math.cos(a2) * c.r * s, y: o.y + Math.sin(a2) * c.r * s } })
    }
  }
  // Angle arcs and right-angle marks are drawn round a vertex; labels keep off them too.
  for (const an of spec.angles ?? []) {
    const o = at(an.at)
    const ua = Math.atan2(at(an.a).y - o.y, at(an.a).x - o.x)
    const ub = Math.atan2(at(an.b).y - o.y, at(an.b).x - o.x)
    if (an.right) {
      const p1 = { x: o.x + Math.cos(ua) * 9, y: o.y + Math.sin(ua) * 9 }
      const p2 = { x: o.x + Math.cos(ub) * 9, y: o.y + Math.sin(ub) * 9 }
      const p3 = { x: p1.x + Math.cos(ub) * 9, y: p1.y + Math.sin(ub) * 9 }
      lines.push({ p: p1, q: p3 }, { p: p3, q: p2 })
      continue
    }
    let d = ub - ua
    while (d <= -Math.PI) d += 2 * Math.PI
    while (d > Math.PI) d -= 2 * Math.PI
    const r = Math.abs(d) < 0.6 ? 26 : 18
    for (let k = 0; k < 8; k++) {
      const a1 = ua + (d * k) / 8
      const a2 = ua + (d * (k + 1)) / 8
      lines.push({ p: { x: o.x + Math.cos(a1) * r, y: o.y + Math.sin(a1) * r }, q: { x: o.x + Math.cos(a2) * r, y: o.y + Math.sin(a2) * r } })
    }
  }
  // Dots -- electrons, charges, marked points -- are solid: a label may not sit on one.
  const solid: Box[] = (spec.discs ?? []).map((d) => {
    const r = d.text ? Math.max(d.r * s, 9) : Math.max(d.r * s, 1.8)
    return { l: sx(d.x) - r, r: sx(d.x) + r, t: sy(d.y) - r, b: sy(d.y) + r }
  })
  // Clear of every label, dot and drawn line -- including a length's own line.
  const clear = (box: Box, taken: Box[]) => !taken.some((t) => hits(box, t)) && !solid.some((t) => hits(box, t)) && !lines.some((ln) => crosses(ln.p, ln.q, box))

  // Labels already placed. Fixed text goes in first; movable labels then pick
  // the first of their candidate spots that is clear of text and lines.
  const taken: Box[] = []
  // Free text is placed where its builder put it, unless a line or a dot runs
  // through it there; then it is nudged a few units to the nearest clear spot.
  const nudges = [
    [0, 0],
    [0, -7],
    [0, 7],
    [8, 0],
    [-8, 0],
    [0, -13],
    [0, 13],
    [14, 0],
    [-14, 0],
    [12, -9],
    [-12, -9],
    [12, 9],
    [-12, 9],
    [0, -20],
    [0, 20],
    [20, 0],
    [-20, 0],
  ]
  const texts = (spec.texts ?? []).map((t) => {
    const size = Math.max(t.size ?? 11, MIN_FONT)
    const anchor = t.anchor ?? 'middle'
    const spots = nudges.map(([dx, dy]) => ({ x: sx(t.x) + dx, y: sy(t.y) + 4 + dy }))
    const { x, y } = spots.find((c) => clear(textBox(c.x, c.y, t.text, size, anchor), taken)) ?? spots[0]
    taken.push(textBox(x, y, t.text, size, anchor))
    return { ...t, size, x, y }
  })
  for (const d of spec.discs ?? []) if (d.text) taken.push(textBox(sx(d.x), sy(d.y) + 4, d.text, 11, 'middle'))

  const angles = (spec.angles ?? []).map((an, i) => {
    const o = at(an.at)
    const a = at(an.a)
    const b = at(an.b)
    const ua = Math.atan2(a.y - o.y, a.x - o.x)
    const ub = Math.atan2(b.y - o.y, b.x - o.x)
    const colour = isAsk(an.label) ? ACCENT : INK
    if (an.right) {
      const r = 9
      const p1 = { x: o.x + Math.cos(ua) * r, y: o.y + Math.sin(ua) * r }
      const p2 = { x: o.x + Math.cos(ub) * r, y: o.y + Math.sin(ub) * r }
      const p3 = { x: p1.x + Math.cos(ub) * r, y: p1.y + Math.sin(ub) * r }
      return <polyline key={`r${i}`} points={`${p1.x},${p1.y} ${p3.x},${p3.y} ${p2.x},${p2.y}`} fill="none" stroke={INK} strokeWidth="1.3" />
    }
    // Sweep the smaller way round from ray a to ray b.
    let d = ub - ua
    while (d <= -Math.PI) d += 2 * Math.PI
    while (d > Math.PI) d -= 2 * Math.PI
    const r = Math.abs(d) < 0.6 ? 26 : 18
    const start = { x: o.x + Math.cos(ua) * r, y: o.y + Math.sin(ua) * r }
    const end = { x: o.x + Math.cos(ub) * r, y: o.y + Math.sin(ub) * r }
    // The size sits on the bisector just beyond the arc, or further out along
    // it when a line or label is in the way.
    // A narrow angle has no room inside it; then the size goes just outside
    // one of its arms.
    const bis = ua + d / 2
    const spots = [
      ...[13, 22, 32, 44].map((k) => ({ x: o.x + Math.cos(bis) * (r + k), y: o.y + Math.sin(bis) * (r + k) + 4 })),
      ...[
        [0.4, 14],
        [0.8, 18],
        [0.8, 30],
      ].flatMap(([off, k]) =>
        [ua - Math.sign(d) * off, ub + Math.sign(d) * off].map((t) => ({ x: o.x + Math.cos(t) * (r + k), y: o.y + Math.sin(t) * (r + k) + 4 })),
      ),
    ]
    const { x: lx, y: ly } = (an.label && spots.find((c) => clear(textBox(c.x, c.y, an.label!, 11, 'middle'), taken))) || spots[0]
    if (an.label) taken.push(textBox(lx, ly, an.label, 11, 'middle'))
    return (
      <g key={`g${i}`}>
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${end.x} ${end.y}`} fill="none" stroke={colour} strokeWidth="1.4" />
        {an.label ? (
          <text x={lx} y={ly} textAnchor="middle" fontSize="11" fontWeight="700" fill={colour}>
            {an.label}
          </text>
        ) : null}
      </g>
    )
  })

  const segs = (spec.segments ?? []).map((g, i) => {
    const a = at(g.a)
    const b = at(g.b)
    const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const ux = (b.x - a.x) / len
    const uy = (b.y - a.y) / len
    // Normal pointing away from the figure's middle.
    let nx = -uy
    let ny = ux
    if ((m.x - mid.x) * nx + (m.y - mid.y) * ny < 0) {
      nx = -nx
      ny = -ny
    }
    const marks = []
    for (let k = 0; k < (g.ticks ?? 0); k++) {
      const off = (k - ((g.ticks ?? 1) - 1) / 2) * 4
      const cx = m.x + ux * off
      const cy = m.y + uy * off
      marks.push(<line key={`t${k}`} x1={cx - nx * 5} y1={cy - ny * 5} x2={cx + nx * 5} y2={cy + ny * 5} stroke={INK} strokeWidth="1.3" />)
    }
    for (let k = 0; k < (g.arrows ?? 0); k++) {
      const cx = m.x + ux * (k * 6 - 3)
      const cy = m.y + uy * (k * 6 - 3)
      marks.push(
        <polyline
          key={`a${k}`}
          points={`${cx - ux * 5 + nx * 4},${cy - uy * 5 + ny * 4} ${cx},${cy} ${cx - ux * 5 - nx * 4},${cy - uy * 5 - ny * 4}`}
          fill="none"
          stroke={INK}
          strokeWidth="1.3"
        />,
      )
    }
    // The label goes beside the middle of its line, on the outside; if that
    // spot is taken it slides along the line, then tries the inside. Beside an
    // upright line it is anchored at its near end, so a long label such as
    // "6,5 cm" does not run back across the line it names.
    let label: { x: number; y: number; anchor: 'start' | 'middle' | 'end' } | undefined
    if (g.label) {
      const spots = [
        [1, 0],
        [-1, 0],
        [1, 10],
        [-1, 10],
        [1, 20],
      ].flatMap(([side, extra]) =>
        [0, -0.22, 0.22].map((t) => {
          const snx = nx * side
          const sny = ny * side
          const anchor: 'start' | 'middle' | 'end' = snx > 0.6 ? 'start' : snx < -0.6 ? 'end' : 'middle'
          const px = m.x + ux * len * t
          const py = m.y + uy * len * t
          return { x: px + snx * ((anchor === 'middle' ? 12 : 7) + extra), y: py + sny * (12 + extra) + 4, anchor }
        }),
      )
      label = spots.find((c) => clear(textBox(c.x, c.y, g.label!, 12, c.anchor), taken)) ?? spots[0]
      taken.push(textBox(label.x, label.y, g.label, 12, label.anchor))
    }
    return (
      <g key={`s${i}`}>
        <line
          x1={a.x}
          y1={a.y}
          x2={g.arrow ? b.x - ux * 6 : b.x}
          y2={g.arrow ? b.y - uy * 6 : b.y}
          stroke={g.accent ? ACCENT : INK}
          strokeWidth={g.thick ? 3 : g.arrow ? 2 : 1.6}
          strokeDasharray={g.dashed ? '5 4' : undefined}
          strokeLinecap="round"
        />
        {g.arrow ? (
          <polygon
            points={`${b.x},${b.y} ${b.x - ux * 10 + uy * 4.5},${b.y - uy * 10 - ux * 4.5} ${b.x - ux * 10 - uy * 4.5},${b.y - uy * 10 + ux * 4.5}`}
            fill={g.accent ? ACCENT : INK}
          />
        ) : null}
        {marks}
        {g.label && label ? (
          <text x={label.x} y={label.y} textAnchor={label.anchor} fontSize="12" fontWeight="700" fill={isAsk(g.label) ? ACCENT : INK}>
            {g.label}
          </text>
        ) : null}
      </g>
    )
  })

  // A point's name sits on the far side of it from the middle of the figure;
  // if a line or another label is there, it tries the spots round the point.
  const pointLabels = spec.points.map((p) => {
    if (!p.label) return null
    const o = at(p.id)
    // A long label -- a coordinate pair -- goes beside its dot rather than centred over it.
    const long = p.label.length > 2
    const size = long ? 11 : 13
    const side = o.x >= mid.x ? 1 : -1
    type Spot = { x: number; y: number; anchor: 'start' | 'middle' | 'end' }
    const spots: Spot[] = long
      ? [
          { x: o.x + side * 7, y: o.y - 3, anchor: side > 0 ? 'start' : 'end' },
          { x: o.x + side * 7, y: o.y + 15, anchor: side > 0 ? 'start' : 'end' },
          { x: o.x - side * 7, y: o.y - 3, anchor: side > 0 ? 'end' : 'start' },
          { x: o.x - side * 7, y: o.y + 15, anchor: side > 0 ? 'end' : 'start' },
          { x: o.x, y: o.y - 9, anchor: 'middle' },
          { x: o.x, y: o.y + 19, anchor: 'middle' },
          { x: o.x + side * 14, y: o.y - 10, anchor: side > 0 ? 'start' : 'end' },
          { x: o.x - side * 14, y: o.y - 10, anchor: side > 0 ? 'end' : 'start' },
        ]
      : [
          { ...away(o, 13), anchor: 'middle' as const },
          ...[14, 22].flatMap((r) =>
            [0, 1, 2, 3, 4, 5, 6, 7].map((k) => ({ x: o.x + Math.cos((k * Math.PI) / 4) * r, y: o.y + Math.sin((k * Math.PI) / 4) * r, anchor: 'middle' as const })),
          ),
        ].map((c) => ({ ...c, y: c.y + 4 }))
    const box = (c: Spot) => textBox(c.x, c.y, p.label!, size, c.anchor)
    const spot = spots.find((c) => clear(box(c), taken)) ?? spots[0]
    taken.push(box(spot))
    return { p, o, spot, size, long }
  })

  // The frame: the drawing and every label, with a small margin, so nothing
  // is cut off at the edge however long its label is.
  const fx = [...xs.map(sx), ...taken.flatMap((t) => [t.l, t.r])]
  const fy = [...ys.map(sy), ...taken.flatMap((t) => [t.t, t.b])]
  const vx = Math.min(...fx) - 8
  const vy = Math.min(...fy) - 8
  const W = Math.max(...fx) + 8 - vx
  const H = Math.max(...fy) + 8 - vy

  const desc = [
    spec.title + '.',
    ...(spec.segments ?? []).filter((g) => g.label).map((g) => `${P(g.a).label ?? ''}${P(g.b).label ?? ''} is ${g.label === '?' ? 'the unknown' : g.label}.`),
    ...(spec.angles ?? []).filter((a) => a.label || a.right).map((a) => `The angle at ${P(a.at).label ?? 'the marked point'} is ${a.right ? 'a right angle' : a.label === '?' ? 'the unknown' : a.label}.`),
    // Free text that carries a measurement -- a cylinder's radius, a medium's index.
    ...(spec.texts ?? []).filter((t) => /\d/.test(t.text)).map((t) => `Marked: ${t.text}.`),
    ...(spec.notes ?? []),
  ].join(' ')

  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-2 sm:p-3">
      {/* Never blown up past 1.3 times: a tall, narrow sketch would otherwise fill the screen. */}
      <svg
        viewBox={`${vx} ${vy} ${W} ${H}`}
        role="img"
        aria-label={spec.title}
        className="mx-auto block h-auto w-full"
        style={{ maxWidth: `${Math.round(Math.min(384, W * 1.3))}px` }}
      >
        <title>{spec.title}</title>
        <desc>{desc}</desc>
        {(spec.ellipses ?? []).map((e, i) => {
          const cx = sx(e.cx)
          const cy = sy(e.cy)
          const rx = e.rx * s
          const ry = e.ry * s
          return e.dashedTop ? (
            <g key={`e${i}`}>
              <path d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`} fill="none" stroke={INK} strokeWidth="1.6" />
              <path d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} fill="none" stroke={INK} strokeWidth="1.3" strokeDasharray="5 4" />
            </g>
          ) : (
            <ellipse key={`e${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth="1.6" />
          )
        })}
        {(spec.circles ?? []).map((c, i) => (
          <circle key={`c${i}`} cx={sx(P(c.c).x)} cy={sy(P(c.c).y)} r={c.r * s} fill="none" stroke={INK} strokeWidth="1.6" />
        ))}
        {(spec.curves ?? []).map((c, i) => (
          <polyline
            key={`k${i}`}
            points={c.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
            fill="none"
            stroke={c.accent ? ACCENT : INK}
            strokeWidth="1.8"
            strokeDasharray={c.dashed ? '5 4' : undefined}
            strokeLinejoin="round"
          />
        ))}
        {segs}
        {(spec.discs ?? []).map((d, i) => (
          <g key={`d${i}`}>
            <circle
              cx={sx(d.x)}
              cy={sy(d.y)}
              r={d.text ? Math.max(d.r * s, 9) : Math.max(d.r * s, 1.8)}
              fill={d.fill === 'accent' ? ACCENT : d.fill === 'ink' ? INK : 'white'}
              stroke={d.fill === 'accent' ? ACCENT : INK}
              strokeWidth="1.5"
            />
            {d.text ? (
              <text x={sx(d.x)} y={sy(d.y) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={d.fill && d.fill !== 'none' ? 'white' : INK}>
                {d.text}
              </text>
            ) : null}
          </g>
        ))}
        {texts.map((t, i) => (
          <text key={`x${i}`} x={t.x} y={t.y} textAnchor={t.anchor ?? 'middle'} fontSize={t.size} fontWeight="600" fill={t.accent ? ACCENT : INK}>
            {t.text}
          </text>
        ))}
        {angles}
        {pointLabels.map((pl, i) => {
          const p = spec.points[i]
          const o = at(p.id)
          return (
            <g key={p.id}>
              {p.dot ? <circle cx={o.x} cy={o.y} r="2.6" fill={INK} /> : null}
              {pl ? (
                <text
                  x={pl.spot.x}
                  y={pl.spot.y}
                  textAnchor={pl.spot.anchor}
                  fontSize={pl.size}
                  fontWeight="700"
                  fontStyle="italic"
                  fill={INK}
                >
                  {p.label}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-navy-500">
        {spec.title}
        {spec.notes?.map((n) => (
          <span key={n} className="mt-0.5 block font-semibold text-navy-700">
            {n}
          </span>
        ))}
        {spec.toScale || spec.schematic ? null : <span className="mt-0.5 block text-[11px] italic">Not drawn to scale</span>}
      </figcaption>
    </figure>
  )
}
