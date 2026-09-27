import { applyChartLayoutWithoutScale, throttleResize } from '@so-chart/utils';
import type { Layout } from '@so-chart/types/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { disposeObject3D } from './dispose';
import { normalizeOptions } from './normal';
import { createTableScene } from './scene';
import type { NormalizedTable3DOptions, Table3DChartInstance, Table3DOptions } from './types';

const DEFAULT_PIXEL_RATIO = 2;

export class Table3DChart implements Table3DChartInstance {
  readonly chartType = 'table3d' as const;
  container!: HTMLElement;
  canvas!: HTMLCanvasElement;
  layout!: Required<Layout & { width: number }>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private options?: NormalizedTable3DOptions;
  private composer?: EffectComposer;
  private gtaoPass?: GTAOPass;
  private environmentScene?: RoomEnvironment;
  private environmentTarget?: THREE.WebGLRenderTarget;
  private pmremGenerator?: THREE.PMREMGenerator;
  private resizeChannel?: ReturnType<typeof throttleResize>;
  private animationLoopActive = false;
  private disposed = false;

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
    this.canvas.dataset.soChartTable3d = 'true';
    this.canvas.setAttribute('aria-label', '3D table chart');
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
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.addEventListener('change', this.render);
    this.resizeChannel = throttleResize(this, 200);
    this.resize();
  };

  setOption = (options: Table3DOptions) => {
    if (this.disposed || !this.renderer) return;

    this.options = normalizeOptions(options);
    this.configureScene();
    this.configureCamera();
    this.configureControls();
    this.clearPostprocessing();
    this.clearEnvironment();
    this.rebuildScene();
    this.configureEnvironment();
    this.configurePostprocessing();
    this.resize();
    this.render();
  };

  resize = () => {
    if (this.disposed || !this.renderer || !this.camera) return;

    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height || this.layout.height));
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      this.options?.renderer.pixelRatio ?? DEFAULT_PIXEL_RATIO
    );
    this.layout.width = width;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    if (this.composer) {
      this.composer.setPixelRatio(pixelRatio);
      this.composer.setSize(width, height);
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  };

  render = () => {
    if (this.disposed || !this.renderer || !this.scene || !this.camera) return;
    this.syncAnimationLoop();
    if (!this.animationLoopActive) {
      this.renderFrame();
    }
  };

  dispose = () => {
    if (this.disposed) return;
    this.disposed = true;
    if (!this.renderer) return;

    this.resizeChannel?.cleanup();
    this.resizeChannel = undefined;
    this.controls.removeEventListener('change', this.render);
    this.controls.dispose();
    this.renderer.setAnimationLoop(null);
    this.animationLoopActive = false;
    this.clearPostprocessing();
    this.clearEnvironment();
    this.clearScene();
    this.renderer.dispose();
    this.canvas.remove();
    this.options = undefined;
  };

  private configureScene() {
    const options = this.options;
    if (!options) return;

    const useEnvironmentBackground = options.environment.background && Boolean(options.environment.texture);
    this.scene.backgroundRotation.set(...options.environment.rotation);
    this.scene.environmentRotation.set(...options.environment.rotation);

    if (useEnvironmentBackground) {
      this.scene.background = options.environment.texture!;
      this.renderer.setClearColor(0x000000, 1);
    } else if (options.backgroundColor === null) {
      this.scene.background = null;
      this.renderer.setClearColor(0x000000, 0);
    } else {
      const color = new THREE.Color(options.backgroundColor);
      this.scene.background = color;
      this.renderer.setClearColor(color, 1);
    }
    this.renderer.toneMappingExposure = options.renderer.toneMappingExposure;
    this.renderer.shadowMap.enabled = options.renderer.shadows;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
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
    this.controls.minPolarAngle = options.controls.minPolarAngle;
    this.controls.maxPolarAngle = options.controls.maxPolarAngle;
    this.controls.rotateSpeed = options.controls.rotateSpeed;
    this.controls.zoomSpeed = options.controls.zoomSpeed;
    this.controls.panSpeed = options.controls.panSpeed;
    this.controls.update();
  }

  private rebuildScene() {
    const options = this.options;
    if (!options) return;

    this.clearScene();
    this.scene.add(createTableScene(options));

    if (!options.lighting.show) return;

    const { table, lighting } = options;
    const fillLight = new THREE.HemisphereLight(lighting.color, '#211a16', lighting.fillIntensity);
    fillLight.name = 'table3d-fill-light';
    this.scene.add(fillLight);

    const size = Math.max(table.width, table.depth, table.diameter, table.height);
    const keyLight = new THREE.DirectionalLight(lighting.color, lighting.intensity);
    keyLight.name = 'table3d-key-light';
    keyLight.position.set(size * 1.35, size * 2.4, size * 1.25);
    keyLight.castShadow = options.renderer.shadows;
    keyLight.shadow.mapSize.set(lighting.shadowMapSize, lighting.shadowMapSize);
    keyLight.shadow.bias = lighting.shadowBias;
    keyLight.shadow.normalBias = lighting.shadowNormalBias;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = size * 8;
    const shadowSpan = size * 2.2;
    keyLight.shadow.camera.left = -shadowSpan;
    keyLight.shadow.camera.right = shadowSpan;
    keyLight.shadow.camera.top = shadowSpan;
    keyLight.shadow.camera.bottom = -shadowSpan;
    keyLight.target.position.set(0, table.height * 0.45, 0);
    this.scene.add(keyLight, keyLight.target);
  }

  private configureEnvironment() {
    const options = this.options;
    if (!options?.environment.show) return;

    if (options.environment.texture) {
      this.scene.environment = options.environment.texture;
      this.scene.environmentIntensity = options.environment.intensity;
      return;
    }

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.environmentScene = new RoomEnvironment();
    this.environmentTarget = this.pmremGenerator.fromScene(this.environmentScene);
    this.scene.environment = this.environmentTarget.texture;
    this.scene.environmentIntensity = options.environment.intensity;
  }

  private configurePostprocessing() {
    const options = this.options;
    if (!options?.postprocessing.show) return;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    if (options.postprocessing.ambientOcclusion) {
      this.gtaoPass = new GTAOPass(this.scene, this.camera, 1, 1);
      this.gtaoPass.blendIntensity = options.postprocessing.ambientOcclusionIntensity;
      this.gtaoPass.updateGtaoMaterial({
        radius: options.postprocessing.ambientOcclusionRadius,
        distanceExponent: 1,
        thickness: 1,
        scale: 1.15,
      });
      this.composer.addPass(this.gtaoPass);
    }
    this.composer.addPass(new OutputPass());
  }

  private clearScene() {
    if (!this.scene) return;

    for (const child of [...this.scene.children]) {
      disposeObject3D(child);
      this.scene.remove(child);
    }
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

  private clearPostprocessing() {
    if (this.composer) {
      this.composer.passes.forEach(pass => pass.dispose());
      this.composer.dispose();
      this.composer = undefined;
    }
    this.gtaoPass = undefined;
  }

  private syncAnimationLoop() {
    const options = this.options;
    const shouldAnimate = Boolean(
      options?.controls.enabled && (options.controls.damping || options.controls.autoRotate)
    );
    if (shouldAnimate === this.animationLoopActive) return;

    this.animationLoopActive = shouldAnimate;
    this.renderer.setAnimationLoop(shouldAnimate ? this.renderFrame : null);
  }

  private renderFrame = () => {
    if (this.disposed) return;

    if (this.options?.controls.enabled && (this.controls.enableDamping || this.controls.autoRotate)) {
      this.controls.update();
    }
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };
}
