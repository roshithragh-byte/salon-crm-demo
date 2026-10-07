"use client";

import { useEffect, useState, useCallback } from "react";
import { BookingApi, Staff } from "@/lib/api/services";
import { UserCheck, Sparkles, Plus, Loader2 } from "lucide-react";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchStaff = useCallback(() => {
    BookingApi.getAvailableStaff("hq")
      .then((res) => setStaff(res.data || []))
      .catch((err: unknown) => console.error("Failed to load staff", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await BookingApi.createStaff("hq", formData);
      setFormData({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchStaff();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create staff account");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Team &amp; Stylists</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your salon&apos;s professional staff members.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          {showForm ? "Cancel" : <><Plus className="w-4 h-4" /> Add Staff</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-serif font-semibold mb-4">Create Staff Account</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                required 
                type="text" 
                className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                required 
                type="email" 
                className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                required 
                type="password" 
                className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
            </div>
            <button 
              type="submit" 
              disabled={creating}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            </button>
          </form>
        </div>
      )}

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
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
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
