import { WARP_COLORS } from '../../data/colors';
import type { WarpType } from '../../data/colors';
import type { LaborValues } from '../../data/benchmark';
import { WarpSlider } from './WarpSlider';

interface TimeInputProps {
  values: LaborValues;
  onChange: (type: WarpType, value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TimeInput({ values, onChange, onNext, onBack }: TimeInputProps) {
  const total = Object.values(values).reduce((a, b) => a + b, 0);
  const totalColor = total > 8 ? '#E74C3C' : total > 6 ? '#FF8C42' : '#fff';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#1A1A2E',
      zIndex: 8000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 24px 120px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: 14, cursor: 'pointer', padding: '8px 0', marginBottom: 16,
        }}>
          ← 返回
        </button>

        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 300, letterSpacing: 2, marginBottom: 8 }}>
          你的线，有多长？
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 32 }}>
          估算过去一周，你平均每天在这些事上花多少时间
        </p>

        {WARP_COLORS.map(config => (
          <WarpSlider
            key={config.id}
            type={config.id}
            value={values[config.id]}
            onChange={onChange}
          />
        ))}

        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, #1A1A2E 20%)',
          padding: '40px 24px 24px',
          zIndex: 8001,
        }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>总计</span>
              <div>
                <span style={{ color: totalColor, fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {total.toFixed(1)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginLeft: 4 }}>小时/天</span>
              </div>
            </div>
            {total > 8 && (
              <p style={{ color: '#E74C3C', fontSize: 12, marginBottom: 8, textAlign: 'right' }}>
                时间贫困预警
              </p>
            )}
            <button onClick={onNext} style={{
              width: '100%', padding: '14px 0', borderRadius: 28,
              background: total > 0 ? 'linear-gradient(135deg, #FF8C42, #9B8AA6)' : 'rgba(255,255,255,0.1)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 500,
              cursor: 'pointer', letterSpacing: 2, transition: 'all 0.3s',
            }}>
              查看我的编织
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
