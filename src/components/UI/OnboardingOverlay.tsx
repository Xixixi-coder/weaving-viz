import { useState } from 'react';

interface OnboardingOverlayProps {
  onDismiss: () => void;
}

export function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0);
  const [pressing, setPressing] = useState(false);

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

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onDismiss();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,26,46,0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
      onClick={handleNext}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
    >
      <div style={{
        textAlign: 'center',
        maxWidth: 400,
        padding: 40,
        transition: 'transform 0.15s, opacity 0.15s',
        transform: pressing ? 'scale(0.97)' : 'scale(1)',
        opacity: pressing ? 0.8 : 1,
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 24,
          opacity: 0.8,
          letterSpacing: 8,
          fontFamily: 'monospace',
          color: '#fff',
          transition: 'opacity 0.3s',
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

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === step ? '#FF8C42' : 'rgba(255,255,255,0.3)',
              transition: 'background 0.3s, transform 0.3s',
              transform: i === step ? 'scale(1.3)' : 'scale(1)',
            }} />
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{
            background: 'rgba(255,140,66,0.15)',
            border: '1px solid rgba(255,140,66,0.5)',
            color: '#FF8C42',
            padding: '10px 32px',
            borderRadius: 24,
            cursor: 'pointer',
            fontSize: 14,
            letterSpacing: 3,
            transition: 'all 0.2s',
            marginBottom: 12,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = 'rgba(255,140,66,0.3)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = 'rgba(255,140,66,0.15)';
          }}
        >
          {step < steps.length - 1 ? '下一步' : '开始探索'}
        </button>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 8 }}>
          点击任意位置或按钮继续
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
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.6)';
          (e.target as HTMLElement).style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
          (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
        }}
      >
        跳过
      </button>
    </div>
  );
}
