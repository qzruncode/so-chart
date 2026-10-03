import { applyChartLayoutWithoutScale, throttleResize } from '@so-chart/utils';
import type { Layout } from '@so-chart/types/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { disposeObject3D } from './dispose.js';
import { normalizeOptions } from './normal.js';
import { createFishScene, releaseFishAnimations, updateFishScene } from './scene.js';
import type { FishChartInstance, FishOptions, NormalizedFishOptions } from './types.js';

const CAMERA_FIT_MARGIN = 1.16;

export class FishChart implements FishChartInstance {
  readonly chartType = 'fish' as const;
  container!: HTMLElement;
  canvas!: HTMLCanvasElement;
  layout!: Required<Layout & { width: number }>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private options?: NormalizedFishOptions;
  private fishGroup?: THREE.Group;
  private lightGroup?: THREE.Group;
  private environmentTarget?: THREE.WebGLRenderTarget;
  private animatedFish: Awaited<ReturnType<typeof createFishScene>>['animatedFish'] = [];
  private sceneBuildRevision = 0;
  private resizeChannel?: ReturnType<typeof throttleResize>;
  private frameRequestId?: number;
  private animationLoopActive = false;
  private renderingFrame = false;
  private disposed = false;
  private elapsedSeconds = 0;
  private lastTimestamp?: number;
  private motionQuery?: MediaQueryList;
  private onReady?: FishOptions['onReady'];
  private prefersReducedMotion = () => {
    const policy = this.options?.animation.reducedMotion;
    return policy === 'always' || (policy === 'auto' && Boolean(this.motionQuery?.matches));
  };
  private onMotionChange = () => {
    this.lastTimestamp = undefined;
    this.configureControls();
    this.render();
  };
  private onError?: FishOptions['onError'];

  init = (container: HTMLElement, layout?: Layout) => {
    if (this.renderer && !this.disposed) this.dispose();
    this.container = container;
    this.layout = applyChartLayoutWithoutScale({ layout });
    this.disposed = false;

    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    if (container.getBoundingClientRect().height === 0) container.style.height = `${this.layout.height}px`;

    this.canvas = document.createElement('canvas');
    this.canvas.dataset.soChartFish = 'true';
    this.canvas.setAttribute('aria-label', '3D freshwater fish');
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
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    try {
      this.environmentTarget = pmrem.fromScene(environment, 0.04, 0.1, 100, { size: 128 });
      this.scene.environment = this.environmentTarget.texture;
    } finally {
      environment.dispose();
      pmrem.dispose();
    }
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.addEventListener('change', this.render);
    this.motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.motionQuery?.addEventListener('change', this.onMotionChange);
    this.resizeChannel = throttleResize(this, 160);
    this.resize();
  };

  setOption = (options: FishOptions) => {
    if (this.disposed || !this.renderer) return;

    this.onError = options.onError;
    this.onReady = options.onReady;
    this.options = normalizeOptions(options);
    this.canvas.setAttribute('aria-label', this.options.ariaLabel);
    this.configureBackground();
    this.configureCamera();
    this.configureControls();
    this.configureLighting();
    this.rebuildFish();
    this.resize();
    this.render();
  };

  setAnimationEnabled = (enabled: boolean) => {
    if (this.disposed || !this.options) return;
    this.options.animation.enabled = enabled;
    this.lastTimestamp = undefined;
    this.render();
  };

