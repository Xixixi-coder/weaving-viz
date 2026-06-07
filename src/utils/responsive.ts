export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export function getBreakpoint(width: number): Breakpoint {
  if (width >= 1280) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

export function getWarpCount(bp: Breakpoint): number {
  return bp === 'mobile' ? 3 : 5;
}

export function getPointCount(bp: Breakpoint): number {
  if (bp === 'desktop') return 20;
  if (bp === 'tablet') return 15;
  return 10;
}
