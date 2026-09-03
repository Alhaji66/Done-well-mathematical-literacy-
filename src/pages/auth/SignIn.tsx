import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDemoAuth, type DemoRole } from '@/context/DemoAuthContext'
import { UserIcon, HeartHandshakeIcon, BookIcon, SchoolIcon, CheckCircleIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const roleOptions: { role: DemoRole; label: string; desc: string; icon: (p: { className?: string }) => JSX.Element }[] = [
  { role: 'learner', label: 'Learner', desc: 'Karabo Mokoena · Grade 12', icon: UserIcon },
  { role: 'parent', label: 'Parent', desc: "Karabo's guardian", icon: HeartHandshakeIcon },
  { role: 'teacher', label: 'Teacher', desc: 'Mrs. N. Zulu · Mathematical Literacy', icon: BookIcon },
  { role: 'school', label: 'School', desc: 'Thuto Secondary School', icon: SchoolIcon },
]

export function SignIn() {
  const [params] = useSearchParams()
  const preselected = params.get('role') as DemoRole | null
  const [selected, setSelected] = useState<DemoRole>(
    preselected && roleOptions.some((r) => r.role === preselected) ? preselected : 'learner',
  )
  const { signIn } = useDemoAuth()
  const navigate = useNavigate()

  const enter = () => {
    signIn(selected)
    navigate(`/app/${selected}/dashboard`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
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
        </div>

        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-navy-900">Try the demo</h1>
          <p className="mt-1.5 text-sm text-navy-600">
            No account needed. Pick a role to explore a full sample dashboard with realistic demo data.
          </p>

          <div className="mt-6 space-y-2.5">
            {roleOptions.map((opt) => {
              const active = selected === opt.role
              return (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => setSelected(opt.role)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors',
                    active ? 'border-gold-500 bg-gold-50' : 'border-navy-100 hover:bg-navy-50',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      active ? 'bg-gold-500 text-navy-900' : 'bg-navy-50 text-navy-600',
                    )}
                  >
                    <opt.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy-900">{opt.label}</span>
                    <span className="block truncate text-xs text-navy-500">{opt.desc}</span>
                  </span>
                  {active ? <CheckCircleIcon className="h-5 w-5 shrink-0 text-gold-600" /> : null}
                </button>
              )
            })}
          </div>

          <button type="button" onClick={enter} className="btn-primary mt-6 w-full">
            Enter {roleOptions.find((r) => r.role === selected)?.label} dashboard
          </button>

          <p className="mt-4 text-center text-xs text-navy-400">
            This is a demo login for prototype purposes. Real accounts, passwords and payments are not yet enabled.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-navy-500">
          <Link to="/" className="font-medium text-navy-700 hover:text-navy-900">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  )
}
