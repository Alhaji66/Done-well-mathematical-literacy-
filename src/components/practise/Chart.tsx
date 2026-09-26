import type { ChartSpec } from '@/types'
import { AGE_RANGE, BMI_RANGE, PERCENTILES, curveAt } from '@/data/bmiReference'

/**
 * Draw a data chart the way a Mathematical Literacy paper prints one.
 *
 * WHY THIS EXISTS. Mat Lit had no pictures at all. Its chart questions were
 * written as descriptions of a chart -- "a box-and-whisker diagram of test
 * marks has its left whisker starting at 12, the box running from 24 to 38 with
 * a line at 30 ..." -- which asks a learner to build the picture in their head
 * before they can start the question the exam actually sets, which is READING
 * the picture. Two of them are about a misleading graph, and a misleading graph
 * described in a sentence is not misleading at all: the sentence tells you the
 * axis starts at 980, which is the one thing the graph hides.
 *
 * FIVE KINDS, each drawn to its exam convention rather than to a generic chart
 * style: bars with gaps (separate categories), a histogram with bars touching
 * (continuous intervals), pie charts, box-and-whisker diagrams on a number
 * line, and a BMI-for-age percentile chart.
 *
 * NO HOVER TOOLTIPS, deliberately. On a dashboard a chart should announce its
 * values on hover. Here, reading the value off the axis IS the question, and a
 * tooltip that prints it does the question for the learner. The data is never
 * lost to someone who cannot see the chart: every value on it is written in the
 * question itself (`npm run check:charts` enforces that), and the SVG carries a
 * full spoken description.
 */

const INK = '#1e3a5f'
const MUTED = '#64748b'
const GRID = '#e2e8f0'
const AXIS = '#94a3b8'
const BAR = '#3a5687'
const ACCENT = '#b8860b'
/**
 * Pie slices, in fixed order and never cycled. Validated as a set for
 * colour-blind separation; two of the four fall below 3:1 contrast on white,
 * so every slice also carries its value as text and a named legend row --
 * identity is never carried by colour alone.
 */
const SLICE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100']

const VIEW_W = 320

/** A number as a Mat Lit paper prints it: comma decimal, spaces in thousands. */
function fmt(v: number): string {
  const r = Math.round(v * 100) / 100
  const [whole, frac] = String(Math.abs(r)).split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (r < 0 ? '−' : '') + grouped + (frac ? ',' + frac : '')
}

/** A tick step that gives four to eight gridlines across a range. */
function niceStep(span: number): number {
  const raw = span / 6
  const mag = 10 ** Math.floor(Math.log10(raw))
  const unit = raw / mag
  return (unit < 1.5 ? 1 : unit < 3 ? 2 : unit < 7 ? 5 : 10) * mag
}

function ticks(from: number, to: number, step: number): number[] {
  const out: number[] = []
  for (let v = Math.ceil(from / step - 1e-9) * step; v <= to + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6)
  return out
}

/** A bar whose top corners are rounded and whose base sits square on the axis. */
function barPath(x: number, y: number, w: number, h: number, r = 3): string {
  const rr = Math.min(r, w / 2, h)
  return `M${x} ${y + h} L${x} ${y + rr} Q${x} ${y} ${x + rr} ${y} L${x + w - rr} ${y} Q${x + w} ${y} ${x + w} ${y + rr} L${x + w} ${y + h} Z`
}

/* ------------------------------------------------------------------ */
/* Spoken descriptions                                                 */
/* ------------------------------------------------------------------ */

