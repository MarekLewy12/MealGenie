import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Domyślny czas życia tokenu – 1 dzień
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return (jwt as any).sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  }) as string;
}

interface AuthTokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = (jwt as any).verify(token, JWT_SECRET) as JwtPayload;

  if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
    throw new Error("Invalid token payload");
  }

  const { userId, iat, exp } = decoded as JwtPayload & { userId: string };

  if (typeof iat !== "number" || typeof exp !== "number") {
    throw new Error("Invalid token payload shape");
  }

  return { userId, iat, exp };
}
