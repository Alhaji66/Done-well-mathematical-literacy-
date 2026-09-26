import { useId, type ReactNode } from 'react'
import type { Prob, Question, TreeSpec, VennRegion, VennSpec } from '@/types'
import { probabilityDiagramsFor, probValue } from '@/lib/probabilityDiagrams'

/**
 * Probability tree diagrams and Venn diagrams, drawn the way a memo draws them.
 *
 * A tree carries a probability on every branch and, at the end of each path,
 * the outcome and the product that gives its probability -- so "multiply along,
 * add across" is on the page, not just in the notes. The paths the question
 * asks about are picked out in gold and added up underneath.
 *
 * A Venn diagram carries a number in every region, including the one outside
 * both circles that learners forget, and shades the region the question asks
 * about.
 *
 * The specs come from src/lib/probabilityDiagrams.ts, which reads them off the
 * question's own numbers; `npm run check:probability` holds them to the memo.
 */

/** Palette shared with Chart.tsx and Graph.tsx. */
const INK = '#1e3a5f'
const MUTED = '#64748b'
const ACCENT = '#b8860b'
const LINE = '#94a3b8'
const SHADE = '#fbeecb'

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

/** 0,25 -- a South African paper writes a decimal comma. */
const decimal = (v: number) => String(Math.round(v * 10000) / 10000).replace('.', ',')

const showProb = (p: Prob) => (typeof p === 'number' ? decimal(p) : `${p[0]}/${p[1]}`)

/** The product along a path, kept as the memo keeps it: 4/10 × 3/9 = 12/90. */
function product(a: Prob, b: Prob): Prob {
  if (typeof a !== 'number' && typeof b !== 'number') return [a[0] * b[0], a[1] * b[1]]
  return Math.round(probValue(a) * probValue(b) * 1e6) / 1e6
}

