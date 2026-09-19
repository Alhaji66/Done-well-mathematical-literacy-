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
