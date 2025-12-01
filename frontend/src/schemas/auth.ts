import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format email"),
  password: z.string().min(6, "Hasło musi mieć minimum 6 znaków"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Imię musi mieć min. 2 znaki"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
