/**
 * How many questions of each EXAMINER question type every topic holds, per
 * grade. A topic can have hundreds of questions and still never ask the
 * kind examiners set most often -- Data Handling had 48 "calculate the mean"
 * questions in Grade 10 and not one "find the missing value". This report
 * names those gaps so they can be filled. It reports; it does not fail.
 *
 * Mathematical Literacy and Mathematics list the types per topic. The
 * sciences use the same five kinds of question in every topic (define or
 * state a law, calculate, explain or apply, interpret a graph or data,
 * investigation skills), plus topic-specific calculations where they matter.
 *
 *   npm run report:question-types               -- every gap
 *   npm run report:question-types -- mat-lit    -- one subject
 */
import { questionsForSubject } from '../src/data/questionBank.ts'
import { topics } from '../src/data/topics.ts'

type Types = Record<string, RegExp>
const ML: Record<string, Types> = {
  finance: {
    'budget / income and expenditure': /budget|expenditure|surplus|shortfall/i,
    'payslip: gross, deductions, net': /payslip|gross|net (salary|pay|income)|deduction/i,
    'VAT inclusive / exclusive': /\bVAT\b/i,
    'simple interest': /simple interest/i,
    'compound interest': /compound/i,
    'inflation': /inflation/i,
    'exchange rates': /exchange rate|dollar|euro|pound|yen|\$|€|£/i,
    'tariffs: fixed + variable cost': /tariff|fixed (charge|cost)|per (kWh|kilolitre|kℓ|unit|minute)/i,
    'profit, loss, break-even': /break[- ]even|profit|loss/i,
    'income tax and rebates (Gr 12)': /income tax|rebate|taxable income|tax table/i,
    'percentage increase / decrease': /percentage (increase|decrease|change)|increase(d)? by \d|decrease(d)? by \d/i,
    'loans, hire purchase, total cost of credit': /loan|hire purchase|instalment|deposit|credit/i,
    'bank statements and fees': /bank (statement|fee|charge)|transaction fee|balance/i,
  },
  measurement: {
    'unit conversions': /convert|in (mm|cm|m|km|mℓ|ℓ|g|kg|litres?)\b/i,
    'time, elapsed time, time zones': /\btime\b|duration|time zone|arrive|depart/i,
    'perimeter': /perimeter|fenc|border|edging/i,
    'area': /\barea\b/i,
    'volume / capacity': /volume|capacity/i,
    'surface area (Gr 11+)': /surface area/i,
    'scaling a recipe / mass': /recipe|ingredient|mass/i,
    'temperature °C/°F (Gr 11+)': /°F|fahrenheit|celsius/i,
    'speed, distance, rate': /speed|km\/h|rate|per hour/i,
    'how many items needed (rounding up)': /how many (whole|tiles|boxes|bags|tins|cans|litres)|round(ed)? up/i,
    'BMI / health measures': /\bBMI\b|body mass/i,
  },
  'maps-plans': {
    'number scale: map to real distance': /scale.*(real|actual)|(real|actual).*distance|1 ?: ?\d/i,
    'bar scale': /bar scale/i,
    'grid references': /grid reference|grid block/i,
    'compass direction': /direction|north|south|east|west/i,
    'floor plans / elevation': /floor plan|elevation|plan (view|of)/i,
    'scale models': /model/i,
    'routes and travel time': /route|travel|journey/i,
  },
  'data-handling': {
    'mean': /\bmean\b|\baverage\b/i,
    'median': /\bmedian\b/i,
    'mode': /\bmod(e|al)\b/i,
    'range': /\brange\b/i,
    'missing value from a measure': /\bx\b.*\b(mean|median|mode|range|quartile)|must (score|get)|determine the (mark|value|sixth|fifth)|value of x/i,
    'frequency table': /frequency|number of (households|learners)\s*\|/i,
    'stem-and-leaf': /stem[- ]and[- ]leaf/i,
    'grouped data / modal class': /modal class|class interval|– ?< ?\d/i,
    'quartiles, IQR, box-and-whisker (Gr 12)': /quartile|IQR|box[- ]and[- ]whisker|five-number/i,
    'percentiles (Gr 12)': /percentile/i,
    'best measure / outlier': /outlier|which measure|best (describes|represents)|typical/i,
    'combined or weighted mean': /combined|weighted|term mark/i,
    'misleading graphs': /mislead/i,
    'compare two data sets': /consistent|compare|which (school|class|team|group)/i,
    'probability': /probabilit/i,
    'drawing / reading graphs': /bar graph|pie chart|histogram|line graph|draw/i,
  },
}
const MATH: Record<string, Types> = {
  'math-number-systems': { 'rational / irrational': /rational|irrational/i, 'surds estimation': /surd|√|between which two/i, 'recurring decimal to fraction': /recurring|0,\d+\.\.\.|common fraction/i, 'rounding / significant figures': /round|decimal places?/i },
  'math-algebra': { 'factorising': /factoris/i, 'simplify algebraic fractions': /simplify/i, 'exponent laws': /\^|exponent|²|³|⁻/i, 'linear equation': /solve for x/i, 'quadratic by formula (Gr 11+)': /quadratic formula/i, 'simultaneous equations': /simultaneous|and y/i, 'inequalities': /inequalit|≤|≥|<|>/i, 'nature of roots (Gr 11+)': /nature of the roots|discriminant|Δ/i, 'word problems': /consecutive|tickets|age|travel|speed|price/i, 'surd equations': /√.*=|equation.*√/i },
  'math-functions': { 'straight line': /straight line|y = [-−]?\d*x [+−-]/i, 'parabola: turning point, intercepts': /turning point|parabola|axis of symmetry/i, 'hyperbola: asymptotes': /asymptote|hyperbola/i, 'exponential': /exponential|\d\s*·?\s*[a-z]?\s*\d?ˣ|\^x|ˣ/i, 'domain and range': /domain|range/i, 'transformations': /translat|reflect|shift|moved/i, 'read inequalities from graphs': /for which values of x/i, 'inverse functions (Gr 12)': /inverse|f⁻¹|f\^-1/i },
  'math-trigonometry': { 'ratios in right triangles': /sin|cos|tan/i, 'special angles, no calculator': /without (using )?a calculator|special angle/i, 'reduction formulae / CAST (Gr 11+)': /reduction|(180|360)° ?[−+-]|CAST/i, 'identities (Gr 11+)': /identity|prove that/i, 'equations: general solution (Gr 11+)': /general solution/i, 'sine, cosine, area rules (Gr 11+)': /sine rule|cosine rule|area rule|area of (triangle|△)/i, 'compound and double angles (Gr 12)': /compound|double angle|sin ?2|cos ?2/i, 'trig graphs': /period|amplitude|graph of/i, '2D / 3D problems (Gr 12)': /angle of elevation|depression|height of|3D|vertical (pole|tower)/i },
  'math-analytical-geometry': { 'distance': /distance|length of/i, 'midpoint': /midpoint/i, 'gradient': /gradient/i, 'equation of a line': /equation of/i, 'parallel / perpendicular': /parallel|perpendicular/i, 'collinear': /collinear/i, 'inclination (Gr 11+)': /inclination/i, 'circle equation (Gr 12)': /circle|centre|radius/i, 'tangent to a circle (Gr 12)': /tangent/i },
  'math-statistics': { 'mean / median / mode': /mean|median|mode/i, 'five-number summary, box-and-whisker': /five-number|box[- ]and[- ]whisker|quartile/i, 'grouped data: estimated mean, modal class': /grouped|estimated mean|modal class|class interval/i, 'ogive / cumulative frequency (Gr 11+)': /ogive|cumulative/i, 'variance / standard deviation (Gr 11+)': /standard deviation|variance/i, 'outliers': /outlier/i, 'scatter plot, regression, correlation (Gr 12)': /regression|correlation|scatter|line of best fit/i },
  'math-finance-growth': { 'simple and compound interest': /simple|compound/i, 'hire purchase': /hire purchase/i, 'inflation / population growth': /inflation|population/i, 'depreciation (Gr 11+)': /depreciat|book value|reducing balance|straight[- ]line/i, 'effective vs nominal (Gr 11+)': /effective|nominal/i, 'timelines, changing rates': /changes to|timeline|after \d+ years the (rate|interest)/i, 'annuities: future value (Gr 12)': /future value|sinking fund|monthly payments? into/i, 'annuities: present value, loans (Gr 12)': /present value|loan|bond|instalment|outstanding balance/i, 'find n using logs (Gr 12)': /how many (years|months|payments)|log/i },
  'math-number-patterns': { 'linear general term': /general term|Tₙ|T_n|nth term/i, 'which term equals': /which term/i, 'quadratic pattern (Gr 11+)': /second difference|quadratic/i, 'arithmetic series (Gr 12)': /arithmetic|Sₙ|sum of the first/i, 'geometric (Gr 12)': /geometric|common ratio/i, 'convergence / sum to infinity (Gr 12)': /converge|infinity|S∞/i, 'sigma notation (Gr 12)': /Σ|sigma/i },
  'math-calculus': { 'limits / first principles': /first principles|limit/i, 'differentiation rules': /differentiate|dy\/dx|f′|derivative/i, 'equation of a tangent': /tangent/i, 'cubic graph sketch': /sketch|cubic|intercepts/i, 'stationary points / turning points': /stationary|turning point/i, 'concavity / inflection': /concav|inflection/i, 'optimisation': /maximum|minimum|optimi|largest|smallest/i, 'rates of change': /rate of change|velocity|acceleration/i },
  'math-counting-probability': { 'Venn diagrams': /venn/i, 'mutually exclusive / complementary': /mutually exclusive|complement|not /i, 'independent events (Gr 11+)': /independent/i, 'tree diagrams (Gr 11+)': /tree diagram|without replacement|with replacement/i, 'contingency tables (Gr 11+)': /contingency|two-way table/i, 'counting principle / arrangements (Gr 12)': /arrange|how many (different )?(ways|codes|numbers|passwords)|factorial|!/i, 'probability with counting (Gr 12)': /probability that.*(arrange|code|letters|together|next to)/i },
  'math-euclidean-geometry': { 'triangle and quadrilateral properties (Gr 10)': /parallelogram|rhombus|kite|trapezium|rectangle|congruen/i, 'midpoint theorem (Gr 10)': /midpoint theorem|midpoints of/i, 'circle: centre, chord, angle at centre (Gr 11+)': /centre|chord|perpendicular from/i, 'circle: angles in same segment, cyclic quads (Gr 11+)': /cyclic|same segment|subtended/i, 'tangent-chord (Gr 11+)': /tangent/i, 'proportionality theorem (Gr 12)': /proportion|∥/i, 'similar triangles (Gr 12)': /similar|\|\|\|/i, 'proofs with reasons': /prove|show that/i },
}
const SCIENCE: Types = {
  'define / state a law': /^(define|state|what is meant|give the (term|definition|name)|name the)/i,
  'calculate': /calculate|determine the (value|magnitude|speed|mass|number|concentration|energy|force|time)/i,
  'explain / apply': /^(explain|why|describe|discuss|suggest|predict)/i,
  'graph or data interpretation': /graph|table|data|results|trend/i,
  'investigation skills': /variable|hypothesis|investigat|controlled|conclusion|precaution|experiment/i,
  'diagram: identify or label': /label|identify (part|structure|the)|diagram/i,
  'compare / distinguish': /compare|distinguish|differen(ce|t) between|tabulate/i,
}

