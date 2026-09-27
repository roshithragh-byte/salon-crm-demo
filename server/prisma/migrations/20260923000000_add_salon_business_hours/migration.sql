CREATE TABLE "SalonBusinessHour" (
    "id" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,
    "dayOfWeek" SMALLINT NOT NULL,
    "openTime" TIME NOT NULL,
    "closeTime" TIME NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SalonBusinessHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalonBusinessHour_salonId_idx" ON "SalonBusinessHour"("salonId");

-- CreateIndex
CREATE UNIQUE INDEX "SalonBusinessHour_salonId_dayOfWeek_key" ON "SalonBusinessHour"("salonId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "SalonBusinessHour" ADD CONSTRAINT "SalonBusinessHour_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
