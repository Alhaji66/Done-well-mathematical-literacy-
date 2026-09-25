/**
 * The Annual Teaching Plan, week by week.
 *
 * WHY THIS EXISTS. A teacher does not think in topics, they think in weeks:
 * "I am doing conversions next week." The question bank was organised the
 * other way round -- pick Measurement and you get every measurement question
 * in the grade, over 150 of them, with no way to take just the part being
 * taught. Printing meant printing all of it.
 *
 * So each ATP entry names the weeks, the dates, and the SUB-TOPICS that fall
 * in them. Choosing a week then selects exactly those sub-topics in the bank,
 * and the worksheet is the week's work rather than the year's.
 *
 * THE SUB-TOPIC NAMES ARE NOT FREE TEXT. Every name in `subtopics` must match
 * a sub-topic in that topic's note in topicNotes.ts, exactly -- that is what
 * ties an ATP week to the questions. `npm run check:atp` fails the build on
 * any name that does not, so a typo here cannot quietly produce an empty
 * worksheet.
 *
 * WEEKS WITH NO TOPIC. Revision and examination weeks carry no topicId. They
 * are listed anyway, because a teacher looking for "where am I in the year"
 * needs to see them, and because leaving them out would make the week numbers
 * lie.
 *
 * TWO KINDS OF PLAN, AND THE DIFFERENCE MATTERS.
 *
 * Mathematical Literacy Grades 11 and 12 come from the actual WCED ATP 2026
 * document, so they carry its week numbers, its dates and its sub-topic
 * detail. Those are `detail: 'week'`.
 *
 * Everything else is derived from the national CAPS sequence and is
 * `detail: 'term'`: it says which topics fall in which TERM, and stops there.
 * That line is deliberate. Which topics a term covers is set nationally and is
 * stable; the week a topic starts is set by each province's ATP and each
 * school's calendar, and inventing week numbers would put a teacher in front
 * of a class with the wrong work prepared. A term is still the question a
 * teacher asks most often -- "what am I on this term" -- and it still narrows
 * a worksheet from the whole year to a handful of topics.
 *
 * The picker says which kind it is showing. Send a provincial ATP for any of
 * the term-level subjects and it can be promoted to week level, the way Mat
 * Lit was.
 */

export interface AtpWeek {
  term: 1 | 2 | 3 | 4
  /** As the ATP writes it: "2 – 4", "8", "9 – 12". */
  weeks: string
  /**
   * As the ATP writes it: "19 Jan – 6 Feb". Absent on a term-level plan, where
   * the dates are the school calendar's and not the plan's to state.
   */
  dates?: string
  /** The CAPS topic heading from the ATP, or what the weeks are for. */
  label: string
  /** The topic in this app the week's work belongs to. Absent for revision and exams. */
  topicId?: string
  /** Sub-topic names within that topic. Must match topicNotes.ts exactly. */
  subtopics?: string[]
  /** Anything the ATP says that the topic and sub-topics do not carry. */
  note?: string
}

export interface Atp {
  subjectId: string
  grade: number
  /** Whose plan this is, and for which year. Shown to the teacher. */
  source: string
  /**
   * How finely the plan is broken down, and how far it can be trusted.
   *
   * 'week' means it came from a real provincial ATP document, with that
   * document's own week numbers and dates. 'term' means it was derived from
   * the national CAPS sequence: which topics fall in which term is stable and
   * worth having, but the WEEK a topic starts is set by each province and each
   * school's calendar, so a term-level plan does not pretend to know it.
   *
   * The picker says which kind it is showing, because a teacher planning next
   * week needs to know whether they are looking at their province's plan or a
   * reasonable default.
   */
  detail: 'week' | 'term'
  weeks: AtpWeek[]
}

