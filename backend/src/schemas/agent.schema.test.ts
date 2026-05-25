import {
  AgentDecisionSchema,
  AgentChatRequestSchema,
  AgentChatResponseSchema,
  AgentPlanDraftSchema,
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

describe("AgentPlanDraftSchema", () => {
  it("accepts the PR2 plan draft shape", () => {
    const parsed = AgentPlanDraftSchema.parse({
      id: "plan-1",
      title: "Makaron z pomidorami i jogurtem",
      summary: "Szybki obiad z produktów pod ręką.",
      rationale: "Wykorzystuje makaron i pomidory, a jogurt łagodzi sos.",
      usedIngredients: ["makaron", "pomidory", "jogurt"],
      missingIngredients: ["bazylia"],
      assumptions: ["Masz podstawowe przyprawy."],
      warnings: ["Nie sprawdzono jeszcze zapisanych alergii."],
    });

    expect(parsed.id).toBe("plan-1");
    expect(parsed.missingIngredients).toContain("bazylia");
  });

  it("rejects a plan without required fields", () => {
    expect(() =>
      AgentPlanDraftSchema.parse({
        id: "plan-1",
        title: "Niepełny plan",
      }),
    ).toThrow();
  });
});

describe("AgentDecisionSchema", () => {
  it("accepts an ask_follow_up decision", () => {
    const parsed = AgentDecisionSchema.parse({
      type: "ask_follow_up",
      message: "Czy możesz dokupić jeden składnik?",
      missingFields: ["shoppingFlexibility"],
      collectedContext: {
        goal: "szybki obiad",
      },
    });

    expect(parsed.type).toBe("ask_follow_up");
  });

  it("accepts a show_plan decision", () => {
    const parsed = AgentDecisionSchema.parse({
      type: "show_plan",
      message: "Mam dla Ciebie draft planu.",
      missingFields: [],
      plan: {
        id: "plan-1",
        title: "Ryż z jajkiem",
        summary: "Prosty, sycący posiłek.",
        rationale: "Pasuje do ograniczonej spiżarni.",
        usedIngredients: ["ryż", "jajka"],
        missingIngredients: [],
        assumptions: ["Masz sól i pieprz."],
        warnings: [],
      },
    });

    expect(parsed.type).toBe("show_plan");
  });

  it("accepts a fail decision", () => {
    const parsed = AgentDecisionSchema.parse({
      type: "fail",
      errorCode: "AGENT_INVALID_OUTPUT",
      message: "Nie udało się przygotować decyzji.",
      retryable: true,
    });

    expect(parsed.type).toBe("fail");
    if (parsed.type === "fail") {
      expect(parsed.retryable).toBe(true);
    }
  });

  it("rejects unknown decision types", () => {
    expect(() =>
      AgentDecisionSchema.parse({
        type: "write_recipe",
        message: "Nie powinno przejść.",
      }),
    ).toThrow();
  });
});
