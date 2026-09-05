import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { LogOutIcon } from '@/components/ui/Icons'

const roleLabels: Record<string, string> = {
  parent: 'Parent',
  school: 'School',
}

/**
 * Placeholder for Parent/School real accounts -- Learner and Teacher each
 * have their own full multi-page experience now (/account/learner/* and
 * /account/teacher/*, see AccountIndexRedirect), which is why this
 * component no longer handles either role.
 */
export function AccountDashboard() {
  const { profile, signOut } = useAccountAuth()
  const [schoolName, setSchoolName] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !profile?.school_id) return
    supabase
      .from('schools')
      .select('name')
      .eq('id', profile.school_id)
      .maybeSingle()
      .then(({ data }) => setSchoolName(data?.name ?? null))
  }, [profile?.school_id])

  if (!profile) return null

  return (
    <div className="min-h-screen bg-navy-50 px-4 py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{roleLabels[profile.role]} account</p>
              <h1 className="mt-1 truncate text-xl font-bold text-navy-900">Welcome, {profile.full_name}</h1>
              {schoolName ? <p className="mt-1 text-sm text-navy-500">{schoolName}</p> : null}
            </div>
            <button type="button" onClick={signOut} className="btn-ghost btn-sm inline-flex shrink-0 items-center gap-1.5">
              <LogOutIcon className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
          <strong>This is a real account.</strong> The full {roleLabels[profile.role]} dashboard is still being built.
          Learner and Teacher already have complete real experiences -- this role is next.
        </div>
      </div>
    </div>
  )
}
