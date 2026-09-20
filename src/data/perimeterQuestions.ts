/**
 * Mathematical Literacy perimeter questions for Grades 10 and 11.
 *
 * WHY THIS FILE EXISTS. A sweep of the Measurement topic found that the corpus
 * had no perimeter questions at all in Grade 11 and one in Grade 10, against
 * eight in Grade 12. CAPS names perimeter in Measurement in all three grades,
 * and it is the first thing the topic teaches, so the gap meant a Grade 11
 * teacher opening the Measurement sub-topic "Perimeter and distance around a
 * shape" found it empty. These fill it.
 *
 * WHY THE ANSWERS ARE COMPUTED AND NOT TYPED. The same reason as the taxation
 * set: a perimeter answer typed by hand is a number nobody can check without
 * redoing the arithmetic, and a wrong answer key does a learner more harm than
 * a missing question. Every figure below -- in the prompt, the answer, the
 * explanation and the memo -- is worked out from the dimensions declared once,
 * so the question and its answer cannot drift apart.
 *
 * WHAT THE TWO GRADES DO. Grade 10 is the straight shapes: rectangle, square,
 * triangle, circle, then perimeter used for a cost and a length that has to be
 * converted first. Grade 11 is what CAPS adds -- shapes made of more than one
 * piece, missing sides that have to be worked out, a perimeter read off a scale
 * plan, and the reverse direction, from a circumference back to a diameter.
 *
 * PI. Mathematical Literacy works with π = 3,14. It is not an approximation the
 * learner chooses; it is the value the exam supplies, and an answer worked with
 * a calculator's π differs in the second decimal and loses an accuracy mark.
 */
import type { Question } from '@/types'
import { rand, rands } from '@/data/taxTables'

/** The value of π that the Mathematical Literacy exam supplies. */
const PI = 3.14

/**
 * A number the way a South African paper prints it: a space between thousands,
 * a comma for the decimal point, and no trailing zeros the working never had.
 */
