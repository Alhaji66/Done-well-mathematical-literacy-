export function ProgressBar({
  percent,
  colorClass = "bg-navy-800",
  trackClass = "bg-navy-100",
  height = "h-2",
}: {
  percent: number;
  colorClass?: string;
  trackClass?: string;
  height?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`w-full overflow-hidden rounded-full ${trackClass} ${height}`}>
      <div
        className={`${height} rounded-full ${colorClass} transition-all duration-500`}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
