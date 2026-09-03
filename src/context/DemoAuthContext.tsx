import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type DemoRole = 'learner' | 'parent' | 'teacher' | 'school'

interface DemoAuthValue {
  role: DemoRole | null
  name: string
  signIn: (role: DemoRole) => void
  signOut: () => void
}

const roleNames: Record<DemoRole, string> = {
  learner: 'Karabo Mokoena',
  parent: 'Mrs. P. Mokoena',
  teacher: 'Alhaji T',
  school: 'Gojela High School',
}

const STORAGE_KEY = 'donewell-demo-role'

const DemoAuthContext = createContext<DemoAuthValue | undefined>(undefined)

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DemoRole | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'learner' || stored === 'parent' || stored === 'teacher' || stored === 'school') {
        setRole(stored)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<DemoAuthValue>(
    () => ({
      role,
      name: role ? roleNames[role] : '',
      signIn: (r: DemoRole) => {
        setRole(r)
        try {
          localStorage.setItem(STORAGE_KEY, r)
        } catch {
          /* ignore */
        }
      },
      signOut: () => {
        setRole(null)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
      },
    }),
    [role],
  )

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>
}

export function useDemoAuth() {
  const ctx = useContext(DemoAuthContext)
  if (!ctx) throw new Error('useDemoAuth must be used within DemoAuthProvider')
  return ctx
}
