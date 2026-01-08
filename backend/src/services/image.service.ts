import fs from "fs";
import path from "path";
import crypto from "crypto";

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

if (!TOGETHER_API_KEY) {
  throw new Error("TOGETHER_API_KEY environment variable is not set");
}

// Katalog na cache obrazkow dla frontendu (serwowany z /public)
const IMAGE_DIR = path.join(process.cwd(), "public", "meal-images");

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Minimalny typ odpowiedzi Together.ai potrzebny do odczytu base64
type TogetherImageResponse = {
  id: string;
  model: string;
  object: "list";
  data: Array<
    | { index: number; b64_json: string; type?: string | null }
    | { index: number; url: string }
  >;
};

// Usuwa obrazy starsze niz zadany wiek, aby ograniczyc rozrost cache
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

// Generuje obrazki dla wielu posilkow rownolegle
export async function generateMealImages(
  meals: Array<{ name: string; ingredients: Array<{ name: string }> }>,
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

// Generuje pojedynczy obrazek z cache
async function generateMealImage(meal: {
  name: string;
  ingredients: Array<{ name: string }>;
}): Promise<string | null> {
  const cacheKey = getCacheKey(meal);
  const filePath = path.join(IMAGE_DIR, `${cacheKey}.jpg`);

  if (fs.existsSync(filePath)) {
    console.log("[IMAGE] Cache hit:", cacheKey);
    return `/meal-images/${cacheKey}.jpg`;
  }

  console.log("[IMAGE] Cache miss, generating:", meal.name);
  const prompt = buildImagePrompt(meal);

  const b64 = await togetherGenerateBase64Jpeg(prompt);

  if (!b64) {
    console.error("[IMAGE] No image data returned");
    return null;
  }

  const buffer = Buffer.from(b64, "base64");

  fs.writeFileSync(filePath, buffer);
  console.log("[IMAGE] Saved:", filePath);

  return `/meal-images/${cacheKey}.jpg`;
}

// Wywolanie Together.ai i zwrot base64
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
      model: "black-forest-labs/FLUX.1-dev",
      prompt,
      steps: 20,
      n: 1,
      response_format: "base64",
      output_format: "jpeg",
      width: 1344,
      height: 768,
      negative_prompt:
        "illustration, cartoon, drawing, painting, sketch, 3d render, " +
        "CGI, anime, wrong ingredients, inaccurate food, plastic looking, " +
        "artificial, watermark, text overlay, blurry, out of focus, " +
        "oversaturated, underexposed, low quality, ugly",
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

// Stabilny cache key: nazwa + top3 skladniki (alfabetycznie)
function getCacheKey(meal: {
  name: string;
  ingredients: Array<{ name: string }>;
}): string {
  const top3 = meal.ingredients
    .slice(0, 3)
    .map((i) => i.name.toLowerCase())
    .sort()
    .join(",");

  const hash = crypto
    .createHash("sha256")
    .update(`${meal.name}:${top3}`)
    .digest("hex");

  return hash.slice(0, 16);
}

// Prompt pod food photography z wyroznieniem skladnikow kluczowych
function buildImagePrompt(meal: {
  name: string;
  ingredients: Array<{ name: string }>;
}): string {
  const allIngredients = meal.ingredients.map((i) => i.name).join(", ");
  const heroIngredients = meal.ingredients
    .slice(0, 3)
    .map((i) => i.name)
    .join(" and ");

  return `Photorealistic food photography of "${meal.name}".

IMPORTANT - Must clearly show these main ingredients: ${heroIngredients}.
Complete ingredients list: ${allIngredients}.

Photography style:
- Professional restaurant food photography
- Appetizing 45-degree angle composition
- Soft natural window lighting with gentle shadows
- Shallow depth of field, tack-sharp focus on the dish
- Beautiful plating on clean ceramic plate
- Rustic wooden table background
- Vibrant, mouth-watering colors
- 8K resolution, highly detailed food textures
- Steam rising if hot dish`;
}
