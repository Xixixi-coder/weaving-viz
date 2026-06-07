import { useRef } from 'react';
import { useCanvasRenderer } from './useCanvasRenderer';
import type { ActiveDataNode } from '../../engine/WeftShuttle';
import type { StuckNodeState } from '../../engine/StuckNode';
import type { CorrelationResult } from '../../engine/CorrelationEngine';

interface WeavingCanvasProps {
  onWarpHover: (index: number, x: number, y: number) => void;
  onWarpUnhover: () => void;
  onNodeClick: (node: ActiveDataNode) => void;
  onStuckClick: (stuck: StuckNodeState) => void;
  onCorrelationChange: (results: CorrelationResult[]) => void;
  isPaused: boolean;
  interactive?: boolean;
}

export function WeavingCanvas({
  onWarpHover,
  onWarpUnhover,
  onNodeClick,
  onStuckClick,
  onCorrelationChange,
  isPaused,
  interactive = true,
}: WeavingCanvasProps) {
  const callbacksRef = useRef({ onWarpHover, onWarpUnhover, onNodeClick, onStuckClick, onCorrelationChange });
  callbacksRef.current = { onWarpHover, onWarpUnhover, onNodeClick, onStuckClick, onCorrelationChange };

  const stableCallbacks = useRef({
    onWarpHover: (i: number, x: number, y: number) => callbacksRef.current.onWarpHover(i, x, y),
    onWarpUnhover: () => callbacksRef.current.onWarpUnhover(),
    onNodeClick: (n: ActiveDataNode) => callbacksRef.current.onNodeClick(n),
    onStuckClick: (s: StuckNodeState) => callbacksRef.current.onStuckClick(s),
    onCorrelationChange: (r: CorrelationResult[]) => callbacksRef.current.onCorrelationChange(r),
  }).current;

  const { canvasRef, pause, resume } = useCanvasRenderer(stableCallbacks);

  const prevPaused = useRef(isPaused);
  if (isPaused !== prevPaused.current) {
    prevPaused.current = isPaused;
    if (isPaused) pause();
    else resume();
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: interactive ? 'auto' : 'none',
    }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
