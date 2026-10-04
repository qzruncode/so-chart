import type { DataTexture, Texture } from 'three';
import { DataTexture as ThreeDataTexture, LinearFilter, NoColorSpace, RGBAFormat, RepeatWrapping, TextureLoader, UnsignedByteType } from 'three';
import type { NormalizedWaterOptions, WaterFlowDirection, WaterOptions } from './types.js';
import { getBaseWavelength } from './waves.js';
import waterNormal0Url from './assets/Water_1_M_Normal.jpg?url&no-inline';
import waterNormal1Url from './assets/Water_2_M_Normal.jpg?url&no-inline';

const DEFAULT_BACKGROUND = '#7aaec4';
const DEFAULT_WATER_COLOR = '#3f9bb3';
const DEFAULT_SUN_DIRECTION = [0.12, 0.58, -0.8] as const;
const DEFAULT_SUN_COLOR = '#fff4d0';

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function tuple3(
  value: readonly [number, number, number] | undefined,
  fallback: readonly [number, number, number]
): readonly [number, number, number] {
  if (!Array.isArray(value) || value.length !== 3 || value.some(item => !Number.isFinite(item))) {
    return fallback;
  }
  return [value[0], value[1], value[2]];
}

function direction3(
  value: readonly [number, number, number] | undefined,
  fallback: readonly [number, number, number]
): readonly [number, number, number] {
  const direction = tuple3(value, fallback);
  const length = Math.hypot(...direction);
  if (length < 0.000001) {
    return fallback;
  }
  return [direction[0] / length, direction[1] / length, direction[2] / length];
}

function tuple2(value: WaterFlowDirection | undefined, fallback: WaterFlowDirection): WaterFlowDirection {
  if (!Array.isArray(value) || value.length !== 2 || value.some(item => !Number.isFinite(item))) {
    return fallback;
  }

  if (Math.abs(value[0]) + Math.abs(value[1]) < 0.000001) {
    return fallback;
  }

  return [value[0], value[1]];
}

export function normalizeOptions(options: WaterOptions = {}): NormalizedWaterOptions {
  const shape = options.water ?? {};
  const width = clamp(finiteOr(shape.width, 8), 0.5, 1000);
  const depth = clamp(finiteOr(shape.depth, 6), 0.5, 1000);
  const shorterSide = Math.min(width, depth);
  const baseWavelength = getBaseWavelength(width, depth);
  const maxWaveHeight = Math.min(shorterSide * 0.06, baseWavelength * 0.12);
  const elevation = clamp(finiteOr(shape.elevation, 0), -100, 100);
  const size = Math.max(width, depth);
  const backgroundColor = options.backgroundColor === undefined ? DEFAULT_BACKGROUND : options.backgroundColor;
  const fog = options.fog ?? {};

  const near = clamp(finiteOr(options.camera?.near, 0.1), 0.01, 10);
  const fogNear = clamp(finiteOr(fog.near, size * 1.2), 0.1, 1000);
  const minDistance = clamp(finiteOr(options.controls?.minDistance, size * 0.45), 0.1, 1000);
  const minPolar = clamp(finiteOr(options.controls?.minPolarAngle, 0.2), 0, Math.PI);
  return {
    animation: {
      enabled: options.animation?.enabled ?? true,
      reducedMotion:
        options.animation?.reducedMotion === 'auto' || options.animation?.reducedMotion === 'always' ? options.animation.reducedMotion : 'never',
    },
    sky: { show: options.sky?.show ?? backgroundColor !== null },
    ariaLabel: typeof options.ariaLabel === 'string' && options.ariaLabel.trim() ? options.ariaLabel : 'Water surface chart',
    water: {
      assetBaseUrl: typeof shape.assetBaseUrl === 'string' && shape.assetBaseUrl.trim() ? shape.assetBaseUrl.trim() : undefined,
      width,
      depth,
      elevation,
      color: shape.color ?? DEFAULT_WATER_COLOR,
      textureWidth: Math.round(clamp(finiteOr(shape.textureWidth, 512), 128, 2048)),
      textureHeight: Math.round(clamp(finiteOr(shape.textureHeight, 512), 128, 2048)),
      clipBias: clamp(finiteOr(shape.clipBias, 0), -0.1, 0.1),
      flowDirection: tuple2(shape.flowDirection, [1, 0]),
      flowSpeed: clamp(finiteOr(shape.flowSpeed, 0.03), 0, 2),
      reflectivity: clamp(finiteOr(shape.reflectivity, 0.02), 0, 1),
      transmission: clamp(finiteOr(shape.transmission, 0.12), 0, 1),
      sunDirection: direction3(shape.sunDirection, DEFAULT_SUN_DIRECTION),
      sunColor: shape.sunColor ?? DEFAULT_SUN_COLOR,
      sunIntensity: clamp(finiteOr(shape.sunIntensity, 1.5), 0, 8),
      scale: clamp(finiteOr(shape.scale, 1), 0.05, 10),
      waveHeight: clamp(finiteOr(shape.waveHeight, Math.min(shorterSide * 0.02, baseWavelength * 0.08)), 0, maxWaveHeight),
      waveSpeed: clamp(finiteOr(shape.waveSpeed, 1), 0, 4),
      multisample: Math.round(clamp(finiteOr(shape.multisample, 0), 0, 8)),
      normalMap0: shape.normalMap0,
      normalMap1: shape.normalMap1,
      flowMap: shape.flowMap,
    },
    interaction: {
      enabled: options.interaction?.enabled ?? false,
      strength: clamp(finiteOr(options.interaction?.strength, 0.03), 0, 0.08),
      radius: clamp(finiteOr(options.interaction?.radius, 1.4), 0.3, 5),
      decay: clamp(finiteOr(options.interaction?.decay, 2.2), 0.4, 6),
      sampleInterval: clamp(finiteOr(options.interaction?.sampleInterval, 70), 30, 250),
    },
    backgroundColor,
    fog: {
      show: fog.show ?? backgroundColor !== null,
      color: fog.color ?? backgroundColor ?? DEFAULT_BACKGROUND,
      near: fogNear,
      far: Math.max(fogNear + 0.01, clamp(finiteOr(fog.far, size * 5), 1, 2000)),
    },
    camera: {
      position: tuple3(options.camera?.position, [size * 0.95, size * 0.75, size * 1.1]),
      target: tuple3(options.camera?.target, [0, elevation, 0]),
      fov: clamp(finiteOr(options.camera?.fov, 38), 10, 100),
      near,
      far: Math.max(near + 0.01, clamp(finiteOr(options.camera?.far, Math.max(100, size * 12)), 10, 10000)),
    },
    controls: {
      enabled: options.controls?.enabled ?? true,
      damping: options.controls?.damping ?? true,
      dampingFactor: clamp(finiteOr(options.controls?.dampingFactor, 0.06), 0.001, 1),
      autoRotate: options.controls?.autoRotate ?? false,
      autoRotateSpeed: finiteOr(options.controls?.autoRotateSpeed, 0.4),
      enablePan: options.controls?.enablePan ?? true,
      enableRotate: options.controls?.enableRotate ?? true,
      enableZoom: options.controls?.enableZoom ?? true,
      rotateSpeed: clamp(finiteOr(options.controls?.rotateSpeed, 1), 0, 10),
      zoomSpeed: clamp(finiteOr(options.controls?.zoomSpeed, 1), 0, 10),
      panSpeed: clamp(finiteOr(options.controls?.panSpeed, 1), 0, 10),
      touchAction: options.controls?.touchAction === 'none' ? 'none' : 'pan-y',
      minDistance,
      maxDistance: Math.max(minDistance, clamp(finiteOr(options.controls?.maxDistance, size * 4), 1, 5000)),
      minPolarAngle: minPolar,
      maxPolarAngle: Math.max(minPolar, clamp(finiteOr(options.controls?.maxPolarAngle, Math.PI * 0.48), 0, Math.PI)),
    },
    renderer: {
      pixelRatio: clamp(finiteOr(options.renderer?.pixelRatio, 1.25), 1, 2),
      toneMappingExposure: clamp(finiteOr(options.renderer?.toneMappingExposure, 0.3), 0.1, 3),
    },
  };
}

