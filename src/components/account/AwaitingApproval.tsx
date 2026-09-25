import { useAccountAuth } from '@/context/AccountAuthContext'
import { ClockIcon, LogOutIcon } from '@/components/ui/Icons'

/**
 * What a staff account sees until a colleague approves it.
 *
 * The page is honest about WHY: without it a new teacher would land on an empty
 * class list and reasonably conclude the app was broken. It also says what to
 * do, because the fix is a person, not a button in this app.
 */
export function AwaitingApproval() {
  const { profile, signOut, refreshProfile } = useAccountAuth()
  const role = profile?.role === 'hod' ? 'head of department' : profile?.role === 'school' ? 'school' : 'teacher'
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4 py-12">
      <div className="card w-full max-w-md p-6 text-center sm:p-8">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <ClockIcon className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-navy-900">Waiting for your school to approve you</h1>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          Your {role} account is set up, {profile?.full_name.split(' ')[0]}. Before it can see any learner's work, a
          colleague who already uses DONE WELL at your school has to confirm you are staff there.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-navy-600">
          Ask a teacher or your school administrator to open their dashboard. You will be listed under{' '}
          <span className="font-semibold text-navy-800">Staff waiting for approval</span>.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-navy-500">
          This step exists because every learner is given the school code. Without it, anyone with the code could
          sign up as a teacher and read every learner's results.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => void refreshProfile()} className="btn-primary">
            I have been approved — check again
          </button>
          <button type="button" onClick={() => void signOut()} className="btn-ghost inline-flex items-center justify-center gap-1.5">
            <LogOutIcon className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
