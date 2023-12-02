/*
  Warnings:

  - Added the required column `sentBy` to the `PushNotifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `PushNotifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PushNotifications" ADD COLUMN     "sentBy" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "sent_by" TEXT NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
