/*
  Warnings:

  - You are about to drop the `Preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('THERMOMIX', 'MULTICOOKER', 'AIR_FRYER', 'SOUS_VIDE', 'HIGH_SPEED_BLENDER', 'STEAMER', 'ELECTRIC_GRILL');

-- CreateEnum
CREATE TYPE "Budget" AS ENUM ('NONE', 'ECONOMICAL', 'MEDIUM', 'PREMIUM');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT', 'ANY');

-- AlterEnum
ALTER TYPE "Diet" ADD VALUE 'LACTOSE_FREE';

-- DropForeignKey
ALTER TABLE "Preferences" DROP CONSTRAINT "Preferences_user_id_fkey";

-- DropTable
DROP TABLE "Preferences";

-- DropEnum
DROP TYPE "BudgetLevel";

-- DropEnum
DROP TYPE "KitchenEquipment";

-- CreateTable
CREATE TABLE "Preference" (
    "userId" TEXT NOT NULL,
    "diet" "Diet" NOT NULL DEFAULT 'NONE',
    "allergies" TEXT[],
    "dislikedIngredients" TEXT[],
    "favoriteCuisines" TEXT[],
    "cookingSkill" "CookingSkill" NOT NULL DEFAULT 'BEGINNER',
    "nutritionGoal" TEXT,
    "equipment" "Equipment"[] DEFAULT ARRAY[]::"Equipment"[],
    "defaultServings" INTEGER DEFAULT 2,
    "defaultMaxTime" INTEGER DEFAULT 30,
    "budget" "Budget" NOT NULL DEFAULT 'NONE',
    "spiceLevel" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "MealHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" TEXT[],
    "estimatedTime" INTEGER,
    "category" "MealType",
    "userPrompt" TEXT,
    "wasSelected" BOOLEAN NOT NULL DEFAULT false,
    "selectedAt" TIMESTAMP(3),
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "unit" TEXT,
    "category" TEXT,
    "obtained" BOOLEAN NOT NULL DEFAULT false,
    "mealId" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShoppingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MealHistory_userId_createdAt_idx" ON "MealHistory"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ShoppingItem_userId_obtained_idx" ON "ShoppingItem"("userId", "obtained");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealHistory" ADD CONSTRAINT "MealHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
