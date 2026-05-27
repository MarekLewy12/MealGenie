import { runAgentTurn } from "./agent-orchestrator.service.js";
import type { AgentMessage, AgentState } from "../../schemas/agent.schema.js";
import type {
  AgentRuntimeInput,
  AgentRuntimeResult,
} from "./openai-agent-runtime.js";

const messages: AgentMessage[] = [
  {
    role: "user",
    content: "Mam ryż i jajka.",
    createdAt: new Date().toISOString(),
  },
];

function createState(overrides: Partial<AgentState> = {}): AgentState {
  return {
    collectedContext: {},
    missingFields: ["goal"],
    canExecute: false,
    followUpCount: 0,
    ...overrides,
  };
}

function createPlan(id = "plan-1") {
  return {
    id,
    title: "Ryż z jajkiem",
    summary: "Prosty, sycący posiłek.",
    rationale: "Pasuje do ograniczonej spiżarni.",
    usedIngredients: ["ryż", "jajka"],
    missingIngredients: [],
    assumptions: ["Masz sól i pieprz."],
    warnings: [],
    mealTeaser: {
      name: "Ryż z jajkiem",
      description: "Prosty, sycący posiłek.",
      difficulty: "Easy" as const,
      cookingTimeMinutes: 20,
      calories: 520,
      ingredients: [
        { name: "ryż", amount: "150 g" },
        { name: "jajka", amount: "2 szt." },
      ],
      stepsSummary: ["Ugotuj ryż.", "Usmaż jajka.", "Połącz składniki."],
      imageUrl: null,
    },
    servings: 2,
    shoppingDraft: [],
  };
}

function createRuntime(results: AgentRuntimeResult[]) {
  const calls: AgentRuntimeInput[] = [];
  const runtime = async (args: AgentRuntimeInput) => {
    calls.push(args);
    return results[Math.min(calls.length - 1, results.length - 1)];
  };

  return { runtime, calls };
}

