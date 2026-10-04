import { FISH_TYPES, type FishItemOptions, type FishOptions, type FishType, type FishVector3, type NormalizedFishOptions } from './types.js';

const DEFAULT_FISH_TYPES: FishType[] = [...FISH_TYPES];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function finiteOr(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) ? value : fallback;
}

function normalizeTuple(value: FishVector3 | undefined, fallback: FishVector3): FishVector3 {
  if (!Array.isArray(value) || value.length !== 3 || value.some(item => !Number.isFinite(item))) return fallback;
  return value;
}

function isFishType(value: unknown): value is FishType {
  return typeof value === 'string' && FISH_TYPES.some(type => type === value);
}

function autoPosition(index: number, count: number): FishVector3 {
  const columns = Math.min(2, count);
  const rows = Math.ceil(count / columns);
  const row = Math.floor(index / columns);
  const column = index % columns;
  const itemsInRow = Math.min(columns, count - row * columns);
  return [(column - (itemsInRow - 1) / 2) * 3.3, ((rows - 1) / 2 - row) * 1.2, 0];
}

function normalizeFishes(value: FishOptions['fishes']): NormalizedFishOptions['fishes'] {
  const fishes: FishItemOptions[] = value === undefined ? DEFAULT_FISH_TYPES.map(type => ({ type })) : Array.isArray(value) ? value : [];

  const usedIds = new Set<string>();
  return fishes.flatMap((fish, index) => {
    if (!fish || !isFishType(fish.type)) return [];
    const position = autoPosition(index, fishes.length);
    const defaultRotation: FishVector3 = [0, index % 2 === 0 ? 0 : Math.PI, 0];

    const requestedId = typeof fish.id === 'string' && fish.id.trim() ? fish.id.trim() : 'fish-' + (index + 1);
    let id = requestedId;
    let suffix = 2;
    while (usedIds.has(id)) id = requestedId + '-' + suffix++;
    usedIds.add(id);
    return [
      {
        id,
        index,
        type: fish.type,
        position: normalizeTuple(fish.position, position),
        rotation: normalizeTuple(fish.rotation, defaultRotation),
        scale: clamp(finiteOr(fish.scale, 1), 0.4, 2.5),
        swimSpeed: clamp(finiteOr(fish.swimSpeed, 1), 0, 4),
        swimAmplitude: clamp(finiteOr(fish.swimAmplitude, 1), 0, 2),
      },
    ];
  });
}

export function normalizeOptions(options: FishOptions = {}): NormalizedFishOptions {
  const animation = options.animation ?? {};
  const lighting = options.lighting ?? {};
  const camera = options.camera ?? {};
  const controls = options.controls ?? {};
  const renderer = options.renderer ?? {};
  const minDistance = Math.max(finiteOr(controls.minDistance, 3), 0.1);
  const minPolarAngle = clamp(finiteOr(controls.minPolarAngle, 0.15), 0, Math.PI);

  return {
    assetBaseUrl: typeof options.assetBaseUrl === 'string' && options.assetBaseUrl.trim() ? options.assetBaseUrl.trim() : undefined,
    fishes: normalizeFishes(options.fishes),
    backgroundColor: options.backgroundColor === undefined ? '#c6e8e9' : options.backgroundColor,
    animation: {
      enabled: animation.enabled ?? true,
      speed: clamp(finiteOr(animation.speed, 1), 0, 4),
      reducedMotion: animation.reducedMotion === 'auto' || animation.reducedMotion === 'always' ? animation.reducedMotion : 'never',
    },
    lighting: {
      color: lighting.color ?? '#e9ffff',
      intensity: clamp(finiteOr(lighting.intensity, 2.6), 0, 20),
      fillIntensity: clamp(finiteOr(lighting.fillIntensity, 1.6), 0, 10),
      fillColor: lighting.fillColor ?? '#52605b',
      position: normalizeTuple(lighting.position, [-2.8, 4.5, 5.5]),
    },
    camera: {
      position: normalizeTuple(camera.position, [0, 1, 8.5]),
      target: normalizeTuple(camera.target, [0, 0, 0]),
      fov: clamp(finiteOr(camera.fov, 38), 20, 100),
      autoFit: camera.autoFit ?? true,
      near: clamp(finiteOr(camera.near, 0.01), 0.001, 10),
      far: Math.max(clamp(finiteOr(camera.far, 100), 1, 10000), clamp(finiteOr(camera.near, 0.01), 0.001, 10) + 0.01),
    },
    controls: {
      enabled: controls.enabled ?? true,
      damping: controls.damping ?? true,
      autoRotate: controls.autoRotate ?? false,
      autoRotateSpeed: Math.max(finiteOr(controls.autoRotateSpeed, 0.25), 0),
      enableRotate: controls.enableRotate ?? true,
      enableZoom: controls.enableZoom ?? true,
      enablePan: controls.enablePan ?? false,
      panSpeed: clamp(finiteOr(controls.panSpeed, 1), 0, 10),
      dampingFactor: clamp(finiteOr(controls.dampingFactor, 0.05), 0.001, 1),
      touchAction: controls.touchAction === 'pan-y' ? 'pan-y' : 'none',
      minDistance,
      maxDistance: Math.max(finiteOr(controls.maxDistance, 18), minDistance),
      minPolarAngle,
      maxPolarAngle: Math.max(minPolarAngle, clamp(finiteOr(controls.maxPolarAngle, Math.PI * 0.84), 0, Math.PI)),
      rotateSpeed: Math.max(finiteOr(controls.rotateSpeed, 0.65), 0),
      zoomSpeed: Math.max(finiteOr(controls.zoomSpeed, 0.8), 0),
    },
    ariaLabel: typeof options.ariaLabel === 'string' && options.ariaLabel.trim() ? options.ariaLabel : '3D freshwater fish',
    renderer: {
      pixelRatio: clamp(finiteOr(renderer.pixelRatio, 1.5), 1, 2),
      toneMappingExposure: clamp(finiteOr(renderer.toneMappingExposure, 1.2), 0.1, 3),
    },
  };
}
