import type { Layout } from '@so-chart/types/common';

export type FruitColor = string | number;
export type FruitVector3 = readonly [number, number, number];
export const FRUIT_TYPES = [
  'apple',
  'banana',
  'pear',
  'avocado',
  'kiwi',
  'lemon',
  'lime',
  'pomegranate',
  'lychee',
] as const;

export type FruitType = (typeof FRUIT_TYPES)[number];

export type FruitItemOptions = {
  type: FruitType;
  /** Stable identifier for this fruit instance. Generated from its input index when omitted. */
  id?: string;
  /** Position in the 3D scene. Omitted positions are arranged automatically. */
  position?: FruitVector3;
  /** XYZ Euler angles in radians. */
  rotation?: FruitVector3;
  /** Multiplier for the normalized model size. */
  scale?: number;
};

export type FruitFloorOptions = {
  show?: boolean;
  color?: FruitColor;
  roughness?: number;
};

export type FruitLightingOptions = {
  show?: boolean;
  color?: FruitColor;
  intensity?: number;
  fillIntensity?: number;
};

export type FruitCameraOptions = {
  position?: FruitVector3;
  target?: FruitVector3;
  fov?: number;
  /** Fit all visible fruits after loading and when the container resizes. */
  autoFit?: boolean;
};

export type FruitControlsOptions = {
  enabled?: boolean;
  damping?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableRotate?: boolean;
  enableZoom?: boolean;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  rotateSpeed?: number;
  zoomSpeed?: number;
};

export type FruitRendererOptions = {
  pixelRatio?: number;
  shadows?: boolean;
  toneMappingExposure?: number;
};

export type FruitEventName = 'mouseenter' | 'mousemove' | 'mouseleave' | 'click';

export type FruitEventData = {
  fruitId: string;
  /** Zero-based index in the `fruits` array passed to `setOption`. */
  fruitIndex: number;
  fruitType: FruitType;
  /** Distance from the camera ray origin, in scene units. */
  distance: number;
  /** Pointer coordinates relative to the canvas, in CSS pixels. */
  screen: { x: number; y: number };
};

export type FruitOptions = {
  fruits?: FruitItemOptions[];
  floor?: FruitFloorOptions;
  lighting?: FruitLightingOptions;
  backgroundColor?: FruitColor | null;
  camera?: FruitCameraOptions;
  controls?: FruitControlsOptions;
  renderer?: FruitRendererOptions;
  /** Called for a model load or parse failure in the current scene build. */
  onError?: (error: unknown) => void;
};

export type NormalizedFruitOptions = {
  fruits: Array<{
    id: string;
    index: number;
    type: FruitType;
    position: FruitVector3;
    rotation: FruitVector3;
    scale: number;
  }>;
  floor: {
    show: boolean;
    color: FruitColor;
    roughness: number;
  };
  lighting: {
    show: boolean;
    color: FruitColor;
    intensity: number;
    fillIntensity: number;
  };
  backgroundColor: FruitColor | null;
  camera: {
    position: FruitVector3;
    target: FruitVector3;
    fov: number;
    autoFit: boolean;
  };
  controls: {
    enabled: boolean;
    damping: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableRotate: boolean;
    enableZoom: boolean;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    rotateSpeed: number;
    zoomSpeed: number;
  };
  renderer: {
    pixelRatio: number;
    shadows: boolean;
    toneMappingExposure: number;
  };
};

export type FruitChartInstance = {
  chartType: 'fruit';
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  layout: Required<Layout & { width: number }>;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: FruitOptions) => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
  on: (eventName: FruitEventName, listener: (data: FruitEventData) => void) => () => void;
};
