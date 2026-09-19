/**
 * Level 2 vs Level 3 in Physical Sciences, decided by reading the question.
 *
 * THE LINE. CAPS Level 2 in Physical Sciences is comprehension: one formula,
 * values handed over, one substitution -- or stating and explaining a concept
 * that has been taught. Level 3 is analysis and application: a quantity that
 * has to be DERIVED before the formula can be used, two formulae where the
 * second depends on the first, a sign or direction decision the formula does
 * not make for you, or a calculation with an explanation attached.
 *
 * A unit conversion is NOT enough to make a question Level 3. Converting nm to
 * metres or μC to coulombs is part of competent substitution, and treating it
 * as analysis would promote almost every calculation in the paper -- which
 * would say more about the rule than about the physics.
 *
 * WHAT THIS MEASURES. Applied to Grade 12 Paper 1 it shows that the paper is
 * genuinely short of Level 3 CONTENT, not merely mislabelled. That is a
 * finding, not a failure of the reading: see the commit that acts on it.
 */
import type { Archetype } from './archetypes.mts'

export const PS_G12_P1: Archetype[] = [
  // ---- Level 3 ----
  {
    re: /frequency detected/,
    level: 3,
    why: 'The Doppler formula has a ± in both numerator and denominator, and nothing in the question says which to take. Choosing the signs from the direction of motion is the physics; substituting afterwards is arithmetic.',
  },
  {
    re: /thrown vertically upward.*maximum height/,
    level: 3,
    why: 'The condition that makes it solvable -- velocity is zero at the highest point -- is nowhere in the question. The learner has to supply it before any equation of motion can be chosen.',
  },
  {
    re: /(lock together|the two lock together|push off from each other|collides head-on|collides with stationary)/,
    level: 3,
    why: 'Conservation of momentum with the unknown on the wrong side: write the total before, the total after, equate, then rearrange. Direction enters as a sign, and getting it wrong still produces a number.',
  },
  {
    re: /Calculate the average force exerted/,
    level: 3,
    why: 'Two steps: the change in momentum first, then dividing by the time. The change is a subtraction of vectors, so the sign of the final velocity decides the answer.',
  },
  {
    re: /^Using the circuit in the previous question/,
    level: 3,
    why: 'Two quantities, each needing its own relationship, drawn from one circuit -- and the terminal voltage has to be understood as emf minus the drop across the internal resistance, which is a model of the battery rather than a formula.',
  },
  {
    re: /brakes to a stop over a distance/,
    level: 3,
    why: 'The work-energy theorem gives the work from the change in kinetic energy, and only then does W = Fd give the force. The second part cannot start until the first is finished.',
  },
  {
    re: /net electric field/,
    level: 3,
    why: 'Two fields calculated separately and then combined as VECTORS. Whether they add or subtract depends on the signs of the charges and the point chosen, which no formula settles.',
  },
  {
    re: /Calculate the average power/,
    level: 3,
    why: 'Power needs the work first, and the work needs the weight and the height. Three quantities chained, none of them the one the question names.',
  },
  {
    re: /(rms voltage|maximum voltage of).*(Calculate|calculate).*explain/,
    level: 3,
    why: 'A calculation and then a reason for it. The explanation is about what rms MEANS, which is a concept the number alone does not reach.',
  },
  {
    re: /(slides from rest down a (frictionless )?.* incline onto a rough|ascends .* at constant velocity|accelerates from rest to .* on a level road)/,
    level: 3,
    why: 'Energy is tracked across a change of conditions -- from frictionless to rough, or against gravity while moving at constant velocity. The learner has to decide which energies are in play before any formula applies.',
  },

  {
    re: /(thrown vertically upward at [^.]*from the (edge|top) of|from the ground at the same instant|At the same instant, a second)/,
    level: 3,
    why: 'Two phases of motion, or two bodies, sharing one clock. The learner has to set a sign convention and hold it while the object passes back through its starting height, or has to realise that two separate motions meet at one time.',
  },
  {
    re: /(collides with cart|throws a .* tool away|is brought to rest by a resultant force)/,
    level: 3,
    why: 'Momentum before equals momentum after, with the unknown inside the sum and direction carried as a sign. Recoil from rest is the same idea read backwards: a total of zero before means the two momenta after must cancel.',
  },
  {
    re: /A third charge of .* is placed/,
    level: 3,
    why: 'Two forces on the third charge, each from a different source, combined as vectors. Which way each one points has to be settled from the signs before any adding happens.',
  },
  {
    re: /(Calculate its threshold wavelength|Calculate the threshold frequency)/,
    level: 3,
    why: 'Two relationships in sequence: the work function gives the threshold frequency through W₀ = hf₀, and only then does c = fλ give the wavelength. Neither formula alone reaches the answer.',
  },
  {
    re: /(A pump (raises|lifts) .* water|per minute)/,
    level: 3,
    why: 'The work comes from the weight and the height, the power from the work and the time, and the rate has to be converted to a mass per second first. Three steps, none of them named.',
  },
  {
    re: /(moves (away from|toward)|approaching a stationary|siren emits sound|sounds its horn)/,
    level: 3,
    why: 'The Doppler formula has a ± in both numerator and denominator, and the direction of motion decides both. That decision is the question.',
  },

  // ---- Level 2 ----
  { re: /Calculate the magnitude of the electrostatic force between them/, level: 2, why: "Coulomb's law, one substitution. The conversion from μC is routine." },
  { re: /Calculate the magnitude of the electric field at a point/, level: 2, why: 'E = kQ/r², one substitution, one charge.' },
  { re: /Calculate the energy of a photon/, level: 2, why: 'E = hc/λ, one substitution. Converting nm to metres is part of substituting, not analysis.' },
  { re: /Calculate its work function/, level: 2, why: 'W₀ = hf₀, one substitution.' },
  { re: /maximum kinetic energy of the emitted photoelectrons/, level: 2, why: 'One subtraction, with both energies handed over by the question.' },
  { re: /Calculate the current in the circuit/, level: 2, why: 'I = ε/(R + r). Adding the two resistances is part of reading the circuit, not a separate step.' },
  { re: /Calculate the equivalent resistance/, level: 2, why: 'One formula for the combination named, applied as taught.' },
  { re: /Calculate the magnitude of the emf induced/, level: 2, why: 'ε = −N ΔΦ/Δt, and the formula itself names ΔΦ, so working it out is reading the formula.' },
  { re: /transformer has .* turns/, level: 2, why: 'One ratio, in the direction the question states.' },
  { re: /(Calculate its velocity after|Calculate the time it takes to reach the ground|Calculate its speed just before it lands|calculate the speed of the ball just before it hits)/, level: 2, why: 'One equation of motion, chosen from the values given and applied once.' },
  { re: /conservation of mechanical energy/, level: 2, why: 'The question names the principle to use, so the only work left is equating two energies and rearranging.' },
  { re: /Calculate its kinetic energy just before it lands/, level: 2, why: 'The kinetic energy at the bottom equals the potential energy at the top, mgh -- a single substitution once that is known.' },
  { re: /Calculate its velocity\.$/, level: 2, why: 'Rearranging Ek = ½mv² for v. One formula.' },
  { re: /Calculate the work done by the worker/, level: 2, why: 'W = Fd, force and distance both along the motion and both given.' },
  { re: /Calculate the momentum of (a|the)/, level: 2, why: 'p = mv, with the direction stated in the question and simply carried into the answer.' },
  { re: /A frictional force of .* opposing/, level: 2, why: 'W = Fd with a negative sign because the force opposes the motion. One formula, one sign.' },
  { re: /power output of .* kW while the car travels at a constant/, level: 2, why: 'P = Fv rearranged once; the kW conversion is routine.' },
  { re: /^Calculate the work done in lifting/, level: 2, why: 'W = mgh, every value given.' },
  { re: /^Using the same ball as (in )?the previous question/, level: 2, why: 'One equation of motion, with the initial velocity handed over by the question it follows.' },
  { re: /reaches a speed of .* just before/, level: 2, why: 'One equation of motion, rearranged for the height.' },
  { re: /^A stone is dropped from rest from the top of a .* building/, level: 2, why: 'One equation of motion from rest.' },
  { re: /^Briefly explain the energy conversion/, level: 2, why: 'Naming the energy conversion in two familiar devices. Recall of a taught idea.' },
  { re: /shines on the metal from the previous question/, level: 2, why: 'One subtraction, with both energies handed over.' },
  { re: /^(Explain|State|Distinguish|Name|Define)/, level: 2, why: 'Recall or comprehension of a taught concept, stated back. No calculation and no new context.' },
]

