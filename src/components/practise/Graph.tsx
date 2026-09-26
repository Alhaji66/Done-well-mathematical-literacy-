import type { GraphCurve, GraphPoint, GraphSpec } from '@/types'

/**
 * Plot a graph on Cartesian axes from its equations.
 *
 * WHY THIS EXISTS. The corpus had eight hand-drawn figures across 9 163 items
 * and not one plotted graph, while 326 Mathematics questions talk about "the
 * graph of f(x) = x² − 9". Every one of those is answerable from the equation
 * alone -- the corpus was written to be self-contained -- but answerable is
 * not the same as taught. A learner asked for which x the graph lies below the
 * x-axis is being asked to SEE a parabola cutting the axis at −3 and 3 and to
 * read the interval between them off the picture. Giving them only the words
 * makes them do the seeing in their head, which is the skill they do not have
 * yet and the reason they are practising.
 *
 * WHY IT PLOTS RATHER THAN BEING DRAWN. Hand-drawing is what `Figure.tsx`
 * does, and it is right for a picture that exists once: there is one CAST
 * diagram. A parabola is a different picture in every question that uses one,
 * so hand-drawing would have meant several hundred near-identical components.
 * Describing the curve by its coefficients -- the same a, b, c the question
 * already states -- means a graph cannot silently disagree with the equation
 * above it, which is the failure that matters most here.
 *
 * SVG, sampled, not Canvas. These are a few hundred points; SVG scales on a
 * phone without blurring, the axis numbers are real text a screen reader can
 * read, and it costs no JavaScript after the first paint.
 */

/** Matches Figure.tsx, so a graph and a diagram look like the same family. */
const INK = '#1e3a5f'
const MUTED = '#64748b'
const ACCENT = '#b8860b'
const GRID = '#e2e8f0'
const CURVE = '#1d4ed8'

/** Drawing area inside the 320x240 viewBox, leaving room for axis labels. */
const BOX = { left: 46, right: 300, top: 20, bottom: 194 }
const VIEW_W = 320
const VIEW_H = 240

/**
 * Roughly how wide a label will be, so it can be placed rather than clipped.
 *
 * SVG cannot measure text before it is laid out, and the first version of this
 * clamped only the label's x POSITION -- which put the start of "cos" inside
 * the box and let the rest run off the edge, so the graph shipped reading
 * "c(". Estimating the width and flipping the label to the other side of its
 * anchor is what actually keeps it on the canvas. 0.55em per character is a
 * safe over-estimate for this font at these sizes.
 */
const textWidth = (s: string, fontSize: number) => s.length * fontSize * 0.55

/* ------------------------------------------------------------------ */
/* Evaluating a curve                                                  */
/* ------------------------------------------------------------------ */

const rad = (deg: number) => (deg * Math.PI) / 180

/**
 * y at x, or null where the curve has no value there.
 *
 * Null rather than Infinity or NaN so that the path builder has one thing to
 * test. A hyperbola at its asymptote and a tan at 90° are both "no point
 * here", and drawing through them is the classic plotting bug: the curve gets
 * a vertical line joining the top of one branch to the bottom of the next,
 * which a learner then reads as part of the graph.
 */
export function evaluate(curve: GraphCurve, x: number): number | null {
  switch (curve.kind) {
    case 'line':
      return curve.m * x + curve.c
    case 'parabola':
      return curve.a * x * x + curve.b * x + curve.c
    case 'cubic':
      return curve.a * x ** 3 + curve.b * x * x + curve.c * x + curve.d
    case 'hyperbola':
      return x === curve.p ? null : curve.a / (x - curve.p) + curve.q
    case 'exponential':
      return curve.a * curve.b ** (x - (curve.p ?? 0)) + (curve.q ?? 0)
    case 'sin':
      return (curve.a ?? 1) * Math.sin(rad((curve.k ?? 1) * (x + (curve.p ?? 0)))) + (curve.q ?? 0)
    case 'cos':
      return (curve.a ?? 1) * Math.cos(rad((curve.k ?? 1) * (x + (curve.p ?? 0)))) + (curve.q ?? 0)
    case 'tan': {
      const inner = (curve.k ?? 1) * (x + (curve.p ?? 0))
      // cos = 0 is the asymptote. Compared against a tolerance rather than
      // exactly, because the sample points land near 90° rather than on it.
      const cos = Math.cos(rad(inner))
      if (Math.abs(cos) < 1e-6) return null
      return (curve.a ?? 1) * Math.tan(rad(inner)) + (curve.q ?? 0)
    }
  }
}

