/**
 * Lesson plans and teacher notes, built from the Annual Teaching Plan.
 *
 * WHY THIS IS GENERATED RATHER THAN WRITTEN. A plan per ATP week, per grade,
 * per subject is well over a hundred documents, and each one would have to be
 * kept in step with the notes and the question bank by hand. Everything a
 * plan needs already exists and is already checked: the ATP says which weeks
 * and which sub-topics (check:atp), the topic notes say what each sub-topic
 * teaches, and the question bank holds levelled questions filed under those
 * same sub-topics. So a plan is assembled from them, and it improves whenever
 * any of them does.
 *
 * HOW THE TIME IS SPLIT. CAPS gives each FET subject a weekly allocation --
 * 4,5 hours for Mathematics and Mathematical Literacy, 4 hours for Physical
 * and Life Sciences. The weeks the ATP gives a topic, times that allocation,
 * divided by the school's period length, is the number of lessons. The last
 * lesson of a multi-lesson block is kept for consolidation and an informal
 * class test, and the rest are shared out across the sub-topics in the order
 * the ATP lists them, earlier sub-topics taking any spare lesson.
 *
 * A term-level plan (every subject except Mat Lit 11 and 12) does not know how
 * many weeks a topic gets, so the teacher says, and the page defaults to one
 * week for every two sub-topics.
 *
 * WHAT EACH LESSON DOES. A sub-topic with one lesson is taught and practised
 * in it. With more, the first lesson or two teach the sub-topic's points and
 * the later ones practise and extend them, and the questions climb the CAPS
 * cognitive levels as the lessons go -- recall and routine work first,
 * complex and problem-solving questions last. No question is used twice in a
 * plan. Questions with graphs, charts and diagrams are kept: the printout
 * draws them with the same components the app uses.
 */
import type { Atp, AtpWeek } from './atp'
import { getTopic } from './topics'
import { getSubject } from './subjects'
import { getTopicNote, type SubtopicNote, type TopicNote, type WorkedExample } from './topicNotes'
import { subtopicFor } from './subtopics'
import type { Grade, Question } from '@/types'

/** CAPS FET weekly time allocation, in hours. */
export const HOURS_PER_WEEK: Record<string, number> = {
  'mat-lit': 4.5,
  mathematics: 4.5,
  'physical-sciences': 4,
  'life-sciences': 4,
}

export const LESSON_LENGTHS = [45, 60] as const
export type LessonLength = (typeof LESSON_LENGTHS)[number]

export type LessonFocus = 'Teach' | 'Teach and practise' | 'Practise' | 'Extend' | 'Consolidate and assess' | 'Revise'

export interface LessonPhase {
  name: 'Introduction' | 'Development' | 'Consolidation' | 'Conclusion'
  minutes: number
  /** What the teacher does. */
  teacher: string[]
  /** What the learners do. */
  learners: string[]
}

export interface Lesson {
  number: number
  /** The sub-topic taught, or the topic name for a consolidation or revision lesson. */
  title: string
  focus: LessonFocus
  objectives: string[]
  /** The content points taught in this lesson. */
  content: string[]
  /** A worked example to model on the board, where one belongs to this sub-topic. */
  example?: WorkedExample
  phases: LessonPhase[]
  warmUp?: Question
  classwork: Question[]
  homework: Question[]
  support: string
  extension: string
}

export interface LessonPlanDoc {
  subjectName: string
  grade: Grade
  term: number
  /** "Week 2 – 4 (19 Jan – 6 Feb)" or "Term 1". */
  when: string
  label: string
  topicName?: string
  subtopics: string[]
  note?: string
  source: string
  detail: 'week' | 'term' | 'suggested'
  weeks: number
  hoursPerWeek: number
  lessonMinutes: number
  lessons: Lesson[]
  /** Teacher notes for each topic the plan covers. */
  notes: TeacherNotes[]
  /** Set for an examination week: there is nothing to teach. */
  examOnly?: boolean
}

export interface TeacherNotes {
  topicId: string
  topicName: string
  summary: string
  keyIdeas: string[]
  subtopics: SubtopicNote[]
  formulae: string[]
  commonMistakes: string[]
  examples: WorkedExample[]
}

