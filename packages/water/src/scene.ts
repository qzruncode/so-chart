import * as THREE from 'three';

import { createDefaultWaterNormalMaps, loadBundledWaterNormalMaps, normalizeOptions } from './normal.js';
import { replaceWaterSurfaceNormalMaps, WaterSurface } from './water2.js';
import { getBaseWavelength, getWaveSegments } from './waves.js';
import type { NormalizedWaterShapeOptions, WaterOptions } from './types.js';

export function createWaterSurface(options: NormalizedWaterShapeOptions, onError?: WaterOptions['onError']): WaterSurface {
  const baseWavelength = getBaseWavelength(options.width, options.depth);
  const segmentsX = getWaveSegments(options.width, baseWavelength);
  const segmentsY = getWaveSegments(options.depth, baseWavelength);
  const geometry = new THREE.PlaneGeometry(options.width, options.depth, segmentsX, segmentsY);
  geometry.rotateX(-Math.PI / 2);

  const defaults = createDefaultWaterNormalMaps();
  const generatedMaps: THREE.Texture[] = [];
  const normalMap0 = options.normalMap0 ?? defaults[0];
  const normalMap1 = options.normalMap1 ?? defaults[1];

  if (!options.normalMap0) {
    generatedMaps.push(normalMap0);
  }
  if (!options.normalMap1) {
    generatedMaps.push(normalMap1);
  }
  defaults.forEach(texture => {
    if (!generatedMaps.includes(texture)) {
      texture.dispose();
    }
  });

  try {
    const surface = new WaterSurface(geometry, {
      color: options.color,
      textureWidth: options.textureWidth,
      textureHeight: options.textureHeight,
      clipBias: options.clipBias,
      flowDirection: options.flowDirection,
      flowSpeed: options.flowSpeed,
      reflectivity: options.reflectivity,
      transmission: options.transmission,
      sunDirection: options.sunDirection,
      sunColor: options.sunColor,
      sunIntensity: options.sunIntensity,
      scale: options.scale,
      width: options.width,
      depth: options.depth,
      waveHeight: options.waveHeight,
      waveSpeed: options.waveSpeed,
      multisample: options.multisample,
      normalMap0,
      normalMap1,
      flowMap: options.flowMap,
    });
    surface.name = 'so-chart-water-surface';
    surface.position.y = options.elevation;
    surface.renderOrder = 1;

    if (!options.normalMap0 || !options.normalMap1) {
      void loadBundledWaterNormalMaps(options.assetBaseUrl)
        .then(([bundledMap0, bundledMap1]) => {
          try {
            replaceWaterSurfaceNormalMaps(surface, options.normalMap0 ?? bundledMap0, options.normalMap1 ?? bundledMap1);
          } finally {
            bundledMap0.dispose();
            bundledMap1.dispose();
          }
        })
        .catch(error => {
          if (!surface.isDisposed) {
            try {
              onError?.(error);
            } catch (callbackError) {
              console.error('The water onError callback threw an error.', callbackError);
            }
          }
        });
    }

    return surface;
  } finally {
    generatedMaps.forEach(texture => texture.dispose());
  }
}

export function createWaterObject(options: WaterOptions = {}): WaterSurface {
  const normalized = normalizeOptions(options);
  const surface = createWaterSurface(normalized.water, options.onError);
  const reduced =
    normalized.animation.reducedMotion === 'always' ||
    (normalized.animation.reducedMotion === 'auto' && globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  surface.setAnimationEnabled(normalized.animation.enabled && !reduced);
  return surface;
}
