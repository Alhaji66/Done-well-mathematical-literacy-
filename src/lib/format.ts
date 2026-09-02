export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysUntil(iso: string) {
  const target = new Date(iso).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export function difficultyLabel(difficulty: "easy" | "moderate" | "challenge") {
  return { easy: "Easy", moderate: "Moderate", challenge: "Challenge" }[difficulty];
}

export function masteryLabel(percent: number) {
  if (percent >= 70) return "Strong";
  if (percent >= 50) return "Developing";
  return "Needs attention";
}

export function masteryColorClasses(percent: number) {
  if (percent >= 70) return { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (percent >= 50) return { bar: "bg-gold-500", text: "text-gold-700", bg: "bg-gold-50" };
  return { bar: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" };
}
