import type { Grade } from '@/types'

/**
 * CAPS cognitive-level weightings for the NSC exam papers, per subject and grade.
 *
 * WHERE THESE COME FROM: each subject's CAPS document and its examination
 * guidelines publish the share of marks an exam paper must carry at each
 * cognitive level. They are targets for a PAPER, which is why the coverage
 * report measures them by mark rather than by question count -- a 2-mark
 * recall item and an 8-mark reasoning item are not worth the same to the
 * weighting even though each is one question.
 *
 * Checked against the published guidelines in September 2026:
 *
 *   Mat Lit            30 / 30 / 20 / 20   same for Grades 10-12
 *   Mathematics        25 / 45 / 20 / 10   Grades 10 and 11
 *                      20 / 35 / 30 / 15   Grade 12
 *   Life Sciences      40 / 25 / 20 / 15   same for Grades 10-12
 *   Physical Sciences  15 / 35 / 40 / 10   Paper 1, Grades 10-12
 *                      15 / 40 / 35 / 10   Paper 2, Grades 10-12
 *
 * MATHEMATICS IS THE ONE THAT VARIES BY GRADE, and it varies a lot: Grade 12
 * asks for 45% of marks at Levels 3-4 where Grades 10 and 11 ask for 30%. An
 * earlier version of this file stored one weighting per subject and applied
 * the Grade 12 figure to all three, which reported a 15-point shortfall at
 * Grades 10 and 11 that does not exist. That is the expensive direction to be
 * wrong in -- it invites somebody to author higher-order content the
 * curriculum does not ask for at those grades, and to make the papers harder
 * than the real ones.
 *
 * Physical Sciences differs between Paper 1 (Physics) and Paper 2 (Chemistry),
 * but only in how the middle is split: Levels 3 and 4 come to 50% in both, so
 * the three-tier approximation below is unaffected and one entry covers both
 * papers.
 *
 * These weightings are occasionally revised. Anyone relying on this report for
 * a real school should re-check the figures against the current subject
 * examination guideline before treating a gap as a finding.
 *
 * THE THREE-TIER APPROXIMATION: CAPS defines four cognitive levels, and the
 * app stores three difficulties (Easy, Moderate, Challenge). The mapping is
 *
 *   Easy      -> Level 1
 *   Moderate  -> Level 2
 *   Challenge -> Level 3 AND Level 4, combined
 *
 * so the app can tell you whether a paper has enough higher-order marks, but
 * NOT whether they are split correctly between Level 3 and Level 4. That
 * limit is surfaced on the coverage page itself rather than left implicit --
 * a teacher reading a green "Challenge on target" row needs to know it does
 * not mean the Level 4 share has been checked.
 */

export interface CapsWeighting {
  subjectId: string
  /**
   * Which grades this weighting applies to. A subject whose guideline sets one
   * weighting for the whole FET band lists all three.
   */
  grades: Grade[]
  /** Level 1 as a percentage of paper marks -- the app's "Easy". */
  level1: number
  /** Level 2 -- the app's "Moderate". */
  level2: number
  /** Levels 3 and 4 added together -- the app's "Challenge". */
  level3and4: number
  /** How CAPS names the four levels for this subject, in order. */
  levelNames: [string, string, string, string]
  /** The published Level 3 and Level 4 shares, for the note on the page. */
  level3: number
  level4: number
}

const MAT_LIT_LEVELS: CapsWeighting['levelNames'] = [
  'Knowing',
  'Applying routine procedures in familiar contexts',
  'Applying multi-step procedures in a variety of contexts',
  'Reasoning and reflecting',
]

const MATHS_LEVELS: CapsWeighting['levelNames'] = [
  'Knowledge',
  'Routine procedures',
  'Complex procedures',
  'Problem solving',
]

export const capsWeightings: CapsWeighting[] = [
  {
    subjectId: 'mat-lit',
    grades: [10, 11, 12],
    level1: 30,
    level2: 30,
    level3and4: 40,
    level3: 20,
    level4: 20,
    levelNames: MAT_LIT_LEVELS,
  },
  {
    subjectId: 'mathematics',
    grades: [10, 11],
    level1: 25,
    level2: 45,
    level3and4: 30,
    level3: 20,
    level4: 10,
    levelNames: MATHS_LEVELS,
  },
  {
    subjectId: 'mathematics',
    grades: [12],
    level1: 20,
    level2: 35,
    level3and4: 45,
    level3: 30,
    level4: 15,
    levelNames: MATHS_LEVELS,
  },
  {
    subjectId: 'life-sciences',
    grades: [10, 11, 12],
    level1: 40,
    level2: 25,
    level3and4: 35,
    level3: 20,
    level4: 15,
    levelNames: [
      'Knowing science',
      'Understanding science',
      'Applying and analysing',
      'Evaluating, creating and synthesising',
    ],
  },
  {
    subjectId: 'physical-sciences',
    grades: [10, 11, 12],
    level1: 15,
    level2: 35,
    level3and4: 50,
    level3: 40,
    level4: 10,
    levelNames: ['Remembering', 'Understanding', 'Applying and analysing', 'Evaluating and creating'],
  },
]

/**
 * The weighting for a subject at a grade.
 *
 * The grade is required, because getting it wrong is not a rounding error --
 * Mathematics moves 15 points between Grade 11 and Grade 12. Callers that
 * genuinely have no grade in hand should say which grade they mean rather
 * than letting one be assumed for them.
 */
export const capsWeightingFor = (subjectId: string, grade: Grade) =>
  capsWeightings.find((w) => w.subjectId === subjectId && w.grades.includes(grade))

/** Whether a subject's weighting is the same at every grade -- for the page note. */
export const weightingVariesByGrade = (subjectId: string) =>
  capsWeightings.filter((w) => w.subjectId === subjectId).length > 1

/**
 * How far a measured share may sit from its CAPS target before the coverage
 * report calls it out. Exam papers are never weighted to the exact
 * percentage -- questions come in whole marks -- so a tolerance avoids
 * flagging papers that are, in practice, correctly built.
 *
 * Five points is not an arbitrary choice: the Mathematical Literacy taxonomy
 * publishes its weightings as "30% (+/- 5%)", so this matches the tolerance
 * the guideline itself allows.
 */
export const WEIGHTING_TOLERANCE = 5
