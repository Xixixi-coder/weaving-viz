import { WARP_COLORS } from '../../data/colors';

export function Legend() {
  return (
    <div style={{
      position: 'fixed',
      left: 24,
      bottom: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      zIndex: 600,
      opacity: 0.8,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 4, letterSpacing: 1 }}>
        经线 · WARP
      </p>
      {WARP_COLORS.map((config) => (
        <div key={config.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 20,
            height: 3,
            borderRadius: 2,
            background: config.color,
          }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            {config.label}
          </span>
        </div>
      ))}
    </div>
  );
}
