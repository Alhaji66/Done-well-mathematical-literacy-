// DONE WELL: mark a past or predicted paper written under exam conditions.
//
// The learner writes the paper in the app (STEP 41: start_paper, save_paper_
// answers, submit_paper). When it is handed in -- or its time has run out --
// the app calls this function, which:
//   1. checks the caller is the learner whose attempt it is;
//   2. closes the attempt if its time is up and it was never handed in;
//   3. reads the paper and its memo from the private content pack on the
//      server (the browser's copy is never trusted for marking);
//   4. marks multiple choice exactly, and every written answer against the
//      memo through the AI gateway, with where each mark was lost;
//   5. writes the marks, percentage and per-topic totals to the attempt --
//      only this function can, with the service role -- and tells the
//      learner's teacher straight away.
//
// If the gateway is not set up, is over the daily limit, or fails, the answers
// are marked by the values the memo asks for instead (a number in a memo step
// found in the learner's answer earns that step), and the result is flagged
// PROVISIONAL so learner and teacher know a written explanation may deserve
// more. A provisional attempt can be marked again later.
//
// Deploy:   supabase functions deploy mark-paper --no-verify-jwt
//           (it checks the caller itself, as the tutor function does)
// Secrets:  the tutor's AI_GATEWAY_API_KEY and TUTOR_MODEL are used; optional
//           MARKING_MODEL (a different model for marking), AI_GATEWAY_URL,
//           PAPER_MARK_DAILY_LIMIT (AI-marked papers per learner per day, 6).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const GATEWAY = (Deno.env.get('AI_GATEWAY_URL') ?? 'https://ai-gateway.vercel.sh/v1').replace(/\/$/, '')
const KEY = Deno.env.get('AI_GATEWAY_API_KEY') ?? ''
const MODEL = Deno.env.get('MARKING_MODEL') || Deno.env.get('TUTOR_MODEL') || ''
const DAILY = Number(Deno.env.get('PAPER_MARK_DAILY_LIMIT') ?? 6)
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

interface MemoStep {
  code: string
  marks: number
  text: string
}
interface Item {
  id: string
  label: string
  topicId: string
  marks: number
  prompt: string
  context?: string
  answer: string
  explanation?: string
  memo?: MemoStep[]
  options?: { id: string; label: string }[]
  correctOptionId?: string
}
interface Paper {
  id: string
  subjectId: string
  grade: number
  title: string
  totalMarks: number
  sections: { number: number; title: string; items: Item[] }[]
}
interface Mark {
  awarded: number
  outOf: number
  /** What was right and where marks were lost, for the learner. */
  feedback: string
  how: 'mcq' | 'ai' | 'auto' | 'blank'
}

const SUBJECT_NAMES: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
  'physical-sciences': 'Physical Sciences',
  'life-sciences': 'Life Sciences',
}

// ------------------------------------------------------------------ content

const packs = new Map<string, { version: string; papers: Paper[] }>()

async function paperFor(admin: ReturnType<typeof createClient>, subject: string, paperId: string): Promise<Paper | null> {
  const { data: m } = await admin.storage.from('content').download('manifest.json')
  if (!m) return null
  const manifest = JSON.parse(await m.text()) as { subjects: Record<string, { version: string; file: string }> }
  const entry = manifest.subjects?.[subject]
  if (!entry) return null
  let pack = packs.get(subject)
  if (!pack || pack.version !== entry.version) {
    const { data } = await admin.storage.from('content').download(entry.file)
    if (!data) return null
    const parsed = JSON.parse(await data.text()) as { papers: Paper[] }
    pack = { version: entry.version, papers: parsed.papers }
    packs.set(subject, pack)
  }
  return pack.papers.find((p) => p.id === paperId) ?? null
}

// ----------------------------------------------------------- marking by value

/** Numbers in a text, as plain decimals: "R1 385,00" → 1385, "13,6%" → 13.6. */
function numbersIn(text: string): number[] {
  const clean = text.replace(/(\d)[\s ](?=\d{3}\b)/g, '$1')
  return [...clean.matchAll(/-?\d+(?:[.,]\d+)?/g)].map((m) => Number(m[0].replace(',', '.')))
}
const near = (a: number, b: number) => Math.abs(a - b) <= Math.max(0.011, Math.abs(b) * 0.005)
const words = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean)

