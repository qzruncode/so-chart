import { applyChartLayoutWithoutScale, throttleResize } from '@so-chart/utils';
import type { Layout } from '@so-chart/types/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Candle } from './candle';
import { CandleFlameMesh } from './candle-flame';
import { normalizeOptions } from './normal';
import type { FireChartInstance, FireOptions, NormalizedFireOptions } from './types';

function sameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function hasOwnOption<T extends object>(value: T | undefined, key: PropertyKey) {
  return value !== undefined && Object.prototype.hasOwnProperty.call(value, key);
}

function mergeOptions(
  base: NormalizedFireOptions,
  patch: Partial<FireOptions>,
  defaults: { shadowMapSize: boolean; groundVisibility: boolean; pixelRatio: boolean }
): FireOptions {
  const shadow: NonNullable<FireOptions['shadow']> = { ...base.shadow, ...patch.shadow };
  if (patch.quality !== undefined && patch.shadow?.mapSize === undefined && defaults.shadowMapSize) {
    shadow.mapSize = undefined;
  }
  const ground: NonNullable<FireOptions['ground']> = { ...base.ground, ...patch.ground };
  if (patch.backgroundColor !== undefined && patch.ground?.show === undefined && defaults.groundVisibility) {
    ground.show = undefined;
  }
  const renderer: NonNullable<FireOptions['renderer']> = { ...base.renderer, ...patch.renderer };
  if (patch.quality !== undefined && patch.renderer?.pixelRatio === undefined && defaults.pixelRatio) {
    renderer.pixelRatio = undefined;
  }
  return {
    ...base,
    ...patch,
    fire: { ...base.fire, ...patch.fire },
    candle: {
      ...base.candle,
      ...patch.candle,
      light: { ...base.candle.light, ...patch.candle?.light },
    },
    environment: { ...base.environment, ...patch.environment },
    lighting: {
      hemisphere: { ...base.lighting.hemisphere, ...patch.lighting?.hemisphere },
      fill: { ...base.lighting.fill, ...patch.lighting?.fill },
    },
    shadow,
    ground,
    bloom: { ...base.bloom, ...patch.bloom },
    camera: { ...base.camera, ...patch.camera },
    controls: { ...base.controls, ...patch.controls },
    renderer,
  };
}

function sameCandleModel(left: NormalizedFireOptions['candle'], right: NormalizedFireOptions['candle']) {
  return sameValue(
    [left.show, left.bodyColor, left.bodyRadius, left.bodyHeight, left.wickColor, left.wickRadius, left.wickHeight],
    [right.show, right.bodyColor, right.bodyRadius, right.bodyHeight, right.wickColor, right.wickRadius, right.wickHeight]
  );
}

function sameFireShape(left: NormalizedFireOptions['fire'], right: NormalizedFireOptions['fire']) {
  return sameValue([left.width, left.height, left.depth], [right.width, right.height, right.depth]);
}

export class FireChart implements FireChartInstance {
  readonly chartType = 'fire' as const;
  container!: HTMLElement;
  canvas!: HTMLCanvasElement;
  layout!: Required<Layout & { width: number }>;

  private renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private composer?: EffectComposer;
  private candleFlame?: CandleFlameMesh;
  private candleGroup?: Candle;
  private candleLight?: THREE.PointLight;
  private candleLightIntensity = 0;
  private readonly candleLightHome = new THREE.Vector3();
  private readonly airflowNoise = new ImprovedNoise();
  private readonly airflow = new THREE.Vector2();
  private shadowRefreshElapsed = 0;
  private environmentScene?: RoomEnvironment;
  private environmentTarget?: THREE.WebGLRenderTarget;
  private pmremGenerator?: THREE.PMREMGenerator;
  private simulationTime = 0;
  private options?: NormalizedFireOptions;
  private resizeChannel?: ReturnType<typeof throttleResize>;
  private animationLoopActive = false;
  private disposed = false;
  private usesQualityShadowMapSize = true;
  private usesQualityPixelRatio = true;
  private usesBackgroundGroundVisibility = true;
  private timer = new THREE.Timer();

