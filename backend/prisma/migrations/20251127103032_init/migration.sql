-- CreateEnum
CREATE TYPE "Diet" AS ENUM ('NONE', 'VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'GLUTEN_FREE');

-- CreateEnum
CREATE TYPE "CookingSkill" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "diet" "Diet" NOT NULL,
    "allergies" TEXT[],
    "favCuisines" TEXT[],
    "dislikedIngredients" TEXT[],
    "cookingSkill" "CookingSkill" NOT NULL,
    "prepTimePreference" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_user_id_key" ON "Preferences"("user_id");

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
