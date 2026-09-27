import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { programmeFor, PROGRAMME_SOURCE } from '@/data/sba'
import { canManageClass, classesInView, fetchClassMembers, fetchClasses, type SchoolClass } from '@/lib/classes'
import { fetchSchoolLearners, type RosterLearner } from '@/lib/teacherRoster'
import { fetchClassMarks, fetchMarksFor, fetchReleases, fetchReleasesFor, markBookTasks, saveMark, setReleased, type SbaMarkRow } from '@/lib/sbaMarks'
import { byLearner as groupByLearner } from '@/lib/sbaProgress'
import { MarkBookOverview } from '@/components/markbook/MarkBookOverview'
import { cn } from '@/lib/utils'
import { MarkBookGrid } from '@/components/markbook/MarkBookGrid'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardCheckIcon } from '@/components/ui/Icons'

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id

/**
 * The SBA mark book for a class: the DBE programme's formal tasks down the
 * top, the class list down the side. The class's teacher, the HODs and the
 * principal enter marks; any staff member can read them (STEP 21).
 */
export function MarkBook() {
  const { profile } = useAccountAuth()
  const schoolId = profile?.school_id ?? null
  const year = new Date().getFullYear()
  const [classes, setClasses] = useState<SchoolClass[] | null>(null)
  const [classId, setClassId] = useState('')
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [rows, setRows] = useState<SbaMarkRow[]>([])
  const [notSetUp, setNotSetUp] = useState(false)
  const [released, setReleasedTasks] = useState<Set<string> | null>(null)
  const [view, setView] = useState<'overview' | 'class' | null>(null)
  const [overview, setOverview] = useState<{
    members: Map<string, string[]>
    marks: Map<string, Map<string, Map<string, SbaMarkRow>>>
    released: Map<string, Set<string>> | null
  } | null>(null)

  useEffect(() => {
    if (!schoolId) return
    let live = true
    Promise.all([fetchClasses(schoolId), fetchSchoolLearners(schoolId)]).then(([{ classes: all }, roster]) => {
      if (!live) return
      const mine = classesInView(profile, all)
      setClasses(mine)
      setLearners(roster)
      setClassId((c) => c || mine[0]?.id || '')
      // A head of department or principal starts from the overview; a teacher from their class.
      setView((v) => v ?? (mine.length > 1 && profile?.role !== 'teacher' ? 'overview' : 'class'))
    })
    return () => {
      live = false
    }
  }, [schoolId, profile])

  useEffect(() => {
    if (!classId) return
    let live = true
    Promise.all([fetchClassMembers([classId]), fetchClassMarks(classId, year), fetchReleases(classId, year)]).then(([members, marks, releases]) => {
      if (!live) return
      setMemberIds(members.map((m) => m.learner_id))
      setReleasedTasks(releases)
      setRows(marks.rows)
      setNotSetUp(marks.notSetUp)
    })
    return () => {
      live = false
    }
  }, [classId, year])

  useEffect(() => {
    if (view !== 'overview' || !classes?.length) return
    let live = true
    const ids = classes.map((c) => c.id)
    Promise.all([fetchClassMembers(ids), fetchMarksFor(ids, year), fetchReleasesFor(ids, year)]).then(([members, rows, releases]) => {
      if (!live) return
      if (rows === null) {
        setNotSetUp(true)
        return
      }
      const byClass = new Map<string, string[]>()
      for (const m of members) byClass.set(m.class_id, [...(byClass.get(m.class_id) ?? []), m.learner_id])
      const marks = new Map<string, Map<string, Map<string, SbaMarkRow>>>()
      for (const id of ids) marks.set(id, groupByLearner(rows.filter((r) => r.class_id === id)))
      setOverview({ members: byClass, marks, released: releases })
    })
    return () => {
      live = false
    }
  }, [view, classes, year])

  const cls = classes?.find((c) => c.id === classId)
  const tasks = useMemo(() => (cls ? markBookTasks(programmeFor(cls.subject_id, cls.grade)) : []), [cls])
  const names = new Map(learners.map((l) => [l.id, l.full_name]))
  const classLearners = memberIds
    .map((id) => ({ id, name: names.get(id) ?? 'A learner' }))
    .sort((a, b) => a.name.localeCompare(b.name))
  const byLearner = useMemo(() => {
    const m = new Map<string, Map<string, SbaMarkRow>>()
    for (const r of rows) {
      if (!m.has(r.learner_id)) m.set(r.learner_id, new Map())
      m.get(r.learner_id)!.set(r.task_key, r)
    }
    return m
  }, [rows])

  if (!profile) return null

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Formal assessment"
        title="SBA mark book"
        description={`Every learner’s marks for the formal tasks of the ${PROGRAMME_SOURCE}, with their SBA and promotion marks worked out as you go. Export it for SA-SAMS or print it for the file.`}
      />

      {classes === null ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : classes.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheckIcon className="h-6 w-6" />}
          title="No classes yet"
          description="The mark book works class by class. Set up your class and add its learners first."
          action={
            <Link to="../classes" relative="path" className="btn-primary">
              Go to Classes
            </Link>
          }
        />
      ) : (
        <>
          {classes.length > 1 ? (
            <div className="flex w-fit flex-wrap rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label="View">
              {(
                [
                  ['overview', 'All classes'],
                  ['class', 'Class mark book'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                  className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', view === id ? 'bg-navy-900 text-white' : 'text-navy-600')}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {view === 'overview' ? (
            notSetUp ? (
              <EmptyState
                icon={<ClipboardCheckIcon className="h-6 w-6" />}
                title="Not set up yet"
                description="The mark book needs STEP 21 of the database set-up. Ask whoever runs your school’s DONE WELL account to add it."
              />
            ) : overview === null ? (
              <p className="text-sm text-navy-500">Loading…</p>
            ) : (
              <MarkBookOverview
                classes={classes}
                year={year}
                members={overview.members}
                marks={overview.marks}
                released={overview.released}
                onOpen={(id) => {
                  setClassId(id)
                  setView('class')
                }}
              />
            )
          ) : (
            <>
            <div className="card flex flex-wrap items-end gap-3 p-4">
              <label className="min-w-0 max-w-full text-xs font-medium text-navy-500">
                Class
                <select className="select mt-1 w-full max-w-full sm:w-auto" value={classId} onChange={(e) => setClassId(e.target.value)}>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {subjectName(c.subject_id)} Grade {c.grade}
                    </option>
                  ))}
                </select>
              </label>
              <p className="pb-2 text-sm text-navy-600">{year}</p>
            </div>

            {notSetUp ? (
              <EmptyState
                icon={<ClipboardCheckIcon className="h-6 w-6" />}
                title="Not set up yet"
                description="The mark book needs STEP 21 of the database set-up. Ask whoever runs your school’s DONE WELL account to add it."
              />
            ) : !cls ? null : tasks.length === 0 ? (
              <EmptyState icon={<ClipboardCheckIcon className="h-6 w-6" />} title="No programme" description="There is no Programme of Assessment for this subject yet." />
            ) : classLearners.length === 0 ? (
              <EmptyState
                icon={<ClipboardCheckIcon className="h-6 w-6" />}
                title="No learners in this class"
                description="Add learners to the class under Classes, and they will appear here."
              />
            ) : (
              <MarkBookGrid
                title={`${cls.name} · ${subjectName(cls.subject_id)} Grade ${cls.grade} · ${year}`}
                grade={cls.grade}
                tasks={tasks}
                learners={classLearners}
                marks={byLearner}
                editable={canManageClass(profile, cls)}
                onSave={async (learnerId, task, value) => {
                  const res = await saveMark({ classId: cls.id, learnerId, year, taskKey: task.slot, outOf: task.marks, value })
                  if (res.error) return res.error
                  setRows((rs) => {
                    const rest = rs.filter((r) => !(r.learner_id === learnerId && r.task_key === task.slot))
                    return res.row ? [...rest, res.row] : rest
                  })
                  return undefined
                }}
                released={released ?? undefined}
                onRelease={async (task, on) => {
                  const error = await setReleased(cls.id, year, task.slot, on)
                  if (!error)
                    setReleasedTasks((r) => {
                      const next = new Set(r)
                      if (on) next.add(task.slot)
                      else next.delete(task.slot)
                      return next
                    })
                  return error
                }}
              />
            )}
            </>
          )}
        </>
      )}
    </div>
  )
}
