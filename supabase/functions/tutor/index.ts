// DONE WELL tutor: "Check my working".
//
// A learner sends a question -- typed, and/or a photo of their working -- and
// gets back where it went wrong, the correct method, the answer, and the
// curriculum topic it belongs to. The app then picks a real practice question
// on that topic from its own question bank; the model never writes questions.
//
// The model is reached through an AI gateway that speaks the OpenAI chat
// completions API (Vercel AI Gateway by default; Cloudflare AI Gateway's
// /compat endpoint works the same way), so the key never reaches the browser
// and the model can be changed without a new app build.
//
// Deploy:   supabase functions deploy tutor --no-verify-jwt
//           (the publishable key is not a JWT; the function checks the caller
//           itself, below)
// Secrets:  supabase secrets set AI_GATEWAY_API_KEY=... TUTOR_MODEL=...
//           optional: AI_GATEWAY_URL, TUTOR_DAILY_LIMIT,
//                     TUTOR_ALLOW_DEMO, TUTOR_DEMO_DAILY_LIMIT
// Database: STEP 19 of supabase/schema.sql (the tutor_requests table).
//
// Privacy: the question and photo are passed to the model and not stored. The
// only record kept is one row per request (who, which subject, when), which is
// what the daily limit counts.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const GATEWAY = (Deno.env.get('AI_GATEWAY_URL') ?? 'https://ai-gateway.vercel.sh/v1').replace(/\/$/, '')
const KEY = Deno.env.get('AI_GATEWAY_API_KEY') ?? ''
// Any model the gateway lists that reads images, as the gateway names it. Kept
// in a secret so it can be changed -- or pointed at a cheaper model -- without
// redeploying the app.
const MODEL = Deno.env.get('TUTOR_MODEL') ?? ''
const DAILY = Number(Deno.env.get('TUTOR_DAILY_LIMIT') ?? 20)
const ALLOW_DEMO = (Deno.env.get('TUTOR_ALLOW_DEMO') ?? 'false') === 'true'
const DEMO_DAILY = Number(Deno.env.get('TUTOR_DEMO_DAILY_LIMIT') ?? 3)

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

interface TopicIn {
  id: string
  name: string
  subtopics?: string[]
}

interface Body {
  subjectName: string
  subjectId: string
  grade: number
  question?: string
  image?: string
  topics: TopicIn[]
}

const MAX_TEXT = 4000
// A phone photo is resized in the browser to about 150 kB before it is sent.
const MAX_IMAGE = 2_000_000

function systemPrompt(b: Body) {
  const topics = b.topics
    .map((t) => `- ${t.id}: ${t.name}${t.subtopics?.length ? ` (sub-topics: ${t.subtopics.join('; ')})` : ''}`)
    .join('\n')
  return `You are a patient tutor for a South African learner in Grade ${b.grade} ${b.subjectName}, working to the CAPS curriculum.

The learner sends a question, and possibly their own working, as text and/or a photo. Your job:
1. Say in one sentence what the question asks.
2. If they gave working, find where it goes wrong -- the exact step -- and say what went wrong and why, kindly and plainly. Do not invent working they did not give. If their working is right, say so.
3. Show the correct method as short numbered steps, the way a CAPS memo would, ending with the answer.
4. Give one short exam tip.
5. Choose the topic it belongs to from this list (use the id exactly), and the sub-topic if one fits:
${topics}

Rules:
- South African conventions: decimal comma (2,5), rand as R (R1 250,00), SI units, spaces in large numbers (12 500).
- Write mathematics between single dollar signs as LaTeX, e.g. $x = \\frac{3}{4}$. Do not use dollar signs for anything else.
- Keep to the learner's grade. No new methods they would not have been taught.
- If the photo cannot be read, set "verdict" to "unreadable" and say what would help.
- If the request is not schoolwork for this subject, set "verdict" to "off_topic" and leave the other fields empty.
- Reply with ONLY a JSON object, no other text, in exactly this shape:
{"understood": string, "verdict": "correct" | "partly" | "incorrect" | "no_working" | "unreadable" | "off_topic", "mistakes": [{"where": string, "what": string, "why": string}], "method": [string], "answer": string, "tip": string, "topicId": string | null, "subtopic": string | null}`
}

async function sha256(text: string) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** The first {...} object in the reply, parsed; models sometimes wrap JSON in prose or a code fence. */
function firstJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}

