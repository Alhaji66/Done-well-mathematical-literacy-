import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { checkDevice, deviceId, forgetClaim, sessionKey, SIGNED_OUT_REASON_KEY } from '@/lib/devices'
import { forgetSavedPacks } from '@/lib/contentPacks'
import type { Grade } from '@/types'

export type AccountRole = 'learner' | 'parent' | 'teacher' | 'school' | 'hod'

export interface AccountProfile {
  id: string
  role: AccountRole
  full_name: string
  school_id: string | null
  grade: Grade | null
  subject_id: string | null
  /**
   * When a colleague approved this person as staff. `null` for a staff account
   * still waiting; absent entirely on a database without STEP 12 of the schema.
   * See src/lib/staffApproval.ts.
   */
  staff_approved_at?: string | null
  /**
   * When staff at the school approved this learner. `null` for a learner still
   * waiting; absent on a database without STEP 34. See src/lib/learnerApproval.ts.
   */
  learner_approved_at?: string | null
}

interface AccountAuthValue {
  configured: boolean
  loading: boolean
  session: Session | null
  profile: AccountProfile | null
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AccountAuthContext = createContext<AccountAuthValue | undefined>(undefined)

export function AccountAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AccountProfile | null>(null)

  // Deliberately never throws: a failed profile fetch (network hiccup, RLS
  // surprise, whatever) must not leave callers stuck mid-await forever --
  // that was a real bug here, caught by testing against a blocked network.
  const loadProfile = async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      if (error) throw error
      setProfile((data as AccountProfile | null) ?? null)
    } catch (err) {
      console.error('Failed to load account profile:', err)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true

    // Failsafe: a stale/malformed stored token can leave supabase-js's own
    // session check pending indefinitely rather than rejecting (an internal
    // library retry/lock issue, not something a try/catch here can reach).
    // Whatever the cause, this screen must never be able to hang forever.
    const failsafe = setTimeout(() => {
      if (active) setLoading(false)
    }, 8000)

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!active) return
        setSession(data.session)
        if (data.session?.user) await loadProfile(data.session.user.id)
      })
      .catch((err) => console.error('Failed to get session:', err))
      .finally(() => {
        clearTimeout(failsafe)
        if (active) setLoading(false)
      })

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!active) return
      setSession(newSession)
      if (newSession?.user) {
        await loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
      clearTimeout(failsafe)
      setLoading(false)
    })

    return () => {
      active = false
      clearTimeout(failsafe)
      subscription.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The device limit (STEP 35). Checked when a session appears, every few
  // minutes, and whenever the app comes back to the foreground -- the moment a
  // shared account is most likely to have been picked up elsewhere. Kept out of
  // onAuthStateChange on purpose: awaiting a Supabase call inside that callback
  // can stall the client.
  const sessionId = session ? sessionKey(session) : null
  useEffect(() => {
    if (!supabase || !session) return
    let active = true
    const check = async () => {
      const ok = await checkDevice(session)
      if (ok || !active || !supabase) return
      try {
        sessionStorage.setItem(SIGNED_OUT_REASON_KEY, 'device')
      } catch {
        // The sign-in page then shows no reason; the sign-out still happens.
      }
      forgetClaim()
      await forgetSavedPacks()
      // Local only: the device that signed this one out must stay signed in.
      await supabase.auth.signOut({ scope: 'local' })
      setProfile(null)
    }
    void check()
    const timer = setInterval(() => void check(), 5 * 60_000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') void check()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // Re-run per sign-in, not per token refresh: the session id is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const value = useMemo<AccountAuthValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      session,
      profile,
      refreshProfile: async () => {
        if (session?.user) await loadProfile(session.user.id)
      },
      signOut: async () => {
        if (supabase) {
          // Free this device's place first, while still signed in to do it.
          await supabase.rpc('sign_out_device', { p_device: deviceId() }).then(
            () => undefined,
            () => undefined,
          )
          forgetClaim()
          // The question bank saved for offline use goes too: on a shared
          // school computer the next person should not inherit it.
          await forgetSavedPacks()
          // Only this device: signing out of the phone should not sign out the laptop.
          await supabase.auth.signOut({ scope: 'local' })
        }
        setProfile(null)
      },
    }),
    // loadProfile is stable in spirit (only depends on the module-level supabase client);
    // omitting it keeps this from re-creating the context value on every profile load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, session, profile],
  )

  return <AccountAuthContext.Provider value={value}>{children}</AccountAuthContext.Provider>
}

/**
 * The signed-in account, or null on a page that also runs in the demo, where
 * there is no account provider. For the few shared pages that add something
 * only a real account can use.
 */
export function useOptionalAccountAuth() {
  return useContext(AccountAuthContext)
}

export function useAccountAuth() {
  const ctx = useContext(AccountAuthContext)
  if (!ctx) throw new Error('useAccountAuth must be used within AccountAuthProvider')
  return ctx
}
