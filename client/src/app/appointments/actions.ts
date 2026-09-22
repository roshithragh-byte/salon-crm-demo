"use server";
import { revalidatePath } from "next/cache";
import { BookingApi } from "@/lib/api/services";

interface AppointmentData {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  serviceId: string;
  staffId: string;
  stylistId: string | null;
  notes: string | null;
  preferredTime: string;
  preferredDate: string;
}

export async function getAvailableServices(salonId: string = "default-salon-id") {
  const res = await BookingApi.getAvailableServices(salonId);
  return res.data;
}

export async function getAvailableStaff(salonId: string = "default-salon-id") {
  const res = await BookingApi.getAvailableStaff(salonId);
  return res.data;
}

export async function createAppointment(salonId: string, data: AppointmentData) {
  try {
    const [hours, minutes] = data.preferredTime.split(':').map(Number);
    const startsAt = new Date(data.preferredDate);
    startsAt.setHours(hours, minutes, 0, 0);

    await BookingApi.createBooking(salonId, {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      serviceId: data.serviceId,
      stylistId: data.staffId === "any" ? null : (data.staffId || null),
      startsAt: startsAt.toISOString(),
      notes: data.notes,
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to create appointment", error);
      return { success: false, error: error.message || "Failed to create appointment" };
    } else {
      console.error("Failed to create appointment", error);
      return { success: false, error: "Failed to create appointment" };
    }
  }
}
