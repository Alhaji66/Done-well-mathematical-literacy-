import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Paper } from '@/data/papers'
import { getTopic } from '@/data/topics'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { PaperNotice } from '@/components/assessments/PaperRunner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LEVEL_NAMES, levelOf } from '@/lib/levels'
import {
  fetchMyPaperAttempts,
  fetchPaperAttempt,
  memoOpen,
  requestMarking,
  savePaperAnswers,
  startPaper,
  submitPaper,
  timeLeft,
  type MarkError,
  type PaperAttempt,
  type StartError,
} from '@/lib/paperAttempts'
import { recordAnswer } from '@/lib/mistakes'

/**
 * A learner writes a past or predicted paper under exam conditions (STEP 41).
 *
 * Before: what will happen, and a Start button. Writing: every question with
 * a box for the answer, the clock from the server's deadline, answers saved
 * as they go -- and nothing about the right answers anywhere. After handing
 * in, or when the time runs out: the memo opens, the paper is marked, and the
 * learner sees their mark, level, the topics where marks went, and each
 * question's marks with where they were lost.
 */

const SAVE_DELAY = 1500
const localKey = (attemptId: string) => `donewell.paperAnswers.${attemptId}`

function readLocal(attemptId: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(localKey(attemptId)) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}
function writeLocal(attemptId: string, answers: Record<string, string> | null) {
  try {
    if (answers) localStorage.setItem(localKey(attemptId), JSON.stringify(answers))
    else localStorage.removeItem(localKey(attemptId))
  } catch {
    // A private window: the server copy is the only copy, which is fine.
  }
}

const START_ERRORS: Record<StartError, string> = {
  no_access: 'Writing a full paper and having it marked needs your school’s licence, a personal plan or the free trial.',
  not_set_up: 'Writing papers under exam conditions is not switched on yet. Ask your school to run the latest database update.',
  offline: 'You are offline. Connect to start the paper, so the clock and your answers are kept safely.',
  unknown: 'The paper could not be started. Please try again.',
}

const MARK_ERRORS: Record<MarkError, string> = {
  not_set_up: 'Automatic marking is not switched on yet, so the memo is open for you to check your answers.',
  still_writing: 'The paper is still open.',
  paper_unavailable: 'The paper could not be loaded for marking. Try again in a moment.',
  offline: 'You are offline. Your answers are handed in; connect again to have the paper marked.',
  unknown: 'Marking did not finish. Try again in a moment.',
}

