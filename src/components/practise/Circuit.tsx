import type { CircuitElement, CircuitSpec } from '@/types'

/**
 * Draw a circuit from its components, the way a Physical Sciences paper prints one.
 *
 * WHY THIS EXISTS. Physical Sciences had eight pictures across 2 072 questions
 * -- 0,4% -- and around a hundred of those questions are about a circuit. Every
 * Paper 1 electricity question in the country is printed with a circuit diagram
 * above it, because reading the diagram IS half the question: whether two
 * resistors share a junction decides whether you add them or add their
 * reciprocals, and a learner who cannot see the arrangement is answering a
 * different question from the one the exam asks.
 *
 * WHY IT IS DRAWN FROM A SPEC, like Graph.tsx and unlike Figure.tsx. "A 4 Ω and
 * an 8 Ω resistor in series to a 12 V battery" is the same picture as "a 6 Ω and
 * a 12 Ω in series to a 9 V battery" with different numbers on it. There are
 * scores of those, so they are described rather than drawn: the resistance
 * values come from the question's own words, and the picture is a consequence.
 *
 * TWO LAYOUTS, because papers print two different things.
 *
 *   A CLOSED LOOP, when the question gives a source: the cell on the left, the
 *   components along the top wire, the return wire along the bottom. This is
 *   the one a learner meets in "calculate the current supplied by the battery".
 *
 *   AN OPEN NETWORK, when it does not: a single wire between two terminals
 *   marked A and B, with no cell anywhere. "Calculate the equivalent resistance
 *   of the combination" is asked of a network, not of a circuit, and drawing a
 *   battery into it would put a voltage on the page that the question never
 *   gave -- which is exactly the invitation to compute a current that the
 *   marker is not asking for.
 *
 * Either way a parallel combination splits the wire into two rails and rejoins
 * it, so the junctions -- the thing the learner has to spot -- are visible as
 * dots.
 */

const INK = '#1e3a5f'
const MUTED = '#64748b'
const ACCENT = '#b8860b'
const WIRE = '#334155'

const VIEW_W = 320
/** The loop the current runs round, when there is a cell to drive it. */
const LOOP = { left: 34, right: 292, top: 56, bottom: 148 }
/** The single wire an open network hangs on. */
const OPEN = { left: 40, right: 286, y: 62 }

/**
 * Where the branches of a parallel bank sit, relative to the wire.
 *
 * Two branches straddle the wire and the wire between the junctions is rubbed
 * out, because the current has two paths and drawing a third straight through
 * would show three. THREE branches put the middle one ON the wire, which is how
 * a textbook prints three in parallel and is a good deal more compact than
 * stacking three rails below the line -- the alternative ran off the bottom of
 * the picture and landed on the caption.
 */
const RAILS: Record<number, number[]> = { 1: [0], 2: [-17, 17], 3: [-31, 0, 31] }
/** Where the cell sits on the left wire, midway down the loop. */
const CELL = { y: 92 }
/** Room a resistor and its label need above and below their own rail. */
const LABEL_ABOVE = 20
const LABEL_BELOW = 19

/** Ohms as a paper writes them: comma decimal, no trailing zeros. */
const ohms = (v: number): string => String(Math.round(v * 100) / 100).replace('.', ',')

/* ------------------------------------------------------------------ */
/* The physics, computed rather than asserted                          */
/* ------------------------------------------------------------------ */

/** Resistance of one element: a resistor, or a parallel bank. */
export function resistanceOf(el: CircuitElement): number {
  if (el.kind === 'resistor') return el.ohms
  // 1/Rp = 1/R1 + 1/R2 + ...
  const reciprocals = el.of.reduce((a, r) => a + 1 / r.ohms, 0)
  return reciprocals === 0 ? 0 : 1 / reciprocals
}

/** Total resistance of the whole circuit, including internal resistance. */
export function totalResistance(spec: CircuitSpec): number {
  return spec.elements.reduce((a, el) => a + resistanceOf(el), 0) + (spec.internalResistance ?? 0)
}

/** The current the cell drives: I = emf / R total. Null with no cell. */
export function totalCurrent(spec: CircuitSpec): number | null {
  if (spec.emf === undefined) return null
  const r = totalResistance(spec)
  return r === 0 ? null : spec.emf / r
}

/* ------------------------------------------------------------------ */
/* Describing it in words                                              */
/* ------------------------------------------------------------------ */

/**
 * What the circuit shows, for a learner using a screen reader.
 *
 * Generated from the same spec that draws it, so the description cannot drift
 * from the picture -- and it names the ARRANGEMENT, not just the parts, since
 * the arrangement is the thing the diagram is there to convey.
 */
