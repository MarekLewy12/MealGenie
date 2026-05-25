import { jest } from "@jest/globals";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { app } from "../index.js";
import { setAgentOrchestratorForTests } from "../services/agents/agent-session.service.js";

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
  });

  afterAll(async () => {
    process.env.MEALGENIE_AGENT_ENABLED = previousFlag;
    setAgentOrchestratorForTests();
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
});
