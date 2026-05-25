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
          plan: {
            id: "plan-1",
            title: "Ryż z jajkiem",
            summary: "Szybki obiad.",
            rationale: "Wykorzystuje produkty pod ręką.",
            usedIngredients: ["ryż", "jajka"],
            missingIngredients: [],
            assumptions: ["Masz sól."],
            warnings: [],
          },
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
    expect(result.state.canExecute).toBe(false);
    expect(result.outputTokens).toBe(8);
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
          plan: {
            id: "plan-2",
            title: "Omlet z ryżem",
            summary: "Plan po limicie pytań.",
            rationale: "Wykorzystuje dostępne informacje.",
            usedIngredients: ["ryż", "jajka"],
            missingIngredients: [],
            assumptions: ["Porcja dla jednej osoby."],
            warnings: [],
          },
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
