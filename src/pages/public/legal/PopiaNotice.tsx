import { LegalLayout } from '@/components/layout/LegalLayout'

export function PopiaNotice() {
  return (
    <LegalLayout title="POPIA Notice" updated="September 2026">
      <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
        <strong>Prototype notice:</strong> This notice describes how DONE WELL® intends to comply with South Africa's
        Protection of Personal Information Act (POPIA) once real accounts launch. No real personal information is
        processed by this prototype today.
      </div>

      <section>
        <h2 className="text-lg font-bold text-navy-900">1. Responsible party</h2>
        <p className="mt-2">
          Done Well Publications is the responsible party for personal information processed through DONE WELL®.
          Contact:{' '}
          <a href="mailto:donewellpublication@gmail.com" className="font-semibold text-navy-800 underline">
            donewellpublication@gmail.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">2. Purpose of processing</h2>
        <p className="mt-2">
          Personal information will be processed solely to provide the DONE WELL® school support service — creating
          accounts, tracking learning progress, generating resources and assessments, and enabling parents, teachers
          and schools to support learners.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">3. Lawful basis</h2>
        <p className="mt-2">
          Processing will be based on consent (including parental/guardian consent for minors) and, where
          applicable, on our legitimate interest in delivering the educational service a school or family has signed
          up for.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">4. Children's personal information</h2>
        <p className="mt-2">
          POPIA gives special protection to children's personal information. Before creating a real account for a
          learner under 18, we will require the consent of a parent or legal guardian, or rely on another basis
          POPIA permits for educational purposes. Parents and guardians will always be able to review, correct or
          request deletion of their child's information.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">5. Your rights as a data subject</h2>
        <p className="mt-2">Once a real account exists, you will be entitled to:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Request access to the personal information we hold about you or your child.</li>
          <li>Request correction of inaccurate or outdated information.</li>
          <li>Request deletion of personal information, where we're not required to keep it.</li>
          <li>Object to processing you believe is unlawful.</li>
          <li>
            Lodge a complaint with the{' '}
            <a
              href="https://inforegulator.org.za/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-navy-800 underline"
            >
              Information Regulator of South Africa
            </a>{' '}
            if you believe your rights under POPIA have been infringed.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">6. Retention</h2>
        <p className="mt-2">
          We will keep personal information only for as long as needed to provide the service, or as required by
          law, and will securely delete it afterwards.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">7. Contact our Information Officer</h2>
        <p className="mt-2">
          For any POPIA-related request or question, contact{' '}
          <a href="mailto:donewellpublication@gmail.com" className="font-semibold text-navy-800 underline">
            donewellpublication@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  )
}
