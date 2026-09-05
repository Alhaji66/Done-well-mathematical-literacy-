import { Link } from 'react-router-dom'
import type { Paper } from '@/data/papers'
import { ChevronRightIcon } from '@/components/ui/Icons'

export function PaperListItem({ paper, to }: { paper: Paper; to: string }) {
  const hours = Math.round((paper.durationMinutes / 60) * 10) / 10

  return (
    <Link to={to} className="card flex items-center justify-between gap-3 p-5 transition-colors hover:border-navy-300">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={paper.kind === 'predicted' ? 'badge-gold' : 'badge-navy'}>
            {paper.kind === 'predicted' ? `Predicted — Set ${paper.setLabel}` : `${paper.year}`}
          </span>
          <span className="badge-slate">{paper.totalMarks} marks</span>
        </div>
        <h4 className="mt-1.5 truncate font-semibold text-navy-900">{paper.title}</h4>
        <p className="text-xs text-navy-500">
          Paper {paper.paperNumber} · suggested time {hours}h
        </p>
      </div>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-navy-400" />
    </Link>
  )
}
