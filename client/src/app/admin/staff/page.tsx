"use client";

import { useEffect, useState } from "react";
import { BookingApi } from "@/lib/api/services";
import { UserCheck } from "lucide-react";

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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Staff & Stylists</h1>
        <p className="text-gray-500">Manage your salon's team members.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Team Member</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  Loading staff...
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  <UserCheck className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  No staff members found
                </td>
              </tr>
            ) : (
              staff.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
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
