import { jest } from "@jest/globals";
import { randomUUID } from "node:crypto";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { app } from "../index.js";
import { setAgentRecipeGeneratorForTests } from "../services/agents/agent-execution.service.js";
import { setAgentOrchestratorForTests } from "../services/agents/agent-session.service.js";
import type { AgentPlanDraft } from "../schemas/agent.schema.js";
import type { FullRecipe } from "../schemas/recipe.schema.js";

const prisma = new PrismaClient();

const randomId = Math.floor(Math.random() * 100000);
const firstUser = {
  email: `agent-a-${randomId}@example.com`,
  password: "password123",
  name: "Agent Tester A",
};
const secondUser = {
  email: `agent-b-${randomId}@example.com`,
  password: "password123",
  name: "Agent Tester B",
};

async function registerAndGetToken(user: typeof firstUser): Promise<string> {
  const res = await request(app).post("/api/auth/register").send(user);
  return res.body.token as string;
}

function buildAgentTurn(state: {
  collectedContext: Record<string, unknown>;
  missingFields: string[];
  canExecute: boolean;
  followUpCount: number;
}) {
  const now = new Date().toISOString();

  return {
    status: "collecting_context" as const,
    assistantContent: "Czy możesz doprecyzować, czy możesz dokupić składniki?",
    state: {
      ...state,
      missingFields: ["shoppingFlexibility"],
      canExecute: false,
      followUpCount: state.followUpCount + 1,
    },
    plan: null,
    steps: [
      {
        key: "session" as const,
        label: "Sesja Agenta",
        actor: "chef_orchestrator" as const,
        status: "succeeded" as const,
        startedAt: now,
        completedAt: now,
        durationMs: 0,
      },
    ],
    errorCode: null,
    errorMessage: null,
    model: "gpt-5.4-mini",
    inputTokens: 10,
    outputTokens: 5,
  };
}

function buildExecutablePlan(overrides: Partial<AgentPlanDraft> = {}) {
  return {
    id: "plan-agent-test",
    title: "Ryż z jajkiem",
    summary: "Szybki obiad z produktów pod ręką.",
    rationale: "Wykorzystuje proste składniki i krótki czas.",
    mealType: "DINNER",
    usedIngredients: ["ryż", "jajka"],
    missingIngredients: ["śmietana"],
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
    shoppingDraft: [
      {
        name: "Śmietana",
        quantity: 1,
        unit: "opak.",
        category: "Nabiał",
      },
    ],
    ...overrides,
  } satisfies AgentPlanDraft;
}

function buildFullRecipe(overrides: Partial<FullRecipe> = {}): FullRecipe {
  return {
    name: "Ryż z jajkiem",
    description: "Prosty obiad.",
    difficulty: "Easy",
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    servings: 2,
    ingredients: [
      {
        name: "ryż",
        amount: "150",
        unit: "g",
        category: "Zboża",
        notes: null,
      },
      {
        name: "jajka",
        amount: "2",
        unit: "szt.",
        category: "Nabiał",
        notes: null,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Ugotuj ryż",
        instruction: "Ugotuj ryż do miękkości.",
        duration: "15 minut",
        tip: null,
      },
      {
        stepNumber: 2,
        title: "Usmaż jajka",
        instruction: "Usmaż jajka i połącz z ryżem.",
        duration: "5 minut",
        tip: null,
      },
      {
        stepNumber: 3,
        title: "Dopraw",
        instruction: "Dopraw do smaku.",
        duration: null,
        tip: null,
      },
      {
        stepNumber: 4,
        title: "Podaj",
        instruction: "Podaj od razu.",
        duration: null,
        tip: null,
      },
      {
        stepNumber: 5,
        title: "Zachowaj resztki",
        instruction: "Resztki przechowuj w lodówce.",
        duration: null,
        tip: null,
      },
      {
        stepNumber: 6,
        title: "Odgrzej",
        instruction: "Odgrzej na patelni.",
        duration: null,
        tip: null,
      },
    ],
    nutrition: {
      calories: 520,
      protein: 22,
      carbs: 70,
      fat: 15,
      fiber: 3,
    },
    tips: ["Nie rozgotuj ryżu.", "Dopraw na końcu."],
    servingSuggestion: "Podaj z ziołami.",
    storageInfo: "Przechowuj do 2 dni.",
    ...overrides,
  };
}

