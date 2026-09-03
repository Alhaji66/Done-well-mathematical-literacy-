import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-navy-200 bg-white px-6 py-12 text-center">
      {icon ? <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-400">{icon}</div> : null}
      <div>
        <p className="font-semibold text-navy-800">{title}</p>
        {description ? <p className="mt-1 max-w-sm text-sm text-navy-500">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
