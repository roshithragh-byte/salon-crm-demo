"use client";

import { useEffect, useState } from "react";
import { BookingApi, BookingRecord } from "@/lib/api/services";
import { Calendar as CalendarIcon, Clock, Search, Sparkles } from "lucide-react";
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
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5E127E] bg-[#F3E8F6] px-3 py-1 rounded-full border border-[#E5D3EB]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Reservations Ledger</span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#230B29] mt-2">Appointments</h1>
          <p className="text-xs text-[#615668] mt-0.5">Track, verify, and manage all salon appointments.</p>
        </div>
      </div>

      <div className="bg-white border border-[#EFECE6] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EFECE6] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAFAF8]">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#615668]" />
            <input 
              type="text" 
              placeholder="Search by client name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-[#EFECE6] bg-white rounded-2xl text-xs text-[#1E1822] placeholder:text-[#615668]/60 focus:outline-none focus:ring-2 focus:ring-[#5E127E]"
            />
          </div>
          <div className="text-xs text-[#615668]">
            Showing <span className="font-semibold text-[#1E1822]">{filtered.length}</span> appointments
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-[#615668] uppercase tracking-wider bg-[#FAFAF8] border-b border-[#EFECE6]">
              <tr>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Treatment Ritual</th>
                <th className="px-6 py-4 font-semibold">Stylist</th>
                <th className="px-6 py-4 font-semibold">Scheduled Date &amp; Time</th>
                <th className="px-6 py-4 font-semibold">Payment Status</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#615668]">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#5E127E] border-t-transparent rounded-full animate-spin mb-2" />
                      Loading salon reservations...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-[#615668]">
                    <CalendarIcon className="mx-auto h-10 w-10 text-[#615668]/30 mb-3" />
                    <p className="font-serif font-semibold text-sm text-[#1E1822]">No appointments found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-[#FAF8FC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-serif font-semibold text-sm text-[#1E1822]">{a.customerName}</div>
                      {a.customerPhone && <div className="text-[11px] text-[#615668] mt-0.5">{a.customerPhone}</div>}
                    </td>
                    <td className="px-6 py-4 text-[#1E1822] font-medium">
                      {a.service?.name || a.serviceName || "Treatment Service"}
                    </td>
                    <td className="px-6 py-4 text-[#615668]">
                      {a.staff?.user?.firstName ? `${a.staff.user.firstName} ${a.staff.user.lastName || ''}` : 'Any Stylist'}
                    </td>
                    <td className="px-6 py-4 text-[#1E1822]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#5E127E]" />
                        <span>{format(new Date(a.startsAt), "MMM d, yyyy • h:mm a")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {a.payments && a.payments.length > 0 ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          a.payments[0].status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {a.payments[0].status}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#615668]/60 italic">Pay at Salon</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold border ${
                        a.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        a.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        a.status === 'CONFIRMED' ? 'bg-purple-50 text-[#5E127E] border-purple-200' :
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
