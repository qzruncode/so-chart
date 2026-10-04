import type { Camera, ColorRepresentation, Scene, Texture } from 'three';

export type WaterFlowDirection = readonly [number, number];

export interface WaterShapeOptions {
  /** Base URL of the two published normal-map JPGs; default is module-relative. */
  assetBaseUrl?: string;
  /** Width of the horizontal water plane in world units, from 0.5 to 1000. Default: 8. */
  width?: number;
  /** Depth of the horizontal water plane in world units, from 0.5 to 1000. Default: 6. */
  depth?: number;
  /** World-space elevation of the water plane. Default: 0. */
  elevation?: number;
  /** Base color used by the Water2 shader. Default: #3f9bb3. */
  color?: ColorRepresentation;
  /** Reflection and refraction render target width. Default: 512. */
  textureWidth?: number;
  /** Reflection and refraction render target height. Default: 512. */
  textureHeight?: number;
  /** Reflection and refraction clip bias. Default: 0. */
  clipBias?: number;
  /** Direction of the scrolling normal maps. Default: [1, 0]. */
  flowDirection?: WaterFlowDirection;
  /** Normal-map flow speed. Zero stops only fine-normal scrolling; geometric waves use waveSpeed. Default: 0.03. */
  flowSpeed?: number;
  /** Fresnel reflection strength. Default: 0.02. */
  reflectivity?: number;
  /** Refracted scene contribution, 0..1. Default: 0.12 (deep water); increase for shallow water. */
  transmission?: number;
  /** Direction from the surface toward the sun; normalized at runtime. Default: [0.12, 0.58, -0.8]. */
  sunDirection?: readonly [number, number, number];
  /** Color of the direct sun reflection. Default: #fff4d0. */
  sunColor?: ColorRepresentation;
  /** Strength of direct sunlight on the water. Default: 1.5. */
  sunIntensity?: number;
  /** Normal-map repetition multiplier; wide planes keep the same world-space detail density. Default: 1. */
  scale?: number;
  /** Combined Gerstner wave crest amplitude in world units. Defaults to 2% of the shorter plane edge, capped for stable slopes. */
  waveHeight?: number;
  /** Gerstner wave speed multiplier. Set to 0 to stop geometric wave motion. Default: 1. */
  waveSpeed?: number;
  /** Offscreen render target MSAA sample count. Default: 0. */
  multisample?: number;
  /** Optional application-owned normal texture for the first flow phase. */
  normalMap0?: Texture;
  /** Optional application-owned normal texture for the second flow phase. */
  normalMap1?: Texture;
  /** Optional application-owned flow map. */
  flowMap?: Texture;
}

