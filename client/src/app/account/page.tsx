"use client";

import { CustomerDashboard } from "@/components/CustomerDashboard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1E1822] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#5E127E]/10 selection:text-[#5E127E]">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#615668] hover:text-[#5E127E] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Salon Homepage
        </Link>
        <CustomerDashboard />
      </div>
    </div>
  );
}
