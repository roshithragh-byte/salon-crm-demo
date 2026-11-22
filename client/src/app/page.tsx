import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Star,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Award,
  Heart,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Gallery from "@/components/Gallery";

const businessConfig = {
  name: "Natural's Salon",
  phone: "+91 87142 29297",
  whatsapp: "+91 87142 29297",
  email: "hello@naturalssalon.com",
  address: {
    street: "1st Floor, Al Wahad Complex, Changuvetty",
    landmark: "Opposite PWD Rest House",
    city: "Kottakkal",
    district: "Malappuram",
    state: "Kerala",
    postalCode: "676501",
    country: "IN",
  },
  geo: {
    latitude: 10.99497357,
    longitude: 75.9923958,
  },
  hours: {
    weekdays: "10:00 AM - 9:00 PM",
    weekends: "09:00 AM - 9:00 PM",
  },
  social: {
    instagram: "https://www.instagram.com/naturals_kottakkal/?hl=en",
    facebook: "https://www.facebook.com/naturalskottakkal07/",
  },
  maps: "https://maps.google.com/?q=10.99497357,75.9923958",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-[#5E127E]/10 selection:text-[#5E127E]">
      {/* ── TOP UTILITY NOTIFICATION BAR ── */}
      <div className="bg-[#230B29] text-[#FAFAF8] text-xs py-2.5 px-4 text-center tracking-wider font-light border-b border-[#3D1947]/40 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Experience India&apos;s No.1 Hair &amp; Beauty Destination in Kottakkal • Open 7 Days</span>
        <span className="hidden sm:inline text-white/30">•</span>
        <a
          href={`tel:${businessConfig.phone}`}
          className="hidden sm:inline font-medium text-[#D4AF37] hover:underline"
        >
          Call {businessConfig.phone}
        </a>
      </div>

      {/* ── STICKY GLASS HEADER ── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#EFECE6] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-40 h-11 flex items-center">
              <Image
                src="/logo-horizontal-purple.png"
                alt="Natural's Salon Kottakkal"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-xs font-semibold uppercase tracking-widest text-[#615668]">
            <a href="#services" className="hover:text-[#5E127E] transition-colors">Treatments</a>
            <a href="#ethos" className="hover:text-[#5E127E] transition-colors">The Experience</a>
            <a href="#gallery" className="hover:text-[#5E127E] transition-colors">Portfolio</a>
            <a href="#location" className="hover:text-[#5E127E] transition-colors">Salon &amp; Hours</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/account"
              className="hidden lg:inline-flex text-xs font-semibold uppercase tracking-wider text-[#615668] hover:text-[#5E127E] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/appointments"
              className="bg-[#5E127E] hover:bg-[#4D0F68] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-[#5E127E]/20 hover:shadow-lg active:scale-95"
            >
              Reserve Visit
            </Link>
          </div>
        </div>
      </header>

      {/* ── EDITORIAL LUXURY HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8FC] via-[#FAFAF8] to-[#FAFAF8] pt-16 pb-24 md:pt-24 md:pb-32 border-b border-[#EFECE6]">
        {/* Subtle decorative background blurbs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#F3E8F6] rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#EFECE6] shadow-sm text-xs text-[#615668]">
            <div className="flex items-center text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
              ))}
            </div>
            <span className="font-semibold text-[#1E1822]">4.9 / 5.0</span>
            <span className="text-[#615668]/60">•</span>
            <span>Kottakkal&apos;s Preferred Luxury Salon</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-[#230B29] tracking-tight leading-[1.12]">
            Hair Couture &amp; Botanical Beauty,{" "}
            <span className="italic text-[#5E127E] font-normal block mt-1 md:mt-2">
              Crafted in Kottakkal.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#615668] max-w-2xl mx-auto font-light leading-relaxed">
            Personalised styling, master colour artistry, rejuvenating skincare rituals,
            and complete bridal bespoke care by certified beauty therapists.
          </p>

          {/* Primary Action Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/appointments"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#5E127E] hover:bg-[#4D0F68] text-white px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all shadow-lg shadow-[#5E127E]/25 hover:shadow-xl active:scale-95"
            >
              <span>Book Appointment Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8FC] text-[#230B29] border border-[#EFECE6] px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all shadow-sm hover:shadow"
            >
              <span>Explore Treatments</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-[#EFECE6]">
            <div>
              <div className="text-2xl font-serif font-semibold text-[#230B29]">20+ Years</div>
              <div className="text-xs text-[#615668] mt-0.5">Brand Heritage</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-semibold text-[#230B29]">100%</div>
              <div className="text-xs text-[#615668] mt-0.5">Authentic Products</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-semibold text-[#230B29]">Master</div>
              <div className="text-xs text-[#615668] mt-0.5">Certified Stylists</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-semibold text-[#230B29]">7 Days</div>
              <div className="text-xs text-[#615668] mt-0.5">Open 10 AM - 9 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURATED SERVICE CATEGORIES ── */}
      <section id="services" className="px-6 py-24 md:py-32 bg-[#FAFAF8] border-b border-[#EFECE6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#5E127E]">
              The Rituals &amp; Menu
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#230B29] tracking-tight">
              Tailored Treatments for Hair, Skin &amp; Special Occasions
            </h2>
            <p className="text-sm md:text-base text-[#615668] font-light leading-relaxed">
              Every appointment begins with an in-depth consultation to determine the ideal formulations for your unique hair texture and skin vitality.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Hair Couture",
                subtitle: "Precision cuts, blowouts, balayage, keratin smoothing, and deep scalp therapies.",
                icon: "✂",
                popular: "Precision Cut & Blowout",
                tag: "Most Requested",
              },
              {
                title: "Skin Vitality",
                subtitle: "Custom hydra facials, brightening cleanups, de-tan therapies, and organic peels.",
                icon: "✨",
                popular: "Hydra Renewal Facial",
                tag: "Skin Ritual",
              },
              {
                title: "Bespoke Bridal",
                subtitle: "Complete pre-bridal care, master HD makeup, saree draping, and styling.",
                icon: "👑",
                popular: "Signature Bridal Suite",
                tag: "Bridal Couture",
              },
              {
                title: "Wellness & Spa",
                subtitle: "Spa manicures, pedicures, therapeutic head massages, and reflexology.",
                icon: "🌿",
                popular: "Botanical Spa Pedicure",
                tag: "Relaxation",
              },
            ].map((cat, i) => (
              <div
                key={i}
                className="group relative bg-white p-8 rounded-3xl border border-[#EFECE6] shadow-sm hover:shadow-xl hover:border-[#5E127E]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-[#F3E8F6] text-[#5E127E] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E127E] bg-[#F3E8F6] px-2.5 py-1 rounded-full">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-semibold text-[#230B29] mb-2 group-hover:text-[#5E127E] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#615668] leading-relaxed mb-6">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1E1822]">{cat.popular}</span>
                  <Link
                    href="/appointments"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#5E127E] hover:underline"
                  >
                    <span>Reserve</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5E127E] hover:text-[#4D0F68] transition-colors bg-[#F3E8F6] px-6 py-3 rounded-full hover:bg-[#EBD8EF]"
            >
              <span>View Full Service Catalogue &amp; Pricing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE EXPERIENCE / ETHOS SECTION ── */}
      <section id="ethos" className="bg-white text-[#1E1822] px-6 py-24 md:py-32 border-b border-[#EFECE6]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#5E127E]">
              The Naturals Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#230B29] leading-[1.18] tracking-tight">
              A Sanctuary of Rejuvenation,{" "}
              <span className="italic text-[#5E127E] font-normal block mt-1">
                Designed for You.
              </span>
            </h2>
            <div className="space-y-4 text-[#615668] text-sm md:text-base leading-relaxed font-light">
              <p>
                Located at Al Wahad Complex in Changuvetty, Kottakkal, our salon is thoughtfully engineered to deliver a calming escape from daily busyness.
              </p>
              <p>
                Whether you visit us for a maintenance blowout or an elaborate bridal suite transformation, you receive attentive care from artists trained in international techniques and equipped with leading dermatological formulations.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-[#230B29] font-medium bg-[#FAFAF8] border border-[#EFECE6] px-4 py-2.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#5E127E]" />
                <span>Hospital-Grade Sanitization</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#230B29] font-medium bg-[#FAFAF8] border border-[#EFECE6] px-4 py-2.5 rounded-full">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Certified Colorists</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Certified Master Stylists",
                desc: "Continually trained in the latest international cuts, balayage, and styling techniques.",
                icon: Award,
              },
              {
                title: "Curated Formulations",
                desc: "Strictly authentic, salon-exclusive products gentle on scalp, hair, and delicate skin.",
                icon: Sparkles,
              },
              {
                title: "Personalized Consultation",
                desc: "Every appointment begins with tailored recommendations matching your lifestyle.",
                icon: Heart,
              },
              {
                title: "Serene Private Suites",
                desc: "Hygienic, private aesthetic rooms ensuring peaceful comfort throughout your treatment.",
                icon: CheckCircle2,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#FAFAF8] p-6 rounded-2xl border border-[#EFECE6] hover:border-[#5E127E]/30 transition-all space-y-3"
              >
                <item.icon className="w-5 h-5 text-[#5E127E]" />
                <h3 className="font-serif font-semibold text-base text-[#230B29]">{item.title}</h3>
                <p className="text-xs text-[#615668] leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT ARTISTRY PORTFOLIO & REELS ── */}
      <Gallery />

      {/* ── LOCATION, HOURS & CONTACT CARD ── */}
      <section id="location" className="px-6 py-24 md:py-32 bg-[#FAFAF8] border-b border-[#EFECE6]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#230B29] text-[#FAFAF8] rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#5E127E]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Visit Our Salon in Kottakkal
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium leading-tight">
                  Step In &amp; Relax. We&apos;re Ready to Welcome You.
                </h2>
                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-xl">
                  Centrally located at Al Wahad Complex, Changuvetty (opposite PWD Rest House) with convenient parking and accessibility.
                </p>

                <div className="pt-2 grid sm:grid-cols-2 gap-6 text-sm text-white/80">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>Business Hours</span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/70">
                      Weekdays: {businessConfig.hours.weekdays}<br />
                      Weekends: {businessConfig.hours.weekends}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs uppercase tracking-wider">
                      <Phone className="w-4 h-4" />
                      <span>Direct Contact</span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/70">
                      Appointments: <a href={`tel:${businessConfig.phone}`} className="hover:text-white underline">{businessConfig.phone}</a><br />
                      WhatsApp: <a href={`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">{businessConfig.whatsapp}</a>
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    href="/appointments"
                    className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#230B29] px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    <span>Reserve Online</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={businessConfig.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border border-white/20"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#371540] p-8 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif font-semibold text-base text-white">Natural&apos;s Salon Kottakkal</h3>
                    <p className="text-xs text-white/70 mt-1 leading-relaxed">
                      {businessConfig.address.street}<br />
                      {businessConfig.address.landmark}<br />
                      {businessConfig.address.city}, {businessConfig.address.state} — {businessConfig.address.postalCode}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 text-xs text-white/60">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  <span>Open today until 9:00 PM • Valet / Easy Parking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#150619] text-[#FAFAF8] pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5 space-y-6">
            <div className="relative w-44 h-12">
              <Image
                src="/logo-white.svg"
                alt="Natural's Salon Kottakkal"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-white/60 text-xs sm:text-sm font-light max-w-sm leading-relaxed">
              India&apos;s No.1 Hair &amp; Beauty Salon franchise at Kottakkal. Dedicated to elevated hair couture, rejuvenating skincare, and radiant bridal experiences.
            </p>
            <div className="flex gap-4 items-center">
              <a
                href={businessConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#5E127E] flex items-center justify-center transition-colors text-white/80 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={businessConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#5E127E] flex items-center justify-center transition-colors text-white/80 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-4">
              <span className="font-semibold uppercase tracking-wider text-[#D4AF37] block">Services</span>
              <ul className="space-y-2.5 text-white/60">
                <li><Link href="/appointments" className="hover:text-white transition-colors">Hair Styling</Link></li>
                <li><Link href="/appointments" className="hover:text-white transition-colors">Colour &amp; Highlights</Link></li>
                <li><Link href="/appointments" className="hover:text-white transition-colors">Hydra Facial</Link></li>
                <li><Link href="/appointments" className="hover:text-white transition-colors">Bridal Makeover</Link></li>
                <li><Link href="/appointments" className="hover:text-white transition-colors">Pedicure &amp; Spa</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <span className="font-semibold uppercase tracking-wider text-[#D4AF37] block">Client Links</span>
              <ul className="space-y-2.5 text-white/60">
                <li><Link href="/appointments" className="hover:text-white transition-colors">Book Online</Link></li>
                <li><Link href="/account" className="hover:text-white transition-colors">Client Account</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/admin/login" className="hover:text-white transition-colors">Staff Portal</Link></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <span className="font-semibold uppercase tracking-wider text-[#D4AF37] block">Location</span>
              <p className="text-white/60 leading-relaxed">
                Al Wahad Complex, Changuvetty, Kottakkal, Kerala 676501
              </p>
              <p className="text-[#D4AF37] font-medium pt-1">
                {businessConfig.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {businessConfig.name} Kottakkal. All rights reserved.</p>
          <p>Crafted for Luxury Wellness &amp; Salon Experience.</p>
        </div>
      </footer>

      {/* ── STICKY MOBILE RESERVATION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-lg md:hidden flex gap-2 z-50">
        <a
          href={`tel:${businessConfig.phone}`}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FAFAF8] border border-[#EFECE6] text-[#230B29] shrink-0"
          aria-label="Call salon"
        >
          <Phone className="w-4 h-4" />
        </a>
        <Link
          href="/appointments"
          className="flex-1 bg-[#5E127E] hover:bg-[#4D0F68] text-white rounded-full font-semibold text-xs tracking-wider uppercase py-3.5 text-center flex items-center justify-center gap-2 shadow-md"
        >
          <span>Book Appointment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </main>
  );
}
