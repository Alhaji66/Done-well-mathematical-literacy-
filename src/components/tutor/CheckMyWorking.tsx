import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { subjects } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { askTutor, compressImage, pickPractice, type TutorError, type TutorReply, type Verdict } from '@/lib/tutor'
import { MathText } from '@/components/practise/MathText'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CloseIcon, SparkleIcon } from '@/components/ui/Icons'
import type { Grade, Question } from '@/types'

const VERDICT: Record<Verdict, { label: string; badge: string }> = {
  correct: { label: 'Your working is right', badge: 'badge-green' },
  partly: { label: 'Partly right', badge: 'badge-gold' },
  incorrect: { label: 'Something went wrong', badge: 'badge-red' },
  no_working: { label: 'Worked solution', badge: 'badge-navy' },
  unreadable: { label: "Couldn't read the photo", badge: 'badge-slate' },
  off_topic: { label: 'Not a question for this subject', badge: 'badge-slate' },
}

const ERROR: Record<TutorError, string> = {
  sign_in: 'Sign in to check your own working. In the demo, the example below shows what the tutor does.',
  limit: "You've used today's checks. They come back in 24 hours — in the meantime, try the practice questions.",
  not_set_up: "The tutor isn't switched on for this school yet.",
  offline: "You're offline. The tutor needs a connection; practice questions and papers still work.",
  model: "The tutor couldn't answer just now. Try again in a minute.",
  image_too_big: 'That photo is too large. Try a closer photo of just the question and your working.',
  empty: 'Type your question, or add a photo of it.',
  unknown: "Something went wrong reaching the tutor. Check your connection and try again.",
}

/** What the demo shows in place of a live check: the example in the placeholder, worked. */
const EXAMPLE: { subjectId: string; grade: Grade; question: string; reply: TutorReply } = {
  subjectId: 'mathematics',
  grade: 10,
  question: 'Solve 2x + 5 = 17. My answer: 2x = 22, x = 11',
  reply: {
    understood: 'Solve the linear equation $2x + 5 = 17$ for $x$.',
    verdict: 'incorrect',
    mistakes: [
      {
        where: '$2x = 22$',
        what: 'The 5 was added to 17 instead of being taken away.',
        why: 'To move $+5$ to the other side you do the opposite operation: subtract 5 from both sides.',
      },
    ],
    method: ['$2x + 5 = 17$', 'Subtract 5 from both sides: $2x = 12$', 'Divide both sides by 2: $x = 6$', 'Check: $2(6) + 5 = 17$ ✓'],
    answer: '$x = 6$',
    tip: 'Always substitute your answer back into the original equation — it takes ten seconds and catches sign slips.',
    topicId: 'math-algebra',
    subtopic: null,
  },
}

/**
 * "Check my working": type a question or photograph the working, and see where
 * it went wrong, the right method, and a practice question on the same topic.
 *
 * In a real account the check goes to the tutor function. In the demo it does
 * too if the school has switched demo checks on; otherwise the demo shows the
 * worked example, so the page still shows what it is for.
 */
