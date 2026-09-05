import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { LogOutIcon } from '@/components/ui/Icons'

const roleLabels: Record<string, string> = {
  parent: 'Parent',
  teacher: 'Teacher',
  school: 'School',
}

/**
 * Placeholder for Parent/Teacher/School real accounts -- the Learner role
 * has its own full multi-page experience at /account/learner/* now (see
 * AccountIndexRedirect), which is why this component no longer handles
 * that role at all.
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
          The Learner role already has a complete real experience (Dashboard, Practise, Progress) -- this role is
          next.
        </div>
      </div>
    </div>
  )
}
