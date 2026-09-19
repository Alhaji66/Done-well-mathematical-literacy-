#!/usr/bin/env python3
"""
Author Level 3 replacements for single-substitution items in Physical
Sciences Grade 11 Paper 1.

Same reasoning as gen-psl3.py: every item in the cell has been read, and after
that reading the paper sits at 44,5% Level 2 against a 35% target and 28,7%
Level 3 against 40%. There is no mislabelled item left to move, so the paper
is short of Level 3 CONTENT and 99 marks of it are written here.

Each rewrite KEEPS the original first step and its numbers, so the physics a
learner already had is not taken away -- what is added is a second step that
cannot be started until the first is finished. Every number is computed.
"""
import json
import math

K = 9.0e9
E = 1.6e-19
SUP = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')


def sci(x: float, sig: int = 3) -> str:
    e, m = 0, abs(x)
    while m >= 10:
        m /= 10; e += 1
    while m and m < 1:
        m *= 10; e -= 1
    m = round(m, sig - 1)
    if m >= 10:
        m /= 10; e += 1
    mant = f'{m:.{sig - 1}f}'
    sign = '−' if x < 0 else ''
    # Physics answers in the ordinary range read better as plain decimals:
    # "0.90 N", not "9.00 × 10⁻¹ N". Only step outside that range.
    if -2 <= e <= 2:
        return f'{sign}{round(abs(x), max(0, 2 - e)):g}'
    return f'{sign}{mant} × 10{str(e).translate(SUP)}'


def num(x: float, dp: int = 2) -> str:
    return f'{round(x, dp):g}'


batch = []

# ---- Coulomb's law, then Newton's second law on one of the charged spheres ----
for item_id, q1, q2, r, mass_g in [
    ('psci-g11-p1-2020-5-3', 4, 9, 0.6, 5.0),
    ('psci-g11-p1-2021-5-3', 7, 3, 0.25, 8.0),
    ('psci-g11-p1-2022-5-3', 9, 4, 0.6, 4.0),
    ('psci-g11-p1-2023-5-3', 8, 2, 0.3, 6.0),
    ('psci-g11-p1-2024-5-3', 6, 3, 0.6, 2.5),
    ('psci-g11-p1-2025-5-3', 5, 2, 0.3, 10.0),
    ('psci-g11-p1-seta-5-3', 3, 4, 0.2, 7.5),
    ('psci-g11-p1-setb-5-3', 5, 2, 0.25, 3.0),
    ('psci-g11-p1-setc-5-3', 6, 4, 0.3, 12.0),
]:
    F = K * (q1 * 1e-6) * (q2 * 1e-6) / r**2
    m = mass_g * 1e-3
    a = F / m
    batch.append({
        'id': item_id,
        'prompt': (
            f'Two point charges, +{q1} μC and +{q2} μC, are placed {r} m apart. The +{q1} μC charge '
            f'is carried by a small sphere of mass {mass_g:.1f} g that is free to move; the other charge '
            f'is held fixed. Calculate the magnitude of the electrostatic force between the charges, '
            f'and hence the magnitude of the initial acceleration of the sphere. '
            f'(k = 9.0 × 10⁹ N·m²·C⁻²)'
        ),
        'answer': (
            f'F = kQ₁Q₂/r² = (9.0 × 10⁹)({q1} × 10⁻⁶)({q2} × 10⁻⁶) ÷ ({r})² = {sci(F)} N. '
            f'Both charges are positive, so the force is a repulsion and the sphere accelerates away '
            f'from the fixed charge. Converting the mass, {mass_g:.1f} g = {sci(m)} kg, '
            f'a = F/m = {sci(F)} ÷ {sci(m)} = {sci(a)} m·s⁻².'
        ),
        'explanation': (
            'The two halves belong to different topics and the second cannot start until the first '
            'has finished: Coulomb’s law gives the force, and only then does Newton’s second law turn '
            'that force into an acceleration. Two conversions decide whether the answer is right — '
            'microcoulombs to coulombs and grams to kilograms — and getting either wrong still '
            'produces a plausible-looking number. Note the acceleration is only the INITIAL one: as '
            'the sphere moves away, r grows, the force falls off as 1/r², and the acceleration drops '
            'with it, so this value holds at the instant of release and not afterwards.'
        ),
        'difficulty': 'Challenge',
        'cognitiveLevel': 3,
    })

