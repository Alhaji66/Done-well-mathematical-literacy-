import type { GraphCurve, GraphSpec } from '@/types'

/**
 * Read a curve out of the words of a question, and check that it is right.
 *
 * WHY DERIVE RATHER THAN AUTHOR. Roughly 330 Mathematics questions name a
 * graph by its equation -- "the graph of f(x) = x² − 9", "f(x) = −x² + 6x − 5"
 * -- and every one of them deserves a picture. Writing 330 graph specs by hand
 * would mean 330 chances to mistype a coefficient, and a graph that disagrees
 * with the equation printed above it is worse than no graph at all: the
 * learner trusts the picture and gets the question wrong.
 *
 * Deriving the curve from the question's own text removes that failure mode by
 * construction. The equation is stated once, in the prompt, and the picture is
 * a consequence of it.
 *
 * HOW IT IS CHECKED. Parsing is not trusted on its own. Every curve this
 * module produces is verified by evaluating BOTH the parsed curve and the
 * original text -- through a completely separate little expression evaluator
 * that knows nothing about parabolas or hyperbolas -- at a spread of x values
 * and requiring them to agree. Two independent routes to the same numbers is
 * the only evidence worth having here; a parser that merely looks right is
 * how a wrong graph ships. Anything that fails, or that the patterns do not
 * recognise, simply gets no graph.
 */

/* ------------------------------------------------------------------ */
/* An independent evaluator, used ONLY to check the parser             */
/* ------------------------------------------------------------------ */

/**
 * Rewrite the corpus's typography as ordinary algebra.
 *
 * The corpus is written in Unicode the way a paper prints it: a true minus
 * sign, ÷ for division, superscript digits for powers. None of that is
 * arithmetic a parser can read, so it is translated once, here, and both the
 * pattern matcher and the checking evaluator work on the result.
 */
