/**
 * Is someone signed in on this device? Answered from the browser's own
 * storage, without loading the Supabase library onto the public pages.
 *
 * Supabase keeps the session under `sb-<project>-auth-token`. A stale one
 * (expired, or revoked elsewhere) still answers yes; the account pages check
 * it properly and send the person to sign in if it has lapsed, so the worst
 * case is one extra screen.
 */
export function hasSavedSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) return true
    }
  } catch {
    // Storage blocked: treat as signed out.
  }
  return false
}
