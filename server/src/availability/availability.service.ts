import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Slot = {
  starts_at: string;
  ends_at: string;
  stylist_id: string;
  available: boolean;
};

/** Asia/Kolkata has no DST; offset fixed +05:30. Extensible via salon.timezone. */
function offsetMinutesForTimezone(tz: string): number {
  if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 330;
  // Fallback: derive from a sample Intl offset (may be coarse for rare zones)
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
  });
  const parts = fmt.formatToParts(new Date());
  const raw = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT';
  const m = raw.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (parseInt(m[2], 10) * 60 + parseInt(m[3] || '0', 10));
}

function parseYmd(dateStr: string): { y: number; m: number; d: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!m) throw new Error('Invalid date');
  return { y: +m[1], m: +m[2], d: +m[3] };
}

/** Build a UTC Date for a wall-clock time on a calendar day in the salon timezone. */
function wallTimeToUtc(
  y: number,
  month: number,
  d: number,
  hours: number,
  minutes: number,
  tzOffsetMin: number,
): Date {
  return new Date(Date.UTC(y, month - 1, d, hours, minutes, 0, 0) - tzOffsetMin * 60_000);
}

function timePartsFromDbTime(t: Date): { h: number; min: number } {
  // TIME columns from Prisma come as Date; use UTC components (seeded as UTC wall times)
  return { h: t.getUTCHours(), min: t.getUTCMinutes() };
}

function dayOfWeekInTz(y: number, month: number, d: number, tzOffsetMin: number): number {
  // Noon local avoids DST edge cases; for IST noon = 06:30 UTC
  const utc = wallTimeToUtc(y, month, d, 12, 0, tzOffsetMin);
  return utc.getUTCDay(); // 0=Sun .. 6=Sat
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateAvailability(
    salonId: string,
    date: Date,
    serviceId: string,
    stylistId?: string,
  ) {
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] },
    });
    if (!salon) throw new NotFoundException('Salon not found');

    const service = await this.prisma.client.service.findUnique({
      where: { id: serviceId },
    });
    if (!service || service.salonId !== salon.id || !service.isActive) {
      throw new NotFoundException('Service not found');
    }

    const durationMinutes = service.durationMinutes || 30;
    const tz = salon.timezone || 'Asia/Kolkata';
    const tzOffsetMin = offsetMinutesForTimezone(tz);

    // Prefer ISO date string if controller passed a calendar date at UTC midnight
    const dateStr = Number.isFinite(date.getTime())
      ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
      : null;
    if (!dateStr) throw new NotFoundException('Invalid date');

    const { y, m, d } = parseYmd(dateStr);
    const dayOfWeek = dayOfWeekInTz(y, m, d, tzOffsetMin);

    const businessHour = await this.prisma.client.salonBusinessHour.findUnique({
      where: {
        salonId_dayOfWeek: { salonId: salon.id, dayOfWeek },
      },
    });

    if (!businessHour || businessHour.isClosed) {
      return [];
    }

    const bizOpen = timePartsFromDbTime(businessHour.openTime);
    const bizClose = timePartsFromDbTime(businessHour.closeTime);
    const businessStart = wallTimeToUtc(y, m, d, bizOpen.h, bizOpen.min, tzOffsetMin);
    const businessEnd = wallTimeToUtc(y, m, d, bizClose.h, bizClose.min, tzOffsetMin);

    let staffServicesQuery: Record<string, unknown> = { serviceId };
    if (stylistId) {
      staffServicesQuery = { serviceId, staffMemberId: stylistId };
    }

    const staffServices = await this.prisma.client.staffService.findMany({
      where: staffServicesQuery,
      include: {
        staffMember: {
          include: {
            staffSchedules: {
              where: { dayOfWeek, isActive: true },
            },
          },
        },
      },
    });

    const candidateStaff = staffServices
      .map((ss) => ss.staffMember)
      .filter((staff) => staff.isActive && staff.staffSchedules.length > 0);

    if (candidateStaff.length === 0) {
      return [];
    }

    const staffIds = candidateStaff.map((s) => s.id);
    const dayStart = wallTimeToUtc(y, m, d, 0, 0, tzOffsetMin);
    const dayEnd = wallTimeToUtc(y, m, d, 23, 59, tzOffsetMin);

    const appointments = await this.prisma.client.appointment.findMany({
      where: {
        salonId: salon.id,
        staffId: { in: staffIds },
        status: { not: 'CANCELLED' },
        startsAt: { gte: dayStart, lte: dayEnd },
      },
    });

    const timeOffs = await this.prisma.client.staffTimeOff.findMany({
      where: {
        salonMemberId: { in: staffIds },
        startsAt: { lte: dayEnd },
        endsAt: { gte: dayStart },
      },
    });

    const now = new Date();
    const intervalMinutes = 30;
    const availableSlots: Slot[] = [];

    for (const staff of candidateStaff) {
      const schedule = staff.staffSchedules[0];
      const st = timePartsFromDbTime(schedule.startTime);
      const en = timePartsFromDbTime(schedule.endTime);
      const staffStart = wallTimeToUtc(y, m, d, st.h, st.min, tzOffsetMin);
      const staffEnd = wallTimeToUtc(y, m, d, en.h, en.min, tzOffsetMin);

      // Intersect staff schedule with salon business hours
      const windowStart = new Date(Math.max(staffStart.getTime(), businessStart.getTime()));
      const windowEnd = new Date(Math.min(staffEnd.getTime(), businessEnd.getTime()));
      if (windowStart >= windowEnd) continue;

      let currentSlotStart = new Date(windowStart);
      while (currentSlotStart.getTime() + durationMinutes * 60_000 <= windowEnd.getTime()) {
        const slotEnd = new Date(currentSlotStart.getTime() + durationMinutes * 60_000);

        // Skip past slots for today
        if (currentSlotStart <= now) {
          currentSlotStart = new Date(currentSlotStart.getTime() + intervalMinutes * 60_000);
          continue;
        }

        const hasTimeOffConflict = timeOffs.some((toff) => {
          if (toff.salonMemberId !== staff.id) return false;
          return currentSlotStart < toff.endsAt && slotEnd > toff.startsAt;
        });

        const hasApptConflict = appointments.some((appt) => {
          if (appt.staffId !== staff.id) return false;
          return currentSlotStart < appt.endsAt && slotEnd > appt.startsAt;
        });

        if (!hasTimeOffConflict && !hasApptConflict) {
          availableSlots.push({
            starts_at: currentSlotStart.toISOString(),
            ends_at: slotEnd.toISOString(),
            stylist_id: staff.id,
            available: true,
          });
        }

        currentSlotStart = new Date(currentSlotStart.getTime() + intervalMinutes * 60_000);
      }
    }

    if (!stylistId) {
      const uniqueSlots = new Map<string, Slot>();
      for (const slot of availableSlots) {
        if (!uniqueSlots.has(slot.starts_at)) uniqueSlots.set(slot.starts_at, slot);
      }
      return Array.from(uniqueSlots.values()).sort(
        (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
      );
    }

    return availableSlots.sort(
      (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    );
  }
}
