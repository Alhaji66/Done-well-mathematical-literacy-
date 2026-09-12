import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage()
const fails = []
const ok = (label, cond, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? ' — ' + extra : ''}`)
  if (!cond) fails.push(label)
}

// Demo practise, Grade 12 Finance: the teacher's example.
await page.goto('http://localhost:4173/app/learner/practise?subject=mat-lit&grade=12&topic=finance', {
  waitUntil: 'networkidle',
})
await page.waitForTimeout(1500)

const headings = await page.locator('section[aria-labelledby^="subtopic-"] h3').allInnerTexts()
ok('Finance renders sub-topic sections', headings.length >= 4, `${headings.length} sections`)
console.log('     sections:', headings.join(' | '))

ok('Taxation is its own section', headings.some((h) => /Taxation/i.test(h)))
ok('Tariffs is its own section', headings.some((h) => /Tariff/i.test(h)))

const explain = await page.locator('text=What you need to know').count()
ok('each section carries its explanation', explain >= 4, `${explain} explanation blocks`)

// The sub-topic chip row filters.
const chip = page.getByRole('button', { name: /Taxation/i }).first()
ok('a sub-topic chip exists', (await chip.count()) > 0)
if (await chip.count()) {
  await chip.click()
  await page.waitForTimeout(700)
  const after = await page.locator('section[aria-labelledby^="subtopic-"] h3').allInnerTexts()
  ok('choosing Taxation shows only Taxation', after.length === 1 && /Taxation/i.test(after[0]), after.join('|'))
  ok('the URL records the sub-topic', page.url().includes('subtopic='), page.url())
}

// The reviewer's failing route: a Grade 10 Physical Sciences topic.
await page.goto('http://localhost:4173/app/learner/practise?subject=physical-sciences&grade=10&topic=phys-motion-1d', {
  waitUntil: 'networkidle',
})
await page.waitForTimeout(1500)
const empty = await page.locator('text=No sample questions at this difficulty yet').count()
ok('Grade 10 phys-motion-1d is no longer empty', empty === 0)
const g10 = await page.locator('section[aria-labelledby^="subtopic-"] h3').allInnerTexts()
ok('and it renders sub-topics', g10.length >= 1, `${g10.length} sections`)

// Learn's card links carry subject and grade.
await page.goto('http://localhost:4173/app/learner/learn', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const hrefs = await page.locator('a[href*="/practise?"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
ok('Learn links carry subject and grade', hrefs.length > 0 && hrefs.every((h) => h.includes('subject=') && h.includes('grade=')),
   hrefs[0] ?? 'none')

await browser.close()
console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join('; ')}` : '\nAll smoke checks passed.')
process.exit(fails.length ? 1 : 0)
