import { useMemo, useState } from 'react'
import { filterQuestions } from '@/data/questions'
import { topics, getTopic } from '@/data/topics'
import { subjects } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { DifficultyBadge } from '@/components/ui/Badges'
import { EmptyState } from '@/components/ui/EmptyState'
import { SparkleIcon, DownloadIcon, ClipboardIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Difficulty, Grade } from '@/types'

const teachableSubjectIds = ['mat-lit', 'mathematics']
const teachableSubjects = subjects.filter((s) => teachableSubjectIds.includes(s.id))

export function TeacherQuestionBank() {
  const [subjectId, setSubjectId] = useState<string>('mat-lit')
  const [grade, setGrade] = useState<Grade>(12)
  const [topicId, setTopicId] = useState<string>(topics.find((t) => t.subjectId === 'mat-lit')!.id)
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [worksheet, setWorksheet] = useState<ReturnType<typeof filterQuestions> | null>(null)
  const [view, setView] = useState<'worksheet' | 'memo'>('worksheet')

  const topicOptions = topics.filter((t) => t.subjectId === subjectId)

  const matches = useMemo(
    () => filterQuestions({ topicId, grade, difficulty: difficulty === 'All' ? undefined : difficulty }),
    [topicId, grade, difficulty],
  )

  const totalMarks = matches.reduce((s, q) => s + q.marks, 0)
  const topic = getTopic(topicId)
  const subjectName = subjects.find((s) => s.id === subjectId)?.name ?? ''

  const changeSubject = (id: string) => {
    setSubjectId(id)
    setTopicId(topics.find((t) => t.subjectId === id)?.id ?? '')
  }

  const generate = () => {
    setWorksheet(matches)
    setView('worksheet')
  }

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Question Bank" title="Generate a worksheet" description="Select criteria and generate a printable learner worksheet with a matching teacher memo." />

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-navy-500">Subject</label>
            <select className="select mt-1" value={subjectId} onChange={(e) => changeSubject(e.target.value)}>
              {teachableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Grade</label>
            <select className="select mt-1" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Topic</label>
            <select className="select mt-1" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {topicOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Difficulty</label>
            <select className="select mt-1" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | 'All')}>
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenge">Challenge</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Marks in selection</label>
            <div className="input mt-1 flex items-center justify-between text-navy-500">
              <span>{matches.length} questions</span>
              <span className="font-semibold text-navy-800">{totalMarks} marks</span>
            </div>
          </div>
        </div>
        <button type="button" onClick={generate} disabled={matches.length === 0} className="btn-primary mt-4 inline-flex items-center gap-2">
          <SparkleIcon className="h-4 w-4" /> Generate worksheet
        </button>
      </div>

      {!worksheet ? (
        <EmptyState
          icon={<ClipboardIcon className="h-6 w-6" />}
          title="No worksheet generated yet"
          description="Choose your criteria above and click Generate worksheet to preview a printable learner worksheet and memo."
        />
      ) : worksheet.length === 0 ? (
        <EmptyState icon={<ClipboardIcon className="h-6 w-6" />} title="No questions match this selection" description="Try a different topic or difficulty." />
      ) : (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 p-4">
            <div className="inline-flex rounded-lg border border-navy-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setView('worksheet')}
                className={cn('rounded-md px-4 py-1.5 text-sm font-semibold', view === 'worksheet' ? 'bg-navy-900 text-white' : 'text-navy-600')}
              >
                Learner Worksheet
              </button>
              <button
                type="button"
                onClick={() => setView('memo')}
                className={cn('rounded-md px-4 py-1.5 text-sm font-semibold', view === 'memo' ? 'bg-navy-900 text-white' : 'text-navy-600')}
              >
                Teacher Memo
              </button>
            </div>
            <button type="button" onClick={() => window.print()} className="btn-outline btn-sm inline-flex items-center gap-1.5">
              <DownloadIcon className="h-4 w-4" /> Print / Save PDF
            </button>
          </div>

          <div className="print-area p-6 sm:p-8">
            <div className="mb-6 border-b border-dashed border-navy-200 pb-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">DONE WELL® {subjectName}</p>
              <h2 className="mt-1 text-lg font-bold text-navy-900">
                Grade {grade} — {topic?.name} {view === 'memo' ? '(Teacher Memo)' : 'Worksheet'}
              </h2>
              <p className="mt-1 text-xs text-navy-500">
                {worksheet.length} questions · {worksheet.reduce((s, q) => s + q.marks, 0)} marks total
              </p>
              {view === 'worksheet' ? (
                <div className="mt-4 flex justify-center gap-8 text-sm text-navy-600">
                  <span>Name: _____________________________</span>
                  <span>Date: _______________</span>
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              {worksheet.map((q, i) => (
                <div key={q.id} className="print-avoid-break">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-navy-900">
                      {i + 1}. {q.prompt}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <DifficultyBadge difficulty={q.difficulty} />
                      <span className="badge-slate">{q.marks} marks</span>
                    </div>
                  </div>
                  {q.context ? <p className="mt-1.5 text-sm italic text-navy-500">{q.context}</p> : null}
                  {q.options ? (
                    <ul className="mt-2 space-y-1 pl-4 text-sm text-navy-700">
                      {q.options.map((o) => (
                        <li key={o.id}>
                          {o.id.toUpperCase()}) {o.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 h-10 rounded border border-dashed border-navy-200" />
                  )}
                  {view === 'memo' ? (
                    <div className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                      <strong>Answer:</strong> {q.answer}
                      <p className="mt-1 text-emerald-700">{q.explanation}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
