/**
 * Grade 12 similarity and the proportion theorem.
 *
 * WHY THIS FILE EXISTS. Grade 12 Euclidean geometry in CAPS is three things:
 * the proportion theorem and its converse, similar triangles, and the proof of
 * the theorem of Pythagoras by similarity. The bank had ninety-three Grade 12
 * Euclidean questions and not one of them was about any of the three -- the
 * whole grade's content was circle geometry and proof-writing carried over from
 * Grade 11. A per-grade sweep of the sub-topics is what surfaced it: "Congruency
 * and similarity" held nine questions at Grade 10 and none at Grade 12, where
 * similarity is actually examined.
 *
 * WHAT CAPS ASKS FOR, AND WHAT IT DOES NOT. Grade 12 proves the proportion
 * theorem and uses it; proves that equiangular triangles are similar and that
 * triangles with sides in proportion are similar; and proves Pythagoras by
 * similarity. It does not ask for congruency, which is Grade 10 -- so nothing
 * here asks a learner to prove two triangles congruent.
 *
 * THE THING THAT LOSES MARKS, and which the explanations keep returning to, is
 * CORRESPONDENCE. A similarity statement is not a list of two triangles: the
 * order of the letters says which vertex matches which, and every ratio written
 * afterwards has to follow that order. Writing the right triangles in the wrong
 * order turns a correct proof into a wrong one.
 *
 * WHY THE NUMBERS ARE COMPUTED. As with the perimeter and analytical geometry
 * sets, every length and area below is worked out from the ratios declared
 * once, so a question and its answer cannot drift apart.
 */
import type { Question } from '@/types'

