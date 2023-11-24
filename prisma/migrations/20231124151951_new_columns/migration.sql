/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_category_key" ON "Course"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");
