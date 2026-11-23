"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useTransition, useMemo } from "react";
import { BookingApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
} from "lucide-react";
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
  const watchedStartsAt = watch("startsAt");

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

  // Group slots by time of day (Morning, Afternoon, Evening)
  const groupedSlots = useMemo(() => {
    const morning: Array<{ starts_at: string; formatted: string }> = [];
    const afternoon: Array<{ starts_at: string; formatted: string }> = [];
    const evening: Array<{ starts_at: string; formatted: string }> = [];

    availableSlots.forEach(slot => {
      const date = new Date(slot.starts_at);
      const hours = date.getHours();
      const formatted = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      if (hours < 13) {
        morning.push({ starts_at: slot.starts_at, formatted });
      } else if (hours < 17) {
        afternoon.push({ starts_at: slot.starts_at, formatted });
      } else {
        evening.push({ starts_at: slot.starts_at, formatted });
      }
    });

    return { morning, afternoon, evening };
  }, [availableSlots]);

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
        <Loader2 className="w-8 h-8 animate-spin text-[#252628]" />
        <p className="font-serif-editorial text-lg text-[#46443f]">Loading salon rituals...</p>
      </div>
    );
  }

  if (result?.success) {
    const email = getValues('customerEmail');
    const phone = getValues('customerPhone');
    return (
      <div className="flex flex-col items-center text-center py-10 px-4 gap-6 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 border border-[#252628] rounded-full flex items-center justify-center bg-white">
          <CheckCircle2 className="w-8 h-8 text-[#252628]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-editorial text-4xl text-[#252628]">Reservation Confirmed</h2>
          <div className="hairline-dark max-w-xs mx-auto my-3" />
          <p className="font-serif-editorial text-lg text-[#46443f] max-w-sm mx-auto leading-relaxed">
            Your appointment has been noted at Naturals Unisex Salon Kottakkal. We look forward to your visit.
          </p>
        </div>
        
        <div className="bg-white/90 border border-[#252628] w-full max-w-md p-6 text-left space-y-4 mt-2">
          <div className="flex items-center justify-between border-b border-[#252628]/20 pb-3 text-xs">
            <span className="font-sans-label text-[10px] font-semibold text-[#252628]">Booking Details</span>
            <span className="font-sans-label text-[10px] font-semibold px-2 py-0.5 bg-[#252628] text-white">
              CONFIRMED
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-serif-editorial">
            <span className="text-[#46443f]">Contact</span>
            <span className="font-semibold text-[#252628]">{phone}</span>
          </div>
          {email && (
            <div className="flex justify-between items-center text-sm font-serif-editorial">
              <span className="text-[#46443f]">Email</span>
              <span className="font-semibold text-[#252628]">{email}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-[#252628]/20 text-xs font-serif-editorial text-[#46443f]">
            <span>Location</span>
            <span className="text-right font-medium text-[#252628]">Al Wahad Complex, Kottakkal</span>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/')}
          type="button"
          className="mt-4 w-full max-w-md font-sans-label text-[11px] font-semibold py-3.5 bg-[#252628] text-white hover:opacity-90 transition active:scale-95"
        >
          Return to Salon Menu
        </button>
      </div>
    );
  }

  const selectedService = services.find(s => s.id === watchedServiceId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* 4-STEP EDITORIAL STEPPER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[
          { step: 1, label: "Treatment" },
          { step: 2, label: "Schedule" },
          { step: 3, label: "Guest Details" },
          { step: 4, label: "Confirm" },
        ].map((s) => {
          const isActive = currentStep === s.step;
          const isPassed = currentStep > s.step;
          return (
            <button
              type="button"
              key={s.step}
              onClick={() => {
                if (s.step < currentStep || (s.step === 2 && watchedServiceId) || (s.step === 3 && watchedDate && watchedStartsAt)) {
                  setCurrentStep(s.step as 1 | 2 | 3 | 4);
                }
              }}
              className={`flex items-center gap-2.5 px-3.5 py-3 border text-left transition-all ${
                isActive
                  ? "bg-[#252628] text-white border-[#252628]"
                  : isPassed
                  ? "bg-white/80 text-[#252628] border-[#252628]"
                  : "bg-transparent text-[#252628]/60 border-[#252628]/30"
              }`}
            >
              <span className="font-sans-label text-[10px] font-bold">
                0{s.step}
              </span>
              <span className="font-sans-label text-[10px] font-semibold tracking-wider">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {result && !result.success && (
        <div className="flex items-start gap-3 bg-red-100 border border-red-400 p-4 text-sm text-red-900 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-serif-editorial text-base">{result.message ?? "Something went wrong. Please try again."}</span>
        </div>
      )}

      {/* STEP 1: SERVICE SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#252628]/30">
            <div>
              <h3 className="font-serif-editorial text-3xl text-[#252628]">Select Treatment</h3>
              <p className="font-serif-editorial text-sm text-[#46443f] mt-0.5">Choose your desired beauty or hair service</p>
            </div>
            <span className="font-sans-label text-[10px] text-[#252628] border border-[#252628] px-3 py-1">
              {services.length} rituals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s: Service) => {
              const isSelected = watchedServiceId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => control._fields.serviceId?._f && control.register("serviceId").onChange({ target: { value: s.id } })}
                  className={`p-5 border cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected
                      ? "bg-[#252628] text-white border-[#252628] shadow-sm"
                      : "bg-white/80 border-[#252628]/40 hover:border-[#252628] hover:bg-white text-[#252628]"
                  }`}
                >
                  <div className="pr-4">
                    <h4 className="font-serif-editorial text-xl font-medium mb-1">{s.name}</h4>
                    <p className={`font-serif-editorial text-sm ${isSelected ? "text-white/80" : "text-[#46443f]"}`}>
                      {s.durationMinutes ? `${s.durationMinutes} mins` : "Approx 45 mins"}
                    </p>
                  </div>
                  <span className={`font-sans-label text-[10px] font-semibold px-2.5 py-1 border ${
                    isSelected ? "border-white/50 text-white" : "border-[#252628]/40 text-[#252628]"
                  }`}>
                    Select
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
            <button
              type="button"
              disabled={!watchedServiceId}
              onClick={() => setCurrentStep(2)}
              className="font-sans-label text-[11px] font-semibold px-8 py-3.5 bg-[#252628] text-white hover:opacity-90 transition disabled:opacity-40"
            >
              Continue to Schedule →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#252628]/30 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-serif-editorial text-3xl text-[#252628]">Choose Date &amp; Time</h3>
              <p className="font-serif-editorial text-sm text-[#46443f] mt-0.5">
                {selectedService ? selectedService.name : "Selected Treatment"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="font-sans-label text-[10px] font-semibold text-[#252628] underline"
            >
              Change Ritual
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans-label text-[10px] font-semibold text-[#252628] flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-[#252628]" /> Appointment Date *
              </label>
              <Controller
                control={control}
                name="preferredDate"
                render={({ field }) => (
                  <input 
                    type="date" 
                    className="flex w-full border border-[#252628]/60 bg-white/90 h-12 px-4 font-serif-editorial text-lg text-[#252628] focus:outline-none focus:border-[#252628]" 
                    value={field.value || ""} 
                    min={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })} 
                    onChange={(evt) => field.onChange(evt.target.value)} 
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans-label text-[10px] font-semibold text-[#252628] flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-[#252628]" /> Stylist / Specialist
              </label>
              <Controller
                control={control}
                name="staffId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12 bg-white/90 border-[#252628]/60 rounded-none text-base font-serif-editorial">
                      <SelectValue placeholder="Any Master Stylist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Available Stylist (Fastest)</SelectItem>
                      {staff.map((s: Staff) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* TIME SLOTS GROUPED BY TIME OF DAY */}
          <div className="space-y-4 pt-2">
            <label className="font-sans-label text-[10px] font-semibold text-[#252628] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#252628]" /> Available Slot *
            </label>
            
            {isLoadingSlots ? (
              <div className="py-12 flex items-center justify-center font-serif-editorial text-base text-[#46443f] gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#252628]" /> Checking live studio calendar...
              </div>
            ) : !watchedDate ? (
              <div className="font-serif-editorial text-base text-[#46443f] bg-white/60 p-5 border border-[#252628]/30 text-center">
                Please pick a date above to view available time slots.
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="font-serif-editorial text-base text-amber-950 bg-amber-100/70 p-5 border border-amber-300 text-center">
                All slots are booked for this date. Please pick another date or call our front desk directly.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Morning Slots */}
                {groupedSlots.morning.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-sans-label text-[10px] font-semibold text-[#46443f]">
                      <Sun className="w-3.5 h-3.5 text-amber-700" />
                      <span>Morning (10:00 AM – 1:00 PM)</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {groupedSlots.morning.map(slot => {
                        const isSelected = watch("startsAt") === slot.starts_at;
                        return (
                          <button
                            type="button"
                            key={slot.starts_at}
                            onClick={() => control._fields.startsAt?._f && control.register("startsAt").onChange({ target: { value: slot.starts_at } })}
                            className={`py-2 px-2 text-xs font-serif-editorial font-medium border transition-all text-center ${
                              isSelected
                                ? "bg-[#252628] text-white border-[#252628] font-bold"
                                : "bg-white/80 border-[#252628]/40 text-[#252628] hover:border-[#252628] hover:bg-white"
                            }`}
                          >
                            {slot.formatted}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Afternoon Slots */}
                {groupedSlots.afternoon.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-sans-label text-[10px] font-semibold text-[#46443f]">
                      <Sunset className="w-3.5 h-3.5 text-amber-800" />
                      <span>Afternoon (1:00 PM – 5:00 PM)</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {groupedSlots.afternoon.map(slot => {
                        const isSelected = watch("startsAt") === slot.starts_at;
                        return (
                          <button
                            type="button"
                            key={slot.starts_at}
                            onClick={() => control._fields.startsAt?._f && control.register("startsAt").onChange({ target: { value: slot.starts_at } })}
                            className={`py-2 px-2 text-xs font-serif-editorial font-medium border transition-all text-center ${
                              isSelected
                                ? "bg-[#252628] text-white border-[#252628] font-bold"
                                : "bg-white/80 border-[#252628]/40 text-[#252628] hover:border-[#252628] hover:bg-white"
                            }`}
                          >
                            {slot.formatted}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Evening Slots */}
                {groupedSlots.evening.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-sans-label text-[10px] font-semibold text-[#46443f]">
                      <Moon className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Evening (5:00 PM – 9:00 PM)</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {groupedSlots.evening.map(slot => {
                        const isSelected = watch("startsAt") === slot.starts_at;
                        return (
                          <button
                            type="button"
                            key={slot.starts_at}
                            onClick={() => control._fields.startsAt?._f && control.register("startsAt").onChange({ target: { value: slot.starts_at } })}
                            className={`py-2 px-2 text-xs font-serif-editorial font-medium border transition-all text-center ${
                              isSelected
                                ? "bg-[#252628] text-white border-[#252628] font-bold"
                                : "bg-white/80 border-[#252628]/40 text-[#252628] hover:border-[#252628] hover:bg-white"
                            }`}
                          >
                            {slot.formatted}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="font-sans-label text-[10px] font-semibold px-6 py-3 border border-[#252628]/60 text-[#252628] hover:bg-white transition"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!watchedDate || !watchedStartsAt}
              onClick={() => setCurrentStep(3)}
              className="font-sans-label text-[11px] font-semibold px-8 py-3.5 bg-[#252628] text-white hover:opacity-90 transition disabled:opacity-40"
            >
              Continue to Details →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER DETAILS */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#252628]/30 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-serif-editorial text-3xl text-[#252628]">Guest Information</h3>
              <p className="font-serif-editorial text-sm text-[#46443f] mt-0.5">Please provide your contact details for appointment confirmation</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="font-sans-label text-[10px] font-semibold text-[#252628] underline"
            >
              Change Date/Time
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-sans-label text-[10px] font-semibold text-[#252628] mb-1.5">Full Name *</label>
              <input
                {...register("customerName", { required: true })}
                placeholder="e.g. Ayesha Rahman"
                className="w-full bg-white/90 border border-[#252628]/60 px-4 py-2.5 font-serif-editorial text-lg text-[#252628] focus:outline-none focus:border-[#252628]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans-label text-[10px] font-semibold text-[#252628] mb-1.5">Mobile Phone / WhatsApp *</label>
                <input
                  {...register("customerPhone", { required: true })}
                  placeholder="10-digit mobile number"
                  type="tel"
                  className="w-full bg-white/90 border border-[#252628]/60 px-4 py-2.5 font-serif-editorial text-lg text-[#252628] focus:outline-none focus:border-[#252628]"
                />
              </div>

              <div>
                <label className="block font-sans-label text-[10px] font-semibold text-[#252628] mb-1.5">
                  Email <span className="text-[#46443f] font-normal lowercase">(for confirmation)</span>
                </label>
                <input
                  {...register("customerEmail")}
                  placeholder="ayesha@example.com"
                  type="email"
                  className="w-full bg-white/90 border border-[#252628]/60 px-4 py-2.5 font-serif-editorial text-lg text-[#252628] focus:outline-none focus:border-[#252628]"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans-label text-[10px] font-semibold text-[#252628] mb-1.5">
                Special Requests or Notes <span className="text-[#46443f] font-normal lowercase">(optional)</span>
              </label>
              <input
                {...register("notes")}
                placeholder="Allergies, preferences, or specific styling requests"
                className="w-full bg-white/90 border border-[#252628]/60 px-4 py-2.5 font-serif-editorial text-lg text-[#252628] focus:outline-none focus:border-[#252628]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="font-sans-label text-[10px] font-semibold px-6 py-3 border border-[#252628]/60 text-[#252628] hover:bg-white transition"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!watch("customerName") || !watch("customerPhone")}
              onClick={() => setCurrentStep(4)}
              className="font-sans-label text-[11px] font-semibold px-8 py-3.5 bg-[#252628] text-white hover:opacity-90 transition disabled:opacity-40"
            >
              Review Summary →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRM & SUBMIT */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#252628]/30 pb-3">
            <h3 className="font-serif-editorial text-3xl text-[#252628]">Review &amp; Confirm</h3>
            <p className="font-serif-editorial text-sm text-[#46443f] mt-0.5">Please verify your reservation details</p>
          </div>

          <div className="bg-white/90 border border-[#252628] p-6 md:p-8 space-y-4 font-serif-editorial text-base">
            <div className="flex justify-between items-center border-b border-[#252628]/20 pb-3">
              <span className="font-sans-label text-[10px] text-[#46443f]">Ritual</span>
              <span className="font-semibold text-lg text-[#252628]">{selectedService?.name || "Selected Service"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#252628]/20 pb-3">
              <span className="font-sans-label text-[10px] text-[#46443f]">Date</span>
              <span className="text-[#252628]">{watchedDate}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#252628]/20 pb-3">
              <span className="font-sans-label text-[10px] text-[#46443f]">Time</span>
              <span className="text-[#252628]">
                {watchedStartsAt
                  ? new Date(watchedStartsAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })
                  : ""}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[#252628]/20 pb-3">
              <span className="font-sans-label text-[10px] text-[#46443f]">Guest</span>
              <span className="text-[#252628]">{watch("customerName")} ({watch("customerPhone")})</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-xs text-[#46443f]">
              <span>Salon</span>
              <span className="text-right font-medium text-[#252628]">Naturals Unisex Salon Kottakkal (Changuvetty)</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/70 p-4 border border-[#252628]/40">
            <input
              type="checkbox"
              {...register("consent")}
              defaultChecked
              className="mt-1 h-4 w-4 rounded-none text-[#252628] focus:ring-[#252628] accent-[#252628]"
            />
            <label className="font-serif-editorial text-sm text-[#46443f] leading-relaxed">
              I agree to the salon appointment and cancellation terms. No advance fee is required today.
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full font-sans-label text-[11px] font-semibold py-4 bg-[#252628] text-white hover:opacity-90 transition active:scale-95"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Securing Your Appointment...
                </span>
              ) : (
                "Confirm & Reserve Visit"
              )}
            </button>
            
            <p className="text-center font-serif-editorial text-sm text-[#46443f] pt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#252628]" />
              <span>Instant confirmation • Pay at salon after treatment</span>
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
