import type { WarpType } from './colors';

export interface Story {
  id: string;
  relatedWarp: WarpType;
  title: string;
  quote: string;
  body: string;
  location: string;
}

export const STORIES: Story[] = [
  {
    id: 'S1',
    relatedWarp: 'housework',
    title: '凌晨4点的厨房',
    quote: '"每天天不亮就要起来，给一家人做好饭，再去地里。"',
    body: '中国农村留守妇女平均每天在家务劳动上花费5.2小时。当丈夫外出务工后，她们承担了几乎全部的家庭劳动——做饭、洗衣、打扫、照料老人和孩子。这些劳动从未出现在任何经济统计中。',
    location: '中国·贵州',
  },
  {
    id: 'S2',
    relatedWarp: 'childcare',
    title: '第二次轮班',
    quote: '"下班不是结束，是另一份工作的开始。"',
    body: '日本职业妈妈在结束8小时工作后，还要面对平均4小时的育儿和家务。"第二次轮班"(Second Shift) 这个概念精确描述了她们的处境：有偿工作结束，无偿工作开始。',
    location: '日本·东京',
  },
  {
    id: 'S3',
    relatedWarp: 'emotional',
    title: '微笑的成本',
    quote: '"顾客说什么我都要笑着应对，回家后脸上的肌肉都是僵的。"',
    body: '服务业中的"情绪劳动"要求女性持续展示积极情绪、管理他人感受。研究表明，长期的情绪压抑与表面扮演与更高的职业倦怠率直接相关。每一个微笑背后，都有看不见的心理代价。',
    location: '全球·服务业',
  },
  {
    id: 'S4',
    relatedWarp: 'workplace',
    title: '会议室里的咖啡',
    quote: '"是谁在订会议室、做记录、买蛋糕？总是我们。"',
    body: '在科技公司中，女性承担了大量"非晋升任务"——组织团建、做会议记录、指导新人、布置办公室。这些工作对团队运转至关重要，却从不出现在绩效评估中，也不会带来升职加薪。',
    location: '美国·硅谷',
  },
  {
    id: 'S5',
    relatedWarp: 'community',
    title: '看不见的网',
    quote: '"疫情时候，是我们这些妇女在互相照应。"',
    body: '印度达拉维贫民窟在COVID-19封锁期间，当地女性自发组织了食物分发网络、健康信息传递和儿童照料互助。这个由女性编织的社区安全网，保护了超过2000个家庭度过最艰难的时期。',
    location: '印度·孟买',
  },
];
