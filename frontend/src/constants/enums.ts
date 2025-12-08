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

export const KitchenEquipment = {
    OVEN: 'OVEN',
    STOVE: 'STOVE',
    MICROWAVE: 'MICROWAVE',
    BLENDER: 'BLENDER',
    AIR_FRYER: 'AIR_FRYER',
    SLOW_COOKER: 'SLOW_COOKER',
    GRILL: 'GRILL'
} as const;

export const BudgetLevel = {
    CHEAP: 'CHEAP',
    MODERATE: 'MODERATE',
    EXPENSIVE: 'EXPENSIVE',
} as const;
