/*
  Warnings:

  - You are about to drop the column `tutorId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `tutorId` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_tutorId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "tutorId";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "tutorId";
