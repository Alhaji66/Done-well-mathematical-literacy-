import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { subjects } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowLeftIcon, BookIcon } from '@/components/ui/Icons'
import { RichText } from '@/components/content/RichText'
import { KIND_LABEL, fetchContentItem, type ContentItem } from '@/lib/content'

/** One published item from the content workflow. */
export function ResourceItem() {
  const { itemId } = useParams<{ itemId: string }>()
  const [item, setItem] = useState<ContentItem | null | undefined>(undefined)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    if (itemId) fetchContentItem(itemId).then(setItem)
  }, [itemId])

  const back = (
    <Link to="../.." relative="path" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900">
      <ArrowLeftIcon className="h-4 w-4" /> Resource centre
    </Link>
  )

  if (item === undefined) return <p className="text-sm text-navy-500">Loading…</p>
  if (!item) {
    return (
      <div className="space-y-6">
        {back}
        <EmptyState
          icon={<BookIcon className="h-6 w-6" />}
          title="This resource is not available"
          description="It may have been taken down for an update, or it is for teachers only."
        />
      </div>
    )
  }

  const meta = [
    item.subject_id ? subjects.find((s) => s.id === item.subject_id)?.name : null,
    item.grade ? `Grade ${item.grade}` : null,
    item.topic_id ? getTopic(item.topic_id)?.name : null,
    item.difficulty,
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      {back}
      <SectionHeading eyebrow={KIND_LABEL[item.kind]} title={item.title} description={meta.join(' · ')} />
      <article className="card space-y-4 p-6">
        {item.summary ? <p className="text-base font-medium text-navy-700">{item.summary}</p> : null}
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
            {item.kind === 'video' ? 'Watch the video' : 'Open the document'}
          </a>
        ) : null}
        {item.body ? <RichText text={item.body} /> : null}
        {item.answer ? (
          <div className="border-t border-navy-100 pt-4">
            {showAnswer ? (
              <div className="rounded-lg bg-navy-50 p-4">
                <p className="text-sm font-semibold text-navy-900">Answer{item.marks ? ` (${item.marks} marks)` : ''}</p>
                <div className="mt-2">
                  <RichText text={item.answer} />
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowAnswer(true)} className="btn-outline btn-sm">
                Show the answer
              </button>
            )}
          </div>
        ) : null}
      </article>
      {item.published_at ? (
        <p className="text-xs text-navy-400">
          Reviewed and published by DONE WELL on {new Date(item.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>
      ) : null}
    </div>
  )
}
