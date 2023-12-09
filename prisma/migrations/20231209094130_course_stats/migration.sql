/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Course` table. All the data in the column will be lost.
  - The `status` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CourseStats" AS ENUM ('isPublished', 'unPublished', 'blocked', 'withdrawn');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "isPublished",
DROP COLUMN "status",
ADD COLUMN     "status" "CourseStats" NOT NULL DEFAULT 'unPublished';