describe("runAgentTurn", () => {
  it("turns ask_follow_up decisions into collecting_context state", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "ask_follow_up",
          message: "Czy możesz dokupić jeden składnik?",
          missingFields: ["shoppingFlexibility"],
          collectedContext: {
            goal: "szybki obiad",
          },
        },
        model: "gpt-5.4-mini",
        inputTokens: 10,
        outputTokens: 5,
      },
    ]);

    const result = await runAgentTurn(
      { messages, state: createState() },
      fake.runtime,
    );

    expect(result.status).toBe("collecting_context");
    expect(result.assistantContent).toContain("dokupić");
    expect(result.state.followUpCount).toBe(1);
    expect(result.state.missingFields).toEqual(["shoppingFlexibility"]);
    expect(result.state.collectedContext.goal).toBe("szybki obiad");
    expect(result.steps.some((step) => step.key === "planning")).toBe(true);
  });

  it("turns show_plan decisions into awaiting_confirmation state", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "show_plan",
          message: "Mam draft planu.",
          missingFields: [],
          plan: createPlan(),
        },
        model: "gpt-5.4-mini",
        inputTokens: 20,
        outputTokens: 8,
      },
    ]);

    const result = await runAgentTurn(
      { messages, state: createState({ followUpCount: 1 }) },
      fake.runtime,
    );

    expect(result.status).toBe("awaiting_confirmation");
    expect(result.plan?.title).toBe("Ryż z jajkiem");
    expect(result.state.canExecute).toBe(true);
    expect(result.outputTokens).toBe(8);
  });

  it("allows a complete first-turn plan returned by the model", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "show_plan",
          message: "Mam draft planu.",
          missingFields: [],
          plan: createPlan(),
        },
        model: "gpt-5.4-mini",
        inputTokens: 20,
        outputTokens: 8,
      },
    ]);

    const result = await runAgentTurn(
      { messages, state: createState() },
      fake.runtime,
    );

    expect(result.status).toBe("awaiting_confirmation");
    expect(result.plan?.title).toBe("Ryż z jajkiem");
    expect(result.state.canExecute).toBe(true);
  });

  it("allows a first-turn plan for 'dla mnie' when the model resolved servings", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "show_plan",
          message: "Mam draft planu.",
          missingFields: [],
          plan: { ...createPlan(), servings: 1 },
        },
        model: "gpt-5.4-mini",
        inputTokens: 20,
        outputTokens: 8,
      },
    ]);

    const result = await runAgentTurn(
      {
        messages: [
          {
            role: "user",
            content:
              "Chcę lekką kolację dla mnie, mam jajka i ryż, maksymalnie 20 minut.",
            createdAt: new Date().toISOString(),
          },
        ],
        state: createState(),
      },
      fake.runtime,
    );

    expect(result.status).toBe("awaiting_confirmation");
    expect(result.plan?.servings).toBe(1);
    expect(result.state.canExecute).toBe(true);
  });

  it("allows a first-turn plan when the user gives servings and style", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "show_plan",
          message: "Mam draft planu.",
          missingFields: [],
          plan: createPlan(),
        },
        model: "gpt-5.4-mini",
        inputTokens: 20,
        outputTokens: 8,
      },
    ]);

    const result = await runAgentTurn(
      {
        messages: [
          {
            role: "user",
            content:
              "Mam ryż i jajka, 20 minut, chcę sycące śniadanie dla 2 osób.",
            createdAt: new Date().toISOString(),
          },
        ],
        state: createState(),
      },
      fake.runtime,
    );

    expect(result.status).toBe("awaiting_confirmation");
    expect(result.plan?.title).toBe("Ryż z jajkiem");
    expect(result.state.canExecute).toBe(true);
  });

  it("does not show profile and history steps on follow-up turns", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "show_plan",
          message: "Mam draft planu.",
          missingFields: [],
          plan: createPlan(),
        },
        model: "gpt-5.4-mini",
        inputTokens: 20,
        outputTokens: 8,
      },
    ]);

    const result = await runAgentTurn(
      {
        messages: [
          ...messages,
          {
            role: "assistant",
            content: "Dla ilu osób gotujemy?",
            createdAt: new Date().toISOString(),
          },
          {
            role: "user",
            content: "Dla 2 osób, wytrawnie.",
            createdAt: new Date().toISOString(),
          },
        ],
        state: createState({ followUpCount: 1 }),
      },
      fake.runtime,
    );

    expect(result.steps.map((step) => step.key)).not.toContain("preferences");
    expect(result.steps.map((step) => step.key)).not.toContain("history");
    expect(result.steps.map((step) => step.key)).toEqual([
      "session",
      "planning",
      "review",
      "final_response",
    ]);
  });

  it("passes current plan in revision mode and annotates changed sections", async () => {
    const currentPlan = createPlan("original-plan");
    const revisedPlan = {
      ...createPlan("model-plan-id"),
      usedIngredients: ["ryż"],
      missingIngredients: ["jajka"],
      shoppingDraft: [
        {
          name: "jajka",
          quantity: 2,
          unit: "szt.",
          category: "Nabiał",
        },
      ],
    };
    const fake = createRuntime([
      {
        decision: {
          type: "show_plan",
          message: "Zaktualizowałem plan.",
          missingFields: [],
          plan: revisedPlan,
        },
        model: "gpt-5.4-mini",
        inputTokens: 20,
        outputTokens: 8,
      },
    ]);

    const result = await runAgentTurn(
      {
        messages: [
          {
            role: "user",
            content: "Wolę bez jajek w bazie, dodaj je do zakupów.",
            createdAt: new Date().toISOString(),
          },
        ],
        state: createState({ canExecute: true, followUpCount: 1 }),
        currentPlan,
        turnMode: "revision",
      },
      fake.runtime,
    );

    expect(fake.calls[0]?.turnMode).toBe("revision");
    expect(fake.calls[0]?.currentPlan?.id).toBe("original-plan");
    expect(result.status).toBe("awaiting_confirmation");
    expect(result.plan?.id).toBe("original-plan");
    expect(result.plan?.revision?.sourceMessage).toContain("Wolę bez jajek");
    expect(result.plan?.revision?.changedSections).toEqual(
      expect.arrayContaining(["ingredients", "shopping"]),
    );
  });

  it("forces a plan after three follow-up turns", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "ask_follow_up",
          message: "Jeszcze jedno pytanie?",
          missingFields: ["servings"],
        },
        model: "gpt-5.4-mini",
        inputTokens: 10,
        outputTokens: 5,
      },
      {
        decision: {
          type: "show_plan",
          message: "Pokazuję najlepszy możliwy plan.",
          missingFields: [],
          plan: createPlan("plan-2"),
        },
        model: "gpt-5.4-mini",
        inputTokens: 12,
        outputTokens: 6,
      },
    ]);

    const result = await runAgentTurn(
      { messages, state: createState({ followUpCount: 3 }) },
      fake.runtime,
    );

    expect(fake.calls.length).toBe(2);
    expect(fake.calls[0]?.forcePlan).toBe(true);
    expect(result.status).toBe("awaiting_confirmation");
    expect(result.plan?.id).toBe("plan-2");
  });

  it("returns AGENT_INVALID_OUTPUT if the model asks again after forced plan retry", async () => {
    const fake = createRuntime([
      {
        decision: {
          type: "ask_follow_up",
          message: "Nadal pytam.",
          missingFields: ["servings"],
        },
        model: "gpt-5.4-mini",
        inputTokens: 10,
        outputTokens: 5,
      },
    ]);

    const result = await runAgentTurn(
      { messages, state: createState({ followUpCount: 3 }) },
      fake.runtime,
    );

    expect(result.status).toBe("failed");
    expect(result.errorCode).toBe("AGENT_INVALID_OUTPUT");
  });
});
