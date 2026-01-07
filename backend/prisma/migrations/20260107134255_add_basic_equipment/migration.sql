/*
  Warnings:

  - The values [HIGH_SPEED_BLENDER] on the enum `Equipment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Equipment_new" AS ENUM ('OVEN', 'STOVE', 'MICROWAVE', 'BLENDER', 'THERMOMIX', 'MULTICOOKER', 'AIR_FRYER', 'SOUS_VIDE', 'STEAMER', 'ELECTRIC_GRILL');
ALTER TABLE "Preference" ALTER COLUMN "equipment" DROP DEFAULT;
ALTER TABLE "Preference" ALTER COLUMN "equipment" TYPE "Equipment_new"[] USING ("equipment"::text::"Equipment_new"[]);
ALTER TYPE "Equipment" RENAME TO "Equipment_old";
ALTER TYPE "Equipment_new" RENAME TO "Equipment";
DROP TYPE "Equipment_old";
ALTER TABLE "Preference" ALTER COLUMN "equipment" SET DEFAULT ARRAY[]::"Equipment"[];
COMMIT;
