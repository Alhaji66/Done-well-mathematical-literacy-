import { Link, useParams } from 'react-router-dom'
import { getTopic } from '@/data/topics'
import { subjects } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowLeftIcon } from '@/components/ui/Icons'
import { TopicNotes } from '@/components/practise/TopicNotes'
import { videoMinutes, videosForTopic } from '@/data/topicVideos'

/** A topic's study guide on its own page, for people with no practise page. */
export function TopicGuide() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicId ? getTopic(topicId) : undefined
  return (
    <div className="space-y-6">
      <Link to="../.." relative="path" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900">
        <ArrowLeftIcon className="h-4 w-4" /> Resource centre
      </Link>
      {topic ? (
        <>
          <SectionHeading
            eyebrow={`Study guide · ${subjects.find((s) => s.id === topic.subjectId)?.name ?? ''}`}
            title={topic.name}
            description={`Grades ${topic.grades.join(', ')}`}
          />
          {videosForTopic(topic.id).map((v) => (
            <Link
              key={v.id}
              to={`../../video/${v.id}`}
              relative="path"
              className="card flex items-center gap-4 p-4 transition hover:border-navy-300"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400" aria-hidden>
                ▶
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-navy-900">Watch the video lesson: {v.title}</span>
                <span className="block text-xs text-navy-500">About {videoMinutes(v)} minutes, with a transcript to read instead</span>
              </span>
            </Link>
          ))}
          <TopicNotes topicId={topic.id} defaultOpen />
        </>
      ) : (
        <p className="text-sm text-navy-500">That topic was not found.</p>
      )}
    </div>
  )
}
