"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useTransition, useMemo } from "react";
import { BookingApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Sparkles,
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
        <Loader2 className="w-8 h-8 animate-spin text-[#5E127E]" />
        <p className="text-[#615668] font-medium text-sm">Loading bespoke services...</p>
      </div>
    );
  }

  if (result?.success) {
    const email = getValues('customerEmail');
    const phone = getValues('customerPhone');
    return (
      <div className="flex flex-col items-center text-center py-10 px-4 gap-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-medium text-[#230B29]">Booking Confirmed</h2>
          <p className="text-[#615668] max-w-sm text-sm mx-auto font-light leading-relaxed">
            Your appointment has been scheduled at Natural&apos;s Salon Kottakkal. We will be delighted to welcome you.
          </p>
        </div>
        
        <div className="bg-[#FAFAF8] border border-[#EFECE6] rounded-2xl w-full max-w-md p-6 text-left space-y-4 mt-2 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#615668]">Confirmation Details</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              CONFIRMED
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-[#615668]">Contact</span>
            <span className="font-medium text-[#1E1822]">{phone}</span>
          </div>
          {email && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#615668]">Email</span>
              <span className="font-medium text-[#1E1822]">{email}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-[#EFECE6] text-xs text-[#615668]">
            <span>Location</span>
            <span className="text-right font-medium text-[#1E1822]">Al Wahad Complex, Kottakkal</span>
          </div>
        </div>
        
        <Button
          size="lg"
          onClick={() => router.push('/')}
          className="mt-4 w-full max-w-md h-12 bg-[#5E127E] hover:bg-[#4D0F68] text-white rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transition-all"
        >
          Return to Homepage
        </Button>
      </div>
    );
  }

  const selectedService = services.find(s => s.id === watchedServiceId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* 4-STEP STREAMLINED STEPPER */}
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
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-medium transition-all text-left ${
                isActive
                  ? "bg-[#F3E8F6] text-[#5E127E] border border-[#E5D3EB] shadow-sm"
                  : isPassed
                  ? "bg-[#FAFAF8] text-[#5E127E] border border-[#EFECE6]"
                  : "bg-white text-[#615668] border border-[#EFECE6] opacity-75"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive || isPassed ? "bg-[#5E127E] text-white" : "bg-[#EFECE6] text-[#615668]"
              }`}>
                {s.step}
              </span>
              <span className="font-semibold tracking-tight">{s.label}</span>
            </button>
          );
        })}
      </div>

      {result && !result.success && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-4 text-sm text-red-700 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{result.message ?? "Something went wrong. Please try again."}</span>
        </div>
      )}

      {/* STEP 1: SERVICE SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
            <div>
              <h3 className="text-xl font-serif font-semibold text-[#230B29]">Select Treatment</h3>
              <p className="text-xs text-[#615668] mt-0.5">Choose your desired beauty or hair service</p>
            </div>
            <span className="text-xs text-[#615668] bg-[#FAFAF8] border border-[#EFECE6] px-3 py-1 rounded-full">
              {services.length} rituals available
            </span>
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
                      ? "bg-[#F3E8F6] border-[#5E127E] shadow-sm ring-1 ring-[#5E127E]"
                      : "bg-white border-[#EFECE6] hover:border-[#5E127E]/40 hover:bg-[#FAFAF8]"
                  }`}
                >
                  <div className="pr-4">
                    <h4 className="text-sm font-serif font-semibold text-[#1E1822] mb-1">{s.name}</h4>
                    <p className="text-xs text-[#615668]">
                      {s.durationMinutes ? `${s.durationMinutes} minutes` : "Approx 45 minutes"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#5E127E] bg-white px-3 py-1.5 rounded-full border border-[#EFECE6] shadow-2xs">
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
            <Button
              type="button"
              disabled={!watchedServiceId}
              onClick={() => setCurrentStep(2)}
              className="bg-[#5E127E] hover:bg-[#4D0F68] text-white px-8 h-12 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md disabled:opacity-40 transition-all"
            >
              <span>Continue to Schedule</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-[#EFECE6] pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif font-semibold text-[#230B29]">Choose Date &amp; Time</h3>
              <p className="text-xs text-[#615668] mt-0.5">
                {selectedService ? selectedService.name : "Selected Treatment"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-[#5E127E] hover:underline font-semibold"
            >
              Change Treatment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1822] flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-[#5E127E]" /> Appointment Date *
              </label>
              <Controller
                control={control}
                name="preferredDate"
                render={({ field }) => (
                  <input 
                    type="date" 
                    className="flex w-full rounded-2xl border border-[#EFECE6] bg-[#FAFAF8] h-12 px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E127E]" 
                    value={field.value || ""} 
                    min={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })} 
                    onChange={(evt) => field.onChange(evt.target.value)} 
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1822] flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-[#5E127E]" /> Stylist / Therapist
              </label>
              <Controller
                control={control}
                name="staffId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12 bg-[#FAFAF8] border-[#EFECE6] rounded-2xl text-sm">
                      <SelectValue placeholder="Any Master Stylist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Master Stylist (Fastest confirmation)</SelectItem>
                      {staff.map((s: Staff) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* TIME SLOTS GROUPED BY TIME OF DAY */}
          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1E1822] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#5E127E]" /> Available Slot *
            </label>
            
            {isLoadingSlots ? (
              <div className="py-12 flex items-center justify-center text-xs text-[#615668] gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#5E127E]" /> Loading live availability...
              </div>
            ) : !watchedDate ? (
              <div className="text-xs text-[#615668] bg-[#FAFAF8] p-5 rounded-2xl border border-[#EFECE6] text-center">
                Please pick a date above to view open slots.
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-xs text-amber-800 bg-amber-50 p-5 rounded-2xl border border-amber-200 text-center">
                All appointments are booked for this date. Please pick another date or call our front desk directly.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Morning Slots */}
                {groupedSlots.morning.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#615668] uppercase tracking-wider">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
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
                            className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                              isSelected
                                ? "bg-[#5E127E] text-white border-[#5E127E] shadow-sm font-bold"
                                : "bg-white border-[#EFECE6] text-[#1E1822] hover:border-[#5E127E]/50 hover:bg-[#FAFAF8]"
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
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#615668] uppercase tracking-wider">
                      <Sunset className="w-3.5 h-3.5 text-amber-600" />
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
                            className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                              isSelected
                                ? "bg-[#5E127E] text-white border-[#5E127E] shadow-sm font-bold"
                                : "bg-white border-[#EFECE6] text-[#1E1822] hover:border-[#5E127E]/50 hover:bg-[#FAFAF8]"
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
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#615668] uppercase tracking-wider">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
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
                            className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                              isSelected
                                ? "bg-[#5E127E] text-white border-[#5E127E] shadow-sm font-bold"
                                : "bg-white border-[#EFECE6] text-[#1E1822] hover:border-[#5E127E]/50 hover:bg-[#FAFAF8]"
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="border-[#EFECE6] h-12 rounded-full px-6 text-xs text-[#1E1822] hover:bg-[#FAFAF8]"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
            </Button>
            <Button
              type="button"
              disabled={!watchedDate || !watchedStartsAt}
              onClick={() => setCurrentStep(3)}
              className="bg-[#5E127E] hover:bg-[#4D0F68] text-white px-8 h-12 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md disabled:opacity-40 transition-all"
            >
              <span>Continue to Details</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER DETAILS */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-[#EFECE6] pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif font-semibold text-[#230B29]">Guest Information</h3>
              <p className="text-xs text-[#615668] mt-0.5">Please provide your contact details for appointment confirmation</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-[#5E127E] hover:underline font-semibold"
            >
              Change Date/Time
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1822]">Full Name *</label>
              <Input
                {...register("customerName", { required: true })}
                placeholder="e.g. Ayesha Rahman"
                className="h-12 bg-[#FAFAF8] border-[#EFECE6] rounded-2xl text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E1822]">Mobile Phone / WhatsApp *</label>
                <Input
                  {...register("customerPhone", { required: true })}
                  placeholder="10-digit mobile number"
                  type="tel"
                  className="h-12 bg-[#FAFAF8] border-[#EFECE6] rounded-2xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E1822]">
                  Email <span className="text-[#615668] font-normal lowercase">(for calendar invite)</span>
                </label>
                <Input
                  {...register("customerEmail")}
                  placeholder="ayesha@example.com"
                  type="email"
                  className="h-12 bg-[#FAFAF8] border-[#EFECE6] rounded-2xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1822]">
                Special Requests or Notes <span className="text-[#615668] font-normal lowercase">(optional)</span>
              </label>
              <Input
                {...register("notes")}
                placeholder="Allergies, preferences, or specific styling requests"
                className="h-12 bg-[#FAFAF8] border-[#EFECE6] rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="border-[#EFECE6] h-12 rounded-full px-6 text-xs text-[#1E1822] hover:bg-[#FAFAF8]"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
            </Button>
            <Button
              type="button"
              disabled={!watch("customerName") || !watch("customerPhone")}
              onClick={() => setCurrentStep(4)}
              className="bg-[#5E127E] hover:bg-[#4D0F68] text-white px-8 h-12 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md disabled:opacity-40 transition-all"
            >
              <span>Review Summary</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRM & SUBMIT */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-[#EFECE6] pb-3">
            <h3 className="text-xl font-serif font-semibold text-[#230B29]">Review &amp; Confirm</h3>
            <p className="text-xs text-[#615668] mt-0.5">Please verify your reservation details</p>
          </div>

          <div className="bg-[#FAFAF8] border border-[#EFECE6] rounded-3xl p-6 md:p-8 space-y-4 text-sm shadow-sm">
            <div className="flex justify-between items-center border-b border-[#EFECE6] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#615668]">Ritual</span>
              <span className="font-serif font-semibold text-[#1E1822]">{selectedService?.name || "Selected Service"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#EFECE6] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#615668]">Date</span>
              <span className="font-medium text-[#1E1822]">{watchedDate}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#EFECE6] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#615668]">Time</span>
              <span className="font-medium text-[#1E1822]">
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
            <div className="flex justify-between items-center border-b border-[#EFECE6] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#615668]">Guest</span>
              <span className="font-medium text-[#1E1822]">{watch("customerName")} ({watch("customerPhone")})</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-xs text-[#615668]">
              <span>Salon</span>
              <span className="text-right font-medium text-[#1E1822]">Natural&apos;s Salon Kottakkal (Changuvetty)</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-[#EFECE6]">
            <input
              type="checkbox"
              {...register("consent")}
              defaultChecked
              className="mt-1 h-4 w-4 rounded text-[#5E127E] focus:ring-[#5E127E] accent-[#5E127E]"
            />
            <label className="text-xs text-[#615668] leading-relaxed">
              I agree to the salon appointment and cancellation terms. No advance fee is required today.
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-[#5E127E] hover:bg-[#4D0F68] text-white text-xs font-semibold tracking-widest uppercase rounded-full shadow-lg shadow-[#5E127E]/25 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Securing Your Appointment...
                </>
              ) : (
                "Confirm & Reserve Visit"
              )}
            </Button>
            
            <p className="text-center text-xs text-[#615668] pt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant confirmation • Pay at salon after your treatment</span>
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
