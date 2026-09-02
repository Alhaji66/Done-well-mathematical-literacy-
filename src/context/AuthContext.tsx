import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoUsers } from "../data/users";
import type { DemoUser, RoleId } from "../types";

const STORAGE_KEY = "donewell-demo-role";

interface AuthContextValue {
  role: RoleId | null;
  user: DemoUser | null;
  signInAs: (role: RoleId) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleId | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "learner" || stored === "parent" || stored === "teacher" || stored === "school"
      ? stored
      : null;
  });

  useEffect(() => {
    if (role) {
      window.localStorage.setItem(STORAGE_KEY, role);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [role]);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      user: role ? demoUsers[role] : null,
      signInAs: (nextRole: RoleId) => setRole(nextRole),
      signOut: () => setRole(null),
    }),
    [role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
