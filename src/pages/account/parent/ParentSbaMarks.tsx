import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { PROGRAMME_SOURCE } from '@/data/sba'
import { fetchLinkedChildren, type LinkedChild } from '@/lib/parentLinks'
import { LearnerSbaReports } from '@/components/markbook/SbaReport'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { HeartHandshakeIcon } from '@/components/ui/Icons'

/** A parent's view of each linked child's SBA marks. */
export function ParentSbaMarks() {
  const { profile } = useAccountAuth()
  const [children, setChildren] = useState<LinkedChild[] | null>(null)

  useEffect(() => {
    if (!profile) return
    let live = true
    fetchLinkedChildren(profile.id).then((rows) => {
      if (live) setChildren(rows)
    })
    return () => {
      live = false
    }
  }, [profile])

  if (!profile) return null
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Formal assessment"
        title="SBA marks"
        description={`Your child’s marks for the formal tasks of the ${PROGRAMME_SOURCE}, as their teachers enter them. These count towards the year’s promotion or final mark.`}
      />
      {children === null ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : children.length === 0 ? (
        <EmptyState
          icon={<HeartHandshakeIcon className="h-6 w-6" />}
          title="You haven't linked a child yet"
          description="Link your child's account from your Dashboard, and their SBA marks will show here."
          action={
            <Link to="../dashboard" relative="path" className="btn-primary">
              Go to Dashboard
            </Link>
          }
        />
      ) : (
        children.map((child) => (
          <div key={child.id} className="space-y-3">
            {children.length > 1 ? <h2 className="text-base font-bold text-navy-900">{child.full_name}</h2> : null}
            <LearnerSbaReports
              learnerId={child.id}
              empty={`${child.full_name}'s marks will show here once their teacher enters them in the class mark book.`}
            />
          </div>
        ))
      )}
    </div>
  )
}
