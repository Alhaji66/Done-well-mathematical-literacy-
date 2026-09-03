import { useMemo, useState } from 'react'
import { filterResources } from '@/data/resources'
import { topics } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookIcon, DownloadIcon, EyeIcon, FilterIcon } from '@/components/ui/Icons'
import type { ResourceType } from '@/types'

const resourceTypes: ResourceType[] = ['Learner Book', 'Workbook', 'Teacher Guide', 'Test', 'Memo']

export function TeacherResources() {
  const [grade, setGrade] = useState<string>('all')
  const [topicId, setTopicId] = useState<string>('all')
  const [type, setType] = useState<string>('all')

  const results = useMemo(
    () =>
      filterResources({
        grade: grade === 'all' ? undefined : Number(grade),
        topicId: topicId === 'all' ? undefined : topicId,
        type: type === 'all' ? undefined : type,
      }),
    [grade, topicId, type],
  )

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Resources" title="Resource library" description="Filter by grade, topic and resource type to find what you need." />

      <div className="card p-4">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-navy-500">
          <FilterIcon className="h-3.5 w-3.5" /> FILTERS
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <select className="select" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="all">All grades</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <select className="select" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            <option value="all">All topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option>
            {resourceTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState icon={<BookIcon className="h-6 w-6" />} title="No resources match these filters" description="Try broadening your search — clear a filter and try again." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <div key={r.id} className="card flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <BookIcon className="h-4 w-4" />
                </span>
                <span className="badge-gold">{r.type}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-navy-500">Grade {r.grade}</p>
                <h3 className="mt-0.5 font-semibold text-navy-900">{r.title}</h3>
                <p className="mt-1 text-sm text-navy-600">{r.description}</p>
              </div>
              <div className="mt-auto flex gap-2 pt-2">
                <button type="button" className="btn-outline btn-sm flex-1 inline-flex items-center justify-center gap-1.5">
                  <EyeIcon className="h-4 w-4" /> View
                </button>
                <button type="button" className="btn-secondary btn-sm flex-1 inline-flex items-center justify-center gap-1.5">
                  <DownloadIcon className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