/** A number as this corpus writes it: a decimal point, and no trailing zeros. */
const n = (v: number): string => {
  const r = Math.round(v * 100) / 100
  return String(r).replace('-', '−')
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

/**
 * A ratio in its simplest form, as a fraction.
 *
 * Geometry ratios have to stay exact. 4/6 shown as 0,67 is a rounded decimal a
 * marker cannot accept in a proof, and it also hides the very thing the question
 * turns on -- that 4/6 and 6/9 are the SAME ratio, which is obvious as 2/3 and
 * invisible as 0,67.
 */
const frac = (a: number, b: number): string => {
  const g = gcd(a, b)
  return b / g === 1 ? n(a / g) : `${n(a / g)}/${n(b / g)}`
}

/** The same thing written with a colon, which is how a ratio of areas is asked for. */
const colon = (a: number, b: number): string => {
  const g = gcd(a, b)
  return `${n(a / g)} : ${n(b / g)}`
}

const out: Question[] = []
const base = { topicId: 'math-euclidean-geometry', grade: 12 } as const

/* ===================================================================== */
/* The proportion theorem                                                */
/* ===================================================================== */

{
  const ad = 8
  const db = 6
  const ae = 12
  const ec = (ae * db) / ad
  out.push({
    ...base,
    id: 'sim-g12-prop-basic',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `In triangle ABC, D lies on AB and E lies on AC with DE parallel to BC. AD = ${n(ad)}, DB = ${n(db)} and AE = ${n(ae)}. Calculate the length of EC.`,
    answer: `DE ∥ BC, so by the proportion theorem AD/DB = AE/EC. Then ${n(ad)}/${n(db)} = ${n(ae)}/EC, so EC = (${n(ae)} × ${n(db)}) ÷ ${n(ad)} = ${n(ec)}.`,
    explanation:
      'The proportion theorem says a line parallel to one side of a triangle divides the other two sides in the same ratio. The ratio can be written two ways and both are correct — AD/DB = AE/EC using the two pieces of each side, or AD/AB = AE/AC using a piece over the whole side — but they must not be mixed. Pairing AD/DB with AE/AC is the usual error, and it gives a wrong answer that still looks like a proportion. The reason "DE ∥ BC" has to be written down: without the parallel line there is no theorem.',
    memo: [
      { code: 'S', marks: 1, text: 'DE ∥ BC quoted as the reason' },
      { code: 'M', marks: 1, text: `AD/DB = AE/EC` },
      { code: 'M', marks: 1, text: `${n(ad)}/${n(db)} = ${n(ae)}/EC` },
      { code: 'A', marks: 1, text: `EC = ${n(ec)}` },
    ],
  })
}

{
  const ad = 5
  const ab = 20
  const ae = 6
  const ac = (ae * ab) / ad
  out.push({
    ...base,
    id: 'sim-g12-prop-whole-side',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `In triangle PQR, S lies on PQ and T lies on PR with ST parallel to QR. PS = ${n(ad)}, PQ = ${n(ab)} and PT = ${n(ae)}. Calculate the length of PR.`,
    answer: `ST ∥ QR, so PS/PQ = PT/PR. Then ${n(ad)}/${n(ab)} = ${n(ae)}/PR, so PR = (${n(ae)} × ${n(ab)}) ÷ ${n(ad)} = ${n(ac)}.`,
    explanation: `This one gives a WHOLE side rather than the second piece, so the whole-side form of the theorem is the one to use: PS/PQ = PT/PR. Reading PQ = ${n(ab)} as the second piece and writing ${n(ad)}/${n(ab)} = ${n(ae)}/TR gives TR = ${n((ae * ab) / ad)} and a total PR of ${n((ae * ab) / ad + ae)}, which is wrong. Deciding which form to use before substituting anything — piece over piece, or piece over whole, on BOTH sides — is what this question is testing.`,
    memo: [
      { code: 'S', marks: 1, text: 'ST ∥ QR quoted as the reason' },
      { code: 'M', marks: 1, text: 'PS/PQ = PT/PR, the whole-side form' },
      { code: 'M', marks: 1, text: `${n(ad)}/${n(ab)} = ${n(ae)}/PR` },
      { code: 'A', marks: 1, text: `PR = ${n(ac)}` },
    ],
  })
}

{
  const ps = 4
  const sq = 6
  const pt = 6
  const tr = 9
  out.push({
    ...base,
    id: 'sim-g12-prop-converse',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `In triangle PQR, S lies on PQ and T lies on PR. PS = ${n(ps)}, SQ = ${n(sq)}, PT = ${n(pt)} and TR = ${n(tr)}. Prove that ST is parallel to QR.`,
    answer: `PS/SQ = ${n(ps)}/${n(sq)} = ${frac(ps, sq)} and PT/TR = ${n(pt)}/${n(tr)} = ${frac(pt, tr)}. The two ratios are equal, so S and T divide PQ and PR in the same ratio. By the CONVERSE of the proportion theorem, ST ∥ QR.`,
    explanation:
      'This is the theorem run backwards, and the naming matters in the answer: the proportion theorem starts from a parallel line and concludes a ratio, while its converse starts from the ratio and concludes the parallel line. Quoting the wrong one is assuming what you were asked to prove, and markers take the mark for it. Both ratios have to be reduced to the same form before they can be compared — 4/6 and 6/9 do not look equal until both are written as 2/3.',
    memo: [
      { code: 'M', marks: 1, text: `PS/SQ = ${frac(ps, sq)}` },
      { code: 'M', marks: 1, text: `PT/TR = ${frac(pt, tr)}` },
      { code: 'S', marks: 1, text: 'The two ratios stated to be equal' },
      { code: 'S', marks: 1, text: 'Converse of the proportion theorem quoted, therefore ST ∥ QR' },
    ],
  })
}

{
  // x/(x + 2) = 6/9, so 9x = 6x + 12 and x = 4.
  const ae = 6
  const ec = 9
  const offset = 2
  const x = (offset * ae) / (ec - ae)
  out.push({
    ...base,
    id: 'sim-g12-prop-algebraic',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `In triangle ABC, D lies on AB and E lies on AC with DE parallel to BC. AD = x, DB = x + ${n(offset)}, AE = ${n(ae)} and EC = ${n(ec)}. Calculate the value of x.`,
    answer: `DE ∥ BC, so AD/DB = AE/EC, giving x/(x + ${n(offset)}) = ${n(ae)}/${n(ec)} = ${frac(ae, ec)}. Cross-multiplying: ${n(ec)}x = ${n(ae)}(x + ${n(offset)}), so ${n(ec)}x = ${n(ae)}x + ${n(ae * offset)} and ${n(ec - ae)}x = ${n(ae * offset)}. Therefore x = ${n(x)}. (Check: AD = ${n(x)} and DB = ${n(x + offset)}, and ${n(x)}/${n(x + offset)} = ${frac(x, x + offset)} = ${frac(ae, ec)}.)`,
    explanation:
      'The geometry ends at the first line; everything after it is solving a linear equation. Reducing 6/9 to 2/3 before cross-multiplying keeps the numbers small and is worth doing. The check at the end costs one line and catches a sign error or a slip in the cross-multiplication, which is the whole reason to write the two lengths back out and compare the ratio.',
    memo: [
      { code: 'S', marks: 1, text: 'DE ∥ BC quoted' },
      { code: 'M', marks: 1, text: `x/(x + ${n(offset)}) = ${n(ae)}/${n(ec)}` },
      { code: 'M', marks: 1, text: 'Cross-multiplied' },
      { code: 'M', marks: 1, text: `${n(ec - ae)}x = ${n(ae * offset)}` },
      { code: 'A', marks: 1, text: `x = ${n(x)}` },
    ],
  })
}

/* ===================================================================== */
/* Similar triangles                                                     */
/* ===================================================================== */

out.push({
  ...base,
  id: 'sim-g12-equiangular',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  prompt:
    'In triangles ABC and DEF it is given that Â = D̂ and B̂ = Ê. Explain why the two triangles are similar, and write down the similarity statement and the resulting ratio of sides.',
  answer:
    'Â = D̂ and B̂ = Ê are given. The angles of a triangle add to 180°, so Ĉ = F̂ as well, and the triangles are equiangular. Equiangular triangles are similar, so triangle ABC ||| triangle DEF. The corresponding sides are therefore in proportion: AB/DE = BC/EF = AC/DF.',
  explanation:
    'Two pairs of equal angles are enough, because the third pair follows from the angle sum — which is why the theorem is quoted as AAA but only ever needs two angles shown. The real work is the ORDER of the letters. Writing ABC ||| DEF says A matches D, B matches E and C matches F, and every ratio afterwards must keep that pairing. Writing ABC ||| EDF would be a different claim about which vertices correspond, and the ratios that follow from it would be wrong even though the triangles really are similar.',
  memo: [
    { code: 'S', marks: 1, text: 'Third angles equal, by the angle sum of a triangle' },
    { code: 'S', marks: 1, text: 'Equiangular triangles are similar quoted as the reason' },
    { code: 'A', marks: 1, text: 'ABC ||| DEF, in the correct order' },
    { code: 'A', marks: 1, text: 'AB/DE = BC/EF = AC/DF' },
  ],
})

{
  const ab = 6
  const bc = 9
  const pq = 8
  const qr = (bc * pq) / ab
  out.push({
    ...base,
    id: 'sim-g12-find-side',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `Triangle ABC ||| triangle PQR. AB = ${n(ab)}, BC = ${n(bc)} and PQ = ${n(pq)}. Calculate the length of QR.`,
    answer: `The similarity statement pairs A with P, B with Q and C with R, so AB/PQ = BC/QR. Then ${n(ab)}/${n(pq)} = ${n(bc)}/QR, so QR = (${n(bc)} × ${n(pq)}) ÷ ${n(ab)} = ${n(qr)}.`,
    explanation: `Read the correspondence off the similarity statement before writing a single ratio: ABC ||| PQR means AB pairs with PQ and BC with QR, so those are the two ratios that may be set equal. The scale factor here is ${n(pq)}/${n(ab)} = ${n(pq / ab)}, and every side of PQR is that many times the matching side of ABC — a useful check, since ${n(bc)} × ${n(pq / ab)} = ${n(qr)}.`,
    memo: [
      { code: 'M', marks: 1, text: 'Correspondence read off the similarity statement' },
      { code: 'M', marks: 1, text: 'AB/PQ = BC/QR' },
      { code: 'M', marks: 1, text: `${n(ab)}/${n(pq)} = ${n(bc)}/QR` },
      { code: 'A', marks: 1, text: `QR = ${n(qr)}` },
    ],
  })
}

{
  const ad = 4
  const ab = 10
  const de = 6
  const bc = (de * ab) / ad
  out.push({
    ...base,
    id: 'sim-g12-parallel-similar',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    prompt: `In triangle ABC, D lies on AB and E lies on AC with DE parallel to BC. AD = ${n(ad)}, AB = ${n(ab)} and DE = ${n(de)}. Prove that triangle ADE is similar to triangle ABC, and hence calculate the length of BC.`,
    answer: `Â is common to both triangles. DE ∥ BC, so AD̂E = AB̂C and AÊD = AĈB (corresponding angles). The triangles are equiangular, so triangle ADE ||| triangle ABC. Corresponding sides are then in proportion: AD/AB = DE/BC, so ${n(ad)}/${n(ab)} = ${n(de)}/BC and BC = (${n(de)} × ${n(ab)}) ÷ ${n(ad)} = ${n(bc)}.`,
    explanation: `A line parallel to one side cuts off a triangle similar to the whole one, and this is the proof of it: the angle at A is shared, and the parallel line makes the other two pairs of angles corresponding angles. Naming the shared angle first is worth a mark on its own and learners routinely skip it. Note that AD and AB are BOTH measured from A — mixing AD/DB with DE/BC is the trap, because DB is not a side of either triangle in the similarity statement. The scale factor is ${n(ab)}/${n(ad)} = ${n(ab / ad)}, so BC is ${n(ab / ad)} times DE.`,
    memo: [
      { code: 'S', marks: 1, text: 'Â common to both triangles' },
      { code: 'S', marks: 1, text: 'Two pairs of corresponding angles equal, DE ∥ BC quoted' },
      { code: 'S', marks: 1, text: 'Equiangular, therefore ADE ||| ABC' },
      { code: 'M', marks: 1, text: 'AD/AB = DE/BC' },
      { code: 'M', marks: 1, text: `${n(ad)}/${n(ab)} = ${n(de)}/BC` },
      { code: 'A', marks: 1, text: `BC = ${n(bc)}` },
    ],
  })
}

{
  const a = 6
  const b = 8
  const c = 10
  const k = 1.5
  out.push({
    ...base,
    id: 'sim-g12-sss-similar',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Triangle ABC has sides AB = ${n(a)}, BC = ${n(b)} and AC = ${n(c)}. Triangle PQR has sides PQ = ${n(a * k)}, QR = ${n(b * k)} and PR = ${n(c * k)}. Prove that the two triangles are similar.`,
    answer: `AB/PQ = ${n(a)}/${n(a * k)} = ${frac(a, a * k)}, BC/QR = ${n(b)}/${n(b * k)} = ${frac(b, b * k)} and AC/PR = ${n(c)}/${n(c * k)} = ${frac(c, c * k)}. All three pairs of corresponding sides are in the same ratio, ${colon(a, a * k)}, so triangle ABC ||| triangle PQR (sides in proportion).`,
    explanation:
      'This is the other route to similarity: three pairs of sides in the same ratio, with no angles needed. All three ratios must be worked out and all three must be shown equal — two out of three proves nothing, because a third side of the wrong length would make a different triangle. The sides have to be paired by correspondence, not by size order, although here they happen to agree.',
    memo: [
      { code: 'M', marks: 1, text: 'All three ratios of corresponding sides worked out' },
      { code: 'A', marks: 1, text: `Each equal to ${frac(a, a * k)}` },
      { code: 'S', marks: 1, text: 'Sides in proportion quoted as the reason' },
      { code: 'A', marks: 1, text: 'Therefore ABC ||| PQR' },
    ],
  })
}

/* ===================================================================== */
/* Areas of similar triangles                                            */
/* ===================================================================== */

{
  const small = 3
  const big = 5
  const areaSmall = 45
  const areaBig = (areaSmall * big ** 2) / small ** 2
  out.push({
    ...base,
    id: 'sim-g12-area-ratio',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `Triangle ABC ||| triangle PQR, and their corresponding sides are in the ratio ${n(small)} : ${n(big)}. The area of triangle ABC is ${n(areaSmall)} square units. Calculate the area of triangle PQR, and explain why the answer is not ${n((areaSmall * big) / small)} square units.`,
    answer: `For similar triangles the ratio of the areas is the SQUARE of the ratio of the sides: area ABC : area PQR = ${n(small)}² : ${n(big)}² = ${n(small ** 2)} : ${n(big ** 2)}. So ${n(areaSmall)}/area PQR = ${n(small ** 2)}/${n(big ** 2)}, giving area PQR = (${n(areaSmall)} × ${n(big ** 2)}) ÷ ${n(small ** 2)} = ${n(areaBig)} square units. It is not ${n((areaSmall * big) / small)} because area is not a length: enlarging a shape by a factor of ${n(big / small)} multiplies every length by ${n(big / small)} but multiplies the area by ${n(big / small)} × ${n(big / small)} = ${n((big / small) ** 2)}, since an area is a length times a length.`,
    explanation:
      'Scaling by the factor once rather than twice is the single commonest error in this part of the syllabus, and the reason worth holding on to is that an area is built from two lengths multiplied together, so both of them scale. The same idea decides volume, where three lengths multiply and the factor is cubed. A quick sense check: the sides here are not quite twice as long, and the area comes out not quite four times as large.',
    memo: [
      { code: 'S', marks: 1, text: 'Ratio of areas is the square of the ratio of sides' },
      { code: 'M', marks: 1, text: `${n(small ** 2)} : ${n(big ** 2)}` },
      { code: 'M', marks: 1, text: `${n(areaSmall)} × ${n(big ** 2)} ÷ ${n(small ** 2)}` },
      { code: 'A', marks: 1, text: `${n(areaBig)} square units` },
      { code: 'J', marks: 1, text: 'An area is a length times a length, so the factor applies twice' },
    ],
  })
}

{
  const areaSmall = 32
  const areaBig = 50
  const ratio = Math.sqrt(areaBig / areaSmall)
  out.push({
    ...base,
    id: 'sim-g12-area-backwards',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `Two similar triangles have areas of ${n(areaSmall)} and ${n(areaBig)} square units. Calculate the ratio of their corresponding sides.`,
    answer: `The ratio of the areas is ${n(areaSmall)} : ${n(areaBig)} = ${n(areaSmall / 2)} : ${n(areaBig / 2)} = 16 : 25. The ratio of the areas is the square of the ratio of the sides, so the ratio of the sides is √16 : √25 = 4 : 5. (As a scale factor, ${n(ratio)}.)`,
    explanation:
      'Run the rule backwards and it becomes a square root rather than a square. Simplifying the ratio of the areas first is what makes the roots come out whole: 32 : 50 does not obviously square-root, but 16 : 25 does at sight. The check is to square the answer — 4² : 5² is 16 : 25, which is the simplified area ratio.',
    memo: [
      { code: 'M', marks: 1, text: 'Area ratio simplified to 16 : 25' },
      { code: 'S', marks: 1, text: 'Ratio of sides is the square root of the ratio of areas' },
      { code: 'M', marks: 1, text: '√16 : √25' },
      { code: 'A', marks: 1, text: '4 : 5' },
    ],
  })
}

/* ===================================================================== */
/* The proofs CAPS names                                                 */
/* ===================================================================== */

out.push({
  ...base,
  id: 'sim-g12-prove-proportion',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 6,
  prompt:
    'In triangle ABC, D lies on AB and E lies on AC with DE parallel to BC. Prove the proportion theorem for this triangle: that AD/DB = AE/EC. (Construct BE and CD, and use areas.)',
  answer:
    'Construct BE, CD and the perpendicular heights from E to AB and from D to AC. Triangles ADE and DBE share the same height from E to the line AB, and areas of triangles with the same height are in the ratio of their bases, so area ADE / area DBE = AD/DB. In the same way, triangles ADE and ECD share the height from D to the line AC, so area ADE / area ECD = AE/EC. Now DE ∥ BC, so triangles DBE and ECD stand on the same base DE and lie between the same parallel lines DE and BC, which means they have equal heights and therefore equal areas. Since area DBE = area ECD, the two ratios above have the same denominator as well as the same numerator, so AD/DB = AE/EC.',
  explanation:
    'This is one of the theorems CAPS asks Grade 12 to PROVE rather than merely use, so the construction and the reasons carry the marks. Three facts do all the work and each must be named: triangles with the same height have areas in the ratio of their bases; triangles on the same base and between the same parallel lines have equal areas; and it is the parallel line that supplies the second of those. A proof that states the result and verifies it with numbers earns nothing — numbers cannot prove a general theorem.',
  memo: [
    { code: 'M', marks: 1, text: 'BE and CD constructed and the heights identified' },
    { code: 'S', marks: 1, text: 'area ADE / area DBE = AD/DB, same height' },
    { code: 'S', marks: 1, text: 'area ADE / area ECD = AE/EC, same height' },
    { code: 'S', marks: 1, text: 'DBE and ECD on the same base DE, between the same parallels' },
    { code: 'S', marks: 1, text: 'Therefore area DBE = area ECD' },
    { code: 'S', marks: 1, text: 'Therefore AD/DB = AE/EC' },
  ],
})

out.push({
  ...base,
  id: 'sim-g12-prove-pythagoras',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 7,
  prompt:
    'Triangle ABC has a right angle at A, and AD is drawn perpendicular to BC with D on BC. Prove, using similar triangles, that BC² = AB² + AC².',
  answer:
    'In triangles DBA and ABC: B̂ is common, and BD̂A = BÂC = 90°, so the third angles are equal too and triangle DBA ||| triangle ABC. Therefore BD/AB = AB/BC, which gives AB² = BD × BC. In triangles DAC and ABC: Ĉ is common, and AD̂C = BÂC = 90°, so triangle DAC ||| triangle ABC. Therefore DC/AC = AC/BC, which gives AC² = DC × BC. Adding the two results: AB² + AC² = BD × BC + DC × BC = BC(BD + DC). But D lies on BC, so BD + DC = BC. Therefore AB² + AC² = BC × BC = BC².',
  explanation:
    'The altitude to the hypotenuse cuts the triangle into two triangles each similar to the original, and that single fact is the whole proof. The step that has to be watched is the ratio BD/AB = AB/BC: AB appears in both positions because it is the side corresponding to itself under the correspondence DBA ||| ABC, which is what produces a SQUARE rather than a product of two different sides. Writing the similarity statements with their vertices in matching order is therefore not a formality here — get the order wrong and the ratio does not give AB² at all. The last line matters too: BD + DC = BC only because D lies between B and C.',
  memo: [
    { code: 'S', marks: 1, text: 'DBA ||| ABC established, with reasons' },
    { code: 'M', marks: 1, text: 'BD/AB = AB/BC' },
    { code: 'A', marks: 1, text: 'AB² = BD × BC' },
    { code: 'S', marks: 1, text: 'DAC ||| ABC established, with reasons' },
    { code: 'A', marks: 1, text: 'AC² = DC × BC' },
    { code: 'M', marks: 1, text: 'Added and BC factored out' },
    { code: 'S', marks: 1, text: 'BD + DC = BC, therefore BC² = AB² + AC²' },
  ],
})

/* ===================================================================== */
/* Where the mid-point theorem fits                                      */
/* ===================================================================== */

out.push({
  ...base,
  id: 'sim-g12-midpoint-as-special-case',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 5,
  prompt:
    'A learner says the mid-point theorem learnt in Grade 10 and the proportion theorem learnt in Grade 12 are two unrelated results. Explain, using the proportion theorem, why the mid-point theorem is the special case of it in which the ratio is 1 : 1, and state the one extra thing the mid-point theorem claims that the proportion theorem does not.',
  answer:
    'The proportion theorem says that if DE ∥ BC then AD/DB = AE/EC. Take D to be the mid-point of AB, so AD = DB and the ratio AD/DB is 1. Then AE/EC = 1 as well, so AE = EC and E is the mid-point of AC. That is exactly what the mid-point theorem says about where the second point lands, so the mid-point theorem is the proportion theorem with the ratio 1 : 1. The extra claim is about LENGTH: the mid-point theorem also says DE = ½BC. The proportion theorem says nothing about the length of DE at all — it only divides the two sides. That extra part comes from similarity, because triangle ADE ||| triangle ABC with a scale factor of ½.',
  explanation:
    'Seeing one theorem as a special case of another is worth more than memorising both, and this particular pairing is the clearest example in the syllabus. The distinction the answer has to draw is between a statement about RATIOS along two sides, which is the proportion theorem, and a statement about the LENGTH of the segment joining them, which needs similarity. A learner who says the two theorems are identical has missed the half-of-BC part; a learner who says they are unrelated has missed that one contains the other.',
  memo: [
    { code: 'M', marks: 1, text: 'AD = DB gives the ratio AD/DB = 1' },
    { code: 'M', marks: 1, text: 'Therefore AE/EC = 1, so E is the mid-point of AC' },
    { code: 'J', marks: 1, text: 'The mid-point theorem is the proportion theorem at a ratio of 1 : 1' },
    { code: 'J', marks: 1, text: 'The extra claim is DE = ½BC' },
    { code: 'J', marks: 1, text: 'That length comes from similarity with a scale factor of ½, not from the proportion theorem' },
  ],
})

/** Everything above, in one list. Exported last so it cannot be read before it is filled. */
export const similarityG12: Question[] = out
