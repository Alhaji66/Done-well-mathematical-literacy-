import type { ReactNode } from 'react'
import type { FigureId } from '@/types'
import { LIFE_SCI_FIGURES } from '@/components/practise/LifeSciFigures'

/**
 * Inline SVG figures for the questions where a picture carries the idea.
 *
 * Scope, decided by measurement rather than assumption. A sweep for items
 * referring to "the diagram above", "shown in the figure" and so on still
 * finds no question that DEPENDS on a picture: re-measured across 9 163
 * items, every apparent hit turned out to be self-contained -- "the circuit"
 * describing a circuit the words already give, "the graph of f(x) = x² − 9"
 * naming a graph by its equation. The corpus was written to stand alone.
 *
 * But self-contained is not the same as well taught, and treating those as
 * the same is what left the app with eight pictures in 9 163 questions. A
 * learner asked where a parabola cuts the axis is being asked to SEE it. So
 * figures are an enhancement rather than a repair, and the enhancement is
 * worth making:
 *
 *   - a curve given by an equation is PLOTTED, not drawn, by Graph.tsx --
 *     there are hundreds of those and they differ only in their coefficients
 *   - a picture that exists exactly once, like the CAST diagram below, is
 *     hand-drawn here, because there is nothing to generalise
 *
 * SVG rather than Canvas throughout. These are diagrams of a dozen elements,
 * not generative graphics: SVG scales without blurring, the text inside it is
 * real text that a screen reader and a find-in-page can both reach, and it
 * costs no JavaScript at all. Canvas would be the right call only for
 * something with hundreds of moving parts.
 *
 * Every figure carries a `<title>` naming it and a `<desc>` describing what it
 * shows in words, because a learner using a screen reader must get the same
 * information as one looking at it -- and the description is also what makes
 * the figure useful when images fail to paint.
 */

interface FigureProps {
  id: FigureId
}

/** Palette taken from the app's navy/gold tokens, stated once. */
const INK = '#1e3a5f'
const MUTED = '#64748b'
const ACCENT = '#b8860b'
const FILL = '#f1f5f9'

function Frame({ title, desc, viewBox, children }: { title: string; desc: string; viewBox: string; children: ReactNode }) {
  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-2 sm:p-3">
      <svg viewBox={viewBox} role="img" aria-label={title} className="mx-auto block h-auto w-full max-w-sm">
        <title>{title}</title>
        <desc>{desc}</desc>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-navy-500">{title}</figcaption>
    </figure>
  )
}

function CastDiagram() {
  // Four quadrants, each labelled with the ratio that stays POSITIVE there.
  const cells: [string, string, number, number][] = [
    ['S', 'sin', 40, 40],
    ['A', 'all', 120, 40],
    ['T', 'tan', 40, 120],
    ['C', 'cos', 120, 120],
  ]
  return (
    <Frame
      title="The CAST diagram"
      desc="Four quadrants of the Cartesian plane. The second quadrant is labelled S for sine, the first A for all, the third T for tangent and the fourth C for cosine. Each letter names the ratio that is positive in that quadrant; the others are negative there. Reading C, A, S, T anticlockwise from the fourth quadrant gives the name."
      viewBox="0 0 200 180"
    >
      <rect x="10" y="10" width="80" height="80" fill={FILL} />
      <rect x="90" y="10" width="80" height="80" fill={FILL} />
      <rect x="10" y="90" width="80" height="80" fill={FILL} />
      <rect x="90" y="90" width="80" height="80" fill={FILL} />
      <line x1="10" y1="90" x2="176" y2="90" stroke={INK} strokeWidth="1.5" />
      <line x1="90" y1="10" x2="90" y2="176" stroke={INK} strokeWidth="1.5" />
      {cells.map(([letter, ratio, x, y]) => (
        <g key={letter}>
          <text x={x} y={y} textAnchor="middle" fontSize="26" fontWeight="700" fill={ACCENT}>
            {letter}
          </text>
          <text x={x} y={y + 15} textAnchor="middle" fontSize="10" fill={MUTED}>
            {ratio} positive
          </text>
        </g>
      ))}
      <text x="178" y="87" fontSize="10" fill={MUTED}>
        0°
      </text>
      <text x="94" y="16" fontSize="10" fill={MUTED}>
        90°
      </text>
    </Frame>
  )
}

