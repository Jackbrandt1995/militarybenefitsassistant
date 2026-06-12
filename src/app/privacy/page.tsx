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
            <p>
              To pre-fill your VA forms, you may choose to save the following information to your
              profile. All fields are optional — you may complete and download any form without
              saving anything to your account.
            </p>

            <SubHeading>Identity &amp; Contact</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Full legal name (first, middle initial, last, suffix)</li>
              <li>Other names used during military service (e.g., maiden name)</li>
              <li>Date of birth, sex, and place of birth</li>
              <li>Social Security Number (SSN) — stored with additional encryption (see below)</li>
              <li>Mother&rsquo;s maiden name (used as a VA identity verification check)</li>
              <li>Mailing address, phone numbers, and email address</li>
            </ul>

            <SubHeading>Military &amp; Benefits Records</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Military service history (branch, entry date, separation date, character of discharge)</li>
              <li>Military service number (for veterans who served before July 1972)</li>
              <li>VA file number</li>
              <li>National Guard and Reserve activation periods</li>
            </ul>

            <SubHeading>Education, Employment &amp; Financial</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Education history (schools, degrees, enrollment dates)</li>
              <li>Employment history (employers, job titles, dates)</li>
              <li>Bank account and routing numbers for direct deposit — stored with additional encryption</li>
            </ul>

            <SubHeading>Dependents</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>Dependent name, relationship, date of birth, and SSN — SSN stored with additional encryption</li>
            </ul>

            <SubHeading>Messages &amp; Communications</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li>In-app messages you send to our team, and our replies</li>
              <li>Form submission history (form name, date submitted, and your answers)</li>
            </ul>
          </Section>

          <Section title="How We Use It">
            <p>Your information is used solely to operate this Service. Specifically:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-gray-700">
              <li>To pre-fill the VA forms you request</li>
              <li>To maintain your submission history so you can reference past forms</li>
              <li>
                If you authorize agent filing (see Agent Filing section below), to allow our
                accredited team to review and submit your completed forms to the VA on your behalf
              </li>
              <li>To respond to messages you send us</li>
              <li>To send you transactional notifications related to your form submissions</li>
            </ul>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li>Your data is <strong>never sold</strong> to third parties</li>
              <li>Your data is <strong>not used</strong> for advertising or marketing</li>
              <li>Your data is <strong>not used</strong> to train AI or machine learning models</li>
            </ul>
          </Section>

          <Section title="Agent Filing &amp; Admin Access">
            <p>
              Military Benefits Assistant offers an optional <strong>agent filing service</strong>.
              If you choose to use this service, you authorize our team to act as your accredited VA
              representative and submit your completed forms to the VA directly on your behalf.
            </p>
            <p className="mt-3">
              To authorize agent filing, you must complete{' '}
              <strong>VA Form 21-22A (Appointment of Individual as Claimant&rsquo;s Representative)</strong>.
              By completing that form you are granting our team the legal authority to represent you
              before the VA for the matters specified.
            </p>
            <p className="mt-3">
              When you authorize agent filing, members of our team will access the form submission
              data you have provided in order to review and submit it. This access is limited to the
              specific forms you have authorized for submission. Our team members are bound by the same
              data-use restrictions stated in this policy.
            </p>
            <p className="mt-3">
              Agent filing is entirely <strong>optional</strong>. You may always download your completed
              PDF and submit it yourself without involving our team.
            </p>
          </Section>

          <Section title="How It&apos;s Stored">
            <p>
              Your data is stored on <strong>Supabase</strong> and the application is hosted on{' '}
              <strong>Vercel</strong>.
            </p>

            <SubHeading>Supabase (Database &amp; Authentication)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>AES-256 encryption at rest</strong> — all stored data is encrypted</li>
              <li><strong>TLS in transit</strong> — all data travels over TLS 1.2 / 1.3 (HTTPS)</li>
              <li>
                <strong>Row-Level Security (RLS)</strong> — database rules enforce that you can only
                ever read or write your own data; no other user can access your records
              </li>
              <li>
                <strong>Password hashing</strong> — passwords are hashed with bcrypt and never
                stored in plain text
              </li>
            </ul>

            <SubHeading>Vercel (Application Hosting)</SubHeading>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
              <li><strong>HTTPS everywhere</strong> — all pages and API routes served over encrypted HTTPS</li>
              <li><strong>Global CDN with DDoS protection</strong></li>
            </ul>

            <SubHeading>Additional Encryption for Sensitive Fields</SubHeading>
            <p className="mt-2 text-gray-700">
              Your SSN, bank account / routing numbers, and dependent SSNs receive an additional layer
              of <strong>AES-256-GCM encryption</strong> before the data reaches the database. Even a
              database administrator cannot read these values without the application encryption key.
            </p>

            <SubHeading>PDF Files</SubHeading>
            <p className="mt-2 text-gray-700">
              Completed PDF forms are generated in your browser and downloaded directly to your device.
              We do <strong>not</strong> store the filled PDF file on our servers. We store a record of
              your form answers in your submission history so you can reference them later.
            </p>
          </Section>

          <Section title="Analytics">
            <p>
              We use <strong>Vercel Analytics</strong> to measure aggregate site traffic (page views,
              geographic region, and referring URL). Vercel Analytics does{' '}
              <strong>not use cookies</strong>, does not track individual users across sessions or
              sites, and does not collect any personally identifiable information. It is used solely
              to understand general usage patterns and improve the Service.
            </p>
            <p className="mt-3">
              We do <strong>not</strong> use advertising networks, cross-site tracking pixels, or
              behavioral analytics of any kind.
            </p>
          </Section>

          <Section title="Cookies">
            <p>We use a minimal number of cookies strictly necessary to operate the Service:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-gray-700">
              <li>
                <strong>Authentication cookies</strong> — used to keep you logged in to your account
                (session token set by Supabase Auth)
              </li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> use tracking cookies, advertising cookies, or any
              third-party behavioral cookies.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>You have the right to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-gray-700">
              <li>
                <strong>Access</strong> — view all information stored in your profile at any time
                from your account dashboard
              </li>
              <li>
                <strong>Correct</strong> — update any field in your profile at any time
              </li>
              <li>
                <strong>Delete</strong> — request deletion of your account and all associated data
                by contacting us. We will permanently delete your data within{' '}
                <strong>30 days</strong> of your request.
              </li>
              <li>
                <strong>Export</strong> — contact us to request a copy of all data we hold about you
              </li>
            </ul>
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
