import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env and fill in VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.',
  )
}

export const supabase = createClient(url, publishableKey)
