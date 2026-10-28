import { useState } from 'react';
import { UserProfile } from '../types';
import { storage } from '../services/storage';
import { calculateTargets } from '../services/nutrition';

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    sex: 'female',
    heightCm: 160,
    weightKg: 60,
    activityLevel: 'sedentary',
    goal: 'maintain',
    dietaryPreferences: [],
    allergies: [],
    knownConditions: [],
    preferredLanguage: 'en',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveProfile(profile);
    storage.saveTargets(calculateTargets(profile));
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Complete your profile</h2>
      <label className="block mb-2">
        Age:
        <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: Number(e.target.value)})} className="w-full border p-2" />
      </label>
      <label className="block mb-2">
        Weight (kg):
        <input type="number" value={profile.weightKg} onChange={e => setProfile({...profile, weightKg: Number(e.target.value)})} className="w-full border p-2" />
      </label>
      {/* Add other fields... */}
      <button type="submit" className="w-full bg-teal-800 text-white p-3 rounded mt-4">Save & Continue</button>
    </form>
  );
}
