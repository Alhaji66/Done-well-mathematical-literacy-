import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A countdown for the paper's real exam duration.
 *
 * Running out of time is the failure mode learners report most often, and it
 * cannot be practised against a paper that has no clock: a learner who works
 * through 150 marks over an afternoon learns the content but not the pacing.
 *
 * Three decisions worth recording.
 *
 * The clock is driven by a WALL-CLOCK deadline (`Date.now() + remaining`), not
 * by counting interval ticks. Background tabs on mobile get their timers
 * throttled to once a minute or stopped altogether, so a tick-counting timer
 * silently gains minutes whenever the learner switches away -- which is exactly
 * when they would most like to have gained them. Recomputing from a stored
 * deadline means the time is right whenever the tab comes back, whatever the
 * browser did in between.
 *
 * It SURVIVES A RELOAD, keyed by paper. A learner who refreshes mid-paper
 * should not be handed a fresh three hours, and one who comes back to a paper
 * the next day should not find it already expired -- so a finished or abandoned
 * run is cleared rather than left to rot.
 *
 * Time up does NOT lock anything. This is practice: the point is to show the
 * learner where they were when the real paper would have ended, not to take
 * the paper away from them. The banner stays, and they can carry on.
 */

interface ExamTimerProps {
  paperId: string
  durationMinutes: number
}

interface StoredRun {
  /** Epoch ms when the paper must be finished. */
  deadline: number
  /** Set when the learner pauses, so the deadline can be pushed out on resume. */
  pausedAt?: number
}

const storageKey = (paperId: string) => `donewell.examTimer.${paperId}`

function readRun(paperId: string): StoredRun | null {
  try {
    const raw = localStorage.getItem(storageKey(paperId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredRun
    return typeof parsed?.deadline === 'number' ? parsed : null
  } catch {
    // Private windows and blocked site data both throw here. A timer that
    // cannot be persisted is still a useful timer, so carry on without one.
    return null
  }
}

function writeRun(paperId: string, run: StoredRun | null) {
  try {
    if (run) localStorage.setItem(storageKey(paperId), JSON.stringify(run))
    else localStorage.removeItem(storageKey(paperId))
  } catch {
    /* see readRun */
  }
}

/** h:mm:ss, or mm:ss under an hour -- and never a negative number. */
function format(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export function ExamTimer({ paperId, durationMinutes }: ExamTimerProps) {
  const totalMs = durationMinutes * 60_000
  const [run, setRun] = useState<StoredRun | null>(() => readRun(paperId))
  const [now, setNow] = useState(() => Date.now())
  const announced = useRef<Set<string>>(new Set())

  // Reset everything when the learner moves to a different paper.
  useEffect(() => {
    setRun(readRun(paperId))
    announced.current = new Set()
  }, [paperId])

  const paused = run?.pausedAt !== undefined
  const remaining = run ? (paused ? run.deadline - (run.pausedAt as number) : run.deadline - now) : totalMs
  const expired = run !== null && !paused && remaining <= 0

  useEffect(() => {
    if (!run || paused || expired) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    // Recompute immediately on return, rather than waiting up to a second, so
    // a tab that was backgrounded for an hour does not show a stale figure.
    const onVisible = () => setNow(Date.now())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [run, paused, expired])

  const start = useCallback(() => {
    const next = { deadline: Date.now() + totalMs }
    writeRun(paperId, next)
    setRun(next)
    setNow(Date.now())
  }, [paperId, totalMs])

  const pause = useCallback(() => {
    setRun((prev) => {
      if (!prev || prev.pausedAt !== undefined) return prev
      const next = { ...prev, pausedAt: Date.now() }
      writeRun(paperId, next)
      return next
    })
  }, [paperId])

  const resume = useCallback(() => {
    setRun((prev) => {
      if (!prev || prev.pausedAt === undefined) return prev
      // Push the deadline out by however long the pause lasted, so pausing
      // gives back exactly the time it took and no more.
      const next = { deadline: prev.deadline + (Date.now() - prev.pausedAt) }
      writeRun(paperId, next)
      return next
    })
    setNow(Date.now())
  }, [paperId])

  const reset = useCallback(() => {
    writeRun(paperId, null)
    setRun(null)
    announced.current = new Set()
  }, [paperId])

  // Screen-reader announcements at the points that matter, each once.
  const milestone =
    expired ? 'expired' : remaining <= 5 * 60_000 ? '5' : remaining <= 15 * 60_000 ? '15' : remaining <= 30 * 60_000 ? '30' : ''
  useEffect(() => {
    if (milestone) announced.current.add(milestone)
  }, [milestone])

  const fractionLeft = Math.max(0, Math.min(1, remaining / totalMs))
  const urgent = !expired && remaining <= 15 * 60_000
  const tone = expired
    ? 'border-red-300 bg-red-50 text-red-900'
    : urgent
      ? 'border-amber-300 bg-amber-50 text-amber-900'
      : 'border-navy-200 bg-white text-navy-900'

  return (
    <section
      aria-label="Exam timer"
      className={`sticky top-0 z-20 -mx-4 mb-6 border-b px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border ${tone}`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
            {run === null ? 'Exam time' : expired ? 'Time is up' : paused ? 'Paused' : 'Time remaining'}
          </p>
          <p
            className="font-mono text-2xl font-bold tabular-nums"
            // Reading every second aloud would be unusable; the milestones below
            // carry the information a learner actually needs.
            aria-hidden="true"
          >
            {format(expired ? 0 : remaining)}
          </p>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {expired
            ? 'Time is up. You can keep working — nothing is locked.'
            : milestone
              ? `${milestone} minutes remaining`
              : ''}
        </p>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {run === null && (
            <button
              type="button"
              onClick={start}
              className="rounded-md bg-navy-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-900"
            >
              Start {durationMinutes}-minute timer
            </button>
          )}
          {run !== null && !expired && (
            <button
              type="button"
              onClick={paused ? resume : pause}
              className="rounded-md border border-current px-3 py-1.5 text-sm font-semibold hover:opacity-80"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          )}
          {run !== null && (
            <button type="button" onClick={reset} className="rounded-md px-3 py-1.5 text-sm font-semibold underline hover:opacity-80">
              {expired ? 'Clear' : 'Reset'}
            </button>
          )}
        </div>
      </div>

      {run !== null && (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/10" aria-hidden="true">
          <div
            className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
              expired ? 'bg-red-500' : urgent ? 'bg-amber-500' : 'bg-navy-700'
            }`}
            style={{ width: `${fractionLeft * 100}%` }}
          />
        </div>
      )}

      {expired && (
        <p className="mt-2 text-sm">
          In the real exam you would stop here. Nothing is locked — mark where you got to, then carry on and see how
          much further you needed.
        </p>
      )}
      {run === null && (
        <p className="mt-1.5 text-xs opacity-70">
          The real paper allows {durationMinutes} minutes. The timer keeps running if you close the tab, and a reload
          will not give you extra time.
        </p>
      )}
    </section>
  )
}
