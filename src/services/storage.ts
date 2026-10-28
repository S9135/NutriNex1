import { UserProfile, Meal, DailyTarget } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'nutriloop_profile',
  MEALS: 'nutriloop_meals',
  TARGETS: 'nutriloop_targets',
};

export const storage = {
  saveProfile: (profile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  },
  getProfile: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get profile:', e);
      return null;
    }
  },
  saveMeal: (meal: Meal) => {
    try {
      const meals = storage.getMeals();
      meals.push(meal);
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    } catch (e) {
      console.error('Failed to save meal:', e);
    }
  },
  getMeals: (): Meal[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEALS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get meals:', e);
      return [];
    }
  },
  saveTargets: (targets: DailyTarget) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
    } catch (e) {
      console.error('Failed to save targets:', e);
    }
  },
  getTargets: (): DailyTarget | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TARGETS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get targets:', e);
      return null;
    }
  }
};
