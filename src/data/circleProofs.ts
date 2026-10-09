/**
 * Grade 11 circle geometry: proofs with reasons.
 *
 * The coverage report found no Grade 11 Euclidean geometry question that asks
 * a learner to PROVE something -- yet every Paper 2 has both kinds: one of the
 * four theorems CAPS lists for proof, and riders that are proved with
 * statements and reasons. Here are the four theorem proofs, and six riders,
 * each with a diagram drawn exactly (points on the circle, right angles true
 * right angles, parallel lines parallel), and a memo that gives a mark for
 * each statement with its reason, the way an NSC memo does.
 *
 * The theorem diagrams are the ones geometryDiagrams.ts already draws from a
 * theorem's wording; the riders' diagrams are below, by question id.
 */
import type { Question, SceneSpec, ScenePoint } from '@/types'

const polar = (deg: number, r = 1) => ({ x: r * Math.cos((deg * Math.PI) / 180), y: r * Math.sin((deg * Math.PI) / 180) })
const on = (id: string, deg: number): ScenePoint => ({ id, label: id, ...polar(deg) })
const pt = (id: string, x: number, y: number, label: string | undefined = id): ScenePoint => ({ id, x, y, label })
const O: ScenePoint = { id: 'O', x: 0, y: 0, label: 'O', dot: true }
const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
/** The foot of the perpendicular from P to the line AB. */
const foot = (P: { x: number; y: number }, A: { x: number; y: number }, B: { x: number; y: number }) => {
  const dx = B.x - A.x
  const dy = B.y - A.y
  const t = ((P.x - A.x) * dx + (P.y - A.y) * dy) / (dx * dx + dy * dy)
  return { x: A.x + t * dx, y: A.y + t * dy }
}

const g11 = { topicId: 'math-euclidean-geometry', grade: 11 } as const
const out: Question[] = []
export const circleProofScenes: Record<string, SceneSpec> = {}

// ======================================================= THE FOUR THEOREMS

