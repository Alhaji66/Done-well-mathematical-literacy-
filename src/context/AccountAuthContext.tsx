import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import type { Grade } from '@/types'

export type AccountRole = 'learner' | 'parent' | 'teacher' | 'school'

export interface AccountProfile {
  id: string
  role: AccountRole
  full_name: string
  school_id: string | null
  grade: Grade | null
  subject_id: string | null
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
        if (supabase) await supabase.auth.signOut()
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

export function useAccountAuth() {
  const ctx = useContext(AccountAuthContext)
  if (!ctx) throw new Error('useAccountAuth must be used within AccountAuthProvider')
  return ctx
}
