import fs from "fs";
import path from "path";
import crypto from "crypto";

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

if (!TOGETHER_API_KEY) {
  throw new Error("TOGETHER_API_KEY environment variable is not set");
}

// Parametry generatora obrazkow.
const IMAGE_MODEL = "black-forest-labs/FLUX.2-dev";
const IMAGE_STEPS = 28;
const IMAGE_GUIDANCE = 7;
const IMAGE_WIDTH = 1344;
const IMAGE_HEIGHT = 768;
const IMAGE_NEGATIVE_PROMPT =
  "illustration, cartoon, drawing, painting, sketch, 3d render, " +
  "CGI, anime, wrong ingredients, inaccurate food, plastic looking, " +
  "artificial, watermark, text overlay, blurry, out of focus, " +
  "oversaturated, underexposed, low quality, ugly";

// Katalog na obrazki dla frontendu (serwowany z /public)
const IMAGE_DIR = path.join(process.cwd(), "public", "meal-images");

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

type TogetherImageResponse = {
  id: string;
  model: string;
  object: "list";
  data: Array<
    | { index: number; b64_json: string; type?: string | null }
    | { index: number; url: string }
  >;
};

type MealImageInput = {
  name: string;
  ingredients: Array<{ name: string }>;
  imagePromptEn?: string | null;
};

export function cleanupOldImages(maxAgeDays: number = 7): void {
  try {
    if (!fs.existsSync(IMAGE_DIR)) {
      return;
    }

    const files = fs.readdirSync(IMAGE_DIR);
    const now = Date.now();
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    for (const file of files) {
      if (!file.endsWith(".jpg") && !file.endsWith(".png")) {
        continue;
      }

      const filePath = path.join(IMAGE_DIR, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtimeMs;

      if (fileAge > maxAgeMs) {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`[CLEANUP] Usunieto stary obrazek: ${file}`);
      }
    }

    if (deletedCount > 0) {
      console.log(`[CLEANUP] Lacznie usunieto ${deletedCount} starych obrazkow`);
    }
  } catch (error) {
    console.error("[CLEANUP] Blad podczas czyszczenia obrazkow:", error);
  }
}

export async function generateMealImages(
  meals: MealImageInput[],
): Promise<Array<string | null>> {
  console.log(
    "[IMAGE] Generating images for meals:",
    meals.map((m) => m.name),
  );

  const promises = meals.map(async (meal) => {
    try {
      return await generateMealImage(meal);
    } catch (err) {
      console.error(`[IMAGE] Failed for "${meal.name}":`, err);
      return null;
    }
  });

  return Promise.allSettled(promises).then((results) =>
    results.map((r) => (r.status === "fulfilled" ? r.value : null)),
  );
}

async function generateMealImage(meal: MealImageInput): Promise<string | null> {
  console.log("[IMAGE] Generating image:", meal.name);
  const prompt = buildImagePrompt(meal);

  const b64 = await togetherGenerateBase64Jpeg(prompt);

  if (!b64) {
    console.error("[IMAGE] No image data returned");
    return null;
  }

  const fileName = `${crypto.randomUUID()}.jpg`;
  const filePath = path.join(IMAGE_DIR, fileName);
  const buffer = Buffer.from(b64, "base64");

  fs.writeFileSync(filePath, buffer);
  console.log("[IMAGE] Saved:", filePath);

  return `/meal-images/${fileName}`;
}

async function togetherGenerateBase64Jpeg(
  prompt: string,
): Promise<string | null> {
  const res = await fetch("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      steps: IMAGE_STEPS,
      guidance_scale: IMAGE_GUIDANCE,
      n: 1,
      response_format: "base64",
      output_format: "jpeg",
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      negative_prompt: IMAGE_NEGATIVE_PROMPT,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`[TOGETHER] ${res.status} ${res.statusText} ${errText}`);
  }

  const json = (await res.json()) as TogetherImageResponse;
  const first = json.data?.[0] as
    | { b64_json?: string | null }
    | undefined;
  const b64 = first?.b64_json;

  return typeof b64 === "string" ? b64 : null;
}

function buildImagePrompt(meal: MealImageInput): string {
  const promptEn = meal.imagePromptEn?.trim();
  if (promptEn) {
    return promptEn.length > 300 ? promptEn.slice(0, 300) : promptEn;
  }

  const heroIngredients = meal.ingredients
    .slice(0, 3)
    .map((i) => i.name)
    .join(" and ");

  return `Photorealistic food photo of "${meal.name}" featuring ${heroIngredients}. ` +
    "Professional restaurant food photography, 45-degree angle, soft natural " +
    "window light, shallow depth of field, clean ceramic plate, rustic wooden " +
    "table, vibrant colors, highly detailed textures.";
}
