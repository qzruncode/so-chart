import type { Layout } from '@so-chart/types/common';
import type { Group } from 'three';

export type FishColor = string | number;
export type FishVector3 = readonly [number, number, number];

export const FISH_TYPES = ['black-carp', 'grass-carp', 'silver-carp', 'bighead-carp', 'common-carp', 'crucian-carp'] as const;

export type FishType = (typeof FISH_TYPES)[number];

export const FISH_NAMES: Record<FishType, string> = {
  'black-carp': '青鱼',
  'grass-carp': '草鱼',
  'silver-carp': '鲢',
  'bighead-carp': '鳙',
  'common-carp': '鲤鱼',
  'crucian-carp': '鲫鱼',
};

export type FishItemOptions = {
  type: FishType;
  /** Stable identifier for this fish instance. Generated from its input index when omitted. */
  id?: string;
  /** Position in the 3D scene. Omitted positions are arranged automatically. */
  position?: FishVector3;
  /** XYZ Euler angles in radians. */
  rotation?: FishVector3;
  /** Multiplier for the fish size. */
  scale?: number;
  /** Individual tail-beat speed multiplier. */
  swimSpeed?: number;
  /** Individual tail-bend amount multiplier. */
  swimAmplitude?: number;
};

export type FishCameraOptions = {
  position?: FishVector3;
  target?: FishVector3;
  fov?: number;
  /** Fit all visible fish after setOption and when the container resizes. */
  autoFit?: boolean;
  near?: number;
  far?: number;
};

export type FishControlsOptions = {
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
  enablePan?: boolean;
  panSpeed?: number;
  dampingFactor?: number;
  touchAction?: 'none' | 'pan-y';
};

export type FishLightingOptions = {
  color?: FishColor;
  intensity?: number;
  /** Hemisphere fill; also scales the local environment light by 0.6. */
  fillIntensity?: number;
  fillColor?: FishColor;
  position?: FishVector3;
};

export type FishRendererOptions = {
  pixelRatio?: number;
  toneMappingExposure?: number;
};

export type FishAnimationOptions = {
  enabled?: boolean;
  /** Global animation speed multiplier. */
  speed?: number;
  reducedMotion?: 'auto' | 'always' | 'never';
};

export type FishOptions = {
  /** Base URL of the six published GLBs; default uses module-relative bundled assets. */
  assetBaseUrl?: string;
  fishes?: FishItemOptions[];
  /** Color string/hex number, or null for a transparent canvas. */
  backgroundColor?: FishColor | null;
  animation?: FishAnimationOptions;
  lighting?: FishLightingOptions;
  camera?: FishCameraOptions;
  controls?: FishControlsOptions;
  renderer?: FishRendererOptions;
  ariaLabel?: string;
  onReady?: (event: { count: number; ids: readonly string[] }) => void;
  /** Called asynchronously if fish scene construction fails. */
  onError?: (error: unknown) => void;
};

export type NormalizedFishOptions = {
  assetBaseUrl?: string;
  fishes: Array<{
    id: string;
    index: number;
    type: FishType;
    position: FishVector3;
    rotation: FishVector3;
    scale: number;
    swimSpeed: number;
    swimAmplitude: number;
  }>;
  backgroundColor: FishColor | null;
  animation: { enabled: boolean; speed: number; reducedMotion: 'auto' | 'always' | 'never' };
  lighting: { color: FishColor; intensity: number; fillIntensity: number; fillColor: FishColor; position: FishVector3 };
  camera: { position: FishVector3; target: FishVector3; fov: number; autoFit: boolean; near: number; far: number };
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
    enablePan: boolean;
    panSpeed: number;
    dampingFactor: number;
    touchAction: 'none' | 'pan-y';
  };
  ariaLabel: string;
  renderer: { pixelRatio: number; toneMappingExposure: number };
};

export type FishChartInstance = {
  chartType: 'fish';
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  layout: Required<Layout & { width: number }>;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: FishOptions) => void;
  resize: () => void;
  render: () => void;
  setAnimationEnabled: (enabled: boolean) => void;
  dispose: () => void;
};

export type FishObjectOptions = Pick<FishOptions, 'fishes' | 'animation' | 'assetBaseUrl'> & {
  /** Abort rejects and releases late-loaded resources; it does not cancel shared HTTP requests. */
  signal?: AbortSignal;
};

/** Fish geometry and native animation for an application-owned Three.js scene. */
export interface FishObjectInstance {
  readonly group: Group;
  /** Sample native animation at absolute seconds. The host owns its clock and render loop. */
  update(elapsedSeconds: number, speed?: number, instanceTimes?: Readonly<Record<string, number>>): void;
  /** Stops animation and releases this object's owned GPU resources; safe to repeat. */
  dispose(): void;
}
