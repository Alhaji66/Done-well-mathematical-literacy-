import { Link } from 'react-router-dom'
import { UNSORTED } from '@/data/subtopics'
import type { Grade } from '@/types'

/**
 * A topic's sub-topics, as their own entry points into Practise.
 *
 * A Learn card used to offer one link into the whole topic, which is the wrong
 * granularity for revision -- a learner who knows they are weak on taxation was
 * being handed the whole of Finance. Each sub-topic here deep-links straight to
 * its own questions, so the thing they came for is one click away and they can
 * see how much practice it holds before committing to it.
 *
 * Only sub-topics that hold a question at this grade are passed in, so every
 * link here opens a real list. The catch-all group is deliberately included --
 * hiding it would lose the questions the classifier could not place.
 */
export function SubtopicLinks({
  topicId,
  subjectId,
  grade,
  counts,
}: {
  topicId: string
  subjectId: string
  grade: Grade
  /** Sub-topic name to question count, in the order Practise will show them. */
  counts: Record<string, number>
}) {
  const names = Object.keys(counts)
  // One sub-topic is the topic itself under another name, and the catch-all on
  // its own says nothing -- neither is worth a row of chips.
  if (names.length < 2) return null

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">Practise one part</h4>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {names.map((name) => (
          <li key={name}>
            <Link
              to={`/app/learner/practise?subject=${subjectId}&grade=${grade}&topic=${topicId}&subtopic=${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-2.5 py-1 text-xs font-medium text-navy-700 transition-colors hover:border-navy-400 hover:bg-navy-50"
            >
              {name === UNSORTED ? 'Everything else' : name}
              <span className="font-semibold text-navy-400">{counts[name]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
