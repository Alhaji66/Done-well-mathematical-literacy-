import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { programmeFor, PROGRAMME_SOURCE } from '@/data/sba'
import { canManageClass, classesInView, fetchClassMembers, fetchClasses, type SchoolClass } from '@/lib/classes'
import { fetchSchoolLearners, type RosterLearner } from '@/lib/teacherRoster'
import { fetchClassMarks, markBookTasks, saveMark, type SbaMarkRow } from '@/lib/sbaMarks'
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

  useEffect(() => {
    if (!schoolId) return
    let live = true
    Promise.all([fetchClasses(schoolId), fetchSchoolLearners(schoolId)]).then(([{ classes: all }, roster]) => {
      if (!live) return
      const mine = classesInView(profile, all)
      setClasses(mine)
      setLearners(roster)
      setClassId((c) => c || mine[0]?.id || '')
    })
    return () => {
      live = false
    }
  }, [schoolId, profile])

  useEffect(() => {
    if (!classId) return
    let live = true
    Promise.all([fetchClassMembers([classId]), fetchClassMarks(classId, year)]).then(([members, marks]) => {
      if (!live) return
      setMemberIds(members.map((m) => m.learner_id))
      setRows(marks.rows)
      setNotSetUp(marks.notSetUp)
    })
    return () => {
      live = false
    }
  }, [classId, year])

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
            />
          )}
        </>
      )}
    </div>
  )
}