const matLitG11: Atp = {
  subjectId: 'mat-lit',
  grade: 11,
  source: 'WCED Mathematical Literacy Grade 11 ATP 2026',
  detail: 'week',
  weeks: [
    {
      term: 1,
      weeks: '1',
      dates: '14 Jan – 16 Jan',
      label: 'Revise Grade 10 Probability',
      topicId: 'data-handling',
      subtopics: ['Probability, chance and relative frequency'],
    },
    {
      term: 1,
      weeks: '2 – 4',
      dates: '19 Jan – 6 Feb',
      label: 'Data Handling',
      topicId: 'data-handling',
      subtopics: [
        'Collecting and organising data',
        'Mean, median and mode',
        'Spread: range, quartiles, percentiles and box-and-whisker',
        'Representing data in tables and graphs',
        'Interpreting and comparing graphs',
      ],
      note: 'New to Grade 11: multiple bar graphs, compound graphs, scatter plots.',
    },
    {
      term: 1,
      weeks: '5 – 9',
      dates: '9 Feb – 13 March',
      label: 'Measurement',
      topicId: 'measurement',
      subtopics: [
        'Units and conversions',
        'Time, temperature and reading instruments',
        'Mass, rates and practical calculations',
        'Perimeter and distance around a shape',
        'Area',
        'Volume and capacity',
        'Surface area',
      ],
      note: 'New to Grade 11: metric to imperial, °C to °F, surface area and volume. Cost calculations may apply.',
    },
    { term: 1, weeks: '10 – 11', dates: '16 March – 27 March', label: 'Revision of Term 1' },

    {
      term: 2,
      weeks: '1 – 4',
      dates: '8 April – 30 April',
      label: 'Finance',
      topicId: 'finance',
      subtopics: [
        'Taxation: income tax, VAT and UIF',
        'Exchange rates and inflation',
        'Financial documents: payslips, bills and statements',
        'Income, expenditure and household budgets',
      ],
      note: 'New to Grade 11: UIF, and currency conversion tables.',
    },
    {
      term: 2,
      weeks: '5 – 7',
      dates: '4 May – 22 May',
      label: 'Maps, Plans and Other Representations',
      topicId: 'maps-plans',
      subtopics: [
        'Scale: number scales and bar scales',
        'Distance, direction and bearings',
        'Route planning and travel time',
        'Floor plans and elevation drawings',
        'Seating, layout and packing plans',
      ],
      note: 'New to Grade 11: street maps, road and rail maps, residential maps, strip charts, elevation maps.',
    },
    {
      term: 2,
      weeks: '8',
      dates: '25 May – 29 May',
      label: 'Probability',
      topicId: 'data-handling',
      subtopics: ['Probability, chance and relative frequency'],
      note: 'Simple and compound events, tree diagrams, two-way tables.',
    },
    {
      term: 2,
      weeks: '9 – 12',
      dates: '1 June – 26 June',
      label: 'Revision and Mid-Year Examination',
      note: 'Two papers, 75 marks each. P1 Finance, Data Handling and Probability. P2 Maps and Plans, Measurement and Probability.',
    },

    {
      term: 3,
      weeks: '1 – 2',
      dates: '21 July – 31 July',
      label: 'Finance: income, expenditure, profit and loss',
      topicId: 'finance',
      subtopics: [
        'Income, expenditure and household budgets',
        'Break-even, profit and business decisions',
      ],
      note: 'New to Grade 11: business finance, comparing two years, projected vs actual budgets.',
    },
    {
      term: 3,
      weeks: '3 – 4',
      dates: '3 Aug – 14 Aug',
      label: 'Finance: cost price and selling price',
      topicId: 'finance',
      subtopics: ['Break-even, profit and business decisions'],
      note: 'New to Grade 11: cost of producing, appropriate selling price, percentage profit.',
    },
    {
      term: 3,
      weeks: '5 – 6',
      dates: '17 Aug – 28 Aug',
      label: 'Finance: tariff systems',
      topicId: 'finance',
      subtopics: ['Tariffs and municipal accounts'],
      note: 'Municipal, telephone, transport and bank tariffs. New to Grade 11: comparing two options.',
    },
    {
      term: 3,
      weeks: '7 – 8',
      dates: '31 Aug – 11 Sept',
      label: 'Finance: patterns, relationships and break-even',
      topicId: 'finance',
      subtopics: ['Break-even, profit and business decisions'],
      note: 'New to Grade 11: two relationships at once, and break-even values from formulae and graphs.',
    },
    {
      term: 3,
      weeks: '9 – 10',
      dates: '14 Sept – 23 Sept',
      label: 'Finance: interest, loans and banking',
      topicId: 'finance',
      subtopics: ['Interest, loans and investments'],
      note: 'Bank accounts and interest without the formulae. New to Grade 11: loans and investments.',
    },

    {
      term: 4,
      weeks: '1 – 3',
      dates: '6 Oct – 23 Oct',
      label: 'Maps, Plans: models and assembly',
      topicId: 'maps-plans',
      subtopics: [
        'Models, assembly diagrams and instructions',
        'Seating, layout and packing plans',
      ],
      note: 'Packaging and best fit by practical method; assembly instructions for plugs, furniture, appliances.',
    },
    { term: 4, weeks: '4 – 6', dates: '26 Oct – 13 Nov', label: 'Revision and consolidation' },
    {
      term: 4,
      weeks: '7 – 10',
      dates: '16 Nov – 9 Dec',
      label: 'End-of-year examination',
      note: 'Two papers, 100 marks each, 2 hours. P1 Finance, Data Handling and Probability. P2 Maps and Plans, Measurement and Probability.',
    },
  ],
}

