export type WarpType = 'housework' | 'childcare' | 'emotional' | 'workplace' | 'community';

export interface WarpColorConfig {
  id: WarpType;
  label: string;
  color: string;
  hoverColor: string;
  thickness: number;
  description: string;
}

export const WARP_COLORS: WarpColorConfig[] = [
  { id: 'housework', label: '家务劳动', color: '#FF8C42', hoverColor: '#FFB347', thickness: 4, description: '时长、价值、国别差异' },
  { id: 'childcare', label: '育儿照料', color: '#F4A4A4', hoverColor: '#FFD6D6', thickness: 3, description: '生育惩罚、时间贫困' },
  { id: 'emotional', label: '情感劳动', color: '#9B8AA6', hoverColor: '#C4B5D4', thickness: 2, description: '心理健康成本、关系维护' },
  { id: 'workplace', label: '职场隐形劳动', color: '#6B7B8C', hoverColor: '#9BA8B5', thickness: 3, description: '会议记录、情绪管理、非晋升任务' },
  { id: 'community', label: '社区照料', color: '#5C8D89', hoverColor: '#8BB8B5', thickness: 2, description: '志愿活动、邻里互助、代际支持' },
];

export const COLORS = {
  background: '#1A1A2E',
  frame: '#16213E',
  nodeDefault: 'rgba(255,255,255,0.3)',
  nodeActive: 'rgba(255,215,0,0.9)',
  warning: '#E74C3C',
  text: '#e0e0e0',
  textMuted: 'rgba(255,255,255,0.6)',
};
