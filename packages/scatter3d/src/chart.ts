import type { FrameCoalescer } from '@so-chart/utils';
import { applyChartLayoutWithoutScale, createFrameCoalescer, getUid, throttleResize } from '@so-chart/utils';
import type { Layout } from '@so-chart/types/common';
import { drawTooltip } from '@so-chart/tooltip';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { disposeObject3D } from './dispose';
import { normalizeOptions } from './normal';
import { createAxesObject, createGridObjects, createPointTexture, getBlending } from './scene';
import type {
  NormalizedScatter3DOptions,
  Scatter3DChartInstance,
  Scatter3DEventName,
  Scatter3DExposedData,
  Scatter3DOptions,
  Scatter3DPoint,
} from './types';

type Scatter3DListener = (data: Scatter3DExposedData) => void;
type HighlightPoints = Record<'circle' | 'square', THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>;

const WORLD_SIZE = 8;
const DEFAULT_PIXEL_RATIO = 2;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function isTuplePoint(point: Scatter3DPoint): point is readonly [number, number, number] {
  return Array.isArray(point);
}

export class Scatter3DChart implements Scatter3DChartInstance {
  readonly chartType = 'scatter3d' as const;
  container!: HTMLElement;
  canvas!: HTMLCanvasElement;
  layout!: Required<Layout & { width: number }>;
  private tooltipSvg!: SVGSVGElement;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private options?: NormalizedScatter3DOptions;
  private pointsObjects: THREE.Points[] = [];
  private readonly pointsDatasetIndices = new Map<THREE.Points, number>();
  private highlightObjects?: HighlightPoints;
  private resizeChannel?: ReturnType<typeof throttleResize>;
  private moveCoalescer?: FrameCoalescer<PointerEvent>;
  private animationLoopActive = false;
  private controlsInteracting = false;
  private disposed = false;
  private hovered?: Scatter3DExposedData;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private visualMapColors: THREE.Color[] = [];
  private readonly visualMapColor = new THREE.Color();
  private readonly visualMapOutOfRangeColor = new THREE.Color();
  private readonly pointColor = new THREE.Color();
  private readonly highlightDatasetColor = new THREE.Color();
  private readonly highlightOverrideColor = new THREE.Color();
  private readonly listeners: Record<Scatter3DEventName, Set<Scatter3DListener>> = {
    mouseenter: new Set(),
    mousemove: new Set(),
    mouseleave: new Set(),
    click: new Set(),
  };

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
    this.canvas.dataset.soChartScatter3d = 'true';
    this.canvas.id = `so-chart_scatter3d_canvas${getUid()}`;
    this.canvas.setAttribute('aria-label', '3D scatter chart');
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.touchAction = 'none';
    container.appendChild(this.canvas);

