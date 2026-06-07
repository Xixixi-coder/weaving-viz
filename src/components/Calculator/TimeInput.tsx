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
  const totalColor = total > 8 ? '#E74C3C' : total > 6 ? '#FF8C42' : 'rgba(255,255,255,0.9)';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(165deg, #1a1020 0%, #0d0d1a 40%, #0a1520 100%)',
      zIndex: 8000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 300,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 440, margin: '0 auto', padding: '20px 28px 140px', position: 'relative' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: 13, cursor: 'pointer', padding: '12px 0', marginBottom: 24,
          letterSpacing: 1,
        }}>
          ← 返回
        </button>

        <p style={{
          color: 'rgba(255,140,66,0.7)', fontSize: 11, letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          STEP 1 / 4
        </p>

        <h2 style={{
          color: '#fff', fontSize: 28, fontWeight: 300, letterSpacing: 1, marginBottom: 8,
          lineHeight: 1.3,
        }}>
          你的线，<br />有多长？
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 40, lineHeight: 1.6 }}>
          估算过去一周，你平均每天在这些事上花多少时间
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 20,
          padding: '28px 24px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
        }}>
          {WARP_COLORS.map(config => (
            <WarpSlider
              key={config.id}
              type={config.id}
              value={values[config.id]}
              onChange={onChange}
            />
          ))}
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(13,13,26,0.95) 30%)',
        padding: '50px 28px 28px',
        zIndex: 8001,
      }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16,
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: 2 }}>每日总计</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                color: totalColor, fontSize: 36, fontWeight: 200,
                fontVariantNumeric: 'tabular-nums',
                transition: 'color 0.3s',
              }}>
                {total.toFixed(1)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>h</span>
            </div>
          </div>
          {total > 8 && (
            <p style={{
              color: '#E74C3C', fontSize: 11, marginBottom: 8, textAlign: 'right',
              letterSpacing: 1, animation: 'fadeIn 0.3s',
            }}>
              时间贫困预警
            </p>
          )}
          <button onClick={onNext} style={{
            width: '100%', padding: '16px 0', borderRadius: 32,
            background: total > 0
              ? 'linear-gradient(135deg, #FF8C42 0%, #c4627a 50%, #9B8AA6 100%)'
              : 'rgba(255,255,255,0.06)',
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 400,
            cursor: 'pointer', letterSpacing: 3,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: total > 0 ? '0 8px 30px rgba(255,140,66,0.2)' : 'none',
          }}>
            查看我的编织
          </button>
        </div>
      </div>
    </div>
  );
}
