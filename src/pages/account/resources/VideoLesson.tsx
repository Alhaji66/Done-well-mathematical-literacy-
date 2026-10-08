import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { getVideo, videoMinutes } from '@/data/topicVideos'
import { getTopic } from '@/data/topics'
import { subjects } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowLeftIcon } from '@/components/ui/Icons'

const asset = (file: string) => `${import.meta.env.BASE_URL}videos/${file}`

/**
 * One DONE WELL video lesson: the player, what it covers, the full transcript
 * (for reading instead of watching, with no data and no sound), and the way on
 * to practise. The file is fetched only when Play is pressed -- `preload`
 * asks for nothing but its length -- so opening the page costs a learner on
 * mobile data almost nothing.
 */
export function VideoLesson() {
  const { videoId } = useParams<{ videoId: string }>()
  const { profile } = useAccountAuth()
  const [showText, setShowText] = useState(false)
  const video = videoId ? getVideo(videoId) : undefined
  if (!video) {
    return (
      <div className="space-y-4">
        <Link to="../.." relative="path" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900">
          <ArrowLeftIcon className="h-4 w-4" /> Resource centre
        </Link>
        <p className="text-sm text-navy-500">That video was not found.</p>
      </div>
    )
  }
  const topic = getTopic(video.topicId)
  const subject = subjects.find((s) => s.id === video.subjectId)?.name ?? ''
  const practise =
    profile?.role === 'learner'
      ? { to: `../../../practise?subject=${video.subjectId}&topic=${video.topicId}`, label: `Practise ${topic?.name ?? 'this topic'}` }
      : { to: `../../topic/${video.topicId}`, label: `Open the ${topic?.name ?? 'topic'} study guide` }

  return (
    <div className="space-y-6">
      <Link to="../.." relative="path" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900">
        <ArrowLeftIcon className="h-4 w-4" /> Resource centre
      </Link>
      <SectionHeading
        eyebrow={`Video lesson · ${subject} · Grade ${video.grades.join(', ')}`}
        title={video.title}
        description={`${video.summary} About ${videoMinutes(video)} minutes.`}
      />
      <div className="overflow-hidden rounded-xl border border-navy-100 bg-navy-950 shadow-sm">
        <video
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          poster={asset(video.poster)}
          src={asset(video.file)}
        >
          Your browser cannot play this video. Read the transcript below instead.
        </video>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to={practise.to} relative="path" className="btn-primary btn-sm">
          {practise.label}
        </Link>
        <button type="button" onClick={() => setShowText((v) => !v)} aria-expanded={showText} className="btn-outline btn-sm">
          {showText ? 'Hide the transcript' : 'Read the transcript instead'}
        </button>
      </div>
      <p className="text-xs text-navy-500">
        The video uses about {Math.max(1, Math.round(video.megabytes))} MB of data. The transcript uses none.
      </p>
      {showText ? (
        <section className="card space-y-3 p-5 text-sm leading-relaxed text-navy-700">
          {video.transcript.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ) : null}
    </div>
  )
}
