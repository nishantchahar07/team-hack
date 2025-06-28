-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_nurseId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "nurseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "Nurse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