export function PaperExam({ paper }: { paper: Paper }) {
  const [attempts, setAttempts] = useState<PaperAttempt[] | null | undefined>(undefined)
  const [attempt, setAttempt] = useState<PaperAttempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [now, setNow] = useState(Date.now())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<'saved' | 'saving' | 'offline' | ''>('')
  const [markError, setMarkError] = useState<MarkError | null>(null)
  const [remarking, setRemarking] = useState(false)
  const saveTimer = useRef<number | null>(null)
  const answersRef = useRef(answers)
  answersRef.current = answers

  const items = useMemo(() => paper.sections.flatMap((s) => s.items), [paper])
  const writing = Boolean(attempt && !memoOpen(attempt, now))

  // Load this learner's attempts at the paper; reopen an open one.
  useEffect(() => {
    let cancelled = false
    fetchMyPaperAttempts(paper.id).then((rows) => {
      if (cancelled) return
      setAttempts(rows)
      // The latest attempt: still being written, waiting to be marked, or marked.
      const latest = rows?.[0] ?? null
      if (latest) {
        setAttempt(latest)
        setAnswers(latest.submitted_at ? latest.answers : { ...latest.answers, ...readLocal(latest.id) })
      }
    })
    return () => {
      cancelled = true
    }
  }, [paper.id])

  // The clock.
  useEffect(() => {
    if (!writing) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [writing])

  const flush = useCallback(async () => {
    if (!attempt || !writing) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = null
    setSaved('saving')
    const ok = await savePaperAnswers(attempt.id, answersRef.current)
    setSaved(ok ? 'saved' : 'offline')
  }, [attempt, writing])

  // Save when the learner leaves the tab, so a closed phone loses nothing.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void flush()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [flush])

  const setAnswer = (itemId: string, value: string) => {
    if (!attempt || !writing) return
    const next = { ...answersRef.current, [itemId]: value }
    setAnswers(next)
    writeLocal(attempt.id, next)
    setSaved('saving')
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => void flush(), SAVE_DELAY)
  }

  const mark = useCallback(async (a: PaperAttempt, remark = false) => {
    setMarkError(null)
    const r = await requestMarking(a.id, remark)
    if (r.error) {
      setMarkError(r.error)
      return
    }
    // Poll until the marks are written (marking a full paper takes a minute or so).
    for (let i = 0; i < 60; i++) {
      const fresh = await fetchPaperAttempt(a.id)
      if (fresh?.status === 'marked' && (!remark || fresh.marked_at !== a.marked_at)) {
        setAttempt(fresh)
        setAnswers(fresh.answers)
        setAttempts((xs) => [fresh, ...(xs ?? []).filter((x) => x.id !== fresh.id)])
        // Questions not given full marks go to My Mistakes, as in practice.
        for (const item of items) {
          const m = fresh.marking?.[item.id]
          if (m) void recordAnswer(item.id, item.topicId, 'paper', m.awarded >= m.outOf)
        }
        return
      }
      await new Promise((res) => window.setTimeout(res, 4000))
    }
    setMarkError('unknown')
  }, [items])

  const handIn = useCallback(
    async (auto: boolean) => {
      if (!attempt) return
      if (!auto && !window.confirm('Hand in your paper? You cannot change your answers after this.')) return
      setBusy(true)
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      const done = await submitPaper(attempt.id, answersRef.current)
      setBusy(false)
      if (!done) {
        setError('The paper could not be handed in. Check your connection and try again; your answers are kept on this phone.')
        return
      }
      writeLocal(attempt.id, null)
      setAttempt(done)
      setAnswers(done.answers)
      void mark(done)
    },
    [attempt, mark],
  )

  // Time up: hand in automatically, once.
  const autoSubmitted = useRef(false)
  useEffect(() => {
    if (attempt && !attempt.submitted_at && memoOpen(attempt, now) && !autoSubmitted.current) {
      autoSubmitted.current = true
      void handIn(true)
    }
  }, [attempt, now, handIn])

  // A paper handed in earlier but never marked (offline, say): mark it now.
  const markedOnce = useRef(false)
  useEffect(() => {
    if (attempt?.submitted_at && attempt.status !== 'marked' && !markedOnce.current) {
      markedOnce.current = true
      void mark(attempt)
    }
  }, [attempt, mark])

  const begin = async () => {
    setBusy(true)
    setError('')
    const r = await startPaper(paper)
    setBusy(false)
    if (r.error || !r.attempt) return setError(START_ERRORS[r.error ?? 'unknown'])
    autoSubmitted.current = false
    markedOnce.current = false
    setAttempt(r.attempt)
    setAnswers({ ...r.attempt.answers, ...readLocal(r.attempt.id) })
    setNow(Date.now())
  }

  if (attempts === undefined) return <p className="text-sm text-navy-500">Loading your paper…</p>

  // ------------------------------------------------------------- before
  if (!attempt) {
    const hours = Math.round((paper.durationMinutes / 60) * 10) / 10
    return (
      <div className="space-y-4">
      <PaperNotice paper={paper} />
      <div className="card space-y-3 p-5">
        <h3 className="text-lg font-bold text-navy-900">Write this paper under exam conditions</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-navy-700">
          <li>
            You have <b>{hours} hours</b> for {paper.totalMarks} marks, as in the real exam. The clock starts when you press Start and keeps running
            if you close the app.
          </li>
          <li>Your answers are saved as you write. Show your working: method marks are given for it.</li>
          <li>
            The memo stays closed until you <b>hand in</b> or the <b>time runs out</b>. Then your paper is marked, and you see your mark, your
            level and where you lost marks.
          </li>
          <li>Your teacher sees your result as soon as it is marked.</li>
        </ul>
        {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <button type="button" disabled={busy || attempts === null} onClick={() => void begin()} className="btn-primary">
          Start the paper
        </button>
        {attempts === null ? <p className="text-xs text-navy-500">{START_ERRORS.not_set_up}</p> : null}
      </div>
      </div>
    )
  }

  const open = memoOpen(attempt, now)
  const marked = attempt.status === 'marked'
  const answeredCount = items.filter((i) => (answers[i.id] ?? '').trim()).length
  const percent = attempt.percent ?? 0
  const level = levelOf(percent)
  const topics = Object.entries(attempt.per_topic ?? {})
    .map(([id, t]) => ({ id, name: getTopic(id)?.name ?? id, ...t, pct: t.outOf ? (t.awarded / t.outOf) * 100 : 0 }))
    .sort((a, b) => a.pct - b.pct)

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------- while writing */}
      {!open ? (
        <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-navy-200 bg-white/95 p-3 shadow-sm backdrop-blur print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-bold tabular-nums text-navy-900" aria-live="off">
              {timeLeft(attempt.deadline, now)}
            </span>
            <span className="text-xs text-navy-500">
              left · {answeredCount} of {items.length} answered
              {saved === 'saving' ? ' · saving…' : saved === 'saved' ? ' · saved' : saved === 'offline' ? ' · saved on this phone only' : ''}
            </span>
          </div>
          <button type="button" disabled={busy} onClick={() => void handIn(false)} className="btn-primary btn-sm">
            Hand in
          </button>
        </div>
      ) : null}
      {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      {/* ---------------------------------------------------------- the result */}
      {open && !marked ? (
        <div className="rounded-lg border border-navy-200 bg-navy-50 p-4 text-sm text-navy-700">
          {markError ? (
            <>
              <p>{MARK_ERRORS[markError]}</p>
              {markError !== 'not_set_up' ? (
                <button type="button" onClick={() => void mark(attempt)} className="btn-outline btn-sm mt-2">
                  Try marking again
                </button>
              ) : null}
            </>
          ) : (
            <p>
              <b>Handed in.</b> Your paper is being marked — this takes about a minute. The memo is open below.
            </p>
          )}
        </div>
      ) : null}

      {marked ? (
        <div className="card space-y-4 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Your mark</p>
              <p className="text-3xl font-extrabold tabular-nums text-navy-900">
                {attempt.marks_awarded} / {attempt.marks_total} <span className="text-xl text-navy-500">({Math.round(percent)}%)</span>
              </p>
              <p className="text-sm font-semibold text-navy-700">
                Level {level}: {LEVEL_NAMES[level]}
              </p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (window.confirm('Write this paper again from the start? Your mark here stays in your record.')) void begin()
              }}
              className="btn-outline btn-sm"
            >
              Write it again
            </button>
          </div>
          {attempt.provisional ? (
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
              <p>
                Some answers were marked only by the values the memo asks for, so a written explanation may deserve more marks than shown. Your teacher can
                see this.
              </p>
              <button
                type="button"
                disabled={remarking}
                onClick={async () => {
                  setRemarking(true)
                  await mark(attempt, true)
                  setRemarking(false)
                }}
                className="btn-outline btn-sm mt-2"
              >
                {remarking ? 'Marking again…' : 'Mark my written answers again'}
              </button>
              {markError && !remarking ? <p className="mt-2">{MARK_ERRORS[markError]}</p> : null}
            </div>
          ) : null}
          {topics.length ? (
            <div>
              <p className="text-sm font-semibold text-navy-900">By topic, weakest first</p>
              <ul className="mt-2 space-y-1.5">
                {topics.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="min-w-[12rem] flex-1 text-navy-700">{t.name}</span>
                    <span className="tabular-nums text-navy-600">
                      {t.awarded}/{t.outOf} ({Math.round(t.pct)}%)
                    </span>
                    {t.pct < 50 ? (
                      <Link to={`/account/learner/practise?subject=${paper.subjectId}&grade=${paper.grade}&topic=${t.id}`} className="btn-ghost btn-sm">
                        Practise this topic
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------------------------------------------------------- the paper */}
      {paper.sections.map((section) => (
        <div key={section.number} className="space-y-4">
          <SectionHeading eyebrow={`Question ${section.number}`} title={section.title} description={`${section.marks} marks`} />
          {section.items.map((item, i) => (
            <QuestionCard
              key={`${item.id}-${attempt.id}`}
              question={item}
              index={i}
              label={item.label}
              exam={{
                value: answers[item.id] ?? '',
                onChange: (v) => setAnswer(item.id, v),
                locked: open,
                showMemo: open,
                result: attempt.marking?.[item.id],
              }}
            />
          ))}
        </div>
      ))}

      {!open ? (
        <div className="flex justify-end">
          <button type="button" disabled={busy} onClick={() => void handIn(false)} className="btn-primary">
            Hand in my paper
          </button>
        </div>
      ) : null}
    </div>
  )
}

/**
 * The demo's paper: the same rule -- the memo opens only when the paper is
 * handed in or the time is up -- but nothing is saved and only multiple choice
 * is scored, since there is no account to mark against.
 */
export function DemoPaperExam({ paper }: { paper: Paper }) {
  const [deadline, setDeadline] = useState<number | null>(null)
  const [handedIn, setHandedIn] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [now, setNow] = useState(Date.now())
  const open = handedIn || (deadline !== null && now >= deadline)

  useEffect(() => {
    if (deadline === null || open) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [deadline, open])

  if (deadline === null)
    return (
      <div className="space-y-4">
        <PaperNotice paper={paper} />
        <div className="card space-y-3 p-5">
          <h3 className="text-lg font-bold text-navy-900">Try this paper under exam conditions</h3>
          <p className="text-sm text-navy-700">
            The memo opens when you hand in or the time runs out. In the demo nothing is saved and only multiple-choice answers are scored;{' '}
            <Link to="/sign-in" className="font-semibold underline underline-offset-2">
              sign up
            </Link>{' '}
            to have the whole paper marked and your result sent to your teacher.
          </p>
          <button type="button" onClick={() => (setDeadline(Date.now() + paper.durationMinutes * 60_000), setNow(Date.now()))} className="btn-primary">
            Start the paper
          </button>
        </div>
      </div>
    )

  const mcq = paper.sections.flatMap((s) => s.items).filter((i) => i.options?.length && i.correctOptionId)
  const mcqRight = mcq.filter((i) => answers[i.id] === i.correctOptionId)

  return (
    <div className="space-y-6">
      {!open ? (
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 rounded-lg border border-navy-200 bg-white/95 p-3 shadow-sm">
          <span className="font-mono text-xl font-bold tabular-nums text-navy-900">{timeLeft(new Date(deadline).toISOString(), now)}</span>
          <button type="button" onClick={() => window.confirm('Hand in your paper? The memo will open.') && setHandedIn(true)} className="btn-primary btn-sm">
            Hand in
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-navy-200 bg-navy-50 p-4 text-sm text-navy-700">
          <b>Handed in.</b> {mcq.length ? `Multiple choice: ${mcqRight.length} of ${mcq.length} right. ` : ''}The memo is open below.{' '}
          <Link to="/sign-in" className="font-semibold underline underline-offset-2">
            Sign up
          </Link>{' '}
          to have every answer marked.
        </div>
      )}
      {paper.sections.map((section) => (
        <div key={section.number} className="space-y-4">
          <SectionHeading eyebrow={`Question ${section.number}`} title={section.title} description={`${section.marks} marks`} />
          {section.items.map((item, i) => (
            <QuestionCard
              key={item.id}
              question={item}
              index={i}
              label={item.label}
              exam={{ value: answers[item.id] ?? '', onChange: (v) => setAnswers((a) => ({ ...a, [item.id]: v })), locked: open, showMemo: open }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
