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
      background: 'linear-gradient(165deg, #1a1020 0%, #0d0d1a 40%, #0a1520 100%)',
      zIndex: 8000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 350,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 440, margin: '0 auto', padding: '20px 28px 50px', position: 'relative' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: 13, cursor: 'pointer', padding: '12px 0', marginBottom: 24,
          letterSpacing: 1,
        }}>
          ← 返回结果
        </button>

        <p style={{
          color: 'rgba(255,140,66,0.7)', fontSize: 11, letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          STEP 3 / 4
        </p>

        <h2 style={{
          color: '#fff', fontSize: 28, fontWeight: 300, letterSpacing: 1, marginBottom: 8,
          lineHeight: 1.3,
        }}>
          你愿意拉动<br />哪根线？
        </h2>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,140,66,0.08)',
          border: '1px solid rgba(255,140,66,0.15)',
          borderRadius: 20, padding: '6px 14px',
          marginBottom: 32,
          animation: 'fadeIn 0.4s ease-out',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#FF8C42',
            boxShadow: '0 0 6px rgba(255,140,66,0.5)',
          }} />
          <span style={{ color: 'rgba(255,140,66,0.85)', fontSize: 12, letterSpacing: 0.5 }}>
            推荐：{recommendation.reason}
          </span>
        </div>

        <div style={{ marginBottom: 24 }}>
          {COMMITMENTS.map((c, idx) => {
            const isSelected = selected === c.type;
            const isRecommended = recommendation.type === c.type;
            return (
              <div
                key={c.type}
                onClick={() => setSelected(c.type)}
                style={{
                  background: isSelected
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.02)',
                  border: isSelected
                    ? '1px solid rgba(255,140,66,0.4)'
                    : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 18, padding: '20px 22px', marginBottom: 12,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `slideUp 0.4s ease-out ${0.1 + idx * 0.08}s backwards`,
                  boxShadow: isSelected ? '0 4px 20px rgba(255,140,66,0.08)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: isSelected ? '2px solid #FF8C42' : '2px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                    background: isSelected ? 'rgba(255,140,66,0.08)' : 'transparent',
                  }}>
                    {isSelected && (
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: '#FF8C42',
                        boxShadow: '0 0 6px rgba(255,140,66,0.5)',
                      }} />
                    )}
                  </div>
                  <span style={{
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.75)',
                    fontSize: 15, fontWeight: 400, letterSpacing: 0.5,
                    transition: 'color 0.2s',
                  }}>
                    {c.title}
                  </span>
                  {isRecommended && (
                    <span style={{
                      fontSize: 10, color: '#FF8C42',
                      background: 'rgba(255,140,66,0.1)',
                      border: '1px solid rgba(255,140,66,0.25)',
                      padding: '3px 10px', borderRadius: 12,
                      letterSpacing: 1,
                    }}>
                      推荐
                    </span>
                  )}
                </div>
                <p style={{
                  color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 0 34px',
                  lineHeight: 1.5, letterSpacing: 0.3,
                }}>
                  {c.description}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 18, padding: '20px 22px',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 28,
          animation: 'slideUp 0.4s ease-out 0.4s backwards',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 14,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            选择具体行动
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedCommitment.details.map(d => (
              <button
                key={d}
                onClick={() => setDetail(detail === d ? '' : d)}
                style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                  background: detail === d ? 'rgba(255,140,66,0.12)' : 'rgba(255,255,255,0.04)',
                  border: detail === d ? '1px solid rgba(255,140,66,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: detail === d ? '#FF8C42' : 'rgba(255,255,255,0.55)',
                  transition: 'all 0.2s',
                  letterSpacing: 0.5,
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
            width: '100%', padding: '16px 0', borderRadius: 32,
            background: 'linear-gradient(135deg, #FF8C42 0%, #c4627a 50%, #9B8AA6 100%)',
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 400,
            cursor: 'pointer', letterSpacing: 3,
            boxShadow: '0 8px 30px rgba(255,140,66,0.2)',
            animation: 'slideUp 0.4s ease-out 0.5s backwards',
          }}
        >
          生成我的承诺卡片
        </button>
      </div>
    </div>
  );
}
