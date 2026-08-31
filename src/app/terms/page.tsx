import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Terms of Service | Military Benefits Assistant',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <Image src="/seal.png" alt="Military Benefits Assistant" width={64} height={64} className="mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-500 mt-2 text-sm">Effective date: June 2026 &nbsp;·&nbsp; Last updated: June 2026</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">

          <Section title="About This Service">
            <p>
              Military Benefits Assistant (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;the Service&rdquo;) is an
              independent tool that helps veterans, service members, and their family members prepare
              VA benefit forms. You answer a series of guided questions, and the Service pre-fills the
              appropriate VA PDF form with your answers so you can review, download, and submit it.
            </p>
            <p className="mt-3">The Service currently supports forms in the following categories:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>VA Education Benefits</strong> — GI Bill, transfer of entitlement, work-study, vocational rehabilitation, and related forms</li>
              <li><strong>VA Health Care</strong> — Application for VA Health Care Enrollment (VA 10-10EZ)</li>
              <li><strong>VA Home Loan</strong> — Request for Certificate of Eligibility (VA 26-1880)</li>
              <li><strong>Representation</strong> — Appointment of Individual as Claimant&rsquo;s Representative (VA 21-22A)</li>
            </ul>
            <p className="mt-4 font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm">
              ⚠ We are not affiliated with, endorsed by, or operated by the U.S. Department of Veterans
              Affairs (VA) or any government agency. This is a private service. We do not provide legal
              or benefits advice.
            </p>
          </Section>

          <Section title="What Information We Collect">
            <p>
              To pre-fill your forms, you may choose to save the following information to your profile.
              All fields are optional — you may complete and download any form without saving anything
              to your account.
            </p>

            <SubHeading>Identity &amp; Contact</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Full legal name, other names used in military service, date of birth, sex, and place of birth</li>
              <li>Social Security Number (SSN) — stored with additional encryption</li>
              <li>Mother&rsquo;s maiden name (VA identity verification)</li>
              <li>Mailing address, phone numbers, and email address</li>
            </ul>

            <SubHeading>Military &amp; Benefits Records</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Military service history (branch, dates, character of discharge)</li>
              <li>Military service number (pre-1972 veterans), VA file number</li>
              <li>National Guard and Reserve activation periods</li>
            </ul>

            <SubHeading>Education, Employment &amp; Financial</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Education and employment history</li>
              <li>Bank account and routing numbers for direct deposit — stored with additional encryption</li>
            </ul>

            <SubHeading>Dependents</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Dependent name, relationship, date of birth, and SSN — SSN stored with additional encryption</li>
            </ul>

            <SubHeading>Messages &amp; Activity</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>In-app messages you send to our team and our replies</li>
              <li>Form submission history (form name, date, and your answers)</li>
            </ul>
          </Section>

          <Section title="How Your Data Is Stored &amp; Protected">
            <p>
              Your data is stored on <strong>Supabase</strong>, a managed database platform, and
              the application is hosted on <strong>Vercel</strong>. Both platforms maintain rigorous
              security standards:
            </p>

            <SubHeading>Supabase (Database &amp; Authentication)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>AES-256 encryption at rest</strong> — all stored data is encrypted</li>
              <li><strong>TLS 1.2 / 1.3 in transit</strong> — all data travels over HTTPS</li>
              <li>
                <strong>Row-Level Security (RLS)</strong> — database rules enforce that you can only
                read or write your own data; no other user can access your records
              </li>
              <li><strong>Password hashing</strong> — passwords are hashed with bcrypt; never stored in plain text</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Your use of this service also involves Supabase&apos;s hosting infrastructure, which is
              governed by Supabase&apos;s own{' '}
              <a
                href="https://supabase.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Privacy Policy
              </a>
              .
            </p>

            <SubHeading>Vercel (Application Hosting)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>HTTPS everywhere</strong> — all pages and API routes served over encrypted HTTPS</li>
              <li><strong>Global CDN with DDoS protection</strong></li>
            </ul>

            <SubHeading>Additional Encryption We Apply</SubHeading>
            <p className="mt-2 text-gray-700">
              SSN, bank account / routing numbers, and dependent SSNs receive an additional layer of{' '}
              <strong>AES-256-GCM encryption</strong> before the data reaches the database. Even a
              database administrator cannot read these values without the application encryption key.
            </p>
          </Section>

          <Section title="PDF Generation &amp; Downloads">
            <p>
              When you complete a form, the PDF is filled entirely in your browser and downloaded
              directly to your device. We do <strong>not</strong> store the filled PDF file on our
              servers. We store a record of your form answers in your submission history so you can
              reference or re-download them later.
            </p>
            <p className="mt-3">
              Submitted forms can be returned to you by our team with a request for corrections or
              additional information. If that occurs, you will be notified and can update your
              answers before resubmitting.
            </p>
          </Section>

          <Section title="Agent Filing Service (Optional)">
            <p>
              In addition to self-filing, we offer an optional <strong>agent filing service</strong>.
              If you choose this option, our accredited team will review your completed forms and
              submit them to the VA on your behalf, acting as your authorized VA representative.
            </p>
            <p className="mt-3">To use agent filing you must:</p>
            <ol className="mt-2 space-y-1 list-decimal list-inside text-gray-700">
              <li>
                Complete <strong>VA Form 21-22A</strong> (Appointment of Individual as Claimant&rsquo;s
                Representative), which legally authorizes our team to represent you before the VA
                for the matters you specify
              </li>
              <li>
                Both you and a member of our team must sign the form before it can be submitted
              </li>
            </ol>
            <p className="mt-3">By authorizing agent filing, you understand and agree that:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Members of our team will access and review your form submission data for the purpose of filing</li>
              <li>We will communicate with the VA on your behalf only for the forms and matters you have authorized</li>
              <li>You remain responsible for the accuracy of all information provided</li>
              <li>You may revoke the authorization at any time by submitting a new VA Form 21-22A or by contacting us</li>
            </ul>
            <p className="mt-3">
              Agent filing is entirely <strong>optional</strong>. You may always download your
              completed PDF and submit it yourself.
            </p>
          </Section>

          <Section title="What We Do Not Do">
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              <li>We do <strong>not</strong> submit forms to the VA unless you have explicitly authorized agent filing as described above</li>
              <li>We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing</li>
              <li>We do <strong>not</strong> use your data to train AI or machine learning models</li>
              <li>We do <strong>not</strong> store filled PDF files on our servers</li>
              <li>We do <strong>not</strong> access your data for any purpose other than providing this Service</li>
            </ul>
          </Section>

          <Section title="Disclaimer &amp; Limitation of Liability">
            <p>
              This Service is provided <strong>&ldquo;as is&rdquo;</strong> without warranties of any kind. We
              make no guarantee that the forms we generate will be accepted by the VA, that they are
              current, or that they are free of errors.
            </p>
            <p className="mt-3">
              <strong>You are responsible for reviewing every form before it is submitted to the VA,</strong>{' '}
              whether you submit it yourself or authorize us to do so on your behalf. VA form
              requirements, field names, and submission procedures can change. Always verify the
              current version of any form on the official VA website (va.gov) before submission.
            </p>
            <p className="mt-3">
              Nothing in this Service constitutes legal advice, benefits counseling, or a guarantee
              of any VA benefit. If you need assistance with a VA claim or appeal, please contact an
              accredited VA claims agent, attorney, or a Veterans Service Organization (VSO) such as
              the American Legion, DAV, or VFW.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by applicable law, we are not liable for any indirect,
              incidental, special, or consequential damages arising from your use of this Service,
              including but not limited to denial of a VA benefit, processing delays, or errors in
              a submitted form.
            </p>
          </Section>

          <Section title="Your Data Rights">
            <p>You have the right to:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>Access</strong> — view all information stored in your profile at any time</li>
              <li><strong>Correct</strong> — update any field in your profile at any time</li>
              <li>
                <strong>Delete</strong> — request deletion of your account and all associated data
                by contacting us. We will permanently delete your data within 30 days.
              </li>
              <li><strong>Export</strong> — contact us to request a copy of your stored data</li>
            </ul>
          </Section>

          <Section title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. When we do, we will update the effective
              date at the top of this page. For material changes, we will notify you via email or
              an in-app notice. Continued use of the Service after updated Terms are posted
              constitutes acceptance of the new Terms.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have questions about these Terms, your data, or would like to request deletion
              of your account, please contact us at:{' '}
              <a
                href="mailto:info@militarybenefitsassistant.com"
                className="text-blue-700 hover:underline font-medium"
              >
                info@militarybenefitsassistant.com
              </a>
            </p>
          </Section>

        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">← Back to home</Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-700">Privacy Policy</Link>
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
