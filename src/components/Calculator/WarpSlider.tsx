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

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: config.color }} />
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{config.label}</span>
        </div>
        <span style={{ color: config.color, fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {value.toFixed(1)}h
        </span>
      </div>

      <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2,
          background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute', left: 0, height: 4, borderRadius: 2,
          width: `${(value / 8) * 100}%`,
          background: `${config.color}80`,
          transition: 'width 0.1s',
        }} />

        <div style={{
          position: 'absolute',
          left: `${avgPct}%`,
          top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          pointerEvents: 'none',
          transform: 'translateX(-50%)',
        }}>
          <div style={{ width: 1, height: '100%', background: 'rgba(255,255,255,0.3)' }} />
        </div>

        <input
          type="range"
          min="0" max="8" step="0.5"
          value={value}
          onChange={(e) => onChange(type, parseFloat(e.target.value))}
          style={{
            position: 'relative', width: '100%', height: 32,
            appearance: 'none', WebkitAppearance: 'none',
            background: 'transparent', cursor: 'pointer', zIndex: 1,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{desc}</span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>平均 {benchmark.avg}h</span>
      </div>
    </div>
  );
}
