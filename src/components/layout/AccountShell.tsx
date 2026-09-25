import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAccountAuth, type AccountRole } from '@/context/AccountAuthContext'
import { LogOutIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { RoleNavItem } from '@/components/layout/RoleShell'
import { NotificationBell } from '@/components/account/NotificationBell'
import { logSignedIn } from '@/lib/activity'
import { usePlatformAccess } from '@/lib/platform'
import { useContentAccess } from '@/lib/content'

const roleLabels: Record<AccountRole, string> = {
  learner: 'Learner',
  parent: 'Parent',
  teacher: 'Teacher',
  school: 'School',
  hod: 'Head of Department',
}

interface AccountShellProps {
  basePath: string
  navItems: RoleNavItem[]
}

export function AccountShell({ basePath, navItems }: AccountShellProps) {
  const { profile, signOut } = useAccountAuth()
  const platform = usePlatformAccess(profile?.id)
  const content = useContentAccess(profile?.id)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // One "signed in" event a day, for the school's active-learner count.
  useEffect(() => {
    if (profile?.id) logSignedIn(profile.id)
  }, [profile?.id])

  return (
    <div className="min-h-screen bg-neutral-50">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-navy-100 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 15 12 5l7 10" />
                <circle cx="12" cy="18" r="1.4" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="text-base font-extrabold tracking-tight text-navy-900">
              DONE WELL<span className="align-super text-[0.55em] text-gold-700">®</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-navy-900">{profile?.full_name}</p>
              <p className="text-xs text-navy-500">{profile ? roleLabels[profile.role] : ''}</p>
            </div>
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                if (query.trim()) navigate(`${basePath}/search?q=${encodeURIComponent(query.trim())}`)
              }}
              className="hidden lg:block"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search DONE WELL…"
                aria-label="Search DONE WELL"
                className="input !h-9 w-56 !py-1.5 text-sm"
              />
            </form>
            <Link to={`${basePath}/search`} className="btn-ghost btn-sm !px-2.5 lg:hidden" aria-label="Search">
              <SearchGlyph />
            </Link>
            {content.editor ? (
              <Link to="/account/content" className="hidden text-sm font-medium text-gold-700 hover:text-navy-900 sm:inline">
                Content studio
              </Link>
            ) : null}
            {platform.admin ? (
              <Link to="/account/admin" className="hidden text-sm font-medium text-gold-700 hover:text-navy-900 sm:inline">
                Platform console
              </Link>
            ) : null}
            {platform.sponsor ? (
              <Link to="/account/sponsor" className="hidden text-sm font-medium text-gold-700 hover:text-navy-900 sm:inline">
                Sponsor dashboard
              </Link>
            ) : null}
            <NotificationBell basePath={basePath} />
            <button type="button" onClick={signOut} className="btn-ghost btn-sm !px-2.5" title="Sign out">
              <LogOutIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/*
          On a phone there is no room for these in the header row, and hiding
          them left an administrator with no way in except typing the address.
          They get a slim bar of their own instead -- shown only to people who
          have one of these roles, so learners and teachers never see it.
        */}
        {content.editor || platform.admin || platform.sponsor ? (
          <nav
            aria-label="DONE WELL tools"
            className="flex gap-4 overflow-x-auto border-t border-navy-100 bg-gold-50 px-4 py-2 text-sm font-medium sm:hidden"
          >
            {platform.admin ? (
              <Link to="/account/admin" className="shrink-0 text-gold-800 underline-offset-2 hover:underline">
                Platform console
              </Link>
            ) : null}
            {content.editor ? (
              <Link to="/account/content" className="shrink-0 text-gold-800 underline-offset-2 hover:underline">
                Content studio
              </Link>
            ) : null}
            {platform.sponsor ? (
              <Link to="/account/sponsor" className="shrink-0 text-gold-800 underline-offset-2 hover:underline">
                Sponsor dashboard
              </Link>
            ) : null}
          </nav>
        ) : null}
      </header>

      <div className="container-page flex gap-6 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={`${basePath}${item.to}`}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900',
                    isActive && 'bg-navy-900 text-white hover:bg-navy-900 hover:text-white',
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/*
        Eight destinations do not fit across a phone. `flex-1` gave each one
        about 45px and the labels ran straight into each other -- "Question
        Bank" over "Assessments" over "Weekly tests" -- so the bar read as one
        long word. Each tab now claims the width its label actually needs and
        the row scrolls sideways, which is the usual way a tab bar outgrows the
        screen. `snap` keeps a part-scrolled tab from sitting half cut off.
      */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex snap-x snap-mandatory overflow-x-auto border-t border-navy-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={`${basePath}${item.to}`}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-0.5 px-1 py-2.5 text-[11px] font-medium leading-tight text-navy-500',
                isActive && 'text-navy-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-gold-500' : 'text-navy-400')} />
                <span className="w-full truncate text-center">{item.shortLabel ?? item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

/** A magnifying glass, for the small-screen search link. */
function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  )
}
