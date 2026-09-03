import { resources } from '@/data/resources'
import { demoLearner } from '@/data/learner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BookIcon, EyeIcon } from '@/components/ui/Icons'

export function ParentResources() {
  const items = resources.filter((r) => r.subjectId === demoLearner.subjectId && r.grade === demoLearner.grade)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Resources"
        title="What your child is using"
        description={`The same Grade ${demoLearner.grade} Mathematical Literacy materials used in class.`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="card flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <BookIcon className="h-4 w-4" />
              </span>
              <span className="badge-gold">{item.type}</span>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-1 text-sm text-navy-600">{item.description}</p>
            </div>
            <button type="button" className="btn-outline btn-sm mt-auto inline-flex items-center gap-1.5 self-start">
              <EyeIcon className="h-4 w-4" /> Preview
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
