"use client";

import { useEffect, useState } from "react";
import { BookingApi } from "@/lib/api/services";
import { Scissors } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookingApi.getAvailableServices("hq")
      .then((res) => {
        setServices(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load services", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Services Catalogue</h1>
        <p className="text-gray-500">Manage the services offered at your salon.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Service Name</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Loading services...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  <Scissors className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  No services found
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {s.durationMinutes} mins
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {s.offerPrice ? (
                      <div>
                        <span className="line-through text-gray-400 mr-2">₹{s.basePrice}</span>
                        <span className="text-green-600">₹{s.offerPrice}</span>
                      </div>
                    ) : (
                      <span>₹{s.basePrice}</span>
                    )}
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
