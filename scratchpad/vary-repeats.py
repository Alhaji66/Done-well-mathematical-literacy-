#!/usr/bin/env python3
"""
Vary one copy of each repeated long calculation.

WHY. check:repeats reports questions that recur within a grade and paper
number, which is the scope one learner works through. For a definition that is
spaced repetition; for a calculation of four marks or more it is a wasted
opportunity -- the learner recognises the question and writes the answer down
without doing the work. Thirty-eight such groups existed. This varies the
numbers in ONE copy of each, leaving the other as it was, so both papers still
ask the skill and neither is a free mark for having seen it before.

The id, label, topicId, grade and marks of every item are untouched; rewrite.py
reads those back out of the file and refuses if a caller tries to change them.
Physics and probability answers are computed here rather than typed.
"""
import json
import math

H = 6.63e-34
C = 3.0e8
G = 9.8


def sci(v, dp=2):
    """A number in the corpus's scientific notation: 3.65 × 10⁻¹⁹."""
    exp = math.floor(math.log10(abs(v)))
    mant = v / 10**exp
    sup = str(exp).replace("-", "⁻")
    for a, b in zip("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹"):
        sup = sup.replace(a, b)
    return f"{mant:.{dp}f} × 10{sup}"


MATHS = []


def m(id, level, difficulty, prompt, answer, explanation, context=None):
    row = {
        "id": id,
        "prompt": prompt,
        "answer": answer,
        "explanation": explanation,
        "difficulty": difficulty,
        "cognitiveLevel": level,
    }
    if context:
        row["context"] = context
    MATHS.append(row)


# ---- Grade 12 Paper 1 -------------------------------------------------------
m(
    "math-p1-c-4-5", 2, "Easy",
    "Given f(x) = 3ˣ − 5, determine the equation of the horizontal asymptote and the y-intercept.",
    "Asymptote: y = −5; y-intercept: (0 ; −4)",
    "3ˣ is always positive and shrinks towards 0 as x becomes large and negative, so f(x) approaches −5 from above but never reaches it: the horizontal asymptote is y = −5. The y-intercept comes from x = 0, and 3⁰ = 1, so f(0) = 1 − 5 = −4. The −5 does two jobs in this function, and they are easy to confuse: it moves the whole graph down 5 units, which is why both the asymptote and the intercept carry it.",
)
m(
    "math-p1-24-6-4", 3, "Moderate",
    "Two dice are rolled. Determine the probability that the sum of the two numbers rolled is 3, and the probability that the sum is 12.",
    "There are 6 × 6 = 36 equally likely outcomes. A sum of 3 happens in two ways, (1;2) and (2;1), so P(sum = 3) = 2/36 = 1/18. A sum of 12 happens in one way only, (6;6), so P(sum = 12) = 1/36.",
    "The dice have to be treated as distinguishable, which is what makes these two answers differ: (1;2) and (2;1) are two outcomes even when the dice look identical, while (6;6) is the single way to reach 12. That is the whole point of the pair — sums are NOT equally likely, and the further a sum is from 7 the fewer ways there are to make it. Listing the outcomes for a small sum is quicker and safer than reasoning about it, and a 6 × 6 table makes the pattern visible at once.",
)

