/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Tutor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Tutor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tutor_email_key" ON "Tutor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_phoneNumber_key" ON "Tutor"("phoneNumber");
