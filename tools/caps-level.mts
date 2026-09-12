/**
 * Propose a CAPS cognitive level (1-4) for a prose-subject exam prompt.
 *
 * WHAT THIS IS FOR: backfilling Question.cognitiveLevel across an existing
 * bank, and levelling new questions as they are written. It PROPOSES; a
 * person checks. The proposals were reviewed by sampling every level before
 * the Life Sciences backfill was applied, and the rules below were corrected
 * until the samples read right.
 *
 * WHERE IT MUST NOT BE USED: Mathematics, and the symbolic half of Physical
 * Sciences. In those subjects the cognitive demand lives in the mathematics
 * rather than in the verb -- "Solve for x: x² − x − 6 > 0" is a Level 3
 * complex procedure that carries no Level 3 wording at all. An earlier
 * version of these rules rated Mathematics Grade 12 at 5% higher-order,
 * which is nonsense. Prose subjects only.
 *
 * Run:  npx tsx tools/caps-level.mts <subject-id> [--sample] [--compare]
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import type { CognitiveLevel } from '../src/types'

/**
 * Level 4: judging, evaluating, arguing, proposing a course of action.
 *
 * Note what is NOT here. A bare "justify your answer" is not Level 4: on a
 * pedigree question it means "show the reasoning behind the deduction you
 * just made", which is Level 3 analysis. Level 4 needs a judgement that
 * could have gone the other way.
 */
const L4 =
  /\b(do you agree|to what extent|evaluate|argue|criticis|assess whether|is (this|the) .{0,30}(valid|fair|reliable|justified|ethical)|suggest (an improvement|a way to improve|how .{0,40} could be improved)|design an? (investigation|experiment)|which .{0,40}would you (choose|recommend|support)|discuss the ethical|advantages and disadvantages|arguments? (for and against|in favour)|should .{0,40}be (allowed|banned|permitted)|(discuss|suggest|propose|recommend) (two|three|TWO|THREE|\d+|some|possible)? ?(strategies|ways|measures|steps|actions|solutions)\b)/i

/**
 * Level 3: applying to something presented or unfamiliar, or working with
 * data. The reliable signal is a reference to a stimulus the question has
 * put in front of the learner, or an instruction to predict, compute or
 * justify a deduction.
 */
const L3_STIMULUS =
  /\b(this|these|the) (graph|table|data|results?|diagram|drawing|photograph|micrograph|sketch|flow chart|pedigree|investigation|experiment|scenario|passage|extract|article|cross|karyotype)\b/i
const L3_VERB =
  /\b(predict|calculate|interpret|deduce|work out|justify your answer|determine the (rate|percentage|number|magnification|ratio|frequency)|account for|explain the (results?|observations?|trend|difference in the)|explain both observations|what would happen if|use (the|this|these|your) .{0,60}\b(to|and) (explain|predict|determine|work out|show)|explain why (this|these|the .{0,30}(shown|above|illustrated|in the (graph|table|diagram|passage|photograph)))) \b/i

/**
 * Level 1: recall of taught content. CAPS puts "describe" here alongside
 * name/state/define -- describing the structure and function of an organelle
 * is remembering it, not understanding a relationship. That one word covers
 * around 380 items in the Life Sciences bank, so getting it wrong moves the
 * whole distribution.
 */
const L1_OPENER =
  /^(define|name|state|list|label|identify|give (the|one|two|three|four) (term|word|name|example)|write down|tabulate|describe|briefly describe|tabulate)\b/i

/**
 * A recall opener followed by reasoning is Level 2. Also lifts "describe"
 * when what is being described is a relationship, a difference or an
 * adaptation rather than a remembered structure.
 */
const LIFTS_L1 =
  /\b(and (explain|justify|give a reason)|, (explain|and explain)|explain why|explain how|relationship between|difference between|differences between|adapted|adaptation|trade-off|compared with|in terms of the relationship)\b/i

export function proposeLevel(prompt: string): CognitiveLevel {
  const p = prompt.trim()
  if (L4.test(p)) return 4
  if (L3_STIMULUS.test(p) || L3_VERB.test(p)) return 3
  if (L1_OPENER.test(p)) return LIFTS_L1.test(p) ? 2 : 1
  return 2
}

export const levelToDifficulty = (l: CognitiveLevel) =>
  l === 1 ? 'Easy' : l === 2 ? 'Moderate' : 'Challenge'

// ---------------------------------------------------------------- CLI

if (import.meta.url === `file://${process.argv[1]}`) {
  const subject = process.argv[2]
  if (!subject) {
    console.error('usage: npx tsx tools/caps-level.mts <subject-id> [--sample] [--compare]')
    process.exit(1)
  }
  const list: any[] = (await papersForSubject(subject)) as any
  const items = list.flatMap((p: any) =>
    p.sections.flatMap((s: any) => s.items.map((i: any) => ({ ...i, paperId: p.id, grade: p.grade }))),
  )

  const byLevel = new Map<CognitiveLevel, any[]>()
  const marks = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<CognitiveLevel, number>
  for (const i of items) {
    const l = proposeLevel(i.prompt)
    marks[l] += i.marks
    const g = byLevel.get(l) ?? []
    g.push(i)
    byLevel.set(l, g)
  }
  const total = marks[1] + marks[2] + marks[3] + marks[4]
  console.log(`${subject}: ${items.length} items, ${total} marks`)
  for (const l of [1, 2, 3, 4] as CognitiveLevel[])
    console.log(
      `  Level ${l}: ${String(byLevel.get(l)?.length ?? 0).padStart(4)} items  ${String(marks[l]).padStart(5)} marks  ${Math.round((marks[l] / total) * 100)}%`,
    )
  console.log(`  Levels 3+4 combined: ${Math.round(((marks[3] + marks[4]) / total) * 100)}%`)

  if (process.argv.includes('--sample')) {
    for (const l of [1, 2, 3, 4] as CognitiveLevel[]) {
      console.log(`\n--- Level ${l} sample`)
      const g = byLevel.get(l) ?? []
      for (let n = 0; n < Math.min(10, g.length); n++) {
        const i = g[Math.floor((n * g.length) / Math.min(10, g.length))]
        console.log(`   {${i.difficulty}} ${i.paperId} ${i.label} [${i.marks}] ${i.prompt.slice(0, 105)}`)
      }
    }
  }

  if (process.argv.includes('--compare')) {
    const moves = new Map<string, number>()
    for (const i of items) {
      const want = levelToDifficulty(proposeLevel(i.prompt))
      if (want !== i.difficulty) moves.set(`${i.difficulty} -> ${want}`, (moves.get(`${i.difficulty} -> ${want}`) ?? 0) + 1)
    }
    console.log('\n--- where the proposal disagrees with the stored difficulty')
    for (const [k, v] of [...moves.entries()].sort((a, b) => b[1] - a[1])) console.log(`   ${k.padEnd(24)} ${v}`)
  }
}
