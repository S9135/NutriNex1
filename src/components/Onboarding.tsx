import { useState } from 'react';
import { UserProfile } from '../types';
import { storage } from '../services/storage';
import { calculateTargets } from '../services/nutrition';

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
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
    if (step === 1) {
      setStep(2);
    } else {
      storage.saveProfile(profile);
      storage.saveTargets(calculateTargets(profile));
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Complete your profile (Step {step} of 2)</h2>
      
      {step === 1 && (
        <>
          <label className="block mb-2">
            Age:
            <input type="number" required value={profile.age} onChange={e => setProfile({...profile, age: Number(e.target.value)})} className="w-full border p-2" />
          </label>
          <label className="block mb-2">
            Weight (kg):
            <input type="number" required value={profile.weightKg} onChange={e => setProfile({...profile, weightKg: Number(e.target.value)})} className="w-full border p-2" />
          </label>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block mb-2">
            Goal:
            <select value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value as any})} className="w-full border p-2">
              <option value="lose">Lose</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain</option>
            </select>
          </label>
          <label className="block mb-2">
            Activity Level:
            <select value={profile.activityLevel} onChange={e => setProfile({...profile, activityLevel: e.target.value as any})} className="w-full border p-2">
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very active">Very Active</option>
            </select>
          </label>
        </>
      )}
      
      <div className="flex gap-2 mt-4">
        {step > 1 && <button type="button" onClick={() => setStep(1)} className="w-full bg-gray-200 p-3 rounded">Back</button>}
        <button type="submit" className="w-full bg-teal-800 text-white p-3 rounded">{step === 1 ? 'Next' : 'Finish'}</button>
      </div>
    </form>
  );
}
