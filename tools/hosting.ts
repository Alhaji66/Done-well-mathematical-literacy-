import { existsSync, readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

/**
 * Hosting details that live outside the app's code.
 *
 * public/_headers is the one place the security headers are written (see the
 * notes in it). This plugin reads it so that `vite preview` sends the same
 * headers -- the app is tested locally under the policy it will run under.
 *
 * On Cloudflare Pages (which sets CF_PAGES during its builds) it also drops the
 * two GitHub Pages workarounds from the build: 404.html, whose presence turns
 * off Cloudflare's own single-page-app routing, and _redirects, whose catch-all
 * rule Cloudflare rejects as a loop.
 */

export interface HeaderRule {
  pattern: string
  headers: Record<string, string>
}

export function parseHeadersFile(text: string): HeaderRule[] {
  const rules: HeaderRule[] = []
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      rules.push({ pattern: line.trim(), headers: {} })
    } else if (rules.length) {
      const i = line.indexOf(':')
      rules[rules.length - 1].headers[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  }
  return rules
}

const matches = (pattern: string, pathname: string) =>
  pattern.endsWith('*') ? pathname.startsWith(pattern.slice(0, -1)) : pathname === pattern

export function hosting(root: string): Plugin {
  let base = '/'
  let outDir = 'dist'
  return {
    name: 'done-well-hosting',
    configResolved(config) {
      base = config.base
      outDir = path.resolve(config.root, config.build.outDir)
    },
    configurePreviewServer(server) {
      const rules = parseHeadersFile(readFileSync(path.join(root, 'public/_headers'), 'utf8'))
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '/').split('?')[0]
        const pathname = url.startsWith(base) ? `/${url.slice(base.length)}` : url
        for (const rule of rules) {
          if (!matches(rule.pattern, pathname)) continue
          for (const [name, value] of Object.entries(rule.headers)) {
            // Over plain http on localhost the browser would try to upgrade every request.
            res.setHeader(name, name === 'Content-Security-Policy' ? value.replace(/; upgrade-insecure-requests/, '') : value)
          }
        }
        next()
      })
    },
    closeBundle() {
      if (!process.env.CF_PAGES) return
      for (const f of ['404.html', '_redirects']) {
        const file = path.join(outDir, f)
        if (existsSync(file)) rmSync(file)
      }
    },
  }
}
