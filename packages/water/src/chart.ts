import { applyChartLayoutWithoutScale, throttleResize } from '@so-chart/utils';
import type { Layout } from '@so-chart/types/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';

import { createWaterSurface } from './scene.js';
import { WaterPointerInteraction } from './interaction.js';
import { normalizeOptions } from './normal.js';
import type { NormalizedWaterOptions, WaterChartInstance, WaterOptions } from './types.js';
import type { WaterSurface } from './water2.js';

const DEFAULT_LAYOUT: Required<Layout & { width: number }> = {
  width: 0,
  height: 400,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export class WaterChart implements WaterChartInstance {
  readonly chartType = 'water' as const;
  container!: HTMLElement;
  canvas!: HTMLCanvasElement;
  layout!: Required<Layout & { width: number }>;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;

  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private sky!: Sky;
  private water?: WaterSurface;
  private options?: NormalizedWaterOptions;
  private resizeChannel?: ReturnType<typeof throttleResize>;
  private animationLoopActive = false;
  private disposed = false;
  private pointer?: WaterPointerInteraction;
  private motionQuery?: MediaQueryList;
  private animationEnabled = () =>
    Boolean(this.options?.animation.enabled) &&
    !(this.options?.animation.reducedMotion === 'always' || (this.options?.animation.reducedMotion === 'auto' && this.motionQuery?.matches));
  private onMotionChange = () => {
    if (this.disposed || !this.options) return;
    this.configureControls();
    this.water?.setAnimationEnabled(this.animationEnabled());
    this.pointer?.configure({ ...this.options!.interaction, enabled: this.options!.interaction.enabled && this.animationEnabled() });
    this.render();
  };
  private onInteraction?: WaterOptions['onInteraction'];

  init = (container: HTMLElement, layout?: Layout): WaterChartInstance => {
    if (this.renderer && !this.disposed) this.dispose();
    this.container = container;
    this.layout = {
      ...DEFAULT_LAYOUT,
      ...applyChartLayoutWithoutScale({ layout }),
    };
    this.disposed = false;

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    if (container.getBoundingClientRect().height === 0) {
      container.style.height = `${this.layout.height}px`;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.dataset.soChartWater = 'true';
    this.canvas.setAttribute('aria-label', 'Water surface chart');
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.maxWidth = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.touchAction = 'none';
    container.appendChild(this.canvas);

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      this.canvas.remove();
      throw error;
    }
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.scene = new THREE.Scene();
    this.sky = new Sky();
    this.sky.name = 'so-chart-water-sky';
    this.sky.scale.setScalar(10000);
    this.sky.renderOrder = -1;
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.addEventListener('change', this.render);
    this.pointer = new WaterPointerInteraction(
      this.canvas,
      () => (this.options ? { camera: this.camera, shape: this.options.water } : undefined),
      event => {
        if (this.disposed) return;
        if (event && this.options?.interaction.enabled) {
          const config = this.options.interaction;
          this.water?.addRipple(event.position[0], event.position[2], config.strength, config.radius, config.decay);
          this.render();
        }
        try {
          this.onInteraction?.(event);
        } catch (error) {
          console.error('The water onInteraction callback threw an error.', error);
        }
      },
      () => this.water?.clearRipples()
    );
    this.motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.motionQuery?.addEventListener('change', this.onMotionChange);
    this.resizeChannel = throttleResize(this, 200);
    this.resize();
    return this;
  };

  setOption = (options: WaterOptions): WaterChartInstance => {
    if (this.disposed || !this.renderer) {
      return this;
    }

    if (this.options) this.pointer?.configure({ ...this.options.interaction, enabled: false });
    this.onInteraction = options.onInteraction;
    this.options = normalizeOptions(options);
    this.canvas.setAttribute('aria-label', this.options.ariaLabel);
    this.configureScene();
    this.configureCamera();
    this.configureControls();
    this.clearWater();
    this.water = createWaterSurface(this.options.water, error => {
      if (!this.disposed) {
        try {
          options.onError?.(error);
        } catch (callbackError) {
          console.error('The water onError callback threw an error.', callbackError);
        }
      }
    });
    this.water.setAnimationEnabled(this.animationEnabled());
    this.scene.add(this.water);
    this.pointer?.configure({ ...this.options.interaction, enabled: this.options.interaction.enabled && this.animationEnabled() });
    this.resize();
    this.render();
    return this;
  };

  setAnimationEnabled = (enabled: boolean): WaterChartInstance => {
    if (this.disposed || !this.options) return this;
    this.options.animation.enabled = enabled;
    this.onMotionChange();
    return this;
  };

  setInteractionEnabled = (enabled: boolean): WaterChartInstance => {
    if (this.disposed || !this.options) return this;
    this.options.interaction.enabled = enabled;
    this.pointer?.configure({ ...this.options.interaction, enabled: this.options.interaction.enabled && this.animationEnabled() });
    this.render();
    return this;
  };

  resize = (): WaterChartInstance => {
    if (this.disposed || !this.renderer || !this.camera) {
      return this;
    }

    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height || this.layout.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.options?.renderer.pixelRatio ?? 1.25);

    this.layout.width = width;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
    return this;
  };

  render = (): WaterChartInstance => {
    if (this.disposed || !this.renderer || !this.scene || !this.camera) {
      return this;
    }

    this.syncAnimationLoop();
    if (!this.animationLoopActive) {
      this.renderFrame();
    }
    return this;
  };

  dispose = (): void => {
    if (this.disposed) {
      return;
    }

    this.pointer?.dispose();
    this.pointer = undefined;
    this.onInteraction = undefined;
    this.disposed = true;
    this.motionQuery?.removeEventListener('change', this.onMotionChange);
    this.motionQuery = undefined;
    this.resizeChannel?.cleanup();
    this.resizeChannel = undefined;
    this.controls.removeEventListener('change', this.render);
    this.controls.dispose();
    this.renderer.setAnimationLoop(null);
    this.animationLoopActive = false;
    this.clearWater();
    this.scene.remove(this.sky);
    this.sky.geometry.dispose();
    this.sky.material.dispose();
    this.renderer.dispose();
    this.canvas.remove();
    this.options = undefined;
  };

  private configureScene(): void {
    const options = this.options;
    if (!options) {
      return;
    }

    if (options.backgroundColor === null) {
      this.scene.background = null;
      this.renderer.setClearColor(0x000000, 0);
    } else {
      const color = new THREE.Color(options.backgroundColor);
      this.scene.background = color;
      this.renderer.setClearColor(color, 1);
    }

    this.scene.fog = options.fog.show ? new THREE.Fog(options.fog.color, options.fog.near, options.fog.far) : null;
    const skyUniforms = this.sky.material.uniforms;
    skyUniforms.turbidity.value = 8;
    skyUniforms.rayleigh.value = 2;
    skyUniforms.mieCoefficient.value = 0.005;
    skyUniforms.mieDirectionalG.value = 0.8;
    skyUniforms.cloudCoverage.value = 0;
    skyUniforms.sunPosition.value.set(...options.water.sunDirection);
    this.sky.visible = options.sky.show;
    this.renderer.toneMappingExposure = options.renderer.toneMappingExposure;
  }

  private configureCamera(): void {
    const options = this.options;
    if (!options) {
      return;
    }

    this.camera.fov = options.camera.fov;
    this.camera.near = options.camera.near;
    this.camera.far = options.camera.far;
    this.camera.position.set(...options.camera.position);
    this.camera.lookAt(...options.camera.target);
    this.camera.updateProjectionMatrix();
    this.controls.target.set(...options.camera.target);
    this.controls.update();
  }

  private configureControls(): void {
    const options = this.options;
    if (!options) {
      return;
    }

    this.canvas.style.touchAction = options.controls.touchAction;
    this.controls.enabled = options.controls.enabled;
    this.controls.enableDamping = options.controls.damping;
    this.controls.dampingFactor = options.controls.dampingFactor;
    this.controls.autoRotate = options.controls.autoRotate && this.animationEnabled();
    this.controls.autoRotateSpeed = options.controls.autoRotateSpeed;
    this.controls.enablePan = options.controls.enablePan;
    this.controls.enableRotate = options.controls.enableRotate;
    this.controls.enableZoom = options.controls.enableZoom;
    this.controls.rotateSpeed = options.controls.rotateSpeed;
    this.controls.zoomSpeed = options.controls.zoomSpeed;
    this.controls.panSpeed = options.controls.panSpeed;
    this.controls.minDistance = options.controls.minDistance;
    this.controls.maxDistance = options.controls.maxDistance;
    this.controls.minPolarAngle = options.controls.minPolarAngle;
    this.controls.maxPolarAngle = options.controls.maxPolarAngle;
    this.controls.update();
  }

  private syncAnimationLoop(): void {
    if (!this.options || !this.renderer) {
      return;
    }

    const { controls, water } = this.options;
    const shouldAnimate =
      this.animationEnabled() &&
      (water.flowSpeed > 0 ||
        (water.waveHeight > 0 && water.waveSpeed > 0) ||
        (controls.enabled && (controls.damping || controls.autoRotate)) ||
        Boolean(this.water?.hasActiveRipples()));

    if (shouldAnimate === this.animationLoopActive) {
      return;
    }

    this.animationLoopActive = shouldAnimate;
    this.renderer.setAnimationLoop(shouldAnimate ? this.renderFrame : null);
  }

  private renderFrame = (timestamp = performance.now()): void => {
    if (this.disposed || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    if (this.controls.enabled && (this.controls.enableDamping || this.controls.autoRotate)) {
      this.controls.update();
    }
    this.pointer?.update(timestamp);
    this.renderer.render(this.scene, this.camera);
    this.syncAnimationLoop();
  };

  private clearWater(): void {
    if (!this.water) {
      return;
    }

    this.scene.remove(this.water);
    this.water.dispose();
    this.water = undefined;
  }
}
