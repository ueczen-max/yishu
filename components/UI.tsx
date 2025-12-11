import React from 'react';
import { AppState, UIProps } from '../types';

export const UI: React.FC<UIProps> = ({ appState, setAppState }) => {
  const isText = appState === AppState.TEXT_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase font-serif">
            Arix Signature
          </h1>
          <div className="h-px w-12 bg-yellow-600/50 mt-2"></div>
        </div>
        <div className="text-right">
          <p className="text-yellow-500/80 text-xs tracking-widest font-mono">
            INTERACTIVE TYPOGRAPHY
          </p>
          <p className="text-emerald-500/60 text-[10px] tracking-widest mt-1">
            V.19.0 - WEBGL
          </p>
        </div>
      </header>

      {/* Footer / Controls */}
      <footer className="flex flex-col items-center justify-end pb-8">
        
        <div className="pointer-events-auto flex flex-col items-center gap-6">
          <p className={`text-center font-serif transition-opacity duration-1000 ${isText ? 'opacity-100' : 'opacity-0'} text-yellow-100/80 italic text-lg tracking-wide`}>
            "Where Creation Begins"
          </p>

          <button
            onClick={() => setAppState(isText ? AppState.SCATTERED : AppState.TEXT_SHAPE)}
            className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-sm transition-all duration-500"
          >
            {/* Button Background/Border effects */}
            <div className="absolute inset-0 border border-yellow-600/30 group-hover:border-yellow-500/80 transition-colors duration-500"></div>
            <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-emerald-900/40 backdrop-blur-sm transition-colors duration-500"></div>
            
            {/* Animated line */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-yellow-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>

            <span className="relative z-10 text-yellow-50 font-serif tracking-[0.15em] text-sm uppercase">
              {isText ? 'Disperse' : 'Materialize'}
            </span>
          </button>

          <div className="flex gap-2 mt-4">
             {/* Status Indicators */}
             <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${!isText ? 'bg-yellow-500' : 'bg-white/10'}`}></div>
             <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isText ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`}></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
