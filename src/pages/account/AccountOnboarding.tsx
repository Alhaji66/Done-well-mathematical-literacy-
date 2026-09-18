import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAccountAuth, type AccountRole } from '@/context/AccountAuthContext'
import { UserIcon, HeartHandshakeIcon, BookIcon, SchoolIcon, CheckCircleIcon } from '@/components/ui/Icons'
import { recordConsent } from '@/lib/privacy'
import { createSchool, joinSchool, normaliseJoinCode } from '@/lib/schools'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types'

const roleOptions: { role: AccountRole; label: string; desc: string; icon: (p: { className?: string }) => JSX.Element }[] = [
  { role: 'learner', label: 'Learner', desc: 'Practise, track progress, sit tests', icon: UserIcon },
  { role: 'parent', label: 'Parent', desc: "Follow your child's progress", icon: HeartHandshakeIcon },
  { role: 'teacher', label: 'Teacher', desc: 'Resources, question bank, worksheets', icon: BookIcon },
  { role: 'school', label: 'School', desc: 'Whole-school view', icon: SchoolIcon },
]

const subjectOptions = [
  { id: 'mat-lit', name: 'Mathematical Literacy' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'physical-sciences', name: 'Physical Sciences' },
  { id: 'life-sciences', name: 'Life Sciences' },
]

const grades: Grade[] = [10, 11, 12]

