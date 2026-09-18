import { useState } from 'react'
import { subjects } from '@/data/subjects'
import { setMySubject } from '@/lib/teacherScope'
import { useAccountAuth, type AccountProfile } from '@/context/AccountAuthContext'
import { cn } from '@/lib/utils'

/**
 * The subject a teacher teaches, changeable from their dashboard.
 *
 * Needed for two reasons. Teachers who signed up before the subject existed on
 * their profile have nothing set, and telling them to make a second account is
 * not a fix. And a teacher's subject genuinely changes between years, so this
 * is not a one-time setup question.
 *
 * It states loudly when nothing is set, because an unset subject silently means
 * "show me the whole school", which is the confusing behaviour this exists to
 * end rather than a reasonable default.
 *
 * A Head of Department needs the identical control and different words: their
 * subject is not what they teach, it is the department they are responsible
 * for, and an unset one leaves them with no department at all rather than with
 * too wide a view. Hence `variant` -- same behaviour, honest labels.
 */
export function TeachingSubject({
  profile,
  variant = 'teacher',
}: {
  profile: AccountProfile
  variant?: 'teacher' | 'hod'
}) {
  const { refreshProfile } = useAccountAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(!profile.subject_id)

  const current = subjects.find((s) => s.id === profile.subject_id)

  const choose = async (subjectId: string) => {
    if (subjectId === profile.subject_id) {
      setOpen(false)
      return
    }
    setSaving(true)
    setError('')
    const message = await setMySubject(profile.id, subjectId)
    setSaving(false)
    if (message) {
      setError(message)
      return
    }
    await refreshProfile()
    setOpen(false)
  }

  if (!open) {
    return (
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <p className="min-w-0 flex-1 text-sm text-navy-700">
          You teach <strong className="font-semibold text-navy-900">{current?.name}</strong>. Your roster and analytics
          show this subject only.
        </p>
        <button type="button" onClick={() => setOpen(true)} className="btn-outline shrink-0 text-xs">
          Change
        </button>
      </div>
    )
  }

  return (
    <div className={cn('card p-4', !profile.subject_id && 'border-amber-300 bg-amber-50')}>
      <p className="text-sm font-semibold text-navy-900">
        {variant === 'hod' ? 'Which department do you head?' : 'Which subject do you teach?'}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-navy-600">
        {variant === 'hod'
          ? profile.subject_id
            ? 'Your department pages show this subject only, across all three grades.'
            : 'Until you choose, you have no department, and your pages will be empty.'
          : profile.subject_id
            ? 'Your roster and analytics will show this subject only.'
            : 'Until you choose, your roster and analytics show every learner at the school, in every subject — which is why you may be seeing subjects you do not teach.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={saving}
            aria-pressed={s.id === profile.subject_id}
            onClick={() => choose(s.id)}
            className={cn(
              'rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
              s.id === profile.subject_id
                ? 'border-gold-500 bg-gold-500 text-navy-900'
                : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50',
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
      {profile.subject_id ? (
        <button type="button" onClick={() => setOpen(false)} className="mt-3 text-xs text-navy-500 underline">
          Cancel
        </button>
      ) : null}
    </div>
  )
}
