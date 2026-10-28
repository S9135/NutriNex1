/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { storage } from './services/storage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

export default function App() {
  const [hasProfile, setHasProfile] = useState(!!storage.getProfile());

  return (
    <div className="min-h-screen bg-white">
      {hasProfile ? <Dashboard /> : <Onboarding onComplete={() => setHasProfile(true)} />}
      <footer className="text-center p-4 text-xs text-gray-400">
        Educational use only. Not medical advice.
      </footer>
    </div>
  );
}

