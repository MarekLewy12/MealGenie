-- AlterTable
ALTER TABLE "MealHistory"
ADD COLUMN "shareId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MealHistory_shareId_key" ON "MealHistory"("shareId");
