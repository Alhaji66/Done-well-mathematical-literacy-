import { chromium } from 'playwright-core'

const FAKE_USER_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
const FAKE_SESSION = {
  currentSession: {
    access_token: 'fake-access-token',
    refresh_token: 'fake-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: FAKE_USER_ID,
      aud: 'authenticated',
      role: 'authenticated',
      email: 'learner@example.com',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
    },
  },
  expiresAt: Math.floor(Date.now() / 1000) + 3600,
}

const PROFILE_ROW = {
  id: FAKE_USER_ID,
  role: 'learner',
  full_name: 'Test Learner',
  grade: 12,
  school_id: null,
  created_at: new Date().toISOString(),
}

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
  const page = await browser.newPage()

  await page.route('**/rest/v1/**', async (route) => {
    const url = route.request().url()
    if (url.includes('/profiles')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([PROFILE_ROW]) })
    } else if (url.includes('/learner_progress')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    }
  })

  await page.route('**/auth/v1/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FAKE_SESSION.currentSession) })
  })

  await page.addInitScript(
    ({ key, session }) => {
      window.localStorage.setItem(key, JSON.stringify(session))
    },
    { key: 'sb-rmajiwnyduxjgrcjqejw-auth-token', session: FAKE_SESSION.currentSession }
  )

  const fs = await import('node:fs')
  const axe = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8')
  const PAGES = [
    ['home', 'http://localhost:4173/'],
    ['popia', 'http://localhost:4173/popia'],
    ['account sign-in', 'http://localhost:4173/account/sign-in'],
    ['learner practise', 'http://localhost:4173/account/learner/practise'],
    ['learner dashboard', 'http://localhost:4173/account/learner/dashboard'],
    ['privacy & data', 'http://localhost:4173/account/learner/privacy'],
  ]
  const all = {}
  for (const [name, url] of PAGES) {
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(900)
    await page.evaluate(axe)
    const res = await page.evaluate(async () =>
      await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }),
    )
    all[name] = res.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help,
      sample: v.nodes[0]?.html?.slice(0, 110) }))
  }
  const totals = {}
  for (const [name, vs] of Object.entries(all)) {
    for (const v of vs) totals[v.id] = (totals[v.id] ?? 0) + v.n
  }
  console.log(JSON.stringify({ perPage: all, totalNodesByRule: totals }, null, 2))
  await browser.close()
}
run().catch((e) => { console.error('FAILED:', e); process.exit(1) })