/** "2 – 4" is three weeks, "8" is one, "3+" is one; a term label is unknown. */
export function weekSpan(weeks: string): number | undefined {
  if (/^term/i.test(weeks.trim())) return undefined
  const nums = weeks.match(/\d+/g)?.map(Number) ?? []
  if (nums.length >= 2) return Math.max(1, nums[1] - nums[0] + 1)
  if (nums.length === 1) return 1
  return undefined
}

/** A term-level default: one week for every two sub-topics. */
export const defaultWeeksFor = (subtopicCount: number) => Math.max(1, Math.ceil(subtopicCount / 2))

/** Word stems long enough to mean something: "percentages" and "percentage" share "percen". */
const STOP = new Set(['other', 'their', 'about', 'using', 'which', 'these', 'those', 'where', 'under', 'every', 'grade'])
const stems = (text: string) =>
  new Set(
    (text.toLowerCase().match(/[a-z]{5,}/g) ?? []).filter((w) => !STOP.has(w)).map((w) => w.slice(0, 6)),
  )

/**
 * The sub-topics a week covers.
 *
 * A week-level ATP names them. A term-level one usually names only the topic,
 * and most topics appear once a year, so the entry covers every sub-topic of
 * the topic that this grade is taught.
 *
 * Some topics come back later in the year -- Mat Lit Grade 10 has Finance in
 * Terms 1 and 3, and Probability is taught under Data Handling in Term 4. Each
 * of those entries would otherwise re-teach the whole topic. So the entries
 * sharing a topic divide it: each claims the sub-topics its own label and note
 * name ("Probability" claims the probability sub-topic), a sub-topic claimed
 * twice stays with the first, and the sub-topics nobody names go to the
 * entries that claimed nothing -- or, if every entry claimed something, to the
 * one whose label is the topic's own heading.
 */
export function subtopicsForWeek(atp: Atp, index: number, grade: Grade): string[] {
  const week = atp.weeks[index]
  if (!week) return []
  if (week.subtopics?.length) return week.subtopics
  if (!week.topicId) return []
  const all = (getTopicNote(week.topicId)?.subtopics ?? [])
    .filter((s) => !s.grades || s.grades.includes(grade))
    .map((s) => s.name)
  const siblings = atp.weeks
    .map((w, i) => ({ w, i }))
    .filter(({ w }) => w.topicId === week.topicId && !w.subtopics?.length)
  if (siblings.length <= 1) return all

  const claims = new Map<number, string[]>()
  const claimed = new Set<string>()
  for (const { w, i } of siblings) {
    const words = stems(`${w.label} ${w.note ?? ''}`)
    const mine = all.filter((n) => !claimed.has(n) && [...stems(n)].some((s) => words.has(s)))
    mine.forEach((n) => claimed.add(n))
    claims.set(i, mine)
  }
  const unclaimed = all.filter((n) => !claimed.has(n))
  const empty = siblings.filter(({ i }) => !claims.get(i)!.length).map(({ i }) => i)
  // Failing that, the entry whose label is the topic's own heading ("Maps,
  // plans and other representations", "Finance: income, …") is the general
  // one, and the leftovers belong with it rather than with a narrow entry
  // such as "Models and packaging".
  const words = (t: string) => t.toLowerCase().match(/[a-z]{4,}/g) ?? []
  const topicWords = words(getTopic(week.topicId)?.name ?? '')
  const general = siblings.find(({ w }) => {
    const label = new Set(words(w.label))
    return topicWords.length > 0 && topicWords.every((t) => label.has(t))
  })
  const takers = empty.length ? empty : [(general ?? siblings[siblings.length - 1]).i]
  const shares = split(unclaimed, takers.length)
  takers.forEach((i, k) => claims.set(i, [...claims.get(i)!, ...shares[k]]))
  // Keep the note's teaching order.
  const mine = new Set(claims.get(index) ?? [])
  return all.filter((n) => mine.has(n))
}

/**
 * The sub-topics a plan actually teaches.
 *
 * A week-level ATP names its sub-topics and they are taken as given. A
 * term-level entry inherits every heading in the topic's note, and some of
 * those are not this grade's work -- Grade 12 Functions would open with two
 * lessons on straight lines, a Grade 10 topic -- or are headings that hold no
 * content of their own. The question bank is the grade's syllabus in
 * practice, so a heading with fewer than MIN_QUESTIONS questions at this grade
 * is left out. If that would leave nothing, every heading is kept.
 */
const MIN_QUESTIONS = 3

