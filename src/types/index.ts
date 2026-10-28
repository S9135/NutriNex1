export interface UserProfile {
  age: number;
  sex: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
  goal: 'lose' | 'maintain' | 'gain';
  dietaryPreferences: string[];
  allergies: string[];
  knownConditions: string[];
  preferredLanguage: string;
}

export interface FoodItem {
  id: string;
  name: string;
  portionGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
  confidence?: number;
}

export interface Meal {
  id: string;
  timestamp: string;
  items: FoodItem[];
  notes?: string;
  imageUrl?: string;
}

export interface DailyTarget {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  sugarG: number;
}
