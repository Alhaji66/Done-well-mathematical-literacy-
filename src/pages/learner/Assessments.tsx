import { useState } from 'react'
import { demoLearner } from '@/data/learner'
import { papersForSubject, type Paper } from '@/data/papers'
import type { Grade } from '@/types'
import { getAnsweredItemIds, countPaperItems } from '@/lib/paperProgress'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { PaperListItem } from '@/components/assessments/PaperListItem'
import { ClipboardIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const subjectOptions = [
  { id: 'mat-lit', name: 'Mathematical Literacy' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'physical-sciences', name: 'Physical Sciences' },
]

/**
 * Demo-mode equivalent of the real AssessmentsBrowse (under /account/.../assessments)
 * -- same real papers.ts content, but standalone from AccountAuthContext so
 * it works for the zero-signup "Try the demo" flow. Progress here is tracked
 * locally per browser (paperProgress.ts), keyed to the fixed demo persona;
 * nothing is written to any backend.
 */
export function LearnerAssessments() {
  const [subjectId, setSubjectId] = useState(demoLearner.subjectId)
  const [paperNumber, setPaperNumber] = useState<1 | 2>(1)
  const [grade, setGrade] = useState<Grade>(demoLearner.grade)

  const basePath = '/app/learner/assessments'
  const papers = papersForSubject(subjectId, paperNumber, grade)
  const predicted = papers.filter((p) => p.kind === 'predicted').sort((a, b) => (a.setLabel ?? '').localeCompare(b.setLabel ?? ''))
  const past = papers.filter((p) => p.kind === 'past').sort((a, b) => (b.year ?? 0) - (a.year ?? 0))

  const progressFor = (paper: Paper) => ({
    answered: getAnsweredItemIds(demoLearner.id, paper.id).size,
    total: countPaperItems(paper),
  })

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Assessments"
        title="Practice papers"
        description="Full-length practice papers written by DONE WELL, in the style of the real exam -- the same real content every DONE WELL learner uses."
      />

      <div className="card flex flex-col gap-4 p-4">
        <div>
          <p className="text-xs font-medium text-navy-500">Subject</p>
          <div className="mt-1 inline-flex flex-wrap rounded-lg border border-navy-200 bg-white p-1">
            {subjectOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubjectId(s.id)}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
                  subjectId === s.id ? 'bg-gold-500 text-navy-900' : 'text-navy-600 hover:bg-navy-50',
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-navy-500">Paper</p>
          <div className="mt-1 inline-flex rounded-lg border border-navy-200 bg-white p-1">
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPaperNumber(n)}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
                  paperNumber === n ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
                )}
              >
                Paper {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-navy-500">Grade</p>
          <div className="mt-1 inline-flex rounded-lg border border-navy-200 bg-white p-1">
            {([10, 11, 12] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
                  grade === g ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
                )}
              >
                Grade {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-navy-900">Predicted papers</h3>
        <p className="text-sm text-navy-500">
          Three independent DONE WELL predicted sets, so learners practise a range of question styles rather than one fixed set -- nobody
          can know exactly what will be asked.
        </p>
        {predicted.length === 0 ? (
          <EmptyState
            icon={<ClipboardIcon className="h-6 w-6" />}
            title="Coming soon"
            description="Predicted papers for this subject and paper are being written and will appear here soon."
          />
        ) : (
          <div className="space-y-3">
            {predicted.map((p) => (
              <PaperListItem key={p.id} paper={p} to={`${basePath}/${p.id}`} progress={progressFor(p)} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-navy-900">Past-exam-style papers (2020–2025)</h3>
        <p className="text-sm text-navy-500">Written by DONE WELL in the style of each year, for extra practice -- not transcripts of the actual papers.</p>
        {past.length === 0 ? (
          <EmptyState
            icon={<ClipboardIcon className="h-6 w-6" />}
            title="Coming soon"
            description="Past-exam-style papers for 2020–2025 are being written and will be added here in batches."
          />
        ) : (
          <div className="space-y-3">
            {past.map((p) => (
              <PaperListItem key={p.id} paper={p} to={`${basePath}/${p.id}`} progress={progressFor(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