/** Grade 11 Paper 1: mechanics, electrostatics, electric circuits, waves and optics. */
export const PS_G11_P1: Archetype[] = [
  // ---- Level 3 ----
  {
    re: /net force on Q₂ due to Q₁ and Q₃/,
    level: 3,
    why: 'Two Coulomb forces on the same charge, each worked out separately and then combined as VECTORS. The signs of the outer charges decide whether they add or oppose, and no formula makes that decision.',
  },
  {
    re: /third force, F₃, required to keep the object in equilibrium/,
    level: 3,
    why: 'Equilibrium means the resultant is zero, so the answer is the resultant of the first two forces REVERSED. Two stages, and the reversal is a step the learner has to know to take.',
  },
  {
    re: /the acceleration of the system, and \(b\) the tension in the string/,
    level: 3,
    why: 'Two connected bodies and two unknowns: Newton’s second law on the system gives the acceleration, and only then does the law applied to one body alone give the tension. Neither can be found without the other.',
  },
  {
    re: /combined series-parallel circuit/,
    level: 3,
    why: 'The parallel group has to be identified and reduced before the series addition can happen. Reading the circuit is the work; the arithmetic afterwards is easy.',
  },
  {
    re: /coefficient of kinetic friction/,
    level: 3,
    why: 'Three stages: resolve the weight along and perpendicular to the slope, use the perpendicular component to get the normal force and hence the friction, and only then apply Newton’s second law along the slope.',
  },
  {
    re: /Calculate the magnitude and direction of the resultant force/,
    level: 3,
    why: 'Magnitude by Pythagoras and direction by trigonometry, then the direction has to be stated as a bearing or an angle from a named axis. The answer is a vector, not a number.',
  },
  {
    re: /whether total internal reflection takes place/,
    level: 3,
    why: 'Two conditions to state, then a critical angle to calculate, then a comparison that decides the answer. The calculation only matters because of the comparison it feeds.',
  },
  {
    re: /Calculate the component of .*weight/,
    level: 3,
    why: 'The angle of the incline has to be transferred into the weight triangle before mg sin θ can be written down. Knowing WHY it is sin and not cos is the whole question, and it is the step Grade 11 learners most often get backwards.',
  },
  {
    re: /connected in series to an? .* battery\. Calculate \(a\) the total resistance/,
    level: 3,
    why: 'The current cannot be found until the total resistance has been, so the two parts are a chain rather than a pair. The same shape as the parallel-then-current questions elsewhere in the paper.',
  },

  {
    re: /(current-carrying conducting rod|Two parallel, current-carrying conductors)/,
    level: 3,
    why: 'The motor effect applied to a particular geometry: the field direction, the current direction and the resulting force direction all have to be worked out and then combined by the left-hand rule. Nothing here is a formula to substitute into.',
  },
  {
    re: /loudspeaker around the corner/,
    level: 3,
    why: 'Two wavelengths diffracting through the same gap, compared, to explain something heard in the real world. Applying the model to an unfamiliar situation rather than reciting it.',
  },

  // ---- Level 2 ----
  { re: /Calculate the magnitude of the electric field at a point/, level: 2, why: 'E = kQ/r², one charge, one substitution.' },
  { re: /Calculate the magnitude of the electrostatic force between them/, level: 2, why: "Coulomb's law, one substitution." },
  { re: /Use Newton\u2019s Second Law to explain/, level: 2, why: 'A taught explanation, retold.' },
  { re: /(A wave of constant speed passes through a gap|A tank of water is used to generate straight wavefronts)/, level: 2, why: 'Describing what is observed in the standard ripple-tank demonstration.' },
  { re: /Calculate the horizontal \(Fx\) and vertical \(Fy\) components/, level: 2, why: 'Two independent substitutions into F cos θ and F sin θ, with the angle measured from the horizontal exactly as the formulas assume.' },
  { re: /connected in parallel\. Calculate the equivalent resistance/, level: 2, why: 'One formula for the combination named, applied as taught.' },
  { re: /Calculate the number of excess electrons/, level: 2, why: 'n = Q/e, one division.' },
  { re: /Calculate the (magnitude of the net force|.{0,24}acceleration|mass of the crate)\./, level: 2, why: "Newton's second law, rearranged once -- for the acceleration, the force or the mass, whichever is missing." },
  { re: /Calculate the angle of refraction/, level: 2, why: "Snell's law with both refractive indices given, rearranged for one angle." },
  { re: /Use?(ing)? Huygens/i, level: 2, why: 'Explaining diffraction with the model as it was taught. Comprehension of a standard account, not application to anything unfamiliar.' },
  { re: /Use Newton’s Third Law to explain/, level: 2, why: 'A taught explanation, retold. The pairs named are the textbook examples.' },
  { re: /^(Explain|State|Describe|Distinguish|Compare|Name|Define|List)/, level: 2, why: 'Recall or comprehension of a taught concept, stated back.' },
]

