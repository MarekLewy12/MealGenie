import {Diet, CookingSkill, KitchenEquipment, BudgetLevel} from './enums.ts';

export const DIET_LABELS: Record<keyof typeof Diet, string> = {
    NONE: 'Brak',
    VEGETARIAN: 'Wegetariańska',
    VEGAN: 'Wegańska',
    KETO: 'Keto',
    PALEO: 'Paleo',
    GLUTEN_FREE: 'Bezglutenowa',
}

export const SKILL_LABELS: Record<keyof typeof CookingSkill, string> = {
    BEGINNER: 'Początkujący',
    INTERMEDIATE: 'Średniozaawansowany',
    ADVANCED: 'Zaawansowany',
}

export const EQUIPMENT_LABELS: Record<keyof typeof KitchenEquipment, string> = {
    OVEN: 'Piekarnik',
    STOVE: 'Kuchenka',
    MICROWAVE: 'Mikrofalówka',
    BLENDER: 'Blender',
    AIR_FRYER: 'Frytkownica powietrzna',
    SLOW_COOKER: 'Wolnowar',
    GRILL: 'Grill',
    THERMOMIX: 'Thermomix',
}

export const BUDGET_LABELS: Record<keyof typeof BudgetLevel, string> = {
    CHEAP: 'Tani',
    MODERATE: 'Średni',
    EXPENSIVE: 'Drogi',
}