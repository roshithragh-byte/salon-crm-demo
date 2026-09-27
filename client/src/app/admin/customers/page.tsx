"use client";

import { useEffect, useState } from "react";
import { AdminCustomerApi } from "@/lib/api/services";
import { Users, Search, MoreHorizontal, User } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    AdminCustomerApi.getCustomers("hq")
      .then((res) => {
        setCustomers(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load customers", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(c => 
    (c.firstName + " " + c.lastName).toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Client Directory</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your clients, view their history, and loyalty points.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="text-sm font-medium text-muted-foreground bg-white px-3 py-1.5 border rounded-full shadow-sm">
            {filtered.length} total clients
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Contact Details</th>
                <th className="px-6 py-4 font-medium text-right">Visits</th>
                <th className="px-6 py-4 font-medium text-right">Loyalty Points</th>
                <th className="px-6 py-4 font-medium text-right">Added On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                      Loading clients...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-base font-medium text-foreground">No clients found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-serif text-lg font-medium">
                          {c.firstName?.charAt(0)}{c.lastName?.charAt(0)}
                        </div>
                        <div className="font-medium text-foreground">
                          {c.firstName} {c.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div>{c.phoneNumber}</div>
                      {c.email && <div className="text-xs opacity-70 mt-0.5">{c.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">
                      {c.visitCount || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-ring/10 text-ring border border-ring/20">
                        {c.loyaltyPoints || 0} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
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
