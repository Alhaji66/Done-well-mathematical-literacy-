import { schoolTeachers } from '@/data/teacherSchool'
import { getSubject } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SchoolIcon } from '@/components/ui/Icons'

export function SchoolTeachers() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Teachers" title="Teaching staff" description="Subjects, grades and class averages across your school." />

      <div className="grid gap-4 sm:grid-cols-2">
        {schoolTeachers.map((t) => {
          const subject = getSubject(t.subjectId)
          return (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <SchoolIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{t.name}</p>
                    <p className="text-xs text-navy-500">
                      {subject?.name} · Grade{t.grades.length > 1 ? 's' : ''} {t.grades.join(', ')}
                    </p>
                  </div>
                </div>
                <span className="badge-navy">{t.learnerCount} learners</span>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-navy-500">
                  <span>Class average</span>
                  <span>{t.classAverage}%</span>
                </div>
                <ProgressBar percent={t.classAverage} size="sm" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
