import { Link } from 'react-router-dom'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { POPIA_NOTICE_VERSION } from '@/lib/privacy'

/**
 * The section 18 notification: what is collected, why, who sees it, and what
 * the person can do about it.
 *
 * Written in the present tense on purpose. An earlier version of this page said
 * no real personal information was processed, which stopped being true once
 * real accounts shipped -- and a notice that misdescribes the processing is
 * worse than no notice, because people rely on it.
 */
export function PopiaNotice() {
  return (
    <LegalLayout title="POPIA Notice" updated="September 2026">
      <p className="text-sm text-navy-500">Version {POPIA_NOTICE_VERSION}</p>

      <p>
        This notice explains how DONE WELL® handles personal information under South Africa's Protection of Personal
        Information Act, 4 of 2013 (POPIA). It applies when you create a real account. You can browse the public
        site and the demo without an account, and we collect nothing about you when you do.
      </p>

      <section>
        <h2 className="text-lg font-bold text-navy-900">1. Who is responsible</h2>
        <p className="mt-2">
          Done Well Publications is the responsible party. Our Information Officer can be reached at{' '}
          <a href="mailto:donewellpublication@gmail.com" className="font-semibold text-navy-800 underline">
            donewellpublication@gmail.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">2. What we collect, and why</h2>
        <p className="mt-2">When you create an account we hold the following, and nothing else:</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-left">
                <th className="py-2 pr-4 font-semibold text-navy-900">Information</th>
                <th className="py-2 pr-4 font-semibold text-navy-900">Why we need it</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-navy-100">
                <td className="py-2.5 pr-4">Your email address</td>
                <td className="py-2.5 pr-4">To sign you in. We use a sign-in link rather than a password.</td>
              </tr>
              <tr className="border-b border-navy-100">
                <td className="py-2.5 pr-4">Your full name</td>
                <td className="py-2.5 pr-4">So the app can address you, and so a parent or teacher can recognise you.</td>
              </tr>
              <tr className="border-b border-navy-100">
                <td className="py-2.5 pr-4">Whether you are a learner, parent, teacher or school</td>
                <td className="py-2.5 pr-4">To show you the right part of the app.</td>
              </tr>
              <tr className="border-b border-navy-100">
                <td className="py-2.5 pr-4">Your grade and subject (learners)</td>
                <td className="py-2.5 pr-4">To show work for your grade rather than someone else's.</td>
              </tr>
              <tr className="border-b border-navy-100">
                <td className="py-2.5 pr-4">Your school</td>
                <td className="py-2.5 pr-4">To connect you to your teachers, and them to their learners.</td>
              </tr>
              <tr className="border-b border-navy-100">
                <td className="py-2.5 pr-4">Which topics you have practised, and a mastery percentage for each</td>
                <td className="py-2.5 pr-4">To show your progress and to suggest what to work on next.</td>
              </tr>
              <tr className="border-b border-navy-100">
                <td className="py-2.5 pr-4">A record of the consent given for this account</td>
                <td className="py-2.5 pr-4">Because POPIA requires us to be able to show that consent was given.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          <strong>The answers you type into a question stay in your own browser.</strong> They are never sent to us.
          We store only that you attempted a topic and how you are doing on it.
        </p>
        <p className="mt-2">
          We do not sell personal information, we do not use it for advertising, and we do not share it with anyone
          outside the service.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">3. Who can see a learner's information</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>The learner.</li>
          <li>
            A parent or guardian the learner has linked, using a code the learner gives them from their own
            dashboard. Either of them can remove that link at any time.
          </li>
          <li>Teachers and staff at the school the learner registered under.</li>
          <li>
            Supabase, which hosts our database and sign-in system as our operator, under a duty of confidentiality.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">4. Learners under 18</h2>
        <p className="mt-2">
          Most Grade 10 to 12 learners are under 18, and POPIA gives a child's personal information special
          protection. A learner account for anyone under 18 cannot be created until a parent or guardian has given
          permission: they are named during sign-up, and the consent is dated and recorded against the account.
        </p>
        <p className="mt-2">
          A parent or guardian can see that consent record, withdraw it, and have the account deleted, at any time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">5. Your rights, and how to use them</h2>
        <p className="mt-2">
          Signed in, open <strong>Privacy &amp; data</strong> in your account. From there you can, without asking
          anyone:
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>See every item of information we hold about you.</li>
          <li>Download all of it as a file.</li>
          <li>See who can read your progress, and cut any of those links.</li>
          <li>Withdraw the consent this account rests on.</li>
          <li>Delete the account and everything attached to it.</li>
        </ul>
        <p className="mt-3">
          Your name, grade and subject can be corrected in your account at any time. Deleting the account from that
          page removes your profile, your progress, your links and your consent record. Your email address lives in
          our sign-in system, which that button cannot reach, so email us and we will remove it too.
        </p>
        <p className="mt-3">
          If you believe we have infringed your rights, you may complain to the{' '}
          <a
            href="https://inforegulator.org.za/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-navy-800 underline"
          >
            Information Regulator of South Africa
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">6. How long we keep it</h2>
        <p className="mt-2">
          We keep an account's information while the account is in use, and for twelve months after it was last
          signed into, so that a learner returning after a school holiday or a year-end does not lose their
          progress. After that we delete it. Deleting the account yourself removes everything immediately.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">7. How it is protected</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>All traffic between your device and us is encrypted in transit.</li>
          <li>
            Access is enforced in the database itself, row by row, so one account cannot read another's records even
            if the app were asked to.
          </li>
          <li>We sign in with a one-time link, so there is no password for us to store or for anyone to steal.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">8. Where it is stored</h2>
        <p className="mt-2">
          Our database and sign-in system are hosted by Supabase. If the hosting region is outside South Africa,
          POPIA section 72 treats that as a cross-border transfer, which is permitted where the receiving country
          has comparable protection or the operator is bound by contract to it.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">9. Changes to this notice</h2>
        <p className="mt-2">
          Each consent is recorded against the version of this notice that was shown at the time, so a later change
          cannot quietly reinterpret a permission already given. If we change anything material, we will ask again.
        </p>
        <p className="mt-2">
          See also our{' '}
          <Link to="/privacy" className="font-semibold text-navy-800 underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to="/terms" className="font-semibold text-navy-800 underline">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  )
}
