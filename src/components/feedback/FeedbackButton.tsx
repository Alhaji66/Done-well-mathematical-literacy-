import { lazy, Suspense, useState } from 'react'
import { cn } from '@/lib/utils'

// The form loads only when someone opens it, so the button adds next to
// nothing to every page -- the public ones included.
const FeedbackDialog = lazy(() => import('@/components/feedback/FeedbackDialog').then((m) => ({ default: m.FeedbackDialog })))

/**
 * "Feedback": a small button on every page, for anyone -- signed in, trying the
 * demo, or just visiting -- to tell DONE WELL what works and what does not.
 *
 * `role` is what the page knows about who is here ('visitor', 'demo:teacher',
 * 'teacher' …). For a signed-in account the server records the role from their
 * profile instead. `aboveTabBar` lifts it clear of a phone's bottom bar.
 */
export function FeedbackButton({ role, aboveTabBar = false }: { role: string; aboveTabBar?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'fixed right-3 z-30 flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 shadow-md hover:bg-navy-50 print:hidden md:bottom-5 md:right-5',
          aboveTabBar ? 'bottom-[calc(4.25rem+env(safe-area-inset-bottom))]' : 'bottom-4',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
        </svg>
        Feedback
      </button>
      {open ? (
        <Suspense fallback={null}>
          <FeedbackDialog role={role} onClose={() => setOpen(false)} />
        </Suspense>
      ) : null}
    </>
  )
}
