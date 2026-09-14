import { useSyncExternalStore } from 'react';

const THEME_ATTRIBUTES = ['class', 'style', 'data-theme', 'data-theme-mode', 'data-color-scheme'];

const THEME_FALLBACKS: Record<string, string> = {
  '--primary-color': '#029be6',
  '--text-color': '#2d364d',
  '--text-secondary-color': '#b3b8c7',
  '--chart-crossline-color': '#6d7588',
  '--chart-calendarCell-background': '#6d7588',
  '--chart-flow-link-background': '#202340',
};

let themeVersion = 0;
let themeObserver: MutationObserver | undefined;
const subscribers = new Set<() => void>();

function getThemeElements(): Element[] {
  if (typeof document === 'undefined') return [];

  return Array.from(
    new Set(
      [document.documentElement, document.body, document.getElementById('so-chart')].filter((element): element is HTMLElement => Boolean(element))
    )
  );
}

function startThemeObserver() {
  if (themeObserver || typeof MutationObserver === 'undefined') return;

  const elements = getThemeElements();
  if (elements.length === 0) return;

  themeObserver = new MutationObserver(() => {
    themeVersion += 1;
    subscribers.forEach(subscriber => subscriber());
  });

  elements.forEach(element => {
    themeObserver?.observe(element, {
      attributes: true,
      attributeFilter: THEME_ATTRIBUTES,
    });
  });
}

function subscribeToTheme(listener: () => void) {
  subscribers.add(listener);
  startThemeObserver();

  return () => {
    subscribers.delete(listener);
    if (subscribers.size === 0) {
      themeObserver?.disconnect();
      themeObserver = undefined;
    }
  };
}

function getThemeVersion() {
  return themeVersion;
}

function getServerThemeVersion() {
  return 0;
}

export function useChartThemeVersion() {
  return useSyncExternalStore(subscribeToTheme, getThemeVersion, getServerThemeVersion);
}

function readThemeValue(source: Element | null | undefined, name: string) {
  const elements = Array.from(
    new Set([source, typeof document === 'undefined' ? null : document.documentElement, typeof document === 'undefined' ? null : document.body])
  ).filter((element): element is Element => Boolean(element));

  for (const element of elements) {
    const value = getComputedStyle(element).getPropertyValue(name).trim();
    if (value) return value;
  }

  return THEME_FALLBACKS[name] ?? '';
}

function parseRgbChannel(value: string) {
  const channel = value.trim();
  if (channel.endsWith('%')) return Math.round((Number.parseFloat(channel) / 100) * 255);
  return Math.round(Number.parseFloat(channel));
}

function withOpacity(value: string, opacity: number) {
  const normalizedOpacity = Math.min(Math.max(opacity, 0), 1);
  if (normalizedOpacity >= 1 || value === 'transparent') return value;

  const hexMatch = value.match(/^#([\da-f]{3,8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const expanded = hex.length === 3 || hex.length === 4 ? hex.replace(/[\da-f]/gi, digit => digit + digit) : hex;
    const rgb = expanded.slice(0, 6);
    const currentAlpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6), 16) / 255 : 1;
    const alpha = Math.round(currentAlpha * normalizedOpacity * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${rgb}${alpha}`;
  }

  const rgbMatch = value.match(/^rgba?\(\s*([^,]+),\s*([^,]+),\s*([^,)]+)(?:,\s*([^)]+))?\s*\)$/i);
  if (rgbMatch) {
    const red = parseRgbChannel(rgbMatch[1]);
    const green = parseRgbChannel(rgbMatch[2]);
    const blue = parseRgbChannel(rgbMatch[3]);
    const currentAlpha = rgbMatch[4] ? Number.parseFloat(rgbMatch[4]) : 1;
    return `rgba(${red}, ${green}, ${blue}, ${Math.min(Math.max(currentAlpha * normalizedOpacity, 0), 1)})`;
  }

  return value;
}

export function getThemeColor(source: Element | null | undefined, name: string, opacity = 1) {
  return withOpacity(readThemeValue(source, name), opacity);
}
