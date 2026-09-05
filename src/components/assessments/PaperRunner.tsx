import type { Paper } from '@/data/papers'
import { QuestionCard } from '@/components/practise/QuestionCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

interface PaperRunnerProps {
  paper: Paper
  /** Omit for a read-only review (Teacher/School) -- no progress is recorded. */
  onAttempt?: (topicId: string, correct: boolean | null) => void
}

export function PaperRunner({ paper, onAttempt }: PaperRunnerProps) {
  let itemIndex = 0

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
        <strong>{paper.kind === 'predicted' ? 'DONE WELL Predicted Paper.' : `DONE WELL Practice Paper — ${paper.year} style.`}</strong>{' '}
        {paper.kind === 'predicted'
          ? "This is one of DONE WELL's own predicted question sets, written in the style and topics of a real exam -- it is not a guarantee of what will actually be asked. Practise all three predicted sets for broader coverage."
          : `Written by DONE WELL in the style of a ${paper.year} exam, for extra practice -- not a transcript of the real ${paper.year} paper.`}
      </div>

      {paper.sections.map((section) => (
        <div key={section.number} className="space-y-4">
          <SectionHeading eyebrow={`Question ${section.number}`} title={section.title} description={`${section.marks} marks`} />
          {section.items.map((item) => {
            const index = itemIndex++
            return (
              <QuestionCard
                key={item.id}
                question={item}
                index={index}
                label={item.label}
                onAttempt={onAttempt ? (correct) => onAttempt(item.topicId, correct) : undefined}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
