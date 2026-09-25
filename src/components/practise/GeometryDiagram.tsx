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
 */

const INK = '#1e3a5f'
const ACCENT = '#b8860b'

const PAD = 30
const SIDE = 46
const MAX_W = 300
const MAX_H = 210

type XY = { x: number; y: number }

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
  const W = (maxX - minX) * s + 2 * SIDE
  const H = (maxY - minY) * s + 2 * PAD
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
    // Beside an upright line the label is anchored at its near end, so a long
    // label such as "6,5 cm" does not run back across the line it names.
    const anchor = nx > 0.6 ? 'start' : nx < -0.6 ? 'end' : 'middle'
    const tx = m.x + nx * (anchor === 'middle' ? 12 : 7)
    const ty = m.y + ny * 12 + 4
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
        {g.label ? (
          <text x={tx} y={ty} textAnchor={anchor} fontSize="12" fontWeight="700" fill={isAsk(g.label) ? ACCENT : INK}>
            {g.label}
          </text>
        ) : null}
      </g>
    )
  })

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
    const bis = ua + d / 2
    const lr = r + 13
    return (
      <g key={`g${i}`}>
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${end.x} ${end.y}`} fill="none" stroke={colour} strokeWidth="1.4" />
        {an.label ? (
          <text x={o.x + Math.cos(bis) * lr} y={o.y + Math.sin(bis) * lr + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={colour}>
            {an.label}
          </text>
        ) : null}
      </g>
    )
  })

  const desc = [
    spec.title + '.',
    ...(spec.segments ?? []).filter((g) => g.label).map((g) => `${P(g.a).label ?? ''}${P(g.b).label ?? ''} is ${g.label === '?' ? 'the unknown' : g.label}.`),
    ...(spec.angles ?? []).filter((a) => a.label || a.right).map((a) => `The angle at ${P(a.at).label ?? 'the marked point'} is ${a.right ? 'a right angle' : a.label === '?' ? 'the unknown' : a.label}.`),
    ...(spec.notes ?? []),
  ].join(' ')

  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-3">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title} className="mx-auto block h-auto w-full max-w-sm">
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
        {(spec.texts ?? []).map((t, i) => (
          <text key={`x${i}`} x={sx(t.x)} y={sy(t.y) + 4} textAnchor={t.anchor ?? 'middle'} fontSize={t.size ?? 11} fontWeight="600" fill={t.accent ? ACCENT : INK}>
            {t.text}
          </text>
        ))}
        {angles}
        {spec.points.map((p) => {
          const o = at(p.id)
          // A long label -- a coordinate pair -- goes beside its dot, to the
          // outside, rather than centred over it.
          const long = (p.label?.length ?? 0) > 2
          const side = o.x >= mid.x ? 1 : -1
          const l = long ? { x: o.x + side * 7, y: o.y - 7 } : away(o, 13)
          return (
            <g key={p.id}>
              {p.dot ? <circle cx={o.x} cy={o.y} r="2.6" fill={INK} /> : null}
              {p.label ? (
                <text
                  x={l.x}
                  y={l.y + 4}
                  textAnchor={long ? (side > 0 ? 'start' : 'end') : 'middle'}
                  fontSize={long ? 11 : 13}
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

