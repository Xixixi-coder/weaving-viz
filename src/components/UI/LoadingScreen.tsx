import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    tl.to({}, {
      duration: 2.5,
      onUpdate: function () {
        setProgress(Math.round(this.progress() * 100));
      },
    });

    tl.to({}, { duration: 0.5 });

    return () => { tl.kill(); };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#1A1A2E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      transition: 'opacity 0.5s',
    }}>
      <div style={{ marginBottom: 40 }}>
        <svg width="120" height="80" viewBox="0 0 120 80">
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={20 + i * 20}
              y1="10"
              x2={20 + i * 20}
              y2="70"
              stroke={['#FF8C42', '#F4A4A4', '#9B8AA6', '#6B7B8C', '#5C8D89'][i]}
              strokeWidth="2"
              opacity={progress > i * 20 ? 1 : 0.2}
            />
          ))}
          {progress > 30 && (
            <line x1="10" y1={10 + (progress / 100) * 60} x2="110" y2={10 + (progress / 100) * 60} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          )}
        </svg>
      </div>

      <p style={{ color: '#e0e0e0', fontSize: 16, letterSpacing: 4, marginBottom: 20 }}>
        正在编织数据…
      </p>

      <div style={{ width: 200, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FF8C42, #9B8AA6)',
          borderRadius: 1,
          transition: 'width 0.1s',
        }} />
      </div>
    </div>
  );
}
