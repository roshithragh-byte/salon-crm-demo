import Link from "next/link";
import { businessConfig } from "@/business.config";
import { BookingForm, Service, Staff } from "./BookingForm";
import { ApiClient } from "@/lib/api/client";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Reserve Your Visit | Naturals Salon Kottakkal",
  description: "Schedule your hair couture, bridal styling, or skincare appointment at Naturals Unisex Salon Kottakkal.",
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
    <main className="min-h-screen bg-[#c4beae] text-[#252628] pb-24 md:pb-16 selection:bg-[#252628] selection:text-white">
      {/* Editorial Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#c4beae] px-6 py-4 flex items-center justify-between shadow-2xs" style={{ borderBottom: "1px solid rgba(37, 38, 40, 0.28)" }}>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-sans-label text-[11px] font-semibold text-[#252628] hover:opacity-75 transition"
            aria-label="Back to home"
          >
            ← Return to Salon Menu
          </Link>
          <div className="h-4 w-px bg-[#252628]/30" />
          <div className="font-serif-editorial text-lg text-[#252628]">
            Naturals Salon • Kottakkal
          </div>
        </div>

        <a
          href={`tel:${businessConfig.phone}`}
          className="hidden sm:inline-flex items-center gap-1.5 font-sans-label text-[11px] font-semibold text-[#252628] hover:opacity-75"
        >
          Call {businessConfig.phone}
        </a>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Header Intro */}
        <div className="mb-10 text-center space-y-3">
          <p className="font-sans-label text-[11px] font-semibold text-[#252628]/70">
            Online Reservation Desk
          </p>
          <h1 className="font-serif-editorial text-4xl md:text-5xl tracking-tight text-[#252628]">
            Reserve Your Visit
          </h1>
          <div className="hairline-dark max-w-xs mx-auto my-4" />
          <p className="font-serif-editorial text-lg text-[#46443f] max-w-lg mx-auto leading-relaxed">
            Select your desired treatment ritual, date, and preferred time slot. We will confirm your appointment immediately.
          </p>
        </div>

        {/* Editorial Booking Card */}
        <div className="bg-[#c4beae] border border-[#252628] p-6 sm:p-8 md:p-12 shadow-md">
          <BookingForm initialServices={services} initialStaff={staff} />
        </div>

        {/* Alternative contact */}
        <p className="mt-8 text-center font-serif-editorial text-base text-[#46443f]">
          Need bespoke bridal consultations or same-day appointments?{" "}
          <a
            href={`tel:${businessConfig.phone}`}
            className="font-semibold text-[#252628] hover:underline"
          >
            Call {businessConfig.phone}
          </a>{" "}
          or{" "}
          <a
            href={`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#252628] hover:underline"
          >
            WhatsApp our desk
          </a>
          .
        </p>
      </div>
    </main>
  );
}
