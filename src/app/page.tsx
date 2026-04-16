import Link from 'next/link';
import Image from 'next/image';
import { FileText, UserCheck, Zap } from 'lucide-react';

const forms = [
  { number: '22-1990', title: 'Application for VA Education Benefits' },
  { number: '22-1990e', title: 'Family Member Transfer of Benefits' },
  { number: '22-1990t', title: 'Application for Tutorial Assistance' },
  { number: '22-1995', title: 'Change of Program or Place of Training' },
  { number: '22-0803', title: 'Licensing/Certification Test Reimbursement' },
  { number: '22-0810', title: 'National Exam Reimbursement' },
  { number: '22-5281', title: 'VEAP Refund Application' },
  { number: '22-5490', title: "Dependents' Application for Education Benefits" },
  { number: '22-5495', title: "Dependents' Change of Program" },
  { number: '22-8691', title: 'Work-Study Allowance Application' },
  { number: '28-1900', title: 'Disabled Veterans Application for VR&E' },
  { number: '22-1999c', title: 'Correspondence Course Enrollment Affirmation' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex justify-center mb-6">
            <Image src="/seal.png" alt="Military Benefits Assistant Seal" width={120} height={120} className="rounded-full" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Take Control of Your<br />
            <span className="text-blue-400">VA Education Benefits</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Save your profile once, then auto-fill and download VA education benefit forms
            with the click of a button. No more filling out the same information over and over.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <UserCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Your Profile</h3>
              <p className="text-gray-600">
                Enter your personal, military service, and education information once.
                Your data is encrypted and securely stored.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Auto-Fill</h3>
              <p className="text-gray-600">
                When you select a form, we pre-fill everything we can from your profile.
                You only answer questions for fields we don&apos;t have yet.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-700 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Download Filled PDFs</h3>
              <p className="text-gray-600">
                Generate official VA PDF forms with your information already filled in.
                Print, sign, and submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Forms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">12 VA Forms Supported</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We support the most commonly used VA education benefit forms. Select any form,
            complete a guided interview, and download your filled PDF.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map(f => (
              <div key={f.number} className="flex items-start gap-3 bg-white rounded-lg border p-4">
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded shrink-0">
                  {f.number}
                </span>
                <span className="text-sm text-gray-800">{f.title}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/signup"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
