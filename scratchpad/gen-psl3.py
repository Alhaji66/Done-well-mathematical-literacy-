#!/usr/bin/env python3
"""
Author Level 3 replacements for single-substitution Physical Sciences items.

WHY REWRITE RATHER THAN RELABEL. Every item in Grade 12 Paper 1 has been read.
After that reading the paper sits at 43,2% Level 2 against a 35% target and
33,7% Level 3 against 40%, which says the paper is short of Level 3 CONTENT --
there is no mislabelled item left to move. So the marks have to be earned: a
question that was one substitution becomes a question with a second step that
depends on the first, at the same mark value and under the same id.

Every number below is computed here, not typed, for the same reason the
Mathematics Level 1 items were generated: a wrong answer key teaches a learner
something false, and 48 marks of hand-arithmetic is enough to hide one.
"""
import json

K = 9.0e9          # N·m²·C⁻², as the corpus states it
H = 6.63e-34       # J·s
C = 3.0e8          # m·s⁻¹
SUP = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')


def sci(x: float, sig: int = 3) -> str:
    """2697000.0 -> '2.70 × 10⁶', matching the corpus's point-decimal style."""
    e = 0
    m = abs(x)
    while m >= 10:
        m /= 10
        e += 1
    while m and m < 1:
        m *= 10
        e -= 1
    m = round(m, sig - 1)
    if m >= 10:          # rounding can carry, e.g. 9.999 -> 10.0
        m /= 10
        e += 1
    mant = f'{m:.{sig - 1}f}'
    if e == 0:
        return f'{"-" if x < 0 else ""}{mant}'
    return f'{"-" if x < 0 else ""}{mant} × 10{str(e).translate(SUP)}'


batch = []

# ---- Electric field, then the force it exerts on a charge placed in it ----
for item_id, q_uc, r, test_uc in [
    ('psci-p1-2020-5-3', 12, 0.2, -3),
    ('psci-p1-2021-5-3', 8, 0.25, -5),
    ('psci-p1-2022-5-3', 10, 0.3, -4),
    ('psci-p1-2023-5-3', -8, 0.25, 2),
]:
    Q = q_uc * 1e-6
    q = test_uc * 1e-6
    E = K * abs(Q) / r**2
    F = abs(q) * E
    # Every pair below is opposite in sign, so the force is always attractive.
    assert q_uc * test_uc < 0, 'the wording assumes opposite charges'
    sign_word = 'opposite in sign'
    direction = 'towards'
    # The corpus writes a minus as U+2212, not an ASCII hyphen.
    def uc(v: int) -> str:
        return f'+{v}' if v > 0 else f'\u2212{abs(v)}'
    batch.append({
        'id': item_id,
        'prompt': (
            f'A point charge of {uc(q_uc)} μC is fixed at O. Calculate the magnitude of the '
            f'electric field at a point P, {r} m from O, and hence calculate the magnitude of '
            f'the force that a charge of {uc(test_uc)} μC would experience if it were placed at P. '
            f'(k = 9.0 × 10⁹ N·m²·C⁻²)'
        ),
        'answer': (
            f'E = kQ/r² = (9.0 × 10⁹)({abs(q_uc)} × 10⁻⁶) ÷ ({r})² = {sci(E)} N·C⁻¹. '
            f'The force on a charge placed in that field is F = qE = ({abs(test_uc)} × 10⁻⁶)({sci(E)}) '
            f'= {sci(F)} N, directed {direction} O.'
        ),
        'explanation': (
            'The field is a property of the FIRST charge alone — it exists at P whether or not '
            'anything is placed there, which is why r is measured from O and the second charge '
            'does not appear until the field has been found. Only then does F = qE convert the '
            'field into a force on a particular charge. Substituting both charges into Coulomb\'s '
            'law in one go reaches the same number but answers a different question, and leaves '
            f'the field itself unstated. The two charges are {sign_word}, so the force is directed '
            f'{direction} O.'
        ),
        'difficulty': 'Challenge',
        'cognitiveLevel': 3,
    })

# ---- Parallel combination, then the current the battery must supply ----
for item_id, r1, r2, emf in [
    ('psci-p1-2020-6-3', 10, 15, 12),
    ('psci-p1-2021-6-3', 8, 8, 24),
    ('psci-p1-2022-6-3', 6, 24, 9.6),
    ('psci-p1-2023-6-3', 9, 18, 18),
]:
    R = 1 / (1 / r1 + 1 / r2)
    I = emf / R
    i1 = emf / r1
    batch.append({
        'id': item_id,
        'prompt': (
            f'Two resistors, {r1} Ω and {r2} Ω, are connected in parallel across a {emf} V battery '
            f'of negligible internal resistance. Calculate the equivalent resistance of the '
            f'combination, and hence the total current delivered by the battery.'
        ),
        'answer': (
            f'1/R = 1/{r1} + 1/{r2}, so R = {round(R, 2)} Ω. '
            f'The full {emf} V is across the combination, so I = V/R = {emf} ÷ {round(R, 2)} '
            f'= {round(I, 2)} A.'
        ),
        'explanation': (
            'The reciprocals are added, and then the result must be INVERTED — stopping at 1/R is '
            f'the usual slip, and it gives {round(1 / R, 4)} rather than {round(R, 2)}. Notice the '
            f'equivalent resistance is smaller than either resistor, which is the check worth '
            'making: adding a parallel path gives the current somewhere else to go, so the '
            'combination always resists less than its smallest branch. The current then follows '
            f'from Ohm\'s law. As a second check, the {r1} Ω branch alone carries '
            f'{round(i1, 2)} A, so the total must be larger than that.'
        ),
        'difficulty': 'Challenge',
        'cognitiveLevel': 3,
    })

# ---- Photon energy, then how many photons a source of known power emits ----
for item_id, nm, power_mw in [
    ('psci-p1-2020-8-2', 420, 5.0),
    ('psci-p1-2021-8-2', 550, 2.0),
    ('psci-p1-2022-8-2', 480, 8.0),
    ('psci-p1-2023-8-2', 550, 12.0),
]:
    lam = nm * 1e-9
    E = H * C / lam
    P = power_mw * 1e-3
    n = P / E
    batch.append({
        'id': item_id,
        'prompt': (
            f'A laser emits light of wavelength {nm} nm at a constant power of {power_mw} mW. '
            f'Calculate the energy of a single photon of this light, and hence the number of '
            f'photons the laser emits each second. (h = 6.63 × 10⁻³⁴ J·s; c = 3.0 × 10⁸ m·s⁻¹)'
        ),
        'answer': (
            f'E = hc/λ = (6.63 × 10⁻³⁴)(3.0 × 10⁸) ÷ ({nm} × 10⁻⁹) = {sci(E)} J per photon. '
            f'A power of {power_mw} mW is {sci(P)} J delivered every second, so the number of '
            f'photons per second is n = P/E = {sci(P)} ÷ {sci(E)} = {sci(n)} photons per second.'
        ),
        'explanation': (
            'Two separate ideas, and the second cannot start until the first is finished. The '
            f'wavelength must be in metres, so {nm} nm becomes {nm} × 10⁻⁹ m; leaving it in '
            'nanometres inflates the photon energy by a factor of a thousand million. Power is '
            'energy per second, so dividing the energy delivered each second by the energy of one '
            'photon counts the photons. The answer is enormous, which is the point: at this scale '
            'the light appears perfectly continuous, and the graininess of the photon picture only '
            'shows up in effects like the photoelectric effect.'
        ),
        'difficulty': 'Challenge',
        'cognitiveLevel': 3,
    })

print(json.dumps(batch, ensure_ascii=False, indent=1))
