/**
 * The email checks the sign-in page runs before Supabase sends anything.
 *
 *   npm run check:email
 *
 * Every case here is an address that would otherwise have been sent a
 * confirmation or sign-in email -- and bounced, or reached nobody.
 */
import { checkEmailShape, suggestEmail } from '../src/lib/emailCheck'

const problems: string[] = []

const refused = ['learner', 'learner@gmail', 'a b@gmail.com', 'two@@gmail.com', '.dot@gmail.com', 'x@example.com', 'x@school.test', 'x@test.com', 'x@mailinator.com']
for (const e of refused) if (checkEmailShape(e).ok) problems.push(`accepted "${e}"`)

const accepted = ['Learner@Gmail.com ', 'n.dlamini@yahoo.co.za', 'teacher@school.co.za', 'x@up.ac.za', 'a+b@outlook.com']
for (const e of accepted) if (!checkEmailShape(e).ok) problems.push(`refused "${e}"`)
const cleaned = checkEmailShape('  Learner@Gmail.com ')
if (!cleaned.ok || cleaned.email !== 'learner@gmail.com') problems.push('did not trim and lower-case the address')

const typos: [string, string | null][] = [
  ['k@gmial.com', 'k@gmail.com'], ['k@gmail.con', 'k@gmail.com'], ['k@gmail.co', 'k@gmail.com'], ['k@gamil.com', 'k@gmail.com'],
  ['k@hotmial.com', 'k@hotmail.com'], ['k@outlok.com', 'k@outlook.com'], ['k@yaho.co.za', 'k@yahoo.co.za'], ['k@icloud.co', 'k@icloud.com'],
  ['k@gmail.com', null], ['k@yahoo.co.za', null], ['k@mail.com', null], ['k@gmx.com', null], ['k@live.co.za', null],
  ['k@school.co.za', null], ['k@vodacom.co.za', null], ['k@mtn.co.za', null], ['k@up.ac.za', null],
]
for (const [e, want] of typos) {
  const got = suggestEmail(e)
  if (got !== want) problems.push(`suggestEmail("${e}") gave ${got}, expected ${want}`)
}

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'))
  process.exit(1)
}
console.log(`Email checks: ${refused.length} refused, ${accepted.length} accepted, ${typos.length} typo cases correct.`)
