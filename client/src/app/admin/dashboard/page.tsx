"use client";

import { DashboardApi } from '@/lib/api/services';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  totalRevenue: number;
  totalBookings: number;
  upcomingAppointments: Array<{
    id: string;
    customerName: string;
    customerPhone?: string;
    startsAt: string;
    status: string;
    serviceId?: string;
    serviceName?: string;
    notes?: string;
  }>;
  topServices: Array<{
    name: string;
    count: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await DashboardApi.getDashboardData();
        setData(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === 'Unauthorized') {
          router.push('/admin/login');
        } else {
          setError('Failed to load dashboard data');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-[#EFECE6] rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[#EFECE6] rounded-3xl" />)}
        </div>
        <div className="h-96 bg-[#EFECE6] rounded-3xl" />
      </div>
    );
  }

  if (error) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-[#EFECE6] shadow-sm max-w-md">
        <div className="inline-flex w-12 h-12 rounded-full bg-rose-50 items-center justify-center text-rose-600 mb-2 font-bold">
          !
        </div>
        <h3 className="text-lg font-serif font-semibold text-[#1E1822]">Unable to Load CRM Overview</h3>
        <p className="text-xs text-[#615668]">{error}</p>
      </div>
    </div>
  );

  if (!data) return null;

  const { totalRevenue, totalBookings, upcomingAppointments } = data;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5E127E] bg-[#F3E8F6] px-3 py-1 rounded-full border border-[#E5D3EB]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Kottakkal Studio</span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#230B29] mt-2">
            Salon Overview
          </h1>
          <p className="text-xs text-[#615668] mt-0.5">Live operational performance and customer appointments.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 bg-[#5E127E] hover:bg-[#4D0F68] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transition-all"
          >
            <span>View All Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-sm space-y-2">
          <span className="text-xs text-[#615668] font-medium block">Total Reservations</span>
          <div className="text-3xl font-serif font-semibold text-[#230B29]">
            {totalBookings ?? 0}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span>Live System</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-sm space-y-2">
          <span className="text-xs text-[#615668] font-medium block">Revenue Logged</span>
          <div className="text-3xl font-serif font-semibold text-[#230B29]">
            ₹{(totalRevenue ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span>Verified Bookings</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-sm space-y-2">
          <span className="text-xs text-[#615668] font-medium block">Upcoming Queue</span>
          <div className="text-3xl font-serif font-semibold text-[#230B29]">
            {upcomingAppointments?.length ?? 0}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span>Active Slots</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-sm space-y-2">
          <span className="text-xs text-[#615668] font-medium block">Top Service</span>
          <div className="text-xl font-serif font-semibold text-[#230B29] truncate">
            {data.topServices && data.topServices.length > 0 ? data.topServices[0].name : "Hair Styling"}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span>Most Requested</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's schedule list (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
            <h2 className="text-lg font-serif font-semibold text-[#230B29]">Active Appointments Queue</h2>
            <span className="text-xs text-[#615668] font-medium">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
          </div>

          <div className="space-y-3">
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((item) => {
                const timeFormatted = item.startsAt ? format(new Date(item.startsAt), 'MMM d, h:mm a') : 'Scheduled Slot';
                let serviceTitle = item.serviceName;
                if (!serviceTitle && item.notes && item.notes.includes(' - ')) {
                  const parts = item.notes.split(' - ');
                  if (parts[1]) serviceTitle = parts[1].split(' [')[0].trim();
                }
                if (!serviceTitle) serviceTitle = 'Treatment Ritual';

                return (
                  <div
                    key={item.id}
                    className="bg-[#FAFAF8] px-5 py-4 rounded-2xl border border-[#EFECE6] hover:border-[#5E127E]/30 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="font-semibold text-[#5E127E] bg-white border border-[#EFECE6] px-2.5 py-1 rounded-lg">
                        {timeFormatted}
                      </span>
                      <span className="font-serif font-semibold text-[#1E1822]">{item.customerName}</span>
                      <span className="text-[#615668] hidden sm:inline">•</span>
                      <span className="text-[#615668] font-light hidden sm:inline">{serviceTitle}</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                      item.status === 'CONFIRMED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                      item.status === 'PENDING' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                      'text-gray-700 bg-gray-50 border-gray-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-[#615668] space-y-2">
                <CalendarIcon className="mx-auto h-8 w-8 text-[#615668]/30" />
                <p className="font-serif text-sm font-semibold text-[#1E1822]">No upcoming appointments in queue</p>
                <p className="text-xs">New bookings confirmed via Web or WhatsApp will appear here automatically.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Growth & Operational Checklist (4 Cols) */}
        <div className="lg:col-span-4 bg-[#230B29] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] block mb-1">
                STUDIO DISPATCH
              </span>
              <h3 className="text-xl font-serif font-semibold text-white">Daily Operational Focus</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                "Confirm afternoon bridal consultations",
                "Replenish salon-exclusive hydra serums",
                "Dispatch reminder SMS/WhatsApp for tomorrow",
                "Review therapist commission reports",
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/10 hover:bg-white/15 transition-colors p-3.5 rounded-2xl text-white/90 font-light flex items-center gap-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-white/50">
            Natural&apos;s Salon Kottakkal CRM • v1.2 Luxury Design Edition
          </div>
        </div>
      </div>
    </div>
  );
}
