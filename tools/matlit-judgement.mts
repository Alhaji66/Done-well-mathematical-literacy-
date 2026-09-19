/**
 * Triage Mathematical Literacy items whose prompt ENDS on a judgement clause.
 *
 * WHY THIS EXISTS. The CAPS compliance report said Mat Lit was 856 marks short
 * of its 20% Level 4 target and that the content therefore had to be written.
 * Measuring before writing showed something different: 367 items stored at
 * Level 3 -- 1 409 marks -- already END on a clause asking for a judgement
 * ("state which plan suits a buyer whose income is irregular", "explain why the
 * mean is a poor guide to what the family can expect"). Most of the shortfall
 * is not missing content. It is content whose demand the wording classifier in
 * cognitive-level.mts cannot see, because that classifier reads the OPENING
 * command verb and these items open with "Determine".
 *
 * WHAT THIS FILE DOES NOT DO. It does not relabel anything. The population it
 * selects is mixed, and dangerously so: the same "and state ..." shape carries
 * both "state what that shows about small surveys" (Level 4) and "state how
 * much drink is left unsold" (a subtraction). A rule that moved the whole
 * population would move 1 409 marks on the strength of the word "and".
 * `proposeJudgementLevel` is therefore a TRIAGE step -- it narrows 367 items to
 * a list short enough to read -- and every level actually written to the corpus
 * was decided by reading the item.
 *
 * THE DISTINCTION IT DRAWS. A closing clause is Level 4 when it asks what a
 * result MEANS, whether something is WORTH it, ENOUGH, RELIABLE or THE RIGHT
 * MEASURE, WHY two figures disagree, or WHAT SOMEONE SHOULD DO. It is not
 * Level 4 when it asks for a further QUANTITY ("state the total to order",
 * "state how many more minutes this is") or checks a number against a stated
 * threshold ("state whether this exceeds 1 m²"). Finishing the arithmetic in a
 * second sentence is still arithmetic.
 *
 * HOW IT WAS MEASURED, which is the part that matters. Two disjoint systematic
 * samples were drawn from the population, every 12th item by id, at offsets 0
 * and 6. Both were hand-labelled from the closing clause against the CAPS
 * taxonomy set out in matlit-level-eval.mts. The rule was BUILT on the offset-0
 * set, so its 31/31 there is a restatement, not a result, and is not reported
 * as one. The offset-6 set was drawn and labelled afterwards and scored once:
 *
 *   AS BUILT, on held-out data:      25/31 (81%)
 *   Baseline, calling all of them L4: 22/31 (71%)
 *
 * Ten points over an unread baseline is a modest result and it is the honest
 * one. The six misses say why, and all but one are the same bug: "how many"
 * and "how much" were treated as the demand when they sit inside a subordinate
 * clause. "Whether floor area is the right test for HOW MANY the office can
 * hold" asks which measure is appropriate; "explain what this means for HOW
 * MUCH of the grant reached the garden" asks what a result means. Both were
 * rejected as quantity questions. "State what the difference means" was
 * rejected for containing "the difference".
 *
 * REFINED adds an accept list, checked before the quantity reject, so the
 * strongest Level 4 shapes cannot be knocked out by a word in a subordinate
 * clause. It scores 30/31 on that same held-out set -- BUT the set was spent
 * diagnosing the misses, so that number is fitted and is reported here only so
 * nobody has to re-derive it. The one remaining miss is left unfixed on
 * purpose: "explain why that same kitchen appears much larger on the 1 : 100
 * house plan" is explaining how scale works, which is Level 2 understanding
 * wearing a Level 4 sentence, and no wording feature separates it from "explain
 * why the real number is lower", which is genuine reflection on a model.
 *
 * One disagreement is worth recording because it recurs: "state whether sales
 * have more than doubled over this period" was hand-labelled Level 3 in the
 * earlier calibration too, and is rejected here for the same reason -- it is a
 * comparison against a fixed multiple, not a judgement that could have gone the
 * other way on the same numbers.
 *
 *   npx tsx tools/matlit-judgement.mts [--grade 11] [--paper 1] [--rejected]
 */
import { papersForSubject } from '../src/data/papers/index.ts'

/**
 * The prompt ends on a separate instruction introduced by a command verb.
 * Anchored to the END: a judgement asked in the middle of a prompt is usually
 * scene-setting rather than the task.
 */
export const CLOSING_CLAUSE =
  /,\s*and\s+(state|say|explain|comment on|decide|justify|give (a|one) reason)\b[^.]*\.?\s*$/i

