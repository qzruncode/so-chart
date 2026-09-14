import { JSDOM } from 'jsdom';

type GlobalPropertyBag = Record<string, unknown>;

/**
 * 创建虚拟 DOM 容器，模拟浏览器环境
 */
export function createContainer(
  width = 800,
  height = 600
): {
  container: HTMLElement;
  cleanup: () => void;
} {
  const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="container" style="width:${width}px;height:${height}px"></div></body></html>`);
  const container = dom.window.document.getElementById('container') as HTMLElement;
  const globalScope = globalThis as unknown as GlobalPropertyBag;

  // 保存所有被覆盖的全局变量
  const originalWindow = globalScope.window;
  const originalDocument = globalScope.document;
  const originalHTMLElement = globalScope.HTMLElement;
  const originalHTMLCanvasElement = globalScope.HTMLCanvasElement;
  const originalSVGSVGElement = globalScope.SVGSVGElement;
  const originalDevicePixelRatio = globalScope.devicePixelRatio;
  const originalOffscreenCanvas = globalScope.OffscreenCanvas;
  const originalRAF = globalScope.requestAnimationFrame;
  const originalCAF = globalScope.cancelAnimationFrame;
  const originalGCS = globalScope.getComputedStyle;
  const originalResizeObserver = globalScope.ResizeObserver;

  globalScope.window = dom.window;
  globalScope.document = dom.window.document;
  globalScope.HTMLElement = dom.window.HTMLElement;
  globalScope.HTMLCanvasElement = dom.window.HTMLCanvasElement;
  globalScope.SVGSVGElement = dom.window.SVGSVGElement;
  globalScope.devicePixelRatio = 2;
  globalScope.OffscreenCanvas = createMockOffscreenCanvas();
  globalScope.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16);
  globalScope.cancelAnimationFrame = (id: number) => clearTimeout(id);

  // Mock getComputedStyle
  globalScope.getComputedStyle = (el: Element) => {
    const style = (el as HTMLElement).style;
    return {
      width: style.width || `${width}px`,
      height: style.height || `${height}px`,
      getPropertyValue: (prop: string) => style.getPropertyValue(prop) || '',
    };
  };

  // Mock ResizeObserver
  globalScope.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock SVG path methods not available in jsdom
  const svgPathElement = globalScope.SVGPathElement;
  if (typeof svgPathElement === 'function') {
    const prototype = (svgPathElement as { prototype?: { getTotalLength?: () => number } }).prototype;
    if (prototype) {
      prototype.getTotalLength = () => 1000;
    }
  }

  return {
    container,
    cleanup: () => {
      globalScope.window = originalWindow;
      globalScope.document = originalDocument;
      globalScope.HTMLElement = originalHTMLElement;
      globalScope.HTMLCanvasElement = originalHTMLCanvasElement;
      globalScope.SVGSVGElement = originalSVGSVGElement;
      globalScope.devicePixelRatio = originalDevicePixelRatio;
      globalScope.OffscreenCanvas = originalOffscreenCanvas;
      globalScope.requestAnimationFrame = originalRAF;
      globalScope.cancelAnimationFrame = originalCAF;
      globalScope.getComputedStyle = originalGCS;
      globalScope.ResizeObserver = originalResizeObserver;
      dom.window.close();
    },
  };
}

/**
 * 创建 OffscreenCanvas mock
 */
function createMockOffscreenCanvas() {
  return class MockOffscreenCanvas {
    width: number;
    height: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
    }

    getContext() {
      return createMockCanvasContext();
    }

    transferToImageBitmap() {
      return { close: () => {} };
    }

    convertToBlob() {
      return Promise.resolve(new Blob());
    }
  };
}

/**
 * 创建 Canvas 2D Context mock
 */
function createMockCanvasContext() {
  const context: Record<PropertyKey, unknown> = {
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    bezierCurveTo: () => {},
    quadraticCurveTo: () => {},
    rect: () => {},
    fill: () => {},
    stroke: () => {},
    clip: () => {},
    fillText: () => {},
    strokeText: () => {},
    measureText: () => ({ width: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 }),
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    scale: () => {},
    translate: () => {},
    rotate: () => {},
    setTransform: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {},
    createImageData: () => ({}),
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    putImageData: () => {},
    isPointInPath: () => false,
    isPointInStroke: () => false,
    setLineDash: () => {},
    getLineDash: () => [],
    arcTo: () => {},
    ellipse: () => {},
    roundRect: () => {},
    drawFocusIfNeeded: () => {},
    scrollPathIntoView: () => {},
  };

  return new Proxy(context, {
    get(target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }
      return () => {};
    },
  });
}
