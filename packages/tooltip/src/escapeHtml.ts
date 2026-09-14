const HTML_ESCAPE_PATTERN = /[&<>"']/g;
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeTooltipHtml(value: unknown): string {
  return String(value ?? '').replace(HTML_ESCAPE_PATTERN, character => HTML_ESCAPE_MAP[character]);
}
