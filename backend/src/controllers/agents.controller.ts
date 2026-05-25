import { type NextFunction, type Request, type Response } from "express";
import {
  AgentChatRequestSchema,
  AgentExecuteRequestSchema,
  AgentRunIdParamSchema,
} from "../schemas/agent.schema.js";
import {
  AgentExecutionError,
  executePlan,
} from "../services/agents/agent-execution.service.js";
import {
  AgentRunNotFoundError,
  chatSession,
  getRun as getSessionRun,
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

function sendDisabled(res: Response) {
  return res.status(403).json({
    error: {
      code: "AGENT_DISABLED",
      message: "MealGenie Agent jest obecnie wyłączony.",
      retryable: false,
    },
  });
}

function sendNotFound(res: Response) {
  return res.status(404).json({
    error: {
      code: "AGENT_RUN_NOT_FOUND",
      message: "Sesja Agenta nie została znaleziona.",
      retryable: false,
    },
  });
}

function sendExecutionError(res: Response, error: AgentExecutionError) {
  return res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
    },
  });
}

export async function chat(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!isAgentEnabled()) {
      return sendDisabled(res);
    }

    const userId = getUserId(req);
    const input = AgentChatRequestSchema.parse(req.body);
    const response = await chatSession({ userId, input });

    return res.json(response);
  } catch (error) {
    if (error instanceof AgentRunNotFoundError) {
      return sendNotFound(res);
    }
    return next(error);
  }
}

export async function getRun(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!isAgentEnabled()) {
      return sendDisabled(res);
    }

    const userId = getUserId(req);
    const { id } = AgentRunIdParamSchema.parse(req.params);
    const response = await getSessionRun({ userId, runId: id });

    return res.json(response);
  } catch (error) {
    if (error instanceof AgentRunNotFoundError) {
      return sendNotFound(res);
    }
    return next(error);
  }
}

export async function execute(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!isAgentEnabled()) {
      return sendDisabled(res);
    }

    const userId = getUserId(req);
    const input = AgentExecuteRequestSchema.parse(req.body);
    const response = await executePlan({ userId, input });

    return res.json(response);
  } catch (error) {
    if (error instanceof AgentRunNotFoundError) {
      return sendNotFound(res);
    }
    if (error instanceof AgentExecutionError) {
      return sendExecutionError(res, error);
    }
    return next(error);
  }
}