export function AccountOnboarding() {
  const { session, refreshProfile } = useAccountAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<AccountRole>('learner')
  const [fullName, setFullName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  // A learner can only ever JOIN. Registering a school is how the school_id
  // everyone else joins against comes into existence, so letting thirty
  // learners each do it is what produced thirty schools of one learner.
  const [schoolMode, setSchoolMode] = useState<'join' | 'create'>('join')
  const [newCode, setNewCode] = useState('')
  const [grade, setGrade] = useState<Grade>(12)
  const [subjectId, setSubjectId] = useState('mat-lit')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // POPIA section 35: a child's personal information may not be processed
  // without the consent of a parent or guardian. Grades 10 to 12 means most
  // learners here are under 18, so a learner account cannot be created until
  // that consent is given and recorded.
  const [isAdult, setIsAdult] = useState(false)
  const [guardianName, setGuardianName] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)

  const needsSchool = role === 'learner' || role === 'teacher' || role === 'school'
  const needsGuardianConsent = role === 'learner' && !isAdult
  // Only a school account registers a school outright. A teacher may be the
  // first person from their school to arrive, so they get the choice; a learner
  // never does.
  const canCreateSchool = role === 'school' || role === 'teacher'
  const effectiveSchoolMode = role === 'school' ? 'create' : canCreateSchool ? schoolMode : 'join'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || !session) return
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      setError('Please enter your full name.')
      return
    }
    if (!consentGiven) {
      setError(
        needsGuardianConsent
          ? 'A parent or guardian must agree before a learner account can be created.'
          : 'Please agree to the POPIA notice before continuing.',
      )
      return
    }
    if (needsGuardianConsent && !guardianName.trim()) {
      setError('Please enter the full name of the parent or guardian giving consent.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let schoolId: string | null = null
      let createdCode = ''

      if (needsSchool) {
        // Never a name lookup. Joining resolves an existing school by its code
        // and cannot create one; creating always mints a fresh code. There is
        // no path left where a spelling decides which school you land in.
        if (effectiveSchoolMode === 'create') {
          const trimmedSchool = schoolName.trim()
          if (!trimmedSchool) throw new Error('Please enter the school name.')
          const { school, error: createError } = await createSchool(trimmedSchool)
          if (createError || !school) throw new Error(createError ?? 'Could not register the school.')
          schoolId = school.id
          createdCode = school.joinCode
        } else {
          const { school, error: joinError } = await joinSchool(joinCode)
          if (joinError || !school) throw new Error(joinError ?? 'Could not find that school code.')
          schoolId = school.id
        }
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: session.user.id,
        role,
        full_name: trimmedName,
        school_id: schoolId,
        grade: role === 'learner' ? grade : null,
        // A teacher's subject matters as much as a learner's: it is what
        // scopes their roster and their analytics to the class they actually
        // teach. Leaving it null put Life Sciences topics in a Mathematical
        // Literacy teacher's dashboard. A school account stays null, because a
        // whole-school view is the point of that role.
        subject_id: role === 'learner' || role === 'teacher' ? subjectId : null,
      })
      if (profileError) throw profileError

      // Record the consent in the same submit as the profile it covers. A
      // consent that is not written down is one you cannot show the Regulator.
      const { error: consentError } = await recordConsent({
        profileId: session.user.id,
        kind: needsGuardianConsent ? 'guardian' : 'self',
        guardianName: guardianName.trim(),
        guardianEmail: guardianEmail.trim(),
      })
      if (consentError) throw new Error(consentError)

      // A school that has just been registered must not be dropped straight
      // into a dashboard: the code it was given is the only way anyone else
      // gets into the same school, and nobody writes down a code they were
      // never shown. The profile is saved either way.
      if (createdCode) {
        setNewCode(createdCode)
        await refreshProfile()
        return
      }

      await refreshProfile()
      navigate('/account', { replace: true })
    } catch (err) {
      // Supabase's own errors (PostgrestError, AuthError) are plain objects with
      // a .message string, not real Error instances -- `err instanceof Error`
      // was silently swallowing the actual reason behind a generic message.
      console.error('Onboarding failed:', err)
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (newCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-6 text-center sm:p-8">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <SchoolIcon className="h-5 w-5" />
            </span>
            <h1 className="mt-4 text-xl font-bold text-navy-900">{schoolName.trim()} is registered</h1>
            <p className="mt-1.5 text-sm text-navy-600">
              This is your school code. Everyone else at the school -- teachers and learners -- joins by entering it,
              which is what puts them on your roster.
            </p>

            <p className="mt-5 select-all rounded-xl border-2 border-dashed border-gold-500 bg-gold-50 px-4 py-5 font-mono text-3xl font-bold tracking-[0.3em] text-navy-900">
              {newCode}
            </p>

            <p className="mt-4 text-left text-xs leading-relaxed text-navy-500">
              Write it on the board, or send it to your class. Anyone who signs up WITHOUT it will not appear in your
              learner list, because the code is what links their account to this school. You can find it again any time
              on your dashboard.
            </p>

            <button type="button" onClick={() => navigate('/account', { replace: true })} className="btn-primary mt-6 w-full">
              I've saved the code -- continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-navy-900">Complete your profile</h1>
          <p className="mt-1.5 text-sm text-navy-600">One-time setup -- tell us who you are.</p>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div>
              <label className="text-xs font-medium text-navy-500">I am a...</label>
              <div className="mt-1.5 space-y-2">
                {roleOptions.map((opt) => {
                  const active = role === opt.role
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setRole(opt.role)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                        active ? 'border-gold-500 bg-gold-50' : 'border-navy-100 hover:bg-navy-50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                          active ? 'bg-gold-500 text-navy-900' : 'bg-navy-50 text-navy-600',
                        )}
                      >
                        <opt.icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-navy-900">{opt.label}</span>
                        <span className="block truncate text-xs text-navy-500">{opt.desc}</span>
                      </span>
                      {active ? <CheckCircleIcon className="h-5 w-5 shrink-0 text-gold-700" /> : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="input mt-1"
              />
            </div>

            {needsSchool ? (
              <div>
                {canCreateSchool && role !== 'school' ? (
                  <div className="mb-3 flex rounded-lg border border-navy-200 p-0.5">
                    {(['join', 'create'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        aria-pressed={effectiveSchoolMode === mode}
                        onClick={() => setSchoolMode(mode)}
                        className={cn(
                          'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                          effectiveSchoolMode === mode ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
                        )}
                      >
                        {mode === 'join' ? 'I have a school code' : 'Register my school'}
                      </button>
                    ))}
                  </div>
                ) : null}

                {effectiveSchoolMode === 'create' ? (
                  <>
                    <label className="text-xs font-medium text-navy-500" htmlFor="schoolName">
                      School name
                    </label>
                    <input
                      id="schoolName"
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Gojela High School"
                      className="input mt-1"
                    />
                    <p className="mt-1 text-xs text-navy-400">
                      We'll give you a 6-character school code to share with your teachers and learners. Register the
                      school ONCE -- everyone else joins with the code.
                    </p>
                  </>
                ) : (
                  <>
                    <label className="text-xs font-medium text-navy-500" htmlFor="joinCode">
                      School code
                    </label>
                    <input
                      id="joinCode"
                      type="text"
                      required
                      inputMode="text"
                      autoCapitalize="characters"
                      autoComplete="off"
                      maxLength={7}
                      value={joinCode}
                      onChange={(e) => setJoinCode(normaliseJoinCode(e.target.value))}
                      placeholder="e.g. K7RB2M"
                      className="input mt-1 font-mono text-lg tracking-[0.3em] uppercase"
                    />
                    <p className="mt-1 text-xs text-navy-400">
                      {role === 'learner'
                        ? 'Ask your teacher for your school code. It is 6 letters and numbers.'
                        : 'The code your school was given when it registered.'}
                    </p>
                  </>
                )}
              </div>
            ) : null}

            {role === 'learner' || role === 'teacher' ? (
              <div className={cn('grid gap-3', role === 'learner' ? 'grid-cols-2' : 'grid-cols-1')}>
                {role === 'learner' ? (
                  <div>
                    <label className="text-xs font-medium text-navy-500">Grade</label>
                    <select className="select mt-1" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          Grade {g}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <div>
                  <label className="text-xs font-medium text-navy-500">
                    {role === 'teacher' ? 'Subject you teach' : 'Subject'}
                  </label>
                  <select className="select mt-1" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                    {subjectOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {role === 'teacher' ? (
                    <p className="mt-1 text-xs text-navy-400">
                      Your roster and analytics show this subject only. You can change it later.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="rounded-lg border border-navy-200 bg-navy-50 p-4">
              <h2 className="text-sm font-bold text-navy-900">Permission to keep this information</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-navy-600">
                We keep your name, grade, subject, school and the topics you practise, so that your progress is
                there when you come back. The{' '}
                <Link to="/popia" target="_blank" className="font-semibold underline">
                  POPIA notice
                </Link>{' '}
                sets out exactly what we hold and what you can ask us to do with it.
              </p>

              {role === 'learner' ? (
                <label className="mt-3 flex gap-2.5 text-xs text-navy-700">
                  <input
                    type="checkbox"
                    checked={isAdult}
                    onChange={(e) => {
                      setIsAdult(e.target.checked)
                      setConsentGiven(false)
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-navy-300"
                  />
                  <span>I am 18 or older, so I can give this permission myself.</span>
                </label>
              ) : null}

              {needsGuardianConsent ? (
                <div className="mt-3 space-y-3 border-t border-navy-200 pt-3">
                  <p className="text-xs font-semibold text-navy-800">
                    Because you are under 18, a parent or guardian has to agree. Please ask them to complete this part.
                  </p>
                  <div>
                    <label className="text-xs font-medium text-navy-500" htmlFor="guardianName">
                      Parent or guardian full name
                    </label>
                    <input
                      id="guardianName"
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="e.g. Nomsa Dlamini"
                      className="input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-navy-500" htmlFor="guardianEmail">
                      Parent or guardian email <span className="font-normal text-navy-400">(optional)</span>
                    </label>
                    <input
                      id="guardianEmail"
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      placeholder="So we can reach them about this account"
                      className="input mt-1"
                    />
                  </div>
                </div>
              ) : null}

              <label className="mt-3 flex gap-2.5 text-xs text-navy-700">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-navy-300"
                />
                <span>
                  {needsGuardianConsent
                    ? 'I am the parent or guardian named above, and I agree to DONE WELL keeping this information about my child as the POPIA notice describes.'
                    : 'I agree to DONE WELL keeping this information about me as the POPIA notice describes.'}
                </span>
              </label>

              <p className="mt-2.5 text-xs text-navy-500">
                You can withdraw this later, download everything we hold, or delete the account, from Privacy &amp;
                data in your account.
              </p>
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Saving…' : 'Finish setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
