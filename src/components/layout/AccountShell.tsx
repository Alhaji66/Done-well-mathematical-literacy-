import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAccountAuth, type AccountRole } from '@/context/AccountAuthContext'
import { LogOutIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { RoleNavItem } from '@/components/layout/RoleShell'

const roleLabels: Record<AccountRole, string> = {
  learner: 'Learner',
  parent: 'Parent',
  teacher: 'Teacher',
  school: 'School',
}

interface AccountShellProps {
  basePath: string
  navItems: RoleNavItem[]
}

export function AccountShell({ basePath, navItems }: AccountShellProps) {
  const { profile, signOut } = useAccountAuth()

  return (
    <div className="min-h-screen bg-neutral-50">
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
              DONE WELL<span className="align-super text-[0.55em] text-gold-600">®</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-navy-900">{profile?.full_name}</p>
              <p className="text-xs text-navy-500">{profile ? roleLabels[profile.role] : ''}</p>
            </div>
            <button type="button" onClick={signOut} className="btn-ghost btn-sm !px-2.5" title="Sign out">
              <LogOutIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
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

        <main className="min-w-0 flex-1 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-navy-100 bg-white/95 backdrop-blur md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={`${basePath}${item.to}`}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-navy-500',
                isActive && 'text-navy-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-5 w-5', isActive ? 'text-gold-500' : 'text-navy-400')} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
