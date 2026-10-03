import { normalizeOptions } from './normal.js';
import { createFishScene, releaseFishAnimations, updateFishScene } from './scene.js';
import { disposeObject3D } from './dispose.js';
import type { FishObjectInstance, FishObjectOptions } from './types.js';

/** Create renderable fish without an additional canvas, renderer or animation loop. */
export async function createFishObject(options: FishObjectOptions = {}): Promise<FishObjectInstance> {
  if (options.signal?.aborted) throw new DOMException('Fish loading aborted.', 'AbortError');
  const normalized = normalizeOptions(options);
  const scene = await createFishScene(normalized);
  let disposed = false;
  const release = () => {
    if (disposed) return;
    disposed = true;
    releaseFishAnimations(scene.animatedFish);
    scene.group.removeFromParent();
    disposeObject3D(scene.group);
    options.signal?.removeEventListener('abort', release);
  };
  if (options.signal?.aborted) {
    release();
    throw new DOMException('Fish loading aborted.', 'AbortError');
  }
  options.signal?.addEventListener('abort', release, { once: true });
  return {
    group: scene.group,
    update(elapsedSeconds, speed = normalized.animation.speed, instanceTimes) {
      if (
        disposed ||
        normalized.animation.reducedMotion === 'always' ||
        (normalized.animation.reducedMotion === 'auto' && globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) ||
        !normalized.animation.enabled ||
        !Number.isFinite(elapsedSeconds) ||
        !Number.isFinite(speed)
      )
        return;
      updateFishScene(scene.animatedFish, Math.max(0, elapsedSeconds), Math.min(4, Math.max(0, speed)), instanceTimes);
    },
    dispose() {
      release();
    },
  };
}
