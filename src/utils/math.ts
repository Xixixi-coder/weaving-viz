export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export function smoothNoise(t: number, seed: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const smooth = f * f * (3 - 2 * f);
  const a = noise2D(i, seed);
  const b = noise2D(i + 1, seed);
  return lerp(a, b, smooth) * 2 - 1;
}
