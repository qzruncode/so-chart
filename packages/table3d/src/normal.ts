import type { NormalizedTable3DMaterialOptions, Table3DMaterialOptions, Table3DOptions, NormalizedTable3DOptions } from './types';

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

function normalizeNormalScale(
  value: readonly [number, number] | undefined,
  fallback: readonly [number, number] = [1, 1]
): readonly [number, number] {
  if (!value || value.length !== 2 || value.some(item => !Number.isFinite(item))) return fallback;
  return value;
}

function normalizeMaterial(
  material: Table3DMaterialOptions | undefined,
  fallback?: NormalizedTable3DMaterialOptions
): NormalizedTable3DMaterialOptions {
  return {
    color: material?.color ?? fallback?.color ?? '#8b5a36',
    roughness: clamp(finiteOr(material?.roughness, fallback?.roughness ?? 0.48), 0.05, 1),
    metalness: clamp(finiteOr(material?.metalness, fallback?.metalness ?? 0), 0, 1),
    clearcoat: clamp(finiteOr(material?.clearcoat, fallback?.clearcoat ?? 0.18), 0, 1),
    clearcoatRoughness: clamp(finiteOr(material?.clearcoatRoughness, fallback?.clearcoatRoughness ?? 0.32), 0, 1),
    envMapIntensity: clamp(finiteOr(material?.envMapIntensity, fallback?.envMapIntensity ?? 0.85), 0, 5),
    map: material?.map === null ? undefined : material?.map ?? fallback?.map,
    normalMap: material?.normalMap === null ? undefined : material?.normalMap ?? fallback?.normalMap,
    roughnessMap: material?.roughnessMap === null ? undefined : material?.roughnessMap ?? fallback?.roughnessMap,
    normalScale: normalizeNormalScale(material?.normalScale, fallback?.normalScale ?? [1, 1]),
  };
}

