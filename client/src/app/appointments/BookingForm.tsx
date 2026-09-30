"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { BookingApi } from "@/lib/api/services";
import { ApiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle, Calendar as CalendarIcon, Clock, Scissors, UserCheck, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  staffId?: string;
  preferredDate: string;
  startsAt: string;
  notes?: string;
  consent: boolean;
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number | null;
}

export interface Staff {
  id: string;
  name: string;
}

interface WebhookResponse {
  received: boolean;
}

export interface BookingFormProps {
  initialServices?: Service[];
  initialStaff?: Staff[];
}

export function BookingForm({ initialServices = [], initialStaff = [] }: BookingFormProps = {}) {
  const router = useRouter();
  const { register, handleSubmit, control, watch, reset, getValues } = useForm<BookingFormData>({
    defaultValues: { staffId: "any", consent: true }
  });

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);

  const [services, setServices] = useState<Service[]>(initialServices);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(
    initialServices.length === 0 && initialStaff.length === 0
  );

  const watchedServiceId = watch("serviceId");
  const watchedStaffId = watch("staffId");
  const watchedDate = watch("preferredDate");

  useEffect(() => {
    if (initialServices.length > 0 && initialStaff.length > 0) return;
    Promise.all([
      BookingApi.getAvailableServices('hq'),
      BookingApi.getAvailableStaff('hq')
    ])
    .then(([svcRes, staffRes]) => {
      if (svcRes?.data) setServices(svcRes.data);
      if (staffRes?.data) setStaff(staffRes.data);
    })
    .catch((err) => console.error("Client fetch for booking metadata failed:", err))
    .finally(() => setIsFetchingMetadata(false));
  }, [initialServices.length, initialStaff.length]);

  useEffect(() => {
    if (watchedDate && watchedServiceId) {
      setIsLoadingSlots(true);
      BookingApi.getAvailability('hq', watchedDate, watchedServiceId, watchedStaffId === "any" ? undefined : watchedStaffId)
        .then(res => setAvailableSlots(res.data.slots || []))
        .catch(console.error)
        .finally(() => setIsLoadingSlots(false));
    } else {
      setAvailableSlots([]);
    }
  }, [watchedDate, watchedServiceId, watchedStaffId]);

  const onSubmit = (data: BookingFormData) => {
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

  if (isFetchingMetadata) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading salon services...</p>
      </div>
    );
  }

  if (result?.success) {
    const email = getValues('customerEmail');
    const phone = getValues('customerPhone');
    return (
      <div className="flex flex-col items-center text-center py-12 px-4 gap-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-medium text-foreground">Booking Confirmed</h2>
          <p className="text-muted-foreground max-w-sm text-sm mx-auto">
            Your appointment has been successfully scheduled. We look forward to seeing you.
          </p>
        </div>
        
        <div className="bg-muted/50 border rounded-2xl w-full max-w-md p-6 text-left space-y-4 mt-2">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Confirmation Details</h3>
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-muted-foreground">Phone / WhatsApp</span>
            <span className="font-medium text-foreground">{phone}</span>
          </div>
          {email && (
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{email}</span>
            </div>
          )}
          <div className="flex justify-between items-center pb-1">
            <span className="text-muted-foreground">Payment</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </div>
        </div>
        
        <Button size="lg" onClick={() => router.push('/')} className="mt-6 w-full max-w-md h-12 text-base">
          Return to Homepage
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {result && !result.success && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-4 text-sm text-destructive animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{result.message ?? "Something went wrong. Please try again."}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="border-b pb-2">
          <h3 className="text-lg font-serif font-medium text-foreground">Appointment Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Scissors className="w-4 h-4 text-muted-foreground" /> Service *
            </label>
            <Controller
              control={control}
              name="serviceId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-12 bg-muted/30">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-muted-foreground" /> Stylist (optional)
            </label>
            <Controller
              control={control}
              name="staffId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-12 bg-muted/30">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" /> Date *
            </label>
            <Controller
              control={control}
              name="preferredDate"
              render={({ field }) => (
                <input 
                  type="date" 
                  className="flex w-full rounded-md border border-input bg-muted/30 h-12 px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                  value={field.value || ""} 
                  min={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })} 
                  onChange={(evt) => field.onChange(evt.target.value)} 
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Time *
            </label>
            <Controller
              control={control}
              name="startsAt"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!watchedDate || !watchedServiceId || isLoadingSlots}>
                  <SelectTrigger className="h-12 bg-muted/30">
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
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t">
        <div className="border-b pb-2">
          <h3 className="text-lg font-serif font-medium text-foreground">Your Information</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name *</label>
            <Input {...register("customerName")} placeholder="Your full name" className="h-12 bg-muted/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number *</label>
              <Input {...register("customerPhone")} placeholder="10-digit mobile number" type="tel" className="h-12 bg-muted/30" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input {...register("customerEmail")} placeholder="you@example.com" type="email" className="h-12 bg-muted/30" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
            <Input {...register("notes")} placeholder="Any special requests?" className="h-12 bg-muted/30" />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-muted/30 rounded-xl p-5 border">
        <input type="checkbox" {...register("consent")} className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
        <label className="text-sm text-muted-foreground leading-relaxed">
          I consent to being contacted regarding this appointment and agree to the salon's booking policies.
        </label>
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-14 text-base font-medium shadow-md">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Booking...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Confirm & Pay Securely
          </>
        )}
      </Button>
    </form>
  );
}
