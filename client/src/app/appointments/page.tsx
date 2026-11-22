import Link from "next/link";
import { ArrowLeft, Sparkles, Phone } from "lucide-react";
import { businessConfig } from "@/business.config";
import { BookingForm, Service, Staff } from "./BookingForm";
import { ApiClient } from "@/lib/api/client";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Book an Appointment | Natural's Salon Kottakkal",
  description: "Schedule your hair couture, bridal styling, or skincare appointment at Natural's Salon Kottakkal.",
};

export default async function AppointmentsPage() {
  let services: Service[] = [];
  let staff: Staff[] = [];

  try {
    const [resServices, resStaff] = await Promise.all([
      ApiClient.get<{ data: Service[] }>(`/salons/hq/services`, false),
      ApiClient.get<{ data: Staff[] }>(`/salons/hq/staff`, false),
    ]);
    services = resServices?.data || [];
    staff = resStaff?.data || [];
  } catch (error) {
    console.error("Prefetching booking data during SSR failed, will fallback to client fetch:", error);
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1E1822] pb-24 md:pb-16 selection:bg-[#5E127E]/10 selection:text-[#5E127E]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#EFECE6] px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-[#615668] hover:text-[#5E127E] transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <div className="h-4 w-px bg-[#EFECE6]" />
          <div className="font-serif font-semibold text-sm text-[#230B29]">
            {businessConfig.name} • Kottakkal
          </div>
        </div>

        <a
          href={`tel:${businessConfig.phone}`}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#615668] hover:text-[#5E127E] font-medium"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{businessConfig.phone}</span>
        </a>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        {/* Intro */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5E127E] bg-[#F3E8F6] px-3.5 py-1 rounded-full border border-[#E5D3EB]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Online Reservation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-medium text-[#230B29] tracking-tight">
            Reserve Your Salon Visit
          </h1>
          <p className="text-sm md:text-base text-[#615668] max-w-lg mx-auto font-light leading-relaxed">
            Select your desired treatment ritual, date, and preferred time slot. We will confirm your appointment immediately.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#EFECE6] p-6 sm:p-8 md:p-12">
          <BookingForm initialServices={services} initialStaff={staff} />
        </div>

        {/* Alternative contact */}
        <p className="mt-8 text-center text-xs text-[#615668]">
          Need custom bridal packages or urgent bookings?{" "}
          <a
            href={`tel:${businessConfig.phone}`}
            className="text-[#5E127E] font-semibold hover:underline"
          >
            Call {businessConfig.phone}
          </a>{" "}
          or{" "}
          <a
            href={`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-semibold hover:underline"
          >
            WhatsApp our desk
          </a>
          .
        </p>
      </div>
    </main>
  );
}
