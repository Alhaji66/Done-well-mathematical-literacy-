import type { Question } from '@/types'
import { getTopicNote, type SubtopicNote } from '@/data/topicNotes'

/**
 * Which sub-topic a question belongs to.
 *
 * Practise used to render a topic as one undifferentiated list. Finance holds
 * well over a thousand items, so a learner who is weak on taxation had to read
 * past tariffs, budgets and break-even to find one. Grouping the list under the
 * sub-topic headings the notes already use fixes that, and lets the explanation
 * for a sub-topic sit directly above the questions that drill it.
 *
 * Questions carry no sub-topic field -- there are thousands of them across the
 * papers, and hand-tagging every one is not something anybody would ever finish
 * or keep up to date. So classification is done from the wording, by a short
 * ordered rule list per topic. The rules live here, in one reviewable file:
 * a mis-filed question is a one-line fix, not a data migration.
 *
 * Order matters -- the FIRST matching rule wins, so narrower rules come first.
 * "Calculate the VAT on the municipal account" must land in Taxation, not in
 * Tariffs, so the VAT rule is written above the tariff rule.
 *
 * Anything that matches nothing goes to the end, under its own heading, rather
 * than being silently dropped or forced into a sub-topic it does not belong to.
 */

export interface SubtopicRule {
  /** Must match a sub-topic `name` in the topic's note, exactly. */
  name: string
  match: RegExp
}

/** Questions that matched no rule. Named rather than hidden. */
export const UNSORTED = 'More questions on this topic'

