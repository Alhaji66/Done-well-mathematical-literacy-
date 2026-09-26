import { useEffect, useState } from 'react'
import { onOutboxChange, pendingCount } from '@/lib/outbox'

/**
 * A thin strip at the top of the page while the phone has no signal, saying
 * what still works. In an account it also says how many answers are waiting
 * to be saved (see outbox.ts).
 */
export function OfflineNotice({ account = false }: { account?: boolean }) {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [pending, setPending] = useState(() => (account ? pendingCount() : 0))

  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    const off = account ? onOutboxChange(() => setPending(pendingCount())) : undefined
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
      off?.()
    }
  }, [account])

  if (online) return null
  return (
    <div role="status" className="mb-4 rounded-lg border border-navy-200 bg-navy-900 px-3 py-2 text-sm text-white">
      <span className="font-semibold">You're offline.</span> Practice, papers and your revision plan still work
      {account
        ? pending
          ? `; ${pending} answer${pending === 1 ? '' : 's'} will be saved to your account when you're back online.`
          : '; your answers are saved to your account when you are back online.'
        : '.'}
    </div>
  )
}
