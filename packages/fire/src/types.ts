import type { BaseOptions, Layout } from '@so-chart/types/common';
import type { Scene } from 'three';

export type FireColor = string | number;

export type FireShapeOptions = {
  color?: FireColor;
  width?: number;
  height?: number;
  depth?: number;
  speed?: number;
  /** Strength of the smooth airflow-driven flame and candle-light sway, from 0 to 1. */
  airflowAmplitude?: number;
};

export type FireQuality = 'low' | 'medium' | 'high';

export type FireGroundOptions = {
  show?: boolean;
  color?: FireColor;
  roughness?: number;
  size?: number;
  receiveShadow?: boolean;
};

export type FireShadowOptions = {
  enabled?: boolean;
  /** Shadow-map edge length in pixels. Quality presets provide a default. */
  mapSize?: number;
  radius?: number;
  intensity?: number;
  bias?: number;
  normalBias?: number;
  /** Dynamic point-light shadow refreshes per second; 0 disables updates after the first render. */
  refreshRate?: number;
};

export type FireLightingOptions = {
  hemisphere?: {
    show?: boolean;
    skyColor?: FireColor;
    groundColor?: FireColor;
    intensity?: number;
  };
  fill?: {
    show?: boolean;
    color?: FireColor;
    intensity?: number;
    position?: readonly [number, number, number];
    castShadow?: boolean;
  };
};

export type FireBloomOptions = {
  show?: boolean;
  strength?: number;
  radius?: number;
  threshold?: number;
};

export type FireCandleLightOptions = {
  show?: boolean;
  color?: FireColor;
  intensity?: number;
  distance?: number;
  decay?: number;
  castShadow?: boolean;
};

export type FireCandleOptions = {
  show?: boolean;
  /** Candle base position in the host scene's world coordinates. */
  position?: readonly [number, number, number];
  bodyColor?: FireColor;
  bodyRadius?: number;
  bodyHeight?: number;
  wickColor?: FireColor;
  wickRadius?: number;
  wickHeight?: number;
  light?: FireCandleLightOptions;
};

export type FireEnvironmentOptions = {
  show?: boolean;
  intensity?: number;
};

export type FireCameraOptions = {
  /** Recenter the default camera around candle.position when it changes. */
  autoFrame?: boolean;
  position?: readonly [number, number, number];
  target?: readonly [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
};

export type FireControlsOptions = {
  enabled?: boolean;
  damping?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  rotateSpeed?: number;
  zoomSpeed?: number;
  panSpeed?: number;
};

export type FireOptions = {
  quality?: FireQuality;
  fire?: FireShapeOptions;
  candle?: FireCandleOptions;
  environment?: FireEnvironmentOptions;
  lighting?: FireLightingOptions;
  shadow?: FireShadowOptions;
  ground?: FireGroundOptions;
  backgroundColor?: string | null;
  bloom?: FireBloomOptions;
  camera?: FireCameraOptions;
  controls?: FireControlsOptions;
  renderer?: {
    pixelRatio?: number;
  };
} & BaseOptions;

export type FireChartInstance = {
  chartType: 'fire';
  /** Shared Three.js scene for composing objects with this chart's renderer and camera. */
  scene: Scene;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  layout: Required<Layout & { width: number }>;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: FireOptions) => void;
  /** Merge a partial update and only recreate the affected scene objects. */
  updateOptions: (options: Partial<FireOptions>) => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
};

export type NormalizedFireOptions = {
  quality: FireQuality;
  lighting: {
    hemisphere: {
      show: boolean;
      skyColor: FireColor;
      groundColor: FireColor;
      intensity: number;
    };
    fill: {
      show: boolean;
      color: FireColor;
      intensity: number;
      position: readonly [number, number, number];
      castShadow: boolean;
    };
  };
  shadow: {
    enabled: boolean;
    mapSize: number;
    radius: number;
    intensity: number;
    bias: number;
    normalBias: number;
    refreshRate: number;
  };
  ground: {
    show: boolean;
    color: FireColor;
    roughness: number;
    size: number;
    receiveShadow: boolean;
  };
  fire: {
    color: FireColor;
    width: number;
    height: number;
    depth: number;
    speed: number;
    airflowAmplitude: number;
  };
  candle: {
    show: boolean;
    position: readonly [number, number, number];
    bodyColor: FireColor;
    bodyRadius: number;
    bodyHeight: number;
    wickColor: FireColor;
    wickRadius: number;
    wickHeight: number;
    light: {
      show: boolean;
      color: FireColor;
      intensity: number;
      distance: number;
      decay: number;
      castShadow: boolean;
    };
  };
  environment: {
    show: boolean;
    intensity: number;
  };
  backgroundColor: string | null;
  bloom: {
    show: boolean;
    strength: number;
    radius: number;
    threshold: number;
  };
  camera: {
    autoFrame: boolean;
    position: readonly [number, number, number];
    target: readonly [number, number, number];
    fov: number;
    near: number;
    far: number;
  };
  controls: {
    enabled: boolean;
    damping: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableRotate: boolean;
    enableZoom: boolean;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
  };
  renderer: {
    pixelRatio: number;
  };
};
