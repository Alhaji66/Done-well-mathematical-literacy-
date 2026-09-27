import { useMemo } from 'react'
import { demoLearner } from '@/data/learner'
import { programmeFor, PROGRAMME_SOURCE } from '@/data/sba'
import { markBookTasks, type SbaMarkRow } from '@/lib/sbaMarks'
import { SbaReport } from '@/components/markbook/SbaReport'
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

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Formal assessment"
        title={parent ? 'SBA marks' : 'My SBA marks'}
        description={`${parent ? `${demoLearner.name}’s` : 'Your'} marks for the formal tasks of the ${PROGRAMME_SOURCE}, as ${parent ? 'their' : 'your'} teacher enters them, and what they add up to so far.`}
      />
      <p className="rounded-lg bg-gold-50 p-3 text-sm text-gold-900">Demo: sample marks for the first five tasks of the year.</p>
      <SbaReport subjectId={demoLearner.subjectId} grade={demoLearner.grade} year={year} marks={marks} />
    </div>
  )
}
