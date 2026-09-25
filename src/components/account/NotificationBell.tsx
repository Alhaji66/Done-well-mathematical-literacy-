import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BellIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import {
  describeNotification,
  fetchNotifications,
  markNotificationsRead,
  type AppNotification,
} from '@/lib/notifications'

const POLL_MS = 60_000

/**
 * The bell in the account header. Checks for new notifications when the page
 * opens, when the tab comes back into view, and once a minute while it is
 * open -- enough for "a test was set" without holding a connection open.
 * Hidden entirely on a database without notifications (STEP 16 not run).
 */
export function NotificationBell({ basePath }: { basePath: string }) {
  const navigate = useNavigate()
  const [items, setItems] = useState<AppNotification[] | null>(null)
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    const r = await fetchNotifications()
    if (!r) {
      setItems(null)
      return
    }
    setItems(r.items)
    setNames(r.names)
  }, [])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, POLL_MS)
    const onVisible = () => document.visibilityState === 'visible' && void refresh()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh])

  // Close on a click outside, or Escape.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (items === null) return null
  const unread = items.filter((n) => !n.read_at)

  const markAll = async () => {
    await markNotificationsRead(unread.map((n) => n.id))
    const now = new Date().toISOString()
    setItems((rows) => (rows ?? []).map((n) => (n.read_at ? n : { ...n, read_at: now })))
  }

  const openOne = async (n: AppNotification) => {
    if (!n.read_at) await markNotificationsRead([n.id])
    setItems((rows) => (rows ?? []).map((r) => (r.id === n.id ? { ...r, read_at: new Date().toISOString() } : r)))
    setOpen(false)
    if (n.link) navigate(`${basePath}/${n.link}`)
  }

  return (
    <div className="relative" ref={panel}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-ghost btn-sm relative !px-2.5"
        aria-label={unread.length ? `Notifications, ${unread.length} unread` : 'Notifications'}
        aria-expanded={open}
      >
        <BellIcon className="h-5 w-5" />
        {unread.length ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-navy-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
            <p className="text-sm font-bold text-navy-900">Notifications</p>
            {unread.length ? (
              <button type="button" onClick={markAll} className="text-xs font-semibold text-gold-700 underline">
                Mark all read
              </button>
            ) : null}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-navy-500">Nothing yet.</p>
          ) : (
            <ul className="max-h-96 divide-y divide-navy-50 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => openOne(n)}
                    className={cn('flex w-full gap-3 px-4 py-3 text-left text-sm hover:bg-navy-50', !n.read_at && 'bg-gold-50/60')}
                  >
                    <span
                      className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read_at ? 'bg-transparent' : 'bg-rose-600')}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block text-navy-800">{describeNotification(n, names)}</span>
                      <span className="mt-0.5 block text-xs text-navy-400">
                        {new Date(n.created_at).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
