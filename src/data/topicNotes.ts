export interface WorkedExample {
  problem: string
  steps: string[]
  answer: string
}

export interface TopicNote {
  topicId: string
  summary: string
  keyIdeas: string[]
  example: WorkedExample
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
]

export const getTopicNote = (topicId: string) => topicNotes.find((n) => n.topicId === topicId)
