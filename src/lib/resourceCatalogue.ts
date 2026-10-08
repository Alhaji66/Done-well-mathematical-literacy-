import { topicsForSubject, getTopic } from '@/data/topics'
import { papersForSubject } from '@/data/papers'
import { atpFor } from '@/data/atp'
import type { AccountRole } from '@/context/AccountAuthContext'
import type { Difficulty, Grade } from '@/types'
import type { ContentItem, ContentKind } from '@/lib/content'

/**
 * One list of everything a person can open, whatever it is made of.
 *
 * Two sources feed it. DONE WELL's own curriculum, which lives in the code and
 * is already reviewed through GitHub -- a study guide for every topic that has
 * notes, topic practice, and every paper. And items published through the
 * content workflow, which the database has already filtered to what this
 * person may see. A link is built for the viewer's own role, so a learner is
 * sent to practise and a teacher to the question bank.
 *
 * Every resource type the filter offers is filled from what the app already
 * has, for the roles that have the page it opens:
 *   lesson           -- the week's lesson plans, one per ATP week (teachers)
 *   worksheet        -- a printable worksheet and memo per topic and grade (teachers, HODs)
 *   memo             -- each paper's memo copy (staff); learners see answers after trying
 *   revision         -- the exam countdown plan and My mistakes (learners)
 *   teacher_resource -- year plans, SBA tasks, coverage, mark book, sign-off (staff)
 *   study_guide, practice, assessment -- as before.
 * Videos come only from the content studio.
 */

export interface CatalogueEntry {
  key: string
  kind: ContentKind
  title: string
  summary: string
  subjectId: string | null
  grades: Grade[]
  topicId: string | null
  difficulty: Difficulty | null
  teachersOnly: boolean
  /** Relative to the role's own area, e.g. 'practise?topic=finance'. */
  to: string
  source: 'done-well' | 'content'
}

const isLearner = (r: AccountRole) => r === 'learner'
const isStaff = (r: AccountRole) => r === 'teacher' || r === 'hod' || r === 'school'

/** The pages each staff role has (src/App.tsx); an entry is only made where its link works. */
const STAFF_PAGES: Partial<Record<AccountRole, string[]>> = {
  teacher: ['lesson-plans', 'assessment-tasks', 'question-bank', 'markbook', 'coverage'],
  hod: ['question-bank', 'markbook', 'coverage', 'plan-signoff'],
  school: ['markbook', 'coverage', 'plan-signoff'],
}
const has = (role: AccountRole, page: string) => STAFF_PAGES[role]?.includes(page) ?? false
const GRADES: Grade[] = [10, 11, 12]

