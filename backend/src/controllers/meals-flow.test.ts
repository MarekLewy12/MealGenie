import { jest } from "@jest/globals";
import { randomUUID } from "node:crypto";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { app } from "../index.js";
import { setMealSuggestionsGeneratorForTests } from "./meals.controller.js";
import { setRecipeGeneratorForTests } from "./recipe.controller.js";
import type { MealWithImage } from "../schemas/meal.schema.js";
import type { FullRecipe } from "../schemas/recipe.schema.js";

const prisma = new PrismaClient();

const randomId = Math.floor(Math.random() * 100000);
const owner = {
  email: `flow-owner-${randomId}@example.com`,
  password: "password123",
  name: "Flow Owner",
};
const stranger = {
  email: `flow-stranger-${randomId}@example.com`,
  password: "password123",
  name: "Flow Stranger",
};

let ownerToken = "";
let strangerToken = "";

const suggestions: MealWithImage[] = [
  {
    name: "Ryż z jajkiem",
    description: "Prosty obiad.",
    difficulty: "Easy",
    cookingTimeMinutes: 20,
    calories: 520,
    imagePromptEn: "Photorealistic rice with fried eggs",
    ingredients: [{ name: "ryż", amount: "150 g" }],
    stepsSummary: ["Ugotuj ryż.", "Usmaż jajka."],
    imageUrl: "/meal-images/suggestion.jpg",
  },
];

const recipe: FullRecipe = {
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
  ],
  steps: Array.from({ length: 6 }, (_, index) => ({
    stepNumber: index + 1,
    title: `Krok ${index + 1}`,
    instruction: `Instrukcja ${index + 1}.`,
    duration: null,
    tip: null,
  })),
  nutrition: { calories: 520, protein: 22, carbs: 70, fat: 15, fiber: 3 },
  tips: ["Nie rozgotuj ryżu.", "Dopraw na końcu."],
  servingSuggestion: null,
  storageInfo: null,
};

const mealTeaser = {
  name: "Ryż z jajkiem",
  description: "Prosty obiad.",
  difficulty: "Easy" as const,
  cookingTimeMinutes: 20,
  ingredients: [{ name: "ryż", amount: "150 g" }],
  stepsSummary: ["Ugotuj ryż.", "Usmaż jajka."],
  imageUrl: "/meal-images/flow-test.jpg",
};

const suggestionsGenerator = jest.fn(async () => suggestions);
const recipeGenerator = jest.fn(async () => recipe);

function asOwner(req: request.Test) {
  return req.set("Authorization", `Bearer ${ownerToken}`);
}

function asStranger(req: request.Test) {
  return req.set("Authorization", `Bearer ${strangerToken}`);
}

async function register(user: typeof owner) {
  const res = await request(app).post("/api/auth/register").send(user);
  return {
    token: res.body.token as string,
    userId: res.body.user.id as string,
  };
}

