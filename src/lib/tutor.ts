import { supabase } from '@/lib/supabaseClient'
import { topicsForSubject } from '@/data/topics'
import { subtopicFor, subtopicRulesFor } from '@/data/subtopics'
import { filterSubjectQuestions } from '@/data/questionBank'
import type { Grade, Question } from '@/types'

/**
 * "Check my working": the app side of supabase/functions/tutor.
 *
 * The function sends the learner's question (and photo) to a model through the
 * AI gateway and returns an explanation plus the topic it belongs to. The
 * practice question is chosen HERE, from DONE WELL's own reviewed bank, never
 * written by the model: it comes with a memo, and it is the same question a
 * teacher would see.
 */

export type Verdict = 'correct' | 'partly' | 'incorrect' | 'no_working' | 'unreadable' | 'off_topic'

export interface TutorReply {
  understood: string
  verdict: Verdict
  mistakes: { where: string; what: string; why: string }[]
  method: string[]
  answer: string
  tip: string
  topicId: string | null
  subtopic: string | null
  /** Checks left today. */
  remaining?: number
}

export type TutorError = 'sign_in' | 'limit' | 'not_set_up' | 'offline' | 'model' | 'image_too_big' | 'empty' | 'unknown'

export async function askTutor(req: {
  subjectId: string
  subjectName: string
  grade: Grade
  question: string
  image?: string
}): Promise<{ reply?: TutorReply; error?: TutorError }> {
  if (!supabase) return { error: 'not_set_up' }
  if (typeof navigator !== 'undefined' && !navigator.onLine) return { error: 'offline' }
  // The model is given this grade's topics, with their sub-topics, and must
  // choose among them -- so the practice question can be looked up exactly.
  const topics = topicsForSubject(req.subjectId, req.grade).map((t) => ({
    id: t.id,
    name: t.name,
    subtopics: [...new Set(subtopicRulesFor(t.id).map((r) => r.name))],
  }))
  const { data, error } = await supabase.functions.invoke<TutorReply>('tutor', { body: { ...req, topics } })
  if (!error && data) return { reply: data }
  // A FunctionsHttpError carries the function's own reply; anything else is
  // the network, or the function not being deployed yet.
  const context = (error as { context?: Response } | null)?.context
  if (context && typeof context.json === 'function') {
    try {
      const body = (await context.json()) as { error?: TutorError }
      if (body?.error) return { error: body.error }
    } catch {
      // not JSON
    }
    if (context.status === 404) return { error: 'not_set_up' }
  }
  return { error: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'unknown' }
}

/**
 * A phone photo, made small enough to send on a data bundle: at most 1 280 px
 * on its longer side, as a JPEG at 70% quality -- typically 100-200 kB instead
 * of 3-5 MB, and still easily legible handwriting.
 */
export async function compressImage(file: File, maxSide = 1280, quality = 0.7): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = url
    })
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no canvas')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * A practice question on the topic the tutor named: from the same sub-topic
 * where one was named and the bank has one, otherwise from the topic -- and not
 * a Challenge one straight after a wrong answer. Skips the
 * ones already shown, so "Another question" gives a new one each time.
 */
export async function pickPractice(
  subjectId: string,
  grade: Grade,
  topicId: string,
  subtopic: string | null,
  exclude: Set<string>,
  verdict?: Verdict,
): Promise<Question | null> {
  const pool = (await filterSubjectQuestions(subjectId, { topicId, grade })).filter((q) => !exclude.has(q.id))
  if (!pool.length) return null
  const same = subtopic ? pool.filter((q) => subtopicFor(q) === subtopic) : []
  let from = same.length ? same : pool
  // Someone who just got it wrong practises at their level first, not a Challenge question.
  if (verdict === 'incorrect' || verdict === 'partly') {
    const gentler = from.filter((q) => q.difficulty !== 'Challenge')
    if (gentler.length) from = gentler
  }
  return from[Math.floor(Math.random() * from.length)]
}