export function describeChart(spec: ChartSpec): string {
  switch (spec.kind) {
    case 'bar': {
      const from = spec.yFrom ?? 0
      const parts = spec.categories.map((c, i) => `${c} ${fmt(spec.values[i])}${spec.unit ?? ''}`)
      return `Bar graph. ${parts.join('; ')}. The vertical axis, ${spec.yLabel}, starts at ${fmt(from)}${spec.unit ?? ''}.`
    }
    case 'histogram': {
      const parts = spec.counts.map((c, i) => `${fmt(spec.edges[i])} to ${fmt(spec.edges[i + 1])}: ${c}`)
      return `Histogram of ${spec.xLabel}, bars touching. ${parts.join('; ')}.`
    }
    case 'pie':
      return spec.pies
        .map(
          (pie) =>
            `Pie chart${pie.label ? ` for ${pie.label}` : ''}: ` +
            pie.slices.map((s) => `${s.label} ${spec.prefix ?? ''}${fmt(s.value)}${spec.unit ?? ''}`).join(', ') +
            '.',
        )
        .join(' ')
    case 'boxplot':
      return spec.boxes
        .map(
          (b) =>
            `Box-and-whisker diagram${b.label ? ` for ${b.label}` : ''}: minimum ${fmt(b.min)}, lower quartile ${fmt(b.q1)}, median ${fmt(b.median)}, upper quartile ${fmt(b.q3)}, maximum ${fmt(b.max)}.`,
        )
        .join(' ')
    case 'bmi-for-age': {
      let text = `BMI-for-age percentile chart for ${spec.sex}s aged ${AGE_RANGE[0]} to ${AGE_RANGE[1]}, with curves at the ${PERCENTILES.join('th, ')}th percentiles.`
      for (const p of spec.points ?? []) text += ` Point ${p.label}: age ${fmt(p.age)}, BMI ${fmt(p.bmi)}.`
      return text
    }
  }
}

/* ------------------------------------------------------------------ */
/* Bar graph and histogram                                             */
/* ------------------------------------------------------------------ */

const PLOT = { left: 46, right: 306, top: 22, bottom: 178 }

