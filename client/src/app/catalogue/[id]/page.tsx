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
    <main className="min-h-screen bg-[#FAFAF8] text-[#1E1822] pb-24 selection:bg-[#5E127E]/10 selection:text-[#5E127E]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#EFECE6] px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#615668] hover:text-[#5E127E] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Salon Menu
        </Link>
        <div className="font-serif font-semibold text-xs text-[#230B29]">
          Natural&apos;s Salon Kottakkal
        </div>
      </nav>

      {/* Hero Treatment Detail Header */}
      <section className="bg-white px-6 pt-16 pb-20 border-b border-[#EFECE6] shadow-2xs">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {service.category?.name && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-[#5E127E] bg-[#F3E8F6] px-4 py-1.5 rounded-full border border-[#E5D3EB]">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>{service.category.name} Ritual</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#230B29] tracking-tight">
            {service.name}
          </h1>

          <p className="text-base md:text-lg text-[#615668] max-w-2xl mx-auto font-light leading-relaxed">
            {service.description || "Experience bespoke care, rejuvenation, and precision styling tailored for your lifestyle by master stylists at Kottakkal."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#615668] pt-2">
            {service.durationMinutes > 0 && (
              <div className="flex items-center gap-2 bg-[#FAFAF8] border border-[#EFECE6] px-4 py-2 rounded-full text-xs font-medium text-[#1E1822]">
                <Clock className="w-3.5 h-3.5 text-[#5E127E]" />
                <span>{service.durationMinutes} minutes session</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-[#FAFAF8] border border-[#EFECE6] px-4 py-2 rounded-full text-xs font-medium">
              <span className="font-semibold text-[#1E1822]">
                {`₹${service.offerPrice || service.basePrice}`}
              </span>
              {service.basePrice && service.basePrice > (service.offerPrice || 0) && (
                <span className="text-[#615668]/60 line-through">₹{service.basePrice}</span>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Link
              href={`/appointments?serviceId=${service.id}`}
              className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#5E127E] hover:bg-[#4D0F68] text-white text-xs font-semibold tracking-wider uppercase rounded-full shadow-lg shadow-[#5E127E]/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Reserve This Ritual</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What to Expect & Benefits */}
      <section className="py-16 md:py-20 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl border border-[#EFECE6] shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-[#F3E8F6] text-[#5E127E] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#230B29]">Who It&apos;s For</h2>
          <p className="text-sm text-[#615668] leading-relaxed font-light">
            Tailored for clients seeking premium attention to detail, personalized formulation matching, and an unhurried, serene experience.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#EFECE6] shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-[#F3E8F6] text-[#5E127E] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#230B29]">The Experience</h2>
          <ul className="space-y-3 text-sm text-[#615668] font-light">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5E127E] shrink-0 mt-0.5" />
              <span>Personalized scalp or skin consultation before service begins.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5E127E] shrink-0 mt-0.5" />
              <span>Strictly authentic salon-grade dermatological formulations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5E127E] shrink-0 mt-0.5" />
              <span>Post-treatment home care and styling guidance.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Recommended Add-ons */}
      {service.addonsAsBase.length > 0 && (
        <section className="py-16 px-6 bg-[#FAF8FC] border-t border-[#EFECE6]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5E127E]">
                Enhance Your Ritual
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#230B29]">
                Recommended Complements
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {service.addonsAsBase.map((addon: ServiceAddonItem) => (
                <div
                  key={addon.addonService.id}
                  className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-sm flex flex-col justify-between hover:border-[#5E127E]/30 transition-all"
                >
                  <div className="space-y-2">
                    <h3 className="font-serif font-semibold text-base text-[#1E1822]">
                      {addon.addonService.name}
                    </h3>
                    <p className="text-xs text-[#615668] leading-relaxed font-light">
                      {addon.addonService.description || "An ideal accompaniment to enhance and extend the results of your treatment."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EFECE6]">
                    <span className="font-semibold text-sm text-[#1E1822]">
                      ₹{addon.addonService.offerPrice || addon.addonService.basePrice}
                    </span>
                    <Link
                      href={`/appointments?serviceId=${service.id}&addOnId=${addon.addonService.id}`}
                      className="text-xs font-semibold text-[#5E127E] hover:text-[#4D0F68] uppercase tracking-wider inline-flex items-center gap-1"
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
