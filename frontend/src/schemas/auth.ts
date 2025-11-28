import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Nieprawidłowy format email"),
  password: z.string().min(6, "Hasło musi mieć minimum 6 znaków"),
});

export type AuthFormData = z.infer<typeof authSchema>;
