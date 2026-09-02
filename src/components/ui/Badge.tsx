import type { ReactNode } from "react";

type Tone = "navy" | "gold" | "green" | "red" | "neutral";

const toneClasses: Record<Tone, string> = {
  navy: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-200",
  gold: "bg-gold-50 text-gold-800 ring-1 ring-inset ring-gold-300",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  red: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  neutral: "bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