export function normalizeOptions(options: Table3DOptions): NormalizedTable3DOptions {
  const table = options.table ?? {};
  const shape = table.shape ?? 'round';
  const support = shape === 'rectangular' ? 'legs' : table.support ?? 'pedestal';
  const width = clamp(finiteOr(table.width, 2.2), 0.3, 20);
  const depth = clamp(finiteOr(table.depth, 1.2), 0.3, 20);
  const diameter = clamp(finiteOr(table.diameter, 2.6), 0.5, 20);
  const height = clamp(finiteOr(table.height, 1.05), 0.3, 8);
  const topThickness = clamp(finiteOr(table.topThickness, 0.12), 0.02, height * 0.4);
  const legWidth = clamp(finiteOr(table.legWidth, 0.16), 0.02, Math.min(width, depth) * 0.3);
  const legInset = clamp(finiteOr(table.legInset, 0.16), 0, Math.max(0, Math.min(width, depth) / 2 - legWidth / 2 - 0.01));
  const apronHeight = clamp(finiteOr(table.apronHeight, 0.18), 0.02, Math.max(0.02, height - topThickness - 0.02));
  const apronInset = clamp(finiteOr(table.apronInset, 0.1), 0, Math.max(0, Math.min(width, depth) / 2 - legWidth / 2 - 0.01));
  const cornerRadius = clamp(finiteOr(table.cornerRadius, 0.06), 0, Math.min(topThickness, legWidth) * 0.45);
  const cornerSegments = Math.round(clamp(finiteOr(table.cornerSegments, 5), 1, 12));
  const edgeRadius = clamp(
    finiteOr('edgeRadius' in table ? table.edgeRadius : undefined, 0.055),
    0,
    Math.min(topThickness * 0.45, (shape === 'round' ? diameter : Math.min(width, depth)) * 0.08)
  );
  const edgeSegments = Math.round(clamp(finiteOr('edgeSegments' in table ? table.edgeSegments : undefined, 4), 1, 8));
  const radialSegments = Math.round(clamp(finiteOr(table.radialSegments, 64), 16, 128));
  const supportSegments = Math.round(clamp(finiteOr(table.supportSegments, 48), 12, 96));
  const supportAvailable = Math.max(height - topThickness, 0.06);
  const baseSize = shape === 'round' ? diameter : Math.min(width, depth);
  const baseRadius = clamp(finiteOr(table.baseRadius, baseSize * 0.24), 0.08, baseSize * 0.48);
  const baseHeight = clamp(finiteOr(table.baseHeight, 0.1), 0.02, supportAvailable * 0.45);
  const collarHeight = clamp(finiteOr(table.collarHeight, 0.12), 0.02, Math.max(0.02, supportAvailable - baseHeight - 0.02));
  const maxPedestalHeight = Math.max(0.02, supportAvailable - baseHeight - collarHeight);
  const pedestalRadius = clamp(finiteOr(table.pedestalRadius, baseSize * 0.06), 0.03, baseRadius * 0.72);
  const collarRadius = clamp(finiteOr(table.collarRadius, pedestalRadius * 1.55), pedestalRadius, baseRadius * 0.82);
  const pedestalHeight = clamp(finiteOr(table.pedestalHeight, maxPedestalHeight), 0.02, maxPedestalHeight);
  const camera = options.camera ?? {};
  const controls = options.controls ?? {};
  const lighting = options.lighting ?? {};
  const material = options.material ?? {};
  const floor = options.floor ?? {};
  const environment = options.environment ?? {};
  const postprocessing = options.postprocessing ?? {};
  const renderer = options.renderer ?? {};
  const size = Math.max(width, depth, diameter, height);
  const minDistance = Math.max(finiteOr(controls.minDistance, size * 1.15), 0.1);
  const normalizedMaterial = normalizeMaterial(material);

  return {
    table: {
      shape,
      support,
      width,
      depth,
      diameter,
      height,
      topThickness,
      edgeRadius,
      edgeSegments,
      radialSegments,
      supportSegments,
      legWidth,
      legInset,
      apronHeight,
      apronInset,
      cornerRadius,
      cornerSegments,
      baseRadius,
      baseHeight,
      pedestalRadius,
      pedestalHeight,
      collarRadius,
      collarHeight,
    },
    material: normalizedMaterial,
    tabletopMaterial: normalizeMaterial(options.tabletopMaterial, normalizedMaterial),
    floor: {
      show: floor.show ?? true,
      color: floor.color ?? '#27231f',
      roughness: clamp(finiteOr(floor.roughness, 0.7), 0.05, 1),
      metalness: clamp(finiteOr(floor.metalness, 0), 0, 1),
    },
    environment: {
      show: environment.show ?? true,
      intensity: clamp(finiteOr(environment.intensity, 0.7), 0, 5),
      texture: environment.texture === null ? undefined : environment.texture,
      background: environment.background ?? false,
      rotation: normalizeTuple(environment.rotation, [0, 0, 0]),
    },
    lighting: {
      show: lighting.show ?? true,
      color: lighting.color ?? '#fff3dc',
      intensity: clamp(finiteOr(lighting.intensity, 3.2), 0, 20),
      fillIntensity: clamp(finiteOr(lighting.fillIntensity, 1.4), 0, 10),
      shadowMapSize: normalizeShadowMapSize(lighting.shadowMapSize),
      shadowBias: finiteOr(lighting.shadowBias, -0.0002),
      shadowNormalBias: clamp(finiteOr(lighting.shadowNormalBias, 0.025), 0, 1),
    },
    postprocessing: {
      show: postprocessing.show ?? true,
      ambientOcclusion: postprocessing.ambientOcclusion ?? true,
      ambientOcclusionIntensity: clamp(finiteOr(postprocessing.ambientOcclusionIntensity, 1.1), 0, 3),
      ambientOcclusionRadius: clamp(finiteOr(postprocessing.ambientOcclusionRadius, 0.28), 0.01, 2),
    },
    backgroundColor: options.backgroundColor === undefined ? '#171513' : options.backgroundColor,
    camera: {
      position: normalizeTuple(camera.position, [size * 1.65, size * 1.15, size * 1.8]),
      target: normalizeTuple(camera.target, [0, height * 0.45, 0]),
      fov: clamp(finiteOr(camera.fov, 38), 20, 100),
      near: Math.max(finiteOr(camera.near, 0.01), 0.001),
      far: Math.max(finiteOr(camera.far, size * 20), size * 4),
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
      maxDistance: Math.max(finiteOr(controls.maxDistance, size * 5.5), minDistance),
      minPolarAngle: clamp(finiteOr(controls.minPolarAngle, 0.18), 0, Math.PI),
      maxPolarAngle: clamp(finiteOr(controls.maxPolarAngle, Math.PI * 0.86), 0, Math.PI),
      rotateSpeed: Math.max(finiteOr(controls.rotateSpeed, 0.65), 0),
      zoomSpeed: Math.max(finiteOr(controls.zoomSpeed, 0.8), 0),
      panSpeed: Math.max(finiteOr(controls.panSpeed, 0.8), 0),
    },
    renderer: {
      pixelRatio: clamp(finiteOr(renderer.pixelRatio, 1.5), 1, 2),
      shadows: renderer.shadows ?? true,
      toneMappingExposure: clamp(finiteOr(renderer.toneMappingExposure, 1), 0.1, 3),
    },
  };
}
