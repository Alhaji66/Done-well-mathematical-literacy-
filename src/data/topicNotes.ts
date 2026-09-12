export interface WorkedExample {
  problem: string
  steps: string[]
  answer: string
}

/**
 * A CAPS topic is really a bundle of sub-topics -- "Electric Circuits" covers
 * series, parallel, internal resistance and power -- and a learner revising one
 * of them needs that sub-topic, not a summary of the whole bundle. So a note
 * carries a section per sub-topic under the topic's key ideas.
 */
export interface SubtopicNote {
  name: string
  points: string[]
}

export interface TopicNote {
  topicId: string
  summary: string
  keyIdeas: string[]
  subtopics?: SubtopicNote[]
  /** Formulae, laws or definitions a learner is expected to reproduce. */
  formulae?: string[]
  /** Mistakes that cost marks in this topic, phrased as the correction. */
  commonMistakes?: string[]
  example: WorkedExample
  /** Further worked examples, shown after the first. */
  moreExamples?: WorkedExample[]
}

export const topicNotes: TopicNote[] = [
  // Mathematical Literacy
  {
    topicId: 'finance',
    summary:
      'Working with money in everyday and business contexts — reading financial documents, planning budgets, and comparing loans, interest, tax and tariffs.',
    keyIdeas: [
      'Budget: income − expenses = balance (a positive balance is a surplus, a negative one is a shortfall)',
      'Simple interest: the same amount of interest is added each year, always calculated on the original amount',
      'Compound interest: work it out year by year — each year\'s interest is calculated on the previous year\'s new balance, not the original amount',
      'Tariffs (electricity, water, airtime, municipal accounts): total cost = fixed charge + (rate × amount used)',
      'Break-even: the point where income from sales equals total costs — below it there is a loss, above it a profit',
    ],
    example: {
      problem:
        'A cellphone contract costs a fixed R99 per month plus R1.50 per minute of calls. Calculate the total bill for a month with 40 minutes of calls.',
      steps: [
        'Identify the fixed part and the variable part: fixed = R99, variable = R1.50 per minute.',
        'Multiply the rate by the number of minutes used: R1.50 × 40 = R60.',
        'Add the fixed charge to the variable amount: R99 + R60 = R159.',
      ],
      answer: 'R159',
    },
  },
  {
    topicId: 'data-handling',
    summary:
      'Collecting, organising and summarising sets of data using tables and graphs, then interpreting what the numbers mean — including basic probability.',
    keyIdeas: [
      'Mean (average) = sum of all values ÷ number of values',
      'Median = the middle value once the data is arranged from smallest to largest (average the two middle values if there is an even number of values)',
      'Mode = the value that occurs most often',
      'Range = highest value − lowest value, a simple measure of spread',
      'Probability of an event = number of favourable outcomes ÷ total number of possible outcomes',
    ],
    example: {
      problem: 'Seven learners scored these marks out of 100 in a test: 45, 60, 55, 70, 60, 80, 50. Find the mean, median and mode.',
      steps: [
        'Arrange the data in order: 45, 50, 55, 60, 60, 70, 80.',
        'Median: with 7 values, the 4th value is the middle one → median = 60.',
        'Mode: the value that repeats most often is 60 (it appears twice).',
        'Mean: add all values (45+50+55+60+60+70+80 = 420) and divide by 7 → 420 ÷ 7 = 60.',
      ],
      answer: 'Mean = 60, Median = 60, Mode = 60',
    },
  },
  {
    topicId: 'maps-plans',
    summary: 'Reading and interpreting scale, distance, direction and layout on maps, elevation drawings and floor plans.',
    keyIdeas: [
      'A scale like 1:50 000 means 1 unit on the map represents 50 000 of the same units in real life',
      'Actual distance = map distance × scale factor (then convert units, e.g. cm to m or km, as needed)',
      'Compass directions and bearings describe the direction from one point to another',
      'Floor plans use a scale to show real room dimensions on paper — always check the scale given before measuring',
    ],
    example: {
      problem: 'A map has a scale of 1 : 50 000. The distance between two towns measured on the map is 8 cm. Find the actual distance in kilometres.',
      steps: [
        'Multiply the map distance by the scale factor: 8 cm × 50 000 = 400 000 cm.',
        'Convert centimetres to metres: 400 000 cm ÷ 100 = 4 000 m.',
        'Convert metres to kilometres: 4 000 m ÷ 1 000 = 4 km.',
      ],
      answer: '4 km',
    },
  },
  {
    topicId: 'measurement',
    summary: 'Working with length, weight, volume, perimeter and area in real-life objects and spaces, and converting between units.',
    keyIdeas: [
      'Perimeter = the total distance around the outside of a shape',
      'Area of a rectangle = length × breadth; area of a triangle = ½ × base × height',
      'Volume of a rectangular prism (box) = length × breadth × height',
      'Common conversions: 1 m = 100 cm, 1 kg = 1 000 g, 1 kl = 1 000 l, 1 m³ = 1 000 litres',
    ],
    example: {
      problem: 'A rectangular water tank is 2 m long, 1.5 m wide and 1.2 m high. Calculate how many litres of water it can hold.',
      steps: [
        'Calculate the volume in cubic metres: 2 m × 1.5 m × 1.2 m = 3.6 m³.',
        'Convert cubic metres to litres using 1 m³ = 1 000 litres: 3.6 × 1 000 = 3 600 litres.',
      ],
      answer: '3 600 litres',
    },
  },

  // Mathematics
  {
    topicId: 'math-algebra',
    summary: 'Simplifying and factorising algebraic expressions, and solving linear, quadratic and simultaneous equations and inequalities.',
    keyIdeas: [
      'Always factorise fully before solving: look for a common factor, a difference of squares, or a trinomial pattern',
      'Quadratic formula: x = [−b ± √(b² − 4ac)] ÷ 2a, used when a quadratic will not factorise easily',
      'Simultaneous equations can be solved by substitution or elimination',
      'When multiplying or dividing an inequality by a negative number, the inequality sign must flip direction',
    ],
    example: {
      problem: 'Solve for x: x² − 5x + 6 = 0',
      steps: [
        'Factorise the trinomial: find two numbers that multiply to 6 and add to −5 → −2 and −3.',
        'Write the factors: (x − 2)(x − 3) = 0.',
        'Set each factor equal to zero: x − 2 = 0 or x − 3 = 0.',
      ],
      answer: 'x = 2 or x = 3',
    },
  },
  {
    topicId: 'math-functions',
    summary: 'Sketching and interpreting linear, quadratic, exponential and hyperbolic graphs — their intercepts, turning points and asymptotes.',
    keyIdeas: [
      'y-intercept: substitute x = 0 into the equation; x-intercept(s): set y = 0 and solve for x',
      'For a parabola y = ax² + bx + c, the turning point has x-coordinate = −b ÷ 2a',
      'An exponential function y = a·bˣ + q has a horizontal asymptote at y = q',
      'A hyperbola y = a ÷ (x − p) + q has asymptotes at x = p and y = q',
    ],
    example: {
      problem: 'For f(x) = x² − 2x − 8, find the y-intercept, the x-intercepts, and the turning point.',
      steps: [
        'y-intercept: f(0) = 0 − 0 − 8 = −8.',
        'x-intercepts: solve x² − 2x − 8 = 0 → (x − 4)(x + 2) = 0 → x = 4 or x = −2.',
        'Turning point x-coordinate: −b ÷ 2a = −(−2) ÷ 2(1) = 1. Then f(1) = 1 − 2 − 8 = −9.',
      ],
      answer: 'y-intercept (0, −8); x-intercepts (4, 0) and (−2, 0); turning point (1, −9)',
    },
  },
  {
    topicId: 'math-trigonometry',
    summary: 'Trig ratios and identities, reduction formulae, and using trigonometry to solve equations and find unknown sides or angles in triangles.',
    keyIdeas: [
      'SOH CAH TOA for right-angled triangles: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent',
      'Identity: sin²θ + cos²θ = 1',
      'Reduction formulae relate angles in different quadrants, e.g. sin(180° − θ) = sin θ and cos(180° − θ) = −cos θ',
      'The sine rule and cosine rule are used to solve triangles that do not have a right angle',
    ],
    example: {
      problem: 'In a right-angled triangle, the side opposite angle θ is 5 units and the hypotenuse is 13 units. Find θ, rounded to two decimal places.',
      steps: [
        'Identify the ratio to use: opposite and hypotenuse are given, so use sine.',
        'Write the equation: sin θ = 5 ÷ 13.',
        'Use inverse sine to find the angle: θ = sin⁻¹(5 ÷ 13).',
      ],
      answer: 'θ ≈ 22.62°',
    },
  },
  {
    topicId: 'math-analytical-geometry',
    summary: 'Using formulae to find distance, gradient and midpoint between points, and to write equations of lines and circles on the Cartesian plane.',
    keyIdeas: [
      'Distance formula: d = √[(x₂ − x₁)² + (y₂ − y₁)²]',
      'Gradient formula: m = (y₂ − y₁) ÷ (x₂ − x₁)',
      'Midpoint formula: ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2)',
      'A circle centred at the origin with radius r has equation x² + y² = r²',
    ],
    example: {
      problem: 'Find the distance between A(1, 2) and B(4, 6), and the midpoint of AB.',
      steps: [
        'Distance: d = √[(4 − 1)² + (6 − 2)²] = √(9 + 16) = √25.',
        'Midpoint: ((1 + 4) ÷ 2, (2 + 6) ÷ 2) = (2.5, 4).',
      ],
      answer: 'Distance = 5 units; midpoint = (2.5, 4)',
    },
  },
  {
    topicId: 'math-statistics',
    summary: 'Describing data sets using measures of central tendency and spread, including standard deviation, and interpreting statistical graphs.',
    keyIdeas: [
      'Mean, median and mode summarise the "centre" of a data set',
      'Standard deviation measures how spread out the data is from the mean — a larger value means more variability',
      'The five-number summary (minimum, lower quartile, median, upper quartile, maximum) is used to draw a box-and-whisker plot',
      'A data set with values clustered close to the mean has a small standard deviation',
    ],
    example: {
      problem: 'Find the mean of the data set: 2, 4, 4, 4, 5, 5, 7, 9.',
      steps: [
        'Add all the values: 2 + 4 + 4 + 4 + 5 + 5 + 7 + 9 = 40.',
        'Divide by the number of values: 40 ÷ 8 = 5.',
        '(Standard deviation would then measure how far each value lies from this mean of 5 — usually calculated with a calculator\'s statistics mode in the exam.)',
      ],
      answer: 'Mean = 5',
    },
  },
  {
    topicId: 'math-finance-growth',
    summary: 'Using algebraic formulae for simple and compound growth and decay, and for annuities, to solve financial problems.',
    keyIdeas: [
      'Simple growth: A = P(1 + i·n)',
      'Compound growth: A = P(1 + i)ⁿ',
      'Compound decay: A = P(1 − i)ⁿ',
      'P = original amount, i = interest rate (as a decimal), n = number of periods, A = final amount',
    ],
    example: {
      problem: 'R5 000 is invested at 8% p.a. compound interest for 3 years. Calculate the final amount.',
      steps: [
        'Write down the compound growth formula: A = P(1 + i)ⁿ.',
        'Substitute the values: A = 5 000(1 + 0.08)³ = 5 000(1.08)³.',
        'Calculate: (1.08)³ = 1.259712, so A = 5 000 × 1.259712.',
      ],
      answer: 'A = R6 298.56',
    },
  },
  {
    topicId: 'math-number-patterns',
    summary: 'Finding and describing patterns in arithmetic and geometric sequences, and using formulae to find terms and sums of series.',
    keyIdeas: [
      'Arithmetic sequence (constant difference d): Tₙ = a + (n − 1)d',
      'Geometric sequence (constant ratio r): Tₙ = a·rⁿ⁻¹',
      'Sum of an arithmetic series: Sₙ = n/2 [2a + (n − 1)d]',
      'Sum of a geometric series: Sₙ = a(rⁿ − 1) ÷ (r − 1), for r ≠ 1',
    ],
    example: {
      problem: 'Find the 10th term of the arithmetic sequence 3, 7, 11, 15, ...',
      steps: [
        'Identify a (first term) and d (common difference): a = 3, d = 4.',
        'Substitute into Tₙ = a + (n − 1)d with n = 10: T₁₀ = 3 + (10 − 1)(4).',
        'Calculate: T₁₀ = 3 + 9 × 4 = 3 + 36.',
      ],
      answer: 'T₁₀ = 39',
    },
  },
  {
    topicId: 'math-calculus',
    summary: 'Finding derivatives from first principles and using differentiation rules to analyse and sketch cubic graphs.',
    keyIdeas: [
      'Derivative from first principles: f\'(x) = lim(h→0) [f(x + h) − f(x)] ÷ h',
      'Power rule (once first principles is understood): d/dx[xⁿ] = n·xⁿ⁻¹',
      'Stationary (turning) points occur where f\'(x) = 0',
      'The derivative shows where a graph is increasing (f\'(x) > 0) or decreasing (f\'(x) < 0)',
    ],
    example: {
      problem: 'Differentiate f(x) = x³ − 3x² + 2 and find its stationary points.',
      steps: [
        'Apply the power rule to each term: f\'(x) = 3x² − 6x.',
        'Set the derivative equal to zero to find stationary points: 3x² − 6x = 0.',
        'Factorise: 3x(x − 2) = 0, so x = 0 or x = 2.',
      ],
      answer: 'f\'(x) = 3x² − 6x; stationary points at x = 0 and x = 2',
    },
  },
  {
    topicId: 'math-counting-probability',
    summary: 'Using Venn diagrams, tree diagrams and counting rules to calculate probabilities and count possible outcomes.',
    keyIdeas: [
      'Addition rule: P(A or B) = P(A) + P(B) − P(A and B)',
      'Mutually exclusive events cannot happen together: P(A and B) = 0',
      'Independent events: P(A and B) = P(A) × P(B)',
      'Fundamental counting principle: multiply the number of choices available at each stage to find the total number of outcomes',
    ],
    example: {
      problem: 'A restaurant offers 3 starters and 4 main courses. How many different starter-and-main combinations are possible?',
      steps: [
        'Identify the number of choices at each stage: 3 starters, 4 mains.',
        'Apply the fundamental counting principle by multiplying the choices: 3 × 4.',
      ],
      answer: '12 combinations',
    },
  },
  {
    topicId: 'math-euclidean-geometry',
    summary: 'Applying circle theorems and similar-triangle rules to prove riders and calculate unknown angles and lengths.',
    keyIdeas: [
      'The angle at the centre of a circle is twice the angle at the circumference subtended by the same arc',
      'Angles in the same segment of a circle, subtended by the same arc, are equal',
      'Opposite angles of a cyclic quadrilateral are supplementary (add up to 180°)',
      'Proportionality theorem: a line drawn parallel to one side of a triangle divides the other two sides in the same proportion',
    ],
    example: {
      problem: 'ABCD is a cyclic quadrilateral. Angle A = 110°. Find angle C.',
      steps: [
        'Recall the rule: opposite angles of a cyclic quadrilateral are supplementary.',
        'Set up the equation: angle A + angle C = 180°.',
        'Substitute and solve: 110° + angle C = 180° → angle C = 180° − 110°.',
      ],
      answer: 'Angle C = 70°',
    },
  },
  {
    topicId: 'life-sci-chemistry-of-life',
    summary: 'The inorganic and organic compounds that make up living cells, the food tests that identify them, and why enzymes control almost every reaction in the body.',
    keyIdeas: [
      'Water is the medium for every reaction in a cell: it dissolves substances, transports them, and resists temperature change',
      'Organic compounds all contain carbon; the four groups are carbohydrates, lipids, proteins and nucleic acids',
      'Carbohydrates and lipids contain only C, H and O; proteins add nitrogen (N), and often sulfur',
      'Enzymes are biological catalysts made of protein: they speed up reactions without being used up',
      'Enzyme action is specific because the shape of the active site fits only one substrate',
    ],
    subtopics: [
      {
        name: 'Inorganic compounds',
        points: [
          'Water: high specific heat capacity, universal solvent, transport medium, reactant in photosynthesis',
          'Mineral salts: calcium and phosphate for bones and teeth, iron for haemoglobin, iodine for thyroxin',
          'A deficiency disease names the missing mineral: anaemia points to iron, goitre to iodine',
        ],
      },
      {
        name: 'Organic compounds and food tests',
        points: [
          'Carbohydrates: monosaccharides (glucose), disaccharides (sucrose), polysaccharides (starch, cellulose, glycogen)',
          'Lipids: one glycerol plus three fatty acids; store more energy per gram than carbohydrates',
          'Proteins: chains of amino acids; used for growth, repair, enzymes, antibodies and haemoglobin',
          'Tests: iodine turns blue-black for starch; Benedicts turns brick-red on heating for reducing sugar; the grease spot is translucent for lipids; Biuret turns violet for protein',
        ],
      },
      {
        name: 'Enzymes',
        points: [
          'Lock-and-key model: the substrate fits the active site of one particular enzyme',
          'Optimum temperature is about 37 degrees Celsius in humans; above it the enzyme denatures and the active site changes shape permanently',
          'Optimum pH differs by enzyme: pepsin works at about pH 2 in the stomach, amylase at about pH 7 in the mouth',
          'Denaturing is permanent; slowing down in the cold is not',
        ],
      },
    ],
    commonMistakes: [
      'An enzyme that is denatured has not been used up or killed: its active site has changed shape, so it can no longer bind the substrate',
      'Cellulose and starch are both made of glucose, but only starch is a storage compound; cellulose builds the cell wall',
      'Benedicts solution must be heated before the colour change means anything',
    ],
    example: {
      problem: 'A learner tests a food sample. Iodine turns blue-black, Biuret stays blue, and a grease spot appears on paper. State which food groups are present and which is absent.',
      steps: [
        'Iodine turning blue-black is a positive test for starch, so a carbohydrate is present.',
        'Biuret staying blue is a negative result, so protein is absent.',
        'A translucent grease spot is a positive test for lipids, so lipids are present.',
      ],
      answer: 'Starch and lipids are present; protein is absent.',
    },
    moreExamples: [
      {
        problem: 'An enzyme works best at 37 degrees Celsius. Explain what happens to its rate of reaction at 10 degrees Celsius and at 70 degrees Celsius.',
        steps: [
          'At 10 degrees Celsius the molecules move slowly, so there are fewer collisions between enzyme and substrate and the rate is low.',
          'This slowing is temporary: warming the enzyme back to 37 degrees Celsius restores the rate.',
          'At 70 degrees Celsius the heat breaks the bonds holding the enzyme in shape, so the active site changes shape and the enzyme denatures.',
          'Denaturing is permanent, so cooling back to 37 degrees Celsius does not restore the rate.',
        ],
        answer: 'Slow but recoverable at 10 degrees Celsius; denatured and permanently inactive at 70 degrees Celsius.',
      },
    ],
  },
  {
    topicId: 'life-sci-cells',
    summary: 'The structure of plant and animal cells under the microscope, what each organelle does, how substances move across the cell membrane, and how magnification is calculated.',
    keyIdeas: [
      'The cell is the smallest unit of life; all organisms are made of one or more cells',
      'Plant cells have a cell wall, chloroplasts and one large vacuole; animal cells have none of these',
      'The cell membrane is selectively permeable: it controls what enters and leaves',
      'Diffusion and osmosis are passive and need no energy; active transport moves substances against the concentration gradient and needs ATP',
      'Magnification = size of the drawing divided by the real size of the object',
    ],
    subtopics: [
      {
        name: 'Organelles and their functions',
        points: [
          'Nucleus: contains DNA and controls all cell activities',
          'Mitochondrion: site of aerobic respiration, releasing ATP; has its own DNA',
          'Chloroplast: site of photosynthesis; contains chlorophyll; found in plant cells only',
          'Ribosome: site of protein synthesis',
          'Vacuole: stores cell sap and keeps the plant cell turgid',
        ],
      },
      {
        name: 'Movement across the membrane',
        points: [
          'Diffusion: movement of particles from high to low concentration until evenly spread',
          'Osmosis: movement of water only, across a selectively permeable membrane, from a high to a low water concentration',
          'Active transport: movement against the gradient, using energy from ATP, for example mineral uptake by root hairs',
          'A plant cell in a strong salt solution loses water and becomes plasmolysed; an animal cell in pure water bursts (lysis)',
        ],
      },
      {
        name: 'Microscopy and magnification',
        points: [
          'Total magnification = eyepiece magnification multiplied by objective lens magnification',
          'For a drawing: magnification = drawing size divided by actual size, written as a number with a multiplication sign',
          'Keep both measurements in the same unit before dividing',
        ],
      },
    ],
    formulae: [
      'Magnification = drawing (or image) size / actual size',
      'Total magnification = eyepiece x objective',
      '1 mm = 1 000 micrometres',
    ],
    commonMistakes: [
      'Osmosis is the movement of water, not of the dissolved salt or sugar',
      'Magnification has no unit; it is a ratio, so the two lengths must be converted to the same unit first',
      'A plant cell does not burst in pure water, because the cell wall resists the pressure',
    ],
    example: {
      problem: 'A cell is drawn 40 mm long. The actual cell is 20 micrometres long. Calculate the magnification of the drawing.',
      steps: [
        'Convert both to the same unit: 40 mm = 40 000 micrometres.',
        'Magnification = drawing size divided by actual size = 40 000 / 20.',
        'Work out the division: 40 000 / 20 = 2 000.',
      ],
      answer: 'x 2 000',
    },
    moreExamples: [
      {
        problem: 'A plant cell is placed in a concentrated sugar solution. Describe and explain what happens to the cell.',
        steps: [
          'The water concentration outside the cell is lower than inside the cell sap.',
          'Water therefore moves out of the vacuole by osmosis, across the selectively permeable membrane.',
          'The vacuole shrinks and the cell membrane pulls away from the cell wall.',
          'The cell is now plasmolysed and flaccid, though the rigid cell wall keeps its overall shape.',
        ],
        answer: 'The cell loses water by osmosis and becomes plasmolysed (flaccid).',
      },
    ],
  },
  {
    topicId: 'life-sci-mitosis',
    summary: 'How one cell divides into two genetically identical daughter cells, the events of each phase, and what happens when the process is no longer controlled.',
    keyIdeas: [
      'Mitosis produces two daughter cells that are genetically identical to each other and to the parent cell',
      'The chromosome number stays the same: a diploid cell produces diploid cells',
      'Mitosis is used for growth, for repair of damaged tissue, and for asexual reproduction',
      'Interphase is not part of mitosis: it is the growth phase in which DNA is replicated',
      'Uncontrolled mitosis produces a tumour, which may be benign or malignant',
    ],
    subtopics: [
      {
        name: 'Interphase',
        points: [
          'G1: the cell grows and makes new organelles',
          'S: DNA replicates, so each chromosome now has two identical chromatids',
          'G2: the cell prepares the proteins needed for division',
        ],
      },
      {
        name: 'The four phases',
        points: [
          'Prophase: chromosomes shorten and thicken and become visible; the nuclear membrane breaks down; spindle fibres form',
          'Metaphase: chromosomes line up singly along the equator of the cell',
          'Anaphase: the chromatids are pulled apart to opposite poles by the spindle fibres',
          'Telophase: chromosomes reach the poles, uncoil, and two new nuclear membranes form',
        ],
      },
      {
        name: 'Cytokinesis and cancer',
        points: [
          'In animal cells the membrane pinches inwards; in plant cells a cell plate forms between the two nuclei',
          'A tumour is a mass of cells produced by mitosis that is no longer controlled',
          'Benign tumours stay in one place; malignant tumours spread to other organs, which is called metastasis',
        ],
      },
    ],
    commonMistakes: [
      'Chromosomes line up singly in metaphase of mitosis; lining up in pairs happens in meiosis I',
      'DNA replicates in interphase, not in prophase',
      'Cytokinesis is the division of the cytoplasm and is separate from mitosis, which divides the nucleus',
    ],
    example: {
      problem: 'A cell with 46 chromosomes undergoes mitosis. State the number of daughter cells produced and the number of chromosomes in each.',
      steps: [
        'Mitosis produces two daughter cells from one parent cell.',
        'Mitosis is a division that keeps the chromosome number the same.',
        'Each daughter cell therefore has the same 46 chromosomes as the parent cell.',
      ],
      answer: 'Two daughter cells, each with 46 chromosomes.',
    },
    moreExamples: [
      {
        problem: 'Explain why the daughter cells produced by mitosis are genetically identical to the parent cell.',
        steps: [
          'During the S phase of interphase, each chromosome is copied exactly to form two identical chromatids.',
          'In metaphase the chromosomes line up singly along the equator.',
          'In anaphase the two identical chromatids of each chromosome are separated and pulled to opposite poles.',
          'Each pole therefore receives one exact copy of every chromosome, so both daughter nuclei carry identical DNA.',
        ],
        answer: 'Because DNA is replicated exactly in interphase and the identical chromatids are then separated equally between the two cells.',
      },
    ],
  },
  {
    topicId: 'life-sci-plant-tissues',
    summary: 'The tissues that make up a dicotyledonous plant, where each one sits in root, stem and leaf, and how structure fits function.',
    keyIdeas: [
      'Meristematic tissue is the only plant tissue that divides; it is found at root and shoot tips and in the cambium',
      'Epidermis is a single protective layer, often with a waxy cuticle that reduces water loss',
      'Parenchyma is packing tissue; when it contains chloroplasts in the leaf it is called chlorenchyma and carries out photosynthesis',
      'Xylem carries water and mineral salts upwards only; its vessels are dead, hollow and lignified',
      'Phloem carries manufactured food in both directions; its sieve tubes are living and have companion cells',
    ],
    subtopics: [
      {
        name: 'Ground and protective tissues',
        points: [
          'Parenchyma: thin-walled living cells that store food and water',
          'Collenchyma: thickened corners give flexible support to young stems',
          'Sclerenchyma: dead, heavily lignified cells that give rigid support',
          'Epidermis with cuticle: reduces transpiration; guard cells in the leaf epidermis control the stomata',
        ],
      },
      {
        name: 'Vascular tissue',
        points: [
          'Xylem: vessels and tracheids, dead at maturity, no end walls, lignified for strength; transport is one way, upwards',
          'Phloem: sieve tubes with perforated sieve plates, kept alive by companion cells; transport is two way',
          'In a dicot root the xylem forms a star shape in the centre; in a dicot stem the bundles form a ring with xylem inside and phloem outside',
        ],
      },
      {
        name: 'The leaf in section',
        points: [
          'Upper epidermis with cuticle, then palisade mesophyll packed with chloroplasts, then spongy mesophyll with air spaces, then lower epidermis with most of the stomata',
          'Palisade cells are long and vertical so that more chloroplasts sit near the light',
          'Air spaces in the spongy layer allow carbon dioxide to diffuse to the photosynthesising cells',
        ],
      },
    ],
    commonMistakes: [
      'Xylem transport is upwards only; saying it moves food in both directions confuses it with phloem',
      'Xylem vessels are dead at maturity, which is why they are hollow and offer no resistance to flow',
      'Stomata are mostly in the lower epidermis of a leaf, which reduces water loss in direct sun',
    ],
    example: {
      problem: 'Name the tissue that transports water in a plant, and give TWO structural features that suit it to this function.',
      steps: [
        'Water and dissolved mineral salts are transported by xylem.',
        'The cells are dead and hollow with no cross walls, so water flows through an unobstructed tube.',
        'The walls are strengthened with lignin, so the vessel does not collapse under the tension of the transpiration stream.',
      ],
      answer: 'Xylem; it is a hollow tube of dead cells with no end walls, and its walls are lignified for strength.',
    },
    moreExamples: [
      {
        problem: 'Explain why palisade mesophyll cells are found in the upper half of a leaf rather than the lower half.',
        steps: [
          'Palisade cells contain the largest number of chloroplasts in the leaf.',
          'Light strikes the upper surface of the leaf first and is absorbed as it passes down through the tissue.',
          'Placing the palisade layer directly beneath the upper epidermis exposes those chloroplasts to the strongest light.',
          'The rate of photosynthesis is therefore as high as possible.',
        ],
        answer: 'Because they hold the most chloroplasts, so they are positioned where the light is strongest.',
      },
    ],
  },
  {
    topicId: 'life-sci-animal-tissues',
    summary: 'The four basic animal tissue types, examples of each, and how their structure matches the job they do in the body.',
    keyIdeas: [
      'The four tissue types are epithelial, connective, muscle and nervous tissue',
      'Epithelial tissue covers surfaces and lines cavities; it sits on a basement membrane and has almost no intercellular space',
      'Connective tissue has few cells and a large amount of matrix between them',
      'Muscle tissue contracts; nervous tissue conducts impulses',
      'Tissues combine to form organs, and organs combine to form systems',
    ],
    subtopics: [
      {
        name: 'Epithelial tissue',
        points: [
          'Squamous: flat, thin cells for diffusion, as in the alveoli and blood capillaries',
          'Cuboidal and columnar: taller cells for secretion and absorption, as in glands and the small intestine',
          'Ciliated columnar: bears cilia that sweep mucus along, as in the trachea',
        ],
      },
      {
        name: 'Connective tissue',
        points: [
          'Areolar tissue binds organs and fills spaces',
          'Adipose tissue stores fat, insulates and cushions',
          'Cartilage is firm but flexible; bone is hard because the matrix contains calcium salts',
          'Blood is a connective tissue: its matrix is the liquid plasma',
        ],
      },
      {
        name: 'Muscle and nervous tissue',
        points: [
          'Skeletal muscle: striated, attached to bone, under voluntary control',
          'Cardiac muscle: striated and branched, found only in the heart, involuntary and never tires',
          'Smooth muscle: not striated, found in the gut and blood vessel walls, involuntary',
          'Neurons carry impulses; the cell body, dendrites and axon each have a distinct role',
        ],
      },
    ],
    commonMistakes: [
      'Blood and bone are both connective tissues, because both consist of cells scattered in a matrix',
      'Cardiac muscle is striated like skeletal muscle but is involuntary like smooth muscle',
      'Squamous epithelium is thin because its job is diffusion, not protection',
    ],
    example: {
      problem: 'Blood and bone are both classified as connective tissue. Justify this classification.',
      steps: [
        'Connective tissue is defined by having relatively few cells separated by a large amount of matrix.',
        'In bone, the cells sit in a hard matrix containing calcium salts.',
        'In blood, the cells are suspended in the liquid matrix called plasma.',
        'Both therefore match the definition, even though one matrix is solid and the other liquid.',
      ],
      answer: 'Both consist of cells scattered in a large amount of matrix: a hard calcium matrix in bone and liquid plasma in blood.',
    },
    moreExamples: [
      {
        problem: 'Explain why the alveoli of the lungs are lined with squamous epithelium rather than columnar epithelium.',
        steps: [
          'Squamous epithelial cells are extremely flat and thin.',
          'Gases must diffuse between the air in the alveolus and the blood in the capillary.',
          'A thin lining gives a short diffusion distance, so gases cross quickly.',
          'Columnar cells are much taller and would slow diffusion down.',
        ],
        answer: 'Because squamous cells are very thin, giving the short diffusion distance that rapid gaseous exchange needs.',
      },
    ],
  },
  {
    topicId: 'life-sci-transport-plants',
    summary: 'How water travels from the soil to the leaves, what drives transpiration, and how plants are supported and adapted to conserve water.',
    keyIdeas: [
      'Water enters through root hairs by osmosis, moves across the root, and rises in the xylem to the leaves',
      'Transpiration is the loss of water vapour from the leaves, mostly through the stomata',
      'The transpiration stream is driven by evaporation at the leaf, which pulls the water column upwards',
      'Cohesion between water molecules and adhesion to the xylem wall keep the column unbroken',
      'Turgor pressure in parenchyma cells supports soft, non-woody plants',
    ],
    subtopics: [
      {
        name: 'Water uptake and pathway',
        points: [
          'Root hairs give a very large surface area for absorption',
          'Water enters by osmosis; mineral salts often enter by active transport, using ATP',
          'Pathway: root hair, root cortex, root xylem, stem xylem, leaf xylem, mesophyll, stomata',
        ],
      },
      {
        name: 'Transpiration and its rate',
        points: [
          'Rate increases with higher temperature, more wind, lower humidity and more light (stomata open)',
          'Rate decreases in still, humid, cool or dark conditions',
          'Guard cells become turgid and open the stoma when water is plentiful and light is available',
        ],
      },
      {
        name: 'Adaptations to reduce water loss',
        points: [
          'Thick waxy cuticle, sunken stomata, rolled leaves, hairs on the leaf surface, reduced leaf area (spines)',
          'These adaptations trap a layer of humid air next to the stomata, lowering the rate of diffusion out of the leaf',
        ],
      },
    ],
    commonMistakes: [
      'Water is pulled up by evaporation at the top, not pushed up from the root; root pressure alone cannot explain the height of a tall tree',
      'Transpiration is the loss of water vapour; the movement of water up the stem is the transpiration stream',
      'Closing stomata saves water but also stops carbon dioxide entering, so photosynthesis slows',
    ],
    example: {
      problem: 'Explain why the rate of transpiration increases on a hot, windy day.',
      steps: [
        'Higher temperature gives water molecules more energy, so evaporation from the mesophyll cell surfaces speeds up.',
        'Wind blows away the humid air that collects just outside the stomata.',
        'This keeps the water vapour concentration outside the leaf low, so the concentration gradient between the leaf and the air stays steep.',
        'Water vapour therefore diffuses out of the stomata faster.',
      ],
      answer: 'Heat speeds up evaporation inside the leaf and wind keeps the outside air dry, so the diffusion gradient stays steep.',
    },
    moreExamples: [
      {
        problem: 'A plant that has not been watered for several days begins to wilt. Explain why.',
        steps: [
          'With little soil water, the plant absorbs less water than it loses through transpiration.',
          'The vacuoles of the parenchyma cells lose water and shrink.',
          'The cells lose turgor pressure and become flaccid, so they no longer press against one another.',
          'Soft tissues depend on this turgor for support, so the leaves and stem droop.',
        ],
        answer: 'The cells lose turgor pressure, and soft plant tissue relies on turgor for support.',
      },
    ],
  },
  {
    topicId: 'life-sci-skeletal-system',
    summary: 'The parts of the human skeleton, the structure of joints, how muscles work in antagonistic pairs, and the main disorders of bones and joints.',
    keyIdeas: [
      'The skeleton gives support, protection, movement, mineral storage and blood cell production',
      'The axial skeleton is the skull, vertebral column, ribs and sternum; the appendicular skeleton is the limbs and girdles',
      'A joint is where two bones meet; synovial joints allow the freest movement',
      'Muscles can only pull, never push, so they work in antagonistic pairs',
      'Ligaments join bone to bone; tendons join muscle to bone',
    ],
    subtopics: [
      {
        name: 'Structure of the skeleton',
        points: [
          'Axial: skull protects the brain, ribs and sternum protect heart and lungs, vertebral column protects the spinal cord',
          'Appendicular: pectoral girdle and arms, pelvic girdle and legs',
          'Long bone structure: compact bone outside, spongy bone at the ends, marrow cavity inside, cartilage at the joint surfaces',
        ],
      },
      {
        name: 'Joints',
        points: [
          'Fibrous (immovable), for example the sutures of the skull',
          'Cartilaginous (slightly movable), for example between vertebrae',
          'Synovial (freely movable): hinge at the elbow and knee, ball-and-socket at the shoulder and hip',
          'Synovial fluid lubricates; cartilage cushions; the capsule and ligaments hold the joint together',
        ],
      },
      {
        name: 'Muscles and disorders',
        points: [
          'Biceps and triceps are antagonistic: when the biceps contracts the arm bends and the triceps relaxes',
          'Arthritis is inflammation of a joint; osteoporosis is loss of bone density making bones brittle',
          'Rickets follows a shortage of vitamin D or calcium, so bones soften and bend',
        ],
      },
    ],
    commonMistakes: [
      'A hinge joint moves in one plane only; the shoulder and hip are ball-and-socket and rotate',
      'Tendons attach muscle to bone and ligaments attach bone to bone, not the other way round',
      'A muscle relaxing is not the same as a muscle pushing; the opposite muscle does the pulling',
    ],
    example: {
      problem: 'Explain how the biceps and triceps work together to straighten the arm at the elbow.',
      steps: [
        'Muscles can only pull when they contract, so one muscle cannot both bend and straighten a joint.',
        'To straighten the arm the triceps contracts and pulls on the ulna.',
        'At the same time the biceps relaxes, allowing the joint to open.',
        'The two muscles therefore form an antagonistic pair working across the same hinge joint.',
      ],
      answer: 'The triceps contracts while the biceps relaxes, because muscles can only pull and so must work in antagonistic pairs.',
    },
    moreExamples: [
      {
        problem: 'State the type of joint found at the hip, and explain why this type suits the movement required there.',
        steps: [
          'The hip is a ball-and-socket joint: the rounded head of the femur sits in the socket of the pelvic girdle.',
          'A ball-and-socket joint allows movement in all planes, as well as rotation.',
          'Walking, running and climbing all require the leg to swing forwards, backwards, sideways and to rotate.',
          'A hinge joint would allow movement in only one plane and could not do this.',
        ],
        answer: 'A ball-and-socket joint, because it permits movement in every plane and rotation, which walking and running require.',
      },
    ],
  },
  {
    topicId: 'life-sci-circulatory-system',
    summary: 'The structure of the human heart, the double circulation, the blood vessels and blood components, and the lifestyle diseases that affect the system.',
    keyIdeas: [
      'Humans have a closed, double circulation: blood passes through the heart twice for each full circuit',
      'The pulmonary circuit carries blood to the lungs; the systemic circuit carries it to the rest of the body',
      'The left ventricle has the thickest wall because it pumps blood to the whole body',
      'Valves prevent the backflow of blood',
      'Arteries carry blood away from the heart, veins carry blood back to it',
    ],
    subtopics: [
      {
        name: 'The heart',
        points: [
          'Four chambers: right atrium, right ventricle, left atrium, left ventricle',
          'Right side carries deoxygenated blood, left side oxygenated; the septum keeps them apart',
          'Tricuspid valve on the right and bicuspid on the left prevent backflow into the atria; semilunar valves prevent backflow into the ventricles',
          'Coronary arteries supply the heart muscle itself with oxygen',
        ],
      },
      {
        name: 'Blood vessels',
        points: [
          'Arteries: thick, muscular, elastic walls and a narrow lumen, to withstand high pressure; no valves',
          'Veins: thin walls and a wide lumen, low pressure, with valves to stop backflow',
          'Capillaries: one cell thick, for exchange of gases, nutrients and wastes with the tissues',
        ],
      },
      {
        name: 'Blood and disorders',
        points: [
          'Plasma carries dissolved substances; red blood cells carry oxygen using haemoglobin; white blood cells fight infection; platelets clot blood',
          'Red blood cells have no nucleus and are biconcave, giving more room for haemoglobin and a larger surface area',
          'Atherosclerosis is the narrowing of arteries by fatty deposits; it raises blood pressure and can cause a heart attack or stroke',
        ],
      },
    ],
    commonMistakes: [
      'The pulmonary artery carries deoxygenated blood and the pulmonary vein carries oxygenated blood; vessels are named by direction of flow, not by what they carry',
      'Blood flows through the heart twice per circuit, which is why this is called a double circulation',
      'Capillaries are thin for exchange, not for strength',
    ],
    example: {
      problem: 'Explain why the wall of the left ventricle is thicker than the wall of the right ventricle.',
      steps: [
        'The right ventricle pumps blood only as far as the lungs, which lie next to the heart.',
        'The left ventricle pumps blood to the whole body, including the head and the legs.',
        'A greater distance and greater resistance require a higher pressure.',
        'More cardiac muscle in the wall generates that higher pressure.',
      ],
      answer: 'Because it pumps blood to the whole body rather than only to the nearby lungs, which needs a much higher pressure.',
    },
    moreExamples: [
      {
        problem: 'Describe the path of a red blood cell from the vena cava until it leaves the heart in the aorta.',
        steps: [
          'The vena cava empties deoxygenated blood into the right atrium.',
          'The right atrium contracts and blood passes through the tricuspid valve into the right ventricle.',
          'The right ventricle contracts and pushes blood through the pulmonary artery to the lungs, where it is oxygenated.',
          'Oxygenated blood returns through the pulmonary vein to the left atrium, passes the bicuspid valve into the left ventricle, and is pumped out through the aorta.',
        ],
        answer: 'Vena cava, right atrium, right ventricle, pulmonary artery, lungs, pulmonary vein, left atrium, left ventricle, aorta.',
      },
    ],
  },
  {
    topicId: 'life-sci-ecosystem-energy-flow',
    summary: 'How energy entering an ecosystem as sunlight passes along food chains and webs, and why the amount available falls sharply at each level.',
    keyIdeas: [
      'Energy enters as sunlight and is trapped by producers during photosynthesis',
      'A food chain shows one pathway; a food web shows many interlinked chains',
      'Each feeding stage is a trophic level: producer, primary consumer, secondary consumer, tertiary consumer',
      'Only about 10% of the energy at one trophic level is passed on to the next',
      'Energy flows one way and is lost as heat; nutrients, by contrast, are recycled',
    ],
    subtopics: [
      {
        name: 'Food chains and webs',
        points: [
          'Arrows point in the direction the energy flows, that is from the eaten to the eater',
          'Producers are green plants; herbivores are primary consumers; carnivores are secondary or tertiary consumers',
          'Decomposers break down dead material and release nutrients back into the soil',
        ],
      },
      {
        name: 'Energy loss',
        points: [
          'Energy is lost at each level through respiration, movement, heat, excretion and undigested remains',
          'This is why food chains rarely have more than four or five links',
          'Pyramids of numbers can be inverted (one tree feeding many insects), but a pyramid of energy is always upright',
        ],
      },
      {
        name: 'Effects of change',
        points: [
          'Removing one species affects every organism linked to it in the web',
          'A predator removed means its prey increases, which then over-grazes its own food source',
          'Bioaccumulation: substances such as DDT become more concentrated at each trophic level',
        ],
      },
    ],
    formulae: [
      'Percentage energy transferred = (energy at the higher level / energy at the lower level) x 100',
    ],
    commonMistakes: [
      'Arrows in a food chain show the flow of energy, so they point towards the consumer, not towards the food',
      'Energy is not recycled; only nutrients are',
      'A pyramid of numbers can be upside down, but a pyramid of energy cannot',
    ],
    example: {
      problem: 'A producer level contains 10 000 kJ of energy and the primary consumer level contains 900 kJ. Calculate the percentage of energy transferred, and state whether this is typical.',
      steps: [
        'Percentage transferred = (energy at the higher level / energy at the lower level) x 100.',
        'Substitute the values: (900 / 10 000) x 100.',
        'Work it out: 0.09 x 100 = 9%.',
        'The usual figure quoted is about 10%, so 9% is typical.',
      ],
      answer: '9%, which is close to the usual 10% and therefore typical.',
    },
    moreExamples: [
      {
        problem: 'In a food web, owls eat both mice and snakes, and snakes also eat mice. Predict and explain the effect on the mouse population if all the snakes were removed.',
        steps: [
          'Removing snakes removes one of the two predators of the mice, so fewer mice are eaten.',
          'The mouse population would therefore be expected to increase at first.',
          'However, owls now have only mice to eat, so owls would eat more mice than before.',
          'The increase would therefore be smaller than expected, and the mouse population may settle at a new level rather than rising without limit.',
        ],
        answer: 'The mouse population rises at first, but less than expected, because the owls switch to feeding on mice alone.',
      },
    ],
  },
  {
    topicId: 'life-sci-nutrient-cycling',
    summary: 'How carbon, water and nitrogen move repeatedly between the living and non-living parts of an ecosystem, and how human activity disturbs these cycles.',
    keyIdeas: [
      'Nutrients are recycled, unlike energy, which flows through an ecosystem once',
      'Photosynthesis removes carbon dioxide from the air; respiration, decomposition and combustion return it',
      'Decomposers are essential to every cycle: without them nutrients stay locked in dead material',
      'Nitrogen gas makes up about 78% of the air but cannot be used by plants directly',
      'Human activity shifts cycles out of balance, for example by burning fossil fuels or over-applying fertiliser',
    ],
    subtopics: [
      {
        name: 'The carbon cycle',
        points: [
          'Carbon enters the living world through photosynthesis and leaves it through respiration',
          'Decomposition releases carbon from dead organisms; combustion releases carbon stored in fossil fuels',
          'Burning fossil fuels and deforestation raise atmospheric carbon dioxide, strengthening the greenhouse effect',
        ],
      },
      {
        name: 'The water cycle',
        points: [
          'Evaporation and transpiration put water vapour into the air; condensation forms clouds; precipitation returns water to the ground',
          'Water then runs off into rivers or infiltrates to become groundwater',
          'Removing vegetation reduces transpiration and increases run-off, which causes erosion and flooding',
        ],
      },
      {
        name: 'The nitrogen cycle',
        points: [
          'Nitrogen fixation: bacteria in root nodules of legumes, and lightning, convert nitrogen gas into nitrates',
          'Nitrification: bacteria convert ammonia to nitrites and then to nitrates, which plants absorb',
          'Denitrification: bacteria return nitrogen gas to the air',
          'Eutrophication: fertiliser runoff causes algal blooms, which block light and use up oxygen when they decompose, killing fish',
        ],
      },
    ],
    commonMistakes: [
      'Plants absorb nitrates from the soil, not nitrogen gas from the air',
      'Decomposers release nutrients; they do not consume the ecosystem energy budget in the way consumers do',
      'Eutrophication kills fish through oxygen depletion during decomposition, not through the fertiliser being poisonous',
    ],
    example: {
      problem: 'Explain why farmers plant legumes such as beans in a field between crops of maize.',
      steps: [
        'Legumes have root nodules containing nitrogen-fixing bacteria.',
        'These bacteria convert nitrogen gas from the air into nitrates in the soil.',
        'This raises the nitrate content of the soil without the cost of artificial fertiliser.',
        'The maize planted afterwards can absorb these nitrates and grow better.',
      ],
      answer: 'Because nitrogen-fixing bacteria in the root nodules of legumes enrich the soil with nitrates for the next crop.',
    },
    moreExamples: [
      {
        problem: 'A river downstream of a farm develops a thick algal bloom, and fish later die. Explain the sequence of events.',
        steps: [
          'Fertiliser containing nitrates runs off the farm into the river.',
          'The extra nitrates allow algae to grow rapidly, forming a bloom on the surface.',
          'The bloom blocks light from reaching plants below, which die, and the algae themselves soon die.',
          'Decomposers multiply as they break down all this dead material, and their respiration uses up the dissolved oxygen, so the fish suffocate.',
        ],
        answer: 'Nitrate runoff causes an algal bloom; when the algae die, decomposers use up the dissolved oxygen and the fish die of oxygen starvation.',
      },
    ],
  },
  {
    topicId: 'life-sci-photosynthesis',
    summary: 'How green plants trap light energy to build glucose, the two stages of the process, and the factors that limit the rate.',
    keyIdeas: [
      'Photosynthesis converts light energy into chemical energy stored in glucose',
      'It takes place in the chloroplasts, where chlorophyll absorbs mainly red and blue light',
      'The light phase happens in the grana and needs light; the dark phase happens in the stroma and does not',
      'Oxygen released comes from the splitting of water, not from carbon dioxide',
      'A limiting factor is the factor in shortest supply, which alone sets the rate',
    ],
    subtopics: [
      {
        name: 'The light phase',
        points: [
          'Takes place in the grana of the chloroplast',
          'Chlorophyll absorbs light energy, which splits water into hydrogen and oxygen (photolysis)',
          'Oxygen is released as a by-product; hydrogen is carried to the dark phase',
          'ATP is produced and also passed to the dark phase',
        ],
      },
      {
        name: 'The dark phase (Calvin cycle)',
        points: [
          'Takes place in the stroma and does not require light directly',
          'Carbon dioxide is fixed and reduced using the hydrogen and ATP from the light phase',
          'Glucose is formed, which may be converted to starch for storage',
        ],
      },
      {
        name: 'Limiting factors',
        points: [
          'Light intensity, carbon dioxide concentration and temperature can each limit the rate',
          'As one factor is increased the rate rises, then levels off when a different factor becomes limiting',
          'On a rate graph the plateau shows that light is no longer the limiting factor',
          'Very high temperature lowers the rate because the enzymes of the dark phase denature',
        ],
      },
    ],
    formulae: [
      '6CO2 + 12H2O, in the presence of light energy and chlorophyll, gives C6H12O6 + 6O2 + 6H2O',
    ],
    commonMistakes: [
      'The oxygen given off comes from water, not from carbon dioxide',
      'The dark phase does not need darkness; it simply does not need light directly, and it runs during the day using products of the light phase',
      'A plateau on a light-intensity graph does not mean the plant has stopped photosynthesising, only that another factor has become limiting',
    ],
    example: {
      problem: 'A learner measures the rate of photosynthesis in pondweed at increasing light intensities: 100 lux gives 5 bubbles/min, 200 gives 12, 300 gives 20, 400 gives 22 and 500 gives 22. Describe the trend and explain why the rate levels off.',
      steps: [
        'From 100 to 300 lux the rate rises steeply, from 5 to 20 bubbles per minute, so light intensity is the limiting factor over this range.',
        'From 300 to 400 lux the rate rises only slightly, from 20 to 22.',
        'From 400 to 500 lux the rate does not change at all, staying at 22 bubbles per minute.',
        'The plateau shows that light is no longer limiting: some other factor, such as carbon dioxide concentration or temperature, has become the factor in shortest supply.',
      ],
      answer: 'The rate rises steeply and then levels off at 22 bubbles/min because a factor other than light, such as carbon dioxide concentration or temperature, has become limiting.',
    },
    moreExamples: [
      {
        problem: 'Explain why a plant kept in complete darkness for several days will eventually die.',
        steps: [
          'Without light the light phase cannot occur, so no ATP or hydrogen is produced for the dark phase.',
          'No glucose can therefore be manufactured.',
          'The plant continues to respire, using up its stored starch reserves to release energy.',
          'Once the reserves are exhausted the plant has no energy source and dies.',
        ],
        answer: 'It cannot photosynthesise, so once its stored starch is used up by respiration it has no energy source.',
      },
    ],
  },
  {
    topicId: 'life-sci-animal-nutrition',
    summary: 'How food is taken in, digested, absorbed and assimilated in humans, the enzymes involved at each stage, and the effects of diet on health.',
    keyIdeas: [
      'Digestion breaks large insoluble molecules into small soluble ones that can be absorbed',
      'Mechanical digestion increases surface area; chemical digestion uses enzymes to break bonds',
      'Each enzyme works on one type of food and at a particular pH',
      'Absorption happens mainly in the small intestine, which is adapted with villi',
      'The liver assimilates absorbed nutrients and regulates blood glucose',
    ],
    subtopics: [
      {
        name: 'The alimentary canal',
        points: [
          'Mouth: teeth chew; salivary amylase begins starch digestion at about pH 7',
          'Stomach: hydrochloric acid gives about pH 2, kills bacteria and activates pepsin, which digests protein',
          'Small intestine: bile emulsifies fats; pancreatic and intestinal enzymes complete digestion at about pH 8',
          'Large intestine: water and mineral salts are absorbed; remaining material is egested',
        ],
      },
      {
        name: 'Enzymes and their products',
        points: [
          'Amylase: starch to maltose',
          'Pepsin and trypsin: proteins to peptides; peptidase: peptides to amino acids',
          'Lipase: lipids to fatty acids and glycerol',
          'Maltase: maltose to glucose',
        ],
      },
      {
        name: 'Absorption and assimilation',
        points: [
          'Villi and microvilli give a very large surface area; each villus is one cell thick with a rich blood supply and a lacteal',
          'Glucose and amino acids pass into the blood capillaries; fatty acids and glycerol pass into the lacteal',
          'The hepatic portal vein carries absorbed nutrients to the liver, which stores excess glucose as glycogen',
        ],
      },
    ],
    commonMistakes: [
      'Bile is not an enzyme: it emulsifies fat into small droplets to increase surface area for lipase',
      'Pepsin needs acid conditions; it would be denatured at the pH of the small intestine',
      'Absorption is the passage of digested food into the blood; assimilation is its use by the body cells',
    ],
    example: {
      problem: 'Explain why a person whose gall bladder has been removed is advised to eat a low-fat diet.',
      steps: [
        'The gall bladder stores bile, which is made in the liver.',
        'Bile emulsifies fats, breaking large fat droplets into many small ones and greatly increasing the surface area for lipase.',
        'Without stored bile, less is available at once when a fatty meal arrives.',
        'Fat digestion is therefore slower and less complete, so a low-fat diet avoids discomfort and poor absorption.',
      ],
      answer: 'Without stored bile there is less emulsification of fat, so lipase works more slowly and fat is poorly digested.',
    },
    moreExamples: [
      {
        problem: 'Describe THREE ways in which the small intestine is adapted for absorption.',
        steps: [
          'It is very long, giving a large area and a long time for absorption to occur.',
          'Its inner surface is folded into villi, each covered in microvilli, which multiplies the surface area many times.',
          'Each villus wall is only one cell thick, giving a short diffusion distance.',
          'Each villus has a dense capillary network and a lacteal, which carry absorbed products away and keep the concentration gradient steep.',
        ],
        answer: 'A long length, a surface folded into villi and microvilli, a wall one cell thick, and a rich blood and lymph supply.',
      },
    ],
  },
  {
    topicId: 'life-sci-respiration',
    summary: 'How cells release energy from glucose, the difference between aerobic and anaerobic pathways, and how respiration compares with photosynthesis.',
    keyIdeas: [
      'Respiration releases energy from glucose and stores it as ATP',
      'Aerobic respiration needs oxygen and releases about 38 ATP per glucose molecule',
      'Anaerobic respiration occurs without oxygen and releases only 2 ATP per glucose molecule',
      'Glycolysis happens in the cytoplasm; the Krebs cycle and oxidative phosphorylation happen in the mitochondrion',
      'Respiration happens in every living cell, all the time, in plants as well as animals',
    ],
    subtopics: [
      {
        name: 'Aerobic respiration',
        points: [
          'Glycolysis in the cytoplasm splits glucose into two pyruvic acid molecules, releasing 2 ATP',
          'Pyruvic acid enters the mitochondrion, where the Krebs cycle releases carbon dioxide and hydrogen',
          'Hydrogen passes along the electron transport chain; oxygen is the final hydrogen acceptor, forming water',
          'Total yield is about 38 ATP per glucose molecule',
        ],
      },
      {
        name: 'Anaerobic respiration',
        points: [
          'In muscle cells: glucose to lactic acid, releasing 2 ATP; lactic acid build-up causes muscle fatigue and oxygen debt',
          'In yeast: glucose to ethanol and carbon dioxide, which is the basis of brewing and baking',
          'Far less energy is released because the glucose is only partly broken down',
        ],
      },
      {
        name: 'Comparison with photosynthesis',
        points: [
          'Photosynthesis stores energy and builds glucose; respiration releases energy and breaks glucose down',
          'Photosynthesis uses carbon dioxide and water and produces oxygen; respiration does the reverse',
          'Photosynthesis occurs only in light and only in cells with chloroplasts; respiration occurs in all living cells at all times',
        ],
      },
    ],
    formulae: [
      'Aerobic: C6H12O6 + 6O2 gives 6CO2 + 6H2O + energy (about 38 ATP)',
      'Anaerobic in muscle: C6H12O6 gives 2 lactic acid + energy (2 ATP)',
      'Anaerobic in yeast: C6H12O6 gives 2 ethanol + 2CO2 + energy (2 ATP)',
    ],
    commonMistakes: [
      'Plants respire all the time, including in daylight; they do not only photosynthesise',
      'Breathing is the movement of air; respiration is the chemical release of energy inside cells',
      'Anaerobic respiration is not more efficient or faster at making ATP overall; it simply works without oxygen',
    ],
    example: {
      problem: 'Explain why a sprinter continues to breathe deeply for several minutes after finishing a 100 m race.',
      steps: [
        'During the sprint the muscles use oxygen faster than the blood can supply it.',
        'The muscles then respire anaerobically, producing lactic acid and building an oxygen debt.',
        'After the race the extra oxygen taken in is used to break the accumulated lactic acid down.',
        'Deep breathing continues until that oxygen debt has been repaid.',
      ],
      answer: 'To repay the oxygen debt, supplying the oxygen needed to break down the lactic acid built up during anaerobic respiration.',
    },
    moreExamples: [
      {
        problem: 'Aerobic respiration yields about 38 ATP per glucose molecule while anaerobic respiration yields 2. Explain this difference.',
        steps: [
          'In anaerobic respiration glucose is only partly broken down, to lactic acid or to ethanol.',
          'These products still contain a large amount of unreleased chemical energy.',
          'In aerobic respiration the glucose is broken down completely to carbon dioxide and water.',
          'Oxygen acts as the final hydrogen acceptor, allowing the electron transport chain to run and release far more ATP.',
        ],
        answer: 'Anaerobic respiration breaks glucose down only partly, so most of the energy stays locked in lactic acid or ethanol.',
      },
    ],
  },
  {
    topicId: 'life-sci-gaseous-exchange',
    summary: 'The properties every gaseous exchange surface shares, the structure of the human breathing system, and how breathing is controlled.',
    keyIdeas: [
      'Gaseous exchange surfaces are thin, moist, permeable, have a large surface area and a good transport system',
      'Ventilation is the mechanical movement of air; gaseous exchange is the diffusion of gases across a surface',
      'Diffusion is passive and driven by a concentration gradient',
      'Inhalation is active: the diaphragm contracts and flattens, and the ribs move up and out',
      'Exhalation at rest is passive: the muscles relax and the elastic lungs recoil',
    ],
    subtopics: [
      {
        name: 'Requirements of a gas exchange surface',
        points: [
          'Large surface area: about 300 million alveoli in human lungs',
          'Thin: alveolus wall and capillary wall are each one cell thick',
          'Moist: gases must dissolve before they can diffuse',
          'Permeable and well supplied with blood, to maintain a steep concentration gradient',
        ],
      },
      {
        name: 'Human breathing system',
        points: [
          'Air passes nose, pharynx, larynx, trachea, bronchi, bronchioles, alveoli',
          'Cartilage rings hold the trachea open; cilia and mucus trap and sweep out dust and bacteria',
          'The pleural membranes and fluid reduce friction as the lungs move',
        ],
      },
      {
        name: 'Mechanism and control',
        points: [
          'Inhalation: diaphragm contracts and flattens, ribs move up and out, thoracic volume increases, pressure drops, air enters',
          'Exhalation: muscles relax, volume decreases, pressure rises, air leaves',
          'Breathing rate is controlled by the medulla oblongata, which responds mainly to rising carbon dioxide in the blood',
        ],
      },
    ],
    commonMistakes: [
      'The diaphragm flattens when it contracts; it does not dome upwards during inhalation',
      'The main stimulus for faster breathing is a rise in carbon dioxide, not a fall in oxygen',
      'Air moves because of a pressure difference created by volume change, not because the lungs pull it in',
    ],
    example: {
      problem: 'Explain why the alveoli of the lungs are surrounded by a dense network of capillaries.',
      steps: [
        'Gases diffuse across the alveolus wall down a concentration gradient.',
        'Blood arriving in the capillaries is low in oxygen and high in carbon dioxide.',
        'Continuous blood flow carries oxygen away as soon as it diffuses in and brings fresh carbon dioxide.',
        'This keeps the concentration gradient steep, so diffusion continues rapidly in both directions.',
      ],
      answer: 'The flowing blood keeps the concentration gradients steep, so oxygen and carbon dioxide continue to diffuse rapidly.',
    },
    moreExamples: [
      {
        problem: 'Describe what happens in the thoracic cavity during inhalation, and explain why air moves into the lungs.',
        steps: [
          'The diaphragm contracts and flattens, moving downwards.',
          'The external intercostal muscles contract, lifting the ribs upwards and outwards.',
          'These movements increase the volume of the thoracic cavity.',
          'An increase in volume lowers the air pressure inside the lungs below atmospheric pressure, so air flows in down the pressure gradient.',
        ],
        answer: 'The diaphragm flattens and the ribs lift, increasing thoracic volume and lowering the internal pressure, so air flows in.',
      },
    ],
  },
  {
    topicId: 'life-sci-excretion',
    summary: 'How the body removes metabolic wastes, the structure of the kidney and nephron, the formation of urine, and homeostatic control of water and salts.',
    keyIdeas: [
      'Excretion is the removal of wastes made by the body itself; egestion is the removal of undigested food',
      'The kidneys excrete urea, excess water and excess salts',
      'The nephron is the functional unit of the kidney: filtration, reabsorption, then secretion',
      'Osmoregulation keeps the water and salt content of the blood constant',
      'ADH from the pituitary controls how much water is reabsorbed',
    ],
    subtopics: [
      {
        name: 'Excretory organs',
        points: [
          'Kidneys: urea, excess water, excess salts',
          'Lungs: carbon dioxide and some water vapour',
          'Skin: water, salts and a little urea in sweat',
          'Liver: makes urea from excess amino acids by deamination',
        ],
      },
      {
        name: 'The nephron',
        points: [
          'Ultrafiltration in the glomerulus and Bowmans capsule: high pressure forces water, glucose, salts and urea out; proteins and blood cells stay behind',
          'Selective reabsorption in the proximal tubule: all glucose, most water and useful salts return to the blood',
          'The loop of Henle concentrates the salt in the medulla, allowing water to be reabsorbed from the collecting duct',
          'Remaining fluid is urine: water, urea and excess salts',
        ],
      },
      {
        name: 'Homeostasis',
        points: [
          'Low blood water: the pituitary releases more ADH, the collecting duct becomes more permeable, more water is reabsorbed, and a small volume of concentrated urine is produced',
          'High blood water: less ADH is released, less water is reabsorbed, and a large volume of dilute urine is produced',
          'Kidney failure is treated by dialysis or by transplant',
        ],
      },
    ],
    commonMistakes: [
      'Glucose in the urine is abnormal: a healthy nephron reabsorbs all of it, so its presence suggests diabetes',
      'Proteins and blood cells are too large to be filtered, so finding them in urine indicates damage to the filter',
      'ADH increases water reabsorption, so more ADH means less urine, not more',
    ],
    example: {
      problem: 'A person drinks two litres of water quickly. Describe how the body responds to restore the normal water balance.',
      steps: [
        'The water content of the blood rises, so the blood becomes more dilute.',
        'Receptors in the hypothalamus detect this, and the pituitary releases less ADH.',
        'With less ADH, the walls of the collecting ducts become less permeable to water.',
        'Less water is reabsorbed into the blood, so a large volume of dilute urine is produced and the blood water level returns to normal.',
      ],
      answer: 'Less ADH is released, so less water is reabsorbed and a large volume of dilute urine is produced.',
    },
    moreExamples: [
      {
        problem: 'Explain why glucose is present in the glomerular filtrate but absent from the urine of a healthy person.',
        steps: [
          'Glucose molecules are small enough to pass through the filter during ultrafiltration, so they enter the filtrate.',
          'Glucose is a valuable respiratory substrate and must not be lost.',
          'In the proximal convoluted tubule all the glucose is reabsorbed into the blood by active transport.',
          'Since reabsorption is complete, no glucose remains by the time the fluid reaches the collecting duct.',
        ],
        answer: 'It is small enough to be filtered, but all of it is then reabsorbed by active transport in the proximal tubule.',
      },
    ],
  },
  {
    topicId: 'life-sci-biodiversity-microorganisms',
    summary: 'How living things are classified, the five kingdoms, the main groups of micro-organisms, and their useful and harmful roles.',
    keyIdeas: [
      'Classification groups organisms by shared features, from kingdom down to species',
      'The five-kingdom system is Monera, Protista, Fungi, Plantae and Animalia',
      'Binomial nomenclature gives every species a two-part Latin name: genus then species',
      'Viruses are not placed in any kingdom because they are not cellular and cannot reproduce on their own',
      'Micro-organisms are both essential (decomposition, medicine, food) and harmful (disease)',
    ],
    subtopics: [
      {
        name: 'Classification',
        points: [
          'Hierarchy: kingdom, phylum, class, order, family, genus, species',
          'The genus name is capitalised and the species name is not; both are italicised or underlined',
          'A species is a group whose members can interbreed to produce fertile offspring',
        ],
      },
      {
        name: 'The main groups',
        points: [
          'Monera (bacteria): prokaryotic, no true nucleus, no membrane-bound organelles',
          'Protista: eukaryotic and mostly unicellular, such as Amoeba and Plasmodium',
          'Fungi: eukaryotic, cell walls of chitin, absorb food after digesting it externally, so they are heterotrophic',
          'Viruses: protein coat around nucleic acid; only reproduce inside a host cell',
        ],
      },
      {
        name: 'Roles of micro-organisms',
        points: [
          'Useful: decomposition and nutrient cycling, antibiotic production, baking and brewing, yoghurt and cheese, nitrogen fixation',
          'Harmful: bacterial diseases such as tuberculosis and cholera, viral diseases such as HIV and influenza, fungal diseases such as ringworm',
          'Antibiotics kill bacteria but have no effect on viruses',
        ],
      },
    ],
    commonMistakes: [
      'Antibiotics do not work against viruses, because viruses have no cell structure for the antibiotic to attack',
      'Fungi are not plants: they have no chlorophyll and cannot photosynthesise, so they are heterotrophic',
      'Bacteria are prokaryotic and have no nucleus; protists are eukaryotic and do',
    ],
    example: {
      problem: 'Explain why fungi are classified in their own separate kingdom, rather than being grouped with plants.',
      steps: [
        'Fungi have no chlorophyll, so they cannot photosynthesise and are heterotrophic, whereas plants are autotrophic.',
        'Fungal cell walls are made of chitin, while plant cell walls are made of cellulose.',
        'Fungi feed by secreting enzymes onto food and absorbing the digested products, which no plant does.',
        'These fundamental differences in nutrition and cell structure justify a separate kingdom.',
      ],
      answer: 'Because they lack chlorophyll and feed heterotrophically by external digestion, and their cell walls are chitin rather than cellulose.',
    },
    moreExamples: [
      {
        problem: 'A doctor refuses to prescribe antibiotics for a patient with influenza. Explain the reasoning.',
        steps: [
          'Influenza is caused by a virus, not by a bacterium.',
          'Antibiotics work by attacking structures found in bacterial cells, such as the cell wall or bacterial ribosomes.',
          'A virus has no such structures: it is only nucleic acid inside a protein coat and reproduces inside the patients own cells.',
          'The antibiotic would therefore have no effect, and unnecessary use encourages antibiotic resistance in other bacteria.',
        ],
        answer: 'Influenza is viral, and antibiotics attack bacterial structures that viruses do not have; needless use also promotes resistance.',
      },
    ],
  },
  {
    topicId: 'life-sci-biodiversity-plants',
    summary: 'The four main plant groups and how each is adapted to life on land, together with the reproductive strategies that allowed plants to colonise dry habitats.',
    keyIdeas: [
      'The four groups are bryophytes, pteridophytes, gymnosperms and angiosperms',
      'Moving from water to land required support, transport tissue, protection against drying out, and reproduction without free water',
      'Bryophytes and pteridophytes still need water for the sperm to swim to the egg',
      'Seeds and pollen freed gymnosperms and angiosperms from that dependence',
      'Angiosperms are the most successful and diverse group of plants',
    ],
    subtopics: [
      {
        name: 'The four groups',
        points: [
          'Bryophytes (mosses): no true roots, stems or leaves, no vascular tissue, small and confined to damp places',
          'Pteridophytes (ferns): true roots, stems and leaves with vascular tissue, reproduce by spores, still need water for fertilisation',
          'Gymnosperms (conifers): seeds borne naked on cones, pollen carried by wind, needle-like leaves reduce water loss',
          'Angiosperms (flowering plants): seeds enclosed in a fruit, flowers attract pollinators, most diverse group',
        ],
      },
      {
        name: 'Adaptations to land',
        points: [
          'Waxy cuticle and stomata reduce water loss while allowing gas exchange',
          'Vascular tissue transports water upwards and food throughout, and lignin gives support',
          'Roots anchor the plant and absorb water',
          'Pollen replaces swimming sperm, and seeds protect and feed the embryo',
        ],
      },
      {
        name: 'Reproduction in angiosperms',
        points: [
          'Pollination is the transfer of pollen from anther to stigma; fertilisation is the fusion of gametes',
          'Insect-pollinated flowers are large, coloured and scented with nectar; wind-pollinated flowers are small, dull, with feathery stigmas and exposed anthers',
          'After fertilisation the ovule becomes the seed and the ovary becomes the fruit',
        ],
      },
    ],
    commonMistakes: [
      'Pollination and fertilisation are different events: pollination is transfer, fertilisation is fusion of nuclei',
      'Ferns have vascular tissue; mosses do not, which is why mosses stay small',
      'A seed is not the same as a fruit: the ovule forms the seed and the ovary forms the fruit',
    ],
    example: {
      problem: 'Explain why mosses are restricted to damp, shaded habitats while conifers are not.',
      steps: [
        'Mosses have no vascular tissue, so water can only travel a short distance through the plant by diffusion and osmosis.',
        'They also have no true roots and only a thin cuticle, so they lose water easily.',
        'Their male gametes must swim through a film of water to reach the egg, so fertilisation cannot occur when it is dry.',
        'Conifers have vascular tissue, a thick cuticle on needle leaves, roots, and wind-borne pollen, so none of these limits apply.',
      ],
      answer: 'Mosses lack vascular tissue and need free water for fertilisation, while conifers have vascular tissue, water-conserving leaves and wind-borne pollen.',
    },
    moreExamples: [
      {
        problem: 'A flower is small, green, has no scent, hangs outside the leaves and has a large feathery stigma. Deduce its method of pollination and justify your answer.',
        steps: [
          'Bright colour, scent and nectar attract insects; this flower has none of these.',
          'Hanging outside the foliage exposes the anthers to moving air.',
          'A large feathery stigma presents a wide surface for catching pollen grains carried at random in the air.',
          'These features together are adaptations for wind pollination.',
        ],
        answer: 'Wind pollination, shown by the absence of colour and scent, the exposed anthers and the large feathery stigma.',
      },
    ],
  },
  {
    topicId: 'life-sci-biodiversity-animals',
    summary: 'The main animal phyla, the features used to classify them, and how body plan relates to the way an animal lives.',
    keyIdeas: [
      'Animals are classified by symmetry, body cavity, number of body layers and segmentation',
      'Radial symmetry suits sessile or drifting animals; bilateral symmetry suits animals that move forwards',
      'Cephalisation, the concentration of sense organs at the head end, accompanies bilateral symmetry',
      'Vertebrates are chordates with a backbone; invertebrates have none',
      'An exoskeleton protects and supports but must be shed for the animal to grow',
    ],
    subtopics: [
      {
        name: 'Invertebrate phyla',
        points: [
          'Porifera (sponges): no true tissues, no symmetry, filter feeders',
          'Cnidaria (jellyfish, sea anemones): radial symmetry, stinging cells, one body opening',
          'Platyhelminthes (flatworms): bilateral, flattened, no body cavity',
          'Annelida (earthworms): segmented, true body cavity',
          'Mollusca (snails, octopus): soft body, muscular foot, usually a shell',
          'Arthropoda (insects, spiders, crabs): jointed legs, exoskeleton of chitin, segmented body',
        ],
      },
      {
        name: 'Chordates',
        points: [
          'Fish: gills, scales, external fertilisation',
          'Amphibians: moist skin, larval stage in water',
          'Reptiles: dry scaly skin, amniotic eggs with leathery shells',
          'Birds: feathers, hollow bones, endothermic',
          'Mammals: hair, mammary glands, endothermic',
        ],
      },
      {
        name: 'Structure and lifestyle',
        points: [
          'Birds are adapted for flight by hollow bones, feathers, a keeled sternum for flight muscles and forelimbs modified as wings',
          'An exoskeleton limits size and requires moulting, during which the animal is vulnerable',
          'Radial symmetry allows an animal to meet food or danger from any direction equally well',
        ],
      },
    ],
    commonMistakes: [
      'Insects are arthropods, not a separate phylum; spiders and crabs are arthropods too',
      'Not all invertebrates are small or simple: the octopus is a mollusc with complex behaviour',
      'Amphibians are not reptiles: their skin is moist and their eggs have no shell',
    ],
    example: {
      problem: 'Describe THREE structural adaptations of a bird that suit it to a flying lifestyle.',
      steps: [
        'The bones are hollow, which reduces the mass that has to be lifted.',
        'The forelimbs are modified into wings, and feathers give a large, light surface for generating lift.',
        'The sternum has a deep keel, providing a large area for the attachment of powerful flight muscles.',
        'Together these reduce weight and increase the power available for flight.',
      ],
      answer: 'Hollow bones to reduce mass, wings with feathers to generate lift, and a keeled sternum anchoring large flight muscles.',
    },
    moreExamples: [
      {
        problem: 'Explain why an insect must moult in order to grow, and state ONE disadvantage of this.',
        steps: [
          'An insect is enclosed in a rigid exoskeleton made of chitin, which cannot stretch.',
          'To increase in size the insect must shed the old exoskeleton and expand before the new one hardens.',
          'While the new exoskeleton is still soft the insect has little protection and little support.',
          'It is therefore vulnerable to predators and to drying out during this period.',
        ],
        answer: 'The rigid exoskeleton cannot grow, so it must be shed; while the new one hardens the insect is soft and vulnerable to predators.',
      },
    ],
  },
  {
    topicId: 'life-sci-population-ecology',
    summary: 'How populations grow, what limits them, how ecologists estimate their size, and the ways species interact within a community.',
    keyIdeas: [
      'A population is all the members of one species living in the same area at the same time',
      'Population size changes through births, deaths, immigration and emigration',
      'Exponential growth cannot continue: limiting factors bring the population towards the carrying capacity',
      'Density-dependent factors act more strongly as the population becomes crowded',
      'Carrying capacity is the maximum population an environment can support indefinitely',
    ],
    subtopics: [
      {
        name: 'Growth curves',
        points: [
          'The J-curve shows unlimited exponential growth, which is only ever temporary',
          'The S-curve (sigmoid) shows a lag phase, an exponential phase, then levelling off at the carrying capacity',
          'A population can overshoot the carrying capacity and then crash',
        ],
      },
      {
        name: 'Limiting factors',
        points: [
          'Density-dependent: competition for food, water and space, predation, disease and parasitism',
          'Density-independent: fire, flood, drought and extreme cold affect the same proportion whatever the density',
          'Density-dependent factors are what actually hold a population near its carrying capacity',
        ],
      },
      {
        name: 'Sampling and interactions',
        points: [
          'Quadrats estimate the density of plants and slow-moving animals',
          'Mark-recapture estimates mobile animals: population = (first catch x second catch) / number recaptured',
          'Predation, competition, parasitism, mutualism and commensalism describe how species affect each other',
        ],
      },
    ],
    formulae: [
      'Population density = number of individuals / area',
      'Mark-recapture estimate = (number marked in first sample x total in second sample) / number of marked individuals recaptured',
    ],
    commonMistakes: [
      'Drought and fire are density-independent: they do not hit harder simply because the population is crowded',
      'Carrying capacity is a property of the environment, not of the species',
      'A population at carrying capacity is not static; births and deaths continue and roughly balance',
    ],
    example: {
      problem: 'Ecologists catch and mark 40 fish, release them, and later catch 50 fish of which 8 are marked. Estimate the population.',
      steps: [
        'Use the mark-recapture formula: population = (first catch x second catch) / number recaptured.',
        'Substitute the values: (40 x 50) / 8.',
        'Work out the numerator: 40 x 50 = 2 000.',
        'Divide: 2 000 / 8 = 250.',
      ],
      answer: 'About 250 fish',
    },
    moreExamples: [
      {
        problem: 'Explain what is meant by a density-dependent limiting factor, giving TWO examples other than food supply.',
        steps: [
          'A density-dependent factor is one whose effect becomes stronger as the number of individuals per unit area increases.',
          'Disease spreads more readily when individuals are crowded together, so a larger proportion is affected in a dense population.',
          'Predators are attracted to and find prey more easily where prey is abundant, so predation pressure rises with density.',
          'Such factors therefore act to slow growth as a population approaches its carrying capacity.',
        ],
        answer: 'A factor whose effect intensifies as population density rises; for example disease and predation.',
      },
    ],
  },
  {
    topicId: 'life-sci-human-impact',
    summary: 'How human activity affects the atmosphere, water, soil and biodiversity, and what can be done to reduce the damage.',
    keyIdeas: [
      'Human population growth raises demand for food, water, energy and space',
      'Burning fossil fuels raises atmospheric carbon dioxide and strengthens the greenhouse effect',
      'Loss of habitat is the largest single cause of falling biodiversity',
      'Water is a limited resource in South Africa, and its quality as well as its quantity matters',
      'Sustainable use means meeting present needs without preventing future generations from meeting theirs',
    ],
    subtopics: [
      {
        name: 'Atmosphere',
        points: [
          'Greenhouse gases (carbon dioxide, methane) trap outgoing heat, raising global temperatures',
          'Consequences include melting ice, rising sea level, shifting rainfall and more extreme weather',
          'Ozone depletion by CFCs lets through more ultraviolet radiation, raising skin cancer risk',
          'Acid rain from sulfur dioxide and nitrogen oxides damages forests, soils and buildings',
        ],
      },
      {
        name: 'Water and soil',
        points: [
          'Eutrophication: fertiliser runoff causes algal blooms, oxygen depletion and fish deaths',
          'Water quality is threatened by sewage, industrial effluent and acid mine drainage',
          'Soil erosion follows the removal of vegetation; overgrazing and monoculture reduce fertility',
          'Desertification turns productive land into desert, often after overgrazing in dry areas',
        ],
      },
      {
        name: 'Biodiversity and solutions',
        points: [
          'Threats: habitat destruction, poaching, alien invasive species, pollution and climate change',
          'Alien invasive plants such as black wattle use far more water than indigenous species',
          'Solutions: protected areas, recycling, renewable energy, alien clearing programmes such as Working for Water, and legislation',
        ],
      },
    ],
    commonMistakes: [
      'The greenhouse effect is natural and necessary; the problem is its strengthening by extra greenhouse gases',
      'Ozone depletion and global warming are different problems with different causes',
      'Alien species are only invasive when they spread and outcompete indigenous species',
    ],
    example: {
      problem: 'Explain why clearing alien invasive trees such as black wattle from a river catchment increases the amount of water in the river.',
      steps: [
        'Alien invasive trees such as black wattle grow densely and have deep root systems.',
        'They take up and transpire far more water than the indigenous vegetation they replace.',
        'Water transpired into the air is water that never reaches the river.',
        'Removing them therefore leaves more groundwater and run-off to feed the river.',
      ],
      answer: 'They transpire much more water than indigenous plants, so removing them leaves more water to reach the river.',
    },
    moreExamples: [
      {
        problem: 'A community is deciding whether to allow a coal-fired power station nearby. Give ONE argument in favour and ONE against, and state what additional information would help them decide.',
        steps: [
          'In favour: the station would supply electricity and create jobs in the area, which supports local livelihoods.',
          'Against: burning coal releases carbon dioxide, which strengthens the greenhouse effect, and sulfur dioxide, which causes acid rain and respiratory illness.',
          'Useful additional information would include the emissions the station is expected to produce and what controls are planned.',
          'Also useful would be the number of local jobs, and whether a renewable alternative could supply the same electricity.',
        ],
        answer: 'In favour: electricity supply and local jobs. Against: carbon dioxide and sulfur dioxide emissions. They would need the projected emissions, the planned controls, the real number of local jobs, and the renewable alternatives.',
      },
    ],
  },
  {
    topicId: 'life-sci-reproduction-vertebrates',
    summary: 'The reproductive strategies of vertebrates, the trade-off between the number of offspring and the care given to each, and how they relate to the habitat.',
    keyIdeas: [
      'External fertilisation happens outside the body and needs water; internal fertilisation happens inside the female',
      'Ovipary lays eggs, ovovivipary retains eggs inside the mother until they hatch, and vivipary gives birth to live young',
      'Species producing many offspring usually give little parental care; species producing few usually give much',
      'An amniotic egg, with its shell and membranes, freed reptiles and birds from breeding in water',
      'Precocial young are mobile soon after birth; altricial young are helpless and need extended care',
    ],
    subtopics: [
      {
        name: 'Fertilisation',
        points: [
          'External: large numbers of gametes released into water, low chance of each being fertilised, as in most fish and amphibians',
          'Internal: fewer gametes, much higher chance of fertilisation, and it works on dry land',
          'Internal fertilisation is a prerequisite for ovovivipary and vivipary',
        ],
      },
      {
        name: 'Development of the embryo',
        points: [
          'Ovipary: eggs laid and developed outside the mother, nourished by yolk, as in birds and most reptiles',
          'Ovovivipary: eggs kept inside the mother and nourished by yolk, hatching internally, as in some sharks',
          'Vivipary: embryo nourished directly by the mother through a placenta, as in mammals',
        ],
      },
      {
        name: 'Parental care and amniotic eggs',
        points: [
          'Many offspring plus little care, as in fish, balances a high mortality rate',
          'Few offspring plus much care, as in mammals, raises the survival rate of each',
          'Amniotic egg membranes: amnion cushions the embryo, allantois stores waste and exchanges gases, chorion surrounds everything, yolk sac feeds the embryo',
          'The shell prevents desiccation, which is what allowed full colonisation of land',
        ],
      },
    ],
    commonMistakes: [
      'Ovovivipary and vivipary both produce live young, but only in vivipary does the mother nourish the embryo directly',
      'External fertilisation is not the same as ovipary: a bird uses internal fertilisation and still lays eggs',
      'Producing many offspring is not a poorer strategy; it is a different one, matched to the level of care given',
    ],
    example: {
      problem: 'A fish releases 2 million eggs into the water and gives no parental care, while an elephant produces one calf every four years and cares for it for years. Explain how both strategies can be successful.',
      steps: [
        'The fish uses external fertilisation, so many gametes are lost and most eggs are never fertilised or are eaten.',
        'Producing enormous numbers means that even a very small percentage surviving is enough to replace the parents.',
        'The elephant uses internal fertilisation and vivipary, so almost every embryo is fertilised and protected.',
        'Prolonged parental care means a very high proportion of the few calves born reach adulthood, which replaces the parents just as effectively.',
      ],
      answer: 'Both replace their parents: the fish through vast numbers offsetting heavy losses, the elephant through very high survival of very few offspring.',
    },
    moreExamples: [
      {
        problem: 'Explain how the amniotic egg allowed reptiles to colonise dry land fully, when amphibians could not.',
        steps: [
          'Amphibian eggs have no shell and dry out quickly, so they must be laid in water.',
          'The amniotic egg has a leathery or hard shell that prevents desiccation while still allowing gases through.',
          'Inside, the amnion holds fluid that cushions the embryo, providing the watery environment development needs.',
          'The yolk sac supplies food and the allantois stores waste, so the egg is a self-contained system that can be laid anywhere.',
        ],
        answer: 'Its shell prevents drying out and the amnion supplies the fluid environment the embryo needs, so the egg no longer has to be laid in water.',
      },
    ],
  },
  {
    topicId: 'life-sci-human-reproduction',
    summary: 'The human reproductive organs, gametogenesis, the menstrual cycle and its hormones, fertilisation, and development in the uterus.',
    keyIdeas: [
      'Gametogenesis uses meiosis, so gametes are haploid and genetically varied',
      'The menstrual cycle averages 28 days and is controlled by FSH, LH, oestrogen and progesterone',
      'Ovulation occurs at about day 14, triggered by a surge in LH',
      'Fertilisation normally occurs in the fallopian tube; implantation occurs in the uterus lining about a week later',
      'The placenta supplies the foetus with oxygen and nutrients and removes its wastes, without the two bloodstreams mixing',
    ],
    subtopics: [
      {
        name: 'Gametogenesis',
        points: [
          'Spermatogenesis in the seminiferous tubules of the testes produces four sperm from each parent cell, continuously from puberty',
          'Oogenesis in the ovaries produces one ovum plus polar bodies, and begins before birth',
          'Seminal vesicles and prostate add fluid that nourishes sperm and neutralises vaginal acidity',
          'The testes lie outside the body because sperm production needs a temperature slightly below body temperature',
        ],
      },
      {
        name: 'The menstrual cycle',
        points: [
          'Days 1 to 5, menstruation: the uterus lining is shed because progesterone has fallen',
          'Follicular phase: FSH from the pituitary stimulates a follicle to develop, which secretes oestrogen; oestrogen rebuilds the uterus lining',
          'Day 14, ovulation: a surge of LH releases the ovum from the follicle',
          'Luteal phase: LH turns the follicle into the corpus luteum, which secretes progesterone to maintain the lining; if no fertilisation occurs it degenerates and the cycle restarts',
        ],
      },
      {
        name: 'Fertilisation and development',
        points: [
          'Fertilisation in the fallopian tube produces a diploid zygote',
          'The zygote divides by mitosis to a morula, then a blastocyst, which implants in the endometrium',
          'The placenta allows exchange of oxygen, nutrients, carbon dioxide and urea by diffusion; the two bloodstreams stay separate',
          'The umbilical cord carries two arteries and one vein between foetus and placenta; the amnion protects the foetus in amniotic fluid',
        ],
      },
    ],
    formulae: [
      'FSH stimulates follicle development and oestrogen secretion',
      'LH triggers ovulation and forms the corpus luteum',
      'Oestrogen rebuilds the endometrium; progesterone maintains it',
    ],
    commonMistakes: [
      'Maternal and foetal blood do not mix in the placenta; substances cross by diffusion across a barrier',
      'Ovulation is caused by the LH surge, not by FSH',
      'The corpus luteum forms from the follicle after ovulation, so it cannot secrete progesterone before then',
    ],
    example: {
      problem: 'Explain why menstruation occurs if the ovum is not fertilised.',
      steps: [
        'After ovulation the follicle becomes the corpus luteum, which secretes progesterone.',
        'Progesterone maintains the thickened endometrium in readiness for implantation.',
        'If no fertilisation and implantation occur, the corpus luteum degenerates after about ten days.',
        'Progesterone levels then fall sharply, the lining can no longer be maintained, and it breaks down and is shed as menstruation.',
      ],
      answer: 'The corpus luteum degenerates, progesterone falls, and the endometrium can no longer be maintained, so it is shed.',
    },
    moreExamples: [
      {
        problem: 'Describe the structure and function of the placenta.',
        steps: [
          'The placenta is a disc-shaped organ attached to the uterus wall, with finger-like villi that project into maternal blood spaces.',
          'The villi give a very large surface area, and the barrier between the two bloodstreams is extremely thin.',
          'Oxygen, glucose, amino acids, minerals and antibodies diffuse from mother to foetus.',
          'Carbon dioxide and urea diffuse from foetus to mother; the placenta also secretes progesterone to maintain the pregnancy.',
        ],
        answer: 'A villus-covered organ giving a large surface area and thin barrier, across which nutrients and oxygen pass to the foetus and wastes pass back, while also secreting progesterone.',
      },
    ],
  },
  {
    topicId: 'life-sci-response-humans',
    summary: 'How the human nervous system detects and responds to stimuli, the reflex arc, and the structure of the eye and the ear.',
    keyIdeas: [
      'The nervous system is the central nervous system (brain and spinal cord) plus the peripheral nervous system',
      'A reflex action is rapid and involuntary, and its pathway does not require the brain to initiate it',
      'A neuron carries an impulse one way: dendrites to cell body to axon',
      'The eye converts light into nerve impulses; the ear converts sound vibrations into nerve impulses',
      'Homeostatic responses are usually negative feedback: a change triggers the response that reverses it',
    ],
    subtopics: [
      {
        name: 'Nervous system and the reflex arc',
        points: [
          'Cerebrum controls thought and voluntary action; cerebellum controls balance and coordination; medulla oblongata controls heartbeat and breathing',
          'Reflex arc: receptor, sensory neuron, interneuron in the spinal cord, motor neuron, effector',
          'The impulse crosses a synapse by means of a neurotransmitter, which is why it travels one way only',
          'A reflex protects the body because it is completed before the brain has interpreted the stimulus',
        ],
      },
      {
        name: 'The eye',
        points: [
          'Cornea and lens refract light; the iris controls how much light enters through the pupil',
          'Accommodation: for a near object the ciliary muscles contract, the suspensory ligaments slacken and the lens becomes more convex',
          'Rods work in dim light and give black-and-white vision; cones need bright light and give colour vision and detail',
          'The fovea is packed with cones and gives the sharpest image; the blind spot has no receptors',
        ],
      },
      {
        name: 'The ear',
        points: [
          'Pinna collects sound; the tympanic membrane vibrates; the ossicles amplify the vibration and pass it to the oval window',
          'The cochlea converts vibrations into nerve impulses, carried by the auditory nerve to the temporal lobe',
          'The semicircular canals detect movement of the head and the vestibule detects position, giving balance',
          'The Eustachian tube equalises pressure on the two sides of the tympanic membrane',
        ],
      },
    ],
    commonMistakes: [
      'The lens becomes more convex for near vision, not flatter',
      'In a reflex the brain is informed afterwards; it does not initiate the response',
      'Balance is the job of the semicircular canals and vestibule, not the cochlea',
    ],
    example: {
      problem: 'Describe the pathway of the impulse when a person pulls their hand away from a hot surface.',
      steps: [
        'Heat receptors in the skin of the hand detect the stimulus and generate an impulse.',
        'A sensory neuron carries the impulse to the spinal cord.',
        'An interneuron inside the spinal cord passes the impulse straight to a motor neuron.',
        'The motor neuron carries it to the biceps muscle, the effector, which contracts and withdraws the hand; only afterwards does the brain register the pain.',
      ],
      answer: 'Receptor in the skin, sensory neuron, interneuron in the spinal cord, motor neuron, muscle (effector) which contracts to withdraw the hand.',
    },
    moreExamples: [
      {
        problem: 'A person walks from bright sunlight into a dark room and cannot see for a few moments. Explain why, and explain what then happens.',
        steps: [
          'In bright light the cones were active and the rod pigment rhodopsin had been bleached.',
          'In the dark there is too little light for the cones to work, and the rods cannot yet function without rhodopsin.',
          'The iris muscles then relax the circular muscles and contract the radial muscles, widening the pupil to let in more light.',
          'Rhodopsin is gradually regenerated in the rods, restoring dim-light vision over several minutes.',
        ],
        answer: 'The cones cannot work in dim light and the rod pigment has been bleached; the pupil then dilates and rhodopsin regenerates, restoring vision.',
      },
    ],
  },
  {
    topicId: 'life-sci-response-plants',
    summary: 'How plants respond to stimuli through growth, the role of auxins, and the tropisms that orient roots and shoots.',
    keyIdeas: [
      'A tropism is a growth response in which the direction is determined by the direction of the stimulus',
      'Positive tropism grows towards the stimulus; negative grows away from it',
      'Auxins are plant hormones produced at the shoot tip that stimulate cell elongation',
      'Auxin has opposite effects in shoots and roots: it promotes elongation in shoots and inhibits it in roots',
      'Plants respond by growing, so their responses are slower and usually permanent',
    ],
    subtopics: [
      {
        name: 'Types of tropism',
        points: [
          'Phototropism: response to light; shoots are positively phototropic, roots negatively so',
          'Geotropism (gravitropism): response to gravity; roots are positively geotropic, shoots negatively so',
          'Hydrotropism: roots grow towards water',
          'Thigmotropism: tendrils grow in response to touch, coiling around a support',
        ],
      },
      {
        name: 'Auxin action',
        points: [
          'Auxin is made at the shoot tip and moves down the shaded side of the stem',
          'In the shoot, the higher auxin concentration on the shaded side causes those cells to elongate more, so the shoot bends towards the light',
          'In the root, higher auxin on the lower side inhibits elongation there, so the upper side grows faster and the root bends downwards',
          'Removing the tip removes the auxin source and the response stops',
        ],
      },
      {
        name: 'Why tropisms matter',
        points: [
          'Shoots growing towards light maximise the light available for photosynthesis',
          'Roots growing downwards and towards water secure anchorage and water uptake',
          'Tendrils coiling around a support raise the leaves into the light without the cost of a thick stem',
        ],
      },
    ],
    commonMistakes: [
      'The shoot bends because the shaded side grows faster, not because the lit side shrinks',
      'Auxin inhibits elongation in roots and promotes it in shoots; the same hormone gives opposite results',
      'A tropism is a directional growth response, unlike a nastic response, where direction does not depend on the stimulus',
    ],
    example: {
      problem: 'A potted plant on a windowsill bends towards the window. Explain this response in terms of auxins.',
      steps: [
        'Auxin is produced at the shoot tip and is distributed away from the light.',
        'More auxin therefore accumulates on the shaded side of the stem than on the lit side.',
        'Auxin stimulates cell elongation in shoots, so the cells on the shaded side grow longer than those on the lit side.',
        'Unequal elongation makes the shoot curve towards the light, which is positive phototropism.',
      ],
      answer: 'Auxin accumulates on the shaded side and stimulates the cells there to elongate more, so the shoot curves towards the light.',
    },
    moreExamples: [
      {
        problem: 'A seed germinates on its side underground. Explain how the root and the shoot each end up growing in the correct direction.',
        steps: [
          'Gravity causes auxin to accumulate on the lower side of both the root and the shoot.',
          'In the shoot, auxin promotes elongation, so the lower side grows faster and the shoot curves upwards: negative geotropism.',
          'In the root, auxin inhibits elongation, so the lower side grows more slowly than the upper side and the root curves downwards: positive geotropism.',
          'The shoot therefore reaches the light and the root reaches water and anchorage, whichever way the seed happened to land.',
        ],
        answer: 'Auxin gathers on the lower side of both; it promotes elongation in the shoot so it bends up, and inhibits it in the root so it bends down.',
      },
    ],
  },
  {
    topicId: 'life-sci-endocrine-homeostasis',
    summary: 'The endocrine glands and their hormones, and how negative feedback keeps blood glucose, water and temperature within narrow limits.',
    keyIdeas: [
      'A hormone is a chemical messenger secreted by an endocrine gland directly into the blood',
      'Hormones act on specific target organs and their effects are slower but longer lasting than nerve impulses',
      'Homeostasis is the maintenance of a constant internal environment despite external change',
      'Negative feedback reverses a change: a rise triggers the response that lowers it',
      'The hypothalamus and pituitary coordinate much of the endocrine system',
    ],
    subtopics: [
      {
        name: 'Glands and hormones',
        points: [
          'Pituitary: FSH, LH, ADH, growth hormone; often called the master gland',
          'Thyroid: thyroxin, which controls the metabolic rate and needs iodine',
          'Pancreas: insulin and glucagon from the islets of Langerhans',
          'Adrenal glands: adrenalin for the fight-or-flight response',
          'Ovaries and testes: oestrogen, progesterone and testosterone',
        ],
      },
      {
        name: 'Blood glucose control',
        points: [
          'Blood glucose too high: the pancreas secretes insulin, so the liver converts glucose to glycogen and cells take up more glucose',
          'Blood glucose too low: the pancreas secretes glucagon, so the liver converts glycogen back to glucose',
          'Type 1 diabetes: too little insulin is produced, so injections are needed',
          'Type 2 diabetes: cells respond poorly to insulin, and it is often managed at first by diet and exercise',
        ],
      },
      {
        name: 'Temperature and water',
        points: [
          'Too hot: vasodilation of skin arterioles, sweating, hairs lie flat, so heat is lost',
          'Too cold: vasoconstriction, shivering, hairs stand erect, so heat is conserved and generated',
          'Water balance is controlled by ADH acting on the collecting ducts of the nephron',
          'Thermoregulation and osmoregulation are both negative feedback systems',
        ],
      },
    ],
    commonMistakes: [
      'Insulin lowers blood glucose and glucagon raises it; the names are easily swapped',
      'Vasodilation and vasoconstriction happen in the arterioles of the skin, not in the capillaries themselves',
      'Negative feedback does not mean a harmful effect: it means the response opposes the change',
    ],
    example: {
      problem: 'Explain why a person with type 1 diabetes requires regular insulin injections.',
      steps: [
        'Type 1 diabetes means the pancreas produces little or no insulin.',
        'Without insulin, the liver does not convert excess glucose to glycogen and body cells take up less glucose.',
        'Blood glucose therefore stays dangerously high after a meal, and glucose appears in the urine.',
        'Injected insulin replaces the missing hormone, allowing blood glucose to be brought back to the normal range.',
      ],
      answer: 'Their pancreas produces too little insulin, so without injections blood glucose cannot be lowered after eating.',
    },
    moreExamples: [
      {
        problem: 'Describe how the body responds when a person becomes very cold.',
        steps: [
          'Thermoreceptors in the skin and the hypothalamus detect the fall in temperature.',
          'Arterioles in the skin constrict, so less blood flows near the surface and less heat is lost by radiation.',
          'The erector muscles contract so hairs stand erect, trapping an insulating layer of air.',
          'Shivering begins: rapid involuntary muscle contraction releases heat from respiration, and the metabolic rate may be raised by thyroxin.',
        ],
        answer: 'Vasoconstriction reduces heat loss, erect hairs trap insulating air, and shivering generates heat, all coordinated by the hypothalamus.',
      },
    ],
  },
  {
    topicId: 'life-sci-dna-code',
    summary: 'The structure of DNA and RNA, how DNA replicates, how the code is used to build proteins, and how mutations change the outcome.',
    keyIdeas: [
      'DNA is a double helix of two antiparallel strands held by hydrogen bonds between complementary bases',
      'Base pairing is A with T and C with G in DNA; in RNA uracil replaces thymine',
      'A nucleotide is a phosphate, a deoxyribose sugar and a nitrogenous base',
      'Replication is semi-conservative: each new molecule keeps one original strand',
      'Protein synthesis is transcription in the nucleus followed by translation at the ribosome',
    ],
    subtopics: [
      {
        name: 'Structure',
        points: [
          'DNA: double stranded, deoxyribose sugar, bases A, T, C, G, found in the nucleus',
          'RNA: single stranded, ribose sugar, bases A, U, C, G; mRNA carries the code, tRNA carries amino acids',
          'A triplet of bases on DNA corresponds to a codon on mRNA and an anticodon on tRNA',
          'Three bases code for one amino acid, giving 64 possible combinations for 20 amino acids',
        ],
      },
      {
        name: 'Replication',
        points: [
          'The two strands unwind and the hydrogen bonds break',
          'Each strand acts as a template, and free nucleotides pair with the exposed bases',
          'Two identical molecules result, each with one old and one new strand, which is why it is called semi-conservative',
          'Replication happens during the S phase of interphase, before cell division',
        ],
      },
      {
        name: 'Protein synthesis and mutation',
        points: [
          'Transcription: mRNA is built against the DNA template strand in the nucleus, then leaves through a nuclear pore',
          'Translation: the ribosome reads the mRNA codon by codon; tRNA brings the matching amino acid; a peptide bond joins them',
          'Gene mutation: substitution changes one base; insertion or deletion shifts the reading frame and changes every codon that follows',
          'Chromosome mutation: non-disjunction gives a gamete with the wrong number of chromosomes, as in Down syndrome',
        ],
      },
    ],
    formulae: [
      'DNA base pairing: A-T and C-G',
      'DNA to mRNA: A gives U, T gives A, C gives G, G gives C',
    ],
    commonMistakes: [
      'A frameshift mutation is usually far more damaging than a substitution, because every codon downstream is altered',
      'mRNA is built from the template strand, so it matches the coding strand except that U replaces T',
      'Replication copies DNA; transcription makes RNA from DNA. They are different processes',
    ],
    example: {
      problem: 'A DNA template strand reads C G A T T A G C C. Determine the mRNA sequence transcribed from it, and state how many amino acids it codes for.',
      steps: [
        'Transcription pairs each DNA base with its RNA partner: C gives G, G gives C, A gives U and T gives A.',
        'C G A becomes G C U.',
        'T T A becomes A A U, and G C C becomes C G G.',
        'The mRNA is G C U A A U C G G, which is 9 bases, and since three bases code for one amino acid, it codes for 3 amino acids.',
      ],
      answer: 'mRNA = GCU AAU CGG; it codes for 3 amino acids.',
    },
    moreExamples: [
      {
        problem: 'Explain why a mutation that inserts a single base into a gene is usually more harmful than one that substitutes a single base.',
        steps: [
          'The ribosome reads mRNA in consecutive groups of three bases, so the reading frame matters.',
          'A substitution changes only the one codon in which it occurs, and because the code is degenerate it may not even change the amino acid.',
          'An insertion shifts every base after the insertion point by one place, altering every codon from there onwards.',
          'The protein produced after that point therefore has an entirely different amino acid sequence, and is usually non-functional.',
        ],
        answer: 'An insertion shifts the reading frame so every subsequent codon changes, whereas a substitution alters at most one amino acid.',
      },
    ],
  },
  {
    topicId: 'life-sci-meiosis',
    summary: 'The two-stage reduction division that produces haploid gametes, and the two mechanisms within it that generate genetic variation.',
    keyIdeas: [
      'Meiosis halves the chromosome number, producing haploid cells from a diploid cell',
      'One parent cell produces four genetically different daughter cells',
      'Crossing over in prophase I and independent assortment in metaphase I create variation',
      'Meiosis I separates homologous pairs; meiosis II separates chromatids',
      'Non-disjunction is the failure of chromosomes or chromatids to separate, giving gametes with the wrong number',
    ],
    subtopics: [
      {
        name: 'Meiosis I',
        points: [
          'Prophase I: homologous chromosomes pair up and crossing over exchanges segments between non-sister chromatids',
          'Metaphase I: the homologous pairs line up at the equator, and which member of each pair faces which pole is random, giving independent assortment',
          'Anaphase I: whole chromosomes of each pair are pulled to opposite poles, which is what halves the number',
          'Telophase I: two haploid nuclei form, each chromosome still having two chromatids',
        ],
      },
      {
        name: 'Meiosis II',
        points: [
          'Resembles mitosis, but starts with haploid cells',
          'Metaphase II: chromosomes line up singly at the equator',
          'Anaphase II: chromatids separate to opposite poles',
          'Result: four haploid cells, all genetically different from one another',
        ],
      },
      {
        name: 'Variation and errors',
        points: [
          'Crossing over produces new combinations of alleles on a single chromosome',
          'Independent assortment produces many possible combinations of whole chromosomes',
          'Random fertilisation then multiplies the variation further',
          'Non-disjunction in meiosis I or II gives a gamete with an extra or missing chromosome; fertilisation then produces conditions such as Down syndrome',
        ],
      },
    ],
    commonMistakes: [
      'The chromosome number is halved in anaphase I, when whole chromosomes separate, not in anaphase II',
      'Chromosomes line up in pairs at metaphase I but singly at metaphase II',
      'Meiosis produces four different cells; mitosis produces two identical ones',
    ],
    example: {
      problem: 'Explain how crossing over and independent assortment together ensure that no two gametes from one person are genetically identical.',
      steps: [
        'In prophase I, crossing over exchanges segments between non-sister chromatids of a homologous pair, producing chromosomes with new allele combinations.',
        'In metaphase I, each homologous pair lines up independently of the others, so the maternal and paternal chromosomes are mixed differently each time.',
        'With 23 pairs this alone gives over 8 million possible combinations, and crossing over multiplies that further.',
        'The chance of two gametes receiving exactly the same combination is therefore vanishingly small.',
      ],
      answer: 'Crossing over creates new allele combinations within chromosomes and independent assortment mixes whole chromosomes, giving an astronomically large number of possible gametes.',
    },
    moreExamples: [
      {
        problem: 'Explain why the risk of a child being born with a condition caused by non-disjunction increases with the age of the mother.',
        steps: [
          'A female is born with all her primary oocytes already formed and arrested part way through prophase I.',
          'An oocyte released at age 40 has therefore been held in that arrested state for about 40 years.',
          'Over that time the proteins holding the chromosomes together, and the spindle apparatus, deteriorate.',
          'Homologous chromosomes are then more likely to fail to separate at anaphase I, producing a gamete with an extra or missing chromosome.',
        ],
        answer: 'Her oocytes are arrested in prophase I from before birth, so the older they are the more the spindle and cohesion proteins have degraded, making non-disjunction more likely.',
      },
    ],
  },
  {
    topicId: 'life-sci-genetics',
    summary: 'How characteristics are inherited, how to work with monohybrid and dihybrid crosses, sex linkage and pedigrees, and the uses of DNA profiling.',
    keyIdeas: [
      'A gene is a length of DNA coding for a characteristic; alleles are its alternative forms',
      'Genotype is the alleles an organism carries; phenotype is the characteristic that can be seen',
      'Homozygous means two identical alleles; heterozygous means two different ones',
      'A monohybrid cross follows one characteristic; a dihybrid cross follows two',
      'Sex-linked alleles are carried on the X chromosome, so males, having one X, are affected far more often',
    ],
    subtopics: [
      {
        name: 'Monohybrid crosses',
        points: [
          'Heterozygous x heterozygous (Tt x Tt) gives a 3 : 1 phenotypic ratio and a 1 : 2 : 1 genotypic ratio',
          'Heterozygous x homozygous recessive (Tt x tt) gives a 1 : 1 phenotypic ratio, which is the basis of the test cross',
          'A test cross uses a homozygous recessive partner to reveal an unknown genotype',
          'Incomplete dominance blends the phenotypes (red x white gives pink); codominance shows both fully, as in AB blood group',
        ],
      },
      {
        name: 'Dihybrid crosses and pedigrees',
        points: [
          'A dihybrid cross between two double heterozygotes gives a 9 : 3 : 3 : 1 phenotypic ratio',
          'Each parent heterozygous for two genes produces four gamete types, so the Punnett square has 16 blocks',
          'In a pedigree, two unaffected parents with an affected child means the condition is recessive',
          'If a condition appears in every generation and affects both sexes equally, it is likely to be dominant and autosomal',
        ],
      },
      {
        name: 'Sex linkage and DNA profiling',
        points: [
          'A male is XY, so a single recessive allele on his X is always expressed; he cannot be a carrier',
          'An affected male inherits the allele from his mother, since his only X comes from her',
          'DNA profiling: restriction enzymes cut the DNA, gel electrophoresis separates the fragments by length, and the banding pattern is compared',
          'Uses include criminal investigation, paternity testing, and tracing the origin of confiscated wildlife products',
        ],
      },
    ],
    formulae: [
      'Monohybrid Tt x Tt gives 3 : 1 phenotypic, 1 : 2 : 1 genotypic',
      'Dihybrid TtYy x TtYy gives 9 : 3 : 3 : 1 phenotypic',
      'Probability of two independent events = probability of the first x probability of the second',
    ],
    commonMistakes: [
      'Genotypic and phenotypic ratios differ: Tt x Tt gives 3 : 1 by appearance but 1 : 2 : 1 by genotype',
      'A father cannot pass an X-linked allele to his son, because he gives his son the Y chromosome',
      'Combine independent probabilities by multiplying them, not by adding them',
    ],
    example: {
      problem: 'A heterozygous tall plant (Tt) is crossed with a homozygous short plant (tt). Draw the Punnett square and state the genotypic and phenotypic ratios.',
      steps: [
        'The Tt parent produces two kinds of gamete, T and t; the tt parent produces only t.',
        'Fill the 2 x 2 square: T with t gives Tt, and t with t gives tt, each appearing twice.',
        'Genotypes are therefore 2 Tt and 2 tt, which is a genotypic ratio of 1 Tt : 1 tt.',
        'Tall is dominant, so Tt plants are tall and tt plants are short, giving 1 tall : 1 short.',
      ],
      answer: 'Genotypic ratio 1 Tt : 1 tt; phenotypic ratio 1 tall : 1 short.',
    },
    moreExamples: [
      {
        problem: 'Both parents are unaffected carriers for a recessive disorder (Aa). Determine the probability that their child is a carrier but does not have the disorder.',
        steps: [
          'Cross Aa x Aa. The Punnett square gives AA, Aa, aA and aa.',
          'The genotypic ratio is 1 AA : 2 Aa : 1 aa.',
          'A carrier who does not have the disorder is heterozygous, that is Aa.',
          'Two of the four outcomes are Aa, so the probability is 2/4 = 1/2 = 50%.',
        ],
        answer: '50%',
      },
    ],
  },
  {
    topicId: 'life-sci-evolution',
    summary: 'The evidence that species change over time, how natural selection works, how new species form, and the fossil record of human evolution.',
    keyIdeas: [
      'Evolution is change in the inherited characteristics of a population over many generations',
      'Variation already exists in a population; natural selection acts on it and does not create it',
      'Individuals do not evolve; populations do',
      'Speciation requires reproductive isolation, so that two populations no longer interbreed',
      'Evidence comes from fossils, comparative anatomy, biogeography and molecular biology',
    ],
    subtopics: [
      {
        name: 'Natural selection',
        points: [
          'Variation exists within a population, largely through meiosis, mutation and random fertilisation',
          'More offspring are produced than the environment can support, so there is a struggle for existence',
          'Individuals with favourable variations survive longer and reproduce more, so those alleles become more common',
          'Darwin and Wallace proposed this independently; Lamarck was wrong because acquired characteristics are not inherited',
        ],
      },
      {
        name: 'Evidence for evolution',
        points: [
          'Fossils show change over time and transitional forms; dating uses radiometric methods such as carbon-14 for recent remains',
          'Homologous structures share a common origin but differ in function, indicating divergent evolution and a common ancestor',
          'Analogous structures share a function but not an origin, indicating convergent evolution',
          'Vestigial structures, such as the human appendix and the pelvic remnants of a python, only make sense as inheritance from an ancestor',
        ],
      },
      {
        name: 'Speciation and human evolution',
        points: [
          'Allopatric speciation: a geographic barrier splits a population, which then diverges until the two can no longer interbreed',
          'Sympatric speciation: reproductive isolation arises without a geographic barrier, for example through polyploidy in plants',
          'Genetic drift, the founder effect and bottlenecks change allele frequencies by chance, especially in small populations',
          'Hominid trends: bipedalism, an increasing cranial capacity, smaller jaws and teeth, and a flatter face; African fossils such as Australopithecus africanus and Homo naledi are central evidence',
        ],
      },
    ],
    commonMistakes: [
      'Organisms do not develop features because they need them: the variation must already exist for selection to act on',
      'Natural selection cannot create new alleles; only mutation does that',
      'Africa is the origin of modern humans, supported by the oldest hominid fossils and the greatest human genetic diversity',
    ],
    example: {
      problem: 'Explain how the use of antibiotics has led to populations of resistant bacteria.',
      steps: [
        'A bacterial population already contains variation, and by chance a few individuals carry an allele giving resistance, arising through random mutation.',
        'When the antibiotic is applied it kills the non-resistant bacteria, which is the selection pressure.',
        'The resistant individuals survive and reproduce, passing the resistance allele to their offspring.',
        'Over many generations the proportion of resistant bacteria rises until the antibiotic is no longer effective.',
      ],
      answer: 'Random mutation produces resistant individuals; the antibiotic selects against the rest, so the resistant survivors reproduce and the allele becomes common.',
    },
    moreExamples: [
      {
        problem: 'Explain the process of allopatric speciation, using a mountain range forming across the range of one species as the example.',
        steps: [
          'The mountain range acts as a geographic barrier, splitting the original population into two that can no longer interbreed.',
          'Conditions on the two sides differ, so different variations are favoured by natural selection on each side.',
          'Mutation, genetic drift and different selection pressures cause the gene pools to diverge over many generations.',
          'Eventually the two populations differ so much that they could not produce fertile offspring even if the barrier were removed, so they are separate species.',
        ],
        answer: 'A geographic barrier isolates two populations; different selection pressures and drift cause their gene pools to diverge until they can no longer interbreed.',
      },
    ],
  },
]

export const getTopicNote = (topicId: string) => topicNotes.find((n) => n.topicId === topicId)