const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '')
const VERDICTS = ['correct', 'partly', 'incorrect', 'no_working', 'unreadable', 'off_topic']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return reply(405, { error: 'method' })
  if (!KEY || !MODEL) return reply(503, { error: 'not_set_up' })

  let body: Body
  try {
    body = await req.json()
  } catch {
    return reply(400, { error: 'bad_request' })
  }
  const question = str(body.question, MAX_TEXT).trim()
  const image = typeof body.image === 'string' && body.image.startsWith('data:image/') ? body.image : ''
  if (!question && !image) return reply(400, { error: 'empty' })
  if (image.length > MAX_IMAGE) return reply(413, { error: 'image_too_big' })
  if (!Array.isArray(body.topics) || body.topics.length === 0 || body.topics.length > 60) return reply(400, { error: 'bad_request' })
  const grade = Number(body.grade)
  if (![10, 11, 12].includes(grade)) return reply(400, { error: 'bad_request' })

  // Who is asking: a signed-in learner, or -- only if switched on -- the demo.
  const admin = createClient(SUPABASE_URL, SERVICE)
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  let userId: string | null = null
  if (token && !token.startsWith('sb_')) {
    const { data } = await createClient(SUPABASE_URL, ANON).auth.getUser(token)
    userId = data.user?.id ?? null
  }
  let clientKey: string | null = null
  if (!userId) {
    if (!ALLOW_DEMO) return reply(401, { error: 'sign_in' })
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
    clientKey = await sha256(`done-well-tutor:${ip}`)
  }

  // The daily limit, counted over the last 24 hours.
  const since = new Date(Date.now() - 86_400_000).toISOString()
  const counted = admin.from('tutor_requests').select('id', { count: 'exact', head: true }).gte('created_at', since)
  const { count, error: countError } = await (userId ? counted.eq('user_id', userId) : counted.eq('client_key', clientKey))
  if (countError) return reply(503, { error: 'not_set_up' })
  const limit = userId ? DAILY : DEMO_DAILY
  if ((count ?? 0) >= limit) return reply(429, { error: 'limit', limit })

  const content: unknown[] = [
    { type: 'text', text: question ? `The learner wrote:\n${question}` : 'The learner sent only a photo of the question and their working.' },
  ]
  if (image) content.push({ type: 'image_url', image_url: { url: image } })

  let text = ''
  try {
    const res = await fetch(`${GATEWAY}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt({ ...body, grade }) },
          { role: 'user', content },
        ],
      }),
    })
    if (!res.ok) {
      console.error('gateway', res.status, (await res.text()).slice(0, 500))
      return reply(502, { error: 'model' })
    }
    const data = await res.json()
    text = str(data?.choices?.[0]?.message?.content, 20_000)
  } catch (e) {
    console.error('gateway', e)
    return reply(502, { error: 'model' })
  }

  await admin.from('tutor_requests').insert({ user_id: userId, client_key: clientKey, subject_id: str(body.subjectId, 40) })
  // Keep a month of rows and no more: the limit only ever looks back one day.
  await admin.from('tutor_requests').delete().lt('created_at', new Date(Date.now() - 30 * 86_400_000).toISOString())

  const out = firstJson(text)
  if (!out) return reply(502, { error: 'model' })
  const topicIds = new Set(body.topics.map((t) => t.id))
  const topicId = typeof out.topicId === 'string' && topicIds.has(out.topicId) ? out.topicId : null
  const subtopics = body.topics.find((t) => t.id === topicId)?.subtopics ?? []
  return reply(200, {
    understood: str(out.understood),
    verdict: VERDICTS.includes(out.verdict as string) ? out.verdict : 'no_working',
    mistakes: (Array.isArray(out.mistakes) ? out.mistakes : []).slice(0, 8).map((m: Record<string, unknown>) => ({
      where: str(m?.where, 400),
      what: str(m?.what, 800),
      why: str(m?.why, 800),
    })),
    method: (Array.isArray(out.method) ? out.method : []).slice(0, 15).map((s: unknown) => str(s, 600)),
    answer: str(out.answer, 600),
    tip: str(out.tip, 600),
    topicId,
    subtopic: typeof out.subtopic === 'string' && subtopics.includes(out.subtopic) ? out.subtopic : null,
    remaining: Math.max(0, limit - (count ?? 0) - 1),
  })
})
