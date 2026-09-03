import { LegalLayout } from '@/components/layout/LegalLayout'

export function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" updated="September 2026">
      <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
        <strong>Prototype notice:</strong> DONE WELL® is currently a demo. No real accounts, subscriptions or payments
        are active. Everything shown — names, scores, resources — is sample data for demonstration purposes only.
      </div>

      <section>
        <h2 className="text-lg font-bold text-navy-900">1. Using this demo</h2>
        <p className="mt-2">
          By using this prototype, you agree that it is provided for evaluation purposes only. The "Sign In" page
          does not create a real account — it simply lets you preview each role's dashboard using sample data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">2. No payments processed</h2>
        <p className="mt-2">
          The pricing shown on this site is illustrative. No payment is collected or processed by this prototype.
          When paid plans launch, updated terms covering billing, cancellation and refunds will apply.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">3. Intellectual property</h2>
        <p className="mt-2">
          DONE WELL® and its content — including Learner Books, Workbooks, Teacher Guides, tests, memos and sample
          questions — belong to Done Well Publications. You may not copy, redistribute, or resell this content
          without our permission.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">4. Acceptable use</h2>
        <p className="mt-2">
          Please don't use this site to attempt to disrupt the service, scrape content at scale, or misrepresent
          sample/demo data as real learner records.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">5. No warranty</h2>
        <p className="mt-2">
          As a prototype, this site is provided "as is" without warranties of any kind. Content, features and
          availability may change as the platform develops.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">6. Governing law</h2>
        <p className="mt-2">These terms are governed by the laws of the Republic of South Africa.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy-900">7. Contact</h2>
        <p className="mt-2">
          Questions about these terms? Email us at{' '}
          <a href="mailto:donewellpublication@gmail.com" className="font-semibold text-navy-800 underline">
            donewellpublication@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  )
}
