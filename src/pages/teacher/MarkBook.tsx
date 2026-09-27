import { useMemo, useState } from 'react'
import { programmeFor, type SbaTask } from '@/data/sba'
import { markBookTasks, type SbaMarkRow } from '@/lib/sbaMarks'
import { MarkBookGrid } from '@/components/markbook/MarkBookGrid'
import { MarkBookOverview } from '@/components/markbook/MarkBookOverview'
import { AtRiskList } from '@/components/markbook/AtRiskList'
import { SchedulePanel } from '@/components/markbook/SchedulePanel'
import { demoDates } from '@/data/demoSchedule'
import { CLASSES, demoReleased, learners, sampleMarks, tasksOf, type Marks } from '@/data/demoMarkBook'
import type { TaskDate } from '@/lib/sbaSchedule'
import { ModerationPanel } from '@/components/markbook/ModerationPanel'
import { suggestSample, summarise, type ModerationDecision, type ModerationMark } from '@/lib/sbaModeration'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Grade } from '@/types'

/**
 * The demo mark book: two sample Mathematical Literacy classes with marks
 * already in for Terms 1 to 3, so a visitor sees the SBA and promotion marks
 * work. Edits change only this page. The real one is /account/…/markbook.
 */
interface DemoModeration {
  samples: ModerationMark[]
  decisions: Map<string, ModerationDecision>
}

/** In each class the Term 1 investigation has been moderated and accepted: five scripts, each within a mark or two. */
function sampleModeration(classId: string, grade: Grade, marks: Marks): DemoModeration {
  const task = tasksOf(grade)[0]
  const year = new Date().getFullYear()
  const scripts = learners
    .map((l) => ({ learnerId: l.id, row: marks.get(l.id)?.get(task.slot) }))
    .filter((s) => s.row?.status === 'marked')
    .map((s) => ({ learnerId: s.learnerId, mark: s.row!.mark ?? 0, percent: ((s.row!.mark ?? 0) / s.row!.out_of) * 100 }))
  const samples = suggestSample(scripts).map((id, i) => {
    const teacher = scripts.find((s) => s.learnerId === id)!.mark
    return {
      class_id: classId,
      year,
      task_key: task.slot,
      learner_id: id,
      teacher_mark: teacher,
      moderated_mark: Math.max(0, Math.min(task.marks, teacher + [-1, 1, 0, -2, 1][i % 5])),
      out_of: task.marks,
      moderator_id: 'demo-hod',
      updated_at: new Date(`${year}-04-14T10:00:00Z`).toISOString(),
    }
  })
  const summary = summarise(samples)!
  return {
    samples,
    decisions: new Map([
      [
        task.slot,
        {
          class_id: classId,
          year,
          task_key: task.slot,
          status: 'accepted',
          comment: '',
          sample_size: summary.n,
          mean_difference: Math.round(summary.meanDifference * 10) / 10,
          moderator_id: 'demo-hod',
          decided_at: new Date(`${year}-04-15T08:00:00Z`).toISOString(),
        },
      ],
    ]),
  }
}