function Frame({ title, desc, viewBox, children, note }: { title: string; desc: string; viewBox: string; children: ReactNode; note?: string }) {
  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-2 sm:p-3">
      <svg viewBox={viewBox} role="img" aria-label={title} className="mx-auto block h-auto w-full max-w-md">
        <title>{title}</title>
        <desc>{desc}</desc>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-navy-500">
        {title}
        {note ? <span className="mt-1 block text-sm font-semibold text-gold-800">{note}</span> : null}
      </figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------------ */

export function TreeDiagram({ spec }: { spec: TreeSpec }) {
  // Narrow enough to be shown near full size on a phone (about 290 px): each
  // outcome's working goes on two short lines rather than one long one.
  const GAP = 44
  const TOP = 34
  const X0 = 12
  const X1 = 104
  const X2 = 196
  const leaves = spec.branches.flatMap((b) => (b.next ?? []).map((n) => ({ first: b, second: n, path: b.label + n.label })))
  const height = TOP + leaves.length * GAP
  const leafY = (i: number) => TOP + GAP / 2 + i * GAP
  const rootY = TOP + (leaves.length * GAP) / 2
  const lit = new Set(spec.highlight ?? [])

  let leafIndex = 0
  const firstNodes = spec.branches.map((b) => {
    const count = b.next?.length ?? 0
    const ys = Array.from({ length: count }, (_, k) => leafY(leafIndex + k))
    const y = ys.reduce((s, v) => s + v, 0) / (count || 1)
    const start = leafIndex
    leafIndex += count
    return { b, y, start }
  })

  const litFirst = (label: string) => [...lit].some((p) => p.startsWith(label))

  /** A branch with its probability written above its middle. */
  const branch = (x1: number, y1: number, x2: number, y2: number, p: Prob, on: boolean, key: string) => {
    // Above a branch that climbs, below one that falls: two branches leave
    // each node, and their labels would otherwise land on top of each other.
    // The label is pushed off the branch along its perpendicular, far enough
    // that no corner of the label's box reaches the line.
    const len = Math.hypot(x2 - x1, y2 - y1) || 1
    const ux = (x2 - x1) / len
    const uy = (y2 - y1) / len
    const falls = y2 > y1 + 1
    const nx = falls ? -uy : uy
    const ny = falls ? ux : -ux
    const halfW = showProb(p).length * 3.7
    const d = halfW * Math.abs(uy) + 6 * Math.abs(ux) + 4
    const mx = x1 + (x2 - x1) * 0.5 + nx * d
    const ly = y1 + (y2 - y1) * 0.5 + ny * d + 4
    return (
      <g key={key}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? ACCENT : LINE} strokeWidth={on ? 2.5 : 1.5} />
        <text x={mx} y={ly} textAnchor="middle" fontSize="12" fontWeight="600" fill={on ? ACCENT : INK}>
          {showProb(p)}
        </text>
      </g>
    )
  }

  const node = (x: number, y: number, label: string, on: boolean, key: string) => (
    <g key={key}>
      <circle cx={x} cy={y} r="11" fill="white" stroke={on ? ACCENT : INK} strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={on ? ACCENT : INK}>
        {label}
      </text>
    </g>
  )

  // The sum under the tree: P(same colour) = 16/90 + 30/90 = 46/90 = 23/45.
  let note: string | undefined
  if (spec.highlight?.length && spec.highlightName) {
    const parts = leaves.filter((l) => lit.has(l.path)).map((l) => product(l.first.p, l.second.p))
    const fractions = parts.every((p) => typeof p !== 'number') && new Set(parts.map((p) => (p as [number, number])[1])).size === 1
    let total: string
    if (fractions) {
      const den = (parts[0] as [number, number])[1]
      const numer = parts.reduce((s, p) => s + (p as [number, number])[0], 0)
      const g = gcd(numer, den)
      total = `${numer}/${den}${g > 1 ? ` = ${numer / g}/${den / g}` : ''}`
    } else total = decimal(parts.reduce((s: number, p) => s + probValue(p), 0))
    note = `P(${spec.highlightName}) = ${parts.length > 1 ? `${parts.map(showProb).join(' + ')} = ` : ''}${total}`
  }

  const desc = [
    `A probability tree with two stages: ${spec.stages[0]}, then ${spec.stages[1]}.`,
    ...leaves.map((l) => {
      const pr = product(l.first.p, l.second.p)
      return `${l.first.name} with probability ${showProb(l.first.p)}, then ${l.second.name} with probability ${showProb(l.second.p)}: outcome ${l.path}, probability ${showProb(pr)}${lit.has(l.path) ? ' (highlighted)' : ''}.`
    }),
    note ? `${note}.` : '',
  ].join(' ')

  // Wide enough for the longest line of working at the end of a path.
  const widest = Math.max(
    ...leaves.map((l) => Math.max(`${l.path} = ${showProb(product(l.first.p, l.second.p))}`.length * 7.6, `${showProb(l.first.p)} × ${showProb(l.second.p)}`.length * 6.4)),
  )
  return (
    <Frame title={spec.title} desc={desc} viewBox={`0 0 ${Math.ceil(X2 + 18 + widest + 6)} ${height + 8}`} note={note}>
      {[
        [X1, spec.stages[0]],
        [X2, spec.stages[1]],
      ].map(([x, label]) => (
        <text key={String(label)} x={x} y="16" textAnchor="middle" fontSize="12" fill={MUTED}>
          {label}
        </text>
      ))}
      <circle cx={X0} cy={rootY} r="3" fill={INK} />

      {firstNodes.map(({ b, y, start }) => (
        <g key={b.label}>
          {branch(X0 + 3, rootY, X1 - 10, y, b.p, litFirst(b.label), `f-${b.label}`)}
          {(b.next ?? []).map((n, k) => {
            const ly = leafY(start + k)
            const path = b.label + n.label
            const on = lit.has(path)
            const pr = product(b.p, n.p)
            return (
              <g key={path}>
                {branch(X1 + 10, y, X2 - 10, ly, n.p, on, `s-${path}`)}
                {node(X2, ly, n.label, on, `n-${path}`)}
                <text x={X2 + 18} y={ly - 1} fontSize="13" fontWeight="700" fill={on ? ACCENT : INK}>
                  {path} = {showProb(pr)}
                </text>
                <text x={X2 + 18} y={ly + 13} fontSize="11" fontWeight={on ? 600 : 400} fill={on ? ACCENT : MUTED}>
                  {showProb(b.p)} × {showProb(n.p)}
                </text>
              </g>
            )
          })}
          {node(X1, y, b.label, litFirst(b.label), `n-${b.label}`)}
        </g>
      ))}
    </Frame>
  )
}

/* ------------------------------------------------------------------ */

