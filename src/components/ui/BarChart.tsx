interface BarChartProps {
  data: { label: string; value: number }[]
  unit?: string
  className?: string
}

export function BarChart({ data, unit = '', className }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className={className}>
      <div className="flex h-32 gap-2 sm:gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-navy-800 transition-all"
                style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
                title={`${d.label}: ${d.value}${unit}`}
              />
            </div>
            <span className="shrink-0 text-[11px] font-medium text-navy-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
