import { Brain, Zap, Target, Flame, Swords } from 'lucide-react';
import { ModeDef, DefenseProject, DefenseHistoryItem } from './defenseTypes';

export const MOCK_DEFENSE_PROJECTS: DefenseProject[] = [
  {
    id: 'PRJ-2026-003',
    name: '深瞳视界——工业级微米三维缺陷纳秒成像检测仪',
    track: '高教主赛道 · 研究生创意组',
    summary: '突破大光斑纳秒激光干涉测量瓶颈，打造半导体封测与动力电池超精密微米缺陷原位在线质检设备，替代国外进口垄断。',
    tags: ['当前参赛项目', '核心专利6项', '完成中试验证', '校内A类重点'],
    isCurrentProject: true
  },
  {
    id: 'p1',
    name: '碳迹云——中小企业碳排放核算与管理 SaaS 平台',
    track: '青年红色筑梦之旅赛道 / 绿色低碳',
    summary: '基于大数据分析与区块链技术，为中小企业提供一站式碳排放核算、碳资产管理与减排规划的 SaaS 服务。',
    tags: ['商业计划书已上传', '核心专利 3 项', 'A轮意向融资']
  },
  {
    id: 'p2',
    name: '智瞳守护——基于机器视觉的工地安全帽智能监测系统',
    track: '高教主赛道 / 智慧安防与人工智能',
    summary: '采用边缘计算与轻量化神经网络模型，实现建筑工地复杂场景下的工人安全帽佩戴情况实时高精度检测。',
    tags: ['演示视频已上传', '实体验证阶段', '省级金奖标杆']
  },
  {
    id: 'p3',
    name: 'NeuroLink 脑机接口辅助康复系统',
    track: '产业命题赛道 / 新一代信息技术与医工交叉',
    summary: '基于非侵入式脑电信号解码的卒中患者上肢运动功能康复外骨骼控制系统，获三甲医院临床科研验证。',
    tags: ['初创组候选', '实验室阶段', '国家级发明奖']
  }
];

export const TRAINING_MODES: ModeDef[] = [
  {
    id: 'standard',
    name: '标准答辩',
    icon: Brain,
    description: '全真还原国赛金奖争夺现场，评委自主控场与动态追问，支持配置评委席规模、风格及问答轮次。',
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe',
    text: '#4f46e5',
    tags: ['多轮对话', '动态追问', '六维评审'],
    badge: '推荐'
  },
  {
    id: 'elevator',
    name: '电梯演讲',
    icon: Zap,
    description: '限时极速结构化表达实训，提供1分钟极简版与3分钟标准版，重点锻炼高信息密度陈述与痛点提炼。',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#d97706',
    tags: ['限时表达', '结构训练', '1min/3min'],
    badge: '速通'
  },
  {
    id: 'followup',
    name: '高压追问',
    icon: Target,
    description: '评委锁定项目商业计划书或陈述中的单一逻辑薄弱点连环下钻，打破砂锅问到底，强化逻辑自洽。',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    text: '#0369a1',
    tags: ['连环追问', '逻辑深度', '承压抗击']
  },
  {
    id: 'weakness',
    name: '弱项突击',
    icon: Flame,
    description: '自动读取网评对标六维画像，定向出题针对当前最薄弱的维度（如财务测算/竞品壁垒）开展精准补短板。',
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    text: '#059669',
    tags: ['精准补短', '历史画像', '定向突击']
  },
  {
    id: 'adversarial',
    name: '对抗性演练',
    icon: Swords,
    description: '模拟挑剔型投资人与严苛国赛评委极限施压，专攻数据漏洞、大厂降维打击与知识产权归属风险。',
    color: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
    text: '#be123c',
    tags: ['极限施压', '逻辑挑刺', '心理素质'],
    badge: '硬核'
  }
];

export const RECENT_DEFENSE_HISTORY: DefenseHistoryItem[] = [
  { 
    id: 'h1', 
    modeId: 'standard', 
    modeName: '标准答辩', 
    projectId: 'PRJ-2026-003', 
    projectName: '深瞳视界——工业级微米三维缺陷纳秒成像检测仪', 
    status: '已结束', 
    stats: '得分 86 · 完成 5 轮', 
    score: 86,
    date: '今天 10:24' 
  },
  { 
    id: 'h2', 
    modeId: 'followup', 
    modeName: '高压追问', 
    projectId: 'p1', 
    projectName: '碳迹云——中小企业碳排放核算与管理 SaaS 平台', 
    status: '已结束', 
    stats: '得分 78 · 完成 3 轮', 
    score: 78,
    date: '昨天 16:40' 
  },
  { 
    id: 'h3', 
    modeId: 'elevator', 
    modeName: '电梯演讲', 
    projectId: 'p2', 
    projectName: '智瞳守护——基于机器视觉的工地安全帽智能监测系统', 
    status: '已结束', 
    stats: '得分 72 · 限时 3min', 
    score: 72,
    date: '3天前' 
  },
  { 
    id: 'h4', 
    modeId: 'adversarial', 
    modeName: '对抗性演练', 
    projectId: 'p3', 
    projectName: 'NeuroLink 脑机接口辅助康复系统', 
    status: '已结束', 
    stats: '得分 68 · 完成 4 轮', 
    score: 68,
    date: '5天前' 
  }
];

export const DIMENSION_COLORS = {
  innovation: '#6366f1',
  technical: '#0284c7',
  market: '#10b981',
  team: '#f59e0b',
  expression: '#ec4899',
  social: '#8b5cf6'
};