export function VennDiagram({ spec }: { spec: VennSpec }) {
  const id = useId().replace(/:/g, '')
  const fmt = (v: number) => (spec.unit === 'p' ? decimal(v) : spec.unit === '%' ? `${v}%` : String(v))
  const R = spec.disjoint ? 54 : 64
  const A = { x: spec.disjoint ? 92 : 126, y: 116 }
  const B = { x: spec.disjoint ? 228 : 194, y: 116 }
  const lit = new Set<VennRegion>(spec.highlight ?? [])
  const label = (s: { name: string; symbol: string }) => (s.name === s.symbol || s.name.length > 14 ? s.symbol : `${s.name} (${s.symbol})`)
  const sLabel = spec.unit === 'p' ? 'S — the whole sample space, P(S) = 1' : spec.unit === '%' ? 'S — the whole group, 100%' : `S — all ${spec.total}`

  const regions: { key: VennRegion; x: number; y: number; anchor: 'middle' | 'end' }[] = [
    { key: 'onlyA', x: spec.disjoint ? A.x : A.x - 30, y: A.y + 6, anchor: 'middle' },
    ...(spec.disjoint ? [] : [{ key: 'both' as const, x: (A.x + B.x) / 2, y: A.y + 6, anchor: 'middle' as const }]),
    { key: 'onlyB', x: spec.disjoint ? B.x : B.x + 30, y: B.y + 6, anchor: 'middle' },
    { key: 'neither', x: 300, y: 196, anchor: 'end' },
  ]
  const values: Record<VennRegion, number> = { onlyA: spec.onlyA, both: spec.both, onlyB: spec.onlyB, neither: spec.neither }

  let note: string | undefined
  if (spec.highlight?.length && spec.highlightName) {
    const parts = spec.highlight.map((r) => values[r])
    const sum = Math.round(parts.reduce((a, b) => a + b, 0) * 1e6) / 1e6
    const name = spec.highlightName.charAt(0).toUpperCase() + spec.highlightName.slice(1)
    note = `${name}: ${parts.length > 1 ? `${parts.map(fmt).join(' + ')} = ` : ''}${fmt(sum)}`
  }

  const [sa, sb] = spec.sets
  const desc = [
    `A Venn diagram. The rectangle is ${sLabel}.`,
    spec.disjoint
      ? `Two separate circles, ${sa.name} and ${sb.name}, that do not overlap because the events are mutually exclusive.`
      : `Two overlapping circles, ${sa.name} and ${sb.name}.`,
    `${sa.name} only: ${fmt(spec.onlyA)}.`,
    spec.disjoint ? '' : `Both ${sa.name} and ${sb.name}: ${fmt(spec.both)}.`,
    `${sb.name} only: ${fmt(spec.onlyB)}.`,
    `Neither, outside both circles: ${fmt(spec.neither)}.`,
    note ? `Shaded: ${note}.` : '',
  ].join(' ')

  return (
    <Frame title={spec.title} desc={desc} viewBox="0 0 320 212" note={note}>
      <defs>
        <clipPath id={`${id}-a`}>
          <circle cx={A.x} cy={A.y} r={R} />
        </clipPath>
        <mask id={`${id}-not-a`}>
          <rect x="0" y="0" width="320" height="212" fill="white" />
          <circle cx={A.x} cy={A.y} r={R} fill="black" />
        </mask>
        <mask id={`${id}-not-b`}>
          <rect x="0" y="0" width="320" height="212" fill="white" />
          <circle cx={B.x} cy={B.y} r={R} fill="black" />
        </mask>
        <mask id={`${id}-neither`}>
          <rect x="0" y="0" width="320" height="212" fill="white" />
          <circle cx={A.x} cy={A.y} r={R} fill="black" />
          <circle cx={B.x} cy={B.y} r={R} fill="black" />
        </mask>
      </defs>

      <text x="10" y="16" fontSize="11" fill={MUTED}>
        {sLabel}
      </text>
      <rect x="8" y="24" width="304" height="182" rx="6" fill="white" stroke={INK} strokeWidth="1.5" />

      {/* Shading for the region the question asks about. */}
      {lit.has('neither') ? <rect x="9" y="25" width="302" height="180" rx="5" fill={SHADE} mask={`url(#${id}-neither)`} /> : null}
      {lit.has('onlyA') ? <circle cx={A.x} cy={A.y} r={R} fill={SHADE} mask={`url(#${id}-not-b)`} /> : null}
      {lit.has('onlyB') ? <circle cx={B.x} cy={B.y} r={R} fill={SHADE} mask={`url(#${id}-not-a)`} /> : null}
      {lit.has('both') ? <circle cx={B.x} cy={B.y} r={R} fill={SHADE} clipPath={`url(#${id}-a)`} /> : null}

      <circle cx={A.x} cy={A.y} r={R} fill="none" stroke={INK} strokeWidth="1.5" />
      <circle cx={B.x} cy={B.y} r={R} fill="none" stroke={INK} strokeWidth="1.5" />
      <text x={A.x - (spec.disjoint ? 0 : 18)} y={A.y - R - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK}>
        {label(sa)}
      </text>
      <text x={B.x + (spec.disjoint ? 0 : 18)} y={B.y - R - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK}>
        {label(sb)}
      </text>

      {regions.map((r) => (
        <text key={r.key} x={r.x} y={r.y} textAnchor={r.anchor} fontSize="16" fontWeight="700" fill={lit.has(r.key) ? ACCENT : INK}>
          {fmt(values[r.key])}
        </text>
      ))}
    </Frame>
  )
}

/* ------------------------------------------------------------------ */

/** The diagrams for one question, shown with its answer. Renders nothing for other questions. */
export function ProbabilityDiagrams({ question }: { question: Pick<Question, 'id' | 'topicId' | 'prompt' | 'context' | 'answer'> }) {
  const { trees, venn } = probabilityDiagramsFor(question)
  if (!trees.length && !venn) return null
  return (
    <>
      {trees.map((t) => (
        <TreeDiagram key={t.title} spec={t} />
      ))}
      {venn ? <VennDiagram spec={venn} /> : null}
    </>
  )
}
