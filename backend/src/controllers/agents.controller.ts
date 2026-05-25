import { type NextFunction, type Request, type Response } from "express";
import {
  AgentChatRequestSchema,
  AgentRunIdParamSchema,
} from "../schemas/agent.schema.js";
import {
  AgentRunNotFoundError,
  createOrContinueAgentChat,
  getAgentRunForUser,
} from "../services/agents/agent-session.service.js";

function isAgentEnabled(): boolean {
  return process.env.MEALGENIE_AGENT_ENABLED === "true";
}

function getUserId(req: Request): string {
  const userId = req.user?.userId;
  if (!userId) {
    throw new Error("User ID missing in request context");
  }
  return userId;
}

function sendAgentDisabled(res: Response) {
  return res.status(403).json({
    error: {
      code: "AGENT_DISABLED",
      message: "MealGenie Agent jest obecnie wyłączony.",
      retryable: false,
    },
  });
}

function sendAgentNotFound(res: Response) {
  return res.status(404).json({
    error: {
      code: "AGENT_RUN_NOT_FOUND",
      message: "Sesja Agenta nie została znaleziona.",
      retryable: false,
    },
  });
}

export async function createAgentChatController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!isAgentEnabled()) {
      return sendAgentDisabled(res);
    }

    const userId = getUserId(req);
    const input = AgentChatRequestSchema.parse(req.body);
    const response = await createOrContinueAgentChat({ userId, input });

    return res.json(response);
  } catch (error) {
    if (error instanceof AgentRunNotFoundError) {
      return sendAgentNotFound(res);
    }
    return next(error);
  }
}

export async function getAgentRunController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!isAgentEnabled()) {
      return sendAgentDisabled(res);
    }

    const userId = getUserId(req);
    const { id } = AgentRunIdParamSchema.parse(req.params);
    const response = await getAgentRunForUser({ userId, runId: id });

    return res.json(response);
  } catch (error) {
    if (error instanceof AgentRunNotFoundError) {
      return sendAgentNotFound(res);
    }
    return next(error);
  }
}
