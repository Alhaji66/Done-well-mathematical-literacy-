/**
 * Assigning a CAPS cognitive level to a question from its wording.
 *
 * Pure -- no imports, no side effects -- so it can be imported by the applier,
 * by the audit script, and by a test without any of them running each other.
 *
 * Life Sciences was levelled by hand, item by item, over several sessions. The
 * other three subjects hold 5 502 paper items between them, which is more than
 * anyone will level by hand and then keep current as content changes. So they
 * are levelled from the wording, by the rules below, and the result stays
 * reviewable: the rules sit in one file, a mis-levelled item is a one-line fix,
 * and `npm run level:papers -- --dry-run` prints what would change.
 *
 * WHAT THIS DELIBERATELY IS NOT. It is tempting to map the app's difficulty
 * tag onto a level -- Easy to 1, Moderate to 2, Challenge to 3 -- and the
 * numbers would come out looking plausible against CAPS. That is relabelling,
 * not levelling. The difficulty tag answers "how hard will a learner find
 * this?" and a CAPS level answers "what kind of thinking does this demand?",
 * which are different questions: a three-mark recall item can be hard without
 * being Level 3, and a seven-mark Level 3 item can be routine for a learner
 * who has drilled it. Difficulty is therefore used only where the wording says
 * nothing at all, and never to override a rule.
 *
 * The signals, in the order they are applied:
 *
 *   1. The COMMAND VERB. CAPS defines its levels by cognitive demand and the
 *      verb is what states the demand -- "name" asks for recall, "justify"
 *      asks for an argument. Strongest single signal, checked first.
 *   2. Whether the item hands over DATA or an unfamiliar scenario to work
 *      within. That is applying, not recalling, whatever the verb says.
 *   3. How many STEPS the prompt implies -- "hence", a second command verb
 *      after "and", explicit (a)/(b) parts -- which is what separates a
 *      routine procedure from a multi-step one.
 *   4. MARKS, as a floor and a ceiling only. Mark allocation in these papers
 *      is fairly even, so a six-mark procedure cannot be a single step and a
 *      one-mark item has no room to argue a position.
 */

export type Level = 1 | 2 | 3 | 4

interface LevelRule {
  level: Level
  why: string
  match: RegExp
}

/**
 * Level 4 -- reasoning, evaluating, critiquing, designing.
 *
 * The mark of Level 4 is that the learner must take a POSITION and defend it,
 * or build something that was not handed to them. Note what is absent:
 * "explain". Explaining a mechanism you were taught is Level 2, and treating
 * every "explain" as reasoning is the single easiest way to inflate a Level 4
 * count until it means nothing.
 */