function SurdNumberLine() {
  // 49 --- 50 ------------------------------ 64, drawn to scale so that the
  // whole point of the figure -- that 50 sits much nearer 49 -- is visible
  // rather than merely asserted.
  const x = (v: number) => 20 + ((v - 49) / 15) * 150
  return (
    <Frame
      title="√50 lies between 7 and 8, much closer to 7"
      desc="A number line from 49 to 64 drawn to scale. 49 is marked as 7 squared at the left end and 64 as 8 squared at the right. 50 sits only one unit from 49 but fourteen units from 64, so the square root of 50 is much closer to 7 than to 8."
      viewBox="0 0 200 90"
    >
      <line x1="15" y1="45" x2="180" y2="45" stroke={INK} strokeWidth="1.5" />
      {[
        [49, '49', '7² '],
        [64, '64', '8²'],
      ].map(([v, label, sq]) => (
        <g key={String(v)}>
          <line x1={x(v as number)} y1="38" x2={x(v as number)} y2="52" stroke={INK} strokeWidth="1.5" />
          <text x={x(v as number)} y="66" textAnchor="middle" fontSize="10" fill={INK}>
            {label}
          </text>
          <text x={x(v as number)} y="30" textAnchor="middle" fontSize="10" fill={MUTED}>
            {sq}
          </text>
        </g>
      ))}
      <line x1={x(50)} y1="40" x2={x(50)} y2="50" stroke={ACCENT} strokeWidth="2.5" />
      <text x={x(50)} y="80" textAnchor="middle" fontSize="10" fontWeight="700" fill={ACCENT}>
        50
      </text>
      <text x="100" y="16" textAnchor="middle" fontSize="10" fill={MUTED}>
        1 unit from 49, but 14 from 64
      </text>
    </Frame>
  )
}

function ChargesOnALine() {
  return (
    <Frame
      title="Three charges on a straight line"
      desc="A horizontal x-axis. A positive 3 microcoulomb charge sits at x equals 0, a negative 2 microcoulomb charge at x equals 0,20 metres, and a positive 4 microcoulomb charge at x equals 0,50 metres. Because the charges lie on one line, each force is either to the left or to the right, so the contributions can be added with signs rather than as vectors in two dimensions."
      viewBox="0 0 222 90"
    >
      <line x1="15" y1="50" x2="205" y2="50" stroke={INK} strokeWidth="1.5" />
      <polygon points="205,50 198,46 198,54" fill={INK} />
      <text x="209" y="54" fontSize="10" fill={MUTED}>
        x
      </text>
      {[
        [20, '+3 μC', '0'],
        [90, '−2 μC', '0,20 m'],
        [195, '+4 μC', '0,50 m'],
      ].map(([cx, q, pos]) => (
        <g key={String(pos)}>
          <circle cx={cx as number} cy="50" r="7" fill={String(q).startsWith('+') ? ACCENT : INK} />
          <text x={cx as number} y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill={INK}>
            {q}
          </text>
          <text x={cx as number} y="72" textAnchor="middle" fontSize="10" fill={MUTED}>
            {pos}
          </text>
        </g>
      ))}
      <text x="110" y="16" textAnchor="middle" fontSize="10" fill={MUTED}>
        one line, so every force is left or right
      </text>
    </Frame>
  )
}

/**
 * Free-body diagrams.
 *
 * A sweep found ZERO free-body diagrams in 1 935 Physical Sciences questions,
 * and "draw a labelled free-body diagram of the forces acting on ..." opens
 * more NSC Paper 1 questions than any other instruction. These are attached as
 * `answerFigure`, so they appear only after the learner has drawn their own.
 *
 * Drawing conventions, which are marked: every arrow starts AT the body and
 * points outwards, arrow lengths are proportional where the question gives
 * enough to judge it, and each force carries a label naming the body exerting
 * it. A diagram with arrows drawn to the body rather than from it loses marks
 * even when the physics behind it is right.
 */