const matLitG12: Atp = {
  subjectId: 'mat-lit',
  grade: 12,
  source: 'WCED Mathematical Literacy Grade 12 ATP 2026',
  detail: 'week',
  weeks: [
    {
      term: 1,
      weeks: '1',
      dates: '14 Jan – 16 Jan',
      label: 'Revise Grade 10 and 11 Probability',
      topicId: 'data-handling',
      subtopics: ['Probability, chance and relative frequency'],
    },
    {
      term: 1,
      weeks: '2 – 5',
      dates: '19 Jan – 13 Feb',
      label: 'Finance',
      topicId: 'finance',
      subtopics: [
        'Financial documents: payslips, bills and statements',
        'Taxation: income tax, VAT and UIF',
        'Tariffs and municipal accounts',
        'Income, expenditure and household budgets',
        'Break-even, profit and business decisions',
      ],
      note: 'Introduced in Grade 12: tax rate tables and IRP5, loan documents, personal income tax, taxable and non-taxable income, rebates.',
    },
    {
      term: 1,
      weeks: '6 – 8',
      dates: '16 Feb – 6 March',
      label: 'Data Handling',
      topicId: 'data-handling',
      subtopics: [
        'Collecting and organising data',
        'Mean, median and mode',
        'Spread: range, quartiles, percentiles and box-and-whisker',
        'Representing data in tables and graphs',
        'Interpreting and comparing graphs',
      ],
      note: 'Introduced in Grade 12: quartiles, inter-quartile range, percentiles, box-and-whisker plots.',
    },
    { term: 1, weeks: '9 – 11', dates: '9 March – 27 March', label: 'Revision of Term 1' },

    {
      term: 2,
      weeks: '1 – 5',
      dates: '8 April – 8 May',
      label: 'Measurement',
      topicId: 'measurement',
      subtopics: [
        'Units and conversions',
        'Time, temperature and reading instruments',
        'Perimeter and distance around a shape',
        'Area',
        'Volume and capacity',
        'Surface area',
        'Mass, rates and practical calculations',
      ],
      note: 'Conversion factors and tables, metric to imperial, °C to °F, timetables, BMI. Cost calculations may apply.',
    },
    {
      term: 2,
      weeks: '6 – 8',
      dates: '11 May – 29 May',
      label: 'Maps, Plans and Other Representations',
      topicId: 'maps-plans',
      subtopics: [
        'Scale: number scales and bar scales',
        'Distance, direction and bearings',
        'Route planning and travel time',
      ],
      note: 'All Grade 10 to 12 map types, grid references, compass directions, slope on a map.',
    },
    {
      term: 2,
      weeks: '9 – 12',
      dates: '1 June – 26 June',
      label: 'Revision and Internal Examinations',
      note: 'Two papers, 100 marks each, 2 hours. Question 1 is 20% of the total and all Level 1.',
    },

    {
      term: 3,
      weeks: '1 – 2',
      dates: '21 July – 31 July',
      label: 'Finance: banking, inflation and exchange rates',
      topicId: 'finance',
      subtopics: ['Interest, loans and investments', 'Exchange rates and inflation'],
      note: 'Investments, insurance, hire purchase, residual and balloon payments, loans; buying power over time.',
    },
    {
      term: 3,
      weeks: '3 – 5',
      dates: '3 Aug – 21 Aug',
      label: 'Maps, Plans: plans and models',
      topicId: 'maps-plans',
      subtopics: [
        'Floor plans and elevation drawings',
        'Models, assembly diagrams and instructions',
        'Seating, layout and packing plans',
      ],
      note: 'Assembly instructions, symbols and notation, actual dimensions from a scale, 2D floor and elevation plans, 3D scale models, packaging.',
    },
    { term: 3, weeks: '6', dates: '24 Aug – 28 Aug', label: 'Revision' },
    {
      term: 3,
      weeks: '7 – 10',
      dates: '31 Aug – 23 Sept',
      label: 'Preparatory Examinations',
      note: 'Two papers, 150 marks each, 3 hours.',
    },

    {
      term: 4,
      weeks: '1 – 2',
      dates: '6 Oct – 16 Oct',
      label: 'Revision and examination preparation',
      note: 'P1 Finance, Data Handling and Probability. P2 Maps and Plans, Measurement and Probability.',
    },
    { term: 4, weeks: '3+', dates: 'From 19 Oct', label: 'Final Examination' },
  ],
}