# ---- Resolve a force, then use the components to find a resultant ----
for item_id, f1, deg, f2 in [
    ('psci-g11-p1-2020-1-3', 100, 37, 30),
    ('psci-g11-p1-2021-1-3', 70, 42, 20),
    ('psci-g11-p1-2022-1-3', 110, 50, 40),
    ('psci-g11-p1-2023-1-3', 90, 35, 25),
    ('psci-g11-p1-2024-1-3', 60, 25, 15),
    ('psci-g11-p1-2025-1-3', 80, 60, 18),
    ('psci-g11-p1-seta-1-3', 50, 30, 12),
    ('psci-g11-p1-setb-1-3', 80, 35, 22),
    ('psci-g11-p1-setc-1-3', 100, 42, 35),
]:
    rad = math.radians(deg)
    fx = f1 * math.cos(rad)
    fy = f1 * math.sin(rad)
    rx = fx - f2
    R = math.hypot(rx, fy)
    ang = math.degrees(math.atan2(fy, rx))
    batch.append({
        'id': item_id,
        'prompt': (
            f'A force of {f1} N acts at {deg}° above the horizontal. A second force of {f2} N acts '
            f'horizontally, in the direction opposite to the horizontal component of the first force. '
            f'Calculate the horizontal (Fx) and vertical (Fy) components of the {f1} N force, and '
            f'hence the magnitude of the resultant of the two forces.'
        ),
        'answer': (
            f'Fx = {f1} cos {deg}° = {num(fx)} N and Fy = {f1} sin {deg}° = {num(fy)} N. '
            f'The {f2} N force is horizontal and opposes Fx, so the resultant horizontal component is '
            f'{num(fx)} − {f2} = {num(rx)} N, while the vertical component is unchanged at {num(fy)} N. '
            f'R = √(({num(rx)})² + ({num(fy)})²) = {num(R)} N, at {num(ang, 1)}° above the horizontal.'
        ),
        'explanation': (
            'Forces can only be added along the same line, which is the whole reason for resolving '
            'the first one into components. The second force is horizontal, so it changes Fx and '
            'leaves Fy completely alone — adding it to the {f1} N directly, before resolving, is the '
            'mistake this question is built to catch. Once the two perpendicular components of the '
            'resultant are known, Pythagoras recombines them into a single magnitude.'
        ).replace('{f1}', str(f1)),
        'difficulty': 'Challenge',
        'cognitiveLevel': 3,
    })

# ---- Count the excess electrons, then find the charge after some are removed ----
for item_id, q_uc, removed_e13 in [
    ('psci-g11-p1-2020-5-6', 7.2, 1.0),
    ('psci-g11-p1-2021-5-6', 5.6, 2.0),
    ('psci-g11-p1-2022-5-6', 6.4, 1.5),
    ('psci-g11-p1-2023-5-6', 8.0, 3.0),
    ('psci-g11-p1-2024-5-6', 4.8, 1.0),
    ('psci-g11-p1-2025-5-6', 3.2, 0.5),
    ('psci-g11-p1-seta-5-6', 1.6, 0.4),
    ('psci-g11-p1-setb-5-6', 3.2, 1.2),
    ('psci-g11-p1-setc-5-6', 4.8, 2.4),
]:
    Q = q_uc * 1e-6
    n = Q / E
    removed = removed_e13 * 1e13
    left = n - removed
    newQ = left * E
    batch.append({
        'id': item_id,
        'prompt': (
            f'A charged object carries a charge of −{q_uc} μC. Calculate the number of excess '
            f'electrons responsible for this charge, and then calculate the object’s new charge if '
            f'{sci(removed)} of those excess electrons are removed. (e = 1.6 × 10⁻¹⁹ C)'
        ),
        'answer': (
            f'n = Q/e = ({q_uc} × 10⁻⁶) ÷ (1.6 × 10⁻¹⁹) = {sci(n)} excess electrons. '
            f'Removing {sci(removed)} of them leaves {sci(left)} excess electrons, '
            f'so the new charge is {sci(left)} × (1.6 × 10⁻¹⁹) = {sci(newQ)} C, '
            f'or −{num(newQ * 1e6)} μC.'
        ),
        'explanation': (
            'Charge is quantised, which is what makes the first step possible at all: every charge is '
            'a whole number of elementary charges, so dividing by e counts them. The second step is '
            'where the reasoning sits — removing ELECTRONS makes an object LESS negative, not more, '
            'because it is the surplus of electrons that carries the negative sign. The object stays '
            'negative here only because electrons remain in surplus; remove enough of them and the '
            'charge would pass through zero and become positive.'
        ),
        'difficulty': 'Challenge',
        'cognitiveLevel': 3,
    })

print(json.dumps(batch, ensure_ascii=False, indent=1))
