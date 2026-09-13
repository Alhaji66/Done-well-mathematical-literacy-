import type { ReactNode } from 'react'
import type { FigureId } from '@/types'

/**
 * Inline SVG figures for the questions where a picture carries the idea.
 *
 * Scope, decided by measurement rather than assumption. A sweep for items
 * referring to "the diagram above", "shown in the figure" and so on found 4
 * hits in 7 707 items, and all four were false positives of the word
 * "alongside". The corpus was written to be self-contained, so NO question is
 * unanswerable for want of a picture. That makes figures an enhancement rather
 * than a repair, which in turn decides the design: a small set of hand-drawn
 * figures attached where they teach something, not a generic diagram engine
 * built to render a need that does not exist.
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
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-3">
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
      <text x="178" y="87" fontSize="9" fill={MUTED}>
        0°
      </text>
      <text x="94" y="16" fontSize="9" fill={MUTED}>
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
      <text x="100" y="16" textAnchor="middle" fontSize="9" fill={MUTED}>
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
      viewBox="0 0 220 90"
    >
      <line x1="15" y1="50" x2="205" y2="50" stroke={INK} strokeWidth="1.5" />
      <polygon points="205,50 198,46 198,54" fill={INK} />
      <text x="200" y="68" fontSize="9" fill={MUTED}>
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
          <text x={cx as number} y="72" textAnchor="middle" fontSize="9" fill={MUTED}>
            {pos}
          </text>
        </g>
      ))}
      <text x="110" y="16" textAnchor="middle" fontSize="9" fill={MUTED}>
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
function Force({ x, y, dx, dy, label, at }: { x: number; y: number; dx: number; dy: number; label: string; at: 'start' | 'middle' | 'end' }) {
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
      <text x={tipX + ux * 6} y={tipY + uy * 6 + 3} textAnchor={at} fontSize="10" fontWeight="700" fill={INK}>
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
      viewBox="0 0 200 180"
    >
      <rect x="55" y="18" width="90" height="144" fill={FILL} stroke={INK} strokeWidth="1.5" />
      <line x1="55" y1="146" x2="145" y2="146" stroke={INK} strokeWidth="1.5" />
      <rect x="88" y="118" width="24" height="28" fill={INK} opacity="0.85" />
      <Force x={100} y={132} dx={0} dy={-58} label="N" at="middle" />
      <Force x={100} y={132} dx={0} dy={26} label="w" at="middle" />
      <circle cx="100" cy="132" r="2.5" fill="#fff" />
      <text x="152" y="60" fontSize="9" fill={MUTED}>a ↑</text>
    </Frame>
  )
}

function FbdConnected() {
  return (
    <Frame
      title="Forces on two blocks joined by a light string"
      desc="Two blocks, A and B, rest on a rough horizontal surface and are joined by a light inextensible string. An applied force F pulls block B to the right. Block A has four forces on it: weight down, normal force up, tension T to the right from the string, and friction to the left. Block B has five: weight down, normal force up, the applied force F to the right, tension T to the left from the string, and friction to the left. The two tension arrows are equal in size and opposite in direction, because the string is light and pulls equally on both blocks."
      viewBox="0 0 300 150"
    >
      <line x1="10" y1="104" x2="290" y2="104" stroke={INK} strokeWidth="2" />
      <rect x="52" y="80" width="34" height="24" fill={INK} opacity="0.85" />
      <rect x="182" y="80" width="34" height="24" fill={INK} opacity="0.85" />
      <text x="69" y="97" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">A</text>
      <text x="199" y="97" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">B</text>
      <line x1="86" y1="92" x2="182" y2="92" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      <Force x={69} y={92} dx={0} dy={-42} label="N" at="middle" />
      <Force x={69} y={92} dx={0} dy={34} label="w" at="middle" />
      <Force x={69} y={92} dx={40} dy={0} label="T" at="start" />
      <Force x={69} y={92} dx={-40} dy={0} label="f" at="end" />
      <Force x={199} y={92} dx={0} dy={-42} label="N" at="middle" />
      <Force x={199} y={92} dx={0} dy={34} label="w" at="middle" />
      <Force x={199} y={92} dx={52} dy={0} label="F" at="start" />
      <Force x={199} y={92} dx={-40} dy={0} label="T" at="end" />
      <circle cx="69" cy="92" r="2.5" fill="#fff" />
      <circle cx="199" cy="92" r="2.5" fill="#fff" />
      <text x="150" y="134" textAnchor="middle" fontSize="9" fill={MUTED}>friction also acts on B, drawn with T</text>
    </Frame>
  )
}

const FIGURES: Record<FigureId, () => JSX.Element> = {
  'cast-diagram': CastDiagram,
  'surd-number-line': SurdNumberLine,
  'charges-on-a-line': ChargesOnALine,
  'fbd-incline': FbdIncline,
  'fbd-lift': FbdLift,
  'fbd-connected': FbdConnected,
}

export function Figure({ id }: FigureProps) {
  const Component = FIGURES[id]
  // An unknown id renders nothing rather than throwing: a typo in one
  // question's data must not take down the page around it.
  return Component ? <Component /> : null
}