out.push(
  {
    ...g11,
    id: 'cgp-11-theorem-perpendicular-chord',
    difficulty: 'Moderate',
    cognitiveLevel: 1,
    marks: 5,
    prompt: 'Prove the theorem that states that the line drawn from the centre of a circle perpendicular to a chord bisects the chord.',
    answer:
      'Given: circle with centre O, chord AB, and OM ⊥ AB with M on AB. RTP: AM = MB. Construction: join OA and OB. Proof: in △OMA and △OMB, OA = OB [radii]; OM = OM [common]; OM̂A = OM̂B = 90° [given]. So △OMA ≡ △OMB [RHS], and therefore AM = MB.',
    explanation: 'The construction creates two right-angled triangles that share a side and have equal hypotenuses (radii); RHS congruence gives the equal halves of the chord.',
    memo: [
      { code: 'A', marks: 1, text: 'construction: join OA and OB' },
      { code: 'R', marks: 1, text: 'OA = OB [radii]' },
      { code: 'R', marks: 1, text: 'OM common; OM̂A = OM̂B = 90° [given]' },
      { code: 'R', marks: 1, text: '△OMA ≡ △OMB [RHS]' },
      { code: 'A', marks: 1, text: 'AM = MB' },
    ],
  },
  {
    ...g11,
    id: 'cgp-11-theorem-centre-angle',
    difficulty: 'Challenge',
    cognitiveLevel: 1,
    marks: 5,
    prompt: 'Prove the theorem that states that the angle subtended by an arc at the centre of a circle is twice the angle subtended by the same arc at any point on the circumference.',
    answer:
      'Given: circle with centre O; arc AB subtends AÔB at the centre and AĈB at C on the circumference. RTP: AÔB = 2AĈB. Construction: draw CO and produce it to D. Proof: OA = OC [radii], so OÂC = OĈA [∠s opp equal sides]. AÔD = OÂC + OĈA [ext ∠ of △] = 2OĈA. Similarly, in △BOC, BÔD = 2OĈB. So AÔB = AÔD + BÔD = 2(OĈA + OĈB) = 2AĈB.',
    explanation: 'The diameter through C splits the figure into two isosceles triangles, and the exterior angle of each is twice one base angle.',
    memo: [
      { code: 'A', marks: 1, text: 'construction: CO produced to D' },
      { code: 'R', marks: 1, text: 'OÂC = OĈA [∠s opp equal sides / radii]' },
      { code: 'R', marks: 1, text: 'AÔD = 2OĈA [ext ∠ of △]' },
      { code: 'A', marks: 1, text: 'BÔD = 2OĈB similarly' },
      { code: 'A', marks: 1, text: 'adding: AÔB = 2AĈB' },
    ],
  },
  {
    ...g11,
    id: 'cgp-11-theorem-cyclic-quad',
    difficulty: 'Challenge',
    cognitiveLevel: 1,
    marks: 5,
    prompt: 'Prove the theorem that states that the opposite angles of a cyclic quadrilateral are supplementary.',
    answer:
      'Given: cyclic quadrilateral ABCD in a circle with centre O. RTP: Â + Ĉ = 180°. Construction: join OB and OD. Proof: let the angle BÔD on the side of A be Ô₁ and the angle BÔD on the side of C be Ô₂. Ô₁ = 2Ĉ and Ô₂ = 2Â [∠ at centre = 2 × ∠ at circumference]. Ô₁ + Ô₂ = 360° [∠s around a point], so 2Â + 2Ĉ = 360° and Â + Ĉ = 180°.',
    explanation: 'Both angles of the quadrilateral are halves of the two angles at the centre on the same chord BD, which together make a full revolution.',
    memo: [
      { code: 'A', marks: 1, text: 'construction: OB and OD' },
      { code: 'R', marks: 1, text: 'Ô₁ = 2Ĉ [∠ at centre = 2 × ∠ at circ]' },
      { code: 'A', marks: 1, text: 'Ô₂ = 2Â' },
      { code: 'R', marks: 1, text: 'Ô₁ + Ô₂ = 360° [∠s around a point]' },
      { code: 'A', marks: 1, text: 'Â + Ĉ = 180°' },
    ],
  },
  {
    ...g11,
    id: 'cgp-11-theorem-tangent-chord',
    difficulty: 'Challenge',
    cognitiveLevel: 1,
    marks: 6,
    prompt: 'Prove the theorem that states that the angle between a tangent to a circle and a chord drawn from the point of contact is equal to the angle in the alternate segment.',
    answer:
      'Given: PT is a tangent at T, TQ is a chord, and R is on the circle in the alternate segment. RTP: QT̂P = TR̂Q. Construction: draw the diameter TS through the centre O and join SQ. Proof: ST̂P = 90° [tan ⊥ radius], so QT̂P = 90° − ST̂Q. TQ̂S = 90° [∠ in semicircle], so TŜQ = 90° − ST̂Q [sum of ∠s in △]. Therefore QT̂P = TŜQ. TŜQ = TR̂Q [∠s in the same segment]. So QT̂P = TR̂Q.',
    explanation: 'The diameter through the point of contact links the tangent (at 90° to it) and the angle in a semicircle; the angles in the same segment then carry the result to R.',
    memo: [
      { code: 'A', marks: 1, text: 'construction: diameter TS, join SQ' },
      { code: 'R', marks: 1, text: 'ST̂P = 90° [tan ⊥ radius]' },
      { code: 'R', marks: 1, text: 'TQ̂S = 90° [∠ in semicircle]' },
      { code: 'A', marks: 1, text: 'QT̂P = TŜQ' },
      { code: 'R', marks: 1, text: 'TŜQ = TR̂Q [∠s in same segment]' },
      { code: 'A', marks: 1, text: 'QT̂P = TR̂Q' },
    ],
  },
)

// ================================================================= RIDERS

// --- A diameter, a chord and the midpoint theorem
{
  const B = polar(0)
  const C = polar(110)
  const D = mid(B, C)
  const id = 'cgp-11-rider-midpoint-parallel'
  circleProofScenes[id] = {
    title: 'Circle with centre O, diameter AB, and OD ⊥ BC',
    points: [O, on('A', 180), on('B', 0), on('C', 110), pt('D', D.x, D.y)],
    circles: [{ c: 'O', r: 1 }],
    segments: [{ a: 'A', b: 'B' }, { a: 'B', b: 'C' }, { a: 'A', b: 'C' }, { a: 'O', b: 'D' }],
    angles: [{ at: 'D', a: 'O', b: 'B', right: true }],
    toScale: true,
  }
  out.push({
    ...g11,
    id,
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: 'O is the centre of the circle. AB is a diameter and C is a point on the circle. D lies on the chord BC, and OD ⊥ BC.',
    prompt: 'Prove that OD ∥ AC.',
    answer: 'BD = DC [line from centre ⊥ chord]. BO = OA [radii]. So in △BAC, D and O are the midpoints of BC and BA, and OD ∥ AC [midpoint theorem].',
    explanation: 'Two midpoints in the same triangle: the midpoint theorem gives the parallel line. (Alternatively: AĈB = 90° [∠ in semicircle] = OD̂B, corresponding angles.)',
    memo: [
      { code: 'R', marks: 1, text: 'BD = DC [line from centre ⊥ chord]' },
      { code: 'R', marks: 1, text: 'BO = OA [radii]' },
      { code: 'A', marks: 1, text: 'D and O are midpoints of BC and BA' },
      { code: 'R', marks: 1, text: 'OD ∥ AC [midpoint theorem]' },
    ],
  })
}

