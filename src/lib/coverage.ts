import type { Difficulty, Grade, Question } from '@/types'
import { subjects } from '@/data/subjects'
import { topicsForSubject } from '@/data/topics'
import { questionsForSubject } from '@/data/questionBank'
import { papersForSubject } from '@/data/papers'
import { getTopicNote } from '@/data/topicNotes'
import { subtopicFor } from '@/data/subtopics'
import { capsWeightingFor, WEIGHTING_TOLERANCE, type CapsWeighting } from '@/data/capsWeighting'

/**
 * Curriculum coverage report.
 *
 * The point of this module is to answer a question a sample count cannot:
 * for a given subject and grade, is the content actually complete enough to
 * teach from? A topic with 200 questions that are all recall is not covered,
 * and a catalogue that advertises four topics while one of them has nine
 * questions is not covered either.
 *
 * So every figure here is designed to expose a GAP rather than a total.
 * Where the app has no data to answer part of the reviewer's brief -- how
 * many questions a subject specialist has signed off, how many practical or
 * data-based investigations there are, how many review items are unresolved
 * -- this module says so explicitly instead of substituting a number that
 * looks like an answer. See UNTRACKED below.
 */

export interface LevelSplit {
  easy: number
  moderate: number
  challenge: number
  total: number
}

export interface TopicCoverage {
  topicId: string
  topicName: string
  /** Practice questions tagged to this topic at this grade. */
  questionCount: number
  /** Split by question count, for practice questions. */
  practice: LevelSplit
  /** True when the topic has no Challenge-tier practice question at all. */
  noChallenge: boolean
  /** Sub-topic notes exist for this topic (topicNotes.ts). */
  hasNotes: boolean
  /** How many of this topic's questions the classifier can place in a sub-topic. */
  placedPercent: number | null
}

export interface PaperCoverage {
  paperId: string
  title: string
  paperNumber: 1 | 2
  totalMarks: number
  /** Split by MARK, which is how CAPS states its weightings. */
  marks: LevelSplit
  /** Challenge share of marks, rounded. */
  challengePercent: number
  /** Distance from the CAPS Level 3+4 target, in percentage points. */
  challengeGap: number
}

export type FindingSeverity = 'gap' | 'watch'

export interface Finding {
  severity: FindingSeverity
  message: string
}

export interface GradeCoverage {
  grade: Grade
  topics: TopicCoverage[]
  papers: PaperCoverage[]
  /** Aggregate mark split across every paper at this grade. */
  paperMarks: LevelSplit
  findings: Finding[]
}

export interface SubjectCoverage {
  subjectId: string
  subjectName: string
  weighting: CapsWeighting | undefined
  grades: GradeCoverage[]
}

/**
 * A topic with fewer practice questions than this at a grade cannot support
 * a learner working through it -- there is not enough to practise on, and a
 * learner who has seen all of them has nothing left to be set. It is a
 * deliberately low bar: clearing it means "usable", not "complete".
 */
export const THIN_TOPIC_THRESHOLD = 12

const emptySplit = (): LevelSplit => ({ easy: 0, moderate: 0, challenge: 0, total: 0 })

const addToSplit = (split: LevelSplit, difficulty: Difficulty, weight: number) => {
  if (difficulty === 'Easy') split.easy += weight
  else if (difficulty === 'Moderate') split.moderate += weight
  else split.challenge += weight
  split.total += weight
}

export const sharePercent = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100)

/**
 * `pool` must be the PRACTISABLE pool from questionBank -- the standalone
 * bank plus de-duplicated paper items -- and not the raw questions.ts array.
 * That is what Learn counts and what Practise serves, so reading anything
 * else here would report a shortage the learner never experiences.
 */
