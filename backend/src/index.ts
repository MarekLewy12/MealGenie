import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z, ZodError } from "zod";

import {
  getPreferencesController,
  savePreferencesController,
} from "./controllers/preferences.controller.js";
import { suggestMealsController } from "./controllers/meals.controller.js";
import {
  registerController,
  loginController,
} from "./controllers/auth.controller.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";
import { cleanupOldImages } from "./services/image.service.js";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
});

const env = envSchema.parse(process.env);

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/meal-images",
  express.static(path.join(process.cwd(), "public", "meal-images")),
);

const echoBodySchema = z.object({
  message: z.string().min(1, "message is required"),
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/echo", (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = echoBodySchema.parse(req.body);
    res.json({ message: body.message });
  } catch (error) {
    next(error);
  }
});

// API
app.post("/api/preferences", authenticateToken, savePreferencesController);
app.get("/api/preferences", authenticateToken, getPreferencesController);
app.post("/api/meals/suggest", authenticateToken, suggestMealsController);

// Auth
app.post("/api/auth/register", registerController);
app.post("/api/auth/login", loginController);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "ValidationError",
      issues: err.issues,
    });
  }

  console.error(err);
  return res.status(500).json({ error: "InternalServerError" });
});

export { app };

// Czyszczenie cache obrazkow przy starcie serwera (>7 dni).
cleanupOldImages(7);

if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`MealGenie backend listening on port ${env.PORT}`);
  });
}