const only = process.argv[2]
const SUBJ = ['mat-lit', 'mathematics', 'physical-sciences', 'life-sciences'].filter((s) => !only || s === only)
const out: string[] = []
let gaps = 0
for (const sub of SUBJ) {
  const pool = await questionsForSubject(sub)
  out.push(`\n## ${sub}`)
  for (const t of topics.filter((x) => x.subjectId === sub)) {
    const catalog = sub === 'mat-lit' ? ML[t.id] : sub === 'mathematics' ? MATH[t.id] : SCIENCE
    if (!catalog) continue
    const lines: string[] = []
    for (const g of t.grades) {
      const qs = pool.filter((q) => q.topicId === t.id && q.grade === g)
      const thin = Object.entries(catalog)
        .filter(([name]) => {
          const gm = name.match(/\(Gr (\d+)(\+)?\)/)
          return !gm || (gm[2] ? g >= +gm[1] : g === +gm[1])
        })
        .map(([name, re]) => [name, qs.filter((q) => re.test(`${q.prompt} ${q.ownContext ?? q.context ?? ''}`)).length] as const)
        .filter(([, c]) => c < 3)
      gaps += thin.length
      if (thin.length) lines.push(`  Gr ${g} (${qs.length} questions): ${thin.map(([n, c]) => `${n} [${c}]`).join('; ')}`)
    }
    if (lines.length) out.push(`- ${t.name}\n${lines.join('\n')}`)
  }
}
console.log(out.join('\n'))
console.log(`\n${gaps} topic/grade/type combination(s) with fewer than 3 questions.`)