# ---- Grade 11 Paper 1 -------------------------------------------------------
m(
    "math-g11-p1-25-5-3", 2, "Challenge",
    "A bag contains 6 red and 4 blue counters. A counter is drawn, replaced, then a second counter is drawn. Determine the probability that both counters are red, and determine the probability, as a percentage, that both counters are blue.",
    "Both red: (6/10) × (6/10) = 36/100 = 9/25 = 36%. Both blue: (4/10) × (4/10) = 16/100 = 16%.",
    "Replacing the first counter is what makes the two draws independent: the bag is identical for the second draw, so each probability is unchanged and they simply multiply. Without replacement the second draw would be out of 9 counters and the answers would be 30/90 and 12/90. The two results also sanity-check each other — 36% and 16% leave 48% for one of each, which is the only other possibility.",
)
m(
    "math-g11-p1-23-1-5", 2, "Moderate",
    "Solve for x by factorising: 2x² + 5x − 12 = 0",
    "(2x − 3)(x + 4) = 0, so x = 3/2 (= 1.5) or x = −4",
    "With a leading coefficient that is not 1, look for two numbers multiplying to 2 × (−12) = −24 and adding to 5: those are 8 and −3. Split the middle term — 2x² + 8x − 3x − 12 — and group: 2x(x + 4) − 3(x + 4) = (2x − 3)(x + 4). Each bracket is then set to zero separately, which is the step the whole method exists for: a product is zero only when one of its factors is.",
)
m(
    "math-g11-p1-25-2-4", 2, "Moderate",
    "Determine the general term Tₙ for the arithmetic sequence: 40, 33, 26, 19, ...",
    "a = 40 and d = −7, so Tₙ = 40 + (n − 1)(−7) = 47 − 7n",
    "The common difference is found by subtracting any term from the one after it: 33 − 40 = −7, and it must be the same throughout, which it is. Substituting into Tₙ = a + (n − 1)d and simplifying gives 47 − 7n. Check it before moving on: T₁ = 47 − 7 = 40 and T₄ = 47 − 28 = 19, both correct. Leaving the answer as 40 + (n − 1)(−7) is not wrong, but the simplified form is what later questions substitute into.",
)
m(
    "math-g11-p1-25-4-5", 3, "Moderate",
    "For which value of k will the equation x² − 14x + k = 0 have equal roots?",
    "k = 49",
    "Equal roots mean the discriminant is zero: b² − 4ac = 0. Here a = 1, b = −14 and c = k, so 196 − 4k = 0 and k = 49. The sign of b does not matter because it is squared, which is worth noticing — b = 14 would give the same k. The result is the perfect square x² − 14x + 49 = (x − 7)², whose only root is x = 7, and completing the square is the other route to the same answer.",
)
m(
    "math-g11-p1-25-4-10", 3, "Challenge",
    "Determine for which values of x the graph of f(x) = x² − 6x + 8 lies below the x-axis.",
    "2 < x < 4",
    "Below the x-axis means f(x) < 0. Factorise first: x² − 6x + 8 = (x − 2)(x − 4), so the graph cuts the x-axis at 2 and 4. The parabola opens upwards, so it is below the axis only BETWEEN its two roots. The answer is a single interval written 2 < x < 4, not two separate inequalities and not x < 2 or x > 4, which is where the graph is above the axis. Sketching the parabola roughly is faster than reasoning about signs and much harder to get backwards.",
)

