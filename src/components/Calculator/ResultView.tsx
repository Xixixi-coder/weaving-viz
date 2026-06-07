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
      background: '#1A1A2E',
      zIndex: 8000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 24px 40px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: 14, cursor: 'pointer', padding: '8px 0', marginBottom: 16,
        }}>
          ← 重新计算
        </button>

        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 300, letterSpacing: 2, marginBottom: 24 }}>
          {total === 0 ? '你的线很轻，但也被看见了' : '这是你的编织'}
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <PersonalWeaveCanvas values={values} width={320} height={280} />
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 20, marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 12 }}>你的数据</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: '#FF8C42', fontSize: 24, fontWeight: 600, margin: 0 }}>{total.toFixed(1)}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>小时/天</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: '#F4A4A4', fontSize: 24, fontWeight: 600, margin: 0 }}>{yearlyHours.toLocaleString()}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>小时/年</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: '#9B8AA6', fontSize: 24, fontWeight: 600, margin: 0 }}>{sleeplessDays}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>不眠日</p>
            </div>
          </div>
        </div>

        {yearlyValue > 0 && (
          <div style={{
            background: 'rgba(255,215,0,0.06)', borderRadius: 12, padding: 20, marginBottom: 20,
            border: '1px solid rgba(255,215,0,0.15)',
          }}>
            <p style={{ color: 'rgba(255,215,0,0.7)', fontSize: 12, marginBottom: 8 }}>价值估算（按最低工资 8元/时）</p>
            <p style={{ color: 'rgba(255,215,0,0.95)', fontSize: 28, fontWeight: 600, margin: 0 }}>
              ¥{yearlyValue.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 400 }}> /年</span>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
              这不是收入，是被忽略的贡献
            </p>
          </div>
        )}

        {entries.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 20, marginBottom: 24,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 12 }}>对比位置</p>
            {entries.map(e => (
              <div key={e.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{e.label}</span>
                </div>
                <span style={{ color: e.color, fontSize: 13 }}>超过 {e.percentile}% 女性</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onNext} style={{
          width: '100%', padding: '14px 0', borderRadius: 28,
          background: 'linear-gradient(135deg, #FF8C42, #9B8AA6)',
          border: 'none', color: '#fff', fontSize: 15, fontWeight: 500,
          cursor: 'pointer', letterSpacing: 2, marginBottom: 12,
        }}>
          做出承诺
        </button>

        <button onClick={onGenerateCard} style={{
          width: '100%', padding: '10px 0',
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', fontSize: 13,
          cursor: 'pointer', textDecoration: 'underline',
        }}>
          直接生成分享卡片
        </button>
      </div>
    </div>
  );
}