function topicCoverage(pool: Question[], topicId: string, topicName: string, grade: Grade): TopicCoverage {
  const rows = pool.filter((q) => q.topicId === topicId && q.grade === grade)
  const practice = emptySplit()
  for (const q of rows) addToSplit(practice, q.difficulty, 1)

  // The sub-topic classifier is the same one the Practise page groups by, so
  // this figure is exactly what a learner would experience: anything it
  // cannot place lands in the catch-all group at the bottom of the page.
  const placed = rows.filter((q) => subtopicFor(q) !== null).length

  return {
    topicId,
    topicName,
    questionCount: rows.length,
    practice,
    noChallenge: rows.length > 0 && practice.challenge === 0,
    hasNotes: Boolean(getTopicNote(topicId)),
    placedPercent: rows.length === 0 ? null : sharePercent(placed, rows.length),
  }
}

function buildFindings(
  topics: TopicCoverage[],
  papers: PaperCoverage[],
  paperMarks: LevelSplit,
  weighting: CapsWeighting | undefined,
): Finding[] {
  const findings: Finding[] = []

  const empty = topics.filter((t) => t.questionCount === 0)
  if (empty.length > 0) {
    findings.push({
      severity: 'gap',
      message: `${empty.length} topic${empty.length === 1 ? '' : 's'} advertised with no practice questions at this grade: ${empty.map((t) => t.topicName).join(', ')}.`,
    })
  }

  const thin = topics.filter((t) => t.questionCount > 0 && t.questionCount < THIN_TOPIC_THRESHOLD)
  if (thin.length > 0) {
    findings.push({
      severity: 'gap',
      message: `${thin.length} topic${thin.length === 1 ? ' has' : 's have'} fewer than ${THIN_TOPIC_THRESHOLD} practice questions: ${thin.map((t) => `${t.topicName} (${t.questionCount})`).join(', ')}.`,
    })
  }

  const noChallenge = topics.filter((t) => t.noChallenge)
  if (noChallenge.length > 0) {
    findings.push({
      severity: 'gap',
      message: `${noChallenge.length} topic${noChallenge.length === 1 ? ' offers' : 's offer'} no Challenge-tier practice, so a learner cannot prepare for higher-order marks there: ${noChallenge.map((t) => t.topicName).join(', ')}.`,
    })
  }

  if (papers.length === 0) {
    findings.push({ severity: 'gap', message: 'No assessment papers exist at this grade.' })
  } else if (weighting) {
    const offTarget = papers.filter((p) => Math.abs(p.challengeGap) > WEIGHTING_TOLERANCE)
    if (offTarget.length > 0) {
      findings.push({
        severity: offTarget.length > papers.length / 2 ? 'gap' : 'watch',
        message: `${offTarget.length} of ${papers.length} papers sit more than ${WEIGHTING_TOLERANCE} points from the ${weighting.level3and4}% CAPS target for Levels 3-4 by mark.`,
      })
    }
  }

  if (weighting && paperMarks.total > 0) {
    const actual = sharePercent(paperMarks.challenge, paperMarks.total)
    const gap = actual - weighting.level3and4
    if (Math.abs(gap) > WEIGHTING_TOLERANCE) {
      findings.push({
        severity: 'gap',
        message: `Across all papers at this grade, Levels 3-4 carry ${actual}% of marks against a CAPS target of ${weighting.level3and4}%.`,
      })
    }
  }

  const missingNotes = topics.filter((t) => t.questionCount > 0 && !t.hasNotes)
  if (missingNotes.length > 0) {
    findings.push({
      severity: 'watch',
      message: `${missingNotes.length} topic${missingNotes.length === 1 ? ' has' : 's have'} no sub-topic notes, so their Practise pages cannot group questions under headings: ${missingNotes.map((t) => t.topicName).join(', ')}.`,
    })
  }

  const poorlyPlaced = topics.filter((t) => t.placedPercent !== null && t.placedPercent < 60)
  if (poorlyPlaced.length > 0) {
    findings.push({
      severity: 'watch',
      message: `${poorlyPlaced.length} topic${poorlyPlaced.length === 1 ? ' leaves' : 's leave'} more than 40% of questions in the catch-all Practise group: ${poorlyPlaced.map((t) => `${t.topicName} (${t.placedPercent}% placed)`).join(', ')}.`,
    })
  }

  return findings
}

