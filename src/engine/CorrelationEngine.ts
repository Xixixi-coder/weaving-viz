import type { WarpThread } from './WarpThread';
import { CORRELATIONS } from '../data/correlationMatrix';
import type { CorrelationEffect } from '../data/correlationMatrix';
import { WARP_COLORS } from '../data/colors';

export interface CorrelationResult {
  effect: CorrelationEffect;
  strength: number;
}

export function calculateCorrelations(warps: WarpThread[], canvasWidth: number): CorrelationResult[] {
  const results: CorrelationResult[] = [];

  for (const corr of CORRELATIONS) {
    const warpIndices = corr.warps.map(type =>
      WARP_COLORS.findIndex(w => w.id === type)
    );

    if (warpIndices.some(i => i < 0 || i >= warps.length)) continue;

    if (corr.condition === 'close' && warpIndices.length === 2) {
      const x1 = warps[warpIndices[0]].getXAtY(warps[0].points[10]?.y ?? 300);
      const x2 = warps[warpIndices[1]].getXAtY(warps[0].points[10]?.y ?? 300);
      const dist = Math.abs(x1 - x2);
      const normalDist = warps[warpIndices[0]].points[0].originalX - warps[warpIndices[1]].points[0].originalX;
      const strength = Math.max(0, 1 - dist / Math.abs(normalDist || canvasWidth));
      if (strength > 0.3) {
        results.push({ effect: corr, strength });
      }
    }

    if (corr.condition === 'far' && warpIndices.length === 1) {
      const warpX = warps[warpIndices[0]].getXAtY(300);
      let minDist = Infinity;
      for (let i = 0; i < warps.length; i++) {
        if (i === warpIndices[0]) continue;
        const otherX = warps[i].getXAtY(300);
        minDist = Math.min(minDist, Math.abs(warpX - otherX));
      }
      const strength = Math.min(1, minDist / (canvasWidth * 0.3));
      if (strength > 0.5) {
        results.push({ effect: corr, strength });
      }
    }

    if (corr.condition === 'cluster' && warpIndices.length >= 3) {
      const xs = warpIndices.map(i => warps[i].getXAtY(300));
      const maxSpread = Math.max(...xs) - Math.min(...xs);
      const normalSpread = canvasWidth * 0.4;
      const strength = Math.max(0, 1 - maxSpread / normalSpread);
      if (strength > 0.4) {
        results.push({ effect: corr, strength });
      }
    }
  }

  return results;
}
