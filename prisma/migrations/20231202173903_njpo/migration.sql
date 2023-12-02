/*
  Warnings:

  - You are about to drop the column `name` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Course_name_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "name",
DROP COLUMN "path";

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");
