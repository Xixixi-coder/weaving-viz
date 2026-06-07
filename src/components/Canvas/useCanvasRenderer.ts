import { useRef, useEffect, useCallback } from 'react';
import { WarpThread } from '../../engine/WarpThread';
import { createWeft, updateWeft } from '../../engine/WeftShuttle';
import type { WeftLine, ActiveDataNode } from '../../engine/WeftShuttle';
import { tryCreateStuckNode, updateStuckNode } from '../../engine/StuckNode';
import type { StuckNodeState } from '../../engine/StuckNode';
import { calculateCorrelations } from '../../engine/CorrelationEngine';
import type { CorrelationResult } from '../../engine/CorrelationEngine';
import { WARP_COLORS } from '../../data/colors';
import { LABOR_DATA } from '../../data/laborData';
import { STORIES } from '../../data/stories';
import { setupCanvas, drawSmoothLine, drawGlowCircle } from '../../utils/canvas';
import { smoothNoise } from '../../utils/math';
import { getBreakpoint, getPointCount } from '../../utils/responsive';

interface RendererState {
  warps: WarpThread[];
  wefts: WeftLine[];
  stuckNodes: StuckNodeState[];
  correlations: CorrelationResult[];
  hoveredWarp: number;
  draggedWarp: number;
  mouseX: number;
  mouseY: number;
  time: number;
  lastTime: number;
  isPaused: boolean;
  usedDataIds: Set<string>;
  weftTimer: number;
  stuckTimer: number;
  firstStuckTriggered: boolean;
  width: number;
  height: number;
}

interface RendererCallbacks {
  onWarpHover: (index: number, x: number, y: number) => void;
  onWarpUnhover: () => void;
  onNodeClick: (node: ActiveDataNode) => void;
  onStuckClick: (stuckNode: StuckNodeState) => void;
  onCorrelationChange: (results: CorrelationResult[]) => void;
}

