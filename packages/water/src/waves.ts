export const GERSTNER_WAVE_COUNT = 20;
export const GERSTNER_FREQUENCY_MULTIPLIER = 1.19;
export const GERSTNER_AMPLITUDE_MULTIPLIER = 0.82;
export const GERSTNER_DIRECTION_SPREAD = 0.95;
export const GERSTNER_STEEPNESS = 0.75;
export const GERSTNER_BASE_DIRECTION = [1, 0.55] as const;

const MAX_BASE_WAVELENGTH = 28;

export const GERSTNER_AMPLITUDE_NORMALIZATION = (1 - GERSTNER_AMPLITUDE_MULTIPLIER) / (1 - GERSTNER_AMPLITUDE_MULTIPLIER ** GERSTNER_WAVE_COUNT);

export function getBaseWavelength(width: number, depth: number): number {
  return Math.max(1, Math.min(MAX_BASE_WAVELENGTH, Math.min(width, depth) * 0.28));
}

export function getWaveSegments(length: number, baseWavelength: number): number {
  const shortestWavelength = baseWavelength / GERSTNER_FREQUENCY_MULTIPLIER ** (GERSTNER_WAVE_COUNT - 1);
  return Math.min(320, Math.max(24, Math.ceil((length / shortestWavelength) * 8)));
}
