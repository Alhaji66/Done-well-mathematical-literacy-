import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MenuIcon, CloseIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/learners', label: 'Learners' },
  { to: '/parents', label: 'Parents' },
  { to: '/teachers', label: 'Teachers' },
  { to: '/schools', label: 'Schools' },
  { to: '/publications', label: 'Publications' },
]

export function PublicHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 15 12 5l7 10" />
              <circle cx="12" cy="18" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight text-navy-900">
            DONE WELL<span className="align-super text-[0.6em] text-gold-600">®</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900',
                  isActive && 'bg-navy-50 text-navy-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/account/sign-in" className="btn-outline btn-sm">
            Sign In
          </Link>
          <Link to="/sign-in" className="btn-primary btn-sm">
            Try the demo
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-navy-700 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-navy-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50',
                    isActive && 'bg-navy-50 text-navy-900',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-navy-100 pt-3">
              <Link to="/account/sign-in" className="btn-outline w-full" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link to="/sign-in" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Try the demo
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
