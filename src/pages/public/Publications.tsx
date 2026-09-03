import { Link } from 'react-router-dom'
import { resources } from '@/data/resources'
import { subjects } from '@/data/subjects'
import { BookIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { SectionHeading } from '@/components/ui/SectionHeading'

const typeOrder = ['Learner Book', 'Workbook', 'Teacher Guide', 'Test', 'Memo'] as const

export function Publications() {
  const matLit = subjects.find((s) => s.id === 'mat-lit')!
  const grades = [12, 11, 10] as const

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        eyebrow="Publications"
        title={`${matLit.name} resource library`}
        description="Every Done Well publication connects: Learner Book → Workbook → Teacher Guide → Tests → Memos → Assessment Data → Targeted Intervention."
      />

      <div className="mt-10 space-y-10">
        {grades.map((grade) => {
          const items = resources
            .filter((r) => r.subjectId === matLit.id && r.grade === grade)
            .sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type))
          return (
            <div key={grade}>
              <h3 className="text-lg font-bold text-navy-900">Grade {grade}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div key={item.id} className="card flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                        <BookIcon className="h-4 w-4" />
                      </span>
                      <span className="badge-gold">{item.type}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-900">{item.title}</h4>
                      <p className="mt-1 text-sm text-navy-600">{item.description}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-navy-500">
                      <span>{item.pages ? `${item.pages} pages` : item.updated}</span>
                      <span>{item.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card mt-14 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-navy-900">Want the full library, filterable by topic?</h3>
          <p className="mt-1 text-sm text-navy-600">Teachers get an advanced resource browser inside their dashboard.</p>
        </div>
        <Link to="/sign-in?role=teacher" className="btn-primary inline-flex shrink-0 items-center gap-1">
          Open teacher resources <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
