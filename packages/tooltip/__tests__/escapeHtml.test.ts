import { describe, expect, it } from 'vitest';
import { escapeTooltipHtml } from '../src/escapeHtml';
import { getTooltipHtml } from '../src/getTooltipHtml';
import type { CommonChart } from '../src/drawTooltip';

describe('escapeTooltipHtml', () => {
  it('escapes dynamic values before they enter generated tooltip markup', () => {
    expect(escapeTooltipHtml(`<img src=x onerror="alert('x')">`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;'
    );
  });

  it('renders nullish values as empty text', () => {
    expect(escapeTooltipHtml(undefined)).toBe('');
    expect(escapeTooltipHtml(null)).toBe('');
  });

  it('escapes the generated shared tooltip fields', () => {
    const chart = {
      chartId: 'test',
      chartType: 'line',
      scale: 1,
      svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      container: document.createElement('div'),
      layout: { width: 100, height: 100 },
      tooltip: {
        formatter: () => '<script>alert(1)</script>',
        extra: { text: '<strong>extra</strong>' },
      },
    } as unknown as CommonChart;

    const html = getTooltipHtml({
      chart,
      eventData: { position: [0, 0] },
      xData: '<title>unsafe</title>',
      tooltipData: [{ x: 0, y: 0, data: { label: '<label>', data: [1] }, index: 0 }],
    });

    expect(html).toContain('&lt;label&gt;');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('&lt;strong&gt;extra&lt;/strong&gt;');
    expect(html).toContain('&lt;title&gt;unsafe&lt;/title&gt;');
  });
});
