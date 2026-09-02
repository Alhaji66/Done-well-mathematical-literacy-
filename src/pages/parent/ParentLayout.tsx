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

function ChildIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-3.6 3-6.2 7.5-6.2s7.5 2.6 7.5 6.2" />
    </svg>
  );
}

function SupportIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M12 21s-7-4.4-9.5-9C1 8.5 2.4 5 6 5c2 0 3.4 1.1 4.2 2.2C10.9 5.9 12.3 5 14.3 5c3.5 0 4.9 3.5 3.5 7C15.3 16.6 12 21 12 21z" />
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

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", to: "/parent", icon: DashboardIcon, end: true },
  { label: "My Child", to: "/parent/my-child", icon: ChildIcon },
  { label: "Support", to: "/parent/support", icon: SupportIcon },
  { label: "Resources", to: "/parent/resources", icon: ResourcesIcon },
];

export function ParentLayout() {
  return (
    <RequireRole role="parent">
      <DashboardShell navItems={navItems}>
        <Outlet />
      </DashboardShell>
    </RequireRole>
  );
}
