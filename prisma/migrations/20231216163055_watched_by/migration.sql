-- CreateTable
CREATE TABLE "_ContentToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToUser_AB_unique" ON "_ContentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToUser_B_index" ON "_ContentToUser"("B");

-- AddForeignKey
ALTER TABLE "_ContentToUser" ADD CONSTRAINT "_ContentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToUser" ADD CONSTRAINT "_ContentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