// --- Equal chords subtend equal angles
{
  const id = 'cgp-11-rider-equal-chords-bisect'
  circleProofScenes[id] = {
    title: 'Cyclic quadrilateral ABCD with AB = BC',
    points: [on('A', 200), on('B', 290), on('C', 20), on('D', 110)],
    segments: [
      { a: 'A', b: 'B', ticks: 1 },
      { a: 'B', b: 'C', ticks: 1 },
      { a: 'C', b: 'D' },
      { a: 'D', b: 'A' },
      { a: 'D', b: 'B', dashed: true },
    ],
    curves: [{ points: Array.from({ length: 73 }, (_, i) => [Math.cos((i * 5 * Math.PI) / 180), Math.sin((i * 5 * Math.PI) / 180)] as [number, number]) }],
    toScale: true,
  }
  out.push({
    ...g11,
    id,
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    context: 'ABCD is a cyclic quadrilateral in which AB = BC. The diagonal DB is drawn.',
    prompt: 'Prove that DB bisects AD̂C.',
    answer: 'AB = BC [given], so AD̂B = BD̂C [equal chords subtend equal ∠s]. Therefore DB bisects AD̂C.',
    explanation: 'Chords AB and BC are equal, so the angles they subtend at D on the circumference are equal; those two angles make up AD̂C.',
    memo: [
      { code: 'A', marks: 1, text: 'AD̂B = BD̂C' },
      { code: 'R', marks: 2, text: '[equal chords subtend equal ∠s]' },
    ],
  })
}

// --- Tangent-chord with a parallel chord: an isosceles triangle
{
  const A = polar(270)
  const id = 'cgp-11-rider-tangent-parallel-isosceles'
  circleProofScenes[id] = {
    title: 'TA is a tangent at A, and the chord BC is parallel to TA',
    points: [O, on('A', 270), on('B', 30), on('C', 150), pt('T', -1.7, A.y), pt('X', 1.5, A.y, undefined)],
    circles: [{ c: 'O', r: 1 }],
    segments: [
      { a: 'T', b: 'X', arrows: 1 },
      { a: 'C', b: 'B', arrows: 1 },
      { a: 'A', b: 'B' },
      { a: 'A', b: 'C' },
    ],
    toScale: true,
  }
  out.push({
    ...g11,
    id,
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context: 'O is the centre of the circle. TA is a tangent to the circle at A. B and C lie on the circle, and the chord CB is parallel to TA.',
    prompt: 'Prove that AB = AC.',
    answer: 'Let the tangent continue past A to X, on the side of B. XÂB = AĈB [tan-chord theorem]. XÂB = AB̂C [alt ∠s, TX ∥ CB]. So AĈB = AB̂C, and AB = AC [sides opp equal ∠s].',
    explanation: 'The tangent-chord theorem moves the angle at the tangent into the triangle at C; the parallel lines move it to B. Two equal base angles make the triangle isosceles.',
    memo: [
      { code: 'R', marks: 1, text: 'XÂB = AĈB [tan-chord theorem]' },
      { code: 'R', marks: 1, text: 'XÂB = AB̂C [alt ∠s, TA ∥ CB]' },
      { code: 'A', marks: 1, text: 'AĈB = AB̂C' },
      { code: 'R', marks: 2, text: 'AB = AC [sides opp equal ∠s]' },
    ],
  })
}

// --- Two altitudes: a cyclic quadrilateral by the converse
{
  const A = { x: 1.2, y: 3.4 }
  const B = { x: 0, y: 0 }
  const C = { x: 4.4, y: 0 }
  const D = foot(B, A, C)
  const E = foot(C, A, B)
  const id = 'cgp-11-rider-altitudes-cyclic'
  circleProofScenes[id] = {
    title: 'Triangle ABC with BD ⊥ AC and CE ⊥ AB',
    points: [pt('A', A.x, A.y), pt('B', B.x, B.y), pt('C', C.x, C.y), pt('D', D.x, D.y), pt('E', E.x, E.y)],
    segments: [{ a: 'A', b: 'B' }, { a: 'B', b: 'C' }, { a: 'C', b: 'A' }, { a: 'B', b: 'D' }, { a: 'C', b: 'E' }, { a: 'D', b: 'E', dashed: true }],
    angles: [
      { at: 'D', a: 'B', b: 'C', right: true },
      { at: 'E', a: 'C', b: 'B', right: true },
    ],
    toScale: true,
  }
  out.push({
    ...g11,
    id,
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    context: 'In △ABC, D lies on AC and E lies on AB, with BD ⊥ AC and CE ⊥ AB.',
    prompt: 'Prove that BCDE is a cyclic quadrilateral, and hence prove that AD̂E = AB̂C.',
    answer: 'BÊC = BD̂C = 90° [given], so BC subtends equal angles at E and D, on the same side of BC: BCDE is a cyclic quadrilateral [converse: line subtends equal ∠s]. Then AD̂E = EB̂C = AB̂C [ext ∠ of cyclic quad].',
    explanation: 'Equal angles subtended by one segment at two points on the same side of it put both points on one circle. Once BCDE is cyclic, its exterior angle at D equals the interior opposite angle at B.',
    memo: [
      { code: 'A', marks: 1, text: 'BÊC = BD̂C = 90°' },
      { code: 'R', marks: 1, text: '[converse: line subtends equal ∠s]' },
      { code: 'A', marks: 1, text: 'AD̂E = AB̂C' },
      { code: 'R', marks: 1, text: '[ext ∠ of cyclic quad]' },
    ],
  })
}

