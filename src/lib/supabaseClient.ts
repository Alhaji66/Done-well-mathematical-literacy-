import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && publishableKey)

if (!isSupabaseConfigured) {
  // Deliberately a warning, not a thrown error: this app has no code-splitting,
  // so every page's JS (including the demo, which never touches Supabase)
  // shares one bundle. Throwing here would crash the whole site, not just the
  // real-account pages, whenever Supabase isn't configured.
  console.warn(
    'Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). Real accounts are unavailable; demo mode is unaffected.',
  )
}

export const supabase = isSupabaseConfigured ? createClient(url, publishableKey) : null
