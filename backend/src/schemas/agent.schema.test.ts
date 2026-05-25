import {
  AgentChatRequestSchema,
  AgentChatResponseSchema,
} from "./agent.schema.js";

describe("AgentChatRequestSchema", () => {
  it("accepts the minimal first message", () => {
    const parsed = AgentChatRequestSchema.parse({
      message: "Mam kurczaka i cukinię, pomóż mi zrobić obiad.",
    });

    expect(parsed.mode).toBe("CHEF_ORCHESTRATOR");
    expect(parsed.message).toContain("kurczaka");
  });

  it("rejects an empty message", () => {
    expect(() =>
      AgentChatRequestSchema.parse({
        message: "",
      }),
    ).toThrow();
  });

  it("rejects too short idempotency keys", () => {
    expect(() =>
      AgentChatRequestSchema.parse({
        message: "Zrób szybki obiad.",
        idempotencyKey: "short",
      }),
    ).toThrow();
  });
});

describe("AgentChatResponseSchema", () => {
  it("accepts the mock session response shape", () => {
    const now = new Date().toISOString();
    const parsed = AgentChatResponseSchema.parse({
      runId: "00000000-0000-4000-8000-000000000001",
      status: "collecting_context",
      message: {
        role: "assistant",
        content: "Jestem gotowy jako MealGenie Agent.",
      },
      state: {
        collectedContext: {},
        missingFields: ["goal"],
        canExecute: false,
        followUpCount: 1,
      },
      plan: null,
      steps: [
        {
          key: "session",
          label: "Sesja Agenta",
          actor: "chef_orchestrator",
          status: "succeeded",
          summary: "Utworzono sesję.",
          startedAt: now,
          completedAt: now,
          durationMs: 0,
        },
      ],
      nextActions: [{ type: "reply", label: "Kontynuuj rozmowę" }],
      error: null,
      meta: {
        createdAt: now,
        updatedAt: now,
        completedAt: null,
        durationMs: 0,
        model: null,
        tokenUsage: {
          inputTokens: null,
          outputTokens: null,
        },
      },
    });

    expect(parsed.status).toBe("collecting_context");
    expect(parsed.steps[0]?.key).toBe("session");
  });
});
