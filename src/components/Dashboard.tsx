import { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { DailyTarget } from '../types';

export default function Dashboard() {
  const [targets, setTargets] = useState<DailyTarget | null>(null);

  useEffect(() => {
    setTargets(storage.getTargets());
  }, []);

  if (!targets) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
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
