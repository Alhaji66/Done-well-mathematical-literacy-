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

function LearnersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M2.5 20c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2M14 20c0-2-1.2-3.7-3-4.5" />
    </svg>
  );
}

function TeachersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M7 20h10M9 16v4M15 16v4" />
    </svg>
  );
}

function AssessmentsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4M9 12l2 2 4-4" />
    </svg>
  );
}

function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", to: "/school", icon: DashboardIcon, end: true },
  { label: "Learners", to: "/school/learners", icon: LearnersIcon },
  { label: "Teachers", to: "/school/teachers", icon: TeachersIcon },
  { label: "Assessments", to: "/school/assessments", icon: AssessmentsIcon },
  { label: "Analytics", to: "/school/analytics", icon: AnalyticsIcon },
];

export function SchoolLayout() {
  return (
    <RequireRole role="school">
      <DashboardShell navItems={navItems}>
        <Outlet />
      </DashboardShell>
    </RequireRole>
  );
}
