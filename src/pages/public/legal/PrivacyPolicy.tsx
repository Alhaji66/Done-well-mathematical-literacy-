import { LegalLayout } from '@/components/layout/LegalLayout'

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 2026">
      <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
        <strong>Prototype notice:</strong> DONE WELL® is currently a demo. No real accounts exist yet, and the site
        does not collect or store any real learner, parent or teacher information — every name and result you see is
        sample data. This policy describes how your information will be handled once real accounts launch.
      </div>

      <section>
        <h2 className="text-lg font-bold text-navy-900">1. Who we are</h2>
        <p className="mt-2">
          DONE WELL® is a school support platform operated by Done Well Publications ("we", "us", "our"), based in
          South Africa. You can reach us at{' '}
          <a href="mailto:donewellpublication@gmail.com" className="font-semibold text-navy-800 underline">
            donewellpublication@gmail.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">2. What we will collect</h2>
        <p className="mt-2">Once real accounts are available, we plan to collect:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Account details — name, grade, school (if applicable), and contact details for parents/guardians and teachers.</li>
          <li>Learning activity — practice attempts, test scores, and topic progress, used to power dashboards and recommendations.</li>
          <li>Basic technical information — such as device type, needed to keep the platform working reliably.</li>
        </ul>
        <p className="mt-2">We will never ask for more information than we need to provide the service.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">3. How we will use it</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>To personalise practice and progress tracking for each learner.</li>
          <li>To share a learner's progress with their own parent/guardian and their own teacher or school.</li>
          <li>To improve the platform and its content.</li>
        </ul>
        <p className="mt-2">
          We will not sell personal information, and we will not share it with third parties for marketing purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">4. Children's information</h2>
        <p className="mt-2">
          Many DONE WELL® users are minors. Before any real learner account is created, we will require consent from
          a parent or guardian, in line with South Africa's Protection of Personal Information Act (POPIA). See our{' '}
          <a href="/popia" className="font-semibold text-navy-800 underline">
            POPIA Notice
          </a>{' '}
          for more detail.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">5. Storage and security</h2>
        <p className="mt-2">
          When real accounts launch, information will be stored with reputable hosting providers, protected with
          encryption in transit, and accessible only to authorised staff who need it to operate the platform.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">6. Your rights</h2>
        <p className="mt-2">
          Once you have a real account, you will be able to ask us to access, correct, or delete your personal
          information, or object to how it is used, by contacting us at the email address above.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">7. Changes to this policy</h2>
        <p className="mt-2">
          We may update this policy as the platform develops. We'll update the "Last updated" date above whenever we
          do.
        </p>
      </section>
    </LegalLayout>
  )
}