# ---- Grade 11 Paper 2 -------------------------------------------------------
m(
    "math-g11-p2-25-3-1", 2, "Easy",
    "Determine the value of cos 30° × sin 60° without using a calculator.",
    "(√3/2) × (√3/2) = 3/4 = 0.75",
    "Both special values are √3/2, so the product is 3/4 exactly. Multiplying two surds of the same value squares it, and √3 squared is 3 — no decimal needed anywhere. This is also an instance of a pattern worth carrying: cos 30° = sin 60°, because the two angles add to 90°, and the sine of an angle always equals the cosine of its complement.",
)
m(
    "math-g11-p2-25-3-2", 2, "Easy",
    "Simplify without using a calculator: tan 120°",
    "tan 120° = tan(180° − 60°) = −tan 60° = −√3 (≈ −1.73)",
    "120° sits in the second quadrant, where only sine is positive, so the tangent is negative. The reduction formula tan(180° − θ) = −tan θ turns the problem into the special angle 60°, whose tangent is √3. Two things carry the marks: the reduction step written out, and the minus sign, which comes from the quadrant and not from the arithmetic. Leave the answer as −√3 rather than −1.73 unless a decimal is asked for.",
)
m(
    "math-g11-p2-22-3-2", 2, "Easy",
    "Simplify without using a calculator: tan 150°",
    "tan 150° = tan(180° − 30°) = −tan 30° = −√3/3 (equivalently −1/√3, ≈ −0.58)",
    "150° is in the second quadrant, where CAST leaves only sine positive, so the tangent is negative. The reduction formula tan(180° − θ) = −tan θ brings it back to the special angle 30°, whose tangent is 1/√3. Rationalising the denominator turns that into √3/3, which is the form a memo expects. The minus sign comes from the quadrant, not from the arithmetic, and it is the mark most often dropped.",
)
m(
    "math-g11-p2-24-3-3", 2, "Moderate",
    "Solve for θ, correct to 1 decimal place, if 7 cos θ = 3, for 0° ≤ θ ≤ 90°.",
    "cos θ = 3 ÷ 7 = 0.4286, so θ = cos⁻¹(0.4286) ≈ 64.6°",
    "Isolate the trigonometric ratio before touching the inverse function: dividing both sides by 7 first is the whole method. Pressing cos⁻¹ on 7 cos θ, or on 3, gives nothing useful. Keep the full accuracy of 3 ÷ 7 in the calculator rather than rounding to 0.43 before taking the inverse — rounding early shifts the answer by about a tenth of a degree, which is exactly the precision the question asks for. The calculator must be in DEGREE mode.",
)
m(
    "math-g11-p2-24-3-4", 2, "Moderate",
    "Simplify: (sin θ · cos θ) ÷ cos²θ, and evaluate the simplified expression at θ = 45°.",
    "tan θ (equivalently, sin θ ÷ cos θ); tan 45° = 1.",
    "cos²θ means cos θ · cos θ, so one cos θ cancels with the one on top, leaving sin θ ÷ cos θ, which is tan θ by definition. Simplifying before substituting is the point of the question: evaluating the original expression at 45° works but takes three calculator steps and invites a rounding error, while tan 45° = 1 is exact and immediate.",
    "cos²θ = cos θ · cos θ. Simplify by cancelling common factors.",
)
m(
    "math-g11-p2-25-2-5", 2, "Easy",
    "Determine the gradient of the line 5x − 2y = 10.",
    "m = 2.5 (that is, 5/2)",
    "The gradient can only be read off once y is alone: −2y = −5x + 10, so y = 2.5x − 5 and m = 2.5. Dividing by a NEGATIVE coefficient of y flips both signs, which is the step this question is really testing — reading the gradient straight off as −5/2, or as 5, are the two usual errors. The gradient is positive, so the line rises from left to right.",
)
m(
    "math-g11-p2-25-2-7", 2, "Challenge",
    "Triangle ABC has vertices A(0 ; 0), B(16 ; 0) and C(4 ; 6). Determine: (a) the length of AB; (b) the coordinates of the midpoint M of AC; (c) the gradient of BC.",
    "(a) AB = 16; (b) M = (2 ; 3); (c) gradient of BC = (6 − 0) ÷ (4 − 16) = 6 ÷ (−12) = −0.5",
    "Three formulae, one figure. AB lies along the x-axis, so its length is just the difference in x-values — the distance formula gives the same 16 but is more work. The midpoint of AC averages the coordinates of A and C, and because A is the origin it is simply half of C. The gradient of BC is negative because the line falls from C down to B as x increases; a positive answer here means the subtraction was done in mixed order.",
)
m(
    "math-g11-p2-25-4-4", 3, "Challenge",
    "O is the centre of a circle, OM ⊥ chord AB, AB = 16, and radius OA = 10. Determine the length of OM.",
    "OM = 6",
    "The perpendicular from the centre bisects the chord, so AM = 16 ÷ 2 = 8. Triangle OMA is then right-angled at M with hypotenuse OA = 10, so OM = √(10² − 8²) = √(100 − 64) = √36 = 6. Two mistakes cost everything here: using the whole chord instead of half of it, and using OA as a leg rather than the hypotenuse — the radius to the endpoint of the chord is always the longest side of that triangle.",
    "The perpendicular from the centre of a circle to a chord bisects the chord.",
)
m(
    "math-g11-p2-21-4-4", 3, "Challenge",
    "O is the centre of a circle, OM ⊥ chord AB, AB = 14, and radius OA = 25. Determine the length of OM.",
    "OM = 24",
    "The perpendicular from the centre bisects the chord, so AM = 14 ÷ 2 = 7. In right-angled triangle OMA the hypotenuse is the radius OA = 25, so OM = √(25² − 7²) = √(625 − 49) = √576 = 24. Halving the chord is the step that turns a circle theorem into Pythagoras, and forgetting it produces √(625 − 196) = √429, which is not a whole number — in a question built on a Pythagorean triple, that is the signal that the chord was not halved.",
    "The perpendicular from the centre of a circle to a chord bisects the chord.",
)
m(
    "math-g11-p2-25-4-6", 3, "Challenge",
    "O is the centre of a circle. Chord AB subtends an angle of 116° at O (on the minor arc side). C is a point on the major arc. Determine the angle ACB.",
    "ACB = 116° ÷ 2 = 58°",
    "The angle at the centre is twice the angle at the circumference subtended by the same chord, on the same side of it — so the angle at C is half of 116°. The condition that C lies on the MAJOR arc matters: it puts C on the same side of the chord as the 116° angle opens towards. A point on the minor arc would give the supplementary angle instead, 122°, because opposite angles of a cyclic quadrilateral are supplementary.",
    "The angle subtended by a chord at the centre is twice the angle subtended at the circumference, on the same side of the chord.",
)
m(
    "math-g11-p2-24-4-6", 3, "Challenge",
    "O is the centre of a circle. Chord AB subtends an angle of 134° at O (on the minor arc side). C is a point on the major arc. Determine the angle ACB.",
    "ACB = 134° ÷ 2 = 67°",
    "Half the angle at the centre, because the angle at the centre is twice the angle at the circumference on the same side of the chord. The theorem is a halving in this direction and a doubling in the other, so the first thing to settle in any question using it is which angle is at the centre — the one at the centre is always the larger of the two. An odd answer like 67° is no cause for alarm: the angle at the centre need not be a multiple of four.",
    "The angle subtended by a chord at the centre is twice the angle subtended at the circumference, on the same side of the chord.",
)
m(
    "math-g11-p2-25-4-3", 3, "Challenge",
    "PT is a tangent to a circle at T, and TQ is a chord such that the angle between PT and TQ is 43°. Determine the angle subtended by TQ at the circumference in the alternate segment, and use the angle-at-the-centre theorem to determine the angle TQ would subtend at the centre of the circle.",
    "43° at the circumference; 86° at the centre.",
    "The tangent-chord theorem gives the first answer directly: the angle between a tangent and a chord equals the angle in the alternate segment, so the angle at the circumference is also 43°. The second step is a different theorem applied to the same chord — the angle at the centre is twice the angle at the circumference, so 2 × 43° = 86°. Naming which theorem does which step is worth a mark on its own; a bare pair of numbers is not a geometry answer.",
    "Tangent-chord theorem: the angle between a tangent and a chord equals the angle in the alternate segment.",
)