/**
 * A term-level plan built from the national CAPS sequence.
 *
 * Each entry is one term and one topic. `weeks` carries the term label rather
 * than a week range, because a CAPS-derived plan does not know the weeks.
 */
const term = (
  subjectId: string,
  grade: number,
  subject: string,
  /** term, label, topic, note, and the sub-topics the grade actually covers. */
  terms: [1 | 2 | 3 | 4, string, string | undefined, string?, string[]?][],
): Atp => ({
  subjectId,
  grade,
  source: `CAPS sequence for ${subject} Grade ${grade} — not a provincial ATP`,
  detail: 'term',
  weeks: terms.map(([t, label, topicId, note, subtopics]) => ({
    term: t,
    weeks: `Term ${t}`,
    label,
    topicId,
    note,
    subtopics,
  })),
})

const matLitG10 = term('mat-lit', 10, 'Mathematical Literacy', [
  [1, 'Numbers, percentages and financial documents', 'finance', 'Rounding, percentages, ratio and rate; payslips, till slips, invoices and bank statements; tariff systems.'],
  [2, 'Measurement: conversions, time, perimeter, area and volume', 'measurement'],
  [2, 'Maps, plans and other representations', 'maps-plans'],
  [2, 'Mid-year examination', undefined],
  [3, 'Finance: income, expenditure, budgets and interest', 'finance'],
  [3, 'Data handling', 'data-handling'],
  [4, 'Probability', 'data-handling', 'Probability is integrated across all the CAPS topics, not taught only here.'],
  [4, 'Models and packaging', 'maps-plans'],
  [4, 'Revision and end-of-year examination', undefined],
])

const mathsG10 = term('mathematics', 10, 'Mathematics', [
  [1, 'Algebraic expressions, exponents and equations', 'math-algebra'],
  [1, 'Number patterns', 'math-number-patterns'],
  [2, 'Functions and graphs', 'math-functions'],
  [2, 'Trigonometry', 'math-trigonometry'],
  [2, 'Euclidean geometry and measurement', 'math-euclidean-geometry'],
  [2, 'Mid-year examination', undefined],
  // Grade 10 analytical geometry is the three two-point formulae and no more.
  // The sub-topics are named here because the topic also carries the equation
  // of a line, the angle of inclination and circles, which belong to Grades 11
  // and 12 -- naming them keeps a Grade 10 worksheet inside the Grade 10
  // syllabus instead of offering four headings that are empty at this grade.
  [
    3,
    'Analytical geometry',
    'math-analytical-geometry',
    'Distance, gradient and midpoint between two points, and using them to prove properties of figures. The equation of a line and the angle of inclination are Grade 11; circles are Grade 12.',
    ['Distance between two points', 'Gradient, parallel and perpendicular lines', 'Midpoint'],
  ],
  [3, 'Finance and growth', 'math-finance-growth'],
  [3, 'Statistics', 'math-statistics'],
  [4, 'Probability', 'math-counting-probability'],
  [4, 'Revision and end-of-year examination', undefined],
])

