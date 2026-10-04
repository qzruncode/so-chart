import type { FishType } from '@so-chart/fish';

export const POND_WIDTH = 12;
export const POND_DEPTH = 9;
export const POND_BOTTOM = -1.55;
export const POND_WAVE_HEIGHT = 0.055;
export const POND_FISHES: ReadonlyArray<{ type: FishType; scale: number; swimSpeed: number }> = [
  { type: 'black-carp', scale: 1.22, swimSpeed: 0.95 },
  { type: 'grass-carp', scale: 1.3, swimSpeed: 1.05 },
  { type: 'silver-carp', scale: 1.18, swimSpeed: 1.08 },
  { type: 'bighead-carp', scale: 1.28, swimSpeed: 0.92 },
  { type: 'common-carp', scale: 1.08, swimSpeed: 0.86 },
  { type: 'crucian-carp', scale: 0.87, swimSpeed: 1.1 },
];

/** Smooth bounded paths with a one-body-length clearance from the banks. */
export function getPondPose(index: number, seconds: number) {
  const rate = 0.105 + (index % 3) * 0.012;
  const angle = (index * Math.PI) / 3 + seconds * rate;
  const radiusX = 3.2 + index * 0.07;
  const radiusZ = 2.2 + (index % 3) * 0.1;
  const dx = -radiusX * Math.sin(angle) * rate;
  const dz = radiusZ * Math.cos(angle) * rate;
  return {
    x: Math.cos(angle) * radiusX,
    y: -0.72 - (index % 3) * 0.085 + Math.sin(angle * 1.7) * 0.025,
    z: Math.sin(angle) * radiusZ,
    yaw: Math.atan2(-dz, dx),
    dx,
    dz,
  };
}
