import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { FullRecipe } from "../types/meal";
import {
  formatHungerLevel,
  formatRecipeContextPrimaryLabel,
} from "../utils/recipeGenerationContext";

Font.register({
  family: "Lato",
  fonts: [
    { src: "/fonts/Lato-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Lato-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Lato-Italic.ttf", fontStyle: "italic" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 32,
    fontFamily: "Lato",
    fontSize: 11,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  coverImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 1.5,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  metaItem: {
    flexGrow: 1,
    minWidth: "20%",
    paddingRight: 12,
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
    marginTop: 16,
  },
  categoryBlock: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 6,
  },
  nutritionRow: {
    flexDirection: "row",
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#fefce8",
    borderRadius: 6,
  },
  nutritionItem: {
    flexGrow: 1,
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#713f12",
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 9,
    color: "#78716c",
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  ingredientName: {
    width: "72%",
    fontSize: 11,
    lineHeight: 1.4,
  },
  ingredientAmount: {
    width: "28%",
    fontSize: 11,
    color: "#64748b",
    textAlign: "right",
  },
  stepBlock: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stepNumber: {
    width: 22,
    height: 22,
    marginRight: 8,
    borderRadius: 11,
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 1,
    paddingTop: 6,
  },
  stepTitleWrap: {
    flexGrow: 1,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
  },
  stepDuration: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  stepInstruction: {
    fontSize: 11,
    color: "#334155",
    lineHeight: 1.5,
    paddingLeft: 30,
  },
  stepTip: {
    fontSize: 10,
    color: "#92400e",
    backgroundColor: "#fffbeb",
    lineHeight: 1.4,
    padding: 6,
    borderRadius: 4,
    marginTop: 6,
    marginLeft: 30,
  },
  tipItem: {
    fontSize: 11,
    color: "#334155",
    lineHeight: 1.5,
    marginBottom: 6,
  },
  tipBullet: {
    marginRight: 6,
    color: "#f59e0b",
  },
  infoBlock: {
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    fontSize: 9,
    color: "#94a3b8",
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

type RecipePdfProps = {
  recipe: FullRecipe;
  imageUrl?: string;
};

function formatDifficultyLabel(difficulty: FullRecipe["difficulty"]): string {
  switch (difficulty) {
    case "Easy":
      return "Łatwe";
    case "Medium":
      return "Średnie";
    case "Hard":
      return "Trudne";
    default:
      return difficulty;
  }
}

function formatIngredientAmount(amount: string, unit: string): string {
  return [amount, unit].filter(Boolean).join(" ");
}

export function RecipePdf({ recipe, imageUrl }: RecipePdfProps) {
  const nutritionItems = [
    { label: "Kalorie", value: `${recipe.nutrition.calories} kcal` },
    { label: "Białko", value: `${recipe.nutrition.protein} g` },
    { label: "Węglowodany", value: `${recipe.nutrition.carbs} g` },
    { label: "Tłuszcze", value: `${recipe.nutrition.fat} g` },
  ];
  const groupedIngredients = recipe.ingredients.reduce<Record<string, FullRecipe["ingredients"]>>(
    (acc, ingredient) => {
      const category = ingredient.category || "Inne";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(ingredient);
      return acc;
    },
    {},
  );
  const recipeContext = recipe.generationContext;
  const primaryContextValue = formatRecipeContextPrimaryLabel(recipeContext);
  const hungerLabel = formatHungerLevel(recipeContext?.hungerLevel);

  return (
    <Document
      title={recipe.name}
      author="MealGenie"
      subject={`Przepis: ${recipe.name}`}
      creator="MealGenie"
      producer="MealGenie"
    >
      <Page size="A4" style={styles.page}>
        {imageUrl ? <Image src={imageUrl} style={styles.coverImage} /> : null}

        <View style={styles.header}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Czas całkowity</Text>
            <Text style={styles.metaValue}>{recipe.totalTimeMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Przygotowanie</Text>
            <Text style={styles.metaValue}>{recipe.prepTimeMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Gotowanie</Text>
            <Text style={styles.metaValue}>{recipe.cookTimeMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Trudność</Text>
            <Text style={styles.metaValue}>
              {formatDifficultyLabel(recipe.difficulty)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>
              {recipeContext?.portionMode === "weight" ? "Waga" : "Porcje"}
            </Text>
            <Text style={styles.metaValue}>
              {primaryContextValue ?? recipe.servings}
            </Text>
          </View>
          {hungerLabel ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Apetyt</Text>
              <Text style={styles.metaValue}>
                {hungerLabel.replace("Apetyt ", "")}
              </Text>
            </View>
          ) : null}
        </View>

        <View wrap={false}>
          <Text style={styles.sectionTitle} minPresenceAhead={80}>
            Wartości odżywcze na porcję
          </Text>
          <View style={styles.nutritionRow}>
            {nutritionItems.map((item) => (
              <View key={item.label} style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.value}</Text>
                <Text style={styles.nutritionLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle} minPresenceAhead={80}>
          Składniki
        </Text>
        {Object.entries(groupedIngredients).map(([category, items]) => (
          <View key={category} wrap={false} style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {items.map((ingredient, index) => (
              <View key={`${ingredient.name}-${index}`} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>
                  {ingredient.name}
                  {ingredient.notes ? ` (${ingredient.notes})` : ""}
                </Text>
                <Text style={styles.ingredientAmount}>
                  {formatIngredientAmount(ingredient.amount, ingredient.unit)}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle} minPresenceAhead={80}>
          Przygotowanie
        </Text>
        {recipe.steps.map((step) => (
          <View key={step.stepNumber} wrap={false} style={styles.stepBlock}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>{step.stepNumber}</Text>
              <View style={styles.stepTitleWrap}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.duration ? (
                  <Text style={styles.stepDuration}>{step.duration}</Text>
                ) : null}
              </View>
            </View>
            <Text style={styles.stepInstruction}>{step.instruction}</Text>
            {step.tip ? (
              <Text style={styles.stepTip}>Wskazówka: {step.tip}</Text>
            ) : null}
          </View>
        ))}

        {recipe.tips.length > 0 ? (
          <View wrap={false}>
            <Text style={styles.sectionTitle} minPresenceAhead={80}>
              Wskazówki szefa kuchni
            </Text>
            {recipe.tips.map((tip, index) => (
              <Text key={`${tip}-${index}`} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                {tip}
              </Text>
            ))}
          </View>
        ) : null}

        {recipe.servingSuggestion ? (
          <View wrap={false} style={styles.infoBlock}>
            <Text style={styles.sectionTitle} minPresenceAhead={80}>
              Jak podać
            </Text>
            <Text style={styles.tipItem}>{recipe.servingSuggestion}</Text>
          </View>
        ) : null}

        {recipe.storageInfo ? (
          <View wrap={false} style={styles.infoBlock}>
            <Text style={styles.sectionTitle} minPresenceAhead={80}>
              Przechowywanie
            </Text>
            <Text style={styles.tipItem}>{recipe.storageInfo}</Text>
          </View>
        ) : null}

        <Text style={styles.footer} fixed>
          Wygenerowano przez MealGenie
        </Text>
      </Page>
    </Document>
  );
}
