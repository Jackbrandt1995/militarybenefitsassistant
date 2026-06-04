import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Military Benefits Assistant',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <Image
            src="/seal.png"
            alt="Military Benefits Assistant"
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-full"
          />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-500 mt-2 text-sm">Effective date: June 2026 &nbsp;·&nbsp; Last updated: June 2026</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">

          <Section title="What We Collect">
            <p>To pre-fill your VA forms, you may choose to save the following information to your profile:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li>Name, date of birth, and sex</li>
              <li>Social Security Number (SSN)</li>
              <li>Mailing address, phone numbers, and email address</li>
              <li>Military service history (branch, dates, character of discharge)</li>
              <li>Education and employment history</li>
              <li>Bank account and routing numbers for direct deposit</li>
              <li>Dependent information (name, relationship, SSN, date of birth)</li>
            </ul>
            <p className="mt-3">
              <strong>None of this information is required.</strong> You may complete and download forms without
              saving anything to your profile. Information is only saved when you actively enter and submit it.
            </p>
          </Section>

          <Section title="How We Use It">
            <p>Your information is used solely to pre-fill the VA forms you request. Specifically:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li>Your data is <strong>never sold</strong> to third parties</li>
              <li>Your data is <strong>not used</strong> for advertising or marketing purposes</li>
              <li>Your data is <strong>not used</strong> to train AI or machine learning models</li>
              <li>Your data is <strong>only accessed</strong> to provide the services you have requested</li>
            </ul>
          </Section>

          <Section title="How It's Stored">
            <p>Your data is stored on <strong>Supabase</strong> and the application is hosted on <strong>Vercel</strong>.</p>

            <SubHeading>Supabase (Database &amp; Authentication)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>AES-256 encryption at rest</strong> — all stored data is encrypted</li>
              <li><strong>TLS in transit</strong> — all data travels over TLS 1.2 / 1.3 (HTTPS)</li>
              <li><strong>SOC 2 Type II certified</strong> — independently audited security controls</li>
              <li><strong>Row-Level Security (RLS)</strong> — database rules enforce that you can only ever
                read or write your own data</li>
            </ul>

            <SubHeading>Vercel (Application Hosting)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>SOC 2 Type II certified</strong> — independently audited security controls</li>
              <li><strong>HTTPS everywhere</strong> — all pages and API routes served over encrypted HTTPS</li>
            </ul>

            <SubHeading>Additional Encryption for Sensitive Fields</SubHeading>
            <p className="mt-2 text-gray-700">
              Your SSN and bank account / routing numbers receive an additional layer of{' '}
              <strong>AES-256-GCM encryption</strong> before the data reaches the database. This means even a
              database administrator cannot read these values without the encryption key.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>You have the right to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-gray-700">
              <li>
                <strong>Access</strong> — view all information stored in your profile at any time from your
                account dashboard
              </li>
              <li>
                <strong>Correct</strong> — update any field in your profile at any time
              </li>
              <li>
                <strong>Delete</strong> — request deletion of your account and all associated data by
                contacting us. We will permanently delete your data within <strong>30 days</strong> of your request.
              </li>
              <li>
                <strong>Export</strong> — contact us to request a copy of all data we hold about you
              </li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>We use a minimal number of cookies strictly necessary to operate the service:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>Authentication cookies</strong> — used to keep you logged in to your account</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> use tracking cookies, advertising cookies, or any third-party
              analytics cookies. We do not participate in cross-site tracking of any kind.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have questions about this Privacy Policy, your data, or would like to request
              access, correction, deletion, or export of your data, please contact us at:{' '}
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
          <Link href="/terms" className="text-gray-500 hover:text-gray-700">Terms of Service</Link>
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