  init = (container: HTMLElement, layout?: Layout) => {
    this.container = container;
    this.layout = applyChartLayoutWithoutScale({ layout });
    this.disposed = false;

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    if (container.getBoundingClientRect().height === 0) {
      container.style.height = `${this.layout.height}px`;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.dataset.soChartFire = 'true';
    this.canvas.setAttribute('aria-label', '燃烧中的蜡烛，可拖拽旋转与缩放');
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.touchAction = 'none';
    container.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    this.timer.connect(document);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.addEventListener('change', this.render);
    this.resizeChannel = throttleResize(this, 200);
    this.resize();
  };

  setOption = (options: FireOptions) => {
    if (this.disposed) return;

    this.usesQualityShadowMapSize = options.shadow?.mapSize === undefined;
    this.usesQualityPixelRatio = options.renderer?.pixelRatio === undefined;
    this.usesBackgroundGroundVisibility = options.ground?.show === undefined;
    this.options = normalizeOptions(options);
    this.renderer.shadowMap.enabled = this.options.shadow.enabled;
    this.configureScene();
    this.clearEnvironment();
    this.configureEnvironment();
    this.configureCamera();
    this.configureControls();
    this.rebuildFire();
    this.rebuildCandle();
    this.configurePostprocessing();
    this.resize();
    this.startAnimationLoop();
    this.renderFrame();
  };

  updateOptions = (patch: Partial<FireOptions>) => {
    if (this.disposed || !this.options) return;

    const previous = this.options;
    if (hasOwnOption(patch.shadow, 'mapSize')) this.usesQualityShadowMapSize = patch.shadow?.mapSize === undefined;
    if (hasOwnOption(patch.renderer, 'pixelRatio')) this.usesQualityPixelRatio = patch.renderer?.pixelRatio === undefined;
    if (hasOwnOption(patch.ground, 'show')) this.usesBackgroundGroundVisibility = patch.ground?.show === undefined;
    this.options = normalizeOptions(
      mergeOptions(previous, patch, {
        shadowMapSize: this.usesQualityShadowMapSize,
        groundVisibility: this.usesBackgroundGroundVisibility,
        pixelRatio: this.usesQualityPixelRatio,
      })
    );
    const next = this.options;
    const sceneChanged = previous.backgroundColor !== next.backgroundColor;
    const environmentChanged = !sameValue(previous.environment, next.environment);
    const lightingChanged = !sameValue(previous.lighting, next.lighting);
    const shadowChanged = !sameValue(previous.shadow, next.shadow);
    const groundChanged = !sameValue(previous.ground, next.ground);
    const candleModelChanged = !sameCandleModel(previous.candle, next.candle);
    const candleLightStructureChanged =
      previous.candle.light.show !== next.candle.light.show || previous.candle.light.castShadow !== next.candle.light.castShadow;
    const fireShapeChanged = !sameFireShape(previous.fire, next.fire);
    const cameraChanged = !sameValue(previous.camera, next.camera);
    const controlsChanged = !sameValue(previous.controls, next.controls);
    const bloomChanged = !sameValue(previous.bloom, next.bloom);
    const pixelRatioChanged = previous.renderer.pixelRatio !== next.renderer.pixelRatio;
    const positionChanged = !sameValue(previous.candle.position, next.candle.position);
    const candleNeedsRebuild =
      candleModelChanged ||
      candleLightStructureChanged ||
      lightingChanged ||
      shadowChanged ||
      groundChanged ||
      sceneChanged ||
      previous.fire.height !== next.fire.height;
    const flameNeedsRebuild =
      fireShapeChanged ||
      previous.candle.show !== next.candle.show ||
      previous.candle.bodyHeight !== next.candle.bodyHeight ||
      previous.candle.bodyRadius !== next.candle.bodyRadius ||
      previous.candle.wickHeight !== next.candle.wickHeight;

    this.renderer.shadowMap.enabled = next.shadow.enabled;
    if (sceneChanged) this.configureScene();
    if (environmentChanged) {
      this.clearEnvironment();
      this.configureEnvironment();
    }
    if (candleNeedsRebuild) this.rebuildCandle();
    else if (positionChanged) this.candleGroup?.moveTo(next.candle.position);

    if (flameNeedsRebuild) this.rebuildFire();
    else if (previous.fire.color !== next.fire.color && this.candleFlame) {
      this.candleFlame.material.uniforms.tint.value.set(next.fire.color);
    }
    if (positionChanged && !flameNeedsRebuild) this.positionFire();

    if (!candleNeedsRebuild && this.candleLight) {
      this.candleLightIntensity = next.candle.light.intensity;
      this.candleLight.color.set(next.candle.light.color);
      this.candleLight.distance = next.candle.light.distance;
      this.candleLight.decay = next.candle.light.decay;
      this.candleLight.shadow.camera.far = next.candle.light.distance;
      this.candleLight.shadow.camera.updateProjectionMatrix();
    }
    if (cameraChanged) this.configureCamera();
    if (controlsChanged) this.configureControls();
    if (bloomChanged) this.configurePostprocessing();
    if (pixelRatioChanged) this.resize();
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
    this.composer?.setPixelRatio(pixelRatio);
    this.composer?.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  };

  render = () => {
    if (this.disposed) return;
    if (!this.animationLoopActive) this.renderFrame();
  };

  dispose = () => {
    if (this.disposed) return;

    this.disposed = true;
    this.resizeChannel?.cleanup();
    this.resizeChannel = undefined;
    this.controls.removeEventListener('change', this.render);
    this.controls.dispose();
    this.renderer.setAnimationLoop(null);
    this.animationLoopActive = false;
    this.timer.dispose();
    this.clearCandle();
    this.clearFire();
    this.clearPostprocessing();
    this.clearEnvironment();
    this.renderer.dispose();
    this.canvas.remove();
    this.options = undefined;
  };

  private configureScene() {
    if (!this.options) return;
    const { backgroundColor } = this.options;
    this.scene.background = backgroundColor === null ? null : new THREE.Color(backgroundColor);
    this.scene.fog = backgroundColor === null ? null : new THREE.Fog(backgroundColor, 5, 12);
  }

  private configureCamera() {
    const options = this.options;
    if (!options) return;

    this.camera.fov = options.camera.fov;
    this.camera.near = options.camera.near;
    this.camera.far = options.camera.far;
    this.camera.position.set(...options.camera.position);
    this.camera.lookAt(...options.camera.target);
    this.camera.updateProjectionMatrix();
    this.controls.target.set(...options.camera.target);
    this.controls.update();
  }

  private configureControls() {
    const options = this.options;
    if (!options) return;

    this.controls.enabled = options.controls.enabled;
    this.controls.enableDamping = options.controls.damping;
    this.controls.autoRotate = options.controls.autoRotate;
    this.controls.autoRotateSpeed = options.controls.autoRotateSpeed;
    this.controls.enableRotate = options.controls.enableRotate;
    this.controls.enableZoom = options.controls.enableZoom;
    this.controls.enablePan = options.controls.enablePan;
    this.controls.minDistance = options.controls.minDistance;
    this.controls.maxDistance = options.controls.maxDistance;
    this.controls.rotateSpeed = options.controls.rotateSpeed;
    this.controls.zoomSpeed = options.controls.zoomSpeed;
    this.controls.panSpeed = options.controls.panSpeed;
  }

  private rebuildFire() {
    this.clearFire();
    const fireOptions = this.options?.fire;
    if (!fireOptions) return;

    this.candleFlame = new CandleFlameMesh({
      width: fireOptions.width,
      height: fireOptions.height,
      depth: fireOptions.depth,
      tint: new THREE.Color(fireOptions.color),
    });
    this.positionFire();
    this.scene.add(this.candleFlame);
  }

  private positionFire() {
    if (!this.candleFlame || !this.options) return;
    const { candle } = this.options;
    this.candleFlame.position.set(0, candle.show ? candle.bodyHeight - candle.bodyRadius * 0.13 + candle.wickHeight * 0.3 : 0, 0);
    this.candleFlame.position.add(new THREE.Vector3(...candle.position));
  }

  private rebuildCandle() {
    this.clearCandle();
    if (!this.options?.candle.show) return;
    this.candleGroup = new Candle(this.options);
    this.candleLight = this.candleGroup.light;
    this.candleLightIntensity = this.options.candle.light.intensity;
    if (this.candleLight) this.candleLightHome.copy(this.candleLight.position);
    this.shadowRefreshElapsed = 0;
    this.scene.add(this.candleGroup);
  }

  private clearPostprocessing() {
    this.composer?.passes.forEach(pass => pass.dispose());
    this.composer?.dispose();
    this.composer = undefined;
  }

  private configureEnvironment() {
    const environment = this.options?.environment;
    if (!environment?.show) return;

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.environmentScene = new RoomEnvironment();
    this.environmentTarget = this.pmremGenerator.fromScene(this.environmentScene);
    this.scene.environment = this.environmentTarget.texture;
    this.scene.environmentIntensity = environment.intensity;
  }

  private clearEnvironment() {
    if (!this.scene) return;

    this.scene.environment = null;
    this.scene.environmentIntensity = 1;
    this.environmentTarget?.dispose();
    this.environmentTarget = undefined;
    this.pmremGenerator?.dispose();
    this.pmremGenerator = undefined;
    this.environmentScene?.dispose();
    this.environmentScene = undefined;
  }

  private configurePostprocessing() {
    this.clearPostprocessing();
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloom = this.options?.bloom;
    if (bloom?.show) {
      this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), bloom.strength, bloom.radius, bloom.threshold));
    }
    this.composer.addPass(new OutputPass());
  }

  private clearFire() {
    if (this.candleFlame) {
      this.scene.remove(this.candleFlame);
      this.candleFlame.dispose();
      this.candleFlame = undefined;
    }
  }

  private clearCandle() {
    if (!this.candleGroup) return;
    this.scene.remove(this.candleGroup);
    this.candleGroup.dispose();
    this.candleGroup = undefined;
    this.candleLight = undefined;
    this.candleLightIntensity = 0;
    this.candleLightHome.set(0, 0, 0);
    this.shadowRefreshElapsed = 0;
  }

  private startAnimationLoop() {
    if (this.animationLoopActive) return;
    this.renderer.setAnimationLoop(this.renderFrame);
    this.animationLoopActive = true;
  }

  private renderFrame = (timestamp?: number) => {
    if (this.disposed) return;

    this.timer.update(timestamp);
    const options = this.options;
    const delta = Math.min(this.timer.getDelta(), 0.1);
    if (this.animationLoopActive && (options?.controls.damping || options?.controls.autoRotate)) {
      this.controls.update();
    }
    this.simulationTime += delta * (options?.fire.speed ?? 1);
    const airflowAmplitude = options?.fire.airflowAmplitude ?? 0;
    const airflowTime = this.simulationTime * 0.72;
    this.airflow
      .set(
        this.airflowNoise.noise(airflowTime * 0.62, 1.7, 8.3) * 0.72 + this.airflowNoise.noise(airflowTime * 1.85, 8.6, 2.1) * 0.28,
        this.airflowNoise.noise(4.1, airflowTime * 0.79, 2.6) * 0.72 + this.airflowNoise.noise(1.3, airflowTime * 1.22, 7.4) * 0.28
      )
      .multiplyScalar(airflowAmplitude * 1.8);
    this.candleFlame?.update(this.simulationTime, this.airflow);
    if (this.candleLight && options) {
      const elapsed = this.simulationTime;
      const flicker = 1 + Math.sin(elapsed * 2.3) * 0.035 + Math.sin(elapsed * 4.7) * 0.025;
      this.candleLight.intensity = this.candleLightIntensity * flicker;
      this.candleLight.position.x = this.candleLightHome.x + this.airflow.x * options.fire.width * 0.6;
      this.candleLight.position.z = this.candleLightHome.z + this.airflow.y * options.fire.depth * 0.42;
    }
    const shadowRefreshRate = options?.shadow.refreshRate ?? 0;
    if (
      this.candleLight?.castShadow &&
      !this.candleLight.shadow.autoUpdate &&
      airflowAmplitude > 0 &&
      (options?.fire.speed ?? 0) > 0 &&
      shadowRefreshRate > 0
    ) {
      this.shadowRefreshElapsed += delta;
      if (this.shadowRefreshElapsed >= 1 / shadowRefreshRate) {
        this.candleLight.shadow.needsUpdate = true;
        this.shadowRefreshElapsed %= 1 / shadowRefreshRate;
      }
    } else {
      this.shadowRefreshElapsed = 0;
    }
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };
}