export function CheckMyWorking({ mode, subjectId: initialSubject, grade: initialGrade }: { mode: 'demo' | 'account'; subjectId: string; grade: Grade }) {
  const [subjectId, setSubjectId] = useState(initialSubject)
  const [grade, setGrade] = useState<Grade>(initialGrade)
  const [question, setQuestion] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<TutorError | null>(null)
  const [reply, setReply] = useState<TutorReply | null>(null)
  const [replyFor, setReplyFor] = useState<{ subjectId: string; grade: Grade } | null>(null)
  const [isExample, setIsExample] = useState(false)
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const fileRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  const onPhoto = async (file: File | undefined) => {
    if (!file) return
    try {
      setImage(await compressImage(file))
      setError(null)
    } catch {
      setError('image_too_big')
    }
  }

  const submit = async () => {
    if (!question.trim() && !image) {
      setError('empty')
      return
    }
    setBusy(true)
    setError(null)
    setReply(null)
    const subjectName = subjects.find((s) => s.id === subjectId)?.name ?? subjectId
    const res = await askTutor({ subjectId, subjectName, grade, question: question.trim(), image: image ?? undefined })
    setBusy(false)
    if (res.reply) {
      setReply(res.reply)
      setReplyFor({ subjectId, grade })
      setIsExample(false)
    } else {
      const err = res.error ?? 'unknown'
      // The demo has no account, so unless the school has switched demo checks
      // on, the check cannot go through: show the worked example instead of an
      // error, for anything but a problem with what was typed or the signal.
      const showExample = mode === 'demo' && !['empty', 'image_too_big', 'offline'].includes(err)
      setError(showExample ? 'sign_in' : err)
      if (showExample) {
        setReply(EXAMPLE.reply)
        setReplyFor({ subjectId: EXAMPLE.subjectId, grade: EXAMPLE.grade })
        setIsExample(true)
      }
    }
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="DONE WELL tutor"
        title="Check my working"
        description="Type a question or take a photo of your working. You'll see where it went wrong, the correct method, and a new question to practise."
      />

      <div className="card space-y-4 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-navy-800">Subject</span>
            <select className="select mt-1.5 w-full" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-navy-800">Grade</span>
            <select className="select mt-1.5 w-full" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
              {[10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-navy-800">Your question (and your working, if you like)</span>
          <textarea
            className="input mt-1.5 min-h-[7rem] w-full"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={EXAMPLE.question.replace('. My', '.\nMy')}
            maxLength={4000}
          />
        </label>

        {image ? (
          <div className="relative w-fit">
            <img src={image} alt="Your working" className="max-h-48 rounded-lg border border-navy-200" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-white"
              aria-label="Remove photo"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              void onPhoto(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>
            {image ? 'Change photo' : 'Add photo of working'}
          </button>
          <button type="button" className="btn-primary" onClick={() => void submit()} disabled={busy || !online}>
            <SparkleIcon className="h-4 w-4" />
            {busy ? 'Checking…' : 'Explain my mistakes'}
          </button>
        </div>
        <p className="text-xs text-navy-500">
          {online
            ? 'Your question and photo are sent to an AI model to be checked. DONE WELL does not keep them. Photos are shrunk first, to save data.'
            : "You're offline — the tutor needs a connection."}
        </p>
      </div>

      <div ref={resultRef} className="space-y-4">
        {error ? (
          <div className={`card p-4 text-sm ${error === 'sign_in' ? 'border-gold-200 bg-gold-50 text-navy-800' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>
            {ERROR[error]}
            {error === 'sign_in' ? (
              <>
                {' '}
                <Link to="/account/sign-in" className="font-semibold underline">
                  Sign in
                </Link>
              </>
            ) : null}
          </div>
        ) : null}

        {reply && replyFor ? <TutorResult reply={reply} subjectId={replyFor.subjectId} grade={replyFor.grade} example={isExample ? EXAMPLE.question : null} /> : null}
      </div>
    </div>
  )
}

function TutorResult({ reply, subjectId, grade, example }: { reply: TutorReply; subjectId: string; grade: Grade; example: string | null }) {
  const v = VERDICT[reply.verdict]
  const topic = reply.topicId ? getTopic(reply.topicId) : undefined
  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-4 sm:p-5">
        {example ? (
          <p className="rounded-lg bg-navy-50 p-3 text-sm text-navy-700">
            <span className="font-semibold">Example question:</span> <MathText>{example}</MathText>
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <span className={v.badge}>{v.label}</span>
          {topic ? <span className="badge-slate">{topic.name}</span> : null}
        </div>
        {reply.understood ? (
          <p className="text-sm text-navy-700">
            <MathText>{reply.understood}</MathText>
          </p>
        ) : null}

        {reply.mistakes.length ? (
          <div>
            <h3 className="text-sm font-bold text-navy-900">Where it went wrong</h3>
            <ul className="mt-2 space-y-3">
              {reply.mistakes.map((m, i) => (
                <li key={i} className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm">
                  {m.where ? (
                    <p className="font-semibold text-rose-900">
                      <MathText>{m.where}</MathText>
                    </p>
                  ) : null}
                  <p className="mt-1 text-navy-800">
                    <MathText>{m.what}</MathText>
                  </p>
                  {m.why ? (
                    <p className="mt-1 text-navy-600">
                      <MathText>{m.why}</MathText>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {reply.method.length ? (
          <div>
            <h3 className="text-sm font-bold text-navy-900">The correct method</h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-navy-800">
              {reply.method.map((s, i) => (
                <li key={i}>
                  <MathText>{s}</MathText>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {reply.answer ? (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
            Answer: <MathText>{reply.answer}</MathText>
          </p>
        ) : null}
        {reply.tip ? (
          <p className="text-sm text-navy-700">
            <span className="font-semibold">Exam tip:</span> <MathText>{reply.tip}</MathText>
          </p>
        ) : null}
        {typeof reply.remaining === 'number' ? <p className="text-xs text-navy-500">{reply.remaining} checks left today.</p> : null}
      </div>

      {reply.topicId ? <Practice subjectId={subjectId} grade={grade} topicId={reply.topicId} subtopic={reply.subtopic} verdict={reply.verdict} /> : null}
    </div>
  )
}

/** A real question from the bank on the same topic, with "Another question". */
function Practice({ subjectId, grade, topicId, subtopic, verdict }: { subjectId: string; grade: Grade; topicId: string; subtopic: string | null; verdict: Verdict }) {
  const [q, setQ] = useState<Question | null | undefined>(undefined)
  const seen = useRef(new Set<string>())
  const next = async () => {
    const found = await pickPractice(subjectId, grade, topicId, subtopic, seen.current, verdict)
    if (found) seen.current.add(found.id)
    setQ(found)
  }
  useEffect(() => {
    seen.current = new Set()
    void next()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, grade, topicId, subtopic, verdict])

  if (q === undefined) return null
  if (q === null) return null
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold text-navy-900">Practise one like it</h3>
        <button type="button" className="text-sm font-semibold text-navy-700 underline" onClick={() => void next()}>
          Another question
        </button>
      </div>
      <QuestionCard key={q.id} question={q} index={0} label="Practice question" />
    </div>
  )
}
