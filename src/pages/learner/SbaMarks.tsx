import { useMemo } from 'react'
import { demoLearner } from '@/data/learner'
import { programmeFor, PROGRAMME_SOURCE } from '@/data/sba'
import { markBookTasks, type SbaMarkRow } from '@/lib/sbaMarks'
import { ComingUp, SbaReport } from '@/components/markbook/SbaReport'
import type { TaskDate } from '@/lib/sbaSchedule'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** Sample marks for the demo learner: Terms 1 and 2 marked, Term 3 part-way. */
const SAMPLE = [0.74, 0.66, 0.8, 0.61, 0.7]

/** The demo learner's SBA marks; the parent demo shows the same child. */
export function DemoSbaMarks({ parent = false }: { parent?: boolean }) {
  const year = new Date().getFullYear()
  const marks = useMemo(() => {
    const tasks = markBookTasks(programmeFor(demoLearner.subjectId, demoLearner.grade)).filter((t) => t.sbaWeight)
    const m = new Map<string, Pick<SbaMarkRow, 'mark' | 'status' | 'out_of'>>()
    SAMPLE.forEach((f, i) => {
      const t = tasks[i]
      if (t) m.set(t.slot, { mark: Math.round(f * t.marks), status: 'marked', out_of: t.marks })
    })
    return m
  }, [])
  // Sample dates: the marked tasks were written in past weeks, the rest are coming up.
  const dates = useMemo(() => {
    const tasks = markBookTasks(programmeFor(demoLearner.subjectId, demoLearner.grade)).filter((t) => t.sbaWeight)
    const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10)
    return new Map<string, TaskDate>(
      tasks.map((t, i) => [
        t.slot,
        {
          class_id: 'demo',
          year,
          task_key: t.slot,
          subject_id: demoLearner.subjectId,
          grade: demoLearner.grade,
          due_on: i < SAMPLE.length ? day(-7 * (SAMPLE.length - i) * 3) : day(9 + 14 * (i - SAMPLE.length)),
          note: i < SAMPLE.length ? '' : t.exam ? 'Paper 1 and Paper 2' : 'Bring a calculator',
        },
      ]),
    )
  }, [year])

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Formal assessment"
        title={parent ? 'SBA marks' : 'My SBA marks'}
        description={`${parent ? `${demoLearner.name}’s` : 'Your'} marks for the formal tasks of the ${PROGRAMME_SOURCE}, as ${parent ? 'their' : 'your'} teacher enters them, and what they add up to so far.`}
      />
      <p className="rounded-lg bg-gold-50 p-3 text-sm text-gold-900">Demo: sample marks for the first five tasks of the year.</p>
      <ComingUp dates={[...dates.values()]} />
      <SbaReport subjectId={demoLearner.subjectId} grade={demoLearner.grade} year={year} marks={marks} dates={dates} />
    </div>
  )
}
