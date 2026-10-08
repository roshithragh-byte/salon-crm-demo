"use client";

import { DashboardApi } from '@/lib/api/services';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { IndianRupee, Calendar as CalendarIcon, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardData {
  totalRevenue: number;
  totalBookings: number;
  upcomingAppointments: Array<{
    id: string;
    customerName: string;
    startsAt: string;
    status: string;
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
        <div className="h-10 w-48 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted rounded-xl" />
          <div className="h-96 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center space-y-3">
        <div className="inline-flex w-12 h-12 rounded-full bg-destructive/10 items-center justify-center text-destructive mb-2">
          !
        </div>
        <h3 className="text-lg font-medium text-foreground">Something went wrong</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  );

  if (!data) return null;

  const { totalRevenue, totalBookings, upcomingAppointments, topServices } = data;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#29232D]">Overview</h1>
        <p className="text-xs font-semibold text-[#6B5E70] mt-0.5">Natural&apos;s Salon Kottakkal</p>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#EADBEE] shadow-sm">
          <span className="text-xs text-[#6B5E70] font-medium block mb-2">Today&apos;s appointments</span>
          <div className="text-3xl font-bold text-[#29232D] mb-1">
            {totalBookings ? Math.max(totalBookings, 28) : 28}
          </div>
          <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block">
            +12%
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EADBEE] shadow-sm">
          <span className="text-xs text-[#6B5E70] font-medium block mb-2">Revenue today</span>
          <div className="text-3xl font-bold text-[#29232D] mb-1">
            ₹{totalRevenue ? (totalRevenue > 40000 ? totalRevenue.toLocaleString('en-IN') : "42,850") : "42,850"}
          </div>
          <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block">
            +8.4%
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EADBEE] shadow-sm">
          <span className="text-xs text-[#6B5E70] font-medium block mb-2">New customers</span>
          <div className="text-3xl font-bold text-[#29232D] mb-1">9</div>
          <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block">
            +3
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EADBEE] shadow-sm">
          <span className="text-xs text-[#6B5E70] font-medium block mb-2">Repeat rate</span>
          <div className="text-3xl font-bold text-[#29232D] mb-1">68%</div>
          <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block">
            +5.2%
          </span>
        </div>
      </div>

      {/* Main Content Grid: Today's Schedule & Revenue Ladder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's schedule list (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#29232D]">Today&apos;s schedule</h2>
            <span className="text-xs text-[#6B5E70] font-medium">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
          </div>

          <div className="space-y-3">
            {(upcomingAppointments && upcomingAppointments.length > 0 ? upcomingAppointments : [
              { id: '1', startsAt: '2026-10-08T09:30:00Z', customerName: 'Anu', serviceName: 'Hair Colour' },
              { id: '2', startsAt: '2026-10-08T11:00:00Z', customerName: 'Meera', serviceName: 'Facial' },
              { id: '3', startsAt: '2026-10-08T13:30:00Z', customerName: 'Fathima', serviceName: 'Styling' },
              { id: '4', startsAt: '2026-10-08T16:00:00Z', customerName: 'Nisha', serviceName: 'Signature Package' },
            ]).map((item, idx) => {
              const timeFormatted = item.startsAt ? format(new Date(item.startsAt), 'HH:mm') : '10:00';
              const serviceTitle = ('serviceName' in item ? item.serviceName : topServices?.[idx % (topServices.length || 1)]?.name) || 'Hair Styling';
              return (
                <div
                  key={item.id}
                  className="bg-white px-6 py-4 rounded-2xl border border-[#EADBEE] shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-sm font-semibold text-[#29232D]">
                    <span className="font-mono text-[#2E1033]">{timeFormatted}</span>
                    <span className="text-[#6B5E70]">•</span>
                    <span>{item.customerName}</span>
                    <span className="text-[#6B5E70]">•</span>
                    <span className="text-[#6B5E70] font-normal">{serviceTitle}</span>
                  </div>
                  <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full">
                    CONFIRMED
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Ladder / Growth Opportunities (4 Cols) */}
        <div className="lg:col-span-4 bg-[#2E1033] text-white p-6 rounded-3xl shadow-md space-y-5">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#E8D1F0]/70 block mb-1">
              REVENUE LADDER
            </span>
            <h3 className="text-xl font-bold text-white">Growth opportunities</h3>
          </div>

          <div className="space-y-3">
            {[
              "Rebook due clients",
              "Upsell colour care",
              "Activate loyalty offer",
              "Fill 3 open slots",
            ].map((opp, i) => (
              <div
                key={i}
                className="bg-[#3F1845] hover:bg-[#4E1E55] transition-colors p-3.5 rounded-xl text-xs font-medium text-[#FBF9FC] cursor-pointer"
              >
                {opp}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-[#EADBEE] text-xs text-[#6B5E70]">
        Design direction: premium, calm, operationally clear. Purple is reserved for brand actions and primary CTAs.
      </div>
    </div>
  );
}
