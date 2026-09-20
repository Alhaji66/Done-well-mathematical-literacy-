/**
 * Level 2 vs Level 3 in Mathematics, decided by reading the question.
 *
 * WHY BY ARCHETYPE AND NOT ITEM BY ITEM. The Mathematics corpus was written
 * from templates: "Determine the equation of the tangent to f(x) = x³ − kx at
 * the point where x = a" appears eight times with different numbers, and the
 * cognitive demand is identical in all eight. So the unit of judgement is the
 * archetype, and every item matching it takes the same level. The numbers
 * never change what a learner has to do.
 *
 * WHY THESE CALLS. CAPS Level 2 is a well-known procedure applied in a
 * familiar setting: pick the right formula and run it. Level 3 is a complex
 * procedure -- more than one procedure connected together, a route that is not
 * announced by the question, or a step of reasoning with no formula behind it.
 * The note on each entry says which of those applies. The levels already
 * stored carry no information (measured at 50% agreement against a 67%
 * baseline), so there was nothing to preserve and nothing to correct against;
 * these are read fresh.
 */

export type Archetype = { re: RegExp; level: 2 | 3; why: string }

export const G12_P1: Archetype[] = [
  // ---- Level 3: more than one procedure, or a step with no formula ----
  {
    re: /^Two dice are rolled\. Determine the probability that the sum/,
    level: 3,
    why: 'The sample space of 36 ordered outcomes has to be built before anything can be counted. No formula produces it, and the count of favourable outcomes is read off the construction.',
  },
  {
    re: /^How many terms are there in the arithmetic sequence/,
    level: 3,
    why: 'The general term is run BACKWARDS: set Tₙ equal to the last term and solve for n. Substituting forwards, which is the Level 2 version, answers a different question.',
  },
  {
    re: /^Determine the equation of the tangent to/,
    level: 3,
    why: 'Three procedures in sequence and across two topics: differentiate, evaluate the derivative for the gradient, evaluate the function for the point, then form the line.',
  },
  {
    re: /^Solve simultaneously for x and y: y = x²/,
    level: 3,
    why: 'Substitute one equation into the other, solve the quadratic that results, then back-substitute for BOTH roots. The question does not say to substitute, and stopping at x answers half of it.',
  },
  {
    re: /^Solve for x: x² [−+] .*[≤≥<>]/,
    level: 3,
    why: 'Factorising is routine; deciding which interval satisfies the inequality is not, and there is no formula for it. The critical values have to be reasoned about.',
  },
  {
    re: /^Calculate the sum to infinity/,
    level: 3,
    why: 'The common ratio must be inferred from the terms, and the series only has a sum to infinity because |r| < 1 -- a conceptual condition, not a step in the formula.',
  },
  {
    re: /^For which value of k will the equation x² [−+] .* have equal roots/,
    level: 3,
    why: 'Nothing in the question mentions the discriminant. The learner has to know that equal roots MEANS b² − 4ac = 0, set that up, and then solve it -- a connection first, a procedure second.',
  },
  {
    re: /^Determine for which values of x the graph of f\(x\) = .* lies (below|above)/,
    level: 3,
    why: 'Asked about a graph and answered with an inequality. Translating between the two representations is the work; solving the inequality afterwards is the easy part.',
  },
  {
    re: /Two (are|balls are) drawn one after another, without replacement/,
    level: 3,
    why: 'The events are dependent, so the second probability has a different denominator from the first. Recognising that is the whole question; treating it as independent gives a wrong answer that looks right.',
  },
  {
    re: /height \(in metres\) after t seconds/,
    level: 3,
    why: 'Connects the derivative to a physical quantity: the learner has to know that velocity IS h′(t) before any differentiating starts. The calculus itself is easy.',
  },

  // ---- Level 2: one well-known procedure, in a familiar setting ----
  { re: /^Determine T₅\.$/, level: 2, why: 'Substitution into a general term that the question has already established.' },
  { re: /^Determine the general term Tₙ for the arithmetic sequence/, level: 2, why: 'Find d, substitute into Tₙ = a + (n − 1)d, simplify. One drilled procedure.' },
  { re: /^Calculate the amount accumulated/, level: 2, why: 'Identify the compound interest formula and substitute. The setting names every value.' },
  { re: /^Calculate the simple interest earned/, level: 2, why: 'One formula, values given directly.' },
  { re: /^Calculate the sum of the first .* terms of the arithmetic series/, level: 2, why: 'Read a and d off the series, substitute into Sₙ. One formula.' },
  { re: /^Solve for x using the quadratic formula/, level: 2, why: 'The question names the method, so there is no route to choose.' },
  { re: /^Solve for x by factorising/, level: 2, why: 'The question names the method.' },
  { re: /^Factorise fully/, level: 2, why: 'A single well-known procedure.' },
  { re: /^Given f\(x\) = .*ˣ [−+] .*, determine the equation of the horizontal asymptote and the y-intercept/, level: 2, why: 'Two values read off a standard form, neither depending on the other.' },
  { re: /^Given f\(x\) = .*x [−+] .*, determine the x-intercept and y-intercept/, level: 2, why: 'Set y = 0, then x = 0. Two routine substitutions.' },
  { re: /^Determine the x- and y-intercepts of g\(x\) = x²/, level: 2, why: 'Factorise for the x-intercepts, substitute x = 0 for the y-intercept. Both are drilled.' },
  { re: /^Determine the coordinates of the turning point/, level: 2, why: 'Complete the square or use x = −b/2a, both standard.' },
  { re: /^Determine (the derivative of|f′\(x\) if|dy\/dx if)/, level: 2, why: 'The power rule applied term by term.' },
  { re: /^If f\(x\) = .*x[²³] and g\(x\) = f′\(x\), determine g\(/, level: 2, why: 'Differentiate, then substitute. The question states the relationship, so nothing has to be inferred.' },
  { re: /^Determine f′\(x\) from first principles/, level: 2, why: 'Long, but every step is prescribed and the whole thing is drilled. Nothing has to be decided.' },
  { re: /^For the parabola f\(x\) = .*, write down the coordinates of the turning point/, level: 2, why: 'The form hands the turning point over; it is read off, with only the sign of p to handle.' },
  { re: /Using the fundamental counting principle/, level: 2, why: 'Multiply the options together. The question names the principle to use.' },
  { re: /^In (a class|a survey) of .* learners, .* play|^In a survey of .* learners, .* like/, level: 2, why: 'Inclusion and exclusion on two overlapping sets, at 2 marks. One subtraction, in a setting the learner has seen.' },
  { re: /^Determine the .*th term of the geometric sequence/, level: 2, why: 'Find r, substitute into Tₙ = arⁿ⁻¹.' },
]

/**
 * Grade 11 Paper 1. Many archetypes are word-for-word the Grade 12 ones, and
 * take the same level there -- a question does not get harder because it sits
 * in a different paper. The entries below repeat those judgements explicitly
 * rather than importing them, so this list can be read on its own.
 */
export const G11_P1: Archetype[] = [
  // ---- Level 3 ----
  {
    re: /^Determine for which values of x the graph of f\(x\) = .* lies (below|above)/,
    level: 3,
    why: 'Asked about a graph and answered with an inequality. Translating between the two representations is the work.',
  },
  {
    re: /^How many terms are there in the arithmetic sequence/,
    level: 3,
    why: 'The general term is run BACKWARDS: set Tₙ equal to the last term and solve for n.',
  },
  {
    re: /^For which value of k will the equation x² [−+] .* have equal roots/,
    level: 3,
    why: 'Nothing in the question mentions the discriminant. Knowing that equal roots MEANS b² − 4ac = 0 is a connection the learner has to supply.',
  },
  {
    re: /^Solve for x: x² [−+] .*[≤≥<>]/,
    level: 3,
    why: 'Factorising is routine; deciding which interval satisfies the inequality is not, and there is no formula for it.',
  },
  {
    re: /^Two dice are rolled\. Determine the probability that the sum/,
    level: 3,
    why: 'The 36-outcome sample space has to be built before anything can be counted.',
  },
  {
    re: /WITHOUT replacement, determine the probability that the two counters are different colours/,
    level: 3,
    why: 'Two things at once: the draws are dependent, so the second denominator changes, AND "different colours" is two separate cases (red then blue, blue then red) that have to be added. Either omission gives a plausible wrong answer.',
  },
  {
    re: /^The graph of f\(x\) = a ÷ \(x [−+] .*\) [−+] .* passes through the point .* Determine the value of a/,
    level: 3,
    why: 'Working backwards, the same demand as counting the terms of a sequence: substitute a known point to recover an unknown PARAMETER, rather than substituting a value into a finished function. Set up an equation first, solve it second.',
  },
  {
    re: /^Determine T₅, and determine the constant second difference/,
    level: 3,
    why: 'Second differences take two passes of differencing, and the learner has to know that a constant second difference is what identifies a quadratic pattern. Neither part is a formula to apply.',
  },

  // ---- Level 2 ----
  { re: /^Calculate the amount accumulated .* compounded annually, and calculate the total interest earned/, level: 2, why: 'The compound interest formula, then A − P. Two steps, both drilled, in a setting that names every value.' },
  { re: /^Calculate the simple interest earned/, level: 2, why: 'One formula, values given directly.' },
  { re: /^Given f\(x\) = .*ˣ [−+] .*, determine the equation of the horizontal asymptote and the y-intercept, and calculate f\(/, level: 2, why: 'Three reads off a standard form, none depending on another.' },
  { re: /^Determine the coordinates of the turning point of f\(x\) = .*, and determine the y-intercept/, level: 2, why: 'x = −b/2a or completing the square, then one substitution.' },
  { re: /^Given f\(x\) = .*x [−+] .*, determine f\(/, level: 2, why: 'One substitution into a function that is handed over.' },
  { re: /^Determine the x- and y-intercepts of/, level: 2, why: 'Set y = 0, then x = 0. Both are drilled.' },
  { re: /^Determine the .*th term of the arithmetic sequence/, level: 2, why: 'Find d, substitute into Tₙ = a + (n − 1)d.' },
  { re: /^Determine the general term Tₙ for the arithmetic sequence/, level: 2, why: 'Find d, substitute, simplify. One drilled procedure.' },
  { re: /A counter is drawn, replaced, then a second counter is drawn/, level: 2, why: 'With replacement the second draw is unaffected by the first, so it is the multiplication rule in its routine form -- the counterpart of the dependent case, which is Level 3.' },
  { re: /^Solve for x: x² [−+] .*[≤≥<>]/, level: 3, why: 'Duplicate guard: the inequality entry above must win over the factorising entry below.' },
  { re: /^Solve for x using the quadratic formula/, level: 2, why: 'The question names the method, so there is no route to choose.' },
  { re: /^Solve for x by factorising/, level: 2, why: 'The question names the method.' },
  { re: /^Simplify fully:/, level: 2, why: 'Expand two brackets and collect like terms.' },
  { re: /^Determine the equations of the asymptotes of/, level: 2, why: 'Both asymptotes are read off the standard form.' },
  { re: /^Solve for x: x ÷ .* [−+] .* = /, level: 2, why: 'A one-step linear equation.' },
  { re: /^Calculate the sum of the first .* terms of the arithmetic series/, level: 2, why: 'Read a and d off the series, substitute into Sₙ.' },
  { re: /^For the parabola f\(x\) = .*, write down the coordinates of the turning point/, level: 2, why: 'The form hands the turning point over; only the sign of p needs handling.' },
  { re: /Using the (fundamental )?counting principle/, level: 2, why: 'Multiply the options together. The question names the principle to use.' },
  {
    re: /^In a class of .* learners, .* and .* both\. How many learners (like|play) neither/,
    level: 3,
    why: 'Two connected steps and no single formula: inclusion and exclusion to find how many like at least one, then the complement to find how many like neither. Adding the two groups without removing the overlap is the mistake the question is built around. (These already stood at Level 3, and reading them confirms it.)',
  },
]

/** Grade 11 Paper 2: analytical geometry, trigonometry, Euclidean geometry, statistics. */
export const G11_P2: Archetype[] = [
  // ---- Level 3 ----
  {
    re: /^PT is a tangent to a circle at T/,
    level: 3,
    why: 'Two circle theorems chained: the tangent-chord angle gives the angle in the alternate segment, and that angle then feeds the angle-at-the-centre theorem. The second step depends on the first, so a wrong start cannot recover.',
  },
  {
    re: /^O is the centre of a circle, OM ⊥ chord AB/,
    level: 3,
    why: 'Two results combined, neither mentioned in the question: the perpendicular from the centre bisects the chord, which supplies the leg length, and then Pythagoras in the right-angled triangle it creates.',
  },
  {
    re: /^O is the centre of a circle\. Chord AB subtends an angle of .* at O \(on the minor arc side\)/,
    level: 3,
    why: 'The angle at the centre named is on the minor arc, but C sits on the major arc, so the reflex angle has to be worked out first. Applying the theorem to the angle as given produces a confident wrong answer.',
  },
  {
    re: /^The five-number summary of a data set is/,
    level: 3,
    why: 'The IQR, then the fences built from it, then two separate judgements about whether particular values fall outside them. Each step feeds the next and the last two are decisions, not calculations.',
  },
  {
    re: /^Determine whether the points .* are collinear/,
    level: 3,
    why: 'The question asks a yes-or-no question and names no method. The learner has to know that collinear means equal gradients, compute two of them, and then argue from the comparison.',
  },
  {
    re: /^A data set has a mean of .* and a standard deviation of/,
    level: 3,
    why: 'Standardising a value against the mean and spread, then judging it against a stated threshold. The second half is interpretation, which no formula settles.',
  },
  {
    re: /^Prove the identity:/,
    level: 3,
    why: 'A proof has no announced route: the learner decides which side to work from and which identity to bring in. That is reasoning, not a procedure to run.',
  },

  // ---- Level 2 ----
  { re: /Use the sine rule to determine/, level: 2, why: 'The question names the rule and gives every value it needs.' },
  { re: /Use the cosine rule to determine/, level: 2, why: 'The question names the rule; the perimeter afterwards is an addition.' },
  { re: /^Solve for θ, correct to/, level: 2, why: 'Divide, take the inverse ratio, keep the root inside the stated interval.' },
  { re: /^Determine the gradient of the line/, level: 2, why: 'Rearrange into y = mx + c and read m off.' },
  { re: /^Determine the equation of the line passing through/, level: 2, why: 'Gradient formula, then point-gradient form, then one substitution. All three are drilled.' },
  { re: /^Determine the equation of the line perpendicular to/, level: 2, why: 'Negative reciprocal, then point-gradient form.' },
  { re: /^Determine the distance between/, level: 2, why: 'One formula, values given.' },
  { re: /^Determine the midpoint of/, level: 2, why: 'One formula, values given.' },
  { re: /^Triangle ABC has vertices/, level: 2, why: 'Three independent parts -- a length, a midpoint, a gradient -- each its own formula. Long, but nothing connects them.' },
  { re: /^Calculate the mean of the data set/, level: 2, why: 'Add and divide.' },
  { re: /^Determine the median of the data set/, level: 2, why: 'Order the values and take the middle one.' },
  { re: /^Calculate the standard deviation of the data set/, level: 2, why: 'Long, but every step is prescribed and the order never varies.' },
  { re: /^Simplify without using a calculator: (sin|cos|tan)/, level: 2, why: 'One reduction formula, applied to a special angle.' },
  { re: /^Determine the value of (sin|cos|tan) .* × (cos|sin|tan) .* without using a calculator/, level: 2, why: 'Two special-angle values, multiplied.' },
  { re: /^ABCD is a cyclic quadrilateral with angle/, level: 2, why: 'One theorem: opposite angles of a cyclic quadrilateral are supplementary.' },
  { re: /^O is the centre of a circle, and chord AB subtends an angle of .* at the centre/, level: 2, why: 'One theorem, applied in the direction it is usually stated: halve the angle at the centre.' },
  { re: /^Chord AB subtends an angle of .* at C on the circumference/, level: 2, why: 'One theorem: angles in the same segment are equal, so the answer is the angle given.' },
  { re: /^Simplify: \(?(sin|cos)/, level: 2, why: 'Cancel using the quotient identity, then substitute a special angle. Both steps are routine.' },
]