export function teachableSubtopics(atp: Atp, index: number, grade: Grade, questions: Question[]): string[] {
  const names = subtopicsForWeek(atp, index, grade)
  const week = atp.weeks[index]
  if (!week?.topicId || week.subtopics?.length) return names
  const count = new Map<string | null, number>()
  for (const q of questions) {
    if (q.topicId !== week.topicId || q.grade !== grade) continue
    const name = subtopicFor(q)
    count.set(name, (count.get(name) ?? 0) + 1)
  }
  // Three, not one: a single stray question filed under Linear functions in
  // Grade 12 does not make straight lines Grade 12 work.
  const kept = names.filter((n) => (count.get(n) ?? 0) >= MIN_QUESTIONS)
  return kept.length ? kept : names
}

const level = (q: Question) => q.cognitiveLevel ?? 2

/** Take up to `n` unused questions from `pool`, preferring the given levels in order. */
function take(pool: Question[], used: Set<string>, n: number, levels: number[]): Question[] {
  const out: Question[] = []
  for (const lv of levels) {
    for (const q of pool) {
      if (out.length >= n) break
      if (used.has(q.id) || level(q) !== lv) continue
      out.push(q)
      used.add(q.id)
    }
  }
  // Fall back to any level rather than leave a lesson short.
  for (const q of pool) {
    if (out.length >= n) break
    if (used.has(q.id)) continue
    out.push(q)
    used.add(q.id)
  }
  return out.sort((a, b) => level(a) - level(b))
}

/** Split `items` into `parts` runs, as evenly as the count allows, earlier runs larger. */
function split<T>(items: T[], parts: number): T[][] {
  const out: T[][] = []
  let start = 0
  for (let i = 0; i < parts; i++) {
    const size = Math.ceil((items.length - start) / (parts - i))
    out.push(items.slice(start, start + size))
    start += size
  }
  return out
}

/** Share `total` lessons across `n` sub-topics, earlier ones taking the spare. */
function share(total: number, n: number): number[] {
  if (n === 0) return []
  const base = Math.floor(total / n)
  const extra = total - base * n
  return Array.from({ length: n }, (_, i) => base + (i < extra ? 1 : 0))
}

/** The minutes for each phase, scaled to the period. */
function phaseMinutes(minutes: number): [number, number, number, number] {
  if (minutes <= 45) return [5, 20, 15, 5]
  return [10, 25, 20, 5]
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Level 1 (knowledge)',
  2: 'Level 2 (routine procedures)',
  3: 'Level 3 (complex procedures)',
  4: 'Level 4 (problem solving)',
}
export const levelName = (q: Question) => LEVEL_NAMES[level(q)] ?? LEVEL_NAMES[2]

/** Worked examples filed under the sub-topic they illustrate, by the same rules as the questions. */
function examplesBySubtopic(note: TopicNote | undefined, topicId: string): Map<string, WorkedExample[]> {
  const out = new Map<string, WorkedExample[]>()
  if (!note) return out
  for (const ex of [note.example, ...(note.moreExamples ?? [])]) {
    const name = subtopicFor({ topicId, prompt: ex.problem } as Question)
    if (!name) continue
    out.set(name, [...(out.get(name) ?? []), ex])
  }
  return out
}

function notesFor(topicId: string, subtopics: string[]): TeacherNotes | undefined {
  const note = getTopicNote(topicId)
  const topic = getTopic(topicId)
  if (!note || !topic) return undefined
  const wanted = new Set(subtopics)
  return {
    topicId,
    topicName: topic.name,
    summary: note.summary,
    keyIdeas: note.keyIdeas,
    subtopics: (note.subtopics ?? []).filter((s) => !wanted.size || wanted.has(s.name)),
    formulae: note.formulae ?? [],
    commonMistakes: note.commonMistakes ?? [],
    examples: [note.example, ...(note.moreExamples ?? [])],
  }
}

const LEVEL_TARGET: Record<LessonFocus, string> = {
  Teach: 'CAPS Levels 1 and 2 (knowledge and routine procedures)',
  'Teach and practise': 'CAPS Levels 1 to 3',
  Practise: 'CAPS Levels 2 and 3 (routine and complex procedures)',
  Extend: 'CAPS Levels 3 and 4 (complex procedures and problem solving)',
  'Consolidate and assess': 'every CAPS level taught in the topic',
  Revise: 'CAPS Levels 2 to 4, under exam conditions',
}

