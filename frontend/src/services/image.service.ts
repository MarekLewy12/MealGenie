import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const openai = new OpenAI();

// Folder na obrazki
const IMAGE_DIR = path.join(process.cwd(), "public", "meal-images");

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

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
  const filePath = path.join(IMAGE_DIR, `${cacheKey}.webp`);

  // Czy ten obrazek już istnieje?
  if (fs.existsSync(filePath)) {
    console.log("[IMAGE] Cache hit:", cacheKey);
    return `/meal-images/${cacheKey}.webp`; // zwróć URL
  }

  // Cache miss → generuj nowy
  console.log("[IMAGE] Cache miss, generating:", meal.name);
  const prompt = buildImagePrompt(meal);

  // OpenAI Images API
  const response = await openai.images.generate({
    model: "gpt-image-1-mini",
    prompt: prompt,
    size: "1536x1024",
    quality: "medium",
    n: 1,
    output_format: "webp",
    output_compression: 70,
  });

  // base64 z response
  const b64 = response.data[0]?.b64_json;
  if (!b64) {
    console.error("[IMAGE] No image data returned");
    return null;
  }

  // Decode base64 → Buffer (bajty)
  const buffer = Buffer.from(b64, "base64");

  // plik .webp
  fs.writeFileSync(filePath, buffer);
  console.log("[IMAGE] Saved:", filePath);

  // URL dla frontendu
  return `/meal-images/${cacheKey}.webp`;
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
    .sort() // alfabetycznie = zawsze ta sama kolejność
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
 * Buduje prompt dla OpenAI (food photography style)
 */
function buildImagePrompt(meal: {
  name: string;
  ingredients: Array<{ name: string }>;
}): string {
  const mainIngredients = meal.ingredients
    .slice(0, 5)
    .map((i) => i.name)
    .join(", ");

  // nazwy PL + terminy EN
  return `Food photography, professional culinary shot.
Danie: "${meal.name}"
Główne składniki: ${mainIngredients}

Style:
- Overhead view (bird's eye perspective)
- Natural lighting, soft shadows
- Clean white background
- Restaurant quality plating
- Appetizing, vibrant colors
- No text, no watermarks
- Sharp focus on the dish`;
}
