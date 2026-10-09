/**
 * The maps that Mathematical Literacy Paper 2 items describe in words.
 *
 * Each paper below writes its map out in its context -- "Lion Camp is
 * north-east of Main Camp ... the road measures 6,4 cm" -- and then asks
 * "on the map". Until these were drawn, those items were held back from
 * practice (awaitingStimulus.ts). Each map is built here from exactly the
 * facts its context gives, in map centimetres, so a length on the drawing is
 * the length the question states and check:geometry can measure it. Nothing is
 * labelled that the question does not say: a bar scale shows the one interval
 * the context names, and a grid shows the places the context lists.
 *
 * A map is matched by the opening words of its context, so every sub-question
 * of the section gets it -- including the ones that carry a later line such as
 * "The round trip is 41 km".
 */
import type { SceneSpec, ScenePoint } from '@/types'

type Seg = NonNullable<SceneSpec['segments']>[number]
type Txt = NonNullable<SceneSpec['texts']>[number]

const rad = (deg: number) => (deg * Math.PI) / 180
/** A point `dist` from (x, y) on a compass bearing (0° = north, 90° = east). */
const bearing = (x: number, y: number, deg: number, dist: number) => ({ x: x + dist * Math.sin(rad(deg)), y: y + dist * Math.cos(rad(deg)) })

/** A north arrow with its foot at (x, y). */
function north(x: number, y: number, len = 1.6): { points: ScenePoint[]; segments: Seg[]; texts: Txt[] } {
  return {
    points: [
      { id: 'N0', x, y },
      { id: 'N1', x, y: y + len },
    ],
    segments: [{ a: 'N0', b: 'N1', arrow: true }],
    texts: [{ x, y: y + len + 0.45, text: 'N', size: 13 }],
  }
}

/** A bar scale of `len` map units starting at (x, y), with a caption over it. */
function bar(x: number, y: number, len: number, caption: string): { points: ScenePoint[]; segments: Seg[]; texts: Txt[] } {
  const tick = 0.25
  return {
    points: [
      { id: 'B0', x, y },
      { id: 'B1', x: x + len, y },
      { id: 'B0t', x, y: y + tick },
      { id: 'B1t', x: x + len, y: y + tick },
      { id: 'B0b', x, y: y - tick },
      { id: 'B1b', x: x + len, y: y - tick },
    ],
    segments: [
      { a: 'B0', b: 'B1', thick: true },
      { a: 'B0b', b: 'B0t' },
      { a: 'B1b', b: 'B1t' },
    ],
    texts: [{ x: x + len / 2, y: y + 0.55, text: caption, size: 11 }],
  }
}

/** A grid of square blocks, `cols` letters across and `rows` numbers down, with its labels. */
function grid(cols: string[], rows: number, block: number, dashed: boolean): { points: ScenePoint[]; segments: Seg[]; texts: Txt[] } {
  const points: ScenePoint[] = []
  const segments: Seg[] = []
  const texts: Txt[] = []
  const W = cols.length * block
  const H = rows * block
  for (let i = 0; i <= cols.length; i++) {
    points.push({ id: `gv${i}a`, x: i * block, y: 0 }, { id: `gv${i}b`, x: i * block, y: -H })
    segments.push({ a: `gv${i}a`, b: `gv${i}b`, dashed })
  }
  for (let j = 0; j <= rows; j++) {
    points.push({ id: `gh${j}a`, x: 0, y: -j * block }, { id: `gh${j}b`, x: W, y: -j * block })
    segments.push({ a: `gh${j}a`, b: `gh${j}b`, dashed })
  }
  cols.forEach((c, i) => texts.push({ x: (i + 0.5) * block, y: 0.45, text: c, size: 12 }))
  for (let j = 1; j <= rows; j++) texts.push({ x: -0.5, y: -(j - 0.5) * block - 0.15, text: String(j), size: 12 })
  return { points, segments, texts }
}

/** The centre of a grid block such as 'C3'. */
const centre = (ref: string, cols: string[], block: number) => ({
  x: (cols.indexOf(ref[0]) + 0.5) * block,
  y: -(Number(ref.slice(1)) - 0.5) * block,
})

const place = (id: string, label: string, p: { x: number; y: number }): ScenePoint => ({ id, label, dot: true, ...p })