describe("Meal suggestion, recipe and history flow", () => {
  beforeAll(async () => {
    const ownerAuth = await register(owner);
    ownerToken = ownerAuth.token;
    strangerToken = (await register(stranger)).token;
    await prisma.preference.create({ data: { userId: ownerAuth.userId } });

    setMealSuggestionsGeneratorForTests(suggestionsGenerator);
    setRecipeGeneratorForTests(recipeGenerator);
  });

  afterAll(async () => {
    setMealSuggestionsGeneratorForTests();
    setRecipeGeneratorForTests();
    await prisma.user.deleteMany({
      where: { email: { in: [owner.email, stranger.email] } },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/meals/suggest", () => {
    it("returns suggestions from the generator", async () => {
      const res = await asOwner(
        request(app).post("/api/meals/suggest").send({ mealType: "DINNER" }),
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ meals: suggestions });
      expect(suggestionsGenerator).toHaveBeenCalledTimes(1);
    });

    it("rejects a request without a token", async () => {
      const res = await request(app).post("/api/meals/suggest").send({});

      expect(res.status).toBe(401);
    });

    it("returns NO_PREFERENCES for a user without preferences", async () => {
      suggestionsGenerator.mockClear();

      const res = await asStranger(
        request(app).post("/api/meals/suggest").send({}),
      );

      expect(res.status).toBe(400);
      expect(res.body.code).toBe("NO_PREFERENCES");
      expect(suggestionsGenerator).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/meals/recipe", () => {
    it("rejects a request without a token", async () => {
      const res = await request(app)
        .post("/api/meals/recipe")
        .send({ mealTeaser });

      expect(res.status).toBe(401);
    });

    it("returns NO_PREFERENCES for a user without preferences", async () => {
      const res = await asStranger(
        request(app).post("/api/meals/recipe").send({ mealTeaser }),
      );

      expect(res.status).toBe(400);
      expect(res.body.code).toBe("NO_PREFERENCES");
    });

    it("saves the recipe with image and full JSON in history", async () => {
      const res = await asOwner(
        request(app).post("/api/meals/recipe").send({ mealTeaser }),
      );

      expect(res.status).toBe(200);
      expect(res.body.recipe).toEqual({
        ...recipe,
        imageUrl: mealTeaser.imageUrl,
      });

      const saved = await prisma.mealHistory.findUniqueOrThrow({
        where: { id: res.body.mealHistoryId },
      });
      expect(saved.imageUrl).toBe(mealTeaser.imageUrl);
      expect(saved.fullRecipeJson).toEqual(recipe);
      expect(saved.wasSelected).toBe(true);
    });
  });

  describe("history, favorites, sharing and deletion", () => {
    let mealId = "";

    beforeAll(async () => {
      const res = await asOwner(
        request(app).post("/api/meals/recipe").send({ mealTeaser }),
      );
      mealId = res.body.mealHistoryId as string;
    });

    it("lists history for the owner only", async () => {
      const ownerRes = await asOwner(request(app).get("/api/meals/history"));
      const strangerRes = await asStranger(
        request(app).get("/api/meals/history"),
      );

      expect(ownerRes.status).toBe(200);
      expect(ownerRes.body.total).toBeGreaterThanOrEqual(1);
      expect(ownerRes.body.items.map((item: { id: string }) => item.id)).toContain(
        mealId,
      );
      expect(strangerRes.body).toEqual({ items: [], total: 0 });
    });

    it("returns meal details to the owner", async () => {
      const res = await asOwner(request(app).get(`/api/meals/history/${mealId}`));

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(mealId);
      expect(res.body.imageUrl).toBe(mealTeaser.imageUrl);
      expect(res.body.fullRecipeJson).toEqual(recipe);
    });

    it("hides another user's meal with 404", async () => {
      const detail = await asStranger(
        request(app).get(`/api/meals/history/${mealId}`),
      );
      const favorite = await asStranger(
        request(app).patch(`/api/meals/${mealId}/favorite`),
      );
      const share = await asStranger(
        request(app).patch(`/api/meals/${mealId}/share`),
      );
      const remove = await asStranger(
        request(app).delete(`/api/meals/history/${mealId}`),
      );

      for (const res of [detail, favorite, share, remove]) {
        expect(res.status).toBe(404);
        expect(res.body.code).toBe("MEAL_NOT_FOUND");
      }
      expect(await prisma.mealHistory.count({ where: { id: mealId } })).toBe(1);
    });

    it("returns 404 for a missing meal", async () => {
      const res = await asOwner(
        request(app).get(`/api/meals/history/${randomUUID()}`),
      );

      expect(res.status).toBe(404);
      expect(res.body.code).toBe("MEAL_NOT_FOUND");
    });

    it("toggles favorite and filters by it", async () => {
      const on = await asOwner(request(app).patch(`/api/meals/${mealId}/favorite`));
      const list = await asOwner(
        request(app).get("/api/meals/history?favoritesOnly=true"),
      );
      const off = await asOwner(request(app).patch(`/api/meals/${mealId}/favorite`));

      expect(on.body).toEqual({ isFavorite: true });
      expect(list.body.items.map((item: { id: string }) => item.id)).toEqual([
        mealId,
      ]);
      expect(off.body).toEqual({ isFavorite: false });
    });

    it("shares a meal publicly and stops sharing on the second toggle", async () => {
      const on = await asOwner(request(app).patch(`/api/meals/${mealId}/share`));
      const shareId = on.body.shareId as string;
      const shared = await request(app).get(`/api/meals/shared/${shareId}`);

      expect(shareId).toEqual(expect.any(String));
      expect(shared.status).toBe(200);
      expect(shared.body.id).toBe(mealId);
      expect(shared.body.imageUrl).toBe(mealTeaser.imageUrl);

      const off = await asOwner(request(app).patch(`/api/meals/${mealId}/share`));
      const gone = await request(app).get(`/api/meals/shared/${shareId}`);

      expect(off.body).toEqual({ shareId: null });
      expect(gone.status).toBe(404);
      expect(gone.body.code).toBe("SHARED_MEAL_NOT_FOUND");
    });

    it("deletes a meal for the owner", async () => {
      const res = await asOwner(
        request(app).delete(`/api/meals/history/${mealId}`),
      );

      expect(res.status).toBe(204);
      expect(await prisma.mealHistory.count({ where: { id: mealId } })).toBe(0);
    });
  });
});
