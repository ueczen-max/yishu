import { Vector3 } from 'three';
import { CONFIG, COLORS } from '../constants';
import { ParticleData } from '../types';

/**
 * Generates particle data by sampling text from an HTML Canvas.
 * It creates a volumetric representation by stacking layers in Z-space.
 */
export const generateParticles = (): ParticleData[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    console.error('Canvas context not available');
    return [];
  }

  // Set canvas size specifically for sampling
  const width = 1000;
  const height = 300;
  canvas.width = width;
  canvas.height = height;

  // Draw Background (Black)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Configure Text
  // Using a very bold weight to ensure we get enough "body" for the particles
  ctx.font = `900 180px ${CONFIG.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';

  // Draw Text
  ctx.fillText(CONFIG.textToRender, width / 2, height / 2);

  // Extract Data
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const particles: ParticleData[] = [];

  // Sampling resolution (skip pixels to reduce density if needed)
  const step = 4; 

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4;
      const r = pixels[index];
      
      // If pixel is bright enough, create a particle
      if (r > 128) {
        // Normalize coordinates to center (0,0)
        // Scaling down to fit in 3D scene view
        const posX = (x - width / 2) * 0.04;
        const posY = -(y - height / 2) * 0.04; // Invert Y for 3D coords

        // Create volumetric depth (multiple layers for thick text)
        for (let z = 0; z < CONFIG.depthLayers; z++) {
          // Center the Z depth
          const posZ = (z - (CONFIG.depthLayers - 1) / 2) * CONFIG.depthSpacing;
          
          // Add some jitter to make it look organic/diamond-like
          const jitter = 0.05;
          const jitterX = (Math.random() - 0.5) * jitter;
          const jitterY = (Math.random() - 0.5) * jitter;
          
          const textPos = new Vector3(posX + jitterX, posY + jitterY, posZ);

          // Random scatter position
          const scatterPos = new Vector3(
            (Math.random() - 0.5) * CONFIG.scatterRadius,
            (Math.random() - 0.5) * CONFIG.scatterRadius,
            (Math.random() - 0.5) * CONFIG.scatterRadius
          );

          // Determine color based on depth or randomness for visual flair
          // Front layers = Gold, Back/Middle = Emerald mix
          let pColor = COLORS.primaryGold;
          const random = Math.random();
          if (z === 0 || z === CONFIG.depthLayers - 1) {
             pColor = random > 0.3 ? COLORS.primaryGold : COLORS.secondaryGold;
          } else {
             pColor = random > 0.6 ? COLORS.primaryEmerald : COLORS.primaryGold;
          }

          particles.push({
            textPosition: textPos,
            scatterPosition: scatterPos,
            color: pColor,
            scale: 0.5 + Math.random() * 0.5, // Random scale for twinkling effect
          });
        }
      }
    }
  }

  return particles;
};
