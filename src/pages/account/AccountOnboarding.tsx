import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAccountAuth, type AccountRole } from '@/context/AccountAuthContext'
import { UserIcon, HeartHandshakeIcon, BookIcon, SchoolIcon, CheckCircleIcon } from '@/components/ui/Icons'
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
]

const grades: Grade[] = [10, 11, 12]

export function AccountOnboarding() {
  const { session, refreshProfile } = useAccountAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<AccountRole>('learner')
  const [fullName, setFullName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [grade, setGrade] = useState<Grade>(12)
  const [subjectId, setSubjectId] = useState('mat-lit')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const needsSchool = role === 'learner' || role === 'teacher' || role === 'school'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || !session) return
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      setError('Please enter your full name.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let schoolId: string | null = null

      if (needsSchool) {
        const trimmedSchool = schoolName.trim()
        if (!trimmedSchool) throw new Error('Please enter your school name.')

        const { data: existing, error: findError } = await supabase
          .from('schools')
          .select('id')
          .ilike('name', trimmedSchool)
          .maybeSingle()
        if (findError) throw findError

        if (existing) {
          schoolId = existing.id
        } else {
          const { data: created, error: createError } = await supabase
            .from('schools')
            .insert({ name: trimmedSchool })
            .select('id')
            .single()
          if (createError) throw createError
          schoolId = created.id
        }
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: session.user.id,
        role,
        full_name: trimmedName,
        school_id: schoolId,
        grade: role === 'learner' ? grade : null,
        subject_id: role === 'learner' ? subjectId : null,
      })
      if (profileError) throw profileError

      await refreshProfile()
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
                      {active ? <CheckCircleIcon className="h-5 w-5 shrink-0 text-gold-600" /> : null}
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
                  If your school is already registered, this links you to it -- otherwise it's created.
                </p>
              </div>
            ) : null}

            {role === 'learner' ? (
              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="text-xs font-medium text-navy-500">Subject</label>
                  <select className="select mt-1" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                    {subjectOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

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
