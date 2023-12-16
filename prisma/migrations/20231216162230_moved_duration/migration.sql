/*
  Warnings:

  - You are about to drop the column `duration` on the `Course` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "duration" INTEGER NOT NULL,
ALTER COLUMN "timeWatched" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "duration";
