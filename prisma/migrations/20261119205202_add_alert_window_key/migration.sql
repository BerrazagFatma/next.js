/*
  Warnings:

  - A unique constraint covering the columns `[windowKey]` on the table `Alert` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN "windowKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Alert_windowKey_key" ON "Alert"("windowKey");