const mathsG11 = term('mathematics', 11, 'Mathematics', [
  [1, 'Exponents, surds, equations and inequalities', 'math-algebra'],
  [1, 'Number patterns', 'math-number-patterns'],
  [1, 'Analytical geometry', 'math-analytical-geometry'],
  [2, 'Functions and graphs', 'math-functions'],
  [2, 'Trigonometry: reduction formulae, identities and equations', 'math-trigonometry'],
  [2, 'Mid-year examination', undefined],
  [3, 'Euclidean geometry and measurement', 'math-euclidean-geometry'],
  [3, 'Trigonometry: sine, cosine and area rules', 'math-trigonometry'],
  [3, 'Finance, growth and decay', 'math-finance-growth'],
  [3, 'Probability', 'math-counting-probability'],
  [4, 'Statistics', 'math-statistics'],
  [4, 'Revision and end-of-year examination', undefined],
])

const mathsG12 = term('mathematics', 12, 'Mathematics', [
  [1, 'Patterns, sequences and series', 'math-number-patterns'],
  [1, 'Functions, inverses, exponential and logarithmic graphs', 'math-functions'],
  [1, 'Finance, growth and decay', 'math-finance-growth'],
  [2, 'Trigonometry: compound and double angles, 2D and 3D problems', 'math-trigonometry'],
  [2, 'Euclidean geometry', 'math-euclidean-geometry'],
  [2, 'Statistics and regression', 'math-statistics'],
  [2, 'Mid-year examination', undefined],
  [3, 'Analytical geometry', 'math-analytical-geometry'],
  [3, 'Differential calculus', 'math-calculus'],
  [3, 'Counting and probability', 'math-counting-probability'],
  [3, 'Preparatory examination', undefined],
  [4, 'Revision and final examination', undefined],
])

const lifeG10 = term('life-sciences', 10, 'Life Sciences', [
  [1, 'The chemistry of life', 'life-sci-chemistry-of-life'],
  [1, 'Cells: the basic units of life', 'life-sci-cells'],
  [1, 'Cell division: mitosis', 'life-sci-mitosis'],
  [2, 'Plant tissues', 'life-sci-plant-tissues'],
  [2, 'Animal tissues', 'life-sci-animal-tissues'],
  [2, 'Support and transport systems in plants', 'life-sci-transport-plants'],
  [2, 'Mid-year examination', undefined],
  [3, 'Support systems in animals: the skeleton', 'life-sci-skeletal-system'],
  [3, 'Transport systems in mammals: the circulatory system', 'life-sci-circulatory-system'],
  [3, 'Biosphere to ecosystems: structure and energy flow', 'life-sci-ecosystem-energy-flow'],
  [4, 'Nutrient cycling in ecosystems', 'life-sci-nutrient-cycling'],
  [4, 'Revision and end-of-year examination', undefined],
])

const lifeG11 = term('life-sciences', 11, 'Life Sciences', [
  [1, 'Biodiversity and classification of micro-organisms', 'life-sci-biodiversity-microorganisms'],
  [1, 'Biodiversity in plants and reproduction', 'life-sci-biodiversity-plants'],
  [2, 'Biodiversity in animals', 'life-sci-biodiversity-animals'],
  [2, 'Photosynthesis', 'life-sci-photosynthesis'],
  [2, 'Animal nutrition', 'life-sci-animal-nutrition'],
  [2, 'Mid-year examination', undefined],
  [3, 'Energy transformations: cellular respiration', 'life-sci-respiration'],
  [3, 'Gaseous exchange', 'life-sci-gaseous-exchange'],
  [3, 'Excretion', 'life-sci-excretion'],
  [4, 'Population ecology', 'life-sci-population-ecology'],
  [4, 'Human impact on the environment', 'life-sci-human-impact'],
  [4, 'Revision and end-of-year examination', undefined],
])

const lifeG12 = term('life-sciences', 12, 'Life Sciences', [
  [1, 'Meiosis', 'life-sci-meiosis'],
  [1, 'Reproduction in vertebrates', 'life-sci-reproduction-vertebrates'],
  [1, 'Human reproduction', 'life-sci-human-reproduction'],
  [2, 'Responding to the environment: humans', 'life-sci-response-humans'],
  [2, 'The human endocrine system and homeostasis', 'life-sci-endocrine-homeostasis'],
  [2, 'Responding to the environment: plants', 'life-sci-response-plants'],
  [2, 'Mid-year examination', undefined],
  [3, 'DNA: the code of life', 'life-sci-dna-code'],
  [3, 'Genetics and inheritance', 'life-sci-genetics'],
  [3, 'Evolution', 'life-sci-evolution'],
  [3, 'Preparatory examination', undefined],
  [4, 'Revision and final examination', undefined],
])