    this.tooltipSvg = document.createElementNS(SVG_NAMESPACE, 'svg');
    this.tooltipSvg.classList.add('so-chart_scatter3d_tooltip');
    this.tooltipSvg.setAttribute('aria-hidden', 'true');
    this.tooltipSvg.style.display = 'block';
    this.tooltipSvg.style.position = 'absolute';
    this.tooltipSvg.style.inset = '0';
    this.tooltipSvg.style.width = '100%';
    this.tooltipSvg.style.height = '100%';
    this.tooltipSvg.style.overflow = 'visible';
    this.tooltipSvg.style.pointerEvents = 'none';
    this.tooltipSvg.style.zIndex = '2';
    container.appendChild(this.tooltipSvg);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.addEventListener('change', this.render);
    this.controls.addEventListener('start', this.handleControlsStart);
    this.controls.addEventListener('end', this.handleControlsEnd);
    this.bindPointerEvents();
    this.resizeChannel = throttleResize(this, 200);
    this.resize();
  };

  setOption = (options: Scatter3DOptions) => {
    if (this.disposed) return;

    this.hideTooltip();
    this.options = normalizeOptions(options);
    this.configureCamera();
    this.configureControls();
    this.configureScene();
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
    this.renderer.setSize(Math.floor(width * pixelRatio), Math.floor(height * pixelRatio), false);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.tooltipSvg.setAttribute('width', `${width}`);
    this.tooltipSvg.setAttribute('height', `${height}`);
    this.tooltipSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
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
    this.hideTooltip();
    this.disposed = true;
    this.resizeChannel?.cleanup();
    this.resizeChannel = undefined;
    this.moveCoalescer?.cleanup();
    this.moveCoalescer = undefined;
    this.unbindPointerEvents();
    this.controls.removeEventListener('change', this.render);
    this.controls.removeEventListener('start', this.handleControlsStart);
    this.controls.removeEventListener('end', this.handleControlsEnd);
    this.controls.dispose();
    this.renderer.setAnimationLoop(null);
    this.animationLoopActive = false;
    this.clearScene();
    this.renderer.dispose();
    this.canvas.remove();
    this.tooltipSvg.remove();
    Object.values(this.listeners).forEach(listenerSet => listenerSet.clear());
    this.hovered = undefined;
    this.options = undefined;
  };

  on = (eventName: Scatter3DEventName, listener: Scatter3DListener) => {
    const listenerSet = this.listeners[eventName];
    listenerSet.add(listener);
    return () => listenerSet.delete(listener);
  };

  private configureCamera() {
    const options = this.options;
    if (!options) return;
    this.camera.fov = options.camera.fov;
    this.camera.near = options.camera.near;
    this.camera.far = options.camera.far;
    this.camera.zoom = options.camera.zoom ?? 1;
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
    this.controls.minAzimuthAngle = options.controls.minAzimuthAngle;
    this.controls.maxAzimuthAngle = options.controls.maxAzimuthAngle;
    this.controls.rotateSpeed = options.controls.rotateSpeed;
    this.controls.zoomSpeed = options.controls.zoomSpeed;
    this.controls.panSpeed = options.controls.panSpeed;
    this.controls.screenSpacePanning = options.controls.screenSpacePanning;
    this.controls.keyPanSpeed = options.controls.keyPanSpeed;
  }

  private configureScene() {
    const options = this.options;
    if (!options) return;
    this.scene.background = options.backgroundColor === null ? null : new THREE.Color(options.backgroundColor);
    this.scene.fog = options.fog ? new THREE.Fog(options.fog.color, options.fog.near, options.fog.far) : null;
  }

  private rebuildScene() {
    const options = this.options;
    if (!options) return;

    this.clearScene();
    this.pointsObjects = [];
    this.pointsDatasetIndices.clear();
    this.visualMapColors = options.visualMap?.colors.map(color => new THREE.Color(color)) ?? [];

    createGridObjects(options.grid).forEach(grid => this.scene.add(grid));
    const axes = createAxesObject(options);
    if (axes) this.scene.add(axes);

    options.datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.show || dataset.points.length === 0) return;
      const positions = new Float32Array(dataset.points.length * 3);
      const colors = new Float32Array(dataset.points.length * 3);
      const datasetColor = new THREE.Color(dataset.color);
      dataset.points.forEach((point, pointIndex) => {
        const offset = pointIndex * 3;
        positions[offset] = this.toWorld(point.x, options.xDomain);
        positions[offset + 1] = this.toWorld(point.y, options.yDomain);
        positions[offset + 2] = this.toWorld(point.z, options.zDomain);
        const color = this.getPointColor(point, datasetColor, options);
        colors[offset] = color.r;
        colors[offset + 1] = color.g;
        colors[offset + 2] = color.b;
      });

      if (dataset.line.show && dataset.points.length > 1) {
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const lineMaterial =
          dataset.line.dash === 'solid'
            ? new THREE.LineBasicMaterial({
                color: dataset.line.color,
                linewidth: dataset.line.width,
                transparent: dataset.line.opacity < 1,
                opacity: dataset.line.opacity,
              })
            : new THREE.LineDashedMaterial({
                color: dataset.line.color,
                linewidth: dataset.line.width,
                dashSize: dataset.line.dashSize,
                gapSize: dataset.line.gapSize,
                transparent: dataset.line.opacity < 1,
                opacity: dataset.line.opacity,
              });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        if (dataset.line.dash !== 'solid') line.computeLineDistances();
        this.scene.add(line);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeBoundingSphere();

      const pointTexture = createPointTexture(dataset.symbol);
      const material = new THREE.PointsMaterial({
        size: dataset.size,
        sizeAttenuation: options.point.sizeAttenuation,
        vertexColors: true,
        alphaTest: dataset.symbol === 'circle' ? 0.08 : 0,
        transparent: dataset.symbol === 'circle' || dataset.opacity < 1,
        opacity: dataset.opacity,
        depthTest: options.point.depthTest,
        depthWrite: options.point.depthWrite,
        blending: getBlending(options.point.blending),
        ...(pointTexture ? { map: pointTexture } : {}),
      });
      const points = new THREE.Points(geometry, material);
      points.name = dataset.label || `scatter3d-series-${datasetIndex + 1}`;
      this.pointsObjects.push(points);
      this.pointsDatasetIndices.set(points, datasetIndex);
      this.scene.add(points);
    });

    if (options.emphasis.show) {
      const createHighlightPoints = (symbol: 'circle' | 'square') => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
        const pointTexture = createPointTexture(symbol);
        const material = new THREE.PointsMaterial({
          size: 0.1,
          sizeAttenuation: options.point.sizeAttenuation,
          color: 0xffffff,
          alphaTest: symbol === 'circle' ? 0.08 : 0,
          transparent: true,
          opacity: 1,
          depthTest: false,
          depthWrite: false,
          blending: getBlending(options.point.blending),
          ...(pointTexture ? { map: pointTexture } : {}),
        });
        const points = new THREE.Points(geometry, material);
        points.visible = false;
        points.renderOrder = 20;
        this.scene.add(points);
        return points;
      };

      this.highlightObjects = {
        circle: createHighlightPoints('circle'),
        square: createHighlightPoints('square'),
      };
    }
  }

  private clearScene() {
    if (!this.scene) return;
    for (const child of [...this.scene.children]) {
      disposeObject3D(child);
      this.scene.remove(child);
    }
    this.highlightObjects = undefined;
  }

  private toWorld(value: number, domain: readonly [number, number]) {
    const progress = (value - domain[0]) / (domain[1] - domain[0]);
    return (Math.min(Math.max(progress, 0), 1) - 0.5) * WORLD_SIZE;
  }

  private syncAnimationLoop() {
    const shouldAnimate = Boolean(this.controls.enableDamping || this.controls.autoRotate);
    if (shouldAnimate && !this.animationLoopActive) {
      this.renderer.setAnimationLoop(this.renderFrame);
      this.animationLoopActive = true;
    } else if (!shouldAnimate && this.animationLoopActive) {
      this.renderer.setAnimationLoop(null);
      this.animationLoopActive = false;
    }
  }

  private renderFrame = () => {
    if (this.disposed) return;
    if (this.controls.enableDamping || this.controls.autoRotate) {
      this.controls.update();
    }
    this.renderer.render(this.scene, this.camera);
  };

  private getPointColor(
    point: NormalizedScatter3DOptions['datasets'][number]['points'][number],
    datasetColor: THREE.Color,
    options: NormalizedScatter3DOptions
  ) {
    if (point.color) return this.pointColor.set(point.color);
    if (!options.visualMap) return datasetColor;

    const visualMap = options.visualMap;
    if (this.visualMapColors.length < 2) return datasetColor;
    const dimension = visualMap.dimension;
    const value = this.getVisualValue(point, dimension);
    if (typeof value !== 'number' || !Number.isFinite(value) || visualMap.min === undefined || visualMap.max === undefined) return datasetColor;
    const range = visualMap.max - visualMap.min;
    if (!Number.isFinite(range) || range <= 0) return datasetColor;
    const rawProgress = (value - visualMap.min) / range;
    if (!visualMap.clamp && visualMap.outOfRangeColor && (rawProgress < 0 || rawProgress > 1)) {
      return this.visualMapOutOfRangeColor.set(visualMap.outOfRangeColor);
    }
    let progress = visualMap.clamp ? Math.min(Math.max(rawProgress, 0), 1) : rawProgress;
    if (visualMap.reverse) progress = 1 - progress;
    const interpolationProgress = Math.min(Math.max(progress, 0), 1);
    const scaled = interpolationProgress * (this.visualMapColors.length - 1);
    const leftIndex = Math.min(Math.floor(scaled), this.visualMapColors.length - 2);
    const rightIndex = leftIndex + 1;
    return this.visualMapColor.copy(this.visualMapColors[leftIndex]).lerp(this.visualMapColors[rightIndex], scaled - leftIndex);
  }

  private getVisualValue(
    point: NormalizedScatter3DOptions['datasets'][number]['points'][number],
    dimension: NonNullable<NormalizedScatter3DOptions['visualMap']>['dimension']
  ) {
    if (dimension === 'value') return point.numericValue;
    if (dimension === 'x') return point.x;
    if (dimension === 'y') return point.y;
    return point.z;
  }

  private updateHighlight(data?: Scatter3DExposedData) {
    const options = this.options;
    const highlights = this.highlightObjects;
    if (!options || !highlights || !data) {
      if (highlights) {
        highlights.circle.visible = false;
        highlights.square.visible = false;
      }
      return;
    }

    const dataset = options.datasets[data.datasetIndex];
    const point = dataset?.points[data.pointIndex];
    if (!dataset || !point) {
      highlights.circle.visible = false;
      highlights.square.visible = false;
      return;
    }

    highlights.circle.visible = false;
    highlights.square.visible = false;
    const highlight = highlights[dataset.symbol];
    highlight.position.set(this.toWorld(point.x, options.xDomain), this.toWorld(point.y, options.yDomain), this.toWorld(point.z, options.zDomain));
    highlight.material.size = options.emphasis.size ?? dataset.size * options.emphasis.scale;
    const color = options.emphasis.color
      ? this.highlightOverrideColor.set(options.emphasis.color)
      : this.getPointColor(point, this.highlightDatasetColor.set(dataset.color), options);
    highlight.material.color.copy(color);
    highlight.material.opacity = options.emphasis.opacity ?? dataset.opacity;
    highlight.visible = true;
  }

  private getTooltipChart() {
    if (!this.options || !this.tooltipSvg) return undefined;
    return {
      chartId: this.canvas.id,
      scale: 1,
      svg: this.tooltipSvg,
      container: this.container,
      chartType: 'scatter3d' as const,
      tooltip: this.options.tooltip,
      layout: this.layout,
    };
  }

  private toTooltipData(data: Scatter3DExposedData) {
    const point = data.point;
    const coordinates = isTuplePoint(point) ? { x: point[0], y: point[1], z: point[2] } : point;
    const dataset = this.options?.datasets[data.datasetIndex];
    const dotColor = isTuplePoint(point) ? dataset?.color : (point.color ?? dataset?.color);
    const values = [
      { label: 'X', value: coordinates.x },
      { label: 'Y', value: coordinates.y },
      { label: 'Z', value: coordinates.z },
    ];
    if (!isTuplePoint(point) && point.value !== undefined) {
      values.push({ label: 'Value', value: point.value });
    }

    return values.map(value => ({
      x: data.screen.x,
      y: data.screen.y,
      index: 0,
      data: {
        label: value.label,
        data: value.value,
        dotColor,
      },
    }));
  }

  private showTooltip(data: Scatter3DExposedData) {
    const chart = this.getTooltipChart();
    if (!chart || !this.options?.tooltip.show) return;

    const pointLabel = !isTuplePoint(data.point) ? data.point.label : undefined;
    drawTooltip({
      chart,
      data: {
        position: [data.screen.x, data.screen.y],
        eventName: 'mousemove',
      },
      exposedData: this.toTooltipData(data),
      xData: `${data.datasetLabel} · #${data.pointIndex + 1}${pointLabel ? ` · ${pointLabel}` : ''}`,
    });
  }

  private hideTooltip() {
    const chart = this.getTooltipChart();
    if (!chart) return;

    drawTooltip({
      chart,
      data: { position: [0, 0], eventName: 'mouseleave' },
      exposedData: [],
    });
  }

  private clearHover() {
    this.moveCoalescer?.cancelPending();
    if (this.hovered) {
      this.emit('mouseleave', this.hovered);
      this.hovered = undefined;
    }
    this.updateHighlight();
    this.hideTooltip();
  }

  private readonly handleControlsStart = () => {
    this.controlsInteracting = true;
    this.clearHover();
    this.render();
  };

  private readonly handleControlsEnd = () => {
    this.controlsInteracting = false;
  };

  private bindPointerEvents() {
    this.moveCoalescer = createFrameCoalescer<PointerEvent>(event => this.handlePointerMove(event));
    this.canvas.addEventListener('pointermove', this.handlePointerMoveScheduled);
    this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
    this.canvas.addEventListener('click', this.handlePointerClick);
  }

  private unbindPointerEvents() {
    this.canvas.removeEventListener('pointermove', this.handlePointerMoveScheduled);
    this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
    this.canvas.removeEventListener('click', this.handlePointerClick);
  }

  private readonly handlePointerMoveScheduled = (event: PointerEvent) => {
    if (this.controlsInteracting || event.buttons !== 0) {
      this.moveCoalescer?.cancelPending();
      return;
    }
    this.moveCoalescer?.schedule(event);
  };

  private readonly handlePointerLeave = () => {
    this.clearHover();
    this.render();
  };

  private readonly handlePointerClick = (event: MouseEvent) => {
    const exposed = this.pick(event.clientX, event.clientY);
    if (exposed) this.emit('click', exposed);
  };

  private readonly handlePointerMove = (event: PointerEvent) => {
    const exposed = this.pick(event.clientX, event.clientY);
    if (!exposed) {
      this.clearHover();
      this.render();
      return;
    }

    if (!this.hovered || this.getPointKey(this.hovered) !== this.getPointKey(exposed)) {
      if (this.hovered) this.emit('mouseleave', this.hovered);
      this.emit('mouseenter', exposed);
    }
    this.hovered = exposed;
    this.updateHighlight(exposed);
    this.showTooltip(exposed);
    this.emit('mousemove', exposed);
    this.render();
  };

  private pick(clientX: number, clientY: number) {
    if (!this.options || this.pointsObjects.length === 0) return undefined;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return undefined;
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.raycaster.params.Points.threshold = Math.max(0.12, this.options.point.size * 1.25);
    const intersection = this.raycaster.intersectObjects(this.pointsObjects, false)[0];
    if (!intersection || intersection.index === undefined) return undefined;

    const points = intersection.object as THREE.Points;
    const datasetIndex = this.pointsDatasetIndices.get(points);
    const dataset = datasetIndex === undefined ? undefined : this.options.datasets[datasetIndex];
    const point = dataset && dataset.points[intersection.index];
    if (datasetIndex === undefined || !dataset || !point) return undefined;

    return {
      datasetIndex,
      pointIndex: intersection.index,
      datasetLabel: dataset.label,
      point: point.value,
      distance: intersection.distance,
      screen: {
        x: clientX - rect.left,
        y: clientY - rect.top,
      },
    } satisfies Scatter3DExposedData;
  }

  private getPointKey(data: Scatter3DExposedData) {
    return `${data.datasetIndex}:${data.pointIndex}`;
  }

  private emit(eventName: Scatter3DEventName, data: Scatter3DExposedData) {
    this.listeners[eventName].forEach(listener => listener(data));
  }
}