/** Marks an answer can earn without reading it for sense: the values the memo asks for. */
function markByValue(item: Item, answer: string): Mark {
  const got = numbersIn(answer)
  const has = (n: number) => got.some((g) => near(g, n))
  if (item.memo?.length) {
    let awarded = 0
    const missed: string[] = []
    for (const step of item.memo) {
      const want = numbersIn(step.text)
      if (want.length && want.every(has)) awarded += step.marks
      else missed.push(`${step.text} (${step.marks})`)
    }
    return {
      awarded: Math.min(awarded, item.marks),
      outOf: item.marks,
      feedback: missed.length ? `Not found in your answer: ${missed.slice(0, 4).join('; ')}.` : 'Every value the memo asks for is in your answer.',
      how: 'auto',
    }
  }
  const want = numbersIn(item.answer)
  if (want.length) {
    const ok = want.every(has)
    return { awarded: ok ? item.marks : 0, outOf: item.marks, feedback: ok ? 'Your answer matches the memo.' : `The memo's answer is ${item.answer}.`, how: 'auto' }
  }
  const expected = words(item.answer)
  const ok = expected.length > 0 && expected.length <= 4 && expected.every((w) => words(answer).includes(w))
  return { awarded: ok ? item.marks : 0, outOf: item.marks, feedback: ok ? 'Your answer matches the memo.' : `The memo's answer is: ${item.answer}`, how: 'auto' }
}

// ------------------------------------------------------------ marking by AI

function systemPrompt(subject: string, grade: number) {
  return `You are an experienced NSC marker for Grade ${grade} ${subject} in South Africa, marking a learner's paper against the official-style memo.

For each question you get: its marks, the question (with its context), the memo (mark allocations with codes, or a model answer), and what the learner wrote.

Mark as an NSC marker would:
- Award whole marks only, from 0 to the question's marks.
- Follow the memo's allocation. M = method, A = accuracy, CA = consistent accuracy (follow through an earlier error), SF = correct substitution into a formula, R / J = reason or justification, RT = reading from a table or graph, C = conversion.
- Accept equivalent correct answers, other correct methods, rounding that is correct, and South African notation (decimal comma, R1 250,00).
- A correct final answer with no working earns the accuracy marks the memo allows for it, not the method marks, unless the memo says "answer only: full marks".
- An explanation earns its marks when it makes the memo's point in the learner's own words.
- Never award marks for something the learner did not write.

For each question, write feedback for the learner in one or two short, kind sentences: what they did right, and exactly where and why they lost marks. If they earned full marks, say so briefly.

Reply with ONLY a JSON object, no other text: {"results": [{"id": string, "awarded": number, "feedback": string}]} with one entry per question, using the ids given.`
}

function questionBlock(item: Item, context: string, answer: string) {
  const memo = item.memo?.length
    ? item.memo.map((s) => `  [${s.code} ${s.marks}] ${s.text}`).join('\n')
    : `  Model answer: ${item.answer}${item.explanation ? `\n  Note: ${item.explanation}` : ''}`
  return `### id: ${item.id} (Question ${item.label}, ${item.marks} marks)
Context: ${context ? context.slice(0, 1500) : '(none)'}
Question: ${item.prompt}
Memo:
${memo}
Learner's answer: ${answer.slice(0, 3000)}`
}

