import { Plane, Raycaster, Vector2, Vector3, type Camera } from 'three';
import type { NormalizedWaterInteractionOptions, WaterInteractionEvent } from './types.js';

type WaterPlane = { width: number; depth: number; elevation: number };
const createScratch = () => ({ ray: new Raycaster(), ndc: new Vector2(), plane: new Plane(), hit: new Vector3() });
const defaultScratch = createScratch();

/** Project CSS canvas coordinates with the current camera onto the mean water plane. */
export function projectWaterPointer(
  camera: Camera,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  clientX: number,
  clientY: number,
  shape: WaterPlane,
  scratch = defaultScratch
): [number, number, number] | null {
  if (rect.width <= 0 || rect.height <= 0 || ![clientX, clientY].every(Number.isFinite)) return null;
  scratch.ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, 1 - ((clientY - rect.top) / rect.height) * 2);
  camera.updateMatrixWorld(true);
  scratch.ray.setFromCamera(scratch.ndc, camera);
  scratch.plane.set(new Vector3(0, 1, 0), -shape.elevation);
  if (!scratch.ray.ray.intersectPlane(scratch.plane, scratch.hit)) return null;
  if (Math.abs(scratch.hit.x) > shape.width / 2 || Math.abs(scratch.hit.z) > shape.depth / 2) return null;
  return [scratch.hit.x, scratch.hit.y, scratch.hit.z];
}

/** One listener set per chart; bounded sampling and no DOM overlays or per-move meshes. */
export class WaterPointerInteraction {
  private readonly scratch = createScratch();
  private config: NormalizedWaterInteractionOptions = { enabled: false, strength: 0.03, radius: 1.4, decay: 2.2, sampleInterval: 70 };
  private lastSample = -Infinity;
  private lastPoint?: readonly [number, number, number];
  private active = false;
  private focused = true;
  private touchExpiry = 0;
  private down?: { id: number; x: number; y: number; time: number; travel: number; multi: boolean };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: () => { camera: Camera; shape: WaterPlane } | undefined,
    private readonly emit: (event: WaterInteractionEvent | null) => void,
    private readonly clearRipples: () => void
  ) {
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointerleave', this.onLeave);
    canvas.addEventListener('lostpointercapture', this.onLostCapture);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onCancel);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('focus', this.onFocus);
    canvas.addEventListener('wheel', this.onCancel, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  configure(config: NormalizedWaterInteractionOptions): void {
    this.cancel();
    this.config = config;
  }

  update(now: number): void {
    if (this.touchExpiry > 0 && now >= this.touchExpiry) this.clearTarget(false);
  }

  dispose(): void {
    this.cancel();
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.canvas.removeEventListener('pointerleave', this.onLeave);
    this.canvas.removeEventListener('lostpointercapture', this.onLostCapture);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onCancel);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    this.canvas.removeEventListener('wheel', this.onCancel);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private sample(event: PointerEvent, tap = false): void {
    if (!this.config.enabled || !this.focused) return;
    const now = performance.now();
    if (!tap && now - this.lastSample < this.config.sampleInterval) return;
    const scene = this.scene();
    if (!scene) return;
    const point = projectWaterPointer(scene.camera, this.canvas.getBoundingClientRect(), event.clientX, event.clientY, scene.shape, this.scratch);
    if (!point) {
      this.clearTarget(false);
      return;
    }
    if (!tap && this.lastPoint && Math.hypot(point[0] - this.lastPoint[0], point[2] - this.lastPoint[2]) < 0.05) return;
    this.lastSample = now;
    this.lastPoint = point;
    this.active = true;
    const source = event.pointerType === 'touch' ? 'touch' : event.pointerType === 'pen' ? 'pen' : 'mouse';
    this.touchExpiry = source === 'touch' ? now + 650 : 0;
    this.emit({ position: point, source });
  }

  private clearTarget(clearWater: boolean): void {
    this.lastPoint = undefined;
    this.lastSample = -Infinity;
    this.touchExpiry = 0;
    if (this.active) {
      this.active = false;
      this.emit(null);
    }
    if (clearWater) this.clearRipples();
  }

  private cancel(): void {
    this.down = undefined;
    this.clearTarget(true);
  }
  private onMove = (event: PointerEvent): void => {
    if (this.down) {
      if (event.pointerId === this.down.id)
        this.down.travel = Math.max(this.down.travel, Math.hypot(event.clientX - this.down.x, event.clientY - this.down.y));
      return;
    }
    if (event.buttons !== 0 || event.pointerType === 'touch') return;
    this.sample(event);
  };
  private onDown = (event: PointerEvent): void => {
    if (!this.config.enabled || !this.focused) return;
    if (this.down) {
      this.down.multi = true;
      this.clearTarget(true);
      return;
    }
    this.clearTarget(true);
    this.down = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now(), travel: 0, multi: false };
  };
  private onUp = (event: PointerEvent): void => {
    const down = this.down;
    if (!down || event.pointerId !== down.id) return;
    this.down = undefined;
    if (event.pointerType === 'touch' && !down.multi && down.travel < 8 && performance.now() - down.time < 350) this.sample(event, true);
  };
  private onLeave = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') this.clearTarget(false);
  };
  private onLostCapture = (): void => {
    if (this.down) this.cancel();
  };
  private onCancel = (): void => this.cancel();
  private onBlur = (): void => {
    this.focused = false;
    this.cancel();
  };
  private onFocus = (): void => {
    this.focused = true;
  };
  private onVisibility = (): void => {
    if (document.hidden) {
      this.focused = false;
      this.cancel();
    } else this.focused = document.hasFocus();
  };
}
