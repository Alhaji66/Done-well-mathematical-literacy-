export type Grade = 10 | 11 | 12

export type Difficulty = 'Easy' | 'Moderate' | 'Challenge'

export interface Subject {
  id: string
  name: string
  grades: Grade[]
}

export interface Topic {
  id: string
  subjectId: string
  name: string
  description: string
  grades: Grade[]
  /**
   * The examination paper this topic is written in, where a subject splits its
   * content across two papers that are examined separately.
   *
   * Physical Sciences is the only subject here that does: Paper 1 is Physics and
   * Paper 2 is Chemistry, and a learner revising for one sits an exam that
   * contains none of the other. A flat list of 13 topics hides that entirely.
   *
   * Derived from the papers rather than typed by hand -- every Physical Sciences
   * topic appears in exactly one paper at every grade, with none ambiguous and
   * none unmapped, so the split is a fact about the corpus rather than a
   * judgement call. Subjects examined as one body of content leave this unset.
   */
  strand?: string
}

export type ResourceType = 'Learner Book' | 'Workbook' | 'Teacher Guide' | 'Test' | 'Memo'

export interface Resource {
  id: string
  title: string
  type: ResourceType
  grade: Grade
  subjectId: string
  topicId?: string
  pages?: number
  updated: string
  description: string
}

export interface QuestionOption {
  id: string
  label: string
}

/**
 * The CAPS cognitive level an exam question sits at. Each subject names its
 * four levels differently -- see capsWeighting.ts -- but the shape is common:
 * 1 is recall, 2 is understanding a familiar idea, 3 is applying it to
 * something new or working with data, 4 is judging, evaluating or arguing.
 *
 * This is SEPARATE from `difficulty` on purpose. Difficulty is what a learner
 * filters by and reads as "how hard will this feel"; cognitive level is what
 * CAPS weights an exam paper by. They usually agree, and where they do not
 * it is the cognitive level that decides whether a paper meets its target.
 */
export type CognitiveLevel = 1 | 2 | 3 | 4

export interface Question {
  id: string
  topicId: string
  grade: Grade
  difficulty: Difficulty
  /**
   * Optional so the field can be backfilled a subject at a time rather than
   * in one unreviewable sweep. Where it is absent the coverage report says
   * "not yet levelled" instead of guessing -- an absent level is honest, an
   * inferred one is not.
   */
  cognitiveLevel?: CognitiveLevel
  marks: number
  prompt: string
  context?: string
  options?: QuestionOption[]
  correctOptionId?: string
  answer: string
  explanation: string
  /**
   * The NSC-style marking memo: where each mark in this question is actually
   * earned. Optional, because writing one by hand for all 5 502 paper items is
   * not something that could be finished or kept current, and a GUESSED memo
   * is worse than none -- a learner will trust it and mis-mark their own work.
   * Where it is absent the card simply does not show a memo.
   */
  memo?: MemoStep[]
  /**
   * An inline SVG figure to show with the question, by id.
   *
   * For a picture that exists exactly once -- the CAST diagram, a free-body
   * diagram of a block on an incline. A curve given by an equation is not one
   * of these: use `graph` for those, which plots from the coefficients.
   */
  figure?: FigureId
  /**
   * A figure shown only once the answer is revealed.
   *
   * Separate from `figure` because placement is the whole point for a question
   * that asks the learner to DRAW something. "Draw a labelled free-body diagram
   * of the forces on the block" is the commonest opening in an NSC Paper 1, and
   * rendering the finished diagram beside the prompt would answer it for them.
   * They draw it on paper, then check it against this.
   */
  answerFigure?: FigureId
  /**
   * A plotted graph, described by its equations rather than drawn by hand.
   *
   * SEPARATE FROM `figure` because the two are authored completely differently.
   * A `figure` is one fixed picture with an id -- there is exactly one CAST
   * diagram, and it never varies. A graph is a different picture every time:
   * `y = x² − 9` and `y = x² − 16` are the same drawing with different numbers,
   * and there are hundreds of them. Giving every parabola in the corpus its own
   * FigureId would mean hand-drawing each one, which is why the corpus had no
   * graphs in it at all.
   */
  graph?: GraphSpec
  /**
   * A graph shown only once the answer is revealed, for the same reason as
   * `answerFigure`: "Sketch the graph of f" is answered for the learner if the
   * finished sketch sits above the prompt.
   */
  answerGraph?: GraphSpec
}

/** Figures live in src/components/practise/Figure.tsx. */
export type FigureId =
  | 'cast-diagram'
  | 'surd-number-line'
  | 'charges-on-a-line'
  | 'fbd-incline'
  | 'fbd-lift'
  | 'fbd-connected'
  | 'circuit-meters'
  | 'titration-curve'
  // Life Sciences structures, in LifeSciFigures.tsx.
  | 'nephron'
  | 'heart'
  | 'alveolus'
  | 'leaf-section'
  | 'eye'
  | 'ear'
  | 'reflex-arc'
  | 'dna-structure'
  | 'energy-pyramid'
  | 'plant-transport'
  | 'flower-structure'

