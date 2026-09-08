import { PortalRole, UserSession } from '../types';

export const UNIVERSITY_LIST: string[] = [
  '同济大学',
  '清华大学',
  '北京大学',
  '浙江大学',
  '上海交通大学',
  '华中科技大学',
  '复旦大学',
  '南京大学',
  '西安交通大学',
  '哈尔滨工业大学',
  '武汉大学',
  '中山大学',
  '电子科技大学',
  '北京航空航天大学',
  '西北工业大学',
  '华南理工大学',
  '东南大学',
  '天津大学',
  '大连理工大学',
  '中南大学',
  '重庆大学',
  '四川大学',
  '厦门大学',
  '湖南大学',
  '吉林大学',
  '中国科学技术大学',
  '北京理工大学',
  '山东大学',
];

export interface PortalPresetAccount {
  id: string;
  role: PortalRole;
  title: string;
  account: string;
  passwordHint: string;
  name: string;
  avatar: string;
  university?: string;
  college: string;
  majorOrTitle: string;
  description: string;
  projectId?: string;
  projectName?: string;
}

export const DEMO_PRESET_ACCOUNTS: Record<PortalRole, PortalPresetAccount[]> = {
  team_member: [
    {
      id: 'demo-student-1',
      role: 'team_member',
      title: '项目负责人（博士生）',
      name: '林子越',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      account: 'S20220199',
      passwordHint: '123456',
      university: '同济大学',
      college: '电子与信息工程学院',
      majorOrTitle: '光学工程 · 队长',
      description: '金奖种子《光子芯眸——新一代全固态硅光激光雷达芯片破壁者》负责人',
      projectId: 'proj-001',
      projectName: '光子芯眸——新一代全固态硅光激光雷达芯片破壁者',
    },
    {
      id: 'demo-student-2',
      role: 'team_member',
      title: '项目负责人（硕士生）',
      name: '苏静茹',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      account: 'S20230588',
      passwordHint: '123456',
      university: '浙江大学',
      college: '生命科学学院',
      majorOrTitle: '微生物学 · 队长',
      description: '红旅创业组重点项目《菌草金粮——高抗逆盐碱地微藻蛋白重构》负责人',
      projectId: 'proj-002',
      projectName: '菌草金粮——高抗逆盐碱地微藻蛋白重构与乡村振兴产业富民示范',
    },
  ],
  school_admin: [
    {
      id: 'demo-school-1',
      role: 'school_admin',
      title: '双创学院常务副院长',
      name: '陈建国',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      account: 'T20180412',
      passwordHint: 'admin888',
      university: '同济大学',
      college: '创新创业学院',
      majorOrTitle: '校级双创决策总指挥',
      description: '统筹全校82个参赛项目、初筛排期、督导闭环与金奖培育指标',
    },
    {
      id: 'demo-school-2',
      role: 'school_admin',
      title: '学院双创秘书',
      name: '周学文',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      account: 'T20201103',
      passwordHint: 'admin888',
      university: '清华大学',
      college: '电子与信息工程学院',
      majorOrTitle: '学院分管科研副院长 / 秘书',
      description: '负责分管二级学院项目遴选、答辩模拟与专家调度联络',
    },
  ],
  mentor: [
    {
      id: 'demo-mentor-1',
      role: 'mentor',
      title: '国赛资深评审 / 创投合伙人',
      name: '赵元博',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      account: 'EXP-8801',
      passwordHint: 'mentor2026',
      college: '深创投 / 国家级创新创业导师库',
      majorOrTitle: '合伙人 · 国赛金奖评委',
      description: '擅长商业逻辑重构、估值模型优化、痛点闭环验证与答辩攻防',
    },
    {
      id: 'demo-mentor-2',
      role: 'mentor',
      title: '国赛评委 / 财务风控专家',
      name: '李清照',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      account: 'EXP-8802',
      passwordHint: 'mentor2026',
      college: '资本市场合规与创投专家委员会',
      majorOrTitle: '财务合伙人 · 注册会计师',
      description: '擅长财务报表穿透审计、研发投入真实性核查与股权结构梳理',
    },
  ],
  system_admin: [
    {
      id: 'demo-admin-1',
      role: 'system_admin',
      title: '平台超级管理员',
      name: '系统总管理员',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      account: 'admin_root',
      passwordHint: 'SuperAdmin2026!',
      college: '大赛信息化决策指挥中心',
      majorOrTitle: '系统技术与规则最高架构师',
      description: '跨校数据流转、2026大赛官方规则权重配置、权限总控与系统审计',
    },
  ],
};
