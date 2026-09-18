import { useEffect, useState } from 'react'
import { fetchJoinCode } from '@/lib/schools'
import { SchoolIcon } from '@/components/ui/Icons'

/**
 * The school's join code, on the dashboard of everyone who has to hand it out.
 *
 * A code shown once during onboarding and never again is a code that gets lost,
 * and a lost code means the next learner types a school name instead -- which is
 * the failure this whole change exists to remove. So it lives permanently where
 * a teacher or a school administrator will look for it.
 */
export function SchoolJoinCode({ schoolId }: { schoolId: string | null }) {
  const [school, setSchool] = useState<{ name: string; joinCode: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!schoolId) return
    let active = true
    fetchJoinCode(schoolId).then((result) => {
      if (active) setSchool(result)
    })
    return () => {
      active = false
    }
  }, [schoolId])

  if (!schoolId) {
    return (
      <div className="card border-amber-300 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">Your account is not linked to a school</p>
        <p className="mt-1 text-xs leading-relaxed text-amber-800">
          Nothing will appear on your roster until it is, because a learner is matched to you through their school. Ask
          an administrator to add you, or sign up again with your school's code.
        </p>
      </div>
    )
  }

  if (!school) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(school.joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access is denied in plenty of ordinary situations (an
      // insecure origin, a locked-down school device). The code is selectable
      // on screen either way, so this is a convenience, not the mechanism.
      setCopied(false)
    }
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
          <SchoolIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-navy-500">School code — {school.name}</p>
          <p className="select-all font-mono text-2xl font-bold tracking-[0.25em] text-navy-900">{school.joinCode}</p>
        </div>
        <button type="button" onClick={copy} className="btn-outline shrink-0 text-xs">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-navy-500">
        Learners and teachers enter this when they sign up. It is what puts them on your roster — anyone who signs up
        without it will not appear here.
      </p>
    </div>
  )
}
