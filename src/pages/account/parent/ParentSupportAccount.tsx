import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { getTopic } from '@/data/topics'
import { fetchLinkedChildren, type LinkedChild } from '@/lib/parentLinks'
import { fetchMistakes, type Mistake } from '@/lib/mistakes'
import { CatchUpGroups } from '@/components/account/CatchUpGroups'
import { ParentSupport } from '@/pages/parent/Support'

/**
 * A real parent's support page: what the school is doing for their child, the
 * topics their child keeps getting wrong, then the general guidance.
 *
 * The general guidance alone told every parent the same thing. This puts their
 * own child's evidence first -- the catch-up groups the school has started and
 * the topics with the most open mistakes -- so "how can I help?" has an answer
 * about this child.
 */
export function ParentSupportAccount() {
  const { profile } = useAccountAuth()
  const [children, setChildren] = useState<LinkedChild[]>([])
  const [mistakes, setMistakes] = useState<Mistake[]>([])

  useEffect(() => {
    if (!profile) return
    let active = true
    fetchLinkedChildren(profile.id).then(async (kids) => {
      if (!active) return
      setChildren(kids)
      const r = await fetchMistakes(kids.map((k) => k.id))
      if (active) setMistakes(r.mistakes.filter((m) => !m.resolved_at))
    })
    return () => {
      active = false
    }
  }, [profile])

  const names = new Map(children.map((c) => [c.id, c.full_name]))

  return (
    <div className="space-y-8">
      {children.length ? (
        <>
          <CatchUpGroups learnerIds={children.map((c) => c.id)} names={names} audience="parent" />
          {children.map((child) => {
            const counts = new Map<string, number>()
            for (const m of mistakes.filter((x) => x.learner_id === child.id)) {
              counts.set(m.topic_id, (counts.get(m.topic_id) ?? 0) + 1)
            }
            const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
            if (!top.length) return null
            return (
              <section key={child.id} className="space-y-3">
                <h3 className="font-bold text-navy-900">Topics to practise with {child.full_name}</h3>
                <p className="text-sm text-navy-600">
                  These are the topics with the most questions {child.full_name} has got wrong and not yet got right. Ask
                  them to open <strong>My Mistakes</strong> in DONE WELL and explain one to you — teaching it back is one
                  of the best ways to learn it.
                </p>
                <ul className="card divide-y divide-navy-100">
                  {top.map(([topicId, n]) => (
                    <li key={topicId} className="flex items-center justify-between gap-3 p-4 text-sm">
                      <span className="font-medium text-navy-900">{getTopic(topicId)?.name ?? topicId}</span>
                      <span className="tabular-nums text-navy-500">
                        {n} question{n === 1 ? '' : 's'} to fix
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </>
      ) : null}
      <ParentSupport />
    </div>
  )
}