const rules: Record<string, SubtopicRule[]> = {
  // ---------------------------------------------------------------- Mat Lit
  finance: [
    {
      name: 'Taxation: income tax, VAT and UIF',
      match: /\b(vat|value[- ]added tax|income tax|tax(able|ation)?|sars|uif|rebate|tax bracket|zero[- ]rated|paye)\b/i,
    },
    {
      name: 'Exchange rates and inflation',
      match: /\b(exchange rate|inflation|currency|rand|dollar|euro|pound|usd|gbp|per dollar|cpi)\b/i,
    },
    {
      name: 'Break-even, profit and business decisions',
      match: /\b(break[- ]?even|profit|loss|selling price|cost price|mark[- ]?up|revenue|fixed cost|variable cost|income and expenditure of the business)\b/i,
    },
    {
      name: 'Interest, loans and investments',
      match: /\b(interest|loan|invest(ment|ed|s)?|compound|simple interest|instalment|instalments|repay|borrow|bond|fixed deposit)\b/i,
    },
    {
      name: 'Tariffs and municipal accounts',
      match: /\b(tariff|kwh|kilowatt|municipal|electricity|water usage|kilolitre|kl\b|airtime|cellphone contract|per minute|fixed charge|step(ped)? tariff|block)\b/i,
    },
    {
      name: 'Financial documents: payslips, bills and statements',
      match: /\b(payslip|pay slip|gross salary|net salary|deduction|bank statement|till slip|invoice|receipt|statement|pension|medical aid|basic salary)\b/i,
    },
    {
      name: 'Income, expenditure and household budgets',
      match: /\b(budget|expenditure|expenses?|income|surplus|shortfall|deficit|balance|savings?)\b/i,
    },
    {
      name: 'Number formats, rounding and percentages',
      match: /\b(round(ed|ing)?|percentage|percent|decimal place|ratio|increase(d)? by|decrease(d)? by)\b/i,
    },
  ],

  'data-handling': [
    {
      name: 'Probability, chance and relative frequency',
      match: /\b(probabilit|chance|likelihood|relative frequency|random(ly)?|at least one|outcome)\b/i,
    },
    {
      name: 'Misleading graphs and data quality',
      match: /\b(mislead|misleading|distort|biased|valid(ity)?|representative|does not start at zero|justify (the|this) conclusion)\b/i,
    },
    {
      name: 'Spread: range, quartiles and box-and-whisker',
      match: /\b(range|quartile|q1|q3|interquartile|iqr|box[- ]and[- ]whisker|five[- ]number|spread|outlier)\b/i,
    },
    {
      name: 'Mean, median and mode',
      match: /\b(mean|median|mode|modal|average)\b/i,
    },
    {
      name: 'Representing data in tables and graphs',
      match: /\b(bar graph|histogram|pie chart|line graph|frequency polygon|draw (a|the) graph|tally|frequency table|compound bar|stacked)\b/i,
    },
    {
      name: 'Interpreting and comparing graphs',
      match: /\b(graph|trend|compare|interpret|read off|according to the (graph|table)|increase(d)? from)\b/i,
    },
    {
      name: 'Collecting and organising data',
      match: /\b(sample|population|survey|questionnaire|collect|discrete|continuous|class interval|grouped data)\b/i,
    },
  ],

  'maps-plans': [
    {
      name: 'Models, assembly diagrams and instructions',
      match: /\b(model|assembl|instruction|kit|scale model|prototype)\b/i,
    },
    {
      name: 'Seating, layout and packing plans',
      match: /\b(seat(ing|s)?|pack(ing|ed)?|fit into|layout|arrangement|stand|row [a-z0-9]|how many .* fit)\b/i,
    },
    {
      name: 'Floor plans and elevation drawings',
      match: /\b(floor plan|elevation|building plan|room|tile|tiling|skirting|paint|window|door|north elevation|carpet)\b/i,
    },
    {
      name: 'Route planning and travel time',
      match: /\b(route|travel|journey|speed|km\/h|distance table|arrive|depart|petrol|fuel|trip|driving)\b/i,
    },
    {
      name: 'Distance, direction and bearings',
      match: /\b(bearing|direction|compass|north|south|east|west|degrees? (clockwise|from north))\b/i,
    },
    {
      name: 'Scale: number scales and bar scales',
      match: /\b(scale|1\s*:\s*\d|bar scale|number scale|actual (distance|length)|real (distance|length))\b/i,
    },
  ],

  measurement: [
    {
      name: 'Time, temperature and reading instruments',
      match: /\b(temperature|°c|°f|celsius|fahrenheit|24[- ]hour|clock|time taken|thermometer|reading on the)\b/i,
    },
    {
      name: 'Mass, rates and practical calculations',
      match: /\b(rate|per (litre|kg|hour|minute)|consumption|flow|recipe|dosage|dose|ℓ\/100|fuel)\b/i,
    },
    {
      name: 'Surface area',
      match: /\b(surface area|total area of (all|every|the) (faces?|sides?)|paint the outside|wrap)\b/i,
    },
    {
      name: 'Volume and capacity',
      match: /\b(volume|capacity|litre|litres|cubic|holds?|fill(ed)? (the|a)? ?(tank|container)|m³|cm³)\b/i,
    },
    {
      name: 'Area',
      match: /\b(area|m²|cm²|km²|square metre|tiles? needed|coverage)\b/i,
    },
    {
      name: 'Perimeter and distance around a shape',
      match: /\b(perimeter|circumference|fenc(e|ing)|around the (outside|edge)|border)\b/i,
    },
    {
      name: 'Units and conversions',
      match: /\b(convert|conversion|in (millimetres|centimetres|metres|kilometres|grams|kilograms)|mm|cm|km|kg|mℓ)\b/i,
    },
  ],

  // ------------------------------------------------------------ Mathematics
  'math-algebra': [
    { name: 'Nature of the roots', match: /\b(nature of the roots|discriminant|b²\s*−\s*4ac|real and (equal|unequal)|non[- ]real)\b/i },
    { name: 'Simultaneous equations', match: /\b(simultaneous|solve for x and y|two equations)\b/i },
    { name: 'Quadratic equations', match: /\b(quadratic|x²|quadratic formula|complet(e|ing) the square|roots of the equation)\b/i },
    { name: 'Algebraic fractions', match: /\b(fraction|denominator|numerator|simplify.*\/|lowest common denominator)\b/i },
    { name: 'Exponents and surds', match: /\b(exponent|surd|√|power of|index|indices|rationalis|\d\^|base)\b/i },
    { name: 'Linear equations and inequalities', match: /\b(inequalit|interval notation|number line|solve for x\b|linear equation)\b/i },
    { name: 'Word problems and setting up equations', match: /\b(consecutive|the sum of two numbers|word problem|let x be|three times as)\b/i },
    { name: 'Simplifying and factorising expressions', match: /\b(factoris|factor|simplify|expand|difference of two squares|trinomial|grouping)\b/i },
  ],

  'math-functions': [
    { name: 'Inverse functions', match: /\b(inverse|f⁻¹|reflect(ion)? in the line y = x|one[- ]to[- ]one)\b/i },
    { name: 'Transformations of graphs', match: /\b(transform|shift|translat|reflect|stretch|moved .* units)\b/i },
    { name: 'Exponential and logarithmic functions', match: /\b(exponential|logarith|log\b|growth|decay|b\^x)\b/i },
    { name: 'Hyperbolic functions', match: /\b(hyperbola|hyperbolic|asymptote|a ÷ \(x)\b/i },
    { name: 'Quadratic functions (parabolas)', match: /\b(parabola|turning point|axis of symmetry|x²|maximum value of the (function|graph))\b/i },
    { name: 'Linear functions', match: /\b(straight line|linear function|y = mx|gradient of the line|y[- ]intercept)\b/i },
    { name: 'Interpreting graphs', match: /\b(intercept|domain|range|point(s)? of intersection|f\(x\) *[<>]|read off the graph|sketch)\b/i },
  ],

  'math-trigonometry': [
    { name: 'Sine, cosine and area rules in 2D and 3D', match: /\b(sine rule|cosine rule|area rule|triangle abc|3d|three[- ]dimensional)\b/i },
    { name: 'Trigonometric graphs', match: /\b(period|amplitude|trig(onometric)? graph|sketch .* (sin|cos|tan))\b/i },
    { name: 'Trigonometric equations and general solution', match: /\b(general solution|solve for θ|solve the equation|k ?∈ ?ℤ)\b/i },
    { name: 'Identities', match: /\b(identit|prove that|compound angle|double angle|sin ?2|cos ?2|sin²|cos²)\b/i },
    { name: 'Reduction formulae and the CAST diagram', match: /\b(reduction|cast|quadrant|180° ?[−+]|360° ?−|co[- ]?function)\b/i },
    { name: 'Special angles and the calculator', match: /\b(without (using )?a calculator|special angle|exact value|30°|45°|60°)\b/i },
    { name: 'Trig ratios in right-angled triangles', match: /\b(sin|cos|tan|hypotenuse|opposite|adjacent|right[- ]angled)\b/i },
  ],

  'math-analytical-geometry': [
    { name: 'Tangents to a circle', match: /\b(tangent)\b/i },
    { name: 'Circles in the Cartesian plane', match: /\b(circle|centre|radius|\(x ?− ?a\)²)\b/i },
    { name: 'Angle of inclination', match: /\b(inclination|angle .* (positive )?x[- ]axis|tan ?θ ?= ?m)\b/i },
    { name: 'Equation of a straight line', match: /\b(equation of (the|a) line|perpendicular bisector|median|altitude|y ?− ?y₁)\b/i },
    { name: 'Gradient, parallel and perpendicular lines', match: /\b(gradient|parallel|perpendicular|collinear)\b/i },
    { name: 'Midpoint', match: /\b(midpoint|mid[- ]point|bisect)\b/i },
    { name: 'Distance between two points', match: /\b(distance|length of)\b/i },
  ],

  'math-statistics': [
    { name: 'Scatter plots, correlation and regression', match: /\b(scatter|correlation|regression|least squares|ŷ|r =)\b/i },
    { name: 'Ogives (cumulative frequency curves)', match: /\b(ogive|cumulative frequency)\b/i },
    { name: 'Outliers and their effect', match: /\b(outlier)\b/i },
    { name: 'Five-number summary and box-and-whisker plots', match: /\b(box[- ]and[- ]whisker|five[- ]number|skew)\b/i },
    { name: 'Measures of dispersion', match: /\b(standard deviation|variance|dispersion|interquartile|iqr|quartile|spread|range)\b/i },
    { name: 'Grouped data, histograms and frequency polygons', match: /\b(histogram|grouped data|class interval|frequency polygon|modal class)\b/i },
    { name: 'Measures of central tendency', match: /\b(mean|median|mode|modal|average)\b/i },
  ],

  'math-finance-growth': [
    { name: 'Outstanding balance', match: /\b(outstanding|balance (owing|outstanding)|settle the loan|final payment)\b/i },
    { name: 'Present value annuities and loans', match: /\b(present value|loan|bond|mortgage|repay|instalment|monthly payment)\b/i },
    { name: 'Future value annuities', match: /\b(future value|sinking fund|save|savings|annuity|regular deposit)\b/i },
    { name: 'Nominal and effective interest rates', match: /\b(nominal|effective (annual )?(interest )?rate|compounded (monthly|quarterly|daily))\b/i },
    { name: 'Depreciation', match: /\b(depreciat|reducing balance|diminishing|book value|straight[- ]line)\b/i },
    { name: 'Timelines and changing interest rates', match: /\b(timeline|time line|rate changed|withdrew|withdrawal|deposited .* and .* later)\b/i },
    { name: 'Simple and compound interest', match: /\b(interest|compound|invest|p\(1 ?\+ ?i\))\b/i },
  ],

  'math-number-patterns': [
    { name: 'Convergence and the sum to infinity', match: /\b(converge|sum to infinity|s∞|infinite (geometric )?series|recurring decimal)\b/i },
    { name: 'Sigma notation', match: /\b(sigma|∑|σ notation|sum from)\b/i },
    { name: 'Geometric sequences and series', match: /\b(geometric|common ratio|\br\b ?=|ar\^)\b/i },
    { name: 'Arithmetic sequences and series', match: /\b(arithmetic (sequence|series)|sum of the first|sₙ|common difference)\b/i },
    { name: 'Quadratic patterns', match: /\b(quadratic (pattern|sequence)|second difference|an² ?\+ ?bn)\b/i },
    { name: 'Linear (arithmetic) patterns', match: /\b(pattern|sequence|tₙ|nth term|first difference)\b/i },
  ],

  'math-calculus': [
    { name: 'Rates of change', match: /\b(rate of change|velocit|accelerat|how fast|per second|s\(t\))\b/i },
    { name: 'Optimisation', match: /\b(optimis|maximum (volume|area|profit)|minimum (cost|surface area)|largest possible|least amount)\b/i },
    { name: 'Limits and differentiation from first principles', match: /\b(first principles|limit|lim|h ?→ ?0)\b/i },
    { name: 'Sketching cubic graphs', match: /\b(cubic|sketch the graph|point of inflection|x[- ]intercepts of f)\b/i },
    { name: 'Stationary points and concavity', match: /\b(stationary|turning point|concav|increasing|decreasing|f″|second derivative)\b/i },
    { name: 'Gradients and equations of tangents', match: /\b(tangent|gradient of the (curve|tangent)|equation of the tangent)\b/i },
    { name: 'Rules of differentiation', match: /\b(differentiat|derivative|dy\/dx|f′|d_?x)\b/i },
  ],

  'math-counting-probability': [
    { name: 'Arrangements with restrictions', match: /\b(restriction|must (be|sit|stand) (together|next to)|cannot be (next|adjacent)|begins with|ends with|code|password|number plate)\b/i },
    { name: 'The fundamental counting principle', match: /\b(counting principle|how many (different )?(ways|arrangements)|arrange|factorial|n!)\b/i },
    { name: 'Tree diagrams and two-way tables', match: /\b(tree diagram|two[- ]way table|with(out)? replacement|first .* then)\b/i },
    { name: 'Independent events and the product rule', match: /\b(independent|product rule|p\(a\) ?× ?p\(b\))\b/i },
    { name: 'The addition rule', match: /\b(addition rule|p\(a (or|∪) b\)|either .* or)\b/i },
    { name: 'Mutually exclusive and complementary events', match: /\b(mutually exclusive|complement|exhaustive)\b/i },
    { name: 'Venn diagrams', match: /\b(venn|∪|∩|intersection|union|neither)\b/i },
    { name: 'Basic probability', match: /\b(probabilit|chance|likelihood)\b/i },
  ],

  'math-euclidean-geometry': [
    { name: 'Writing a geometry proof', match: /\b(prove that|proof|give (a )?reasons?|state the reason)\b/i },
    { name: 'Proportionality and the mid-point theorem', match: /\b(proportion|mid[- ]?point theorem|divides .* proportionally|ratio of the areas)\b/i },
    { name: 'Tangents and the tan-chord theorem', match: /\b(tangent|tan[- ]chord|alternate segment)\b/i },
    { name: 'Circle geometry: same segment and cyclic quadrilaterals', match: /\b(cyclic|same segment|concyclic|exterior angle of)\b/i },
    { name: 'Circle geometry: centre and chord theorems', match: /\b(chord|centre of the circle|semicircle|arc|angle at the centre)\b/i },
    { name: 'Properties of quadrilaterals', match: /\b(parallelogram|rhombus|rectangle|square|trapezium|kite|quadrilateral)\b/i },
    { name: 'Congruency and similarity', match: /\b(congruen|similar|sss|sas|aas|rhs|\|\|\|)\b/i },
    { name: 'Lines, angles and triangles', match: /\b(angle|triangle|parallel|straight line|degrees)\b/i },
  ],
}

/**
 * Topics with no hand-written rules are classified against the sub-topic's own
 * text instead -- its name and its explanation points, which is where a topic's
 * real vocabulary lives.
 *
 * Matching only the sub-topic NAME was tried first and placed barely a third of
 * the science questions: a name like "Structure and function of the nephron"
 * shares no wording with "Label part B" or "Explain how ADH affects
 * reabsorption". The points do carry that wording.
 *
 * So each sub-topic gets a weighted vocabulary. A term appearing under one
 * sub-topic only is a strong signal; a term appearing under most of them --
 * "cell", "water", "energy" -- is nearly worthless, and is weighted accordingly.
 * A question goes to the sub-topic it scores highest against, provided the score
 * clears MIN_SCORE; otherwise it is left unplaced rather than guessed at.
 */
const STOP_WORDS = new Set([
  'and', 'the', 'of', 'in', 'to', 'a', 'an', 'or', 'for', 'with', 'from', 'its',
  'their', 'how', 'what', 'why', 'that', 'this', 'as', 'on', 'at', 'by', 'is',
  'are', 'basic', 'other', 'more', 'using', 'between', 'into', 'each', 'than',
  'when', 'which', 'them', 'they', 'these', 'those', 'also', 'been', 'have',
  'has', 'was', 'were', 'will', 'can', 'not', 'but', 'one', 'two', 'both',
  'give', 'name', 'state', 'write', 'show', 'does', 'any', 'all', 'over',
  'under', 'same', 'different', 'first', 'second', 'must', 'may', 'only',
  'then', 'there', 'here', 'you', 'your', 'it', 'if', 'so', 'be', 'do',
  'question', 'answer', 'following', 'above', 'below', 'given', 'shown',
  'calculate', 'determine', 'explain', 'describe', 'define', 'identify',
])

const tokens = (text: string) =>
  (text.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []).filter((w) => !STOP_WORDS.has(w))

/**
 * A term has to carry this much weight in total before a question is filed.
 * One shared word is not evidence; a couple of distinctive ones are.
 */
const MIN_SCORE = 1.2
/** The name is what the sub-topic is actually called, so its terms count double. */
const NAME_BOOST = 2

interface ScoredSubtopic {
  name: string
  weights: Map<string, number>
}

function scorersFromNotes(subs: SubtopicNote[]): ScoredSubtopic[] {
  const vocab = subs.map((sub) => {
    const counts = new Map<string, number>()
    for (const t of tokens(sub.name)) counts.set(t, (counts.get(t) ?? 0) + NAME_BOOST)
    for (const point of sub.points) {
      for (const t of tokens(point)) counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    return { name: sub.name, counts }
  })

  // How many sub-topics each term appears under, within this topic.
  const spread = new Map<string, number>()
  for (const v of vocab) for (const t of v.counts.keys()) spread.set(t, (spread.get(t) ?? 0) + 1)

  return vocab.map((v) => {
    const weights = new Map<string, number>()
    for (const [term, count] of v.counts) {
      const df = spread.get(term) ?? 1
      // Unique to this sub-topic: full weight. Shared across many: almost none.
      const weight = (1 / df) * Math.min(count, 3)
      if (weight >= 0.4) weights.set(term, weight)
    }
    return { name: v.name, weights }
  })
}

const scorers = new Map<string, ScoredSubtopic[]>()

function scorersFor(topicId: string): ScoredSubtopic[] {
  const cached = scorers.get(topicId)
  if (cached) return cached
  const built = scorersFromNotes(getTopicNote(topicId)?.subtopics ?? [])
  scorers.set(topicId, built)
  return built
}

/** The sub-topic a single question belongs to, or null if nothing places it. */
export function subtopicFor(q: Question): string | null {
  const text = `${q.prompt} ${q.context ?? ''}`

  // Hand-written rules decide first, because they encode orderings the scorer
  // cannot know -- "the VAT on the municipal account" is a taxation question,
  // not a tariff one. Where none of them matches, the scorer still gets a turn
  // rather than the question being dropped straight into the unsorted bucket.
  const written = rules[q.topicId]
  if (written) {
    for (const rule of written) if (rule.match.test(text)) return rule.name
  }

  let best: string | null = null
  let bestScore = 0
  const seen = new Set(tokens(text))
  for (const sub of scorersFor(q.topicId)) {
    let score = 0
    for (const term of seen) score += sub.weights.get(term) ?? 0
    if (score > bestScore) {
      bestScore = score
      best = sub.name
    }
  }
  return bestScore >= MIN_SCORE ? best : null
}

export interface SubtopicGroup {
  name: string
  /** The explanation for this sub-topic, from the topic's note. Absent for UNSORTED. */
  points?: string[]
  questions: Question[]
}

/**
 * Split a topic's questions into its sub-topics, in the order the note lists
 * them, so the sequence a learner reads matches the sequence they were taught.
 * Empty sub-topics are dropped; unmatched questions come last under UNSORTED.
 */
export function groupBySubtopic(topicId: string, questions: Question[]): SubtopicGroup[] {
  const subs = getTopicNote(topicId)?.subtopics ?? []
  if (!subs.length) return [{ name: UNSORTED, questions }]

  const buckets = new Map<string, Question[]>(subs.map((s) => [s.name, []]))
  const unsorted: Question[] = []

  for (const q of questions) {
    const name = subtopicFor(q)
    const bucket = name ? buckets.get(name) : undefined
    if (bucket) bucket.push(q)
    else unsorted.push(q)
  }

  const groups: SubtopicGroup[] = []
  for (const sub of subs) {
    const qs = buckets.get(sub.name) ?? []
    if (qs.length) groups.push({ name: sub.name, points: sub.points, questions: qs })
  }
  if (unsorted.length) groups.push({ name: UNSORTED, questions: unsorted })
  return groups
}