function createWaterNormalTexture(phase: number): DataTexture {
  const size = 32;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const slopeX = Math.sin(u * Math.PI * 2 + phase) * 0.28 + Math.sin(v * Math.PI * 4 - phase * 0.7) * 0.12;
      const slopeZ = Math.cos(v * Math.PI * 2 + phase) * 0.28 + Math.cos(u * Math.PI * 3 + phase * 0.8) * 0.12;
      const length = Math.sqrt(slopeX * slopeX + slopeZ * slopeZ + 1);
      const offset = (y * size + x) * 4;

      data[offset] = Math.round(((slopeX / length) * 0.5 + 0.5) * 255);
      data[offset + 1] = Math.round(((slopeZ / length) * 0.5 + 0.5) * 255);
      data[offset + 2] = Math.round((1 / length) * 255);
      data[offset + 3] = 255;
    }
  }

  const texture = new ThreeDataTexture(data, size, size, RGBAFormat, UnsignedByteType);
  texture.colorSpace = NoColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function createDefaultWaterNormalMaps(): [Texture, Texture] {
  return [createWaterNormalTexture(0), createWaterNormalTexture(Math.PI * 0.75)];
}

export async function loadBundledWaterNormalMaps(assetBaseUrl?: string): Promise<[Texture, Texture]> {
  const loader = new TextureLoader();
  const resolve = (name: string, fallback: string) =>
    assetBaseUrl ? new URL(name, new URL(assetBaseUrl.endsWith('/') ? assetBaseUrl : assetBaseUrl + '/', globalThis.location?.href)).href : fallback;
  const results = await Promise.allSettled([
    loader.loadAsync(resolve('Water_1_M_Normal.jpg', waterNormal0Url)),
    loader.loadAsync(resolve('Water_2_M_Normal.jpg', waterNormal1Url)),
  ]);

  const failure = results.find(r => r.status === 'rejected');
  if (failure?.status === 'rejected') {
    results.forEach(r => {
      if (r.status === 'fulfilled') r.value.dispose();
    });
    throw failure.reason;
  }
  const [normalMap0, normalMap1] = results.map(r => (r as PromiseFulfilledResult<Texture>).value);
  [normalMap0, normalMap1].forEach(texture => {
    texture.colorSpace = NoColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.needsUpdate = true;
  });

  return [normalMap0, normalMap1];
}
