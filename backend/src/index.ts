import cors from 'cors';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';

import { savePreferencesController } from './controllers/preferences.controller.js';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
});

const env = envSchema.parse(process.env);

const app = express();

app.use(cors());
app.use(express.json());

const echoBodySchema = z.object({
  message: z.string().min(1, 'message is required'),
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/api/echo', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = echoBodySchema.parse(req.body);
    res.json({ message: body.message });
  } catch (error) {
    next(error);
  }
});

app.post('/api/preferences', savePreferencesController);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: err.issues,
    });
  }

  console.error(err);
  return res.status(500).json({ error: 'InternalServerError' });
});

app.listen(env.PORT, () => {
  console.log(`MealGenie backend listening on port ${env.PORT}`);
});
