/*
  Warnings:

  - The values [THERMOMIX] on the enum `KitchenEquipment` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `prepTimePreference` on the `Preferences` table. All the data in the column will be lost.
  - You are about to drop the column `servingSize` on the `Preferences` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KitchenEquipment_new" AS ENUM ('OVEN', 'STOVE', 'MICROWAVE', 'BLENDER', 'AIR_FRYER', 'SLOW_COOKER', 'GRILL');
ALTER TABLE "Preferences" ALTER COLUMN "kitchenEquipment" DROP DEFAULT;
ALTER TABLE "Preferences" ALTER COLUMN "kitchenEquipment" TYPE "KitchenEquipment_new"[] USING ("kitchenEquipment"::text::"KitchenEquipment_new"[]);
ALTER TYPE "KitchenEquipment" RENAME TO "KitchenEquipment_old";
ALTER TYPE "KitchenEquipment_new" RENAME TO "KitchenEquipment";
DROP TYPE "KitchenEquipment_old";
ALTER TABLE "Preferences" ALTER COLUMN "kitchenEquipment" SET DEFAULT ARRAY[]::"KitchenEquipment"[];
COMMIT;

-- AlterTable
ALTER TABLE "Preferences" DROP COLUMN "prepTimePreference",
DROP COLUMN "servingSize",
ADD COLUMN     "useThermomix" BOOLEAN NOT NULL DEFAULT false;
