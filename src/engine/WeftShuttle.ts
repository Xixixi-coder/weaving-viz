import type { DataNodeInfo } from '../data/laborData';
import { randomRange } from '../utils/math';

export interface ActiveDataNode {
  data: DataNodeInfo;
  x: number;
  y: number;
  radius: number;
  alpha: number;
  activatedAt: number;
  isFixed: boolean;
  lifespan: number;
}

export interface WeftLine {
  id: number;
  y: number;
  progress: number;
  speed: number;
  nodes: ActiveDataNode[];
  alpha: number;
  color: string;
}

let nextId = 0;

export function createWeft(
  canvasWidth: number,
  canvasHeight: number,
  dataPool: DataNodeInfo[],
  usedIds: Set<string>
): WeftLine {
  const nodeCount = Math.floor(randomRange(1, 4));
  const available = dataPool.filter(d => !usedIds.has(d.id));
  const selected: ActiveDataNode[] = [];

  for (let i = 0; i < nodeCount && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    const data = available.splice(idx, 1)[0];
    selected.push({
      data,
      x: randomRange(canvasWidth * 0.2, canvasWidth * 0.8),
      y: 0,
      radius: 30,
      alpha: 0,
      activatedAt: -1,
      isFixed: false,
      lifespan: 3000,
    });
  }

  const y = randomRange(50, canvasHeight - 50);

  return {
    id: nextId++,
    y,
    progress: -0.05,
    speed: 1 / randomRange(8, 12),
    nodes: selected,
    alpha: 0.4,
    color: `rgba(255,255,255,0.15)`,
  };
}

export function updateWeft(
  weft: WeftLine,
  canvasWidth: number,
  dt: number,
  warpXPositions: number[]
): boolean {
  weft.progress += weft.speed * dt;

  const currentX = weft.progress * canvasWidth;

  for (const node of weft.nodes) {
    node.y = weft.y;
    if (currentX >= node.x && node.activatedAt < 0) {
      node.activatedAt = performance.now();
      node.alpha = 1;
    }
    if (node.activatedAt > 0 && !node.isFixed) {
      const elapsed = performance.now() - node.activatedAt;
      if (elapsed > node.lifespan) {
        node.alpha = Math.max(0, 1 - (elapsed - node.lifespan) / 1000);
      }
    }
  }

  return weft.progress > 1.05;
}
