import { Link } from 'react-router-dom'
import type { Paper } from '@/data/papers'
import { ChevronRightIcon } from '@/components/ui/Icons'

interface PaperListItemProps {
  paper: Paper
  to: string
  /** Omit to hide the progress row entirely (e.g. Teacher/School read-only browse). */
  progress?: { answered: number; total: number }
}

export function PaperListItem({ paper, to, progress }: PaperListItemProps) {
  const hours = Math.round((paper.durationMinutes / 60) * 10) / 10
  const isComplete = progress ? progress.total > 0 && progress.answered >= progress.total : false
  const isStarted = progress ? progress.answered > 0 : false

  return (
    <Link to={to} className="card flex items-center justify-between gap-3 p-5 transition-colors hover:border-navy-300">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={paper.kind === 'predicted' ? 'badge-gold' : 'badge-navy'}>
            {paper.kind === 'predicted' ? `Predicted — Set ${paper.setLabel}` : `${paper.year}`}
          </span>
          <span className="badge-slate">{paper.totalMarks} marks</span>
          {isComplete ? <span className="badge-green">Completed</span> : isStarted ? <span className="badge-gold">In progress</span> : null}
        </div>
        <h4 className="mt-1.5 truncate font-semibold text-navy-900">{paper.title}</h4>
        <p className="text-xs text-navy-500">
          Paper {paper.paperNumber} · suggested time {hours}h
        </p>
        {progress ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-32 max-w-full overflow-hidden rounded-full bg-navy-100">
              <div
                className="h-full rounded-full bg-gold-500"
                style={{ width: `${progress.total === 0 ? 0 : Math.round((progress.answered / progress.total) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-navy-500">
              {progress.answered}/{progress.total}
            </span>
          </div>
        ) : null}
      </div>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-navy-400" />
    </Link>
  )
}
