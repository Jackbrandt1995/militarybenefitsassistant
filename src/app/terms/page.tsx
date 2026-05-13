import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Privacy Notice | Military Benefits Assistant',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <Shield className="h-12 w-12 text-blue-700 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service &amp; Privacy Notice</h1>
          <p className="text-gray-500 mt-2 text-sm">Effective date: May 2026 &nbsp;·&nbsp; Last updated: May 2026</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">

          {/* Intro */}
          <Section title="About This Service">
            <p>
              Military Benefits Assistant (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;the Service&rdquo;) is an independent tool
              that helps veterans, service members, and their family members fill out VA education benefit forms.
              You answer a series of questions, and the Service pre-fills the appropriate VA PDF form with your
              answers so you can download and submit it yourself.
            </p>
            <p className="mt-3 font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm">
              ⚠ We are not affiliated with, endorsed by, or operated by the U.S. Department of Veterans Affairs (VA)
              or any government agency. This is a private service. We do not submit forms to the VA on your behalf
              and we do not provide legal or benefits advice.
            </p>
          </Section>

          {/* Data collected */}
          <Section title="What Information We Collect">
            <p>To pre-fill your forms, you may choose to save the following information to your profile:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li>Name, date of birth, and sex</li>
              <li>Social Security Number (SSN)</li>
              <li>Mailing address, phone numbers, and email address</li>
              <li>Military service history (branch, dates, discharge character)</li>
              <li>Education and employment history</li>
              <li>Bank account and routing numbers for direct deposit</li>
              <li>Dependent information (name, relationship, SSN, date of birth)</li>
            </ul>
            <p className="mt-3">
              <strong>None of this information is required.</strong> You may complete and download forms without saving
              anything to your profile. Information is only saved when you actively enter and submit it.
            </p>
          </Section>

          {/* How data is stored */}
          <Section title="How Your Data Is Stored &amp; Protected">
            <p>Your data is stored on <strong>Supabase</strong>, a managed database platform, and the application
              is hosted on <strong>Vercel</strong>. Both platforms maintain rigorous security standards:</p>

            <SubHeading>Supabase (Database &amp; Authentication)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>SOC 2 Type II certified</strong> — independently audited security controls</li>
              <li><strong>Encryption at rest</strong> — all stored data is encrypted using AES-256</li>
              <li><strong>Encryption in transit</strong> — all data travels over TLS 1.2 / 1.3 (HTTPS)</li>
              <li><strong>Row-Level Security (RLS)</strong> — database rules enforce that you can only ever
                read or write your own data; no other user can access your records</li>
              <li><strong>Password hashing</strong> — passwords are hashed with bcrypt and never stored in plain text</li>
              <li><strong>Isolated infrastructure</strong> — your data lives in a dedicated database project,
                not shared with other applications</li>
            </ul>

            <SubHeading>Vercel (Application Hosting)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>SOC 2 Type II certified</strong> — independently audited security controls</li>
              <li><strong>HTTPS everywhere</strong> — all pages and API routes are served over encrypted HTTPS</li>
              <li><strong>Global CDN with DDoS protection</strong> — traffic is distributed and protected at the edge</li>
              <li><strong>No server logs of sensitive fields</strong> — application code avoids logging
                personal or financial data</li>
            </ul>

            <SubHeading>Additional Encryption We Apply</SubHeading>
            <p className="mt-2 text-gray-700">
              For your most sensitive fields — SSN and bank account / routing numbers — we apply an additional
              layer of <strong>AES-256-GCM encryption</strong> before the data reaches the database. This means
              even a database administrator cannot read these values without the encryption key.
            </p>
          </Section>

          {/* What we don't do */}
          <Section title="What We Do Not Do">
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              <li>We do <strong>not</strong> submit your forms to the VA or any government agency</li>
              <li>We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing</li>
              <li>We do <strong>not</strong> use your data to train AI or machine learning models</li>
              <li>We do <strong>not</strong> store the filled PDF on our servers — the PDF is generated in
                your browser and downloaded directly to your device</li>
              <li>We do <strong>not</strong> access your data for any purpose other than providing this Service</li>
            </ul>
          </Section>

          {/* PDF generation */}
          <Section title="PDF Generation &amp; Downloads">
            <p>
              When you complete a form, the PDF is filled entirely in your browser using your saved answers.
              The filled PDF is then downloaded directly to your device. We store a record of which forms you have
              submitted (form name, date, and your answers) in your submission history so you can reference
              them later. We do not transmit or store the filled PDF file itself on our servers.
            </p>
          </Section>

          {/* Disclaimer */}
          <Section title="Disclaimer &amp; Limitation of Liability">
            <p>
              This Service is provided <strong>&ldquo;as is&rdquo;</strong> without warranties of any kind. We make no guarantee
              that the forms we generate will be accepted by the VA, that they are current, or that they are
              free of errors.
            </p>
            <p className="mt-3">
              <strong>You are responsible for reviewing every form before submitting it to the VA.</strong> VA
              form requirements, field names, and submission procedures can change. Always verify the current
              version of any form on the official VA website (va.gov) before submission.
            </p>
            <p className="mt-3">
              Nothing in this Service constitutes legal advice, benefits counseling, or a guarantee of any
              VA benefit. If you need assistance with a VA claim or appeal, please contact an accredited VA
              claims agent, attorney, or a Veterans Service Organization (VSO) such as the American Legion,
              DAV, or VFW.
            </p>
          </Section>

          {/* Your rights */}
          <Section title="Your Data Rights">
            <p>You have the right to:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>Access</strong> — view all information stored in your profile at any time</li>
              <li><strong>Correct</strong> — update any field in your profile at any time</li>
              <li><strong>Delete</strong> — request deletion of your account and all associated data by
                contacting us (see below). We will permanently delete your data within 30 days.</li>
              <li><strong>Export</strong> — contact us to request a copy of your stored data</li>
            </ul>
          </Section>

          {/* Changes */}
          <Section title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. When we do, we will update the effective date at the
              top of this page. Continued use of the Service after updated Terms are posted constitutes
              acceptance of the new Terms.
            </p>
          </Section>

          {/* Contact */}
          <Section title="Contact Us">
            <p>
              If you have questions about these Terms, your data, or would like to request deletion of your
              account, please contact us at:{' '}
              <a href="mailto:info@militarybenefitsassistant.com"
                className="text-blue-700 hover:underline font-medium">
                info@militarybenefitsassistant.com
              </a>
            </p>
          </Section>

        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-8 py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-1">{children}</h3>;
}
