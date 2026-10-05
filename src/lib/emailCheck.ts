/**
 * Checks on an email address BEFORE Supabase is asked to send to it.
 *
 * Every confirmation or sign-in email sent to an address that does not exist
 * comes back as a bounce, and Supabase limits a project's email once too many
 * bounce. A learner typing "gmial.com", or a made-up "test@test.com" while
 * trying the app, was enough to do it. So the address is checked here first:
 *
 *   1. its shape -- one @, a dot in the domain, no spaces;
 *   2. domains that can never receive mail (example.com, .test, ...) and
 *      throwaway inbox services;
 *   3. likely typos of the common providers -- "Did you mean gmail.com?";
 *   4. whether the domain exists at all, asked of public DNS. If DNS cannot be
 *      reached the address is let through: this is a guard against typos, not
 *      a gate that can lock everyone out.
 */

export type ShapeCheck = { ok: true; email: string } | { ok: false; message: string }

const RESERVED = ['example.com', 'example.org', 'example.net', 'test.com']
const RESERVED_ENDINGS = ['.test', '.example', '.invalid', '.localhost', '.local']
const THROWAWAY = [
  'mailinator.com', 'guerrillamail.com', 'sharklasers.com', 'yopmail.com', '10minutemail.com', 'temp-mail.org',
  'tempmail.com', 'trashmail.com', 'getnada.com', 'dispostable.com', 'maildrop.cc', 'throwawaymail.com',
]

/** The providers South African learners, parents and teachers mostly use. */
const COMMON = [
  'gmail.com', 'yahoo.com', 'yahoo.co.za', 'ymail.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com', 'me.com',
  'webmail.co.za', 'mweb.co.za', 'telkomsa.net', 'vodamail.co.za', 'mtnloaded.co.za', 'protonmail.com', 'proton.me',
]

export function checkEmailShape(raw: string): ShapeCheck {
  const email = raw.trim().toLowerCase()
  const at = email.lastIndexOf('@')
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (at < 1 || /\s/.test(email) || email.indexOf('@') !== at || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain) || domain.includes('..')) {
    return { ok: false, message: 'That does not look like a full email address. It should look like name@gmail.com.' }
  }
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return { ok: false, message: 'Check the part before the @ -- it cannot start or end with a dot, or have two dots together.' }
  }
  if (RESERVED.includes(domain) || RESERVED_ENDINGS.some((e) => domain.endsWith(e))) {
    return { ok: false, message: `"${domain}" cannot receive email. Use an email address you can open.` }
  }
  if (THROWAWAY.includes(domain)) {
    return { ok: false, message: 'Throwaway inboxes are not accepted. Use an email address you will keep, so you can get back into your account.' }
  }
  return { ok: true, email }
}

/** Edit distance with swapped neighbours counted as one slip ("gmial"). */
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}

/** "learner@gmial.com" -> "learner@gmail.com"; null when nothing close. */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf('@')
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (COMMON.includes(domain)) return null
  // ".con", ".cm", ".co" where ".com" was meant, on the big providers.
  const fixedEnding = domain.replace(/\.(con|cmo|cm|om|comm|vom|xom)$/, '.com')
  let best: string | null = COMMON.includes(fixedEnding) ? fixedEnding : null
  if (!best) {
    let bestScore = 3
    for (const c of COMMON) {
      const score = distance(domain, c)
      if (score < bestScore) {
        bestScore = score
        best = c
      }
    }
    // One slip in a short domain, two in a longer one -- "mail.com" is a real
    // provider and only one letter from gmail.com, so it must not be "fixed".
    if (best && bestScore === 2 && domain.length < 9) best = null
    if (domain === 'mail.com' || domain === 'gmx.com') best = null
  }
  return best ? `${local}@${best}` : null
}

/**
 * Does the domain exist? Asks Cloudflare's public DNS (no account, nothing
 * stored). False only on a definite "no such domain"; anything else -- a
 * timeout, no signal, a blocked request -- counts as yes.
 */
export async function domainExists(domain: string, timeoutMs = 3500): Promise<boolean> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
      headers: { accept: 'application/dns-json' },
      signal: ctrl.signal,
    })
    if (!res.ok) return true
    const body = (await res.json()) as { Status?: number }
    return body.Status !== 3 // 3 = NXDOMAIN, the domain does not exist
  } catch {
    return true
  } finally {
    clearTimeout(timer)
  }
}
