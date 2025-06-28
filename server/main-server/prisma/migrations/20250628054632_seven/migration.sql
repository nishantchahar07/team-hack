/*
  Warnings:

  - Made the column `nurseId` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_nurseId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "nurseId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "structuredData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "Nurse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
