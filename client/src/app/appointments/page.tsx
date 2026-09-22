import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { businessConfig } from "@/business.config";
import BookingForm from "./BookingForm";
import { ApiClient } from "@/lib/api/client";

export const metadata = {
  title: "Book an Appointment",
  description: "Book your personalised skincare or wellness appointment online.",
};

export default async function AppointmentsPage() {
  interface Service {
    id: string;
    name: string;
    durationMinutes: number | null;
  }

  interface Staff {
    id: string;
    name: string;
  }

  // Fetch data on the server
  const [resServices, resStaff] = await Promise.all([
    ApiClient.get<{ data: Service[] }>(`/salons/hq/services`, false),
    ApiClient.get<{ data: Staff[] }>(`/salons/hq/staff`, false),
  ]);
  const services = resServices.data || [];
  const staff = resStaff.data || [];

  return (
    <main className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center gap-3 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-purple-900 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="h-5 w-px bg-slate-200" />
        <div className="font-serif font-bold text-purple-950">
          {businessConfig.name !== "[BUSINESS_NAME]" ? businessConfig.name : "Book Appointment"}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Intro */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-purple-950 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-slate-500">
            Fill in your details below and we&apos;ll confirm your booking as soon as possible.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <BookingForm services={services} staff={staff} />
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