"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { BookingApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  startsAt: string;
  status: string;
  service?: { name: string };
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number | null;
}

interface Staff {
  id: string;
  name: string;
}

export default function AdminBookingsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // For Admin Create Booking
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    customerPhone: "",
    serviceId: "",
    staffId: "any",
    startsAt: ""
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (showCreateForm && services.length === 0) {
      BookingApi.getAvailableServices("hq").then(res => setServices(res.data || []));
      BookingApi.getAvailableStaff("hq").then(res => setStaff(res.data || []));
    }
  }, [showCreateForm, services.length]);

  const fetchAppointments = async (date: string) => {
    setLoading(true);
    try {
      const res = await BookingApi.getBookings("hq", date);
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await BookingApi.createBooking("hq", {
        customerName: newBooking.customerName,
        customerPhone: newBooking.customerPhone,
        customerEmail: null,
        serviceId: newBooking.serviceId,
        stylistId: newBooking.staffId === "any" ? null : newBooking.staffId,
        startsAt: new Date(newBooking.startsAt).toISOString(),
        notes: "Created by Admin",
      });
      setShowCreateForm(false);
      setNewBooking({ customerName: "", customerPhone: "", serviceId: "", staffId: "any", startsAt: "" });
      fetchAppointments(selectedDate);
    } catch (err) {
      console.error("Failed to create booking", err);
      alert("Failed to create booking. Check console for details.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "Create Appointment"}
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4">New Appointment (Admin)</h2>
          <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <Input 
                required 
                value={newBooking.customerName} 
                onChange={e => setNewBooking({...newBooking, customerName: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer Phone</label>
              <Input 
                required 
                value={newBooking.customerPhone} 
                onChange={e => setNewBooking({...newBooking, customerPhone: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service</label>
              <Select value={newBooking.serviceId} onValueChange={(val: any) => setNewBooking({...newBooking, serviceId: val})}>
                <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
                <SelectContent>
                  {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Staff</label>
              <Select value={newBooking.staffId} onValueChange={(val: any) => setNewBooking({...newBooking, staffId: val})}>
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Available Stylist</SelectItem>
                  {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date & Time</label>
              <Input 
                type="datetime-local" 
                required 
                value={newBooking.startsAt} 
                onChange={e => setNewBooking({...newBooking, startsAt: e.target.value})} 
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Appointments Schedule</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Select Date:</label>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="w-40"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" /></div>
        ) : appointments.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No appointments found for {selectedDate}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 font-medium">
                      {format(new Date(apt.startsAt), "h:mm a")}
                    </td>
                    <td className="py-4">{apt.customerName}</td>
                    <td className="py-4">{apt.customerPhone}</td>
                    <td className="py-4">{apt.service?.name || "N/A"}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