/** One labelled force arrow from (x, y), in the direction (dx, dy). */
function Force({ x, y, dx, dy, label, at, lift = 0 }: { x: number; y: number; dx: number; dy: number; label: string; at: 'start' | 'middle' | 'end'; lift?: number }) {
  const tipX = x + dx
  const tipY = y + dy
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  // Arrowhead as a triangle at the tip, perpendicular offsets for its base.
  const head = `${tipX},${tipY} ${tipX - 7 * ux - 4 * uy},${tipY - 7 * uy + 4 * ux} ${tipX - 7 * ux + 4 * uy},${tipY - 7 * uy - 4 * ux}`
  return (
    <g>
      <line x1={x} y1={y} x2={tipX} y2={tipY} stroke={ACCENT} strokeWidth="2" />
      <polygon points={head} fill={ACCENT} />
      <text x={tipX + ux * 6} y={tipY + uy * 6 + 3 - lift} textAnchor={at} fontSize="10" fontWeight="700" fill={INK}>
        {label}
      </text>
    </g>
  )
}

function FbdIncline() {
  return (
    <Frame
      title="Forces on a block at rest on a rough incline"
      desc="A block rests on a slope inclined at an angle theta to the horizontal. Three forces act on it, each drawn as an arrow starting at the block. Weight, w, acts vertically downwards. The normal force, N, acts perpendicular to the slope surface, away from it. Friction, f, acts up the slope, parallel to the surface, opposing the tendency to slide down. Because the block is at rest, the normal force and friction together balance the weight exactly."
      viewBox="0 0 240 170"
    >
      <polygon points="20,140 220,140 220,60" fill={FILL} stroke={INK} strokeWidth="1.5" />
      <text x="196" y="134" fontSize="10" fill={MUTED}>θ</text>
      {/* Block sitting on the slope, rotated to match it. */}
      <g transform="translate(140,104) rotate(-21.8)">
        <rect x="-16" y="-11" width="32" height="22" fill={INK} opacity="0.85" />
      </g>
      <Force x={140} y={104} dx={0} dy={44} label="w" at="middle" />
      <Force x={140} y={104} dx={-16} dy={-40} label="N" at="middle" />
      <Force x={140} y={104} dx={-42} dy={-17} label="f" at="end" />
      <circle cx="140" cy="104" r="2.5" fill="#fff" />
    </Frame>
  )
}

function FbdLift() {
  return (
    <Frame
      title="Forces on a person in a lift accelerating upwards"
      desc="A person stands in a lift that is accelerating upwards. Two forces act on the person, each drawn from the person outwards. The normal force, N, from the floor acts vertically upwards. Weight, w, acts vertically downwards. The upward arrow is drawn longer than the downward one, because an upward acceleration requires the normal force to exceed the weight; the difference between them is the net force producing the acceleration."
      viewBox="0 0 200 190"
    >
      <rect x="55" y="18" width="90" height="160" fill={FILL} stroke={INK} strokeWidth="1.5" />
      <line x1="55" y1="146" x2="145" y2="146" stroke={INK} strokeWidth="1.5" />
      <rect x="88" y="118" width="24" height="28" fill={INK} opacity="0.85" />
      <Force x={100} y={132} dx={0} dy={-58} label="N" at="middle" />
      <Force x={100} y={132} dx={0} dy={26} label="w" at="middle" />
      <circle cx="100" cy="132" r="2.5" fill="#fff" />
      <text x="152" y="60" fontSize="10" fill={MUTED}>a ↑</text>
    </Frame>
  )
}

