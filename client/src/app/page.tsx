import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Phone, CheckCircle2 } from "lucide-react";
import Gallery from "@/components/Gallery";

const businessConfig = {
  name: "Natural's Salon",
  phone: "+91 87142 29297",
  email: "hello@naturalssalon.com",
  address: {
    street: "1st Floor, Al Wahad Complex, Changuvetty",
    landmark: "Opposite PWD Rest House",
    city: "Kottakkal",
    district: "Malappuram",
    state: "Kerala",
    postalCode: "676501",
  },
  hours: {
    weekdays: "10:00 AM - 9:00 PM",
    weekends: "09:00 AM - 9:00 PM",
  },
  social: {
    instagram: "https://www.instagram.com/naturals_kottakkal/?hl=en",
    facebook: "https://www.facebook.com/naturalskottakkal07/",
  },
  maps: "https://maps.google.com/?q=Kottakkal",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-ring/30 selection:text-primary">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-40 h-12 overflow-hidden flex items-center">
              <Image
                src="/logo-white.svg"
                alt="Natural's Salon Kottakkal"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-white/80 tracking-wide uppercase">
            <a href="#about" className="hover:text-ring transition-colors">Our Story</a>
            <a href="#services" className="hover:text-ring transition-colors">Services</a>
            <a href="#gallery" className="hover:text-ring transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-ring transition-colors">Visit Us</a>
          </nav>
          <div className="flex items-center gap-6">
            <a href={`tel:${businessConfig.phone}`} className="hidden lg:block text-sm font-medium text-white/80 hover:text-ring transition-colors tracking-widest">
              {businessConfig.phone}
            </a>
            <Link
              href="/appointments"
              className="bg-ring text-primary px-6 py-2.5 rounded-none text-sm font-medium hover:bg-white hover:text-black transition-all tracking-widest uppercase"
            >
              Book Now
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] md:min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-[#2E1033] text-white pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#230E28] via-[#2E1033] to-[#2E1033] opacity-95" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          {/* 1. Naturals Logo */}
          <div className="relative w-80 h-40 md:w-96 md:h-48 mb-8 flex items-center justify-center">
            <Image
              src="/logo-white.svg"
              alt="Natural's Salon - India's No.1 Hair & Beauty Salon • Kottakkal"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* 2. Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/appointments"
              className="w-full sm:w-auto bg-[#681A8C] hover:bg-[#7D22A7] text-white px-8 py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all shadow-lg shadow-[#681A8C]/30 active:scale-95"
            >
              Book an appointment
            </Link>
            <a
              href="#services"
              className="w-full sm:w-auto bg-white text-[#2E1033] hover:bg-[#FBF9FC] px-8 py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all shadow-md active:scale-95"
            >
              Explore services
            </a>
          </div>
        </div>
      </section>

      {/* ── CURATED SERVICE CATEGORIES ── */}
      <section id="services" className="px-6 py-24 bg-[#FBF9FC]">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Hair",
                subtitle: "Cut • Style • Colour",
                category: "hair",
              },
              {
                title: "Skin",
                subtitle: "Facials • Cleanup • Care",
                category: "skin",
              },
              {
                title: "Beauty",
                subtitle: "Makeup • Nails • Brows",
                category: "beauty",
              },
              {
                title: "Packages",
                subtitle: "Curated experiences",
                category: "packages",
              },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-[#EADBEE] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-xl bg-[#E8D1F0] flex items-center justify-center mb-5">
                    <span className="text-xl font-bold text-[#681A8C]">{cat.title.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#29232D] mb-1">{cat.title}</h3>
                  <p className="text-xs text-[#6B5E70] mb-6">{cat.subtitle}</p>
                </div>
                <Link
                  href={`/appointments`}
                  className="w-full text-center bg-[#2E1033] hover:bg-[#3F1845] text-white py-2.5 rounded-xl text-xs font-medium tracking-wide transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
          </div>

          {/* ── 4 TRUST PILLARS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#EADBEE]">
            {[
              { num: "01", text: "Verified service menu" },
              { num: "02", text: "Personalized recommendations" },
              { num: "03", text: "Appointment reminders" },
              { num: "04", text: "Loyalty & offers" },
            ].map((pillar, i) => (
              <div key={i} className="space-y-1">
                <span className="text-xs font-bold text-[#681A8C] tracking-wider block">{pillar.num}</span>
                <p className="text-sm font-medium text-[#29232D]">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / ETHOS ── */}
      <section id="about" className="bg-white text-[#29232D] px-6 py-24 border-b border-[#EADBEE]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#681A8C]">
              Our Ethos
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2E1033] leading-tight">
              A Space Built <br /><span className="text-[#681A8C] italic">Exclusively</span> for You.
            </h2>
            <div className="space-y-4 text-[#6B5E70] text-base leading-relaxed">
              <p>
                Nestled in the heart of {businessConfig.address.city}, Natural&apos;s Salon is dedicated to making every guest feel genuinely seen, cared for, and transformed.
              </p>
              <p>
                From precision cuts and bespoke coloring to advanced skincare rituals, our certified stylists and therapists blend artistry with premium care.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: "Expert Stylists", desc: "Certified and experienced beauty professionals." },
              { label: "Premium Products", desc: "Curated luxury hair and skincare products." },
              { label: "Personalised Care", desc: "Every appointment is customized to your needs." },
              { label: "Serene Ambiance", desc: "Private, hygienic, distraction-free salon space." },
            ].map((item, i) => (
              <div key={i} className="bg-[#FBF9FC] p-6 rounded-xl border border-[#EADBEE]">
                <CheckCircle2 className="w-5 h-5 text-[#681A8C] mb-4" />
                <h3 className="font-bold text-base mb-1 text-[#29232D]">{item.label}</h3>
                <p className="text-xs text-[#6B5E70] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT SHOWCASE & GALLERY ── */}
      <Gallery />

      {/* ── CONTACT & FOOTER ── */}
      <footer id="contact" className="bg-primary text-primary-foreground pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16 lg:gap-24 mb-32">
          <div className="md:col-span-5 space-y-10">
            <div className="relative w-52 h-20 opacity-95 hover:opacity-100 transition-opacity">
              <Image
                src="/logo-white.svg"
                alt="Natural's Salon Kottakkal"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-primary-foreground/70 text-lg font-light max-w-md leading-relaxed">
              We look forward to welcoming you into our space. Appointments are highly recommended to ensure we can accommodate you.
            </p>
            <Link
              href="/appointments"
              className="inline-block border border-ring text-ring font-medium tracking-widest uppercase text-sm px-10 py-4 hover:bg-ring hover:text-black transition-colors"
            >
              Book Your Visit
            </Link>
          </div>

          <div className="md:col-span-7 grid sm:grid-cols-2 gap-12 lg:gap-16 pt-4">
            <div className="space-y-8">
              <h4 className="text-xs font-medium text-ring uppercase tracking-[0.2em]">Visit Us</h4>
              <div className="flex gap-4 items-start text-primary-foreground/70 font-light">
                <MapPin className="w-5 h-5 shrink-0 mt-1 opacity-70" />
                <p className="leading-loose">
                  {businessConfig.address.street}<br />
                  {businessConfig.address.landmark}<br />
                  {businessConfig.address.city}, {businessConfig.address.state} {businessConfig.address.postalCode}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-medium text-ring uppercase tracking-[0.2em]">Connect</h4>
              <div className="space-y-6 text-primary-foreground/70 font-light">
                <a href={`tel:${businessConfig.phone}`} className="flex gap-4 items-center hover:text-white transition-colors">
                  <Phone className="w-5 h-5 shrink-0 opacity-70" />
                  {businessConfig.phone}
                </a>
                <div className="flex gap-6 items-center pt-4">
                  <a
                    href={businessConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Natural's Salon Kottakkal on Instagram"
                    className="opacity-70 hover:opacity-100 hover:text-white transition-all"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href={businessConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Natural's Salon Kottakkal on Facebook"
                    className="opacity-70 hover:opacity-100 hover:text-white transition-all"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs tracking-wider text-primary-foreground/50">
          <p>© {new Date().getFullYear()} {businessConfig.name}. All rights reserved.</p>
          <div className="flex gap-8 uppercase font-medium">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:hidden flex gap-3 z-50">
        <Link
          href="/appointments"
          className="flex-1 bg-primary text-primary-foreground font-medium uppercase tracking-widest text-xs py-4 text-center"
        >
          Book Now
        </Link>
      </div>
    </main>
  );
}