export interface WaterCameraOptions {
  position?: readonly [number, number, number];
  target?: readonly [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
}

export interface WaterControlsOptions {
  enabled?: boolean;
  damping?: boolean;
  dampingFactor?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enablePan?: boolean;
  enableRotate?: boolean;
  enableZoom?: boolean;
  rotateSpeed?: number;
  zoomSpeed?: number;
  panSpeed?: number;
  touchAction?: 'none' | 'pan-y';
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export interface WaterFogOptions {
  show?: boolean;
  color?: ColorRepresentation;
  near?: number;
  far?: number;
}

export interface WaterRendererOptions {
  /** Renderer pixel ratio cap. Default: 1.25. */
  pixelRatio?: number;
  /** Renderer exposure used with ACES filmic tone mapping. Affects the sky and both Water2 render passes. Default: 0.3; range: 0.1..3. */
  toneMappingExposure?: number;
}

export interface WaterInteractionOptions {
  /** Pointer interaction is opt-in. Default: false. */
  enabled?: boolean;
  /** Maximum combined ripple height in world units, 0..0.08. Default: 0.03. */
  strength?: number;
  /** Local ripple envelope radius, 0.3..5 world units. Default: 1.4. */
  radius?: number;
  /** Ripple lifetime, 0.4..6 seconds. Default: 2.2. */
  decay?: number;
  /** Minimum emission interval, 30..250 milliseconds. Default: 70. */
  sampleInterval?: number;
}
export interface NormalizedWaterInteractionOptions {
  enabled: boolean;
  strength: number;
  radius: number;
  decay: number;
  sampleInterval: number;
}
export interface WaterInteractionEvent {
  /** World position on the mean water plane, using the current camera and canvas bounds. */
  position: readonly [number, number, number];
  source: 'mouse' | 'pen' | 'touch';
}

export interface WaterOptions {
  water?: WaterShapeOptions;
  animation?: { enabled?: boolean; reducedMotion?: 'auto' | 'always' | 'never' };
  sky?: { show?: boolean };
  ariaLabel?: string;
  /** Bundled normal map failure; procedural fallback remains usable. */
  onError?: (error: unknown) => void;
  interaction?: WaterInteractionOptions;
  /** Emitted at the sampling rate, or null when the pointer target clears. */
  onInteraction?: (event: WaterInteractionEvent | null) => void;
  backgroundColor?: ColorRepresentation | null;
  fog?: WaterFogOptions;
  camera?: WaterCameraOptions;
  controls?: WaterControlsOptions;
  renderer?: WaterRendererOptions;
}

export interface NormalizedWaterShapeOptions {
  assetBaseUrl?: string;
  width: number;
  depth: number;
  elevation: number;
  color: ColorRepresentation;
  textureWidth: number;
  textureHeight: number;
  clipBias: number;
  flowDirection: WaterFlowDirection;
  flowSpeed: number;
  reflectivity: number;
  transmission: number;
  sunDirection: readonly [number, number, number];
  sunColor: ColorRepresentation;
  sunIntensity: number;
  scale: number;
  waveHeight: number;
  waveSpeed: number;
  multisample: number;
  normalMap0?: Texture;
  normalMap1?: Texture;
  flowMap?: Texture;
}

export interface NormalizedWaterCameraOptions {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
  near: number;
  far: number;
}

export interface NormalizedWaterControlsOptions {
  enabled: boolean;
  damping: boolean;
  dampingFactor: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  enablePan: boolean;
  enableRotate: boolean;
  enableZoom: boolean;
  rotateSpeed: number;
  zoomSpeed: number;
  panSpeed: number;
  touchAction: 'none' | 'pan-y';
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
}

export interface NormalizedWaterFogOptions {
  show: boolean;
  color: ColorRepresentation;
  near: number;
  far: number;
}

export interface NormalizedWaterOptions {
  water: NormalizedWaterShapeOptions;
  animation: { enabled: boolean; reducedMotion: 'auto' | 'always' | 'never' };
  sky: { show: boolean };
  ariaLabel: string;
  interaction: NormalizedWaterInteractionOptions;
  backgroundColor: ColorRepresentation | null;
  fog: NormalizedWaterFogOptions;
  camera: NormalizedWaterCameraOptions;
  controls: NormalizedWaterControlsOptions;
  renderer: {
    pixelRatio: number;
    toneMappingExposure: number;
  };
}

export interface WaterChartInstance {
  readonly chartType: 'water';
  readonly container: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly scene: Scene;
  readonly camera: Camera;
  init(container: HTMLElement, layout?: import('@so-chart/types/common').Layout): WaterChartInstance;
  setOption(options: WaterOptions): WaterChartInstance;
  /** Freeze/resume water time without rebuilding; disabling clears ripples and the pointer target. */
  setAnimationEnabled(enabled: boolean): WaterChartInstance;
  /** Enable/disable pointer interaction without rebuilding; disabling clears ripples and target. */
  setInteractionEnabled(enabled: boolean): WaterChartInstance;
  resize(): WaterChartInstance;
  render(): WaterChartInstance;
  dispose(): void;
}
