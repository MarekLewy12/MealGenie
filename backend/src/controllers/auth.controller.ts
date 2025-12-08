import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { registerUser, loginUser } from "../services/auth.service.js";

// Schemat walidacji
const authSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is too short").optional(),
});

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Zod
    const data = authSchema.parse(req.body);

    if (!data.name) {
      return res
        .status(400)
        .json({ error: "Name is required for registration" });
    }

    // rejestracja poprzez serwis
    const result = await registerUser({ ...data, name: data.name });

    res.status(201).json(result);
  } catch (error) {
    next(error); // błąd do error handlera
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = authSchema.parse(req.body);
    const result = await loginUser(data);

    res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Nieprawidłowe dane logowania"
    ) {
      return res
        .status(401)
        .json({ error: "Nieprawidłowe dane logowania" });
    }
    next(error);
  }
}
