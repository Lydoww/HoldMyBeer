-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_betId_fkey";

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
