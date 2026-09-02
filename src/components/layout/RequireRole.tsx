import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { RoleId } from "../../types";

export function RequireRole({ role, children }: { role: RoleId; children: ReactNode }) {
  const { role: currentRole } = useAuth();
  const location = useLocation();

  if (currentRole !== role) {
    return <Navigate to="/sign-in" replace state={{ from: location, intendedRole: role }} />;
  }

  return <>{children}</>;
}