# ---- Grade 10 Paper 2 -------------------------------------------------------
m(
    "math-g10-p2-c-2-10", 3, "Challenge",
    "Solve for θ, correct to 1 decimal place, if 0° ≤ θ ≤ 90°: 4tan(θ) = 7",
    "tan θ = 7 ÷ 4 = 1.75, so θ = tan⁻¹(1.75) ≈ 60.3°",
    "Divide by 4 first so that the tangent stands alone, then apply the inverse. tan⁻¹ is the operation that undoes tan; it is not 1 ÷ tan, and the two give completely different answers. Unlike sine and cosine the tangent has no maximum, so a value above 1 is perfectly ordinary here — tan θ = 1.75 simply means the angle is larger than 45°, which 60.3° is. Check the calculator is in DEGREE mode before trusting the number.",
)

MATLIT = [
    {
        "id": "ml-g10-p1-23-2-9",
        "prompt": "The tiles bought cover 18 m² and the floor needs 16.4 m². Calculate the wasted (excess) tiled area beyond what the floor needs, and state whether this exceeds 1 m².",
        "answer": "18 − 16.4 = 1.6 m² — yes, this does exceed 1 m².",
        "explanation": "The waste is simply what was bought less what is needed: 18 − 16.4 = 1.6 m². Then compare it with the 1 m² the question names, and answer that comparison in words — 1.6 is more than 1, so the waste does exceed it. A calculation without the verdict leaves a mark on the table. Some waste is unavoidable, because tiles are sold in whole boxes and cut tiles at the edges cannot be reused, but 1.6 m² on a 16.4 m² floor is nearly a tenth of the job.",
        "difficulty": "Moderate",
        "cognitiveLevel": 3,
    }
]