function FbdConnected() {
  // Tension is drawn along the string, with its label above it; friction runs
  // along the bottom of each block, where it acts, so the two leftward forces
  // on B are told apart.
  return (
    <Frame
      title="Forces on two blocks joined by a light string"
      desc="Two blocks, A and B, rest on a rough horizontal surface and are joined by a light inextensible string. An applied force F pulls block B to the right. Block A has four forces on it: weight down, normal force up, tension T to the right from the string, and friction to the left. Block B has five: weight down, normal force up, the applied force F to the right, tension T to the left from the string, and friction to the left. The two tension arrows are equal in size and opposite in direction, because the string is light and pulls equally on both blocks."
      viewBox="0 0 300 150"
    >
      <line x1="10" y1="104" x2="290" y2="104" stroke={INK} strokeWidth="2" />
      <rect x="52" y="74" width="34" height="30" fill={INK} opacity="0.85" />
      <rect x="182" y="74" width="34" height="30" fill={INK} opacity="0.85" />
      <text x="48" y="72" textAnchor="end" fontSize="12" fontWeight="700" fill={INK}>A</text>
      <text x="178" y="72" textAnchor="end" fontSize="12" fontWeight="700" fill={INK}>B</text>
      <line x1="86" y1="84" x2="182" y2="84" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      <Force x={69} y={84} dx={0} dy={-38} label="N" at="middle" />
      <Force x={69} y={84} dx={0} dy={42} label="w" at="middle" />
      <Force x={69} y={84} dx={38} dy={0} label="T" at="middle" lift={9} />
      <Force x={69} y={99} dx={-40} dy={0} label="f" at="end" />
      <Force x={199} y={84} dx={0} dy={-38} label="N" at="middle" />
      <Force x={199} y={84} dx={0} dy={42} label="w" at="middle" />
      <Force x={199} y={84} dx={56} dy={0} label="F" at="start" />
      <Force x={199} y={84} dx={-38} dy={0} label="T" at="middle" lift={9} />
      <Force x={199} y={99} dx={-40} dy={0} label="f" at="middle" lift={-10} />
      <circle cx="69" cy="84" r="2.5" fill="#fff" />
      <circle cx="199" cy="84" r="2.5" fill="#fff" />
    </Frame>
  )
}

function CircuitMeters() {
  // Cell and switch on the left and bottom; the ammeter and R1 in series along
  // the top; R2 and R3 in parallel between the nodes P and Q; the voltmeter
  // across P and Q. The placement is what the question is about, so every lead
  // meets the circuit at a node, never part-way along a resistor.
  const P = 180
  const Q = 260
  return (
    <Frame
      title="Ammeter in series, voltmeter in parallel"
      desc="A circuit with a cell and an open switch. From the cell the current passes through an ammeter, marked A in a circle, connected in series in the main line. It then passes through resistor R1, also in series. The circuit then divides into two parallel branches containing R2 and R3, before rejoining and returning to the cell. A voltmeter, marked V in a circle, is connected across the parallel combination, in parallel with it, with its two leads joining the circuit at the points where the branches divide and rejoin. The ammeter is in the main line so the whole current passes through it; the voltmeter is across the components so it measures the potential difference between two points without the current passing through it."
      viewBox="0 0 300 170"
    >
      {/* Main line: from P back along the top, down the left, along the bottom and up to Q. */}
      <path d={`M${P} 40 H40 V140 H${Q} V40 H${P} V80 H${Q}`} fill="none" stroke={INK} strokeWidth="1.6" />
      {/* Cell on the left rail: long plate positive, short plate negative */}
      <line x1="30" y1="82" x2="50" y2="82" stroke={INK} strokeWidth="2.5" />
      <line x1="34" y1="92" x2="46" y2="92" stroke={INK} strokeWidth="1.2" />
      <rect x="37" y="84" width="6" height="6" fill="#fff" />
      <text x="24" y="90" textAnchor="end" fontSize="10" fill={MUTED}>cell</text>
      {/* Switch on the bottom rail */}
      <rect x="121" y="136" width="24" height="8" fill="#fff" />
      <circle cx="120" cy="140" r="2.5" fill={INK} />
      <circle cx="146" cy="140" r="2.5" fill={INK} />
      <line x1="120" y1="140" x2="144" y2="130" stroke={INK} strokeWidth="1.6" />
      <text x="133" y="157" textAnchor="middle" fontSize="10" fill={MUTED}>switch</text>
      {/* Ammeter in series on the top rail */}
      <circle cx="80" cy="40" r="11" fill="#fff" stroke={ACCENT} strokeWidth="1.8" />
      <text x="80" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill={ACCENT}>A</text>
      {/* R1 in series */}
      <rect x="112" y="31" width="34" height="18" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <text x="129" y="44" textAnchor="middle" fontSize="10" fill={INK}>R₁</text>
      {/* R2 and R3 in parallel between P and Q */}
      <rect x="204" y="31" width="32" height="18" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <text x="220" y="44" textAnchor="middle" fontSize="10" fill={INK}>R₂</text>
      <rect x="204" y="71" width="32" height="18" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <text x="220" y="84" textAnchor="middle" fontSize="10" fill={INK}>R₃</text>
      {/* Voltmeter across P and Q */}
      <path d={`M${P} 80 V112 H209 M231 112 H${Q}`} fill="none" stroke={ACCENT} strokeWidth="1.6" />
      <circle cx="220" cy="112" r="11" fill="#fff" stroke={ACCENT} strokeWidth="1.8" />
      <text x="220" y="116" textAnchor="middle" fontSize="11" fontWeight="700" fill={ACCENT}>V</text>
      {[
        [P, 40],
        [P, 80],
        [Q, 40],
        [Q, 80],
        [Q, 112],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill={INK} />
      ))}
    </Frame>
  )
}

