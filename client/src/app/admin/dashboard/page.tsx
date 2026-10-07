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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back. Here is what&apos;s happening at the salon today.</p>
        </div>
        <div className="text-sm font-medium text-muted-foreground bg-white px-4 py-2 border rounded-full shadow-sm">
          {format(new Date(), 'EEEE, MMMM do yyyy')}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IndianRupee className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-muted-foreground font-medium mb-3">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span>Total Revenue</span>
            </div>
            <p className="text-4xl font-serif font-medium text-foreground">
              ₹{totalRevenue?.toLocaleString('en-IN') || 0}
            </p>
          </div>
        </div>

        <div className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CalendarIcon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-muted-foreground font-medium mb-3">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span>Total Bookings</span>
            </div>
            <p className="text-4xl font-serif font-medium text-foreground">
              {totalBookings || 0}
            </p>
          </div>
        </div>

        <div className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-muted-foreground font-medium mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <span>Upcoming Today</span>
            </div>
            <p className="text-4xl font-serif font-medium text-foreground">
              {upcomingAppointments?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appointments List */}
        <div className="bg-card border rounded-2xl shadow-sm flex flex-col h-[420px]">
          <div className="p-6 border-b flex items-center justify-between shrink-0">
            <h3 className="text-lg font-serif font-medium">Next Appointments</h3>
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
              Today
            </span>
          </div>
          <div className="p-2 overflow-y-auto flex-1">
            {upcomingAppointments?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Clock className="w-10 h-10 mb-3 opacity-20" />
                <p>No upcoming appointments.</p>
              </div>
            ) : (
              <ul className="space-y-1 p-2">
                {upcomingAppointments?.map((apt) => (
                  <li key={apt.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-medium font-serif">{apt.customerName?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{apt.customerName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(apt.startsAt), "h:mm a")}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      apt.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      apt.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                      apt.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {apt.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Top Services Chart */}
        <div className="bg-card border rounded-2xl shadow-sm flex flex-col h-[420px]">
          <div className="p-6 border-b flex items-center justify-between shrink-0">
            <h3 className="text-lg font-serif font-medium">Service Popularity</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            {topServices?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No service data available yet.</p>
              </div>
            ) : (
              <div className="h-full w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topServices} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      width={120}
                      tick={{ fill: 'var(--color-foreground)', fontSize: 12, fontWeight: 500 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'var(--color-muted)', opacity: 0.5 }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                      formatter={(value: any) => [`${value} bookings`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                      {topServices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-primary)' : 'var(--color-ring)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
