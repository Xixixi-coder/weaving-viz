import type { WarpType } from './colors';

export interface DataNodeInfo {
  id: string;
  relatedWarps: WarpType[];
  content: string;
  value: string;
  source: string;
}

export const LABOR_DATA: DataNodeInfo[] = [
  { id: 'D1', relatedWarps: ['housework'], content: '全球女性每年无偿劳动价值', value: '10.8万亿美元', source: 'ILO 2019' },
  { id: 'D2', relatedWarps: ['childcare'], content: '中国女性日均育儿时间1.73小时，男性0.63小时', value: '2.7倍差距', source: '国家统计局 2023' },
  { id: 'D3', relatedWarps: ['emotional'], content: '情感劳动导致女性抑郁风险增加', value: '2.3倍', source: '多项研究综合' },
  { id: 'D4', relatedWarps: ['workplace'], content: '女性承担"办公室家务"比例', value: '76%', source: 'Harvard Business Review' },
  { id: 'D5', relatedWarps: ['community'], content: '社区照护由女性无偿提供', value: '65%', source: 'UN Women' },
  { id: 'D6', relatedWarps: ['housework', 'childcare'], content: '"双重负担"：职业女性日均总劳动时间', value: '11.5小时', source: 'OECD' },
  { id: 'D7', relatedWarps: ['childcare', 'emotional'], content: '"母职惩罚"：每生育一个孩子，女性收入下降', value: '7%', source: '学术研究' },
  { id: 'D8', relatedWarps: ['emotional', 'workplace'], content: '情绪劳动消耗等价于每年约', value: '30个工作日', source: '估算' },
  { id: 'D9', relatedWarps: ['housework', 'workplace', 'community'], content: '如果女性无偿劳动停止，全球GDP将下降', value: '13%', source: 'McKinsey' },
  { id: 'D10', relatedWarps: ['housework', 'childcare', 'emotional', 'workplace', 'community'], content: '全球仅有女性劳动被计入GDP', value: '40%', source: 'ILO' },
];
