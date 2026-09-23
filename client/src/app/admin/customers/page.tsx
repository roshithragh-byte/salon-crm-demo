"use client";

import { useEffect, useState } from "react";
import { AdminCustomerApi } from "@/lib/api/services";
import { Users, Search } from "lucide-react";

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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
          <p className="text-gray-500">Manage your clients, view their history, and loyalty points.</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-4 border-b bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center rounded-t-xl">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filtered.length} total customers
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3 text-right">Visits</th>
                <th className="px-6 py-3 text-right">Loyalty Points</th>
                <th className="px-6 py-3 text-right">Added On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading customers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {c.phoneNumber}
                      {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.visitCount || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {c.loyaltyPoints || 0} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
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
