"use client";

import { DashboardApi } from '@/lib/api/services';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

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
          // Redirect to login page
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!data) return <div>No data</div>;

  const { totalRevenue, totalBookings, upcomingAppointments, topServices } = data;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">₹{totalRevenue}</p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
          <p className="mt-2 text-3xl font-bold">{totalBookings}</p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Today</h3>
          <p className="mt-2 text-3xl font-bold">{upcomingAppointments?.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
          {upcomingAppointments?.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments.</p>
          ) : (
            <ul className="space-y-4">
              {upcomingAppointments?.map((apt: { id: string; customerName: string; startsAt: string; status: string }) => (
                <li key={apt.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{apt.customerName}</p>
                    <p className="text-sm text-gray-500">{format(new Date(apt.startsAt), "MMM d, h:mm a")}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {apt.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Top Services</h3>
          {topServices?.length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <ul className="space-y-4">
              {topServices?.map((ts: { name: string; count: number }, i: number) => (
                <li key={i} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                  <p className="font-medium">{ts.name}</p>
                  <span className="text-sm text-gray-500">{ts.count} bookings</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}