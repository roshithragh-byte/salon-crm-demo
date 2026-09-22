import { ServicesApi } from '@/lib/api/services';
import Link from "next/link";
import { businessConfig } from "@/business.config";

import { MapPin, Phone, Clock, Globe } from "lucide-react";
import Gallery from "@/components/Gallery";
import ReviewCarousel from "@/components/ReviewCarousel";

export const dynamic = 'force-dynamic';

interface ServiceCard {
  id: string;
  name: string;
  description?: string | null;
  basePrice?: number | null;
  durationMinutes?: number | null;
  isPackage?: boolean | null;
  featured?: boolean | null;
}

async function getHomePageData() {
  try {
    const json: any = await ServicesApi.getHomeData();
    return json.data;
  } catch (e) {
    console.error(e);
  }
  return { packages: [], standardServices: [], reviews: [] };
}
export default async function Home() {
  const { packages, standardServices, reviews } = await getHomePageData();

  const renderServiceCard = (svc: ServiceCard) => (
    <div
      key={svc.id}
      className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-100 transition-all duration-200 flex flex-col"
    >
      {svc.featured && (
        <div className="mb-3">
          <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5">
            {svc.isPackage ? "Signature Experience" : "Featured"}
          </span>
        </div>
      )}
      <h3 className="font-bold text-lg text-purple-900 mb-1 group-hover:text-purple-700 transition-colors">
        {svc.name}
      </h3>
      <p className="text-slate-500 text-sm mb-4 line-clamp-3">
        {svc.description ?? "Premium treatment tailored just for you."}
      </p>
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
        <div className="text-sm text-slate-500 space-x-2">
          {svc.durationMinutes && <span>{svc.durationMinutes} mins</span>}
          {svc.basePrice != null && svc.basePrice > 0 && (
            <span className="font-semibold text-slate-700">
              {}
              {`₹${svc.basePrice}`}
            </span>
          )}
        </div>
        <Link
          href={`/catalogue/${svc.id}`}
          className="text-amber-600 font-semibold text-sm hover:text-amber-500 transition-colors"
        >
          View &rarr;
        </Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex justify-between items-center shadow-sm">
        <div className="font-serif font-bold text-xl tracking-wide text-purple-900">
          {businessConfig.name}
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#packages" className="hover:text-purple-900 transition-colors">The Experience</a>
          <a href="#services" className="hover:text-purple-900 transition-colors">Treatments</a>
          <a href="#about" className="hover:text-purple-900 transition-colors">About</a>
          <a href="#reviews" className="hover:text-purple-900 transition-colors">Reviews</a>
          <a href="#contact" className="hover:text-purple-900 transition-colors">Contact</a>
        </nav>
        <div className="flex gap-4 items-center">
          <Link
            href="/account"
            className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-purple-900 transition-colors"
          >
            Account
          </Link>
          <Link
            href="/appointments"
            className="hidden md:inline-flex bg-amber-400 text-purple-950 font-bold text-sm py-2 px-5 rounded-lg shadow hover:bg-amber-300 transition-colors text-center"
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative px-4 py-20 md:py:36 flex flex-col items-center text-center bg-purple-950 text-white overflow-hidden">
        {/* subtle decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-800/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl" />

        <span className="relative mb-4 inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1">
          Kottakkal&#x27;s Luxury Studio
        </span>
        <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-5 leading-tight max-w-3xl">
          Unveil Your<br className="md:hidden" />{" "}
          <span className="text-amber-400">True Radiance</span>
        </h1>
        <p className="relative text-lg md:text-xl text-purple-100 max-w-2xl mb-10">
          An independent luxury salon & wellness studio — where every treatment
          is crafted around you.
        </p>
        <div className="relative flex flex-col w-full sm:flex-row sm:w-auto gap-4">
          <Link
            href="/appointments"
            id="hero-book-btn"
            className="bg-amber-400 text-purple-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-amber-300 transition-colors text-center"
          >
            Book Appointment
          </Link>
          <a
            href={`https://wa.me/${businessConfig.whatsapp.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-whatsapp-btn"
            className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white/10 transition-colors text-center"
          >
            WhatsApp Us
          </a>
        </div>
      </section>

      {/* ── PACKAGES (REVENUE TIER 4/5) ── */}
      {packages.length > 0 && (
        <section id="packages" className="px-4 py-16 max-w-5xl mx-auto border-b border-slate-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-purple-950 mb-2">The Complete Experience</h2>
            <p className="text-slate-500">Curated transformations offering unparalleled value and comprehensive care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(renderServiceCard)}
          </div>
        </section>
      )}

      {/* ── SERVICES (REVENUE TIER 1-3) ── */}
      <section id="services" className="px-4 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-purple-950 mb-2">Core Treatments</h2>
          <p className="text-slate-500">Essential services for your regular maintenance.</p>
        </div>
        {standardServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardServices.map(renderServiceCard)}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-4">Services coming soon.</p>
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            href="/appointments"
            className="inline-block bg-purple-950 text-white font-medium py-3 px-8 rounded-lg hover:bg-purple-800 transition-colors shadow-sm"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="bg-purple-950 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 block">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-5 leading-tight">
              A Space Built for <span className="text-amber-400">You</span>
            </h2>
            <p className="text-purple-200 leading-relaxed mb-4">
              Nestled in the heart of Kottakkal, we are an independent luxury
              wellness studio dedicated to making every guest feel genuinely
              seen, cared for, and transformed.
            </p>
            <p className="text-purple-200 leading-relaxed">
              From precision-led skincare to bespoke grooming rituals, our
              therapists blend science with artistry — giving you results that
              last well beyond your visit.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Expert Therapists", value: "Certified & experienced" },
              { label: "Premium Products", value: "Luxury skincare brands" },
              { label: "Personalised Care", value: "Every session is bespoke" },
              { label: "Relaxed Ambiance", value: "Private, serene setting" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 bg-white/5 rounded-xl px-5 py-4 border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                <div>
                  <div className="font-semibold text-white">{item.label}</div>
                  <div className="text-sm text-purple-300">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      {reviews.length > 0 && (
        <section id="reviews" className="px-4 py-24 bg-white">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-purple-950 mb-4">What Clients Say</h2>
              <div className="w-24 h-1 bg-amber-200 mx-auto rounded-full mb-6" />
              <p className="text-slate-500 max-w-2xl mx-auto">Genuine stories from people who trust us, sourced directly from Google Reviews.</p>
            </div>
            <ReviewCarousel reviews={reviews} />
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <Gallery />

      {/* ── CONTACT ── */}
      <section id="contact" className="bg-slate-100 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-purple-950 mb-2">Find Us</h2>
            <p className="text-slate-500">We&#x27;d love to have you visit.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-5">
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-purple-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Address</div>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {businessConfig.address.street},{" "}
                    {businessConfig.address.landmark},{" "}
                    {businessConfig.address.city},{" "}
                    {businessConfig.address.district},{" "}
                    {businessConfig.address.state} –{" "}
                    {businessConfig.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Phone className="w-5 h-5 text-purple-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Phone</div>
                  <a
                    href={`tel:${businessConfig.phone}`}
                    className="text-slate-500 text-sm hover:text-purple-700 transition-colors"
                  >
                    {businessConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Clock className="w-5 h-5 text-purple-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Hours</div>
                  <p className="text-slate-500 text-sm">
                    Mon – Fri: {businessConfig.hours.weekdays}
                  </p>
                  <p className="text-slate-500 text-sm">
                    Sat – Sun: {businessConfig.hours.weekends}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={businessConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-lg border border-slate-200 hover:border-purple-300 hover:text-purple-700 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
                <a
                  href={businessConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-lg border border-slate-200 hover:border-purple-300 hover:text-purple-700 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Map & CTA */}
            <div className="flex flex-col gap-4">
              <a
                href={businessConfig.maps}
                target="_blank"
                rel="noopener noreferrer"
                id="google-maps-link"
                className="flex-1 flex items-center justify-center bg-purple-950 text-white rounded-2xl p-8 hover:bg-purple-800 transition-colors shadow-sm group"
              >
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-lg">Open in Google Maps</div>
                  <div className="text-purple-300 text-sm mt-1">Get directions</div>
                </div>
              </a>
              <Link
                href="/appointments"
                id="contact-book-btn"
                className="flex items-center justify-center gap-2 bg-amber-400 text-purple-950 font-bold py-4 rounded-2xl hover:bg-amber-300 transition-colors shadow-sm text-center"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden flex gap-3 z-50">
        <Link
          href="/appointments"
          id="mobile-book-btn"
          className="flex-1 bg-purple-950 text-white font-medium py-3 rounded-lg text-sm text-center"
        >
          Book
        </Link>
        <a
          href={`tel:${businessConfig.phone}`}
          id="mobile-call-btn"
          className="flex-1 bg-slate-100 text-purple-950 font-medium py-3 rounded-lg text-sm text-center border border-slate-200"
        >
          Call
        </a>
      </div>
    </main>
  );
}