export function useCanvasRenderer(callbacks: RendererCallbacks) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<RendererState | null>(null);
  const animRef = useRef<number>(0);

  const initState = useCallback((width: number, height: number): RendererState => {
    const bp = getBreakpoint(width);
    const pointCount = getPointCount(bp);
    const warpCount = WARP_COLORS.length;
    const spacing = width / (warpCount + 1);

    const warps = WARP_COLORS.map((config, i) =>
      new WarpThread(
        i,
        config.id,
        spacing * (i + 1),
        height,
        pointCount,
        config.color,
        config.hoverColor,
        config.thickness
      )
    );

    return {
      warps,
      wefts: [],
      stuckNodes: [],
      correlations: [],
      hoveredWarp: -1,
      draggedWarp: -1,
      mouseX: 0,
      mouseY: 0,
      time: 0,
      lastTime: performance.now(),
      isPaused: false,
      usedDataIds: new Set(),
      weftTimer: 0,
      stuckTimer: 0,
      firstStuckTriggered: false,
      width,
      height,
    };
  }, []);

  const render = useCallback((ctx: CanvasRenderingContext2D, state: RendererState) => {
    const { width, height, warps, wefts, stuckNodes, correlations, time } = state;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#16213E';
    ctx.globalAlpha = 0.08;
    const frameInset = 20;
    ctx.fillRect(frameInset, frameInset, width - frameInset * 2, height - frameInset * 2);
    ctx.globalAlpha = 1;

    for (const corr of correlations) {
      if (corr.strength > 0.3) {
        ctx.save();
        ctx.globalAlpha = corr.strength * 0.15;
        ctx.fillStyle = corr.effect.colorShift;

        const warpIndices = corr.effect.warps.map(type =>
          WARP_COLORS.findIndex(w => w.id === type)
        );
        const xs = warpIndices
          .filter(i => i >= 0 && i < warps.length)
          .map(i => warps[i].getXAtY(height / 2));

        if (xs.length >= 2) {
          const minX = Math.min(...xs) - 30;
          const maxX = Math.max(...xs) + 30;
          ctx.fillRect(minX, 0, maxX - minX, height);
        }
        ctx.restore();
      }
    }

    for (const weft of wefts) {
      const currentX = weft.progress * width;
      ctx.save();
      ctx.strokeStyle = weft.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = weft.alpha;
      ctx.beginPath();

      let above = true;
      const startX = Math.max(0, currentX - width);
      ctx.moveTo(startX, weft.y);

      for (const warp of warps) {
        const wx = warp.getXAtY(weft.y);
        if (wx > startX && wx < currentX) {
          if (above) {
            ctx.lineTo(wx, weft.y - 3);
            ctx.lineTo(wx, weft.y + 3);
          } else {
            ctx.lineTo(wx, weft.y + 3);
            ctx.lineTo(wx, weft.y - 3);
          }
          above = !above;
        }
      }
      ctx.lineTo(Math.min(currentX, width), weft.y);
      ctx.stroke();
      ctx.restore();

      for (const node of weft.nodes) {
        if (node.alpha > 0 && node.activatedAt > 0) {
          drawGlowCircle(ctx, node.x, node.y, node.radius * (0.8 + node.alpha * 0.5), 'rgba(255,215,0,0.9)', node.alpha * 0.6);

          ctx.save();
          ctx.globalAlpha = node.alpha;
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 14px "PingFang SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.data.value, node.x, node.y - 8);
          ctx.font = '10px "PingFang SC", sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          const contentText = node.data.content.length > 18
            ? node.data.content.substring(0, 18) + '…'
            : node.data.content;
          ctx.fillText(contentText, node.x, node.y + 10);
          ctx.restore();
        }
      }
    }

    for (let i = 0; i < warps.length; i++) {
      const warp = warps[i];
      const color = warp.getCurrentColor();
      const thickness = warp.getCurrentThickness();

      if (warp.isHovered || warp.isDragging) {
        drawSmoothLine(ctx, warp.points, color + '40', thickness + 6);
      }
      drawSmoothLine(ctx, warp.points, color, thickness);
    }

    for (const stuck of stuckNodes) {
      if (stuck.isRevealed) continue;

      const warp = warps[stuck.warpIndex];
      const x = warp.getXAtY(stuck.y);
      const noiseVal = smoothNoise(time * 3, stuck.y) * stuck.intensity * 4;

      ctx.save();

      ctx.strokeStyle = `rgba(231, 76, 60, ${stuck.intensity * 0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 15 + noiseVal, stuck.y - 10);
      ctx.lineTo(x + noiseVal, stuck.y);
      ctx.lineTo(x + 15 + noiseVal, stuck.y + 10);
      ctx.stroke();

      drawGlowCircle(ctx, x + noiseVal, stuck.y, 20 * stuck.intensity, 'rgba(231, 76, 60, 0.8)', stuck.intensity * 0.5);

      if (stuck.intensity > 0.7) {
        ctx.fillStyle = `rgba(255,255,255, ${stuck.intensity * 0.6})`;
        ctx.font = '11px "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('这里似乎有什么…', x + noiseVal, stuck.y - 25);
      }

      ctx.restore();
    }
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const state = stateRef.current;
    if (!canvas || !state || state.isPaused) {
      animRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const now = performance.now();
    const dt = Math.min((now - state.lastTime) / 1000, 0.05);
    state.lastTime = now;
    state.time += dt;

    for (const warp of state.warps) {
      warp.update(state.time, state.mouseX, state.mouseY);
    }

    state.weftTimer += dt;
    if (state.weftTimer > 2) {
      state.weftTimer = 0;
      if (state.wefts.length < 8) {
        const weft = createWeft(state.width, state.height, LABOR_DATA, state.usedDataIds);
        state.wefts.push(weft);
        for (const n of weft.nodes) {
          state.usedDataIds.add(n.data.id);
        }
      }
    }

    state.wefts = state.wefts.filter(w => {
      const done = updateWeft(w, state.width, dt, state.warps.map(wp => wp.getXAtY(w.y)));
      if (done) {
        for (const n of w.nodes) {
          if (!n.isFixed) state.usedDataIds.delete(n.data.id);
        }
      }
      return !done;
    });

    state.stuckTimer += dt;
    if (state.stuckTimer > 6 && state.stuckNodes.filter(s => !s.isRevealed).length < 3) {
      state.stuckTimer = 0;
      const warpIdx = Math.floor(Math.random() * state.warps.length);
      const warpConfig = WARP_COLORS[warpIdx];
      const story = STORIES.find(s => s.relatedWarp === warpConfig.id && !state.stuckNodes.some(sn => sn.storyId === s.id));
      if (story) {
        const prob = state.firstStuckTriggered ? 0.15 : 1;
        const stuck = tryCreateStuckNode(
          warpIdx,
          warpConfig.id,
          state.warps[warpIdx].getXAtY(state.height / 2),
          Math.random() * (state.height - 200) + 100,
          story.id,
          prob
        );
        if (stuck) {
          state.stuckNodes.push(stuck);
          state.firstStuckTriggered = true;
        }
      }
    }

    for (const stuck of state.stuckNodes) {
      updateStuckNode(stuck, state.time);
    }

    state.correlations = calculateCorrelations(state.warps, state.width);
    callbacks.onCorrelationChange(state.correlations);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(ctx, state);
      ctx.restore();
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [render, callbacks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    setupCanvas(canvas, w, h);
    stateRef.current = initState(w, h);

    const handleResize = () => {
      const nw = parent.clientWidth;
      const nh = parent.clientHeight;
      setupCanvas(canvas, nw, nh);
      stateRef.current = initState(nw, nh);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const state = stateRef.current;
      if (!state) return;
      state.mouseX = mx;
      state.mouseY = my;

      if (state.draggedWarp >= 0) return;

      let found = -1;
      for (let i = 0; i < state.warps.length; i++) {
        if (state.warps[i].hitTest(mx, my)) {
          found = i;
          break;
        }
      }

      if (found !== state.hoveredWarp) {
        if (state.hoveredWarp >= 0) {
          state.warps[state.hoveredWarp].isHovered = false;
        }
        state.hoveredWarp = found;
        if (found >= 0) {
          state.warps[found].isHovered = true;
          canvas.style.cursor = 'grab';
          callbacks.onWarpHover(found, mx, my);
        } else {
          canvas.style.cursor = 'default';
          callbacks.onWarpUnhover();
        }
      } else if (found >= 0) {
        callbacks.onWarpHover(found, mx, my);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const state = stateRef.current;
      if (!state) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const stuck of state.stuckNodes) {
        if (!stuck.isRevealed) {
          const sx = state.warps[stuck.warpIndex].getXAtY(stuck.y);
          if (Math.abs(mx - sx) < 25 && Math.abs(my - stuck.y) < 25) {
            stuck.isRevealed = true;
            callbacks.onStuckClick(stuck);
            return;
          }
        }
      }

      for (const weft of state.wefts) {
        for (const node of weft.nodes) {
          if (node.alpha > 0 && node.activatedAt > 0) {
            if (Math.abs(mx - node.x) < node.radius && Math.abs(my - node.y) < node.radius) {
              node.isFixed = !node.isFixed;
              callbacks.onNodeClick(node);
              return;
            }
          }
        }
      }

      if (state.hoveredWarp >= 0) {
        state.draggedWarp = state.hoveredWarp;
        state.warps[state.draggedWarp].startDrag(my);
        canvas.style.cursor = 'grabbing';
      }
    };

    const handleMouseUp = () => {
      const state = stateRef.current;
      if (!state || state.draggedWarp < 0) return;
      state.warps[state.draggedWarp].stopDrag();
      state.draggedWarp = -1;
      canvas.style.cursor = state.hoveredWarp >= 0 ? 'grab' : 'default';
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    animRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      cancelAnimationFrame(animRef.current);
    };
  }, [initState, gameLoop, callbacks]);

  const pause = useCallback(() => {
    if (stateRef.current) stateRef.current.isPaused = true;
  }, []);

  const resume = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.isPaused = false;
      stateRef.current.lastTime = performance.now();
    }
  }, []);

  return { canvasRef, pause, resume };
}
