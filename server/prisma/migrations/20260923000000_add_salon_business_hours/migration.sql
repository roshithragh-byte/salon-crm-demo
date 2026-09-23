CREATE TABLE "SalonBusinessHour" (
    "id" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SalonBusinessHour_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SalonBusinessHour_salonId_dayOfWeek_key" ON "SalonBusinessHour"("salonId", "dayOfWeek");
CREATE INDEX "SalonBusinessHour_salonId_idx" ON "SalonBusinessHour"("salonId");
ALTER TABLE "SalonBusinessHour" ADD CONSTRAINT "SalonBusinessHour_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