/**
 * Shapes that are Level 4 whatever else the clause contains. Checked FIRST, so
 * that a "how many" or "the difference" sitting inside a subordinate clause
 * cannot knock out the judgement the clause actually asks for.
 */
const JUDGEMENT =
  /\b(what .{0,40}\bmeans?\b|what that shows|what .{0,30}should (do|order|stock|change)|which measure|whether .{0,50}\b(is|are|was|were) the right\b|whether .{0,60}\b(useful|reasonable|enough|worth|reliable|credible|safe|fair|sensible|poor|misleading)\b)/i

/**
 * Demands for a further number. "State the total to order" is the last step of
 * a calculation, not a reflection on it.
 */
const QUANTITY =
  /\b(how much|how many|how long|what percentage|the percentage|as a percentage|the (total|cost|saving|amount|difference)\b|would have paid|is left (unsold|over)|must buy|whether (this|it) exceeds|whether it (holds|fits) \d|have (more than )?(doubled|halved|tripled))/i

/**
 * THE AS-BUILT RULE, kept so its honest score stays reproducible.
 *
 * Quantity reject only, with no accept list in front of it. This is the
 * version that was fixed BEFORE the held-out sample was drawn, so its 25/31
 * there is the one number in this file measured on data the rule had not seen.
 * Exported only for the eval; nothing that labels content calls it.
 */
export function proposeJudgementLevelAsBuilt(prompt: string): { level: 4 | null; why: string } {
  const m = prompt.match(CLOSING_CLAUSE)
  if (!m) return { level: null, why: 'does not end on a judgement clause' }
  const clause = m[0].replace(/^,\s*and\s+/i, '').trim()
  if (QUANTITY_AS_BUILT.test(clause)) return { level: null, why: `asks for a further quantity: ${clause}` }
  return { level: 4, why: `judgement: ${clause}` }
}

/** The reject list as it stood when the held-out sample was drawn. */
const QUANTITY_AS_BUILT =
  /\b(how much|how many|how long|what percentage|the percentage|as a percentage|the (total|cost|saving|amount|difference)\b|would have paid|is left (unsold|over)|must buy|whether (this|it) exceeds|whether it (holds|fits) \d)/i

export function proposeJudgementLevel(prompt: string): { level: 4 | null; why: string } {
  const m = prompt.match(CLOSING_CLAUSE)
  if (!m) return { level: null, why: 'does not end on a judgement clause' }
  const clause = m[0].replace(/^,\s*and\s+/i, '').trim()
  if (JUDGEMENT.test(clause)) return { level: 4, why: `judgement: ${clause}` }
  if (QUANTITY.test(clause)) return { level: null, why: `asks for a further quantity: ${clause}` }
  return { level: 4, why: `judgement: ${clause}` }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (f: string) => {
    const i = process.argv.indexOf(f)
    return i === -1 ? undefined : process.argv[i + 1]
  }
  const grade = arg('--grade') ? Number(arg('--grade')) : undefined
  const paper = arg('--paper') ? Number(arg('--paper')) : undefined
  const showRejected = process.argv.includes('--rejected')

  const list: any[] = (await papersForSubject('mat-lit', paper as 1 | 2 | undefined, grade as any)) as any
  let accepted = 0
  let acceptedMarks = 0
  let rejected = 0
  for (const p of list.sort((a, b) => a.id.localeCompare(b.id))) {
    if (grade && p.grade !== grade) continue
    if (paper && p.paperNumber !== paper) continue
    const rows: string[] = []
    for (const s of p.sections)
      for (const i of s.items) {
        if (i.cognitiveLevel !== 3) continue
        const { level, why } = proposeJudgementLevel(i.prompt)
        if (level === 4 && !showRejected) {
          accepted++
          acceptedMarks += i.marks
          rows.push(`  ${i.id.padEnd(22)} ${String(i.marks).padStart(2)}mk  ${why}`)
        } else if (level === null && showRejected && !why.startsWith('does not')) {
          rejected++
          rows.push(`  ${i.id.padEnd(22)} ${String(i.marks).padStart(2)}mk  ${why}`)
        }
      }
    if (rows.length) {
      console.log(`### ${p.id}`)
      for (const r of rows) console.log(r)
    }
  }
  console.log(
    showRejected
      ? `\n${rejected} item(s) rejected as ending on a further quantity.`
      : `\n${accepted} item(s), ${acceptedMarks} marks proposed for review as Level 4. READ THEM before writing a level.`,
  )
}
