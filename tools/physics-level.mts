/**
 * Propose a CAPS cognitive level for a Physical Sciences item -- and a
 * measured account of where that stops being possible.
 *
 * WHY THIS EXISTS. tools/cognitive-level.mts reads the VERB in a prompt, and
 * says so itself: it must not be used on the symbolic half of Physical
 * Sciences, because there the cognitive demand lives in the mathematics
 * rather than in the wording. It was used anyway, and the result is visible:
 * Grade 12 Paper 1 sits at 71% Level 2 against a CAPS target of 35%, with
 * 85% of that pool being calculations. `classify` returns 2 when nothing
 * matches, so every calculation it could not read fell into one bucket.
 *
 * WHAT I TRIED. The worked solution in `explanation` shows the method, so
 * counting the formulas it applies looked like a structural fact rather than
 * an inference from phrasing: one formula is a routine substitution, two or
 * more is a chain. I hand-labelled 19 calculation items across Grade 12
 * Paper 1 by physics judgement and measured this file against them.
 *
 * IT AGREED WITH 7 OF 19. That is 37%, worse than labelling every
 * calculation Level 3 without reading it, which would have scored 63%. The
 * eval is kept in the repo so the number can be re-run rather than trusted.
 *
 * WHY IT FAILS, which matters more than the score:
 *
 *   1. Formulas are introduced in prose. "By conservation of momentum:
 *      m1v1 + m2v2 = (m1 + m2)v'" and "Using v² = u² + 2gDy, taking the net
 *      displacement as -20 m" both defeat a clause-anchored pattern. This is
 *      a parsing bug and could be fixed.
 *
 *   2. Step count is not cognitive demand, and this cannot be fixed.
 *      "v² = u² + 2aDy" applied to a ball thrown upward from a tower is ONE
 *      formula and is Level 3, because the learner must choose a sign
 *      convention and model the displacement before any substitution is
 *      possible. A collision is one formula and is Level 3 because a
 *      conservation principle has to be recognised. Meanwhile free fall via
 *      mgh = 1/2mv² reads as two formulas and is a routine Level 2 result.
 *      The demand lives in the setup, which no text feature reports.
 *
 * ARCHETYPES DO NOT RESCUE IT EITHER. These papers reuse question shapes
 * across sets and years, so hand-classifying shapes rather than items looked
 * promising. Measured: the top 100 shapes cover 44-54% of marks per grade,
 * and 200 shapes are needed for 63-73%. That is not enough cheaper than
 * hand-levelling the items to be worth the indirection.
 *
 * SO WHAT THIS FILE IS FOR. The parts that ARE reliable, because they rest on
 * wording the way the prose rules do: Level 1 recall openers and Level 4
 * evaluative wording. proposePhysicsLevel returns `null` for a calculation
 * rather than a guess, so nothing downstream can quietly relabel 8 100 marks
 * on a 37% signal. The Level 2/3 split in this subject needs a physics
 * teacher, item by item, and saying so is the finding.
 *
 * Run:  npx tsx tools/physics-level.mts [--sample] [--compare] [--grade 12] [--paper 1]
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import type { CognitiveLevel } from '../src/types'

export interface PhysicsItem {
  prompt: string
  answer?: string
  explanation?: string
  context?: string
  marks: number
}

/** Recall: the fact is the answer, and no working is required. */
const L1_OPENER =
  /^(state|define|name|list|give (the|one|two|three)|write down|what is the (unit|symbol|formula)|identify the (unit|symbol))\b/i

/**
 * Evaluation and design. Deliberately narrow: in a calculating subject a bare
 * "evaluate" means compute, so it is not here -- only wordings that ask for a
 * judgement that could have gone the other way.
 */
const L4 =
  /\b(do you agree|to what extent|design an? (investigation|experiment)|suggest (an improvement|a way to improve)|which .{0,40}would you (choose|recommend|support)|evaluate (the|this|their|his|her) (claim|statement|argument|conclusion|method|design|proposal|reasoning|explanation)|assess (the|this|their|whether)|whose (reasoning|argument|claim|method|approach|explanation)|criticis|advantages and disadvantages|discuss the ethical)\b/i

/** A question whose answer is a number obtained by calculating. */
const CALC =
  /\b(calculate|determine the|how (far|long|fast|much|many)|work out|find the|compute)\b/i

/**
 * A stimulus the item has put in front of the learner. Reading one and acting
 * on it is application, not recall of a procedure.
 */
const STIMULUS =
  /\b(the (graph|table|diagram|circuit|sketch|data|results?|readings?|apparatus)|shown (above|in the)|from the (graph|table|diagram))\b/i

