import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock, Globe, Star, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const businessConfig = {
  name: "BeaSalon",
  phone: "+91 99999 99999",
  email: "hello@beasalon.com",
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
    instagram: "https://instagram.com/beasalon",
    facebook: "https://facebook.com/beasalon",
  },
  maps: "https://maps.google.com/?q=Kottakkal",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-ring/30 selection:text-primary">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-serif text-2xl font-medium tracking-tight text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-serif italic">B</span>
            </div>
            {businessConfig.name}
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-ring transition-colors">Our Story</a>
            <a href="#services" className="hover:text-ring transition-colors">Services</a>
            <a href="#contact" className="hover:text-ring transition-colors">Visit Us</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href={`tel:${businessConfig.phone}`} className="hidden lg:block text-sm font-medium hover:text-ring transition-colors">
              {businessConfig.phone}
            </a>
            <Link
              href="/appointments"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
            >
              Book Now
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-medium tracking-widest uppercase mb-4 border border-ring/20">
            <Sparkles className="w-3.5 h-3.5 text-ring" />
            Premium Wellness Studio
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.1] tracking-tight">
            Elevate Your <br/>
            <span className="text-muted-foreground italic">Everyday</span> Beauty.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Experience bespoke grooming and precision-led skincare in a space designed for complete rejuvenation and serenity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/appointments"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Reserve an Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT / ETHOS ── */}
      <section id="about" className="bg-primary text-primary-foreground px-6 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight">
              A Space Built <br/><span className="text-ring italic">Exclusively</span> for You.
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed text-lg font-light">
              Nestled in the heart of {businessConfig.address.city}, we are an independent luxury wellness studio dedicated to making every guest feel genuinely seen, cared for, and transformed.
            </p>
            <p className="text-primary-foreground/80 leading-relaxed text-lg font-light">
              From precision-led skincare to bespoke grooming rituals, our therapists blend science with artistry — giving you results that last well beyond your visit.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Expert Therapists", desc: "Certified & experienced professionals." },
              { label: "Premium Products", desc: "Curated luxury skincare brands." },
              { label: "Personalised Care", desc: "Every session is bespoke to your needs." },
              { label: "Serene Ambiance", desc: "A private, distraction-free environment." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-ring mb-4" />
                <h3 className="font-medium text-lg mb-2">{item.label}</h3>
                <p className="text-primary-foreground/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES TEASER ── */}
      <section id="services" className="px-6 py-24 lg:py-32 bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">Our Services</h2>
          <div className="w-16 h-1 bg-ring mx-auto mb-8" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-16">
            A carefully curated selection of treatments designed to enhance your natural beauty and provide deep relaxation.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { title: "Hair Styling", price: "From ₹800", desc: "Precision cuts, bespoke coloring, and deep conditioning treatments." },
              { title: "Skin Care", price: "From ₹1500", desc: "Advanced facials and rejuvenating treatments for a radiant glow." },
              { title: "Wellness Rituals", price: "From ₹2500", desc: "Holistic massages and spa therapies to restore your inner balance." }
            ].map((s, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-secondary/50 border hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-serif font-medium">{s.title}</h3>
                  <span className="text-sm font-medium text-ring bg-ring/10 px-3 py-1 rounded-full">{s.price}</span>
                </div>
                <p className="text-muted-foreground mb-8">{s.desc}</p>
                <Link href="/appointments" className="inline-flex items-center gap-2 text-sm font-medium hover:text-ring transition-colors group-hover:translate-x-1">
                  Book Service <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-16">
            <Link href="/appointments" className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT & FOOTER ── */}
      <footer id="contact" className="bg-primary text-primary-foreground pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 lg:gap-24 mb-24">
          <div className="md:col-span-5 space-y-8">
            <div className="font-serif text-3xl font-medium tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-primary text-sm font-serif italic">B</span>
              </div>
              {businessConfig.name}
            </div>
            <p className="text-primary-foreground/70 text-lg font-light max-w-md">
              We look forward to welcoming you into our space. Appointments are highly recommended to ensure we can accommodate you.
            </p>
            <Link
              href="/appointments"
              className="inline-block bg-ring text-primary font-medium px-8 py-4 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              Book Your Visit
            </Link>
          </div>
          
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-ring uppercase tracking-wider text-sm">Visit Us</h4>
              <div className="flex gap-4 items-start text-primary-foreground/80">
                <MapPin className="w-5 h-5 shrink-0 mt-1" />
                <p className="leading-relaxed">
                  {businessConfig.address.street}<br/>
                  {businessConfig.address.landmark}<br/>
                  {businessConfig.address.city}, {businessConfig.address.state} {businessConfig.address.postalCode}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-ring uppercase tracking-wider text-sm">Connect</h4>
              <div className="space-y-4 text-primary-foreground/80">
                <a href={`tel:${businessConfig.phone}`} className="flex gap-4 items-center hover:text-white transition-colors">
                  <Phone className="w-5 h-5 shrink-0" />
                  {businessConfig.phone}
                </a>
                <div className="flex gap-4 items-center pt-2">
                  <a href={businessConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-ring hover:text-primary transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                  <a href={businessConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-ring hover:text-primary transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} {businessConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-lg md:hidden flex gap-3 z-50">
        <Link
          href="/appointments"
          className="flex-1 bg-primary text-primary-foreground font-medium py-3.5 rounded-xl text-sm text-center shadow-md"
        >
          Book Now
        </Link>
        <a
          href={`tel:${businessConfig.phone}`}
          className="flex-1 bg-secondary text-secondary-foreground font-medium py-3.5 rounded-xl text-sm text-center border"
        >
          Call Us
        </a>
      </div>
    </main>
  );
}
