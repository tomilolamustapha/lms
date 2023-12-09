/*
  Warnings:

  - You are about to drop the column `uuid` on the `Content` table. All the data in the column will be lost.
  - Added the required column `instruction` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Content_uuid_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "uuid",
ADD COLUMN     "instruction" TEXT NOT NULL;
