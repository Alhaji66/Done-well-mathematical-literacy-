/**
 * Turning a Supabase auth error into something a person can act on.
 *
 * The screen used to print `error.message` straight through. In a live class
 * test that meant most learners saw "email rate limit exceeded", which tells
 * a fifteen-year-old nothing, and told us nothing either until someone went
 * looking in the Supabase dashboard. Each message below names what actually
 * happened AND what to do next, because "it didn't work" is not a fix.
 */
export function describeAuthError(raw: unknown): string {
  const message =
    typeof raw === 'object' && raw !== null && 'message' in raw ? String((raw as { message: unknown }).message) : String(raw ?? '')
  const lower = message.toLowerCase()

  // The one that broke the class test. Supabase's built-in email sender is
  // rate-limited per project per hour -- a handful of messages, not a class of
  // thirty -- so the first few learners get their link and everyone after them
  // is refused. It is a project setting, not anything the learner did.
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('over_email_send_rate')) {
    return 'Too many sign-in emails have been sent from this site in the last hour, so this one could not go out. Use a password instead — it does not send any email.'
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

  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('network request failed')) {
    return 'Could not reach the server. Check your connection and try again.'
  }

  if (lower.includes('redirect') || lower.includes('not allowed')) {
    return 'This site is not on the list of addresses the sign-in link is allowed to return to, so the link would not work. Please report this — it is a setting on our side.'
  }

  return message || 'Something went wrong signing in. Please try again.'
}
