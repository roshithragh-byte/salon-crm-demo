import { ServicesApi } from '@/lib/api/services';
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ServiceAddonItem {
  addonService: {
    id: string;
    name: string;
    description?: string;
    basePrice?: number;
    offerPrice?: number;
  };
}

interface ServiceDetail {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  basePrice: number;
  offerPrice?: number;
  category?: {
    name?: string;
  };
  addonsAsBase: ServiceAddonItem[];
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  let service: ServiceDetail | null = null;
  try {
    const json = await ServicesApi.getServiceDetails(resolvedParams.id) as { data?: ServiceDetail };
    service = json?.data || null;
  } catch (e) {
    console.error(e);
  }

  if (!service) return notFound();

  return (
    <main className="min-h-screen bg-[var(--bg-taupe)] text-[var(--bg-charcoal)] pb-24 selection:bg-[var(--bg-charcoal)] selection:text-[var(--bg-taupe)] font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-taupe)]/95 backdrop-blur-md border-b border-[var(--border-hairline)] px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--bg-charcoal)]/80 hover:text-[var(--bg-charcoal)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Salon Menu
        </Link>
        <div className="font-serif italic text-xs tracking-wider text-[var(--bg-charcoal)]">
          Naturals Unisex Salon · Kottakkal
        </div>
      </nav>

      {/* Hero Treatment Detail Header */}
      <section className="px-6 pt-16 pb-20 border-b border-[var(--border-hairline)]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {service.category?.name && (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--bg-charcoal)] border border-[var(--border-hairline)] px-4 py-1.5 bg-white/40">
              <Sparkles className="w-3 h-3 text-[var(--bg-charcoal)]" />
              <span>{service.category.name} Ritual</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[var(--bg-charcoal)] tracking-tight">
            {service.name}
          </h1>

          <p className="text-base md:text-lg text-[var(--bg-charcoal)]/85 max-w-2xl mx-auto font-normal leading-relaxed">
            {service.description || "Experience bespoke care, rejuvenation, and precision styling tailored for your lifestyle by master stylists at Kottakkal."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--bg-charcoal)] pt-2 uppercase tracking-[0.14em] font-semibold">
            {service.durationMinutes > 0 && (
              <div className="flex items-center gap-2 border border-[var(--border-hairline)] px-4 py-2 bg-white/40">
                <Clock className="w-3.5 h-3.5 text-[var(--bg-charcoal)]" />
                <span>{service.durationMinutes} Minutes Session</span>
              </div>
            )}
            <div className="flex items-center gap-2 border border-[var(--border-hairline)] px-4 py-2 bg-white/40">
              <span className="font-bold text-[var(--bg-charcoal)]">
                {`₹${service.offerPrice || service.basePrice}`}
              </span>
              {service.basePrice && service.basePrice > (service.offerPrice || 0) && (
                <span className="text-[var(--bg-charcoal)]/50 line-through">₹{service.basePrice}</span>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Link
              href={`/appointments?serviceId=${service.id}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--bg-charcoal)] text-[var(--bg-taupe)] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all shadow-sm"
            >
              <span>Reserve Ritual Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What to Expect & Benefits */}
      <section className="py-16 md:py-20 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-[var(--border-hairline)] bg-white/40 p-8 space-y-4">
          <div className="w-10 h-10 border border-[var(--border-hairline)] bg-[var(--bg-charcoal)] text-[var(--bg-taupe)] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-normal text-[var(--bg-charcoal)]">Who It&apos;s For</h2>
          <p className="text-xs text-[var(--bg-charcoal)]/85 leading-relaxed font-normal">
            Tailored for clients seeking premium attention to detail, personalized formulation matching, and an unhurried, serene experience.
          </p>
        </div>

        <div className="border border-[var(--border-hairline)] bg-white/40 p-8 space-y-4">
          <div className="w-10 h-10 border border-[var(--border-hairline)] bg-[var(--bg-charcoal)] text-[var(--bg-taupe)] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-normal text-[var(--bg-charcoal)]">The Experience</h2>
          <ul className="space-y-3 text-xs text-[var(--bg-charcoal)]/85 font-normal">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--bg-charcoal)] shrink-0 mt-0.5" />
              <span>Personalized scalp or skin consultation before service begins.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--bg-charcoal)] shrink-0 mt-0.5" />
              <span>Strictly authentic salon-grade dermatological formulations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--bg-charcoal)] shrink-0 mt-0.5" />
              <span>Post-treatment home care and styling guidance.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Recommended Add-ons */}
      {service.addonsAsBase && service.addonsAsBase.length > 0 && (
        <section className="py-16 px-6 border-t border-[var(--border-hairline)]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--bg-charcoal)]">
                Enhance Your Ritual
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-normal text-[var(--bg-charcoal)]">
                Recommended Complements
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {service.addonsAsBase.map((addon: ServiceAddonItem) => (
                <div
                  key={addon.addonService.id}
                  className="p-6 border border-[var(--border-hairline)] bg-white/40 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="font-serif font-medium text-base text-[var(--bg-charcoal)]">
                      {addon.addonService.name}
                    </h3>
                    <p className="text-xs text-[var(--bg-charcoal)]/80 leading-relaxed font-normal">
                      {addon.addonService.description || "An ideal accompaniment to enhance and extend the results of your treatment."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-hairline)]">
                    <span className="font-bold text-xs text-[var(--bg-charcoal)]">
                      ₹{addon.addonService.offerPrice || addon.addonService.basePrice}
                    </span>
                    <Link
                      href={`/appointments?serviceId=${service.id}&addOnId=${addon.addonService.id}`}
                      className="text-[10px] font-bold text-[var(--bg-charcoal)] uppercase tracking-widest inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Add to Visit</span>
                      <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
