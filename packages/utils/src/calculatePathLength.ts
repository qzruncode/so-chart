const pathLengthCache = new Map<string, number>();
const MAX_PATH_LENGTH_CACHE_SIZE = 512;

export function calculatePathLength(pathData: string) {
  const cached = pathLengthCache.get(pathData);
  if (cached != undefined) return cached;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  const length = path.getTotalLength();
  if (pathLengthCache.size >= MAX_PATH_LENGTH_CACHE_SIZE) {
    const firstKey = pathLengthCache.keys().next().value;
    if (firstKey != undefined) pathLengthCache.delete(firstKey);
  }
  pathLengthCache.set(pathData, length);
  return length;
}
