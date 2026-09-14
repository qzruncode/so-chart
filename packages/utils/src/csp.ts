type CspRuntime = typeof globalThis & {
  __CSP_NONCE__?: unknown;
};

function normalizeNonce(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getGlobalCspNonce(): string | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  return normalizeNonce((globalThis as CspRuntime).__CSP_NONCE__);
}

function getDocumentCspNonce(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const element = document.querySelector('script[nonce]') ?? document.querySelector('style[nonce], link[nonce]');
  if (!element || !('nonce' in element)) return undefined;
  return normalizeNonce(element.nonce) ?? normalizeNonce(element.getAttribute('nonce'));
}

/**
 * Reads a nonce supplied by the host application. Existing global injection is
 * kept as a fallback for compatibility; a nonce on an external resource can
 * be discovered without requiring a library-specific global variable.
 */
export function getCspNonce(): string | undefined {
  return getDocumentCspNonce() ?? getGlobalCspNonce();
}

/** Explicit chart configuration takes precedence over host-provided defaults. */
export function resolveCspNonce(nonce?: string): string | undefined {
  return normalizeNonce(nonce) ?? getCspNonce();
}

export type StyleParams = {
  className: string;
  style: { 'font-color'?: string; 'font-size'?: string; color?: string; 'background-color'?: string; 'margin-top'?: number; 'max-height'?: string };
}[];

export function getStyle(params: StyleParams) {
  const style = params.map(d => {
    const className = `.${d.className}`;
    const styleStr = Object.entries(d.style).reduce((pre, [key, value]) => `${pre != '' ? `${pre}; ` : ''}${key}: ${value};`, '');
    return `${className} { ${styleStr} }`;
  }, '');
  return style;
}
