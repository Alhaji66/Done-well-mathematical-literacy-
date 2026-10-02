import { useEffect, useState } from 'react'
import { onPackSource, packSource, type PackSource } from '@/lib/contentPacks'

/**
 * Says when a page is showing less than the whole question bank (see
 * src/lib/contentPacks.ts): the demo's sample, or -- for a signed-in account
 * whose download failed with nothing saved on the device -- the same sample, so
 * nobody mistakes three questions a topic for the bank.
 */
export function ContentNotice({ subjectId }: { subjectId: string }) {
  const [source, setSource] = useState<PackSource | undefined>(() => packSource(subjectId))
  useEffect(() => {
    setSource(packSource(subjectId))
    const off = onPackSource(() => setSource(packSource(subjectId)))
    return () => {
      off()
    }
  }, [subjectId])

  if (source === 'sample') {
    return (
      <p className="rounded-lg bg-navy-50 px-3 py-2 text-xs text-navy-600">
        This demo shows a sample of the question bank: a few questions per topic and one paper per grade. Every question and
        paper comes with an account.
      </p>
    )
  }
  if (source === 'unavailable') {
    return (
      <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        The full question bank could not be downloaded, so this is a small sample. Check your connection and refresh the page.
      </p>
    )
  }
  if (source === 'saved') {
    return <p className="text-xs text-navy-500">Offline: using the copy of this subject saved on this device.</p>
  }
  return null
}
