"use client";

import { useEffect, useState } from "react";
import { BookingApi, BookingRecord } from "@/lib/api/services";
import { Calendar as CalendarIcon, Clock, Search } from "lucide-react";
import { format } from "date-fns";

export default function BookingsPage() {
  const [appointments, setAppointments] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    BookingApi.getBookings('hq')
      .then((res) => {
        if (Array.isArray(res)) {
          setAppointments(res);
        } else {
          setAppointments(res.data || []);
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load appointments", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = appointments.filter(a => 
    a.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage all salon bookings and schedules.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by customer name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Staff</th>
                <th className="px-6 py-4 font-medium">Date &amp; Time</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                      Loading appointments...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-base font-medium text-foreground">No appointments found</p>
                    <p className="text-sm mt-1">Try adjusting your search filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{a.customerName}</div>
                      {a.customerPhone && <div className="text-xs text-muted-foreground mt-0.5">{a.customerPhone}</div>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {a.service?.name || a.serviceName || "Service"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {a.staff?.user?.firstName ? `${a.staff.user.firstName} ${a.staff.user.lastName || ''}` : 'Any Staff'}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        {format(new Date(a.startsAt), "MMM d, yyyy • h:mm a")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {a.payments && a.payments.length > 0 ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          a.payments[0].status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {a.payments[0].status}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        a.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        a.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                        a.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
