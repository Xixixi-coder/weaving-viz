import type { LaborValues } from '../../data/benchmark';
import { getPercentile } from '../../data/benchmark';
import { WARP_COLORS } from '../../data/colors';
import { PersonalWeaveCanvas } from './PersonalWeaveCanvas';

interface ResultViewProps {
  values: LaborValues;
  onNext: () => void;
  onBack: () => void;
  onGenerateCard: () => void;
}

export function ResultView({ values, onNext, onBack, onGenerateCard }: ResultViewProps) {
  const total = Object.values(values).reduce((a, b) => a + b, 0);
  const yearlyHours = Math.round(total * 365);
  const yearlyValue = Math.round(total * 8 * 365 / 100) * 100;
  const sleeplessDays = (total * 365 / 24).toFixed(1);

  const entries = (Object.entries(values) as [string, number][])
    .filter(([_, v]) => v > 0)
    .map(([type, v]) => {
      const config = WARP_COLORS.find(w => w.id === type)!;
      const pct = getPercentile(v, type as any);
      return { type, label: config.label, color: config.color, value: v, percentile: pct };
    });

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(165deg, #1a1020 0%, #0d0d1a 40%, #0a1520 100%)',
      zIndex: 8000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 400,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(155,138,166,0.1) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 440, margin: '0 auto', padding: '20px 28px 50px', position: 'relative' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: 13, cursor: 'pointer', padding: '12px 0', marginBottom: 24,
          letterSpacing: 1,
        }}>
          ← 重新计算
        </button>

        <p style={{
          color: 'rgba(155,138,166,0.7)', fontSize: 11, letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          STEP 2 / 4
        </p>

        <h2 style={{
          color: '#fff', fontSize: 28, fontWeight: 300, letterSpacing: 1, marginBottom: 28,
          lineHeight: 1.3,
        }}>
          {total === 0 ? '你的线很轻，\n但也被看见了' : '这是你的编织'}
        </h2>

        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 32,
          animation: 'fadeIn 0.6s ease-out',
        }}>
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(155,138,166,0.08)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <PersonalWeaveCanvas values={values} width={340} height={300} />
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
          marginBottom: 20, animation: 'slideUp 0.5s ease-out 0.2s backwards',
        }}>
          {[
            { value: total.toFixed(1), unit: 'h/天', color: '#FF8C42' },
            { value: yearlyHours.toLocaleString(), unit: 'h/年', color: '#F4A4A4' },
            { value: sleeplessDays, unit: '不眠日', color: '#9B8AA6' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 16, padding: '20px 12px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p style={{
                color: stat.color, fontSize: 22, fontWeight: 300, margin: 0,
                fontVariantNumeric: 'tabular-nums',
                animation: 'numberPop 0.4s ease-out backwards',
                animationDelay: `${0.3 + i * 0.1}s`,
              }}>
                {stat.value}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: '6px 0 0', letterSpacing: 1 }}>
                {stat.unit}
              </p>
            </div>
          ))}
        </div>

        {yearlyValue > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.04) 0%, rgba(255,140,66,0.04) 100%)',
            borderRadius: 20, padding: '24px 24px',
            marginBottom: 20,
            border: '1px solid rgba(255,215,0,0.1)',
            animation: 'slideUp 0.5s ease-out 0.4s backwards',
          }}>
            <p style={{
              color: 'rgba(255,215,0,0.5)', fontSize: 10, marginBottom: 10,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>
              价值估算 · 按最低工资 8元/时
            </p>
            <p style={{ color: 'rgba(255,215,0,0.9)', fontSize: 32, fontWeight: 200, margin: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}>¥</span>
              {yearlyValue.toLocaleString()}
              <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.4 }}> /年</span>
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 12,
              fontStyle: 'italic', letterSpacing: 1,
            }}>
              这不是收入，是被忽略的贡献
            </p>
          </div>
        )}

        {entries.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 20, padding: '20px 24px',
            marginBottom: 28,
            border: '1px solid rgba(255,255,255,0.04)',
            animation: 'slideUp 0.5s ease-out 0.5s backwards',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 16,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>
              你的位置
            </p>
            {entries.map((e, i) => (
              <div key={e.type} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: e.color,
                    boxShadow: `0 0 6px ${e.color}60`,
                  }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, letterSpacing: 0.5 }}>
                    {e.label}
                  </span>
                </div>
                <div style={{
                  background: `${e.color}12`,
                  padding: '4px 12px',
                  borderRadius: 10,
                }}>
                  <span style={{ color: e.color, fontSize: 12, fontWeight: 500 }}>
                    超过 {e.percentile}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={onNext} style={{
          width: '100%', padding: '16px 0', borderRadius: 32,
          background: 'linear-gradient(135deg, #FF8C42 0%, #c4627a 50%, #9B8AA6 100%)',
          border: 'none', color: '#fff', fontSize: 15, fontWeight: 400,
          cursor: 'pointer', letterSpacing: 3,
          boxShadow: '0 8px 30px rgba(255,140,66,0.2)',
          marginBottom: 14,
        }}>
          做出承诺
        </button>

        <button onClick={onGenerateCard} style={{
          width: '100%', padding: '12px 0',
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.35)', fontSize: 13,
          cursor: 'pointer', letterSpacing: 1,
        }}>
          跳过，直接生成卡片 →
        </button>
      </div>
    </div>
  );
}
