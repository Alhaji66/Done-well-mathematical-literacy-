import { assessments } from '@/data/assessments'
import { getTopic } from '@/data/topics'
import { schoolGradeSummaries } from '@/data/teacherSchool'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatusBadge } from '@/components/ui/Badges'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatDate } from '@/lib/utils'
import { CalendarIcon, ClipboardIcon } from '@/components/ui/Icons'

export function SchoolAssessments() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Assessments" title="Assessment completion" description="Test participation and completion rates across grades." />

      <div className="card p-5">
        <h3 className="font-bold text-navy-900">Completion by grade</h3>
        <div className="mt-4 space-y-4">
          {schoolGradeSummaries.map((g) => (
            <div key={g.grade}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-navy-900">Grade {g.grade}</span>
                <span className="text-navy-600">{g.testCompletionPercent}% completed</span>
              </div>
              <ProgressBar percent={g.testCompletionPercent} className="mt-1.5" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-navy-900">Recent & upcoming assessments</h3>
        <div className="mt-4 space-y-2.5">
          {assessments.map((a) => (
            <div key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-navy">{a.type}</span>
                  <span className="badge-slate">Grade {a.grade}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-navy-900">{a.title}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" /> {formatDate(a.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClipboardIcon className="h-3.5 w-3.5" /> {a.totalMarks} marks
                  </span>
                  <span>{a.topicIds.map((t) => getTopic(t)?.name).join(', ')}</span>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
