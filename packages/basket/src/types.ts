import type { BaseOptions, Layout } from '@so-chart/types/common';

export type BasketColor = string | number;
export type BasketModel = 'open-wicker' | 'lidded-wicker';

export type BasketOptions = {
  /** Bundled basket silhouette; defaults to 'open-wicker'. */
  model?: BasketModel;
  position?: readonly [number, number, number];
  scale?: number;
  rotationY?: number;
};

export type BasketMaterialOptions = {
  color?: BasketColor;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  envMapIntensity?: number;
};

export type BasketFloorOptions = {
  show?: boolean;
  color?: BasketColor;
  roughness?: number;
  metalness?: number;
};

export type BasketEnvironmentOptions = {
  show?: boolean;
  intensity?: number;
};

export type BasketLightingOptions = {
  show?: boolean;
  color?: BasketColor;
  intensity?: number;
  fillIntensity?: number;
  shadowMapSize?: number;
  shadowBias?: number;
  shadowNormalBias?: number;
};

export type BasketPostprocessingOptions = {
  show?: boolean;
  ambientOcclusion?: boolean;
  ambientOcclusionIntensity?: number;
  ambientOcclusionRadius?: number;
};

export type BasketCameraOptions = {
  position?: readonly [number, number, number];
  target?: readonly [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
};

export type BasketControlsOptions = {
  enabled?: boolean;
  damping?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  rotateSpeed?: number;
  zoomSpeed?: number;
  panSpeed?: number;
};

/** Options for the basket model and optional floor in a host Three.js scene. */
export type BasketObjectOptions = {
  basket?: BasketOptions;
  basketMaterial?: BasketMaterialOptions;
  floor?: BasketFloorOptions;
};

export type BasketChartOptions = BasketObjectOptions & {
  environment?: BasketEnvironmentOptions;
  lighting?: BasketLightingOptions;
  postprocessing?: BasketPostprocessingOptions;
  backgroundColor?: BasketColor | null;
  camera?: BasketCameraOptions;
  controls?: BasketControlsOptions;
  renderer?: {
    pixelRatio?: number;
    shadows?: boolean;
    toneMappingExposure?: number;
  };
  /** Called once when the current basket model cannot load or parse. */
  onError?: (error: unknown) => void;
} & BaseOptions;

export type NormalizedBasketChartOptions = {
  basket: {
    model: BasketModel;
    position: readonly [number, number, number];
    scale: number;
    rotationY: number;
  };
  basketMaterial: {
    color: BasketColor;
    roughness: number;
    metalness: number;
    clearcoat: number;
    clearcoatRoughness: number;
    envMapIntensity: number;
  };
  floor: {
    show: boolean;
    color: BasketColor;
    roughness: number;
    metalness: number;
  };
  environment: {
    show: boolean;
    intensity: number;
  };
  lighting: {
    show: boolean;
    color: BasketColor;
    intensity: number;
    fillIntensity: number;
    shadowMapSize: number;
    shadowBias: number;
    shadowNormalBias: number;
  };
  postprocessing: {
    show: boolean;
    ambientOcclusion: boolean;
    ambientOcclusionIntensity: number;
    ambientOcclusionRadius: number;
  };
  backgroundColor: BasketColor | null;
  camera: {
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
    minPolarAngle: number;
    maxPolarAngle: number;
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
  };
  renderer: {
    pixelRatio: number;
    shadows: boolean;
    toneMappingExposure: number;
  };
};

export type NormalizedBasketObjectOptions = Pick<NormalizedBasketChartOptions, 'basket' | 'basketMaterial' | 'floor'>;

export type BasketChartInstance = {
  chartType: 'basket';
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  layout: Required<Layout & { width: number }>;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: BasketChartOptions) => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
};