// --- Tangents from an external point
{
  const d = 2.2
  const half = (Math.acos(1 / d) * 180) / Math.PI
  const A = polar(270 - half)
  const B = polar(270 + half)
  const id = 'cgp-11-rider-tangents-congruent'
  circleProofScenes[id] = {
    title: 'Tangents PA and PB from the point P',
    points: [O, pt('A', A.x, A.y), pt('B', B.x, B.y), pt('P', 0, -d)],
    circles: [{ c: 'O', r: 1 }],
    segments: [{ a: 'P', b: 'A' }, { a: 'P', b: 'B' }, { a: 'O', b: 'A' }, { a: 'O', b: 'B' }, { a: 'O', b: 'P', dashed: true }],
    angles: [
      { at: 'A', a: 'O', b: 'P', right: true },
      { at: 'B', a: 'O', b: 'P', right: true },
    ],
    toScale: true,
  }
  out.push({
    ...g11,
    id,
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: 'PA and PB are each a tangent to the circle with centre O, touching it at A and B. OP is drawn.',
    prompt: 'Prove that △OAP ≡ △OBP, and hence that OP bisects AP̂B.',
    answer: 'In △OAP and △OBP: OA = OB [radii]; OÂP = OB̂P = 90° [tan ⊥ radius]; OP = OP [common]. So △OAP ≡ △OBP [RHS]. Hence AP̂O = BP̂O, so OP bisects AP̂B.',
    explanation: 'The radius to a point of contact is perpendicular to the tangent, which gives two right-angled triangles with a common hypotenuse.',
    memo: [
      { code: 'R', marks: 1, text: 'OA = OB [radii]' },
      { code: 'R', marks: 1, text: 'OÂP = OB̂P = 90° [tan ⊥ radius]' },
      { code: 'A', marks: 1, text: 'OP common' },
      { code: 'R', marks: 1, text: '≡ [RHS]' },
      { code: 'A', marks: 1, text: 'AP̂O = BP̂O' },
    ],
  })
}

// --- Angle in a semicircle and a line from the centre
{
  const A = polar(180)
  const C = polar(60)
  const D = mid(A, C)
  const id = 'cgp-11-rider-semicircle-midpoint'
  circleProofScenes[id] = {
    title: 'Circle with centre O, diameter AB, and OD ∥ BC',
    points: [O, on('A', 180), on('B', 0), on('C', 60), pt('D', D.x, D.y)],
    circles: [{ c: 'O', r: 1 }],
    segments: [
      { a: 'A', b: 'B' },
      { a: 'A', b: 'C' },
      { a: 'C', b: 'B', arrows: 1 },
      { a: 'D', b: 'O', arrows: 1 },
    ],
    toScale: true,
  }
  out.push({
    ...g11,
    id,
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: 'O is the centre of the circle and AB is a diameter. C lies on the circle. D lies on AC, and OD ∥ BC.',
    prompt: 'Prove that D is the midpoint of AC.',
    answer: 'AĈB = 90° [∠ in semicircle]. AD̂O = AĈB = 90° [corresp ∠s, OD ∥ BC]. So OD ⊥ AC, and AD = DC [line from centre ⊥ chord]: D is the midpoint of AC.',
    explanation: 'The angle in the semicircle and the parallel lines show that OD is perpendicular to the chord AC; a perpendicular from the centre bisects a chord. (The midpoint theorem converse also works: O is the midpoint of AB and OD ∥ BC.)',
    memo: [
      { code: 'R', marks: 1, text: 'AĈB = 90° [∠ in semicircle]' },
      { code: 'R', marks: 1, text: 'AD̂O = 90° [corresp ∠s, OD ∥ BC]' },
      { code: 'R', marks: 1, text: '[line from centre ⊥ chord]' },
      { code: 'A', marks: 1, text: 'AD = DC' },
    ],
  })
}

export const circleProofs: Question[] = out