function Bars({ spec }: { spec: Extract<ChartSpec, { kind: 'bar' }> }) {
  const from = spec.yFrom ?? 0
  const top = spec.yTo ?? Math.max(...spec.values) * 1.15
  const step = spec.yStep ?? niceStep(top - from)
  const to = Math.ceil(top / step) * step
  const y = (v: number) => PLOT.bottom - ((v - from) / (to - from)) * (PLOT.bottom - PLOT.top)
  const band = (PLOT.right - PLOT.left) / spec.values.length
  const w = Math.min(band * 0.56, 56)
  return (
    <>
      {ticks(from, to, step).map((t) => (
        <g key={t}>
          <line x1={PLOT.left} x2={PLOT.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
          <text x={PLOT.left - 5} y={y(t) + 3} textAnchor="end" fontSize="9.5" fill={MUTED}>
            {fmt(t)}
            {spec.unit ?? ''}
          </text>
        </g>
      ))}
      {spec.values.map((v, i) => {
        const cx = PLOT.left + band * (i + 0.5)
        const h = Math.max(PLOT.bottom - y(v), 0)
        return (
          <g key={i}>
            <path d={barPath(cx - w / 2, PLOT.bottom - h, w, h)} fill={BAR} />
            <text x={cx} y={PLOT.bottom - h - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK}>
              {fmt(v)}
              {spec.unit ?? ''}
            </text>
            <text x={cx} y={PLOT.bottom + 13} textAnchor="middle" fontSize="9" fill={INK}>
              {spec.categories[i]}
            </text>
          </g>
        )
      })}
      <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} stroke={AXIS} strokeWidth="1.2" />
      <line x1={PLOT.left} x2={PLOT.left} y1={PLOT.top} y2={PLOT.bottom} stroke={AXIS} strokeWidth="1.2" />
      <text
        transform={`translate(11 ${(PLOT.top + PLOT.bottom) / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize="9.5"
        fill={MUTED}
      >
        {spec.yLabel}
      </text>
    </>
  )
}

function Histogram({ spec }: { spec: Extract<ChartSpec, { kind: 'histogram' }> }) {
  const lo = spec.edges[0]
  const hi = spec.edges[spec.edges.length - 1]
  const top = Math.max(...spec.counts) * 1.15
  const step = niceStep(top)
  const to = Math.ceil(top / step) * step
  const x = (v: number) => PLOT.left + ((v - lo) / (hi - lo)) * (PLOT.right - PLOT.left)
  const y = (v: number) => PLOT.bottom - (v / to) * (PLOT.bottom - PLOT.top)
  return (
    <>
      {ticks(0, to, step).map((t) => (
        <g key={t}>
          <line x1={PLOT.left} x2={PLOT.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
          <text x={PLOT.left - 5} y={y(t) + 3} textAnchor="end" fontSize="9.5" fill={MUTED}>
            {fmt(t)}
          </text>
        </g>
      ))}
      {/* Touching bars, each outlined, so the shared edges read as boundaries
          between intervals rather than as gaps between categories. */}
      {spec.counts.map((c, i) => (
        <g key={i}>
          <rect
            x={x(spec.edges[i])}
            y={y(c)}
            width={x(spec.edges[i + 1]) - x(spec.edges[i])}
            height={PLOT.bottom - y(c)}
            fill={BAR}
            fillOpacity="0.85"
            stroke="#fff"
            strokeWidth="1"
          />
          <text
            x={(x(spec.edges[i]) + x(spec.edges[i + 1])) / 2}
            y={y(c) - 4}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={INK}
          >
            {fmt(c)}
          </text>
        </g>
      ))}
      {spec.edges.map((e) => (
        <text key={e} x={x(e)} y={PLOT.bottom + 12} textAnchor="middle" fontSize="9.5" fill={INK}>
          {fmt(e)}
        </text>
      ))}
      <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} stroke={AXIS} strokeWidth="1.2" />
      <line x1={PLOT.left} x2={PLOT.left} y1={PLOT.top} y2={PLOT.bottom} stroke={AXIS} strokeWidth="1.2" />
      <text x={(PLOT.left + PLOT.right) / 2} y={PLOT.bottom + 26} textAnchor="middle" fontSize="9.5" fill={MUTED}>
        {spec.xLabel}
      </text>
      <text
        transform={`translate(11 ${(PLOT.top + PLOT.bottom) / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize="9.5"
        fill={MUTED}
      >
        {spec.yLabel}
      </text>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Pie chart                                                           */
/* ------------------------------------------------------------------ */

function point(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function Pies({ spec }: { spec: Extract<ChartSpec, { kind: 'pie' }> }) {
  const n = spec.pies.length
  const r = n === 1 ? 70 : 56
  const cy = n === 1 ? 84 : 86
  // Side-by-side pies each get an equal share of the width, centred in it.
  // Spacing them at thirds of the width put two 56-pixel pies 106 pixels apart,
  // and they overlapped -- which on a comparison chart reads as one shape.
  const centres = spec.pies.map((_, i) => (VIEW_W / n) * (i + 0.5))
  // One legend for all the pies, because every pie in a comparison uses the
  // same categories in the same colours -- that sameness is what makes two
  // pies comparable at all.
  const legend = spec.pies[0].slices
  const legendTop = cy + r + 20
  const valueText = (v: number) => `${spec.prefix ?? ''}${fmt(v)}${spec.unit ?? ''}`
  return (
    <>
      {spec.pies.map((pie, p) => {
        const total = pie.slices.reduce((a, s) => a + s.value, 0)
        let start = 0
        const cx = centres[p]
        return (
          <g key={p}>
            {pie.label ? (
              <text x={cx} y={cy - r - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill={INK}>
                {pie.label}
              </text>
            ) : null}
            {pie.slices.map((s, i) => {
              const sweep = (s.value / total) * 360
              const end = start + sweep
              const [x1, y1] = point(cx, cy, r, start)
              const [x2, y2] = point(cx, cy, r, end)
              const large = sweep > 180 ? 1 : 0
              const mid = start + sweep / 2
              const [lx, ly] = point(cx, cy, r * 0.62, mid)
              start = end
              const text = spec.showAngles ? `${fmt(Math.round(sweep))}°` : valueText(s.value)
              return (
                <g key={i}>
                  <path
                    d={
                      sweep >= 359.999
                        ? `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
                        : `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
                    }
                    fill={SLICE[i % SLICE.length]}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  {sweep >= 24 ? (
                    <text
                      x={lx}
                      y={ly + 3.5}
                      textAnchor="middle"
                      fontSize={n === 1 ? 10 : 9}
                      fontWeight="700"
                      fill="#fff"
                      stroke="rgba(15,23,42,0.55)"
                      strokeWidth="2.2"
                      paintOrder="stroke"
                    >
                      {text}
                    </text>
                  ) : null}
                </g>
              )
            })}
          </g>
        )
      })}
      {/* The legend names every slice in ink, with its value, so a learner who
          cannot tell the colours apart still reads each slice by name. */}
      {legend.map((s, i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        const x = 36 + col * 140
        const y = legendTop + row * 16
        const values = spec.pies.map((pie) => valueText(pie.slices[i]?.value ?? 0))
        const angle = spec.showAngles
          ? ` · ${fmt(Math.round((s.value / spec.pies[0].slices.reduce((a, t) => a + t.value, 0)) * 360))}°`
          : ''
        return (
          <g key={i}>
            <rect x={x} y={y - 8} width="10" height="10" rx="2" fill={SLICE[i % SLICE.length]} />
            <text x={x + 15} y={y} fontSize="9" fill={INK}>
              <tspan fontWeight="700">{s.label}</tspan>
              <tspan fill={MUTED}>{`  ${n === 1 ? values[0] + angle : ''}`}</tspan>
            </text>
          </g>
        )
      })}
    </>
  )
}

function pieHeight(spec: Extract<ChartSpec, { kind: 'pie' }>): number {
  const n = spec.pies.length
  const r = n === 1 ? 70 : 56
  const cy = n === 1 ? 84 : 86
  const rows = Math.ceil(spec.pies[0].slices.length / 2)
  return cy + r + 20 + rows * 16 + 4
}

/* ------------------------------------------------------------------ */
/* Box-and-whisker diagram                                             */
/* ------------------------------------------------------------------ */

const BOX_LEFT = 58
const BOX_RIGHT = 304
const BOX_ROW = 64

function Boxes({ spec }: { spec: Extract<ChartSpec, { kind: 'boxplot' }> }) {
  const [lo, hi] = spec.axis
  const x = (v: number) => BOX_LEFT + ((v - lo) / (hi - lo)) * (BOX_RIGHT - BOX_LEFT)
  const axisY = 26 + spec.boxes.length * BOX_ROW
  return (
    <>
      {ticks(lo, hi, spec.step).map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={18} y2={axisY} stroke={GRID} strokeWidth="1" />
          <text x={x(t)} y={axisY + 12} textAnchor="middle" fontSize="9.5" fill={INK}>
            {fmt(t)}
          </text>
        </g>
      ))}
      <line x1={BOX_LEFT} x2={BOX_RIGHT} y1={axisY} y2={axisY} stroke={AXIS} strokeWidth="1.2" />
      <text x={(BOX_LEFT + BOX_RIGHT) / 2} y={axisY + 26} textAnchor="middle" fontSize="9.5" fill={MUTED}>
        {spec.xLabel}
      </text>
      {spec.boxes.map((b, i) => {
        const cy = 30 + i * BOX_ROW + BOX_ROW / 2 - 8
        const h = 22
        return (
          <g key={i}>
            {b.label ? (
              <text x={BOX_LEFT - 8} y={cy + 3.5} textAnchor="end" fontSize="9.5" fontWeight="700" fill={INK}>
                {b.label}
              </text>
            ) : null}
            {/* Whiskers, with end caps, then the box over them. */}
            <line x1={x(b.min)} x2={x(b.q1)} y1={cy} y2={cy} stroke={INK} strokeWidth="1.6" />
            <line x1={x(b.q3)} x2={x(b.max)} y1={cy} y2={cy} stroke={INK} strokeWidth="1.6" />
            <line x1={x(b.min)} x2={x(b.min)} y1={cy - 7} y2={cy + 7} stroke={INK} strokeWidth="1.6" />
            <line x1={x(b.max)} x2={x(b.max)} y1={cy - 7} y2={cy + 7} stroke={INK} strokeWidth="1.6" />
            <rect
              x={x(b.q1)}
              y={cy - h / 2}
              width={x(b.q3) - x(b.q1)}
              height={h}
              fill="#dbe4f3"
              stroke={INK}
              strokeWidth="1.6"
            />
            <line x1={x(b.median)} x2={x(b.median)} y1={cy - h / 2} y2={cy + h / 2} stroke={ACCENT} strokeWidth="2.4" />
            {/* The five values printed on the diagram, split above and below so
                the two quartiles never sit on top of the median's label. */}
            {[
              { v: b.min, above: true },
              { v: b.median, above: true },
              { v: b.max, above: true },
              { v: b.q1, above: false },
              { v: b.q3, above: false },
            ].map(({ v, above }, k) => (
              <text
                key={k}
                x={x(v)}
                y={above ? cy - h / 2 - 5 : cy + h / 2 + 11}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={INK}
              >
                {fmt(v)}
              </text>
            ))}
          </g>
        )
      })}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* BMI-for-age percentile chart                                        */
/* ------------------------------------------------------------------ */

const BMI_BOX = { left: 38, right: 282, top: 14, bottom: 238 }

/** Light tints for the four bands. Each band is also NAMED on the chart. */
const BAND_FILL = ['#e8f1fb', '#eaf6ee', '#fdf4e3', '#fbe9e9']
const BAND_NAMES = ['Underweight', 'Healthy weight', 'Overweight', 'Obese']

function BmiChart({ spec }: { spec: Extract<ChartSpec, { kind: 'bmi-for-age' }> }) {
  const [a0, a1] = AGE_RANGE
  const [b0, b1] = BMI_RANGE
  const x = (age: number) => BMI_BOX.left + ((age - a0) / (a1 - a0)) * (BMI_BOX.right - BMI_BOX.left)
  const y = (bmi: number) => BMI_BOX.bottom - ((bmi - b0) / (b1 - b0)) * (BMI_BOX.bottom - BMI_BOX.top)
  const ages: number[] = []
  for (let a = a0; a <= a1 + 1e-9; a += 0.25) ages.push(a)
  const curve = (p: (typeof PERCENTILES)[number]) => ages.map((a) => [x(a), y(curveAt(spec.sex, p, a))] as const)
  const line = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')

  // Bands: the region between consecutive curves, closed along the chart's
  // own top and bottom edges for the outermost two.
  const bounds: (readonly (readonly [number, number])[])[] = [
    ages.map((a) => [x(a), y(b0)] as const),
    ...PERCENTILES.map(curve),
    ages.map((a) => [x(a), y(b1)] as const),
  ]
  // Band 1 is 5th to 85th, so it skips the 50th curve: bounds[1] to bounds[3].
  const bandEdges: [number, number][] = [
    [0, 1],
    [1, 3],
    [3, 4],
    [4, 5],
  ]
  // Where each band's name goes: at age 16,5, midway through its band -- for
  // the healthy band, midway between the 50th and 85th curves, so the name
  // does not sit on the 50th curve that runs through the middle of it.
  const LABEL_AGE = 16.5
  const at = (p: (typeof PERCENTILES)[number]) => curveAt(spec.sex, p, LABEL_AGE)
  const labelBmi = [
    (b0 + at(5)) / 2,
    (at(50) + at(85)) / 2,
    (at(85) + at(95)) / 2,
    (at(95) + b1) / 2,
  ]

  return (
    <>
      {bandEdges.map(([lo, hi], i) => (
        <path
          key={i}
          d={`${line(bounds[lo])} ${bounds[hi]
            .slice()
            .reverse()
            .map(([px, py]) => `L${px.toFixed(1)} ${py.toFixed(1)}`)
            .join(' ')} Z`}
          fill={BAND_FILL[i]}
        />
      ))}
      {ticks(a0, a1, 2).map((t) => (
        <g key={`a${t}`}>
          <line x1={x(t)} x2={x(t)} y1={BMI_BOX.top} y2={BMI_BOX.bottom} stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.9" />
          <line x1={x(t)} x2={x(t)} y1={BMI_BOX.top} y2={BMI_BOX.bottom} stroke={GRID} strokeWidth="0.6" />
          <text x={x(t)} y={BMI_BOX.bottom + 11} textAnchor="middle" fontSize="9.5" fill={INK}>
            {t}
          </text>
        </g>
      ))}
      {ticks(b0, b1, 2).map((t) => (
        <g key={`b${t}`}>
          <line x1={BMI_BOX.left} x2={BMI_BOX.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="0.6" />
          <text x={BMI_BOX.left - 4} y={y(t) + 3} textAnchor="end" fontSize="9.5" fill={INK}>
            {t}
          </text>
        </g>
      ))}
      {PERCENTILES.map((p) => {
        const pts = curve(p)
        const [ex, ey] = pts[pts.length - 1]
        return (
          <g key={p}>
            <path d={line(pts)} fill="none" stroke={INK} strokeWidth={p === 50 ? 2 : 1.5} />
            <text x={ex + 4} y={ey + 3} fontSize="9.5" fontWeight="700" fill={INK}>
              {p}th
            </text>
          </g>
        )
      })}
      {BAND_NAMES.map((name, i) => (
        <text
          key={name}
          x={x(LABEL_AGE)}
          y={y(labelBmi[i]) + 3}
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={MUTED}
        >
          {name}
        </text>
      ))}
      <rect
        x={BMI_BOX.left}
        y={BMI_BOX.top}
        width={BMI_BOX.right - BMI_BOX.left}
        height={BMI_BOX.bottom - BMI_BOX.top}
        fill="none"
        stroke={AXIS}
        strokeWidth="1"
      />
      {(spec.points ?? []).map((pt) => (
        <g key={pt.label}>
          <path
            d={`M${BMI_BOX.left} ${y(pt.bmi)} L${x(pt.age)} ${y(pt.bmi)} L${x(pt.age)} ${BMI_BOX.bottom}`}
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <circle cx={x(pt.age)} cy={y(pt.bmi)} r="4.5" fill={ACCENT} stroke="#fff" strokeWidth="2" />
          <text x={x(pt.age) + 7} y={y(pt.bmi) - 5} fontSize="10" fontWeight="700" fill={INK}>
            {pt.label}
          </text>
        </g>
      ))}
      <text x={(BMI_BOX.left + BMI_BOX.right) / 2} y={BMI_BOX.bottom + 24} textAnchor="middle" fontSize="9.5" fill={MUTED}>
        Age (years)
      </text>
      <text
        transform={`translate(10 ${(BMI_BOX.top + BMI_BOX.bottom) / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize="9.5"
        fill={MUTED}
      >
        BMI (kg/m²)
      </text>
      <text x={VIEW_W / 2} y={BMI_BOX.bottom + 38} textAnchor="middle" fontSize="9" fill={MUTED}>
        Simplified chart for exam practice — not for medical use.
      </text>
    </>
  )
}

/* ------------------------------------------------------------------ */

function heightOf(spec: ChartSpec): number {
  switch (spec.kind) {
    case 'bar':
      return PLOT.bottom + 22
    case 'histogram':
      return PLOT.bottom + 34
    case 'pie':
      return pieHeight(spec)
    case 'boxplot':
      return 26 + spec.boxes.length * BOX_ROW + 34
    case 'bmi-for-age':
      return BMI_BOX.bottom + 44
  }
}

export function Chart({ spec }: { spec: ChartSpec }) {
  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-2 sm:p-3">
      <svg
        viewBox={`0 0 ${VIEW_W} ${heightOf(spec)}`}
        role="img"
        aria-label={spec.title}
        className="mx-auto block h-auto w-full max-w-md"
      >
        <title>{spec.title}</title>
        <desc>{describeChart(spec)}</desc>
        {spec.kind === 'bar' ? <Bars spec={spec} /> : null}
        {spec.kind === 'histogram' ? <Histogram spec={spec} /> : null}
        {spec.kind === 'pie' ? <Pies spec={spec} /> : null}
        {spec.kind === 'boxplot' ? <Boxes spec={spec} /> : null}
        {spec.kind === 'bmi-for-age' ? <BmiChart spec={spec} /> : null}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-navy-500">{spec.title}</figcaption>
    </figure>
  )
}
