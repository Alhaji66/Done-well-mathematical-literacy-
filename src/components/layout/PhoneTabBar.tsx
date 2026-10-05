import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { RoleNavItem } from '@/components/layout/RoleShell'
import { cn } from '@/lib/utils'

/**
 * The phone's bottom bar for a signed-in account.
 *
 * It used to hold every destination and scroll sideways: sixteen tabs for a
 * teacher, ten for a learner. Once you had scrolled to Mark book, Dashboard was
 * off the edge of the screen, and getting home meant swiping back to find it.
 * Now the bar is always the same five things: Dashboard, the three tabs a role
 * uses most (`bar: true` in config/nav.ts), and More, which opens everything
 * else in one sheet. Dashboard is always one tap away, from any page.
 */
export function PhoneTabBar({ basePath, navItems }: { basePath: string; navItems: RoleNavItem[] }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // Going anywhere closes the sheet.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Five or fewer fit as they are (a parent has five): no More needed.
  const all = navItems.length <= 5
  const onBar = all ? navItems : [navItems[0], ...navItems.slice(1).filter((i) => i.bar)].slice(0, 4)
  const inMore = navItems.filter((i) => !onBar.includes(i))
  const isHere = (item: RoleNavItem) => {
    const path = `${basePath}${item.to}`
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }
  const moreActive = inMore.some(isHere)

  const tab = 'flex flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[11px] font-medium leading-tight'

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="All pages">
          <button type="button" className="absolute inset-0 bg-navy-900/40" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-navy-900">All pages</p>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost btn-sm">
                Close
              </button>
            </div>
            <nav className="grid grid-cols-3 gap-2" aria-label="All pages">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={`${basePath}${item.to}`}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border border-navy-100 px-2 py-3 text-center text-xs font-medium text-navy-700',
                      isActive && 'border-navy-900 bg-navy-900 text-white',
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-navy-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {onBar.map((item) => (
          <NavLink
            key={item.to}
            to={`${basePath}${item.to}`}
            end={item.end}
            className={({ isActive }) => cn(tab, isActive && !open ? 'text-navy-900' : 'text-navy-500')}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && !open ? 'text-gold-500' : 'text-navy-400')} />
                <span className="w-full truncate text-center">{item === navItems[0] ? 'Home' : (item.shortLabel ?? item.label)}</span>
              </>
            )}
          </NavLink>
        ))}
        {inMore.length ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={cn(tab, open || moreActive ? 'text-navy-900' : 'text-navy-500')}
          >
            <MoreGlyph className={cn('h-5 w-5 shrink-0', open || moreActive ? 'text-gold-500' : 'text-navy-400')} />
            <span>More</span>
          </button>
        ) : null}
      </nav>
    </>
  )
}

function MoreGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="6" r="1.8" />
      <circle cx="12" cy="6" r="1.8" />
      <circle cx="18" cy="6" r="1.8" />
      <circle cx="6" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="18" cy="12" r="1.8" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="12" cy="18" r="1.8" />
      <circle cx="18" cy="18" r="1.8" />
    </svg>
  )
}
