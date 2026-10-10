import { useEffect, useState } from 'react'
import { fileLink, fileName, isImage } from '@/lib/classWork'

/**
 * Files of a piece of class work -- the question paper, the memo, or a
 * learner's photos -- opened through links that last an hour. Photos show
 * inline, so a teacher marks without opening each one; anything else is a link.
 */
export function WorkFiles({ paths, onRemove, emptyText }: { paths: string[]; onRemove?: (path: string) => void; emptyText?: string }) {
  const [links, setLinks] = useState<Record<string, string | null>>({})

  useEffect(() => {
    let active = true
    Promise.all(paths.map(async (p) => [p, await fileLink(p)] as const)).then((pairs) => {
      if (active) setLinks(Object.fromEntries(pairs))
    })
    return () => {
      active = false
    }
  }, [paths.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!paths.length) return emptyText ? <p className="text-sm text-navy-500">{emptyText}</p> : null

  return (
    <ul className="space-y-3">
      {paths.map((p) => {
        const url = links[p]
        return (
          <li key={p} className="rounded-lg border border-navy-200 bg-white p-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {url ? (
                <a href={url} target="_blank" rel="noreferrer" className="break-all text-sm font-medium text-navy-800 underline underline-offset-2">
                  {fileName(p)}
                </a>
              ) : (
                <span className="break-all text-sm text-navy-600">{fileName(p)}</span>
              )}
              {onRemove ? (
                <button type="button" onClick={() => onRemove(p)} className="text-xs font-semibold text-rose-700 underline">
                  Remove
                </button>
              ) : null}
            </div>
            {url && isImage(p) ? <img src={url} alt={fileName(p)} className="mt-2 max-h-[32rem] w-full rounded object-contain" loading="lazy" /> : null}
          </li>
        )
      })}
    </ul>
  )
}
