import type { WarpType } from './colors';

export interface BenchmarkData {
  avg: number;
  male: number;
  source: string;
}

export const BENCHMARK: Record<WarpType, BenchmarkData> = {
  housework: { avg: 2.6, male: 0.8, source: '国家统计局 2023' },
  childcare: { avg: 1.7, male: 0.63, source: '国家统计局 2023' },
  emotional: { avg: 1.5, male: 0.5, source: '多项研究估算' },
  workplace: { avg: 1.0, male: 0.6, source: 'HBR 2023' },
  community: { avg: 0.5, male: 0.3, source: 'UN Women 估算' },
};

export const PERCENTILES: Record<WarpType, number[]> = {
  housework: [0, 1, 2, 2.6, 3.5, 5, 8],
  childcare: [0, 0.5, 1, 1.7, 2.5, 4, 8],
  emotional: [0, 0.5, 1, 1.5, 2, 3, 8],
  workplace: [0, 0.2, 0.5, 1, 1.5, 2.5, 8],
  community: [0, 0, 0.2, 0.5, 1, 2, 8],
};

export function getPercentile(value: number, type: WarpType): number {
  const thresholds = PERCENTILES[type];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) {
      const pct = Math.round((i / (thresholds.length - 1)) * 100);
      return Math.min(pct, 99);
    }
  }
  return 0;
}

export type LaborValues = Record<WarpType, number>;

export const DEFAULT_VALUES: LaborValues = {
  housework: 0,
  childcare: 0,
  emotional: 0,
  workplace: 0,
  community: 0,
};

export const SLIDER_DESCRIPTIONS: Record<WarpType, string> = {
  housework: '做饭、清洁、洗衣、采购',
  childcare: '陪伴、接送、辅导、夜间照顾',
  emotional: '安抚、调解、记住重要日子、维护关系',
  workplace: '会议记录、帮同事善后、组织团建',
  community: '邻里互助、志愿活动、照顾老人',
};

export interface CommitmentOption {
  type: 'A' | 'B' | 'C';
  title: string;
  description: string;
  details: string[];
}

export const COMMITMENTS: CommitmentOption[] = [
  {
    type: 'A',
    title: '重新分配一项劳动',
    description: '本周内，让伴侣/家人承担一项具体任务',
    details: ['做饭', '清洁', '洗衣', '接送孩子', '采购'],
  },
  {
    type: 'B',
    title: '记录我的劳动',
    description: '本月内，每天记录自己的无偿劳动时间',
    details: ['使用本工具', '备忘录', '日记'],
  },
  {
    type: 'C',
    title: '推动一个改变',
    description: '今年内，在家庭/公司/社区推动一项改变',
    details: ['家务轮值制', '弹性工时', '托育支持', '情绪劳动认知'],
  },
];

export function recommendCommitment(values: LaborValues): { type: 'A' | 'B' | 'C'; reason: string } {
  const entries = Object.entries(values) as [WarpType, number][];
  const max = entries.reduce((a, b) => (b[1] > a[1] ? b : a));

  if (max[0] === 'housework' || max[0] === 'childcare') {
    return { type: 'A', reason: `你的${max[0] === 'housework' ? '家务' : '育儿'}时间最长，从重新分配开始` };
  }
  if (max[0] === 'emotional') {
    return { type: 'B', reason: '情感劳动需要先被看见，从记录开始' };
  }
  if (max[0] === 'workplace') {
    return { type: 'C', reason: '职场隐形劳动需要制度性改变' };
  }
  return { type: 'B', reason: '从记录开始，是改变的第一步' };
}