  resize = () => {
    if (this.disposed || !this.renderer || !this.camera) return;

    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height || this.layout.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.options?.renderer.pixelRatio ?? 1.5);
    this.layout.width = width;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.fitCameraToFish();
    this.render();
  };

  render = () => {
    if (this.disposed || !this.renderer || !this.scene || !this.camera) return;
    this.syncAnimationLoop();
    if (this.animationLoopActive || this.renderingFrame) return;

    this.renderingFrame = true;
    let controlsChanged = false;
    try {
      if (this.options?.controls.enabled && this.controls.enableDamping) controlsChanged = this.controls.update();
      this.renderer.render(this.scene, this.camera);
    } finally {
      this.renderingFrame = false;
    }
    if (controlsChanged) this.scheduleRender();
  };

  dispose = () => {
    if (this.disposed) return;
    this.disposed = true;
    this.sceneBuildRevision += 1;
    if (!this.renderer) return;

    this.motionQuery?.removeEventListener('change', this.onMotionChange);
    this.motionQuery = undefined;
    this.resizeChannel?.cleanup();
    this.resizeChannel = undefined;
    if (this.frameRequestId !== undefined) {
      cancelAnimationFrame(this.frameRequestId);
      this.frameRequestId = undefined;
    }
    this.controls.removeEventListener('change', this.render);
    this.controls.dispose();
    this.renderer.setAnimationLoop(null);
    this.animationLoopActive = false;
    this.clearFish();
    if (this.lightGroup) {
      disposeObject3D(this.lightGroup);
      this.scene.remove(this.lightGroup);
      this.lightGroup = undefined;
    }
    this.scene.environment = null;
    this.environmentTarget?.dispose();
    this.environmentTarget = undefined;
    this.renderer.dispose();
    this.canvas.remove();
    this.options = undefined;
    this.onError = undefined;
    this.onReady = undefined;
  };

  private configureBackground() {
    const color = this.options?.backgroundColor;
    if (color === null) {
      this.scene.background = null;
      this.renderer.setClearColor(0x000000, 0);
      return;
    }

    const background = new THREE.Color(color ?? '#c6e8e9');
    this.scene.background = background;
    this.renderer.setClearColor(background, 1);
  }

  private configureCamera() {
    const camera = this.options?.camera;
    if (!camera) return;

    this.camera.fov = camera.fov;
    this.camera.near = camera.near;
    this.camera.far = camera.far;
    this.camera.position.set(...camera.position);
    this.camera.lookAt(...camera.target);
    this.camera.updateProjectionMatrix();
    this.controls.target.set(...camera.target);
    this.controls.update();
  }

  private configureControls() {
    const options = this.options?.controls;
    if (!options) return;

    this.controls.enabled = options.enabled;
    this.controls.enableDamping = options.damping;
    this.controls.autoRotate = options.autoRotate && !this.prefersReducedMotion();
    this.controls.autoRotateSpeed = options.autoRotateSpeed;
    this.controls.enableRotate = options.enableRotate;
    this.controls.enableZoom = options.enableZoom;
    this.controls.enablePan = options.enablePan;
    this.controls.panSpeed = options.panSpeed;
    this.controls.dampingFactor = options.dampingFactor;
    this.canvas.style.touchAction = options.touchAction;
    this.controls.minDistance = options.minDistance;
    this.controls.maxDistance = options.maxDistance;
    this.controls.minPolarAngle = options.minPolarAngle;
    this.controls.maxPolarAngle = options.maxPolarAngle;
    this.controls.rotateSpeed = options.rotateSpeed;
    this.controls.zoomSpeed = options.zoomSpeed;
    this.controls.update();
  }

  private configureLighting() {
    if (this.lightGroup) {
      disposeObject3D(this.lightGroup);
      this.scene.remove(this.lightGroup);
    }

    const { lighting } = this.options!;
    const group = new THREE.Group();
    group.name = 'fish-lighting';
    const fill = new THREE.HemisphereLight(lighting.color, lighting.fillColor, lighting.fillIntensity);
    fill.name = 'fish-fill-light';
    const key = new THREE.DirectionalLight(lighting.color, lighting.intensity);
    key.name = 'fish-key-light';
    key.position.set(...lighting.position);
    group.add(fill, key);
    this.scene.add(group);
    this.lightGroup = group;
    this.scene.environmentIntensity = lighting.fillIntensity * 0.6;
    this.renderer.toneMappingExposure = this.options!.renderer.toneMappingExposure;
  }

  private rebuildFish() {
    const revision = ++this.sceneBuildRevision;
    const options = this.options;
    if (!options) return;

    void createFishScene(options)
      .then(fishScene => {
        if (this.disposed || revision !== this.sceneBuildRevision) {
          releaseFishAnimations(fishScene.animatedFish);
          disposeObject3D(fishScene.group);
          return;
        }

        this.clearFish();
        this.fishGroup = fishScene.group;
        this.animatedFish = fishScene.animatedFish;
        this.scene.add(fishScene.group);
        try {
          this.onReady?.({ count: fishScene.animatedFish.length, ids: fishScene.animatedFish.map(a => a.root.userData.fishId) });
        } catch (error) {
          this.reportError(error);
        }
        this.fitCameraToFish();
        this.render();
      })
      .catch(error => {
        if (this.disposed || revision !== this.sceneBuildRevision) return;
        this.reportError(error);
      });
  }

  private reportError(error: unknown) {
    const onError = this.onError;
    if (!onError) {
      console.error('Failed to create fish chart scene.', error);
      return;
    }
    try {
      onError(error);
    } catch (callbackError) {
      console.error('The fish chart onError callback threw an error.', callbackError);
    }
  }

  private fitCameraToFish() {
    if (!this.options?.camera.autoFit || !this.fishGroup || this.fishGroup.children.length === 0) return;

    this.scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(this.fishGroup);
    if (bounds.isEmpty()) return;
    const center = bounds.getCenter(new THREE.Vector3());
    if (!Number.isFinite(center.length())) return;

    const direction = this.camera.position.clone().sub(this.controls.target);
    if (direction.lengthSq() === 0) direction.set(0, 1, 8.5);
    direction.normalize();
    const verticalHalfFov = THREE.MathUtils.degToRad(this.camera.fov) / 2;
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * this.camera.aspect);
    // Fit the box in camera space, as camera-controls' fitToBox does. A sphere
    // wastes most of a wide viewport when the fish are long and relatively flat.
    const inverseRotation = this.camera.quaternion.clone().invert();
    const point = new THREE.Vector3();
    let requestedDistance = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          point.set(x, y, z).sub(center).applyQuaternion(inverseRotation);
          requestedDistance = Math.max(
            requestedDistance,
            point.z + (Math.abs(point.x) * CAMERA_FIT_MARGIN) / Math.tan(horizontalHalfFov),
            point.z + (Math.abs(point.y) * CAMERA_FIT_MARGIN) / Math.tan(verticalHalfFov)
          );
        }
      }
    }
    const distance = THREE.MathUtils.clamp(requestedDistance, this.options.controls.minDistance, this.options.controls.maxDistance);
    this.controls.target.copy(center);
    this.camera.position.copy(center).addScaledVector(direction, distance);
    this.camera.lookAt(center);
    this.controls.update();
  }

  private clearFish() {
    if (this.fishGroup) {
      releaseFishAnimations(this.animatedFish);
      disposeObject3D(this.fishGroup);
      this.scene.remove(this.fishGroup);
      this.fishGroup = undefined;
    } else {
      releaseFishAnimations(this.animatedFish);
    }
    this.animatedFish = [];
  }

  private syncAnimationLoop() {
    const options = this.options;
    const fishShouldAnimate = Boolean(
      options?.animation.enabled &&
      options.animation.speed > 0 &&
      !this.prefersReducedMotion() &&
      this.animatedFish.some(fish => fish.speed > 0 && fish.amplitude > 0)
    );
    const controlsShouldAnimate = Boolean(
      !this.prefersReducedMotion() && options?.controls.enabled && options.controls.autoRotate && options.controls.autoRotateSpeed > 0
    );
    const shouldAnimate = fishShouldAnimate || controlsShouldAnimate;
    if (shouldAnimate === this.animationLoopActive) return;

    this.animationLoopActive = shouldAnimate;
    this.lastTimestamp = undefined;
    this.renderer.setAnimationLoop(shouldAnimate ? this.renderFrame : null);
    if (shouldAnimate && this.frameRequestId !== undefined) {
      cancelAnimationFrame(this.frameRequestId);
      this.frameRequestId = undefined;
    }
  }

  private scheduleRender() {
    if (this.disposed || this.animationLoopActive || this.frameRequestId !== undefined) return;
    this.frameRequestId = requestAnimationFrame(() => {
      this.frameRequestId = undefined;
      this.renderFrame();
    });
  }

  private renderFrame = (timestamp = performance.now()) => {
    if (this.disposed) return;
    this.renderingFrame = true;
    let controlsChanged = false;
    try {
      const options = this.options;
      if (options?.controls.enabled && (this.animationLoopActive ? options.controls.autoRotate : this.controls.enableDamping)) {
        controlsChanged = this.controls.update();
      }
      if (options?.animation.enabled && !this.prefersReducedMotion() && this.animatedFish.length > 0) {
        const delta = this.lastTimestamp === undefined ? 0 : Math.min((timestamp - this.lastTimestamp) / 1000, 0.05);
        this.elapsedSeconds += Math.max(delta, 0) * options.animation.speed;
        updateFishScene(this.animatedFish, this.elapsedSeconds, 1);
      }
      this.lastTimestamp = timestamp;
      this.renderer.render(this.scene, this.camera);
    } finally {
      this.renderingFrame = false;
    }
    if (!this.animationLoopActive && controlsChanged) this.scheduleRender();
  };
}
