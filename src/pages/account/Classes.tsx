import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ChevronRightIcon, UsersIcon } from '@/components/ui/Icons'
import {
  classesInView,
  createClass,
  fetchClassMembers,
  fetchClasses,
  type ClassMember,
  type SchoolClass,
} from '@/lib/classes'
import { averageMastery, fetchProgressForLearners, type RosterProgressRow } from '@/lib/teacherRoster'
import { fetchSchoolTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { progressInScope } from '@/lib/teacherScope'
import type { Grade } from '@/types'

const GRADES: Grade[] = [10, 11, 12]
const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id

/**
 * A class's average: each member's mastery across the class's own subject,
 * then the mean of those. Members with no practice yet are left out rather
 * than counted as 0% -- "not started" is not the same as "got nothing right".
 */
export function classAverage(cls: SchoolClass, memberIds: string[], progress: RosterProgressRow[]) {
  const scoped = progressInScope(progress, cls.subject_id)
  const values = memberIds.map((id) => averageMastery(id, scoped)).filter((v): v is number => v !== null)
  return { average: values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null, withData: values.length }
}

/**
 * Classes: a teacher's own list, or -- for the school account and an HOD --
 * every class, grouped by grade. That grouping is the school's drill-down:
 * school, then grade, then class, then the learners in it.
 */
export function Classes() {
  const { profile } = useAccountAuth()
  const schoolId = profile?.school_id ?? null
  const leader = profile?.role === 'school' || profile?.role === 'hod'

  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [members, setMembers] = useState<ClassMember[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [staff, setStaff] = useState<SchoolTeacher[]>([])
  const [loading, setLoading] = useState(true)
  const [notSetUp, setNotSetUp] = useState(false)
  const [loadError, setLoadError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState<Grade>(12)
  const [subjectId, setSubjectId] = useState(profile?.subject_id ?? subjects[0]?.id ?? 'mat-lit')
  const [teacherId, setTeacherId] = useState(profile?.id ?? '')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = async (id: string) => {
    const result = await fetchClasses(id)
    setClasses(result.classes)
    setNotSetUp(result.notSetUp)
    setLoadError(result.error ?? '')
    const rows = await fetchClassMembers(result.classes.map((c) => c.id))
    setMembers(rows)
    setProgress(await fetchProgressForLearners([...new Set(rows.map((m) => m.learner_id))]))
  }

  useEffect(() => {
    if (!schoolId) {
      setLoading(false)
      return
    }
    let active = true
    Promise.all([load(schoolId), fetchSchoolTeachers(schoolId).then((t) => active && setStaff(t))]).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
    // load only reads its argument and setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId])

  useEffect(() => {
    if (profile?.subject_id) setSubjectId(profile.subject_id)
    if (profile?.id) setTeacherId(profile.id)
  }, [profile?.subject_id, profile?.id])

  const visible = useMemo(() => classesInView(profile, classes), [profile, classes])
  const membersOf = (classId: string) => members.filter((m) => m.class_id === classId).map((m) => m.learner_id)

  // The school account can be a class teacher too, so it is offered alongside
  // the teaching staff.
  const teacherOptions = useMemo(() => {
    const list = staff.map((s) => ({ id: s.id, name: s.full_name }))
    if (profile && !list.some((s) => s.id === profile.id)) list.unshift({ id: profile.id, name: `${profile.full_name} (you)` })
    return list
  }, [staff, profile])
  const teacherName = (id: string | null) =>
    id === null ? 'No teacher' : id === profile?.id ? 'You' : (teacherOptions.find((t) => t.id === id)?.name ?? 'A former teacher')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!schoolId || !profile) return
    if (!name.trim()) {
      setFormError('Give the class a name, e.g. "12A Mathematical Literacy".')
      return
    }
    setSaving(true)
    setFormError('')
    const { error } = await createClass({
      schoolId,
      name,
      grade,
      subjectId,
      teacherId: leader ? teacherId || null : profile.id,
    })
    setSaving(false)
    if (error) {
      setFormError(error)
      return
    }
    setName('')
    setShowForm(false)
    await load(schoolId)
  }

  if (!profile) return null

  const heading = (
    <SectionHeading
      eyebrow="Classes"
      title={leader ? 'Classes at your school' : 'My classes'}
      description={
        leader
          ? 'Every class, grade by grade. Open a class to see its learners, how they are doing topic by topic, and its weekly tests.'
          : 'Your own classes. Put your learners in a class and the averages, topic analysis and weekly tests are for them alone, not the whole grade.'
      }
    />
  )

  if (!schoolId) {
    return (
      <div className="space-y-6">
        {heading}
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="Your account is not linked to a school"
          description="Classes belong to a school. Sign up again with your school's code, or ask an administrator to add you."
        />
      </div>
    )
  }

  if (!loading && notSetUp) {
    return (
      <div className="space-y-6">
        {heading}
        <div className="card border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Classes are not switched on yet. Your administrator needs to run the latest database update (STEP 14 in
          supabase/schema.sql).
        </div>
      </div>
    )
  }

  const byGrade = GRADES.map((g) => ({ grade: g, list: visible.filter((c) => c.grade === g) })).filter((g) => g.list.length)

  return (
    <div className="space-y-6">
      {heading}

      {!showForm ? (
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          Create a class
        </button>
      ) : (
        <form onSubmit={submit} className="card space-y-4 p-5">
          <h2 className="text-base font-bold text-navy-900">New class</h2>
          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="className">
              Name
            </label>
            <input
              id="className"
              type="text"
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 12A Mathematical Literacy"
              className="input mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="classGrade">
                Grade
              </label>
              <select
                id="classGrade"
                className="select mt-1"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as Grade)}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="classSubject">
                Subject
              </label>
              <select
                id="classSubject"
                className="select mt-1"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {leader ? (
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="classTeacher">
                Class teacher
              </label>
              <select
                id="classTeacher"
                className="select mt-1"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                {teacherOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-navy-400">Only approved staff can be given a class.</p>
            </div>
          ) : null}
          {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Creating…' : 'Create the class'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setFormError('')
              }}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loadError ? <p className="text-sm text-rose-600">{loadError}</p> : null}

      {loading ? (
        <p className="text-sm text-navy-500">Loading classes…</p>
      ) : byGrade.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title={leader ? 'No classes yet' : 'You have no classes yet'}
          description={
            leader
              ? 'Create a class above and give it a teacher, or ask your teachers to create their own.'
              : 'Create a class above, then add your learners to it from the class page.'
          }
        />
      ) : (
        byGrade.map(({ grade: g, list }) => {
          const gradeMembers = [...new Set(list.flatMap((c) => membersOf(c.id)))]
          return (
            <section key={g} className="space-y-3">
              <div className="flex items-baseline justify-between gap-3 border-b border-navy-100 pb-2">
                <h3 className="text-base font-bold text-navy-900">Grade {g}</h3>
                <p className="text-xs tabular-nums text-navy-500">
                  {list.length} class{list.length === 1 ? '' : 'es'} · {gradeMembers.length} learner
                  {gradeMembers.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {list.map((c) => {
                  const ids = membersOf(c.id)
                  const { average, withData } = classAverage(c, ids, progress)
                  return (
                    <Link
                      key={c.id}
                      to={c.id}
                      className="card group flex flex-col gap-3 p-5 transition hover:border-navy-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy-900">{c.name}</p>
                          <p className="mt-0.5 text-xs text-navy-500">
                            {subjectName(c.subject_id)} · {teacherName(c.teacher_id)}
                          </p>
                        </div>
                        <ChevronRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-navy-300 group-hover:text-navy-600" />
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <p className="text-xs tabular-nums text-navy-500">
                          {ids.length} learner{ids.length === 1 ? '' : 's'}
                          {ids.length && withData < ids.length ? ` · ${ids.length - withData} not started` : ''}
                        </p>
                        <p className="text-lg font-bold tabular-nums text-navy-900">
                          {average === null ? '—' : `${average}%`}
                        </p>
                      </div>
                      {average !== null ? (
                        <ProgressBar percent={average} size="sm" label={`${c.name} average mastery`} />
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