/**
 * Count the distinct formulas a worked solution applies.
 *
 * A formula starts where a symbol is introduced with an `=` at a clause
 * boundary -- the start of the text, or after a full stop, semicolon or
 * "then"/"therefore". Chained equalities inside one step (`p = mv = 1 500 ×
 * 12 = 18 000`) are one formula, which is the whole point: the number of
 * `=` signs would say three.
 */
export function countFormulas(explanation: string): number {
  if (!explanation) return 0
  const clauses = explanation.split(/(?:[.;]|\bthen\b|\btherefore\b|∴)\s+/i)
  let n = 0
  for (const c of clauses) {
    // A symbol on the left of the first `=`: letters, subscripts, primes,
    // deltas, and at most a short bracketed qualifier such as (total).
    if (/^\s*[A-ZΔa-zρλνθ][A-Za-z₀-₉0-9^'′_(){}\s,·⋅-]{0,18}=/.test(c)) n++
  }
  return n
}

export function proposePhysicsLevel(item: PhysicsItem): { level: CognitiveLevel | null; why: string } {
  const prompt = item.prompt.trim()
  const expl = item.explanation ?? ''
  const both = `${item.context ?? ''} ${prompt}`

  if (L4.test(prompt)) return { level: 4, why: 'asks for a judgement that could have gone the other way' }

  if (L1_OPENER.test(prompt) && !CALC.test(prompt)) {
    return { level: 1, why: 'recall: the fact is the answer and no working is required' }
  }

  if (CALC.test(prompt)) {
    // Deliberately no answer. Formula counting scored 37% against hand
    // labels (see the file comment), so any level returned here would be
    // worse than a coin toss dressed up as a measurement. countFormulas is
    // still exported, for triage rather than for labelling.
    return {
      level: null,
      why: `calculation: cognitive level needs a physics reading (worked solution applies ${countFormulas(expl)} formula(s), which does not settle it)`,
    }
  }

  // Prose in a science paper: explaining a principle is understanding;
  // explaining something the item has put in front of the learner is applying.
  if (STIMULUS.test(both)) return { level: 3, why: 'applies a principle to a supplied stimulus' }
  return { level: 2, why: 'explains a principle without a stimulus to apply it to' }
}

// ---------------------------------------------------------------- CLI

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (flag: string) => {
    const i = process.argv.indexOf(flag)
    return i === -1 ? undefined : process.argv[i + 1]
  }
  const grades = arg('--grade') ? [Number(arg('--grade'))] : [10, 11, 12]
  const papers = arg('--paper') ? [Number(arg('--paper'))] : [1, 2]

  const all: any[] = []
  for (const g of grades)
    for (const pn of papers) {
      const list: any[] = (await papersForSubject('physical-sciences', pn as 1 | 2, g as 10 | 11 | 12)) as any
      for (const p of list)
        for (const s of p.sections)
          for (const it of s.items) all.push({ ...it, paperId: p.id, paperNumber: pn, grade: g })
    }

  const marks = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<CognitiveLevel, number>
  const byLevel = new Map<CognitiveLevel, any[]>()
  let undecided = 0
  let undecidedMarks = 0
  let totalMarks = 0
  for (const it of all) {
    totalMarks += it.marks
    const { level, why } = proposePhysicsLevel(it)
    if (level === null) {
      undecided++
      undecidedMarks += it.marks
      continue
    }
    marks[level] += it.marks
    byLevel.set(level, [...(byLevel.get(level) ?? []), { ...it, why }])
  }
  console.log(`physical-sciences: ${all.length} items, ${totalMarks} marks`)
  console.log(`  decided by wording:`)
  for (const l of [1, 2, 3, 4] as CognitiveLevel[]) {
    console.log(`    Level ${l}: ${String(marks[l]).padStart(5)} mk  ${((marks[l] / totalMarks) * 100).toFixed(1).padStart(5)}%`)
  }
  console.log(`  LEFT UNDECIDED (calculations): ${undecided} items, ${undecidedMarks} mk, ${Math.round((undecidedMarks / totalMarks) * 100)}% of the subject`)
  console.log(`  These need a physics reading. See the comment at the top of this file for why.`)

  if (process.argv.includes('--sample')) {
    for (const l of [1, 2, 3, 4] as CognitiveLevel[]) {
      const g = byLevel.get(l) ?? []
      console.log(`\n--- proposed Level ${l} (${g.length} items) sample`)
      for (let n = 0; n < Math.min(8, g.length); n++) {
        const i = g[Math.floor((n * g.length) / Math.min(8, g.length))]
        console.log(`   [${i.marks}mk was L${i.cognitiveLevel}] ${i.prompt.slice(0, 96)}`)
        console.log(`        ${i.why}`)
      }
    }
  }

}
