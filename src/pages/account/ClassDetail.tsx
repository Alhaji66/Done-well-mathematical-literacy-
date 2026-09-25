import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { topicsForSubject } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ArrowLeftIcon, UsersIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { ParticipationPanel } from '@/components/account/ParticipationPanel'
import {
  addLearnersToClass,
  canManageClass,
  deleteClass,
  fetchClassMembers,
  fetchClasses,
  removeLearnerFromClass,
  updateClass,
  type SchoolClass,
} from '@/lib/classes'
import {
  averageMastery,
  fetchProgressForLearners,
  fetchSchoolLearners,
  type RosterLearner,
  type RosterProgressRow,
} from '@/lib/teacherRoster'
import { fetchSchoolTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { progressInScope } from '@/lib/teacherScope'
import { fetchAttemptsForTest, fetchTestsForSchool, type TestAttempt, type WeeklyTest } from '@/lib/weeklyTests'

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id

/** Below this, a topic is flagged for the teacher's attention. */
const ATTENTION = 50

export function ClassDetail() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const { profile } = useAccountAuth()
  const schoolId = profile?.school_id ?? null

  const [cls, setCls] = useState<SchoolClass | null>(null)
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [roster, setRoster] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [staff, setStaff] = useState<SchoolTeacher[]>([])
  const [tests, setTests] = useState<WeeklyTest[]>([])
  const [attempts, setAttempts] = useState<Record<string, TestAttempt[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [adding, setAdding] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [otherGrades, setOtherGrades] = useState(false)
  const [busy, setBusy] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const load = async () => {
    if (!schoolId || !classId) return
    const [{ classes }, learners, teachers, schoolTests] = await Promise.all([
      fetchClasses(schoolId),
      fetchSchoolLearners(schoolId),
      fetchSchoolTeachers(schoolId),
      fetchTestsForSchool(schoolId),
    ])
    const found = classes.find((c) => c.id === classId) ?? null
    setCls(found)
    setRoster(learners)
    setStaff(teachers)
    const ids = (await fetchClassMembers([classId])).map((m) => m.learner_id)
    setMemberIds(ids)
    setProgress(await fetchProgressForLearners(ids))
    const mine = schoolTests.filter((t) => t.class_id === classId)
    setTests(mine)
    const byTest: Record<string, TestAttempt[]> = {}
    for (const t of mine) byTest[t.id] = await fetchAttemptsForTest(t.id)
    setAttempts(byTest)
  }

  useEffect(() => {
    let active = true
    load().then(() => active && setLoading(false))
    return () => {
      active = false
    }
    // load reads only the ids below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, classId])

  const scoped = useMemo(() => (cls ? progressInScope(progress, cls.subject_id) : []), [cls, progress])
  const members = useMemo(
    () =>
      memberIds
        .map((id) => roster.find((l) => l.id === id))
        .filter((l): l is RosterLearner => Boolean(l))
        .map((l) => ({ learner: l, mastery: averageMastery(l.id, scoped) }))
        .sort((a, b) => (a.mastery ?? -1) - (b.mastery ?? -1)),
    [memberIds, roster, scoped],
  )

  if (!profile) return null

  const back = (
    <Link to=".." relative="path" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900">
      <ArrowLeftIcon className="h-4 w-4" /> All classes
    </Link>
  )

  if (loading) return <p className="text-sm text-navy-500">Loading the class…</p>

  if (!cls) {
    return (
      <div className="space-y-6">
        {back}
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="This class was not found"
          description="It may have been deleted, or it belongs to another school."
        />
      </div>
    )
  }

  const manage = canManageClass(profile, cls)
  const leader = profile.role === 'school' || profile.role === 'hod'
  const teacher =
    cls.teacher_id === null
      ? 'No class teacher'
      : cls.teacher_id === profile.id
        ? 'You'
        : (staff.find((s) => s.id === cls.teacher_id)?.full_name ?? 'A former teacher')

  const withData = members.filter((m) => m.mastery !== null)
  const average = withData.length
    ? Math.round(withData.reduce((s, m) => s + (m.mastery ?? 0), 0) / withData.length)
    : null

  // Topic by topic: the class's mean on each topic of its subject and grade,
  // over the learners who have practised it -- weakest first, because that is
  // what a teacher plans next week's lesson from.
  const topicRows = topicsForSubject(cls.subject_id, cls.grade)
    .map((t) => {
      const rows = scoped.filter((r) => r.topic_id === t.id)
      return {
        topic: t,
        learners: rows.length,
        mean: rows.length ? Math.round(rows.reduce((s, r) => s + r.mastery_percent, 0) / rows.length) : null,
      }
    })
    .filter((r) => r.mean !== null)
    .sort((a, b) => (a.mean ?? 0) - (b.mean ?? 0))

  // Learners who could be added: same school, not already in, same grade and
  // subject unless the teacher asks to see everyone.
  const candidates = roster
    .filter((l) => !memberIds.includes(l.id))
    .filter((l) => otherGrades || (l.grade === cls.grade && (l.subject_id === null || l.subject_id === cls.subject_id)))
    .sort((a, b) => a.full_name.localeCompare(b.full_name))

  const run = async (action: () => Promise<string | undefined>) => {
    setBusy(true)
    setError('')
    const message = await action()
    setBusy(false)
    if (message) {
      setError(message)
      return false
    }
    await load()
    return true
  }

  const add = async () => {
    if (await run(() => addLearnersToClass(cls.id, picked))) {
      setPicked([])
      setAdding(false)
    }
  }

  const rename = async () => {
    if (!newName.trim()) return
    if (await run(() => updateClass(cls.id, { name: newName }))) setRenaming(false)
  }

  const remove = async () => {
    setBusy(true)
    const message = await deleteClass(cls.id)
    setBusy(false)
    if (message) {
      setError(message)
      setConfirmDelete(false)
      return
    }
    navigate('..', { relative: 'path' })
  }

  return (
    <div className="space-y-6">
      {back}

      <SectionHeading
        eyebrow={`Grade ${cls.grade} · ${subjectName(cls.subject_id)}`}
        title={cls.name}
        description={`Class teacher: ${teacher}`}
      />

      {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Learners</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{members.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Class average mastery</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{average === null ? '—' : `${average}%`}</p>
          {average !== null ? <ProgressBar percent={average} className="mt-2" size="sm" label="Class average mastery" /> : null}
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Not started practising</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{members.length - withData.length}</p>
        </div>
      </div>

      <ParticipationPanel learners={members.map((m) => m.learner)} title="Participation in this class" />

      {/* Topic analysis ----------------------------------------------------- */}
      <section className="space-y-3">
        <h3 className="font-bold text-navy-900">Topic analysis</h3>
        {topicRows.length === 0 ? (
          <p className="text-sm text-navy-500">
            Nobody in this class has practised a {subjectName(cls.subject_id)} topic yet.
          </p>
        ) : (
          <div className="card divide-y divide-navy-100">
            {topicRows.map(({ topic, learners, mean }) => (
              <div key={topic.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-900">
                    {topic.name}
                    {mean !== null && mean < ATTENTION ? (
                      <span className="badge-red ml-2 align-middle">Needs attention</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-navy-500">
                    {learners} of {members.length} learner{members.length === 1 ? '' : 's'} practised
                    {manage && mean !== null && mean < ATTENTION ? (
                      <>
                        {' · '}
                        <Link
                          to={`../../interventions?class=${cls.id}&topic=${topic.id}`}
                          relative="path"
                          className="font-semibold text-gold-700 underline"
                        >
                          Start a catch-up group
                        </Link>
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="w-full sm:w-48">
                  <ProgressBar percent={mean ?? 0} size="sm" label={`${topic.name} class average`} />
                </div>
                <span className="w-12 text-right text-sm font-bold tabular-nums text-navy-900">{mean}%</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Learners ----------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-navy-900">Learners</h3>
          {manage && !adding ? (
            <button type="button" onClick={() => setAdding(true)} className="btn-outline btn-sm">
              Add learners
            </button>
          ) : null}
        </div>

        {adding ? (
          <div className="card space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-navy-900">
                {otherGrades ? 'Every learner at your school' : `Grade ${cls.grade} ${subjectName(cls.subject_id)} learners`}
              </p>
              <label className="flex items-center gap-2 text-xs text-navy-600">
                <input
                  type="checkbox"
                  checked={otherGrades}
                  onChange={(e) => setOtherGrades(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-300"
                />
                Show other grades and subjects
              </label>
            </div>
            {candidates.length === 0 ? (
              <p className="text-sm text-navy-500">
                Everyone who fits is already in this class. Learners appear here once they have joined your school with
                its code.
              </p>
            ) : (
              <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-navy-200 p-2">
                {candidates.map((l) => {
                  const on = picked.includes(l.id)
                  return (
                    <label
                      key={l.id}
                      className={cn('flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm', on ? 'bg-gold-50' : 'hover:bg-navy-50')}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setPicked(on ? picked.filter((id) => id !== l.id) : [...picked, l.id])}
                        className="h-4 w-4 shrink-0 rounded border-navy-300"
                      />
                      <span className="flex-1 text-navy-800">{l.full_name}</span>
                      <span className="text-xs text-navy-400">
                        {l.grade ? `Gr ${l.grade}` : ''}
                        {l.subject_id ? ` · ${subjectName(l.subject_id)}` : ''}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={busy || picked.length === 0} onClick={add} className="btn-primary">
                {busy ? 'Adding…' : `Add ${picked.length || ''} learner${picked.length === 1 ? '' : 's'}`}
              </button>
              {candidates.length > 0 ? (
                <button type="button" onClick={() => setPicked(candidates.map((l) => l.id))} className="btn-outline">
                  Select all {candidates.length}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setAdding(false)
                  setPicked([])
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {members.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-6 w-6" />}
            title="No learners in this class yet"
            description={manage ? 'Use "Add learners" to pick them from the learners who have joined your school.' : 'The class teacher has not added anyone yet.'}
          />
        ) : (
          <ul className="card divide-y divide-navy-100">
            {members.map(({ learner, mastery }) => (
              <li key={learner.id} className="flex flex-wrap items-center gap-3 p-4">
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-navy-900">{learner.full_name}</span>
                <span className="w-full sm:w-40">
                  {mastery !== null ? (
                    <ProgressBar percent={mastery} size="sm" label={`${learner.full_name} mastery`} />
                  ) : (
                    <span className="text-xs text-navy-400">Not started</span>
                  )}
                </span>
                <span className="w-12 text-right text-sm font-bold tabular-nums text-navy-900">
                  {mastery === null ? '—' : `${mastery}%`}
                </span>
                {manage ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(() => removeLearnerFromClass(cls.id, learner.id))}
                    className="text-xs text-navy-400 underline hover:text-rose-700"
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Weekly tests ------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-navy-900">Weekly tests for this class</h3>
          <Link to="../../tests" relative="path" className="text-xs font-semibold text-gold-700 underline">
            Set a test
          </Link>
        </div>
        {tests.length === 0 ? (
          <p className="text-sm text-navy-500">
            None yet. When you set a weekly test, choose this class and only its learners will see it.
          </p>
        ) : (
          <ul className="card divide-y divide-navy-100">
            {tests.map((t) => {
              const done = (attempts[t.id] ?? []).filter((a) => a.submitted_at && memberIds.includes(a.learner_id))
              const got = done.reduce((s, a) => s + (a.marks_awarded ?? 0), 0)
              const outOf = done.reduce((s, a) => s + (a.marks_total ?? 0), 0)
              return (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900">{t.title}</p>
                    <p className="text-xs text-navy-500">
                      Due {new Date(t.due_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums text-navy-700">
                    {done.length}/{members.length} handed in
                    {outOf > 0 ? ` · average ${Math.round((got / outOf) * 100)}%` : ''}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Managing the class -------------------------------------------------- */}
      {manage ? (
        <section className="card space-y-4 p-5">
          <h3 className="font-bold text-navy-900">Manage this class</h3>

          {renaming ? (
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                maxLength={60}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input flex-1"
                aria-label="New class name"
              />
              <button type="button" disabled={busy} onClick={rename} className="btn-primary">
                Save
              </button>
              <button type="button" onClick={() => setRenaming(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNewName(cls.name)
                setRenaming(true)
              }}
              className="btn-outline btn-sm"
            >
              Rename
            </button>
          )}

          {leader ? (
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="handOver">
                Class teacher
              </label>
              <select
                id="handOver"
                className="select mt-1"
                value={cls.teacher_id ?? ''}
                disabled={busy}
                onChange={(e) => run(() => updateClass(cls.id, { teacher_id: e.target.value || null }))}
              >
                <option value="">No class teacher</option>
                {profile.role === 'school' && !staff.some((s) => s.id === profile.id) ? (
                  <option value={profile.id}>{profile.full_name} (you)</option>
                ) : null}
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-navy-400">Hand the class to another teacher, e.g. when someone leaves.</p>
            </div>
          ) : null}

          <div className="border-t border-navy-100 pt-4">
            {confirmDelete ? (
              <div className="space-y-2">
                <p className="text-sm text-navy-700">
                  Delete {cls.name}? The learners stay at the school and keep their progress; only the class goes.
                </p>
                <div className="flex gap-2">
                  <button type="button" disabled={busy} onClick={remove} className="btn-primary bg-rose-600 hover:bg-rose-700">
                    Delete the class
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="btn-ghost">
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="text-xs text-rose-700 underline">
                Delete this class
              </button>
            )}
          </div>
        </section>
      ) : null}
    </div>
  )
}
