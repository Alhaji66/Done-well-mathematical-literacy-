import { schoolTeachers, classTopicPerformance } from '@/data/teacherSchool'
import { subjects } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SchoolIcon, UsersIcon, BarChartIcon } from '@/components/ui/Icons'

/**
 * The demo Head of Department view.
 *
 * Like the rest of /app/*, this runs on the mock data in teacherSchool.ts so
 * that a school can see what the role does before anyone signs up. The demo
 * HOD heads Mathematical Literacy, which the mock data already staffs with two
 * teachers covering different grades -- Alhaji T on 11 and 12, Mangyani T.S on
 * 10 -- so the page shows the thing the role exists for: one subject, more
 * than one teacher, all three grades.
 */
const DEPARTMENT_SUBJECT = 'mat-lit'

export function HodDashboard() {
  const subjectName = subjects.find((s) => s.id === DEPARTMENT_SUBJECT)?.name ?? 'Department'
  const teachers = schoolTeachers.filter((t) => t.subjectId === DEPARTMENT_SUBJECT)

  const learnerCount = teachers.reduce((sum, t) => sum + t.learnerCount, 0)

  /*
   * Weighted by learner count, not a plain mean of the teachers' averages.
   * A teacher with 118 learners and one with 101 do not contribute equally to
   * how the department is doing, and averaging the averages would say they do.
   */
  const departmentAverage = learnerCount
    ? Math.round(teachers.reduce((sum, t) => sum + t.classAverage * t.learnerCount, 0) / learnerCount)
    : null

  const gradesCovered = [...new Set(teachers.flatMap((t) => t.grades))].sort((a, b) => a - b)

  const weakest = [...classTopicPerformance].sort((a, b) => a.averagePercent - b.averagePercent).slice(0, 4)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Dashboard"
        title={`${subjectName} department`}
        description="Every teacher and every learner taking this subject, across all three grades."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Teachers</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{teachers.length}</p>
          <p className="mt-1 text-xs text-navy-500">
            Covering grade{gradesCovered.length === 1 ? '' : 's'} {gradesCovered.join(', ')}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Learners</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{learnerCount}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-navy-500">Department average</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">
            {departmentAverage === null ? '—' : `${departmentAverage}%`}
          </p>
          <p className="mt-1 text-xs text-navy-500">Weighted by class size</p>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2">
          <SchoolIcon className="h-4 w-4 text-navy-500" />
          <p className="text-sm font-semibold text-navy-900">Teachers in this department</p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Teacher</th>
                <th className="py-2 pr-4 font-medium">Grades</th>
                <th className="py-2 pr-4 font-medium">Learners</th>
                <th className="py-2 font-medium">Class average</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id} className="border-b border-navy-50 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-navy-900">{t.name}</td>
                  <td className="py-2.5 pr-4 text-navy-600">{t.grades.join(', ')}</td>
                  <td className="py-2.5 pr-4 text-navy-600">{t.learnerCount}</td>
                  <td className="py-2.5 font-semibold text-navy-900">{t.classAverage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*
          The demo can show per-teacher averages because the mock data states
          them. Real accounts cannot yet, and HodTeachers says so: nothing in
          the real data records which teacher a learner belongs to.
        */}
        <p className="mt-3 text-xs text-navy-400">
          Sample data. In a live school, per-teacher averages need teachers to be linked to their classes first.
        </p>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2">
          <BarChartIcon className="h-4 w-4 text-navy-500" />
          <p className="text-sm font-semibold text-navy-900">Weakest topics across the department</p>
        </div>
        <div className="mt-3 space-y-3">
          {weakest.map((t) => (
            <div key={t.topicId}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-navy-800">{getTopic(t.topicId)?.name ?? t.topicId}</span>
                <span className="font-semibold text-navy-900">{t.averagePercent}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-navy-100">
                <div className="h-full rounded-full bg-navy-900" style={{ width: `${t.averagePercent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card flex items-start gap-3 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
          <UsersIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-navy-900">What this view is for</p>
          <p className="mt-1 text-sm leading-relaxed text-navy-600">
            A teacher sees their own classes. A principal sees the whole school, every subject. This sits between
            them: one subject, every teacher who teaches it, every grade it is taught in.
          </p>
        </div>
      </div>
    </div>
  )
}