export function DemoMarkBook() {
  const [view, setView] = useState<'overview' | 'class' | 'risk'>('overview')
  const [classId, setClassId] = useState(CLASSES[1].id)
  const cls = CLASSES.find((c) => c.id === classId)!
  const tasks = useMemo(() => tasksOf(cls.grade), [cls.grade])
  const [edits, setEdits] = useState<Record<string, Marks>>({})
  const marksOf = (id: string) => edits[id] ?? sampleMarks(tasksOf(CLASSES.find((c) => c.id === id)!.grade), id)
  const marks = marksOf(classId)
  // Terms 1 and 2 are released (in 11A, only what is fully marked); Term 3's marks are still with the teachers.
  const [released, setReleasedTasks] = useState<Record<string, Set<string>>>({})
  const releasedOf = (id: string) => released[id] ?? demoReleased(id, marksOf(id))
  const releasedHere = releasedOf(classId)
  const [dateEdits, setDateEdits] = useState<Record<string, Map<string, TaskDate>>>({})
  const datesOf = (id: string) => dateEdits[id] ?? demoDates('mat-lit', CLASSES.find((c) => c.id === id)!.grade, id, tasksOf(CLASSES.find((c) => c.id === id)!.grade))
  const allDates = new Map(CLASSES.map((c) => [c.id, datesOf(c.id)]))
  const [moderation, setModeration] = useState<Record<string, DemoModeration>>({})
  const moderationOf = (id: string) => moderation[id] ?? sampleModeration(id, CLASSES.find((c) => c.id === id)!.grade, marksOf(id))
  const modHere = moderationOf(classId)
  const setModHere = (next: DemoModeration) => setModeration((m) => ({ ...m, [classId]: next }))

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Formal assessment"
        title="SBA mark book"
        description="Every learner’s marks for the formal tasks of the DBE 2024–2025 Programme of Assessment, with their SBA and promotion marks worked out as you go."
      />
      <p className="rounded-lg bg-gold-50 p-3 text-sm text-gold-900">
        Demo: sample classes with marks in for Terms 1 to 3. Terms 1 and 2 are released to learners and parents; Term 3 is not yet. 11A is
        behind. Each Term 1 investigation has been moderated; below a class’s mark book you can moderate any task as its HOD would. Your
        changes stay on this page only.
      </p>
      <div className="flex w-fit flex-wrap rounded-lg border border-navy-200 bg-white p-1 print:hidden" role="group" aria-label="View">
        {(
          [
            ['overview', 'All classes'],
            ['class', 'Class mark book'],
            ['risk', 'Learners at risk'],
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
      {view === 'risk' ? (
        <AtRiskList
          classes={CLASSES}
          year={new Date().getFullYear()}
          members={new Map(CLASSES.map((c) => [c.id, learners.map((l) => l.id)]))}
          marks={new Map(CLASSES.map((c) => [c.id, marksOf(c.id)]))}
          names={new Map(learners.map((l) => [l.id, l.name]))}
          onOpen={(id) => {
            setClassId(id)
            setView('class')
          }}
          school="DONE WELL Demo High School"
          dates={allDates}
          teacherOf={() => 'Mr S. Nkosi'}
          onStartGroup={async () => undefined}
          groupsLink={<span>(In the demo nothing is saved.)</span>}
        />
      ) : view === 'overview' ? (
        <MarkBookOverview
          classes={CLASSES}
          year={new Date().getFullYear()}
          members={new Map(CLASSES.map((c) => [c.id, learners.map((l) => l.id)]))}
          marks={new Map(CLASSES.map((c) => [c.id, marksOf(c.id)]))}
          released={new Map(CLASSES.map((c) => [c.id, releasedOf(c.id)]))}
          moderated={new Map(CLASSES.map((c) => [c.id, moderationOf(c.id).decisions]))}
          dates={allDates}
          onOpen={(id) => {
            setClassId(id)
            setView('class')
          }}
        />
      ) : (
        <>
        <div className="card flex flex-wrap items-end gap-3 p-4">
          <label className="min-w-0 max-w-full text-xs font-medium text-navy-500">
            Class
            <select className="select mt-1 w-full max-w-full sm:w-auto" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · Grade {c.grade}
                </option>
              ))}
            </select>
          </label>
        </div>
        <MarkBookGrid
          title={`${cls.name} · Grade ${cls.grade} · demo`}
          grade={cls.grade}
          tasks={tasks}
          learners={learners}
          marks={marks}
          editable
          released={releasedHere}
          onRelease={async (task, on) => {
            const next = new Set(releasedHere)
            if (on) next.add(task.slot)
            else next.delete(task.slot)
            setReleasedTasks((r) => ({ ...r, [classId]: next }))
            return undefined
          }}
          onSave={async (learnerId, task, value) => {
            const next = new Map([...marks].map(([k, v]) => [k, new Map(v)]))
            const row = next.get(learnerId) ?? new Map()
            if (value === null) row.delete(task.slot)
            else row.set(task.slot, { mark: typeof value === 'number' ? value : null, status: typeof value === 'number' ? 'marked' : value, out_of: task.marks })
            next.set(learnerId, row)
            setEdits((e) => ({ ...e, [classId]: next }))
            return undefined
          }}
        />
        <SchedulePanel
          key={`dates-${classId}`}
          tasks={tasks}
          dates={datesOf(classId)}
          editable
          heading={{
            school: 'DONE WELL Demo High School',
            classLabel: cls.name,
            subject: 'Mathematical Literacy',
            grade: cls.grade,
            year: new Date().getFullYear(),
            teacher: 'Mr S. Nkosi',
          }}
          onSave={async (task, dueOn, note) => {
            const next = new Map(datesOf(classId))
            if (dueOn === null) next.delete(task.slot)
            else next.set(task.slot, { class_id: classId, year: new Date().getFullYear(), task_key: task.slot, subject_id: 'mat-lit', grade: cls.grade, due_on: dueOn, note: note.trim() })
            setDateEdits((d) => ({ ...d, [classId]: next }))
            return undefined
          }}
        />
        <ModerationPanel
          key={classId}
          tasks={tasks}
          learners={learners}
          marks={marks}
          samples={modHere.samples}
          decisions={modHere.decisions}
          canModerate
          report={{
            school: 'DONE WELL Demo High School',
            classLabel: cls.name,
            subject: 'Mathematical Literacy',
            grade: cls.grade,
            year: new Date().getFullYear(),
            teacher: 'Mr S. Nkosi',
            names: new Map([...learners.map((l) => [l.id, l.name] as [string, string]), ['demo-hod', 'Ms T. Dube (HOD)']]),
          }}
          onSave={async (task, learnerId, mark) => {
            const rest = modHere.samples.filter((x) => !(x.task_key === task.slot && x.learner_id === learnerId))
            const teacher = marks.get(learnerId)?.get(task.slot)?.mark ?? 0
            setModHere({
              ...modHere,
              samples:
                mark === null
                  ? rest
                  : [
                      ...rest,
                      {
                        class_id: classId,
                        year: new Date().getFullYear(),
                        task_key: task.slot,
                        learner_id: learnerId,
                        teacher_mark: teacher,
                        moderated_mark: mark,
                        out_of: task.marks,
                        moderator_id: 'demo-hod',
                        updated_at: new Date().toISOString(),
                      },
                    ],
            })
            return undefined
          }}
          onDecide={async (task, accept, comment) => {
            const summary = summarise(modHere.samples.filter((x) => x.task_key === task.slot))
            if (!summary) return 'Moderate at least one script first.'
            const decisions = new Map(modHere.decisions)
            decisions.set(task.slot, {
              class_id: classId,
              year: new Date().getFullYear(),
              task_key: task.slot,
              status: accept ? 'accepted' : 'returned',
              comment: comment.trim(),
              sample_size: summary.n,
              mean_difference: Math.round(summary.meanDifference * 10) / 10,
              moderator_id: 'demo-hod',
              decided_at: new Date().toISOString(),
            })
            setModHere({ ...modHere, decisions })
            return undefined
          }}
          onReopen={async (task) => {
            const decisions = new Map(modHere.decisions)
            decisions.delete(task.slot)
            setModHere({ ...modHere, decisions })
            return undefined
          }}
        />
        </>
      )}
    </div>
  )
}