export function normalise(rhs: string): string {
  return rhs
    .replace(/−/g, '-')
    .replace(/÷/g, '/')
    .replace(/·|×/g, '*')
    .replace(/½/g, '0.5')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/ˣ/g, '^x')
    .replace(/,(\d)/g, '.$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Evaluate normalised algebra at a value of x.
 *
 * Recursive descent, deliberately tiny, and deliberately knowing nothing
 * about the curve families: it is the second opinion. Returns null on
 * anything it cannot read, which the caller treats as "do not attach a graph"
 * rather than guessing.
 */
export function evalExpr(src: string, x: number): number | null {
  let i = 0
  const s = src.replace(/\s/g, '')

  const peek = () => s[i]
  /** Implicit multiplication: 2x, 3(x-1), x(x+2) all mean a product. */
  const implicitBefore = () => /[\d.x)]/.test(s[i - 1] ?? '') && /[x(]/.test(s[i] ?? '')

  function expr(): number | null {
    let left = term()
    if (left === null) return null
    while (peek() === '+' || peek() === '-') {
      const op = s[i++]
      const right = term()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  function term(): number | null {
    let left = unary()
    if (left === null) return null
    for (;;) {
      if (peek() === '*' || peek() === '/') {
        const op = s[i++]
        const right = unary()
        if (right === null) return null
        if (op === '/' && right === 0) return null
        left = op === '*' ? left * right : left / right
      } else if (implicitBefore()) {
        const right = unary()
        if (right === null) return null
        left *= right
      } else return left
    }
  }

  /**
   * Unary minus binds LOOSER than the exponent: −x² is −(x²), not (−x)².
   *
   * Getting this the other way round is the classic expression-parser bug, and
   * it is silent -- both readings agree at x = 0 and at every x where x² and
   * −x² happen to be compared loosely. Here it made −x² + 6x − 5 evaluate to
   * 22 at x = 3 instead of 4, and the only reason no wrong graph shipped is
   * that the parsed parabola disagreed with it and the curve was dropped.
   */
  function unary(): number | null {
    if (peek() === '-') {
      i += 1
      const v = unary()
      return v === null ? null : -v
    }
    if (peek() === '+') {
      i += 1
      return unary()
    }
    return power()
  }

  function power(): number | null {
    const base = atom()
    if (base === null) return null
    if (peek() === '^') {
      i += 1
      // The exponent may itself be signed (2^-3) and is right-associative.
      const exp = unary()
      if (exp === null) return null
      return base ** exp
    }
    return base
  }

  function atom(): number | null {
    if (peek() === '(') {
      i += 1
      const v = expr()
      if (v === null || s[i] !== ')') return null
      i += 1
      return v
    }
    if (peek() === 'x') {
      i += 1
      return x
    }
    const m = /^\d+(?:\.\d+)?/.exec(s.slice(i))
    if (!m) return null
    i += m[0].length
    return Number(m[0])
  }

  const value = expr()
  // Trailing text means the string was not entirely an expression, which is
  // exactly the case where a guess would be wrong.
  return i === s.length && value !== null && Number.isFinite(value) ? value : null
}

/* ------------------------------------------------------------------ */
/* Recognising a curve family                                          */
/* ------------------------------------------------------------------ */

const N = String.raw`-?\d+(?:\.\d+)?`
const n = (s: string | undefined, fallback = 0) => (s === undefined || s === '' ? fallback : Number(s))
/** "+ 3" / "- 3" as written in the corpus, reduced to a signed number. */
const signed = (sign: string | undefined, value: string | undefined, fallback = 0) =>
  value === undefined ? fallback : (sign === '-' ? -1 : 1) * Number(value)

interface Pattern {
  re: RegExp
  build: (m: RegExpMatchArray) => GraphCurve
}

/**
 * Ordered patterns, most specific first.
 *
 * Turning-point form is tried before standard form because `(x - 3)^2 - 4`
 * would otherwise be read as a standard-form parabola with a stray bracket,
 * and completed-square form is what a Grade 11 question means when it writes
 * one -- the vertex is the answer it is asking for.
 */
const PATTERNS: Pattern[] = [
  // a(x - p)^2 + q  -- completed square
  {
    re: new RegExp(`^(-)?(${N})?\\((x)\\s*([+-])\\s*(${N})\\)\\^2\\s*(?:([+-])\\s*(${N}))?$`),
    build: (m) => {
      const a = (m[1] === '-' ? -1 : 1) * n(m[2], 1)
      const p = (m[4] === '-' ? 1 : -1) * Number(m[5]) // (x - p) means vertex at +p
      const q = signed(m[6], m[7])
      // Expanded to standard form, which is what the plotter draws.
      return { kind: 'parabola', a, b: -2 * a * p, c: a * p * p + q }
    },
  },
  // a x^2 + b x + c  -- standard form, with optional b and c
  {
    re: new RegExp(`^(-)?(${N})?x\\^2\\s*(?:([+-])\\s*(${N})?x)?\\s*(?:([+-])\\s*(${N}))?$`),
    build: (m) => ({
      kind: 'parabola',
      a: (m[1] === '-' ? -1 : 1) * n(m[2], 1),
      b: m[3] === undefined ? 0 : (m[3] === '-' ? -1 : 1) * n(m[4], 1),
      c: signed(m[5], m[6]),
    }),
  },
  // a x^3 + b x^2 + c x + d
  {
    re: new RegExp(
      `^(-)?(${N})?x\\^3\\s*(?:([+-])\\s*(${N})?x\\^2)?\\s*(?:([+-])\\s*(${N})?x)?\\s*(?:([+-])\\s*(${N}))?$`,
    ),
    build: (m) => ({
      kind: 'cubic',
      a: (m[1] === '-' ? -1 : 1) * n(m[2], 1),
      b: m[3] === undefined ? 0 : (m[3] === '-' ? -1 : 1) * n(m[4], 1),
      c: m[5] === undefined ? 0 : (m[5] === '-' ? -1 : 1) * n(m[6], 1),
      d: signed(m[7], m[8]),
    }),
  },
  // a/(x - p) + q
  {
    re: new RegExp(`^(-)?(${N})\\s*/\\s*\\(x\\s*([+-])\\s*(${N})\\)\\s*(?:([+-])\\s*(${N}))?$`),
    build: (m) => ({
      kind: 'hyperbola',
      a: (m[1] === '-' ? -1 : 1) * Number(m[2]),
      p: (m[3] === '-' ? 1 : -1) * Number(m[4]),
      q: signed(m[5], m[6]),
    }),
  },
  // a/x + q
  {
    re: new RegExp(`^(-)?(${N})\\s*/\\s*x\\s*(?:([+-])\\s*(${N}))?$`),
    build: (m) => ({
      kind: 'hyperbola',
      a: (m[1] === '-' ? -1 : 1) * Number(m[2]),
      p: 0,
      q: signed(m[3], m[4]),
    }),
  },
  // a * b^x + q, and plain b^x + q
  {
    re: new RegExp(`^(?:(${N})\\s*\\*\\s*)?(${N})\\^x\\s*(?:([+-])\\s*(${N}))?$`),
    build: (m) => ({
      kind: 'exponential',
      a: n(m[1], 1),
      b: Number(m[2]),
      q: signed(m[3], m[4]),
    }),
  },
  // m x + c
  {
    re: new RegExp(`^(-)?(${N})?x\\s*(?:([+-])\\s*(${N}))?$`),
    build: (m) => ({
      kind: 'line',
      m: (m[1] === '-' ? -1 : 1) * n(m[2], 1),
      c: signed(m[3], m[4]),
    }),
  },
]

/**
 * The curve a right-hand side describes, or null.
 *
 * Null for anything unrecognised OR anything whose parse disagrees with the
 * text it came from. Both are "no graph", because a missing graph costs a
 * learner a picture and a wrong one costs them the answer.
 */
export function curveFrom(rhs: string): GraphCurve | null {
  const src = normalise(rhs)
  // An unknown coefficient means the question is ASKING for it; there is no
  // curve to draw until the learner has found it.
  if (/[a-wyz]/.test(src.replace(/x/g, ''))) return null

  for (const { re, build } of PATTERNS) {
    const m = re.exec(src.replace(/\s/g, ''))
    if (!m) continue
    let curve: GraphCurve
    try {
      curve = build(m)
    } catch {
      return null
    }
    return agrees(curve, src) ? curve : null
  }
  return null
}

/** The parsed curve and the raw text must give the same y at every test x. */
function agrees(curve: GraphCurve, src: string): boolean {
  // Awkward values on purpose: integers alone would let a wrong coefficient
  // on an x term hide behind a coincidence at x = 0 and x = 1.
  const samples = [-3.7, -2, -0.5, 0, 0.5, 1, 2.3, 4, 6.1, 9]
  let compared = 0
  for (const x of samples) {
    const a = evaluateCurve(curve, x)
    const b = evalExpr(src, x)
    if (a === null || b === null) continue
    if (Math.abs(a - b) > 1e-6 * Math.max(1, Math.abs(b))) return false
    compared += 1
  }
  // Agreeing at one or two points is not agreement.
  return compared >= 5
}

/** Local copy of the plotter's evaluator, so this module has no UI import. */
function evaluateCurve(curve: GraphCurve, x: number): number | null {
  switch (curve.kind) {
    case 'line':
      return curve.m * x + curve.c
    case 'parabola':
      return curve.a * x * x + curve.b * x + curve.c
    case 'cubic':
      return curve.a * x ** 3 + curve.b * x * x + curve.c * x + curve.d
    case 'hyperbola':
      return x === curve.p ? null : curve.a / (x - curve.p) + curve.q
    case 'exponential':
      return curve.a * curve.b ** (x - (curve.p ?? 0)) + (curve.q ?? 0)
    default:
      return null
  }
}

/* ------------------------------------------------------------------ */
/* Choosing the window                                                 */
/* ------------------------------------------------------------------ */

/** Round a range outwards to whole numbers a learner would draw axes at. */
const roundOut = (lo: number, hi: number): [number, number] => {
  const pad = (hi - lo) * 0.12
  return [Math.floor(lo - pad), Math.ceil(hi + pad)]
}

/**
 * Axes that actually show what the question is about.
 *
 * A fixed −10..10 window is the obvious thing and the wrong one: it puts the
 * vertex of y = −x² + 14x − 40 off the top of the picture, so the learner is
 * shown a parabola with no turning point in a question about its turning
 * point. The window is therefore built from the features the curve has --
 * roots, vertex, intercepts, asymptotes -- so that all of them are on screen.
 */
export function windowFor(curve: GraphCurve): { xRange: [number, number]; yRange: [number, number] } {
  const xs: number[] = []

  if (curve.kind === 'parabola') {
    const vx = -curve.b / (2 * curve.a)
    const disc = curve.b * curve.b - 4 * curve.a * curve.c
    xs.push(vx)
    if (disc >= 0) {
      const r = Math.sqrt(disc) / (2 * Math.abs(curve.a))
      xs.push(vx - r - 1, vx + r + 1)
    } else {
      xs.push(vx - 3, vx + 3)
    }
    // The y-intercept is worth showing, but not at any price: y = (x + 7)² − 2
    // has its vertex at x = −7, and dragging the window out to x = 0 to catch
    // an intercept at 47 makes the turning point a dimple on the axis. It is
    // included only when it is already near the part that matters.
    if (Math.abs(vx) < 2 * (Math.max(...xs) - Math.min(...xs))) xs.push(0)
  } else if (curve.kind === 'hyperbola') {
    xs.push(curve.p - 5, curve.p + 5, 0)
  } else if (curve.kind === 'exponential') {
    // Far enough to show the curve climbing, close enough that the horizontal
    // asymptote is still a visible line and not the bottom edge. y = 6ˣ − 4
    // reaches 1 296 by x = 4, which flattens the asymptote at y = −4 into the
    // axis and hides the y-intercept the question is asking for.
    const a = Math.abs(curve.a) || 1
    const reach = Math.log(12 / a) / Math.log(Math.max(curve.b, 1.01))
    const hiX = (curve.p ?? 0) + Math.max(1, Math.min(6, reach))
    xs.push((curve.p ?? 0) - 3, hiX, 0)
  } else if (curve.kind === 'cubic') {
    xs.push(-4, 4, 0)
  } else {
    xs.push(-6, 6, 0)
  }

  let [x0, x1] = roundOut(Math.min(...xs), Math.max(...xs))
  if (x1 - x0 < 4) [x0, x1] = [x0 - 2, x1 + 2]

  /*
   * The y range is measured off the curve across the x range that was just
   * chosen, NOT from a handful of named features.
   *
   * Taking the vertex and the y-intercept was the obvious shortcut and it
   * produced a broken graph: for y = x² − 36 both of those are −36, so the
   * window came out −38 to −34 and the roots at (−6 ; 0) and (6 ; 0) -- the
   * entire subject of the question -- sat off the top of the picture. Whatever
   * the curve actually does between x0 and x1 is what has to fit.
   */
  const ys: number[] = []
  const STEPS = 240
  for (let i = 0; i <= STEPS; i += 1) {
    const x = x0 + ((x1 - x0) * i) / STEPS
    const y = evaluateCurve(curve, x)
    if (y !== null && Number.isFinite(y)) ys.push(y)
  }
  ys.sort((a, b) => a - b)

  // Percentiles rather than min and max, because a hyperbola and a tan run to
  // infinity beside their asymptotes: their extremes describe the asymptote,
  // not the curve, and using them would squash everything else onto one line.
  const at = (f: number) => ys[Math.min(ys.length - 1, Math.max(0, Math.round(f * (ys.length - 1))))]
  const unbounded = curve.kind === 'hyperbola' || curve.kind === 'exponential'
  let lo = unbounded ? at(0.08) : at(0)
  let hi = unbounded ? at(0.92) : at(1)

  // The x-axis is always on screen. Every one of these questions is about
  // intercepts, roots or where a curve sits relative to the axis, and none of
  // that can be read off a picture the axis is missing from.
  lo = Math.min(lo, 0)
  hi = Math.max(hi, 0)
  // A horizontal asymptote is a feature of the graph, so it stays visible too.
  if (curve.kind === 'hyperbola' || curve.kind === 'exponential') {
    const q = curve.q ?? 0
    lo = Math.min(lo, q - 1)
    hi = Math.max(hi, q + 1)
  }

  let [y0, y1] = roundOut(lo, hi)
  if (y1 - y0 < 4) [y0, y1] = [y0 - 2, y1 + 2]
  return { xRange: [x0, x1], yRange: [y0, y1] }
}

/* ------------------------------------------------------------------ */
/* Pulling equations out of a question                                 */
/* ------------------------------------------------------------------ */

/**
 * Every "f(x) = ..." or "y = ..." in a piece of text, with the name given.
 *
 * The lookahead is the whole difficulty. A question reads "the graph of
 * f(x) = x² − 9 lies below the x-axis", and the equation ends at "lies" --
 * not at a punctuation mark, because there is none. Stopping at the words
 * that can only begin a new clause is what separates the algebra from the
 * sentence around it.
 *
 * It lives here, and not in the tool that uses it, so that the generator and
 * the checker read the corpus the same way. They did not, once: the checker
 * used a looser pattern, so it captured "x² − 9 lies below the x-axis",
 * failed to parse it, and reported 31 correct graphs as disagreeing with
 * their own questions.
 */
export function equationsIn(text: string): { name: string; rhs: string }[] {
  const DEF =
    /\b([fghpqrst])\s*\(\s*x\s*\)\s*=\s*([^.,;?]+?)(?=[.,;?]|\s+(?:and|lies|passes|is|for|has|differs|are|cuts|intersects?|by|with)\b|$)|\by\s*=\s*([^.,;?]+?)(?=[.,;?]|\s+(?:and|lies|passes|is|for|has|are|cuts|intersects?|by|with)\b|$)/g
  const out: { name: string; rhs: string }[] = []
  for (const m of text.matchAll(DEF)) {
    out.push({ name: m[1] ?? 'y', rhs: (m[2] ?? m[3] ?? '').trim() })
  }
  return out
}

/** A whole spec for one named function, ready to render. */
export function specFor(rhs: string, name: string, title: string): GraphSpec | null {
  const curve = curveFrom(rhs)
  if (!curve) return null
  return { title, ...windowFor(curve), curves: [{ ...curve, label: name }] }
}
