import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

/**
 * An account is used on a limited number of devices (STEP 35 of
 * supabase/schema.sql): 2 for a learner, 3 for anyone else.
 *
 * Each browser keeps a random device id. A fresh sign-in claims the device; if
 * that is one too many, the database signs out the device used least recently
 * and ends its session. That device finds out the next time it checks, and
 * signs itself out with a message. So one account shared around a class keeps
 * throwing its users out, while a learner with a phone and a laptop never
 * notices.
 *
 * Every call here tolerates the database not having STEP 35 yet: the function
 * is missing, the call errors, and the device simply counts as signed in.
 */

const DEVICE_KEY = 'dw-device-id'
const CLAIMED_KEY = 'dw-device-session'
export const SIGNED_OUT_REASON_KEY = 'dw-signed-out-reason'

export interface AccountDevice {
  device_id: string
  label: string
  first_seen: string
  last_seen: string
}

const storage = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v)
    } catch {
      // Private browsing or blocked storage: the device gets a new id each
      // visit, which costs a slot but never locks anyone out.
    }
  },
  remove: (k: string) => {
    try {
      localStorage.removeItem(k)
    } catch {
      // As above.
    }
  },
}

/** This browser's device id, made once and kept. */
export function deviceId(): string {
  const existing = storage.get(DEVICE_KEY)
  if (existing && existing.length >= 8) return existing
  const fresh =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
  storage.set(DEVICE_KEY, fresh)
  return fresh
}

/** "Chrome on Android" -- enough for a person to recognise their own device. */
export function deviceLabel(ua: string = typeof navigator === 'undefined' ? '' : navigator.userAgent): string {
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\/|Opera/.test(ua)
      ? 'Opera'
      : /SamsungBrowser/.test(ua)
        ? 'Samsung Internet'
        : /Firefox\//.test(ua)
          ? 'Firefox'
          : /Chrome\//.test(ua)
            ? 'Chrome'
            : /Safari\//.test(ua)
              ? 'Safari'
              : 'A browser'
  const system = /Android/.test(ua)
    ? 'Android'
    : /iPhone|iPad|iPod/.test(ua)
      ? 'iPhone or iPad'
      : /Windows/.test(ua)
        ? 'Windows'
        : /Mac OS X|Macintosh/.test(ua)
          ? 'Mac'
          : /CrOS/.test(ua)
            ? 'Chromebook'
            : /Linux/.test(ua)
              ? 'Linux'
              : 'an unknown device'
  return `${browser} on ${system}`
}

/** The id of the sign-in this session belongs to; stable across token refreshes. */
export function sessionKey(session: Session): string {
  try {
    const payload = JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (typeof payload.session_id === 'string') return payload.session_id
  } catch {
    // A token we cannot read: fall back to one claim per account per browser.
  }
  return `user:${session.user.id}`
}

/**
 * Is this device still allowed to be signed in? Claims the device on a fresh
 * sign-in; afterwards only checks. Returns false only when the database says
 * this device was signed out from elsewhere.
 */
export async function checkDevice(session: Session): Promise<boolean> {
  if (!supabase) return true
  const id = deviceId()
  const key = sessionKey(session)
  if (storage.get(CLAIMED_KEY) !== key) {
    const { error } = await supabase.rpc('claim_device', { p_device: id, p_label: deviceLabel() })
    if (!error) storage.set(CLAIMED_KEY, key)
    return true
  }
  const { data, error } = await supabase.rpc('device_still_signed_in', { p_device: id })
  if (error) return true
  return data !== false
}

/** Forget the claim, so the next sign-in on this browser claims afresh. */
export function forgetClaim() {
  storage.remove(CLAIMED_KEY)
}

export async function fetchDevices(): Promise<AccountDevice[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('account_devices')
    .select('device_id, label, first_seen, last_seen')
    .order('last_seen', { ascending: false })
  if (error) return null
  return (data ?? []) as AccountDevice[]
}

/** Sign one of your devices out. It is told the next time it checks. */
export async function signOutDevice(id: string): Promise<string | null> {
  if (!supabase) return 'Not connected.'
  const { error } = await supabase.rpc('sign_out_device', { p_device: id })
  return error ? error.message : null
}

export async function deviceLimit(): Promise<number | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('device_limit')
  if (error) return null
  return typeof data === 'number' ? data : null
}
