import { useEffect, useState } from 'react'
import { fetchJoinCode } from '@/lib/schools'
import { fetchSeatStatus, rotateJoinCode, setApprovalMode, type ApprovalMode } from '@/lib/learnerApproval'
import { SchoolIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

/**
 * The school's join code, on the dashboard of everyone who has to hand it out.
 *
 * A code shown once during onboarding and never again is a code that gets lost,
 * and a lost code means the next learner types a school name instead -- which is
 * the failure this whole change exists to remove. So it lives permanently where
 * a teacher or a school administrator will look for it.
 *
 * The school account and HODs also decide here how learners get in (STEP 34):
 * approved one by one, or let in at once while paid places remain -- and can
 * change the code, so a code that has spread beyond the school stops working.
 */
export function SchoolJoinCode({ schoolId, canManage = false }: { schoolId: string | null; canManage?: boolean }) {
  const [school, setSchool] = useState<{ name: string; joinCode: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<ApprovalMode | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!schoolId) return
    let active = true
    fetchJoinCode(schoolId).then((result) => {
      if (active) setSchool(result)
    })
    if (canManage) {
      fetchSeatStatus().then((status) => {
        if (active && status) setMode(status.approval)
      })
    }
    return () => {
      active = false
    }
  }, [schoolId, canManage])

  const chooseMode = async (next: ApprovalMode) => {
    if (next === mode) return
    setBusy(true)
    setMessage('')
    const failure = await setApprovalMode(next)
    setBusy(false)
    if (failure) setMessage(failure)
    else setMode(next)
  }

  const changeCode = async () => {
    setBusy(true)
    setMessage('')
    const { code, error } = await rotateJoinCode()
    setBusy(false)
    setConfirming(false)
    if (error || !code) {
      setMessage(error ?? 'The code could not be changed.')
      return
    }
    setSchool((s) => (s ? { ...s, joinCode: code } : s))
    setMessage('New code ready. The old code no longer works; learners already at the school are not affected.')
  }

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
        without it will not appear here.{mode === 'manual' ? ' Each learner then waits until staff approve them.' : ''}
      </p>

      {canManage ? (
        <div className="mt-4 space-y-3 border-t border-navy-100 pt-4">
          {mode ? (
            <fieldset>
              <legend className="text-xs font-semibold text-navy-700">When a learner joins with the code</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ['manual', 'Staff approve each learner', 'Safest: someone who is not at the school cannot get in with a shared code.'],
                    ['auto', 'Let them in while places remain', 'Quicker at the start of the year. Once the paid places are used, the rest wait.'],
                  ] as const
                ).map(([value, title, note]) => (
                  <label
                    key={value}
                    className={cn(
                      'flex cursor-pointer gap-2 rounded-lg border p-3 text-sm',
                      mode === value ? 'border-navy-900 bg-navy-50' : 'border-navy-200',
                    )}
                  >
                    <input
                      type="radio"
                      name="learner-approval"
                      className="mt-1"
                      checked={mode === value}
                      disabled={busy}
                      onChange={() => void chooseMode(value)}
                    />
                    <span>
                      <span className="block font-semibold text-navy-900">{title}</span>
                      <span className="block text-xs text-navy-500">{note}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            {confirming ? (
              <>
                <span className="text-xs text-navy-700">Change the code? Anyone still holding the old one will not be able to join.</span>
                <button type="button" disabled={busy} onClick={() => void changeCode()} className="btn-primary btn-sm">
                  Yes, change it
                </button>
                <button type="button" disabled={busy} onClick={() => setConfirming(false)} className="btn-ghost btn-sm">
                  Keep it
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setConfirming(true)} className="btn-outline btn-sm">
                  Change code
                </button>
                <span className="text-xs text-navy-500">If the code has been shared outside the school.</span>
              </>
            )}
          </div>
          {message ? <p className="text-xs text-navy-700">{message}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