/** Vertical asymptotes a curve has by its nature, so they are never forgotten. */
function ownAsymptotes(curve: GraphCurve, [x0, x1]: [number, number]): { x?: number; y?: number }[] {
  if (curve.kind === 'hyperbola') return [{ x: curve.p }, { y: curve.q }]
  if (curve.kind === 'exponential') return [{ y: curve.q ?? 0 }]
  if (curve.kind === 'tan') {
    const k = curve.k ?? 1
    const p = curve.p ?? 0
    const out: { x: number }[] = []
    // tan is undefined a quarter-period either side of its centre.
    for (let n = Math.floor((x0 * k + p * k - 90) / 180) - 1; n < (x1 * k + p * k + 90) / 180 + 1; n += 1) {
      const x = (90 + 180 * n) / k - p
      if (x > x0 && x < x1) out.push({ x })
    }
    return out
  }
  return []
}

/* ------------------------------------------------------------------ */
/* Ticks                                                               */
/* ------------------------------------------------------------------ */

/** A tick step that gives roughly 6-10 ticks and is a number a person would pick. */
function niceStep(span: number): number {
  const rough = span / 8
  const mag = 10 ** Math.floor(Math.log10(rough))
  for (const m of [1, 2, 2.5, 5, 10]) if (rough <= m * mag) return m * mag
  return 10 * mag
}

function ticks(from: number, to: number, step: number): number[] {
  const out: number[] = []
  // Start at the first multiple of `step` inside the range rather than at
  // `from`, so ticks land on round numbers even when the range does not.
  const first = Math.ceil(from / step) * step
  for (let v = first; v <= to + step / 1000; v += step) {
    // Snap away the floating-point dust that turns 0.30000000000000004 into a
    // label; the step is what decides how many decimals are meaningful.
    out.push(Number(v.toFixed(10)))
  }
  return out
}

/** Numbers as a South African paper writes them: comma for the decimal point. */
function num(v: number): string {
  if (Object.is(v, -0)) return '0'
  const s = Math.abs(v) < 1e-10 ? '0' : String(Number(v.toFixed(6)))
  return s.replace('.', ',').replace('-', '−')
}

/* ------------------------------------------------------------------ */
/* Describing a graph in words                                         */
/* ------------------------------------------------------------------ */

/** The equation as a person writes it, for the label and the description. */
export function equationOf(curve: GraphCurve): string {
  const sig = (v: number) => (v < 0 ? ` − ${num(Math.abs(v))}` : ` + ${num(v)}`)
  const coef = (v: number, term: string) =>
    v === 0 ? '' : v === 1 ? term : v === -1 ? `−${term}` : `${num(v)}${term}`
  switch (curve.kind) {
    case 'line':
      return `y = ${coef(curve.m, 'x') || '0'}${curve.c ? sig(curve.c) : ''}`
    case 'parabola':
      return `y = ${coef(curve.a, 'x²')}${curve.b ? sig(curve.b).replace(/(\d|−)$/, '$1x') : ''}${curve.c ? sig(curve.c) : ''}`
    case 'cubic':
      return `y = ${coef(curve.a, 'x³')}${curve.b ? `${sig(curve.b)}x²` : ''}${curve.c ? `${sig(curve.c)}x` : ''}${curve.d ? sig(curve.d) : ''}`
    case 'hyperbola':
      return `y = ${num(curve.a)}/(x${curve.p ? sig(-curve.p) : ''})${curve.q ? sig(curve.q) : ''}`
    case 'exponential':
      return `y = ${curve.a === 1 ? '' : num(curve.a) + '·'}${num(curve.b)}${curve.p ? `⁽ˣ${curve.p > 0 ? '−' : '+'}${num(Math.abs(curve.p))}⁾` : 'ˣ'}${curve.q ? sig(curve.q) : ''}`
    default:
      return `y = ${curve.a && curve.a !== 1 ? num(curve.a) : ''}${curve.kind} ${curve.k && curve.k !== 1 ? num(curve.k) : ''}x${curve.q ? sig(curve.q) : ''}`
  }
}

