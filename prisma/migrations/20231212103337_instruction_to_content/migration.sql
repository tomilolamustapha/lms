/*
  Warnings:

  - Added the required column `instruction` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "instruction" TEXT NOT NULL;
