import request from "supertest";
import { app } from "../index.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const randomId = Math.floor(Math.random() * 100000);
const testUser = {
  email: `test${randomId}@example.com`,
  password: "password123",
};

describe("Auth & Security Integration Tests", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", testUser.email);
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  it("should login the user and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("should block access to protected route without token", async () => {
    const res = await request(app).post("/api/preferences").send({});

    expect(res.status).toBe(401);
  });
});
