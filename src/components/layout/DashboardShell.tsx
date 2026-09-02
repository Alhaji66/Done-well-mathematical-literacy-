import { type ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roleLabels } from "../../data/users";
import { IconClose, IconMenu } from "../../lib/icons";
import type { RoleId } from "../../types";
import { Logo } from "../ui/Logo";

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: (props: { className?: string }) => ReactNode;
  end?: boolean;
}

const roleHomes: Record<RoleId, string> = {
  learner: "/learner",
  parent: "/parent",
  teacher: "/teacher",
  school: "/school",
};

export function DashboardShell({
  navItems,
  children,
}: {
  navItems: DashboardNavItem[];
  children: ReactNode;
}) {
  const { role, user, signOut, signInAs } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-navy-100 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-navy-100 px-5">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50",
                ].join(" ")
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-navy-100 p-4">
          <RoleSwitcher currentRole={role} onSwitch={signInAs} />
          <button
            onClick={signOut}
            className="focus-ring mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-navy-500 hover:bg-navy-50"
          >
            Exit demo
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100 bg-white px-4 lg:hidden">
        <Link to="/">
          <Logo />
        </Link>
        <button
          className="focus-ring rounded-lg p-2 text-navy-700 hover:bg-navy-50"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <IconMenu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-72 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-navy-100 px-4">
              <Logo />
              <button
                className="focus-ring rounded-lg p-2 text-navy-700 hover:bg-navy-50"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <IconClose className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50",
                    ].join(" ")
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-navy-100 p-4">
              <RoleSwitcher currentRole={role} onSwitch={signInAs} />
              <button
                onClick={signOut}
                className="focus-ring mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-navy-500 hover:bg-navy-50"
              >
                Exit demo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div className="lg:pl-64">
        <div className="hidden items-center justify-between border-b border-navy-100 bg-white px-8 py-3 lg:flex">
          <p className="text-sm text-navy-500">
            Demo mode — signed in as <span className="font-semibold text-navy-800">{user?.name}</span>
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-gold-600">
            {role ? roleLabels[role] : ""} view
          </p>
        </div>
        <main className="container-page py-6 pb-24 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-navy-100 bg-white/95 backdrop-blur lg:hidden">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                "focus-ring flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                isActive ? "text-navy-900" : "text-navy-400",
              ].join(" ")
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function RoleSwitcher({
  currentRole,
  onSwitch,
}: {
  currentRole: RoleId | null;
  onSwitch: (role: RoleId) => void;
}) {
  const navigate = useNavigate();
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-400">
        Switch demo view
      </span>
      <select
        className="focus-ring w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800"
        value={currentRole ?? ""}
        onChange={(e) => {
          const next = e.target.value as RoleId;
          onSwitch(next);
          navigate(roleHomes[next]);
        }}
      >
        {(Object.keys(roleLabels) as RoleId[]).map((r) => (
          <option key={r} value={r}>
            {roleLabels[r]}
          </option>
        ))}
      </select>
    </label>
  );
}
