/*
  Warnings:

  - Added the required column `budget` to the `Preferences` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KitchenEquipment" AS ENUM ('OVEN', 'STOVE', 'MICROWAVE', 'BLENDER', 'AIR_FRYER', 'SLOW_COOKER', 'GRILL', 'THERMOMIX');

-- CreateEnum
CREATE TYPE "BudgetLevel" AS ENUM ('CHEAP', 'MODERATE', 'EXPENSIVE');

-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "budget" "BudgetLevel" NOT NULL,
ADD COLUMN     "kitchenEquipment" "KitchenEquipment"[] DEFAULT ARRAY[]::"KitchenEquipment"[],
ADD COLUMN     "servingSize" INTEGER NOT NULL DEFAULT 2;
