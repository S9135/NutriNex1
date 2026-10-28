import { UserProfile, DailyTarget } from '../types';

export const calculateBMR = (profile: UserProfile): number => {
  const { weightKg, heightCm, age, sex } = profile;
  // Mifflin-St Jeor Equation
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
};

export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  const multipliers: Record<UserProfile['activityLevel'], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very active': 1.9,
  };
  return bmr * multipliers[profile.activityLevel];
};

export const calculateTargets = (profile: UserProfile): DailyTarget => {
  const tdee = calculateTDEE(profile);
  
  // Basic goal adjustment
  let calorieAdjustment = 0;
  if (profile.goal === 'lose') calorieAdjustment = -500;
  if (profile.goal === 'gain') calorieAdjustment = 500;
  
  let calories = tdee + calorieAdjustment;
  
  // Safety floors
  const minCalories = profile.sex === 'male' ? 1500 : 1200;
  if (calories < minCalories) calories = minCalories;
  
  // Basic macro distribution (example)
  return {
    calories: Math.round(calories),
    proteinG: Math.round((calories * 0.25) / 4), // 25% protein
    carbsG: Math.round((calories * 0.45) / 4),   // 45% carbs
    fatG: Math.round((calories * 0.30) / 9),     // 30% fat
    fiberG: 25,
    sodiumMg: 2300,
    sugarG: 50,
  };
};