const physG10 = term('physical-sciences', 10, 'Physical Sciences', [
  [1, 'Classification of matter', 'phys-classification-matter'],
  [1, 'States of matter and the kinetic molecular theory', 'phys-states-matter-kmt'],
  [1, 'The atom', 'phys-the-atom'],
  [1, 'The periodic table', 'phys-periodic-table'],
  [2, 'Chemical bonding', 'phys-chemical-bonding-g10'],
  [2, 'Transverse pulses and waves', 'phys-transverse-waves-g10'],
  [2, 'Longitudinal waves', 'phys-longitudinal-waves-g10'],
  [2, 'Sound', 'phys-sound-g10'],
  [2, 'Electromagnetic radiation', 'phys-em-radiation-g10'],
  [3, 'Physical and chemical change', 'phys-physical-chemical-change'],
  [3, 'Vectors and scalars', 'phys-vectors-scalars-g10'],
  [3, 'Motion in one dimension', 'phys-motion-1d'],
  [4, 'Mechanical energy', 'phys-mechanical-energy-g10'],
  [4, 'Revision and end-of-year examination', undefined],
])

const physG11 = term('physical-sciences', 11, 'Physical Sciences', [
  [1, 'Vectors in two dimensions', 'phys-vectors-2d'],
  [1, "Newton's laws and the law of universal gravitation", 'phys-newtons-laws'],
  [2, 'Atomic combinations: molecular structure', 'phys-atomic-combinations'],
  [2, 'Intermolecular forces', 'phys-intermolecular-forces'],
  [2, 'Geometrical optics', 'phys-geometric-optics'],
  [2, 'Mid-year examination', undefined],
  [3, 'Electrostatics', 'phys-electrostatics-g11'],
  [3, 'Electromagnetism', 'phys-electromagnetism'],
  [3, 'Electric circuits', 'phys-electric-circuits-g11'],
  [3, 'Ideal gases and thermal properties', 'phys-ideal-gases'],
  [3, 'Quantitative aspects of chemical change', 'phys-quantitative-chem-change'],
  [4, 'Energy and chemical change', 'phys-energy-chem-change'],
  [4, 'Types of reactions', 'phys-types-of-reactions'],
  [4, '2D and 3D wavefronts', 'phys-wavefronts'],
  [4, 'Revision and end-of-year examination', undefined],
])

const physG12 = term('physical-sciences', 12, 'Physical Sciences', [
  [1, 'Momentum and impulse', 'phys-momentum-impulse'],
  [1, 'Vertical projectile motion in one dimension', 'phys-vertical-projectile'],
  [1, 'Organic chemistry', 'phys-organic-chemistry'],
  [2, 'Work, energy and power', 'phys-work-energy-power'],
  [2, 'The Doppler effect', 'phys-doppler-effect'],
  [2, 'Rate and extent of reaction', 'phys-reaction-rate'],
  [2, 'Chemical equilibrium', 'phys-chemical-equilibrium'],
  [2, 'Mid-year examination', undefined],
  [3, 'Electrostatics', 'phys-electrostatics'],
  [3, 'Electric circuits', 'phys-electric-circuits'],
  [3, 'Electrodynamics', 'phys-electrodynamics'],
  [3, 'Acids and bases', 'phys-acids-bases'],
  [3, 'Electrochemical reactions', 'phys-electrochemistry'],
  [3, 'Preparatory examination', undefined],
  [4, 'Optical phenomena and the photoelectric effect', 'phys-em-radiation'],
  [4, 'Revision and final examination', undefined],
])

const plans: Atp[] = [
  matLitG10,
  matLitG11,
  matLitG12,
  mathsG10,
  mathsG11,
  mathsG12,
  lifeG10,
  lifeG11,
  lifeG12,
  physG10,
  physG11,
  physG12,
]

/** The ATP for a subject and grade, or undefined where none has been supplied. */
export function atpFor(subjectId: string, grade: number): Atp | undefined {
  return plans.find((p) => p.subjectId === subjectId && p.grade === grade)
}

/** Every plan held, for the build check and for telling a teacher what is covered. */
export const allAtps = plans
