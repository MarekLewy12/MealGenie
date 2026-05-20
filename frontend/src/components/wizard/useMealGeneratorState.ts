import { useCallback, useMemo, useReducer } from "react";

import type {
  GenerateMealSuggestionsPayload,
  GuestGenerateMealSuggestionsPayload,
} from "../../services/api";
import type { MealType, PortionMode } from "../../types/meal";
import { mealTypeValues } from "./mealOptions";

type MealGeneratorState = {
  mealType: MealType;
  prepTime: number;
  servingSize: number;
  userPrompt: string;
  ingredients: string[];
  isThermomixMode: boolean;
  portionMode: PortionMode;
  targetWeight: number;
  hungerLevel: number;
};

type MealGeneratorAction =
  | { type: "setMealType"; value: MealType }
  | { type: "setPrepTime"; value: number }
  | { type: "setServingSize"; value: number }
  | { type: "setUserPrompt"; value: string }
  | { type: "setIngredients"; value: string[] }
  | { type: "setThermomixMode"; value: boolean }
  | { type: "setPortionMode"; value: PortionMode }
  | { type: "setTargetWeight"; value: number }
  | { type: "setHungerLevel"; value: number };

function getInitialMealType(searchParams: URLSearchParams): MealType {
  const mealTypeParam = searchParams.get("mealType");

  if (mealTypeParam && mealTypeValues.has(mealTypeParam as MealType)) {
    return mealTypeParam as MealType;
  }

  return "LUNCH";
}

function getBoundedSearchNumber(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number,
  min: number,
  max: number,
) {
  const param = searchParams.get(key);

  if (!param) {
    return defaultValue;
  }

  const parsed = Number(param);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  return Math.min(max, Math.max(min, parsed));
}

function createInitialState(searchParams: URLSearchParams): MealGeneratorState {
  return {
    mealType: getInitialMealType(searchParams),
    prepTime: getBoundedSearchNumber(searchParams, "prepTime", 30, 15, 120),
    servingSize: getBoundedSearchNumber(searchParams, "servingSize", 2, 1, 10),
    userPrompt: "",
    ingredients: [],
    isThermomixMode: false,
    portionMode: "servings",
    targetWeight: 250,
    hungerLevel: 3,
  };
}

function mealGeneratorReducer(
  state: MealGeneratorState,
  action: MealGeneratorAction,
): MealGeneratorState {
  switch (action.type) {
    case "setMealType":
      return { ...state, mealType: action.value };
    case "setPrepTime":
      return { ...state, prepTime: action.value };
    case "setServingSize":
      return { ...state, servingSize: action.value };
    case "setUserPrompt":
      return { ...state, userPrompt: action.value };
    case "setIngredients":
      return { ...state, ingredients: action.value };
    case "setThermomixMode":
      return { ...state, isThermomixMode: action.value };
    case "setPortionMode":
      return { ...state, portionMode: action.value };
    case "setTargetWeight":
      return { ...state, targetWeight: action.value };
    case "setHungerLevel":
      return { ...state, hungerLevel: action.value };
  }
}

export function useMealGeneratorState(searchParams: URLSearchParams) {
  const [state, dispatch] = useReducer(
    mealGeneratorReducer,
    searchParams,
    createInitialState,
  );

  const actions = useMemo(
    () => ({
      setMealType: (value: MealType) =>
        dispatch({ type: "setMealType", value }),
      setPrepTime: (value: number) =>
        dispatch({ type: "setPrepTime", value }),
      setServingSize: (value: number) =>
        dispatch({ type: "setServingSize", value }),
      setUserPrompt: (value: string) =>
        dispatch({ type: "setUserPrompt", value }),
      setIngredients: (value: string[]) =>
        dispatch({ type: "setIngredients", value }),
      setThermomixMode: (value: boolean) =>
        dispatch({ type: "setThermomixMode", value }),
      setPortionMode: (value: PortionMode) =>
        dispatch({ type: "setPortionMode", value }),
      setTargetWeight: (value: number) =>
        dispatch({ type: "setTargetWeight", value }),
      setHungerLevel: (value: number) =>
        dispatch({ type: "setHungerLevel", value }),
    }),
    [],
  );

  const buildGuestPayload =
    useCallback((): GuestGenerateMealSuggestionsPayload => {
      const normalizedPrompt = state.userPrompt.trim();

      return {
        mealType: state.mealType,
        prepTime: state.prepTime,
        userPrompt:
          normalizedPrompt.length > 0 ? normalizedPrompt : undefined,
      };
    }, [state.mealType, state.prepTime, state.userPrompt]);

  const buildAuthPayload = useCallback((): GenerateMealSuggestionsPayload => {
    const normalizedPrompt = state.userPrompt.trim();

    return {
      mealType: state.mealType,
      prepTime: state.prepTime,
      servingSize:
        state.portionMode === "servings" ? state.servingSize : undefined,
      targetWeightGrams:
        state.portionMode === "weight" ? state.targetWeight : undefined,
      hungerLevel: state.hungerLevel,
      userPrompt:
        normalizedPrompt.length > 0 ? normalizedPrompt : undefined,
      availableIngredients: state.ingredients,
      useEquipment: state.isThermomixMode ? ["THERMOMIX"] : [],
    };
  }, [state]);

  return {
    state,
    actions,
    buildAuthPayload,
    buildGuestPayload,
  };
}