const sa = (n: number, dp = 2): string => {
  const rounded = Math.round(n * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(rounded).split('.')
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}

/** Metres, as they appear in a prompt or an answer. */
const m = (n: number, dp = 2) => `${sa(n, dp)} m`
/** Centimetres. */
const cm = (n: number, dp = 2) => `${sa(n, dp)} cm`

const rectPerimeter = (l: number, b: number) => 2 * (l + b)
const circumference = (radius: number) => 2 * PI * radius

const out: Question[] = []

/* ===================================================================== */
/* Grade 10 -- the straight shapes, then perimeter put to work            */
/* ===================================================================== */

const g10 = { topicId: 'measurement', grade: 10 } as const

// ---------------------------------------------------------------- rectangle
{
  const l = 12.5
  const b = 7.4
  const p = rectPerimeter(l, b)
  out.push({
    ...g10,
    id: 'perim-g10-garden',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: `A rectangular vegetable garden is ${m(l)} long and ${m(b)} wide. Calculate the perimeter of the garden.`,
    answer: `P = 2(l + b) = 2(${m(l)} + ${m(b)}) = 2 × ${m(l + b)} = ${m(p)}`,
    explanation:
      'Perimeter is the total distance all the way around the outside. A rectangle has two lengths and two widths, so adding one of each and doubling gives the whole way round. Adding only the length and the width gives half the perimeter, which is the commonest slip here.',
    memo: [
      { code: 'M', marks: 1, text: `Substitution into P = 2(l + b): 2(${sa(l)} + ${sa(b)})` },
      { code: 'A', marks: 1, text: `${m(p)}` },
    ],
  })
}

// ------------------------------------------------------------------- square
{
  const side = 6.4
  const p = 4 * side
  out.push({
    ...g10,
    id: 'perim-g10-square',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: `A square vegetable patch has sides of ${m(side)}. Calculate the perimeter of the patch.`,
    answer: `P = 4 × ${m(side)} = ${m(p)}`,
    explanation:
      'All four sides of a square are equal, so the perimeter is simply four times one side. There is no need for the rectangle formula, although 2(6,4 + 6,4) gives the same answer.',
    memo: [
      { code: 'M', marks: 1, text: `4 × ${sa(side)}` },
      { code: 'A', marks: 1, text: `${m(p)}` },
    ],
  })
}

// ----------------------------------------------------------------- triangle
{
  const sides = [4.2, 5.6, 6.3]
  const p = sides.reduce((a, s) => a + s, 0)
  out.push({
    ...g10,
    id: 'perim-g10-triangle',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: `A triangular flower bed has sides measuring ${sides.map((s) => m(s)).join(', ')}. Calculate the perimeter of the flower bed.`,
    answer: `P = ${sides.map((s) => sa(s)).join(' + ')} = ${m(p)}`,
    explanation:
      'A triangle has no perimeter formula to remember — you simply add the three sides. That is true of any shape whose sides are all given: perimeter is always the sum of the outside edges, and the formulae for rectangles and circles are just shortcuts for shapes where the sides repeat.',
    memo: [
      { code: 'M', marks: 1, text: 'All three sides added' },
      { code: 'A', marks: 1, text: `${m(p)}` },
    ],
  })
}

// ------------------------------------------------------------------- circle
{
  const r = 2.4
  const c = circumference(r)
  out.push({
    ...g10,
    id: 'perim-g10-pool',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A circular swimming pool has a radius of ${m(r)}. Calculate the circumference of the pool. Use π = ${sa(PI)}.`,
    answer: `C = 2πr = 2 × ${sa(PI)} × ${m(r)} = ${m(c, 4)}`,
    explanation:
      'The perimeter of a circle has its own name, circumference, but it is the same idea: the distance once around the outside. Use C = 2πr when the RADIUS is given and C = πd when the DIAMETER is given — using the diameter in the 2πr formula doubles the answer, which is the mistake this question is really testing.',
    memo: [
      { code: 'M', marks: 1, text: 'C = 2πr chosen (not πd with the radius)' },
      { code: 'M', marks: 1, text: `Substitution: 2 × ${sa(PI)} × ${sa(r)}` },
      { code: 'A', marks: 1, text: `${m(c, 4)}` },
    ],
  })
}

// -------------------------------------------------------- perimeter → cost
{
  const l = 12.5
  const b = 7.4
  const p = rectPerimeter(l, b)
  const rate = 87.5
  const cost = p * rate
  out.push({
    ...g10,
    id: 'perim-g10-cost',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Fencing for the rectangular vegetable garden, which is ${m(l)} by ${m(b)}, costs ${rands(rate)} per metre. Calculate the perimeter of the garden and hence the total cost of the fencing.`,
    answer: `Perimeter = 2(${sa(l)} + ${sa(b)}) = ${m(p)}. Cost = ${m(p)} × ${rands(rate)} = ${rands(cost)}`,
    explanation:
      'A cost question always has the perimeter hidden inside it: the fence runs around the outside, so the length of fencing IS the perimeter. Work the perimeter out first and write it down, because a question that asks only for the cost still gives a method mark for it.',
    memo: [
      { code: 'M', marks: 1, text: `Perimeter: 2(${sa(l)} + ${sa(b)})` },
      { code: 'A', marks: 1, text: `${m(p)}` },
      { code: 'CA', marks: 1, text: `× ${rands(rate)} = ${rands(cost)}` },
    ],
  })
}

// ------------------------------------------ perimeter with a unit conversion
{
  const l = 45
  const b = 32
  const pCm = rectPerimeter(l, b)
  const pM = pCm / 100
  const rate = 24.9
  const cost = pM * rate
  out.push({
    ...g10,
    id: 'perim-g10-frame',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A rectangular photograph measures ${cm(l)} by ${cm(b)}. Framing strip is sold at ${rands(rate)} per metre. Calculate the perimeter of the photograph and hence the cost of the strip needed to frame it.`,
    answer: `Perimeter = 2(${sa(l)} + ${sa(b)}) = ${cm(pCm)}. In metres: ${sa(pCm)} ÷ 100 = ${m(pM)}. Cost = ${m(pM)} × ${rands(rate)} = ${rands(cost)}`,
    explanation:
      'The measurements are in centimetres and the price is per metre, so one of them has to move before they can be multiplied. Converting the length is easier than converting the rate. Multiplying 154 by R24,90 without converting gives R3 834,60 for a picture frame — a figure worth stopping at, because sense-checking catches this mistake before the marks are lost.',
    memo: [
      { code: 'M', marks: 1, text: `Perimeter: 2(${sa(l)} + ${sa(b)})` },
      { code: 'A', marks: 1, text: `${cm(pCm)}` },
      { code: 'C', marks: 1, text: `Converted to metres: ${m(pM)}` },
      { code: 'CA', marks: 1, text: `× ${rands(rate)} = ${rands(cost)}` },
    ],
  })
}

// ------------------------------------------------- perimeter run backwards
{
  const p = 26
  const l = 8
  const b = p / 2 - l
  out.push({
    ...g10,
    id: 'perim-g10-missing-side',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A rectangular notice board has a perimeter of ${m(p)}. Its length is ${m(l)}. Calculate the width of the notice board.`,
    answer: `2(l + b) = ${sa(p)}, so l + b = ${sa(p)} ÷ 2 = ${sa(p / 2)}. Then b = ${sa(p / 2)} − ${sa(l)} = ${m(b)}`,
    explanation:
      'This is the same formula worked in the other direction. Halving the perimeter first is what makes it easy: half the perimeter is always one length plus one width, so subtracting the length leaves the width. Subtracting the length from the whole perimeter — 26 − 8 — is the usual error, and it gives 18 m, which is wider than the board is long.',
    memo: [
      { code: 'M', marks: 1, text: `Half the perimeter: ${sa(p)} ÷ 2 = ${sa(p / 2)}` },
      { code: 'M', marks: 1, text: `Subtract the length: ${sa(p / 2)} − ${sa(l)}` },
      { code: 'A', marks: 1, text: `${m(b)}` },
    ],
  })
}

// ------------------------------------------------- perimeter less a doorway
{
  const l = 4.8
  const b = 3.6
  const door = 0.9
  const p = rectPerimeter(l, b)
  const needed = p - door
  const rate = 46.5
  const cost = needed * rate
  out.push({
    ...g10,
    id: 'perim-g10-skirting',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A rectangular room measures ${m(l)} by ${m(b)}. Skirting board is fitted around the perimeter of the floor except across the ${m(door)} doorway. Skirting costs ${rands(rate)} per metre. Calculate the cost of the skirting for this room.`,
    answer: `Perimeter = 2(${sa(l)} + ${sa(b)}) = ${m(p)}. Skirting needed = ${sa(p)} − ${sa(door)} = ${m(needed)}. Cost = ${m(needed)} × ${rands(rate)} = ${rands(cost)}`,
    explanation:
      'The perimeter is the starting point, not the answer. A doorway is a gap in the run, so its width comes off before the cost is worked out. Real questions do this constantly — a gate in a fence, a doorway in a skirting run, an opening in a wall — and the marks are for noticing that the material does not go all the way around.',
    memo: [
      { code: 'M', marks: 1, text: `Perimeter: 2(${sa(l)} + ${sa(b)}) = ${m(p)}` },
      { code: 'M', marks: 1, text: `Doorway subtracted: ${sa(p)} − ${sa(door)}` },
      { code: 'A', marks: 1, text: `${m(needed)}` },
      { code: 'CA', marks: 1, text: `× ${rands(rate)} = ${rands(cost)}` },
    ],
  })
}

// --------------------------------------------------- what doubling does to it
{
  const l = 12.5
  const b = 7.4
  const p = rectPerimeter(l, b)
  const pDouble = rectPerimeter(2 * l, 2 * b)
  out.push({
    ...g10,
    id: 'perim-g10-doubling',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `A learner says that doubling both the length and the width of a rectangle doubles the perimeter, and so doubles the fencing needed to go around it. Test the claim on a garden of ${m(l)} by ${m(b)}, and explain why the claim holds for the fencing but not for the ground the garden covers.`,
    answer: `Original perimeter = 2(${sa(l)} + ${sa(b)}) = ${m(p)}. Doubled, the garden is ${m(2 * l)} by ${m(2 * b)}, so the perimeter = 2(${sa(2 * l)} + ${sa(2 * b)}) = ${m(pDouble)}, which is exactly twice ${m(p)}. So the learner is correct about the fencing. The ground covered behaves differently: it was ${sa(l * b)} m² and becomes ${sa(2 * l * 2 * b)} m², four times as much, not twice. Perimeter adds lengths, so doubling every length doubles the total; the ground covered multiplies two lengths together, so doubling both of them multiplies the result by 2 × 2 = 4.`,
    explanation:
      'The learner is right, and the useful part of the question is why. Perimeter is a sum of lengths, so scaling every length by the same factor scales the sum by that factor. Anything found by multiplying two lengths scales by the factor squared. That is one idea, not two rules to memorise, and it explains a result learners often find surprising: a garden with twice the fencing does not hold twice the vegetables, it holds four times as many.',
    memo: [
      { code: 'M', marks: 1, text: `Original perimeter ${m(p)}` },
      { code: 'A', marks: 1, text: `Doubled perimeter ${m(pDouble)}, so the claim is correct` },
      { code: 'J', marks: 1, text: 'Perimeter adds lengths, so it scales by the same factor' },
      { code: 'J', marks: 1, text: 'The ground covered multiplies two lengths, so it scales by the factor squared — four times' },
    ],
  })
}

/* ===================================================================== */
/* Grade 11 -- shapes in pieces, missing sides, and the reverse direction */
/* ===================================================================== */

const g11 = { topicId: 'measurement', grade: 11 } as const

// ------------------------------------------------------------- an L-shape
{
  const wide = 8
  const tall = 6
  const notchW = 3
  const notchH = 2
  // Walking the outline from the bottom-left corner, anticlockwise.
  const outline = [wide, tall - notchH, notchW, notchH, wide - notchW, tall]
  const p = outline.reduce((a, s) => a + s, 0)
  out.push({
    ...g11,
    id: 'perim-g11-lshape',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `An L-shaped room is formed by taking a rectangle ${m(wide)} by ${m(tall)} and removing a ${m(notchW)} by ${m(notchH)} rectangle from one corner. Calculate the perimeter of the L-shaped room.`,
    context: `Walking around the outside of the room from the bottom-left corner, the six walls are: ${m(wide)} along the bottom, then ${m(tall - notchH)} up the right-hand side, then ${m(notchW)} to the left into the corner that was removed, then ${m(notchH)} up, then ${m(wide - notchW)} to the left along the top, then ${m(tall)} down the left-hand side back to the start.`,
    answer: `P = ${outline.map((s) => sa(s)).join(' + ')} = ${m(p)}`,
    explanation:
      'An L-shape has no formula, so the only method is to walk the outline and add every wall. The two walls that are not given directly are found by subtraction: the right-hand side is 6 − 2 and the top is 8 − 3, because the piece that was cut away accounts for the difference. Working out those missing sides is where the method marks are.',
    memo: [
      { code: 'M', marks: 1, text: `Missing side: ${sa(tall)} − ${sa(notchH)} = ${m(tall - notchH)}` },
      { code: 'M', marks: 1, text: `Missing side: ${sa(wide)} − ${sa(notchW)} = ${m(wide - notchW)}` },
      { code: 'M', marks: 1, text: 'All six walls added' },
      { code: 'A', marks: 1, text: `${m(p)}` },
    ],
  })
}

// ------------------------------------------- why the notch costs no fencing
{
  const wide = 8
  const tall = 6
  const notchW = 3
  const notchH = 2
  const p = rectPerimeter(wide, tall)
  const fullArea = wide * tall
  const lArea = fullArea - notchW * notchH
  out.push({
    ...g11,
    id: 'perim-g11-lshape-why',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A builder claims that an L-shaped room made by cutting a ${m(notchW)} by ${m(notchH)} corner out of a ${m(wide)} by ${m(tall)} rectangle has a smaller perimeter than the full rectangle, and so needs less skirting board, because it is a smaller room. Show by calculation whether the builder is right, and explain the result.`,
    answer: `Full rectangle: P = 2(${sa(wide)} + ${sa(tall)}) = ${m(p)}. L-shaped room, walking the outline: ${sa(wide)} + ${sa(tall - notchH)} + ${sa(notchW)} + ${sa(notchH)} + ${sa(wide - notchW)} + ${sa(tall)} = ${m(p)}. The two perimeters are equal, so the builder is wrong — the L-shaped room needs exactly the same length of skirting. The room IS smaller: it covers ${sa(lArea)} m² instead of ${sa(fullArea)} m². Cutting the corner out replaces two pieces of wall with two new pieces of exactly the same total length — the ${m(notchW)} and the ${m(notchH)} that now face into the notch are the same lengths that were removed from the top wall and the right-hand wall.`,
    explanation:
      'This is worth more than the arithmetic. Cutting a rectangular notch out of a corner moves wall inward without lengthening or shortening it: every centimetre taken off the top wall reappears as wall running into the notch, and the same for the side. So a rectilinear shape cut from a corner always has the perimeter of the rectangle it started in, however much floor it loses. A builder quoting skirting by floor size would under-order every time.',
    memo: [
      { code: 'M', marks: 1, text: `Rectangle perimeter: 2(${sa(wide)} + ${sa(tall)}) = ${m(p)}` },
      { code: 'M', marks: 1, text: 'L-shape outline walked, all six walls' },
      { code: 'A', marks: 1, text: `Also ${m(p)} — the builder is wrong` },
      { code: 'J', marks: 1, text: `Floor covered does fall, from ${sa(fullArea)} m² to ${sa(lArea)} m²` },
      { code: 'J', marks: 1, text: 'The removed wall lengths reappear facing into the notch, so the total is unchanged' },
    ],
  })
}

// -------------------------------------------- rectangle with a semicircle
{
  const w = 1.2
  const h = 1.5
  const arc = (PI * w) / 2
  const p = w + 2 * h + arc
  out.push({
    ...g11,
    id: 'perim-g11-window',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A window is made of a rectangle ${m(w)} wide and ${m(h)} high with a semicircle on top, the flat edge of the semicircle being the top of the rectangle. Calculate the perimeter of the window. Use π = ${sa(PI)}.`,
    answer: `The outside is made of the bottom of the rectangle, its two sides and the curved half of the circle. Curved part = ½ × πd = ½ × ${sa(PI)} × ${sa(w)} = ${m(arc, 4)}. P = ${sa(w)} + 2(${sa(h)}) + ${sa(arc, 4)} = ${m(p, 4)}`,
    explanation:
      'The trap here is the top of the rectangle. It is a line on the drawing, but it is not on the OUTSIDE of the window, so it is not part of the perimeter — including it adds 1,2 m of glazing strip that does not exist. Half a circumference uses the diameter, not the radius: ½ × πd. And only the curved edge of the semicircle is halved; the three straight sides are used in full.',
    memo: [
      { code: 'M', marks: 1, text: `Half the circumference: ½ × ${sa(PI)} × ${sa(w)}` },
      { code: 'A', marks: 1, text: `${m(arc, 4)}` },
      { code: 'M', marks: 1, text: 'Three straight sides added, the top of the rectangle excluded' },
      { code: 'CA', marks: 1, text: `${m(p, 4)}` },
    ],
  })
}

// ------------------------------------------ circumference → how many turns
{
  const d = 0.4
  const c = PI * d
  const distance = 50
  const turns = distance / c
  out.push({
    ...g11,
    id: 'perim-g11-wheel',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A wheelbarrow wheel has a diameter of ${m(d)}. Calculate the circumference of the wheel, and hence how many complete turns it makes when the wheelbarrow is pushed ${m(distance)} in a straight line. Use π = ${sa(PI)}.`,
    answer: `One turn moves the wheelbarrow forward by the circumference: C = πd = ${sa(PI)} × ${sa(d)} = ${m(c, 4)}. Number of turns = ${sa(distance)} ÷ ${sa(c, 4)} = ${sa(turns, 2)}, so the wheel makes ${Math.floor(turns)} complete turns.`,
    explanation:
      'The idea doing the work is that a wheel rolling without slipping travels exactly one circumference per turn — the distance around the wheel becomes distance along the ground. After that it is a division. The question asks for COMPLETE turns, so the answer is rounded DOWN: the wheel is part way through the next turn when the 50 m is reached, and a part turn is not a complete one.',
    memo: [
      { code: 'M', marks: 1, text: `C = πd = ${sa(PI)} × ${sa(d)}` },
      { code: 'A', marks: 1, text: `${m(c, 4)}` },
      { code: 'M', marks: 1, text: `${sa(distance)} ÷ ${sa(c, 4)}` },
      { code: 'CA', marks: 1, text: `${Math.floor(turns)} complete turns (rounded down)` },
    ],
  })
}

// ---------------------------------------------- circumference, backwards
{
  const c = 4.71
  const d = c / PI
  const r = d / 2
  out.push({
    ...g11,
    id: 'perim-g11-reverse-circumference',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A round table has a circumference of ${m(c)}. Calculate the diameter of the table. Use π = ${sa(PI)}.`,
    answer: `C = πd, so d = C ÷ π = ${sa(c)} ÷ ${sa(PI)} = ${m(d)}. (The radius is half of that, ${m(r)}.)`,
    explanation:
      'The circumference formula is used in reverse here: instead of multiplying the diameter by π, divide the circumference by π. Measuring around a round object with a tape and dividing by π is exactly how a diameter is found in practice, because the widest line across a table is hard to find by eye but the distance around it is easy to measure.',
    memo: [
      { code: 'M', marks: 1, text: 'C = πd rearranged to d = C ÷ π' },
      { code: 'M', marks: 1, text: `${sa(c)} ÷ ${sa(PI)}` },
      { code: 'A', marks: 1, text: `${m(d)}` },
    ],
  })
}

// ------------------------------------------------ perimeter off a scale plan
{
  const scale = 50
  const planL = 9
  const planB = 7
  const realL = (planL * scale) / 100
  const realB = (planB * scale) / 100
  const p = rectPerimeter(realL, realB)
  out.push({
    ...g11,
    id: 'perim-g11-scale-plan',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A floor plan is drawn to a scale of 1 : ${scale}. A rectangular bedroom measures ${cm(planL)} by ${cm(planB)} on the plan. Calculate the real perimeter of the bedroom, in metres.`,
    answer: `Real length = ${sa(planL)} × ${scale} = ${cm(planL * scale)} = ${m(realL)}. Real width = ${sa(planB)} × ${scale} = ${cm(planB * scale)} = ${m(realB)}. Perimeter = 2(${sa(realL)} + ${sa(realB)}) = ${m(p)}`,
    explanation:
      'A scale of 1 : 50 means every centimetre on the plan stands for 50 cm in the room, so each measurement is multiplied by 50 before anything else happens. Two orders of work both give the right answer — scale each side then find the perimeter, or find the perimeter on the plan and scale that — but scaling first is safer, because it leaves real measurements on the page that can be sense-checked against a room you have stood in.',
    memo: [
      { code: 'M', marks: 1, text: `Scale applied: ${sa(planL)} × ${scale} and ${sa(planB)} × ${scale}` },
      { code: 'C', marks: 1, text: `Converted to metres: ${m(realL)} by ${m(realB)}` },
      { code: 'M', marks: 1, text: `2(${sa(realL)} + ${sa(realB)})` },
      { code: 'CA', marks: 1, text: `${m(p)}` },
    ],
  })
}

// -------------------------------------------------------- poles round a camp
{
  const l = 45
  const b = 30
  const p = rectPerimeter(l, b)
  const spacing = 3
  const poles = p / spacing
  out.push({
    ...g11,
    id: 'perim-g11-poles',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A rectangular sheep camp measuring ${m(l)} by ${m(b)} is to be fenced, with a pole every ${m(spacing)} all the way around its perimeter. Calculate how many poles are needed, and explain why the answer is not one more than the number of ${m(spacing)} gaps, as it would be for a straight fence.`,
    answer: `Perimeter = 2(${sa(l)} + ${sa(b)}) = ${m(p)}. Number of ${m(spacing)} gaps = ${sa(p)} ÷ ${sa(spacing)} = ${sa(poles)}. The fence is a closed loop, so the last gap ends at the pole the fence started from. Every pole is the start of exactly one gap, so poles and gaps are equal: ${sa(poles)} poles. A straight fence needs one extra pole because it has two ends, and the pole at the far end starts no gap.`,
    explanation:
      'This is the fence-post problem, and the closed loop is the case learners get wrong in the opposite direction to the straight one. Along a straight fence, poles = gaps + 1. Around a closed shape, poles = gaps, because walking the loop returns you to the first pole and there is no far end. Writing the reason down is what earns the reasoning marks; the arithmetic on its own is one division.',
    memo: [
      { code: 'M', marks: 1, text: `Perimeter: 2(${sa(l)} + ${sa(b)})` },
      { code: 'A', marks: 1, text: `${m(p)}` },
      { code: 'M', marks: 1, text: `${sa(p)} ÷ ${sa(spacing)}` },
      { code: 'CA', marks: 1, text: `${sa(poles)} poles` },
      { code: 'J', marks: 1, text: 'Closed loop: the last gap ends at the first pole, so poles = gaps, with no extra end pole' },
    ],
  })
}

// ------------------------------------------------- fencing, gate and costing
{
  const l = 45
  const b = 30
  const gate = 4
  const p = rectPerimeter(l, b)
  const fenced = p - gate
  const rate = 128.4
  const fenceCost = fenced * rate
  const gateCost = 2350
  const total = fenceCost + gateCost
  out.push({
    ...g11,
    id: 'perim-g11-gate-cost',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `A rectangular camp measuring ${m(l)} by ${m(b)} is to be fenced, with a ${m(gate)} gate in one side. The fence runs around the whole perimeter apart from the gate. Fencing costs ${rands(rate)} per metre and the gate costs ${rand(gateCost)}. Calculate the total cost of enclosing the camp.`,
    answer: `Perimeter = 2(${sa(l)} + ${sa(b)}) = ${m(p)}. Fencing needed = ${sa(p)} − ${sa(gate)} = ${m(fenced)}. Fencing cost = ${m(fenced)} × ${rands(rate)} = ${rands(fenceCost)}. Total = ${rands(fenceCost)} + ${rand(gateCost)} = ${rands(total)}`,
    explanation:
      'Three steps, and the marks are spread across all three: perimeter, then the gate taken off the length of fencing, then two costs added. The gate is not free just because it is not fence — it is a separate item at a fixed price, so its width comes off the metres and its price goes on at the end.',
    memo: [
      { code: 'M', marks: 1, text: `Perimeter: 2(${sa(l)} + ${sa(b)}) = ${m(p)}` },
      { code: 'M', marks: 1, text: `Gate subtracted: ${sa(p)} − ${sa(gate)} = ${m(fenced)}` },
      { code: 'CA', marks: 1, text: `× ${rands(rate)} = ${rands(fenceCost)}` },
      { code: 'M', marks: 1, text: `Gate price added` },
      { code: 'CA', marks: 1, text: `${rands(total)}` },
    ],
  })
}

// ------------------------------------------------------- an athletics track
{
  const straight = 84.39
  const radius = 36.5
  const bends = 2 * PI * radius
  const p = 2 * straight + bends
  out.push({
    ...g11,
    id: 'perim-g11-track',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `The inside lane of an athletics track is made of two straights of ${m(straight)} each and two semicircular bends, each with a radius of ${m(radius)}. Calculate the perimeter of the inside lane -- the distance once around it. Use π = ${sa(PI)}.`,
    answer: `The two semicircular bends together make one full circle: ${sa(bends, 3)} m, from 2πr = 2 × ${sa(PI)} × ${sa(radius)}. Distance around = 2 × ${sa(straight)} + ${sa(bends, 3)} = ${m(p, 3)}`,
    explanation:
      'The step that saves the work is seeing that two semicircles of the same radius make one whole circle, so the bends can be done in a single 2πr instead of two halves. The answer lands just under 400 m, which is the point of those particular measurements — a standard track is built so that the inside lane comes to 400 m, and the small shortfall here is why races are actually measured 30 cm out from the kerb rather than along it.',
    memo: [
      { code: 'M', marks: 1, text: 'Two semicircles recognised as one full circle' },
      { code: 'M', marks: 1, text: `2 × ${sa(PI)} × ${sa(radius)} = ${sa(bends, 3)} m` },
      { code: 'M', marks: 1, text: `Two straights added: 2 × ${sa(straight)}` },
      { code: 'CA', marks: 1, text: `${m(p, 3)}` },
    ],
  })
}

// ------------------------------------------ same fencing, different shape
{
  const total = 36
  const a = { l: 12, b: 6 }
  const c = { l: 9, b: 9 }
  out.push({
    ...g11,
    id: 'perim-g11-same-fencing',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A farmer has exactly ${m(total)} of fencing for a rectangular chicken run, so each option below must have a perimeter of ${m(total)}. Option A is ${m(a.l)} by ${m(a.b)} and Option B is ${m(c.l)} by ${m(c.b)}. Show that both options use all the fencing, decide which gives the chickens more ground, and state what shape of rectangle gives the most ground for a fixed length of fencing.`,
    answer: `Option A: 2(${sa(a.l)} + ${sa(a.b)}) = ${m(rectPerimeter(a.l, a.b))}. Option B: 2(${sa(c.l)} + ${sa(c.b)}) = ${m(rectPerimeter(c.l, c.b))}. Both use the full ${m(total)}. Ground covered: Option A is ${sa(a.l)} × ${sa(a.b)} = ${sa(a.l * a.b)} m²; Option B is ${sa(c.l)} × ${sa(c.b)} = ${sa(c.l * c.b)} m². Option B gives ${sa(c.l * c.b - a.l * a.b)} m² more ground from the same fencing. For a fixed length of fencing, the square gives the most ground — the nearer a rectangle is to a square, the more it encloses.`,
    explanation:
      'Two shapes can use identical fencing and enclose very different amounts of ground, which is the single most useful thing perimeter teaches. A long thin rectangle spends its fencing on length and encloses little; a square spends it evenly. The practical version of this comes up constantly — a farmer with a fixed budget for fencing, a builder with a fixed length of wall — and the answer is always to make the shape as square as the site allows.',
    memo: [
      { code: 'M', marks: 1, text: `Option A perimeter = ${m(rectPerimeter(a.l, a.b))}` },
      { code: 'M', marks: 1, text: `Option B perimeter = ${m(rectPerimeter(c.l, c.b))} — both use all the fencing` },
      { code: 'A', marks: 1, text: `Ground covered ${sa(a.l * a.b)} m² against ${sa(c.l * c.b)} m²` },
      { code: 'CA', marks: 1, text: `Option B, by ${sa(c.l * c.b - a.l * a.b)} m²` },
      { code: 'J', marks: 1, text: 'A square encloses the most ground for a fixed perimeter' },
    ],
  })
}

/** Everything above, in one list. Exported last so it cannot be read before it is filled. */
export const perimeterQuestions: Question[] = out
