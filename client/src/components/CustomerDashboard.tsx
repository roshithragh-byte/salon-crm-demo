"use client";

import { useState, useEffect } from "react";
import { CustomerApi, ProfileApi } from "@/lib/api/services";
import { Loader2, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Sparkles, Award, ArrowRight } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { format } from "date-fns";
import Link from "next/link";

interface AppointmentItem {
  id: string;
  startsAt: string;
  status: string;
  service?: {
    name?: string;
    durationMinutes?: number;
  };
}

interface CustomerDashboardProfile {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  };
  customerProfiles?: Array<{
    visitCount?: number;
    loyaltyPoints?: number;
  }>;
}

export function CustomerDashboard() {
  const [appointments, setAppointments] = useState<{ upcoming: AppointmentItem[]; history: AppointmentItem[] }>({ upcoming: [], history: [] });
  const [profile, setProfile] = useState<CustomerDashboardProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsData, profileData] = await Promise.all([
          CustomerApi.getAppointments(),
          ProfileApi.getProfile()
        ]);
        setAppointments(apptsData as { upcoming: AppointmentItem[]; history: AppointmentItem[] });
        setProfile(profileData as CustomerDashboardProfile);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#5E127E]" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm">
        {error}
      </div>
    );
  }

  const customerProfile = profile?.customerProfiles?.[0];

  return (
    <div className="space-y-8">
      {/* Profile & Loyalty Header Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFECE6] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5E127E] bg-[#F3E8F6] px-3 py-1 rounded-full border border-[#E5D3EB]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Naturals Privé Client</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#230B29]">
            Welcome, {profile?.user?.firstName || "Valued Guest"}
          </h1>
          <p className="text-xs sm:text-sm text-[#615668] font-light">
            {profile?.user?.email || "Registered Client"} {profile?.user?.phoneNumber ? `• ${profile.user.phoneNumber}` : ""}
          </p>
        </div>
        
        {customerProfile && (
          <div className="flex gap-4">
            <div className="bg-[#FAFAF8] border border-[#EFECE6] px-5 py-3 rounded-2xl text-center">
              <div className="text-[10px] font-bold text-[#615668] uppercase tracking-wider">Visits</div>
              <div className="text-xl font-serif font-bold text-[#230B29]">{customerProfile.visitCount || 0}</div>
            </div>
            <div className="bg-[#F3E8F6] border border-[#E5D3EB] px-5 py-3 rounded-2xl text-center">
              <div className="text-[10px] font-bold text-[#5E127E] uppercase tracking-wider flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-[#D4AF37]" /> Loyalty Points
              </div>
              <div className="text-xl font-serif font-bold text-[#5E127E]">{customerProfile.loyaltyPoints || 0}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EFECE6] space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
              <h2 className="text-lg font-serif font-semibold text-[#230B29] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#5E127E]" />
                Upcoming Reservations
              </h2>
              <Link
                href="/appointments"
                className="text-xs font-semibold text-[#5E127E] hover:underline"
              >
                + New Booking
              </Link>
            </div>
            
            {appointments.upcoming.length > 0 ? (
              <div className="space-y-4">
                {appointments.upcoming.map((appt) => (
                  <div
                    key={appt.id}
                    className="border border-[#EFECE6] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#5E127E]/30 transition-all bg-[#FAFAF8]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-[#F3E8F6] border border-[#E5D3EB] p-3 rounded-xl text-center min-w-20">
                        <div className="text-xs font-bold text-[#5E127E] uppercase">
                          {format(new Date(appt.startsAt), "MMM d")}
                        </div>
                        <div className="text-sm font-semibold text-[#230B29]">
                          {format(new Date(appt.startsAt), "h:mm a")}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-serif font-semibold text-sm text-[#1E1822]">
                          {appt.service?.name || "Service Appointment"}
                        </h3>
                        <div className="text-xs text-[#615668] flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-[#5E127E]" />
                          <span>{appt.service?.durationMinutes || 45} mins</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-[#FAFAF8] rounded-2xl border border-[#EFECE6] space-y-3">
                <CalendarIcon className="w-8 h-8 mx-auto text-[#615668]/40" />
                <p className="font-serif font-semibold text-sm text-[#1E1822]">No upcoming appointments scheduled</p>
                <p className="text-xs text-[#615668] max-w-xs mx-auto font-light">Ready for your next salon or skincare session?</p>
                <div className="pt-2">
                  <Link
                    href="/appointments"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#5E127E] hover:bg-[#4D0F68] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-all"
                  >
                    <span>Reserve an Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Appointment History */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EFECE6] space-y-4">
            <h2 className="text-lg font-serif font-semibold text-[#230B29] flex items-center gap-2 border-b border-[#EFECE6] pb-4">
              <Clock className="w-4 h-4 text-[#615668]" />
              Visit History
            </h2>
            
            {appointments.history.length > 0 ? (
              <div className="divide-y divide-[#EFECE6]">
                {appointments.history.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-serif font-semibold text-sm text-[#1E1822]">
                        {appt.service?.name || "Appointment"}
                      </div>
                      <div className="text-xs text-[#615668] mt-0.5">
                        {format(new Date(appt.startsAt), "MMMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      {appt.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : appt.status === "CANCELLED" || appt.status === "NO_SHOW" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> {appt.status === "NO_SHOW" ? "No Show" : "Cancelled"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-[#615668]">
                          {appt.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#615668] bg-[#FAFAF8] rounded-2xl border border-[#EFECE6]">
                No previous visits logged yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
