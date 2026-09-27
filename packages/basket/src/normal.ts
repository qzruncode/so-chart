import type { BasketChartOptions, BasketModel, BasketObjectOptions, NormalizedBasketObjectOptions, NormalizedBasketChartOptions } from './types';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function finiteOr(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) ? value : fallback;
}

function normalizeTuple(
  value: readonly [number, number, number] | undefined,
  fallback: readonly [number, number, number]
): readonly [number, number, number] {
  if (!value || value.length !== 3 || value.some(item => !Number.isFinite(item))) return fallback;
  return value;
}

function normalizeShadowMapSize(value: number | undefined) {
  const requested = clamp(Math.round(finiteOr(value, 1024)), 256, 2048);
  return [256, 512, 1024, 2048].reduce((closest, size) => (Math.abs(size - requested) < Math.abs(closest - requested) ? size : closest));
}

function isBasketModel(value: unknown): value is BasketModel {
  return value === 'open-wicker' || value === 'lidded-wicker';
}

export function normalizeObjectOptions(options: BasketObjectOptions): NormalizedBasketObjectOptions {
  const basket = options.basket ?? {};
  const basketMaterial = options.basketMaterial ?? {};
  const floor = options.floor ?? {};

  return {
    basket: {
      model: isBasketModel(basket.model) ? basket.model : 'open-wicker',
      position: normalizeTuple(basket.position, [0, 0, 0]),
      scale: clamp(finiteOr(basket.scale, 1), 0.3, 2.5),
      rotationY: finiteOr(basket.rotationY, 0),
    },
    basketMaterial: {
      color: basketMaterial.color ?? '#ffffff',
      roughness: clamp(finiteOr(basketMaterial.roughness, 0.84), 0.05, 1),
      metalness: clamp(finiteOr(basketMaterial.metalness, 0), 0, 1),
      clearcoat: clamp(finiteOr(basketMaterial.clearcoat, 0.02), 0, 1),
      clearcoatRoughness: clamp(finiteOr(basketMaterial.clearcoatRoughness, 0.7), 0, 1),
      envMapIntensity: clamp(finiteOr(basketMaterial.envMapIntensity, 0.8), 0, 5),
    },
    floor: {
      show: floor.show ?? true,
      color: floor.color ?? '#ded7ce',
      roughness: clamp(finiteOr(floor.roughness, 0.86), 0.05, 1),
      metalness: clamp(finiteOr(floor.metalness, 0), 0, 1),
    },
  };
}

export function normalizeOptions(options: BasketChartOptions): NormalizedBasketChartOptions {
  const objectOptions = normalizeObjectOptions(options);
  const environment = options.environment ?? {};
  const lighting = options.lighting ?? {};
  const postprocessing = options.postprocessing ?? {};
  const camera = options.camera ?? {};
  const controls = options.controls ?? {};
  const renderer = options.renderer ?? {};

  const cameraNear = Math.max(finiteOr(camera.near, 0.01), 0.001);
  const cameraFar = Math.max(finiteOr(camera.far, 100), 10, cameraNear + 0.01);
  const minDistance = Math.max(finiteOr(controls.minDistance, 2.1), 0.1);
  const maxDistance = Math.max(finiteOr(controls.maxDistance, 8), 2.1, minDistance);
  const minPolarAngle = clamp(finiteOr(controls.minPolarAngle, 0.18), 0, Math.PI);
  const maxPolarAngle = Math.max(minPolarAngle, clamp(finiteOr(controls.maxPolarAngle, Math.PI * 0.86), 0, Math.PI));

  return {
    ...objectOptions,
    environment: {
      show: environment.show ?? true,
      intensity: clamp(finiteOr(environment.intensity, 0.8), 0, 5),
    },
    lighting: {
      show: lighting.show ?? true,
      color: lighting.color ?? '#fff3dc',
      intensity: clamp(finiteOr(lighting.intensity, 3), 0, 20),
      fillIntensity: clamp(finiteOr(lighting.fillIntensity, 2), 0, 10),
      shadowMapSize: normalizeShadowMapSize(lighting.shadowMapSize),
      shadowBias: finiteOr(lighting.shadowBias, -0.0002),
      shadowNormalBias: clamp(finiteOr(lighting.shadowNormalBias, 0.025), 0, 1),
    },
    postprocessing: {
      show: postprocessing.show ?? true,
      ambientOcclusion: postprocessing.ambientOcclusion ?? true,
      ambientOcclusionIntensity: clamp(finiteOr(postprocessing.ambientOcclusionIntensity, 0.65), 0, 3),
      ambientOcclusionRadius: clamp(finiteOr(postprocessing.ambientOcclusionRadius, 0.18), 0.01, 2),
    },
    backgroundColor: options.backgroundColor === undefined ? '#e9e4dd' : options.backgroundColor,
    camera: {
      position: normalizeTuple(camera.position, [2.5, 2.4, 3.1]),
      target: normalizeTuple(camera.target, [0, 0.24, 0]),
      fov: clamp(finiteOr(camera.fov, 35), 20, 100),
      near: cameraNear,
      far: cameraFar,
    },
    controls: {
      enabled: controls.enabled ?? true,
      damping: controls.damping ?? true,
      autoRotate: controls.autoRotate ?? false,
      autoRotateSpeed: Math.max(finiteOr(controls.autoRotateSpeed, 0.35), 0),
      enableRotate: controls.enableRotate ?? true,
      enableZoom: controls.enableZoom ?? true,
      enablePan: controls.enablePan ?? false,
      minDistance,
      maxDistance,
      minPolarAngle,
      maxPolarAngle,
      rotateSpeed: Math.max(finiteOr(controls.rotateSpeed, 0.65), 0),
      zoomSpeed: Math.max(finiteOr(controls.zoomSpeed, 0.8), 0),
      panSpeed: Math.max(finiteOr(controls.panSpeed, 0.8), 0),
    },
    renderer: {
      pixelRatio: clamp(finiteOr(renderer.pixelRatio, 1.5), 1, 2),
      shadows: renderer.shadows ?? true,
      toneMappingExposure: clamp(finiteOr(renderer.toneMappingExposure, 1.05), 0.1, 3),
    },
  };
}
