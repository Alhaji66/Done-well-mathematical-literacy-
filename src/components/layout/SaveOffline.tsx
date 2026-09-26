import { useEffect, useState } from 'react'
import { subjects } from '@/data/subjects'
import { CheckCircleIcon, DownloadIcon } from '@/components/ui/Icons'

/**
 * "Use DONE WELL offline": every subject, each with its own Save button, so a
 * learner taking Mathematics and Physical Sciences can keep both on the phone.
 * Saving downloads the subject's papers and questions once; the service worker
 * keeps the file (see vite.config.ts) and practice, papers and the revision
 * plan then work with no signal. Nothing is downloaded until they tap -- on a
 * data bundle that choice is theirs.
 *
 * A subject also becomes available offline on its own the first time it is
 * opened with signal, since that downloads the same file. The card reads the
 * same cache, so it shows those as saved too.
 */

/**
 * What saving each subject downloads, in MB: the gzipped size of its paper
 * chunk in the build, rounded up. Approximate on purpose -- it grows slowly as
 * content is added. Re-measure with: gzip -c dist/assets/<subject>-*.js | wc -c
 */
const SIZE_MB: Record<string, number> = {
  'mat-lit': 0.3,
  mathematics: 0.3,
  'physical-sciences': 0.5,
  'life-sciences': 0.7,
}

type State = 'saved' | 'not_saved' | 'saving' | 'failed'

const mb = (n: number) => `${n.toFixed(1).replace('.', ',')} MB`

export function SaveOffline({ subjectId }: { subjectId: string }) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [state, setState] = useState<Record<string, State>>({})
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true

  // The learner's own subject first, then the rest in the usual order.
  const ordered = [...subjects].sort((a, b) => Number(b.id === subjectId) - Number(a.id === subjectId))

  const check = async () => {
    if (!('caches' in window) || !navigator.serviceWorker?.controller) return setSupported(false)
    try {
      const cache = await caches.open('subject-papers')
      const paths = (await cache.keys()).map((r) => new URL(r.url).pathname)
      setSupported(true)
      setState((prev) => {
        const next = { ...prev }
        for (const s of subjects) {
          if (paths.some((p) => p.includes(`/${s.id}-`))) next[s.id] = 'saved'
          else if (next[s.id] !== 'saving' && next[s.id] !== 'failed') next[s.id] = 'not_saved'
        }
        return next
      })
    } catch {
      setSupported(false)
    }
  }

  useEffect(() => {
    void check()
  }, [])

  const save = async (id: string) => {
    setState((prev) => ({ ...prev, [id]: 'saving' }))
    try {
      const { questionsForSubject } = await import('@/data/questionBank')
      await questionsForSubject(id)
      // The service worker stores the file as it passes through; give it a moment.
      await new Promise((r) => setTimeout(r, 500))
      setState((prev) => ({ ...prev, [id]: 'not_saved' }))
      await check()
    } catch {
      setState((prev) => ({ ...prev, [id]: 'failed' }))
    }
  }

  const unsaved = ordered.filter((s) => state[s.id] !== 'saved')
  const saveAll = async () => {
    // One after another, so a slow connection is not asked for 2 MB at once.
    for (const s of unsaved) await save(s.id)
  }

  if (!supported) return null
  const busy = Object.values(state).includes('saving')
  const allSaved = unsaved.length === 0
  const online = navigator.onLine

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${allSaved ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-50 text-navy-700'}`}
        >
          {allSaved ? <CheckCircleIcon className="h-5 w-5" /> : <DownloadIcon className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-900">{allSaved ? 'Every subject is saved on this phone' : 'Use DONE WELL offline'}</p>
          <p className="text-sm text-navy-600">
            {allSaved
              ? 'Practice, papers and your revision plan work with no signal.'
              : `Save a subject once and its practice, papers and revision plan work with no signal. Nothing downloads until you tap.${saveData ? ' Your phone is set to save data.' : ''}`}
          </p>
        </div>
      </div>

      <ul className="mt-3 divide-y divide-navy-100">
        {ordered.map((s) => {
          const st = state[s.id] ?? 'not_saved'
          return (
            <li key={s.id} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-navy-900">
                  {s.name}
                  {s.id === subjectId ? <span className="ml-1.5 whitespace-nowrap text-xs font-normal text-navy-500">your subject</span> : null}
                </p>
                <p className={`text-xs ${st === 'failed' ? 'text-rose-700' : 'text-navy-500'}`}>
                  {st === 'saved'
                    ? 'Saved on this phone'
                    : st === 'failed'
                      ? 'Did not finish. Try again with signal.'
                      : `About ${mb(SIZE_MB[s.id] ?? 1)}`}
                </p>
              </div>
              {st === 'saved' ? (
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-600" aria-label={`${s.name} saved`} />
              ) : (
                <button type="button" className="btn-outline btn-sm shrink-0" disabled={busy || !online} onClick={() => void save(s.id)}>
                  {st === 'saving' ? 'Saving…' : 'Save'}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {unsaved.length > 1 ? (
        <button type="button" className="btn-primary btn-sm mt-2 w-full" disabled={busy || !online} onClick={() => void saveAll()}>
          Save all {unsaved.length} (about {mb(unsaved.reduce((n, s) => n + (SIZE_MB[s.id] ?? 1), 0))})
        </button>
      ) : null}
      {!online && !allSaved ? <p className="mt-2 text-xs text-navy-500">Saving needs a connection.</p> : null}
    </div>
  )
}
