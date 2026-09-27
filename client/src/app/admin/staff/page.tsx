"use client";

import { useEffect, useState } from "react";
import { BookingApi } from "@/lib/api/services";
import { UserCheck, Sparkles } from "lucide-react";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookingApi.getAvailableStaff("hq")
      .then((res) => {
        setStaff(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load staff", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Team & Stylists</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your salon's professional staff members.</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Team Member</th>
              <th className="px-6 py-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                    Loading staff...
                  </div>
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                  <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-base font-medium text-foreground">No staff members found</p>
                </td>
              </tr>
            ) : (
              staff.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-lg">
                        {s.name.charAt(0)}
                      </div>
                      <div className="font-medium text-foreground">{s.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <Sparkles className="w-3 h-3" />
                      Available
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
