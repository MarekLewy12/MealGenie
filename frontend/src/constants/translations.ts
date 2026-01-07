import { Diet, CookingSkill, Equipment, Budget } from './enums.ts';

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

export const EQUIPMENT_LABELS: Record<keyof typeof Equipment, string> = {
    OVEN: 'Piekarnik',
    STOVE: 'Kuchenka (Gaz/Indukcja)',
    MICROWAVE: 'Mikrofalówka',
    BLENDER: 'Blender',
    MULTICOOKER: 'Multicooker',
    AIR_FRYER: 'Frytkownica beztłuszczowa',
    SOUS_VIDE: 'Sous Vide',
    STEAMER: 'Parowar',
    ELECTRIC_GRILL: 'Grill elektryczny',
}

export const BUDGET_LABELS: Record<keyof typeof Budget, string> = {
    NONE: 'Bez ograniczeń',
    ECONOMICAL: 'Ekonomiczny',
    MEDIUM: 'Średni',
    PREMIUM: 'Premium',
}
