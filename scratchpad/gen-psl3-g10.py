#!/usr/bin/env python3
"""
Author Level 3 replacements for nine ionic-bonding items in Grade 10 Paper 2.

Every item in the cell was read first. That reading brought Level 2 into band
at 43,6% but left Level 3 at 26,7% against a 30% floor -- the paper is short
of Level 3 CONTENT by about 45 marks, so those marks are written here.

The original question is KEPT, not replaced: the electron-transfer account of
how the ionic bond forms is still the first thing asked, so nothing a learner
could already practise is taken away. What is added is a prediction that can
only be made once that account is in place -- whether the compound conducts as
a solid and when molten, and why the two answers differ. That is the model
applied to a property rather than the model recited.
"""
import json

# (item id, metal, metal symbol, valence lost, non-metal, symbol, valence gained,
#  formula, cation, anion, spoken formula)
DATA = [
    ('psci-g10-p2-2020-5-2', 'potassium', 'K', 1, 'sulfur', 'S', 2, 'K₂S', 'K⁺', 'S²⁻', 'two potassium ions for every sulfide ion'),
    ('psci-g10-p2-2021-5-2', 'calcium', 'Ca', 2, 'bromine', 'Br', 1, 'CaBr₂', 'Ca²⁺', 'Br⁻', 'one calcium ion for every two bromide ions'),
    ('psci-g10-p2-2022-5-2', 'calcium', 'Ca', 2, 'chlorine', 'Cl', 1, 'CaCl₂', 'Ca²⁺', 'Cl⁻', 'one calcium ion for every two chloride ions'),
    ('psci-g10-p2-2023-5-2', 'sodium', 'Na', 1, 'bromine', 'Br', 1, 'NaBr', 'Na⁺', 'Br⁻', 'one sodium ion for every bromide ion'),
    ('psci-g10-p2-2024-5-2', 'lithium', 'Li', 1, 'fluorine', 'F', 1, 'LiF', 'Li⁺', 'F⁻', 'one lithium ion for every fluoride ion'),
    ('psci-g10-p2-2025-5-2', 'calcium', 'Ca', 2, 'sulfur', 'S', 2, 'CaS', 'Ca²⁺', 'S²⁻', 'one calcium ion for every sulfide ion'),
    ('psci-g10-p2-seta-5-2', 'sodium', 'Na', 1, 'chlorine', 'Cl', 1, 'NaCl', 'Na⁺', 'Cl⁻', 'one sodium ion for every chloride ion'),
    ('psci-g10-p2-setb-5-2', 'potassium', 'K', 1, 'fluorine', 'F', 1, 'KF', 'K⁺', 'F⁻', 'one potassium ion for every fluoride ion'),
    ('psci-g10-p2-setc-5-2', 'magnesium', 'Mg', 2, 'oxygen', 'O', 2, 'MgO', 'Mg²⁺', 'O²⁻', 'one magnesium ion for every oxide ion'),
]

ANION_NAME = {'S': 'sulfide', 'Br': 'bromide', 'Cl': 'chloride', 'F': 'fluoride', 'O': 'oxide'}

batch = []
for item_id, metal, ms, lost, nonmetal, ns, gained, formula, cat, an, ratio in DATA:
    # The formula's ratio is fixed by the charges: the total positive charge
    # must cancel the total negative charge.
    n_metal = gained // __import__('math').gcd(lost, gained)
    n_non = lost // __import__('math').gcd(lost, gained)
    assert n_metal * lost == n_non * gained, f'{item_id}: charges do not balance'

    batch.append({
        'id': item_id,
        'prompt': (
            f'Describe, in terms of electron transfer, how an ionic bond forms between a {metal} atom '
            f'({ms}, {lost} valence electron{"s" if lost > 1 else ""}) and {nonmetal} atoms '
            f'({ns}, {8 - gained} valence electrons each), and name the ions that result. Then predict '
            f'whether solid {formula} conducts electricity, and whether molten {formula} conducts, '
            f'explaining BOTH predictions in terms of the structure you have described.'
        ),
        'answer': (
            f'Each {metal} atom loses its {lost} valence electron{"s" if lost > 1 else ""} to reach the stable '
            f'configuration of the noble gas before it, forming a {cat} ion. Each {nonmetal} atom gains '
            f'{gained} electron{"s" if gained > 1 else ""} to complete its outer shell, forming a '
            f'{ANION_NAME[ns]} ion, {an}. The charges must cancel, so the compound contains {ratio}, giving the '
            f'formula {formula}. The oppositely charged ions attract one another in every direction and '
            f'build a rigid lattice.\n\n'
            f'Solid {formula} does NOT conduct. The ions are charged, but each one is locked in place in '
            f'the lattice, and a current needs charge that can MOVE. Molten {formula} DOES conduct: melting '
            f'supplies enough energy to break the lattice apart, the {cat} and {an} ions become free to '
            f'move, and they carry charge through the liquid.'
        ),
        'explanation': (
            'The prediction is the part that cannot be recited, and it turns on a distinction learners '
            'often miss: having charged particles is not the same as being able to conduct. An ionic '
            'solid is made entirely of ions and still insulates, because conduction needs those charges '
            'to be mobile. Melting does not change what the particles are — it changes only whether they '
            'can move — which is why the same substance switches from insulator to conductor with no '
            'chemical change at all. Dissolving it in water does the same thing for the same reason. A '
            'metal is the contrast worth holding alongside this: it conducts as a solid, because there '
            'the mobile charges are delocalised electrons rather than whole ions.'
        ),
        'difficulty': 'Challenge',
        'cognitiveLevel': 3,
    })

print(json.dumps(batch, ensure_ascii=False, indent=1))
