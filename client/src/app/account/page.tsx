"use client";

import { CustomerDashboard } from "@/components/CustomerDashboard";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <CustomerDashboard />
      </div>
    </div>
  );
}
