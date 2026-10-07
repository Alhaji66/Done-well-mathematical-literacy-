/**
 * Concepts CAPS teaches only from a certain grade, and how to spot them.
 *
 * check-subtopic-grades.mts guards whole sub-topics. That is not enough when
 * one sub-topic spans grades with different content: "Taxation: income tax,
 * VAT and UIF" is taught in every Mathematical Literacy grade, but only Grade
 * 12 calculates income tax from the SARS tax-rate table and its rebates. A
 * Grade 11 worksheet carried exactly that question, and nothing caught it.
 *
 * Each rule here is ONE such fact: the concept, the grades that teach it, and
 * where the fact comes from. A question from any other grade whose text names
 * the concept is reported by check-caps-concepts.mts.
 *
 * Sources:
 *  - Mathematical Literacy: the WCED ATP 2026 notes in src/data/atp.ts ("New to
 *    Grade 11", "Introduced in Grade 12", "without the formulae").
 *  - Mathematics, Physical Sciences, Life Sciences: the CAPS content sequence
 *    for Grades 10 to 12 (the term-level plans in atp.ts follow it).
 *
 * Patterns read the question as a learner sees it -- prompt, context and the
 * options -- not the memo, which may legitimately say "unlike in Grade 12".
 */

export interface ConceptRule {
  subject: 'mat-lit' | 'mathematics' | 'physical-sciences' | 'life-sciences'
  concept: string
  grades: (10 | 11 | 12)[]
  pattern: RegExp
  source: string
}

const ML_ATP_G12 = 'WCED ATP 2026, Grade 12 Term 1: introduced in Grade 12'
const ML_ATP_G11 = 'WCED ATP 2026, Grade 11: new to Grade 11'

