import { useState } from 'react';

interface OnboardingOverlayProps {
  onDismiss: () => void;
}

export function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '每一根线，都是一种劳动',
      desc: '五根经线代表五种女性劳动类型——家务、育儿、情感、职场、社区',
      icon: '|||||',
    },
    {
      title: '拉动，发现关联',
      desc: '拖拽经线改变它们的距离，观察劳动类型间的隐形关联',
      icon: '↔',
    },
    {
      title: '卡线处，有故事',
      desc: '当织线卡住时，点击它——那里有真实的声音等待被听见',
      icon: '●',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,26,46,0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 900,
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => {
        if (step < steps.length - 1) setStep(step + 1);
        else onDismiss();
      }}
    >
      <div style={{
        textAlign: 'center',
        maxWidth: 400,
        padding: 40,
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 24,
          opacity: 0.8,
          letterSpacing: 8,
          fontFamily: 'monospace',
        }}>
          {steps[step].icon}
        </div>

        <h2 style={{
          color: '#fff',
          fontSize: 22,
          fontWeight: 300,
          marginBottom: 16,
          letterSpacing: 2,
        }}>
          {steps[step].title}
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 14,
          lineHeight: 1.8,
          marginBottom: 32,
        }}>
          {steps[step].desc}
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === step ? '#FF8C42' : 'rgba(255,255,255,0.3)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          {step < steps.length - 1 ? '点击继续' : '点击开始探索'}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        style={{
          position: 'absolute',
          top: 30,
          right: 30,
          background: 'none',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'rgba(255,255,255,0.6)',
          padding: '6px 16px',
          borderRadius: 20,
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        跳过
      </button>
    </div>
  );
}
