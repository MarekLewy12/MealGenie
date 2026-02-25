type IngredientItem = {
  value: string;
  emoji: string;
};

type IngredientCategory = {
  key: string;
  label: string;
  items: IngredientItem[];
};

export type IngredientSuggestionsResponse = {
  categories: IngredientCategory[];
};

const INGREDIENT_SUGGESTIONS: IngredientCategory[] = [
  {
    key: "protein",
    label: "Białko",
    items: [
      { value: "kurczak", emoji: "🍗" },
      { value: "jajka", emoji: "🥚" },
      { value: "łosoś", emoji: "🐟" },
      { value: "wołowina", emoji: "🥩" },
      { value: "tofu", emoji: "🫘" },
      { value: "krewetki", emoji: "🦐" },
    ],
  },
  {
    key: "vegetables",
    label: "Warzywa",
    items: [
      { value: "pomidory", emoji: "🍅" },
      { value: "cebula", emoji: "🧅" },
      { value: "czosnek", emoji: "🧄" },
      { value: "brokuły", emoji: "🥦" },
      { value: "papryka", emoji: "🫑" },
      { value: "szpinak", emoji: "🥬" },
    ],
  },
  {
    key: "carbs",
    label: "Węglowodany",
    items: [
      { value: "ryż", emoji: "🍚" },
      { value: "makaron", emoji: "🍝" },
      { value: "ziemniaki", emoji: "🥔" },
      { value: "chleb", emoji: "🍞" },
      { value: "kasza", emoji: "🌾" },
      { value: "tortilla", emoji: "🫓" },
    ],
  },
  {
    key: "dairy_and_base",
    label: "Nabiał i baza",
    items: [
      { value: "ser", emoji: "🧀" },
      { value: "masło", emoji: "🧈" },
      { value: "mleko", emoji: "🥛" },
      { value: "śmietana", emoji: "🫙" },
      { value: "jogurt", emoji: "🥣" },
      { value: "oliwa", emoji: "🫒" },
    ],
  },
];

export function getIngredientSuggestions(): IngredientSuggestionsResponse {
  return { categories: INGREDIENT_SUGGESTIONS };
}
