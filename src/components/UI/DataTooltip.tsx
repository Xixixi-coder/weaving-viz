import { WARP_COLORS } from '../../data/colors';

interface DataTooltipProps {
  warpIndex: number;
  x: number;
  y: number;
  visible: boolean;
}

export function DataTooltip({ warpIndex, x, y, visible }: DataTooltipProps) {
  if (!visible || warpIndex < 0) return null;

  const config = WARP_COLORS[warpIndex];

  return (
    <div style={{
      position: 'fixed',
      left: x + 20,
      top: y - 30,
      background: 'rgba(22, 33, 62, 0.95)',
      border: `1px solid ${config.color}50`,
      borderRadius: 8,
      padding: '12px 16px',
      pointerEvents: 'none',
      zIndex: 700,
      minWidth: 160,
      backdropFilter: 'blur(4px)',
      transition: 'opacity 0.2s',
      opacity: visible ? 1 : 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: config.color,
        }} />
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{config.label}</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>
        {config.description}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '6px 0 0', fontStyle: 'italic' }}>
        拖拽以探索关联
      </p>
    </div>
  );
}
