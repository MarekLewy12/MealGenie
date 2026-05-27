import { zodTextFormat } from "openai/helpers/zod";
import {
  OpenAIAgentDecisionOutputSchema,
  parseOpenAIAgentDecisionOutput,
} from "./openai-agent-output.schema.js";

describe("OpenAI agent structured output schema", () => {
  it("generates a strict schema without discriminated-union oneOf output", () => {
    const format = zodTextFormat(
      OpenAIAgentDecisionOutputSchema,
      "agent_decision",
    );
    const schema = JSON.stringify(format.schema);

    expect(format.strict).toBe(true);
    expect(schema).not.toContain('"oneOf"');
    expect(schema).not.toContain('"propertyNames"');
  });

  it("parses a domain decision directly for internal tests and fallbacks", () => {
    const decision = parseOpenAIAgentDecisionOutput({
      type: "ask_follow_up",
      message: "Czy gotujemy tylko ze skladnikow, ktore masz w domu?",
      missingFields: ["shoppingFlexibility"],
    });

    expect(decision).toEqual({
      type: "ask_follow_up",
      message: "Czy gotujemy tylko ze skladnikow, ktore masz w domu?",
      missingFields: ["shoppingFlexibility"],
    });
  });

  it("maps the OpenAI-safe flat decision into the domain decision shape", () => {
    const decision = parseOpenAIAgentDecisionOutput({
      decision: {
        type: "show_plan",
        message: "Mam plan na szybki obiad.",
        missingFields: [],
        collectedContext: [
          { key: "goal", value: "szybki obiad" },
          { key: "timeLimit", value: "20 minut" },
        ],
        plan: {
          id: "plan-1",
          title: "Makaron z pomidorami",
          summary: "Szybki obiad z tego, co masz pod reka.",
          rationale: "Makaron i pomidory dobrze pasuja do krotkiego czasu.",
          mealType: "LUNCH",
          usedIngredients: ["makaron", "pomidory"],
          missingIngredients: [],
          assumptions: ["Masz podstawowe przyprawy."],
          warnings: [],
          mealTeaser: {
            name: "Makaron z pomidorami",
            description: "Prosty, szybki makaron.",
            difficulty: "Easy",
            cookingTimeMinutes: 20,
            calories: null,
            ingredients: [
              { name: "makaron", amount: "200 g" },
              { name: "pomidory", amount: "2 szt." },
            ],
            stepsSummary: ["Ugotuj makaron.", "Zrob sos.", "Polacz."],
            imagePromptEn:
              "Photorealistic food photo of tomato pasta with basil, natural light, ceramic plate.",
            imageUrl: null,
          },
          servings: 2,
          recipeContext: null,
          shoppingDraft: [
            {
              name: "bazylia",
              quantity: 1,
              unit: null,
              category: null,
            },
          ],
        },
        errorCode: "",
        retryable: false,
      },
    });

    expect(decision).toMatchObject({
      type: "show_plan",
      collectedContext: {
        goal: "szybki obiad",
        timeLimit: "20 minut",
      },
      plan: {
        mealType: "LUNCH",
        mealTeaser: {
          name: "Makaron z pomidorami",
          imagePromptEn:
            "Photorealistic food photo of tomato pasta with basil, natural light, ceramic plate.",
        },
      },
    });

    if (decision.type !== "show_plan") {
      throw new Error("Expected show_plan decision");
    }

    expect(decision.plan.recipeContext).toBeUndefined();
    expect(decision.plan.mealTeaser.calories).toBeUndefined();
    expect(decision.plan.shoppingDraft[0]?.unit).toBeUndefined();
  });

  it("normalizes English shopping draft units into Polish display units", () => {
    const decision = parseOpenAIAgentDecisionOutput({
      decision: {
        type: "show_plan",
        message: "Mam plan na szybki obiad.",
        missingFields: [],
        collectedContext: [],
        plan: {
          id: "plan-1",
          title: "Jajka z ziołami",
          summary: "Szybkie danie z jajek.",
          rationale: "Pasuje do krótkiego czasu.",
          mealType: "BREAKFAST",
          usedIngredients: ["jajka"],
          missingIngredients: ["szczypiorek"],
          assumptions: [],
          warnings: [],
          mealTeaser: {
            name: "Jajka z ziołami",
            description: "Prosty posiłek.",
            difficulty: "Easy",
            cookingTimeMinutes: 10,
            calories: null,
            ingredients: [{ name: "jajka", amount: "2 szt." }],
            stepsSummary: ["Usmaż jajka."],
            imagePromptEn:
              "Photorealistic food photo of eggs with herbs, natural light.",
            imageUrl: null,
          },
          servings: 1,
          recipeContext: null,
          shoppingDraft: [
            {
              name: "oliwa",
              quantity: 1,
              unit: "tbsp",
              category: null,
            },
            {
              name: "sól",
              quantity: 1,
              unit: "pinch",
              category: null,
            },
          ],
        },
        errorCode: "",
        retryable: false,
      },
    });

    if (decision.type !== "show_plan") {
      throw new Error("Expected show_plan decision");
    }

    expect(decision.plan.shoppingDraft).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "oliwa", unit: "łyżka" }),
        expect.objectContaining({ name: "sól", unit: "szczypta" }),
      ]),
    );
  });
});
