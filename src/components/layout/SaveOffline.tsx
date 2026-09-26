import { useEffect, useState } from 'react'
import { getSubject } from '@/data/subjects'
import { CheckCircleIcon, DownloadIcon } from '@/components/ui/Icons'

/**
 * "Keep {subject} on this phone": downloads the subject's papers and questions
 * once, on the learner's say-so, so practice, papers and the revision plan work
 * with no signal. Nothing is downloaded until they tap -- on a data bundle that
 * choice is theirs. The service worker keeps the file (see vite.config.ts).
 */
export function SaveOffline({ subjectId }: { subjectId: string }) {
  const [state, setState] = useState<'unknown' | 'saved' | 'not_saved' | 'saving' | 'failed' | 'unsupported'>('unknown')
  const subject = getSubject(subjectId)?.name ?? subjectId
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true

  const check = async () => {
    if (!('caches' in window) || !navigator.serviceWorker?.controller) return setState('unsupported')
    try {
      const cache = await caches.open('subject-papers')
      const keys = await cache.keys()
      setState(keys.some((r) => new URL(r.url).pathname.includes(`/${subjectId}-`)) ? 'saved' : 'not_saved')
    } catch {
      setState('unsupported')
    }
  }

  useEffect(() => {
    void check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId])

  const save = async () => {
    setState('saving')
    try {
      const { questionsForSubject } = await import('@/data/questionBank')
      await questionsForSubject(subjectId)
      // The service worker stores the file as it passes through; give it a moment.
      await new Promise((r) => setTimeout(r, 500))
      await check()
    } catch {
      setState('failed')
    }
  }

  if (state === 'unknown' || state === 'unsupported') return null
  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${state === 'saved' ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-50 text-navy-700'}`}>
        {state === 'saved' ? <CheckCircleIcon className="h-5 w-5" /> : <DownloadIcon className="h-5 w-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-navy-900">{state === 'saved' ? `${subject} is saved on this phone` : `Use ${subject} offline`}</p>
        <p className="text-sm text-navy-600">
          {state === 'saved'
            ? 'Practice, papers and your revision plan work with no signal.'
            : state === 'failed'
              ? 'The download did not finish. Try again when you have signal.'
              : `Download every ${subject} question once (under 1 MB) and practise with no signal after that.${saveData ? ' Your phone is set to save data, so nothing downloads until you tap.' : ''}`}
        </p>
      </div>
      {state !== 'saved' ? (
        <button type="button" className="btn-outline btn-sm" disabled={state === 'saving' || !navigator.onLine} onClick={() => void save()}>
          {state === 'saving' ? 'Saving…' : 'Save for offline'}
        </button>
      ) : null}
    </div>
  )
}
