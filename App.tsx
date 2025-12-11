import React, { useState, Suspense } from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { AppState } from './types';

const App: React.FC = () => {
  // Initial state: SCATTERED
  const [appState, setAppState] = useState<AppState>(AppState.SCATTERED);

  return (
    <main className="relative w-full h-screen bg-black">
      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
            <div className="flex items-center justify-center h-full w-full text-emerald-500 font-serif tracking-widest text-xs uppercase">
                Initializing Arix Engine...
            </div>
        }>
          <Scene appState={appState} />
        </Suspense>
      </div>

      {/* UI Overlay */}
      <UI appState={appState} setAppState={setAppState} />
    </main>
  );
};

export default App;
