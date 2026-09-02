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

function ResourcesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13z" />
    </svg>
  );
}

function QuestionBankIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2c0-1.5 1.2-2.4 2.6-2.4 1.5 0 2.6 1 2.6 2.2 0 2.6-3 2.1-3 4.3" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
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
  { label: "Dashboard", to: "/teacher", icon: DashboardIcon, end: true },
  { label: "Resources", to: "/teacher/resources", icon: ResourcesIcon },
  { label: "Questions", to: "/teacher/question-bank", icon: QuestionBankIcon },
  { label: "Assessments", to: "/teacher/assessments", icon: AssessmentsIcon },
  { label: "Analytics", to: "/teacher/analytics", icon: AnalyticsIcon },
];

export function TeacherLayout() {
  return (
    <RequireRole role="teacher">
      <DashboardShell navItems={navItems}>
        <Outlet />
      </DashboardShell>
    </RequireRole>
  );
}
