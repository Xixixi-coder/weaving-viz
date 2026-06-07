import { useRef, useEffect } from 'react';
import type { LaborValues } from '../../data/benchmark';
import { WARP_COLORS } from '../../data/colors';
import { smoothNoise } from '../../utils/math';

interface PersonalWeaveCanvasProps {
  values: LaborValues;
  width?: number;
  height?: number;
}

export function PersonalWeaveCanvas({ values, width = 300, height = 300 }: PersonalWeaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const vals = [values.housework, values.childcare, values.emotional, values.workplace, values.community];
    const total = vals.reduce((a, b) => a + b, 0);
    const maxVal = 8;
    const colors = WARP_COLORS.map(w => w.color);
    const threadXPositions = [0.2, 0.35, 0.5, 0.65, 0.8].map(p => p * width);

    let time = 0;

    function draw() {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#1A1A2E';
      ctx.fillRect(0, 0, width, height);

      const stressIndex = total > 0 ? (vals[0] + vals[1] + vals[2]) / total : 0;
      if (stressIndex > 0.6) {
        ctx.fillStyle = `rgba(231, 76, 60, ${(stressIndex - 0.6) * 0.12})`;
        ctx.fillRect(0, 0, width, height);
      }

      const weftCount = Math.max(3, Math.floor(total * 1.5));
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < weftCount; i++) {
        const seed = i * 73.37;
        const baseY = (height * 0.15) + ((i / weftCount) * height * 0.7);
        const y = baseY + smoothNoise(time * 0.3 + seed, seed) * 3;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(width * 0.08, y);

        let above = i % 2 === 0;
        for (let j = 0; j < threadXPositions.length; j++) {
          const tx = threadXPositions[j];
          if (vals[j] > 0) {
            const offset = above ? -2 : 2;
            ctx.lineTo(tx - 5, y);
            ctx.lineTo(tx, y + offset);
            ctx.lineTo(tx + 5, y);
            above = !above;
          }
        }
        ctx.lineTo(width * 0.92, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      threadXPositions.forEach((x, i) => {
        const val = vals[i];
        if (val === 0) {
          ctx.globalAlpha = 0.15;
          ctx.strokeStyle = colors[i];
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.moveTo(x, height * 0.15);
          ctx.lineTo(x, height * 0.85);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          return;
        }

        const threadHeight = Math.max(0.1, val / maxVal) * (height * 0.7);
        const topY = height / 2 - threadHeight / 2;
        const lineWidth = 1.5 + (val / maxVal) * 3;

        ctx.strokeStyle = colors[i];
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        for (let y = topY; y < topY + threadHeight; y += 2) {
          const wave = smoothNoise(time + y * 0.04, i * 100) * 4;
          if (y === topY) ctx.moveTo(x + wave, y);
          else ctx.lineTo(x + wave, y);
        }
        ctx.stroke();

        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        for (let y = topY; y < topY + threadHeight; y += 2) {
          const wave = smoothNoise(time + y * 0.04, i * 100) * 2.5;
          if (y === topY) ctx.moveTo(x + wave, y);
          else ctx.lineTo(x + wave, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = colors[i];
        ctx.globalAlpha = 0.7;
        ctx.font = '10px "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(WARP_COLORS[i].label, x, topY - 8);
        ctx.font = 'bold 11px "PingFang SC", sans-serif';
        ctx.globalAlpha = 0.9;
        ctx.fillText(`${val}h`, x, topY + threadHeight + 16);
        ctx.globalAlpha = 1;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [values, width, height]);

  return <canvas ref={canvasRef} style={{ borderRadius: 12 }} />;
}
