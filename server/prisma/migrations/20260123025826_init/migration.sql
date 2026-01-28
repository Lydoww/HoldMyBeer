/*
  Warnings:

  - A unique constraint covering the columns `[userId,betId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `choice` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Choice" AS ENUM ('success', 'fail');

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "choice",
ADD COLUMN     "choice" "Choice" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_betId_key" ON "Vote"("userId", "betId");
