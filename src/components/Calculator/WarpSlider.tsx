import type { WarpType } from '../../data/colors';
import { WARP_COLORS } from '../../data/colors';
import { BENCHMARK, SLIDER_DESCRIPTIONS } from '../../data/benchmark';

interface WarpSliderProps {
  type: WarpType;
  value: number;
  onChange: (type: WarpType, value: number) => void;
}

export function WarpSlider({ type, value, onChange }: WarpSliderProps) {
  const config = WARP_COLORS.find(w => w.id === type)!;
  const benchmark = BENCHMARK[type];
  const desc = SLIDER_DESCRIPTIONS[type];
  const avgPct = (benchmark.avg / 8) * 100;
  const fillPct = (value / 8) * 100;

  return (
    <div style={{ marginBottom: 28, animation: 'slideUp 0.4s ease-out backwards' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: config.color,
            boxShadow: value > 0 ? `0 0 8px ${config.color}80` : 'none',
            transition: 'box-shadow 0.3s',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 400, letterSpacing: 1 }}>
            {config.label}
          </span>
        </div>
        <div style={{
          background: value > 0 ? `${config.color}15` : 'transparent',
          padding: '3px 12px',
          borderRadius: 12,
          transition: 'all 0.2s',
        }}>
          <span style={{
            color: value > 0 ? config.color : 'rgba(255,255,255,0.3)',
            fontSize: 17, fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.2s',
          }}>
            {value.toFixed(1)}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginLeft: 2 }}>h</span>
        </div>
      </div>

      <div style={{ position: 'relative', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 3, borderRadius: 3,
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', left: 0, height: 3, borderRadius: 3,
          width: `${fillPct}%`,
          background: `linear-gradient(90deg, ${config.color}60, ${config.color})`,
          transition: 'width 0.15s',
          boxShadow: value > 0 ? `0 0 8px ${config.color}30` : 'none',
        }} />

        <div style={{
          position: 'absolute',
          left: `${avgPct}%`,
          top: 6, bottom: 6,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 1, height: '100%',
            background: 'rgba(255,255,255,0.15)',
          }} />
          <div style={{
            position: 'absolute', top: -14,
            left: '50%', transform: 'translateX(-50%)',
            fontSize: 9, color: 'rgba(255,255,255,0.2)',
            whiteSpace: 'nowrap',
          }}>
            {benchmark.avg}
          </div>
        </div>

        <input
          type="range"
          min="0" max="8" step="0.5"
          value={value}
          onChange={(e) => onChange(type, parseFloat(e.target.value))}
          style={{
            position: 'relative', width: '100%', height: 36,
            appearance: 'none', WebkitAppearance: 'none',
            background: 'transparent', cursor: 'pointer', zIndex: 1,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{desc}</span>
      </div>
    </div>
  );
}
