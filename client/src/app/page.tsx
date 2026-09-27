import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Phone, Globe, CheckCircle2 } from "lucide-react";

const businessConfig = {
  name: "de salon bea",
  phone: "+91 87142 29297",
  email: "hello@desalonbea.com",
  address: {
    street: "123 Elegance Avenue",
    landmark: "Near Central Square",
    city: "Kottakkal",
    district: "Malappuram",
    state: "Kerala",
    postalCode: "676503",
  },
  hours: {
    weekdays: "9:00 AM - 8:00 PM",
    weekends: "10:00 AM - 7:00 PM",
  },
  social: {
    instagram: "https://instagram.com/desalonbea",
    facebook: "https://facebook.com/desalonbea",
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
            {/* Nav logo with mix-blend-mode for the black background */}
            <div className="relative w-32 h-10 mix-blend-screen overflow-hidden flex items-center">
              <Image
                src="/logo.svg"
                alt="de salon bea"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-white/80 tracking-wide uppercase">
            <a href="#about" className="hover:text-ring transition-colors">Our Story</a>
            <a href="#services" className="hover:text-ring transition-colors">Services</a>
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
      <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
          poster="/logo.svg"
        >
          {/* User needs to provide this video */}
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Subtle Entrance Animation Sequence */}

          {/* 1. Logo (mix-blend-screen makes the black background disappear, leaving gold over the cinematic video) */}
          <div className="animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-both relative w-64 h-64 md:w-80 md:h-80 mix-blend-screen mb-2">
            <Image
              src="/logo.svg"
              alt="de salon bea - Beauty. Confidence. You."
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* 2. Headline */}
          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white tracking-wide mb-6 leading-tight">
            Where Beauty Becomes <br /> <span className="italic text-ring">Confidence.</span>
          </h1>

          {/* 3. Supporting Text */}
          <p className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-both text-lg md:text-xl text-white/70 max-w-2xl font-light tracking-wide mb-10">
            Experience bespoke grooming and precision-led skincare in a space designed for complete rejuvenation.
          </p>

          {/* 4. CTAs */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-both flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Link
              href="/appointments"
              className="w-full sm:w-auto bg-ring text-black px-10 py-4 rounded-none font-medium tracking-widest uppercase text-sm hover:bg-white transition-colors"
            >
              Book An Appointment
            </Link>
            <a
              href="#services"
              className="w-full sm:w-auto text-white border border-white/30 px-10 py-4 rounded-none font-medium tracking-widest uppercase text-sm hover:bg-white/10 hover:border-white transition-colors"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT / ETHOS ── */}
      <section id="about" className="bg-background text-foreground px-6 py-32 lg:py-40 border-b">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-ring">
              Our Ethos
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-[1.15]">
              A Space Built <br /><span className="text-ring italic">Exclusively</span> for You.
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed">
              <p>
                Nestled in the heart of {businessConfig.address.city}, we are an independent luxury wellness studio dedicated to making every guest feel genuinely seen, cared for, and transformed.
              </p>
              <p>
                From precision-led skincare to bespoke grooming rituals, our therapists blend science with artistry — giving you results that last well beyond your visit.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {[
              { label: "Expert Therapists", desc: "Certified & experienced professionals." },
              { label: "Premium Products", desc: "Curated luxury skincare brands." },
              { label: "Personalised Care", desc: "Every session is bespoke to your needs." },
              { label: "Serene Ambiance", desc: "A private, distraction-free environment." },
            ].map((item, i) => (
              <div key={i} className="group bg-secondary/30 p-8 rounded-none border border-border/50 hover:border-ring/50 transition-colors duration-500">
                <CheckCircle2 className="w-5 h-5 text-ring mb-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-serif text-lg mb-2 text-foreground">{item.label}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES TEASER ── */}
      <section id="services" className="px-6 py-32 lg:py-40 bg-secondary/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">Our Curated Services</h2>
          <div className="w-12 h-[1px] bg-ring mx-auto mb-8" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-20 font-light">
            A carefully selected collection of treatments designed to enhance your natural beauty and provide deep relaxation.
          </p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 text-left">
            {[
              { title: "Hair Styling", price: "From ₹800", desc: "Precision cuts, bespoke coloring, and deep conditioning treatments tailored to your features." },
              { title: "Skin Care", price: "From ₹1500", desc: "Advanced clinical facials and rejuvenating treatments for a radiant, lasting glow." },
              { title: "Wellness Rituals", price: "From ₹2500", desc: "Holistic massages and luxury spa therapies crafted to restore your inner balance." }
            ].map((s, i) => (
              <div key={i} className="group relative bg-background p-10 border hover:border-ring/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-ring to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-serif font-medium">{s.title}</h3>
                  <span className="text-xs tracking-wider uppercase font-medium text-ring">{s.price}</span>
                </div>
                <p className="text-muted-foreground mb-10 font-light leading-relaxed">{s.desc}</p>
                <Link href="/appointments" className="inline-flex items-center gap-3 text-xs tracking-widest uppercase font-medium hover:text-ring transition-colors">
                  Book Service <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <Link href="/appointments" className="inline-flex items-center justify-center gap-3 border border-foreground text-foreground px-10 py-4 font-medium tracking-widest uppercase text-sm hover:bg-foreground hover:text-background transition-colors">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT & FOOTER ── */}
      <footer id="contact" className="bg-primary text-primary-foreground pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16 lg:gap-24 mb-32">
          <div className="md:col-span-5 space-y-10">
            <div className="relative w-48 h-20 mix-blend-screen opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/logo.svg"
                alt="de salon bea"
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
                  <a href={businessConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 hover:text-ring transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                  <a href={businessConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 hover:text-ring transition-all">
                    <Globe className="w-5 h-5" />
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
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
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