const LEVEL_4: LevelRule[] = [
  {
    level: 4,
    why: 'evaluate a claim, or choose between options and defend the choice',
    // The "evaluate" branch matches across whatever sits between the verb and
    // the noun, rather than a fixed determiner. Written the tight way it read
    // "evaluate the claim" but not "evaluate the coach's advice" or "evaluate
    // the son's two claims" -- a possessive or a number in the middle made a
    // plainly Level 4 prompt fall through to "explain", which is Level 2. The
    // [^.]{0,40} keeps it inside the one sentence, so a later unrelated noun
    // cannot reach back and match a bare "evaluate".
    //
    // Two things were tried here and taken out again, because measuring them
    // against the corpus showed they cost more than they bought:
    //
    //   "decide whether|which" -- fires on descriptions far more often than on
    //   instructions. "Name the type of selection in which people DECIDE WHICH
    //   individuals may breed" is a one-mark recall item; "a student must
    //   DECIDE WHETHER it is a plant cell" is the scenario, not the task.
    //
    //   "rank ... justify your ranking" -- ranking with reasons is usually a
    //   taught rule applied in order. Ten Physical Sciences items ask learners
    //   to rank three substances by boiling point and justify it, which is
    //   intermolecular forces applied as drilled: Level 2, not a judgement.
    //   "justify each choice" went the same way: it reads as Level 4 when the
    //   choice is a recommendation for a person, and as Level 3 when it is
    //   matching three cells to three organelle counts. Prompts that mean the
    //   first say "justify your recommendation", which was already covered.
    match:
      /\b(evaluate [^.]{0,40}\b(claim|statement|argument|conclusion|method|design|investigation|decision|reasoning|advice|explanation|recommendation|plan|concern)s?\b|evaluate whether|critic\w+|do you agree|would you (agree|recommend|advise)|which .{0,40}(would you|do you) (choose|recommend|prefer)|justify (your|the|this) (answer|choice|conclusion|recommendation|decision|ordering)|is (the|this) (learner|claim|statement|conclusion|method|argument) (correct|right|valid|wrong)|comment on the validity|how valid|to what extent|argue (for|that)|make a (case|recommendation)|advise .{0,30}(whether|which)|with reasons?, (state|say|decide)|give (a|one|two) reasons? for your (answer|choice))\b/i,
  },
  {
    level: 4,
    why: 'find and explain the error in someone else’s reasoning',
    match:
      /\b(what is wrong with|explain why (the|this) (learner|person|claim|statement|argument|conclusion|method|calculation) is (wrong|incorrect|mistaken)|show that the learner is wrong|identify the (error|mistake|flaw)|where did .{0,30}go wrong|misleading|the learner (claims|concludes|argues|says|writes|thinks)|a learner (claims|concludes|argues|writes)|evaluate the learner)\b/i,
  },
  {
    level: 4,
    why: 'design, plan or propose something that was not supplied',
    match:
      /\b(design (an?|the) (investigation|experiment|method|plan)|plan an investigation|suggest (an?|the) (improvement|modification|way to)|how (would|could) you (test|investigate|improve)|propose (an?|the)|describe an experiment)\b/i,
  },
  {
    level: 4,
    why: 'predict, then justify the prediction',
    match: /\bpredict\b[^.]{0,90}\b(explain|justify|give a reason|why)\b/i,
  },
  {
    // Mat Lit calls its Level 4 "Reasoning and reflecting", and this is what
    // that looks like in practice: the learner computes something and is then
    // asked whether the computation actually settles the question. "Explain
    // why dividing by area alone overstates the number" is reflection on the
    // adequacy of a method, not an explanation of the method.
    level: 4,
    why: 'reflect on whether a figure or method actually answers the question',
    match:
      /\b(does not (show|mean|prove|tell|measure|settle)|is not (a fair|a good|enough|the same as|a reliable)|(alone )?(overstat|understat)\w*|why the (comparison|figure|average|method|calculation) .{0,50}(does not|is not|misleads)|which of the two to (plan|use|trust)|that money does not measure|one (difference|factor) .{0,40}(money|the figures?) (does|do) not)\b/i,
  },
]

/**
 * Level 3 -- applying a multi-step procedure, or working in an unfamiliar
 * context. The learner knows the methods; the work is selecting and sequencing
 * them, or reading a situation they have not met before.
 */
const LEVEL_3: LevelRule[] = [
  {
    level: 3,
    why: 'chains two procedures -- the second depends on the first',
    match: /\b(hence|and hence|us(e|ing) (your|this|the) answers? .{0,40}?(to |, )(determine|calculate|find|show))\b/i,
  },
  {
    level: 3,
    why: 'a proof or derivation rather than a result',
    match: /\b(show that|prove|derive|deduce|verify that)\b/i,
  },
  {
    level: 3,
    why: 'explicitly multi-part: (a), (b), …',
    match: /\(a\)[\s\S]{0,400}\(b\)/,
  },
  {
    level: 3,
    why: 'two separate commands in one prompt',
    match:
      /\b(calculate|determine|solve|find|sketch|draw|state|name|write down|explain|describe|classify|compare)\b[\s\S]{0,160}\b(and|then)\b[\s\S]{0,40}\b(calculate|determine|solve|find|sketch|draw|state|name|write down|explain|describe|classify|compare|give)\b/i,
  },
  {
    level: 3,
    why: 'interpret supplied data rather than recall a fact',
    match:
      /\b(according to the (table|graph|diagram|data)|from the (table|graph|diagram|data)|using the (information|data|table|graph) (above|given|provided|supplied)|what (does|do) the (data|results|graph|figures) (show|suggest|tell)|interpret the|trend shown|describe the (trend|pattern|relationship)|read off)\b/i,
  },
  {
    level: 3,
    why: 'a comparison, which needs both cases held in mind at once',
    match: /\b(compare|contrast|distinguish between|difference(s)? between|which of the two)\b/i,
  },
  {
    level: 3,
    why: 'apply a known idea to a fresh scenario',
    match:
      /\b(account for|explain the (adaptive )?(significance|advantage|importance)|what would (happen|go wrong) if|for which values? of|values? of [a-z] for which)\b/i,
  },
]

/**
 * Level 2 -- understanding, and routine procedures in a familiar context. One
 * method, applied the way it was taught.
 */
