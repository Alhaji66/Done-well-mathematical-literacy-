import { useEffect, useRef, useState } from 'react'

/**
 * The sign-in CAPTCHA: Cloudflare Turnstile.
 *
 * Without it, a script can try thousands of passwords against an account, or
 * create accounts by the hundred. Turnstile usually decides in the background
 * that a real person is there and shows a tick without asking anything.
 *
 * The token it hands back goes with the sign-in request, and Supabase checks it
 * with Cloudflare before looking at the password (Authentication -> Attack
 * Protection -> CAPTCHA in the Supabase dashboard). A token works once, so the
 * widget is reset after every attempt.
 *
 * With VITE_TURNSTILE_SITE_KEY unset this renders nothing and asks for no
 * token, so the screen works exactly as before until both halves are set up.
 */

const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || ''
export const captchaEnabled = SITE_KEY !== ''

interface TurnstileApi {
  render(
    el: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'flexible' | 'compact'
    },
  ): string
  reset(id: string): void
  remove(id: string): void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let loading: Promise<TurnstileApi> | null = null
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!loading) {
    loading = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not start')))
      script.onerror = () => reject(new Error('Turnstile could not load'))
      document.head.appendChild(script)
    }).catch((e) => {
      // A failed load (offline, blocked) is tried again on the next visit to the screen.
      loading = null
      throw e
    })
  }
  return loading
}

/**
 * `round` is bumped by the form after each attempt: the used token is thrown
 * away and the widget fetches a new one.
 */
export function Captcha({ onToken, round }: { onToken: (token: string | null) => void; round: number }) {
  const box = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const report = useRef(onToken)
  report.current = onToken
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!captchaEnabled) return
    let gone = false
    loadTurnstile()
      .then((api) => {
        if (gone || !box.current) return
        widget.current = api.render(box.current, {
          sitekey: SITE_KEY,
          callback: (token) => {
            setFailed(false)
            report.current(token)
          },
          'expired-callback': () => report.current(null),
          'error-callback': () => {
            report.current(null)
            setFailed(true)
          },
          theme: 'light',
          size: 'flexible',
        })
      })
      .catch(() => {
        if (!gone) setFailed(true)
      })
    return () => {
      gone = true
      if (widget.current) window.turnstile?.remove(widget.current)
      widget.current = null
    }
  }, [])

  useEffect(() => {
    if (round === 0 || !widget.current) return
    report.current(null)
    window.turnstile?.reset(widget.current)
  }, [round])

  if (!captchaEnabled) return null
  return (
    <div>
      <div ref={box} className="min-h-[65px]" />
      {failed ? (
        <p role="alert" className="mt-1 text-xs text-rose-600">
          The security check could not load. Check your connection and refresh the page.
        </p>
      ) : null}
    </div>
  )
}
