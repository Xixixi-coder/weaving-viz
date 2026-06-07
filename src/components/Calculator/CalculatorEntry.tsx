interface CalculatorEntryProps {
  onClick: () => void;
}

export function CalculatorEntry({ onClick }: CalculatorEntryProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 700,
    }}>
      <button
        onClick={onClick}
        style={{
          background: 'rgba(26,26,46,0.85)',
          border: '1px solid rgba(255,140,66,0.4)',
          color: '#FF8C42',
          padding: '12px 28px',
          borderRadius: 28,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 2,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s',
          animation: 'breathe 3s ease-in-out infinite',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = 'rgba(255,140,66,0.15)';
          el.style.borderColor = 'rgba(255,140,66,0.7)';
          el.innerText = '开始编织';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = 'rgba(26,26,46,0.85)';
          el.style.borderColor = 'rgba(255,140,66,0.4)';
          el.innerText = '计算我的线';
        }}
      >
        计算我的线
      </button>
      <p style={{
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        marginTop: 8,
      }}>
        2分钟 · 5步
      </p>
    </div>
  );
}