async function createExecutableRun(args: {
  userId: string;
  plan?: AgentPlanDraft;
  status?: string;
  canExecute?: boolean;
}) {
  const runId = randomUUID();
  const plan = args.plan ?? buildExecutablePlan();
  const state = {
    collectedContext: {},
    missingFields: [],
    canExecute: args.canExecute ?? true,
    followUpCount: 1,
  };

  await prisma.$executeRaw`
    INSERT INTO "AgentRun" (
      "id",
      "userId",
      "mode",
      "status",
      "messagesJson",
      "stateJson",
      "stepsJson",
      "planJson",
      "updatedAt"
    )
    VALUES (
      ${runId},
      ${args.userId},
      'CHEF_ORCHESTRATOR',
      ${args.status ?? "awaiting_confirmation"},
      CAST(${JSON.stringify([])} AS JSONB),
      CAST(${JSON.stringify(state)} AS JSONB),
      CAST(${JSON.stringify([])} AS JSONB),
      CAST(${JSON.stringify(plan)} AS JSONB),
      CURRENT_TIMESTAMP
    )
  `;

  return { runId, plan };
}

describe("Agent controllers", () => {
  const previousFlag = process.env.MEALGENIE_AGENT_ENABLED;
  let orchestrator: jest.Mock;
  let firstToken: string;
  let secondToken: string;

  beforeAll(async () => {
    firstToken = await registerAndGetToken(firstUser);
    secondToken = await registerAndGetToken(secondUser);
  });

  beforeEach(() => {
    orchestrator = jest.fn(async ({ state }) => buildAgentTurn(state));
    setAgentOrchestratorForTests(orchestrator as never);
    setAgentRecipeGeneratorForTests(jest.fn(async () => buildFullRecipe()));
  });

  afterAll(async () => {
    process.env.MEALGENIE_AGENT_ENABLED = previousFlag;
    setAgentOrchestratorForTests();
    setAgentRecipeGeneratorForTests();
    await prisma.user.deleteMany({
      where: { email: { in: [firstUser.email, secondUser.email] } },
    });
    await prisma.$disconnect();
  });

  it("requires auth for agent chat", async () => {
    const res = await request(app)
      .post("/api/agents/chat")
      .send({ message: "Mam ryż i jajka." });

    expect(res.status).toBe(401);
  });

  it("returns AGENT_DISABLED when the feature flag is off", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "false";

    const res = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({ message: "Mam ryż i jajka." });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("AGENT_DISABLED");
  });

  it("creates an agent run when the feature flag is on", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";

    const res = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({ message: "Mam kurczaka i cukinię." });

    expect(res.status).toBe(200);
    expect(res.body.runId).toEqual(expect.any(String));
    expect(res.body.status).toBe("collecting_context");
    expect(res.body.message.role).toBe("assistant");
    expect(res.body.steps[0].key).toBe("session");
    expect(res.body.meta.model).toBe("gpt-5.4-mini");
  });

  it("returns the existing run for repeated idempotency keys", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";
    const idempotencyKey = `agent-idempotency-${randomId}`;

    const firstRes = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        message: "Mam makaron i pomidory.",
        idempotencyKey,
      });

    const retryRes = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        message: "Ten sam request po retry.",
        idempotencyKey,
      });

    const detailRes = await request(app)
      .get(`/api/agents/runs/${firstRes.body.runId}`)
      .set("Authorization", `Bearer ${firstToken}`);

    expect(firstRes.status).toBe(200);
    expect(retryRes.status).toBe(200);
    expect(retryRes.body.runId).toBe(firstRes.body.runId);
    expect(detailRes.body.messages.length).toBe(2);
    expect(orchestrator).toHaveBeenCalledTimes(1);
  });

  it("returns the owning user's run detail", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";

    const createRes = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({ message: "Chcę szybki obiad." });

    const detailRes = await request(app)
      .get(`/api/agents/runs/${createRes.body.runId}`)
      .set("Authorization", `Bearer ${firstToken}`);

    expect(detailRes.status).toBe(200);
    expect(detailRes.body.runId).toBe(createRes.body.runId);
    expect(detailRes.body.messages.length).toBe(2);
  });

  it("continues an owned run and appends the next turn", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";

    const createRes = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({ message: "Mam szybki cel." });

    const continueRes = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        runId: createRes.body.runId,
        message: "Mogę dokupić jeden składnik.",
      });

    const detailRes = await request(app)
      .get(`/api/agents/runs/${createRes.body.runId}`)
      .set("Authorization", `Bearer ${firstToken}`);

    expect(continueRes.status).toBe(200);
    expect(continueRes.body.runId).toBe(createRes.body.runId);
    expect(detailRes.body.messages.length).toBe(4);
    expect(orchestrator).toHaveBeenCalledTimes(2);
  });

  it("does not expose another user's run", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";

    const createRes = await request(app)
      .post("/api/agents/chat")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({ message: "Nie chcę iść do sklepu." });

    const detailRes = await request(app)
      .get(`/api/agents/runs/${createRes.body.runId}`)
      .set("Authorization", `Bearer ${secondToken}`);

    expect(detailRes.status).toBe(404);
    expect(detailRes.body.error.code).toBe("AGENT_RUN_NOT_FOUND");
  });

  it("requires auth for agent execute", async () => {
    const res = await request(app)
      .post("/api/agents/execute")
      .send({
        runId: randomUUID(),
        acceptedPlanId: "plan-agent-test",
        actions: ["create_recipe"],
      });

    expect(res.status).toBe(401);
  });

  it("returns AGENT_DISABLED for execute when the feature flag is off", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "false";

    const res = await request(app)
      .post("/api/agents/execute")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        runId: randomUUID(),
        acceptedPlanId: "plan-agent-test",
        actions: ["create_recipe"],
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("AGENT_DISABLED");
  });

  it("executes a confirmed plan and deduplicates shopping items", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: firstUser.email },
    });
    await prisma.preference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        diet: "NONE",
        allergies: [],
        dislikedIngredients: [],
        favoriteCuisines: [],
        cookingSkill: "BEGINNER",
        equipment: [],
        budget: "NONE",
        spiceLevel: 3,
      },
      update: {
        allergies: [],
        dislikedIngredients: [],
      },
    });
    await prisma.shoppingItem.create({
      data: {
        userId: user.id,
        item: "smietana",
        quantity: 1,
        obtained: false,
      },
    });
    const { runId, plan } = await createExecutableRun({ userId: user.id });

    const res = await request(app)
      .post("/api/agents/execute")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        runId,
        acceptedPlanId: plan.id,
        actions: ["create_recipe", "populate_shopping_list"],
        idempotencyKey: `execute-${randomId}`,
      });
    const retryRes = await request(app)
      .post("/api/agents/execute")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        runId,
        acceptedPlanId: plan.id,
        actions: ["create_recipe", "populate_shopping_list"],
        idempotencyKey: `execute-${randomId}`,
      });
    const mealCount = await prisma.mealHistory.count({
      where: { userId: user.id, name: "Ryż z jajkiem" },
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
    expect(res.body.result.mealHistoryId).toEqual(expect.any(String));
    expect(res.body.result.shoppingItemsAdded).toHaveLength(0);
    expect(res.body.result.skippedShoppingItems[0].reason).toBe(
      "duplicate_active_item",
    );
    expect(retryRes.body.result.mealHistoryId).toBe(
      res.body.result.mealHistoryId,
    );
    expect(mealCount).toBe(1);
  });

  it("persists the meal history category from the accepted agent plan", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: firstUser.email },
    });
    await prisma.preference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        diet: "NONE",
        allergies: [],
        dislikedIngredients: [],
        favoriteCuisines: [],
        cookingSkill: "BEGINNER",
        equipment: [],
        budget: "NONE",
        spiceLevel: 3,
      },
      update: {
        allergies: [],
        dislikedIngredients: [],
      },
    });
    const { runId, plan } = await createExecutableRun({
      userId: user.id,
      plan: buildExecutablePlan({
        id: `breakfast-plan-${randomId}`,
        title: "Śniadaniowy ryż z jajkiem",
        mealType: "BREAKFAST",
      }),
    });

    const res = await request(app)
      .post("/api/agents/execute")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        runId,
        acceptedPlanId: plan.id,
        actions: ["create_recipe"],
      });
    const savedMeal = await prisma.mealHistory.findUnique({
      where: { id: res.body.result.mealHistoryId },
      select: { category: true },
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
    expect(savedMeal?.category).toBe("BREAKFAST");
  });

  it("rejects execute for a mismatched plan id", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: firstUser.email },
    });
    const { runId } = await createExecutableRun({ userId: user.id });

    const res = await request(app)
      .post("/api/agents/execute")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        runId,
        acceptedPlanId: "different-plan",
        actions: ["create_recipe"],
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("AGENT_PLAN_MISMATCH");
  });

  it("blocks execute when the plan conflicts with allergies", async () => {
    process.env.MEALGENIE_AGENT_ENABLED = "true";
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: firstUser.email },
    });
    await prisma.preference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        diet: "NONE",
        allergies: ["jajka"],
        dislikedIngredients: [],
        favoriteCuisines: [],
        cookingSkill: "BEGINNER",
        equipment: [],
        budget: "NONE",
        spiceLevel: 3,
      },
      update: {
        allergies: ["jajka"],
        dislikedIngredients: [],
      },
    });
    const { runId, plan } = await createExecutableRun({ userId: user.id });

    const res = await request(app)
      .post("/api/agents/execute")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        runId,
        acceptedPlanId: plan.id,
        actions: ["create_recipe"],
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("AGENT_ALLERGY_CONFLICT");
  });
});
