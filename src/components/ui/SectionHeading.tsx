import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className ?? ''}`}>
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{eyebrow}</p> : null}
        <h2 className="mt-1 text-xl font-bold text-navy-900 sm:text-2xl">{title}</h2>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-navy-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
