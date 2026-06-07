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

    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#1a1020');
    bgGrad.addColorStop(0.4, '#0d0d1a');
    bgGrad.addColorStop(1, '#0a1520');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const topGlow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 300);
    topGlow.addColorStop(0, 'rgba(155,138,166,0.08)');
    topGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, W, 300);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    const vals = [values.housework, values.childcare, values.emotional, values.workplace, values.community];
    const total = vals.reduce((a, b) => a + b, 0);
    const colors = WARP_COLORS.map(w => w.color);
    const threadXs = [0.2, 0.35, 0.5, 0.65, 0.8].map(p => p * W);

    const weaveTop = 70;
    const weaveHeight = 260;

    const weftCount = Math.max(5, Math.floor(total * 2));
    for (let i = 0; i < weftCount; i++) {
      const y = weaveTop + (i / weftCount) * weaveHeight;
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(W * 0.1, y);
      ctx.lineTo(W * 0.9, y);
      ctx.stroke();
    }

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

      if (val > 0) {
        ctx.globalAlpha = 0.15;
        ctx.shadowColor = colors[i];
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let y = topY; y < topY + threadH; y += 2) {
          const wave = smoothNoise(y * 0.03, i * 100) * 3;
          if (y === topY) ctx.moveTo(x + wave, y);
          else ctx.lineTo(x + wave, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 0.5;
      ctx.fillStyle = colors[i];
      ctx.font = '11px "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(WARP_COLORS[i].label, x, weaveTop - 16);
      if (val > 0) {
        ctx.globalAlpha = 0.7;
        ctx.fillText(`${val}h`, x, topY + threadH + 20);
      }
      ctx.globalAlpha = 1;
    });

    let currentY = weaveTop + weaveHeight + 70;

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '300 18px "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('我承诺：', W / 2, currentY);
    currentY += 40;

    ctx.fillStyle = '#FF8C42';
    ctx.font = '500 22px "PingFang SC", sans-serif';
    const commitText = commitmentType === 'A' ? `让家人承担「${commitmentDetail}」`
      : commitmentType === 'B' ? `每天记录我的无偿劳动`
      : `在生活中推动「${commitmentDetail}」`;
    ctx.fillText(commitText, W / 2, currentY);
    currentY += 55;

    const lineGrad = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W * 0.2, currentY);
    ctx.lineTo(W * 0.8, currentY);
    ctx.stroke();
    currentY += 35;

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '300 14px "PingFang SC", sans-serif';
    ctx.fillText(`现状：每天 ${total.toFixed(1)} 小时无偿劳动`, W / 2, currentY);
    currentY += 26;
    ctx.fillText(`= 每年 ${Math.round(total * 365).toLocaleString()} 小时`, W / 2, currentY);
    currentY += 26;
    const yearlyValue = Math.round(total * 8 * 365 / 100) * 100;
    if (yearlyValue > 0) {
      ctx.fillStyle = 'rgba(255,215,0,0.6)';
      ctx.fillText(`≈ ¥${yearlyValue.toLocaleString()} 被忽略的贡献`, W / 2, currentY);
    }
    currentY += 55;

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = 'italic 300 14px "PingFang SC", sans-serif';
    ctx.fillText('"拉动这根线，图案就会改变"', W / 2, currentY);
    currentY += 55;

    const now = new Date();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '12px "PingFang SC", sans-serif';
    ctx.fillText(`${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`, W / 2, currentY);

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = '11px "PingFang SC", sans-serif';
    ctx.fillText('编织 · 女性劳动的可见化', W / 2, H - 32);
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
      background: 'linear-gradient(165deg, #1a1020 0%, #0d0d1a 40%, #0a1520 100%)',
      zIndex: 8000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 300,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(155,138,166,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 440, margin: '0 auto', padding: '20px 28px 50px', position: 'relative', textAlign: 'center' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: 13, cursor: 'pointer', padding: '12px 0', marginBottom: 24,
          letterSpacing: 1, display: 'block',
        }}>
          ← 重新选择
        </button>

        <p style={{
          color: 'rgba(155,138,166,0.7)', fontSize: 11, letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          STEP 4 / 4
        </p>

        <h2 style={{
          color: '#fff', fontSize: 28, fontWeight: 300, letterSpacing: 1, marginBottom: 28,
          lineHeight: 1.3,
        }}>
          你的承诺卡片
        </h2>

        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 32,
          animation: 'fadeIn 0.6s ease-out',
        }}>
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(155,138,166,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', borderRadius: 20 }} />
          </div>
        </div>

        <button onClick={handleDownload} style={{
          width: '100%', padding: '16px 0', borderRadius: 32,
          background: 'linear-gradient(135deg, #FF8C42 0%, #c4627a 50%, #9B8AA6 100%)',
          border: 'none', color: '#fff', fontSize: 15, fontWeight: 400,
          cursor: 'pointer', letterSpacing: 3,
          boxShadow: '0 8px 30px rgba(255,140,66,0.2)',
          marginBottom: 14,
          animation: 'slideUp 0.4s ease-out 0.3s backwards',
        }}>
          保存为图片
        </button>

        <button onClick={handleCopyText} style={{
          width: '100%', padding: '14px 0', borderRadius: 32,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)', fontSize: 13,
          cursor: 'pointer', letterSpacing: 2,
          marginBottom: 28,
          animation: 'slideUp 0.4s ease-out 0.4s backwards',
        }}>
          复制分享文案
        </button>

        <button onClick={onDone} style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.35)', fontSize: 13,
          cursor: 'pointer', letterSpacing: 1,
          animation: 'slideUp 0.4s ease-out 0.5s backwards',
        }}>
          完成，返回主页 →
        </button>
      </div>
    </div>
  );
}