async function markBatch(subject: string, grade: number, batch: { item: Item; context: string; answer: string }[]): Promise<Map<string, Mark> | null> {
  try {
    const res = await fetch(`${GATEWAY}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        temperature: 0,
        messages: [
          { role: 'system', content: systemPrompt(subject, grade) },
          { role: 'user', content: batch.map((b) => questionBlock(b.item, b.context, b.answer)).join('\n\n') },
        ],
      }),
    })
    if (!res.ok) {
      console.error('gateway', res.status, (await res.text()).slice(0, 400))
      return null
    }
    const data = await res.json()
    const text: string = data?.choices?.[0]?.message?.content ?? ''
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start < 0 || end <= start) return null
    const parsed = JSON.parse(text.slice(start, end + 1)) as { results?: { id?: string; awarded?: number; feedback?: string }[] }
    const out = new Map<string, Mark>()
    for (const r of parsed.results ?? []) {
      const b = batch.find((x) => x.item.id === r.id)
      if (!b) continue
      const awarded = Math.max(0, Math.min(b.item.marks, Math.round(Number(r.awarded) || 0)))
      out.set(b.item.id, { awarded, outOf: b.item.marks, feedback: String(r.feedback ?? '').slice(0, 600), how: 'ai' })
    }
    // Every question in the batch must come back, or the batch is not trusted.
    return batch.every((b) => out.has(b.item.id)) ? out : null
  } catch (e) {
    console.error('gateway', e)
    return null
  }
}

/** Runs the batches a few at a time, so a 40-question paper is not 40 calls at once. */
async function inPool<T, R>(xs: T[], size: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(xs.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(size, xs.length) }, async () => {
      while (next < xs.length) {
        const i = next++
        out[i] = await fn(xs[i])
      }
    }),
  )
  return out
}

const levelOf = (percent: number) => {
  const p = Math.round(percent)
  return p >= 80 ? 7 : p >= 70 ? 6 : p >= 60 ? 5 : p >= 50 ? 4 : p >= 40 ? 3 : p >= 30 ? 2 : 1
}

// ------------------------------------------------------------------- handler

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return reply(405, { error: 'method' })

  let body: { attemptId?: string; remark?: boolean }
  try {
    body = await req.json()
  } catch {
    return reply(400, { error: 'bad_request' })
  }
  const attemptId = String(body.attemptId ?? '')
  if (!/^[0-9a-f-]{36}$/i.test(attemptId)) return reply(400, { error: 'bad_request' })

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token || token.startsWith('sb_')) return reply(401, { error: 'sign_in' })
  const { data: who } = await createClient(SUPABASE_URL, ANON).auth.getUser(token)
  const userId = who.user?.id
  if (!userId) return reply(401, { error: 'sign_in' })

  const admin = createClient(SUPABASE_URL, SERVICE)
  const { data: attempt } = await admin.from('paper_attempts').select('*').eq('id', attemptId).maybeSingle()
  if (!attempt || attempt.learner_id !== userId) return reply(404, { error: 'not_found' })

  const now = Date.now()
  const timeUp = new Date(attempt.deadline).getTime() <= now
  if (!attempt.submitted_at && !timeUp) return reply(409, { error: 'still_writing' })
  if (attempt.status === 'marked' && !(body.remark && attempt.provisional)) return reply(200, { status: 'marked' })
  // Another call is marking it now; a mark left half-done for 5 minutes is taken over.
  if (attempt.status === 'marking' && now - new Date(attempt.marked_at ?? 0).getTime() < 300_000) return reply(202, { status: 'marking' })

  // Claim the attempt, closing it at its deadline if it was never handed in.
  const { data: claimed } = await admin
    .from('paper_attempts')
    .update({ status: 'marking', marked_at: new Date().toISOString(), submitted_at: attempt.submitted_at ?? attempt.deadline })
    .eq('id', attemptId)
    .eq('status', attempt.status)
    .select('id')
  if (!claimed?.length) return reply(202, { status: 'marking' })

  const paper = await paperFor(admin, attempt.subject_id, attempt.paper_id)
  if (!paper) {
    await admin.from('paper_attempts').update({ status: 'submitted' }).eq('id', attemptId)
    return reply(503, { error: 'paper_unavailable' })
  }

  const answers = (attempt.answers ?? {}) as Record<string, unknown>
  const marks: Record<string, Mark> = {}
  const forAi: { item: Item; context: string; answer: string }[] = []
  for (const section of paper.sections) {
    let context = ''
    for (const item of section.items) {
      if (item.context) context = item.context
      const raw = answers[item.id]
      const answer = typeof raw === 'string' ? raw.trim() : ''
      if (item.options?.length && item.correctOptionId) {
        const right = answer === item.correctOptionId
        const correct = item.options.find((o) => o.id === item.correctOptionId)?.label ?? item.answer
        marks[item.id] = { awarded: right ? item.marks : 0, outOf: item.marks, feedback: right ? 'Correct.' : answer ? `The correct option is: ${correct}.` : 'No option was chosen.', how: 'mcq' }
      } else if (!answer) {
        marks[item.id] = { awarded: 0, outOf: item.marks, feedback: 'No answer was written.', how: 'blank' }
      } else {
        forAi.push({ item, context, answer })
      }
    }
  }

  // AI marking, within the learner's daily allowance.
  let aiUsed = false
  let provisional = false
  let useAi = Boolean(KEY && MODEL) && forAi.length > 0
  if (useAi) {
    const since = new Date(now - 86_400_000).toISOString()
    const { count } = await admin
      .from('paper_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('learner_id', userId)
      .eq('marked_by', 'ai')
      .gte('marked_at', since)
    if ((count ?? 0) >= DAILY) useAi = false
  }
  if (useAi) {
    const batches: (typeof forAi)[] = []
    for (let i = 0; i < forAi.length; i += 8) batches.push(forAi.slice(i, i + 8))
    const subject = SUBJECT_NAMES[paper.subjectId] ?? paper.subjectId
    const results = await inPool(batches, 3, (b) => markBatch(subject, paper.grade, b))
    results.forEach((r, i) => {
      for (const b of batches[i]) {
        const m = r?.get(b.item.id)
        if (m) {
          marks[b.item.id] = m
          aiUsed = true
        } else {
          marks[b.item.id] = markByValue(b.item, b.answer)
          provisional = true
        }
      }
    })
  } else {
    for (const b of forAi) marks[b.item.id] = markByValue(b.item, b.answer)
    provisional = forAi.length > 0
  }

  let awarded = 0
  let total = 0
  const perTopic: Record<string, { awarded: number; outOf: number }> = {}
  for (const section of paper.sections)
    for (const item of section.items) {
      const m = marks[item.id]
      awarded += m.awarded
      total += item.marks
      const t = (perTopic[item.topicId] ??= { awarded: 0, outOf: 0 })
      t.awarded += m.awarded
      t.outOf += item.marks
    }
  const percent = total ? Math.round((awarded / total) * 1000) / 10 : 0

  const { error: writeError } = await admin
    .from('paper_attempts')
    .update({
      status: 'marked',
      marked_at: new Date().toISOString(),
      marked_by: aiUsed ? 'ai' : 'auto',
      provisional,
      marks_awarded: awarded,
      marks_total: total,
      percent,
      marking: marks,
      per_topic: perTopic,
    })
    .eq('id', attemptId)
  if (writeError) {
    console.error('write', writeError)
    await admin.from('paper_attempts').update({ status: 'submitted' }).eq('id', attemptId)
    return reply(500, { error: 'write' })
  }

  // Tell the teacher now: the class teacher(s) of this subject and grade, or,
  // with no class, the school's teachers and HOD of the subject.
  if (attempt.school_id && !body.remark) {
    const level = levelOf(percent)
    const data = { learner_id: userId, attempt_id: attemptId, title: attempt.title, subject: attempt.subject_id, percent: Math.round(percent), level }
    const { data: classes } = await admin
      .from('class_members')
      .select('classes!inner(teacher_id, subject_id, grade, school_id)')
      .eq('learner_id', userId)
      .eq('classes.subject_id', attempt.subject_id)
      .eq('classes.grade', attempt.grade)
      .eq('classes.school_id', attempt.school_id)
    let recipients = [...new Set((classes ?? []).map((c: { classes: { teacher_id: string | null } }) => c.classes.teacher_id).filter(Boolean))] as string[]
    if (!recipients.length) {
      const { data: staff } = await admin
        .from('profiles')
        .select('id')
        .eq('school_id', attempt.school_id)
        .eq('subject_id', attempt.subject_id)
        .in('role', ['teacher', 'hod'])
        .not('staff_approved_at', 'is', null)
      recipients = (staff ?? []).map((s: { id: string }) => s.id)
    }
    const rows = recipients.map((id) => ({ recipient_id: id, kind: 'paper.marked', data, link: `paper-results?attempt=${attemptId}` }))
    rows.push({ recipient_id: userId, kind: 'paper.own_marked', data, link: `assessments/${attempt.paper_id}` })
    await admin.from('notifications').insert(rows)
  }

  return reply(200, { status: 'marked', percent, provisional })
})
