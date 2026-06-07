import { useRef, useEffect, useCallback } from 'react';
import type { LaborValues } from '../../data/benchmark';
import { WARP_COLORS } from '../../data/colors';
import { smoothNoise } from '../../utils/math';

interface CardExportProps {
  values: LaborValues;
  commitmentType: 'A' | 'B' | 'C';
  commitmentDetail: string;
  onBack: () => void;
  onDone: () => void;
}

const COMMITMENT_TITLES = { A: '重新分配', B: '记录劳动', C: '推动改变' };

export function CardExport({ values, commitmentType, commitmentDetail, onBack, onDone }: CardExportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 600;
    const H = 800;
    const dpr = 2;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = `${W / 2}px`;
    canvas.style.height = 'auto';

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    const vals = [values.housework, values.childcare, values.emotional, values.workplace, values.community];
    const total = vals.reduce((a, b) => a + b, 0);
    const colors = WARP_COLORS.map(w => w.color);
    const threadXs = [0.2, 0.35, 0.5, 0.65, 0.8].map(p => p * W);

    const weaveTop = 60;
    const weaveHeight = 280;

    const weftCount = Math.max(5, Math.floor(total * 2));
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < weftCount; i++) {
      const y = weaveTop + (i / weftCount) * weaveHeight;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(W * 0.08, y);
      ctx.lineTo(W * 0.92, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    threadXs.forEach((x, i) => {
      const val = vals[i];
      const threadH = Math.max(20, (val / 8) * weaveHeight);
      const topY = weaveTop + (weaveHeight - threadH) / 2;

      ctx.strokeStyle = colors[i];
      ctx.lineWidth = val > 0 ? 2 + (val / 8) * 3 : 1;
      ctx.globalAlpha = val > 0 ? 0.85 : 0.2;

      ctx.beginPath();
      for (let y = topY; y < topY + threadH; y += 2) {
        const wave = smoothNoise(y * 0.03, i * 100) * 3;
        if (y === topY) ctx.moveTo(x + wave, y);
        else ctx.lineTo(x + wave, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = colors[i];
      ctx.font = '11px "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.6;
      ctx.fillText(WARP_COLORS[i].label, x, weaveTop - 12);
      if (val > 0) {
        ctx.globalAlpha = 0.8;
        ctx.fillText(`${val}h`, x, topY + threadH + 18);
      }
      ctx.globalAlpha = 1;
    });

    let currentY = weaveTop + weaveHeight + 60;

    ctx.fillStyle = '#fff';
    ctx.font = '18px "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('我承诺：', W / 2, currentY);
    currentY += 36;

    ctx.fillStyle = '#FF8C42';
    ctx.font = 'bold 20px "PingFang SC", sans-serif';
    const commitText = commitmentType === 'A' ? `让家人承担「${commitmentDetail}」`
      : commitmentType === 'B' ? `每天记录我的无偿劳动`
      : `在生活中推动「${commitmentDetail}」`;
    ctx.fillText(commitText, W / 2, currentY);
    currentY += 50;

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(W * 0.2, currentY);
    ctx.lineTo(W * 0.8, currentY);
    ctx.stroke();
    currentY += 30;

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px "PingFang SC", sans-serif';
    ctx.fillText(`现状：每天 ${total.toFixed(1)} 小时无偿劳动`, W / 2, currentY);
    currentY += 24;
    ctx.fillText(`= 每年 ${Math.round(total * 365).toLocaleString()} 小时`, W / 2, currentY);
    currentY += 24;
    const yearlyValue = Math.round(total * 8 * 365 / 100) * 100;
    if (yearlyValue > 0) {
      ctx.fillText(`≈ ¥${yearlyValue.toLocaleString()} 被忽略的贡献`, W / 2, currentY);
    }
    currentY += 50;

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'italic 14px "PingFang SC", sans-serif';
    ctx.fillText('"拉动这根线，图案就会改变"', W / 2, currentY);
    currentY += 50;

    const now = new Date();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '12px "PingFang SC", sans-serif';
    ctx.fillText(`${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`, W / 2, currentY);
    currentY += 30;

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '11px "PingFang SC", sans-serif';
    ctx.fillText('编织 · 女性劳动的可见化', W / 2, H - 30);
  }, [values, commitmentType, commitmentDetail]);

  useEffect(() => { drawCard(); }, [drawCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `我的承诺-编织-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const total = Object.values(values).reduce((a, b) => a + b, 0);
  const shareCopy = `我计算了自己的无偿劳动时间：${total.toFixed(1)}小时/天。这不是"帮忙"，是被忽略的贡献。我承诺：${COMMITMENT_TITLES[commitmentType]}。你的线有多长？`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareCopy).then(() => {
      alert('已复制到剪贴板');
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#1A1A2E',
      zIndex: 8000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 24px 40px', textAlign: 'center' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: 14, cursor: 'pointer', padding: '8px 0', marginBottom: 16,
          display: 'block',
        }}>
          ← 重新选择
        </button>

        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 300, letterSpacing: 2, marginBottom: 24 }}>
          你的承诺
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <canvas ref={canvasRef} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>

        <button onClick={handleDownload} style={{
          width: '100%', padding: '14px 0', borderRadius: 28,
          background: 'linear-gradient(135deg, #FF8C42, #9B8AA6)',
          border: 'none', color: '#fff', fontSize: 15, fontWeight: 500,
          cursor: 'pointer', letterSpacing: 2, marginBottom: 12,
        }}>
          保存为图片
        </button>

        <button onClick={handleCopyText} style={{
          width: '100%', padding: '10px 0',
          background: 'none', border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.6)', fontSize: 13, borderRadius: 28,
          cursor: 'pointer', marginBottom: 24,
        }}>
          复制分享文案
        </button>

        <button onClick={onDone} style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.4)', fontSize: 14,
          cursor: 'pointer', textDecoration: 'underline',
        }}>
          完成，返回主页
        </button>
      </div>
    </div>
  );
}