/** The built-in part, for one subject (papers load per subject). */
export async function builtInEntries(subjectId: string, role: AccountRole): Promise<CatalogueEntry[]> {
  const out: CatalogueEntry[] = []
  const { topicNotes } = await import('@/data/topicNotes')
  const withNotes = new Set(topicNotes.map((n) => n.topicId))

  for (const t of topicsForSubject(subjectId)) {
    if (withNotes.has(t.id)) {
      out.push({
        key: `guide:${t.id}`,
        kind: 'study_guide',
        title: `${t.name}: study guide`,
        summary: topicNotes.find((n) => n.topicId === t.id)?.summary ?? t.description,
        subjectId,
        grades: t.grades,
        topicId: t.id,
        difficulty: null,
        teachersOnly: false,
        to: `resources/topic/${t.id}`,
        source: 'done-well',
      })
    }
    if (isLearner(role) || isStaff(role)) {
      out.push({
        key: `practice:${t.id}`,
        kind: 'practice',
        title: `${t.name}: practice questions`,
        summary: t.description,
        subjectId,
        grades: t.grades,
        topicId: t.id,
        difficulty: null,
        teachersOnly: false,
        to: isLearner(role) ? `practise?subject=${subjectId}&topic=${t.id}` : 'question-bank',
        source: 'done-well',
      })
    }
  }

  // A printable worksheet with its memo, per topic and grade.
  if (has(role, 'question-bank')) {
    for (const t of topicsForSubject(subjectId)) {
      for (const g of t.grades) {
        out.push({
          key: `worksheet:${t.id}:${g}`,
          kind: 'worksheet',
          title: `${t.name}: Grade ${g} worksheet`,
          summary: 'Choose the week or sub-topics, the length and difficulty, then print the worksheet and its memo.',
          subjectId,
          grades: [g],
          topicId: t.id,
          difficulty: null,
          teachersOnly: true,
          to: `question-bank?subject=${subjectId}&grade=${g}&topic=${t.id}`,
          source: 'done-well',
        })
      }
    }
  }

  for (const g of GRADES) {
    const atp = atpFor(subjectId, g)
    // A lesson per ATP teaching week: plans, activities, homework and notes.
    if (has(role, 'lesson-plans') && atp) {
      atp.weeks.forEach((w, i) => {
        if (!w.topicId) return
        out.push({
          key: `lesson:${subjectId}:${g}:${i}`,
          kind: 'lesson',
          title: `Grade ${g} · Term ${w.term} · Week ${w.weeks}: ${w.label}`,
          summary: 'Ready-to-teach lessons for the week, with activities, homework, a learner copy and teacher notes.',
          subjectId,
          grades: [g],
          topicId: w.topicId,
          difficulty: null,
          teachersOnly: true,
          to: `lesson-plans?subject=${subjectId}&grade=${g}&week=${i}`,
          source: 'done-well',
        })
      })
    }
    const staffPages: { page: string; key: string; title: string; summary: string; to: string; kind: ContentKind }[] = [
      {
        page: 'lesson-plans',
        key: 'year-plan',
        kind: 'teacher_resource',
        title: `Grade ${g} lesson plans for the year`,
        summary: 'Every ATP week as printable lessons, in order, with a learner copy of each.',
        to: `lesson-plans?subject=${subjectId}&grade=${g}`,
      },
      {
        page: 'assessment-tasks',
        key: 'sba',
        kind: 'teacher_resource',
        title: `Grade ${g} formal assessment tasks (SBA)`,
        summary: 'The year\u2019s formal tasks, each with a learner copy, a memo or rubric and a class mark sheet.',
        to: `assessment-tasks?subject=${subjectId}&grade=${g}`,
      },
      {
        page: 'assessment-tasks',
        key: 'sba-memo',
        kind: 'memo',
        title: `Grade ${g} SBA task memos and rubrics`,
        summary: 'The memo or rubric for each formal assessment task, ready to print for marking and moderation.',
        to: `assessment-tasks?subject=${subjectId}&grade=${g}`,
      },
    ]
    for (const e of staffPages) {
      if (!has(role, e.page)) continue
      out.push({
        key: `${e.key}:${subjectId}:${g}`,
        kind: e.kind,
        title: e.title,
        summary: e.summary,
        subjectId,
        grades: [g],
        topicId: null,
        difficulty: null,
        teachersOnly: true,
        to: e.to,
        source: 'done-well',
      })
    }
  }

  // School-wide tools, not tied to a grade.
  const tools: { page: string; title: string; summary: string }[] = [
    { page: 'coverage', title: 'Curriculum coverage tracker', summary: 'Which ATP weeks each class has covered, and what is behind.' },
    { page: 'markbook', title: 'Mark book', summary: 'SBA marks by class and task, with moderation and the term mark worked out.' },
    { page: 'plan-signoff', title: 'Lesson plan sign-off', summary: 'Weeks teachers have submitted, to check, sign or return with a comment.' },
  ]
  for (const t of tools) {
    if (!has(role, t.page)) continue
    out.push({
      key: `tool:${t.page}`,
      kind: 'teacher_resource',
      title: t.title,
      summary: t.summary,
      subjectId: null,
      grades: [],
      topicId: null,
      difficulty: null,
      teachersOnly: true,
      to: t.page,
      source: 'done-well',
    })
  }

  // Revision tools a learner works through on their own.
  if (isLearner(role)) {
    out.push(
      {
        key: `revision:countdown:${subjectId}`,
        kind: 'revision',
        title: 'Exam countdown and revision plan',
        summary: 'Days to each exam paper, and a day-by-day plan of what to revise first.',
        subjectId,
        grades: [],
        topicId: null,
        difficulty: null,
        teachersOnly: false,
        to: 'countdown',
        source: 'done-well',
      },
      {
        key: `revision:mistakes:${subjectId}`,
        kind: 'revision',
        title: 'Revise my mistakes',
        summary: 'The questions you got wrong, to try again until they stick.',
        subjectId,
        grades: [],
        topicId: null,
        difficulty: null,
        teachersOnly: false,
        to: 'mistakes',
        source: 'done-well',
      },
    )
  }

  if (isLearner(role) || isStaff(role)) {
    for (const p of await papersForSubject(subjectId)) {
      out.push({
        key: `paper:${p.id}`,
        kind: 'assessment',
        title: p.title,
        summary: `${p.totalMarks} marks · ${Math.round((p.durationMinutes / 60) * 10) / 10} hours · memo included`,
        subjectId,
        grades: [p.grade],
        topicId: null,
        difficulty: null,
        teachersOnly: false,
        to: `assessments/${p.id}`,
        source: 'done-well',
      })
      // The memo copy is for staff: a learner sees each answer after trying it.
      if (isStaff(role)) {
        out.push({
          key: `memo:${p.id}`,
          kind: 'memo',
          title: `${p.title}: memo`,
          summary: `Every answer with its marking memo, ${p.totalMarks} marks, ready to print.`,
          subjectId,
          grades: [p.grade],
          topicId: null,
          difficulty: null,
          teachersOnly: true,
          to: `assessments/${p.id}?view=memo`,
          source: 'done-well',
        })
      }
    }
  }
  return out
}

