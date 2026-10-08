import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Natural\'s Salon Kottakkal',
  description: 'Learn how Natural\'s Salon Kottakkal and PilotWave collect, protect, and process your personal data in compliance with DPDPA and global standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Legal & Compliance
          </span>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-white border-b border-slate-200 py-16 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-purple-50 text-purple-900 rounded-2xl mb-6">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-purple-950 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Your trust is our highest priority. Learn how Natural&apos;s Salon Kottakkal and PilotWave safeguard your personal data, appointment details, and digital footprint.
          </p>
          <div className="mt-6 text-xs text-slate-400">
            Effective Date: October 8, 2026 • Last Updated: October 8, 2026
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
        {/* Section 1 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-purple-950">
            <FileText className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-serif font-bold">1. Overview & Scope</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This Privacy Policy applies to <strong>Natural&apos;s Salon</strong> (Kottakkal, Kerala, India) and the underlying <strong>PilotWave Salon Management Platform</strong>. It details our procedures regarding the collection, storage, use, and protection of personal data across our public booking wizard, client portals, and administrative operations.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We adhere to the <strong>Digital Personal Data Protection Act, 2023 (DPDPA - India)</strong> and recognized international standards (including <strong>GDPR</strong> principles) to respect your privacy rights.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-purple-950">
            <Database className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-serif font-bold">2. Information We Collect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h3 className="font-bold text-purple-950 mb-2">Directly Provided Information</h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>Full name, mobile number, and email address</li>
                <li>Preferred appointment schedules & treatment notes</li>
                <li>Assigned stylist requests and service add-ons</li>
                <li>Customer feedback, reviews, and satisfaction ratings</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h3 className="font-bold text-purple-950 mb-2">Automated & Operational Data</h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>Payment transaction IDs & status (via Razorpay)</li>
                <li>Loyalty points ledger and accrual transactions</li>
                <li>Session tokens & encrypted authentication claims</li>
                <li>Audit logs for security and fraud prevention</li>
              </ul>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl text-xs text-purple-950 border border-purple-100 mt-4">
            <strong>Payment Security Note:</strong> We use PCI-DSS Level 1 certified payment gateways. Credit/debit card numbers, CVVs, and banking credentials are never transmitted through or stored on our servers.
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-purple-950">
            <Lock className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-serif font-bold">3. Technical Safeguards & Data Security</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            PilotWave implements robust architectural safeguards to protect personal data against unauthorized access, loss, or disclosure:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 pt-2">
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-amber-500 font-bold">✓</span>
              <span><strong>Canonical HS256 JWT:</strong> Cryptographically verified session signatures with strict audience and issuer validation.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-amber-500 font-bold">✓</span>
              <span><strong>HMAC-SHA256 Webhooks:</strong> Server-authoritative timing-safe signature verification for all payment events.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-amber-500 font-bold">✓</span>
              <span><strong>TLS 1.3 & AES-256:</strong> Complete encryption in transit and at rest across database clusters.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-amber-500 font-bold">✓</span>
              <span><strong>Role & Tenant Isolation:</strong> Strict database queries and middleware guards preventing cross-tenant access.</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-purple-950">
            <Eye className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-serif font-bold">4. AI Intelligence & Privacy Boundaries</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Our platform incorporates TypeSafe AI modules strictly to enhance client experience and scheduling efficiency:
          </p>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>Customer review sentiment scoring and topic categorization for quality assurance.</li>
            <li>Predictive staff-matching based on service specialization.</li>
            <li>No personal customer records are ever used to train public LLMs or sold to third-party advertisers.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-purple-950">
            <UserCheck className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-serif font-bold">5. Your Privacy Rights</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            You retain complete control over your personal data. You are entitled to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <h4 className="font-bold text-purple-950 mb-1">Access & Review</h4>
              <p className="text-xs text-slate-500">Request a copy of your appointment and profile history.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <h4 className="font-bold text-purple-950 mb-1">Rectification</h4>
              <p className="text-xs text-slate-500">Correct or update inaccurate contact or profile details.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <h4 className="font-bold text-purple-950 mb-1">Erasure</h4>
              <p className="text-xs text-slate-500">Request permanent deletion of your customer profile.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Contact */}
        <section className="bg-purple-950 text-white p-8 rounded-2xl shadow-md space-y-4">
          <h2 className="text-2xl font-serif font-bold text-amber-300">6. Contact & Grievance Redressal</h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            For data inquiries, rights requests, or grievances, reach out to our dedicated privacy office:
          </p>
          <div className="text-sm space-y-1 text-purple-100">
            <p><strong>Data Protection Officer:</strong> Compliance & Privacy Desk</p>
            <p><strong>Studio:</strong> Natural&apos;s Salon / PilotWave Platform</p>
            <p><strong>Location:</strong> Kottakkal, Malappuram, Kerala, India — 676501</p>
            <p><strong>Email:</strong> <a href="mailto:privacy@naturalssalon.com" className="text-amber-400 underline">privacy@naturalssalon.com</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