function merge(title: string, toScale: boolean, parts: { points?: ScenePoint[]; segments?: Seg[]; texts?: Txt[] }[], notes?: string[]): SceneSpec {
  return {
    title,
    points: parts.flatMap((p) => p.points ?? []),
    segments: parts.flatMap((p) => p.segments ?? []),
    texts: parts.flatMap((p) => p.texts ?? []),
    notes,
    toScale,
  }
}

/** The third corner of a triangle, `dA` from A and `dB` from B, on the side given by `sign`. */
function third(A: { x: number; y: number }, B: { x: number; y: number }, dA: number, dB: number, sign: 1 | -1) {
  const d = Math.hypot(B.x - A.x, B.y - A.y)
  const a = (dA * dA - dB * dB + d * d) / (2 * d)
  const h = Math.sqrt(dA * dA - a * a)
  const ux = (B.x - A.x) / d
  const uy = (B.y - A.y) / d
  return { x: A.x + a * ux - sign * h * uy, y: A.y + a * uy + sign * h * ux }
}

// --- 2020: a game reserve, three camps, a bar scale of 1 cm to 2,5 km
function reserve2020(): SceneSpec {
  const M = { x: 0, y: 0 }
  const L = bearing(0, 0, 45, 6.4)
  const R = third(M, L, 5.2, 4.8, -1)
  return merge(
    'Tourist map of the game reserve',
    true,
    [
      { points: [place('M', 'Main Camp', M), place('L', 'Lion Camp', L), place('R', 'River Camp', R)] },
      {
        segments: [
          { a: 'M', b: 'L', label: '6,4 cm', thick: true },
          { a: 'L', b: 'R', label: '4,8 cm', thick: true },
          { a: 'R', b: 'M', label: '5,2 cm', thick: true },
        ],
      },
      north(-1, 3.5),
      bar(-1, -3.2, 1, '2,5 km'),
    ],
    ['Lengths are measured on the map. Bar scale: 1 cm represents 2,5 km.'],
  )
}

// --- 2021: a town centre on a grid, columns A to F, rows 1 to 5, scale 1 : 20 000
function town2021(): SceneSpec {
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']
  const b = 2
  const at = (r: string) => centre(r, cols, b)
  // The context measures the straight line taxi rank → hospital as 8,5 cm, so
  // those two are placed inside their blocks at exactly that distance apart
  // (block centre to block centre would be 8,25 cm).
  const taxi = { x: 0.5, y: -9.5 }
  const dy = 1.6
  const hosp = { x: taxi.x + Math.sqrt(8.5 * 8.5 - dy * dy), y: taxi.y + dy }
  return merge(
    'Map of the town centre',
    true,
    [
      grid(cols, 5, b, true),
      {
        points: [
          place('police', 'Police station', at('B2')),
          place('school', 'School', at('F1')),
          place('post', 'Post office', at('D2')),
          place('library', 'Library', at('C3')),
          place('park', 'Park', at('C4')),
          place('hospital', 'Hospital', hosp),
          place('taxi', 'Taxi rank', taxi),
        ],
        segments: [{ a: 'taxi', b: 'hospital', label: '8,5 cm', dashed: true }],
      },
      north(14.4, -7.5),
    ],
    ['Scale 1 : 20 000. Each grid block is 2 cm by 2 cm on the map.'],
  )
}

// --- 2022: Gqeberha, East London, Mthatha on a road map, scale 1 : 2 500 000
function road2022(): SceneSpec {
  const G = { x: 0, y: 0 }
  const E = bearing(0, 0, 62, 12.1)
  // 235 km at 1 : 2 500 000 is 9,4 cm on the map.
  const T = bearing(E.x, E.y, 38, 235 / 25)
  const mid = { x: (E.x + T.x) / 2, y: (E.y + T.y) / 2 }
  return merge(
    'Road map: Gqeberha to Mthatha',
    true,
    [
      { points: [place('G', 'Gqeberha', G), place('E', 'East London', E), place('T', 'Mthatha', T)] },
      {
        segments: [
          { a: 'G', b: 'E', label: '12,1 cm', thick: true },
          { a: 'E', b: 'T', thick: true },
        ],
        texts: [{ x: mid.x + 1.6, y: mid.y - 0.6, text: '235 km', size: 12 }],
      },
      north(-1, 9),
    ],
    ['Scale 1 : 2 500 000. The road from East London to Mthatha is marked with its real distance.'],
  )
}

