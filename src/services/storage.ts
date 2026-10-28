import { UserProfile, Meal, DailyTarget } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'nutriloop_profile',
  MEALS: 'nutriloop_meals',
  TARGETS: 'nutriloop_targets',
};

export const storage = {
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },
  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },
  saveMeal: (meal: Meal) => {
    const meals = storage.getMeals();
    meals.push(meal);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  },
  getMeals: (): Meal[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  },
  saveTargets: (targets: DailyTarget) => {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  },
  getTargets: (): DailyTarget | null => {
    const data = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return data ? JSON.parse(data) : null;
  }
};
