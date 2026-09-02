import { Outlet } from "react-router-dom";
import { DashboardShell, type DashboardNavItem } from "../../components/layout/DashboardShell";
import { RequireRole } from "../../components/layout/RequireRole";

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function LearnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13z" />
    </svg>
  );
}

function PractiseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M12 20l-1.5-3.5L7 15l3.5-1.5L12 10l1.5 3.5L17 15l-3.5 1.5L12 20z" />
      <path d="M5 6l.8-1.9L7.7 3.3 5.8 2.5 5 .6l-.8 1.9-1.9.8 1.9.8L5 6zM19 8l.6-1.4L21 6l-1.4-.6L19 4l-.6 1.4L17 6l1.4.6L19 8z" />
    </svg>
  );
}

function TestsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4M9 12l2 2 4-4" />
    </svg>
  );
}

function ProgressIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M21 6h-5v5" />
    </svg>
  );
}

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", to: "/learner", icon: DashboardIcon, end: true },
  { label: "Learn", to: "/learner/learn", icon: LearnIcon },
  { label: "Practise", to: "/learner/practise", icon: PractiseIcon },
  { label: "Tests", to: "/learner/tests", icon: TestsIcon },
  { label: "Progress", to: "/learner/progress", icon: ProgressIcon },
];

export function LearnerLayout() {
  return (
    <RequireRole role="learner">
      <DashboardShell navItems={navItems}>
        <Outlet />
      </DashboardShell>
    </RequireRole>
  );
}
