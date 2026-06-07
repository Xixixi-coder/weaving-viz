interface CalculatorEntryProps {
  onClick: () => void;
}

export function CalculatorEntry({ onClick }: CalculatorEntryProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 36,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 700,
      animation: 'breathe 3s ease-in-out infinite',
    }}>
      <button
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,46,0.9), rgba(22,33,62,0.95))',
          border: '1px solid rgba(255,140,66,0.4)',
          color: '#FF8C42',
          padding: '14px 36px',
          borderRadius: 32,
          cursor: 'pointer',
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: 3,
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = 'linear-gradient(135deg, rgba(255,140,66,0.15), rgba(155,138,166,0.15))';
          el.style.borderColor = 'rgba(255,140,66,0.8)';
          el.style.color = '#FFB347';
          el.style.boxShadow = '0 0 40px rgba(255,140,66,0.25), inset 0 0 20px rgba(255,140,66,0.05)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = 'linear-gradient(135deg, rgba(26,26,46,0.9), rgba(22,33,62,0.95))';
          el.style.borderColor = 'rgba(255,140,66,0.4)';
          el.style.color = '#FF8C42';
          el.style.boxShadow = '';
        }}
      >
        计算我的线
      </button>
      <p style={{
        textAlign: 'center',
        color: 'rgba(255,255,255,0.25)',
        fontSize: 11,
        marginTop: 10,
        letterSpacing: 1,
      }}>
        2分钟 · 发现你的编织
      </p>
    </div>
  );
}