function TitrationCurve() {
  // Strong acid titrated with strong base: flat, near-vertical at equivalence,
  // flat again. Drawn from a real sigmoid so the shape is honest rather than
  // sketched, with the equivalence point at pH 7 marked on both axes.
  const x0 = 44
  const y0 = 138
  const w = 216
  const h = 110
  const px = (v: number) => x0 + (v / 50) * w
  const py = (ph: number) => y0 - (ph / 14) * h
  const pts: string[] = []
  for (let v = 0; v <= 50; v += 0.5) {
    const ph = 1.2 + 11.6 / (1 + Math.exp(-(v - 25) * 0.62))
    pts.push(`${px(v).toFixed(1)},${py(ph).toFixed(1)}`)
  }
  return (
    <Frame
      title="Titration curve: strong acid with strong base"
      desc="A graph of pH on the vertical axis against volume of sodium hydroxide added on the horizontal axis. The curve begins near pH 1, rises only slightly as base is added, then climbs almost vertically between about pH 3 and pH 11 over a very small volume near 25 millilitres, before levelling off near pH 13. The near-vertical section crosses pH 7 at 25 millilitres, which is the equivalence point, marked with a dashed line to each axis. Because both the acid and the base are strong, the equivalence point is at pH 7."
      viewBox="0 0 290 176"
    >
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={INK} strokeWidth="1.5" />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke={INK} strokeWidth="1.5" />
      {[0, 7, 14].map((ph) => (
        <g key={ph}>
          <line x1={x0 - 4} y1={py(ph)} x2={x0} y2={py(ph)} stroke={INK} strokeWidth="1.2" />
          <text x={x0 - 7} y={py(ph) + 3} textAnchor="end" fontSize="10" fill={MUTED}>{ph}</text>
        </g>
      ))}
      {[0, 25, 50].map((v) => (
        <g key={v}>
          <line x1={px(v)} y1={y0} x2={px(v)} y2={y0 + 4} stroke={INK} strokeWidth="1.2" />
          <text x={px(v)} y={y0 + 15} textAnchor="middle" fontSize="10" fill={MUTED}>{v}</text>
        </g>
      ))}
      <polyline points={pts.join(' ')} fill="none" stroke={INK} strokeWidth="2" />
      <line x1={x0} y1={py(7)} x2={px(25)} y2={py(7)} stroke={ACCENT} strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1={px(25)} y1={y0} x2={px(25)} y2={py(7)} stroke={ACCENT} strokeWidth="1.2" strokeDasharray="4 3" />
      <circle cx={px(25)} cy={py(7)} r="3.5" fill={ACCENT} />
      <text x={px(25) + 8} y={py(7) - 5} fontSize="10" fontWeight="700" fill={ACCENT}>equivalence</text>
      <text x={x0 - 30} y={y0 - h / 2} fontSize="10" fill={MUTED} transform={`rotate(-90 ${x0 - 30} ${y0 - h / 2})`}>pH</text>
      <text x={x0 + w / 2} y={y0 + 30} textAnchor="middle" fontSize="10" fill={MUTED}>volume of NaOH added (mℓ)</text>
    </Frame>
  )
}

const FIGURES: Record<FigureId, () => JSX.Element> = {
  ...LIFE_SCI_FIGURES,
  'cast-diagram': CastDiagram,
  'surd-number-line': SurdNumberLine,
  'charges-on-a-line': ChargesOnALine,
  'fbd-incline': FbdIncline,
  'fbd-lift': FbdLift,
  'fbd-connected': FbdConnected,
  'circuit-meters': CircuitMeters,
  'titration-curve': TitrationCurve,
}

export function Figure({ id }: FigureProps) {
  const Component = FIGURES[id]
  // An unknown id renders nothing rather than throwing: a typo in one
  // question's data must not take down the page around it.
  return Component ? <Component /> : null
}
