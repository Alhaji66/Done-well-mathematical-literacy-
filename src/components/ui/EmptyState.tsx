import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-navy-50/40 px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-navy-300">{icon}</div> : null}
      <p className="font-display text-base font-semibold text-navy-800">{title}</p>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-navy-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-navy-100 bg-white px-6 py-12 text-navy-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-200 border-t-navy-700" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
      <p className="font-display text-base font-semibold text-rose-700">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-rose-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
