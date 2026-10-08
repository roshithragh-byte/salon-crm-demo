"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { BookingApi } from "@/lib/api/services";
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
  const [availableSlots, setAvailableSlots] = useState<Array<{ starts_at: string }>>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(
    initialServices.length === 0 && initialStaff.length === 0
  );

  const slotRequestSeqRef = useState(() => ({ current: 0 }))[0];
  const isSubmittingState = useState(() => ({ current: false }))[0];

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
    const controller = new AbortController();
    const currentSeq = ++slotRequestSeqRef.current;

    if (watchedDate && watchedServiceId) {
      setIsLoadingSlots(true);
      BookingApi.getAvailability(
        'hq',
        watchedDate,
        watchedServiceId,
        watchedStaffId === "any" ? undefined : watchedStaffId,
        { signal: controller.signal }
      )
        .then(res => {
          if (!controller.signal.aborted && currentSeq === slotRequestSeqRef.current) {
            setAvailableSlots(res?.data?.slots || []);
          }
        })
        .catch(err => {
          if (err?.name !== 'AbortError' && currentSeq === slotRequestSeqRef.current) {
            console.error('Availability fetch error:', err);
            setAvailableSlots([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted && currentSeq === slotRequestSeqRef.current) {
            setIsLoadingSlots(false);
          }
        });
    } else {
      setAvailableSlots([]);
    }
    return () => {
      controller.abort();
    };
  }, [watchedDate, watchedServiceId, watchedStaffId, slotRequestSeqRef]);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const onSubmit = (data: BookingFormData) => {
    if (isSubmittingState.current) return;
    isSubmittingState.current = true;
    setResult(null);

    startTransition(async () => {
      try {
        const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `idemp_${Date.now()}_${Math.random()}`;

        const bookingJson = await BookingApi.createBooking(
          'hq',
          {
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail || null,
            serviceId: data.serviceId,
            stylistId: data.staffId === "any" ? null : (data.staffId || null),
            startsAt: data.startsAt,
            notes: data.notes || null,
          },
          idempotencyKey
        );
        const bookingId = bookingJson.data.id;

        // Initialize server-authoritative payment order
        await BookingApi.initializePayment('hq', bookingId, `pay_${idempotencyKey}`);

        setResult({ success: true });
        reset();
      } catch (err: unknown) {
        console.error("Failed to create booking", err);
        if (err instanceof Error && err.message === 'Unauthorized') {
          router.push('/admin/login');
        } else if (err instanceof Error) {
          setResult({ success: false, message: err.message });
        } else {
          setResult({ success: false, message: 'Failed to create booking' });
        }
      } finally {
        isSubmittingState.current = false;
      }
    });
  };

  if (isFetchingMetadata) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#681A8C]" />
        <p className="text-[#6B5E70] font-medium text-sm">Loading salon services...</p>
      </div>
    );
  }

  if (result?.success) {
    const email = getValues('customerEmail');
    const phone = getValues('customerPhone');
    return (
      <div className="flex flex-col items-center text-center py-12 px-4 gap-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[#DCFCE7] rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[#15803D]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-[#2E1033]">Booking Confirmed</h2>
          <p className="text-[#6B5E70] max-w-sm text-sm mx-auto">
            Your appointment has been successfully scheduled at Natural&apos;s Salon Kottakkal. We look forward to seeing you.
          </p>
        </div>
        
        <div className="bg-[#FBF9FC] border border-[#EADBEE] rounded-2xl w-full max-w-md p-6 text-left space-y-4 mt-2">
          <h3 className="font-bold text-xs text-[#6B5E70] uppercase tracking-wider mb-2">Confirmation Details</h3>
          <div className="flex justify-between items-center border-b border-[#EADBEE] pb-3 text-sm">
            <span className="text-[#6B5E70]">Phone / WhatsApp</span>
            <span className="font-medium text-[#29232D]">{phone}</span>
          </div>
          {email && (
            <div className="flex justify-between items-center border-b border-[#EADBEE] pb-3 text-sm">
              <span className="text-[#6B5E70]">Email</span>
              <span className="font-medium text-[#29232D]">{email}</span>
            </div>
          )}
          <div className="flex justify-between items-center pb-1 text-sm">
            <span className="text-[#6B5E70]">Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              CONFIRMED
            </span>
          </div>
        </div>
        
        <Button size="lg" onClick={() => router.push('/')} className="mt-6 w-full max-w-md h-12 bg-[#681A8C] hover:bg-[#7D22A7] text-white rounded-xl text-sm font-medium">
          Return to Homepage
        </Button>
      </div>
    );
  }

  // Predefined service catalog prices fallback for display cards
  const getServicePrice = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("haircut") || lower.includes("hair styling")) return "₹800";
    if (lower.includes("skin") || lower.includes("facial")) return "From ₹1500";
    if (lower.includes("signature") || lower.includes("package")) return "From ₹2500";
    return "From ₹600";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* 4-STEP LINEAR STEPPER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { step: 1, label: "Service" },
          { step: 2, label: "Date & time" },
          { step: 3, label: "Details" },
          { step: 4, label: "Confirm" },
        ].map((s) => {
          const isActive = currentStep === s.step;
          const isPassed = currentStep > s.step;
          return (
            <button
              type="button"
              key={s.step}
              onClick={() => {
                if (s.step < currentStep || (s.step === 2 && watchedServiceId) || (s.step === 3 && watchedDate && watch("startsAt"))) {
                  setCurrentStep(s.step as 1 | 2 | 3 | 4);
                }
              }}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? "bg-[#E8D1F0] text-[#681A8C] shadow-sm"
                  : isPassed
                  ? "bg-[#F3E8F7] text-[#681A8C]"
                  : "bg-[#FBF9FC] text-[#6B5E70] border border-[#EADBEE]"
              }`}
            >
              <span className="font-bold">{s.step}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {result && !result.success && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{result.message ?? "Something went wrong. Please try again."}</span>
        </div>
      )}

      {/* STEP 1: SERVICE SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-[#EADBEE] pb-3">
            <h3 className="text-lg font-bold text-[#2E1033]">Select Service</h3>
            <span className="text-xs text-[#6B5E70]">{services.length} options available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s: Service) => {
              const isSelected = watchedServiceId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => control._fields.serviceId?._f && control.register("serviceId").onChange({ target: { value: s.id } })}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected
                      ? "bg-[#E8D1F0] border-[#681A8C] shadow-sm"
                      : "bg-white border-[#EADBEE] hover:border-[#681A8C]/50 hover:bg-[#FBF9FC]"
                  }`}
                >
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-[#29232D] mb-1">{s.name}</h4>
                    <p className="text-xs text-[#6B5E70]">
                      {s.durationMinutes ? `${s.durationMinutes} mins` : "Approx 45 mins"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#681A8C] whitespace-nowrap bg-white/80 px-2.5 py-1 rounded-lg border border-[#EADBEE]">
                    {getServicePrice(s.name)}
                  </span>
                </div>
              );
            })}
          </div>

          <Controller
            control={control}
            name="serviceId"
            render={({ field }) => (
              <input type="hidden" value={field.value || ""} />
            )}
          />

          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              disabled={!watchedServiceId}
              onClick={() => setCurrentStep(2)}
              className="bg-[#681A8C] hover:bg-[#7D22A7] text-white px-8 h-12 rounded-xl text-sm font-medium shadow-md disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-[#EADBEE] pb-3 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#2E1033]">Choose Date & Time</h3>
            <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-[#681A8C] hover:underline font-medium">
              Change Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#29232D] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#681A8C]" /> Date *
              </label>
              <Controller
                control={control}
                name="preferredDate"
                render={({ field }) => (
                  <input 
                    type="date" 
                    className="flex w-full rounded-xl border border-[#EADBEE] bg-[#FBF9FC] h-12 px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#681A8C]" 
                    value={field.value || ""} 
                    min={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })} 
                    onChange={(evt) => field.onChange(evt.target.value)} 
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#29232D] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#681A8C]" /> Stylist (optional)
              </label>
              <Controller
                control={control}
                name="staffId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12 bg-[#FBF9FC] border-[#EADBEE] rounded-xl text-sm">
                      <SelectValue placeholder="Any Available Stylist" />
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

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#29232D] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#681A8C]" /> Available Time Slots *
            </label>
            
            {isLoadingSlots ? (
              <div className="py-8 flex items-center justify-center text-xs text-[#6B5E70] gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#681A8C]" /> Loading available slots...
              </div>
            ) : !watchedDate ? (
              <p className="text-xs text-[#6B5E70] bg-[#FBF9FC] p-4 rounded-xl border border-[#EADBEE]">
                Please select a date above to view available time slots.
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="text-xs text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                No open slots available for this date. Please try another date.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map(slot => {
                  const isSelected = watch("startsAt") === slot.starts_at;
                  const timeString = new Date(slot.starts_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  });
                  return (
                    <button
                      type="button"
                      key={slot.starts_at}
                      onClick={() => control._fields.startsAt?._f && control.register("startsAt").onChange({ target: { value: slot.starts_at } })}
                      className={`p-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        isSelected
                          ? "bg-[#681A8C] text-white border-[#681A8C] shadow-sm"
                          : "bg-white border-[#EADBEE] text-[#29232D] hover:border-[#681A8C]/50 hover:bg-[#FBF9FC]"
                      }`}
                    >
                      {timeString}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="border-[#EADBEE] h-12 rounded-xl text-xs text-[#29232D]"
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={!watchedDate || !watch("startsAt")}
              onClick={() => setCurrentStep(3)}
              className="bg-[#681A8C] hover:bg-[#7D22A7] text-white px-8 h-12 rounded-xl text-sm font-medium shadow-md disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER DETAILS */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-[#EADBEE] pb-3 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#2E1033]">Contact Information</h3>
            <button type="button" onClick={() => setCurrentStep(2)} className="text-xs text-[#681A8C] hover:underline font-medium">
              Change Date/Time
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#29232D]">Full Name *</label>
              <Input {...register("customerName")} placeholder="Enter your full name" className="h-12 bg-[#FBF9FC] border-[#EADBEE] rounded-xl text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#29232D]">Mobile Phone *</label>
                <Input {...register("customerPhone")} placeholder="10-digit phone number" type="tel" className="h-12 bg-[#FBF9FC] border-[#EADBEE] rounded-xl text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#29232D]">Email <span className="text-[#6B5E70] font-normal">(optional)</span></label>
                <Input {...register("customerEmail")} placeholder="you@example.com" type="email" className="h-12 bg-[#FBF9FC] border-[#EADBEE] rounded-xl text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#29232D]">Special Requests <span className="text-[#6B5E70] font-normal">(optional)</span></label>
              <Input {...register("notes")} placeholder="Any specific requirements or notes" className="h-12 bg-[#FBF9FC] border-[#EADBEE] rounded-xl text-sm" />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="border-[#EADBEE] h-12 rounded-xl text-xs text-[#29232D]"
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={!watch("customerName") || !watch("customerPhone")}
              onClick={() => setCurrentStep(4)}
              className="bg-[#681A8C] hover:bg-[#7D22A7] text-white px-8 h-12 rounded-xl text-sm font-medium shadow-md disabled:opacity-50"
            >
              Review Booking
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRM & SUBMIT */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-[#EADBEE] pb-3">
            <h3 className="text-lg font-bold text-[#2E1033]">Confirm Booking Details</h3>
          </div>

          <div className="bg-[#FBF9FC] border border-[#EADBEE] rounded-2xl p-6 space-y-4 text-sm">
            <div className="flex justify-between items-center border-b border-[#EADBEE] pb-3">
              <span className="text-[#6B5E70]">Service</span>
              <span className="font-bold text-[#2E1033]">{services.find(s => s.id === watchedServiceId)?.name || "Selected Service"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#EADBEE] pb-3">
              <span className="text-[#6B5E70]">Date</span>
              <span className="font-medium text-[#29232D]">{watchedDate}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#EADBEE] pb-3">
              <span className="text-[#6B5E70]">Time</span>
              <span className="font-medium text-[#29232D]">
                {watch("startsAt") ? new Date(watch("startsAt")).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }) : ""}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[#EADBEE] pb-3">
              <span className="text-[#6B5E70]">Guest</span>
              <span className="font-medium text-[#29232D]">{watch("customerName")} ({watch("customerPhone")})</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#FBF9FC] rounded-xl p-4 border border-[#EADBEE]">
            <input type="checkbox" {...register("consent")} defaultChecked className="mt-1 h-4 w-4 rounded text-[#681A8C] focus:ring-[#681A8C] accent-[#681A8C]" />
            <label className="text-xs text-[#6B5E70] leading-relaxed">
              I agree to the salon&apos;s booking and privacy terms.
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <Button type="submit" disabled={isPending} className="w-full h-14 bg-[#681A8C] hover:bg-[#7D22A7] text-white text-sm font-bold tracking-wide rounded-xl shadow-lg shadow-[#681A8C]/25">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scheduling Appointment...
                </>
              ) : (
                "Confirm & Reserve"
              )}
            </Button>
            
            <p className="text-center text-xs text-[#6B5E70] pt-1">
              Secure booking • No payment required to reserve
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
