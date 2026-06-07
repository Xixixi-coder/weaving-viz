import { useState, useEffect } from 'react';
import type { WarpType } from '../../data/colors';
import type { LaborValues } from '../../data/benchmark';
import { DEFAULT_VALUES } from '../../data/benchmark';
import { TimeInput } from './TimeInput';
import { ResultView } from './ResultView';
import { CommitmentSelect } from './CommitmentSelect';
import { CardExport } from './CardExport';

interface CalculatorFlowProps {
  onExit: () => void;
}

const STORAGE_KEY = 'weaving_calculator';

export function CalculatorFlow({ onExit }: CalculatorFlowProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<LaborValues>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.values) return parsed.values;
      } catch {}
    }
    return { ...DEFAULT_VALUES };
  });
  const [commitmentType, setCommitmentType] = useState<'A' | 'B' | 'C'>('A');
  const [commitmentDetail, setCommitmentDetail] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ values, commitment: { type: commitmentType, detail: commitmentDetail } }));
  }, [values, commitmentType, commitmentDetail]);

  const handleChange = (type: WarpType, value: number) => {
    setValues(prev => ({ ...prev, [type]: value }));
  };

  const handleCommitmentSelect = (type: 'A' | 'B' | 'C', detail: string) => {
    setCommitmentType(type);
    setCommitmentDetail(detail);
    setStep(3);
  };

  if (step === 0) {
    return <TimeInput values={values} onChange={handleChange} onNext={() => setStep(1)} onBack={onExit} />;
  }

  if (step === 1) {
    return (
      <ResultView
        values={values}
        onNext={() => setStep(2)}
        onBack={() => setStep(0)}
        onGenerateCard={() => setStep(3)}
      />
    );
  }

  if (step === 2) {
    return (
      <CommitmentSelect
        values={values}
        onSelect={handleCommitmentSelect}
        onBack={() => setStep(1)}
      />
    );
  }

  return (
    <CardExport
      values={values}
      commitmentType={commitmentType}
      commitmentDetail={commitmentDetail}
      onBack={() => setStep(2)}
      onDone={onExit}
    />
  );
}
