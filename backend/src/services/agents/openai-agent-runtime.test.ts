import { jest } from "@jest/globals";
import { AgentRuntimeError, runOpenAIAgentRuntime } from "./openai-agent-runtime.js";
import type { AgentMessage, AgentState } from "../../schemas/agent.schema.js";

const messages: AgentMessage[] = [
  {
    role: "user",
    content: "Mam makaron i pomidory.",
    createdAt: new Date().toISOString(),
  },
];

const state: AgentState = {
  collectedContext: {},
  missingFields: ["goal"],
  canExecute: false,
  followUpCount: 0,
};

function createClient(args: { response?: unknown; error?: unknown }) {
  const calls: Array<{ body: unknown; options: unknown }> = [];
  const parse = async (body: unknown, options: unknown) => {
    calls.push({ body, options });
    if (args.error) {
      throw args.error;
    }
    return args.response;
  };

  return {
    client: {
      responses: {
        parse,
      },
    },
    calls,
  } as const;
}

describe("runOpenAIAgentRuntime", () => {
  const previousEnv = { ...process.env };
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...previousEnv };
    consoleErrorSpy.mockRestore();
  });

  it("uses Responses API with PR2 defaults and parses an agent decision", async () => {
    const fake = createClient({
      response: {
        output_parsed: {
          type: "ask_follow_up",
          message: "Czy to ma być bez wychodzenia do sklepu?",
          missingFields: ["shoppingFlexibility"],
        },
        usage: {
          input_tokens: 123,
          output_tokens: 45,
        },
      },
    });

    const result = await runOpenAIAgentRuntime(
      { messages, state, forcePlan: false },
      fake.client as never,
    );

    expect(result.decision.type).toBe("ask_follow_up");
    expect(result.model).toBe("gpt-5.4-mini");
    expect(result.inputTokens).toBe(123);
    expect(fake.calls[0]?.body).toEqual(
      expect.objectContaining({
        model: "gpt-5.4-mini",
        instructions: expect.stringContaining("mealType"),
        store: false,
        reasoning: { effort: "low" },
        text: expect.objectContaining({ verbosity: "low" }),
      }),
    );
    expect(fake.calls[0]?.options).toEqual(
      expect.objectContaining({
        timeout: 30000,
        maxRetries: 0,
      }),
    );
  });

  it("honors runtime env overrides", async () => {
    process.env.MEALGENIE_AGENT_MODEL = "gpt-5.5";
    process.env.MEALGENIE_AGENT_REASONING_EFFORT = "medium";
    process.env.MEALGENIE_AGENT_TEXT_VERBOSITY = "medium";
    process.env.MEALGENIE_AGENT_OPENAI_STORE = "true";
    process.env.MEALGENIE_AGENT_TIMEOUT_MS = "1000";

    const fake = createClient({
      response: {
        output_parsed: {
          type: "fail",
          errorCode: "TEST",
          message: "Test",
          retryable: false,
        },
        usage: {},
      },
    });

    await runOpenAIAgentRuntime(
      { messages, state, forcePlan: false },
      fake.client as never,
    );

    expect(fake.calls[0]?.body).toEqual(
      expect.objectContaining({
        model: "gpt-5.5",
        store: true,
        reasoning: { effort: "medium" },
        text: expect.objectContaining({ verbosity: "medium" }),
      }),
    );
    expect(fake.calls[0]?.options).toEqual(
      expect.objectContaining({
        timeout: 1000,
      }),
    );
  });

  it("maps empty parsed output to AGENT_INVALID_OUTPUT", async () => {
    const fake = createClient({
      response: {
        output_parsed: null,
        output: [],
      },
    });

    await expect(
      runOpenAIAgentRuntime(
        { messages, state, forcePlan: false },
        fake.client as never,
      ),
    ).rejects.toMatchObject({
      code: "AGENT_INVALID_OUTPUT",
      retryable: true,
    });
  });

  it("maps malformed parsed output to AGENT_INVALID_OUTPUT", async () => {
    const fake = createClient({
      response: {
        output_parsed: {
          decision: {
            type: "show_plan",
            message: "Plan gotowy.",
            missingFields: [],
            collectedContext: [],
            plan: null,
            errorCode: "",
            retryable: false,
          },
        },
      },
    });

    await expect(
      runOpenAIAgentRuntime(
        { messages, state, forcePlan: false },
        fake.client as never,
      ),
    ).rejects.toMatchObject({
      code: "AGENT_INVALID_OUTPUT",
      retryable: true,
    });
  });

  it("maps refusals to AGENT_REFUSAL", async () => {
    const fake = createClient({
      response: {
        output_parsed: null,
        output: [
          {
            content: [
              {
                type: "refusal",
                refusal: "Nie mogę przygotować tej decyzji.",
              },
            ],
          },
        ],
      },
    });

    await expect(
      runOpenAIAgentRuntime(
        { messages, state, forcePlan: false },
        fake.client as never,
      ),
    ).rejects.toMatchObject({
      code: "AGENT_REFUSAL",
      retryable: false,
    });
  });

  it("maps timeout-like errors to AGENT_TIMEOUT", async () => {
    const timeout = new Error("Request timed out");
    timeout.name = "APIConnectionTimeoutError";
    const fake = createClient({ error: timeout });

    await expect(
      runOpenAIAgentRuntime(
        { messages, state, forcePlan: false },
        fake.client as never,
      ),
    ).rejects.toBeInstanceOf(AgentRuntimeError);
    await expect(
      runOpenAIAgentRuntime(
        { messages, state, forcePlan: false },
        fake.client as never,
      ),
    ).rejects.toMatchObject({
      code: "AGENT_TIMEOUT",
      retryable: true,
    });
  });

  it("logs a sanitized runtime error cause without debug details by default", async () => {
    process.env.MEALGENIE_AGENT_MODEL = "gpt-4.1";
    const apiError = Object.assign(new Error("The model does not exist."), {
      status: 404,
      code: "model_not_found",
      type: "invalid_request_error",
      request_id: "req_agent_123",
      param: "model",
    });
    const fake = createClient({ error: apiError });

    await expect(
      runOpenAIAgentRuntime(
        { messages, state, forcePlan: false },
        fake.client as never,
      ),
    ).rejects.toMatchObject({
      code: "AGENT_RUNTIME_ERROR",
      retryable: true,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[AGENT_RUNTIME_ERROR]",
      expect.objectContaining({
        scope: "mealgenie-agent-runtime",
        code: "AGENT_RUNTIME_ERROR",
        model: "gpt-4.1",
        retryable: true,
        causeName: "Error",
        causeMessage: "The model does not exist.",
        causeStatus: 404,
        causeCode: "model_not_found",
        causeType: "invalid_request_error",
        requestId: "req_agent_123",
      }),
    );
    const logEntry = consoleErrorSpy.mock.calls[0]?.[1] as Record<
      string,
      unknown
    >;
    expect(logEntry).not.toHaveProperty("causeStack");
    expect(logEntry).not.toHaveProperty("causeParam");
  });

  it("includes extra runtime error details when debug logging is enabled", async () => {
    process.env.MEALGENIE_AGENT_DEBUG_ERRORS = "true";
    const apiError = Object.assign(new Error("Invalid request"), {
      status: 400,
      code: "bad_request",
      type: "invalid_request_error",
      param: "text.format",
    });
    const fake = createClient({ error: apiError });

    await expect(
      runOpenAIAgentRuntime(
        { messages, state, forcePlan: false },
        fake.client as never,
      ),
    ).rejects.toMatchObject({
      code: "AGENT_RUNTIME_ERROR",
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[AGENT_RUNTIME_ERROR]",
      expect.objectContaining({
        code: "AGENT_RUNTIME_ERROR",
        causeStack: expect.stringContaining("Invalid request"),
        causeParam: "text.format",
      }),
    );
  });
});
