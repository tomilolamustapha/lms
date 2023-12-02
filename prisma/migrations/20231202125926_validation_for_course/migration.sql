-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT false;
