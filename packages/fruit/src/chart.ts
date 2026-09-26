import { applyChartLayoutWithoutScale, createFrameCoalescer, throttleResize } from '@so-chart/utils';
import type { FrameCoalescer } from '@so-chart/utils';
import type { Layout } from '@so-chart/types/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { disposeObject3D } from './dispose';
import { normalizeOptions } from './normal';
import { createFruitScene } from './scene';
import type {
  FruitChartInstance,
  FruitEventData,
  FruitEventName,
  FruitOptions,
  FruitType,
  NormalizedFruitOptions,
} from './types';

const DEFAULT_PIXEL_RATIO = 2;
const CAMERA_FIT_MARGIN = 1.12;

export class FruitChart implements FruitChartInstance {
  readonly chartType = 'fruit' as const;
  container!: HTMLElement;
  canvas!: HTMLCanvasElement;
  layout!: Required<Layout & { width: number }>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private options?: NormalizedFruitOptions;
  private environmentScene?: RoomEnvironment;
  private environmentTarget?: THREE.WebGLRenderTarget;
  private pmremGenerator?: THREE.PMREMGenerator;
  private resizeChannel?: ReturnType<typeof throttleResize>;
  private moveCoalescer?: FrameCoalescer<PointerEvent>;
  private fruitObjects: THREE.Object3D[] = [];
  private hovered?: FruitEventData;
  private controlsInteracting = false;
  private pointerGesture?: { pointerId: number; x: number; y: number; moved: boolean };
  private suppressNextClick = false;
  private animationLoopActive = false;
  private renderingFrame = false;
  private frameRequestId?: number;
  private sceneBuildId = 0;
  private disposed = false;
  private onError?: FruitOptions['onError'];
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly listeners: Record<FruitEventName, Set<(data: FruitEventData) => void>> = {
    mouseenter: new Set(),
    mousemove: new Set(),
    mouseleave: new Set(),
    click: new Set(),
  };

  init = (container: HTMLElement, layout?: Layout) => {
    this.container = container;
    this.layout = applyChartLayoutWithoutScale({ layout });
    this.disposed = false;

    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    if (container.getBoundingClientRect().height === 0) container.style.height = `${this.layout.height}px`;

    this.canvas = document.createElement('canvas');
    this.canvas.dataset.soChartFruit = 'true';
    this.canvas.setAttribute('aria-label', '3D fruit chart');
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
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.addEventListener('change', this.render);
    this.controls.addEventListener('start', this.handleControlsStart);
    this.controls.addEventListener('end', this.handleControlsEnd);
    this.bindPointerEvents();
    this.resizeChannel = throttleResize(this, 200);
    this.resize();
  };

  setOption = (options: FruitOptions) => {
    if (this.disposed || !this.renderer) return;

    this.clearHover();
    this.onError = options.onError;
    this.options = normalizeOptions(options);
    this.configureScene();
    this.configureCamera();
    this.configureControls();
    this.clearEnvironment();
    this.configureEnvironment();
    this.rebuildScene();
    this.resize();
    this.render();
  };