/** Published content items as catalogue entries. */
export function contentEntries(items: ContentItem[]): CatalogueEntry[] {
  return items
    .filter((i) => i.status === 'published' && i.kind !== 'question')
    .map((i) => ({
      key: `content:${i.id}`,
      kind: i.kind,
      title: i.title,
      summary: i.summary,
      subjectId: i.subject_id ?? (i.topic_id ? (getTopic(i.topic_id)?.subjectId ?? null) : null),
      grades: i.grade ? [i.grade] : [],
      topicId: i.topic_id,
      difficulty: i.difficulty,
      teachersOnly: i.audience === 'teachers',
      to: `resources/item/${i.id}`,
      source: 'content' as const,
    }))
}

export interface CatalogueFilter {
  text: string
  grade: Grade | null
  subjectId: string | null
  topicId: string | null
  kind: ContentKind | null
  difficulty: Difficulty | null
}

export function filterCatalogue(entries: CatalogueEntry[], f: CatalogueFilter): CatalogueEntry[] {
  const words = f.text.toLowerCase().split(/\s+/).filter(Boolean)
  return entries.filter((e) => {
    if (f.subjectId && e.subjectId && e.subjectId !== f.subjectId) return false
    if (f.grade && e.grades.length && !e.grades.includes(f.grade)) return false
    if (f.topicId && e.topicId !== f.topicId) return false
    if (f.kind && e.kind !== f.kind) return false
    if (f.difficulty && e.difficulty !== f.difficulty) return false
    if (words.length) {
      const hay = `${e.title} ${e.summary} ${e.topicId ? (getTopic(e.topicId)?.name ?? '') : ''}`.toLowerCase()
      if (!words.every((w) => hay.includes(w))) return false
    }
    return true
  })
}
