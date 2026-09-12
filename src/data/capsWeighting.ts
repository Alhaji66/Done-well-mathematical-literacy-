/**
 * CAPS cognitive-level weightings for the NSC exam papers, per subject.
 *
 * WHERE THESE COME FROM: each subject's CAPS document and its examination
 * guidelines publish the share of marks an exam paper must carry at each
 * cognitive level. They are targets for a PAPER, which is why the coverage
 * report measures them by mark rather than by question count -- a 2-mark
 * recall item and an 8-mark reasoning item are not worth the same to the
 * weighting even though each is one question.
 *
 * These weightings are occasionally revised. Anyone relying on this report
 * for a real school should check the figures below against the current
 * subject examination guideline before treating a gap as a finding.
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

export const capsWeightings: CapsWeighting[] = [
  {
    subjectId: 'mat-lit',
    level1: 30,
    level2: 30,
    level3and4: 40,
    level3: 20,
    level4: 20,
    levelNames: [
      'Knowing',
      'Applying routine procedures in familiar contexts',
      'Applying multi-step procedures in a variety of contexts',
      'Reasoning and reflecting',
    ],
  },
  {
    subjectId: 'mathematics',
    level1: 20,
    level2: 35,
    level3and4: 45,
    level3: 30,
    level4: 15,
    levelNames: ['Knowledge', 'Routine procedures', 'Complex procedures', 'Problem solving'],
  },
  {
    subjectId: 'life-sciences',
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
    level1: 15,
    level2: 35,
    level3and4: 50,
    level3: 40,
    level4: 10,
    levelNames: ['Remembering', 'Understanding', 'Applying and analysing', 'Evaluating and creating'],
  },
]

export const capsWeightingFor = (subjectId: string) =>
  capsWeightings.find((w) => w.subjectId === subjectId)

/**
 * How far a measured share may sit from its CAPS target before the coverage
 * report calls it out. Exam papers are never weighted to the exact
 * percentage -- questions come in whole marks -- so a tolerance avoids
 * flagging papers that are, in practice, correctly built. Five points is
 * roughly one 4-mark question in a 100-mark paper either way.
 */
export const WEIGHTING_TOLERANCE = 5
