"use client";

import { BookingApi } from '@/lib/api/services';
import { ApiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useWatch } from "react-hook-form";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Slot {
  starts_at: string;
}



interface WebhookResponse {
  received: boolean;
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

const formSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
  serviceId: z.string().min(1, "Please select a service"),
  staffId: z.string().optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a date"),
  startsAt: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
  consent: z.boolean().refine(val => val, "You must provide consent"),
});
type FormValues = z.infer<typeof formSchema>;

export default function BookingForm({ services, staff }: { services: Service[], staff: Staff[] }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, control, reset, getValues } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { consent: true }
  });

  const watchedDate = useWatch({ control, name: "preferredDate" });
  const watchedServiceId = useWatch({ control, name: "serviceId" });
  const watchedStaffId = useWatch({ control, name: "staffId" });

  useEffect(() => {
    let cancelled = false;
    if (watchedDate && watchedServiceId) {
      (async () => {
        try {
          setIsLoadingSlots(true);
          const stylistId = watchedStaffId && watchedStaffId !== "any" ? watchedStaffId : undefined;
          const res = await BookingApi.getAvailability("hq", watchedDate, watchedServiceId, stylistId);
          if (!cancelled) setAvailableSlots(res.data?.slots ?? []);
        } catch (err) {
          console.error("Failed to fetch slots", err);
          if (!cancelled) setAvailableSlots([]);
        } finally {
          if (!cancelled) setIsLoadingSlots(false);
        }
      })();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailableSlots([]);
    }
    return () => { cancelled = true; };
  }, [watchedDate, watchedServiceId, watchedStaffId]);

  const onSubmit = (data: FormValues) => {
    setResult(null);
    startTransition(async () => {
      try {
        const bookingJson = await BookingApi.createBooking('hq', {
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          serviceId: data.serviceId,
          stylistId: data.staffId === "any" ? null : (data.staffId || null),
          startsAt: data.startsAt,
          notes: data.notes || null,
        });
        const bookingId = bookingJson.data.id;

        const paymentJson = await BookingApi.initializePayment('hq', bookingId);

        await ApiClient.post<WebhookResponse>('/payments/webhook/razorpay', {
          order_id: paymentJson.data.providerOrderId
        }, false);

        setResult({ success: true });
        reset();
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed to create booking", err);
          if (err.message === 'Unauthorized') {
            // Redirect to login page
            router.push('/admin/login');
          } else {
            setResult({ success: false, message: 'Failed to create booking' });
          }
        } else {
          console.error("Failed to create booking", err);
          setResult({ success: false, message: 'Failed to create booking' });
        }
      }
    });
  };

  if (result?.success) {
    const email = getValues('customerEmail');
    const phone = getValues('customerPhone');
    return (
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-serif font-bold text-slate-800">Booking Confirmed!</h2>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl w-full text-left space-y-3 mt-2 mb-2">
          <p className="text-slate-700"><span className="font-semibold text-purple-950">Phone / WhatsApp:</span> {phone}</p>
          {email && <p className="text-slate-700"><span className="font-semibold text-purple-950">Email:</span> {email}</p>}
        </div>
        <p className="text-slate-500 max-w-sm text-sm">
          Thank you! We have received your appointment request. An order confirmation will be sent to the contact details provided above.
        </p>
        <Button variant="outline" onClick={() => router.push('/')} className="mt-4">
          Return to Homepage
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {result && !result.success && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{result.message ?? "Something went wrong. Please try again."}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Full Name *</label>
        <Input {...register("customerName")} placeholder="Your full name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Phone Number *</label>
        <Input {...register("customerPhone")} placeholder="10-digit mobile number" type="tel" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Email (optional)</label>
        <Input {...register("customerEmail")} placeholder="you@example.com" type="email" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Service *</label>
        <Controller
          control={control}
          name="serviceId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service">
                  {services.find((s: Service) => s.id === field.value)?.name || "Select a service"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {services.map((s: Service) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Staff (optional)</label>
        <Controller
          control={control}
          name="staffId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Any Available Stylist">
                  {field.value === "any" ? "Any Available Stylist" : staff.find((s: Staff) => s.id === field.value)?.name || "Any Available Stylist"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Available Stylist</SelectItem>
                {staff.map((s: Staff) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Date *</label>
        <Controller
          control={control}
          name="preferredDate"
          render={({ field }) => (
            <input type="date" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={field.value || ""} min={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })} onChange={(evt) => field.onChange(evt.target.value)} />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Time *</label>
        <Controller
          control={control}
          name="startsAt"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedDate || !watchedServiceId || isLoadingSlots}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingSlots ? "Loading slots..." : "Select a time"} />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.length === 0 && !isLoadingSlots ? (
                  <SelectItem value="__none" disabled>No slots for this date</SelectItem>
                ) : (
                  availableSlots.map(slot => {
                    const timeString = new Date(slot.starts_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    });
                    return <SelectItem key={slot.starts_at} value={slot.starts_at}>{timeString}</SelectItem>;
                  })
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Notes (optional)</label>
        <Input {...register("notes")} placeholder="Any special requests?" />
      </div>

      <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 border border-slate-100">
        <input type="checkbox" {...register("consent")} className="mt-0.5 h-4 w-4" />
        <label className="text-sm text-slate-600">I consent to being contacted regarding this appointment.</label>
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-purple-950 hover:bg-purple-800 text-white py-3">
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Appointment Request"}
      </Button>
    </form>
  );
}