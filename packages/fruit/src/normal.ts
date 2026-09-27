import {
  FRUIT_TYPES,
  type FruitItemOptions,
  type FruitOptions,
  type FruitType,
  type FruitVector3,
  type NormalizedFruitOptions,
} from './types';

const DEFAULT_FRUIT_TYPES: FruitType[] = ['apple', 'banana', 'pear'];
const DEFAULT_FRUIT_ROTATIONS: Record<FruitType, FruitVector3> = {
  apple: [0, 0.06, 0],
  banana: [0.08, 0.12, -0.58],
  pear: [0, -0.08, 0.04],
  avocado: [0, 0, 0],
  kiwi: [0, 0, 0],
  lemon: [0, 0, 0],
  lime: [0, 0, 0],
  pomegranate: [0, 0, 0],
  lychee: [0, 0, 0],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function finiteOr(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) ? value : fallback;
}

function normalizeTuple(value: FruitVector3 | undefined, fallback: FruitVector3): FruitVector3 {
  if (!value || value.length !== 3 || value.some(item => !Number.isFinite(item))) return fallback;
  return value;
}

function isFruitType(value: unknown): value is FruitType {
  return typeof value === 'string' && FRUIT_TYPES.some(type => type === value);
}

function autoPosition(index: number, count: number): FruitVector3 {
  const columns = count <= 3 ? count : Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  const row = Math.floor(index / columns);
  const column = index % columns;
  const itemsInRow = Math.min(columns, count - row * columns);
  return [(column - (itemsInRow - 1) / 2) * 0.9, 0, (row - (rows - 1) / 2) * 0.9];
}

function normalizeFruits(value: FruitOptions['fruits']): NormalizedFruitOptions['fruits'] {
  const fruits: FruitItemOptions[] = value === undefined
    ? DEFAULT_FRUIT_TYPES.map(type => ({ type }))
    : Array.isArray(value) ? value : [];

  return fruits.flatMap((fruit, index) => {
    if (!fruit || !isFruitType(fruit.type)) return [];
    const position = autoPosition(index, fruits.length);

    return [{
      id: typeof fruit.id === 'string' && fruit.id.trim() ? fruit.id.trim() : `fruit-${index + 1}`,
      index,
      type: fruit.type,
      position: normalizeTuple(fruit.position, position),
      rotation: normalizeTuple(fruit.rotation, DEFAULT_FRUIT_ROTATIONS[fruit.type]),
      scale: clamp(finiteOr(fruit.scale, 1), 0.25, 2.5),
    }];
  });
}

export function normalizeOptions(options: FruitOptions): NormalizedFruitOptions {
  const floor = options.floor ?? {};
  const lighting = options.lighting ?? {};
  const camera = options.camera ?? {};
  const controls = options.controls ?? {};
  const renderer = options.renderer ?? {};
  const minDistance = Math.max(finiteOr(controls.minDistance, 3.2), 0.1);
  const minPolarAngle = clamp(finiteOr(controls.minPolarAngle, 0.18), 0, Math.PI);

  return {
    fruits: normalizeFruits(options.fruits),
    floor: {
      show: floor.show ?? true,
      color: floor.color ?? '#e9e4dd',
      roughness: clamp(finiteOr(floor.roughness, 0.88), 0.05, 1),
    },
    lighting: {
      show: lighting.show ?? true,
      color: lighting.color ?? '#fff3dc',
      intensity: clamp(finiteOr(lighting.intensity, 2.8), 0, 20),
      fillIntensity: clamp(finiteOr(lighting.fillIntensity, 1.8), 0, 10),
    },
    backgroundColor: options.backgroundColor === undefined ? '#e9e4dd' : options.backgroundColor,
    camera: {
      position: normalizeTuple(camera.position, [2.5, 3.2, 6.5]),
      target: normalizeTuple(camera.target, [0, 0.32, 0]),
      fov: clamp(finiteOr(camera.fov, 42), 20, 100),
      autoFit: camera.autoFit ?? false,
    },
    controls: {
      enabled: controls.enabled ?? true,
      damping: controls.damping ?? true,
      autoRotate: controls.autoRotate ?? false,
      autoRotateSpeed: Math.max(finiteOr(controls.autoRotateSpeed, 0.35), 0),
      enableRotate: controls.enableRotate ?? true,
      enableZoom: controls.enableZoom ?? true,
      minDistance,
      maxDistance: Math.max(finiteOr(controls.maxDistance, 12), minDistance),
      minPolarAngle,
      maxPolarAngle: Math.max(minPolarAngle, clamp(finiteOr(controls.maxPolarAngle, Math.PI * 0.86), 0, Math.PI)),
      rotateSpeed: Math.max(finiteOr(controls.rotateSpeed, 0.65), 0),
      zoomSpeed: Math.max(finiteOr(controls.zoomSpeed, 0.8), 0),
    },
    renderer: {
      pixelRatio: clamp(finiteOr(renderer.pixelRatio, 1.5), 1, 2),
      shadows: renderer.shadows ?? true,
      toneMappingExposure: clamp(finiteOr(renderer.toneMappingExposure, 1.05), 0.1, 3),
    },
  };
}
