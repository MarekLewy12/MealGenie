import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export const GUEST_RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

type GuestFingerprintInput = {
  ip: string;
  userAgent?: string | null;
};

type GuestRateLimitStatus = {
  isLimited: boolean;
  retryAfterSeconds: number;
};

function getGuestRateLimitSalt(): string {
  const salt = process.env.GUEST_RATE_LIMIT_SALT;

  if (!salt || salt.trim().length === 0) {
    throw new Error("Missing GUEST_RATE_LIMIT_SALT environment variable");
  }

  return salt;
}

export function createGuestFingerprintHash({
  ip,
  userAgent,
}: GuestFingerprintInput): string {
  const normalizedIp = ip.trim().toLowerCase();
  const normalizedUserAgent = (userAgent ?? "").trim().toLowerCase();
  const payload = `${normalizedIp}|${normalizedUserAgent}`;

  return crypto
    .createHmac("sha256", getGuestRateLimitSalt())
    .update(payload)
    .digest("hex");
}

export async function getGuestRateLimitStatus(
  fingerprintHash: string,
  now: Date = new Date(),
): Promise<GuestRateLimitStatus> {
  const lastGeneration = await prisma.guestGeneration.findFirst({
    where: { fingerprintHash },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (!lastGeneration) {
    return { isLimited: false, retryAfterSeconds: 0 };
  }

  const remainingMs =
    lastGeneration.createdAt.getTime() +
    GUEST_RATE_LIMIT_WINDOW_MS -
    now.getTime();

  if (remainingMs <= 0) {
    return { isLimited: false, retryAfterSeconds: 0 };
  }

  return {
    isLimited: true,
    retryAfterSeconds: Math.ceil(remainingMs / 1000),
  };
}

export async function markGuestGeneration(
  fingerprintHash: string,
): Promise<void> {
  await prisma.guestGeneration.create({
    data: { fingerprintHash },
  });
}
