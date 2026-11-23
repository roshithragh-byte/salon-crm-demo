import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Naturals Unisex Salon • Kottakkal',
  description: 'Learn how Naturals Unisex Salon Kottakkal collects, protects, and processes your personal data with editorial transparency and strict privacy standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-taupe)] text-[var(--bg-charcoal)] pb-24 selection:bg-[var(--bg-charcoal)] selection:text-[var(--bg-taupe)] font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-taupe)]/95 backdrop-blur-md border-b border-[var(--border-hairline)] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--bg-charcoal)]/80 hover:text-[var(--bg-charcoal)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bg-charcoal)] border border-[var(--border-hairline)] px-3 py-1 bg-white/40">
            Legal & Compliance
          </span>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="border-b border-[var(--border-hairline)] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 border border-[var(--border-hairline)] bg-white/40 mb-2">
            <ShieldCheck className="w-7 h-7 text-[var(--bg-charcoal)]" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[var(--bg-charcoal)] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-[var(--bg-charcoal)]/85 max-w-2xl mx-auto font-normal leading-relaxed">
            Your trust is our highest priority. Learn how Naturals Unisex Salon Kottakkal safeguards your personal data, appointment details, and digital footprint.
          </p>
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--bg-charcoal)]/70 pt-2">
            Effective Date: October 2026 • Naturals Kottakkal
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-10">
        {/* Section 1 */}
        <section className="border border-[var(--border-hairline)] bg-white/40 p-8 space-y-4">
          <div className="flex items-center gap-3 text-[var(--bg-charcoal)]">
            <FileText className="w-5 h-5 text-[var(--bg-charcoal)]" />
            <h2 className="text-2xl font-serif font-normal tracking-wide">1. Overview & Scope</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--bg-charcoal)]/85 leading-relaxed font-normal">
            This Privacy Policy applies to <strong>Naturals Unisex Salon</strong> (Kottakkal, Kerala, India) and its digital booking systems. It details our procedures regarding the collection, storage, use, and protection of personal data across our public booking portal, client interactions, and in-salon service records.
          </p>
          <p className="text-xs sm:text-sm text-[var(--bg-charcoal)]/85 leading-relaxed font-normal">
            We adhere to the <strong>Digital Personal Data Protection Act, 2023 (DPDPA - India)</strong> and global privacy standards (including <strong>GDPR</strong> principles) to respect your privacy rights and guarantee discreet, dignified data stewardship.
          </p>
        </section>

        {/* Section 2 */}
        <section className="border border-[var(--border-hairline)] bg-white/40 p-8 space-y-4">
          <div className="flex items-center gap-3 text-[var(--bg-charcoal)]">
            <Database className="w-5 h-5 text-[var(--bg-charcoal)]" />
            <h2 className="text-2xl font-serif font-normal tracking-wide">2. Information We Collect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 border border-[var(--border-hairline)] bg-white/60">
              <h3 className="font-bold text-[11px] uppercase tracking-[0.16em] text-[var(--bg-charcoal)] mb-3">
                Directly Provided Information
              </h3>
              <ul className="text-xs text-[var(--bg-charcoal)]/80 space-y-2 list-disc list-inside">
                <li>Full name, mobile number, and email address</li>
                <li>Preferred appointment schedules & treatment notes</li>
                <li>Assigned stylist requests and service add-ons</li>
                <li>Customer feedback, reviews, and satisfaction ratings</li>
              </ul>
            </div>
            <div className="p-5 border border-[var(--border-hairline)] bg-white/60">
              <h3 className="font-bold text-[11px] uppercase tracking-[0.16em] text-[var(--bg-charcoal)] mb-3">
                Automated & Operational Data
              </h3>
              <ul className="text-xs text-[var(--bg-charcoal)]/80 space-y-2 list-disc list-inside">
                <li>Payment transaction IDs & status</li>
                <li>Loyalty points ledger and visit accruals</li>
                <li>Session tokens & encrypted authentication claims</li>
                <li>Audit logs for security and abuse prevention</li>
              </ul>
            </div>
          </div>
          <div className="p-4 border border-[var(--border-hairline)] bg-white/70 text-xs text-[var(--bg-charcoal)] mt-4">
            <strong>Payment Security Note:</strong> We use PCI-DSS certified payment integrations. Credit/debit card numbers, CVVs, and netbanking credentials are never transmitted through or stored on our salon servers.
          </div>
        </section>

        {/* Section 3 */}
        <section className="border border-[var(--border-hairline)] bg-white/40 p-8 space-y-4">
          <div className="flex items-center gap-3 text-[var(--bg-charcoal)]">
            <Lock className="w-5 h-5 text-[var(--bg-charcoal)]" />
            <h2 className="text-2xl font-serif font-normal tracking-wide">3. Technical Safeguards & Data Security</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--bg-charcoal)]/85 leading-relaxed font-normal">
            Our architecture incorporates layered technical safeguards to protect personal data against unauthorized access, loss, or disclosure:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--bg-charcoal)]/85 pt-2">
            <li className="flex items-start gap-2.5 border border-[var(--border-hairline)] bg-white/60 p-4">
              <span className="font-bold text-[var(--bg-charcoal)]">✓</span>
              <span><strong>Cryptographic Signatures:</strong> Verified session tokens with audience and issuer validation.</span>
            </li>
            <li className="flex items-start gap-2.5 border border-[var(--border-hairline)] bg-white/60 p-4">
              <span className="font-bold text-[var(--bg-charcoal)]">✓</span>
              <span><strong>Timing-Safe Verification:</strong> Server-authoritative webhook verification for online reservations.</span>
            </li>
            <li className="flex items-start gap-2.5 border border-[var(--border-hairline)] bg-white/60 p-4">
              <span className="font-bold text-[var(--bg-charcoal)]">✓</span>
              <span><strong>TLS 1.3 & Encrypted Stores:</strong> End-to-end transport security and encrypted database storage.</span>
            </li>
            <li className="flex items-start gap-2.5 border border-[var(--border-hairline)] bg-white/60 p-4">
              <span className="font-bold text-[var(--bg-charcoal)]">✓</span>
              <span><strong>Strict Role Isolation:</strong> Middleware guards ensuring customers and administrative staff only access authorized records.</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="border border-[var(--border-hairline)] bg-white/40 p-8 space-y-4">
          <div className="flex items-center gap-3 text-[var(--bg-charcoal)]">
            <Eye className="w-5 h-5 text-[var(--bg-charcoal)]" />
            <h2 className="text-2xl font-serif font-normal tracking-wide">4. Digital Intelligence & Privacy Boundaries</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--bg-charcoal)]/85 leading-relaxed font-normal">
            Our digital services operate strictly to enhance client booking experience and scheduling convenience:
          </p>
          <ul className="text-xs text-[var(--bg-charcoal)]/80 space-y-2 list-disc list-inside">
            <li>Customer review analysis and quality assurance to maintain salon service standards.</li>
            <li>Real-time slot availability computation preventing double bookings.</li>
            <li>No personal customer records are ever sold, traded, or shared with third-party advertisers.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="border border-[var(--border-hairline)] bg-white/40 p-8 space-y-4">
          <div className="flex items-center gap-3 text-[var(--bg-charcoal)]">
            <UserCheck className="w-5 h-5 text-[var(--bg-charcoal)]" />
            <h2 className="text-2xl font-serif font-normal tracking-wide">5. Your Privacy Rights</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--bg-charcoal)]/85 leading-relaxed font-normal">
            You retain complete control over your personal data. You are entitled to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 border border-[var(--border-hairline)] bg-white/60 text-center">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-[var(--bg-charcoal)] mb-1">Access & Review</h4>
              <p className="text-[11px] text-[var(--bg-charcoal)]/75">Request a copy of your appointment and visit history.</p>
            </div>
            <div className="p-4 border border-[var(--border-hairline)] bg-white/60 text-center">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-[var(--bg-charcoal)] mb-1">Rectification</h4>
              <p className="text-[11px] text-[var(--bg-charcoal)]/75">Correct or update inaccurate contact or profile details.</p>
            </div>
            <div className="p-4 border border-[var(--border-hairline)] bg-white/60 text-center">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-[var(--bg-charcoal)] mb-1">Erasure</h4>
              <p className="text-[11px] text-[var(--bg-charcoal)]/75">Request permanent deletion of your customer profile.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Contact */}
        <section className="bg-[var(--bg-charcoal)] text-[var(--bg-taupe)] p-8 border border-[var(--border-hairline)] space-y-4 shadow-sm">
          <h2 className="text-2xl font-serif font-normal tracking-wide text-white">6. Contact & Privacy Inquiries</h2>
          <p className="text-xs sm:text-sm text-[var(--bg-taupe)]/85 leading-relaxed font-normal">
            For data inquiries, rights requests, or feedback, reach out to our team at Kottakkal:
          </p>
          <div className="text-xs space-y-1.5 text-[var(--bg-taupe)]/90 pt-1">
            <p><strong className="text-white">Studio:</strong> Naturals Unisex Salon Kottakkal</p>
            <p><strong className="text-white">Location:</strong> Kottakkal, Malappuram District, Kerala — 676503</p>
            <p><strong className="text-white">Telephone / WhatsApp:</strong> +91 87142 29297 / +91 99954 89894</p>
            <p><strong className="text-white">Email:</strong> <a href="mailto:care@naturalssalon.com" className="underline hover:text-white">care@naturalssalon.com</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