// --- 2025: a city bus route with 12 stops, bar scale 2 cm to 1 km
function bus2025(): SceneSpec {
  // A closed route of 12 stops, 29 cm long on the map (14,5 km at 2 cm per
  // km), with stop 7 north-east of stop 1: a regular 12-sided loop.
  const n = 12
  const R = 29 / (2 * n * Math.sin(Math.PI / n))
  const stops = Array.from({ length: n }, (_, i) => bearing(0, 0, 225 + 30 * i, R))
  return merge(
    'Route map of the tourist bus',
    true,
    [
      {
        points: stops.map((p, i) => (i === 0 ? place('s1', 'Stop 1', p) : i === 6 ? place('s7', 'Stop 7', p) : { id: `s${i + 1}`, dot: true, ...p })),
        segments: stops.map((_, i) => ({ a: `s${i + 1}`, b: `s${((i + 1) % n) + 1}`, thick: true })),
      },
      north(R + 1.5, 1),
      bar(R - 0.5, -R - 0.8, 2, '1 km'),
    ],
    ['The bus travels the loop and returns to stop 1.'],
  )
}

// --- Prediction paper A: Lerato's route to the clinic, scale 1 : 50 000
function route_a(): SceneSpec {
  const H = { x: 0, y: 0 }
  const J = { x: 14, y: 0 }
  const C = { x: 14, y: 9 }
  return merge(
    "Map of Lerato's route to the clinic",
    true,
    [
      { points: [place('H', 'Home', H), { id: 'J', ...J }, place('C', 'Clinic', C)] },
      {
        segments: [
          { a: 'H', b: 'J', label: '14 cm', thick: true },
          { a: 'J', b: 'C', label: '9 cm', thick: true },
        ],
        texts: [
          { x: 7, y: 1.1, text: 'Main road', size: 11 },
          { x: 12.2, y: 4.5, text: 'Side road', size: 11 },
        ],
      },
      north(1, 5),
    ],
    ['Scale 1 : 50 000. Lengths are measured on the map.'],
  )
}

// --- Prediction paper B: a nature reserve, bar scale 2 cm to 5 km
function reserve_b(): SceneSpec {
  const C = { x: 0, y: 0 }
  const W = bearing(0, 0, 135, 7.4)
  return merge(
    'Tourist map of the nature reserve',
    true,
    [
      { points: [place('C', 'Camp', C), place('W', 'Waterhole', W)] },
      { segments: [{ a: 'C', b: 'W', label: '7,4 cm', thick: true }] },
      north(-2.5, -1.5),
      bar(-2.5, -6.5, 2, '5 km'),
    ],
  )
}

// --- Prediction paper C: a town on a grid, columns A to F, rows 1 to 6, scale 1 : 25 000
function town_c(): SceneSpec {
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']
  const b = 2
  const at = (r: string) => centre(r, cols, b)
  return merge(
    'Town map with grid blocks',
    true,
    [grid(cols, 6, b, false), { points: [place('school', 'School', at('B3')), place('library', 'Library', at('B6')), place('clinic', 'Clinic', at('E3'))] }, north(13.2, -4)],
    ['Scale 1 : 25 000. Each block is 2 cm by 2 cm; the roads run along the grid lines.'],
  )
}

const MAPS: [RegExp, () => SceneSpec][] = [
  [/^A tourist map of a game reserve uses a bar scale on which 1 cm represents 2,5 km/, reserve2020],
  [/^A map of a town centre is divided into a grid: columns A to F/, town2021],
  [/^A family drives from Gqeberha to Mthatha through East London/, road2022],
  [/^A tourist bus follows a round trip through a city, stopping at 12 stops/, bus2025],
  [/^Lerato drives from her home to a clinic\. On a map with the number scale 1 : 50 000/, route_a],
  [/^A tourist map of a nature reserve has a bar scale on which 2 cm represents 5 km/, reserve_b],
  [/^A town map is divided into grid blocks\. Columns are labelled A to F/, town_c],
]

const built = new Map<() => SceneSpec, SceneSpec>()

/** The drawn map for a Mathematical Literacy question, or null. */
export function mapSceneFor(q: { topicId: string; context?: string; ownContext?: string }): SceneSpec | null {
  if (q.topicId !== 'maps-plans' && q.topicId !== 'measurement') return null
  const text = q.ownContext ?? q.context ?? ''
  for (const [re, make] of MAPS) {
    if (!re.test(text)) continue
    if (!built.has(make)) built.set(make, make())
    return built.get(make)!
  }
  return null
}
