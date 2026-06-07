import type { WarpType } from './colors';

export interface CorrelationEffect {
  warps: WarpType[];
  condition: 'close' | 'far' | 'cluster';
  effect: string;
  theme: string;
  patternDensity: number;
  colorShift: string;
}

export const CORRELATIONS: CorrelationEffect[] = [
  {
    warps: ['housework', 'childcare'],
    condition: 'close',
    effect: '图案变密集，颜色变暖',
    theme: '家务与育儿的"双重负担"',
    patternDensity: 1.8,
    colorShift: '#FFB347',
  },
  {
    warps: ['emotional', 'workplace'],
    condition: 'close',
    effect: '出现灰色结块',
    theme: '职场情绪劳动的隐形消耗',
    patternDensity: 1.5,
    colorShift: '#8899AA',
  },
  {
    warps: ['community'],
    condition: 'far',
    effect: '图案出现空洞',
    theme: '社区照料的"孤岛化"',
    patternDensity: 0.4,
    colorShift: '#3A5A58',
  },
  {
    warps: ['housework', 'childcare', 'emotional'],
    condition: 'cluster',
    effect: '出现警告红色',
    theme: '时间贫困的临界点',
    patternDensity: 2.5,
    colorShift: '#E74C3C',
  },
];
