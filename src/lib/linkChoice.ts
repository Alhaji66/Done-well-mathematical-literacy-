import { subjects } from '@/data/subjects'
import { topics } from '@/data/topics'
import type { Grade } from '@/types'

/**
 * What a link into a teacher's page asked for: `?subject=…&grade=…&topic=…&week=…`.
 * The resource centre opens the lesson plans, worksheet builder and SBA tasks
 * at the right subject, grade, topic and ATP week this way. Anything that does
 * not name a real subject, grade or topic is ignored, so a stale or edited link
 * falls back to the page's own starting choice instead of an empty screen.
 */
export interface LinkChoice {
  subjectId?: string
  grade?: Grade
  topicId?: string
  week?: number
}

export function linkChoice(params: URLSearchParams): LinkChoice {
  const out: LinkChoice = {}
  const subject = params.get('subject')
  if (subject && subjects.some((s) => s.id === subject)) out.subjectId = subject
  const grade = Number(params.get('grade'))
  if (grade === 10 || grade === 11 || grade === 12) out.grade = grade
  const topic = params.get('topic')
  const t = topic ? topics.find((x) => x.id === topic) : undefined
  if (t && (!out.subjectId || t.subjectId === out.subjectId) && (!out.grade || t.grades.includes(out.grade))) {
    out.topicId = t.id
    out.subjectId = t.subjectId
  }
  const week = params.get('week')
  if (week !== null && /^\d+$/.test(week)) out.week = Number(week)
  return out
}
