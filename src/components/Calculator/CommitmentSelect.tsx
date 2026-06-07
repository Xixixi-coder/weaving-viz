import { useState } from 'react';
import type { LaborValues } from '../../data/benchmark';
import { COMMITMENTS, recommendCommitment } from '../../data/benchmark';

interface CommitmentSelectProps {
  values: LaborValues;
  onSelect: (type: 'A' | 'B' | 'C', detail: string) => void;
  onBack: () => void;
}

export function CommitmentSelect({ values, onSelect, onBack }: CommitmentSelectProps) {
  const recommendation = recommendCommitment(values);
  const [selected, setSelected] = useState<'A' | 'B' | 'C'>(recommendation.type);
  const [detail, setDetail] = useState('');

  const selectedCommitment = COMMITMENTS.find(c => c.type === selected)!;

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
          ← 返回结果
        </button>

        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 300, letterSpacing: 2, marginBottom: 8 }}>
          你愿意拉动哪根线？
        </h2>
        <p style={{ color: 'rgba(255,140,66,0.8)', fontSize: 13, marginBottom: 28 }}>
          推荐：{recommendation.reason}
        </p>

        {COMMITMENTS.map(c => {
          const isSelected = selected === c.type;
          const isRecommended = recommendation.type === c.type;
          return (
            <div
              key={c.type}
              onClick={() => setSelected(c.type)}
              style={{
                background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                border: isSelected ? '1px solid rgba(255,140,66,0.5)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: 20, marginBottom: 12, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: isSelected ? '2px solid #FF8C42' : '2px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF8C42' }} />}
                </div>
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{c.title}</span>
                {isRecommended && (
                  <span style={{
                    fontSize: 10, color: '#FF8C42', border: '1px solid #FF8C4250',
                    padding: '2px 8px', borderRadius: 10,
                  }}>
                    推荐
                  </span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 0 28px' }}>
                {c.description}
              </p>
            </div>
          );
        })}

        <div style={{ marginTop: 20, marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>选择具体行动：</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedCommitment.details.map(d => (
              <button
                key={d}
                onClick={() => setDetail(detail === d ? '' : d)}
                style={{
                  padding: '6px 14px', borderRadius: 16, fontSize: 13, cursor: 'pointer',
                  background: detail === d ? 'rgba(255,140,66,0.2)' : 'rgba(255,255,255,0.05)',
                  border: detail === d ? '1px solid rgba(255,140,66,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: detail === d ? '#FF8C42' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSelect(selected, detail || selectedCommitment.details[0])}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 28,
            background: 'linear-gradient(135deg, #FF8C42, #9B8AA6)',
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 500,
            cursor: 'pointer', letterSpacing: 2,
          }}
        >
          生成我的承诺卡片
        </button>
      </div>
    </div>
  );
}
