import { ServicesApi } from '@/lib/api/services';
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  let service = null;
  try {
    const json: any = await ServicesApi.getServiceDetails(resolvedParams.id);
    service = json.data;
  } catch (e) {
    console.error(e);
  }

  if (!service) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      <section className="bg-white px-4 pt-12 pb-16 border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          {service.category?.name && (
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-600 mb-4 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {service.category.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-purple-950 mb-6">
            {service.name}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            {service.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 mb-10">
            {service.durationMinutes > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-700" />
                <span>{service.durationMinutes} mins</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-800">
                {`₹${service.offerPrice || service.basePrice}`}
              </span>
              {service.basePrice && service.basePrice > (service.offerPrice || 0) && (
                <span className="text-slate-400 line-through">₹{service.basePrice}</span>
              )}
            </div>
          </div>

          <Link
            href={`/appointments?serviceId=${service.id}`}
            className="inline-flex items-center justify-center px-10 py-4 bg-amber-400 text-purple-950 font-bold rounded-lg shadow-sm transition-transform hover:-translate-y-1 hover:bg-amber-300"
          >
            Book This Treatment
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-serif font-bold text-purple-950 mb-6">Who it&apos;s for</h2>
          <p className="text-slate-500 leading-relaxed">
            Tailored for clients seeking premium care and specialized attention to detail.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-purple-950 mb-6">Benefits</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-slate-500">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>Immediate visible results and relaxation.</span>
            </li>
          </ul>
        </div>
      </section>

      {service.addonsAsBase.length > 0 && (
        <section className="py-16 px-4 bg-purple-50 border-y border-purple-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-purple-800 font-medium mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" /> Make it a complete visit
              </div>
              <h2 className="text-3xl font-serif font-bold text-purple-950">Recommended Add-ons</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {service.addonsAsBase.map((addon: any) => (
                <div key={addon.addonService.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-purple-900 mb-2">{addon.addonService.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{addon.addonService.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-4">
                    <span className="font-semibold text-slate-700">₹{addon.addonService.offerPrice || addon.addonService.basePrice}</span>
                    <Link
                      href={`/appointments?serviceId=${service.id}&addOnId=${addon.addonService.id}`}
                      className="text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors"
                    >
                      Add & Book
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
