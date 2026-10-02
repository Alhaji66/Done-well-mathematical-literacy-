import { useEffect, useState } from 'react'
import { fetchLevelsFor } from '@/lib/myLevels'
import { fetchContacts, fetchReplies, saveContact, saveReply } from '@/lib/parentReplies'
import type { LevelResult } from '@/lib/levels'
import { MyLevelsCard } from '@/components/levels/MyLevelsCard'
import type { ContactValue, ReplyValue } from '@/components/levels/ReplyBox'

/**
 * The card with live data, for a learner (their own) or a parent (one card per
 * linked child). A parent can also reply to an early warning from the card.
 */
export default function MyLevels({ learners, parentId }: { learners: { id: string; name?: string }[]; parentId?: string }) {
  const [data, setData] = useState<{ results: LevelResult[]; hiddenTests: Map<string, number> } | null>(null)
  // A parent's replies, by learner and test.
  const [replies, setReplies] = useState<Map<string, ReplyValue>>(new Map())
  const [contact, setContact] = useState<ContactValue | undefined>()
  const ids = learners.map((l) => l.id).join(',')

  useEffect(() => {
    if (!ids) return
    let live = true
    fetchLevelsFor(ids.split(',')).then((d) => live && setData(d))
    if (parentId) fetchContacts([parentId]).then((rows) => live && rows[0] && setContact({ phone: rows[0].phone, best_time: rows[0].best_time }))
    if (parentId)
      fetchReplies(`${new Date().getFullYear()}-01-01`, ids.split(',')).then(
        (rows) => live && setReplies(new Map(rows.map((r) => [`${r.learner_id}|${r.test_id}`, { choice: r.choice, message: r.message }]))),
      )
    return () => {
      live = false
    }
  }, [ids, parentId])

  if (!data) return null
  return (
    <>
      {learners.map((l) => (
        <MyLevelsCard
          key={l.id}
          title={l.name ? `${l.name}’s levels` : 'My levels'}
          results={data.results.filter((r) => r.learnerId === l.id)}
          hiddenTests={data.hiddenTests.get(l.id) ?? 0}
          child={l.name}
          contact={contact}
          replies={new Map([...replies].filter(([k]) => k.startsWith(`${l.id}|`)).map(([k, v]) => [k.slice(l.id.length + 1), v]))}
          onReply={
            parentId
              ? async (testId, choice, message, c) => {
                  // A number given with the reply is saved first, so the teacher has it when the reply arrives.
                  if (c && (c.phone !== contact?.phone || c.best_time !== contact?.best_time)) {
                    const contactError = await saveContact(parentId, c.phone, c.best_time)
                    if (contactError) return contactError
                    setContact(c)
                  }
                  const error = await saveReply({ parentId, learnerId: l.id, testId, choice, message })
                  if (!error) setReplies((m) => new Map(m).set(`${l.id}|${testId}`, { choice, message: message.trim() }))
                  return error
                }
              : undefined
          }
        />
      ))}
    </>
  )
}
