import type { Layout } from '@so-chart/types/common';
import type { Texture } from 'three';

export type Table3DColor = string | number;

export type Table3DShape = 'round' | 'rectangular';

export type Table3DSupport = 'pedestal' | 'legs';

type Table3DSharedGeometryOptions = {
  height?: number;
  topThickness?: number;
  legWidth?: number;
  legInset?: number;
  cornerRadius?: number;
  cornerSegments?: number;
};

/** Geometry options for the default round table. */
export type Table3DRoundGeometryOptions = Table3DSharedGeometryOptions & {
  shape?: 'round';
  support?: Table3DSupport;
  diameter?: number;
  edgeRadius?: number;
  edgeSegments?: number;
  radialSegments?: number;
  supportSegments?: number;
  baseRadius?: number;
  baseHeight?: number;
  pedestalRadius?: number;
  pedestalHeight?: number;
  collarRadius?: number;
  collarHeight?: number;
  width?: never;
  depth?: never;
  apronHeight?: never;
  apronInset?: never;
};

/** Geometry options for the rounded rectangular table. */
export type Table3DRectangularGeometryOptions = Table3DSharedGeometryOptions & {
  shape: 'rectangular';
  support?: 'legs';
  width?: number;
  depth?: number;
  apronHeight?: number;
  apronInset?: number;
  diameter?: never;
  radialSegments?: never;
  supportSegments?: never;
  baseRadius?: never;
  baseHeight?: never;
  pedestalRadius?: never;
  pedestalHeight?: never;
  collarRadius?: never;
  collarHeight?: never;
};

export type Table3DGeometryOptions = Table3DRoundGeometryOptions | Table3DRectangularGeometryOptions;

export type Table3DMaterialOptions = {
  color?: Table3DColor;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  envMapIntensity?: number;
  map?: Texture | null;
  normalMap?: Texture | null;
  roughnessMap?: Texture | null;
  normalScale?: readonly [number, number];
};

export type NormalizedTable3DMaterialOptions = {
  color: Table3DColor;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  envMapIntensity: number;
  map?: Texture;
  normalMap?: Texture;
  roughnessMap?: Texture;
  normalScale: readonly [number, number];
};

export type Table3DFloorOptions = {
  show?: boolean;
  color?: Table3DColor;
  roughness?: number;
  metalness?: number;
};

export type Table3DEnvironmentOptions = {
  show?: boolean;
  intensity?: number;
  /** A caller-owned texture prepared for use as `scene.environment`. */
  texture?: Texture | null;
  /** Also show the supplied environment texture as the scene background. */
  background?: boolean;
  /** XYZ rotation in radians for the environment and optional background. */
  rotation?: readonly [number, number, number];
};

export type Table3DLightingOptions = {
  show?: boolean;
  color?: Table3DColor;
  intensity?: number;
  fillIntensity?: number;
  shadowMapSize?: number;
  shadowBias?: number;
  shadowNormalBias?: number;
};

export type Table3DPostprocessingOptions = {
  show?: boolean;
  ambientOcclusion?: boolean;
  ambientOcclusionIntensity?: number;
  ambientOcclusionRadius?: number;
};

export type Table3DCameraOptions = {
  position?: readonly [number, number, number];
  target?: readonly [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
};

export type Table3DControlsOptions = {
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

export type Table3DOptions = {
  table?: Table3DGeometryOptions;
  material?: Table3DMaterialOptions;
  /** Overrides the shared material only on the tabletop. Unspecified fields inherit `material`. */
  tabletopMaterial?: Table3DMaterialOptions;
  floor?: Table3DFloorOptions;
  environment?: Table3DEnvironmentOptions;
  lighting?: Table3DLightingOptions;
  postprocessing?: Table3DPostprocessingOptions;
  backgroundColor?: Table3DColor | null;
  camera?: Table3DCameraOptions;
  controls?: Table3DControlsOptions;
  renderer?: {
    pixelRatio?: number;
    shadows?: boolean;
    toneMappingExposure?: number;
  };
};

export type NormalizedTable3DOptions = {
  table: {
    shape: Table3DShape;
    support: Table3DSupport;
    width: number;
    depth: number;
    diameter: number;
    height: number;
    topThickness: number;
    edgeRadius: number;
    edgeSegments: number;
    radialSegments: number;
    supportSegments: number;
    legWidth: number;
    legInset: number;
    apronHeight: number;
    apronInset: number;
    cornerRadius: number;
    cornerSegments: number;
    baseRadius: number;
    baseHeight: number;
    pedestalRadius: number;
    pedestalHeight: number;
    collarRadius: number;
    collarHeight: number;
  };
  material: NormalizedTable3DMaterialOptions;
  tabletopMaterial: NormalizedTable3DMaterialOptions;
  floor: {
    show: boolean;
    color: Table3DColor;
    roughness: number;
    metalness: number;
  };
  environment: {
    show: boolean;
    intensity: number;
    texture?: Texture;
    background: boolean;
    rotation: readonly [number, number, number];
  };
  lighting: {
    show: boolean;
    color: Table3DColor;
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
  backgroundColor: Table3DColor | null;
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

export type Table3DChartInstance = {
  chartType: 'table3d';
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  layout: Required<Layout & { width: number }>;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: Table3DOptions) => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
};
