import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { businessConfig } from "@/business.config";
import { BookingForm, Service, Staff } from "./BookingForm";
import { ApiClient } from "@/lib/api/client";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Book an Appointment",
  description: "Book your personalised skincare or wellness appointment online.",
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
    <main className="min-h-screen bg-[#FBF9FC] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EADBEE] px-6 py-4 flex items-center gap-3 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-[#6B5E70] hover:text-[#681A8C] transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="h-4 w-px bg-[#EADBEE]" />
        <div className="font-bold text-sm text-[#2E1033]">
          {businessConfig.name} • Kottakkal
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Intro */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E1033] mb-2">
            Book an Appointment
          </h1>
          <p className="text-sm text-[#6B5E70]">
            Select your preferred treatment, date, and time. We&apos;ll confirm your booking immediately.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#EADBEE] p-6 md:p-10">
          <BookingForm initialServices={services} initialStaff={staff} />
        </div>

        {/* Alternative contact */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Prefer to call?{" "}
          <a
            href={`tel:${businessConfig.phone}`}
            className="text-purple-700 font-medium hover:underline"
          >
            {businessConfig.phone}
          </a>{" "}
          or{" "}
          <a
            href={`https://wa.me/${businessConfig.whatsapp.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-medium hover:underline"
          >
            WhatsApp us
          </a>
          .
        </p>
      </div>
    </main>
  );
}