/**
 * Grade 10 Paper 2: matter and materials, and chemical change.
 *
 * The line here is the same one, read for chemistry. Level 2 is the taught
 * account retold: describe metallic bonding and explain malleability with it,
 * or say what the kinetic molecular theory says about a solid, a liquid and a
 * gas. Those explanations are in every textbook, so producing one is
 * comprehension. Level 3 is the model applied to something the learner has not
 * been handed -- a particular apparatus, a comparison between two changes, a
 * mixture whose separation has to be designed, or a calculation that works
 * backwards from a measurement.
 */
export const PS_G10_P2: Archetype[] = [
  // ---- Level 3 ----
  {
    re: /Describe, giving reasons, the sequence of separation techniques/,
    level: 3,
    why: 'A procedure has to be designed for this particular mixture and then justified. Which technique comes first depends on what is soluble, what floats and what is magnetic, and getting the order wrong makes the later steps impossible.',
  },
  {
    re: /it decomposes completely to form .* g of a solid metal oxide/,
    level: 3,
    why: 'The gas escapes, so the mass lost IS the mass of carbon dioxide. The calculation runs backwards from what is left to what was there, which is conservation of mass used as a tool rather than stated.',
  },
  {
    re: /^Naturally occurring \w+ consists of two isotopes/,
    level: 3,
    why: 'A weighted average, not a plain one: each isotopic mass is weighted by its abundance before anything is divided. Averaging the two masses directly is the mistake, and it gives an answer that looks reasonable.',
  },
  {
    re: /^Calculate the relative atomic mass of/,
    level: 3,
    why: 'The same weighted average, worked from the abundances given in the question it follows.',
  },
  {
    re: /observable indicators that a chemical reaction/,
    level: 3,
    why: 'Three indicators recalled, but then an everyday example found for each -- and a DIFFERENT one each time. The examples are not in the question, so they have to be supplied and matched.',
  },
  {
    re: /justify this classification/,
    level: 3,
    why: 'A classification plus the argument for it, applied to a case that sits on the boundary. The justification is the marks.',
  },
  {
    re: /(when the plunger of the syringe is pushed|as its temperature rises|more energy to boil a given mass|can be compressed (relatively easily|much more easily)|as it is heated and (boils|melts))/,
    level: 3,
    why: 'The particle model applied to a particular apparatus or to a comparison between two changes, rather than recited for the three states. The learner has to decide which part of the model is doing the work.',
  },
  {
    re: /^When .* is heated, it decomposes to form/,
    level: 3,
    why: 'The equation is given, but the observations have to be predicted from it and the mass change explained by the gas leaving the system. Reading a reaction forwards into what would be seen is application, not recall.',
  },
  {
    re: /^Hydrogen peroxide( solution)? decomposes into water and oxygen/,
    level: 3,
    why: 'Same demand: predict what would be observed from the equation, and account for it in terms of the gas produced.',
  },

  {
    re: /Using the electronegativity values given/,
    level: 3,
    why: 'A rule applied to specific pairs: the difference has to be worked out for each pair and then read against the thresholds that separate non-polar covalent, polar covalent and ionic. The classification follows from the arithmetic, not from recall.',
  },
  {
    re: /Using periodic trends only/,
    level: 3,
    why: 'Reasoning from the trends rather than looking anything up. The learner has to know which way the trend runs AND why, and then apply it to the particular elements named.',
  },
  {
    re: /^(Potassium and lithium|Sodium and potassium|Magnesium and calcium) both belong to Group/,
    level: 3,
    why: 'A comparison decided by position in the table: which atom is larger, which loses an electron more readily, and the reason in terms of shells and shielding.',
  },
  {
    re: /^(An unknown element|Element) [A-Z] (is|does not|has)/,
    level: 3,
    why: 'Evidence to conclusion: a list of observed properties, from which the element has to be classified as a metal, a non-metal or a metalloid, and the classification defended from the evidence given.',
  },

  {
    re: /reacts completely with .* to form/,
    level: 3,
    why: 'Conservation of mass used as a tool: the masses that react must account for the mass produced, so the missing one is found by difference. Nothing in the question says to do that.',
  },
  {
    re: /(are next to each other in the periodic table|are both in (Group|Period) )/,
    level: 3,
    why: 'Two elements compared by position, with the trend in atomic size, ionisation energy or reactivity explained in terms of shells and nuclear charge. The comparison and the reason are both the learner\u2019s to supply.',
  },
  {
    re: /^Substance [A-Z] (has|is) /,
    level: 3,
    why: 'Properties given, bonding type to be deduced: conducting when molten but not when solid points to an ionic lattice, conducting in both states to a metallic one. Evidence to conclusion.',
  },
  {
    re: /(Perfume sprayed in one corner|Sketch, in words, how the temperature)/,
    level: 3,
    why: 'The particle model applied to something outside the textbook diagram -- a smell crossing a room, or a cooling curve whose plateau has to be predicted and then accounted for.',
  },

  // ---- Level 2 ----
  { re: /^Describe metallic bonding/, level: 2, why: 'The standard account of a lattice of positive ions in a sea of delocalised electrons, and the textbook explanation of the property named. Comprehension of taught material.' },
  { re: /^(Using the kinetic molecular theory|Using electron dot|A (gas|liquid) is cooled until it)/, level: 2, why: 'The taught account of how particles are arranged and move in a solid, a liquid and a gas, retold. Nothing unfamiliar to apply it to.' },
  { re: /^An element [A-Z] is located in Group/, level: 2, why: 'Reading structure off the position in the table, which is what the table is for.' },
  { re: /^Write the full electron configuration/, level: 2, why: 'Filling the sub-shells in the standard order.' },
  { re: /^(Classify EACH|For EACH sample)/, level: 2, why: 'Sorting given examples into categories that have been defined in class.' },
  { re: /^An atom of \w+ has an atomic number of/, level: 2, why: 'Protons from the atomic number, neutrons from the difference, electrons equal to protons in a neutral atom.' },
  { re: /^Determine the number of protons, neutrons, and electrons/, level: 2, why: 'Read off the atomic and mass numbers, subtract once.' },
  { re: /(can be (mixed together|dissolved in water|separated (using|by))|can be stirred together|always consists of|Why is air classified)/, level: 2, why: 'The textbook examples of the mixture-and-compound distinction, used to state which is which.' },
  { re: /^\(a\) Name this process/, level: 2, why: 'Name the phase change, then give the taught particle account of it.' },
  { re: /^(Explain|State|Describe|Distinguish|Compare|Name|Define|List|Write|Give|Draw)/, level: 2, why: 'Recall or comprehension of a taught concept, stated back.' },
]
