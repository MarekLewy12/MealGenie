import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../utils/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  // "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // 401 Unauthorized
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    // 403 Forbidden
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