export async function buildCoverage(subjectId: string): Promise<SubjectCoverage> {
  const subject = subjects.find((s) => s.id === subjectId)
  const weighting = capsWeightingFor(subjectId)
  const allPapers = await papersForSubject(subjectId)
  const pool = await questionsForSubject(subjectId)

  const grades = (subject?.grades ?? []).map((grade) => {
    const topics = topicsForSubject(subjectId, grade).map((t) => topicCoverage(pool, t.id, t.name, grade))

    const paperMarks = emptySplit()
    const papers: PaperCoverage[] = allPapers
      .filter((p) => p.grade === grade)
      .map((p) => {
        const marks = emptySplit()
        for (const section of p.sections)
          for (const item of section.items) {
            addToSplit(marks, item.difficulty, item.marks)
            addToSplit(paperMarks, item.difficulty, item.marks)
          }
        const challengePercent = sharePercent(marks.challenge, marks.total)
        return {
          paperId: p.id,
          title: p.title,
          paperNumber: p.paperNumber,
          totalMarks: p.totalMarks,
          marks,
          challengePercent,
          challengeGap: weighting ? challengePercent - weighting.level3and4 : 0,
        }
      })

    return {
      grade,
      topics,
      papers,
      paperMarks,
      findings: buildFindings(topics, papers, paperMarks, weighting),
    }
  })

  return {
    subjectId,
    subjectName: subject?.name ?? subjectId,
    weighting,
    grades,
  }
}

/**
 * The parts of the reviewer's coverage brief the app genuinely cannot
 * report on yet. These are rendered on the page as named absences rather
 * than quietly left off it -- a dashboard that shows six green panels and
 * silently omits the three it has no data for is worse than no dashboard,
 * because it reads as a clean bill of health.
 */
export const UNTRACKED = [
  {
    title: 'Reviewed questions',
    detail:
      'No question carries an author, a subject-specialist reviewer, a review date or a version. Every item in the bank is unreviewed by that standard, so a "reviewed" count would be zero for all of them and is not shown as a figure.',
    needs: 'A review pipeline: reviewer identity and sign-off date stored per question.',
  },
  {
    title: 'Practical and data-based coverage',
    detail:
      'Questions are not flagged as practical work, investigations or data-response, so the share of each cannot be counted. Science questions that read as data-response are indistinguishable in the data from any other question.',
    needs: 'An item-type field on Question, applied across the existing bank.',
  },
  {
    title: 'Unresolved review items',
    detail:
      'There is no queue to hold them. Errors found in content today are fixed directly in the source files, which means they are also invisible here — nothing records that a problem was ever raised.',
    needs: 'A review queue with an open/resolved state, written to as issues are raised.',
  },
  {
    title: 'Level 3 against Level 4',
    detail:
      'The app stores three difficulty tiers against the four CAPS cognitive levels, so Challenge covers Level 3 and Level 4 together. A paper on target for Levels 3-4 combined may still carry too little Level 4 reasoning.',
    needs: 'A fourth tier, or a separate cognitive-level field alongside difficulty.',
  },
  {
    title: 'Whether the difficulty tags are right',
    detail:
      'Every weighting figure on this page is computed from the difficulty tag each question was given when it was written. Those tags are author-assigned and have never been audited, so a paper reading "on target" means its TAGS are on target, not that its questions were checked. Spot checks have found recall questions — describe a pathway, state two conditions — carrying a Challenge tag, which inflates the higher-order share without adding any higher-order work.',
    needs:
      'An explicit CAPS cognitive level stored per question at authoring time. Inferring the level from the wording afterwards is not reliable enough to publish: it works passably on prose subjects and fails badly on Mathematics, where the demand sits in the mathematics rather than in the verb, so a routine-looking "Solve for x" can be a Level 3 complex procedure.',
  },
] as const
