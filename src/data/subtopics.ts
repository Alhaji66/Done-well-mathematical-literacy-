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
      match: /\b(vat|value[- ]added tax|income tax|tax(able|ation)?|sars|uif|rebate\w*|tax bracket|zero[- ]rated|paye|pension fund|tax threshold)\b/i,
    },
    {
      name: 'Exchange rates and inflation',
      match: /\b(exchange rate|inflation|currency|rand|dollar|euro|pound|usd|gbp|per dollar|cpi)\b/i,
    },
    {
      name: 'Break-even, profit and business decisions',
      match: /\b(break[- ]?even|profit|loss|selling price|cost price|mark[- ]?up|revenue|fixed cost\w*|variable cost|income and expenditure of the business)\b/i,
    },
    {
      name: 'Interest, loans and investments',
      match: /\b(interest|loan|invest(ment|ed|s)?|compound|simple interest|instalment|instalments|repay|borrow|bond|fixed deposit)\b/i,
    },
    {
      name: 'Tariffs and municipal accounts',
      match: /\b(tariff|kwh|kilowatt|municipal|electricity|water usage|kilolitre\w*|kl\b|airtime|cellphone contract|per minute|fixed charge|step(ped)? tariff|block)\b/i,
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
      match: /\b(round(ed|ing)?|percentage|percent\w*|decimal place|ratio|increase(d)? by|decrease(d)? by)\b/i,
    },
  ],

  'data-handling': [
    {
      name: 'Probability, chance and relative frequency',
      match: /\b(probabilit\w*|chance|likelihood|relative frequency|random(ly)?|at least one|outcome)\b/i,
    },
    {
      name: 'Misleading graphs and data quality',
      match: /\b(mislead\w*|distort\w*|biased|valid(ity)?|representative|does not start at zero|justify (the|this) conclusion)\b/i,
    },
    {
      name: 'Spread: range, quartiles and box-and-whisker',
      match: /\b(range|quartile|q1|q3|interquartile|iqr|box[- ]and[- ]whisker|five[- ]number|spread|outlier)\b/i,
    },
    {
      name: 'Representing data in tables and graphs',
      match: /\b(bar graph|histogram|pie chart|line graph|frequency polygon|draw (a|the) graph|tally|frequency table|compound bar|stacked)\b/i,
    },
    {
      name: 'Mean, median and mode',
      match: /\b(mean|median|mode|modal|average)\b/i,
    },
    {
      name: 'Interpreting and comparing graphs',
      match: /\b(graph|trend|compare|interpret|read off|according to the (graph|table)|increase(d)? from)\b/i,
    },
    {
      name: 'Collecting and organising data',
      match: /\b(sample|population|survey|questionnaire|collect\w*|discrete|continuous|class interval\w*|grouped data)\b/i,
    },
  ],

  'maps-plans': [
    {
      name: 'Models, assembly diagrams and instructions',
      // "net", "flat-pack" and "parts list" belong here too: a packaging net and
      // a flat-pack parts list are both the CAPS "models and assembly" skill,
      // and without them such questions were taken by the packing-plans and
      // floor-plans rules further down.
      match: /\b(model|assembl\w*|instruction|kit|scale model|prototype|flat[- ]?pack|parts list|net of|into a net)\b/i,
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
      // The degree symbols sit OUTSIDE the \b(...)\b group on purpose. A leading
      // \b before "°" demands a word character immediately before it, so "350 °F"
      // -- with the space a unit normally takes -- never matched, and every
      // temperature-conversion question fell through to another sub-topic.
      name: 'Time, temperature and reading instruments',
      match:
        /(°\s*[cf]\b)|\b(temperature|celsius|fahrenheit|thermometer|24[- ]hour|12[- ]hour|clock|time taken|time zone|what time|elapsed|reading on the|marked every|accurate to within)\b/i,
    },
    {
      // A question that SAYS convert is a conversion question, whatever unit it
      // happens to convert. This rule has to sit above the quantity rules
      // below, because they match on the unit: "Convert 6 000 litres to
      // kilolitres" was landing in Volume and capacity, and so were "Convert
      // 2,7 m³ to litres" and "Which unit is most appropriate for the height?"
      // -- 19 of the 76 questions in that bucket. The cost was paid by the one
      // week that most needs them: Conversions is an ATP heading of its own,
      // and its bucket was missing every conversion that named a volume.
      name: 'Units and conversions',
      match:
        /\b(convert|conversion table|conversion factor)\b|\b(which|what) unit\b|\bunit (used to measure|of measurement)\b|most appropriate (unit|instrument)\b/i,
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
      // "fenc(e|ing)" used to be a stem here and was filing the wrong things:
      // "Calculate the AREA of the fence" and "the fence needs 3,6 litres of
      // paint" are not perimeter questions. Every genuine perimeter question in
      // the corpus says "perimeter" in so many words -- including the ones
      // about fencing, "Fencing the 320 m perimeter is quoted at R14 400" --
      // so the stem only ever cost accuracy.
      name: 'Perimeter and distance around a shape',
      match: /\b(perimeter|circumference|around the (outside|edge)|border)\b/i,
    },
    {
      name: 'Units and conversions',
      match: /\b(convert|conversion|in (millimetres|centimetres|metres|kilometres|grams|kilograms)|mm|cm|km|kg|mℓ)\b/i,
    },
  ],

  // ---------------------------------------------------------- Life Sciences
  //
  // Two topics where the scorer could not separate a sub-topic from its
  // neighbours, because the neighbours use all of its vocabulary. Everything
  // else in Life Sciences is left to the scorer.
  'life-sci-response-plants': [
    {
      // Every tropism question mentions the tropism and most mention auxin, so
      // what marks this sub-topic out is the WHY -- the survival benefit --
      // rather than any term unique to it.
      name: 'Why tropisms matter',
      match:
        /\b(adaptive (significance|advantage)|survival (value|advantage)|why (this|the) (response|adaptation)|benefit to the plant|maximis\w* the light|advantage(ous)? (to|for) the (plant|seedling|root|shoot))\b/i,
    },
    { name: 'Auxin action', match: /\b(auxin|shaded side|elongat\w*|shoot tip|growing tip|hormone)\b/i },
    { name: 'Types of tropism', match: /\b(\w*tropism|\w*tropic|nastic|tendril)\b/i },
  ],
  'life-sci-animal-nutrition': [
    {
      // Named enzymes and their substrate-to-product conversions. The
      // alimentary canal rule below also talks about pepsin and amylase, so
      // this one has to come first or it is shadowed completely.
      name: 'Enzymes and their products',
      match:
        /\b(amylase|pepsin|trypsin|lipase|maltase|lactase|peptidase|name the enzyme|which enzyme|enzyme (found|secreted|produced|in)|(starch|protein|lipid|fat|maltose|peptide)s? (to|into) (maltose|amino acid|fatty acid|glucose|peptide))/i,
    },
    {
      name: 'Absorption and assimilation',
      match: /\b(absorb\w*|assimilat\w*|villus|villi|microvilli|lacteal|hepatic portal|glycogen)\b/i,
    },
    {
      name: 'The alimentary canal',
      match: /\b(alimentary|oesophagus|stomach|duodenum|small intestine|large intestine|peristalsis|bile|gall bladder|egest\w*|pH of)\b/i,
    },
  ],

  // ------------------------------------------------------ Physical Sciences
  //
  // The science subjects are otherwise classified by the vocabulary scorer
  // below, which works well where sub-topics use distinct words. These three
  // topics defeat it: their sub-topics share almost all their vocabulary, so
  // every photon question scored highest against "the photoelectric effect"
  // and every pH question against "strength and concentration", leaving
  // "Photons", "pH and Kw" and "Power and cost" permanently empty despite
  // 10, 14 and 25 questions being about exactly those things.
  //
  // Only the topics that need disambiguating are listed. A rule list does not
  // replace the scorer -- where no rule matches, the scorer still gets its
  // turn -- so these entries steer the ambiguous cases and leave the rest.
  'phys-electric-circuits': [
    {
      // Cost and the power formulae, rather than any mention of the word
      // "power", which appears throughout the internal-resistance questions.
      name: 'Power and cost',
      match:
        /\b(cost of|kilowatt[- ]?hour|kwh|units of electricity|electricity (bill|account|tariff)|power rating|rated at|energy consumed|P ?= ?VI|P ?= ?I ?²? ?R|P ?= ?V ?²? ?\/ ?R)\b/i,
    },
    {
      name: 'Internal resistance',
      match: /\b(internal resistance|\bemf\b|electromotive force|lost volts|terminal (potential|voltage)|ε ?=)\b/i,
    },
    {
      name: 'Combining resistors',
      match: /\b(in series|in parallel|equivalent resistance|total resistance|combination of resistors)\b/i,
    },
  ],
  'phys-electric-circuits-g11': [
    {
      // Meter placement. The Grade 11 note has no sub-topic for it, and the
      // scorer places a question that only says "the learner connects the
      // ammeter across R2" nowhere at all. It belongs with the series work:
      // an ammeter goes in series BECAUSE the current is the same at every
      // point of a series path, which is the first point that sub-topic makes.
      // Only this one rule is written -- the rest of the topic classifies
      // well enough without help, and a fuller rule list would reshuffle
      // questions that are already in the right place.
      name: 'Series circuits',
      match: /\b(ammeter|voltmeter|circuit diagram)s?\b/i,
    },
  ],
  'phys-electrostatics': [
    {
      // Every question here is about Coulomb's law or the electric field, so
      // the scorer had nothing left to give "Working in one dimension". What
      // actually distinguishes it is the SETUP -- charges on a line, with the
      // contributions signed and added -- not the formula being used, so this
      // rule matches the arrangement and leaves the two-charge questions to
      // the scorer.
      name: 'Working in one dimension',
      match:
        /\b(on a straight line|on the x[- ]axis|collinear|same straight line|positive direction|net (electrostatic )?(force|field) (on|at)|resultant (force|field)|zero net|point where the (net )?(electric )?field is zero|midway between|three charges)\b/i,
    },
  ],
  'phys-em-radiation': [
    {
      name: 'Why it needed the photon model',
      match: /\b(wave (theory|model) (could not|cannot|fails)|classical (theory|physics)|intensity|predicted by the wave|instantaneous(ly)?)\b/i,
    },
    {
      name: 'Photons',
      match: /\b(E ?= ?hf|E ?= ?hc|planck|energy of (a|one|each|the) photon|photon energy|how many photons|number of photons)\b/i,
    },
    {
      name: 'The photoelectric effect',
      match: /\b(photoelectric|work function|threshold frequency|cut[- ]?off frequency|electrons? (are |is )?(emitted|ejected|released)|W0|maximum kinetic energy of the (emitted|ejected))\b/i,
    },
  ],
  'phys-acids-bases': [
    {
      name: 'Titration and hydrolysis',
      match: /\b(titrat\w*|equivalence point|end[- ]?point|indicator|burette|pipette|standard solution|hydrolys\w*|salt of a)\b/i,
    },
    {
      name: 'pH and Kw',
      match: /\b(pH|pOH|Kw|ionisation constant of water|hydronium (ion )?concentration)\b|\[H3O|\[OH/i,
    },
    {
      name: 'Strength and concentration',
      match: /\b(strong (acid|base)|weak (acid|base)|concentrated|dilute|degree of ionisation|ampholyte|conjugate)\b/i,
    },
  ],

  // ------------------------------------------------------------ Mathematics
  'math-number-systems': [
    // Estimating a surd and classifying a number both talk about "irrational"
    // and "√", so the scorer could not separate them. What is distinctive is
    // the ESTIMATING -- bracketing a surd between consecutive integers.
    {
      name: 'Estimating surds',
      match:
        /\b(estimat\w*|between which two|consecutive integers|closer to|without (using )?a calculator|perfect square|ascending order)\b/i,
    },
    { name: 'Decimals and fractions', match: /\b(recurring|terminating|decimal|fraction|numerator|denominator)\b/i },
    { name: 'The real number system', match: /\b(rational|irrational|integer|natural number|whole number|real number|undefined|non[- ]real)\b/i },
  ],

  'math-algebra': [
    // NOT "b² − 4ac": that string is the quadratic formula, which these papers
    // print in the `context` as a reference for any question that needs it. It
    // was therefore matching all 18 plain "solve using the quadratic formula"
    // questions and filing them under Nature of the roots, leaving Quadratic
    // equations permanently empty. A question that is genuinely about the
    // discriminant says so in the prompt.
    { name: 'Nature of the roots', match: /\b(nature of the roots|discriminant|real and (equal|unequal)|non[- ]real)\b/i },
    { name: 'Simultaneous equations', match: /\b(simultaneous|solve for x and y|two equations)\b/i },
    { name: 'Quadratic equations', match: /\b(quadratic|x²|quadratic formula|complet(e|ing) the square|roots of the equation)\b/i },
    { name: 'Algebraic fractions', match: /\b(fraction|denominator|numerator|simplify.*\/|lowest common denominator)\b/i },
    { name: 'Exponents and surds', match: /\b(exponent\w*|surd|√|power of|index|indices|rationalis|\d\^|base)\b/i },
    { name: 'Linear equations and inequalities', match: /\b(inequalit|interval notation|number line|solve for x\b|linear equation)\b/i },
    { name: 'Word problems and setting up equations', match: /\b(consecutive|the sum of two numbers|word problem|let x be|three times as)\b/i },
    { name: 'Simplifying and factorising expressions', match: /\b(factoris\w*|factor|simplify|expand\w*|difference of two squares|trinomial|grouping)\b/i },
  ],

  'math-functions': [
    // ⁻¹ against any function letter, not f alone: a question about g⁻¹ is no
    // less an inverse question, and "inverse" itself often appears only in the
    // answer, which the classifier does not read.
    // The ⁻¹ alternative sits OUTSIDE the \b(...)\b wrapper. A superscript is
    // not a word character, so a trailing \b after "g⁻¹" can never hold and the
    // alternative would silently never fire -- which is what the original
    // `f⁻¹` inside the group was doing.
    { name: 'Inverse functions', match: /\b(inverse|reflect\w* in the line y = x|one[- ]to[- ]one)\b|[a-z]⁻¹/i },
    { name: 'Transformations of graphs', match: /\b(transform\w*|shift\w*|translat\w*|reflect\w*|stretch\w*|shrink\w*|moved .* units)\b/i },
    { name: 'Exponential and logarithmic functions', match: /\b(exponential|logarith\w*|log\b|grow\w*|decay\w*|doubling time|half[- ]life|b\^x)\b/i },
    { name: 'Hyperbolic functions', match: /\b(hyperbola|hyperbolic|asymptote|a ÷ \(x)\b/i },
    { name: 'Quadratic functions (parabolas)', match: /\b(parabola|turning point|axis of symmetry|x²|maximum value of the (function|graph))\b/i },
    { name: 'Linear functions', match: /\b(straight line|linear function|y = mx|gradient of the line|y[- ]intercept)\b/i },
    { name: 'Interpreting graphs', match: /\b(intercept|domain|range|point(s)? of intersection|f\(x\) *[<>]|read off the graph|sketch)\b/i },
  ],

  'math-trigonometry': [
    { name: 'Sine, cosine and area rules in 2D and 3D', match: /\b(sine rule|cosine rule|area rule|triangle abc|3d|three[- ]dimensional)\b/i },
    { name: 'Trigonometric graphs', match: /\b(period|amplitude|trig(onometric)? graph|(sketch|graphs? of|drawn) .{0,40}(sin|cos|tan))\b/i },
    { name: 'Trigonometric equations and general solution', match: /\b(general solution|solve for θ|solve the equation|k ?∈ ?ℤ)\b/i },
    { name: 'Identities', match: /\b(identit\w*|prove that|compound angle|double angle|sin ?2|cos ?2|sin²|cos²)\b/i },
    // "cast diagram" and "cast rule", not a bare "cast" -- a shadow cast by a
    // flagpole is a perfectly ordinary trigonometry question about something
    // else entirely.
    // The 180°/360° alternatives sit OUTSIDE the \b(...)\b wrapper. They end
    // in an operator, and an operator is not a word character, so a trailing
    // \b after "180° +" can never hold -- both were silently dead.
    { name: 'Reduction formulae and the CAST diagram', match: /\b(reduction|cast (diagram|rule)|quadrant|co[- ]?function)\b|(180|360)° ?[−+]/i },
    { name: 'Special angles and the calculator', match: /\b(without (using )?a calculator|special angle|exact value\w*|30°|45°|60°)\b/i },
    { name: 'Trig ratios in right-angled triangles', match: /\b(sin|cos|tan|hypotenuse|opposite|adjacent|right[- ]angled)\b/i },
  ],

  'math-analytical-geometry': [
    { name: 'Tangents to a circle', match: /\b(tangent)\b/i },
    { name: 'Circles in the Cartesian plane', match: /\b(circle|centre|radius|\(x ?− ?a\)²)\b/i },
    { name: 'Angle of inclination', match: /\b(inclination|angle .* (positive )?x[- ]axis|tan ?θ ?= ?m)\b/i },
    { name: 'Equation of a straight line', match: /\b(equation of (the|a) line|perpendicular bisector|median|altitude|y ?− ?y₁)\b/i },
    { name: 'Gradient, parallel and perpendicular lines', match: /\b(gradient|parallel|perpendicular|collinear)\b/i },
    { name: 'Midpoint', match: /\b(midpoint|mid[- ]point|bisect\w*)\b/i },
    { name: 'Distance between two points', match: /\b(distance|length of)\b/i },
  ],

  'math-statistics': [
    { name: 'Scatter plots, correlation and regression', match: /\b(scatter\w*|correlation|regression|least squares|ŷ|r =)\b/i },
    { name: 'Ogives (cumulative frequency curves)', match: /\b(ogive|cumulative frequency)\b/i },
    { name: 'Outliers and their effect', match: /\b(outlier)\b/i },
    { name: 'Five-number summary and box-and-whisker plots', match: /\b(box[- ]and[- ]whisker|five[- ]number|skew)\b/i },
    { name: 'Measures of dispersion', match: /\b(standard deviation|variance|dispersion|interquartile|iqr|quartile|spread|range)\b/i },
    { name: 'Grouped data, histograms and frequency polygons', match: /\b(histogram|grouped data|class interval\w*|frequency polygon|modal class)\b/i },
    { name: 'Measures of central tendency', match: /\b(mean|median|mode|modal|average)\b/i },
  ],

  'math-finance-growth': [
    { name: 'Outstanding balance', match: /\b(outstanding|balance (owing|outstanding)|settle the loan|final payment)\b/i },
    { name: 'Present value annuities and loans', match: /\b(present value|loan|bond|mortgage|repay|instalment|monthly payment)\b/i },
    { name: 'Future value annuities', match: /\b(future value|sinking fund|save|savings|annuity|regular deposit)\b/i },
    { name: 'Nominal and effective interest rates', match: /\b(nominal|effective (annual )?(interest )?rate|compounded (monthly|quarterly|daily))\b/i },
    { name: 'Depreciation', match: /\b(depreciat\w*|reducing balance|diminishing|book value|straight[- ]line)\b/i },
    // "withdrawal" alone never fired: the prompts say withdrawals, withdrawing,
    // withdrawn and withdraws, and the trailing \b rejected every one of them.
    { name: 'Timelines and changing interest rates', match: /\b(timeline|time line|rate changed|withdrew|withdraw\w*|deposited .* and .* later)\b/i },
    { name: 'Simple and compound interest', match: /\b(interest|compound|invest\w*|p\(1 ?\+ ?i\))\b/i },
  ],

  'math-number-patterns': [
    { name: 'Convergence and the sum to infinity', match: /\b(converge\w*|sum to infinity|s∞|infinite (geometric )?series|recurring decimal)\b/i },
    { name: 'Sigma notation', match: /\b(sigma|∑|σ notation|sum from)\b/i },
    { name: 'Geometric sequences and series', match: /\b(geometric|common ratio|\br\b ?=|ar\^)\b/i },
    { name: 'Arithmetic sequences and series', match: /\b(arithmetic (sequence|series)|sum of the first|sₙ|common difference)\b/i },
    { name: 'Quadratic patterns', match: /\b(quadratic (pattern|sequence)|second difference|an² ?\+ ?bn)\b/i },
    { name: 'Linear (arithmetic) patterns', match: /\b(pattern|sequence|tₙ|nth term|first difference\w*)\b/i },
  ],

  'math-calculus': [
    { name: 'Rates of change', match: /\b(rate of change|velocit\w*|accelerat\w*|how fast|per second|s\(t\))\b/i },
    { name: 'Optimisation', match: /\b(optimis\w*|minimis\w*|maximis\w*|maximum (volume|area|profit)|minimum (cost|surface area)|largest possible|least amount)\b/i },
    { name: 'Limits and differentiation from first principles', match: /\b(first principles|limit|lim|h ?→ ?0)\b/i },
    { name: 'Sketching cubic graphs', match: /\b(cubic|sketch the graph|point of inflection|x[- ]intercepts of f)\b/i },
    { name: 'Stationary points and concavity', match: /\b(stationary|turning point|concav|increasing|decreasing|f″|second derivative)\b/i },
    { name: 'Gradients and equations of tangents', match: /\b(tangent|gradient of the (curve|tangent)|equation of the tangent)\b/i },
    { name: 'Rules of differentiation', match: /\b(differentiat|derivative|dy\/dx|f′|d_?x)\b/i },
  ],

  'math-counting-probability': [
    { name: 'Arrangements with restrictions', match: /\b(restriction|must( not)? (be|sit|stand) (together|next to)|(next to|beside) each other|cannot be (next|adjacent)|begins with|ends with|code|password|number plate)\b/i },
    { name: 'The fundamental counting principle', match: /\b(counting principle|how many (different )?(ways|arrangements)|arrange|factorial|n!)\b/i },
    { name: 'Tree diagrams and two-way tables', match: /\b(tree diagram|two[- ]way table|with(out)? replacement|first .* then)\b/i },
    { name: 'Independent events and the product rule', match: /\b(independent|product rule|p\(a\) ?× ?p\(b\))\b/i },
    { name: 'The addition rule', match: /\b(addition rule|p\(a (or|∪) b\)|either .* or)\b/i },
    { name: 'Mutually exclusive and complementary events', match: /\b(mutually exclusive|complement\w*|exhaustive)\b/i },
    { name: 'Venn diagrams', match: /\b(venn|∪|∩|intersection|union|neither)\b/i },
    { name: 'Basic probability', match: /\b(probabilit\w*|chance|likelihood)\b/i },
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

/**
 * The hand-written rules for a topic, in priority order.
 *
 * Exported so a check can verify that no rule is completely shadowed by an
 * earlier one -- a rule that never wins a question is invisible in the app but
 * looks perfectly reasonable in this file, which is exactly how a sub-topic
 * ends up permanently empty without anyone noticing.
 */
export const subtopicRulesFor = (topicId: string): SubtopicRule[] => rules[topicId] ?? []

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