  resize = () => {
    if (this.disposed || !this.renderer || !this.camera) return;

    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height || this.layout.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.options?.renderer.pixelRatio ?? DEFAULT_PIXEL_RATIO);
    this.layout.width = width;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.fitCameraToFruits();
    this.render();
  };

  render = () => {
    if (this.disposed || !this.renderer || !this.scene || !this.camera) return;
    this.syncAnimationLoop();
    if (this.animationLoopActive || this.renderingFrame) return;
    this.renderer.render(this.scene, this.camera);
    if (this.options?.controls.enabled && this.controls.enableDamping) this.scheduleRender();
  };

  dispose = () => {
    if (this.disposed) return;
    this.disposed = true;
    this.sceneBuildId += 1;
    if (!this.renderer) return;

    this.resizeChannel?.cleanup();
    this.resizeChannel = undefined;
    this.unbindPointerEvents();
    if (this.frameRequestId !== undefined) {
      cancelAnimationFrame(this.frameRequestId);
      this.frameRequestId = undefined;
    }
    this.controls.removeEventListener('change', this.render);
    this.controls.removeEventListener('start', this.handleControlsStart);
    this.controls.removeEventListener('end', this.handleControlsEnd);
    this.controls.dispose();
    this.renderer.setAnimationLoop(null);
    this.animationLoopActive = false;
    this.clearEnvironment();
    this.clearScene();
    this.hovered = undefined;
    Object.values(this.listeners).forEach(listenerSet => listenerSet.clear());
    this.onError = undefined;
    this.renderer.dispose();
    this.canvas.remove();
    this.options = undefined;
  };

  on = (eventName: FruitEventName, listener: (data: FruitEventData) => void) => {
    if (this.disposed) return () => {};
    const listenerSet = this.listeners[eventName];
    listenerSet.add(listener);
    return () => listenerSet.delete(listener);
  };

  private configureScene() {
    const options = this.options;
    if (!options) return;

    if (options.backgroundColor === null) {
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
    this.controls.enablePan = false;
    this.controls.minDistance = options.controls.minDistance;
    this.controls.maxDistance = options.controls.maxDistance;
    this.controls.minPolarAngle = options.controls.minPolarAngle;
    this.controls.maxPolarAngle = options.controls.maxPolarAngle;
    this.controls.rotateSpeed = options.controls.rotateSpeed;
    this.controls.zoomSpeed = options.controls.zoomSpeed;
    this.controls.update();
  }

  private rebuildScene() {
    const options = this.options;
    if (!options) return;

    const buildId = ++this.sceneBuildId;
    this.clearScene();

    if (options.lighting.show) {
      const { lighting } = options;
      const fillLight = new THREE.HemisphereLight(lighting.color, '#4c4034', lighting.fillIntensity);
      fillLight.name = 'fruit-fill-light';

      const keyLight = new THREE.DirectionalLight(lighting.color, lighting.intensity);
      keyLight.name = 'fruit-key-light';
      keyLight.position.set(2.6, 4.2, 3.1);
      keyLight.castShadow = options.renderer.shadows;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0002;
      keyLight.shadow.normalBias = 0.025;
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.target.position.set(0, 0.25, 0);
      this.scene.add(fillLight, keyLight, keyLight.target);
    }

    void createFruitScene(options)
      .then(fruits => {
        if (this.disposed || buildId !== this.sceneBuildId) {
          disposeObject3D(fruits);
          return;
        }
        this.fruitObjects = fruits.children.filter(child => typeof child.userData.fruitId === 'string');
        this.scene.add(fruits);
        this.fitCameraToFruits();
        this.render();
      })
      .catch(error => {
        if (!this.disposed && buildId === this.sceneBuildId) {
          this.reportError(error);
        }
      });
  }

  private configureEnvironment() {
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.environmentScene = new RoomEnvironment();
    this.environmentTarget = this.pmremGenerator.fromScene(this.environmentScene);
    this.scene.environment = this.environmentTarget.texture;
  }

  private fitCameraToFruits() {
    if (!this.options?.camera.autoFit || this.fruitObjects.length === 0) return;

    this.scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3();
    this.fruitObjects.forEach(object => bounds.expandByObject(object));
    if (bounds.isEmpty()) return;

    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    if (!Number.isFinite(sphere.radius) || sphere.radius <= 0) return;

    const direction = this.camera.position.clone().sub(this.controls.target);
    if (direction.lengthSq() === 0) direction.set(0, 1, 1);
    direction.normalize();

    const verticalHalfFov = THREE.MathUtils.degToRad(this.camera.fov) / 2;
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * this.camera.aspect);
    const limitingHalfFov = Math.max(0.001, Math.min(verticalHalfFov, horizontalHalfFov));
    const requestedDistance = (sphere.radius / Math.sin(limitingHalfFov)) * CAMERA_FIT_MARGIN;
    const distance = THREE.MathUtils.clamp(
      requestedDistance,
      this.options.controls.minDistance,
      this.options.controls.maxDistance,
    );

    this.controls.target.copy(sphere.center);
    this.camera.position.copy(sphere.center).addScaledVector(direction, distance);
    this.camera.lookAt(sphere.center);
    this.controls.update();
  }

  private clearScene() {
    if (!this.scene) return;

    this.fruitObjects = [];
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

  private syncAnimationLoop() {
    const options = this.options;
    const shouldAnimate = Boolean(options?.controls.enabled && options.controls.autoRotate && options.controls.autoRotateSpeed > 0);
    if (shouldAnimate === this.animationLoopActive) return;

    this.animationLoopActive = shouldAnimate;
    this.renderer.setAnimationLoop(shouldAnimate ? this.renderFrame : null);
    if (shouldAnimate && this.frameRequestId !== undefined) {
      cancelAnimationFrame(this.frameRequestId);
      this.frameRequestId = undefined;
    }
  }

  private scheduleRender() {
    if (this.disposed || this.animationLoopActive || this.renderingFrame || this.frameRequestId !== undefined) return;
    this.frameRequestId = requestAnimationFrame(() => {
      this.frameRequestId = undefined;
      this.renderFrame();
    });
  }

  private renderFrame = () => {
    if (this.disposed) return;
    this.renderingFrame = true;
    let controlsChanged = false;
    try {
      const options = this.options;
      const shouldUpdateControls = Boolean(options?.controls.enabled && (this.animationLoopActive ? options.controls.autoRotate : this.controls.enableDamping));
      if (shouldUpdateControls) controlsChanged = this.controls.update();
      this.renderer.render(this.scene, this.camera);
    } finally {
      this.renderingFrame = false;
    }
    if (!this.animationLoopActive && controlsChanged) this.scheduleRender();
  };

  private bindPointerEvents() {
    this.moveCoalescer = createFrameCoalescer<PointerEvent>(event => this.handlePointerMove(event));
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointermove', this.handlePointerMoveScheduled);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
    this.canvas.addEventListener('click', this.handlePointerClick);
  }

  private unbindPointerEvents() {
    this.moveCoalescer?.cancelPending();
    this.moveCoalescer = undefined;
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMoveScheduled);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
    this.canvas.removeEventListener('click', this.handlePointerClick);
  }

  private readonly handleControlsStart = () => {
    this.controlsInteracting = true;
    this.clearHover();
  };

  private readonly handleControlsEnd = () => {
    this.controlsInteracting = false;
  };

  private readonly handlePointerDown = (event: PointerEvent) => {
    this.suppressNextClick = false;
    this.pointerGesture = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  };

  private readonly handlePointerMoveScheduled = (event: PointerEvent) => {
    const gesture = this.pointerGesture;
    if (gesture?.pointerId === event.pointerId) {
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (dx * dx + dy * dy > 16) gesture.moved = true;
    }
    if (this.controlsInteracting || event.buttons !== 0) {
      this.moveCoalescer?.cancelPending();
      return;
    }
    this.moveCoalescer?.schedule(event);
  };

  private readonly handlePointerUp = (event: PointerEvent) => {
    const gesture = this.pointerGesture;
    if (gesture?.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (dx * dx + dy * dy > 16) gesture.moved = true;
    this.suppressNextClick = gesture.moved;
    this.pointerGesture = undefined;
  };

  private readonly handlePointerCancel = (event: PointerEvent) => {
    if (this.pointerGesture?.pointerId === event.pointerId) this.pointerGesture = undefined;
    this.suppressNextClick = false;
    this.clearHover();
  };

  private readonly handlePointerLeave = () => {
    this.clearHover();
  };

  private readonly handlePointerClick = (event: MouseEvent) => {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }
    const fruit = this.pick(event.clientX, event.clientY);
    if (fruit) this.emit('click', fruit);
  };

  private readonly handlePointerMove = (event: PointerEvent) => {
    const fruit = this.pick(event.clientX, event.clientY);
    if (!fruit) {
      this.clearHover();
      return;
    }

    if (!this.hovered || this.getFruitKey(this.hovered) !== this.getFruitKey(fruit)) {
      if (this.hovered) this.emit('mouseleave', this.hovered);
      this.emit('mouseenter', fruit);
    }
    this.hovered = fruit;
    this.emit('mousemove', fruit);
  };

  private pick(clientX: number, clientY: number): FruitEventData | undefined {
    if (!this.options || this.fruitObjects.length === 0) return undefined;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return undefined;
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.camera.updateMatrixWorld();
    this.scene.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersection = this.raycaster.intersectObjects(this.fruitObjects, true).find(({ object }) => {
      let current: THREE.Object3D | null = object;
      while (current) {
        if (!current.visible) return false;
        if (typeof current.userData.fruitId === 'string') return true;
        current = current.parent;
      }
      return false;
    });
    if (!intersection) return undefined;

    let fruitObject: THREE.Object3D | null = intersection.object;
    while (fruitObject && typeof fruitObject.userData.fruitId !== 'string') fruitObject = fruitObject.parent;
    if (!fruitObject) return undefined;

    return {
      fruitId: fruitObject.userData.fruitId as string,
      fruitIndex: fruitObject.userData.fruitIndex as number,
      fruitType: fruitObject.userData.fruitType as FruitType,
      distance: intersection.distance,
      screen: { x: clientX - rect.left, y: clientY - rect.top },
    };
  }

  private clearHover() {
    this.moveCoalescer?.cancelPending();
    if (!this.hovered) return;
    const previous = this.hovered;
    this.hovered = undefined;
    this.emit('mouseleave', previous);
  }

  private getFruitKey(data: FruitEventData) {
    return `${data.fruitIndex}:${data.fruitId}`;
  }

  private emit(eventName: FruitEventName, data: FruitEventData) {
    this.listeners[eventName].forEach(listener => listener(data));
  }

  private reportError(error: unknown) {
    if (!this.onError) {
      console.error('Failed to load the bundled fruit models.', error);
      return;
    }
    try {
      this.onError(error);
    } catch (callbackError) {
      console.error('The fruit chart onError callback threw an error.', callbackError);
    }
  }
}
