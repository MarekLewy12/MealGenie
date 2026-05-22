import { GenerateRecipeRequestSchema } from "./recipe.schema.js";

const mealTeaser = {
  name: "Makaron z warzywami",
  description: "Szybki obiad z sezonowymi warzywami.",
  difficulty: "Easy",
  cookingTimeMinutes: 25,
  calories: 520,
  ingredients: [
    {
      name: "makaron",
      amount: "200 g",
    },
  ],
  stepsSummary: ["Ugotuj makaron", "Podsmaz warzywa", "Wymieszaj z sosem"],
  imageUrl: "/meal-images/test.jpg",
};

describe("GenerateRecipeRequestSchema", () => {
  it("keeps backward compatibility when recipeContext is omitted", () => {
    const parsed = GenerateRecipeRequestSchema.parse({
      mealTeaser,
      servings: 4,
    });

    expect(parsed.servings).toBe(4);
    expect(parsed.recipeContext).toBeUndefined();
  });

  it("accepts generator context for weight-based full recipes", () => {
    const parsed = GenerateRecipeRequestSchema.parse({
      mealTeaser,
      servings: 2,
      recipeContext: {
        portionMode: "weight",
        servingSize: 2,
        targetWeightGrams: 750,
        hungerLevel: 4,
      },
    });

    expect(parsed.recipeContext).toEqual({
      portionMode: "weight",
      servingSize: 2,
      targetWeightGrams: 750,
      hungerLevel: 4,
    });
  });

  it("rejects invalid generator context values", () => {
    expect(() =>
      GenerateRecipeRequestSchema.parse({
        mealTeaser,
        recipeContext: {
          portionMode: "weight",
          targetWeightGrams: 20,
          hungerLevel: 8,
        },
      }),
    ).toThrow();
  });
});
