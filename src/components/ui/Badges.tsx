import type { Difficulty, AssessmentStatus } from '@/types'
import { cn } from '@/lib/utils'

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const cls =
    difficulty === 'Easy' ? 'badge-green' : difficulty === 'Moderate' ? 'badge-gold' : 'badge-red'
  return <span className={cls}>{difficulty}</span>
}

const statusLabel: Record<AssessmentStatus, string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  missed: 'Missed',
  in_progress: 'In progress',
}

export function StatusBadge({ status }: { status: AssessmentStatus }) {
  const cls =
    status === 'completed'
      ? 'badge-green'
      : status === 'upcoming'
        ? 'badge-navy'
        : status === 'in_progress'
          ? 'badge-gold'
          : 'badge-red'
  return <span className={cls}>{statusLabel[status]}</span>
}

export function TrendBadge({ trend }: { trend: 'up' | 'down' | 'steady' }) {
  const map = {
    up: { cls: 'badge-green', label: '↑ Improving' },
    down: { cls: 'badge-red', label: '↓ Needs focus' },
    steady: { cls: 'badge-slate', label: '→ Steady' },
  } as const
  return <span className={map[trend].cls}>{map[trend].label}</span>
}

export function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cls = level === 'low' ? 'badge-green' : level === 'medium' ? 'badge-gold' : 'badge-red'
  const label = level === 'low' ? 'On track' : level === 'medium' ? 'Watch' : 'At risk'
  return <span className={cn(cls)}>{label}</span>
}
