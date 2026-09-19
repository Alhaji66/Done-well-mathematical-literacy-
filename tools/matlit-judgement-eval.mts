/**
 * Score tools/matlit-judgement.mts against hand labels.
 *
 * Two disjoint systematic samples of the population it triages -- Mat Lit items
 * stored at Level 3 whose prompt ends on a judgement clause -- drawn as every
 * 12th item by id at offsets 0 and 6 (scratchpad/ml-judge-sample.mts and
 * scratchpad/ml-holdout.mts reproduce them). Labelling was done from the
 * CLOSING CLAUSE alone, against the CAPS taxonomy in matlit-level-eval.mts,
 * because that clause is what decides the level; showing the whole prompt
 * invites labelling on the arithmetic instead.
 *
 * READ THE TWO NUMBERS DIFFERENTLY. The rule was built by reading the BUILT
 * set, so its score there is a restatement of how it was written and is
 * reported only to show the fit is exact. The HELD-OUT set was drawn and
 * labelled after the rule was fixed, and scored once. That is the result:
 * 25/31 (81%), against 22/31 (71%) for calling every one of them Level 4.
 *
 * A NOTE ON DRIFT, because this eval has a failure mode worth knowing about.
 * The truth sets name items by id and read their prompts out of the LIVE
 * corpus, so rewriting a listed item silently changes what is being measured.
 * That has already happened once: one BUILT item was later rewritten into a
 * genuine Level 4 question, and it is excluded below rather than relabelled,
 * because the prompt its label described no longer exists. Relabelling it
 * would have scored the rewrite instead of the rule. Anyone rewriting a listed
 * item should exclude it the same way. No held-out item has been rewritten, so
 * the 81% stands on all 31 of them.
 *
 *   npm run check:matlit-judgement
 */
import { proposeJudgementLevel, proposeJudgementLevelAsBuilt } from './matlit-judgement.mts'
import { papersForSubject } from '../src/data/papers/index.ts'

/** true = genuinely Level 4 reasoning; false = the clause finishes a calculation. */
const BUILT: Record<string, boolean> = {
  'ml-g10-p1-20-2-3': true, // what this means for the tiler
  'ml-g10-p1-21-4-3': true, // whether stocking the mean would have met demand
  'ml-g10-p1-23-2-9': false, // whether this exceeds 1 m² -- a threshold check
  'ml-g10-p1-24-4-4': true, // why the two answers differ so much
  'ml-g10-p1-a-4-6': true, // what the librarian should order
  'ml-g10-p1-c-4-6': true, // which to buy more of, with a reason, on weak evidence
  'ml-g10-p2-22-1-11': true, // what that shows about small surveys
  'ml-g10-p2-23-2-2': true, // whether quoting 57 m² would matter
  'ml-g10-p2-25-1-6': true, // whether pushing extras is worth the effort
  'ml-g10-p2-a-3-5': true, // whether paying the extra is worth it
  'ml-g10-p2-c-1-11': true, // why that second answer needs care
  'ml-g11-p1-20-2-9': false, // how many MORE days -- a subtraction
  'ml-g11-p1-22-4-4': false, // whether this exceeds a 150% increase
  'ml-g11-p1-24-3-2': true, // why a park would never be laid out that way
  'ml-g11-p1-a-1-5': true, // whether a 1 GB cap would be enough
  // 'ml-g11-p1-b-3-5' was here, hand-labelled false ("state whether it holds 6
  // learners at 0,5 m² each" -- a threshold check). It is EXCLUDED rather than
  // relabelled because the item was subsequently rewritten into a genuine
  // Level 4 question, so the prompt this label described no longer exists in
  // the corpus. Scoring the rule against the replacement would measure the
  // rewrite, not the rule. Excluding it drops BUILT from 31 items to 30.
  'ml-g11-p2-21-1-2': true, // whether the stall holder can RELY on R1 480
  'ml-g11-p2-23-1-6': false, // that gain as a percentage improvement
  'ml-g11-p2-24-4-6': false, // how many more glasses
  'ml-g11-p2-a-3-5': false, // what they would have paid if zero-rated
  'ml-g11-p2-c-3-3': true, // what the family should do if it does not
  'ml-p1-21-2-6': false, // how much extra ground to buy
  'ml-p1-22-4-2': true, // why the mean is a poor guide to next week
  'ml-p1-24-2-7': true, // why buying for both coats at once wastes less
  'ml-p1-b-1-12': true, // one change he could make, noting its drawback
  'ml-p2-20-1-2': true, // why to plan staffing on recent months not the mean
  'ml-p2-21-3-5': false, // what percentage of expenses the VAT represents
  'ml-p2-22-4-3': false, // how much drink is left unsold
  'ml-p2-24-4-5': false, // the percentage increase in marker spending
  'ml-p2-a-4-5': true, // whether turning the boxes the other way fits more
  'ml-p2-c-1-7': true, // why the committee keeps the two apart
}

