import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { LogOutIcon } from '@/components/ui/Icons'

/**
 * A plain frame for the pages that sit outside any school: the platform
 * console and a sponsor's dashboard. The people using them may have no school
 * profile, so the school navigation would have nothing to show.
 */
export function ConsoleShell({ title, children }: { title: string; children: ReactNode }) {
  const { profile, signOut } = useAccountAuth()
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-30 border-b border-navy-100 bg-white print:hidden">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link to="/" className="text-base font-extrabold tracking-tight text-navy-900">
            DONE WELL<span className="align-super text-[0.55em] text-gold-700">®</span>
            <span className="ml-2 text-sm font-semibold text-navy-500">{title}</span>
          </Link>
          <div className="flex items-center gap-3">
            {profile ? (
              <Link to="/account" className="text-sm font-medium text-navy-600 hover:text-navy-900">
                My account
              </Link>
            ) : null}
            <button type="button" onClick={signOut} className="btn-ghost btn-sm !px-2.5" title="Sign out">
              <LogOutIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" className="container-page py-6">
        {children}
      </main>
    </div>
  )
}
