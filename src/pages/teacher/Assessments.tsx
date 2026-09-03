import { useState } from 'react'
import { assessments } from '@/data/assessments'
import { getTopic } from '@/data/topics'
import { demoTeacher } from '@/data/teacherSchool'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatusBadge } from '@/components/ui/Badges'
import { formatDate, cn } from '@/lib/utils'
import { ClipboardIcon, CalendarIcon, ClockIcon, EyeIcon, DownloadIcon } from '@/components/ui/Icons'

export function TeacherAssessments() {
  const [selectedId, setSelectedId] = useState(assessments[0]?.id ?? '')
  const [view, setView] = useState<'learner' | 'memo'>('learner')
  const selected = assessments.find((a) => a.id === selectedId)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Assessments"
        title="Weekly & revision tests"
        description={`Manage tests for your classes: ${demoTeacher.classes.map((c) => c.name).join(', ')}.`}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="space-y-2.5">
          {assessments.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedId(a.id)}
              className={cn(
                'card block w-full p-4 text-left transition-colors',
                selectedId === a.id ? 'border-gold-500 ring-1 ring-gold-500' : 'hover:border-navy-300',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="badge-navy">{a.type}</span>
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-2 text-sm font-semibold text-navy-900">{a.title}</p>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" /> {formatDate(a.date)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" /> {a.durationMinutes} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClipboardIcon className="h-3.5 w-3.5" /> {a.totalMarks} marks
                </span>
              </div>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-navy-900">{selected.title}</h3>
                <p className="mt-1 text-sm text-navy-500">
                  Grade {selected.grade} · {selected.totalMarks} marks · {selected.durationMinutes} minutes
                </p>
              </div>
              <div className="inline-flex rounded-lg border border-navy-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setView('learner')}
                  className={cn('rounded-md px-3 py-1.5 text-xs font-semibold sm:text-sm', view === 'learner' ? 'bg-navy-900 text-white' : 'text-navy-600')}
                >
                  Learner Version
                </button>
                <button
                  type="button"
                  onClick={() => setView('memo')}
                  className={cn('rounded-md px-3 py-1.5 text-xs font-semibold sm:text-sm', view === 'memo' ? 'bg-navy-900 text-white' : 'text-navy-600')}
                >
                  Memo / Guideline
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {selected.topicIds.map((tid) => {
                const t = getTopic(tid)
                return t ? <span key={tid} className="badge-slate">{t.name}</span> : null
              })}
            </div>

            <div className="mt-5 rounded-xl border border-navy-100 bg-navy-50 p-5">
              {view === 'learner' ? (
                <div>
                  <p className="text-sm text-navy-700">
                    This test includes {selected.topicIds.length} topic{selected.topicIds.length > 1 ? 's' : ''} covering{' '}
                    {selected.topicIds.map((tid) => getTopic(tid)?.name).join(', ')}. Questions are drawn from the Done Well
                    question bank at a range of difficulties, totalling {selected.totalMarks} marks.
                  </p>
                  <p className="mt-3 text-xs text-navy-500">Answer all questions. Show all working. No answer key included in the learner version.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-navy-700">
                    Full marking guideline available with method marks, common error notes and moderation guidance for each
                    question in this assessment.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-emerald-700">Includes complete answer key — for teacher use only.</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button type="button" className="btn-outline btn-sm inline-flex items-center gap-1.5">
                <EyeIcon className="h-4 w-4" /> Preview
              </button>
              <button type="button" className="btn-secondary btn-sm inline-flex items-center gap-1.5">
                <DownloadIcon className="h-4 w-4" /> Download
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
