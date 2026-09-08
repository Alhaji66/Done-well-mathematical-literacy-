import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchLinkedChildren, type LinkedChild } from '@/lib/parentLinks'
import { filterResources } from '@/data/resources'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookIcon, DownloadIcon, EyeIcon, HeartHandshakeIcon } from '@/components/ui/Icons'

const subjectNames: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
}

function ChildResources({ child }: { child: LinkedChild }) {
  const subjectName = child.subject_id ? subjectNames[child.subject_id] ?? child.subject_id : null
  const items = child.grade && child.subject_id ? filterResources({ grade: child.grade, subjectId: child.subject_id }) : []

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-navy-900">
        {child.full_name}
        {child.grade && subjectName ? <span className="font-normal text-navy-500"> — Grade {child.grade} {subjectName}</span> : null}
      </h3>

      {!child.grade || !child.subject_id ? (
        <EmptyState
          icon={<BookIcon className="h-6 w-6" />}
          title="Grade and subject not set yet"
          description={`${child.full_name} hasn't finished setting up their profile, so materials can't be matched yet.`}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<BookIcon className="h-6 w-6" />}
          title="No resources yet"
          description={`Grade ${child.grade} ${subjectName} materials are being added and will appear here soon.`}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <div key={r.id} className="card flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <BookIcon className="h-4 w-4" />
                </span>
                <span className="badge-gold">{r.type}</span>
              </div>
              <div>
                <h4 className="font-semibold text-navy-900">{r.title}</h4>
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

/**
 * Real (non-demo) equivalent of the demo's ParentResources -- instead of a
 * fixed demo persona, this filters resources.ts to each of the parent's
 * actually-linked children's real grade and subject (via parent_learner_links,
 * the same data ParentDashboard reads).
 */
export function ParentResources() {
  const { profile } = useAccountAuth()
  const [children, setChildren] = useState<LinkedChild[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    fetchLinkedChildren(profile.id).then((rows) => {
      setChildren(rows)
      setLoading(false)
    })
  }, [profile])

  if (!profile) return null

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Resources" title="What your child is using" description="The same materials your linked children are using in class, matched to each of their grades and subjects." />

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : children.length === 0 ? (
        <EmptyState
          icon={<HeartHandshakeIcon className="h-6 w-6" />}
          title="Link a child to see their resources"
          description="Once you link your child's account from the Dashboard, their class materials will show up here."
          action={
            <Link to="/account/parent/dashboard" className="btn-primary btn-sm">
              Go to Dashboard
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {children.map((child) => (
            <ChildResources key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  )
}
