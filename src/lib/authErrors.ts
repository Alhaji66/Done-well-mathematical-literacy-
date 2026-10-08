/**
 * Turning a Supabase auth error into something a person can act on.
 *
 * The screen used to print `error.message` straight through. In a live class
 * test that meant most learners saw "email rate limit exceeded", which tells
 * a fifteen-year-old nothing, and told us nothing either until someone went
 * looking in the Supabase dashboard. Each message below names what actually
 * happened AND what to do next, because "it didn't work" is not a fix.
 */
const messageOf = (raw: unknown) =>
  typeof raw === 'object' && raw !== null && 'message' in raw ? String((raw as { message: unknown }).message) : String(raw ?? '')

const isRateLimit = (lower: string) =>
  lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('over_email_send_rate')
const isNoAccount = (lower: string) =>
  lower.includes('signups not allowed') || lower.includes('otp_disabled') || lower.includes('signup is disabled')

/**
 * The two refusals the sign-in screen answers with a button as well as words:
 * the email limit (switch to a password, which sends no email) and an email
 * with no account behind it (create one, with the address already typed).
 */
export type AuthErrorKind = 'rate_limit' | 'no_account' | 'no_match' | 'other'

export function authErrorKind(raw: unknown): AuthErrorKind {
  const lower = messageOf(raw).toLowerCase()
  if (isRateLimit(lower)) return 'rate_limit'
  if (isNoAccount(lower)) return 'no_account'
  if (lower.includes('invalid login credentials')) return 'no_match'
  return 'other'
}

/** What the person was doing: it changes what "try something else" means. */
export type AuthAction = 'signin' | 'signup' | 'link'

export function describeAuthError(raw: unknown, action: AuthAction = 'signin'): string {
  const message = messageOf(raw)
  const lower = message.toLowerCase()

  // The one that broke the class test. Supabase's built-in email sender is
  // rate-limited per project per hour -- a handful of messages, not a class of
  // thirty -- so the first few learners get their link and everyone after them
  // is refused. It is a project setting, not anything the learner did.
  if (isRateLimit(lower)) {
    if (action === 'signup') {
      return 'Too many emails have been sent from this site in the last hour, so your confirmation email could not go out and the account was not created. Try again in an hour.'
    }
    return 'Too many emails have been sent from this site in the last hour, so this one could not go out. If you have a password, sign in with it — that sends no email. Otherwise try again in an hour.'
  }

  if (lower.includes('invalid login credentials')) {
    return 'That email and password do not match an account. Check them, or create an account if you have not made one yet.'
  }

  if (lower.includes('email not confirmed')) {
    return 'This account still needs to be confirmed from the link in your email before you can sign in with a password.'
  }

  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'There is already an account with that email. Sign in instead of creating a new one.'
  }

  if (lower.includes('password should be') || lower.includes('weak password')) {
    return 'That password is too short. Use at least 8 characters.'
  }

  // The sign-in CAPTCHA (Cloudflare Turnstile, checked by Supabase): its token
  // is single-use and expires, so a retry after a wait or a failed attempt
  // needs a fresh tick in the box.
  if (lower.includes('captcha')) {
    return 'The security check did not go through. Wait for the box above the button to show a tick, then try again.'
  }

  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('network request failed')) {
    return 'Could not reach the server. Check your connection and try again.'
  }

  // The email-link tab only signs in an account that already exists (it used
  // to create one for any address typed, and a typo became an email bounced
  // back to Supabase). Supabase's wording for that refusal also says "not
  // allowed", so it is caught before the redirect case below.
  if (isNoAccount(lower)) {
    return 'There is no account with this email yet. If you are new to DONE WELL, create your account first.'
  }

  if (lower.includes('redirect') || lower.includes('not allowed')) {
    return 'This site is not on the list of addresses the sign-in link is allowed to return to, so the link would not work. Please report this — it is a setting on our side.'
  }

  return message || 'Something went wrong signing in. Please try again.'
}
