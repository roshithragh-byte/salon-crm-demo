"use client";

import { useEffect, useState } from "react";
import { BookingApi } from "@/lib/api/services";
import { Scissors, Clock, IndianRupee } from "lucide-react";

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Service Catalogue</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage the services offered at your salon.</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Service Name</th>
              <th className="px-6 py-4 font-medium text-center">Duration</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                    Loading services...
                  </div>
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  <Scissors className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-base font-medium text-foreground">No services found</p>
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {s.durationMinutes} mins
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.offerPrice ? (
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-foreground">₹{s.offerPrice}</span>
                        <span className="line-through text-xs text-muted-foreground">₹{s.basePrice}</span>
                      </div>
                    ) : (
                      <span className="font-medium text-foreground">₹{s.basePrice}</span>
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