# ---- Physical Sciences ------------------------------------------------------
PHYS = []


def p(id, level, difficulty, prompt, answer, explanation, context=None):
    row = {
        "id": id,
        "prompt": prompt,
        "answer": answer,
        "explanation": explanation,
        "difficulty": difficulty,
        "cognitiveLevel": level,
    }
    if context:
        row["context"] = context
    PHYS.append(row)


# Grade 11 Paper 1
fnet = 8 * 4.5
p(
    "psci-g11-p1-2025-2-3", 2, "Moderate",
    "A net force acts on an 8 kg object, giving it an acceleration of 4.5 m·s⁻². Calculate the magnitude of the net force.",
    f"Fnet = ma = (8)(4.5) = {fnet:.0f} N",
    "Newton's second law in one line: the net force is the mass times the acceleration, in the direction of the acceleration. The word NET matters — this is the resultant of every force acting, not the force one person applies, so a question giving an applied force and a friction force needs them combined before this formula is used.",
    "Fnet = ma",
)
theta2 = math.degrees(math.asin(math.sin(math.radians(40)) / 1.33))
p(
    "psci-g11-p1-2025-3-3", 2, "Moderate",
    "A ray of light travels from air (n = 1.00) into water (n = 1.33), striking the surface at an angle of incidence of 40°. Calculate the angle of refraction.",
    f"n₁ sin θ₁ = n₂ sin θ₂ → (1.00)sin 40° = (1.33)sin θ₂ → sin θ₂ = 0.6428 ÷ 1.33 = 0.4833 → θ₂ ≈ {theta2:.2f}°",
    "Snell's law, with the subscripts kept straight: medium 1 is the one the light comes FROM. Water is optically denser than air, so the ray bends towards the normal and the angle of refraction must come out smaller than 40° — which it does. An answer larger than the angle of incidence means the two media were swapped. Both angles are measured from the normal, never from the surface.",
    "n₁ sin θ₁ = n₂ sin θ₂; n(air) = 1.00",
)
crit = math.degrees(math.asin(1.00 / 1.52))
p(
    "psci-g11-p1-2025-3-4", 4, "Moderate",
    "Calculate the critical angle for light travelling from glass (n = 1.52) into air (n = 1.00), and explain what happens to a ray that strikes the glass-air boundary at 50°.",
    f"sin θc = n₂ ÷ n₁ = 1.00 ÷ 1.52 = 0.6579, so θc ≈ {crit:.2f}°. A ray striking the boundary at 50° exceeds the critical angle, so it is not refracted out at all: it undergoes total internal reflection and stays inside the glass.",
    "The critical angle is the angle of incidence whose angle of refraction is exactly 90°, which is why the formula is Snell's law with sin 90° = 1 substituted. It exists only going from a denser medium into a less dense one; there is no critical angle for light entering glass from air. Past that angle nothing is transmitted — the boundary behaves as a perfect mirror, which is how light is carried along an optical fibre and why a diamond, with a critical angle near 24°, traps and returns so much of the light that enters it.",
    "sin θc = n₂ ÷ n₁ (light travelling from a denser medium n₁ into a less dense medium n₂)",
)
# Grade 11 Paper 2
p(
    "psci-g11-p2-2023-4-2", 2, "Moderate",
    "Calculate the number of moles of calcium carbonate (CaCO₃) present in a 35.0 g sample.",
    f"n = m ÷ M = 35.0 ÷ 100 = {35.0/100:.2f} mol",
    "Moles are mass divided by molar mass, and the molar mass has to be the mass of the whole formula unit: CaCO₃ is 40 + 12 + (3 × 16) = 100 g·mol⁻¹, not 40. Getting the molar mass wrong is the commonest way to lose this question, and it carries through every calculation built on it. The unit of the answer is mol, not grams.",
    "n = m ÷ M; M(CaCO₃) = 100 g·mol⁻¹",
)
# Grade 12 Paper 1 -- vertical projectile motion
h22 = 22**2 / (2 * G)
p(
    "psci-p1-2025-2-2", 3, "Moderate",
    "A ball is thrown vertically upward at 22 m·s⁻¹. Calculate the maximum height reached.",
    f"At the maximum height v = 0. v² = u² + 2aΔy → 0 = (22)² + 2(−9.8)Δy → Δy = 484 ÷ 19.6 ≈ {h22:.2f} m",
    "The fact that makes this solvable is that the velocity is zero at the highest point — the ball is momentarily at rest there, even though its acceleration is still 9.8 m·s⁻² downward. Taking upward as positive makes the acceleration negative, and the answer comes out positive, which is the check that the signs were consistent. The mass of the ball is irrelevant and is never given.",
    "v² = u² + 2aΔy",
)
h12 = 12**2 / (2 * G)
p(
    "psci-p1-2023-2-3", 3, "Moderate",
    "A ball is thrown vertically upward at 12 m·s⁻¹. Calculate the maximum height reached.",
    f"At the maximum height v = 0. v² = u² + 2aΔy → 0 = (12)² + 2(−9.8)Δy → Δy = 144 ÷ 19.6 ≈ {h12:.2f} m",
    "Velocity is zero at the top; acceleration is not. That distinction is worth more than the arithmetic, because a ball at its highest point is still accelerating downward at 9.8 m·s⁻² — which is precisely why it does not stay there. Notice how the height scales: doubling the launch speed would quadruple the height, because the speed is squared in this equation.",
    "v² = u² + 2aΔy",
)
v43 = 4 + G * 3
p(
    "psci-p1-2024-2-2", 2, "Moderate",
    "A ball is thrown vertically downward with an initial velocity of 4 m·s⁻¹. Calculate its velocity after 3 s.",
    f"v = u + at = 4 + (9.8)(3) = {v43:.1f} m·s⁻¹ (downward)",
    "Taking downward as positive makes both the initial velocity and the acceleration positive, so they add and the ball speeds up — which is what actually happens when something is thrown downward. The sign convention is a choice, but it has to be stated and then kept: upward-positive would give u = −4 and a = −9.8, and the answer −33.4 m·s⁻², meaning the same thing. The direction must appear in the answer either way.",
    "v = u + at (downward positive)",
)
# Grade 12 Paper 1 -- photons and the photoelectric effect
lam480 = 480e-9
e480 = H * C / lam480
n480 = 12.0e-3 / e480
p(
    "psci-p1-2023-8-2", 3, "Challenge",
    "A laser emits light of wavelength 480 nm at a constant power of 12.0 mW. Calculate the energy of a single photon of this light, and hence the number of photons the laser emits each second. (h = 6.63 × 10⁻³⁴ J·s; c = 3.0 × 10⁸ m·s⁻¹)",
    f"E = hc/λ = (6.63 × 10⁻³⁴)(3.0 × 10⁸) ÷ (480 × 10⁻⁹) = {sci(e480)} J per photon. A power of 12.0 mW is 1.20 × 10⁻² J delivered every second, so the number of photons per second is n = P/E = 1.20 × 10⁻² ÷ {sci(e480)} = {sci(n480)} photons per second.",
    "Two ideas joined by one division. The energy of a single photon depends only on the wavelength — shorter wavelength, more energetic photon — while the power says how much energy arrives each second. Dividing the second by the first gives the count. The wavelength must be converted to metres before it goes into the formula; leaving it in nanometres makes the photon energy a billion times too small and the count a billion times too large.",
)
f0 = 4.2e14
w0 = H * f0
p(
    "psci-p1-2023-8-3", 2, "Moderate",
    "A metal has a threshold frequency of 4.2 × 10¹⁴ Hz. Calculate its work function.",
    f"W₀ = hf₀ = (6.63 × 10⁻³⁴)(4.2 × 10¹⁴) = {sci(w0)} J",
    "The work function is the minimum energy needed to free one electron from the metal's surface, and the threshold frequency is the same quantity expressed as a frequency: W₀ = hf₀ converts between them. Because it is a property of the METAL, it does not change when a different light source is used — only whether that light has enough energy per photon to overcome it.",
    "W₀ = hf₀",
)
ek = e480 - w0
p(
    "psci-p1-2023-8-4", 2, "Challenge",
    f"Light of wavelength 480 nm (photon energy ≈ {sci(e480)} J, from a previous question) shines on the metal from the previous question (work function ≈ {sci(w0)} J). Calculate the maximum kinetic energy of the emitted photoelectrons.",
    f"Ek(max) = E − W₀ = {sci(e480)} − {sci(w0)} = {sci(ek)} J",
    "The photon's energy is spent in two parts: the work function frees the electron, and whatever remains becomes its kinetic energy. It is MAXIMUM kinetic energy because electrons deeper in the metal need more than W₀ to escape and emerge with less. A negative result would mean the photon has too little energy to free an electron at all, and then no electrons are emitted no matter how bright the light is.",
    "Ek(max) = E − W₀",
)
lam650 = 650e-9
e650 = H * C / lam650
p(
    "psci-p1-a-8-2", 2, "Moderate",
    "Calculate the energy of a photon of light with a wavelength of 650 nm.",
    f"E = hf and c = fλ, so E = hc/λ = (6.63 × 10⁻³⁴)(3.0 × 10⁸) ÷ (650 × 10⁻⁹) = {sci(e650, 3)} J",
    "Combining E = hf with c = fλ removes the frequency and gives E = hc/λ in one step. The conversion is the part that goes wrong: 650 nm is 650 × 10⁻⁹ m, and a photon energy on the order of 10⁻¹⁹ J is the sanity check — visible light always lands there. Red light at 650 nm carries less energy per photon than blue light at 450 nm, which is why red light fails to eject electrons from metals that blue light frees easily.",
    "E = hf; c = fλ; h = 6.63 × 10⁻³⁴ J·s; c = 3.0 × 10⁸ m·s⁻¹",
)
# Grade 12 Paper 2
p(
    "psci-p2-b-3-2", 2, "Moderate",
    "Write the Kc expression for the equilibrium: H₂(g) + I₂(g) ⇌ 2HI(g).",
    "Kc = [HI]² ÷ ([H₂][I₂])",
    "Products over reactants, each concentration raised to the power of its coefficient in the balanced equation. HI has a coefficient of 2, so it is squared; H₂ and I₂ have a coefficient of 1 and carry no exponent. Square brackets mean equilibrium concentration in mol·dm⁻³, and only gases and aqueous species appear — pure solids and liquids are left out. This particular equilibrium is the one where the exponents matter most visibly, because the number of molecules is the same on both sides and only the square distinguishes the expression.",
    "Kc = [products] ÷ [reactants], each raised to the power of its coefficient",
)
p(
    "psci-p2-2025-3-2", 2, "Moderate",
    "Write the Kc expression for the equilibrium: CO(g) + 2H₂(g) ⇌ CH₃OH(g).",
    "Kc = [CH₃OH] ÷ ([CO][H₂]²)",
    "Products on top, reactants underneath, each raised to its coefficient. CH₃OH and CO have a coefficient of 1, so they carry no exponent; H₂ has a coefficient of 2 and is squared. Writing the whole formula of methanol inside one set of brackets matters — [CH₃][OH] would be two different species and a different expression entirely.",
    "Kc = [products] ÷ [reactants], each raised to the power of its coefficient",
)
ph = -math.log10(5.0e-3)
p(
    "psci-p2-a-4-3", 2, "Moderate",
    "Calculate the pH of a solution with [H₃O⁺] = 5.0 × 10⁻³ mol·dm⁻³.",
    f"pH = −log[H₃O⁺] = −log(5.0 × 10⁻³) ≈ {ph:.2f}",
    "The negative sign is part of the formula, not a slip: hydronium concentrations are small numbers whose logarithms are negative, and the minus turns them into the positive pH scale. A concentration of 10⁻³ would give exactly pH 3, so 5.0 × 10⁻³ — five times larger — must give a pH somewhat BELOW 3, which is the check on the answer. More acid means a lower pH.",
    "pH = −log[H₃O⁺]",
)
p(
    "psci-p2-2023-1-13", 2, "Moderate",
    "A hydrocarbon has an empirical formula of CH₂ and a molar mass of 98 g·mol⁻¹. Determine its molecular formula.",
    "M(CH₂) = 12 + (2 × 1) = 14 g·mol⁻¹. 98 ÷ 14 = 7, so the molecular formula is C₇H₁₄.",
    "The empirical formula gives the simplest whole-number ratio of atoms; the molecular formula gives the actual number. Divide the molar mass by the empirical formula mass to find how many empirical units make one molecule, then multiply every subscript by that factor. The ratio must come out a whole number — a fraction means the empirical formula mass or the molar mass was misread.",
    "Molar mass: C = 12 g·mol⁻¹, H = 1 g·mol⁻¹",
)
p(
    "psci-p2-b-1-13", 2, "Moderate",
    "A hydrocarbon has an empirical formula of C₃H₇ and a molar mass of 86 g·mol⁻¹. Determine its molecular formula.",
    "M(C₃H₇) = (3 × 12) + (7 × 1) = 43 g·mol⁻¹. 86 ÷ 43 = 2, so the molecular formula is C₆H₁₄.",
    "Divide the molar mass by the empirical formula mass, then multiply every subscript by the result: C₃H₇ doubled is C₆H₁₄, hexane. C₃H₇ is worth noticing as an empirical formula, because it cannot be a molecule on its own — a chain of three carbons carries at most eight hydrogens, so the real molecule has to be a multiple of it.",
    "Molar mass: C = 12 g·mol⁻¹, H = 1 g·mol⁻¹",
)
p(
    "psci-p2-2025-1-4", 2, "Moderate",
    "Draw the structural formula of hex-2-ene.",
    "CH₃−CH=CH−CH₂−CH₂−CH₃",
    "The name is read in three parts. 'Hex' is six carbons, '-ene' is a carbon-carbon double bond, and '2' says the double bond starts at the second carbon. Number the chain from the end that gives the double bond the lower number — counting from the other end would name this same molecule hex-4-ene, which is not the accepted name. A structural formula must show every bond and every hydrogen, so each carbon ends up with four bonds in total.",
)

if __name__ == "__main__":
    import sys, pathlib

    for name, rows in (("matlit", MATLIT), ("maths", MATHS), ("phys", PHYS)):
        pathlib.Path(f"scratchpad/b-{name}.json").write_text(
            json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8"
        )
        print(f"{name}: {len(rows)} items")
