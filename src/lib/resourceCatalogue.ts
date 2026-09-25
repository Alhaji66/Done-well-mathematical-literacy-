import { topicsForSubject, getTopic } from '@/data/topics'
import { papersForSubject } from '@/data/papers'
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
        to: isLearner(role) ? `practise?subject=${subjectId}&topic=${t.id}` : `resources/topic/${t.id}`,
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
