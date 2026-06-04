import Link from 'next/link';
import Image from 'next/image';
import { FileText, UserCheck, Send, Shield, Lock, Database, EyeOff, Mail } from 'lucide-react';

const forms = [
  { number: '22-1990',  title: 'Application for VA Education Benefits' },
  { number: '22-1990e', title: 'Family Member Transfer of Benefits' },
  { number: '22-1990t', title: 'Application for Tutorial Assistance' },
  { number: '22-1995',  title: 'Change of Program or Place of Training' },
  { number: '22-0803',  title: 'Licensing/Certification Test Reimbursement' },
  { number: '22-0810',  title: 'National Exam Reimbursement' },
  { number: '22-5281',  title: 'VEAP Refund Application' },
  { number: '22-5490',  title: "Dependents' Application for Education Benefits" },
  { number: '22-5495',  title: "Dependents' Change of Program" },
  { number: '22-8691',  title: 'Work-Study Allowance Application' },
  { number: '28-1900',  title: 'Disabled Veterans Application for VR&E' },
  { number: '22-1999c', title: 'Correspondence Course Enrollment Affirmation' },
  { number: '10-10EZ',  title: 'Application for VA Health Care' },
  { number: '26-1880',  title: 'Request for Certificate of Eligibility (Home Loan)' },
  { number: '21-22A',   title: 'Appointment of Individual as Claimant\'s Representative' },
];

export default function Home() {
  return (
    <div>
      {/* Stats bar */}
      <div className="bg-slate-800 text-gray-300 text-xs text-center py-2 px-4">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>15 VA Forms Supported</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span>Free to Use</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span>Secure &amp; Private</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span>Veteran-Focused</span>
        </span>
      </div>

      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/seal.png"
              alt="Military Benefits Assistant"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Accessing your benefits has<br className="hidden sm:block" /> never been easier.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Answer a few questions and we will handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Get Started Free
            </Link>
            <a
              href="#forms"
              className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              See Supported Forms
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <UserCheck className="h-8 w-8" />
              </div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Step 1</div>
              <h3 className="text-xl font-semibold mb-2">Complete your profile once</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your personal info, military service history, and education details one time.
                Your data is encrypted and stored securely.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Step 2</div>
              <h3 className="text-xl font-semibold mb-2">Pick your form</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Select from 15 supported VA forms. We pre-fill everything we can from your profile
                so you only answer what&apos;s new.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-700 mb-4">
                <Send className="h-8 w-8" />
              </div>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Step 3</div>
              <h3 className="text-xl font-semibold mb-2">Download or let us mail it</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Download your filled PDF to print and submit yourself, or let us do the legwork for you —
                we will print, sign as your agent, and mail it to the correct VA Regional Processing Office.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why MBA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Military Benefits Assistant?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 mb-4">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No More Re-entering Data</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your profile auto-populates every form. Name, SSN, address, service history —
                entered once, used every time.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Will Do the Legwork For You</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We print your completed form, sign it as your authorized agent, and mail
                it directly to the correct VA Regional Processing Office.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-700 mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">15 Forms, One Account</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All major VA education benefit forms in one place. Switch between forms without
                re-entering your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security trust */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Your data is safe with us</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto text-sm">
            We handle sensitive veteran data with the highest security standards available.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-slate-50">
              <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">AES-256 Encryption</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  All stored data is encrypted at rest using AES-256. Sensitive fields like SSN and
                  bank details receive an additional AES-256-GCM encryption layer before reaching the database.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-slate-50">
              <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">SOC 2 Certified Infrastructure</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Hosted on Vercel and Supabase, both independently audited and SOC 2 Type II certified
                  for security, availability, and confidentiality.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-slate-50">
              <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Row-Level Security</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Database-level rules enforce that you can only ever read or write your own data.
                  No other user — or admin — can access your records.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-slate-50">
              <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700">
                <EyeOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Zero Data Sharing</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Your data is never sold, shared with third parties, used for advertising,
                  or used to train AI models. Full stop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported forms */}
      <section id="forms" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">15 Supported VA Forms</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto text-sm">
            Major VA education, health care, and home loan benefit forms — all in one place.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map(f => (
              <div key={f.number} className="flex items-start gap-3 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <span className="shrink-0 text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {f.number}
                </span>
                <span className="text-sm text-gray-800 leading-snug">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-300 mb-8 text-lg">Create your free account in under a minute.</p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
