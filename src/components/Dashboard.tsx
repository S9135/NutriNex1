import { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { DailyTarget, UserProfile } from '../types';

export default function Dashboard() {
  const [targets, setTargets] = useState<DailyTarget | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setTargets(storage.getTargets());
    setProfile(storage.getProfile());
  }, []);

  if (!targets || !profile) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold mb-2">Profile</h2>
        <p>Goal: {profile.goal}</p>
        <p>Activity Level: {profile.activityLevel}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Daily Calories</p>
          <p className="text-xl font-bold">{targets.calories}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Protein</p>
          <p className="text-xl font-bold">{targets.proteinG}g</p>
        </div>
      </div>
    </div>
  );
}
