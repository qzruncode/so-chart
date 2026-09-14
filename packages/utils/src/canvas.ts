const bitmapRendererContexts = new WeakMap<HTMLCanvasElement, ImageBitmapRenderingContext | null>();

function getBitmapRendererContext(canvas: HTMLCanvasElement) {
  if (!bitmapRendererContexts.has(canvas)) {
    bitmapRendererContexts.set(canvas, canvas.getContext('bitmaprenderer'));
  }

  return bitmapRendererContexts.get(canvas);
}

/**
 * Presents an offscreen frame without looking up the bitmap renderer context
 * on every animation frame.
 */
export function presentCanvasFrame(canvas: HTMLCanvasElement, offscreenCanvas: OffscreenCanvas) {
  const context = getBitmapRendererContext(canvas);
  if (!context) return;

  context.transferFromImageBitmap(offscreenCanvas.transferToImageBitmap());
}

export function releaseCanvasFrame(canvas: HTMLCanvasElement) {
  bitmapRendererContexts.delete(canvas);
}