export function describeCircuit(spec: CircuitSpec): string {
  const parts = spec.elements.map((el) =>
    el.kind === 'resistor'
      ? `a ${ohms(el.ohms)} ohm resistor`
      : `a parallel combination of ${el.of.map((r) => `${ohms(r.ohms)} ohms`).join(' and ')}`,
  )
  let text: string
  if (spec.emf === undefined) {
    text = `A network between two terminals A and B, containing, in series from A to B, ${parts.join(', then ')}.`
    text += ' There is no cell in this diagram.'
  } else {
    text = `A circuit with a ${ohms(spec.emf)} volt cell`
    text +=
      spec.internalResistance === undefined
        ? ' of negligible internal resistance'
        : ` of internal resistance ${ohms(spec.internalResistance)} ohms`
    text += `, connected in series to ${parts.join(', then ')}.`
  }
  if (spec.ammeter) text += ' An ammeter is in series in the main circuit.'
  if (spec.voltmeterAcross !== undefined) {
    const el = spec.elements[spec.voltmeterAcross]
    if (el) {
      text += ` A voltmeter is connected in parallel across ${
        el.kind === 'resistor' ? `the ${ohms(el.ohms)} ohm resistor` : 'the parallel combination'
      }.`
    }
  }
  return text
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

/** The IEC rectangle a South African textbook uses for a resistor. */
function Resistor({ x, y, label, below }: { x: number; y: number; label: string; below?: boolean }) {
  const w = 34
  const h = 14
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#fff" stroke={INK} strokeWidth="1.8" />
      <text
        x={x}
        y={below ? y + h / 2 + 11 : y - h / 2 - 5}
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill={INK}
      >
        {label}
      </text>
    </g>
  )
}

/** A junction where three or more wires meet, which is what makes it parallel. */
const Junction = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r="2.6" fill={WIRE} />

function Meter({ x, y, letter, title }: { x: number; y: number; letter: string; title: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill="#fff" stroke={ACCENT} strokeWidth="1.8" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill={ACCENT}>
        {letter}
      </text>
      <title>{title}</title>
    </g>
  )
}

/** The rail offsets a bank of `n` branches uses, falling back for odd sizes. */
const railsFor = (n: number): number[] => RAILS[n] ?? RAILS[2]

/** How far above and below the wire an element reaches, labels included. */
function extentOf(el: CircuitElement): { above: number; below: number } {
  if (el.kind === 'resistor') return { above: LABEL_ABOVE, below: 8 }
  const rails = railsFor(el.of.length)
  return {
    above: -Math.min(...rails) + LABEL_ABOVE,
    below: Math.max(...rails) + LABEL_BELOW,
  }
}

/**
 * One element sitting on the wire at height `y`, centred on `x`.
 *
 * A parallel bank runs its branches on rails around the wire, so the two
 * junctions -- the whole point of the picture -- are what the eye lands on. A
 * branch below the wire has its value written BELOW it: a label above would
 * land on the wire it hangs from.
 */
function Element({ el, x, y, span }: { el: CircuitElement; x: number; y: number; span: number }) {
  if (el.kind === 'resistor') return <Resistor x={x} y={y} label={`${ohms(el.ohms)} Ω`} />

  const half = Math.min(span / 2 - 8, 42)
  const left = x - half
  const right = x + half
  const rails = railsFor(el.of.length)
  const onTheWire = rails.includes(0)

  return (
    <g>
      {/* With no branch on the wire itself, rub the wire out between the
          junctions: the current does not go that way, and leaving it drawn
          would show one more path than the circuit has. */}
      {onTheWire ? null : <line x1={left} y1={y} x2={right} y2={y} stroke="#fff" strokeWidth="3.4" />}
      {rails.map((offset, i) =>
        offset === 0 ? null : (
          <path
            key={`rail-${i}`}
            d={`M${left} ${y} L${left} ${y + offset} L${right} ${y + offset} L${right} ${y}`}
            fill="none"
            stroke={WIRE}
            strokeWidth="1.8"
          />
        ),
      )}
      {el.of.map((branch, i) => (
        <Resistor key={i} x={x} y={y + rails[i]} label={`${ohms(branch.ohms)} Ω`} below={rails[i] > 0} />
      ))}
      <Junction x={left} y={y} />
      <Junction x={right} y={y} />
    </g>
  )
}

interface CircuitProps {
  spec: CircuitSpec
}

