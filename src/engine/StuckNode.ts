import type { WarpType } from '../data/colors';

export interface StuckNodeState {
  id: string;
  warpIndex: number;
  warpType: WarpType;
  x: number;
  y: number;
  intensity: number;
  isRevealed: boolean;
  storyId: string;
  createdAt: number;
}

let stuckId = 0;

export function tryCreateStuckNode(
  warpIndex: number,
  warpType: WarpType,
  x: number,
  y: number,
  storyId: string,
  probability: number = 0.15
): StuckNodeState | null {
  if (Math.random() > probability) return null;
  return {
    id: `stuck-${stuckId++}`,
    warpIndex,
    warpType,
    x,
    y,
    intensity: 0,
    isRevealed: false,
    storyId,
    createdAt: performance.now(),
  };
}

export function updateStuckNode(node: StuckNodeState, time: number): void {
  if (!node.isRevealed) {
    const elapsed = (performance.now() - node.createdAt) / 1000;
    node.intensity = Math.min(1, elapsed / 2);
  }
}
