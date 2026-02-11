-- CreateTable
CREATE TABLE "GuestGeneration" (
    "id" TEXT NOT NULL,
    "fingerprintHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestGeneration_fingerprintHash_createdAt_idx" ON "GuestGeneration"("fingerprintHash", "createdAt");
