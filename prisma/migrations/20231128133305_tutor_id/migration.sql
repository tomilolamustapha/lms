/*
  Warnings:

  - Added the required column `tutorId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "tutorId" INTEGER NOT NULL;