export function Circuit({ spec }: CircuitProps) {
  const open = spec.emf === undefined
  const left = open ? OPEN.left : LOOP.left
  const right = open ? OPEN.right : LOOP.right
  const wireY = open ? OPEN.y : LOOP.top

  // The canvas is sized to what is actually drawn. A three-branch bank hangs
  // lower than a two-branch one, and an open network needs no room for a return
  // wire; a single fixed height either left a block of white space under the
  // simple ones or dropped the bottom branch of the busy ones onto the caption.
  const extents = spec.elements.map(extentOf)
  const reachesBelow = Math.max(...extents.map((e) => e.below), 0)
  const FOOTNOTE = 16
  const viewH = open ? wireY + reachesBelow + FOOTNOTE + 6 : LOOP.bottom + FOOTNOTE + 10

  // The footnote explains the junction dots, so it is only worth its line when
  // there are dots to explain.
  const hasJunctions = spec.elements.some((el) => el.kind === 'parallel')

  const n = spec.elements.length
  const span = (right - left) / Math.max(n, 1)
  /** Centre of element i along the wire. */
  const cx = (i: number) => left + span * (i + 0.5)

  // The ammeter sits in the bottom wire, in series, which is where it belongs
  // and where a learner is asked to put it.
  const ammeterX = (left + right) / 2

  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-2 sm:p-3">
      <svg
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        role="img"
        aria-label={spec.title}
        className="mx-auto block h-auto w-full max-w-md"
      >
        <title>{spec.title}</title>
        <desc>{describeCircuit(spec)}</desc>

        {open ? (
          /* An open network: one wire, two terminals, no source. */
          <g>
            <line x1={left} y1={wireY} x2={right} y2={wireY} stroke={WIRE} strokeWidth="1.8" />
            <circle cx={left} cy={wireY} r="3.4" fill="#fff" stroke={WIRE} strokeWidth="1.8" />
            <circle cx={right} cy={wireY} r="3.4" fill="#fff" stroke={WIRE} strokeWidth="1.8" />
            <text x={left} y={wireY - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill={MUTED}>
              A
            </text>
            <text x={right} y={wireY - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill={MUTED}>
              B
            </text>
          </g>
        ) : (
          <>
            {/* The loop: left wire, top wire, right wire, bottom wire. */}
            <path
              d={`M${left} ${LOOP.bottom} L${left} ${LOOP.top} L${right} ${LOOP.top} L${right} ${LOOP.bottom} Z`}
              fill="none"
              stroke={WIRE}
              strokeWidth="1.8"
            />
            {/*
              The cell, drawn across the left wire: long plate positive.

              Its labels go INSIDE the loop, where the picture is empty. Hung
              outside they ran off the left edge of the canvas and the learner
              read "l2 V" for 12 V -- and a clipped voltage is worse than an
              unlabelled one, because it looks like a number.
            */}
            <g>
              <line x1={left - 11} y1={CELL.y} x2={left + 11} y2={CELL.y} stroke={INK} strokeWidth="2.6" />
              <line x1={left - 6} y1={CELL.y + 10} x2={left + 6} y2={CELL.y + 10} stroke={INK} strokeWidth="5" />
              <rect x={left - 3} y={CELL.y} width="6" height="10" fill="#fff" stroke="none" />
              <text x={left + 16} y={CELL.y + 1} fontSize="9.5" fontWeight="700" fill={INK}>
                {ohms(spec.emf as number)} V
              </text>
              {spec.internalResistance !== undefined ? (
                <text x={left + 16} y={CELL.y + 15} fontSize="9.5" fill={MUTED}>
                  r = {ohms(spec.internalResistance)} Ω
                </text>
              ) : null}
            </g>
          </>
        )}

        {/* The elements along the wire. */}
        {spec.elements.map((el, i) => (
          <Element key={i} el={el} x={cx(i)} y={wireY} span={span} />
        ))}

        {/* An ammeter goes in series, in the return wire. */}
        {!open && spec.ammeter ? (
          <g>
            <line x1={ammeterX - 10} y1={LOOP.bottom} x2={ammeterX + 10} y2={LOOP.bottom} stroke="#fff" strokeWidth="3.2" />
            <Meter x={ammeterX} y={LOOP.bottom} letter="A" title="Ammeter, in series" />
          </g>
        ) : null}

        {/* A voltmeter goes in parallel, across one element. */}
        {!open && spec.voltmeterAcross !== undefined && spec.elements[spec.voltmeterAcross] ? (
          (() => {
            const x = cx(spec.voltmeterAcross)
            const y = LOOP.top + 46
            return (
              <g>
                <path d={`M${x - 24} ${LOOP.top} L${x - 24} ${y} L${x - 11} ${y}`} fill="none" stroke={ACCENT} strokeWidth="1.4" />
                <path d={`M${x + 24} ${LOOP.top} L${x + 24} ${y} L${x + 11} ${y}`} fill="none" stroke={ACCENT} strokeWidth="1.4" />
                <Junction x={x - 24} y={LOOP.top} />
                <Junction x={x + 24} y={LOOP.top} />
                <Meter x={x} y={y} letter="V" title="Voltmeter, in parallel" />
              </g>
            )
          })()
        ) : null}

        {hasJunctions ? (
          <text x={12} y={viewH - 6} fontSize="9" fill={MUTED}>
            A dot marks a junction. Resistors sharing both junctions are in parallel.
          </text>
        ) : null}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-navy-500">{spec.title}</figcaption>
    </figure>
  )
}