const SHAPE: Record<GraphCurve['kind'], string> = {
  line: 'a straight line',
  parabola: 'a parabola',
  cubic: 'a cubic curve',
  hyperbola: 'a hyperbola in two branches',
  exponential: 'an exponential curve',
  sin: 'a sine curve',
  cos: 'a cosine curve',
  tan: 'a tangent curve',
}

/**
 * What the graph shows, in a sentence, for a learner using a screen reader.
 *
 * Generated rather than written by the author, because an author who has to
 * write it by hand for every graph will stop writing it, and a missing
 * description is the failure this is meant to prevent.
 */
export function describe(spec: GraphSpec): string {
  const parts = spec.curves.map((c) => `${SHAPE[c.kind]}, ${equationOf(c)}${c.label ? `, labelled ${c.label}` : ''}`)
  let text = `Axes from x = ${num(spec.xRange[0])} to ${num(spec.xRange[1])} and y = ${num(spec.yRange[0])} to ${num(spec.yRange[1])}, showing ${parts.join('; and ')}.`
  if (spec.points?.length) {
    text += ` Marked points: ${spec.points.map((p) => `${p.label ? p.label + ' at ' : ''}(${num(p.x)} ; ${num(p.y)})`).join(', ')}.`
  }
  const asym = spec.asymptotes ?? []
  if (asym.length) {
    text += ` Asymptotes: ${asym.map((a) => (a.x !== undefined ? `x = ${num(a.x)}` : `y = ${num(a.y!)}`)).join(', ')}.`
  }
  if (spec.shade) {
    text += ` The region between x = ${num(spec.shade.from)} and x = ${num(spec.shade.to)} is shaded.`
  }
  return text
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

interface GraphProps {
  spec: GraphSpec
}

export function Graph({ spec }: GraphProps) {
  const [x0, x1] = spec.xRange
  const [y0, y1] = spec.yRange
  const sx = (x: number) => BOX.left + ((x - x0) / (x1 - x0)) * (BOX.right - BOX.left)
  const sy = (y: number) => BOX.bottom - ((y - y0) / (y1 - y0)) * (BOX.bottom - BOX.top)

  const xStep = spec.xStep ?? niceStep(x1 - x0)
  const yStep = spec.yStep ?? niceStep(y1 - y0)
  const xTicks = ticks(x0, x1, xStep)
  const yTicks = ticks(y0, y1, yStep)

  // The axes sit at zero when zero is on screen, and along the edge otherwise,
  // so a graph of a range that excludes the origin still has labelled axes.
  const axisY = sy(y0 <= 0 && y1 >= 0 ? 0 : y0)
  const axisX = sx(x0 <= 0 && x1 >= 0 ? 0 : x0)

  const SAMPLES = 480
  /** Path data for one curve, broken wherever it leaves the box or is undefined. */
  const pathFor = (curve: GraphCurve): string => {
    let d = ''
    let pen = false
    for (let i = 0; i <= SAMPLES; i += 1) {
      const x = x0 + ((x1 - x0) * i) / SAMPLES
      const y = evaluate(curve, x)
      // Lifting the pen outside the y range is what keeps a steep curve from
      // being drawn across the axis labels, and it is also why the curve
      // re-enters cleanly rather than cutting the corner of the box.
      if (y === null || !Number.isFinite(y) || y < y0 || y > y1) {
        pen = false
        continue
      }
      d += `${pen ? 'L' : 'M'}${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`
      pen = true
    }
    return d
  }

  const asymptotes = [
    ...(spec.asymptotes ?? []),
    ...spec.curves.flatMap((c) => ownAsymptotes(c, spec.xRange)),
  ]

  /** Shaded region: between the curve (or the x-axis) and the x-axis. */
  const shadePath = (() => {
    if (!spec.shade) return ''
    const { from, to, curveIndex = 0 } = spec.shade
    const curve = spec.curves[curveIndex]
    if (!curve) return ''
    const steps = 160
    const top: string[] = []
    for (let i = 0; i <= steps; i += 1) {
      const x = from + ((to - from) * i) / steps
      const y = evaluate(curve, x)
      if (y === null || !Number.isFinite(y)) return ''
      top.push(`${sx(x).toFixed(2)} ${sy(Math.min(Math.max(y, y0), y1)).toFixed(2)}`)
    }
    const base = sy(y0 <= 0 && y1 >= 0 ? 0 : y0).toFixed(2)
    return `M${sx(from).toFixed(2)} ${base}L${top.join('L')}L${sx(to).toFixed(2)} ${base}Z`
  })()

  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-2 sm:p-3">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={spec.title}
        className="mx-auto block h-auto w-full max-w-md"
      >
        <title>{spec.title}</title>
        <desc>{describe(spec)}</desc>

        {/* Grid first, so every line drawn after it sits on top. */}
        {xTicks.map((t) => (
          <line key={`gx${t}`} x1={sx(t)} y1={BOX.top} x2={sx(t)} y2={BOX.bottom} stroke={GRID} strokeWidth="1" />
        ))}
        {yTicks.map((t) => (
          <line key={`gy${t}`} x1={BOX.left} y1={sy(t)} x2={BOX.right} y2={sy(t)} stroke={GRID} strokeWidth="1" />
        ))}

        {spec.shade ? <path d={shadePath} fill={ACCENT} fillOpacity="0.18" /> : null}

        {asymptotes.map((a, i) =>
          a.x !== undefined ? (
            <line
              key={`ax${i}`}
              x1={sx(a.x)}
              y1={BOX.top}
              x2={sx(a.x)}
              y2={BOX.bottom}
              stroke={MUTED}
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
          ) : (
            <line
              key={`ay${i}`}
              x1={BOX.left}
              y1={sy(a.y!)}
              x2={BOX.right}
              y2={sy(a.y!)}
              stroke={MUTED}
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
          ),
        )}

        {/* Axes. */}
        <line x1={BOX.left} y1={axisY} x2={BOX.right} y2={axisY} stroke={INK} strokeWidth="1.6" />
        <line x1={axisX} y1={BOX.top} x2={axisX} y2={BOX.bottom} stroke={INK} strokeWidth="1.6" />

        {xTicks.map((t) => (
          <g key={`tx${t}`}>
            <line x1={sx(t)} y1={axisY - 3} x2={sx(t)} y2={axisY + 3} stroke={INK} strokeWidth="1.2" />
            {t === 0 && y0 <= 0 && y1 >= 0 ? null : (
              <text x={sx(t)} y={BOX.bottom + 13} textAnchor="middle" fontSize="10" fill={MUTED}>
                {num(t)}
              </text>
            )}
          </g>
        ))}
        {yTicks.map((t) => (
          <g key={`ty${t}`}>
            <line x1={axisX - 3} y1={sy(t)} x2={axisX + 3} y2={sy(t)} stroke={INK} strokeWidth="1.2" />
            {t === 0 && x0 <= 0 && x1 >= 0 ? null : (
              <text x={BOX.left - 6} y={sy(t) + 3} textAnchor="end" fontSize="10" fill={MUTED}>
                {num(t)}
              </text>
            )}
          </g>
        ))}

        {spec.curves.map((curve, i) => (
          <path
            key={i}
            d={pathFor(curve)}
            fill="none"
            stroke={i === 0 ? CURVE : ACCENT}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={curve.dashed ? '6 4' : undefined}
          />
        ))}

        {spec.points?.map((p, i) => (
          <PointMark key={i} point={p} sx={sx} sy={sy} axisY={axisY} axisX={axisX} />
        ))}

        {/* Curve labels. */}
        {spec.curves.map((curve, i) => {
          if (!curve.label) return null
          // Placed at about four-fifths along, not at the extreme right: the
          // far end is where the axis name sits and where two trig curves both
          // flatten towards the axis, so labels put there collide with each
          // other and with the "x".
          for (let s = 0; s < 40; s += 1) {
            const x = x0 + (x1 - x0) * (0.8 - s / 100)
            const y = evaluate(curve, x)
            if (y === null || !Number.isFinite(y) || y < y0 || y > y1) continue
            const w = textWidth(curve.label, 11)
            const flip = sx(x) + 6 + w > BOX.right
            return (
              <text
                key={`l${i}`}
                x={flip ? sx(x) - 6 : sx(x) + 6}
                y={Math.max(sy(y) - 6, BOX.top + 9)}
                textAnchor={flip ? 'end' : 'start'}
                fontSize="11"
                fontWeight="700"
                fill={i === 0 ? CURVE : ACCENT}
              >
                {curve.label}
              </text>
            )
          }
          return null
        })}

        {/* Axis names. A Mathematics graph names its axes x and y at the ends,
            the way a textbook does. A Mat Lit graph names real quantities
            ("cost (R)"), which are far too long for the end of an axis, so
            those go outside the plot where a chart puts them. */}
        {spec.xLabel ? (
          <text x={(BOX.left + BOX.right) / 2} y={VIEW_H - 8} textAnchor="middle" fontSize="10" fill={MUTED}>
            {spec.xLabel}
          </text>
        ) : (
          <text x={BOX.right + 4} y={axisY + 4} fontSize="10" fontStyle="italic" fill={INK}>
            x
          </text>
        )}
        {spec.yLabel ? (
          <text
            x={11}
            y={(BOX.top + BOX.bottom) / 2}
            textAnchor="middle"
            fontSize="10"
            fill={MUTED}
            transform={`rotate(-90 11 ${(BOX.top + BOX.bottom) / 2})`}
          >
            {spec.yLabel}
          </text>
        ) : (
          <text x={axisX + 5} y={BOX.top - 6} fontSize="10" fontStyle="italic" fill={INK}>
            y
          </text>
        )}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-navy-500">{spec.title}</figcaption>
    </figure>
  )
}

