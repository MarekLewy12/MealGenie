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
};

export async function registerUser({ email, password }: AuthInput) {
  // duplikaty?
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash
  const passwordHash = await hashPassword(password);

  // User w bazie
  const user = await prisma.user.create({
    data: {
      email,
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
  const user = await prisma.user.findUnique({ where: { email } });

  // jeśli nie ma usera błąd credentials żeby nie podpowiadać, które maile istnieją
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // porównanie haseł
  const isValid = await comparePasswords(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // tworzenie tokena
  const token = generateToken(user.id);

  const { passwordHash: _ignored, ...safeUser } = user;

  return { user: safeUser, token };
}
