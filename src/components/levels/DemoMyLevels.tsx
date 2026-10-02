import { useState } from 'react'
import { demoLearner } from '@/data/learner'
import { demoMyLevels, demoToday } from '@/data/demoLevels'
import { MyLevelsCard } from '@/components/levels/MyLevelsCard'
import type { ReplyValue } from '@/components/levels/ReplyBox'

/** The demo learner's levels card; the parent demo shows the same child, and can try replying. */
export default function DemoMyLevels({ parent = false }: { parent?: boolean }) {
  const [results] = useState(() => demoMyLevels())
  const [today] = useState(() => demoToday({ results }))
  const [replies, setReplies] = useState<Map<string, ReplyValue>>(new Map())
  const first = demoLearner.name.split(' ')[0]
  return (
    <MyLevelsCard
      results={results}
      title={parent ? `${first}’s levels` : 'My levels'}
      child={parent ? first : undefined}
      today={today}
      replies={replies}
      onReply={
        parent
          ? async (testId, choice, message) => {
              setReplies((m) => new Map(m).set(testId, { choice, message: message.trim() }))
              return undefined
            }
          : undefined
      }
      replyNote={parent ? 'Demo: the reply is not sent anywhere.' : undefined}
    />
  )
}
