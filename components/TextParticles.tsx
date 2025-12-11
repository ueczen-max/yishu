import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, DynamicDrawUsage } from 'three';
import { AppState } from '../types';
import { generateParticles } from '../utils/textSampling';
import { CONFIG, COLORS } from '../constants';
import * as THREE from 'three';

interface TextParticlesProps {
  appState: AppState;
}

export const TextParticles: React.FC<TextParticlesProps> = ({ appState }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Dummy object for calculating matrix transformations
  const dummy = useMemo(() => new Object3D(), []);

  // Generate particles once on mount
  const particles = useMemo(() => generateParticles(), []);
  
  // Store current animated positions to avoid re-calculating from scratch every frame
  // We simulate a simple physics/interpolation state
  const currentPositions = useMemo(() => {
    return new Float32Array(particles.length * 3);
  }, [particles]);

  // Initialize current positions to scatter positions
  useLayoutEffect(() => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        // Start at scatter position
        currentPositions[i * 3] = p.scatterPosition.x;
        currentPositions[i * 3 + 1] = p.scatterPosition.y;
        currentPositions[i * 3 + 2] = p.scatterPosition.z;
        
        // Initialize color
        const c = new Color(p.color);
        meshRef.current!.setColorAt(i, c);
        
        // Initial Matrix
        dummy.position.copy(p.scatterPosition);
        dummy.scale.setScalar(p.scale * CONFIG.particleSize);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [particles, dummy, currentPositions]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth transition factor
    // We don't use a single global 0-1 lerp factor because we want per-particle organic movement
    // But for stability, we move each particle towards its target
    
    const isTargetText = appState === AppState.TEXT_SHAPE;
    const lerpSpeed = CONFIG.transitionSpeed * delta;

    let needsUpdate = false;

    // Animate Point Light to give "Life"
    if(lightRef.current) {
        lightRef.current.position.x = Math.sin(state.clock.elapsedTime) * 10;
        lightRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 5;
    }

    // Iterate through all particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const target = isTargetText ? p.textPosition : p.scatterPosition;
      
      const cx = currentPositions[i * 3];
      const cy = currentPositions[i * 3 + 1];
      const cz = currentPositions[i * 3 + 2];

      // Custom Lerp for x, y, z
      // Adding a tiny bit of noise/curl would be expensive here in JS, 
      // so we stick to clean linear interpolation with variable speeds per particle derived from index
      
      const speedMod = 1.0 + Math.sin(i * 132.1) * 0.2; // slight variance
      const effectiveSpeed = lerpSpeed * speedMod;

      const nx = THREE.MathUtils.lerp(cx, target.x, effectiveSpeed);
      const ny = THREE.MathUtils.lerp(cy, target.y, effectiveSpeed);
      const nz = THREE.MathUtils.lerp(cz, target.z, effectiveSpeed);

      // Update cache
      currentPositions[i * 3] = nx;
      currentPositions[i * 3 + 1] = ny;
      currentPositions[i * 3 + 2] = nz;

      // Update Instance Matrix
      dummy.position.set(nx, ny, nz);
      
      // Rotate particles slightly for "Glitter" effect based on time
      dummy.rotation.x = state.clock.elapsedTime * 0.2 + i;
      dummy.rotation.y = state.clock.elapsedTime * 0.3 + i;
      
      dummy.scale.setScalar(p.scale * CONFIG.particleSize);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Optimization: Stop updating if very close (optional, but keeps animation alive here)
      needsUpdate = true;
    }

    if (needsUpdate) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
        {/* Dynamic light moving around the text for reflections */}
        <pointLight ref={lightRef} intensity={2} color="#ffaa00" distance={20} decay={2} position={[0,0,5]} />
        
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, particles.length]}
            frustumCulled={false} // Prevent culling when scattered
            usage={DynamicDrawUsage}
        >
            {/* Using Icosahedron for a diamond/gem cut look */}
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                roughness={0.15}
                metalness={0.9}
                emissive={COLORS.primaryEmerald}
                emissiveIntensity={0.2}
                color={COLORS.primaryGold}
                toneMapped={false} // Crucial for Bloom
            />
        </instancedMesh>
    </group>
  );
};
