import { LEVEL_NAMES, LEVEL_RANGES } from '@/lib/levels'
import { cn } from '@/lib/utils'

/** Fill for a level in a bar or sparkline -- red at the bottom, green at the top. */
export const LEVEL_FILL: Record<number, string> = {
  7: 'bg-emerald-700',
  6: 'bg-emerald-500',
  5: 'bg-emerald-300',
  4: 'bg-navy-300',
  3: 'bg-amber-300',
  2: 'bg-rose-300',
  1: 'bg-rose-600',
}

/** The chip's colours, on the same scale. */
const CHIP: Record<number, string> = {
  7: 'bg-emerald-100 text-emerald-900',
  6: 'bg-emerald-50 text-emerald-800',
  5: 'bg-emerald-50 text-emerald-700',
  4: 'bg-navy-50 text-navy-700',
  3: 'bg-amber-50 text-amber-900',
  2: 'bg-rose-50 text-rose-800',
  1: 'bg-rose-100 text-rose-900',
}

/** A level, 1 to 7, as a small coloured chip; its name shows on hover. */
export function LevelChip({ level, className }: { level: number; className?: string }) {
  return (
    <span
      title={`Level ${level}: ${LEVEL_NAMES[level]} (${LEVEL_RANGES[level]})`}
      className={cn('inline-flex min-w-[2.25rem] justify-center rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums', CHIP[level], className)}
    >
      L{level}
    </span>
  )
}
