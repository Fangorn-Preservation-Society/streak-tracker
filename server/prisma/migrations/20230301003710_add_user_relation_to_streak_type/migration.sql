/*
  Warnings:

  - Added the required column `userId` to the `StreakType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StreakType" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StreakType" ADD CONSTRAINT "StreakType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
