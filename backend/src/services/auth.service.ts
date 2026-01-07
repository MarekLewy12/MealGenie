import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  comparePasswords,
  generateToken,
} from "../utils/auth.js";

const prisma = new PrismaClient();

// Typy wejściowe
type AuthInput = {
  email: string;
  password: string;
  name?: string;
};

export async function registerUser({ email, password, name }: AuthInput) {
  // duplikaty?
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  if (!name) {
    throw new Error("Name required");
  }

  // Hash
  const passwordHash = await hashPassword(password);

  // User w bazie
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      // reszta prisma
    },
  });

  // user otrzymuje token
  const token = generateToken(user.id);

  const { passwordHash: _ignored, ...safeUser } = user;

  return { user: safeUser, token };
}

export async function loginUser({ email, password }: AuthInput) {
  // czy user istnieje w bazie?
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      // czy użytkownik ma już globalne ustawienia?
      preference: {
        select: { userId: true },
      },
    },
  });

  // jeśli nie ma usera błąd credentials żeby nie podpowiadać, które maile istnieją
  if (!user) {
    throw new Error("Nieprawidłowe dane logowania");
  }

  // porównanie haseł
  const isValid = await comparePasswords(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Nieprawidłowe dane logowania");
  }

  // tworzenie tokena
  const token = generateToken(user.id);

  const { passwordHash: _ignored, ...safeUser } = user;

  const hasCompletedOnboarding = Boolean(user.preference);

  return { user: safeUser, token, hasCompletedOnboarding };
}