const HELD_OUT: Record<string, boolean> = {
  'ml-g10-p1-21-1-8': true, // what he would have to change to get there
  'ml-g10-p1-22-3-6': true, // whether floor area is the right test
  'ml-g10-p1-24-2-3': false, // the total to order
  'ml-g10-p1-25-3-6': true, // whether a 10% guideline is useful here
  'ml-g10-p1-b-4-3': true, // what the canteen should stock
  'ml-g10-p2-21-1-3': true, // what the difference means
  'ml-g10-p2-22-2-6': true, // whether stacking changes the answer
  'ml-g10-p2-24-2-6': true, // whether the park provides enough play space
  'ml-g10-p2-25-4-6': false, // how many more minutes
  'ml-g10-p2-b-2-2': true, // which measure matters when fencing
  'ml-g10-p2-c-4-1': true, // what to do about any shortfall
  'ml-g11-p1-21-3-2': true, // why the real number is lower
  'ml-g11-p1-23-2-5': true, // whether that is a large cut
  'ml-g11-p1-25-1-8': false, // how much extra data that allows
  'ml-g11-p1-a-4-4': false, // whether sales have more than doubled
  'ml-g11-p1-c-4-4': false, // whether sales have more than doubled
  'ml-g11-p2-21-4-6': false, // how many more minutes
  'ml-g11-p2-24-2-2': true, // whether that allowance is reasonable
  'ml-g11-p2-25-3-1': true, // one cost of the longer term even without interest
  'ml-g11-p2-b-4-6': false, // how many fewer walls
  'ml-p1-20-2-3': true, // why the family should still keep fewer
  'ml-p1-22-1-3': true, // what the result means for an unexpected expense
  'ml-p1-23-3-2': false, // why the kitchen appears larger at 1:100 -- how scale works
  'ml-p1-25-4-10': true, // why it differs from R250
  'ml-p1-c-2-7': true, // why a tiler advises buying more boxes than this
  'ml-p2-20-3-5': true, // what this means for how much of the grant arrived
  'ml-p2-22-1-8': true, // the risk in dropping carrot entirely
  'ml-p2-24-1-4': true, // why that projection is not credible
  'ml-p2-25-4-5': false, // how much of the last section would be unused
  'ml-p2-b-3-3': true, // whether the bakery could absorb that rise
  'ml-p2-c-4-5': true, // whether the per-metre price should stay the same
}

const list: any[] = (await papersForSubject('mat-lit')) as any
const prompts = new Map<string, string>()
for (const p of list) for (const s of p.sections) for (const i of s.items) prompts.set(i.id, i.prompt)

type Rule = (prompt: string) => { level: 4 | null; why: string }

function score(name: string, truth: Record<string, boolean>, rule: Rule, verbose: boolean) {
  let agree = 0
  let n = 0
  let positives = 0
  const misses: string[] = []
  for (const [id, isL4] of Object.entries(truth)) {
    const prompt = prompts.get(id)
    if (!prompt) {
      misses.push(`  MISSING ${id} -- the sample is stale, re-draw it`)
      continue
    }
    n++
    if (isL4) positives++
    const got = rule(prompt).level === 4
    if (got === isL4) agree++
    else misses.push(`  ${id.padEnd(22)} hand ${isL4 ? 'L4' : 'not L4'}, rule ${got ? 'L4' : 'not L4'}`)
  }
  console.log(`${name}: ${agree}/${n} (${Math.round((agree / n) * 100)}%)`)
  console.log(`  baseline, calling every one of them L4: ${positives}/${n} (${Math.round((positives / n) * 100)}%)`)
  if (verbose && misses.length) {
    console.log('  disagreements:')
    for (const m of misses) console.log(`  ${m}`)
  }
  return agree === n
}

/*
 * Read these four numbers in this order. Only the third is a measurement.
 *
 * The AS-BUILT rule was fixed before the held-out sample existed, so its score
 * on that sample is the one figure here that was not fitted to the data it is
 * scored on. Everything else is reported so the fitting is visible rather than
 * hidden: the as-built rule's perfect score on the set it was written against,
 * and the REFINED rule's near-perfect score on a sample already spent
 * diagnosing the as-built rule's misses.
 */
console.log('=== AS BUILT -- the rule as it stood before the held-out sample was drawn\n')
console.log('On the set it was written against. A fit, not a result:')
score('  BUILT   ', BUILT, proposeJudgementLevelAsBuilt, false)
console.log('\nOn data it had not seen. THIS IS THE HONEST NUMBER:')
score('  HELD OUT', HELD_OUT, proposeJudgementLevelAsBuilt, true)

console.log('\n=== REFINED -- an accept list added after reading the misses above\n')
console.log('Both sets are now spent, so neither of these is an independent measurement.')
score('  BUILT   ', BUILT, proposeJudgementLevel, false)
score('  HELD OUT', HELD_OUT, proposeJudgementLevel, true)
console.log(
  '\nThe rule is triage, not a labeller: it narrows 367 items to a readable list.\n' +
    'Every level written to the corpus was decided by reading the item, which is\n' +
    'why an 81% triage rule is good enough to use and would not be good enough\n' +
    'to apply unread.',
)