function PointMark({
  point,
  sx,
  sy,
  axisY,
  axisX,
}: {
  point: GraphPoint
  sx: (x: number) => number
  sy: (y: number) => number
  axisY: number
  axisX: number
}) {
  const cx = sx(point.x)
  const cy = sy(point.y)
  return (
    <g>
      {point.guides ? (
        <>
          <line x1={cx} y1={cy} x2={cx} y2={axisY} stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" />
          <line x1={cx} y1={cy} x2={axisX} y2={cy} stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" />
        </>
      ) : null}
      <circle cx={cx} cy={cy} r="3.5" fill={ACCENT} />
      {point.label ? (
        // Flipped to the left of the point when the label's own WIDTH would
        // otherwise carry it off the canvas -- "R285 for 20 kℓ" sits well
        // inside the box by its anchor and still runs off the edge.
        <text
          x={cx + 6 + textWidth(point.label, 10) > BOX.right ? cx - 6 : cx + 6}
          y={Math.max(cy - 6, BOX.top + 9)}
          textAnchor={cx + 6 + textWidth(point.label, 10) > BOX.right ? 'end' : 'start'}
          fontSize="10"
          fontWeight="700"
          fill={ACCENT}
        >
          {point.label}
        </text>
      ) : null}
    </g>
  )
}