function objectiveFor(focus: LessonFocus, subtopic: string): string[] {
  const lead: Record<LessonFocus, string> = {
    Teach: `explain the key ideas of ${subtopic.toLowerCase()} and use them in routine questions`,
    'Teach and practise': `explain ${subtopic.toLowerCase()} and apply it to routine and multi-step questions`,
    Practise: `apply ${subtopic.toLowerCase()} accurately to routine and multi-step questions`,
    Extend: `solve unfamiliar and exam-style problems on ${subtopic.toLowerCase()}, and justify their answers`,
    'Consolidate and assess': `show what they have learnt across the topic in a short informal test`,
    Revise: `recall and apply the main ideas of ${subtopic.toLowerCase()}`,
  }
  // The content points are listed under their own heading; repeating them
  // here only made the objectives longer.
  return [
    `By the end of the lesson, learners should be able to ${lead[focus]}.`,
    `Questions in this lesson target ${LEVEL_TARGET[focus]}.`,
  ]
}

interface BuildInput {
  atp: Atp
  weekIndex: number
  grade: Grade
  /** Every question in the subject for this grade. */
  questions: Question[]
  lessonMinutes: LessonLength
  /** The weeks the teacher gives the topic, where they differ from the plan's. */
  weeksOverride?: number
}

export function buildLessonPlan({ atp, weekIndex, grade, questions, lessonMinutes, weeksOverride }: BuildInput): LessonPlanDoc | undefined {
  const week = atp.weeks[weekIndex]
  if (!week) return undefined

  const subjectName = getSubject(atp.subjectId)?.name ?? atp.subjectId
  const hoursPerWeek = HOURS_PER_WEEK[atp.subjectId] ?? 4
  // Whole periods only: 4,5 hours of 60-minute periods is four lessons, not
  // five, so a plan never asks for more time than CAPS gives the subject.
  const perWeek = Math.max(1, Math.floor((hoursPerWeek * 60) / lessonMinutes))
  const subtopics = teachableSubtopics(atp, weekIndex, grade, questions)
  const span = weekSpan(week.weeks)
  // A teacher's own choice wins; then the plan's week range; then a default.
  const weeks = weeksOverride ?? span ?? (week.topicId ? defaultWeeksFor(subtopics.length) : 1)
  const when = week.dates ? `Week ${week.weeks} (${week.dates})` : week.weeks
  const [intro, dev, cons, concl] = phaseMinutes(lessonMinutes)
  const gradePool = questions.filter((q) => q.grade === grade)
  const used = new Set<string>()

  const base = {
    subjectName,
    grade,
    term: week.term,
    when,
    label: week.label,
    note: week.note,
    source: atp.source,
    detail: atp.detail,
    weeks,
    hoursPerWeek,
    lessonMinutes,
  }

  // ---------------------------------------------------------------- revision
  if (!week.topicId) {
    const isExamOnly = /exam/i.test(week.label) && !/revis/i.test(week.label)
    // Revision before an exam covers everything taught so far this year; a
    // plain revision week covers its own term.
    const upToNow = /exam|prep|final/i.test(week.label)
    const earlier = atp.weeks.filter(
      (w, i) => i < weekIndex && w.topicId && (upToNow ? true : w.term === week.term),
    )
    const topicIds = [...new Set(earlier.map((w) => w.topicId!))]
    if (isExamOnly || !topicIds.length) {
      return { ...base, subtopics: [], lessons: [], notes: [], examOnly: true }
    }
    const total = Math.max(1, weeks * perWeek)
    const perTopic = share(total, topicIds.length)
    const lessons: Lesson[] = []
    topicIds.forEach((topicId, ti) => {
      const topic = getTopic(topicId)
      const note = getTopicNote(topicId)
      const pool = gradePool.filter((q) => q.topicId === topicId)
      for (let k = 0; k < perTopic[ti]; k++) {
        const name = topic?.name ?? topicId
        const classwork = take(pool, used, 4, [2, 3, 4])
        const homework = take(pool, used, 2, [3, 2, 4])
        lessons.push({
          number: lessons.length + 1,
          title: `Revision: ${name}`,
          focus: 'Revise',
          objectives: objectiveFor('Revise', name),
          content: note?.keyIdeas ?? [],
          phases: [
            {
              name: 'Introduction',
              minutes: intro,
              teacher: ['Ask learners to list, from memory, the key ideas of the topic. Fill the gaps on the board from the list below.'],
              learners: ['Write down what they remember, then compare with a partner.'],
            },
            {
              name: 'Development',
              minutes: dev,
              teacher: ['Go through the key ideas and the common mistakes in the teacher notes. Model one exam-style question from the classwork.'],
              learners: ['Take notes on anything they had forgotten.'],
            },
            {
              name: 'Consolidation',
              minutes: cons,
              teacher: ['Set the classwork under timed conditions: about one mark a minute.'],
              learners: ['Answer the classwork questions, then mark them against the memo.'],
            },
            {
              name: 'Conclusion',
              minutes: concl,
              teacher: ['Ask each learner to write down the one idea from this topic they are least sure of. Use the answers to plan the next revision lesson.'],
              learners: ['Record their weakest idea and set themselves the homework.'],
            },
          ],
          classwork,
          homework,
          support: 'Give learners who struggle the key ideas list to use while they answer, and start them on the first question.',
          extension: 'Learners who finish early attempt the homework questions in class, then write their own exam-style question on the topic.',
        })
      }
    })
    return {
      ...base,
      subtopics: [],
      lessons,
      notes: topicIds.map((id) => notesFor(id, [])).filter((n): n is TeacherNotes => !!n),
    }
  }

  // ---------------------------------------------------------------- teaching
  const topicId = week.topicId
  const topic = getTopic(topicId)
  const note = getTopicNote(topicId)
  const noteByName = new Map((note?.subtopics ?? []).map((s) => [s.name, s]))
  const examples = examplesBySubtopic(note, topicId)
  const pool = gradePool.filter((q) => q.topicId === topicId)
  const bySub = new Map<string, Question[]>()
  for (const q of pool) {
    const name = subtopicFor(q)
    if (name) bySub.set(name, [...(bySub.get(name) ?? []), q])
  }

  const total = Math.max(1, weeks * perWeek)
  // Keep the last lesson for consolidation when there is room for one.
  const reserve = total > subtopics.length ? 1 : 0
  const perSub = share(total - reserve, subtopics.length)
  const lessons: Lesson[] = []

  subtopics.forEach((name, si) => {
    const count = perSub[si]
    if (!count) return
    const points = noteByName.get(name)?.points ?? []
    const subPool = bySub.get(name) ?? []
    const subExamples = examples.get(name) ?? []
    // One teaching lesson per three points, but never all of them: the last
    // lesson of a sub-topic with several is for practice.
    const teaching = count === 1 ? 1 : Math.min(count - 1, Math.max(1, Math.ceil(points.length / 3)))
    const chunks = split(points, teaching)
    // When the week ends with a consolidation lesson, hold one question of each
    // sub-topic back for its class test; otherwise the lessons before it share
    // out every question and the test has nothing left to ask.
    const available = subPool.filter((q) => !used.has(q.id)).length
    const budgets = share(Math.max(0, available - (reserve && available > count ? 1 : 0)), count)

    for (let k = 0; k < count; k++) {
      const isTeach = k < teaching
      const focus: LessonFocus =
        count === 1 ? 'Teach and practise' : isTeach ? 'Teach' : k === count - 1 && count > 2 ? 'Extend' : 'Practise'
      const content = isTeach ? chunks[k] : []
      const levels = focus === 'Extend' ? [4, 3] : focus === 'Practise' ? [2, 3] : focus === 'Teach' ? [1, 2] : [1, 2, 3]
      // Share the sub-topic's questions across its lessons, so a thin
      // sub-topic spreads what it has instead of the first lesson taking all
      // of it. Within a lesson classwork comes first, then homework, then the
      // warm-up, which the teacher can always replace with an oral question.
      const budget = budgets[k]
      const cw = Math.min(focus === 'Extend' ? 3 : 4, budget)
      const hw = Math.min(2, budget - cw)
      const wu = Math.min(1, budget - cw - hw)
      const classwork = take(subPool, used, cw, levels)
      const homework = take(subPool, used, hw, focus === 'Teach' ? [2, 1] : [3, 2, 4])
      const warmUp = wu ? take(subPool, used, 1, k === 0 ? [1, 2] : [2, 1])[0] : undefined
      const example = isTeach ? subExamples[k] : undefined
      const prev = si > 0 ? subtopics[si - 1] : undefined

      const introTeacher =
        k === 0
          ? [
              prev
                ? `Link to the previous sub-topic, ${prev.toLowerCase()}, and say what today adds to it.`
                : `Introduce ${name.toLowerCase()}: ask learners what they already know about it and where they meet it outside the classroom.`,
              warmUp ? 'Put the warm-up question on the board and give learners a few minutes on their own.' : 'Ask two or three quick oral questions on the prior knowledge this sub-topic needs.',
            ]
          : [
              'Check the homework: go through the question most learners found hardest.',
              warmUp ? 'Put the warm-up question on the board.' : 'Ask two quick oral recall questions on the previous lesson.',
            ]

      const devTeacher = isTeach
        ? [
            'Teach the content points below one at a time, writing each on the board with a short example.',
            example ? 'Model the worked example step by step, asking learners to predict each next step.' : 'Work one classwork question on the board as a model, thinking aloud.',
            'Check understanding after each point with a quick question to the class.',
          ]
        : focus === 'Extend'
          ? [
              'Work one exam-style problem on the board, stressing how to read the question and plan the answer before calculating.',
              'Point out where marks are earned, using the memo of a classwork question.',
            ]
          : [
              'Recap the method briefly, then model one routine question and one multi-step question.',
              'Highlight the common mistakes listed in the teacher notes.',
            ]

      lessons.push({
        number: lessons.length + 1,
        title: name,
        focus,
        objectives: objectiveFor(focus, name),
        content,
        example,
        phases: [
          { name: 'Introduction', minutes: intro, teacher: introTeacher, learners: ['Answer the warm-up individually, then discuss with a partner.'] },
          { name: 'Development', minutes: dev, teacher: devTeacher, learners: ['Take notes, copy the modelled examples and answer the check-up questions.'] },
          {
            name: 'Consolidation',
            minutes: cons,
            teacher: ['Set the classwork. Move around the class, checking method as well as answers, and stop the class to correct a mistake that several learners make.'],
            learners: ['Answer the classwork questions, first with a partner and then on their own.'],
          },
          {
            name: 'Conclusion',
            minutes: concl,
            teacher: ['Go over one classwork answer against the memo. Summarise the lesson in two or three sentences and set the homework.'],
            learners: ['Mark their work against the memo and write down the homework.'],
          },
        ],
        warmUp,
        classwork,
        homework,
        support:
          focus === 'Extend'
            ? 'Give struggling learners a structured version of the first question, broken into its steps.'
            : 'Start struggling learners on the Level 1 and 2 questions, with the content points in front of them.',
        extension:
          focus === 'Extend'
            ? 'Ask learners who finish to write a question of their own at this level, with a memo.'
            : 'Learners who finish early attempt the homework questions, then explain one to a partner.',
      })
    }
  })

  if (reserve) {
    const classwork = subtopics.flatMap((name) => take(bySub.get(name) ?? [], used, 1, [2, 3, 4, 1]))
    const test = take(pool, used, Math.max(0, 6 - classwork.length), [3, 2, 4])
    lessons.push({
      number: lessons.length + 1,
      title: `${topic?.name ?? topicId}: consolidation`,
      focus: 'Consolidate and assess',
      objectives: objectiveFor('Consolidate and assess', topic?.name ?? ''),
      content: note?.keyIdeas ?? [],
      phases: [
        {
          name: 'Introduction',
          minutes: intro,
          teacher: ['Recap the sub-topics taught, using the key ideas, and answer questions from the class.'],
          learners: ['Ask about anything they are still unsure of.'],
        },
        {
          name: 'Development',
          minutes: dev + cons,
          teacher: ['Give the informal class test below under test conditions. It covers each sub-topic taught.'],
          learners: ['Write the class test individually.'],
        },
        {
          name: 'Conclusion',
          minutes: concl,
          teacher: ['Collect the scripts, or let learners swap and mark with the memo. Note which questions most learners lost marks on and re-teach them.'],
          learners: ['Mark a partner’s test against the memo.'],
        },
      ],
      classwork: [...classwork, ...test].sort((a, b) => level(a) - level(b)),
      homework: [],
      support: 'Read the questions aloud for learners who struggle with the language, without explaining the mathematics or science.',
      extension: 'Learners who finish early check every answer by a second method.',
    })
  }

  const notes = notesFor(topicId, subtopics)
  return {
    ...base,
    topicName: topic?.name,
    subtopics,
    lessons,
    notes: notes ? [notes] : [],
  }
}

export const marksOf = (qs: Question[]) => qs.reduce((s, q) => s + q.marks, 0)
