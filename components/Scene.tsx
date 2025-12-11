import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TextParticles } from './TextParticles';
import { AppState } from '../types';
import { COLORS } from '../constants';

interface SceneProps {
  appState: AppState;
}

export const Scene: React.FC<SceneProps> = ({ appState }) => {
  return (
    <Canvas
      dpr={[1, 2]} // Support high DPI
      gl={{ antialias: false, alpha: false, stencil: false, depth: true }}
      className="w-full h-full block"
    >
      {/* Cinematic Color Grading Background */}
      <color attach="background" args={[COLORS.bg]} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={[COLORS.bg, 10, 50]} />

      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={35} />
      
      {/* Controls: Auto-rotate when scattered for ambient feel, restrict when text is formed */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={5} 
        maxDistance={40}
        autoRotate={appState === AppState.SCATTERED}
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
      />

      {/* Lighting Setup */}
      <ambientLight intensity={0.5} color={COLORS.primaryEmerald} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        color={COLORS.primaryGold} 
      />
      <spotLight 
        position={[-10, -10, -10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        color="#004030" 
      />

      {/* Environment map for metallic reflections */}
      <Environment preset="city" blur={0.8} />

      {/* The Core Experience */}
      <TextParticles appState={appState} />

      {/* Post Processing Pipeline */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.6}
            levels={8}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};
