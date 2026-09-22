"use client";

import { useState, useEffect } from "react";
import { CustomerApi, ProfileApi } from "@/lib/api/services";
import { Loader2, Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { format } from "date-fns";

export function CustomerDashboard() {
  const [appointments, setAppointments] = useState<{ upcoming: any[]; history: any[] }>({ upcoming: [], history: [] });
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsData, profileData] = await Promise.all([
          CustomerApi.getAppointments(),
          ProfileApi.getProfile()
        ]);
        setAppointments(apptsData);
        setProfile(profileData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl">
        {error}
      </div>
    );
  }

  const customerProfile = profile?.customerProfiles?.[0];

  return (
    <div className="space-y-8">
      {/* Profile Summary Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-purple-950">
            Welcome back, {profile?.user?.firstName || "Guest"}
          </h1>
          <p className="text-slate-500 mt-1">
            {profile?.user?.email} • {profile?.user?.phoneNumber}
          </p>
        </div>
        
        {customerProfile && (
          <div className="flex gap-6">
            <div className="bg-purple-50 px-4 py-2 rounded-xl text-center">
              <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Visits</div>
              <div className="text-xl font-bold text-purple-950">{customerProfile.visitCount || 0}</div>
            </div>
            <div className="bg-amber-50 px-4 py-2 rounded-xl text-center">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Points</div>
              <div className="text-xl font-bold text-amber-900">{customerProfile.loyaltyPoints || 0}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-serif font-bold text-purple-950 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-500" />
              Upcoming Appointments
            </h2>
            
            {appointments.upcoming.length > 0 ? (
              <div className="space-y-4">
                {appointments.upcoming.map((appt) => (
                  <div key={appt.id} className="border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:border-purple-100 transition-colors">
                    <div className="bg-purple-50 p-3 rounded-lg text-center min-w-24">
                      <div className="text-sm font-semibold text-purple-700">
                        {format(new Date(appt.startsAt), "MMM d")}
                      </div>
                      <div className="text-lg font-bold text-purple-950">
                        {format(new Date(appt.startsAt), "h:mm a")}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{appt.service?.name || "Service Appointment"}</h3>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" /> {appt.service?.durationMinutes || 60} mins
                      </div>
                    </div>
                    
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">
                No upcoming appointments.
              </div>
            )}
          </div>

          {/* Appointment History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-serif font-bold text-purple-950 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Past Appointments
            </h2>
            
            {appointments.history.length > 0 ? (
              <div className="space-y-4">
                {appointments.history.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div>
                      <div className="font-medium text-slate-800">{appt.service?.name || "Appointment"}</div>
                      <div className="text-sm text-slate-500">
                        {format(new Date(appt.startsAt), "MMMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      {appt.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <CheckCircle className="w-4 h-4" /> Completed
                        </span>
                      ) : appt.status === "CANCELLED" || appt.status === "NO_SHOW" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
                          <XCircle className="w-4 h-4" /> {appt.status === "NO_SHOW" ? "No Show" : "Cancelled"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-slate-500">
                          {appt.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">
                No past appointments.
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
