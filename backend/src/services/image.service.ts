import fs from "fs";
import path from "path";
import crypto from "crypto";

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

if (!TOGETHER_API_KEY) {
  throw new Error("TOGETHER_API_KEY environment variable is not set");
}

// Folder na obrazki
const IMAGE_DIR = path.join(process.cwd(), "public", "meal-images");

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Typ odpowiedzi z Together.ai
type TogetherImageResponse = {
  id: string;
  model: string;
  object: "list";
  data: Array<
    | { index: number; b64_json: string; type?: string | null }
    | { index: number; url: string }
  >;
};

/**
 * Generuje obrazki dla wielu posiłków równolegle
 */
export async function generateMealImages(
  meals: Array<{ name: string; ingredients: Array<{ name: string }> }>,
): Promise<Array<string | null>> {
  console.log(
    "[IMAGE] Generating images for meals:",
    meals.map((m) => m.name),
  );

  // 3 obrazki równolegle
  const promises = meals.map(async (meal) => {
    try {
      return await generateMealImage(meal);
    } catch (err) {
      console.error(`[IMAGE] Failed for "${meal.name}":`, err);
      return null;
    }
  });

  // oczekiwanie na wszystkie (nawet jeśli niektóre się nie powiodą)
  return Promise.allSettled(promises).then((results) =>
    results.map((r) => (r.status === "fulfilled" ? r.value : null)),
  );
}

/**
 * Generuje POJEDYNCZY obrazek (sprawdza cache)
 */
async function generateMealImage(meal: {
  name: string;
  ingredients: Array<{ name: string }>;
}): Promise<string | null> {
  // cache key (hash z nazwy + składników)
  const cacheKey = getCacheKey(meal);
  const filePath = path.join(IMAGE_DIR, `${cacheKey}.jpg`);

  // Czy ten obrazek już istnieje?
  if (fs.existsSync(filePath)) {
    console.log("[IMAGE] Cache hit:", cacheKey);
    return `/meal-images/${cacheKey}.jpg`;
  }

  // Cache miss → generuj nowy
  console.log("[IMAGE] Cache miss, generating:", meal.name);
  const prompt = buildImagePrompt(meal);

  // Together.ai Images API
  const b64 = await togetherGenerateBase64Jpeg(prompt);

  if (!b64) {
    console.error("[IMAGE] No image data returned");
    return null;
  }

  // Decode base64 → Buffer (bajty)
  const buffer = Buffer.from(b64, "base64");

  // Zapisz plik .jpg
  fs.writeFileSync(filePath, buffer);
  console.log("[IMAGE] Saved:", filePath);

  // URL dla frontendu
  return `/meal-images/${cacheKey}.jpg`;
}

/**
 * Wywołanie Together.ai API
 */
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
      model: "black-forest-labs/FLUX.1-schnell",
      prompt,
      steps: 4,
      n: 1,
      response_format: "base64",
      output_format: "jpeg",
      width: 1344,
      height: 768,
      negative_prompt:
        "text, watermark, logo, low quality, blurry, distorted, extra fingers, ugly",
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

/**
 * Oblicza STABILNY cache key:
 * SHA256(nazwa + top3składniki_alfabetycznie)
 */
function getCacheKey(meal: {
  name: string;
  ingredients: Array<{ name: string }>;
}): string {
  // Weź top 3 składniki, lowercase, sortuj alfabetycznie
  const top3 = meal.ingredients
    .slice(0, 3)
    .map((i) => i.name.toLowerCase())
    .sort()
    .join(",");

  // Hash SHA256
  const hash = crypto
    .createHash("sha256")
    .update(`${meal.name}:${top3}`)
    .digest("hex");

  // Pierwsze 16 znaków (wystarczy do unikalności)
  return hash.slice(0, 16);
}

/**
 * Buduje prompt dla Together (food photography style)
 */
function buildImagePrompt(meal: {
  name: string;
  ingredients: Array<{ name: string }>;
}): string {
  const mainIngredients = meal.ingredients
    .slice(0, 5)
    .map((i) => i.name)
    .join(", ");

  return `Food photography, professional culinary shot.
Dish name: "${meal.name}"
Main ingredients: ${mainIngredients}

Style:
- Overhead view (bird's eye perspective)
- Natural lighting, soft shadows
- Clean white background
- Restaurant quality plating
- Appetizing, vibrant colors
- No text, no watermarks
- Sharp focus on the dish`;
}