/**
 * A curve on a set of axes, given by its family and coefficients.
 *
 * The coefficients are named the way CAPS names them, so that a question and
 * its graph cannot drift apart: a hyperbola is `a/(x − p) + q` in every Grade
 * 11 textbook in the country, so `{ kind: 'hyperbola', a, p, q }` is what an
 * author already has in front of them.
 */
export type GraphCurve =
  /** y = mx + c */
  | { kind: 'line'; m: number; c: number; label?: string; dashed?: boolean }
  /** y = ax² + bx + c */
  | { kind: 'parabola'; a: number; b: number; c: number; label?: string; dashed?: boolean }
  /** y = a/(x − p) + q -- vertical asymptote x = p, horizontal y = q */
  | { kind: 'hyperbola'; a: number; p: number; q: number; label?: string; dashed?: boolean }
  /** y = a·bˣ⁻ᵖ + q -- horizontal asymptote y = q */
  | { kind: 'exponential'; a: number; b: number; p?: number; q?: number; label?: string; dashed?: boolean }
  /** y = ax³ + bx² + cx + d */
  | { kind: 'cubic'; a: number; b: number; c: number; d: number; label?: string; dashed?: boolean }
  /** y = a·sin(k(x + p)) + q, with x in DEGREES. Same shape for cos and tan. */
  | {
      kind: 'sin' | 'cos' | 'tan'
      a?: number
      k?: number
      p?: number
      q?: number
      label?: string
      dashed?: boolean
    }

/** A point marked on the axes, e.g. a turning point or an intercept. */
export interface GraphPoint {
  x: number
  y: number
  label?: string
  /** Drop dashed lines to both axes, the way a paper shows a read-off. */
  guides?: boolean
}

/**
 * A graph to plot above a question.
 *
 * `title` is required and does double duty: it captions the figure and names
 * it for a screen reader. The longer spoken description is generated from the
 * curves and points, so a learner who cannot see the graph is told what is on
 * it rather than merely that a graph exists.
 */
export interface GraphSpec {
  title: string
  /** Visible x range. In degrees when any curve is sin, cos or tan. */
  xRange: [number, number]
  yRange: [number, number]
  curves: GraphCurve[]
  points?: GraphPoint[]
  /** Dashed asymptote lines. A hyperbola's own two are drawn automatically. */
  asymptotes?: { x?: number; y?: number; label?: string }[]
  /** Shade under/over curve `curveIndex` between two x values. */
  shade?: { from: number; to: number; curveIndex?: number; label?: string }
  /** Axis names, when they are not the bare x and y -- Mat Lit graphs. */
  xLabel?: string
  yLabel?: string
  /** Step between numbered ticks. Defaults to something sensible for the range. */
  xStep?: number
  yStep?: number
}

/**
 * A mark code as used in the official NSC marking guidelines.
 *
 * These are the codes a marker writes in the margin, and knowing them changes
 * how a learner writes an answer -- most obviously CA, which is why showing
 * your working is worth real marks: an early arithmetic slip costs one A mark
 * rather than the whole question, but only if the method after it is visible.
 */
export type MemoCode = 'M' | 'A' | 'CA' | 'S' | 'SF' | 'R' | 'RT' | 'C' | 'J'

export const MEMO_CODE_MEANINGS: Record<MemoCode, string> = {
  M: 'Method — for choosing and setting out a correct method, even if the number that comes out is wrong',
  A: 'Accuracy — for the correct value or statement',
  CA: 'Continued accuracy — for correctly carrying forward an earlier answer, even one that was wrong',
  S: 'Substitution — for putting the right values into the right places',
  SF: 'Substitution into a formula — for both quoting the formula and substituting correctly',
  R: 'Reason — for the justification, not the answer it supports',
  RT: 'Reading from a table, graph or diagram',
  C: 'Conversion — for converting to the correct unit',
  J: 'Justification — for the argument that settles the question',
}

export interface MemoStep {
  code: MemoCode
  /** Marks this step earns. The steps must add up to the question's marks. */
  marks: number
  /** What has to be on the page to earn them. */
  text: string
}

export type AssessmentStatus = 'upcoming' | 'completed' | 'missed' | 'in_progress'

export interface Assessment {
  id: string
  title: string
  grade: Grade
  subjectId: string
  topicIds: string[]
  type: 'Weekly Test' | 'Revision Test' | 'Formal Test'
  totalMarks: number
  durationMinutes: number
  date: string
  status: AssessmentStatus
  scorePercent?: number
}

export interface TopicProgress {
  topicId: string
  masteryPercent: number
  questionsAttempted: number
  trend: 'up' | 'down' | 'steady'
}

export interface WeeklyActivityPoint {
  label: string
  minutes: number
}

export interface LearnerProfile {
  id: string
  name: string
  grade: Grade
  subjectId: string
  avatarInitials: string
  weeklyActivity: WeeklyActivityPoint[]
  topicProgress: TopicProgress[]
  recentScores: { assessmentId: string; label: string; percent: number; date: string }[]
  overallMasteryPercent: number
  streakDays: number
}