const LEVEL_2: LevelRule[] = [
  {
    level: 2,
    why: 'explain or describe something that was taught',
    match: /\b(explain|describe|discuss|give (a|one|two|three|the) reasons?|why (does|do|is|are|would|will))\b/i,
  },
  {
    level: 2,
    why: 'a single routine calculation or conversion',
    match:
      /\b(calculate|determine|work out|convert|express .{0,25}as|find the|solve|simplify|factoris\w*|round(ed)? (off|to)|how (much|many|long|far))\b/i,
  },
  {
    level: 2,
    why: 'complete or draw from supplied material',
    match: /\b(complete the|fill in|draw (a|the|up)|plot|sketch|construct|tabulate)\b/i,
  },
]

/**
 * Level 1 -- knowing. Recall of a term, fact or label, or a value read straight
 * off something in front of the learner.
 */
const LEVEL_1: LevelRule[] = [
  {
    level: 1,
    why: 'recall or read off a single fact',
    match:
      /\b(state|name|list|define|label|identify|give the (term|name|word|formula|unit)|write down|what is the (name|term|unit|formula|symbol)|which (part|organ|structure|letter)|true or false|choose the correct|select the)\b/i,
  },
]

const ORDERED = [...LEVEL_4, ...LEVEL_3, ...LEVEL_2, ...LEVEL_1]

export interface Classified {
  level: Level
  why: string
}

export interface Item {
  prompt: string
  context?: string
  marks: number
  difficulty?: string
}

/**
 * Classify one item.
 *
 * The rules see the PROMPT only, never the context. That distinction was
 * learned the hard way: running them over `context + prompt` sent 38% of the
 * Mat Lit corpus to Level 3, because the scenario prose is full of ordinary
 * English that the looser rules mistook for commands -- "Zanele says that
 * because her savings are almost a third of what she spends" tripped the
 * two-commands rule, and a table with "(a)" and "(b)" column labels tripped
 * the multi-part rule, on an item whose actual prompt was "Write down the
 * amount charged for Refuse removal". The context describes the situation; the
 * prompt is what the learner is asked to DO, and only the second one carries
 * the cognitive demand.
 *
 * The context still counts for one thing -- whether data was supplied to work
 * from -- which is handled separately below.
 */
export function classify(item: Item): Classified {
  const { prompt, context = '', marks, difficulty } = item
  const hit = ORDERED.find((r) => r.match.test(prompt))
  let level: Level = hit?.level ?? 2
  let why = hit?.why ?? 'no rule matched; defaulted to Level 2, the commonest level in every CAPS subject'

  // The one thing the context legitimately decides: an item that hands over a
  // substantial scenario or data set and then asks for a calculation is
  // applying a procedure in a context, not reproducing a drilled one.
  // Mat Lit draws its Level 2/3 line in exactly this place.
  if (level === 2 && context.length >= 160 && /\b(calculate|determine|work out|how (much|many))\b/i.test(prompt)) {
    level = 3
    why = `${why} -- raised to Level 3: the procedure has to be applied to a supplied scenario`
  }

  // Marks as a ceiling and a floor. These papers allocate marks fairly evenly,
  // so the mark value is a real statement about how much work is expected.
  if (level === 4 && marks <= 1) {
    level = 3
    why = `${why} -- capped at Level 3: one mark leaves no room to argue a position`
  }
  if (level === 1 && marks >= 6) {
    level = 2
    why = `${why} -- raised to Level 2: ${marks} marks is more than a recalled fact is worth`
  }
  if (level === 2 && marks >= 6) {
    level = 3
    why = `${why} -- raised to Level 3: a procedure worth ${marks} marks cannot be a single step`
  }
  // CAPS Level 1 in the calculating subjects is not only recall: it covers the
  // "direct use of a correct formula" and "use of mathematical facts". A
  // two-mark routine operation with a single clause -- "Solve for x: 5x + 8 =
  // 33" -- is one direct use of one fact, which is Level 1, not Level 2.
  // Anything with a second clause has a step in it and stays at Level 2.
  if (level === 2 && marks <= 2 && !/\b(and|then|hence)\b/i.test(prompt)) {
    level = 1
    why = `${why} -- lowered to Level 1: a single ${marks}-mark operation with no second step is direct use of one fact`
  }

  // Difficulty breaks the tie only where the wording said nothing at all.
  if (!hit && difficulty === 'Easy') {
    level = 1
    why = 'no rule matched; the item is tagged Easy, so Level 1'
  }
  return { level, why }
}
