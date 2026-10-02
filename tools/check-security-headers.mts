/**
 * The security headers, checked.
 *
 *   npm run check:security-headers
 *
 * - vercel.json sends exactly the headers public/_headers does, so the site
 *   is equally protected whichever of those hosts serves it;
 * - no page carries inline script (a <script> with code in it, or an
 *   onclick="..." attribute), which the Content-Security-Policy would block;
 * - the policy still admits Cloudflare Turnstile, the sign-in CAPTCHA.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHeadersFile } from './hosting'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const problems: string[] = []

const rules = parseHeadersFile(readFileSync(join(root, 'public/_headers'), 'utf8'))
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')) as {
  headers?: { source: string; headers: { key: string; value: string }[] }[]
}
const toVercel = (pattern: string) => (pattern.endsWith('*') ? `${pattern.slice(0, -1)}(.*)` : pattern)

for (const rule of rules) {
  const match = vercel.headers?.find((h) => h.source === toVercel(rule.pattern))
  if (!match) {
    problems.push(`vercel.json has no headers for ${toVercel(rule.pattern)} (public/_headers has ${rule.pattern}).`)
    continue
  }
  const theirs = Object.fromEntries(match.headers.map((h) => [h.key, h.value]))
  for (const [name, value] of Object.entries(rule.headers)) {
    if (theirs[name] !== value) problems.push(`vercel.json ${match.source} ${name} differs from public/_headers.`)
  }
  for (const name of Object.keys(theirs)) {
    if (!(name in rule.headers)) problems.push(`vercel.json ${match.source} sends ${name}, which public/_headers does not.`)
  }
}
for (const h of vercel.headers ?? []) {
  if (!rules.some((r) => toVercel(r.pattern) === h.source)) problems.push(`vercel.json headers for ${h.source} are not in public/_headers.`)
}

const csp = rules.find((r) => r.pattern === '/*')?.headers['Content-Security-Policy'] ?? ''
for (const directive of ['script-src', 'frame-src']) {
  const value = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith(`${directive} `)) ?? ''
  if (!value.includes('https://challenges.cloudflare.com')) problems.push(`The policy's ${directive} must admit https://challenges.cloudflare.com for the sign-in CAPTCHA.`)
  if (/'unsafe-inline'|'unsafe-eval'/.test(value)) problems.push(`The policy's ${directive} must not allow inline script or eval.`)
}

// 404.html is GitHub Pages only, which sends no headers; it is not served elsewhere.
const pages = ['index.html', ...readdirSync(join(root, 'public')).filter((f) => f.endsWith('.html') && f !== '404.html').map((f) => `public/${f}`)]
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8')
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (m[2].trim() && !/type=["']?(application\/(ld\+)?json)/.test(m[1])) problems.push(`${page} has an inline <script>: move it to a file.`)
  }
  const handler = html.match(/\son[a-z]+\s*=\s*["']/)
  if (handler) problems.push(`${page} has an inline event handler (${handler[0].trim()}...): use addEventListener in a script file.`)
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`Security headers agree for ${rules.length} path rules; ${pages.length} pages carry no inline script.`)
