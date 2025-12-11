import { Vector3 } from 'three';

export enum AppState {
  SCATTERED = 'SCATTERED',
  TEXT_SHAPE = 'TEXT_SHAPE',
}

export interface ParticleData {
  textPosition: Vector3;
  scatterPosition: Vector3;
  color: string;
  scale: number;
}

export interface UIProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
}
