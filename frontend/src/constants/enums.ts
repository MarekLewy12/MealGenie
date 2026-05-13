export const Diet = {
    NONE: 'NONE',
    VEGETARIAN: 'VEGETARIAN',
    VEGAN: 'VEGAN',
    KETO: 'KETO',
    PALEO: 'PALEO',
    GLUTEN_FREE: 'GLUTEN_FREE',
} as const;

export const CookingSkill = {
    BEGINNER: 'BEGINNER',
    INTERMEDIATE: 'INTERMEDIATE',
    ADVANCED: 'ADVANCED',
} as const;

export const Equipment = {
    OVEN: 'OVEN',
    STOVE: 'STOVE',
    MICROWAVE: 'MICROWAVE',
    BLENDER: 'BLENDER',
    MULTICOOKER: 'MULTICOOKER',
    SLOW_COOKER: 'SLOW_COOKER',
    RICE_COOKER: 'RICE_COOKER',
    FOOD_PROCESSOR: 'FOOD_PROCESSOR',
    AIR_FRYER: 'AIR_FRYER',
    STEAMER: 'STEAMER',
    SOUS_VIDE: 'SOUS_VIDE',
    ELECTRIC_GRILL: 'ELECTRIC_GRILL',
} as const;

export const Budget = {
    NONE: 'NONE',
    ECONOMICAL: 'ECONOMICAL',
    MEDIUM: 'MEDIUM',
    PREMIUM: 'PREMIUM',
} as const;
