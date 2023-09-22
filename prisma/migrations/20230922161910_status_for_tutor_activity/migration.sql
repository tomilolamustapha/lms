/*
  Warnings:

  - Added the required column `Status` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "Status" BOOLEAN NOT NULL;