export const conceptRules: ConceptRule[] = [
  // ---------------------------------------------------------------- Mat Lit
  {
    subject: 'mat-lit',
    concept: 'Personal income tax from the SARS tax-rate table, rebates, thresholds, IRP5, taxable income',
    grades: [12],
    pattern: /\b(rebates?|tax[- ]rate table|tax table|tax brackets?|tax thresholds?|(non-)?taxable income|IRP ?5|income tax payable|annual (income )?tax)\b/i,
    source: `${ML_ATP_G12}: tax rate tables and IRP5, personal income tax, taxable and non-taxable income, rebates`,
  },
  {
    subject: 'mat-lit',
    concept: 'UIF (Unemployment Insurance Fund) deductions',
    grades: [11, 12],
    pattern: /\b(UIF|unemployment insurance)\b/i,
    source: `${ML_ATP_G11}: UIF`,
  },
  {
    subject: 'mat-lit',
    concept: 'Quartiles, inter-quartile range, percentiles, box-and-whisker plots',
    grades: [12],
    pattern: /\b(quartiles?|inter-?quartile|IQR|percentiles?|box[- ]and[- ]whisker|five[- ]number summary)\b/i,
    source: `${ML_ATP_G12}: quartiles, inter-quartile range, percentiles, box-and-whisker plots`,
  },
  {
    subject: 'mat-lit',
    concept: 'Multiple and compound bar graphs, scatter plots',
    grades: [11, 12],
    pattern: /\b(scatter ?(plot|graph|diagram)s?|compound bar|stacked bar|multiple bar|double bar|side-by-side bar)/i,
    source: `${ML_ATP_G11}: multiple bar graphs, compound graphs, scatter plots`,
  },
  {
    subject: 'mat-lit',
    concept: 'Metric to imperial conversions, °C to °F',
    grades: [11, 12],
    pattern: /(\d\s*(inch(es)?|in\.|ft|feet|foot|yards?|yd|miles?|mi|ounces?|oz|gallons?|gal|pints?|lb|lbs)\b|\bFahrenheit\b|°\s?F\b)/i,
    source: `${ML_ATP_G11}: metric to imperial, °C to °F`,
  },
  {
    subject: 'mat-lit',
    concept: 'Surface area',
    grades: [11, 12],
    pattern: /\bsurface area\b/i,
    source: `${ML_ATP_G11}: surface area and volume`,
  },
  {
    subject: 'mat-lit',
    concept: 'Strip charts and elevation maps',
    grades: [11, 12],
    pattern: /\b(strip (chart|map)s?|elevation maps?)\b/i,
    source: `${ML_ATP_G11}: strip charts, elevation maps`,
  },
  {
    subject: 'mat-lit',
    concept: 'Residual and balloon payments',
    grades: [12],
    pattern: /\b(balloon payments?|residual (value|payment))\b/i,
    source: 'WCED ATP 2026, Grade 12 Term 3: residual and balloon payments',
  },
  {
    subject: 'mat-lit',
    concept: 'Interest formulae (Mathematical Literacy works interest out step by step, never by formula)',
    grades: [],
    pattern: /(A\s*=\s*P\s*\(\s*1\s*[+−-]|P\s*\(\s*1\s*\+\s*i\s*\)|\(1\s*\+\s*i\)\s*\^|\(1\s*\+\s*i\)\s*[ⁿ²³]|compound interest formula|simple interest formula|A\s*=\s*P\s*\(1\s*\+\s*in\))/i,
    source: 'WCED ATP 2026, Grade 11 Term 3: bank accounts and interest without the formulae',
  },

  // ------------------------------------------------------------ Mathematics
  {
    subject: 'mathematics',
    concept: 'Series and their sums, geometric sequences, sigma notation, sum to infinity',
    grades: [12],
    pattern: /(\barithmetic series\b|\bgeometric (sequence|series|progression)s?\b|sum of the first \d+ terms|\bSₙ|\bS_?n\s*=|sum to infinity|\bsigma notation\b|Σ|∑|S∞|\bconvergent\b|\bconverge\b)/i,
    source: 'CAPS Grade 12 Patterns, sequences and series (Grade 10 is linear patterns and their general term)',
  },
  {
    subject: 'mathematics',
    concept: 'Quadratic number patterns (constant second difference)',
    grades: [11, 12],
    pattern: /\b(second differences?|quadratic (number )?(pattern|sequence))\b/i,
    source: 'CAPS Grade 11 Number patterns: quadratic patterns',
  },
  {
    subject: 'mathematics',
    concept: 'Logarithms',
    grades: [12],
    pattern: /(\blogarithm|\blog\s*(_|[₀-₉]|\(|\d))/i,
    source: 'CAPS Grade 12 Functions: the logarithmic function as the inverse of y = bˣ',
  },
  {
    subject: 'mathematics',
    concept: 'Inverse functions',
    grades: [12],
    pattern: /(f\s*⁻¹|f\s*\^\s*-1|\binverse (function|of f|of g|of the function)|g\s*⁻¹)/i,
    source: 'CAPS Grade 12 Functions: inverses',
  },
  {
    subject: 'mathematics',
    concept: 'Differential calculus: limits, derivatives, first principles, cubic graphs, stationary points',
    grades: [12],
    pattern: /(\bderivative|\bdifferentiat|first principles|\blim\s*[_(₀-₉]|\blimit (of|as)\b|f\s*['′]\s*\(|dy\s*\/\s*dx|\bstationary points?\b|point of inflection|\bcubic (function|graph|polynomial))/i,
    source: 'CAPS Grade 12 Differential calculus',
  },
  {
    subject: 'mathematics',
    concept: 'Factor and remainder theorems, polynomial division',
    grades: [12],
    pattern: /\b(factor theorem|remainder theorem|synthetic division|long division of polynomials)\b/i,
    source: 'CAPS Grade 12 Algebra: cubic polynomials, factor theorem',
  },
  {
    subject: 'mathematics',
    concept: 'Annuities: future and present value, sinking funds, amortisation',
    grades: [12],
    pattern: /\b(annuit(y|ies)|future value|present value|sinking fund|amortis|amortiz)/i,
    source: 'CAPS Grade 12 Finance, growth and decay: annuities',
  },
  {
    subject: 'mathematics',
    concept: 'Depreciation; nominal and effective interest rates',
    grades: [11, 12],
    pattern: /\b(depreciat|reducing[- ]balance|straight[- ]line (method|depreciation)|nominal (interest )?rate|effective (annual )?(interest )?rate)/i,
    source: 'CAPS Grade 11 Finance, growth and decay: decay formulae, nominal and effective rates',
  },
  {
    subject: 'mathematics',
    concept: 'Nature of roots, discriminant, quadratic formula',
    grades: [11, 12],
    pattern: /\b(discriminant|nature of (the )?roots)\b|(?<!without (using )?the )quadratic formula|Δ\s*=\s*b|b\s*²\s*[−-]\s*4\s*ac/i,
    source: 'CAPS Grade 11 Equations: quadratic formula and nature of roots (Grade 10 factorises)',
  },
  {
    subject: 'mathematics',
    concept: 'Angle of inclination of a straight line',
    grades: [11, 12],
    pattern: /\b(inclination of (the |a )?(straight )?line|angle of inclination of (the |a )?(straight )?line|angle of inclination of [A-Z]{2}\b)/i,
    source: 'atp.ts Mathematics Grade 10 Term 3 note: the angle of inclination is Grade 11',
  },
  {
    subject: 'mathematics',
    concept: 'Equation of a circle and tangents to a circle',
    grades: [12],
    pattern: /(equation of (the |a )?(circle|tangent)|\(x\s*[−-]\s*\w\)\s*²\s*\+\s*\(y\s*[−-]\s*\w\)\s*²|centre of the circle .{0,40}radius)/i,
    source: 'CAPS Grade 12 Analytical geometry: the equation of a circle',
  },
  {
    subject: 'mathematics',
    concept: 'Trigonometric graphs with a changed period (y = sin kx, cos kx, tan kx)',
    grades: [11, 12],
    pattern: /\b(sin|cos|tan)\s*\(?\s*[2-9]\s*x\b/,
    source: 'CAPS Grade 11 Functions: the effect of k in y = sin kx (Grade 10 is y = a sin x + q)',
  },
  {
    subject: 'mathematics',
    concept: 'Reduction formulae, trigonometric identities, general solutions, sine, cosine and area rules',
    grades: [11, 12],
    pattern: /\b(reduction formula|general solution|sine rule|cosine rule|area rule|trigonometric identit(y|ies)|quotient identity|square identity|prov(e|ing) (an|the|that the) identity|CAST)\b|sin\s*²\s*\w\s*\+\s*cos\s*²|½\s*·?\s*ab\s*·?\s*sin/i,
    source: 'CAPS Grade 11 Trigonometry',
  },
  {
    subject: 'mathematics',
    concept: 'Compound and double angles, problems in three dimensions',
    grades: [12],
    pattern: /(\bcompound angles?\b|\bdouble angles?\b|sin\s*\(\s*[αβ]\s*[+−-]\s*[αβ]\s*\)|cos\s*\(\s*[αβ]\s*[+−-]\s*[αβ]\s*\)|three dimensions|3-?D (problem|figure))/i,
    source: 'CAPS Grade 12 Trigonometry: compound and double angles, 2D and 3D problems',
  },
  {
    subject: 'mathematics',
    concept: 'Circle geometry theorems',
    grades: [11, 12],
    pattern: /\b(cyclic quad|tangent[- ]chord|angle at the centre|angles? in the same segment|subtended|chord)\w*/i,
    source: 'CAPS Grade 11 Euclidean geometry: circle geometry',
  },
  {
    subject: 'mathematics',
    concept: 'Proportionality and similarity theorems',
    grades: [12],
    pattern: /\b(proportionality theorem|proportion theorem)\b/i,
    source: 'CAPS Grade 12 Euclidean geometry: proportion and similarity',
  },
  {
    subject: 'mathematics',
    concept: 'Variance, standard deviation, ogives, skewness',
    grades: [11, 12],
    pattern: /\b(standard deviation|variance|ogive|cumulative frequency|skew(ed|ness)?)\b/i,
    source: 'CAPS Grade 11 Statistics',
  },
  {
    subject: 'mathematics',
    concept: 'Bivariate data: scatter plots, regression and correlation',
    grades: [12],
    pattern: /\b(regression|correlation coefficient|least squares|line of best fit|scatter ?(plot|graph|diagram))\b/i,
    source: 'CAPS Grade 12 Statistics: bivariate data',
  },
  {
    subject: 'mathematics',
    concept: 'Dependent and independent events, tree diagrams, contingency tables',
    grades: [11, 12],
    pattern: /\b(independent events?|dependent events?|tree diagrams?|contingency table|two-way table)\b|\bindependent\b.{0,40}\bevents?\b/i,
    source: 'CAPS Grade 11 Probability',
  },
  {
    subject: 'mathematics',
    concept: 'Counting principle, factorial notation, arrangements',
    grades: [12],
    pattern: /(\bfactorial\b|\bn\s*!|\b\d+\s*!|counting principle|\barrangements?\b|\bpermutations?\b|how many (different )?(ways|codes|arrangements|passwords|number plates))/i,
    source: 'CAPS Grade 12 Probability: the fundamental counting principle',
  },


  // ----------------------------------------------------- Physical Sciences
  {
    subject: 'physical-sciences',
    concept: 'Momentum and impulse',
    grades: [12],
    pattern: /\b(momentum|impulse|elastic collisions?|inelastic)\b|Δp\b/i,
    source: 'CAPS Grade 12 Mechanics: momentum and impulse',
  },
  {
    subject: 'physical-sciences',
    concept: 'Vertical projectile motion',
    grades: [12],
    pattern: /\bprojectile/i,
    source: 'CAPS Grade 12 Mechanics: vertical projectile motion',
  },
  {
    subject: 'physical-sciences',
    concept: 'Work-energy theorem, mechanical power',
    grades: [12],
    pattern: /\b(work[- ]energy theorem|net work|work done by (the )?(friction|gravity|applied|net)|non-conservative|average power|power (output|of the (motor|engine|pump|crane)))\b/i,
    source: 'CAPS Grade 12 Mechanics: work, energy and power',
  },
  {
    subject: 'physical-sciences',
    concept: 'Doppler effect',
    grades: [12],
    pattern: /\bdoppler\b/i,
    source: 'CAPS Grade 12 Waves: the Doppler effect',
  },
  {
    subject: 'physical-sciences',
    concept: 'Photoelectric effect, work function, emission and absorption spectra',
    grades: [12],
    pattern: /\b(photoelectric|work function|threshold frequency|emission spectr|absorption spectr|line spectr)/i,
    source: 'CAPS Grade 12 Matter and materials: optical phenomena',
  },
  {
    subject: 'physical-sciences',
    concept: 'Internal resistance',
    grades: [12],
    pattern: /(?<!negligible )internal resistance/i,
    source: 'CAPS Grade 12 Electric circuits: internal resistance',
  },
  {
    subject: 'physical-sciences',
    concept: 'Generators, motors, alternating current, rms values',
    grades: [12],
    pattern: /\b(generators?|electric motors?|\bAC\b|alternating current|\brms\b|root mean square|dynamo|slip rings?|split[- ]ring commutator)\b/i,
    source: 'CAPS Grade 12 Electrodynamics',
  },
  {
    subject: 'physical-sciences',
    concept: "Coulomb's law and electric fields",
    grades: [11, 12],
    pattern: /\b(coulomb'?s law|electric field|field strength)\b/i,
    source: "CAPS Grade 11 Electrostatics: Coulomb's law, electric field",
  },
  {
    subject: 'physical-sciences',
    concept: "Electromagnetic induction, Faraday's law, magnetic flux",
    grades: [11, 12],
    pattern: /\b(faraday'?s law|electromagnetic induction|induced emf|magnetic flux|lenz)\b/i,
    source: 'CAPS Grade 11 Electromagnetism',
  },
  {
    subject: 'physical-sciences',
    concept: "Newton's laws, friction coefficients, universal gravitation",
    grades: [11, 12],
    pattern: /(newton'?s (first|second|third|law of universal)|\bF\s*(net)?\s*=\s*ma\b|coefficient of (static |kinetic )?friction|universal gravitation|gravitational constant|\bFnet\b|net force)/i,
    source: "CAPS Grade 11 Mechanics: Newton's laws",
  },
  {
    subject: 'physical-sciences',
    concept: "Refraction, Snell's law, critical angle, total internal reflection",
    grades: [11, 12],
    pattern: /\b(snell'?s law|refractive index|critical angle|total internal reflection|angle of refraction)\b/i,
    source: 'CAPS Grade 11 Waves: geometrical optics',
  },
  {
    subject: 'physical-sciences',
    concept: 'Ideal gases and the gas laws',
    grades: [11, 12],
    pattern: /(\bideal gas|boyle'?s law|charles'?s? law|gay-lussac|\bpV\s*=\s*nRT\b|general gas equation)/i,
    source: 'CAPS Grade 11 Ideal gases',
  },
  {
    subject: 'physical-sciences',
    concept: 'Intermolecular forces, molecular shape (VSEPR), bond energy',
    grades: [11, 12],
    pattern: /\b(intermolecular|van der waals|london forces|dipole-dipole|hydrogen bond(ing|s)?|VSEPR|molecular shape|bond energy|bond length)\b/i,
    source: 'CAPS Grade 11 Atomic combinations and intermolecular forces',
  },
  {
    subject: 'physical-sciences',
    concept: 'Limiting reagents, percentage yield, molar gas volume',
    grades: [11, 12],
    pattern: /\b(limiting reagent|limiting reactant|percentage yield|percent yield|molar volume|22,4 dm)/i,
    source: 'CAPS Grade 11 Quantitative aspects of chemical change',
  },
  {
    subject: 'physical-sciences',
    concept: 'Activation energy and enthalpy change',
    grades: [11, 12],
    pattern: /\b(activation energy|activated complex|enthalpy|ΔH)\b|ΔH/i,
    source: 'CAPS Grade 11 Energy and chemical change',
  },
  {
    subject: 'physical-sciences',
    concept: 'Acid-base theory: Lowry-Brønsted, conjugate pairs, ampholytes',
    grades: [11, 12],
    pattern: /\b(lowry|br[øo]nsted|conjugate (acid|base)|amphoteric|ampholyte|arrhenius)/i,
    source: 'CAPS Grade 11 Acids and bases',
  },
  {
    subject: 'physical-sciences',
    concept: 'pH calculations, Kw, hydrolysis, titration calculations',
    grades: [12],
    pattern: /(\bKw\b|\bhydrolysis\b|\bKa\b|\bKb\b|calculate the pH|pH of the (resulting |final )?solution)/,
    source: 'CAPS Grade 12 Acids and bases',
  },
  {
    subject: 'physical-sciences',
    concept: 'Oxidation numbers and redox',
    grades: [11, 12],
    pattern: /\b(oxidation numbers?|redox|oxidising agent|reducing agent)\b/i,
    source: 'CAPS Grade 11 Redox reactions',
  },
  {
    subject: 'physical-sciences',
    concept: 'Galvanic and electrolytic cells',
    grades: [12],
    pattern: /\b(galvanic|voltaic|electrolytic cell|electrolysis|electrode potential|cell potential|salt bridge|anode|cathode|E°cell|emf of the cell)\b/i,
    source: 'CAPS Grade 12 Electrochemical reactions',
  },
  {
    subject: 'physical-sciences',
    concept: 'Reaction rates and chemical equilibrium',
    grades: [12],
    pattern: /\b(le chatelier|equilibrium constant|\bKc\b|dynamic equilibrium|rate of (the )?reaction|reaction rate)\b/i,
    source: 'CAPS Grade 12 Reaction rates and chemical equilibrium',
  },
  {
    subject: 'physical-sciences',
    concept: 'Organic chemistry',
    grades: [12],
    pattern: /\b(alkanes?|alkenes?|alkynes?|alcohols?|carboxylic|esters?|aldehydes?|ketones?|haloalkanes?|IUPAC|functional group|homologous series|polymers?|polymeri[sz]ation|hydrocarbons?|esterification)\b/i,
    source: 'CAPS Grade 12 Organic molecules',
  },
  {
    subject: 'physical-sciences',
    concept: 'Fertilisers and the chemical industry',
    grades: [12],
    pattern: /\b(fertili[sz]ers?|haber process|ostwald process|contact process|NPK)\b/i,
    source: 'CAPS Grade 12 Chemical systems: the fertiliser industry',
  },

  // --------------------------------------------------------- Life Sciences
  {
    subject: 'life-sciences',
    concept: 'Meiosis and gamete formation',
    grades: [12],
    pattern: /\b(meiosis|meiotic|crossing over|spermatogenesis|oogenesis|non-disjunction)\b/i,
    source: 'CAPS Grade 12 Meiosis',
  },
  {
    subject: 'life-sciences',
    concept: 'DNA replication and protein synthesis',
    grades: [12],
    pattern: /\b(protein synthesis|transcription|mRNA|tRNA|codons?|anticodons?|DNA profil|DNA fingerprint)/i,
    source: 'CAPS Grade 12 DNA: the code of life',
  },
  {
    subject: 'life-sciences',
    concept: 'Genetics and inheritance',
    grades: [12],
    pattern: /\b(monohybrid|dihybrid|genotypes?|phenotypes?|punnett|alleles?|homozygous|heterozygous|sex-linked|pedigree|co-?dominance|incomplete dominance|genetic engineering|karyotypes?)\b/i,
    source: 'CAPS Grade 12 Genetics and inheritance',
  },
  {
    subject: 'life-sciences',
    concept: 'Human reproduction and reproduction in vertebrates',
    grades: [12],
    pattern: /\b(menstrual|ovulation|implantation|placenta|foetus|fetus|puberty|amniotic|ovipar|vivipar|ovovivipar|gestation)\w*/i,
    source: 'CAPS Grade 12 Reproduction in vertebrates and human reproduction',
  },
  {
    subject: 'life-sciences',
    concept: 'Reflex arcs, the eye and ear, thermoregulation and plant hormones',
    grades: [12],
    pattern: /\b(reflex arc|accommodation of the eye|pupillary|cochlea|semi-?circular canals|organ of corti|thyroxine?|adrenalin(e)?|thermoregulation|auxins?|phototropism|geotropism|gravitropism|gibberellins?|abscisic)\b/i,
    source: 'CAPS Grade 12 Responding to the environment',
  },
  {
    subject: 'life-sciences',
    concept: 'Evolution: natural selection, speciation, human evolution',
    grades: [12],
    pattern: /\b(natural selection|darwin|lamarck|speciation|punctuated equilibrium|hominids?|hominins?|bipedal\w*|out of africa)\b/i,
    source: 'CAPS Grade 12 Evolution',
  },


]

/**
 * Questions a rule names that were reviewed and are right for their grade.
 * Each says why, so the next person does not have to work it out again.
 */
export const reviewedAllowed: Record<string, string> = {
  'ps5-11-lenz-free-energy-evaluate': "Grade 11 Lenz's law: the 'free electricity' idea is the misconception being refuted, not generator theory.",
  'ps6-11-alcohol-chain-solubility-data': 'Grade 11 intermolecular forces: alcohols are the standard example of hydrogen bonding and solubility.',
  'psci-g11-p2-2023-6-6': 'Grade 11 acids and bases: compares a strong and a weak acid qualitatively; no pH calculation.',
}

/**
 * Is this piece of text inside what the grade is taught? False when it names
 * a concept that CAPS teaches only in other grades. Rules with no grades at
 * all describe methods a subject never uses (interest formulae in Mat Lit);
 * notes mention those precisely to warn against them, so they do not hide a
 * note.
 */
export function taughtInGrade(subject: string, grade: number, text: string): boolean {
  // A note line can say outright which grade it belongs to.
  const marked = text.match(/^Grade (1[0-2]):/)
  if (marked && Number(marked[1]) > grade) return false
  for (const r of conceptRules) {
    if (r.subject !== subject || r.grades.length === 0) continue
    if (!r.grades.includes(grade as 10 | 11 | 12) && r.pattern.test(text)) return false
  }
  return true
}
