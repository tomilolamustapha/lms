/*
  Warnings:

  - A unique constraint covering the columns `[studentMatric]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[loginId]` on the table `Tutor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_studentMatric_key" ON "Student"("studentMatric");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_loginId_key" ON "Tutor"("loginId");
